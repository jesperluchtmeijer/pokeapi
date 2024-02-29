import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index.js';
import pokemonRouter from './routes/pokemonRoute.js';

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', indexRouter);
app.use('/pokemon', pokemonRouter);




//
// const db = new Database(path.dirname(fileURLToPath(import.meta.url)) + '/../pokemon.db', {fileMustExist: true});

import {v4 as uuidv4} from 'uuid';

uuidv4();

export default app;
