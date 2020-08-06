const mongoose = require('mongoose');
const BlogPost = require('./models/BlogPost');

const url = 'mongodb://127.0.0.1:27017/my_database';

mongoose.connect(url, {
    useNewUrlParser: true,
});

const db = mongoose.connection;
db.once('open', (_) => {
    console.log('Database connected:', url);
});

db.on('error', (err) => {
    console.log('connection error:', err);
});

BlogPost.create(
    {
        title: 'Test Post',
        body: 'This is just a test',
        username: 'Lazy Daisy',
        datePosted: new Date(),
    },
    (error, blogpost) => {
        console.log(error, blogpost);
    }
);
