const express = require('express');
const request = require('superagent');
const cookieSession = require('cookie-session');

const app = express();

const client_id = process.env.Client_ID;
const client_secret = process.env.Client_Secret;
const cookie_secret = process.env.Cookie_Secret;

app.use((req, res, next) => {
  console.log('method :', req.method, 'url :', req.url);
  next();
});

app.use(cookieSession({ secret: cookie_secret }));
app.use(express.static('public'));

app.get('/login', (req, res) => {
  console.log(req.session.isNew);
  // console.log(req.session);
  const redirect_uri = 'http://localhost:8000/user/auth';
  const url = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}`;
  res.redirect(url);
});

const getAccessToken = async function (code) {
  return await request
    .post('https://github.com/login/oauth/access_token')
    .send({ client_id, client_secret, code })
    .set('Accept', 'application/json')
    .then((result) => result.body)
    .then((data) => data.access_token);
};

const getUserData = async function (token) {
  return await request
    .get('https://api.github.com/user')
    .set('User-Agent', 'git-oauth-hydra')
    .set('Authorization', `token ${token}`)
    .then((result) => result.body);
};

app.get('/user/auth', async (req, res) => {
  console.log(req.session.isNew);

  const code = req.query.code;
  const token = await getAccessToken(code);
  const data = await getUserData(token);
  req.session.id = data.id;
  req.session.token = token;

  res.send(data);
});

app.get('/admin', (req, res) => {
  console.log(req.session.isNew);
  if (req.session.id == 58026024) {
    res.send('hello rivu');
  } else {
    console.log(req.session.id);

    res.send('i dont know you');
  }
});

app.get('/hello', (req, res) => {
  console.log(req.session.isNew);
  req.session.view = 1;
  res.send('hello');
});

const main = function () {
  const port = process.env.PORT;
  app.listen(port, () => console.log('listening to port', port));
};

main();
