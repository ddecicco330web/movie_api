const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

const express = require('express');
const morgan = require('morgan');
const app = express();

const bodyParser = require('body-parser');
const uuid = require('uuid');

const { check, validationResult } = require('express-validator');

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');

const allowedOrigins = [
  'http://localhost:8080',
  'http://testsite.com',
  'http://localhost:1234',
  'https://myflix330.netlify.app',
  'http://localhost:4200',
  'https://ddecicco330web.github.io'
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log(allowedOrigins);
      console.log(origin);
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const message = `The CORS policy for this application doesn't allow access from origin ${origin}`;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    }
  })
);

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport.js');

app.use(express.static('public'));

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

/////////// Add User ////////////////
/**
 * @typedef {Object} UserResponse
 * @property {string} Username - User's username.
 * @property {string} Password - User's password.
 * @property {string} Email - User's email.
 * @property {Date} Birthday - User's birthday.
 * @property {string[]} FavoriteMovies - User's favorite movies.
 * @property {string} _id - User's ID.
 * @property {number} __v - Version.
 */

/**
 * POST METHOD
 * @function AddUser
 * @param {Object} reqBody - Request body.
 * @param {string} reqBody.Username - User's username.
 * @param {string} reqBody.Password - User's password.
 * @param {string} reqBody.Email - User's email.
 * @param {Date} reqBody.Birthday - User's birthday.
 * @returns {UserResponse} JSON response.
 * @throws {Error} If there is an error processing the request.
 * @example
 * const body = {
 *   Username: "user1",
 *   Password: "password1",
 *   Email: "user@gmail.com",
 *   Birthday: new Date('01-10-2012')
 * };
 * http.post('https://my-flix330.herokuapp.com/users', body).subscribe();
 * @example
 * Response:
 * {
 *   Username: "user1",
 *   Password: "password1",
 *   Email: "user@gmail.com",
 *   Birthday: new Date('01-10-2012')
 * };
 */

app.post(
  '/users',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non-alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid.').isEmail()
  ],
  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

/////////// Update User ///////////////
/**
 * Updates a user's information.
 * PUT METHOD
 * @function UpdateUser
 * @param {Object} user - The user object to update.
 * @param {string} user.Username - The username of the user.
 * @param {string} user.Password - The password of the user.
 * @param {string} user.Email - The email of the user.
 * @param {Date} user.Birthday - The birthday of the user.
 * @returns {Object} Updated user object.
 * @throws {Error} If the update fails for any reason.
 * @example
 * // Request:
 * const body = {
 *   Username: "user1",
 *   Password: "password1",
 *   Email: "user@gmail.com",
 *   Birthday: new Date('01-10-2012')
 * };
 * http.put('https://my-flix330.herokuapp.com/users', body).subscribe();
 * @example
 * // Response:
 * {
 *    "Username": "user1",
 *    "Password": "$2b$10$/uFrecEcYUFMwztPZ9LWyOFPfoOl70QGT8AL3Rv6HRdewouYVzbre",
 *    "Email": "user@gmail.com",
 *    "Birthday": "2012-01-10T00:00:00.000Z",
 *    "FavoriteMovies": [],
 *    "_id": "655c18aa3f535ffc84d07379",
 *    "__v": 0
 * }
 */
app.put(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non-alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid.').isEmail()
  ],
  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);

    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true }
    )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Eerror: ' + err);
      });
  }
);

///////// Add Movie to User's Favorites List ////////////
/**
 * PUT METHOD
 * @function AddFavoriteMovie
 * @param {string} Username - The username of the user.
 * @param {string} MovieID - The ID of the movie to add as a favorite.
 * @returns {Object} JSON representing the updated user.
 * {
 *    "_id": {string},
 *    "Username": {string},
 *    "Password": {string},
 *    "Email": {string},
 *    "Birthday": {Date},
 *    "FavoriteMovies": {string[]},
 *    "__v": {number}
 * }
 * @throws {Error} If the operation fails (e.g., user not found, authentication error).
 * @example
 * // Request:
 * // Add favorite movie with token authentication
 * const token = 'yourBearerToken';
 * http.post(`https://my-flix330.herokuapp.com/users/${Username}/movies/${MovieID}`, {
 *   headers: new HTTPHeaders({
 *     'Authorization': `Bearer ${token}`
 *   })
 * }).subscribe();
 * @example
 * // Response:
 * {
 *    "_id": "64a60609bdc83474346ed5b2",
 *    "Username": "ddecicco",
 *    "Password": "$2b$10$cQUawSu1eHau3ErV0zERGu52eCYuLh3qLLXPBNmklgi5MTdgM58Ru",
 *    "Email": "test1234@gmail.com",
 *    "Birthday": "2022-10-11T00:00:00.000Z",
 *    "FavoriteMovies": [
 *        "6463da46b39105895083c002",
 *        "6463dbb1b39105895083c004",
 *        "6463dd11b39105895083c007",
 *        "6463d8d3b39105895083c000",
 *        "6463c394b9650b5a67be441d"
 *    ],
 *    "__v": 0
 * }
 */
