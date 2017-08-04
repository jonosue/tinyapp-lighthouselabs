// REQUIREMENTS

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

const app = express();

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

const port = process.env.PORT || 8080;


// FUNCTIONS AND OBJECTS

function generateRandomString() {
  let randomString = '';
  const characterList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let x = 0; x < 6; x += 1) {
    randomString += characterList.charAt(Math.floor(Math.random() * characterList.length));
  }
  return randomString;
};

function emailDupeChecker(emailCheck) {
  let emailExists = false;
  for (let x in users) {
    if (users[x]['email'] == emailCheck.trim()) {
      emailExists = true;
      break;
    }
  }
  return emailExists;
};

const urlDatabase = {
  "b2xVn2": {
    shortURL: "b2xVn2",
    longURL: "http://www.lighthouselabs.ca",
    userID: "wutang"
  },
  "9sm5xK": {
    shortURL: "9sm5xK",
    longURL: "http://www.google.com",
    userID: "yrnatl"
  },
};

const users = {
  "yrnatl": {
    id: "yrnatl",
    email: "migos@yungrichnation.com",
    password: "trap-funk"
  },
 "wutang": {
    id: "wutang",
    email: "36chambers@wutangclan.com",
    password: "da-mystery-of-chessboxin"
  }
}

// METHODS

app.get("/", (req, res) => {
  res.redirect('/urls/new');
});

app.get("/register", (req, res) => {
  let templateVars = { vars: {
                        user_id: req.cookies["user_id"],
                        user: users
                      }
                     }
  res.render('register', templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = { vars: {
                        user_id: req.cookies["user_id"],
                        user: users
                        }
                      }
  if (req.cookies["user_id"]) {
    res.redirect('/urls/')
  }
  else {
    res.render('login', templateVars);
  }
});

app.post("/register", (req, res) => {
  const emailDuplicate = emailDupeChecker(req.body.email);
  if (emailDuplicate) {
    res.sendStatus(400);
  }
  else {
    if (req.body.email && req.body.password) {
      let userID = generateRandomString();
      users[userID] = {
        id: userID,
        email: req.body.email,
        password: req.body.password
      };
      res.cookie("user_id", userID);
      res.redirect("/urls");
    }
    else {
      res.sendStatus(400);
    }
  }
});

app.get("/u/:shortURL", (req, res) => {
  fullURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(fullURL);
});


app.get("/urls/new", (req, res) => {
  let templateVars = { vars: {
                        user_id: req.cookies["user_id"],
                        user: users
                        }
                      }
  if (req.cookies["user_id"]) {
    res.render("urls_new", templateVars);
  }
  else {
    res.redirect("/register");
  }
});

app.post("/urls/:id/delete", (req, res) => {
  if (urlDatabase[req.params.id].userID == req.cookies["user_id"]) {
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  }
  else {
    res.redirect("/urls");
  }
});

app.post("/urls", (req, res) => {
  let randomShort = generateRandomString();
  urlDatabase[randomShort] = {
    shortURL: randomShort,
    longURL: req.body.longURL,
    userID: req.cookies["user_id"]
  }
  res.redirect('http://localhost:8080/urls/' + String(randomShort)) ;
});

app.post("/login", (req, res) => {
  let userEmail = "";
  let userPass = "";

  for (let x in users) {
    if (users[x]['email'] == req.body.email && users[x]['password'] == req.body.password) {
      userEmail = req.body.email;
      userPass = req.body.password;
      res.cookie("user_id", users[x]["id"]);
    }
  }

  if (userEmail.length > 0 && userPass.length > 0) {
    res.redirect('/');
  }
  else {
    res.sendStatus(403);
  }

});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect('/urls');
});

app.get("/urls", (req, res) => {
  let templateVars = { vars: {
                        urls: urlDatabase,
                        user_id: req.cookies["user_id"],
                        user: users
                      }
                     }
    if (req.cookies["user_id"]) {
    res.render("urls_index", templateVars);
    }
    else {
    res.redirect("/register");
    }
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { vars: {
                        shortURL: req.params.id,
                        fullURL: urlDatabase[req.params.id].longURL,
                        user_id: req.cookies["user_id"],
                        user: users
                        }
                      };
  if (urlDatabase[req.params.id].userID == req.cookies["user_id"] && urlDatabase[req.params.id]) {
    res.render("urls_show", templateVars);
  }
  else {
    res.redirect("/urls/new");
  }

});

app.post("/urls/:id/", (req, res) => {
  let templateVars = { urls: {
                        shortURL: req.params.id,
                        fullURL: urlDatabase[req.params.id].longURL,
                        user: users,
                        user_id: req.cookies["user_id"]
                        }
                      }
  if (req.body.newURL.length > 0 && req.cookies["user_id"]) {
    urlDatabase[req.params.id].longURL = req.body.newURL;
    res.redirect("/urls");
  }
  else {
    res.redirect("/urls");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});