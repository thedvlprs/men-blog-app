const express = require('express');

const app = new express();
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const expressSession = require('express-session');
const flash = require('connect-flash-plus');

const newPostController = require('./controllers/newPost');
const homeController = require('./controllers/home');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const logoutController = require('./controllers/logout');

const validateMiddleware = require('./middleware/validationMiddleware');
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');

let port = process.env.PORT;
if (port == null || port == '') {
    port = 4000;
}

app.use(fileUpload());

mongoose.connect(
    'mongodb+srv://<admin>:<password>@<mLab-cluster-name>.tjqjs.mongodb.net/<db_name>',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }
);

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(
    expressSession({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true,
        // cookie: { maxAge: 6000 },
    })
);

app.use(flash());

global.loggedIn = null;

app.use('*', (req, res, next) => {
    loggedIn = req.session.userId;
    next();
});

app.use('/posts/store', validateMiddleware);

app.get('/posts/new', authMiddleware, newPostController);
app.get('/', homeController);
app.get('/post/:id', getPostController);
app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController);
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController);
app.get('/auth/logout', logoutController);
app.post('/posts/store', storePostController);
app.post(
    '/users/register',
    redirectIfAuthenticatedMiddleware,
    storeUserController
);
app.post(
    '/users/login',
    redirectIfAuthenticatedMiddleware,
    loginUserController
);
app.use((req, res) => res.render('notfound'));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`App listening on port 🔥`);
});
