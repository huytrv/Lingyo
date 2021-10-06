require("dotenv").config()
const express = require("express")
const session = require("express-session")
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require("body-parser")
const sequelize = require("sequelize")
const passport = require("passport")
const facebookStrategy = require("passport-facebook").Strategy
const googleStrategy = require("passport-google-oauth2").Strategy
const morgan = require("morgan")
const moment = require("moment")
const socketio = require("socket.io")
const mysqlConfig = require("./config/mysqlConfig.js")
const paypal = require("paypal-rest-sdk")
const homeController = require("./controllers/homeController")
const signupController = require("./controllers/signupController")
const loginController = require("./controllers/loginController")
const forgotController = require("./controllers/forgotController")
const updateController = require("./controllers/updateController.js")

const app = express();

function FBLogin(){
    passport.use(new facebookStrategy({
        clientID: "2671130773138286",
        clientSecret: "199ef7c41209b16d275cabe262123ab0",
        callbackURL:"https://fodance.com/facebook/callback",
        profileFields: ["id", "displayName", "name", "picture.type(large)", "email"]
    },
    function(token, refreshToken, profile, done){
        function getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
        users.findOne({
            where: {
                facebookId: profile.id
            }
        }).then(function(u){
            if (!u){
                const uid = getRndInteger(1000000000, 10000000000)
                if (profile.emails){facebookEmail = profile.emails[0].value}
                else {facebookEmail = null}
                users.create({ 
                    userId: uid,
                    email: null,
                    phone: null,
                    username: profile.displayName,
                    password: null,
                    facebookEmail: facebookEmail,
                    facebookId: profile.id,
                    googleEmail: null,
                    googleId: null
                }).then(function(user){
                    function generateProfile(){
                        const ran = getRndInteger(10000000, 100000000)
                        const nickname = profile.displayName.replace(/[^a-zA-Z0-9_]/g, "") + ran
                        userProfile.findOne({
                            where: {
                                nickname: nickname
                            }
                        }).then(function(p){
                            if (!p){
                                userProfile.create({ 
                                    userId: user.userId,
                                    nickname: nickname,
                                    avatar: profile.photos[0].value,
                                    cover: "default-cover.png",
                                    followers: 0,
                                    following: 0,
                                    points: 0,
                                    stars: 0,
                                    tickets: 0,
                                    rank1: 0,
                                    rank2: 0,
                                    rank3: 0,
                                    rank10: 0,
                                    winner: [],
                                    saved: [],
                                    notice: [],
                                    followNotification: true,
                                    voteFollowNotification: true,
                                    postFollowNotification: true,
                                }).then(function(){
                                    return done(null, user)
                                })
                            }
                            else {
                                generateProfile()
                            }
                        })
                    }
                    generateProfile()
                })
            }
            else {
                return done(null, u)
            }
        })
    }))
}

function GGLogin(){
    passport.use(new googleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        passReqToCallback: true
    }, function(request, accessToken, refreshToken, profile, done){
        function getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
        users.findOne({
            where: {
                googleId: profile.id
            }
        }).then(function(u){
            if (!u){
                const uid = getRndInteger(1000000000, 10000000000)
                users.create({ 
                    userId: uid,
                    email: null,
                    phone: null,
                    username: profile.displayName,
                    password: null,
                    facebookEmail: null,
                    facebookId: null,
                    googleEmail: profile.emails[0].value,
                    googleId: profile.id
                }).then(function(user){
                    function generateProfile(){
                        const ran = getRndInteger(10000000, 100000000)
                        const nickname = profile.displayName.replace(/[^a-zA-Z0-9_]/g, "") + ran
                        userProfile.findOne({
                            where: {
                                nickname: nickname
                            }
                        }).then(function(p){
                            if (!p){
                                userProfile.create({ 
                                    userId: user.userId,
                                    nickname: nickname,
                                    avatar: profile.photos[0].value,
                                    cover: "default-cover.png",
                                    followers: 0,
                                    following: 0,
                                    points: 0,
                                    stars: 0,
                                    tickets: 0,
                                    rank1: 0,
                                    rank2: 0,
                                    rank3: 0,
                                    rank10: 0,
                                    winner: [],
                                    saved: [],
                                    notice: [],
                                    followNotification: true,
                                    voteFollowNotification: true,
                                    postFollowNotification: true,
                                }).then(function(){
                                    return done(null, user)
                                })
                            }
                            else {
                                generateProfile()
                            }
                        })
                    }
                    generateProfile()
                })
            }
            else {
                return done(null, u)
            }
        })
    }))
}

paypal.configure({
    "mode": "live",
    "client_id": process.env.PAYPAL_CLIENT_ID,
    "client_secret": process.env.PAYPAL_CLIENT_SECRET
})

app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
    next()
})

