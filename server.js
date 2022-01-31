import dotenv from 'dotenv';
import express, { json, urlencoded } from 'express';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(json());
app.use(urlencoded());

app.get('/', (req, res) => {
  res.send('Fullstack React Course Express Server');
});

app.post('/name', (req, res) => {
  if (req.body.name) {
    return res.json({ name: req.body.name });
  } else {
    return res.status(400).json({ error: 'no name provided' });
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
