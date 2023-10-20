const express = require('express'),
        morgan = require('morgan'),
        fs = require('fs'),
        path = require('path'),
        bodyParser = require('body-parser'),
        uuid = require('uuid');

const app = express();

app.use(bodyParser.json());
app.use(morgan('combined', {stream: accessLogStream}));
app.use('/documentation.html', express.static('public'));
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags:'a'});

app.get('/', (req, res) => {
    res.send('Welcome to My Flix!');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});



let movies = [
    {
        Title: 'The Sandlot',
        Description: 'In the summer of 1962, a new kid in town is taken under the wing of a young baseball prodigy and his rowdy team, resulting in many adventures.',
        Genre: {
            Name: 'Comedy',
            Description: 'A drama of light and amusing character and typically with a happy ending.'
        },
        Director: {
            Name: 'David Mickey Evans',
            Bio: 'David Mickey Evans was born on October 20, 1962 in Wilkes Barre, Pennsylvania, USA. He is a director and writer, known for The Sandlot (1993), Untitled Sandlot Prequel and Radio Flyer (1992).',
            Birth: '1962'
        },
        ImageURL: 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/6C12E7878CF4642CE13C3DF5E64D6584802F1363ABE86BCBEFCA297B239B2E24/scale?width=1200&aspectRatio=1.78&format=jpeg',
        Featured: false
    },
    {
        Title: 'A League of Their Own',
        Description: 'Two sisters join the first female professional baseball league and struggle to help it succeed amid their own growing rivalry.',
        Genre: {
            Name: 'Comedy',
            Description: 'A drama of light and amusing character and typically with a happy ending.'
        },
        Director: {
            Name: 'Penny Marshall',
            Bio: 'Penny Marshall was born Carole Penny Marshall on October 15, 1943 in Manhattan. She was the daughter of Marjorie (Ward), a tap dance teacher, and Anthony Marshall, an industrial film director. She was the younger sister of filmmakers Garry Marshall and Ronny Hallin.',
            Birth: '1943'
        },
        ImageURL: 'https://m.media-amazon.com/images/M/MV5BNjQ1NTQyYjktZDc5My00NDA1LWI1NmItY2ViNjQ0NDk4NmRjXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg',
        Featured: false
    },
    {
        Title: 'Bull Durham',
        Description: 'A fan who has an affair with one minor-league baseball player each season meets an up-and-coming pitcher and the experienced catcher assigned to him.',
        Genre: {
            Name: 'Comedy',
            Description: 'A drama of light and amusing character and typically with a happy ending.'
        },
        Director: {
            Name: 'Ron Shelton',
            Bio: 'Ron Shelton was born on 15 September 1945 in Whittier, California, USA. He is a writer and director, known for Bull Durham (1988), Hollywood Homicide (2003) and White Men Cant Jump (1992). He has been married to Lolita Davidovich since 1997. They have one child.',
            Birth: '1945'
        },
        ImageURL: 'https://m.media-amazon.com/images/M/MV5BMzMxMDEzMWUtZDk3NS00MWRiLWJjOGMtN2Q0ZjVhZjU3ODhkXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg',
        Featured: false
    },
    {
        Title: 'Angels in the Outfield',
        Description: 'When a boy prays for a chance to have a family if the California Angels win the pennant, angels are assigned to make that possible.',
        Genre: {
            Name: 'Comedy',
            Description: 'A drama of light and amusing character and typically with a happy ending.'
        },
        Director: {
            Name: 'William Dear',
            Bio: 'William Dear was born on November 30, 1944 in Toronto, Ontario, Canada. He is a director and writer, known for Harry and the Hendersons (1987), The Rocketeer (1991) and Timerider: The Adventure of Lyle Swann (1982).',
            Birth: '1944'
        },
        ImageURL: 'https://m.media-amazon.com/images/M/MV5BZDE1MWU1ZDQtOTg3YS00MTEwLTkxNjItMDQzY2UxMThjYmZkXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
        Featured: false
    },
    {
        Title: 'Field of Dreams',
        Description: 'Iowa farmer Ray Kinsella is inspired by a voice he cant ignore to pursue a dream he can hardly believe. Supported by his wife, Ray begins the quest by turning his ordinary cornfield into a place where dreams can come true.',
        Genre: {
            Name: 'Drama',
            Description: 'A movie or television production with characteristics (such as conflict) of a serious play'
        },
        Director: {
            Name: 'Phil Alden Robinson',
            Bio: 'Phil Alden Robinson was born on 1 March 1950 in Long Beach, Long Island, New York, USA. He is a writer and director, known for Field of Dreams (1989), Sneakers (1992) and The Sum of All Fears (2002). He has been married to Paulette Bartlett since 26 September 2009.',
            Birth: '1950'
        },
        ImageURL: 'https://m.media-amazon.com/images/M/MV5BNzk5OWY0YjAtYWU3ZS00Y2Q4LWFlNjItMzgwMTQ2MjIyMDFmL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
        Featured: false
    },
];

//Get a list of all movies
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
})

//Get data about a single movie by title
app.get('/movies/:Title', (req, res) => {
    const { Title } = req.params;
    const movie = movies.find( movie => movie.Title === Title );

    if (movie) {
        res.status(200).json(movie);
    }else{
        res.status(400).send('no such movie')
    }
})

//Get data about a genre by genre's name
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

    if (genre) {
        res.status(200).json(genre);
    }else{
        res.status(400).send('no such genre')
    }
});

//Get data about a director by director's name
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.Director.Name === directorName ).Director;

    if (director) {
        res.status(200).json(director);
    }else{
        res.status(400).send('no such director')
    }
});

//Add a new user
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    }else{
        res.status(400).send('users need names')
    }
})

//Update user info


//Add a movie to user favorite list


//Remove a movie from user favorite list


//Delete user registration


app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});