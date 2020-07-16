const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log('method :', req.method, 'url :', req.url);
  next();
});

app.get('/', (req, res) => res.send('hello'));
app.get('/auth', (req, res) => {
  console.log(req.headers);

  res.send('ok you have authenticate');
});
const main = function () {
  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log('listening to port', port));
};

main();
