import dotenv from 'dotenv';
import express, { json, urlencoded } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

// import routes
import authRoute from './routes/auth.js';
import ToDosRoute from './routes/todos.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongo = process.env.MONGO_URI;

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api', (req, res) => {
  res.send('Fullstack React Course Express Server');
});

app.use('/api/auth', authRoute);
app.use('/api/todos', ToDosRoute);

mongoose
  .connect(mongo)
  .then(() => {
    console.log('connected to database');

    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });
  })
  .catch(error => {
    console.log(error);
  });
