const express = require('express');
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags:'a'});

let topTenMovies = [
    {
        title: 'The Sandlot',
        director: 'David Mickey Evans'
    },
    {
        title: 'A League of Their Own',
        director: 'Penny Marshall'
    },
    {
        title: 'Bull Durham',
        director: 'Ron Shelton'
    },
    {
        title: 'Major League',
        director: 'David S. Ward'
    },
    {
        title: 'The Bad News Bears',
        director: 'Michael Ritchie'
    },
    {
        title: 'Rookie of the Year',
        director: 'Daniel Stern'
    },
    {
        title: 'Angels in the Outfield',
        director: 'William Dear'
    },
    {
        title: 'Field of Dreams',
        director: 'Phil Alden Robinson'
    },
    {
        title: 'Fever Pitch',
        director: 'Bobby Farrelly'
    },
    {
        title: '42',
        director: 'Brian Helgeland'
    },   
];

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