app.post(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $addToSet: { FavoriteMovies: req.params.MovieID } },
      { new: true }
    )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

////////// Remove User's Favorite Movie From List ////////////
/**
 * DELETE METHOD
 * @function RemoveFavoriteMovie
 * @param {string} Username - The username of the user.
 * @param {string} MovieID - The ID of the movie to remove from favorites.
 * @returns {Object} JSON representing the updated user after removing the favorite movie.
 * {
 *    "_id": {string},
 *    "Username": {string},
 *    "Password": {string},
 *    "Email": {string},
 *    "Birthday": {Date},
 *    "FavoriteMovies": {string[]},
 *    "__v": {number}
 * }
 * @throws {Error} If the operation fails (e.g., user not found, authentication error).
 * @example
 * // Remove favorite movie with token authentication
 * const token = 'yourBearerToken';
 * http.delete(`https://my-flix330.herokuapp.com/users/${Username}/movies/${MovieID}`, {
 *   headers: new HTTPHeaders({
 *     'Authorization': `Bearer ${token}`
 *   })
 * }).subscribe();
 * @example
 * // Example Response:
 * {
 *    "_id": "64a60609bdc83474346ed5b2",
 *    "Username": "ddecicco",
 *    "Password": "$2b$10$cQUawSu1eHau3ErV0zERGu52eCYuLh3qLLXPBNmklgi5MTdgM58Ru",
 *    "Email": "test1234@gmail.com",
 *    "Birthday": "2022-10-11T00:00:00.000Z",
 *    "FavoriteMovies": [
 *        "6463da46b39105895083c002",
 *        "6463dbb1b39105895083c004",
 *        "6463dd11b39105895083c007",
 *        "6463d8d3b39105895083c000",
 *        "6463c394b9650b5a67be441d"
 *    ],
 *    "__v": 0
 * }
 */
app.delete(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true }
    )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

////////// Delete User by Name ////////////
/**
 * DELETE METHOD
 * @function DeleteUser
 * @param {string} Username - The username of the user to be deleted.
 * @returns {string} A success message indicating the deletion.
 * @throws {Error} If the operation fails (e.g., user not found, authentication error).
 * @example
 * // Request:
 * // Delete user with token authentication
 * const token = 'yourBearerToken';
 * http.delete(`https://my-flix330.herokuapp.com/users/${Username}`, {
 *   headers: new HTTPHeaders({
 *     'Authorization': `Bearer ${token}`
 *   })
 * }).subscribe();
 * @example
 * // Response:
 * 'user1 was deleted'
 */
