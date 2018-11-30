const express = require('express');
const cors = require('cors');
const { json } = require('body-parser');
const session = require('express-session');

const app = express();

// TOP LEVEL MIDDLEWARE

app.use(cors());

app.use(json());

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "sdfhtr5t4rwedsvfbgnhjuyk756u45tre",
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));

app.use((req, res, next) => {
    console.log("SESSION");
    console.log(req.session);
    console.log("BODY");
    console.log(req.body);
    next();
});

// REQUEST LEVEL MIDDLEWARE

const requireAuthentication = (req, res, next) => {
    if (!req.session.user) {
        res.status(401).json("not logged in");
    } else {
        next();
    }
};

// ENDPOINTS

app.get('/', (req, res) => {
    res.status(200).send(req.session);
});

app.post('/login', (req, res) => {
    const {
        body: {
            username,
            password,
        }
    } = req;
    req.session.user = {
        username,
        password,
        items: [],
    };
    res.status(200).send(req.body);
});

app.post('/logout', (req, res) => {
    delete req.session.user;
    res.status(200).json("logged out");
});

app.post('/items', requireAuthentication, (req, res) => {
    const {
        body: {
            item
        },
        session: {
            user
        }
    } = req;
    user.items.push(item);
    res.status(200).send(user);
});

app.listen(8080, () => console.log('listening on 8080'));