//mysqlSql cau hinh ket noi
const mysqlDB = new sequelize({
    database: "fodance",
    username: mysqlConfig.getMysqlUsername(),
    password: mysqlConfig.getMysqlPassword(),
    host: "127.0.0.1",
    port: 3306,
    dialect: "mysql",
    dialectOptions: {
        ssl: false
    },
    define: {
        freezeTableName: true
    },
    logging: false
})

//xac thuc mysqlql, xac nhan ket noi
mysqlDB.authenticate()

//tao bang nguoi dung
const users = mysqlDB.define("users", {
    userId: {
        type: sequelize.BIGINT,
        primaryKey: true
    },
    email: sequelize.STRING(100),
    phone: sequelize.STRING(100),
    username: sequelize.STRING(50),
    password: sequelize.STRING(128),
    facebookEmail: sequelize.STRING(100),
    facebookId: sequelize.STRING(100),
    googleEmail: sequelize.STRING(100),
    googleId: sequelize.STRING(100),
    role: sequelize.STRING(100)
})

//tao bang email
const emailRegister = mysqlDB.define("emailRegister", {
    email: sequelize.STRING,
    lastReqTime: sequelize.DATE,
    blocked: sequelize.BOOLEAN,
    reqCount: sequelize.INTEGER,
    code: sequelize.STRING,
})

//tao bang phone
const phoneRegister = mysqlDB.define("phoneRegister", {
    ip: sequelize.STRING,
    phone: sequelize.STRING,
    lastReqTime: sequelize.DATE,
    blocked: sequelize.BOOLEAN,
    reqCount: sequelize.INTEGER,
    code: sequelize.STRING,
})

//tao bang forgot password
const forgotPasswordToken = mysqlDB.define("forgotPasswordToken", {
    ip: sequelize.STRING,
    email: sequelize.STRING,
    token: sequelize.STRING,
    expires: sequelize.DATE,
    lastReqTime: sequelize.DATE,
    blocked: sequelize.BOOLEAN,
    reqCount: sequelize.INTEGER,
})

const forgotPasswordCode = mysqlDB.define("forgotPasswordCode", {
    ip: sequelize.STRING,
    phone: sequelize.STRING,
    code: sequelize.STRING,
    expires: sequelize.DATE,
    lastReqTime: sequelize.DATE,
    blocked: sequelize.BOOLEAN,
    reqCount: sequelize.INTEGER
})

const userProfile = mysqlDB.define("userProfile", {
    avatar: sequelize.STRING(1000),
    cover: sequelize.STRING(1000),
    nickname: sequelize.STRING(50),
    description: sequelize.STRING(200),
    birthday: sequelize.DATEONLY,
    location: sequelize.STRING(150),
    followers: sequelize.INTEGER,
    following: sequelize.INTEGER,
    points: sequelize.FLOAT,
    usd: sequelize.FLOAT,
    tickets: sequelize.INTEGER,
    rank1: sequelize.INTEGER,
    rank2: sequelize.INTEGER,
    rank3: sequelize.INTEGER,
    rank10: sequelize.INTEGER,
    winner: sequelize.JSON,
    notice: sequelize.JSON,
    followNotification: sequelize.BOOLEAN,
    voteFollowNotification: sequelize.BOOLEAN,
    postFollowNotification: sequelize.BOOLEAN,
    posts: sequelize.INTEGER,
    starStatus: sequelize.BOOLEAN,
    new: sequelize.BOOLEAN,
    auth: sequelize.BOOLEAN
})

const follow = mysqlDB.define("follow",{
    user1: sequelize.BIGINT,
    user2: sequelize.BIGINT,
})

const posts = mysqlDB.define("posts", {
    postId: {
        type: sequelize.BIGINT,
        primaryKey: true
    },
    description: sequelize.STRING(1500),
    file: sequelize.JSON,
    time: sequelize.DATE,
    like: sequelize.INTEGER,
    comment: sequelize.INTEGER,
    share: sequelize.INTEGER,
    category: sequelize.STRING,
    rank: sequelize.STRING,
    competition: sequelize.BOOLEAN,
    videoViews: sequelize.INTEGER,
    videoImpressions: sequelize.INTEGER,
    auth: sequelize.BOOLEAN
})

const postLikes = mysqlDB.define("postlikes", {
    userId: sequelize.BIGINT,
})

const comments = mysqlDB.define("comments", {
    cmtId: {
        type: sequelize.BIGINT,
        primaryKey: true
    },
    user: sequelize.BIGINT,
    tag: sequelize.STRING(),
    content: sequelize.STRING(1500),
    like: sequelize.INTEGER,
    time: sequelize.DATE,
    reply: sequelize.STRING
})

const commentLikes = mysqlDB.define("commentlikes", {
    userId: sequelize.BIGINT,
})

const voteWinners = mysqlDB.define("votewinners", {
    round: sequelize.STRING,
    rank: sequelize.STRING,
    category: sequelize.STRING,
    userId: sequelize.BIGINT
})