app.delete(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//////// Get All Movies ////////////
/**
 * Retrieves a list of all movies.
 * GET Method
 * @function GetAllMovies
 * @param {string} token - The authentication token.
 * @returns {JSON[]} - A list of movie objects.
 * @throws {Error} If an error occurs during the request.
 *
 * @example
 * // Request:
 * http.get('https://my-flix330.herokuapp.com/movies', {
 *   headers: new HTTPHeaders({
 *     'Bearer ' + token
 *   })
 * }).subscribe();
 *
 * @example
 * // Response:
 * [{
 *   "_id": "6463d8d3b39105895083c000",
 *   "Title": "Neon Genesis Evangelion: The End of Evangelion",
 *   "Description": "Concurrent theatrical ending of the TV series Neon Genesis Evangelion (1995).",
 *   "Genre": { "Name": "Action", "Description": "Action film is a film genre..." },
 *   "Director": [{ "Name": "Hideaki Anno", "Bio": "...", "BirthYear": "1960", "ImagePath": "..."}],
 *   "ImagePath": "https://m.media-amazon.com/images/I/510XMKV4TDL._AC_UF894,1000_QL80_.jpg",
 *   "Rating": [8.1],
 *   "ReleaseYear": ["1997"],
 *   "TrailerPath": "https://www.youtube.com/embed/Y9cXQfLdGfQ",
 *   "Actors": [
 *     {"Name": "Megumi Ogata", "Bio": "...", "BirthYear": "1965", "Role": "Shinji Ikari(voice)", "ImagePath": "..."},
 *     {"Name": "Megumi Hayashibara", "Bio": "...", "BirthYear": "1967", "Role": "Rei Ayanami(voice)", "ImagePath": "..."},
 *     {"Name": "Yuko Miyamura", "Bio": "...", "BirthYear": "1972", "Role": "Asuka Langley Sôryû(voice)", "ImagePath": "..."}
 *   ]
 * }]
 */
app.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        return res.status(200).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

////// Get Movie by Title //////////
/**
 * Retrieves a movie by its title.
 * GET METHOD
 * @function GetMovieByTitle
 * @param {string} Title - The title of the movie.
 * @param {string} token - The authentication token.
 * @returns {JSON} - A movie object.
 * @throws {Error} If an error occurs during the request.
 *
 * @example
 * // Request:
 * http.get('https://my-flix330.herokuapp.com/movies/' + Title, {
 *   headers: new HTTPHeaders({
 *     'Bearer ' + token
 *   })
 * }).subscribe();
 *
 * @example
 * // Response:
 * {
 *   "_id": "6463d8d3b39105895083c000",
 *   "Title": "Neon Genesis Evangelion: The End of Evangelion",
 *   "Description": "Concurrent theatrical ending of the TV series Neon Genesis Evangelion (1995).",
 *   "Genre": { "Name": "Action", "Description": "Action film is a film genre..." },
 *   "Director": [{ "Name": "Hideaki Anno", "Bio": "...", "BirthYear": "1960", "ImagePath": "..."}],
 *   // ... (rest of the movie object properties)
 * }
 */
app.get(
  '/movies/:Title',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

////// Get Genre by Name//////////
/**
 * Retrieves genre information by name.
 * GET METHOD
 * @function GetGenreByName
 * @param {string} GenreName - The name of the genre.
 * @param {string} token - The authentication token.
 * @returns {JSON} - Genre information.
 * @throws {Error} If an error occurs during the request.
 *
 * @example
 * // Request:
 * http.get('https://my-flix330.herokuapp.com/genres/' + GenreName, {
 *   headers: new HTTPHeaders({
 *     'Bearer ' + token
 *   })
 * }).subscribe();
 *
 * @example
 * // Response:
 * {
 *   "Name": "Drama",
 *   "Description": "In film and television, drama is a category or genre of narrative fiction intended to be more serious than humorous in tone."
 * }
 */
app.get(
  '/movies/genres/:GenreName',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.GenreName })
      .then((movie) => {
        res.status(200).json(movie.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//////// Get Director by Name /////////////
/**
 * Retrieves director information by name.
 * GET METHOD
 * @function GetDirectorByName
 * @param {string} DirectorName - The name of the director.
 * @param {string} token - The authentication token.
 * @returns {JSON[]} - Director information.
 * @throws {Error} If an error occurs during the request.
 *
 * @example
 * // Example Request:
 * http.get('https://my-flix330.herokuapp.com/directors/' + DirectorName, {
 *   headers: new HTTPHeaders({
 *     'Bearer ' + token
 *   })
 * }).subscribe();
 *
 * @example
 * // Example Response:
 * [
 *   {
 *     "Name": "Christopher Nolan",
 *     "Bio": "Best known for his cerebral, often nonlinear storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England.",
 *     "BirthYear": "1970",
 *     "ImagePath": "https://m.media-amazon.com/images/M/MV5BNjE3NDQyOTYyMV5BMl5BanBnXkFtZTcwODcyODU2Mw@@._V1_FMjpg_UX1000_.jpg"
 *   }
 * ]
 */
app.get(
  '/movies/directors/:DirectorName',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.DirectorName })
      .then((movie) => {
        res.status(200).json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

///////// Get User by Name///////////////
/**
 * Retrieves user information by username.
 * GET METHOD
 * @function GetUserByName
 * @param {string} Username - The username of the user.
 * @param {string} token - The authentication token.
 * @returns {JSON} - User information.
 * @throws {Error} If an error occurs during the request.
 *
 * @example
 * // Example Request:
 * http.get('https://my-flix330.herokuapp.com/users/' + Username, {
 *   headers: new HTTPHeaders({
 *     'Bearer ' + token
 *   })
 * }).subscribe();
 *
 * @example
 * // Example Response:
 * {
 *   "_id": "655bc065fff5f0d93e2098af",
 *   "Username": "testuser1",
 *   "Password": "$2b$10$EaL3sv9o0zgKgU7ct.UbC.MbSPXcLSlfjFO54ppcKCGWQ2FY.yXYq",
 *   "Email": "ddecicco330@gmail.com",
 *   "Birthday": "1990-03-30T00:00:00.000Z",
 *   "FavoriteMovies": [],
 *   "__v": 0
 * }
 */
app.get(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((users) => {
        res.json(users);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

app.get('/', (req, res) => {
  res.send('Welcome to the movie database!');
});

app.get('/documentation', (req, res) => {
  res.sendFile(__dirname + '/public/documentation.html');
});

//////// Error Checking ////////////
app.use((err, req, res, next) => {
  console.error(err.stack);
  req.status(500).send('Something broke!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Your app is listening on port ' + port);
});
