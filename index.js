const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;


const express = require('express');
const morgan = require('morgan');
const app = express();

const bodyParser = require('body-parser');
const uuid = require('uuid');

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport.js');


app.use(express.static('public'));

mongoose.connect('mongodb://127.0.0.1:27017/myFlix', { useNewUrlParser: true, useUnifiedTopology: true });

/////////// Add User ////////////////
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', (req, res) => {
    Users.findOne( { Username: req.body.Username } )
    .then((user) =>{
        if(user){
            return res.status(400).send(req.body.Username + ' already exists');
        }
        else{
            Users.create({
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            })
            .then((user) => {res.status(201).json(user)})
            .catch((error) =>{
                console.error(error);
                res.status(500).send('Error: ' + error);
            })
        }
    })
    .catch((error) =>{
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username},
        {$set: {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }},
        {new: true})
        .then((updatedUser) =>{
            res.json(updatedUser);
        })
        .catch((err) =>{
            console.error(err);
            res.status(500).send('Eerror: ' + err);
        });
   
});

///////// Add Movie to User's Favorites List ////////////
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username},
        {$addToSet: {FavoriteMovies: req.params.MovieID}},
        {new: true})
        .then((updatedUser) =>{
            res.json(updatedUser);
        })
        .catch((err) =>{
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

////////// Remove User's Favorite Movie From List ////////////
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username},
        {$pull: {FavoriteMovies: req.params.MovieID}},
        {new: true})
        .then((updatedUser) =>{
            res.json(updatedUser);
        })
        .catch((err) =>{
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

////////// Delete User by Name ////////////
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndRemove({Username: req.params.Username})
    .then((user) =>{
        if(!user){
            res.status(400).send(req.params.Username + ' was not found');
        }
        else{
            res.status(200).send(req.params.Username + ' was deleted');
        }
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//////// Get All Movies ////////////
app.get('/movies', passport.authenticate('jwt', {session: false}), (req, res) =>{
    Movies.find()
    .then((movies) =>{
        return res.status(200).json(movies);
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

////// Get Movie by Title //////////
app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), (req, res) =>{
    Movies.findOne({Title: req.params.Title})
    .then((movie) =>{
        res.json(movie);
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});


////// Get Genre by Name//////////
app.get('/movies/genres/:GenreName', passport.authenticate('jwt', {session: false}), (req, res) =>{
    Movies.findOne({'Genre.Name': req.params.GenreName})
    .then((movie) =>{
        res.status(200).json(movie.Genre);
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});


//////// Get Director by Name /////////////
app.get('/movies/directors/:DirectorName', passport.authenticate('jwt', {session: false}), (req, res) =>{
    Movies.findOne({'Director.Name': req.params.DirectorName})
    .then((movie) =>{
        res.status(200).json(movie.Director);
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

///////// Get Users ///////////////
app.get('/users', passport.authenticate('jwt', {session: false}), (req, res) =>{
    Users.find()
    .then((users) =>{
        res.status(200).json(users);
    })
    .catch((error) =>{
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

///////// Get User by Name///////////////
app.get('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) =>{
    Users.findOne({Username: req.params.Username})
    .then((users) =>{
        res.json(users);
    })
    .catch((error) =>{
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

app.get('/', (req, res) =>{
    res.send("Welcome to the movie database!");
});

app.get('/documentation', (req, res) =>{
    res.sendFile(__dirname + '/public/documentation.html');
});

//////// Error Checking ////////////
app.use((err, req, res, next) =>{
    console.error(err.stack);
    req.status(500).send('Something broke!');
});

app.listen(8080, () =>{
    console.log('Your app is listening on port 8080.');
});