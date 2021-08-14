const Sequelize = require("sequelize")
const { Op, where } = require("sequelize")
const randomize = require("randomatic")
const formidable = require('formidable')
const sharp = require('sharp')
const bcrypt = require("bcryptjs")
const fs = require('fs')
const path = require("path");
const readChunk = require('read-chunk')
const FileType = require('file-type')
const sendSMS = require("../contacts/sendSMS")
const sendMail = require("../contacts/sendMail")
const sendModerateMail = require("../contacts/sendModerateMail")
//azure
const { BlobServiceClient } = require("@azure/storage-blob");

//gg-cloud
const {Storage} = require('@google-cloud/storage');
const gc = new Storage({
    keyFilename: path.join(__dirname, "../cf-project-318304-41a96963c2de.json"),
    projectId: "cf-project-318304"
})
const cfFileBucket = gc.bucket("fodance-bk")

//aws
const S3 = require("aws-sdk/clients/s3")
const bucketName = process.env.AWS_BUCKET_NAME
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY
const s3 = new S3({
    accessKeyId,
    secretAccessKey
})


module.exports = function(io, app, users, userProfile, posts, comments, postLikes, commentLikes, postSaved, follow, voteWinners, notifications, addTopic, feedback, report, paypal, cardNumber){
    const rankList = ["primary", "intermediate", "highgrade"]
    const rankName = ["Sơ cấp", "Trung cấp", "Cao cấp"]
    const cateList = ["freestyle", "hiphop", "rap", "contemporary", "ballroom", "modern", "ballet", "shuffle", "jazz", "sexy", "flashmob", "other"]
    const cateName = ["Nhảy tự do", "Hiphop", "Rap", "Múa đương đại", "Khiêu vũ", "Nhảy hiện đại", "Múa ba lê", "Shuffle", "Jazz", "Sexy", "Fashmob", "Khác"]
    const navList = ["fame", "notifications", "saved", "honors", "add-topic", "setting"]
    const navName = ["Xếp hạng", "Thông báo", "Đã lưu", "Vinh danh", "Thêm thể loại", "Cài đặt"]
    const startTimeline = new Date("Mon Dec 28 2020 00:00:00")
    let round = Math.floor((Date.now() - startTimeline)/1000/60/60/24/7)
    let currentTimeline = Date.parse(startTimeline) + round*7*24*60*60*1000
    let roundType
    if (new Date().getDay() >= 1 && new Date().getDay() <= 5) {roundType = "group-stage"}else {roundType = "final"}
    //handleVoteChampion
    setInterval(function(){ 
        const newRound = Math.floor((Date.now() - startTimeline)/1000/60/60/24/7)
        if (newRound > round) {
            let buf = 0
            const WinnerList = {}
            for (let c = 0; c < cateList.length; c++){
                for (let r = 0; r < rankList.length; r++){
                    posts.findAll({
                        raw: true,
                        order: [
                            ['like', 'DESC'],
                            ['time', 'ASC']
                        ],
                        where: {
                            category: cateList[c],
                            rank: rankList[r],
                            time: {
                                [Op.gte]: currentTimeline
                            },
                            auth: true
                        },
                        limit: 1000,
                        attributes: [
                            [Sequelize.fn('DISTINCT', Sequelize.col('userId')) ,'userId'],
                        ],
                    }).then(function(totalPost) {
                        posts.findAll({
                            raw: true,
                            order: [
                                ['like', 'DESC'],
                                ['time', 'ASC']
                            ],
                            where: {
                                category: cateList[c],
                                rank: rankList[r],
                                time: {
                                    [Op.gte]: currentTimeline
                                },
                                auth: true
                            },
                            limit: 10
                        }).then(function(p){
                            buf ++
                            if (p.length != 0){
                                for (let i = 0; i < p.length; i++){
                                    const rank = i + 1
                                    const winnerObj = {}
                                    
                                    if (!WinnerList[p[i].userId]){WinnerList[p[i].userId] = []}
                                    winnerObj[rank] = cateName[c] + ' - ' + rankName[r]
                                    WinnerList[p[i].userId].push(winnerObj)
                                    
                                    if (rankList[r] == "primary"){
                                        if (rank == 1){
                                            userProfile.increment('rank1', {by: 1, where: {userId: p[i].userId}})
                                            userProfile.increment('points', {by: 100, where: {userId: p[i].userId}})
                                            if (totalPost.length >= 25){
                                                userProfile.increment('stars', {by: 50, where: {userId: p[i].userId}})
                                                winnerObj['stars'] = 50
                                            }
                                            else {
                                                winnerObj['stars'] = 0
                                            }
                                        }
                                        if (rank == 2){
                                            userProfile.increment('rank2', {by: 1, where: {userId: p[i].userId}})
                                            userProfile.increment('points', {by: 50, where: {userId: p[i].userId}})
                                            if (totalPost.length >= 25){
                                                userProfile.increment('stars', {by: 30, where: {userId: p[i].userId}})
                                                winnerObj['stars'] = 30
                                            }
                                            else {
                                                winnerObj['stars'] = 0
                                            }
                                        }
                                        if (rank == 3){
                                            userProfile.increment('rank3', {by: 1, where: {userId: p[i].userId}})
                                            userProfile.increment('points', {by: 30, where: {userId: p[i].userId}})
                                            if (totalPost.length >= 25){
                                                userProfile.increment('stars', {by: 20, where: {userId: p[i].userId}})
                                                winnerObj['stars'] = 20
                                            }
                                            else {
                                                winnerObj['stars'] = 0
                                            }
                                        }
                                        if (rank > 3){
                                            userProfile.increment('rank10', {by: 1, where: {userId: p[i].userId}})
                                            userProfile.increment('points', {by: 10, where: {userId: p[i].userId}})
                                            if (totalPost.length >= 25){
                                                userProfile.increment('stars', {by: 10, where: {userId: p[i].userId}})
                                                winnerObj['stars'] = 10
                                            }
                                            else {
                                                winnerObj['stars'] = 0
                                            }
                                        }
                                    }
                                    else if (rankList[r] == "intermediate"){
                                        if (rank == 1){
                                            userProfile.increment('rank1', {by: 1, where: {userId: p[i].userId}})
                                            userProfile.increment('points', {by: 500, where: {userId: p[i].userId}})
                                            if (totalPost.length >= 25){
                                                userProfile.increment('stars', {by: 200, where: {userId: p[i].userId}})
                                                winnerObj['stars'] = 200
                                            }
                                            else {
                                                winnerObj['stars'] = 0
                                                userProfile.increment('tickets', {by: 1, where: {userId: p[i].userId}})
                                            }
                                        }
                                        if (rank == 2){
                                            userProfile.increment('rank2', {by: 1, where: {userId: p[i].userId}})
                                            userProfile.increment('points', {by: 300, where: {userId: p[i].userId}})
                                            if (totalPost.length >= 25){
                                                userProfile.increment('stars', {by: 100, where: {userId: p[i].userId}})
                                                winnerObj['stars'] = 100
                                            }
                                            else {
                                                winnerObj['stars'] = 0
                                                userProfile.increment('tickets', {by: 1, where: {userId: p[i].userId}})
                                            }
                                        }
                                        if (rank == 3){
                                            userProfile.increment('rank3', {by: 1, where: {userId: p[i].userId}})
                                            userProfile.increment('points', {by: 200, where: {userId: p[i].userId}})
                                            if (totalPost.length >= 25){
                                                userProfile.increment('stars', {by: 70, where: {userId: p[i].userId}})
                                                winnerObj['stars'] = 70
                                            }
                                            else {
                                                winnerObj['stars'] = 0
                                                userProfile.increment('tickets', {by: 1, where: {userId: p[i].userId}})
                                            }
                                        }
                                        if (rank > 3){
                                            userProfile.increment('rank10', {by: 1, where: {userId: p[i].userId}})
                                            userProfile.increment('points', {by: 100, where: {userId: p[i].userId}})
                                            if (totalPost.length >= 25){
                                                userProfile.increment('stars', {by: 50, where: {userId: p[i].userId}})
                                                winnerObj['stars'] = 50
                                            }
                                            else {
                                                winnerObj['stars'] = 0
                                                userProfile.increment('tickets', {by: 1, where: {userId: p[i].userId}})
                                            }
                                        }
                                    }
                                    else {
                                        if (rank == 1){
                                            userProfile.increment('rank1', {by: 1, where: {userId: p[i].userId}})
                                            userProfile.increment('points', {by: 1000, where: {userId: p[i].userId}})
                                            if (totalPost.length >= 25){
                                                userProfile.increment('stars', {by: 500, where: {userId: p[i].userId}})
                                                winnerObj['stars'] = 500
                                            }
                                            else {
                                                winnerObj['stars'] = 0
                                                userProfile.increment('tickets', {by: 3, where: {userId: p[i].userId}})
                                            }
                                        }
                                        if (rank == 2){
                                            userProfile.increment('rank2', {by: 1, where: {userId: p[i].userId}})
                                            userProfile.increment('points', {by: 700, where: {userId: p[i].userId}})
                                            if (totalPost.length >= 25){
                                                serProfile.increment('stars', {by: 300, where: {userId: p[i].userId}})
                                                winnerObj['stars'] = 300
                                            }
                                            else {
                                                winnerObj['stars'] = 0
                                                userProfile.increment('tickets', {by: 3, where: {userId: p[i].userId}})
                                            }
                                        }
                                        if (rank == 3){
                                            userProfile.increment('rank3', {by: 1, where: {userId: p[i].userId}})
                                            userProfile.increment('points', {by: 500, where: {userId: p[i].userId}})
                                            if (totalPost.length >= 25){
                                                userProfile.increment('stars', {by: 200, where: {userId: p[i].userId}})
                                                winnerObj['stars'] = 200
                                            }
                                            else {
                                                winnerObj['stars'] = 0
                                                userProfile.increment('tickets', {by: 3, where: {userId: p[i].userId}})
                                            }
                                        }
                                        if (rank > 3){
                                            userProfile.increment('rank10', {by: 1, where: {userId: p[i].userId}})
                                            userProfile.increment('points', {by: 200, where: {userId: p[i].userId}})
                                            if (totalPost.length >= 25){
                                                userProfile.increment('stars', {by: 100, where: {userId: p[i].userId}})
                                                winnerObj['stars'] = 100
                                            }
                                            else {
                                                winnerObj['stars'] = 0
                                                userProfile.increment('tickets', {by: 3, where: {userId: p[i].userId}})
                                            }
                                        }
                                    }
        
                                    voteWinners.create({
                                        round: round + 1,
                                        rank: rank,
                                        category: cateList[c],
                                        userId: p[i].userId
                                    })
                                }
                            }
                            if (buf == cateList.length * rankList.length) {
                                for (userId in WinnerList) {
                                    userProfile.update({
                                        winner: WinnerList[userId]
                                    },{
                                        where: {
                                            userId: userId
                                        }
                                    }).then(function(){
                                        round = newRound
                                        currentTimeline = Date.parse(startTimeline) + round*7*24*60*60*1000
                                    })
                                }
                            }
                        })
                    })
                }
            }
        }
    }, 1000)

    //aws upload
    function uploadFile(file, filename) {
        const fileStream =  fs.createReadStream(file.path)

        const uploadParams = {
            Bucket: bucketName,
            Body: fileStream,
            Key: "fd-media/" + filename,
            ContentType: file.type
        }

        return s3.upload(uploadParams).promise()
    }
    //aws remove
    function removeFile(filename) {
        const uploadParams = {
            Bucket: bucketName,
            Key: "fd-media/" + filename
        }

        return s3.deleteObject(uploadParams, function (err) {
            console.log(err)
            console.log("deleted")
        }).promise()
    }

    app.get("/", function(req, res) {
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false  
            const rank = req.query.rank
            let homeRank = "Sơ cấp"
            if (!rank){
                res.redirect("/?rank=primary")
            }
            else {
                userProfile.findOne({
                    raw: true,
                    where: {    
                        userId: req.user.userId
                    }
                }).then(function(profile){
                    const enjoyList = [], finalRewardList = [], cateRewardList = []
                    let count = sum = 0
                    for (let i = 0; i < cateList.length; i++){
                        posts.count({
                            where: {
                                category: cateList[i],
                                rank: rank,
                                time: {
                                    [Op.gte]: currentTimeline
                                },
                                auth: true
                            }
                        }).then(function(cateTotal){
                            enjoyList[i] = cateTotal
                            sum += cateTotal
                            count ++
                            if (count == cateList.length) {
                                let buf1, buf2, buf3, buf4 = 0
                                if (rank == 'primary'){homeRank = "Sơ cấp", buf1 = 0.12, buf2 = 0.06, buf3 = 0.03, buf4 = 0.09}
                                if (rank == 'intermediate'){homeRank = "Trung cấp", buf1 = 0.24, buf2 = 0.12, buf3 = 0.06, buf4 = 0.18}
                                if (rank == 'highgrade'){homeRank = "Cao cấp", buf1 = 0.72, buf2 = 0.36, buf3 = 0.18, buf4 = 0.54}
                                finalRewardList[0] = (Math.round((sum * buf1) * 100) / 100).toFixed(2)
                                finalRewardList[1] = (Math.round((sum * buf2) * 100) / 100).toFixed(2)
                                finalRewardList[2] = (Math.round((sum * buf3) * 100) / 100).toFixed(2)
                                for (let j = 0; j < enjoyList.length; j++){
                                    if (sum > 0){
                                        cateRewardList[j] = (Math.round(((enjoyList[j]/sum) * buf4) * 100) / 100).toFixed(2)
                                    }
                                    else {cateRewardList[j] = '0.00'}
                                }
                                res.render("home", {username: req.user.username, userId: req.user.userId, profile: profile, active: "home", cateActive: '', cateName: '', nameList: cateName, cateList: cateList, finalRewardList: finalRewardList, cateRewardList: cateRewardList, rankLink: '', rankName: homeRank, modal: false})
                            }
                        })
                    }
                })
            }
            
        }
        else {
            res.redirect("/login")
        }
    })

    function explore(req, res, modal){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false   
            const payment = req.query.payment
            let rank = req.query.rank
            let rankName = "Sơ cấp"
            if (!rank) {rank = 'primary'}
            if (rank == 'primary'){rankName = 'Sơ cấp'}
            if (rank == 'intermediate'){rankName = 'Trung cấp'}
            if (rank == 'highgrade'){rankName = 'Cao cấp'}
            if (payment){
                if ((payment == "success")){modal = "alert-success"}
                else {modal = "alert-failure"}
            }
            userProfile.findOne({
                raw: true,
                where: {    
                    userId: req.user.userId
                }
            }).then(function(profile){
                posts.findAll({
                    raw: true,
                    include : [{
                        model: users,
                    },],
                    order: [
                        Sequelize.fn( 'RAND' ),
                    ],
                    limit: 5,
                    where: {
                        rank: rank,
                        auth: true,
                        time: {
                            [Op.gte]: currentTimeline
                        }
                    }
                }).then(function(p){
                    const postProfile = []
                    const saved = []
                    const postLiked = []
                    const followed = []
                    let buf = 0
                    let winnerCongrat = []
                    if (profile.new){
                        newUser = true
                        userProfile.update({
                            new: false
                        }, {
                            where: {
                                userId: req.user.userId
                            }
                        })
                    }
                    else {newUser = false}
                    if (profile.winner.length != 0){
                        winnerCongrat = profile.winner
                        userProfile.update({
                            winner: []
                        },{
                            where: {
                                userId: req.user.userId
                            }
                        })
                    }
                    if (p.length != 0){
                        const root =  __dirname.replace('\controllers', '')
                        for (let i = 0; i < p.length; i++){      
                            userProfile.findOne({
                                raw: true,
                                where: {
                                    userId: p[i]['user.userId']
                                }
                            }).then(function(pp){
                                postProfile[i] = pp
                                postLikes.findAll({
                                    raw: true,
                                    where: {
                                        postId: p[i].postId
                                    }
                                }).then(function(pl){
                                    postSaved.findOne({
                                        where: {
                                            postId: p[i].postId,
                                            userId: p[i]['user.userId']
                                        }
                                    }).then(function(s){
                                        if (s){saved[i] = true}
                                        else {saved[i] = false}
                                        postLiked[i] = false
                                        for (let c = 0; c < pl.length; c++){
                                            if (pl[c].userId == req.user.userId) {
                                                postLiked[i] = true
                                            }
                                        }
                                        follow.findOne({
                                            where: {
                                                user1: profile.userId,
                                                user2: pp.userId
                                            }
                                        }).then(function(fl){
                                            buf ++
                                            if (fl) {followed[i] = true}
                                            else {followed[i] = false}
                                            if (buf == p.length){
                                                res.render("explore", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, postProfile: postProfile, saved: saved, postLiked: postLiked, followed: followed, active: 'explore', rankLink: '', rankName: rankName, cateActive: 'explore', cateName: '', rank: false, winnerCongrat: winnerCongrat, modal: modal, newUser: newUser, roundType: roundType})
                                            }
                                        })
                                    })
                                })
                            })
                        }
                    }
                    else {
                        res.render("explore", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, active: 'explore', rankLink: '', cateActive: 'explore', cateName: '', rankName: rankName, rank: false, winnerCongrat: winnerCongrat, modal: modal, newUser: newUser, roundType: roundType})
                    }
                })
            })
        }
        else {
            res.redirect("/login")
        }
    }

    io.on("connection", function(socket){
        let postList = []
        socket.on("displayed post", function(postDisplayed){
            postList = postDisplayed
        })

        socket.on("/validate-video", function(data){
            posts.findOne({
                where: {
                    postId: data.postId
                }
            }).then(function(p){
                if (p){
                    if (data.validData == "true"){
                        posts.update({
                            time: Date.now(),
                            auth: true
                        },{
                            where: {
                                postId: data.postId
                            }
                        }).then(function(){
                            io.sockets.emit("video-validated", data.postId)
                        })
                    }
                    else {

                        //azure
                        // const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
                        // const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
                        // const containerClient = blobServiceClient.getContainerClient("fd-media");
                        // for (let i = 0; i < p.file.path.length; i++){
                        //     const blockBlobClient = containerClient.getBlockBlobClient(p.file.path[i])
                        //     blockBlobClient.delete();
                        // }

                        //gg
                        // for (let i = 0; i < p.file.path.length; i++){
                            // (async function() {
                            //     await cfFileBucket.file("fd-media/" + p.file.path[i]).delete();
                            // })();
                        // }

                        //aws
                        for (let i = 0; i < p.file.path.length; i++){
                            removeFile(p.file.path[i])
                        }
                        
                        posts.destroy({
                            where: {
                                postId: data.postId
                            }
                        }).then(function(){
                            io.sockets.emit("video-validated", data.postId)
                        })
                    }
                }
            })
        })

        setInterval(function(){
            posts.findAll({
                where: {
                    auth: false,
                    postId: {
                        [Op.notIn]: postList
                    }
                }
            }).then(function(p){
                if (p.length != 0){
                    postList.push(p.postId)
                    socket.emit("post need moderate", p)
                }
            })
        }, 1000)

        socket.on('disconnect', () => {
            socket.removeAllListeners()
        })
    })

    app.get("/moderate", function(req, res){
        if (req.isAuthenticated()){
            users.findOne({
                where: {
                    userId: req.user.userId
                }
            }).then(function(user){
                if (user.role == "moderator"){
                    req.session.tryTime = 0
                    req.session.blockLogin = false
                    posts.findAll({
                        where: {
                            auth: false
                        },
                        order: [
                            ['time', 'ASC']
                        ],
                    }).then(function(p){
                        res.render("moderate", {posts: p})
                    })
                }
                else {
                    res.render("notfound")
                }
            })
        }
        else {
            res.redirect("/login")
        }
    })

    app.get("/explore", function(req, res){
        explore(req, res, false)
    })

    app.get("/create-post", function(req, res){
        explore(req, res, 'create-post')
    })

    app.get("/ticket-payment", function(req, res){
        explore(req, res, 'ticket-payment')
    })

    app.get("/star-reward", function(req, res){
        explore(req, res, 'star-reward')
    })

    app.post("/card-modal", function(req, res){
        userProfile.findOne({
            where: {
                userId: req.user.userId
            }
        }).then(function(profile){
            cardNumber.findOne({
                where: {
                    userId: req.user.userId
                }
            }).then(function(c){
                if (c){
                    const card = c.card.toString()
                    res.json({
                        status: 'exist',
                        card: card.substring(card.length - 4, card.length),
                        starStatus: profile.starStatus
                    })
                }
                else {
                    res.json({
                        status: 'not exist',
                        starStatus: profile.starStatus
                    })
                }
            })
        })
    })

    app.post("/update-card", function(req, res){
        if (req.body.cardNumber != '' && req.body.bankName != ''){
            cardNumber.findOne({
                where: {
                    card: req.body.cardNumber,
                    name: req.body.bankName,
                    userId: req.user.userId
                }
            }).then(function(card){
                if (!card){
                    cardNumber.create({
                        card: req.body.cardNumber,
                        name: req.body.bankName,
                        userId: req.user.userId
                    }).then(function(){
                        res.json({
                            status: "done"
                        })
                    })
                }
                else {
                    res.json({
                        status: "done"
                    })
                }
            })
        }
        else {
            res.json({
                status: "empty"
            })
        }
    })

    app.post("/update-star-status", function(req, res) {
        userProfile.update({
            starStatus: req.body.status
        }, {
            where: {
                userId: req.user.userId
            }
        }).then(function(){
            res.end()
        })
    })

    app.post("/payment", function(req, res){
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "https://fodance.com/payment-success",
                "cancel_url": "https://fodance.com/payment-cancel",
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Vé Fodance",
                        "sku": "001",
                        "price": "1",
                        "currency": "USD",
                        "quantity": req.body.totalAmount
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": req.body.totalCost
                },
                "description": "Vé tham gia bình chọn Fodance"
            }]
        }
    
        paypal.payment.create(create_payment_json, function(error, payment){
            if (error) {
                throw error
            }
            else {
                for (let i = 0; i < payment.links.length; i++){
                    if (payment.links[i].rel === "approval_url"){
                        res.redirect(payment.links[i].href)
                    }
                }
            }
        })
    })
    
    app.get("/payment-success", function(req, res){
        const payerId = req.query.PayerID
        const paymentId = req.query.paymentId
        
        const execute_payment_json = {
            "payer_id": payerId,
            // "transactions": [{
            //     "amount": {
            //         "currency": "USD",
            //         "total": "5.00"
            //     }
            // }]
        }
    
        paypal.payment.execute(paymentId, execute_payment_json, function(error, payment){
            if (error){
                res.render("notfound")
            }
            else {
                userProfile.increment('tickets', {by: payment.transactions[0].item_list.items[0].quantity, where: {userId: req.user.userId}}).then(function(){
                    res.redirect("/?payment=success")
                })
            }
        })
    })
    
    app.get("/payment-cancel", function(req, res){
        res.redirect("/?payment=failure")
    })

    for (let i = 0; i < navList.length; i++){
        app.get(`/${navList[i]}`, function(req, res){
            if (req.isAuthenticated()){
                req.session.tryTime = 0
                req.session.blockLogin = false
                userProfile.findOne({
                    raw: true,
                    where: {
                        userId: req.user.userId
                    }
                }).then(function(profile){   
                    if (i == 0){
                        userProfile.findAll({
                            order: [
                                ['points', 'DESC'],
                            ],
                            limit: 10
                        }).then(function(topFames){
                            let count = 0
                            const topFameUsers = []
                            for (let t = 0; t < topFames.length; t++){
                                users.findOne({
                                    where: {
                                        userId: topFames[t].userId
                                    }
                                }).then(function(user){
                                    count ++
                                    topFameUsers[t] = user.username
                                    if (count == topFames.length){
                                        res.render(navList[i], {topFames: topFames, topFameUsers: topFameUsers, username: req.user.username, userId: req.user.userId, profile: profile, rankLink: '', rankName: '', cateActive: '', active: navList[i], cateName: navName[i], modal: false})
                                    }
                                })
                            }
                        })
                    } 
                    else if (i == 1) {
                        const notificationProfile = [], notificationName = [], read = []
                        let count = 0
                        notifications.findAll({
                            where: {
                                userId: req.user.userId,
                            },
                            order: [
                                ['time', 'DESC'],
                            ],
                            limit: 20
                        }).then(function(n){
                            if (n.length != 0){
                                for (let t = 0; t < n.length; t++){
                                    read[t] = n[t].read
                                }
                                notifications.update({
                                    read: true
                                },{
                                    where: {
                                        userId: req.user.userId
                                    }
                                }).then(function(){
                                    for (let t = 0; t < n.length; t++){
                                        userProfile.findOne({
                                            where: {
                                                userId: n[t].sourceUser
                                            }
                                        }).then(function(p){
                                            notificationProfile[t] = p
                                            users.findOne({
                                                where: {
                                                    userId: n[t].sourceUser
                                                }
                                            }).then(function(u){
                                                count ++
                                                notificationName[t] = u.username
                                                if (count == n.length){
                                                    res.render(navList[i], {notifications: n, notificationProfile: notificationProfile, notificationName: notificationName, read: read, username: req.user.username, userId: req.user.userId, profile: profile, rankLink: '', rankName: '', cateActive: '', active: navList[i], cateName: navName[i], modal: false})
                                                }
                                            })
                                        })
                                    }
                                })
                            }
                            else {
                                res.render(navList[i], {notifications: n, notificationProfile: notificationProfile,notificationName: notificationName, read: read, username: req.user.username, userId: req.user.userId, profile: profile, rankLink: '', rankName: '', cateActive: '', active: navList[i], cateName: navName[i], modal: false})
                            }
                        })
                    } 
                    else if (i == 2) {
                        postSaved.findAll({
                            where: {
                                userId: req.user.userId
                            },
                            order: [
                                ['time', 'DESC'],
                            ],
                            limit: 5
                        }).then(function(postList){
                            const savePosts = [], postUsername = [], postProfile = [], postLiked = [], followed = []
                            let buf = 0
                            if (postList != 0){
                                for (let t = 0; t < postList.length; t++){
                                    posts.findOne({
                                        where: {
                                            postId: postList[t].postId,
                                            auth: true
                                        }
                                    }).then(function(p){
                                        savePosts[t] = p
                                        users.findOne({
                                            where: {
                                                userId: p.userId
                                            }
                                        }).then(function(u){
                                            postUsername[t] = u.username
                                            userProfile.findOne({
                                                raw: true,
                                                where: {
                                                    userId: p.userId
                                                }
                                            }).then(function(pp){
                                                postProfile[t] = pp
                                                postLikes.findAll({
                                                    raw: true,
                                                    where: {
                                                        postId: p.postId
                                                    }
                                                }).then(function(pl){
                                                    postLiked[t] = false
                                                    for (let c = 0; c < pl.length; c++){
                                                        if (pl[c].userId == req.user.userId) {
                                                            postLiked[t] = true
                                                        }
                                                    }
                                                    follow.findOne({
                                                        where: {
                                                            user1: profile.userId,
                                                            user2: pp.userId
                                                        }
                                                    }).then(function(fl){
                                                        buf ++
                                                        if (fl) {followed[t] = true}
                                                        else {followed[t] = false}
                                                        if (buf == postList.length){    
                                                            res.render(navList[i], {username: req.user.username, userId: req.user.userId, profile: profile, posts: savePosts, postUsername: postUsername, postProfile: postProfile, postLiked: postLiked, followed: followed, rankLink: '', rankName: '', cateActive: '', active: navList[i], cateName: navName[i], modal: false})
                                                        }
                                                    })
                                                })
                                            })
                                        })
                                    })
                                }
                            }
                            else {
                                res.render(navList[i], {username: req.user.username, userId: req.user.userId, profile: profile, posts: savePosts, rankLink: '', rankName: '', cateActive: '', active: navList[i], cateName: navName[i], modal: false})
                            }
                        })
                    }
                    else if (i == 3) {
                        const currentRound = Math.floor((Date.now() - startTimeline)/1000/60/60/24/7)
                        voteWinners.findAll({
                            raw: true,
                            where: {
                                round: currentRound
                            },
                            order: [
                                ['rank', 'ASC'],
                            ],
                        }).then(function(winners){
                            const profileWinner = [], usernameWinner = [], empty = []
                            let count = 0
                            for (let c = 0; c < cateList.length; c++){
                                empty[c] = true
                                for (let w = 0; w < winners.length; w++){
                                    if (winners[w].category == cateList[c]) {empty[c] = false}
                                }
                            }
                            if (winners.length != 0){
                                for (let t = 0; t < winners.length; t++){
                                    userProfile.findOne({
                                        where: {
                                            userId: winners[t].userId
                                        }
                                    }).then(function(p){
                                        profileWinner[t] = p
                                        users.findOne({
                                            here: {
                                                userId: winners[t].userId
                                            }
                                        }).then(function(u){
                                            count ++
                                            usernameWinner[t] = u.username
                                            if (count == winners.length){
                                                res.render(navList[i], {cateList: cateList, topicName: cateName, currentRound: currentRound, empty: empty, winners: winners, usernameWinner:usernameWinner, profileWinner: profileWinner, username: req.user.username, userId: req.user.userId, profile: profile, rankLink: '', rankName: '', cateActive: '', active: navList[i], cateName: navName[i], modal: false})
                                            }
                                        })
                                    })
                                }
                            }
                            else {
                                res.render(navList[i], {cateList: cateList, topicName: cateName, currentRound: currentRound, empty: empty, winners: winners, usernameWinner: usernameWinner, profileWinner: profileWinner, username: req.user.username, userId: req.user.userId, profile: profile, rankLink: '', rankName: '', cateActive: '', active: navList[i], cateName: navName[i], modal: false})
                            }
                        })
                    }
                    else if (i == 4) {
                        addTopic.findAll({
                            where: {
                                userId: req.user.userId
                            }
                        }).then(function(topics){
                            res.render(navList[i], {topics: topics, username: req.user.username, userId: req.user.userId, profile: profile, rankLink: '', rankName: '', cateActive: '', active: navList[i], cateName: navName[i], modal: false})
                        })
                    }
                    else if (i == 5){
                        userProfile.findOne({
                            where: {
                                userId: req.user.userId
                            }
                        }).then(function(profile){
                            res.render(navList[i], {followCheck: profile.followNotification, voteFollowCheck: profile.voteFollowNotification, postFollowCheck: profile.postFollowNotification, username: req.user.username, userId: req.user.userId, profile: profile, rankLink: '', rankName: '', cateActive: '', active: navList[i], cateName: navName[i], modal: false})
                        })
                    }
                    else {
                        res.render(navList[i], {username: req.user.username, userId: req.user.userId, profile: profile, rankLink: '', rankName: '', cateActive: '', active: navList[i], cateName: navName[i], modal: false})
                    }
                })
            }
            else {
                res.redirect('/login')
            }
        })
    }

    for (let c = 0; c < cateList.length; c++){
        app.get(`/${cateList[c]}`,function(req, res){
            if (cateList[c] != "explore"){categoryList = [cateList[c]]} else {categoryList = cateList}
            const rank = req.query.rank
            if (rank == "primary" || rank == "intermediate" || rank == "highgrade"){
                if (req.isAuthenticated()){
                    req.session.tryTime = 0
                    req.session.blockLogin = false
                    let rankName = ''
                    if (rank == 'primary'){rankName = 'Sơ cấp'}
                    if (rank == 'intermediate'){rankName = 'Trung cấp'}
                    if (rank == 'highgrade'){rankName = 'Cao cấp'}
                    userProfile.findOne({
                        raw: true,
                        where: {
                            userId: req.user.userId
                        }
                    }).then(function(profile){
                        posts.findAll({
                            raw: true,
                            include : [{
                                model: users,
                            }],
                            order: [
                                ['like', 'DESC'],
                                ['time', 'ASC']
                            ],
                            where: {
                                category: {
                                    [Op.in]: categoryList
                                },
                                time: {
                                    [Op.gte]: currentTimeline
                                },
                                rank: rank,
                                auth: true
                            },
                            limit: 5
                        }).then(function(p){
                            const postProfile = []
                            const saved = []
                            const postLiked = []
                            const followed = []
                            let buf = 0
                            if (p.length != 0){
                                for (let i = 0; i < p.length; i++){
                                    userProfile.findOne({
                                        raw: true,
                                        where: {
                                            userId: p[i]['user.userId']
                                        }
                                    }).then(function(pp){
                                        postProfile[i] = pp
                                        postLikes.findAll({
                                            raw: true,
                                            where: {
                                                postId: p[i].postId
                                            }
                                        }).then(function(pl){
                                            postSaved.findOne({
                                                where: {
                                                    postId: p[i].postId,
                                                    userId: p[i]['user.userId']
                                                }
                                            }).then(function(s){
                                                if (s){saved[i] = true}
                                                else {saved[i] = false}
                                                postLiked[i] = false
                                                for (let c = 0; c < pl.length; c++){
                                                    if (pl[c].userId == req.user.userId) {
                                                        postLiked[i] = true
                                                    }
                                                }
                                                follow.findOne({
                                                    where: {
                                                        user1: profile.userId,
                                                        user2: pp.userId
                                                    }
                                                }).then(function(fl){
                                                    buf ++
                                                    if (fl) {followed[i] = true}
                                                    else {followed[i] = false}
                                                    if (buf == p.length){
                                                        res.render("explore", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, postProfile: postProfile, saved: saved, postLiked: postLiked, followed: followed, active: 'explore', rankLink: rank, rankName: rankName, cateActive: cateList[c], cateName: cateName[c], rank: true, winnerCongrat: false, modal: false, newUser: false, roundType: roundType})
                                                    }
                                                })
                                            })
                                        })
                                    })
                                }
                            }
                            else {
                                res.render("explore", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, active: 'explore', rankLink: rank, rankName: rankName, cateActive: cateList[c], cateName: cateName[c], rank: true, winnerCongrat: false, modal: false, newUser: false, roundType: roundType})
                            }
                        })
                    })
                }
                else {
                    res.redirect("/login")
                }
            }
            else {
                res.render("notfound")
            }
        })
    }

    app.post("/top-suggestion", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            const topSuggestion = [], userSuggestion = [], profileSuggestion = [], followingList = []
            userProfile.findOne({
                where: {
                    userId: req.user.userId
                }
            }).then(function(pf){
                follow.findAll({
                    where: {
                        user1: pf.userId
                    }
                }).then(function(f){
                    followingList.push(req.user.userId)
                    for (let i = 0; i < f.length; i++){
                        followingList.push(f[i].user2)
                    }
                    userProfile.findAll({
                        where: {
                            userId: {
                                [Op.notIn]: followingList
                            }
                        },
                        order: [
                            ['followers', 'DESC']
                        ],
                        limit: 20
                    }).then(function(topFollow){
                        let max = 5, count = 0
                        if (topFollow.length < 5){max = topFollow.length}
                        while (topSuggestion.length < max){
                            const random = Math.floor(Math.random() * topFollow.length)
                            if (!topSuggestion.includes(topFollow[random].userId)){
                                topSuggestion.push(topFollow[random].userId)
                            }
                        }
                        if (topSuggestion.length != 0){
                            for (let i = 0; i < topSuggestion.length; i++){
                                users.findOne({
                                    raw: true,
                                    where: {
                                        userId: topSuggestion[i]
                                    }
                                }).then(function(us){
                                    userSuggestion[i] = us.username
                                    userProfile.findOne({
                                        raw: true,
                                        where: {
                                            userId: topSuggestion[i]
                                        }
                                    }).then(function(ps){
                                        count ++
                                        profileSuggestion[i] = ps
                                        if (count == topSuggestion.length){
                                            res.json({
                                                topSuggestion: topSuggestion,
                                                userSuggestion: userSuggestion,
                                                profileSuggestion: profileSuggestion,
                                            })
                                        }
                                    })
                                }) 
                            }
                        }
                        else {
                            res.json({
                                topSuggestion: topSuggestion,
                                userSuggestion: userSuggestion,
                                profileSuggestion: profileSuggestion,
                            })
                        }
                    })
                })
            })
        }
        else {
            res.redirect('/login')
        }
    })

    app.post("/create-post", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            users.findOne({
                where: {
                    userId: req.user.userId
                }
            }).then(function(user){
                userProfile.findOne({
                    where: {
                        userId: req.user.userId
                    }
                }).then(function(profile){
                    res.json({
                        username: user.username,
                        avatar: profile.avatar,
                        nickname: profile.nickname
                    })
                })
            })
        }
        else {
            res.redirect('/login')
        }
    })
    
    app.post("/rank-sort-content",function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            if (req.body.category != '') {postCategory = cateList} else {postCategory = [req.body.category]}
            // if (req.body.category != '' && req.body.filter == "current"){
                userProfile.findOne({
                    raw: true,
                    where: {
                        userId: req.user.userId
                    }
                }).then(function(profile){
                    posts.findAll({
                        raw: true,
                        include : [{
                            model: users,
                        }],
                        order: [
                            ['like', 'DESC'],
                            ['time', 'ASC']
                        ],
                        limit: 5,
                        where: {
                            category: {
                                [Op.in] : postCategory
                            },
                            time: {
                                [Op.gte]: currentTimeline
                            },
                            rank: req.body.rankLink,
                            auth: true
                        }
                    }).then(function(p){
                        // if (p[0] && p[0].category == ''){res.end()}
                        // else{
                            const postProfile = []
                            const saved = []
                            const postLiked = []
                            const followed = []
                            let buf = 0
                            if (p.length != 0){
                                for (let i = 0; i < p.length; i++){
                                    userProfile.findOne({
                                        raw: true,
                                        where: {
                                            userId: p[i]['user.userId']
                                        }
                                    }).then(function(pp){
                                        postProfile[i] = pp
                                        postLikes.findAll({
                                            raw: true,
                                            where: {
                                                postId: p[i].postId
                                            }
                                        }).then(function(pl){
                                            postSaved.findOne({
                                                where: {
                                                    postId: p[i].postId,
                                                    userId: p[i]['user.userId']
                                                }
                                            }).then(function(s){
                                                if (s){saved[i] = true}
                                                else {saved[i] = false}
                                                postLiked[i] = false
                                                for (let c = 0; c < pl.length; c++){
                                                    if (pl[c].userId == req.user.userId) {
                                                        postLiked[i] = true
                                                    }
                                                }
                                                follow.findOne({
                                                    where: {
                                                        user1: profile.userId,
                                                        user2: pp.userId
                                                    }
                                                }).then(function(fl){
                                                    buf ++
                                                    if (fl) {followed[i] = true}
                                                    else {followed[i] = false}
                                                    if (buf == p.length){
                                                        res.render("explore", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, postProfile: postProfile, saved: saved, postLiked: postLiked, followed: followed, active: 'explore', 
                                                        rankLink: req.body.rankLink, rankName: req.body.rankName, cateActive: req.body.category, cateName: '', rank: true, winnerCongrat: false, modal: false, newUser: false, roundType: roundType})
                                                    }                                                
                                                })
                                            })
                                        })
                                    })
                                }
                            }
                            else {
                                res.render("explore", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, active: 'explore', 
                                rankLink: req.body.rankLink, rankName: req.body.rankName, cateActive: req.body.category, cateName: '', rank: true, winnerCongrat: false, modal: false, newUser: false, roundType: roundType})
                            }
                        // }
                    })
                })
            // }
        }
        else {
            res.redirect("/login")
        }
    })

    app.post("/random-sort-content",function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            if (req.body.category != '') {postCategory = cateList} else {postCategory = [req.body.category]}
            // if (req.body.category != ''){
                let timeFilter
                if (req.body.filter == "current"){timeFilter = currentTimeline}
                else {timeFilter = startTimeline}
                userProfile.findOne({
                    raw: true,
                    where: {
                        userId: req.user.userId
                    }
                }).then(function(profile){
                    posts.findAll({
                        raw: true,
                        include : [{
                            model: users,
                        }],
                        order: [
                            Sequelize.fn( 'RAND' ),
                        ],
                        limit: 5,
                        where: {
                            category: {
                                [Op.in]: postCategory
                            },
                            time: {
                                [Op.gte]: timeFilter
                            },
                            rank: req.body.rankLink,
                            auth: true
                        }
                    }).then(function(p){
                        // if (p[0] && p[0].category == ''){res.end()}
                        // else {
                            const postProfile = []
                            const saved = []
                            const postLiked = []
                            const followed = []
                            let buf = 0
                            if (p.length != 0){
                                for (let i = 0; i < p.length; i++){
                                    userProfile.findOne({
                                        raw: true,
                                        where: {
                                            userId: p[i]['user.userId']
                                        }
                                    }).then(function(pp){
                                        postProfile[i] = pp
                                        postLikes.findAll({
                                            raw: true,
                                            where: {
                                                postId: p[i].postId
                                            }
                                        }).then(function(pl){
                                            postSaved.findOne({
                                                where: {
                                                    postId: p[i].postId,
                                                    userId: p[i]['user.userId']
                                                }
                                            }).then(function(s){
                                                if (s){saved[i] = true}
                                                else {saved[i] = false}
                                                postLiked[i] = false
                                                for (let c = 0; c < pl.length; c++){
                                                    if (pl[c].userId == req.user.userId) {
                                                        postLiked[i] = true
                                                    }
                                                }
                                                follow.findOne({
                                                    where: {
                                                        user1: profile.userId,
                                                        user2: pp.userId
                                                    }
                                                }).then(function(fl){
                                                    buf ++
                                                    if (fl) {followed[i] = true}
                                                    else {followed[i] = false}
                                                    if (buf == p.length){
                                                        res.render("explore", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, postProfile: postProfile, saved: saved, postLiked: postLiked, followed: followed, active: 'explore', 
                                                        rankLink: req.body.rankLink, rankName: req.body.rankName, cateActive: req.body.category, cateName: '', rank: false, winnerCongrat: false, modal: false, newUser: false, roundType: roundType})
                                                    }
                                                })
                                            })
                                        })
                                    })
                                }
                            }
                            else {
                                res.render("explore", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, active: 'explore', 
                                rankLink: req.body.rankLink, rankName: req.body.rankName, cateActive: req.body.category, cateName: '', rank: false, winnerCongrat: false, modal: false, newUser: false, roundType: roundType})
                            }
                        // }
                    })
                })
            // }
        }
        else {
            res.redirect("/login")
        }
    })

    app.post("/latest-sort-content",function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            if (req.body.category != '') {postCategory = cateList} else {postCategory = [req.body.category]}
            // if (req.body.category != ''){
                let timeFilter
                if (req.body.filter == "current"){timeFilter = currentTimeline}
                else {timeFilter = startTimeline}
                userProfile.findOne({
                    raw: true,
                    where: {
                        userId: req.user.userId
                    }
                }).then(function(profile){
                    posts.findAll({
                        raw: true,
                        include : [{
                            model: users,
                        }],
                        order: [
                            ['time', 'DESC']
                        ],
                        limit: 5,
                        where: {
                            category: {
                                [Op.in]: postCategory
                            },
                            time: {
                                [Op.gte]: timeFilter
                            },
                            rank: req.body.rankLink,
                            auth: true
                        }
                    }).then(function(p){
                        // if (p[0] && p[0].category == ''){res.end()}
                        // else {
                            const postProfile = []
                            const saved = []
                            const postLiked = []
                            const followed = []
                            let buf = 0
                            if (p.length != 0){
                                for (let i = 0; i < p.length; i++){
                                    userProfile.findOne({
                                        raw: true,
                                        where: {
                                            userId: p[i]['user.userId']
                                        }
                                    }).then(function(pp){
                                        postProfile[i] = pp
                                        postLikes.findAll({
                                            raw: true,
                                            where: {
                                                postId: p[i].postId
                                            }
                                        }).then(function(pl){
                                            postSaved.findOne({
                                                where: {
                                                    postId: p[i].postId,
                                                    userId: p[i]['user.userId']
                                                }
                                            }).then(function(s){
                                                if (s){saved[i] = true}
                                                else {saved[i] = false}
                                                postLiked[i] = false
                                                for (let c = 0; c < pl.length; c++){
                                                    if (pl[c].userId == req.user.userId) {
                                                        postLiked[i] = true
                                                    }
                                                }
                                                follow.findOne({
                                                    where: {
                                                        user1: profile.userId,
                                                        user2: pp.userId
                                                    }
                                                }).then(function(fl){
                                                    buf ++
                                                    if (fl) {followed[i] = true}
                                                    else {followed[i] = false}
                                                    if (buf == p.length){
                                                        res.render("explore", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, postProfile: postProfile, saved: saved, postLiked: postLiked, followed: followed, active: 'explore', 
                                                        rankLink: req.body.rankLink, rankName: req.body.rankName, cateActive: req.body.category, cateName: '', rank: false, winnerCongrat: false, modal: false, newUser: false, roundType: roundType})
                                                    }
                                                })
                                            })
                                        })
                                    })
                                }
                            }
                            else {
                                res.render("explore", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, active: 'explore', 
                                rankLink: req.body.rankLink, rankName: req.body.rankName, cateActive: req.body.category, cateName: '', rank: false, winnerCongrat: false, modal: false, newUser: false, roundType: roundType})
                            }
                        // }
                    })
                })
            // }
        }
        else {
            res.redirect("/login")
        }
    })    

    app.post("/follow-sort-content",function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            if (req.body.category != '') {postCategory = cateList} else {postCategory = [req.body.category]}
            // if (req.body.category != ''){
                let timeFilter
                if (req.body.filter == "current"){timeFilter = currentTimeline}
                else {timeFilter = startTimeline}
                userProfile.findOne({
                    raw: true,
                    where: {
                        userId: req.user.userId
                    }
                }).then(function(profile){
                    follow.findAll({
                        raw: true,
                        where: {
                            user1: profile.userId
                        },
                    }).then(function(fNicknames){
                        const postProfile = [], saved = [], postLiked = [], followUsers  = [], followed = []
                        let buf = 0
                        followUsers.push(req.user.userId)
                        if (fNicknames.length != 0){
                            for (let i = 0; i < fNicknames.length; i++){
                                userProfile.findOne({
                                    where: {
                                        userId: fNicknames[i].user2
                                    }
                                }).then(function(fUser){
                                    buf ++
                                    followUsers.push(fUser.userId)
                                    if (buf == fNicknames.length){
                                        posts.findAll({
                                            raw: true,
                                            distinct: true,
                                            include : [{
                                                model: users,
                                            }],
                                            order: [
                                                ['time', 'DESC']
                                            ],
                                            where: {
                                                category: {
                                                    [Op.in]: postCategory
                                                },
                                                time: {
                                                    [Op.gte]: timeFilter
                                                },
                                                rank: req.body.rankLink,
                                                userId: {
                                                    [Op.in]: followUsers
                                                },
                                                auth: true
                                            },
                                            limit: 5
                                        }).then(function(p){
                                            // if (p[0] && p[0].category == ''){res.end()}
                                            // else {
                                                if (p.length != 0){
                                                    let count = 0
                                                    for (let i = 0; i < p.length; i++){
                                                        userProfile.findOne({
                                                            raw: true,
                                                            where: {
                                                                userId: p[i]['user.userId']
                                                            }
                                                        }).then(function(pp){
                                                            postProfile[i] = pp
                                                            postLikes.findAll({
                                                                raw: true,
                                                                where: {
                                                                    postId: p[i].postId
                                                                }
                                                            }).then(function(pl){
                                                                postSaved.findOne({
                                                                    where: {
                                                                        postId: p[i].postId,
                                                                        userId: p[i]['user.userId']
                                                                    }
                                                                }).then(function(s){
                                                                    if (s){saved[i] = true}
                                                                    else {saved[i] = false}
                                                                    postLiked[i] = false
                                                                    for (let c = 0; c < pl.length; c++){
                                                                        if (pl[c].userId == req.user.userId) {
                                                                            postLiked[i] = true
                                                                        }
                                                                    }
                                                                    follow.findOne({
                                                                        where: {
                                                                            user1: profile.userId,
                                                                            user2: pp.userId
                                                                        }
                                                                    }).then(function(fl){
                                                                        if (fl) {followed[i] = true}
                                                                        else {followed[i] = false}
                                                                        count ++
                                                                        if (count == p.length){
                                                                            res.render("explore", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, postProfile: postProfile, saved: saved, postLiked: postLiked, followed: followed, active: 'explore', 
                                                                            rankLink: req.body.rankLink, rankName: req.body.rankName, cateActive: req.body.category, cateName: '', rank: false, winnerCongrat: false, modal: false, newUser: false, roundType: roundType})
                                                                        }
                                                                    })
                                                                })
                                                            })
                                                        })
                                                    }
                                                }
                                                else {
                                                    res.render("explore", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, active: 'explore', 
                                                    rankLink: req.body.rankLink, rankName: req.body.rankName, cateActive: req.body.category, cateName: '', rank: false, winnerCongrat: false, modal: false, newUser: false, roundType: roundType})
                                                }
                                            // }
                                        })
                                    }
                                })
                            }
                        }
                        else {
                            posts.findAll({
                                raw: true,
                                distinct: true,
                                include : [{
                                    model: users,
                                }],
                                order: [
                                    ['time', 'DESC']
                                ],
                                where: {
                                    category: {
                                        [Op.in]: postCategory
                                    },
                                    time: {
                                        [Op.gte]: timeFilter
                                    },
                                    rank: req.body.rankLink,
                                    userId: {
                                        [Op.in]: followUsers
                                    },
                                    auth: true
                                },
                                limit: 5
                            }).then(function(p){
                                // if (p[0] && p[0].category == ''){res.end()}
                                // else {
                                    if (p.length != 0){
                                        let count = 0
                                        for (let i = 0; i < p.length; i++){
                                            userProfile.findOne({
                                                raw: true,
                                                where: {
                                                    userId: p[i]['user.userId']
                                                }
                                            }).then(function(pp){
                                                postProfile[i] = pp
                                                postLikes.findAll({
                                                    raw: true,
                                                    where: {
                                                        postId: p[i].postId
                                                    }
                                                }).then(function(pl){
                                                    postSaved.findOne({
                                                        where: {
                                                            postId: p[i].postId,
                                                            userId: p[i]['user.userId']
                                                        }
                                                    }).then(function(s){
                                                        if (s){saved[i] = true}
                                                        else {saved[i] = false}
                                                        postLiked[i] = false
                                                        for (let c = 0; c < pl.length; c++){
                                                            if (pl[c].userId == req.user.userId) {
                                                                postLiked[i] = true
                                                            }
                                                        }
                                                        follow.findOne({
                                                            where: {
                                                                user1: profile.userId,
                                                                user2: pp.userId
                                                            }
                                                        }).then(function(fl){
                                                            if (fl) {followed[i] = true}
                                                            else {followed[i] = false}
                                                            count ++
                                                            if (count == p.length){
                                                                res.render("explore", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, postProfile: postProfile, saved: saved, postLiked: postLiked, followed: followed, active: 'explore', 
                                                                rankLink: req.body.rankLink, rankName: req.body.rankName, cateActive: req.body.category, cateName: '', rank: false, winnerCongrat: false, modal: false, newUser: false, roundType: roundType})
                                                            }
                                                        })
                                                    })
                                                })
                                            })
                                        }
                                    }
                                    else {
                                        res.render("explore", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, active: 'explore', 
                                        rankLink: req.body.rankLink, rankName: req.body.rankName, cateActive: req.body.category, cateName: '', rank: false, winnerCongrat: false, modal: false, newUser: false, roundType: roundType})
                                    }
                                // }
                            })
                        }
                    })
                })
            // } 
        }
        else {
            res.redirect("/login")
        }
    })
    
    //create-post
    app.post('/', function (req, res) {
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            function getRndInteger(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            }
            const paths = []
            const form = formidable({ multiples: true })
            form.parse(req, (err, fields, f) => {
                let fileValid = true
                const description = fields.description
                let category = fields.category
                let rank = fields.rank
                let competition = fields.competition
                let files = [f.file], file = {}
                if (!Array.isArray(files)) {
                    files = [files]
                }
                if (files){
                    for (let i = 0; i < files.length; i++){
                        if (files[i].type.includes("video") && files.length > 1) {fileValid = false}
                        const reg = /image\/jpeg|image\/jpg|image\/png|image\/gif|video\/mp4|video\/webm|video\/flv|video\/mov|video\/wmv|video\/avi/gi;
                        (async () => {
                            const mineType = await FileType.fromFile(files[i].path)
                            if (mineType.mime.match(reg) || files[i].size > 209715200 || files.length > 4) {fileValid = false}
                        })();
                    }
                }
                if (fileValid){
                    file.path = paths
                    if (files[0] == null) { file = null}
                    else if (files[0].type.includes('video')) {file.type = 'video'}
                    else {file.type = 'image' }
                    if ((description.length != 0 && description.length <= 1000) || f.file){
                        function postCreator(){
                            userProfile.findOne({
                                raw: true,
                                where: {
                                    userId: req.user.userId
                                }
                            }).then(function(profile){
                                if ((competition && f.file.type.includes("video")) || (cateList.includes(category) && f.file.type.includes("video")) || !cateList.includes(category)){
                                    if (rank == "primary" || rank == "intermediate" || rank == "highgrade" || rank == ''){
                                        if (cateList.includes(category) || category == ''){
                                            if ((category != '' && rank != '') || (category == '' && rank == '')){
                                                let ticketValid = true
                                                if (rank == "intermediate" && profile.tickets < 1){ticketValid = false}
                                                if (rank == "highgrade" && profile.tickets < 3){ticketValid = false}
                                                if (ticketValid){
                                                    function generatePost(){
                                                        const id = getRndInteger(1000000000000000, 10000000000000000)
                                                        posts.findOne({
                                                            where: {
                                                                postId: id
                                                            }
                                                        }).then(function(p){
                                                            if (!p){
                                                                function createPosts(){
                                                                    posts.create({ 
                                                                        postId: id,
                                                                        description: description,
                                                                        file: file,
                                                                        time: new Date(),
                                                                        like: 0,
                                                                        comment: 0,
                                                                        share: 0,
                                                                        category: category,
                                                                        rank: rank,
                                                                        competition: competition,
                                                                        videoViews: 0,
                                                                        auth: false,
                                                                        userId: req.user.userId
                                                                    }).then(function(newPost){
                                                                        function PostCreated() {
                                                                            if (rank == "intermediate"){
                                                                                userProfile.increment('tickets', {by: -1, where: {userId: req.user.userId}})
                                                                            }
                                                                            else if (rank == "highgrade"){
                                                                                userProfile.increment('tickets', {by: -3, where: {userId: req.user.userId}})
                                                                            }
                                                                            let cateNamePost = false, rankNamePost = false
                                                                            for (let c = 0; c < cateList.length; c++){
                                                                                if (cateList[c] == category){cateNamePost = cateName[c]}
                                                                            }
                                                                            for (let r = 0; r < rankList.length; r++){
                                                                                if (rankList[r] == rank){rankNamePost = rankName[r]}
                                                                            }
                                                                            const data = {
                                                                                username: req.user.username,
                                                                                userId: req.user.userId,
                                                                                profile: profile,
                                                                                post: newPost,
                                                                                category: category,
                                                                                rank: rank,
                                                                                cateNamePost: cateNamePost,
                                                                                rankNamePost: rankNamePost
                                                                            }
                                                                            res.json({
                                                                                status: "post-created",
                                                                                data: data
                                                                            })
                                                                        }
                                                                        if (f.file){
                                                                            sendModerateMail("fodancemoderator@gmail.com", id)
                                                                            const interv = setInterval(function(){
                                                                                posts.findOne({
                                                                                    where: {
                                                                                        postId: id
                                                                                    }
                                                                                }).then(function(postAuth){
                                                                                    if (postAuth){
                                                                                        if (postAuth.auth){
                                                                                            clearInterval(interv)
                                                                                            PostCreated()
                                                                                        }
                                                                                    }                                                                              
                                                                                    else {
                                                                                        clearInterval(interv)
                                                                                        res.json({
                                                                                            status: "post-invalid",
                                                                                        })
                                                                                    }
                                                                                })
                                                                            }, 5000)
                                                                        }
                                                                        else {
                                                                            posts.update({
                                                                                auth: true
                                                                            }, {
                                                                                where: {
                                                                                    postId: id
                                                                                }
                                                                            }).then(function(){
                                                                                PostCreated()
                                                                            })
                                                                        }
                                                                    })
                                                                }
                                                                createPosts()
                                                            }
                                                            else {
                                                                generatePost()
                                                            }
                                                        })
                                                    }
                                                    generatePost()
                                                }
                                                else {
                                                    res.json({
                                                        status: "not enough ticket"
                                                    })
                                                }
                                            }
                                            else {
                                                res.json({
                                                    status: "topic rank invalid"
                                                })
                                            }
                                        }
                                        else {
                                            res.json({
                                                status: "topic invalid"
                                            })
                                        }
                                    }
                                    else {
                                        res.json({
                                            status: "rank invalid"
                                        })
                                    }
                                }
                                else {
                                    res.json({
                                        status: "no files chosen"
                                    })
                                }
                            })
                        }
                        if (f.file){
                            for (let i = 0; i < files.length; i++){
                                var oldPath = files[i].path; 
                                var rawData = fs.readFileSync(oldPath)
                                // fs.writeFile(root + paths[i], rawData, function(err){
                                // })

                                //azure
                                // const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING)
                                // const containerClient = blobServiceClient.getContainerClient("fd-media")
                                // const blockBlobClient = containerClient.getBlockBlobClient(paths[i])
                                // const blobOptions = { blobHTTPHeaders: { blobContentType: files[i].type } }
                                // blockBlobClient.upload(rawData, files[i].size, blobOptions)

                                //gg
                                // const blob = cfFileBucket.file("fd-media/" + paths[i]);
                                // const blobStream = blob.createWriteStream();
                                // blobStream.end(rawData)
                                // blobStream.on('finish', () => {
                                //     postCreator()
                                // })

                                //aws
                                uploadFile(files[i], paths[i]).then(function(){
                                    postCreator()
                                })
                            }
                        }
                        else {
                            postCreator()
                        }
                    }
                    else {
                        res.json({
                            status: "create-error"
                        })
                    }
                }
                else {
                    res.json({
                        status: "create-error"
                    })
                }
            })
            form.on('fileBegin', function (name, file){
                let filename
                if (file.name > 255) { filename =  Date.now() + "_" + randomize('0', 6)}
                else { filename =  Date.now() + "_" + randomize('0', 6) + "_" + file.name}
                paths.push(filename)
            })
        }
        else {
            res.redirect('login')
        }
    })

    app.post("/search-scription", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            if (req.body.searchText.length > 0 && req.body.searchText.length <= 30){
                const result1 = [], result2 = [], resultBuf = [], userListed = [], counted = [], flArray = []
                let count1 = 0, count2 = 0, end = false
                function findByNickname(){
                    userProfile.findAll({
                        where: {
                            nickname: {
                                [Op.like]: '%' + req.body.searchText + '%'
                            },
                            userId: {
                                [Op.notIn]: userListed.concat(req.body.searchDisplayedList)
                            }
                        },
                        order: [
                            ['followers', 'DESC'],
                        ],
                        limit: 10
                    }).then(function(p){
                        if (p.length != 0){
                            for (let i = 0; i < p.length; i++){
                                users.findOne({
                                    where: {
                                        userId: p[i].userId
                                    }
                                }).then(function(pu){
                                    userProfile.findOne({
                                        where: {
                                            userId: req.user.userId
                                        }
                                    }).then(function(currentUser){
                                        follow.findOne({
                                            where: {
                                                user1: currentUser.userId,
                                                user2: p[i].userId
                                            }
                                        }).then(function(fl){
                                            let followed = false
                                            if (fl){followed = true}
                                            let description = ''
                                            if (p[i].description != null){
                                                description = p[i].description
                                            }
                                            result2[i] = [pu.userId, pu.username, p[i].nickname, p[i].avatar, description, followed]
                                            count2 ++
                                            if (count2 == p.length){
                                                res.json({
                                                    result: result1.concat(result2),
                                                    end: false
                                                })
                                            }
                                        })
                                    })
                                })
                            }
                        }
                        else {
                            if (result1.concat(result2).length == 0){end = true}
                            res.json({
                                result: result1.concat(result2),
                                end: end
                            })
                        }
                    })
                }
                users.findAll({
                    raw: true,
                    where: {
                        username: {
                            [Op.like]: '%' + req.body.searchText + '%'
                        },
                        userId: {
                            [Op.notIn]: req.body.searchDisplayedList
                        }
                    },
                    limit: 10
                }).then(function(u){
                    if (u.length != 0){
                        for (let i = 0; i < u.length; i++){
                            userProfile.findOne({
                                where: {
                                    userId: u[i].userId
                                }
                            }).then(function(up){
                                userListed[i] = up.userId
                                userProfile.findOne({
                                    where: {
                                        userId: req.user.userId
                                    }
                                }).then(function(currentUser){
                                    follow.findOne({
                                        where: {
                                            user1: currentUser.userId,
                                            user2: up.userId
                                        }
                                    }).then(function(fl){
                                        let followed = false
                                        if (fl){followed = true}
                                        let description = ''
                                        if (up.description != null){
                                            description = up.description
                                        }
                                        flArray[i] = [up.followers, up.userId]
                                        resultBuf[i] = [u[i].userId, u[i].username, up.nickname, up.avatar, description, followed]
                                        count1 ++
                                        if (count1 == u.length){
                                            flArray.sort()
                                            flArray.reverse()
                                            for (let i = 0; i < flArray.length; i++){
                                                for (let j = 0; j < resultBuf.length; j++){
                                                    if (flArray[i][1] == resultBuf[j][0]){
                                                        result1[i] = resultBuf[j]
                                                    }
                                                }
                                            }
                                            findByNickname()
                                        }
                                    })
                                })
                            })
                        }
                    }
                    else {
                        findByNickname()
                    }
                })
            }
        }
        else {
            res.redirect('/login')
        }
    })

    app.get("/search", function(req, res){
        if (Object.keys(req.query)[0] == 'q'){
            if (req.isAuthenticated()){
                req.session.tryTime = 0
                req.session.blockLogin = false
                if (req.body.searchDisplayedList) {
                    searchDisplayedList = req.body.searchDisplayedList
                }
                else {
                    searchDisplayedList = []
                }
                const result = [], result1 = [], result2 = [], resultBuf = [], userListed = [], counted = [], flArray = []
                let count1 = 0, count2 = 0, end = false
                function findByNickname(){
                    userProfile.findAll({
                        where: {
                            nickname: {
                                [Op.like]: '%' + req.query.q + '%'
                            },
                            userId: {
                                [Op.notIn]: userListed.concat(searchDisplayedList)
                            }
                        },
                        order: [
                            ['followers', 'DESC'],
                        ],
                        limit: 10
                    }).then(function(p){
                        if (p.length != 0){
                            for (let i = 0; i < p.length; i++){
                                users.findOne({
                                    where: {
                                        userId: p[i].userId
                                    }
                                }).then(function(pu){
                                    userProfile.findOne({
                                        where: {
                                            userId: req.user.userId
                                        }
                                    }).then(function(currentUser){
                                        follow.findOne({
                                            where: {
                                                user1: currentUser.userId,
                                                user2: p[i].userId
                                            }
                                        }).then(function(fl){
                                            let followed = false
                                            if (fl){followed = true}
                                            let description = ''
                                            if (p[i].description != null){
                                                description = p[i].description
                                            }
                                            result2[i] = [pu.userId, pu.username, p[i].nickname, p[i].avatar, description, followed]
                                            count2 ++
                                            if (count2 == p.length){
                                                res.render("search", {username: req.user.username, userId: req.user.userId, profile: currentUser, result: result1.concat(result2), text: req.query.q, end: end, active: 'explore', rankLink: '', rankName: '', cateActive: '', cateName: '', rank: false, modal: false})
                                            }
                                        })
                                    })
                                })
                            }
                        }
                        else {
                            if (result1.concat(result2).length == 0){end = true}
                            userProfile.findOne({
                                where: {
                                    userId: req.user.userId
                                }
                            }).then(function(currentUser){
                                res.render("search", {username: req.user.username, userId: req.user.userId, profile: currentUser, result: result1.concat(result2), text: req.query.q, end: end , active: 'explore', rankLink: '', rankName: '', cateActive: '', cateName: '', rank: false, modal: false})
                            })
                        }
                    })
                }
                users.findAll({
                    raw: true,
                    where: {
                        username: {
                            [Op.like]: '%' + req.query.q + '%'
                        },
                        userId: {
                            [Op.notIn]: searchDisplayedList
                        }
                    },
                    limit: 10
                }).then(function(u){
                    if (u.length != 0){
                        for (let i = 0; i < u.length; i++){
                            userProfile.findOne({
                                where: {
                                    userId: u[i].userId
                                }
                            }).then(function(up){
                                userListed[i] = up.userId
                                userProfile.findOne({
                                    where: {
                                        userId: req.user.userId
                                    }
                                }).then(function(currentUser){
                                    follow.findOne({
                                        where: {
                                            user1: currentUser.userId,
                                            user2: up.userId
                                        }
                                    }).then(function(fl){
                                        let followed = false
                                        if (fl){followed = true}
                                        let description = ''
                                        if (up.description != null){
                                            description = up.description
                                        }
                                        flArray[i] = [up.followers, up.userId]
                                        resultBuf[i] = [u[i].userId, u[i].username, up.nickname, up.avatar, description, followed]
                                        count1 ++
                                        if (count1 == u.length){
                                            flArray.sort()
                                            flArray.reverse()
                                            for (let i = 0; i < flArray.length; i++){
                                                for (let j = 0; j < resultBuf.length; j++){
                                                    if (flArray[i][1] == resultBuf[j][0]){
                                                        result1[i] = resultBuf[j]
                                                    }
                                                }
                                            }
                                            findByNickname()
                                        }
                                    })
                                })
                            })
                        }
                    }
                    else {
                        findByNickname()
                    }
                })
            }
            else {
                res.redirect('/login')
            }
        }
        else {
            res.render("notfound")
        }
    })

    app.post("/cate-post-count", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            const postCateCountList = [], postRankCountList = []
            let count1 = count2 = 0
            for (let j = 0; j < rankList.length; j++){
                posts.count({
                    where: {
                        rank: rankList[j],
                        time: {
                            [Op.gte]: currentTimeline
                        },
                        auth: true
                    }
                }).then(function(rankTotal){
                    count1 ++
                    postRankCountList[j] = rankTotal
                    if (req.body.rank == rankList[j]){
                        postCateCountList.push(rankTotal)
                    }
                    if (count1 == rankList.length){
                        for (let i = 0; i < cateList.length; i++){
                            posts.count({
                                where: {
                                    rank: req.body.rank,
                                    time: {
                                        [Op.gte]: currentTimeline
                                    },
                                    category: cateList[i],
                                    auth: true
                                }
                            }).then(function(cateTotal){
                                count2 ++
                                postCateCountList[i+1] = cateTotal
                                if (count2 == cateList.length){
                                    res.json({
                                        postCateCountList: postCateCountList,
                                        postRankCountList: postRankCountList
                                    })
                                }
                            })
                        }
                    }
                })
            }
        }
        else {
            res.redirect('/login')
        }
    })

    app.post("/update-content-post", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            const postDisplayedList = req.body.postDisplayedList
            if (!req.body.savedView){
                if (req.body.param == ''){
                    // if (req.body.category != '' && cateList.includes(req.body.category)){
                        if (req.body.category != 'explore') {categoryList = [req.body.category]} else {categoryList = cateList}
                        if (req.body.cateSort == 'rank-sort-content'){
                            posts.count({
                                where: {
                                    category: categoryList,
                                    time: {
                                        [Op.gte]: currentTimeline
                                    },
                                    rank: req.body.rankLink
                                }
                            }).then(function(total){
                                let limit = 5
                                if (postDisplayedList.length + 5 > total) {limit = total - postDisplayedList.length}
                                if (postDisplayedList.length <= total){
                                    posts.findAll({
                                        raw: true,
                                        include : [{
                                            model: users,
                                        }],
                                        order: [
                                            ['like', 'DESC'],
                                            ['time', 'ASC']
                                        ],
                                        where: {
                                            category: categoryList,
                                            postId: {
                                                [Op.notIn]: postDisplayedList
                                            },
                                            time: {
                                                [Op.gte]: currentTimeline
                                            },
                                            rank: req.body.rankLink,
                                            auth: true
                                        },
                                        limit: limit
                                    }).then(function(p){
                                        const postProfile = []
                                        const postLiked = []
                                        const followed = []
                                        let buf = 0, saved = [], notice = []
                                        if (p.length != 0){
                                            for (let i = 0; i < p.length; i++){
                                                userProfile.findOne({
                                                    raw: true,
                                                    where: {
                                                        userId: p[i]['user.userId']
                                                    }
                                                }).then(function(pp){
                                                    postProfile[i] = pp
                                                    postLikes.findAll({
                                                        raw: true,
                                                        where: {
                                                            postId: p[i].postId
                                                        }
                                                    }).then(function(pl){
                                                        postLiked[i] = false
                                                        for (let c = 0; c < pl.length; c++){
                                                            if (pl[c].userId == req.user.userId) {
                                                                postLiked[i] = true
                                                            }
                                                        }
                                                        userProfile.findOne({
                                                            where: {
                                                                userId: req.user.userId
                                                            }
                                                        }).then(function(up){
                                                            postSaved.findOne({
                                                                where: {
                                                                    postId: p[i].postId,
                                                                    userId: p[i]['user.userId']
                                                                }
                                                            }).then(function(s){
                                                                if (s){saved[i] = true} else {saved[i] = false}
                                                                if (up.notice.includes(p[i].postId.toString())){notice[i] = true}else {notice[i] = false}
                                                                follow.findOne({
                                                                    where: {
                                                                        user1: up.userId,
                                                                        user2: pp.userId
                                                                    }
                                                                }).then(function(fl){
                                                                    buf ++
                                                                    if (fl) {followed[i] = true}
                                                                    else {followed[i] = false}
                                                                    if (buf == p.length){
                                                                        data = {
                                                                            userId: req.user.userId,
                                                                            postProfile: postProfile,
                                                                            postLiked: postLiked,
                                                                            followed: followed,
                                                                            posts: p,
                                                                            total: total,
                                                                            limit: limit,
                                                                            saved: saved,
                                                                            notice: notice,
                                                                            rank: true,
                                                                        }
                                                                        res.json({
                                                                            status: "done",
                                                                            data: data
                                                                        })
                                                                    }
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            }
                                        }
                                        else {
                                            data = {
                                                username: req.user.username,
                                                userId: req.user.userId,
                                                postProfile: postProfile,
                                                postLiked: postLiked,
                                                followed: followed,
                                                posts: p,
                                                total: total,
                                                limit: limit,
                                                saved: saved,
                                                rank: true
                                            }
                                            res.json({
                                                status: "done",
                                                data: data
                                            })
                                        } 
                                    })
                                }
                            })
                        }
                        else if (req.body.cateSort == 'random-sort-content'){
                            posts.count({
                                where: {
                                    category: categoryList,
                                    time: {
                                        [Op.gte]: currentTimeline
                                    },
                                    rank: req.body.rankLink
                                }
                            }).then(function(total){
                                let limit = 5
                                if (postDisplayedList.length + 5 > total) {limit = total - postDisplayedList.length}
                                if (postDisplayedList.length <= total){
                                    posts.findAll({
                                        raw: true,
                                        include : [{
                                            model: users,
                                        }],
                                        order: [
                                            Sequelize.fn('RAND')
                                        ],
                                        where: {
                                            category: categoryList,
                                            postId: {
                                                [Op.notIn]: postDisplayedList
                                            },
                                            time: {
                                                [Op.gte]: currentTimeline
                                            },
                                            rank: req.body.rankLink,
                                            auth: true
                                        },
                                        limit: limit
                                    }).then(function(p){
                                        const postProfile = []
                                        const postLiked = []
                                        const followed = []
                                        let buf = 0, saved = [], notice = []
                                        if (p.length != 0){
                                            for (let i = 0; i < p.length; i++){
                                                userProfile.findOne({
                                                    raw: true,
                                                    where: {
                                                        userId: p[i]['user.userId']
                                                    }
                                                }).then(function(pp){
                                                    postProfile[i] = pp
                                                    postLikes.findAll({
                                                        raw: true,
                                                        where: {
                                                            postId: p[i].postId
                                                        }
                                                    }).then(function(pl){
                                                        postLiked[i] = false
                                                        for (let c = 0; c < pl.length; c++){
                                                            if (pl[c].userId == req.user.userId) {
                                                                postLiked[i] = true
                                                            }
                                                        }
                                                        userProfile.findOne({
                                                            where: {
                                                                userId: req.user.userId
                                                            }
                                                        }).then(function(up){
                                                            postSaved.findOne({
                                                                where: {
                                                                    postId: p[i].postId,
                                                                    userId: p[i]['user.userId']
                                                                }
                                                            }).then(function(s){
                                                                if (s){saved[i] = true} else {saved[i] = false}
                                                                if (up.notice.includes(p[i].postId.toString())){notice[i] = true}else {notice[i] = false}
                                                                follow.findOne({
                                                                    where: {
                                                                        user1: up.userId,
                                                                        user2: pp.userId
                                                                    }
                                                                }).then(function(fl){
                                                                    buf ++
                                                                    if (fl) {followed[i] = true}
                                                                    else {followed[i] = false}
                                                                    if (buf == p.length){
                                                                        data = {
                                                                            userId: req.user.userId,
                                                                            postProfile: postProfile,
                                                                            postLiked: postLiked,
                                                                            followed: followed,
                                                                            posts: p,
                                                                            total: total,
                                                                            limit: limit,
                                                                            saved: saved,
                                                                            notice: notice,
                                                                            rank: false,
                                                                        }
                                                                        res.json({
                                                                            status: "done",
                                                                            data: data
                                                                        })
                                                                    }
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            }
                                        }
                                        else {
                                            data = {
                                                username: req.user.username,
                                                userId: req.user.userId,
                                                postProfile: postProfile,
                                                postLiked: postLiked,
                                                posts: p,
                                                total: total,
                                                limit: limit,
                                                saved: saved,
                                                rank: false
                                            }
                                            res.json({
                                                status: "done",
                                                data: data
                                            })
                                        }
                                    })
                                }
                            })
                        }
                        else if (req.body.cateSort == 'latest-sort-content'){
                            posts.count({
                                where: {
                                    category: categoryList,
                                    time: {
                                        [Op.gte]: currentTimeline
                                    },
                                    rank: req.body.rankLink
                                }
                            }).then(function(total){
                                let limit = 5
                                if (postDisplayedList.length + 5 > total) {limit = total - postDisplayedList.length}
                                if (postDisplayedList.length <= total){
                                    posts.findAll({
                                        raw: true,
                                        include : [{
                                            model: users,
                                        }],
                                        order: [
                                            ['time', 'DESC']
                                        ],
                                        where: {
                                            category: categoryList,
                                            postId: {
                                                [Op.notIn]: postDisplayedList
                                            },
                                            time: {
                                                [Op.gte]: currentTimeline
                                            },
                                            rank: req.body.rankLink,
                                            auth: true
                                        },
                                        limit: limit
                                    }).then(function(p){
                                        const postProfile = []
                                        const postLiked = []
                                        const followed = []
                                        let buf = 0, saved = [], notice = []
                                        if (p.length != 0){
                                            for (let i = 0; i < p.length; i++){
                                                userProfile.findOne({
                                                    raw: true,
                                                    where: {
                                                        userId: p[i]['user.userId']
                                                    }
                                                }).then(function(pp){
                                                    postProfile[i] = pp
                                                    postLikes.findAll({
                                                        raw: true,
                                                        where: {
                                                            postId: p[i].postId
                                                        }
                                                    }).then(function(pl){
                                                        postLiked[i] = false
                                                        for (let c = 0; c < pl.length; c++){
                                                            if (pl[c].userId == req.user.userId) {
                                                                postLiked[i] = true
                                                            }
                                                        }
                                                        userProfile.findOne({
                                                            where: {
                                                                userId: req.user.userId
                                                            }
                                                        }).then(function(up){
                                                            postSaved.findOne({
                                                                where: {
                                                                    postId: p[i].postId,
                                                                    userId: p[i]['user.userId']
                                                                }
                                                            }).then(function(s){
                                                                if (s){saved[i] = true} else {saved[i] = false}
                                                                if (up.notice.includes(p[i].postId.toString())){notice[i] = true}else {notice[i] = false}
                                                                follow.findOne({
                                                                    where: {
                                                                        user1: up.userId,
                                                                        user2: pp.userId
                                                                    }
                                                                }).then(function(fl){
                                                                    buf ++
                                                                    if (fl) {followed[i] = true}
                                                                    else {followed[i] = false}
                                                                    if (buf == p.length){
                                                                        data = {
                                                                            userId: req.user.userId,
                                                                            postProfile: postProfile,
                                                                            postLiked: postLiked,
                                                                            followed: followed,
                                                                            posts: p,
                                                                            total: total,
                                                                            limit: limit,
                                                                            saved: saved,
                                                                            notice: notice,
                                                                            rank: false,
                                                                        }
                                                                        res.json({
                                                                            status: "done",
                                                                            data: data
                                                                        })
                                                                    }
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            }
                                        }
                                        else {
                                            data = {
                                                username: req.user.username,
                                                userId: req.user.userId,
                                                postProfile: postProfile,
                                                postLiked: postLiked,
                                                posts: p,
                                                total: total,
                                                limit: limit,
                                                saved: saved,
                                                rank: false
                                            }
                                            res.json({
                                                status: "done",
                                                data: data
                                            })
                                        }
                                    })
                                }
                            })
                        }
                        else if (req.body.cateSort == 'follow-sort-content'){
                            posts.count({
                                where: {
                                    category: categoryList,
                                    time: {
                                        [Op.gte]: currentTimeline
                                    },
                                    rank: req.body.rankLink
                                }
                            }).then(function(total){
                                let limit = 5
                                if (postDisplayedList.length + 5 > total) {limit = total - postDisplayedList.length}
                                if (postDisplayedList.length <= total){
                                    posts.findAll({
                                        raw: true,
                                        include : [{
                                            model: users,
                                        }],
                                        order: [
                                            ['time', 'DESC']
                                        ],
                                        where: {
                                            category: categoryList,
                                            postId: {
                                                [Op.notIn]: postDisplayedList
                                            },
                                            time: {
                                                [Op.gte]: currentTimeline
                                            },
                                            rank: req.body.rankLink,
                                            auth: true
                                        },
                                        limit: limit
                                    }).then(function(p){
                                        const postProfile = []
                                        const postLiked = []
                                        const followed = []
                                        let buf = 0, saved = [], notice = []
                                        if (p.length != 0){
                                            for (let i = 0; i < p.length; i++){
                                                userProfile.findOne({
                                                    raw: true,
                                                    where: {
                                                        userId: p[i]['user.userId']
                                                    }
                                                }).then(function(pp){
                                                    postProfile[i] = pp
                                                    postLikes.findAll({
                                                        raw: true,
                                                        where: {
                                                            postId: p[i].postId
                                                        }
                                                    }).then(function(pl){
                                                        postLiked[i] = false
                                                        for (let c = 0; c < pl.length; c++){
                                                            if (pl[c].userId == req.user.userId) {
                                                                postLiked[i] = true
                                                            }
                                                        }
                                                        userProfile.findOne({
                                                            where: {
                                                                userId: req.user.userId
                                                            }
                                                        }).then(function(up){
                                                            postSaved.findOne({
                                                                where: {
                                                                    postId: p[i].postId,
                                                                    userId: p[i]['user.userId']
                                                                }
                                                            }).then(function(s){
                                                                if (s){saved[i] = true} else {saved[i] = false}
                                                                if (up.notice.includes(p[i].postId.toString())){notice[i] = true}else {notice[i] = false}
                                                                follow.findOne({
                                                                    where: {
                                                                        user1: up.userId,
                                                                        user2: pp.userId
                                                                    }
                                                                }).then(function(fl){
                                                                    buf ++
                                                                    if (fl) {followed[i] = true}
                                                                    else {followed[i] = false}
                                                                    if (buf == p.length){
                                                                        data = {
                                                                            userId: req.user.userId,
                                                                            postProfile: postProfile,
                                                                            postLiked: postLiked,
                                                                            followed: followed,
                                                                            posts: p,
                                                                            total: total,
                                                                            limit: limit,
                                                                            saved: saved,
                                                                            notice: notice,
                                                                            rank: false,
                                                                        }
                                                                        res.json({
                                                                            status: "done",
                                                                            data: data
                                                                        })
                                                                    }
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            }
                                        }
                                        else {
                                            data = {
                                                username: req.user.username,
                                                userId: req.user.userId,
                                                postProfile: postProfile,
                                                postLiked: postLiked,
                                                posts: p,
                                                total: total,
                                                limit: limit,
                                                saved: saved,
                                                rank: false
                                            }
                                            res.json({
                                                status: "done",
                                                data: data
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    // }
                    // else {
                    //     posts.count().then(function(total){
                    //         let limit = 5
                    //         if (postDisplayedList.length + 5 > total) {limit = total - postDisplayedList.length}
                    //         if (postDisplayedList.length <= total){
                    //             posts.findAll({
                    //                 raw: true,
                    //                 include : [{
                    //                     model: users,
                    //                 }],
                    //                 order: [
                    //                     Sequelize.fn('RAND')
                    //                 ],
                    //                 where: {
                    //                     postId: {
                    //                         [Op.notIn]: postDisplayedList
                    //                     },
                    //                     auth: true
                    //                 },
                    //                 limit: limit
                    //             }).then(function(p){
                    //                 const postProfile = []
                    //                 const postLiked = []
                    //                 const followed = []
                    //                 let buf = 0, saved = [], notice = []
                    //                 if (p.length != 0){
                    //                     for (let i = 0; i < p.length; i++){
                    //                         userProfile.findOne({
                    //                             raw: true,
                    //                             where: {
                    //                                 userId: p[i]['user.userId']
                    //                             }
                    //                         }).then(function(pp){
                    //                             postProfile[i] = pp
                    //                             postLikes.findAll({
                    //                                 raw: true,
                    //                                 where: {
                    //                                     postId: p[i].postId
                    //                                 }
                    //                             }).then(function(pl){
                    //                                 postLiked[i] = false
                    //                                 for (let c = 0; c < pl.length; c++){
                    //                                     if (pl[c].userId == req.user.userId) {
                    //                                         postLiked[i] = true
                    //                                     }
                    //                                 }
                    //                                 userProfile.findOne({
                    //                                     where: {
                    //                                         userId: req.user.userId
                    //                                     }
                    //                                 }).then(function(up){
                    //                                     postSaved.findOne({
                    //                                         where: {
                    //                                             postId: p[i].postId,
                    //                                             userId: p[i]['user.userId']
                    //                                         }
                    //                                     }).then(function(s){
                    //                                         if (s){saved[i] = true} else {saved[i] = false}
                    //                                         if (up.notice.includes(p[i].postId.toString())){notice[i] = true}else {notice[i] = false}
                    //                                         follow.findOne({
                    //                                             where: {
                    //                                                 user1: up.userId,
                    //                                                 user2: pp.userId
                    //                                             }
                    //                                         }).then(function(fl){
                    //                                             buf ++
                    //                                             if (fl) {followed[i] = true}
                    //                                             else {followed[i] = false}
                    //                                             if (buf == p.length){
                    //                                                 data = {
                    //                                                     userId: req.user.userId,
                    //                                                     postProfile: postProfile,
                    //                                                     postLiked: postLiked,
                    //                                                     followed: followed,
                    //                                                     posts: p,
                    //                                                     total: total,
                    //                                                     limit: limit,
                    //                                                     saved: saved,
                    //                                                     notice: notice,
                    //                                                     rank: false,
                    //                                                 }
                    //                                                 res.json({
                    //                                                     status: "done",
                    //                                                     data: data
                    //                                                 })
                    //                                             }
                    //                                         })
                    //                                     })
                    //                                 })
                    //                             })
                    //                         })
                    //                     }
                    //                 }
                    //                 else {
                    //                     data = {
                    //                         username: req.user.username,
                    //                         userId: req.user.userId,
                    //                         postProfile: postProfile,
                    //                         postLiked: postLiked,
                    //                         posts: p,
                    //                         total: total,
                    //                         limit: limit,
                    //                         saved: saved,
                    //                         rank: false
                    //                     }
                    //                     res.json({
                    //                         status: "done",
                    //                         data: data
                    //                     })
                    //                 }
                    //             })
                    //         }
                    //     })
                    // }
                }
                else {
                    userProfile.findOne({
                        where: {
                            nickname: req.body.param
                        }
                    }).then(function(profile){
                        posts.count({
                            where: {
                                userId: profile.userId
                            }
                        }).then(function(total){
                            let limit = 5
                            if (postDisplayedList.length + 5 > total) {limit = total - postDisplayedList.length}
                            if (postDisplayedList.length <= total){
                                posts.findAll({
                                    raw: true,
                                    include : [{
                                        model: users,
                                    }],
                                    order: [
                                        ['time', 'DESC']
                                    ],
                                    where: {
                                        postId: {
                                            [Op.notIn]: postDisplayedList
                                        },
                                        userId: profile.userId,
                                        auth: true
                                    },
                                    limit: limit
                                }).then(function(p){
                                    const postProfile = []
                                    const postLiked = []
                                    const followed = []
                                    let buf = 0, saved = [], notice = []
                                    if (p.length != 0){
                                        for (let i = 0; i < p.length; i++){
                                            userProfile.findOne({
                                                raw: true,
                                                where: {
                                                    userId: p[i]['user.userId']
                                                }
                                            }).then(function(pp){
                                                postProfile[i] = pp
                                                postLikes.findAll({
                                                    raw: true,
                                                    where: {
                                                        postId: p[i].postId
                                                    }
                                                }).then(function(pl){
                                                    buf ++
                                                    postLiked[i] = false
                                                    for (let c = 0; c < pl.length; c++){
                                                        if (pl[c].userId == req.user.userId) {
                                                            postLiked[i] = true
                                                        }
                                                    }
                                                    userProfile.findOne({
                                                        where: {
                                                            userId: req.user.userId
                                                        }
                                                    }).then(function(up){
                                                        postSaved.findOne({
                                                            where: {
                                                                postId: p[i].postId,
                                                                userId: p[i]['user.userId']
                                                            }
                                                        }).then(function(s){
                                                            if (s){saved[i] = true} else {saved[i] = false}
                                                            if (up.notice.includes(p[i].postId.toString())){notice[i] = true}else {notice[i] = false}
                                                            follow.findOne({
                                                                where: {
                                                                    user1: up.userId,
                                                                    user2: pp.userId
                                                                }
                                                            }).then(function(fl){
                                                                buf ++
                                                                if (fl) {followed[i] = true}
                                                                else {followed[i] = false}
                                                                if (buf == p.length){
                                                                    data = {
                                                                        userId: req.user.userId,
                                                                        postProfile: postProfile,
                                                                        postLiked: postLiked,
                                                                        followed: followed,
                                                                        posts: p,
                                                                        total: total,
                                                                        limit: limit,
                                                                        saved: saved,
                                                                        notice: notice,
                                                                        rank: false,
                                                                    }
                                                                    res.json({
                                                                        status: "done",
                                                                        data: data
                                                                    })
                                                                }
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        }
                                    }
                                    else {
                                        data = {
                                            username: req.user.username,
                                            userId: req.user.userId,
                                            postProfile: postProfile,
                                            postLiked: postLiked,
                                            posts: p,
                                            total: total,
                                            limit: limit,
                                            saved: saved,
                                            rank: false
                                        }
                                        res.json({
                                            status: "done",
                                            data: data
                                        })
                                    }
                                })
                            }
                        })
                    })
                }
            }
            else {
                postSaved.count({
                    where: {
                        userId: req.user.userId
                    }
                }).then(function(total){
                    let limit = 5
                    if (postDisplayedList.length + 5 > total) {limit = total - postDisplayedList.length}
                    if (postDisplayedList.length <= total){
                        postSaved.findAll({
                            where: {
                                userId: req.user.userId,
                                postId: {
                                    [Op.notIn]: postDisplayedList
                                }
                            },
                            order: [
                                ['time', 'DESC'],
                            ],
                            limit: limit
                        }).then(function(postList){
                            const savePosts = [], postUsername = [], postProfile = [], postLiked = [], followed = []
                            let buf = 0, saved = false, notice = false
                            if (postList != 0){
                                for (let i = 0; i < postList.length; i++){
                                    posts.findOne({
                                        where: {
                                            postId: postList[i].postId,
                                            auth: true
                                        }
                                    }).then(function(p){
                                        savePosts[i] = p
                                        users.findOne({
                                            where: {
                                                userId: p.userId
                                            }
                                        }).then(function(u){
                                            postUsername[i] = u.username
                                            userProfile.findOne({
                                                raw: true,
                                                where: {
                                                    userId: p.userId
                                                }
                                            }).then(function(pp){
                                                postProfile[i] = pp
                                                postLikes.findAll({
                                                    raw: true,
                                                    where: {
                                                        postId: p.postId
                                                    }
                                                }).then(function(pl){
                                                    postLiked[i] = false
                                                    for (let c = 0; c < pl.length; c++){
                                                        if (pl[c].userId == req.user.userId) {
                                                            postLiked[i] = true
                                                        }
                                                    }
                                                    userProfile.findOne({
                                                        where: {
                                                            userId: req.user.userId
                                                        }
                                                    }).then(function(profile){
                                                        follow.findOne({
                                                            where: {
                                                                user1: profile.userId,
                                                                user2: pp.userId
                                                            }
                                                        }).then(function(fl){
                                                            userProfile.findOne({
                                                                where: {
                                                                    userId: req.user.userId
                                                                }
                                                            }).then(function(up){
                                                                if (up.notice.includes(p.postId.toString())){
                                                                    notice = true
                                                                }
                                                                buf ++
                                                                if (fl) {followed[i] = true}
                                                                else {followed[i] = false}
                                                                if (buf == postList.length){    
                                                                    data = {
                                                                        userId: req.user.userId,
                                                                        postUsername: postUsername,
                                                                        postProfile: postProfile,
                                                                        postLiked: postLiked,
                                                                        followed: followed,
                                                                        posts: savePosts,
                                                                        total: total,
                                                                        limit: limit,
                                                                        saved: saved,
                                                                        notice: notice,
                                                                        rank: false,
                                                                    }
                                                                    res.json({
                                                                        status: "done",
                                                                        data: data
                                                                    })
                                                                }
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                }
                            }
                            else {
                                data = {
                                    username: req.user.username,
                                    userId: req.user.userId,
                                    postUsername: postUsername,
                                    postProfile: postProfile,
                                    postLiked: postLiked,
                                    followed: followed,
                                    posts: savePosts,
                                    total: total,
                                    limit: limit,
                                    saved: saved,
                                    rank: false
                                }
                                res.json({
                                    status: "done",
                                    data: data
                                })
                            }
                        })
                    }
                })
            }
        }
        else {
            res.redirect('login')
        }
    })

    app.post("/del-post", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            const postId = req.body.dataPostDf
            posts.findOne({
                where: {
                    postId: postId,
                    userId: req.user.userId,
                    auth: true
                }
            }).then(function(p){
                if (p) {
                    (async function(){
                        await comments.destroy({
                            where: {
                                postId: postId
                            }
                        }).then(async function(){
                            await postLikes.destroy({
                                where: {
                                    postId: postId
                                }
                            }).then(function(){
                                if (p.file){

                                    //azure
                                    // const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
                                    // const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
                                    // const containerClient = blobServiceClient.getContainerClient("fd-media");
                                    // const blockBlobClient = containerClient.getBlockBlobClient(p.file.path)
                                    // blockBlobClient.delete();

                                    //gg
                                    // (async function() {
                                    //     await cfFileBucket.file("fd-media/" + p.file.path).delete();
                                    // })();

                                    //aws
                                    removeFile(p.file.path)
                                }
                                posts.destroy({
                                    where: {
                                        postId: postId,
                                        userId: req.user.userId
                                    }
                                }).then(function(){
                                    postSaved.destroy({
                                        where: {
                                            postId: postId
                                        }
                                    }).then(function(){
                                        res.end()
                                    })
                                })
                            })
                        })
                    })()
                }
                else {
                    res.end()
                }
            })
        }
        else {
            res.redirect('login')
        }
    })
    
    app.post("/like-post", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            postLikes.findAll({
                raw: true,
                where: {
                    postId: req.body.dataPostDf
                }
            }).then(function(p){
                let liked = false
                for (let i = 0; i < p.length; i++){
                    if (p[i].userId == req.user.userId) liked = true
                }
                if (req.body.liked) {
                    if (!liked){
                        postLikes.create({
                            userId: req.user.userId,
                            postId: req.body.dataPostDf
                        })
                        posts.increment('like', {by: 1, where: {postId: req.body.dataPostDf}}).then(function(){
                            posts.findOne({
                                where: {
                                    postId: req.body.dataPostDf,
                                    auth: true
                                }
                            }).then(function(t){
                                const data = {
                                    total: t.like,
                                    postId: t.postId
                                }
                                res.json({
                                    data: data
                                })
                            })
                        })
                        
                    }
                }
                else {
                    if (liked){
                        postLikes.destroy({
                            where: {
                                userId: req.user.userId,
                                postId: req.body.dataPostDf
                            }
                        })
                        posts.increment('like', {by: -1, where: {postId: req.body.dataPostDf}}).then(function(){
                            posts.findOne({
                                where: {
                                    postId: req.body.dataPostDf,
                                    auth: true
                                }
                            }).then(function(t){
                                const data = {
                                    total: t.like,
                                    postId: t.postId
                                }
                                res.json({
                                    data: data
                                })
                            })
                        })
                    }
                }
            })
        }
        else {
            res.redirect('login')
        }
    })

    app.post("/save-post", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            const postId = req.body.post
            postSaved.findOne({
                where: {
                    postId: postId,
                    userId: req.user.userId,
                }
            }).then(function(saved){
                if (!saved) {
                    postSaved.create({
                        postId: postId,
                        userId: req.user.userId,
                        time: Date.now()
                    }, {
                        where: {
                            userId: req.user.userId
                        }
                    }).then(function(){
                        res.json({
                            status: "post-saved"
                        })
                    })
                }
                else {
                    postSaved.destroy({
                        where: {
                            postId: postId,
                            userId: req.user.userId,
                        }
                    }).then(function(){
                        res.json({
                            status: "post-save-removed"
                        })
                    })
                }
            })
        }
        else {
            res.redirect('/login')
        }
    })

    app.post("/notice-post", function(req, res){
        userProfile.findOne({
            where: {
                userId: req.user.userId
            }
        }).then(function(profile){
            const postId = req.body.dataPostDf
            const noticeList = profile.notice
            if (noticeList.length < 1000){
                function updateNotice(){
                    if (!noticeList.includes(postId)){
                        noticeList.push(postId)
                        userProfile.update({
                            notice: noticeList
                        },{
                            where: {
                                userId: req.user.userId
                            }
                        }).then(function(){
                            res.json({
                                status: "post-noticed"
                            })
                        })
                    }
                    else {
                        noticeList.splice(noticeList.indexOf(postId), 1)
                        userProfile.update({
                            notice: noticeList
                        },{
                            where: {
                                userId: req.user.userId
                            }
                        }).then(function(){
                            res.json({
                                status: "post-notice-removed"
                            })
                        })
                    }
                }
                updateNotice()
            }
            else {
                const l = noticeList.length - 999
                for (i = 0; i < l; i++){
                    noticeList.shift()
                }
                updateNotice()
            }
        })
    })

    app.post("/video-count-scription", function(req, res){
        posts.increment("videoViews", {by: 1, where: {postId: req.body.post}}).then(function(){
            res.end()
        })
    })

    app.get("/post/:path", function(req, res){
        posts.findOne({
            raw: true,
            where: {
                postId: req.params.path,
                auth: true
            }
        }).then(function(p){
            if (p){
                if (req.isAuthenticated()){
                    req.session.tryTime = 0
                    req.session.blockLogin = false
                    userProfile.findOne({
                        raw: true,
                        where: {    
                            userId: req.user.userId
                        }
                    }).then(function(profile){
                        userProfile.findOne({
                            raw: true,
                            where: {
                                userId: p.userId
                            }
                        }).then(function(pp){
                            const postProfile = pp
                            let saved = false
                            postLikes.findAll({
                                raw: true,
                                where: {
                                    postId: p.postId
                                }
                            }).then(function(pl){
                                let postLiked = false
                                for (let c = 0; c < pl.length; c++){
                                    if (pl[c].userId == req.user.userId) {
                                        postLiked = true
                                    }
                                }
                                postSaved.findOne({
                                    where: {
                                        postId: p.postId,
                                        userId: p.userId
                                    }
                                }).then(function(s){
                                    if (s){saved = true}
                                    users.findOne({
                                        where: {
                                            userId: p.userId
                                        }
                                    }).then(function(pUser){
                                        follow.findOne({
                                            where: {
                                                user1: profile.userId,
                                                user2: pp.userId
                                            }
                                        }).then(function(fl){
                                            let followed = false
                                            if (fl) {followed = true}
                                            res.render("postView", {username: req.user.username, userId: req.user.userId, postViewUser: pUser.username, profile: profile, post: p, postProfile: postProfile, saved: saved, postLiked: postLiked, followed: followed, cmt: false, active: 'explore', rankLink: '', rankName: '', cateActive: '', cateName: '', modal: false})
                                        })
                                    })
                                })
                            })
                        })
                    })
                }
                else {
                    res.redirect('/login')
                }
            }
            else {
                res.render("notfound")
            }
        })
    })

    app.post("/comment-scription", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            if (req.body.content.trim().length > 0 && req.body.content.trim().length <= 1000){
                function getRndInteger(min, max) {
                    return Math.floor(Math.random() * (max - min)) + min;
                }
                const postId = req.body.dataPostDf
                posts.findOne({
                    where: {
                        postId: postId
                    }
                }).then(function(p){
                    if (p){
                        comments.count({
                            where: {
                                postId: postId,
                                reply: null
                            }
                        }).then(function(total){
                            function generateComment(){
                                const id = getRndInteger(1000000000000000, 10000000000000000)
                                comments.findOne({
                                    where: {
                                        cmtId: id
                                    }
                                }).then(function(c){
                                    if (!c){
                                        function createWithoutTag(){
                                            comments.create({ 
                                                cmtId: id,
                                                user: req.user.userId,
                                                tag: null,
                                                content: req.body.content.trim(),
                                                like: 0,
                                                time: new Date(),
                                                reply: req.body.cmtId,
                                                postId: postId,
                                            }).then(function(cmt){
                                                if (!req.body.cmtId){posts.increment('comment', {by: 1, where: {postId: postId}})}
                                                userProfile.findOne({
                                                    raw: true,
                                                    where: {
                                                        userId: req.user.userId
                                                    }
                                                }).then(function(profile){  
                                                    const cmtAvt = profile.avatar
                                                    const nickname = profile.nickname
                                                    const data = {
                                                        postId: p.postId,
                                                        cmtId: cmt.cmtId,
                                                        user: req.user.userId,
                                                        username: req.user.username,
                                                        nickname: nickname,
                                                        avt: cmtAvt,
                                                        reply: cmt.reply,
                                                        total: total
                                                    }
                                                    res.json({
                                                        status: 'done',
                                                        data: data
                                                    })
                                                })
                                            })
                                        }
                                        if (req.body.tag){
                                            userProfile.findOne({
                                                where: {
                                                    nickname: req.body.tag
                                                }
                                            }).then(function(u){
                                                if (u){
                                                    comments.create({ 
                                                        cmtId: id,
                                                        user: req.user.userId,
                                                        tag: u.userId,
                                                        content: req.body.content.trim(),
                                                        like: 0,
                                                        time: new Date(),
                                                        reply: req.body.cmtId,
                                                        postId: postId,
                                                    }).then(function(cmt){
                                                        if (!req.body.cmtId){posts.increment('comment', {by: 1, where: {postId: postId}})}
                                                        userProfile.findOne({
                                                            raw: true,
                                                            where: {
                                                                userId: req.user.userId
                                                            }
                                                        }).then(function(profile){  
                                                            const cmtAvt = profile.avatar
                                                            const nickname = profile.nickname
                                                            const data = {
                                                                postId: p.postId,
                                                                cmtId: cmt.cmtId,
                                                                user: req.user.userId,
                                                                username: req.user.username,
                                                                nickname: nickname,
                                                                avt: cmtAvt,
                                                                reply: cmt.reply,
                                                                total: total
                                                            }
                                                            res.json({
                                                                status: 'done',
                                                                data: data
                                                            })
                                                        })
                                                    })
                                                }    
                                                else {
                                                    createWithoutTag()
                                                }
                                            })
                                        }
                                        else {
                                            createWithoutTag()
                                        }
                                    }
                                    else {
                                        generateComment()
                                    }
                                })
                            }
                            generateComment()
                        })
                    }else {
                        res.end()
                    }
                })
            }
            else {
                res.json({
                    status: 'error',
                })
            }
        }
        else {
            res.redirect('login')
        }
    })

    app.post("/load-comment-scription", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            const postId = req.body.dataPostDf
            const reply = req.body.reply
            const cmtDisplayedList = req.body.cmtDisplayedList
            comments.count({
                where: {
                    postId: postId,
                    reply: reply
                }
            }).then(function(total){
                if (!reply) {
                    let limit = 5, cmtView = '%'
                    if (cmtDisplayedList.length + 5 > total){limit = total - cmtDisplayedList.length}
                    if (req.body.viewWithCmt && cmtDisplayedList.length == 0){cmtView = `${req.body.viewWithCmt}`}
                    if (cmtDisplayedList.length <= total){
                        comments.findAll({
                            raw: true,
                            where: {
                                postId: postId,
                                cmtId: {
                                    [Op.notIn]: cmtDisplayedList,
                                    [Op.like]: cmtView
                                },
                                reply: reply
                            },
                            limit: limit,
                            order: [
                                ['like', 'DESC'],
                                ['time', 'ASC']
                            ],
                        }).then(function(cmts){
                            if (cmts.length == 0 && !req.body.viewWithCmt){
                                res.json({status: "end", data: {total: total}})
                            }
                            else if (cmts.length == 0 && req.body.viewWithCmt){
                                res.json({status: "removed", data: {total: total}})
                            }
                            const cmtUsernames = [], cmtNicknames = [], cmtAvts = [], repTotal = [], cmtLiked = []
                            let buf = 0
                            for (let i = 0; i < cmts.length; i++){
                                const cmtId = cmts[i].cmtId
                                comments.findAll({
                                    raw: true,
                                    where: {
                                        postId: postId,
                                        reply: cmtId
                                    },
                                    order: [
                                        ['like', 'DESC']
                                    ],
                                }).then(function(reps){
                                    repTotal[i] = reps.length
                                    users.findOne({
                                        raw: true,
                                        where: {
                                            userId: cmts[i].user
                                        }
                                    }).then(function(u){
                                        cmtUsernames[i] = u.username
                                        userProfile.findOne({
                                            raw: true,
                                            where: {
                                                userId: cmts[i].user
                                            }
                                        }).then(function(n){
                                            cmtNicknames[i] = n.nickname
                                            cmtAvts[i] = n.avatar
                                            commentLikes.findAll({
                                                where: {
                                                    cmtId: cmts[i].cmtId
                                                }
                                            }).then(function(cl){
                                                buf ++
                                                cmtLiked[i] = false
                                                for (let c = 0; c < cl.length; c++){
                                                    if (cl[c].userId == req.user.userId){
                                                        cmtLiked[i] = true
                                                    }
                                                }
                                                if (buf == cmts.length){
                                                    posts.findOne({
                                                        where: {
                                                            postId: postId,
                                                            auth: true
                                                        }
                                                    }).then(function(p){
                                                        const data = {
                                                            user: req.user.userId,
                                                            cmts: cmts,
                                                            cmtUsernames: cmtUsernames,
                                                            cmtNicknames: cmtNicknames,
                                                            cmtLiked: cmtLiked,
                                                            cmtAvts: cmtAvts,
                                                            cmtTags: null,
                                                            total: total,
                                                            repTotal: repTotal,
                                                            postUser: p.userId,
                                                        }
                                                        res.json({
                                                            status: 'done',
                                                            data: data
                                                        })
                                                    })
                                                }
                                            })
                                        })
                                    })
                                })
                            }
                        })
                    }
                }
                else {
                    const repCmtDisplayedList = req.body.repCmtDisplayedList
                    let limit = 5, end = false
                    if (repCmtDisplayedList.length + 5 > total){limit = total - repCmtDisplayedList.length}
                    if (repCmtDisplayedList.length <= total){
                        comments.findAll({
                            raw: true,
                            where: {
                                postId: postId,
                                cmtId: {
                                    [Op.notIn]: repCmtDisplayedList
                                },
                                reply: reply
                            },
                            limit: limit,
                            order: [
                                ['like', 'DESC'],
                                ['time', 'ASC']
                            ],
                        }).then(function(cmts){
                            const cmtUsernames = [], cmtNicknames = [], cmtAvts = [], cmtTags = [], cmtLiked = [], cmtTagNickname = []
                            let buf = 0
                            for (let i = 0 ; i < cmts.length; i++){
                                users.findOne({
                                    raw: true,
                                    where: {
                                        userId: cmts[i].user
                                    }
                                }).then(function(u){
                                    cmtUsernames[i] = u.username  
                                    userProfile.findOne({
                                        raw: true,
                                        where: {
                                            userId: cmts[i].user
                                        }
                                    }).then(function(n){
                                        cmtNicknames[i] = n.nickname
                                        cmtAvts[i] = n.avatar
                                        userProfile.findOne({
                                            where: {
                                                userId: cmts[i].tag
                                            }
                                        }).then(function(tag){
                                            if (tag){
                                                cmtTagNickname[i] = tag.nickname
                                                users.findOne({
                                                    raw: true,
                                                    where: {
                                                        userId: cmts[i].tag
                                                    }
                                                }).then(function(t){
                                                    cmtTags[i] = t.username
                                                    commentLikes.findAll({
                                                        where: {
                                                            cmtId: cmts[i].cmtId
                                                        }
                                                    }).then(function(cl){
                                                        buf ++
                                                        cmtLiked[i] = false
                                                        for (let c = 0; c < cl.length; c++){
                                                            if (cl[c].userId == req.user.userId){
                                                                cmtLiked[i] = true
                                                            }
                                                        }
                                                        if (buf == cmts.length){
                                                            posts.findOne({
                                                                where: {
                                                                    postId: postId,
                                                                    auth: true
                                                                }
                                                            }).then(function(p){
                                                                const data = {
                                                                    user: req.user.userId,
                                                                    cmts: cmts,
                                                                    cmtUsernames: cmtUsernames,
                                                                    cmtNicknames: cmtNicknames,
                                                                    cmtLiked: cmtLiked,
                                                                    cmtAvts: cmtAvts,
                                                                    cmtTags: cmtTags,
                                                                    cmtTagNickname: cmtTagNickname,
                                                                    total: total,
                                                                    postUser: p.userId,
                                                                }
                                                                res.json({
                                                                    status: 'done',
                                                                    data: data
                                                                })
                                                            })
                                                        }
                                                    })
                                                })
                                            }
                                            else {
                                                buf ++
                                                cmtTags[i] = null
                                                if (buf == cmts.length){
                                                    posts.findOne({
                                                        where: {
                                                            postId: postId,
                                                            auth: true
                                                        }
                                                    }).then(function(p){
                                                        const data = {
                                                            user: req.user.userId,
                                                            cmts: cmts,
                                                            cmtUsernames: cmtUsernames,
                                                            cmtNicknames: cmtNicknames,
                                                            cmtLiked: cmtLiked,
                                                            cmtAvts: cmtAvts,
                                                            cmtTags: cmtTags,
                                                            cmtTagNickname: cmtTagNickname,
                                                            total: total,
                                                            postUser: p.userId,
                                                        }
                                                        res.json({
                                                            status: 'done',
                                                            data: data
                                                        })
                                                    })
                                                } 
                                            }
                                        })
                                    })
                                })
                            }
                        })
                    }
                }
            })
        }
        else {
            res.redirect('login')
        }
    })

    app.post("/del-cmt", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            const postId = req.body.dataPostDf
            const cmtId = req.body.dataCmtDf
            const cmtParent = req.body.cmtParentDf
            posts.findOne({
                where: {
                    postId: postId,
                    userId: req.user.userId,
                    auth: true
                }
            }).then(function(p){
                if (!p){
                    comments.destroy({
                        where: {
                            cmtId: cmtId,
                            user: req.user.userId
                        }
                    })
                    .then(function(){
                        if (!cmtParent){posts.increment('comment', {by: -1, where: {postId: postId}})}
                    })
                    res.end()
                }
                else {
                    comments.destroy({
                        where: {
                            cmtId: cmtId,
                        }
                    })
                    .then(function(){
                        if (!cmtParent){posts.increment('comment', {by: -1, where: {postId: postId}})}
                    })
                    res.end()
                }
            })

        }
        else {
            res.redirect('login')
        }
    })

    app.post("/like-cmt-post", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            commentLikes.findAll({
                raw: true,
                where: {
                    cmtId: req.body.dataCmtDf
                }
            }).then(function(cmt){
                let liked = false
                for (let i = 0; i < cmt.length; i++){
                    if (cmt[i].userId == req.user.userId) liked = true
                }
                if (req.body.liked) {
                    if (!liked){
                        commentLikes.create({
                            userId: req.user.userId,
                            cmtId: req.body.dataCmtDf
                        })
                        comments.increment('like', {by: 1, where: {cmtId: req.body.dataCmtDf}}).then(function(){
                            comments.findOne({
                                where: {
                                    cmtId: req.body.dataCmtDf
                                }
                            }).then(function(c){
                                const data = {
                                    total: c.like
                                }
                                res.json({
                                    data: data
                                })
                            })
                        })
                    }
                }
                else {
                    if (liked){
                        commentLikes.destroy({
                            where: {
                                userId: req.user.userId,
                                cmtId: req.body.dataCmtDf
                            }
                        })
                        comments.increment('like', {by: -1, where: {cmtId: req.body.dataCmtDf}}).then(function(){
                            comments.findOne({
                                where: {
                                    cmtId: req.body.dataCmtDf
                                }
                            }).then(function(c){
                                const data = {
                                    total: c.like
                                }
                                res.json({
                                    data: data
                                })
                            })
                        })
                    }
                }
            })
        }
        else {
            res.redirect('login')
        }
    })

    app.post("/comment-issue", function(req, res){
        if (req.body.content.trim().length > 0){
            report.create({
                obj: req.body.obj,
                content: req.body.content,
                type: req.body.type,
                userId: req.user.userId
            }).then(function(){
                res.json({
                    status: "done"
                })
            })
        }
        else {
            res.json({
                status: "error"
            })
        }
    })

    app.post("/add-topic-request", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            addTopic.count({
                where: {
                    userId: req.user.userId
                }
            }).then(function(total){
                if (total < 5){
                    addTopic.create({
                        topic: req.body.topic,
                        userId: req.user.userId
                    }).then(function(topic){
                        res.json({
                            status: "add-topic-done",
                            totalLeft: 5 - (total + 1),
                            topic: topic.topic
                        })
                    })
                }
                else {
                    res.json({
                        status: "add-topic-error"
                    })
                }
            })
        }
        else {
            res.redirect('/login')
        }
    })

    app.post("/remove-topic-request", function(req, res){
        addTopic.destroy({
            where: {
                userId: req.user.userId
            }
        }).then(function(){
            res.end()
        })
    })

    app.post("/top-video-holder", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            posts.findAll({
                raw: true,
                where: {
                    auth: true
                },
                order: [
                    ['like', 'DESC'],
                    ['time', 'ASC']
                ],
                limit: 1
            }).then(function(p){
                res.json({
                    status: "done",
                    posts: p
                })
            })
        }
        else {
            res.redirect('login')
        }  
    })

    app.post("/general-scription", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            if (req.body.checkboxData == "follow-notification-checkbox"){
                userProfile.update({
                    followNotification: req.body.checkboxValue
                },{
                    where: {
                        userId: req.user.userId
                    }
                }).then(function(){
                    res.end()
                })
            }
            else if (req.body.checkboxData == "vote-follow-notification-checkbox"){
                userProfile.update({
                    voteFollowNotification: req.body.checkboxValue
                },{
                    where: {
                        userId: req.user.userId
                    }
                }).then(function(){
                    res.end()
                })
            }
            else if (req.body.checkboxData == "post-follow-notification-checkbox"){
                userProfile.update({
                    postFollowNotification: req.body.checkboxValue
                },{
                    where: {
                        userId: req.user.userId
                    }
                }).then(function(){
                    res.end()
                })
            }
        }
        else {
            res.redirect('/login')
        }
    })

    app.post("/nickname-scription", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            userProfile.findOne({
                where: {
                    userId: req.user.userId 
                }
            }).then(function(profile){
                res.json({
                    status: 'done',
                    nickname: profile.nickname
                })
            })
        }
        else {
            res.redirect('/login')
        }
    })

    app.post("/nickname-registration", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            userProfile.findOne({
                raw: true,
                where: {
                    nickname: req.body.nickname,
                    userId: {
                        [Op.not]: req.user.userId
                    }
                }
            }).then(function(profile){
                if (!profile){
                    res.json({
                        status: 'valid',
                    })
                }
                else {
                    res.json({
                        status: 'invalid',
                    })
                }
            })
        }
        else {
            res.redirect('/login')
        }
    })

    app.post("/nickname-submit", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            const special = /[^a-zA-Z0-9_]/
            if (!special.test(req.body.nickname) && (req.body.nickname.length >= 4 && req.body.nickname.length <= 15)){
                userProfile.update({
                    nickname: req.body.nickname
                },{
                    where: {
                        userId: req.user.userId
                    }
                }).then(function(){
                    res.json({
                        status: 'done',
                    })
                })
            }
            else {
                res.json({
                    status: 'error'
                })
            }
        }
        else {
            res.redirect('/login')
        }
    })

    app.post("/current-password-submit", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            users.findOne({
                where: {
                    userId: req.user.userId
                }
            }).then(function(user){
                if (user.password) {
                    if (bcrypt.compareSync(req.body.password, user.password)){
                        res.json({
                            status: "correct-current-password",
                            phone: user.phone,
                            email: user.email
                        })
                    }
                    else {
                        res.json({
                            status: "incorrect-current-password"
                        })
                    }
                }
                else {
                    res.json({
                        status: "incorrect-current-password"
                    })
                }
            })
        }
        else {
            res.redirect('/login')
        }
    })

    app.post("/new-phone-submit", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            users.findOne({
                where: {
                    phone: req.body.phone
                }
            }).then(function(user){
                if (!user){
                    const phone = req.body.phone
                    code = randomize('0', 6)
                    sendSMS(phone, code)
                    res.json({
                        status: "sms-sent",
                    })
                    app.post("/code-submit", function(req, res){
                        if (req.body.code == code){
                            users.update({
                                phone: phone
                            },{
                                where: {
                                    userId: req.user.userId
                                }
                            }).then(function(){
                                res.json({
                                    status: "phone-changed",
                                })
                            })
                        }
                        else {
                            res.json({
                                status: "code-invalid",
                            })
                        }
                    })
                }
                else {
                    res.json({
                        status: "phone-invalid"
                    })
                }
            })
        }
        else {
            res.redirect('/login')
        }
    })

    app.post("/new-email-submit", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            users.findOne({
                where: {
                    email: req.body.email
                }
            }).then(function(user){
                if (!user){
                    const email = req.body.email
                    code = randomize('0', 6)
                    sendMail(email, code)
                    res.json({
                        status: "sms-sent",
                    })
                    app.post("/code-submit", function(req, res){
                        if (req.body.code == code){
                            users.update({
                                email: email
                            },{
                                where: {
                                    userId: req.user.userId
                                }
                            }).then(function(){
                                res.json({
                                    status: "email-changed",
                                })
                            })
                        }
                        else {
                            res.json({
                                status: "code-invalid",
                            })
                        }
                    })
                }
                else {
                    res.json({
                        status: "email-invalid"
                    })
                }
            })
        }
        else {
            res.redirect('/login')
        }
    })

    app.post("/password-change-submit", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            users.findOne({
                where: {
                    userId: req.user.userId
                }
            }).then(function(user){
                if (user.password && bcrypt.compareSync(req.body.oldPassword, user.password)){
                    if (req.body.newPassword.length >= 8 && /[0-9]/.test(req.body.newPassword)){
                        if (req.body.newPassword == req.body.confirmPassword){
                            if (req.body.oldPassword != req.body.newPassword){
                                const saltRounds = 10
                                const salt = bcrypt.genSaltSync(saltRounds);
                                const password = bcrypt.hashSync(req.body.newPassword, salt)
                                users.update({
                                    password: password
                                },{
                                    where: {
                                        userId: req.user.userId
                                    }
                                }).then(function(){
                                    res.json({
                                        status: 'done'
                                    })
                                })
                            }
                            else {
                                res.json({
                                    status: "same-password"
                                })
                            }
                        }
                        else {
                            res.json({
                                status: "two-password-not-match"
                            })
                        }
                    }
                    else {
                        res.json({
                            status: "new-password-not-valid"
                        })
                    }
                }
                else {
                    res.json({
                        status: "old-password-incorect"
                    })
                }
            })
        }
        else {
            res.redirect('/login')
        }
    })

    app.post("/feedback-scription", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            feedback.count().then(function(total){
                if (total <= 100000){
                    feedback.create({
                        feedback: req.body.feedback,
                        userId: req.user.userId
                    }).then(function(){
                        res.json({
                            status: "thankyou"
                        })
                    })
                }
                else {
                    res.json({
                        status: "error"
                    })
                }
            })
        }
        else {
            res.redirect('/login')
        }
    })

    app.post('/upload-avt', function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            const form = formidable()
            form.parse(req, (err, fields, f) => {
                const reg = /image\/jpeg|image\/jpg|image\/png|image/gi;
                (async () => {
                    const mineType = await FileType.fromFile(f.file.path)
                    if (mineType.mime.match(reg)){
                        const root =  __dirname.replace('\controllers', '')
                        const image = sharp(f.file.path);
                        let filename
                        if (f.file.name > 255) { filename =  Date.now() + "_" + randomize('0', 6)}
                        else {filename =  Date.now() + "_" + randomize('0', 6) + "_" + f.file.name}
                        const filePath = path.join(root, 'uploads', filename)
                        image.metadata()
                        .then(metadata => {
                            const left = parseInt(fields.xCrop), top = parseInt(fields.yCrop), width = parseInt(300*fields.size), height = parseInt(300*fields.size);
                            return image
                            .extract({ left, top, width, height })
                            .toFile(root + "uploads\\" + filename, (err, info) => {
                                //aws
                                uploadFile(f.file, filename).then(function () {
                                    (async function updateProfile(){
                                        await userProfile.update({
                                            avatar: filename
                                        }, {
                                            where: {
                                                userId: req.user.userId
                                            }
                                        }).then(function(){
                                            fs.unlinkSync(filePath)
                                        })
                                    })()
                                    const data = {
                                        avt: filename,
                                        size: width
                                    }
                                    res.json({
                                        status: 'done',
                                        data: data
                                    })
                                })

                                //gg
                                // const blob = cfFileBucket.file("fd-media/" + filename);
                                // const blobStream = blob.createWriteStream();
                                // const rawData = fs.readFileSync(filePath)
                                // blobStream.on('finish', () => {
                                //     (async function updateProfile(){
                                //         await userProfile.update({
                                //             avatar: filename
                                //         }, {
                                //             where: {
                                //                 userId: req.user.userId
                                //             }
                                //         }).then(function(){
                                //             fs.unlinkSync(filePath)
                                //         })
                                //     })()
                                //     const data = {
                                //         avt: filename,
                                //         size: width
                                //     }
                                //     res.json({
                                //         status: 'done',
                                //         data: data
                                //     })
                                // });
                                // blobStream.end(rawData)
    
                                //azure
                                // const rawData = fs.readFileSync(filePath)
                                // const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
                                // const containerClient = blobServiceClient.getContainerClient("fd-media");
                                // const blockBlobClient = containerClient.getBlockBlobClient(filename);
                                // const blobOptions = { blobHTTPHeaders: { blobContentType: f.file.type } };
                                // blockBlobClient.upload(rawData, Buffer.byteLength(rawData), blobOptions).then(function(){
                                // });
                            })
                        })
                    }
                    else {
                        res.json({
                            status: 'err',
                        })
                    }
                })();
            })
        }
        else {
            res.redirect('/login')
        }
    })

    app.post('/upload-cover', function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            const form = formidable()
            form.parse(req, (err, fields, f) => {
                const reg = /image\/jpeg|image\/jpg|image\/png|image/gi;
                (async () => {
                    const mineType = await FileType.fromFile(f.file.path)
                    if (mineType.mime.match(reg)){
                        const root =  __dirname.replace('\controllers', '')
                        const image = sharp(f.file.path);
                        let filename
                        if (f.file.name > 255) { filename =  Date.now() + "_" + randomize('0', 6)}
                        else {filename =  Date.now() + "_" + randomize('0', 6) + "_" + f.file.name}
                        const filePath = path.join(root, 'uploads', filename)
                        image.metadata()
                        .then(metadata => {
                            const left = parseInt(fields.xCrop), top = parseInt(fields.yCrop), width = parseInt(500*fields.size), height = parseInt(200*fields.size);
                            return image
                            .extract({ left, top, width, height })
                            .toFile(root + "uploads\\" + filename, (err, info) => {
                                 //aws
                                 uploadFile(f.file, filename).then(function () {
                                    (async function updateProfile(){
                                        await userProfile.update({
                                            avatar: filename
                                        }, {
                                            where: {
                                                userId: req.user.userId
                                            }
                                        }).then(function(){
                                            fs.unlinkSync(filePath)
                                        })
                                    })()
                                    const data = {
                                        avt: filename,
                                        size: width
                                    }
                                    res.json({
                                        status: 'done',
                                        data: data
                                    })
                                })

                                //gg
                                // const blob = cfFileBucket.file("fd-media/" + filename);
                                // const blobStream = blob.createWriteStream();
                                // const rawData = fs.readFileSync(filePath)
                                // blobStream.on('finish', () => {
                                //     (async function updateProfile(){
                                //         await userProfile.update({
                                //             cover: filename
                                //         }, {
                                //             where: {
                                //                 userId: req.user.userId
                                //             }
                                //         }).then(function(){
                                //             fs.unlinkSync(filePath)
                                //         })
                                //     })()
                                //     const data = {
                                //         cover: filename,
                                //         size: width
                                //     }
                                //     res.json({
                                //         status: 'done',
                                //         data: data
                                //     })
                                // });
                                // blobStream.end(rawData)
                            })
                        })
                    }
                    else {
                        res.json({
                            status: 'err',
                        })
                    }
                })
            })
        }
        else {
            res.redirect('/login')
        }
    })

    app.post("/update-profile", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            users.update({
                username: req.body.username,
            }, {
                where: {
                    userId: req.user.userId
                }
            })
            userProfile.update({
                nickname: req.body.nickname,
                description: req.body.introduce,
                birthday: req.body.birthday,
                location: req.body.location,
            },{
                where: {
                    userId: req.user.userId
                }
            })
            res.json({
                status: 'done'
            })
        }
        else {
            res.redirect('/login')
        }
    })

    app.post("/listening-task", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            notifications.count({
                where: {
                    userId: req.user.userId,
                    read: false
                }
            }).then(function(total){
                if (req.body.currentView){
                    const notificationProfile = [], notificationName = []
                    let count = 0
                    notifications.findAll({
                        where: {
                            userId: req.user.userId,
                            read: false
                        },
                        order: [
                            ['time', 'DESC'],
                        ],
                    }).then(function(n){
                        notifications.update({
                            read: true
                        },{
                            where: {
                                userId: req.user.userId
                            }
                        }).then(function(){
                            if (n.length != 0){
                                for (let t = 0; t < n.length; t++){
                                    userProfile.findOne({
                                        where: {
                                            userId: n[t].sourceUser
                                        }
                                    }).then(function(p){
                                        notificationProfile[t] = p
                                        users.findOne({
                                            where: {
                                                userId: n[t].sourceUser
                                            }
                                        }).then(function(u){
                                            notificationName[t] = u.username
                                            count ++
                                            if (count == n.length){
                                                res.json({
                                                    total: total,
                                                    notifications: n,
                                                    notificationProfile: notificationProfile,
                                                    notificationName: notificationName
                                                })
                                            }
                                        })
                                    })
                                }
                            }
                            else {
                                res.json({
                                    total: total,
                                    notifications: n,
                                    notificationProfile: notificationProfile,
                                    notificationName: notificationName
                                })
                            }
                        })
                    })
                }
                else {
                    res.json({
                        total: total,
                    })
                }
            })
        }
        else {
            res.redirect('/login')
        }
    })

    app.post("/notification", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            if (req.body.type == "follow"){
                userProfile.findOne({
                    where: {
                        nickname: req.body.source
                    }
                }).then(function(user){
                    if (user){
                        if (user.followNotification){
                            notifications.findOne({
                                where: {
                                    sourceUser: req.user.userId,
                                    type: req.body.type,
                                    userId: user.userId
                                }
                            }).then(function(n){
                                if (!n){
                                    notifications.create({
                                        sourceUser: req.user.userId,
                                        post: null,
                                        type: req.body.type,
                                        read: false,
                                        time: Date.now(),
                                        userId: user.userId
                                    }).then(function(){
                                        res.end()
                                    })
                                }
                                else {
                                    res.end()
                                }
                            })
                        }
                        else {
                            res.end()
                        }
                    }
                    else {
                        res.end()
                    }
                })
            }
            else if (req.body.type == "post"){
                userProfile.findOne({
                    where: {
                        userId: req.user.userId
                    }
                }).then(function(user){
                    follow.findAll({
                        raw: true,
                        where: {
                            user2: user.userId
                        }
                    }).then(function(u){
                        let count = 0
                        if (u.length != 0){
                            for (let i = 0; i < u.length; i++){
                                userProfile.findOne({
                                    where: {
                                        userId: u[i].user1
                                    }
                                }).then(function(p){
                                    if (p.postFollowNotification){
                                        notifications.create({
                                            sourceUser: req.user.userId,
                                            postInfo: req.body.source,
                                            type: req.body.type,
                                            read: false,
                                            time: Date.now(),
                                            userId: p.userId
                                        }).then(function(){
                                            count ++
                                            if (count == u.length){
                                                res.end()
                                            }
                                        })
                                    }
                                    else {
                                        count ++
                                        if (count == u.length){
                                            res.end()
                                        }
                                    }
                                })
                            }
                        }
                        else {
                            res.end()
                        }
                    })
                })
            }
            else if (req.body.type == "vote"){
                const postId = req.body.source[0]
                posts.findOne({
                    where: {
                        postId: postId,
                        auth: true
                    }
                }).then(function(post){
                    users.findOne({
                        where: {
                            userId: post.userId
                        }
                    }).then(function(u){
                        userProfile.findOne({
                            where: {
                                userId: post.userId
                            }
                        }).then(function(p){
                            userProfile.findAll({
                                where: {
                                    notice: {
                                        [Op.like]: ['%' + postId + '%']
                                    }
                                }
                            }).then(function(profiles){
                                let count = 0
                                if (profiles.length != 0){
                                    for (let i = 0; i < profiles.length; i++){
                                        notifications.findOne({
                                            raw: true,
                                            where: {
                                                postInfo: {
                                                    [Op.like]: [postId + '%']
                                                },
                                                type: req.body.type,
                                                userId: profiles[i].userId
                                            }
                                        }).then(function(noti){
                                            if (profiles[i].voteFollowNotification){
                                                if (noti){
                                                    notifications.update({
                                                        postInfo: req.body.source,
                                                        read: false
                                                    },{
                                                        where: {
                                                            postInfo: {
                                                                [Op.like]: [postId + '%']
                                                            },
                                                            type: req.body.type,
                                                            userId: post.userId
                                                        }
                                                    }).then(function(){
                                                        count ++
                                                        if (count == profiles.length){
                                                            res.end()
                                                        }
                                                    })
                                                }
                                                else {
                                                    notifications.create({
                                                        sourceUser: u.userId,
                                                        postInfo: req.body.source,
                                                        type: req.body.type,
                                                        read: false,
                                                        time: Date.now(),
                                                        userId: profiles[i].userId
                                                    }).then(function(){
                                                        count ++
                                                        if (count == profiles.length){
                                                            res.end()
                                                        }
                                                    })
                                                }
                                            }
                                            else {
                                                count ++
                                                if (count == profiles.length){
                                                    res.end()
                                                }
                                            }
                                        })
        
                                    }
                                }
                                else {
                                    res.end()
                                }
                            })
                        })
                    })
                })
            }
            else if (req.body.type == "like"){
                const postId = req.body.source[0]
                posts.findOne({
                    where: {
                        postId: postId,
                        auth: true
                    }
                }).then(function(post){
                    if (post && post.userId != req.user.userId){
                        notifications.findOne({
                            where: {
                                postInfo: {
                                    [Op.like]: [postId + '%']
                                },
                                type: req.body.type,
                                userId: post.userId
                            }
                        }).then(function(n){
                            const postInfo = req.body.source
                            postInfo[2] = '', postInfo[3] = ''
                            for (let c = 0; c < cateList.length; c++){
                                if (cateList[c] == post.category){postInfo[2] = cateName[c]}
                            }
                            for (let r = 0; r < rankList.length; r++){
                                if (rankList[r] == post.rank){postInfo[3] = rankName[r]}
                            }
                            if (!n){
                                notifications.create({
                                    sourceUser: req.user.userId,
                                    postInfo: postInfo,
                                    type: req.body.type,
                                    read: false,
                                    time: Date.now(),
                                    userId: post.userId
                                }).then(function(){
                                    res.end()
                                })
                            }
                            else {
                                if (n.sourceUser != req.user.userId){
                                    notifications.update({
                                        sourceUser: req.user.userId,
                                        postInfo: postInfo,
                                        read: false,
                                        time: Date.now(),
                                    },{
                                        where: {
                                            postInfo: {
                                                [Op.like]: [postId + '%']
                                            },
                                            type: req.body.type,
                                            userId: post.userId
                                        }
                                    }).then(function(){
                                        res.end()
                                    })
                                }
                                else {
                                    res.end()
                                }
                            }
                        })
                    }
                    else {
                        res.end()
                    }
                })
            }
            else if (req.body.type == "comment"){
                const postId = req.body.source[0]
                posts.findOne({
                    where: {
                        postId: postId,
                        auth: true
                    }
                }).then(function(post){
                    if (post && post.userId != req.user.userId){
                        notifications.findOne({
                            where: {
                                postInfo: {
                                    [Op.like]: [postId + '%']
                                },
                                type: req.body.type,
                                userId: post.userId
                            }
                        }).then(function(n){
                            const postInfo = req.body.source
                            postInfo[2] = '', postInfo[3] = ''
                            for (let c = 0; c < cateList.length; c++){
                                if (cateList[c] == post.category){postInfo[2] = cateName[c]}
                            }
                            for (let r = 0; r < rankList.length; r++){
                                if (rankList[r] == post.rank){postInfo[3] = rankName[r]}
                            }
                            comments.findAll({
                                where: {
                                    postId: postId,
                                    reply: null
                                },
                                attributes: [
                                    [Sequelize.fn('DISTINCT', Sequelize.col('user')) ,'user'],
                                ],
                            }).then(function(total){
                                postInfo[4] = (total.length - 1).toString()
                                if (!n){
                                    notifications.create({
                                        sourceUser: req.user.userId,
                                        postInfo: postInfo,
                                        type: req.body.type,
                                        read: false,
                                        time: Date.now(),
                                        userId: post.userId
                                    }).then(function(){
                                        res.end()
                                    })
                                }
                                else {
                                    notifications.update({
                                        sourceUser: req.user.userId,
                                        postInfo: postInfo,
                                        read: false,
                                        time: Date.now(),
                                    },{
                                        where: {
                                            postInfo: {
                                                [Op.like]: [postId + '%']
                                            },
                                            type: req.body.type,
                                            userId: post.userId
                                        }
                                    }).then(function(){
                                        res.end()
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
        }
        else {
            res.redirect("/login")
        }
    })

    app.post("/follow-scription", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            userProfile.findOne({
                where: {
                    nickname: req.body.user
                }
            }).then(function(isUser){
                if (isUser){
                    if (req.body.following == false){
                        userProfile.findOne({
                            where: {
                                userId: req.user.userId
                            }
                        }).then(function(profile){
                            follow.findOne({
                                where: {
                                    user1: profile.userId,
                                    user2: isUser.userId
                                }
                            }).then(function(f){
                                if (!f){
                                    follow.create({
                                        user1: profile.userId,
                                        user2: isUser.userId
                                    }).then(function(){
                                        userProfile.increment('following', {by: 1, where: {userId: req.user.userId}}).then(function(){
                                            userProfile.increment('followers', {by: 1, where: {userId: isUser.userId}}).then(function(){
                                                userProfile.findOne({
                                                    where: {
                                                        nickname: req.body.currentUserView
                                                    }
                                                }).then(function(fl){
                                                    if (fl){
                                                        res.json({
                                                            following: fl.following,
                                                            followers: fl.followers,
                                                            notification: true
                                                        })
                                                    }
                                                    else {
                                                        res.json({
                                                            notification: true
                                                        })
                                                    }
                                                })
                                            })
                                        })
                                    })
                                }
                                else {
                                    res.json({
                                        following: 0,
                                        followers: 0,
                                        notification: true
                                    })
                                }
                            })
                        })
                    }
                    else {
                        userProfile.findOne({
                            where: {
                                userId: req.user.userId
                            }
                        }).then(function(profile){
                            follow.findOne({
                                where: {
                                    user1: profile.userId,
                                    user2: isUser.userId
                                }
                            }).then(function(f){
                                if (f){
                                    follow.destroy({
                                        where: {
                                            user1: profile.userId,
                                            user2: isUser.userId
                                        }
                                    }).then(function(){
                                        userProfile.increment('following', {by: -1, where: {userId: req.user.userId}}).then(function(){
                                            userProfile.increment('followers', {by: -1, where: {userId: isUser.userId}}).then(function(){
                                                userProfile.findOne({
                                                    where: {
                                                        nickname: req.body.currentUserView
                                                    }
                                                }).then(function(fl){
                                                    if (fl){
                                                        res.json({
                                                            following: fl.following,
                                                            followers: fl.followers,
                                                            notification: true
                                                        })
                                                    }
                                                    else {
                                                        res.json({
                                                            notification: true
                                                        })
                                                    }
                                                })
                                            })
                                        })
                                    })
                                }
                                else {
                                    res.json({
                                        following: 0,
                                        followers: 0,
                                        notification: false
                                    })
                                }
                            })
                        })
                    }
                }
                else {
                    res.end()
                }
            })
        }
        else {
            res.redirect('/login')
        }
    })

    app.post("/personal-followers-scription", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            userProfile.findOne({
                where: {
                    nickname: req.body.nickname
                }
            }).then(function(p){
                if (p){
                    follow.count({
                        where: {
                            user2: p.userId,
                        }
                    }).then(function(total){
                        follow.findAll({
                            where: {
                                user2: p.userId,
                                user1: {
                                    [Op.notIn]: req.body.followersDisplayedList
                                }
                            },
                            limit: 5
                        }).then(function(fl){
                            const followersList = []
                            const followersUsername = []
                            const followersAvt = []
                            const followersId = []
                            const isFollowing = []
                            const isCurrentUser = []
                            let buf = 0
                            if (fl.length != 0){
                                for (let i = 0; i < fl.length; i++){
                                    userProfile.findOne({
                                        where: {
                                            userId: req.user.userId
                                        }
                                    }).then(function(currentProfile){
                                        if (currentProfile.nickname == fl[i].user1){
                                            isCurrentUser[i] = true
                                        }
                                        else {isCurrentUser[i] = false}
                                        follow.findOne({
                                            where: {
                                                user1: currentProfile.userId,
                                                user2: fl[i].user1,
                                            }
                                        }).then(function(isF){
                                            if (isF) {isFollowing[i] = true}
                                            else {isFollowing[i] = false}
                                            userProfile.findOne({
                                                where: {
                                                    userId: fl[i].user1
                                                }
                                            }).then(function(profileUser){
                                                followersList.push(profileUser.nickname)
                                                users.findOne({
                                                    where: {
                                                        userId: profileUser.userId
                                                    }
                                                }).then(function(user){
                                                    buf ++
                                                    followersAvt[i] = profileUser.avatar
                                                    followersUsername[i] = user.username
                                                    followersId[i] = profileUser.nickname
                                                    if (buf == followersList.length) {
                                                        res.json({
                                                            status: 'done',
                                                            followersList: followersList,
                                                            followersUsername: followersUsername,
                                                            followersAvt: followersAvt,
                                                            followersId: followersId,
                                                            isFollowing: isFollowing,
                                                            isCurrentUser: isCurrentUser,
                                                            total: total
                                                        })
                                                    } 
                                                })
                                            })
                                        })
                                    })
                                }
                            }
                            else {
                                res.json({
                                    status: 'done',
                                    followersList: followersList,
                                    followersUsername: followersUsername,
                                    followersAvt: followersAvt,
                                    followersId: followersId,
                                    isFollowing: isFollowing,
                                    isCurrentUser: isCurrentUser,
                                    total: total
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
        else {
            res.redirect('/login')
        }
    })

    app.post("/personal-following-scription", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            userProfile.findOne({
                where: {
                    nickname: req.body.nickname
                }
            }).then(function(p){
                if (p){
                    follow.count({
                        where: {
                            user1: p.userId,
                        }
                    }).then(function(total){
                        follow.findAll({
                            where: {
                                user1: p.userId,
                                user2: {
                                    [Op.notIn]: req.body.followingDisplayedList
                                }
                            },
                            limit: 5
                        }).then(function(fl){
                            const followingList = []
                            const followingUsername = []
                            const followingAvt = []
                            const followingId = []
                            const isFollowing = []
                            const isCurrentUser = []
                            let buf = 0
                            if (fl.length != 0){
                                for (let i = 0; i < fl.length; i++){
                                    userProfile.findOne({
                                        where: {
                                            userId: req.user.userId
                                        }
                                    }).then(function(currentProfile){
                                        if (currentProfile.nickname == fl[i].user2){
                                            isCurrentUser[i] = true
                                        }
                                        else {isCurrentUser[i] = false}
                                        follow.findOne({
                                            where: {
                                                user1: currentProfile.userId,
                                                user2: fl[i].user2,
                                            }
                                        }).then(function(isF){
                                            if (isF) {isFollowing[i] = true}
                                            else {isFollowing[i] = false}
                                            userProfile.findOne({
                                                where: {
                                                    userId: fl[i].user2
                                                }
                                            }).then(function(profileUser){
                                                followingList.push(profileUser.nickname)
                                                users.findOne({
                                                    where: {
                                                        userId: profileUser.userId
                                                    }
                                                }).then(function(user){
                                                    buf ++
                                                    followingAvt[i] = profileUser.avatar
                                                    followingUsername[i] = user.username
                                                    followingId[i] = profileUser.nickname
                                                    if (buf == followingList.length) {
                                                        res.json({
                                                            status: 'done',
                                                            followingList: followingList,
                                                            followingUsername: followingUsername,
                                                            followingAvt: followingAvt,
                                                            followingId: followingId,
                                                            isFollowing: isFollowing,
                                                            isCurrentUser: isCurrentUser,
                                                            total: total
                                                        })
                                                    } 
                                                })
                                            })
                                        })
                                    })
                                }
                            }
                            else {
                                res.json({
                                    status: 'done',
                                    followingList: followingList,
                                    followingUsername: followingUsername,
                                    followingAvt: followingAvt,
                                    followingId: followingId,
                                    isFollowing: isFollowing,
                                    isCurrentUser: isCurrentUser,
                                    total: total
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
        else {
            res.redirect('/login')
        }
    })

    app.post("/personal-image-scription", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            userProfile.findOne({
                where: {
                    nickname: req.body.nickname
                }
            }).then(function(user){
                if (user){
                    posts.count({
                        where: {
                            userId: user.userId,
                            file: {
                                type: 'image'
                            }
                        },
                    }).then(function(total){
                        posts.findAll({
                            where: {
                                userId: user.userId,
                                file: {
                                    type: 'image'
                                },
                                postId: {
                                    [Op.notIn]: req.body.imageDisplayedList
                                },
                                auth: true
                            },
                            limit: 5
                        }).then(function(p){
                            const images = [], postIdList = []
                            if (p.length != 0){
                                for (let i = 0; i < p.length; i++){
                                    postIdList.push(p[i].postId)
                                    p[i].file.path.forEach(function(path){
                                        images.push(path)
                                    })
                                }
                            }
                            res.json({
                                status: 'done',
                                images: images,
                                postIdList: postIdList,
                                total: total
                            })
                        })
                    })
                }
                else {
                    res.end()
                }
            })
        }
        else {
            res.redirect('/login')
        }
    })

    app.post("/personal-video-scription", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            userProfile.findOne({
                where: {
                    nickname: req.body.nickname
                }
            }).then(function(user){
                if (user){
                    posts.count({
                        where: {
                            userId: user.userId,
                            file: {
                                type: 'video'
                            }
                        }
                    }).then(function(total){
                        posts.findAll({
                            where: {
                                userId: user.userId,
                                file: {
                                    type: 'video'
                                },
                                postId: {
                                    [Op.notIn]: req.body.videoDisplayedList
                                },
                                auth: true
                            },
                            limit: 5
                        }).then(function(p){
                            const videos = [], postIdList = []
                            if (p.length != 0){
                                for (let i = 0; i < p.length; i++){
                                    postIdList.push(p[i].postId)
                                    videos.push(p[i].file.path[0])
                                }
                            }
                            res.json({
                                status: 'done',
                                videos: videos,
                                postIdList: postIdList,
                                total: total
                            })
                        })
                    })
                }
                else {
                    res.end()
                }
            })
        }
        else {
            res.redirect('/login')
        }
    })

    app.get("/privacy-policy", function (req, res) {
        res.render("privacy-policy")
    })

    function getPersonal(req, res, modal){
        userProfile.findOne({
            raw:true,
            where: {
                nickname: req.params.path
            }
        }).then(function(profile) {
            if (profile) {
                if (req.isAuthenticated()){
                    req.session.tryTime = 0
                    req.session.blockLogin = false
                    users.findOne({
                        raw: true,
                        where: {
                            userId: profile.userId
                        }
                    }).then(function(user) {
                        posts.findAll({
                            raw: true,
                            include : [{
                                model: users,
                            }], 
                            order: [
                                ['time', 'DESC']
                            ],
                            limit: 5,
                            where: {
                                userId: profile.userId,
                                auth: true
                            }
                        }).then(function(p){
                            users.findOne({
                                where:{
                                    userId: req.user.userId
                                }
                            }).then(function(currentUser){
                                userProfile.findOne({
                                    where: {
                                        userId: req.user.userId
                                    }
                                }).then(function(currentProfile){
                                    let isCurrentUser = false
                                    if (req.user.userId == user.userId){
                                        isCurrentUser = true
                                    }
                                    const postProfile = []
                                    const postLiked = []
                                    const saved = []
                                    let followed = false
                                    let buf = 0
                                    follow.findOne({
                                        where: {
                                            user1: currentProfile.userId,
                                            user2: profile.userId
                                        }
                                    }).then(function(fl){
                                        if (fl){
                                            followed = true
                                        }
                                        if (p.length != 0){
                                            for (let i = 0; i < p.length; i++){
                                                userProfile.findOne({
                                                    raw: true,
                                                    where: {
                                                        userId: p[i]['user.userId']
                                                    }
                                                }).then(function(pp){      
                                                    postProfile[i] = pp
                                                    postSaved.findOne({
                                                        where: {
                                                            postId: p[i].postId,
                                                            userId: p[i]['user.userId']
                                                        }
                                                    }).then(function(s){
                                                        if (s){saved[i] = true}
                                                        else {saved[i] = false}
                                                        postLikes.findAll({
                                                            raw: true,
                                                            where: {
                                                                postId: p[i].postId
                                                            }
                                                        }).then(function(pl){
                                                            postLiked[i] = false
                                                            buf ++
                                                            for (let c = 0; c < pl.length; c++){
                                                                if (pl[c].userId == req.user.userId) {
                                                                    postLiked[i] = true
                                                                }
                                                            }
                                                            if (buf == p.length){
                                                                res.render("personal", {isCurrentUser: isCurrentUser, currentUsername: currentUser.username, currentUserId: currentUser.userId, currentProfile: currentProfile, followed: followed, user: user, profile: profile, posts: p, postProfile: postProfile, postLiked: postLiked, saved: saved, active: '', cateActive: '', cateName: '', rank: false, modal: modal})
                                                            }
                                                        })
                                                    })
                                                })
                                            }
                                        }
                                        else {
                                            res.render("personal", {isCurrentUser: isCurrentUser, currentUsername: currentUser.username, currentUserId: currentUser.userId, currentProfile: currentProfile, followed: followed, user: user, profile: profile, posts: p, postProfile: postProfile, postLiked: postLiked, saved: saved, active: '', cateActive: '', cateName: '', rank: false, modal: modal})
                                        }
                                    })
                                })
                            })
                        })
                    })
                }
                else {
                    res.redirect("/login")
                }
            }
            else {
                res.render("notfound")
            }
        })
    }

    app.get("/:path", function(req, res) {
        getPersonal(req, res, false)
    })

    app.get("/:path/edit-profile", function(req, res) {
        getPersonal(req, res, "edit-profile")
    })
}