
const express = require("express");
const session = require("express-session");
const path = require('path');
const app = express();

const users = [];
let counttrue = 0;
let countfalse = 0;


app.use(session({
    secret: "applicationmadebyloaikhalidmaklad202415yearsold",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.post("/register", async (req, res) => {
    try {
        if (!req.body.email.includes("@") || req.body.email.indexOf("@") < 2) {
            res.render("register.ejs",{msg : "Incorrect Email ."})
            
        }else{

        

            users.push({
                email: req.body.email,
                c: null
            });

            req.session.isauthed = true;
            req.session.email = req.body.email;



            console.log(users);
            res.redirect("/");
        }
    } catch (e) {
        console.log(e);
    }
});

app.get("/", (req, res) => {
   
    if (req.session.isauthed === true) {
       
        countfalse ,counttrue =0
        res.render("index.ejs", { counttrue, countfalse });
    } else {
        res.redirect("/register");
    }
});

app.post("/", async (req, res) => {
    if (req.session.isauthed === true) {
        const email = req.session.email;
        const user = users.find(u => u.email === email);

        if (user && user.c ==null) {
            user.c = req.body.choice;

            if (req.body.choice == "true") {
                counttrue += 1;
            } else if (req.body.choice == "false") {
                countfalse += 1;
            }
            console.log(`Updated user: ${JSON.stringify(user)}`);
            
        }else if(user.c == req.body.choice){
            console.log("error 1")
            counttrue = counttrue
            countfalse = countfalse

        }else if(user.c !== req.body.choice && req.body.choice !== null){
            console.log("error 2")
            console.log(user.c , req.body.choice)
            if(user.c == "true"){
                user.c = "false"
                countfalse +=1 
                if (counttrue !==0){
                    counttrue -=1
                }
            }else if(user.c =="false"){
                user.c = "true"
                if (countfalse !==0){
                    countfalse -=1
                }
                counttrue +=1 
            }
        }

        console.log(counttrue, countfalse);
        res.render("index.ejs", { counttrue, countfalse });
    } else {
        res.redirect("/register");
    }
});

app.get("/register", (req, res) => {
    if (req.session.isauthed === true) {
        res.redirect("/");
    } else {
        res.render("register.ejs");
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
