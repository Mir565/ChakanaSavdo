const express = require("express")
const app = express()
const PORT = process.env.PORT || 1515
require('dotenv').config()
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { checker } = require("./middleware/checkaccess");
const FileStore = require("session-file-store")(session)

// session
require("./set.global")
app.use(cookieParser(process.env.SESSION));
app.use(session({
    secret: process.env.SESSION,
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
        path: "/tmp/sessions/",
        useAsync: true
    }),
    cookie: { maxAge: 3600000, secure: false, httpOnly: false }
}))


// post data json 
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// public file 
app.use(express.static('public'))

app.set('view engine', 'ejs');

// app.use("/", require("./app/app"))
app.use('/',require('./routes/sell'))
app.use('/',require('./routes/userapply'))
app.use('/',require('./routes/userlogin'))
app.use('/',require('./routes/dashboard'))
app.use('/',require('./routes/items'))
app.use('/',checker,require('./routes/organization'))
app.use('/',require('./routes/tranzactions'))
app.use('/',require('./routes/magazins'))
app.use('/',require('./routes/exit'))
app.use('/',require('./routes/rol'))
app.use('/',require('./routes/calc'))
// server yoqish 
app.listen(PORT, () => {
    console.log("Create Server " + PORT)
})