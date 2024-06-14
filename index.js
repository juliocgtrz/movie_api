const express = require('express'),
        morgan = require('morgan'),
        fs = require('fs'),
        path = require('path'),
        bodyParser = require('body-parser'),
        uuid = require('uuid'),
        mongoose = require('mongoose'), //Mongoose for interacting with MongoDB
        Models = require('./models.js'), //Import custom data models
        {check, validationResult} = require('express-validator'); //Import express-validator library

const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect('mongodb://localhost:27017/myflixDB', { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true});

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags:'a'});
const cors = require('cors'); //Code to use CORS within myFlix
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234', 'http://localhost:1234/', 'https://myflix-baseball.netlify.app', 'http://localhost:4200'];

app.use(cors({
    origin: (origin, callback) => {
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){ //If a specific origin isn't found on the list of allowed origins
            let message = 'The CORS policy for this application doesn\'t allow access from origin ' + origin;
            return callback(new Error(message ), false);
        }
        return callback(null, true);
    }
}));
// app.options('*', cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let auth = require('./auth.js')(app);
const passport = require('passport');
require('./passport.js');
app.use(morgan('combined', {stream: accessLogStream}));
app.use('/documentation.html', express.static('public'));

app.get('/', (req, res) => {
    res.send('Welcome to My Flix!');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

/**
 * Handle GET requests to access all movies
 * 
 * @function
 * @name getAllMovies
 * @param {Object} req - Express request object
 * @param {Object} res - Exrpess response object
 * @returns {Promise<void>} - A Promise that resolves when the movie request process is complete
 * @throws {Error} - If there is an unexpected error during the process or if permission is denied
 * @returns {Object} [] allMovies - The array of all movies in the database
 * 
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * Handle GET requests to access all users
 * 
 * @function
 * @name getAllUsers
 * @param {Object} req - Express request object
 * @param {Object} res - Exrpess response object
 * @returns {Promise<void>} - A Promise that resolves when the user request process is complete
 * @throws {Error} - If there is an unexpected error during the process or if permission is denied
 * @returns {Object} [] allUsers - The array of all users in the database
 * 
 */
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

/**
 * Handle GET requests to access for a specific user
 *
 * @function
 * @name getUser
 * @param {Object} req - Express request object with parameter: Username
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - A Promise that resolves when the user request process is complete
 * @throws {Error} - If there is an unexpected error during the process or if permission is denied
 * @returns {Object} reqUser - The object containing the data for the requested movie
 * 
 */
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * Handle GET requests to access for a specific movie
 *
 * @function
 * @name getMovie
 * @param {Object} req - Express request object with parameter: Title (movie title)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - A Promise that resolves when the movie request process is complete
 * @throws {Error} - If there is an unexpected error during the process or if permission is denied
 * @returns {Object} reqMovie - The object containing the data for the requested movie
 * 
 */
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * Handle GET requests to access for a specific genre
 *
 * @function
 * @name getGenre
 * @param {Object} req - Express request object with parameter: genreName (genre name)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - A Promise that resolves when the genre request process is complete
 * @throws {Error} - If there is an unexpected error during the process or if permission is denied
 * @returns {Object} reqGenre - The object containing the data for the requested genre
 * 
 */
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ 'Genre.Name': req.params.genreName })
        .then((movie) => {
            res.status(200).json(movie.Genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * Handle GET requests to access for a specific director
 *
 * @function
 * @name getDirector
 * @param {Object} req - Express request object with parameter: directorName (director name)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - A Promise that resolves when the director request process is complete
 * @throws {Error} - If there is an unexpected error during the process or if permission is denied
 * @returns {Object} reqDirector - The object containing the data for the requested director
 * 
 */
app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ 'Director.Name': req.params.directorName })
        .then((movie) => {
            res.status(200).json(movie.Director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * Handle POST requests to add a new user
 *
 * @function
 * @name addUser
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - A Promise that resolves when the user creation process is complete
 * @throws {Error} - If there is an unexpected error during the user creation process
 * @returns {Object} newUser - The newly created user object. Sent in the response on success
 * 
 */
app.post('/users', 
    //Validation logic here for request
    //you can either use a chain of methods like .not().isEmpty()
    //which means "opposite of isEmpty" in plain english "is not empty"
    //or use .isLength({min: 5}) which means minimum value of 5 characters are only allowed
    [
        check('Username', 'Username must be a minimum of 5 characters').isLength({min: 5}),
        check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], async (req, res) => {

    //check the validation object for errors
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username }) //Search to see if a user with the requested username already exists
        .then((user) => {
            if (user) {
            //If the user is found, send a response that it already exists    
                return res.status(400).send(req.body.Username + ' already exists');
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday,
                    })
                    .then((user) => { res.status(201).json(user) })
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
});

/**
 * Handle PUT requests to update user information
 *
 * @function
 * @name updateUser
 * @param {Object} req - Express request object with parameters: Username
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - A Promise that resolves when the user update process is complete
 * @throws {Error} - If there is an unexpected error during the process or if permission is denied
 * @fires {Object} updatedUser - The updated user object sent in the response on success
 * @description
 *   Expects at least one updatable field (username, password, email, birthday) in the request body
 * 
 */
app.put('/users/:Username', 
    [
        check('Username', 'Username is required').notEmpty(),
        check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
        check('Password', 'Password is required').notEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], passport.authenticate('jwt', { session: false }), async (req, res) => {

        //check the validation object for errors
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
    //Condition to check username in the request body matches the one in the request parameter
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    //Condition ends
    await Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
        }
    },
    { new: true }) //This line makes sure that the updated document is returned
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    })
});

/**
 * Handle POST requests to add a movie to a user's favorites
 *
 * @function
 * @name addFavoriteMovie
 * @param {Object} req - Express request object with parameters: Username, MovieId (movie ID)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - A Promise that resolves when the movie addition process is complete
 * @throws {Error} - If there is an unexpected error during the process or if permission is denied
 * @returns {Object} updatedUser - The updated user object (including the added movie) sent in the response on success
 * 
 */
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username },
    { $push: { FavoriteMovies: req.params.MovieID } },
    { new: true }) //This line makes sure that the updated document is returned
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

/**
 * Handle DELETE requests to remove a movie from a user's favorites
 *
 * @function
 * @name removeFavoriteMovie
 * @param {Object} req - Express request object with parameters: Username, MovieId (movie ID)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - A Promise that resolves when the movie removal process is complete
 * @throws {Error} - If there is an unexpected error during the process or if permission is denied
 * @fires {Object} updatedUser - The updated user object (after removing the movie) sent in the response on success
 * 
 */
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: { FavoriteMovies: req.params.MovieID }
    },
    { new: true }) //This line makes sure that the updated document is returned
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

/**
 * Handle DELETE requests to delete a user
 *
 * @function
 * @name deleteUser
 * @param {Object} req - Express request object with parameters: Username
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - A Promise that resolves when the user deletion process is complete
 * @throws {Error} - If there is an unexpected error during the process or if permission is denied
 * @fires {string} message - A message indicating the result of the user deletion process
 * 
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    //Condition to check username in the request body matches the one in the request parameter
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    //Condition ends
    await Users.findOneAndDelete({ Username: req.params.Username })
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

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});