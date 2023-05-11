const express = require('express');
const morgan = require('morgan');
const app = express();

const bodyParser = require('body-parser');
const uuid = require('uuid');

app.use(morgan('common'));
app.use(bodyParser.json());

let movies = [
    {
        title : 'Forrest Gump',
        director : {
            name : 'Robert Zemeckis',
            bio : 'A whiz-kid with special effects, Robert is from the Spielberg camp of film-making (Steven Spielberg produced many of his films). Usually working with writing partner Bob Gale, Robert\'s earlier films show he has a talent for zany comedy (Romancing the Stone (1984), 1941 (1979)) and special effect vehicles (Who Framed Roger Rabbit (1988) and Back to the Future (1985)). His later films have become more serious, with the hugely successful Tom Hanks vehicle Forrest Gump (1994) and the Jodie Foster film Contact (1997), both critically acclaimed movies. Again, these films incorporate stunning effects. Robert has proved he can work a serious story around great effects.',
            birth : '1952',
            death : ''
        },
        description : 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.',
        genre : {
            name : 'Drama',
            description : 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
        },
        imageURL : 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
        featured : false
    },
    {
        title : 'The Dark Knight',
        director : {
            name : 'Christopher Nolan',
            bio : 'Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England. Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made.',
            birth : '1970',
            death : ''
        },
        description : 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        genre : {
            name : 'Action',
            description : 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
        },
        imageURL : 'https://resizing.flixster.com/WAHXGKleT3QvhqHUlFGIRgcQAjU=/206x305/v2/https://flxt.tmsimg.com/assets/p173378_p_v8_au.jpg',
        featured : false
    },
    {
        title : 'The Godfather',
        director : {
            name : 'Francis Ford Coppola',
            bio : 'Francis Ford Coppola is an American film director, producer, and screenwriter. He is considered one of the major figures of the New Hollywood filmmaking movement of the 1960s and 1970s. Coppola is the recipient of five Academy Awards, six Golden Globe Awards, two Palmes d\'Or and a British Academy Film Award (BAFTA).',
            birth : '1939',
            death : ''
        },
        description : 'Don Vito Corleone, head of a mafia family, decides to hand over his empire to his youngest son Michael. However, his decision unintentionally puts the lives of his loved ones in grave danger.',
        genre : {
            name : 'Drama',
            description : 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
        },
        imageURL : 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
        featured : false
    },
    {
        title : 'Step Brothers',
        director : {
            name : 'Adam McKay',
            bio : 'Adam McKay (born April 17, 1968) is an American screenwriter, director, comedian, and actor. McKay has a comedy partnership with Will Ferrell, with whom he co-wrote the films Anchorman, Talladega Nights, and The Other Guys. Ferrell and McKay also founded their comedy website Funny or Die through their production company Gary Sanchez Productions. He has been married to Shira Piven since 1999. They have two children.',
            birth : '1968',
            death : ''
        },
        description : 'Two aimless middle-aged losers still living at home are forced against their will to become roommates when their parents marry.',
        genre : {
            name : 'Comedy',
            description : 'Comedy is a genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter.'
        },
        imageURL : 'https://m.media-amazon.com/images/M/MV5BODViZDg3ZjYtMzhiYS00YTVkLTk4MzktYWUxMTlkYjc1NjdlXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
        featured : false
    },
    {
        title : 'Neon Genesis Evangelion: The End of Evangelion',
        director : {
            name : 'Hideaki Anno',
            bio : 'Hideaki Anno was born on May 22, 1960 in Ube, Japan. He is a director and writer, known for Shin Godzilla (2016), Evangelion: 1.0 You Are (Not) Alone (2007) and The Wind Rises (2013). He has been married to Moyoco Anno since March 26, 2002.',
            birth : '1960',
            death : ''
        },
        description : 'Concurrent theatrical ending of the TV series Neon Genesis Evangelion (1995).',
        genre : {
            name : 'Action',
            description : 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
        },
        imageURL : 'https://m.media-amazon.com/images/I/510XMKV4TDL._AC_UF894,1000_QL80_.jpg',
        featured : false
    },
    {
        title : 'Shrek 2',
        director : {
            name : 'Andrew Adamson',
            bio : 'Comedy is a genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter.',
            birth : '1966',
            death : ''
        },
        description : 'Shrek and Fiona travel to the Kingdom of Far Far Away, where Fiona\'s parents are King and Queen, to celebrate their marriage. When they arrive, they find they are not as welcome as they thought they would be.',
        genre : {
            name : 'Comedy',
            description : 'Comedy is a genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter.'
        },
        imageURL : 'https://m.media-amazon.com/images/I/71HQiOZsZ6L._AC_UF894,1000_QL80_.jpg',
        featured : false
    },
    {
        title : 'Avengers: Infinity War',
        director : {
            name : 'Anthony Russo',
            bio : 'Anthony J. Russo is an American filmmaker and producer who works alongside his brother Joseph Russo. They have directed You, Me and Dupree, Cherry and the Marvel films Captain America: The Winter Soldier, Captain America: Civil War, Avengers: Infinity War and Avengers: Endgame. Endgame is one of the highest grossing films of all time.',
            birth : '1970',
            death : ''
        },
        description : 'The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation and ruin puts an end to the universe.',
        genre : {
            name : 'Action',
            description : 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
        },
        imageURL : 'https://m.media-amazon.com/images/M/MV5BNzg2NWY4MTMtZDQwNS00Y2JhLTkyMDYtNjIxYTI3ZDQwZWUwXkEyXkFqcGdeQXVyMjIxMzU3Njc@._V1_FMjpg_UX1000_.jpg',
        featured : false
    },
    {
        title : 'The Handmaiden',
        director : {
            name : 'Park Chan-wook',
            bio : 'Park Chan-wook was born on August 23, 1963 in Seoul, South Korea. He is a producer and director, known for The Handmaiden (2016), Oldboy (2003) and Thirst (2009). He is married to Eun-hee Kim. They have one child.',
            birth : '1963',
            death : ''
        },
        description : 'A woman is hired as a handmaiden to a Japanese heiress, but secretly she is involved in a plot to defraud her.',
        genre : {
            name : 'Drama',
            description : 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
        },
        imageURL : 'https://resizing.flixster.com/S8CiQDU3DUuoU2LOh2Zq5iOnaBE=/300x300/v2/https://flxt.tmsimg.com/assets/p13122320_k_v10_ab.jpg',
        featured : false
    },
    {
        title : 'Fight Club',
        director : {
            name : 'David Fincher',
            bio : 'David Fincher was born in 1962 in Denver, Colorado, and was raised in Marin County, California. When he was 18 years old he went to work for John Korty at Korty Films in Mill Valley. He subsequently worked at ILM (Industrial Light and Magic) from 1981-1983. Fincher left ILM to direct TV commercials and music videos after signing with N. Lee Lacy in Hollywood. He went on to found Propaganda in 1987 with fellow directors Dominic Sena, Greg Gold and Nigel Dick. Fincher has directed TV commercials for clients that include Nike, Coca-Cola, Budweiser, Heineken, Pepsi, Levi\'s, Converse, AT&T and Chanel. He has directed music videos for Madonna, Sting, The Rolling Stones, Michael Jackson, Aerosmith, George Michael, Iggy Pop, The Wallflowers, Billy Idol, Steve Winwood, The Motels and, most recently, A Perfect Circle.',
            birth : '1962',
            death : ''
        },
        description : 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
        genre : {
            name : 'Drama',
            description : 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
        },
        imageURL : 'https://resizing.flixster.com/0kbkzWG-fGf5yEZSmLw4VB_SpnQ=/206x305/v2/https://flxt.tmsimg.com/assets/p23069_p_v8_aa.jpg',
        featured : false
    },
    {
        title : 'The Thing',
        director : {
            name : 'John Carpenter',
            bio : 'John Howard Carpenter was born in Carthage, New York, to mother Milton Jean (Carter) and father Howard Ralph Carpenter. His family moved to Bowling Green, Kentucky, where his father, a professor, was head of the music department at Western Kentucky University. He attended Western Kentucky University and then USC film school in Los Angeles. He began making short films in 1962, and won an Academy Award for Best Live-Action Short Subject in 1970, for The Resurrection of Broncho Billy (1970), which he made while at USC. Carpenter formed a band in the mid-1970s called The Coupe de Villes, which included future directors Tommy Lee Wallace and Nick Castle. Since the 1970s, he has had numerous roles in the film industry including writer, actor, composer, producer, and director. After directing Dark Star (1974), he has helmed both classic horror films like Halloween (1978), The Fog (1980), and The Thing (1982), and noted sci-fi tales like Escape from New York (1981) and Starman (1984).',
            birth : '1948',
            death : ''
        },
        description : 'A research team in Antarctica is hunted by a shape-shifting alien that assumes the appearance of its victims.',
        genre : {
            name : 'Horror',
            description : 'Horror is a genre of fiction whose purpose is to create feelings of fear, dread, repulsion, and terror in the audience.'
        },
        imageURL : 'https://m.media-amazon.com/images/M/MV5BNGViZWZmM2EtNGYzZi00ZDAyLTk3ODMtNzIyZTBjN2Y1NmM1XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg',
        featured : false
    }
];

