const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");

const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.redirect('/urls/new');
});

app.get("/u/:shortURL", (req, res) => {
  longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  var randomShort = generateRandomString();
  urlDatabase[randomShort] = req.body.longURL;
  res.redirect('http://localhost:8080/urls/' + String(randomShort)) ;
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { urls: {
                       shortURL: req.params.id,
                       fullURL: urlDatabase[req.params.id]
                      }
                     }
  if (urlDatabase[req.params.id]) {
    res.render("urls_show", templateVars);
  }
  else {
    res.render("urls_new");
  }
});

app.post("/urls/:id/", (req, res) => {
  let templateVars = { urls: {
                       shortURL: req.params.id,
                       fullURL: urlDatabase[req.params.id]
                      }
                     }
  if (req.body.newURL.length > 0) {
    urlDatabase[req.params.id] = req.body.newURL;
    res.redirect("/urls");
  }
  else {
    res.redirect("/urls");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// FUNCTIONS
function generateRandomString() {
  let randomString = '';
  const characterList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let x = 0; x < 6; x += 1) {
    randomString += characterList.charAt(Math.floor(Math.random() * characterList.length));
  }
  return randomString;
};