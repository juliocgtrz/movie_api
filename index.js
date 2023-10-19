const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags:'a'});

// let topTenMovies = [
//     {
//         title: 'The Sandlot',
//         director: 'David Mickey Evans'
//     },
//     {
//         title: 'A League of Their Own',
//         director: 'Penny Marshall'
//     },
//     {
//         title: 'Bull Durham',
//         director: 'Ron Shelton'
//     },
//     {
//         title: 'Major League',
//         director: 'David S. Ward'
//     },
//     {
//         title: 'The Bad News Bears',
//         director: 'Michael Ritchie'
//     },
//     {
//         title: 'Rookie of the Year',
//         director: 'Daniel Stern'
//     },
//     {
//         title: 'Angels in the Outfield',
//         director: 'William Dear'
//     },
//     {
//         title: 'Field of Dreams',
//         director: 'Phil Alden Robinson'
//     },
//     {
//         title: 'Fever Pitch',
//         director: 'Bobby Farrelly'
//     },
//     {
//         title: '42',
//         director: 'Brian Helgeland'
//     },   
// ];

app.use(morgan('combined', {stream: accessLogStream}));
app.use('/documentation.html', express.static('public'));

app.get('/movies', (req, res) => {
    res.json(topTenMovies);
});

app.get('/', (req, res) => {
    res.send('Welcome to My Flix!');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});

//Get a list of all movies
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
})

//Get data about a single movie by title


//Get data about a genre by genre's name


//Get data about a director by director's name


//Add a new user


//Update user info


//Add a movie to user favorite list


//Remove a movie from user favorite list


//Delete user registration