let users = [
    {
        id : 1,
        username : 'ddecicco330',
        email : 'ddecicco330@gmail.com',
        favoriteMovies : [
            'Zombieland'
        ]
    }
];

app.use(express.static('public'));

/////////// Add User ////////////////
app.post('/users', (req, res) => {
    const newUser = req.body;

    if(newUser.username){
        newUser.favoriteMovies = [];
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    }
    else{
        res.status(400).send('Needs a valid username.')
    }
});

///////// Update Username ////////////
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id == id);

    if(user){
        user.username = updatedUser.username;
        res.status(200).json(user);
    }
    else{
        res.status(400).send('No such user');
    }
});

///////// Add Movie to User's Favorites List ////////////
app.post('/users/:id/:title', (req, res) => {
    const { id, title } = req.params;

    let user = users.find(user => user.id == id);

    if(user){
        user.favoriteMovies.push(title);
        res.status(200).send(`${title} added to user ${id} favorites.`);
    }
    else{
        res.status(400).send('No such user');
    }
});

////////// Remove User's Favorite Movie From List ////////////
app.delete('/users/:id/:title', (req, res) => {
    const { id, title } = req.params;

    let user = users.find(user => user.id == id);

    if(user){
        user.favoriteMovies = user.favoriteMovies.filter(movieTitle => movieTitle !== title);
        res.status(200).send(`${title} removed from user ${id} favorites.`);
    }
    else{
        res.status(400).send('No such user');
    }
});

