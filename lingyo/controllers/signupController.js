const randomize = require("randomatic")
const bcrypt = require("bcrypt")
const async = require("async")
const sendMail = require("../contacts/sendMail")
const sendSMS = require("../contacts/sendSMS")
const { Op, INTEGER, INET } = require("sequelize")


module.exports = function(app, users, userProfile, emailRegister, phoneRegister){
    app.get("/signup", function(req, res){
        if (req.headers.host == "18.163.40.72") {res.redirect('https://lingyo.vn')}
        else {
            req.logout()
            res.render("login", {message: '', username: ''})
        }
    })

    let emailConfirmCode = phoneConfirmCode = ""
    let email = username = phone = password = dataConfirm = startTime = ip = ""
    let emailValid = phoneValid = false

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,:\s@\"]+(\.[^<>()[\]\\.,:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(email)
    }
    function validatePhone(phone){
        const re = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/
        return re.test(phone)
    }

    app.post("/client-send-email-and-username", function(req, res){
        const data = req.body
        let refresh = false
        startTime = data.startTime
        //xac thuc email
        const emailInput = data.email.trim()
        const usernameInput = data.username.trim()
        if (typeof(emailInput) === "string" && typeof(usernameInput) === "string" && typeof(startTime) === "number" && typeof(data.emailReq) === "number"){
            if (emailInput != '' && validateEmail(emailInput) && usernameInput != '' && !usernameInput.toLowerCase().includes("fodance")){
                users.findAll({
                    raw: true,
                    where: {
                        email: emailInput,
                    }
                }).then(function (user) {
                    //neu hop le
                    if (user == "") {
                        emailValid = true
                        email = emailInput
                        phone = null
                        username = usernameInput
                        const dataConfirm = {
                            email: emailInput,
                            emailValid: emailValid,
                        }
                        //tim cac email cach 2h
                        emailRegister.findAll({
                            raw: true,
                            where: {
                                lastReqTime: {
                                    [Op.lte]: startTime - 2*3600*1000
                                }
                            }
                        }).then(function(e){
                            e.forEach(element => {
                                //neu khong phai email dang nhap, xoa het
                                if (element.email != email){
                                    (async function destroyEmailRegister(){
                                        await emailRegister.destroy({
                                            where: {
                                                email: element.email,
                                            }
                                        });
                                    })()
                                }         
                                //neu la email dang nhap, cap nhat                 
                                else {
                                    emailConfirmCode = randomize('0', 6)
                                    sendMail(emailInput, emailConfirmCode)
                                    refresh = true;
                                    (async function updateEmailRegister(){
                                        await emailRegister.update({ blocked: false, lastReqTime: startTime, reqCount: 1, code: emailConfirmCode},{
                                            where: {
                                                email: email
                                            }
                                        })
                                    })()
                                    res.json({
                                        status: "server-send-email-result",
                                        dataConfirm: dataConfirm
                                    })
                                }
                            })
                        })
                        //tim trong ds email da dang ki
                        emailRegister.findOne({
                            raw: true,
                            where: {
                                email: emailInput
                            }
                        }).then(function(e){
                            //neu chua co email, add vao bang
                            if (e == null){
                                emailConfirmCode= randomize('0', 6)
                                sendMail(emailInput, emailConfirmCode);
                                (async function createEmailRegister(){
                                    await emailRegister.create({ 
                                        email: emailInput,
                                        lastReqTime: startTime,
                                        blocked: false,
                                        reqCount: 1,
                                        code: emailConfirmCode
                                    })
                                })()
                                res.json({
                                    status: "server-send-email-result",
                                    dataConfirm: dataConfirm
                                })
                            }
                            //neu co email roi:
                            else {
                                //neu yeu cau duoi 5 va la lan dau, gui email, cap nhat bang
                                if (!refresh){
                                    if (data.emailReq == 1 && e.reqCount <=4) {
                                        sendMail(emailInput, e.code);
                                        (async function updateEmailRegister(){
                                            await emailRegister.update({ blocked: false, lastReqTime: startTime, reqCount: e.reqCount + 1},{
                                                where: {
                                                    email: emailInput
                                                }
                                            })
                                        })()
                                        res.json({
                                            status: "server-send-email-result",
                                            dataConfirm: dataConfirm
                                        })
                                    }
                                    else {
                                        //neu yeu cau nho hon 5, cap nhat so lan
                                        if (e.reqCount <=4){
                                            (async function updateEmailRegister(){
                                                await emailRegister.update({reqCount: e.reqCount + 1, lastReqTime: startTime}, {
                                                    where: {
                                                        email: emailInput
                                                    }
                                                })
                                            })()
                                            res.json({
                                                status: "server-send-email-result",
                                                dataConfirm: dataConfirm
                                            })
                                        }
                                        // neu yeu cau lon hon 5, chan email
                                        if (e.reqCount >= 4) {
                                            (async function updateEmailRegister(){
                                                await emailRegister.update({ blocked: true}, {
                                                    where: {
                                                        email: emailInput
                                                    }
                                                })
                                            })()
                                            res.json({
                                                status: "server-send-blocked-email",
                                                dataConfirm: dataConfirm
                                            })
                                        }
                                    }
                                }
                            }
                        })
                    }
                    else {
                        emailValid = false
                        const dataConfirm = {
                            email: emailInput,
                            emailValid: emailValid,
                        }
                        res.json({
                            status: "server-send-email-result",
                            dataConfirm: dataConfirm
                        })
                    }
                })
            }
        }
        else {
            res.end()
        }
    })

    app.post("/client-send-phone-and-username", function(req, res){
        const data = req.body
        phoneConfirmCode = randomize('0', 6)
        startTime = data.startTime
        //xac thuc sdt
        const phoneInput = data.phone.trim()
        const usernameInput = data.username.trim()
        if ((typeof(phoneInput) === "string" || typeof(phoneInput) === "number") && typeof(usernameInput) === "string" && typeof(startTime) === "number" && typeof(data.ip) === "string"){
            if (phoneInput != '' && validatePhone(phoneInput) && usernameInput != '' && !usernameInput.toLowerCase().includes("fodance")){
                users.findAll({
                    raw: true,
                    where: {
                        phone: phoneInput,
                    }
                }).then(function (user) {
                    //neu hop le
                    if (user == "") {
                        phoneValid = true
                        ip = data.ip
                        phone = phoneInput
                        email = null
                        username = usernameInput
                        const dataConfirm = {
                            phone: phoneInput,
                            phoneValid: phoneValid,
                        }
                        async.waterfall([
                            function(done) {
                                let destroy = buf = blocked = false
                                //xoa cac sdt nhap cach day 1 ngay
                                phoneRegister.findAll({
                                    raw: true,
                                    where: {
                                        lastReqTime: {
                                            [Op.lte]: startTime - 24*3600*1000
                                        }
                                    }
                                }).then(function(e){
                                    e.forEach(element => {  
                                        (async function destroyPhoneRegister(){
                                            await phoneRegister.destroy({
                                                where: {
                                                    ip: element.ip,
                                                    phone: element.phone
                                                }
                                            });
                                        })()  
                                        buf = true
                                        // neu la ip, sdt dang nhap, danh dau                                  
                                        if (element.ip == ip && element.phone == phone){
                                            destroy = true
                                        }
                                    })
                                    done(null,buf, destroy) 
                                }) 
                            }, function(buf, destroy, done){
                                phoneRegister.findAll({
                                    raw: true,
                                    where: {
                                        ip: ip
                                    }
                                }).then(function(e){
                                    if (e != "") {
                                        if (e[0].blocked) {
                                            var stillBlock = false
                                            e.forEach(function(el){
                                                if(startTime - el.lastReqTime < 24*3600*1000 && el.blocked) {
                                                    stillBlock = true
                                                    blocked = true
                                                }
                                            })
                                            if (!stillBlock) {
                                                if (buf) {
                                                    phoneConfirmCode = randomize('0', 6);
                                                    sendSMS(phoneInput, phoneConfirmCode);
                                                    (async function createPhoneRegister(){
                                                        await phoneRegister.create({
                                                            ip: ip,
                                                            phone: phone,
                                                            lastReqTime: startTime,
                                                            blocked: false,
                                                            reqCount: 1,
                                                            code: phoneConfirmCode,
                                                        });
                                                    })()
                                                    res.json({
                                                        status: "server-send-phone-result",
                                                        dataConfirm: dataConfirm
                                                    })
                                                }
                                            }
                                        }                         
                                        else {
                                            phoneRegister.findOne({
                                                raw: true,
                                                where: {
                                                    ip: ip,
                                                    phone: phone
                                                }
                                            }).then(function(e){
                                                if(e && !destroy) {
                                                    if (e.reqCount <= 4 && ! blocked){
                                                        sendSMS(phoneInput, e.code);
                                                        (async function updatePhoneRegister(){
                                                            await phoneRegister.update({reqCount: e.reqCount + 1, lastReqTime: startTime}, {
                                                                where: {
                                                                    phone: phone,
                                                                    ip: ip
                                                                }
                                                            })
                                                        })()
                                                        res.json({
                                                            status: "server-send-phone-result",
                                                            dataConfirm: dataConfirm
                                                        })
                                                    }   
                                                }
                                                else {
                                                    phoneConfirmCode = randomize('0', 6);
                                                    sendSMS(phoneInput, phoneConfirmCode);
                                                    (async function createPhoneRegister(){
                                                        await phoneRegister.create({
                                                            ip: ip,
                                                            phone: phone,
                                                            lastReqTime: startTime,
                                                            blocked: false,
                                                            reqCount: 1,
                                                            code: phoneConfirmCode,
                                                        })
                                                    })()
                                                    res.json({
                                                        status: "server-send-phone-result",
                                                        dataConfirm: dataConfirm
                                                    })
                                                }                                      
                                            })
                                        }
                                    }
                                    else {    
                                        phoneConfirmCode = randomize('0', 6);
                                        sendSMS(phoneInput, phoneConfirmCode);
                                        (async function createPhoneRegister(){
                                            await phoneRegister.create({
                                                ip: ip,
                                                phone: phone,
                                                lastReqTime: startTime,
                                                blocked: false,
                                                reqCount: 1,
                                                code: phoneConfirmCode,
                                            })
                                        })()
                                        res.json({
                                            status: "server-send-phone-result",
                                            dataConfirm: dataConfirm
                                        })                                  
                                    }                               
                                    let c = 0
                                    e.forEach(function(element){
                                        c += element.reqCount
                                    })
                                    if ((c >= 5 && !buf) || stillBlock) {                       
                                        (async function updatePhoneRegister(){
                                            await phoneRegister.update({blocked: true}, {
                                                where: {
                                                    ip: ip
                                                }
                                            })
                                        })()
                                        blocked = true
                                        res.json({
                                            status: "server-send-block-ip"
                                        })                                 
                                    }
                                })
                                done(null, 'done')
                            }
                        ], function(err){
                        })                      
                    }
                    else {
                        phoneValid = false
                        const dataConfirm = {
                            phone: phoneInput,
                            phoneValid: phoneValid,
                        }
                        res.json({
                            status: "server-send-phone-result",
                            dataConfirm: dataConfirm
                        }) 
                    }
                })
            }
            else {
                res.json({
                    status: "server-send-invalid-phone-or-username",
                }) 
            }
        }
    })

    app.post("/client-send-code", function(req, res){
        const data = req.body
        const code = data.code
        if ((typeof(code) === "string" || typeof(code) === "number") && typeof(data.times) === "number"){
            let codeValid = blockeEnterCode = false
            let endTime   = new Date()
            endTime = endTime.getTime()
            const count = (endTime - startTime) / 1000
            if (data.times > 10) {
                blockeEnterCode = true
            }
            if (email){
                emailRegister.findOne({
                    raw: true,
                    where: {
                        email: email
                    }
                }).then(function(e){
                    if (e != null) {
                        if (code == e.code && count < 7200) {
                            codeValid = true
                        }
                        dataConfirm = {
                            codeValid: codeValid,
                            blocked: blockeEnterCode
                        }
                        res.json({
                            status: "server-send-code-result",
                            dataConfirm: dataConfirm
                        })
                    }
                })
            }
            if (phone){
                phoneRegister.findOne({
                    raw: true,
                    where: {
                        phone: phone,
                        ip: ip
                    }
                }).then(function(e){
                    if (e != null){
                        if (code == e.code && count < 7200) {
                            codeValid = true
                        }
                        dataConfirm = {
                            codeValid: codeValid,
                            blocked: blockeEnterCode
                        }
                        res.json({
                            status: "server-send-code-result",
                            dataConfirm: dataConfirm
                        })
                    }
                })
            }
        }
    })

    app.post('/signup', function(req, res) {
        if (typeof(req.body.password) === "string"){
            if (req.body.password.length >= 8 && /[0-9]/.test(req.body.password)) {
                const saltRounds = 10
                const salt = bcrypt.genSaltSync(saltRounds);
                const password = bcrypt.hashSync(req.body.password, salt)
                function getRndInteger(min, max) {
                    return Math.floor(Math.random() * (max - min)) + min;
                }
                function generateUser() {
                    const uid = getRndInteger(1000000000, 10000000000)
                    users.findOne({
                        where: {
                            userId: uid
                        }
                    }).then(function(u){
                        if(!u){
                            users.create({ 
                                userId: uid,
                                email: email,
                                phone: phone,
                                username: username,
                                password: password,
                                facebookEmail: null
                            }).then(function(user){
                                req.login(user, function(err) {
                                    res.json({
                                        status: "server-send-signup-done",
                                    })
                                })
                                function generateProfile(){
                                    const ran = getRndInteger(10000000, 100000000)
                                    const nickname = username.replace(/[^a-zA-Z0-9_]/g, "") + ran
                                    userProfile.findOne({
                                        where: {
                                            nickname: nickname
                                        }
                                    }).then(function(p){
                                        if (!p){
                                            // const URL = this.window.URL || this.window.webkitURL
                                            // const avtFile = new Blob(
                                            //     [],
                                            // )
                                            // const coverFile = new Blob(
                                            //     [],
                                            // )
                                            // const avtUrl = URL.createObjectURL(avtFile)
                                            // const coverUrl = URL.createObjectURL(coverFile)
                                            userProfile.create({ 
                                                userId: user.userId,
                                                nickname: nickname,
                                                avatar: "default-user.png",
                                                cover: "default-cover.png",
                                                followers: 0,
                                                following: 0,
                                                points: 0,
                                                usd: 0,
                                                tickets: 0,
                                                rank: "bronze",
                                                rank1: 0,
                                                rank2: 0,
                                                rank3: 0,
                                                rank10: 0,
                                                winner: [],
                                                reward: false,
                                                saved: [],
                                                notice: [],
                                                followNotification: true,
                                                voteFollowNotification: true,
                                                postFollowNotification: true,
                                                posts: 0,
                                                starstatus: false,
                                                new: true,
                                                auth: false
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
                            generateUser()
                        }
                    })
                }
                generateUser()
                if (phone) {
                    (async function destroyPhoneRegister(){
                        await phoneRegister.destroy({
                            where: {
                                phone: phone
                            }
                        })
                    })()
                } 
                if (email) {
                    (async function destroyEmailRegister(){
                        await emailRegister.destroy({
                            where: {
                                email: email
                            }
                        })
                    })()
                } 
            }
            else {
                res.json({
                    status: "server-send-signup-err",
                })
            }
        }
    })
}
