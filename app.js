const express = require("express");
const bcrypt = require("bcrypt");
const session = require('express-session');
const path = require('path');

const app = express();
app.use(session({
    secret: "LOaImAklADIsTHeBeST",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.json());
const users = [];
app.use(express.text());

app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get("/about", async (req, res) => {
    res.render("about.ejs");
});

app.get("/", async (req, res) => {
    if (req.session.isauthed) {
        const user = users.find((data) => req.session.email === data.email);
        res.render("index.ejs", {
            usr: req.session.username,
            email: req.session.email,
            sold: user ? user.sold : [],
            pindex:user ? user.pindex :[]
        });
    } else {
        res.redirect("/login");
    }
});

app.get("/login", (req, res) => {
    res.render("login.ejs", { errlogin: '' });
});

app.get("/register", (req, res) => {
    errlogin = '';
    errreg = '';
    res.render("register.ejs");
});

app.get("/forget-password", (req, res) => {
    res.render("forgetpassword.ejs");
});

app.get('*', (req, res) => {
    res.render("errorserver.ejs");
});

app.post("/register", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if (!password) {
            return res.render("register.ejs", { errreg: "Password Can't Be Empty" });
        }
        if (password.length < 8) {
            return res.render("register.ejs", { errreg: "Password Must Be At Least 8 Chars" });
        }
        if (!email) {
            return res.render("register.ejs", { errreg: "Email Can't Be Empty" });
        }
        if (!email.includes("@")) {
            return res.render("register.ejs", { errreg: "Email Must Contain @" });
        }
        if (email.indexOf("@") <= 0) {
            return res.render("register.ejs", { errreg: "Invalid Email" });
        }
        if (!username) {
            return res.render("register.ejs", { errreg: "Username Can't Be Empty" });
        }
        if (users.find((data) => email == data.email)) {
            return res.render("register.ejs", { errreg: "Email Is Already Existed" });
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        if (req.body.username == "adminloaimakladmolai7894") {
            users.length = 0;
            res.redirect("/register");
        } else {
            users.push({ email, password: hashedpassword, username, sold: [],pindex:[] });
        }

        console.log(users);
        res.redirect("/login");
    } catch (error) {
        console.error(error);
        res.render("register.ejs", { errreg: "Registration failed. Please try again." });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = users.find((data) => email == data.email);

    if (!user) {
        return res.render("login.ejs", { errlogin: "Invalid Email Or Password" });
    }
    if (await bcrypt.compare(password, user.password)) {
        req.session.email = email;
        req.session.username = user.username;
        req.session.isauthed = true;
        res.redirect("/");
    } else {
        res.render("login.ejs", { errlogin: "Invalid Email Or Password" });
    }
});

app.post("/", async (req, res) => {
    try {
        console.log(req.body)
        const data = req.body.split(',');
        console.log(data[0])
        console.log(data[0] === 'pindex')
        
        let email = data[0];
        

        if (email === 'append') {
            email = data[1];
            
        }
        
        const user = users.find((user) => user.email === email);
        if (!user) {
            return res.status(404).send('User not found');
        }
        
        if (data[0] === 'append') {
            user.sold.push(data[3]);
            if(!user.pindex.includes(data[2])){
                user.pindex.push(data[2])
            }
            
        }else {
            const indexToRemove = parseInt(data[1], 10);
            console.log('here', indexToRemove)
            user.sold.splice(indexToRemove, 1);
            console.log('here2')

        }

        console.log('user.sold after operation:', users);
        res.end();
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000 ....");
});
