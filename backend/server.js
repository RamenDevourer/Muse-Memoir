import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import { PORT, mongoDBURL } from './config.js';
import mongoose from 'mongoose';
import {Notes} from './models/notes.js';
import {Auth} from './models/auth.js';
import notesRoute from './routes/notesRoute.js';
import authRoute from './routes/authRoute.js';
import blogRoute from './routes/blogsRoute.js';
import cors from 'cors';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'https://muse-memoir.vercel.app/'
}));


mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log(`connected to mongoDB database`);
        app.listen(PORT, () => {
            console.log(`conncted to port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
});

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
};

app.use('/notes', notesRoute);

app.use('/auth', authRoute);

app.use('/blog', blogRoute);