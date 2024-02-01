const express = require('express'),
        morgan = require('morgan'),
        fs = require('fs'),
        path = require('path'),
        bodyParser = require('body-parser'),
        uuid = require('uuid');
        mongoose = require('mongoose');
        Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myflixDB', { useNewUrlParser: true, useUnifiedTopology: true});

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags:'a'});

app.use(bodyParser.json());
app.use(morgan('combined', {stream: accessLogStream}));
app.use('/documentation.html', express.static('public'));

app.get('/', (req, res) => {
    res.send('Welcome to My Flix!');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

let users = [
    {
        id: 1,
        name: "Jerry",
        favoriteMovies: []
    },
    {
        id: 2,
        name: "Ashley",
        favoriteMovies: ["The Sandlot"]
    },
]

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

//Get all movies
app.get('/movies', async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//Get all users
app.get('/users', async (req, res) => {
    await Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//Get a user by username
app.get('/users/:Usernam', async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//Get JSON movie info when looking for a specific title
app.get('/movies/:Title', (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//Get JSON genre info when looking for specific genre
app.get('/genre/:Name', (req, res) => {
    Genres.findOne({ Name: req.params.Name })
        .then((genre) => {
            res.json(genre.Description);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//Get info on a director when looking for a specific director
app.get('director/:Name', (req, res) => {
    Directors.findOne({ Name: req.params.Name })
        .then((director) => {
            res.json(director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//Add a new user
app.post('/users', async (req, res) => {
    await Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + 'already exists');
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: req.body.Password,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday,
                    })
                    .then((user) => { res.status(201).json(user) })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

//Update user info
app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate(
        { Username: req.params.Username },
        {
            $set: {
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday,
            },
        },
        { new: true }, //This line makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        }
    );
});

//Add a movie to user's favorites list
app.post('/users/:Username/Movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate(
        { Username: req.params.Username },
        {
            $push: { Fav: req.params.MovieID },
        },
    )
})

//Remove a movie from user favorite list
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

   let user = users.find( user => user.id == id );

   if (user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);;
   } else {
    res.status(400).send('no such user')
   }
})

//Delete user registration
app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});