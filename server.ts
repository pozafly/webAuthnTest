import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!11');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

console.log('hi');
console.log('hi4');