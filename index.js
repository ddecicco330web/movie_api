const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('common'));

let topMovies = [
    {
        title : 'Forest Gump',
        director : 'Robert Zemeckis'
    },
    {
        title : 'Batman: The Dark Knight',
        director : 'Christopher Nolan'
    },
    {
        title : 'The Godfather',
        director : 'Francis Ford Coppola'
    },
    {
        title : 'Step Brothers',
        director : 'Adam McKay'
    },
    {
        title : 'The End of Evangelion',
        director : 'Hideaki Anno'
    },
    {
        title : 'Shrek 2',
        director : 'Andrew Adamson'
    },
    {
        title : 'Avengers: Infinity War',
        director : 'Anthony and Joe Russo'
    },
    {
        title : 'The Handmaiden',
        director : 'Park Chan-wook'
    },
    {
        title : 'Fight Club',
        director : 'David Fincher'
    },
    {
        title : 'The Thing',
        director : 'John Carpenter'
    }
];

app.use('/documentation', express.static('public/documentation.html'));

app.get('/movies', (req, res) =>{
    res.json(topMovies);
});

app.get('/', (req, res) =>{
    res.send("Welcome to the movie database!");
});

app.use((err, req, res, next) =>{
    console.error(err.stack);
    req.status(500).send('Something broke!');
});

app.listen(8080, () =>{
    console.log('Your app is listening on port 8080.');
});