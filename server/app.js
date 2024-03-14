import express from 'express';

import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index.js';
import pokemonRouter from './routes/pokemonRoute.js';
import AuthRouter from './routes/AuthRouter.js';
import passport from 'passport';
import passportConfig from './passportConfig.js';
import FavoriteRouter from './routes/FavoriteRoute.js';
import cors from 'cors'

const app = express();
passportConfig(passport);
app.use(passport.initialize());
app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', indexRouter);
app.use('/pokemon', pokemonRouter);
app.use('/auth', AuthRouter);
app.use('/favorite', FavoriteRouter);





export default app;