const notifications = mysqlDB.define("notifications", {
    sourceUser: sequelize.BIGINT,
    postInfo: sequelize.JSON,
    type: sequelize.STRING,
    read: sequelize.BOOLEAN,
    time: sequelize.DATE,
})

const addTopic = mysqlDB.define("addtopic", {
    topic: sequelize.STRING(100),
})

const feedback = mysqlDB.define("feedback", {
    feedback: sequelize.STRING(1500),
})

const report = mysqlDB.define("report", {
    obj: sequelize.BIGINT,
    content: sequelize.STRING(1500),
    type: sequelize.STRING
})

const postSaved = mysqlDB.define("postsaved", {
    postId: sequelize.BIGINT,
    time: sequelize.DATE,
})

const cardNumber = mysqlDB.define("cardnumber", {
    card: sequelize.BIGINT,
    name: sequelize.STRING,
})

const reward = mysqlDB.define("reward", {
    round: sequelize.INTEGER,
    category: sequelize.STRING,
    rank: sequelize.STRING,
    post: sequelize.INTEGER
})

const userAuth = mysqlDB.define("userauth", {
    face: sequelize.STRING,
    file: sequelize.STRING,
    auth: sequelize.BOOLEAN
})

users.hasOne(userProfile, {foreignKey: 'userId'});
userProfile.belongsTo(users, {foreignKey: 'userId'})
users.hasMany(posts, {foreignKey: 'userId'})
posts.belongsTo(users, {foreignKey: 'userId'})
posts.hasMany(comments, {foreignKey: 'postId'})
comments.belongsTo(posts, {foreignKey: 'postId'})
posts.hasMany(postLikes, {foreignKey: 'postId'})
postLikes.belongsTo(posts, {foreignKey: 'postId'})
comments.hasMany(commentLikes, {foreignKey: 'cmtId'})
commentLikes.belongsTo(comments, {foreignKey: 'cmtId'})
users.hasMany(notifications, {foreignKey: 'userId'});
notifications.belongsTo(users, {foreignKey: 'userId'})
users.hasMany(addTopic, {foreignKey: 'userId'});
addTopic.belongsTo(users, {foreignKey: 'userId'})
users.hasMany(feedback, {foreignKey: 'userId'});
feedback.belongsTo(users, {foreignKey: 'userId'})
users.hasMany(report, {foreignKey: 'userId'});
report.belongsTo(users, {foreignKey: 'userId'})
users.hasMany(postSaved, {foreignKey: 'userId'});
postSaved.belongsTo(users, {foreignKey: 'userId'})
users.hasMany(cardNumber, {foreignKey: 'userId'});
cardNumber.belongsTo(users, {foreignKey: 'userId'})
users.hasMany(userAuth, {foreignKey: 'userId'});
userAuth.belongsTo(users, {foreignKey: 'userId'})

mysqlDB.sync()

var options = {
    host: '127.0.0.1',
    port: 3306,
    user: mysqlConfig.getMysqlUsername(),
    password: mysqlConfig.getMysqlPassword(),
    database: 'fodance'
};

const sessionStore = new MySQLStore(options);

app.engine('ejs', require('express-ejs-extend'))
app.set("view engine", "ejs")
app.set("views", "./views")

//midleware
app.use('/public', express.static(__dirname + "/public"))
app.use('/uploads', express.static(__dirname + "/uploads"))
app.use('/models', express.static(__dirname + "/models"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true }))
app.use(session({
    secret: "allbestthings", resave: false, saveUninitialized: true,
    cookie: {
        secure: true,
        maxAge: 1000*60*60*24*365
    },
    store: sessionStore,
    httpOnly: true,
    secure: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(morgan("dev"))

const http = express();

http.get('*', function(req, res) {  
    res.redirect('https://' + req.headers.host + req.url);
})

http.listen(80);

const https = require('https');
const fs = require('fs');

const op = {
  key: fs.readFileSync('config/cert/privkey.pem'),
  cert: fs.readFileSync('config/cert/cert.pem'),
  ca: fs.readFileSync('config/cert/fullchain.pem')
};

const server = https.createServer(op, app).listen(443, function(){
    console.log("Server is running...")
    app.get('*', function(req, res){
        if (req.headers.host == "18.142.122.185") {res.redirect('https://fodance.com')}
    })
});

// const server = https.createServer(op, (req, res) => {
//     console.log("Server is running...")
//     res.writeHead(200);
//     res.end("Lingyo is temporarily closed for upgrade")
// }).listen(443);

const io = socketio(server)

// FBLogin()
// GGLogin()
// signupController(app, users, userProfile, emailRegister, phoneRegister)
loginController(app, users)
forgotController(app, users, forgotPasswordToken, forgotPasswordCode)
updateController(app, users)
homeController(io, app, users, userProfile, posts, comments, postLikes, commentLikes, postSaved, follow, voteWinners, notifications, addTopic, feedback, report, paypal, cardNumber, reward, userAuth)