////////// Deregister User's e-Mail ////////////
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find(user => user.id == id);

    if(user){
        users = users.filter(user => user.id != id);
        res.status(200).send(`User ${id} has been deleted.`);
    }
    else{
        res.status(400).send('No such user');
    }
});

//////// Get All Movies ////////////
app.get('/movies', (req, res) =>{
    res.status(200).json(movies);
});

////// Get Movie by Title //////////
app.get('/movies/:title', (req, res) =>{
    const { title } = req.params;
    const movie = movies.find(movie => movie.title === title);

    if(movie){
        res.status(200).json(movie);
    }
    else{
        res.status(400).send('No such movie.');
    }
});


////// Get Genre by Name//////////
app.get('/movies/genres/:genreName', (req, res) =>{
    const { genreName } = req.params;
    const movie = movies.find(movie => movie.genre.name === genreName);

    if(movie){
        const genre = movie.genre;

        if(genre){
            res.status(200).json(genre);
            return;
        }
    }

    res.status(400).send('No such genre.');
});


//////// Get Director by Name /////////////
app.get('/movies/directors/:directorName', (req, res) =>{
    const { directorName } = req.params;
    const movie = movies.find(movie => movie.director.name === directorName);

    if(movie){
        const director = movie.director;

        if(director){
            res.status(200).json(director);
            return;
        }
    }

    res.status(400).send('No such director.');
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