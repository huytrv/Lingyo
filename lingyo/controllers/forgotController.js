const crypto = require("crypto")
const bcrypt = require("bcrypt")
const randomize = require("randomatic")
const sendTokenMail = require("../contacts/sendTokenMail")
const sendSMS = require("../contacts/sendSMS")
const { Op, INTEGER } = require("sequelize");


module.exports = function(app, users, forgotPasswordToken, forgotPasswordCode){
    app.get('/forgot-password', function(req, res){
        res.render("forgotPassword")
    })
    let user = userReset = phone = email = token = code = tokenDb = codeDb = ''
    app.post("/client-send-reset-password-username", function(req, res){
        const data = req.body
        if (typeof(data.ip), typeof(data.username) === "string" && typeof(data.startTime) === "number"){
            function initCodeToken(done){
                const saltRounds = 10
                const salt = bcrypt.genSaltSync(saltRounds)
                crypto.randomBytes(20, function(err, buf){
                    token = buf.toString('hex')
                    tokenDb = bcrypt.hashSync(token, salt)
                    code = randomize('0', 6)
                    codeDb = bcrypt.hashSync(code, salt)
                    done()
                })
            }
            var ip = data.ip, startTime = data.startTime
            users.findOne({
                raw: true,
                where: {
                    [Op.or]: [{ email: data.username }, { phone: data.username }]
                }
            }).then(function(user){
                if(!user){
                    res.json({
                        status: "server-send-invalid-reset-username"
                    })
                }
                else {
                    userReset = user
                    if (user.email && ! user.phone) {
                        email = user.email
                        phone = ''
                    }
                    if (user.phone && !user.email) {
                        phone = user.phone
                        email = ''
                    }
                    if (user.phone && user.email) {
                        phone = user.phone
                        email = user.email
                    }
                    let d = {
                        email: email,
                        phone: phone
                    }
                    res.json({
                        status: "server-send-valid-username",
                        dataConfirm: d
                    })
                    app.post("/client-send-choice", function(req, res){
                        const choice = req.body.choice
                        let date = new Date()
                        date.setHours(date.getHours() + 2)
                        if (typeof(choice) == "number"){
                            if (choice == 0) {
                                var destroySame = destroy = blocked = false
                                forgotPasswordToken.findAll({
                                    raw: true,
                                    where: {
                                        lastReqTime: {
                                            [Op.lte]: startTime - 24*3600*1000
                                        }
                                    }
                                }).then(function(e){
                                    e.forEach(element => {  
                                        (async function (){
                                            await forgotPasswordToken.destroy({
                                                where: {
                                                    ip: element.ip,
                                                    email: element.email
                                                }
                                            })
                                        })()
                                        destroy = true
                                        if (element.ip == ip && element.email == email){
                                            destroySame = true
                                        }
                                    })
                                }) 
                                forgotPasswordToken.findAll({
                                    raw: true,
                                    where: {
                                        ip: ip
                                    }
                                }).then(function(e){
                                    if (e != "") {
                                        if (e[0].blocked) {
                                            var stillBlock = false
                                            e.forEach(function(e){
                                                if(startTime - e.lastReqTime < 24*3600*1000 && e.blocked) {
                                                    stillBlock = true
                                                    blocked = true
                                                }
                                            })
                                            if (!stillBlock){
                                                if (destroy) {     
                                                    initCodeToken(() => {
                                                        (async function (){
                                                            await forgotPasswordToken.create({
                                                                ip: ip,
                                                                email: email,
                                                                token: tokenDb,
                                                                expires: date,
                                                                lastReqTime: startTime,
                                                                blocked: false,
                                                                reqCount: 1,
                                                            })
                                                        })()   
                                                        sendTokenMail(email, token)
                                                        res.json({ 
                                                            status: "server-send-reset-email-sent",
                                                            dataConfirm: email
                                                        })  
                                                    })
                                                }
                                            }
                                        }                         
                                        else {
                                            forgotPasswordToken.findOne({
                                                raw: true,
                                                where: {
                                                    ip: ip,
                                                    email: email
                                                }
                                            }).then(function(e){
                                                if(e && !destroySame) {
                                                    if (e.reqCount <= 4){
                                                        initCodeToken(() => {
                                                            (async function (){
                                                                await forgotPasswordToken.update({token: tokenDb,
                                                                    expires: date, reqCount: e.reqCount + 1, lastReqTime: startTime}, {
                                                                    where: {
                                                                        email: email,
                                                                        ip: ip
                                                                    }
                                                                })
                                                            })()
                                                            sendTokenMail(email, token)
                                                            res.json({
                                                                status: "server-send-reset-email-sent",
                                                                dataConfirm: email
                                                            })
                                                        })
                                                    }   
                                                }
                                                else {
                                                    initCodeToken(() => {
                                                        (async function (){
                                                            await forgotPasswordToken.create({
                                                                ip: ip,
                                                                email: email,
                                                                token: tokenDb,
                                                                expires: date,
                                                                lastReqTime: startTime,
                                                                blocked: false,
                                                                reqCount: 1,
                                                            })
                                                        })()
                                                        sendTokenMail(email, token) 
                                                        res.json({
                                                            status: "server-send-reset-email-sent",
                                                            dataConfirm: email
                                                        })
                                                    })                                     
                                                }                                      
                                            })
                                        }
                                    }
                                    else {  
                                        initCodeToken(() => {
                                            (async function (){
                                                await forgotPasswordToken.create({
                                                    ip: ip,
                                                    email: email,
                                                    token: tokenDb,
                                                    expires: date,
                                                    lastReqTime: startTime,
                                                    blocked: false,
                                                    reqCount: 1,
                                                })
                                            })()   
                                            sendTokenMail(email, token)  
                                            res.json({
                                                status: "server-send-reset-email-sent",
                                                dataConfirm: email
                                            })
                                        })
                                    }                               
                                    let c = 0
                                    e.forEach(function(element){
                                        c += element.reqCount
                                    })
                                    if ((c > 4 && !destroy) || stillBlock) {                       
                                        (async function (){
                                            await forgotPasswordToken.update({blocked: true}, {
                                                where: {
                                                    ip: ip
                                                }
                                            })
                                        })()
                                        blocked = true
                                        res.json({
                                            status: "server-send-blocked-ip"
                                        })   
                                    }
                                })
                            }
                            else {
                                var destroySame = destroy = blocked = false
                                forgotPasswordCode.findAll({
                                    raw: true,
                                    where: {
                                        lastReqTime: {
                                            [Op.lte]: startTime - 24*3600*1000
                                        }
                                    }
                                }).then(function(e){
                                    e.forEach(element => {  
                                        (async function (){
                                            await forgotPasswordCode.destroy({
                                                where: {
                                                    ip: element.ip,
                                                    phone: element.phone
                                                }
                                            })
                                        })() 
                                        destroy = true
                                        if (element.ip == ip && element.phone == phone){
                                            destroySame = true
                                        }
                                    })
                                }) 
                                forgotPasswordCode.findAll({
                                    raw: true,
                                    where: {
                                        ip: ip
                                    }
                                }).then(function(e){    
                                    if (e != "") {
                                        if (e[0].blocked) {
                                            var stillBlock = false
                                            e.forEach(function(e){
                                                if(startTime - e.lastReqTime < 24*3600*1000 && e.blocked) {
                                                    stillBlock = true
                                                    blocked = true
                                                }
                                            })
                                            if (!stillBlock) {
                                                if (destroy) {
                                                    initCodeToken(() => {
                                                        (async function (){
                                                            await forgotPasswordCode.create({
                                                                ip: ip,
                                                                phone: phone,
                                                                code: codeDb,
                                                                expires: date,
                                                                lastReqTime: startTime,
                                                                blocked: false,
                                                                reqCount: 1,
                                                            })
                                                        })()
                                                        sendSMS(phone, code)
                                                        handleCode(res, ip, userReset)
                                                    })
                                                }
                                            }
                                        }                         
                                        else {
                                            forgotPasswordCode.findOne({
                                                raw: true,
                                                where: {
                                                    ip: ip,
                                                    phone: phone
                                                }
                                            }).then(function(e){
                                                if(e && !destroySame) {
                                                    if (e.reqCount <= 4 && !blocked){
                                                        initCodeToken(() => {
                                                            (async function (){
                                                                await forgotPasswordCode.update({code: codeDb,
                                                                    expires: date, reqCount: e.reqCount + 1, lastReqTime: startTime}, {
                                                                    where: {
                                                                        phone: phone,
                                                                        ip: ip
                                                                    }
                                                                })
                                                            })()
                                                            sendSMS(phone, code)    
                                                            handleCode(res, ip, userReset)
                                                        })
                                                    }   
                                                }
                                                else {
                                                    initCodeToken(() => {
                                                        (async function (){
                                                            await forgotPasswordCode.create({
                                                                ip: ip,
                                                                phone: phone,
                                                                code: codeDb,
                                                                expires: date,
                                                                lastReqTime: startTime,
                                                                blocked: false,
                                                                reqCount: 1,
                                                            })
                                                        })()
                                                        sendSMS(phone, code)
                                                        handleCode(res, ip, userReset)
                                                    })
                                                }                                         
                                            })
                                        }
                                    }
                                    else {  
                                        initCodeToken(() => {
                                            (async function (){
                                                await forgotPasswordCode.create({
                                                    ip: ip,
                                                    phone: phone,
                                                    code: codeDb,
                                                    expires: date,
                                                    lastReqTime: startTime,
                                                    blocked: false, 
                                                    reqCount: 1,
                                                })
                                            })()  
                                            sendSMS(phone, code)
                                            handleCode(res, ip, userReset)
                                        })
                                    }                               
                                    let c = 0
                                    e.forEach(function(element){
                                        c += element.reqCount
                                    })
                                    if ((c > 4 && !destroy) || stillBlock) {                       
                                        (async function (){
                                            await forgotPasswordCode.update({blocked: true}, {
                                                where: {
                                                    ip: ip
                                                }
                                            })
                                        })()
                                        blocked = true
                                        res.json({
                                            status: "server-send-blocked-ip"
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
        else {
            res.end()
        }
    })
    
    function handleCode(res, ip, userReset){
        user = userReset
        res.json({
            status: "server-send-reset-code-sent",
            dataConfirm: user.phone
        })
        app.post("/client-send-reset-code", function(req, res){
            const c = req.body
            if ((typeof(c.code) === "string" || typeof(c.code) === "number") && typeof(c.times) === "number"){
                forgotPasswordCode.findOne({
                    raw: true,
                    where: {
                        ip: ip,
                        phone: user.phone
                    }
                }).then(function(e){
                    let valid = blockEnterCode = false
                    const isMatch = bcrypt.compareSync(c.code, e.code);
                    if (isMatch && e.expires > Date.now()) valid = true
                    if (c.times >= 10) blockEnterCode = true
                    validate = {
                        valid: valid,
                        blockEnterCode: blockEnterCode
                    }
                    process.setMaxListeners(0)
                    res.json({
                        status: "server-send-enter-code-done",
                        dataConfirm: validate
                    })
                    app.post('/client-send-reset-code-password', function(req, res){
                        if (req.body.password.length >= 8 && /[0-9]/.test(req.body.password) && typeof(req.body.password) === "string") {
                            const saltRounds = 10
                            const salt = bcrypt.genSaltSync(saltRounds);
                            const password = bcrypt.hashSync(req.body.password, salt)
                            users.update({password: password}, {
                                where: {
                                    phone: user.phone
                                }
                            }).then(function(){
                                users.findOne({
                                    where: {
                                        phone: user.phone
                                    }
                                }).then(function(user){
                                    req.login(user, function(err) {
                                        res.json({
                                            status: "server-send-reset-code-done",
                                        })
                                    })
                                })
                            });
                            (async function destroyForgotPasswordCode(){
                                await forgotPasswordCode.destroy({
                                    where: {
                                        phone: user.phone
                                    }
                                })
                            })()
                        }
                        else {
                            res.json({
                                status: "server-send-reset-code-err",
                            })
                        }
                    })
                })
            }
            else {
                res.end()
            }
        })
    }

    app.get('/reset-password/:token', function(req, res){
        if (typeof(req.params.token) === "string"){
            forgotPasswordToken.findAll({
                where: {
                    expires: {
                        [Op.gt]: Date.now()
                    }
                }
            }).then(function(e){
                var isMatch, valid = false
                e.forEach(function(element){
                    isMatch = bcrypt.compareSync(req.params.token, element.token)
                    if (isMatch) {
                        valid = true
                    }
                })
                if(!valid) {
                    res.render("expired")
                }
                else res.render("resetPassword")
            })
        }
        else {
            res.end()
        }
    })

    app.post("/client-send-reset-token-password", function(req, res){
        const data = req.body
        if (typeof(data.token) === "string"){
            forgotPasswordToken.findAll({
                where: {
                    expires: {
                        [Op.gt]: Date.now()
                    }
                }
            }).then(function(e){
                var isMatch, valid = false, email
                e.forEach(function(element){
                    isMatch = bcrypt.compareSync(data.token, element.token)
                    if (isMatch) {
                        valid = true
                        email = element.email
                    }
                })
                if(!valid) {
                    res.json({
                        status: "server-send-reset-expired"
                    })
                }
                else {
                    if (req.body.password.length >= 8 && /[0-9]/.test(req.body.password) && typeof(req.body.password) === "string") {
                        const saltRounds = 10
                        const salt = bcrypt.genSaltSync(saltRounds)
                        const password = bcrypt.hashSync(req.body.password, salt)
                        users.update({password: password}, {
                            where: {
                                email: email
                            }
                        }).then(function(user){
                            users.findOne({
                                where: {
                                    email: email
                                }
                            }).then(function(user){
                                req.login(user, function(err) {
                                    res.json({
                                        status: "server-send-reset-done",
                                    })
                                })
                            })
                        });
                        (async function destroyForgotPasswordToken(){
                            await forgotPasswordToken.destroy({
                                where: {
                                    email: email
                                }
                            })
                        })()
                    }
                    else {
                        res.json({
                            status: "server-send-reset-err"
                        })
                    }
                }
            })
        }
        else {
            res.end()
        }
    })
}