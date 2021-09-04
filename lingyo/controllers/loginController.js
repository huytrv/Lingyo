const passport = require("passport")
const localStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")
const { Op } = require("sequelize");
const flash = require('connect-flash');


module.exports = function(app, users){
    app.use(flash());
    app.route('/login')
    .get(function(req, res){
        if (req.headers.host == "18.142.122.185") {res.redirect('https://fodance.com')}
        else {
            req.logout()
            res.render("login", {message: '', username: ''})
        }
    })
    .post(function(req, res, next){
        passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login'}, function(err, user, info) {
            if (err) {
                message = "Đăng nhập thất bại"
                return res.render("login", {message})
            }
            if (!user) {
                message = info.error
                username = req.body.username
                req.session.tryTime ++
                if(req.session.tryTime == 9) {
                    req.session.blockLogin = true
                    req.session.cookie.expires = 60000
                }
                process.setMaxListeners(0)
                if(!req.session.blockLogin) {
                    return res.render("login", {message, username})
                }
                else {
                    return res.render("blockLogin")
                }
            }
            req.logIn(user, function(err){
                if (err){
                    message = "Đăng nhập thất bại, hãy thử lại"
                    return res.render("login", {message})
                }
                return res.redirect("/")
            })
        })(req, res, next)
    })

    passport.use(new localStrategy(function(username, password, done) {
        users.findOne({
            raw: true,
            where: {
                [Op.or]: [{ email: username }, { phone: username }]
            }
        })
        .then(function (user) {
            if (user){
                const isMatch = bcrypt.compareSync(password, user.password);
                if (isMatch) {
                    return done(null, user)
                }
                else {
                    return done(null, false, {error: "Tên tài khoản hoặc mật khẩu không chính xác"})
                }
            }
            else {
                return done(null, false, {error: "Tên tài khoản hoặc mật khẩu không chính xác"})
            }

        })
    }))

    passport.serializeUser((user, done) => {
        done(null, user)
    })

    passport.deserializeUser((user, done) => {
        users.findOne({
            raw: true,
            where: {
                userId: user.userId,
            }
        })
        .then(function (user) {
            if (user) {
                return done(null, user)
            }
            else {
                return done(null, false)
            }
        })
    })

    app.get("/auth/facebook", passport.authenticate('facebook', {scope: 'email'}))

    app.get("/facebook/callback", passport.authenticate('facebook', {
        successRedirect: '/',
    }))

    app.get("/auth/google", passport.authenticate('google', {scope: ['profile', 'email']}))

    app.get("/google/callback", passport.authenticate('google', {
        successRedirect: '/'
    }))
}