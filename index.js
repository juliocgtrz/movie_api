const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags:'a'});

let movies = [
    {
        title: 'The Sandlot',
        description: 'In the summer of 1962, a new kid in town is taken under the wing of a young baseball prodigy and his rowdy team, resulting in many adventures.',
        genre: {
            name: 'Comedy',
            description: 'A drama of light and amusing character and typically with a happy ending.'
        },
        director: {
        name: 'David Mickey Evans',
        bio: 'David Mickey Evans was born on October 20, 1962 in Wilkes Barre, Pennsylvania, USA. He is a director and writer, known for The Sandlot (1993), Untitled Sandlot Prequel and Radio Flyer (1992).',
        birth: '1962'
        },
        imageURL: 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/6C12E7878CF4642CE13C3DF5E64D6584802F1363ABE86BCBEFCA297B239B2E24/scale?width=1200&aspectRatio=1.78&format=jpeg',
        featured: false
    },
    {
        title: 'A League of Their Own',
        description: 'Two sisters join the first female professional baseball league and struggle to help it succeed amid their own growing rivalry.',
        genre: {
            name: 'Comedy',
            description: 'A drama of light and amusing character and typically with a happy ending.'
        },
        director: {
            name: 'Penny Marshall',
            bio: 'Penny Marshall was born Carole Penny Marshall on October 15, 1943 in Manhattan. She was the daughter of Marjorie (Ward), a tap dance teacher, and Anthony Marshall, an industrial film director. She was the younger sister of filmmakers Garry Marshall and Ronny Hallin.',
            birth: '1943'
        },
        imageURL: 'https://m.media-amazon.com/images/M/MV5BNjQ1NTQyYjktZDc5My00NDA1LWI1NmItY2ViNjQ0NDk4NmRjXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg',
        featured: false
    },
    {
        title: 'Bull Durham',
        description: 'A fan who has an affair with one minor-league baseball player each season meets an up-and-coming pitcher and the experienced catcher assigned to him.',
        genre: {
            name: 'Comedy',
            description: 'A drama of light and amusing character and typically with a happy ending.'
        },
        director: {
            name: 'Ron Shelton',
            bio: 'Ron Shelton was born on 15 September 1945 in Whittier, California, USA. He is a writer and director, known for Bull Durham (1988), Hollywood Homicide (2003) and White Men Cant Jump (1992). He has been married to Lolita Davidovich since 1997. They have one child.',
            birth: '1945'
        },
        imageURL: 'https://m.media-amazon.com/images/M/MV5BMzMxMDEzMWUtZDk3NS00MWRiLWJjOGMtN2Q0ZjVhZjU3ODhkXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg',
        featured: false
    },
    {
        title: 'Angels in the Outfield',
        description: 'When a boy prays for a chance to have a family if the California Angels win the pennant, angels are assigned to make that possible.',
        genre: {
            name: 'Comedy',
            description: 'A drama of light and amusing character and typically with a happy ending.'
        },
        director: {
            name: 'William Dear',
            bio: 'William Dear was born on November 30, 1944 in Toronto, Ontario, Canada. He is a director and writer, known for Harry and the Hendersons (1987), The Rocketeer (1991) and Timerider: The Adventure of Lyle Swann (1982).',
            birth: '1944'
        },
        imageURL: 'https://m.media-amazon.com/images/M/MV5BZDE1MWU1ZDQtOTg3YS00MTEwLTkxNjItMDQzY2UxMThjYmZkXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
        featured: false
    },
    {
        title: 'Field of Dreams',
        description: 'Iowa farmer Ray Kinsella is inspired by a voice he cant ignore to pursue a dream he can hardly believe. Supported by his wife, Ray begins the quest by turning his ordinary cornfield into a place where dreams can come true.',
        genre: {
            name: 'Drama',
            description: 'A movie or television production with characteristics (such as conflict) of a serious play'
        },
        director: {
            name: 'Phil Alden Robinson',
            bio: 'Phil Alden Robinson was born on 1 March 1950 in Long Beach, Long Island, New York, USA. He is a writer and director, known for Field of Dreams (1989), Sneakers (1992) and The Sum of All Fears (2002). He has been married to Paulette Bartlett since 26 September 2009.',
            birth: '1950'
        },
        imageURL: 'https://m.media-amazon.com/images/M/MV5BNzk5OWY0YjAtYWU3ZS00Y2Q4LWFlNjItMzgwMTQ2MjIyMDFmL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
        featured: false
    },
];

app.use(morgan('combined', {stream: accessLogStream}));
app.use('/documentation.html', express.static('public'));

app.get('/movies', (req, res) => {
    res.json(movies);
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
