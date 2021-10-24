const Sequelize = require("sequelize")
const { Op, where, INTEGER, BOOLEAN } = require("sequelize")
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
const cors = require('cors')
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
const { json } = require("body-parser")
const bucketName = process.env.AWS_BUCKET_NAME
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY
const s3 = new S3({
    accessKeyId,
    secretAccessKey
})

module.exports = function(io, app, users, userProfile, posts, comments, postLikes, commentLikes, postSaved, follow, voteWinners, notifications, addTopic, feedback, report, paypal, cardNumber, reward, userAuth, postRank, mobileTokens){
    const rankList = ["primary", "intermediate", "highgrade"]
    const rankName = ["Sơ cấp", "Trung cấp", "Cao cấp"]
    const cateList = ["freestyle", "hiphop", "rap", "contemporary", "ballroom", "modern", "ballet", "shuffle", "jazz", "sexy", "flashmob", "other"]
    const cateName = ["Nhảy tự do", "Hiphop", "Rap", "Múa đương đại", "Khiêu vũ", "Nhảy hiện đại", "Múa ba lê", "Shuffle", "Jazz", "Sexy", "Fashmob", "Khác"]
    const navList = ["fame", "notifications", "saved", "community", "add-topic", "setting"]
    const navName = ["Xếp hạng", "Thông báo", "Đã lưu", "Cộng đồng", "Thêm thể loại", "Cài đặt"]
    const levelList = ["iron", "bronze", "silver", "gold", "platinum", "diamon", "master", "challenge"]
    const levelName = ["Sắt", "Đồng", "Bạc", "Vàng", "Bạch Kim", "Kim Cương", "Cao thủ", "Thách đấu"]
    const startTimeline = new Date("Mon Dec 28 2020 00:00:00")
    let round, currentTimeline, roundType, stageTime, TimeRange
    let tokenBuf = [], userBuf = [], mid = 0
    //handleVoteChampion
    round = Math.floor((Date.now() - startTimeline)/1000/60/60/24/7)
    currentTimeline = Date.parse(startTimeline) + round*7*24*60*60*1000
    stageTime = currentTimeline
    function updateUserRank(point, userId){
        let rank = "bronze"
        if (point >= 0 && point <= 100){rank = "bronze"}
        else if (point > 100 && point < 300){rank = "silver"}
        else if (point >= 300 && point < 700){rank = "gold"}
        else if (point >= 700 && point < 1200){rank = "platinum"}
        else if (point >= 1200 && point < 1800){rank = "diamon"}
        else if (point >= 1800 && point < 2500){rank = "master"}
        else if (point >= 2500 && point < 3300){rank = "challenge"}
        else if (point >= 3300){rank = "challenge"}
        userProfile.update({
            rank: rank
        }, {
            where :{
                userId: userId
            }
        })
    }
    setInterval(function(){ 
        TimeRange = [stageTime, stageTime + 5*24*60*60*1000]
        if (new Date().getDay() >= 1 && new Date().getDay() <= 5) {roundType = "group-stage"}else {roundType = "final"}
        for (let r = 0; r < rankList.length; r++){
            for (let c = 0; c < cateList.length; c++){
                posts.findAll({
                    where: {
                        auth: true,
                        time: {
                            [Op.gte]: currentTimeline
                        },
                        category: cateList[c],
                        rank: rankList[r]
                    },
                    order: [
                        ['like', 'DESC']
                    ],
                }).then(function(postList){
                    for (let i = 0; i < postList.length; i++){
                        postRank.findOne({
                            where: {
                                postId: postList[i].postId,
                                round: round,
                                category: cateList[c],
                                rank: rankList[r]
                            },
                        }).then(function(pr){
                            if (!pr){
                                postRank.create({
                                    postId: postList[i].postId,
                                    round: round,
                                    category: cateList[c],
                                    rank: rankList[r],
                                    postRank: i + 1
                                })
                            }
                        })
                    }
                })
            }
        }

        reward.findOne({
            where: {
                round: round
            }
        }).then(function(r){
            if (!r){
                userProfile.update({
                    posts: 0
                }, {
                    where: {
                        posts: {
                            [Op.gt]: 0
                        }
                    }
                })
            }
        })

        let d = new Date()
        if (d.toLocaleTimeString() == '4:19:00 PM'){
            for (let r = 0; r < rankList.length; r++){
                for (let c = 0; c < cateList.length; c++){
                    posts.findAll({
                        where: {
                            auth: true,
                            time: {
                                [Op.gte]: currentTimeline
                            },
                            category: cateList[c],
                            rank: rankList[r]
                        },
                        order: [
                            ['like', 'DESC'],
                            ['time', 'ASC']
                        ],
                    }).then(function(postList){
                        for (let i = 0; i < postList.length; i++){
                            postRank.findOne({
                                where: {
                                    postId: postList[i].postId,
                                    round: round,
                                    category: cateList[c],
                                    rank: rankList[r]
                                },
                            }).then(function(pr){
                                if (!pr){
                                    postRank.create({
                                        postId: postList[i].postId,
                                        round: round,
                                        category: cateList[c],
                                        rank: rankList[r],
                                        postRank: i + 1
                                    })
                                }
                                else {
                                    if (pr.postRank > (i + 1)){
                                        userProfile.increment('points', {by: pr.postRank - (i+1), where: {userId: postList[i].userId}})
                                        notifications.findOne({
                                            where: {
                                                sourceUser: postList[i].userId,
                                                type: "post-reward",
                                                userId: postList[i].userId
                                            }
                                        }).then(function(n){
                                            if (typeof(postList[i].userId) === "number"){
                                                userProfile.findOne({
                                                    where: {
                                                        userId: postList[i].userId
                                                    }
                                                }).then(function(profile){
                                                    updateUserRank(profile.points, profile.userId)
                                                    if (!n){
                                                        notifications.create({
                                                            sourceUser: postList[i].userId,
                                                            postInfo: [profile.nickname, pr.postRank - (i+1)],
                                                            type: "post-reward",
                                                            read: false,
                                                            time: Date.now(),
                                                            userId: postList[i].userId
                                                        }).then(function(){
                                                            mobileTokens.findOne({
                                                                where: {
                                                                    userId: postList[i].userId
                                                                }
                                                            }).then(function(userNoti){
                                                                const content = `Bạn đã nhận được ${pr.postRank - (i+1)}LP theo mức tăng hạng video tham dự`
                                                                var message = { 
                                                                app_id: "efa501b3-8346-4a6f-a6d8-2015fdb115b6",
                                                                contents: {"en": content},
                                                                // headings: {"en": "Heading"},
                                                                include_player_ids: [userNoti.token]
                                                                };
                                                                    
                                                                sendNotification(message);
                                                            })
                                                        })
                                                    }   
                                                    else {
                                                        notifications.update({
                                                            postInfo: [profile.nickname, pr.postRank - (i+1)],
                                                            read: false,
                                                            time: Date.now(),
                                                        },
                                                        {
                                                            where: {
                                                                sourceUser: postList[i].userId,
                                                                type: "post-reward",
                                                                userId: postList[i].userId
                                                            }
                                                        }).then(function(){
                                                            mobileTokens.findOne({
                                                                where: {
                                                                    userId: postList[i].userId
                                                                }
                                                            }).then(function(userNoti){
                                                                const content = `Bạn đã nhận được ${pr.postRank - (i+1)}LP theo mức tăng hạng video tham dự`
                                                                var message = { 
                                                                app_id: "efa501b3-8346-4a6f-a6d8-2015fdb115b6",
                                                                contents: {"en": content},
                                                                // headings: {"en": "Heading"},
                                                                include_player_ids: [userNoti.token]
                                                                };
                                                                    
                                                                sendNotification(message);
                                                            })
                                                        })
                                                    }       
                                                })
                                                            
                                            }
                                        })
                                    }
                                    postLikes.findAll({
                                        where: {
                                            postId: postList[i].postId,
                                            time: {
                                                [Op.gt]: Date.now() - 24*60*60*1000
                                            }
                                        }
                                    }).then(function(likeList){
                                        for (let j = 0; j < likeList.length; j++){
                                            userProfile.findOne({
                                                where: {
                                                    userId: likeList[j].userId
                                                }
                                            }).then(function(pp){
                                                if (pp.points + (pr.postRank - (i+1)) >= 0){
                                                    userProfile.increment('points', {by: pr.postRank - (i+1), where: {userId: likeList[j].userId}}).then(function(){
                                                        updateUserRank(pp.points, pp.userId)
                                                    })
                                                }
                                            })
                                            notifications.findOne({
                                                where: {
                                                    sourceUser: postList[i].userId,
                                                    type: "vote-reward",
                                                    userId: likeList[j].userId
                                                }
                                            }).then(function(n){
                                                if (typeof(postList[i].userId) === "number" && typeof(likeList[j].userId) === "number"){
                                                    userProfile.findOne({
                                                        where: {
                                                            userId: postList[i].userId
                                                        }
                                                    }).then(function(profile){
                                                        if (!n){
                                                            notifications.create({
                                                                sourceUser: postList[i].userId,
                                                                postInfo: [profile.nickname, pr.postRank - (i+1)],
                                                                type: "vote-reward",
                                                                read: false,
                                                                time: Date.now(),
                                                                userId: likeList[j].userId
                                                            }).then(function(){
                                                                mobileTokens.findOne({
                                                                    where: {
                                                                        userId: postList[i].userId
                                                                    }
                                                                }).then(function(userNoti){
                                                                    const content = `>Bạn đã nhận được ${pr.postRank - (i+1)}LP qua việc bình chọn video tham dự`
                                                                    var message = { 
                                                                    app_id: "efa501b3-8346-4a6f-a6d8-2015fdb115b6",
                                                                    contents: {"en": content},
                                                                    // headings: {"en": "Heading"},
                                                                    include_player_ids: [userNoti.token]
                                                                    };
                                                                        
                                                                    sendNotification(message);
                                                                })
                                                            })
                                                        }   
                                                        else {
                                                            notifications.update({
                                                                postInfo: [profile.nickname, pr.postRank - (i+1)],
                                                                read: false,
                                                                time: Date.now(),
                                                            },
                                                            {
                                                                where: {
                                                                    sourceUser: postList[i].userId,
                                                                    type: "vote-reward",
                                                                    userId: likeList[j].userId
                                                                }
                                                            }).then(function(){
                                                                mobileTokens.findOne({
                                                                    where: {
                                                                        userId: postList[i].userId
                                                                    }
                                                                }).then(function(userNoti){
                                                                    const content = `>Bạn đã nhận được ${pr.postRank - (i+1)}LP qua việc bình chọn video tham dự`
                                                                    var message = { 
                                                                    app_id: "efa501b3-8346-4a6f-a6d8-2015fdb115b6",
                                                                    contents: {"en": content},
                                                                    // headings: {"en": "Heading"},
                                                                    include_player_ids: [userNoti.token]
                                                                    };
                                                                        
                                                                    sendNotification(message);
                                                                })
                                                            })
                                                        }   
                                                    })             
                                                }
                                            })
                                        }
                                    })
                                    postRank.update({
                                        postRank: i + 1
                                    },{
                                        where: {
                                            postId: postList[i].postId,
                                            round: round,
                                            category: cateList[c],
                                            rank: rankList[r]
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            }
        }
        if (roundType == "final"){
            if (stageTime == currentTimeline) {
                let buf = 0
                let cateRewardList, cateLPList = 0
                let buf4 = 0
                const WinnerList = {}
                for (let r = 0; r < rankList.length; r++){
                    for (let c = 0; c < cateList.length; c++){
                        let sum = 0
                        posts.findAll({
                            raw: true,
                            order: [
                                ['like', 'DESC'],
                                ['time', 'ASC']
                            ],
                            where: {
                                rank: rankList[r],
                                category: cateList[c],
                                time: {
                                    [Op.gte]: currentTimeline
                                },
                                auth: true
                            },
                            limit: 10
                        }).then(function(p){
                            buf ++
                            if (p.length != 0){
                                reward.findOne({
                                    where: {
                                        rank: rankList[r],
                                        category: cateList[c],
                                        round: round,
                                        groupReceived: false                          
                                    }
                                }).then(function(cateTotal){
                                    if (cateTotal) {
                                        sum += cateTotal.post
                                    }
                                    for (let i = 0; i < p.length; i++){
                                        const rank = i + 1
                                        const winnerObj = {}
                                        if (!WinnerList[p[i].userId]){
                                            WinnerList[p[i].userId] = []}
                                    
                                            if (rankList[r] == 'primary'){homeRank = "Sơ cấp", buf4 = 0.09}
                                            if (rankList[r] == 'intermediate'){homeRank = "Trung cấp", buf4 = 0.18}
                                            if (rankList[r] == 'highgrade'){homeRank = "Cao cấp", buf4 = 0.54}
                                            if (sum > 0){
                                                cateRewardList = (Math.round((sum * buf4) * 100) / 100)
                                                cateLPList = Math.round(sum * 1)
                                            }
                                            else {
                                                cateRewardList = 0.00
                                                cateLPList = 0
                                            }
                                            if (rank == 1){
                                                userProfile.increment('rank1', {by: 1, where: {userId: p[i].userId}})
                                                userProfile.increment('points', {by: cateLPList, where: {userId: p[i].userId}})
                                                userProfile.increment('usd', {by: cateRewardList, where: {userId: p[i].userId}})
                                                winnerObj['usd'] = cateRewardList
                                                winnerObj['lp'] = cateLPList
                                                if (winnerObj[`${cateName[c]} - ${rankName[r]}`] != rank) {
                                                    winnerObj[`${cateName[c]} - ${rankName[r]}`] = rank
                                                }
                                                userProfile.findOne({
                                                    where: {
                                                        userId: p[i].userId
                                                    }
                                                }).then(function(ur){
                                                    updateUserRank(ur.points, ur.userId)
                                                })
                                            }
                                            if (rank > 1){
                                                notifications.findOne({
                                                    where: {
                                                        sourceUser: p[i].userId,
                                                        type: "not-win",
                                                        userId: p[i].userId
                                                    }
                                                }).then(function(n){
                                                    if (typeof(p[i].userId) === "number"){
                                                        userProfile.findOne({
                                                            where: {
                                                                userId: p[i].userId
                                                            }
                                                        }).then(function(up){
                                                            if (!n){
                                                                notifications.create({
                                                                    sourceUser: p[i].userId,
                                                                    postInfo: [up.nickname, rank, p[i].ms],
                                                                    type: "not-win",
                                                                    read: false,
                                                                    time: Date.now(),
                                                                    userId: p[i].userId
                                                                }).then(function(){
                                                                    mobileTokens.findOne({
                                                                        where: {
                                                                            userId: p[i].userId
                                                                        }
                                                                    }).then(function(userNoti){
                                                                        const content = `Rất tiếc, Video MS ${p[i].ms} của bạn không giành chiến thắng tại Vòng đấu vừa rồi, thứ hạng cao nhất là #${rank}`
                                                                        var message = { 
                                                                        app_id: "efa501b3-8346-4a6f-a6d8-2015fdb115b6",
                                                                        contents: {"en": content},
                                                                        // headings: {"en": "Heading"},
                                                                        include_player_ids: [userNoti.token]
                                                                        };
                                                                            
                                                                        sendNotification(message);
                                                                    })
                                                                })
                                                            }   
                                                            else {
                                                                if (n.postInfo[1] > rank){
                                                                    notifications.update({
                                                                        postInfo: [up.nickname, rank, p[i].ms],
                                                                        read: false,
                                                                        time: Date.now(),
                                                                    },
                                                                    {
                                                                        where: {
                                                                            sourceUser: p[i].userId,
                                                                            type: "not-win",
                                                                            userId: p[i].userId
                                                                        }
                                                                    }).then(function(){
                                                                        mobileTokens.findOne({
                                                                            where: {
                                                                                userId: p[i].userId
                                                                            }
                                                                        }).then(function(userNoti){
                                                                            const content = `Rất tiếc, Video MS ${p[i].ms} của bạn không giành chiến thắng tại Vòng đấu vừa rồi, thứ hạng cao nhất là #${rank}`
                                                                            var message = { 
                                                                            app_id: "efa501b3-8346-4a6f-a6d8-2015fdb115b6",
                                                                            contents: {"en": content},
                                                                            // headings: {"en": "Heading"},
                                                                            include_player_ids: [userNoti.token]
                                                                            };
                                                                                
                                                                            sendNotification(message);
                                                                        })
                                                                    })
                                                                }
                                                            }   
                                                        })
                                                        
                                                    }
                                                })
                                            }
                                            if (typeof(round) === "number" && typeof(rank), typeof(p[i].userId) === "number"){
                                                voteWinners.findOne({
                                                    where: {
                                                        round: round + 1,
                                                        rank: rankList[r],
                                                        category: cateList[c],
                                                        userId: p[i].userId
                                                    }
                                                }).then(function(v){
                                                    if (!v){
                                                        voteWinners.create({
                                                            round: round + 1,
                                                            rank: rankList[r],
                                                            category: cateList[c],
                                                            userId: p[i].userId
                                                        })
                                                    }
                                                })
                                            }  
                                            if (winnerObj.usd){
                                                WinnerList[p[i].userId].push(winnerObj)
                                            }
                                            if (buf == rankList.length * cateList.length) {
                                                for (userId in WinnerList) {
                                                    userProfile.update({
                                                        winner: WinnerList[userId]
                                                    },{
                                                        where: {
                                                            userId: userId
                                                        }
                                                    }).then(function(){
                                                    })
                                                }
                                                reward.update({
                                                    groupReceived: true
                                                },
                                                {
                                                    where: {
                                                        rank: rankList[r],
                                                        category: cateList[c],
                                                        round: round,
                                                    }
                                                })
                                                currentTimeline = currentTimeline + 5*24*60*60*1000
                                                TimeRange = [stageTime, currentTimeline]
                                            }
                                    }
                                })                                
                            }
                            
                        })
                    }
                    
                }
            }
        }
       
        const newRound = Math.floor((Date.now() - startTimeline)/1000/60/60/24/7)
        if (newRound > round) {
            let buf = 0
            const finalRewardList = [], finalLPList= [], cateRewardList = [], cateLPList = []
            let buf1, buf2, buf3, buf4 = 0
            const WinnerList = {}
            for (let r = 0; r < rankList.length; r++){
                let sum = 0
                posts.findAll({
                    raw: true,
                    order: [
                        ['like', 'DESC'],
                        ['time', 'ASC']
                    ],
                    where: {
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
                            reward.findOne({
                                where: {
                                    rank: rankList[r],
                                    round: round,
                                    finalReceived: false                         
                                }
                            }).then(function(cateTotal){
                                if (cateTotal) {
                                    sum += cateTotal.post
                                }
                                if (rankList[r] == 'primary'){homeRank = "Sơ cấp", buf1 = 0.12, buf2 = 0.06, buf3 = 0.03, buf4 = 0.09}
                                if (rankList[r] == 'intermediate'){homeRank = "Trung cấp", buf1 = 0.24, buf2 = 0.12, buf3 = 0.06, buf4 = 0.18}
                                if (rankList[r] == 'highgrade'){homeRank = "Cao cấp", buf1 = 0.72, buf2 = 0.36, buf3 = 0.18, buf4 = 0.54}
                                finalRewardList[0] = (Math.round((sum * buf1) * 100) / 100)
                                finalRewardList[1] = (Math.round((sum * buf2) * 100) / 100)
                                finalRewardList[2] = (Math.round((sum * buf3) * 100) / 100)
                                finalLPList[0] = Math.round(sum * 3)
                                finalLPList[1] = Math.round(sum * 2)
                                finalLPList[2] = Math.round(sum * 1)
                                winnerObj[homeRank] = rank
                                if (rank == 1){
                                    userProfile.increment('rank1', {by: 1, where: {userId: p[i].userId}})
                                    userProfile.increment('points', {by: finalLPList[0], where: {userId: p[i].userId}})
                                    userProfile.increment('usd', {by: finalRewardList[0], where: {userId: p[i].userId}})
                                    winnerObj['usd'] = finalRewardList[0]
                                    winnerObj['lp'] = finalLPList[0]
                                }
                                if (rank == 2){
                                    userProfile.increment('rank2', {by: 1, where: {userId: p[i].userId}})
                                    userProfile.increment('points', {by: finalLPList[1], where: {userId: p[i].userId}})
                                    userProfile.increment('usd', {by: finalRewardList[1], where: {userId: p[i].userId}})
                                    winnerObj['usd'] = finalRewardList[1]
                                    winnerObj['lp'] = finalLPList[1]
                                }
                                if (rank == 3){
                                    userProfile.increment('rank3', {by: 1, where: {userId: p[i].userId}})
                                    userProfile.increment('points', {by: finalLPList[2], where: {userId: p[i].userId}})
                                    userProfile.increment('usd', {by: finalRewardList[2], where: {userId: p[i].userId}})
                                    winnerObj['usd'] = finalRewardList[2]
                                    winnerObj['lp'] = finalLPList[2]
                                }
                                if (rank > 3){
                                    notifications.findOne({
                                        where: {
                                            sourceUser: p[i].userId,
                                            type: "not-win",
                                            userId: p[i].userId
                                        }
                                    }).then(function(n){
                                        if (typeof(p[i].userId) === "number"){
                                            userProfile.findOne({
                                                where: {
                                                    userId: p[i].userId
                                                }
                                            }).then(function(up){
                                                if (!n){
                                                    notifications.create({
                                                        sourceUser: p[i].userId,
                                                        postInfo: [up.nickname, rank, p[i].ms],
                                                        type: "not-win",
                                                        read: false,
                                                        time: Date.now(),
                                                        userId: p[i].userId
                                                    }).then(function(){
                                                        mobileTokens.findOne({
                                                            where: {
                                                                userId: p[i].userId
                                                            }
                                                        }).then(function(userNoti){
                                                            const content = `Rất tiếc, Video MS ${p[i].ms} của bạn không giành chiến thắng tại Vòng đấu vừa rồi, thứ hạng cao nhất là #${rank}`
                                                            var message = { 
                                                            app_id: "efa501b3-8346-4a6f-a6d8-2015fdb115b6",
                                                            contents: {"en": content},
                                                            // headings: {"en": "Heading"},
                                                            include_player_ids: [userNoti.token]
                                                            };
                                                                
                                                            sendNotification(message);
                                                        })
                                                    })
                                                }   
                                                else {
                                                    if (n.postInfo[1] > rank){
                                                        notifications.update({
                                                            postInfo: [up.nickname, rank, p[i].ms],
                                                            read: false,
                                                            time: Date.now(),
                                                        },
                                                        {
                                                            where: {
                                                                sourceUser: p[i].userId,
                                                                type: "not-win",
                                                                userId: p[i].userId
                                                            }
                                                        }).then(function(){
                                                            mobileTokens.findOne({
                                                                where: {
                                                                    userId: p[i].userId
                                                                }
                                                            }).then(function(userNoti){
                                                                const content = `Rất tiếc, Video MS ${p[i].ms} của bạn không giành chiến thắng tại Vòng đấu vừa rồi, thứ hạng cao nhất là #${rank}`
                                                                var message = { 
                                                                app_id: "efa501b3-8346-4a6f-a6d8-2015fdb115b6",
                                                                contents: {"en": content},
                                                                // headings: {"en": "Heading"},
                                                                include_player_ids: [userNoti.token]
                                                                };
                                                                    
                                                                sendNotification(message);
                                                            })
                                                        })
                                                    }
                                                }   
                                            })
                                            
                                        }
                                    })
                                }
    
                                userProfile.findOne({
                                    where: {
                                        userId: p[i].userId
                                    }
                                }).then(function(ur){
                                    updateUserRank(ur.points, ur.userId)
                                })
                                
                                if (typeof(round) === "number" && typeof(rank), typeof(p[i].userId) === "number"){
                                    voteWinners.create({
                                        round: round + 1,
                                        rank: rankList[r],
                                        userId: p[i].userId
                                    })
                                }  
                                WinnerList[p[i].userId].push(winnerObj)
                                if (buf == rankList.length) {
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
                                        reward.update({
                                            finalReceived: true
                                        },
                                        {
                                            where: {
                                                rank: rankList[r],
                                                round: round,
                                            }
                                        })
                                    }
                                }
                            })                                
                        }
                    }
                })
            }
        }
    }, 1000)

    //aws upload
    function uploadFile(file, filename, fileType) {
        const fileStream =  fs.createReadStream(file)

        const uploadParams = {
            Bucket: bucketName,
            Body: fileStream,
            Key: "lingyo-media/" + filename,
            ContentType: fileType
        }

        return s3.upload(uploadParams).promise()
    }
    //aws remove
    function removeFile(filename) {
        const uploadParams = {
            Bucket: bucketName,
            Key: "lingyo-media/" + filename
        }

        return s3.deleteObject(uploadParams, function (err) {
        }).promise()
    }

    var sendNotification = function(data) {
        var headers = {
          "Content-Type": "application/json; charset=utf-8",
          "Authorization": "Basic MDYxOWVmNGEtM2YyOS00OTRjLTk1ZjYtOTFiYWU0ZDA4NjJh"
        };
        
        var options = {
          host: "onesignal.com",
          port: 443,
          path: "/api/v1/notifications",
          method: "POST",
          headers: headers
        };
        
        var https = require('https');
        var req = https.request(options, function(res) {  
          res.on('data', function(data) {
            console.log("Response:");
            console.log(JSON.parse(data));
          });
        });
        
        req.on('error', function(e) {
          console.log("ERROR:");
          console.log(e);
        });
        
        req.write(JSON.stringify(data));
        req.end();
    };

    app.get('/OneSignalSDKWorker.js', function(req, res){
        res.sendFile(__dirname.replace("\\controllers", '') + '\\OneSignalSDKWorker.js');
    })
    app.get('/OneSignalSDKUpdaterWorker.js', function(req, res){
        res.sendFile(__dirname.replace("\\controllers", '') + '\\OneSignalSDKUpdaterWorker.js');
    })

    app.post("/devide-info", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false  
            mobileTokens.findOne({
                where: {
                    token: req.body.devideId,
                    userId: req.user.userId
                }
            }).then(function(mt){
                if (!mt && req.body.devideId){
                    mobileTokens.create({
                        token: req.body.devideId,
                        userId: req.user.userId
                    }).then(function(){
                        res.end()
                    })
                }
            })
        }
        else {
            res.redirect("/login")
        }
    })

    app.post("/userToken", function (req, res) {
        setInterval(function(){
            if (req.body.token && tokenBuf.length == userBuf.length){
                tokenBuf.push(req.body.token)
                res.end()
            }
        }, 500)

        // mobileTokens.findOne({
        //     where: {
        //         token: req.body.token
        //     }
        // }).then(function(t){
        //     if (!t){
        //         mobileTokens.create({
        //             token: req.body.token,
        //             userId: null
        //         }).then(function(){
        //             res.end()
        //         })
        //     }
        //     else {
        //         res.end()
        //     }
        // })
    })

    app.post("/userinfo", function(req, res){
        setInterval(function(){
            if (req.user && userBuf.length == tokenBuf.length - 1){
                userBuf.push(req.user.userId)
                res.end()
            }
        }, 500)
    })

    setInterval(function(){
        for (let i = 0 ; i < tokenBuf.length; i++){
            console.log(tokenBuf[i])
            console.log(userBuf[i])
            if (tokenBuf[i] && userBuf[i]){
                mobileTokens.findOne({
                    where: {
                        token: tokenBuf[i],
                        userId: userBuf[i]
                    }
                }).then(function(mt){
                    console.log(tokenBuf[i])
                    console.log(userBuf[i])
                    if (!mt){
                        mobileTokens.create({
                            token: tokenBuf[i],
                            userId: userBuf[i]
                        }).then(function(){
                            tokenBuf.pop(tokenBuf[i])
                            userBuf.pop(userBuf[i])
                        })
                    }
                    else {
                        tokenBuf.pop(tokenBuf[i])
                        userBuf.pop(userBuf[i])
                    }
                })
            }
        }
    }, 1000)

    //home page
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
                    const enjoyList = [], finalRewardList = [], cateRewardList = [], finalLPList = [], cateLPList = []
                    let count = sum = 0
                    for (let i = 0; i < cateList.length; i++){
                        reward.findOne({
                            where: {
                                category: cateList[i],
                                rank: rank,
                                round: round                           
                            }
                        }).then(function(cateTotal){
                            if (!cateTotal){
                                enjoyList[i] = 0
                            }
                            else {
                                enjoyList[i] = cateTotal.post
                                sum += cateTotal.post
                            }
                            count ++
                            if (count == cateList.length) {
                                let buf1, buf2, buf3, buf4 = 0
                                if (rank == 'primary'){homeRank = "Sơ cấp", buf1 = 0.12, buf2 = 0.06, buf3 = 0.03, buf4 = 0.09}
                                if (rank == 'intermediate'){homeRank = "Trung cấp", buf1 = 0.24, buf2 = 0.12, buf3 = 0.06, buf4 = 0.18}
                                if (rank == 'highgrade'){homeRank = "Cao cấp", buf1 = 0.72, buf2 = 0.36, buf3 = 0.18, buf4 = 0.54}
                                finalRewardList[0] = (Math.round((sum * buf1) * 100) / 100).toFixed(2)
                                finalRewardList[1] = (Math.round((sum * buf2) * 100) / 100).toFixed(2)
                                finalRewardList[2] = (Math.round((sum * buf3) * 100) / 100).toFixed(2)
                                finalLPList[0] = Math.round(sum * 3)
                                finalLPList[1] = Math.round(sum * 2)
                                finalLPList[2] = Math.round(sum * 1)
                                for (let j = 0; j < enjoyList.length; j++){
                                    if (sum > 0){
                                        cateRewardList[j] = (Math.round(((enjoyList[j] * buf4)) * 100) / 100).toFixed(2)
                                        cateLPList[j] = Math.round((enjoyList[j]) * 1)
                                    }
                                    else {
                                        cateRewardList[j] = 0.00
                                        cateLPList[j] = 0
                                    }
                                }
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
                                res.render("home", {username: req.user.username, userId: req.user.userId, winnerCongrat: winnerCongrat, newUser: newUser, profile: profile, active: "home", cateActive: '', cateName: '', nameList: cateName, cateList: cateList, finalRewardList: finalRewardList, cateRewardList: cateRewardList, finalLPList: finalLPList, cateLPList: cateLPList, rankLink: '', rankName: homeRank, roundType: roundType, modal: false})
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

    //handle competition
    function competition(req, res, modal){
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
                        ['videoImpressions', 'ASC'],
                        ['time', 'ASC']
                    ],
                    limit: 5,
                    where: {
                        rank: rank,
                        category: {
                            [Op.in]: cateList
                        },
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
                                                res.render("competition", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, postProfile: postProfile, saved: saved, postLiked: postLiked, followed: followed, active: 'competition', rankLink: '', rankName: rankName, cateActive: 'competition', cateName: '', rank: false, modal: modal, roundType: roundType})
                                            }
                                        })
                                    })
                                })
                            })
                        }
                    }
                    else {
                        res.render("competition", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, active: 'competition', rankLink: '', cateActive: 'competition', cateName: '', rankName: rankName, rank: false, modal: modal, roundType: roundType})
                    }
                })
            })
        }
        else {
            res.redirect("/login")
        }
    }

    io.on("connection", function(socket){
        let postList = [], userList = []
        socket.on("displayed-post", function(postDisplayed){
            postList = postDisplayed
        })
        socket.on("displayed-user", function(userDisplayed){
            userList = userDisplayed
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
                            if (roundType == "group-stage"){
                                userProfile.findOne({
                                    where: {
                                        userId: p.userId
                                    }
                                }).then(function(up){
                                    if (up.posts < 3 && p.competition){
                                        userProfile.increment('posts', {by: 1, where: {userId: p.userId}})
                                        let rw = 5
                                        if (roundType == "final"){rw = 10}
                                        userProfile.increment('points', {by: rw, where: {userId: p.userId}})
                                        notifications.findOne({
                                            where: {
                                                sourceUser: p.userId,
                                                type: "create-post-reward",
                                                userId: p.userId
                                            }
                                        }).then(function(n){
                                            if (typeof(p.userId) === "number"){
                                                if (!n){
                                                    notifications.create({
                                                        sourceUser: p.userId,
                                                        postInfo: [up.nickname, rw],
                                                        type: "create-post-reward",
                                                        read: false,
                                                        time: Date.now(),
                                                        userId: p.userId
                                                    }).then(function(){
                                                        mobileTokens.findOne({
                                                            where: {
                                                                userId: p[i].userId
                                                            }
                                                        }).then(function(userNoti){
                                                            const content = `Bạn đã nhận được ${rw}LP qua việc đăng video tham dự Vòng đấu`
                                                            var message = { 
                                                            app_id: "efa501b3-8346-4a6f-a6d8-2015fdb115b6",
                                                            contents: {"en": content},
                                                            // headings: {"en": "Heading"},
                                                            include_player_ids: [userNoti.token]
                                                            };
                                                                
                                                            sendNotification(message);
                                                        })
                                                    })
                                                }   
                                                else {
                                                    notifications.update({
                                                        postInfo: [up.nickname, rw],
                                                        read: false,
                                                        time: Date.now(),
                                                    },
                                                    {
                                                        where: {
                                                            sourceUser: p.userId,
                                                            type: "create-post-reward",
                                                            userId: p.userId
                                                        }
                                                    }).then(function(){
                                                        mobileTokens.findOne({
                                                            where: {
                                                                userId: p[i].userId
                                                            }
                                                        }).then(function(userNoti){
                                                            const content = `Bạn đã nhận được ${rw}LP qua việc đăng video tham dự Vòng đấu`
                                                            var message = { 
                                                            app_id: "efa501b3-8346-4a6f-a6d8-2015fdb115b6",
                                                            contents: {"en": content},
                                                            // headings: {"en": "Heading"},
                                                            include_player_ids: [userNoti.token]
                                                            };
                                                                
                                                            sendNotification(message);
                                                        })
                                                    })
                                                }   
                                            }
                                        })
                                        reward.findOne({
                                            where: {
                                                category: p.category,
                                                rank: p.rank,
                                                round: round
                                            }
                                        }).then(function(rw){
                                            if (rw){
                                                reward.increment('post', {by: 1, where: {category: p.category, rank: p.rank, round: round}})
                                            }
                                            else {
                                                reward.create({
                                                    category: p.category,
                                                    rank: p.rank,
                                                    round: round,
                                                    post: 1,
                                                    groupReceived: false,
                                                    finalReceived: false
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                            io.sockets.emit("video-validated", data.postId)
                        })
                    }
                    else {

                        //azure
                        // const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
                        // const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
                        // const containerClient = blobServiceClient.getContainerClient("lingyo-media");
                        // for (let i = 0; i < p.file.path.length; i++){
                        //     const blockBlobClient = containerClient.getBlockBlobClient(p.file.path[i])
                        //     blockBlobClient.delete();
                        // }

                        //gg
                        // for (let i = 0; i < p.file.path.length; i++){
                            // (async function() {
                            //     await cfFileBucket.file("lingyo-media/" + p.file.path[i]).delete();
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

        socket.on("/validate-user", function(data){
            userAuth.findOne({
                where: {
                    userId: data.user
                }
            }).then(function(u){
                if (u){
                    if (data.validData == "true"){
                        userAuth.update({
                            auth: true
                        }, {
                            where: {
                                userId: data.user
                            }
                        }).then(function(){
                            userProfile.update({
                                auth: true
                            }, {
                                where: {
                                    userId: data.user
                                }
                            }).then(function(){
                                io.sockets.emit("user-validated", data.user)
                            })
                        })
                    }
                    else {
                        removeFile(u.face)
                        removeFile(u.file)
                        
                        userAuth.destroy({
                            where: {
                                userId: data.user
                            }
                        }).then(function(){
                            io.sockets.emit("user-validated", data.user)
                        })
                    }
                }
                else {
                    res.end()
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
                    for (let i = 0; i < p.length; p ++){
                        postList.push(p[i].postId)
                        if (i == p.length - 1){
                            socket.emit("post-need-moderate", p)
                        }
                    }
                }
            })

            userAuth.findAll({
                where: {
                    auth: false,
                    userId: {
                        [Op.notIn]: userList
                    }
                }
            }).then(function(authList){
                if (authList.length != 0){
                    const profileList = []
                    let count = 0, username = birthday = location = []
                    for (let i = 0; i < authList.length; i++){
                        userList.push(authList[i].userId)
                        userProfile.findOne({
                            where: {
                                userId: authList[i].userId
                            }
                        }).then(function(p){
                            birthday[i] = p.birthday
                            location[i] = p.location
                            users.findOne({
                                where: {
                                    userId: authList[i].userId
                                }
                            }).then(function(u){
                                count ++
                                username[i] = u.username
                                if (count == authList.length){
                                    const data = {
                                        authList,
                                        username: username,
                                        birthday: birthday,
                                        location: location
                                    }
                                    socket.emit("user-need-verify", data)
                                }
                            })
                        })
                    }

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

    app.get("/competition", function(req, res){
        competition(req, res, false)
    })

    app.get("/create-post", function(req, res){
        competition(req, res, 'create-post')
    })

    app.get("/ticket-payment", function(req, res){
        competition(req, res, 'ticket-payment')
    })

    app.get("/star-reward", function(req, res){
        competition(req, res, 'star-reward')
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
                if (!card && typeof(req.body.cardNumber) === "string" && typeof(req.user.userId) === "number" && typeof(req.body.bankName) === "string"){
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
        if (typeof(req.body.status) === "boolean"){
            userProfile.update({
                starStatus: req.body.status
            }, {
                where: {
                    userId: req.user.userId
                }
            }).then(function(){
                res.end()
            })
        }
    })

    app.post("/payment", function(req, res){
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "https://lingyo.vn/payment-success",
                "cancel_url": "https://lingyo.vn/payment-cancel",
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Vé Lingyo",
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
                "description": "Vé tham gia bình chọn Lingyo"
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
                            limit: 50
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
                                        userProfile.findAll({
                                            order: [
                                                ['points', 'DESC'],
                                            ],
                                        }).then(function(profileList){
                                            let currentRank
                                            for (let j = 0; j < profileList.length; j++){
                                                if (profile.points == profileList[j].points){currentRank = j+1}
                                                if (j == profileList.length - 1){
                                                    res.render(navList[i], {currentRank: currentRank, topFames: topFames, topFameUsers: topFameUsers, username: req.user.username, userId: req.user.userId, profile: profile, rankLink: '', rankName: '', cateActive: '', active: navList[i], cateName: navName[i], modal: false})
                                                }
                                            }
                                        })
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
                                    ['time', 'ASC'],
                                    ['like', 'DESC']
                                ],
                                limit: 5,
                                where: {
                                    auth: true,
                                    competition: false
                                }
                            }).then(function(p){
                                const postProfile = []
                                const saved = []
                                const postLiked = []
                                const followed = []
                                let buf = 0
                                if (p.length != 0){
                                    const root =  __dirname.replace('\controllers', '')
                                    for (let j = 0; j < p.length; j++){      
                                        userProfile.findOne({
                                            raw: true,
                                            where: {
                                                userId: p[j]['user.userId']
                                            }
                                        }).then(function(pp){
                                            postProfile[j] = pp
                                            postLikes.findAll({
                                                raw: true,
                                                where: {
                                                    postId: p[j].postId
                                                }
                                            }).then(function(pl){
                                                postSaved.findOne({
                                                    where: {
                                                        postId: p[j].postId,
                                                        userId: p[j]['user.userId']
                                                    }
                                                }).then(function(s){
                                                    if (s){saved[j] = true}
                                                    else {saved[j] = false}
                                                    postLiked[j] = false
                                                    for (let c = 0; c < pl.length; c++){
                                                        if (pl[c].userId == req.user.userId) {
                                                            postLiked[j] = true
                                                        }
                                                    }
                                                    follow.findOne({
                                                        where: {
                                                            user1: profile.userId,
                                                            user2: pp.userId
                                                        }
                                                    }).then(function(fl){
                                                        buf ++
                                                        if (fl) {followed[j] = true}
                                                        else {followed[j] = false}
                                                        if (buf == p.length){
                                                            res.render(navList[i], {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, postProfile: postProfile, saved: saved, postLiked: postLiked, followed: followed, active: 'community', rankLink: '', rankName: rankName, cateActive: 'community', cateName: '', rank: false, modal: false, roundType: roundType})
                                                        }
                                                    })
                                                })
                                            })
                                        })
                                    }
                                }
                                else {
                                    res.render(navList[i], {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, active: 'community', rankLink: '', cateActive: 'community', cateName: '', rankName: rankName, rank: false, modal: false, roundType: roundType})
                                }
                            })
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

    //handle Category
    for (let c = 0; c < cateList.length; c++){
        app.get(`/${cateList[c]}`,function(req, res){
            if (cateList[c] != "competition"){categoryList = [cateList[c]]} else {categoryList = cateList}
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
                                ['videoImpressions', 'ASC'],
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
                                                        res.render("competition", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, postProfile: postProfile, saved: saved, postLiked: postLiked, followed: followed, active: 'competition', rankLink: rank, rankName: rankName, cateActive: cateList[c], cateName: cateName[c], rank: false, winnerCongrat: false, modal: false, newUser: false, roundType: roundType})
                                                    }
                                                })
                                            })
                                        })
                                    })
                                }
                            }
                            else {
                                res.render("competition", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, active: 'competition', rankLink: rank, rankName: rankName, cateActive: cateList[c], cateName: cateName[c], rank: false, winnerCongrat: false, modal: false, newUser: false, roundType: roundType})
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
            if (req.body.category == '' || req.body.category == 'competition' || roundType == "final") {postCategory = cateList} else {postCategory = [req.body.category]}
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
                                                        res.render("competition", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, postProfile: postProfile, saved: saved, postLiked: postLiked, followed: followed, active: 'competition', 
                                                        rankLink: req.body.rankLink, rankName: req.body.rankName, cateActive: req.body.category, cateName: '', rank: true, winnerCongrat: false, modal: false, newUser: false, roundType: roundType})
                                                    }                                                
                                                })
                                            })
                                        })
                                    })
                                }
                            }
                            else {
                                res.render("competition", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, active: 'competition', 
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

    // app.post("/random-sort-content",function(req, res){
    //     if (req.isAuthenticated()){
    //         req.session.tryTime = 0
    //         req.session.blockLogin = false
    //         if (req.body.category == '' || roundType == "final") {postCategory = cateList} else {postCategory = [req.body.category]}
    //         // if (req.body.category != ''){
    //             let timeFilter
    //             if (req.body.filter == "current"){timeFilter = currentTimeline}
    //             else {timeFilter = startTimeline}
    //             userProfile.findOne({
    //                 raw: true,
    //                 where: {
    //                     userId: req.user.userId
    //                 }
    //             }).then(function(profile){
    //                 posts.findAll({
    //                     raw: true,
    //                     include : [{
    //                         model: users,
    //                     }],
    //                     order: [
    //                         Sequelize.fn( 'RAND' ),
    //                     ],
    //                     limit: 5,
    //                     where: {
    //                         category: {
    //                             [Op.in]: postCategory
    //                         },
    //                         time: {
    //                             [Op.gte]: timeFilter
    //                         },
    //                         rank: req.body.rankLink,
    //                         auth: true
    //                     }
    //                 }).then(function(p){
    //                     // if (p[0] && p[0].category == ''){res.end()}
    //                     // else {
    //                         const postProfile = []
    //                         const saved = []
    //                         const postLiked = []
    //                         const followed = []
    //                         let buf = 0
    //                         if (p.length != 0){
    //                             for (let i = 0; i < p.length; i++){
    //                                 userProfile.findOne({
    //                                     raw: true,
    //                                     where: {
    //                                         userId: p[i]['user.userId']
    //                                     }
    //                                 }).then(function(pp){
    //                                     postProfile[i] = pp
    //                                     postLikes.findAll({
    //                                         raw: true,
    //                                         where: {
    //                                             postId: p[i].postId
    //                                         }
    //                                     }).then(function(pl){
    //                                         postSaved.findOne({
    //                                             where: {
    //                                                 postId: p[i].postId,
    //                                                 userId: p[i]['user.userId']
    //                                             }
    //                                         }).then(function(s){
    //                                             if (s){saved[i] = true}
    //                                             else {saved[i] = false}
    //                                             postLiked[i] = false
    //                                             for (let c = 0; c < pl.length; c++){
    //                                                 if (pl[c].userId == req.user.userId) {
    //                                                     postLiked[i] = true
    //                                                 }
    //                                             }
    //                                             follow.findOne({
    //                                                 where: {
    //                                                     user1: profile.userId,
    //                                                     user2: pp.userId
    //                                                 }
    //                                             }).then(function(fl){
    //                                                 buf ++
    //                                                 if (fl) {followed[i] = true}
    //                                                 else {followed[i] = false}
    //                                                 if (buf == p.length){
    //                                                     res.render("competition", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, postProfile: postProfile, saved: saved, postLiked: postLiked, followed: followed, active: 'competition', 
    //                                                     rankLink: req.body.rankLink, rankName: req.body.rankName, cateActive: req.body.category, cateName: '', rank: false, winnerCongrat: false, modal: false, newUser: false, roundType: roundType})
    //                                                 }
    //                                             })
    //                                         })
    //                                     })
    //                                 })
    //                             }
    //                         }
    //                         else {
    //                             res.render("competition", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, active: 'competition', 
    //                             rankLink: req.body.rankLink, rankName: req.body.rankName, cateActive: req.body.category, cateName: '', rank: false, winnerCongrat: false, modal: false, newUser: false, roundType: roundType})
    //                         }
    //                     // }
    //                 })
    //             })
    //         // }
    //     }
    //     else {
    //         res.redirect("/login")
    //     }
    // })

    app.post("/foryou-sort-content", function(req, res){
        if (req.isAuthenticated()){
        req.session.tryTime = 0
        req.session.blockLogin = false
        if (req.body.category == '' || req.body.category == 'competition' || roundType == "final") {postCategory = cateList} else {postCategory = [req.body.category]}
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
                        ['videoImpressions', 'ASC'],
                        ['time', 'ASC']
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
                                                    res.render("competition", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, postProfile: postProfile, saved: saved, postLiked: postLiked, followed: followed, active: 'competition', 
                                                    rankLink: req.body.rankLink, rankName: req.body.rankName, cateActive: req.body.category, cateName: '', rank: false, winnerCongrat: false, modal: false, newUser: false, roundType: roundType})
                                                }
                                            })
                                        })
                                    })
                                })
                            }
                        }
                        else {
                            res.render("competition", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, active: 'competition', 
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
            if (req.body.category == '' || req.body.category == 'competition' || roundType == "final") {postCategory = cateList} else {postCategory = [req.body.category]}
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
                                                        res.render("competition", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, postProfile: postProfile, saved: saved, postLiked: postLiked, followed: followed, active: 'competition', 
                                                        rankLink: req.body.rankLink, rankName: req.body.rankName, cateActive: req.body.category, cateName: '', rank: false, winnerCongrat: false, modal: false, newUser: false, roundType: roundType})
                                                    }
                                                })
                                            })
                                        })
                                    })
                                }
                            }
                            else {
                                res.render("competition", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, active: 'competition', 
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
            if (req.body.category == ''  || req.body.category == 'competition' || roundType == "final") {postCategory = cateList} else {postCategory = [req.body.category]}
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
                                                                            res.render("competition", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, postProfile: postProfile, saved: saved, postLiked: postLiked, followed: followed, active: 'competition', 
                                                                            rankLink: req.body.rankLink, rankName: req.body.rankName, cateActive: req.body.category, cateName: '', rank: false, winnerCongrat: false, modal: false, newUser: false, roundType: roundType})
                                                                        }
                                                                    })
                                                                })
                                                            })
                                                        })
                                                    }
                                                }
                                                else {
                                                    res.render("competition", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, active: 'competition', 
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
                                                                res.render("competition", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, postProfile: postProfile, saved: saved, postLiked: postLiked, followed: followed, active: 'competition', 
                                                                rankLink: req.body.rankLink, rankName: req.body.rankName, cateActive: req.body.category, cateName: '', rank: false, winnerCongrat: false, modal: false, newUser: false, roundType: roundType})
                                                            }
                                                        })
                                                    })
                                                })
                                            })
                                        }
                                    }
                                    else {
                                        res.render("competition", {username: req.user.username, userId: req.user.userId, profile: profile, posts: p, active: 'competition', 
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
    
    //handle create post
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
                if (rank != "primary" && rank != "intermediate" && rank != "highgrade"){rank = 'primary'}
                let competition = fields.competition
                let files = f.file, file = {}
                if (!Array.isArray(files)) {
                    files = [files]
                }
                if (f.file){
                    for (let i = 0; i < files.length; i++){
                        if (files[i] && files[i].type){
                            if (files[i] && files[i].type.includes("video") && files.length > 1) {fileValid = false}
                            const reg = /image\/jpeg|image\/jpg|image\/png|image\/gif|video\/mp4|video\/webm|video\/flv|video\/mov|video\/wmv|video\/avi/gi;
                            (async () => {
                                const mineType = await FileType.fromFile(files[i].path)
                                if (mineType.mime.match(reg) || files[i].size > 209715200 || files.length > 4) {fileValid = false}
                            })();
                        }
                    }
                }
                if (fileValid){
                    file.path = paths
                    if (files[0] == null) { file = null}
                    if (files[0].type) {
                        if (files[0].type.includes('video')) {file.type = 'video'}
                        else {file.type = 'image' }
                    }
                    if ((description.length != 0 && description.length <= 1000) || f.file){
                        function postCreator(){
                            userProfile.findOne({
                                raw: true,
                                where: {
                                    userId: req.user.userId
                                }
                            }).then(function(profile){
                                posts.count({
                                    where: {
                                        time: {
                                            [Op.gte]: currentTimeline
                                        },
                                        rank: rank,
                                        competition: true,
                                        userId: req.user.userId,
                                    }
                                }).then(function(postNumbers){
                                    voteWinners.findOne({
                                        where: {
                                            round: round + 1,
                                            category: {
                                                [Op.not]: null
                                            },
                                            rank: rank,
                                            userId: req.user.userId
                                        }
                                    }).then(function(isWin){
                                        if (profile.auth || competition == "false"){
                                            if ((roundType == "final" && isWin) || roundType == "group-stage"){
                                                if (((roundType == "final" && postNumbers < 1) || (roundType == "group-stage" && postNumbers < 3)) || competition == "false"){
                                                    if ((competition && files[0] && files[0].type.includes("video")) || competition == "false"){
                                                        if (rank == "primary" || rank == "intermediate" || rank == "highgrade" || rank == ''){
                                                            if (cateList.includes(category) || category == ''){
                                                                if ((category != '' && rank != '') || category == ''){
                                                                    let ticketValid = true
                                                                    if (rank == '' && competition){rank = "primary"}
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
                                                                                        if (typeof(id) === "number" && typeof(description) === "string" && typeof(category) === "string" && typeof(rank) === "string" && typeof(competition) === "string" && typeof(req.user.userId) === "number"){
                                                                                            posts.count({
                                                                                                where: {
                                                                                                    time: {
                                                                                                        [Op.gte]: currentTimeline
                                                                                                    },
                                                                                                    rank: rank,
                                                                                                    competition: true
                                                                                                }
                                                                                            }).then(function(num){
                                                                                                let ms = null
                                                                                                if (competition){ms = num + 1} else {ms = null}
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
                                                                                                    ms: ms,
                                                                                                    competition: competition,
                                                                                                    videoViews: 0,
                                                                                                    videoImpressions: 0,
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
                                                                                            })
                                                                                            
                                                                                        }
                                                                                        
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
                                                }
                                                else {
                                                    res.json({
                                                        status: "over post"
                                                    })
                                                }
                                            }
                                            else {
                                                res.json({
                                                    status: "not win"
                                                })
                                            }
                                        }
                                        else {
                                            res.json({
                                                status: "not auth"
                                            })
                                        }
                                    })
                                    
                                })
                            })
                        }
                        if (f.file){
                            for (let i = 0; i < files.length; i++){
                                // var oldPath = files[i].path; 
                                // var rawData = fs.readFileSync(oldPath)
                                // fs.writeFile(root + paths[i], rawData, function(err){
                                // })

                                //azure
                                // const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING)
                                // const containerClient = blobServiceClient.getContainerClient("lingyo-media")
                                // const blockBlobClient = containerClient.getBlockBlobClient(paths[i])
                                // const blobOptions = { blobHTTPHeaders: { blobContentType: files[i].type } }
                                // blockBlobClient.upload(rawData, files[i].size, blobOptions)

                                //gg
                                // const blob = cfFileBucket.file("lingyo-media/" + paths[i]);
                                // const blobStream = blob.createWriteStream();
                                // blobStream.end(rawData)
                                // blobStream.on('finish', () => {
                                //     postCreator()
                                // })

                                //aws
                                uploadFile(files[i].path, paths[i], files[i].type).then(function (){
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
                else { filename =  Date.now() + "_" + randomize('0', 6) + "_" + file.name.replace(/[^\w\.]/gi, '')}
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
                const result1 = [], result2 = [], result3 = [], resultBuf = [], userListed = [], counted = [], flArray = []
                let count1 = 0, count2 = 0, end = false
                function findByNickname(){
                    userProfile.findAll({
                        where: {
                            nickname: {
                                [Op.like]: '%' + req.body.searchText + '%',
                            },
                            userId: {
                                [Op.notIn]: userListed.concat(req.body.searchDisplayedList),
                                [Op.ne]: req.user.userId
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
                                            result2[i] = [pu.userId, pu.username, p[i].nickname, p[i].avatar, description, followed, p[i].rank]
                                            count2 ++
                                            if (count2 == p.length){
                                                if (result1.concat(result2).concat(result3).length == 0){end = true}
                                                res.json({
                                                    result: result1.concat(result2).concat(result3),
                                                    end: false
                                                })
                                            }
                                        })
                                    })
                                })
                            }
                        }
                        else {
                            if (result1.concat(result2).concat(result3).length == 0){end = true}
                            res.json({
                                result: result1.concat(result2).concat(result3),
                                end: end
                            })
                        }
                    })
                }
                function findByMs(){
                    qr = req.body.searchText
                    if (qr && qr.includes("MS")){qr = qr.replace("MS", '')}
                    if (qr && qr.includes("ms")){qr = qr.replace("ms", '')}
                    posts.findAll({
                        raw: true,
                        where: {
                            ms: {
                                [Op.like]: '%' + qr + '%'
                            },
                            postId: {
                                [Op.notIn]: req.body.searchDisplayedList
                            },
                            time: {
                                [Op.gte]: currentTimeline
                            }
                        },
                    }).then(function(p){
                        if (p.length != 0){
                            const postProfile = []
                            let buf = 0
                            for (let i = 0; i < p.length; i++){
                                users.findOne({
                                    where: {
                                        userId: p[i].userId
                                    }
                                }).then(function(u){
                                    result3[i] = []
                                    result3[i][0] = "ms"
                                    result3[i][1] = p[i]
                                    postProfile[i] = u
                                    result3[i][2] = postProfile[i].username
                                    buf ++ 
                                    if (buf == p.length){
                                        findByNickname()
                                    }
                                })
                            }
                        }
                        else {
                            findByNickname()
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
                            [Op.notIn]: req.body.searchDisplayedList,
                            [Op.ne]: req.user.userId
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
                                        resultBuf[i] = [u[i].userId, u[i].username, up.nickname, up.avatar, description, followed, up.rank]
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
                                            findByMs()
                                        }
                                    })
                                })
                            })
                        }
                    }
                    else {
                        findByMs()
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
                let searchDisplayedList = []
                if (req.body.searchDisplayedList) {
                    searchDisplayedList = req.body.searchDisplayedList
                }
                const result1 = [], result2 = [], result3 = [], resultBuf = [], userListed = [], counted = [], flArray = []
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
                                            result2[i] = [pu.userId, pu.username, p[i].nickname, p[i].avatar, description, followed, p[i].rank]
                                            count2 ++
                                            if (count2 == p.length){
                                                res.render("search", {username: req.user.username, userId: req.user.userId, profile: currentUser, result: result1.concat(result2).concat(result3), text: req.query.q, end: end, active: 'competition', rankLink: '', rankName: '', cateActive: '', cateName: '', rank: false, modal: false})
                                            }
                                        })
                                    })
                                })
                            }
                        }
                        else {
                            if (result1.concat(result2).concat(result3).length == 0){end = true}
                            userProfile.findOne({
                                where: {
                                    userId: req.user.userId
                                }
                            }).then(function(currentUser){
                                res.render("search", {username: req.user.username, userId: req.user.userId, profile: currentUser, result: result1.concat(result2).concat(result3), text: req.query.q, end: end , active: 'competition', rankLink: '', rankName: '', cateActive: '', cateName: '', rank: false, modal: false})
                            })
                        }
                    })
                }
                function findByMs(){
                    qr = req.query.q
                    if (qr && qr.includes("MS")){qr = qr.replace("MS", '')}
                    if (qr && qr.includes("ms")){qr = qr.replace("ms", '')}
                    posts.findAll({
                        raw: true,
                        where: {
                            ms: {
                                [Op.like]: '%' + qr + '%'
                            },
                            postId: {
                                [Op.notIn]: searchDisplayedList
                            },
                            time: {
                                [Op.gte]: currentTimeline
                            }
                        },
                    }).then(function(p){
                        if (p.length != 0){
                            const postProfile = []
                            let buf = 0
                            for (let i = 0; i < p.length; i++){
                                users.findOne({
                                    where: {
                                        userId: p[i].userId
                                    }
                                }).then(function(u){
                                    result3[i] = []
                                    result3[i][0] = "ms"
                                    result3[i][1] = p[i]
                                    postProfile[i] = u
                                    result3[i][2] = postProfile[i].username
                                    buf ++ 
                                    if (buf == p.length){
                                        findByNickname()
                                    }
                                })
                            }
                        }
                        else {
                            findByNickname()
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
                            [Op.notIn]: searchDisplayedList,
                            [Op.ne]: req.user.userId
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
                                        resultBuf[i] = [u[i].userId, u[i].username, up.nickname, up.avatar, description, followed, up.rank]
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
                                            findByMs()
                                        }
                                    })
                                })
                            })
                        }
                    }
                    else {
                        findByMs()
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
                        category: {
                            [Op.in]: cateList
                        },
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
                        if (req.body.category != 'competition' && req.body.category != '') {categoryList = [req.body.category]} else {categoryList = cateList}
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
                        else if (req.body.cateSort == 'foryou-sort-content'){
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
                                            ['videoImpressions', 'ASC'],
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
                                    // const containerClient = blobServiceClient.getContainerClient("lingyo-media");
                                    // const blockBlobClient = containerClient.getBlockBlobClient(p.file.path)
                                    // blockBlobClient.delete();

                                    //gg
                                    // (async function() {
                                    //     await cfFileBucket.file("lingyo-media/" + p.file.path).delete();
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
            postLikes.findOne({
                raw: true,
                where: {
                    postId: req.body.dataPostDf,
                    userId: req.user.userId
                }
            }).then(function(pLiked){
                if (req.body.liked === true || req.body.liked === false){
                    if (req.body.liked) {
                        if (!pLiked && typeof(req.body.dataPostDf) === "string" && typeof(req.user.userId) === "number"){
                            postLikes.create({
                                userId: req.user.userId,
                                time: Date.now(),
                                postId: req.body.dataPostDf
                            }).then(function () {
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
                            })
                        }
                        else {
                            res.json({
                                data: bull
                            })
                        }
                    }
                    else {
                        // if (pLiked){
                        //     postLikes.destroy({
                        //         where: {
                        //             userId: req.user.userId,
                        //             postId: req.body.dataPostDf
                        //         }
                        //     }).then(function () {
                        //         posts.increment('like', {by: -1, where: {postId: req.body.dataPostDf}}).then(function(){
                        //             posts.findOne({
                        //                 where: {
                        //                     postId: req.body.dataPostDf,
                        //                     auth: true
                        //                 }
                        //             }).then(function(t){
                        //                 const data = {
                        //                     total: t.like,
                        //                     postId: t.postId
                        //                 }
                        //                 res.json({
                        //                     data: data
                        //                 })
                        //             })
                        //         })
                        //     })
                        // }
                        // else {
                        //     res.end()
                        // }
                        res.json({
                            data: null
                        })
                    }
                }
                else {
                    res.json({
                        data: null
                    })
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
                if (!saved && typeof(postId) === "string" && typeof(req.user.userId) === "number") {
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

    app.post("/video-impressions-scription", function(req, res){
        posts.findOne({
            where: {
                postId: req.body.post
            }
        }).then(function(p){
            if (p){
                if (p.videoImpressions < 100000000){
                    posts.increment("videoImpressions", {by: 1, where: {postId: req.body.post}}).then(function(){
                        res.end()
                    })
                }
            }
            else {
                res.end()
            }
        })
    })

    app.post("/video-count-scription", function(req, res){
        posts.findOne({
            where: {
                postId: req.body.post
            }
        }).then(function(p){
            if (p.videoViews < 100000000){
                posts.increment("videoViews", {by: 1, where: {postId: req.body.post}}).then(function(){
                    res.end()
                })
            }
        })

    })

    // view post
    app.get("/post/:path", function(req, res){
        posts.findOne({
            raw: true,
            where: {
                postId: req.params.path,
                auth: true
            },
            include : [{
                model: users,
            }],
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
                                            res.render("postView", {username: req.user.username, userId: req.user.userId, postViewUser: pUser.username, profile: profile, post: p, postProfile: postProfile, saved: saved, postLiked: postLiked, followed: followed, cmt: false, active: 'competition', rankLink: '', rankName: '', cateActive: '', cateName: '', modal: false})
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
                                            if (typeof(id) === "number" && typeof(req.body.cmtId) === "object" && typeof(req.user.userId) == "number" && typeof(req.body.content) === "string"){
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
                                            
                                        }
                                        if (req.body.tag){
                                            userProfile.findOne({
                                                where: {
                                                    nickname: req.body.tag
                                                }
                                            }).then(function(u){
                                                if (u){
                                                    if (typeof(id) === "number" && typeof(req.body.cmtId) === "object" && typeof(req.user.userId) == "number" && typeof(req.body.content) === "string"){
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
                                            if (typeof(id) === "number" && typeof(req.body.cmtId) === "object" && typeof(req.user.userId) == "number" && typeof(req.body.content) === "string"){
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
                                                        const auth = profile.auth
                                                        const data = {
                                                            postId: p.postId,
                                                            cmtId: cmt.cmtId,
                                                            user: req.user.userId,
                                                            username: req.user.username,
                                                            nickname: nickname,
                                                            avt: cmtAvt,
                                                            reply: cmt.reply,
                                                            auth: auth,
                                                            total: total
                                                        }
                                                        res.json({
                                                            status: 'done',
                                                            data: data
                                                        })
                                                    })
                                                })
                                            }
                                            
                                        }
                                        if (req.body.tag){
                                            userProfile.findOne({
                                                where: {
                                                    nickname: req.body.tag
                                                }
                                            }).then(function(u){
                                                if (u){
                                                    if (typeof(id) === "number" && typeof(req.body.cmtId) === "object" && typeof(req.user.userId) == "number" && typeof(req.body.content) === "string"){
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
                                                                const auth = profile.auth
                                                                const data = {
                                                                    postId: p.postId,
                                                                    cmtId: cmt.cmtId,
                                                                    user: req.user.userId,
                                                                    username: req.user.username,
                                                                    nickname: nickname,
                                                                    avt: cmtAvt,
                                                                    reply: cmt.reply,
                                                                    auth: auth,
                                                                    total: total
                                                                }
                                                                res.json({
                                                                    status: 'done',
                                                                    data: data
                                                                })
                                                            })
                                                        })
                                                    }
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
                            const cmtUsernames = [], cmtNicknames = [], cmtAvts = [], cmtAuth = [], repTotal = [], cmtLiked = [], cmtRank = []
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
                                            cmtRank[i] = n.rank
                                            cmtAvts[i] = n.avatar
                                            cmtAuth[i] = n.auth
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
                                                            likeTotal: cl.length,
                                                            cmtUsernames: cmtUsernames,
                                                            cmtNicknames: cmtNicknames,
                                                            cmtAuth: cmtAuth,
                                                            cmtLiked: cmtLiked,
                                                            cmtAvts: cmtAvts,
                                                            cmtRank: cmtRank,
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
                            const cmtUsernames = [], cmtNicknames = [], cmtAvts = [], cmtTags = [], cmtLiked = [], cmtTagNickname = [], cmtRank = []
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
                                        cmtRank[i] = n.rank
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
                                                                    likeTotal: cl.length,
                                                                    cmtUsernames: cmtUsernames,
                                                                    cmtNicknames: cmtNicknames,
                                                                    cmtLiked: cmtLiked,
                                                                    cmtAvts: cmtAvts,
                                                                    cmtTags: cmtTags,
                                                                    cmtRank: cmtRank,
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
                                                        commentLikes.findAll({
                                                            where: {
                                                                cmtId: cmts[i].cmtId
                                                            }
                                                        }).then(function(cl){
                                                            const data = {
                                                                user: req.user.userId,
                                                                cmts: cmts,
                                                                likeTotal: cl.length,
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
            commentLikes.findOne({where: {
                cmtId: req.body.dataCmtDf,
                userId: req.user.userId
            }}).then(function(like){
                if (req.body.liked === true || req.body.liked === false){
                    if (req.body.liked) {
                        if (!like && typeof(req.user.userId) === "number" && typeof(req.body.dataCmtDf) === "string"){
                            commentLikes.create({
                                userId: req.user.userId,
                                cmtId: req.body.dataCmtDf
                            }).then(function () {
                                comments.increment('like', {by: 1, where: {cmtId: req.body.dataCmtDf}}).then(function(){
                                    commentLikes.count({where: {cmtId: req.body.dataCmtDf}}).then(function(total){
                                        const data = {
                                            total: total
                                        }
                                        res.json({
                                            data: data
                                        })
                                    })
                                })
                            })
                        }
                        else {
                            res.end()
                        }
                    }
                    else {
                        if (like){
                            commentLikes.destroy({
                                where: {
                                    userId: req.user.userId,
                                    cmtId: req.body.dataCmtDf
                                }
                            }).then(function () {
                                comments.increment('like', {by: -1, where: {cmtId: req.body.dataCmtDf}}).then(function(){
                                    commentLikes.count({where: {cmtId: req.body.dataCmtDf}}).then(function(total){
                                        const data = {
                                            total: total
                                        }
                                        res.json({
                                            data: data
                                        })
                                    })
                                })
                            })
                        }
                        else {
                            res.end()
                        }
                    }
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

    app.post("/comment-issue", function(req, res){
        if (req.body.content.trim().length > 0 && typeof(req.user.userId) === "number" && typeof(req.body.content) === "string" && typeof(req.body.obj) === "string" && typeof(req.body.type) === "string"){
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
                if (total < 5 && typeof(req.body.topic) === "string" && typeof(req.user.userId) === "number"){
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
            if (typeof(req.body.checkboxValue) === "boolean" && typeof(req.body.checkboxData) === "string"){
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
                res.end()
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
            if (!special.test(req.body.nickname) && (req.body.nickname.length >= 4 && req.body.nickname.length <= 15) && typeof(req.body.nickname) === "string"){
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
                        if (req.body.code == code && typeof(req.body.code) === "number" && typeof(phone) === "number"){
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
                        if (req.body.code == code && typeof(req.body.code) == "number" && typeof(email) === "string"){
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
                                if (typeof(password) === "string"){
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
                                    res.end()
                                }
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
                if (total <= 100000 && typeof(req.body.feedback) === "string" && typeof(req.user.userId) === "number"){
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
                const reg = /image\/jpeg|image\/jpg|image\/png/gi;
                (async () => {
                    const mineType = await FileType.fromFile(f.file.path)
                    if (mineType.mime.match(reg)){
                        const root =  __dirname.replace('\controllers', '')
                        const image = sharp(f.file.path);
                        let filename
                        if (f.file.name > 255) { filename =  Date.now() + "_" + randomize('0', 6)}
                        else {filename =  Date.now() + "_" + randomize('0', 6) + "_" + f.file.name.replace(/[^\w\.]/gi, '')}
                        const filePath = path.join(root, 'uploads', filename)
                        image.metadata()
                        .then(metadata => {
                            const left = parseInt(fields.xCrop), top = parseInt(fields.yCrop), width = parseInt(300*fields.size), height = parseInt(300*fields.size);
                            return image
                            .extract({ left, top, width, height })
                            .toFile(filePath, (err, info) => {
                                //aws
                                uploadFile(filePath, filename, f.file.type).then(function () {
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
                                // const blob = cfFileBucket.file("lingyo-media/" + filename);
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
                                // const containerClient = blobServiceClient.getContainerClient("lingyo-media");
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
                const reg = /image\/jpeg|image\/jpg|image\/png/gi;
                (async () => {
                    const mineType = await FileType.fromFile(f.file.path)
                    if (mineType.mime.match(reg)){
                        const root =  __dirname.replace('\controllers', '')
                        const image = sharp(f.file.path);
                        let filename
                        if (f.file.name > 255) { filename =  Date.now() + "_" + randomize('0', 6)}
                        else {filename =  Date.now() + "_" + randomize('0', 6) + "_" + f.file.name.replace(/[^\w\.]/gi, '')}
                        const filePath = path.join(root, 'uploads', filename)
                        image.metadata()
                        .then(metadata => {
                            const left = parseInt(fields.xCrop), top = parseInt(fields.yCrop), width = parseInt(500*fields.size), height = parseInt(200*fields.size);
                            return image
                            .extract({ left, top, width, height })
                            .toFile(filePath, (err, info) => {
                                //aws
                                uploadFile(filePath, filename, f.file.type).then(function () {
                                    (async function updateProfile(){
                                        await userProfile.update({
                                            cover: filename
                                        }, {
                                            where: {
                                                userId: req.user.userId
                                            }
                                        }).then(function(){
                                            fs.unlinkSync(filePath)
                                        })
                                    })()
                                    const data = {
                                        cover: filename,
                                        size: width
                                    }
                                    res.json({
                                        status: 'done',
                                        data: data
                                    })
                                })

                                //gg
                                // const blob = cfFileBucket.file("lingyo-media/" + filename);
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
                })()
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
            if (typeof(req.body.username) === "string"){
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
                res.end()
            }
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
                            ['read', 'ASC']
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
                                if (typeof(req.user.userId) === "number" && typeof(req.body.type) === "string" && typeof(user.userId) === "number"){
                                    if (!n){
                                        notifications.create({
                                            sourceUser: req.user.userId,
                                            postInfo: null,
                                            type: req.body.type,
                                            read: false,
                                            time: Date.now(),
                                            userId: user.userId
                                        }).then(function(){
                                            users.findOne({
                                                where: {
                                                    userId: req.user.userId
                                                }
                                            }).then(function(uname){
                                                mobileTokens.findOne({
                                                    where: {
                                                        userId: user.userId
                                                    }
                                                }).then(function(userNoti){
                                                    const content = `${uname} đã theo dõi bạn.`
                                                    var message = { 
                                                    app_id: "efa501b3-8346-4a6f-a6d8-2015fdb115b6",
                                                    contents: {"en": content},
                                                    // headings: {"en": "Heading"},
                                                    include_player_ids: [userNoti.token]
                                                    };
                                                        
                                                    sendNotification(message);
                                                    res.end()
                                                })
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
                            res.end()
                        }
                    }
                    else {
                        res.end()
                    }
                })
            }
            else if (req.body.type == "verify-user"){
                if (typeof(req.body.source) === "object" && typeof(req.body.type) === "string"){
                    notifications.findOne({
                        where: {
                            sourceUser: req.body.source[0],
                            postInfo: req.body.source,
                            type: req.body.type,
                            userId: req.body.source[0]
                        }
                    }).then(function(p){
                        if (!p){
                            notifications.create({
                                sourceUser: req.body.source[0],
                                postInfo: req.body.source,
                                type: req.body.type,
                                read: false,
                                time: Date.now(),
                                userId: req.body.source[0]
                            }).then(function(){
                                mobileTokens.findOne({
                                    where: {
                                        userId: req.body.source[0]
                                    }
                                }).then(function(userNoti){
                                    let content = ''
                                    if (req.body.source[1] == "true" || req.body.source[1] == true){
                                        content = "Bạn đã xác thực tài khoản thành công! Giờ đây bạn đã có thể đăng video tham gia bình chọn trên Lingyo, cảm ơn bạn đã tham gia xác thực tài khoản!"
                                    }
                                    else {
                                        content = "Xác thực tài khoản không thành công! Hãy thử lại và đảm bảo thông tin bạn gửi đi là chính xác và trùng khớp."
                                    }
                                    var message = { 
                                    app_id: "efa501b3-8346-4a6f-a6d8-2015fdb115b6",
                                    contents: {"en": content},
                                    // headings: {"en": "Heading"},
                                    include_player_ids: [userNoti.token]
                                    };
                                        
                                    sendNotification(message);
                                    res.end()
                                })
                            })
                        }
                        else {
                            res.end()
                        }
                    })
                }
            }
            else if (req.body.type == "post-done"){
                if (typeof(req.user.userId) === "number" && typeof(req.body.source) === "object" && typeof(req.body.type) === "string"){
                    notifications.findOne({
                        where: {
                            sourceUser: req.user.userId,
                            postInfo: req.body.source,
                            type: req.body.type,
                            userId: req.user.userId
                        }
                    }).then(function(p){
                        if (!p){
                            notifications.create({
                                sourceUser: req.user.userId,
                                postInfo: req.body.source,
                                type: req.body.type,
                                read: false,
                                time: Date.now(),
                                userId: req.user.userId
                            }).then(function(){
                                users.findOne({
                                    where: {
                                        userId: req.user.userId
                                    }
                                }).then(function(uname){
                                    mobileTokens.findOne({
                                        where: {
                                            userId: p.userId
                                        }
                                    }).then(function(userNoti){
                                        let content = ''
                                        if (req.body.source[1]){
                                            content = `Bạn đã tạo một video tham dự mới thành công tại Thể loại ${req.body.source[1]} cấp ${req.body.source[2]} - MS: ${req.body.source[3]}`
                                        }
                                        else {
                                            content = 'Bạn đã tạo một bài viết mới thành công trong Cộng đồng'
                                        }
                                        var message = { 
                                        app_id: "efa501b3-8346-4a6f-a6d8-2015fdb115b6",
                                        contents: {"en": content},
                                        // headings: {"en": "Heading"},
                                        include_player_ids: [userNoti.token]
                                        };
                                            
                                        sendNotification(message);
                                    })
                                })
                                notifications.findAll({
                                    where: {
                                        sourceUser: req.user.userId,
                                        postInfo: req.body.source,
                                        type: req.body.type,
                                        userId: req.user.userId
                                    }
                                }).then(function(n){
                                    if (n.length > 1){
                                        notifications.destroy({
                                            where:{
                                                sourceUser: req.user.userId,
                                                postInfo: req.body.source,
                                                type: req.body.type,
                                                userId: req.user.userId
                                            }
                                        })
                                    }
                                })
                                res.end()
                            })
                        }
                        else {
                            res.end()
                        }
                    })
                }
            }
            else if (req.body.type == "post-err"){
                if (typeof(req.user.userId) === "number" && typeof(req.body.source) === "object" && typeof(req.body.type) === "string"){
                    notifications.findOne({
                        where: {
                            sourceUser: req.user.userId,
                            postInfo: req.body.source,
                            type: req.body.type,
                            userId: req.user.userId
                        }
                    }).then(function(p){
                        if (!p){
                            notifications.create({
                                sourceUser: req.user.userId,
                                postInfo: req.body.source,
                                type: req.body.type,
                                read: false,
                                time: Date.now(),
                                userId: req.user.userId
                            }).then(function(){
                                users.findOne({
                                    where: {
                                        userId: req.user.userId
                                    }
                                }).then(function(uname){
                                    mobileTokens.findOne({
                                        where: {
                                            userId: p.userId
                                        }
                                    }).then(function(userNoti){
                                        let content = ''
                                        if (req.body.source[1]){
                                            content = `Bạn đã tạo một video tham dự mới không thành công tại Thể loại ${req.body.source[1]} cấp ${req.body.source[2]}`
                                        }
                                        else {
                                            content = 'Tạo bài viết mới không thành công trong Cộng đồng'
                                        }
                                        var message = { 
                                        app_id: "efa501b3-8346-4a6f-a6d8-2015fdb115b6",
                                        contents: {"en": content},
                                        // headings: {"en": "Heading"},
                                        include_player_ids: [userNoti.token]
                                        };
                                            
                                        sendNotification(message);
                                        res.end()
                                    })
                                })
                                notifications.findAll({
                                    where: {
                                        sourceUser: req.user.userId,
                                        postInfo: req.body.source,
                                        type: req.body.type,
                                        userId: req.user.userId
                                    }
                                }).then(function(n){
                                    if (n.length > 1){
                                        notifications.destroy({
                                            where:{
                                                sourceUser: req.user.userId,
                                                postInfo: req.body.source,
                                                type: req.body.type,
                                                userId: req.user.userId
                                            }
                                        })
                                    }
                                })
                                res.end()
                            })
                        }
                        else {
                            res.end()
                        }
                    })
                }
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
                                    if(typeof(req.user.userId) === "number" && typeof(req.body.source) === "object" && typeof(req.body.type) === "string" && typeof(p.userId) === "number"){
                                        if (p.postFollowNotification){
                                            notifications.create({
                                                sourceUser: req.user.userId,
                                                postInfo: req.body.source,
                                                type: req.body.type,
                                                read: false,
                                                time: Date.now(),
                                                userId: p.userId
                                            }).then(function(){
                                                users.findOne({
                                                    where: {
                                                        userId: req.user.userId
                                                    }
                                                }).then(function(uname){
                                                    mobileTokens.findOne({
                                                        where: {
                                                            userId: p.userId
                                                        }
                                                    }).then(function(userNoti){
                                                        const content = `${uname} đã đăng một video mới vào Thể loại ${req.body.source[1]} cấp ${req.body.source[2]}`
                                                        var message = { 
                                                        app_id: "efa501b3-8346-4a6f-a6d8-2015fdb115b6",
                                                        contents: {"en": content},
                                                        // headings: {"en": "Heading"},
                                                        include_player_ids: [userNoti.token]
                                                        };
                                                            
                                                        sendNotification(message);
                                                        count ++
                                                        if (count == u.length){
                                                            res.end()
                                                        }
                                                    })
                                                })
                                            })
                                        }
                                        else {
                                            count ++
                                            if (count == u.length){
                                                res.end()
                                            }
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
                                                    if (typeof(req.body.source === "object")){
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
                                                            users.findOne({
                                                                where: {
                                                                    userId: u.userId
                                                                }
                                                            }).then(function(uname){
                                                                mobileTokens.findOne({
                                                                    where: {
                                                                        userId: p.userId
                                                                    }
                                                                }).then(function(userNoti){
                                                                    const content = `${uname} đã có video đạt ${req.body.source[1]} lượt bình chọn`
                                                                    var message = { 
                                                                    app_id: "efa501b3-8346-4a6f-a6d8-2015fdb115b6",
                                                                    contents: {"en": content},
                                                                    // headings: {"en": "Heading"},
                                                                    include_player_ids: [userNoti.token]
                                                                    };
                                                                        
                                                                    sendNotification(message);
                                                                    count ++
                                                                    if (count == profiles.length){
                                                                        res.end()
                                                                    }
                                                                })
                                                            })
                                                        })
                                                    }
                                                    else {
                                                        res.end()
                                                    }
                                                }
                                                else {
                                                    if (typeof(u.userId) === "number" && typeof(profiles[i].userId) === "number" && typeof(req.body.source) === "object" && typeof(req.body.type) === "string"){
                                                        notifications.create({
                                                            sourceUser: u.userId,
                                                            postInfo: req.body.source,
                                                            type: req.body.type,
                                                            read: false,
                                                            time: Date.now(),
                                                            userId: profiles[i].userId
                                                        }).then(function(){
                                                            users.findOne({
                                                                where: {
                                                                    userId: u.userId
                                                                }
                                                            }).then(function(uname){
                                                                mobileTokens.findOne({
                                                                    where: {
                                                                        userId: profiles[i].userId
                                                                    }
                                                                }).then(function(userNoti){
                                                                    const content = `${uname} đã có video đạt ${req.body.source[1]} lượt bình chọn`
                                                                    var message = { 
                                                                    app_id: "efa501b3-8346-4a6f-a6d8-2015fdb115b6",
                                                                    contents: {"en": content},
                                                                    // headings: {"en": "Heading"},
                                                                    include_player_ids: [userNoti.token]
                                                                    };
                                                                        
                                                                    sendNotification(message);
                                                                    count ++
                                                                    if (count == profiles.length){
                                                                        res.end()
                                                                    }
                                                                })
                                                            })
                                                        })
                                                    }
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
                            if (typeof(req.user.userId) === "number" && typeof(postInfo) === "object" && typeof(req.body.type) === "string" && typeof(post.userId) === "number"){
                                if (!n){
                                    notifications.create({
                                        sourceUser: req.user.userId,
                                        postInfo: postInfo,
                                        type: req.body.type,
                                        read: false,
                                        time: Date.now(),
                                        userId: post.userId
                                    }).then(function(){
                                        users.findOne({
                                            where: {
                                                userId: req.user.userId
                                            }
                                        }).then(function(uname){
                                            mobileTokens.findOne({
                                                where: {
                                                    userId: post.userId
                                                }
                                            }).then(function(userNoti){
                                                let content = ''
                                                if (postInfo[2]){
                                                    content = `${uname} đã bình chọn video của bạn tại Thể loại ${postInfo[2]} cấp ${postInfo[3]}`
                                                }
                                                else {
                                                    content = `${uname} đã yêu thích bài viết của bạn`
                                                }
                                                var message = { 
                                                app_id: "efa501b3-8346-4a6f-a6d8-2015fdb115b6",
                                                contents: {"en": content},
                                                // headings: {"en": "Heading"},
                                                include_player_ids: [userNoti.token]
                                                };
                                                console.log(userNoti.token) 
                                                sendNotification(message);
                                                res.end()
                                            })
                                        })
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
                                            users.findOne({
                                                where: {
                                                    userId: req.user.userId
                                                }
                                            }).then(function(uname){
                                                mobileTokens.findOne({
                                                    where: {
                                                        userId: post.userId
                                                    }
                                                }).then(function(userNoti){
                                                    let content = ''
                                                    if (postInfo[2]){
                                                        content = `${uname} đã bình chọn video của bạn tại Thể loại ${postInfo[2]} cấp ${postInfo[3]}`
                                                    }
                                                    else {
                                                        content = `${uname} đã yêu thích bài viết của bạn`
                                                    }
                                                    var message = { 
                                                    app_id: "efa501b3-8346-4a6f-a6d8-2015fdb115b6",
                                                    contents: {"en": content},
                                                    // headings: {"en": "Heading"},
                                                    include_player_ids: [userNoti.token]
                                                    };
                                                    console.log(userNoti.token) 
                                                    sendNotification(message);
                                                    res.end()
                                                })
                                            })
                                        })
                                    }
                                    else {
                                        res.end()
                                    }
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
                                notifications.findAll({
                                    raw: true,
                                    where: {
                                        postInfo: {
                                            [Op.like]: [postId + '%']
                                        },
                                        type: req.body.type,
                                        userId: post.userId
                                    }
                                }).then(function(e){
                                    if (e.length > 1){
                                        notifications.destroy({
                                            where: {
                                                postInfo: {
                                                    [Op.like]: [postId + '%']
                                                },
                                                type: req.body.type,
                                                userId: post.userId
                                            }
                                        })
                                    }
                                })
                                postInfo[4] = (total.length - 1).toString()
                                if (typeof(req.user.userId) === "number" && typeof(postInfo) === "object" && typeof(req.body.type) === "string" && typeof(post.userId) === "number"){
                                    if (!n){
                                        notifications.create({
                                            sourceUser: req.user.userId,
                                            postInfo: postInfo,
                                            type: req.body.type,
                                            read: false,
                                            time: Date.now(),
                                            userId: post.userId
                                        }).then(function(){
                                            users.findOne({
                                                where: {
                                                    userId: req.user.userId
                                                }
                                            }).then(function(uname){
                                                mobileTokens.findOne({
                                                    where: {
                                                        userId: post.userId
                                                    }
                                                }).then(function(userNoti){
                                                    const content = `${uname} đã bình luận về video của bạn tại Thể loại ${postInfo[2]} cấp ${postInfo[3]}`
                                                    var message = { 
                                                    app_id: "efa501b3-8346-4a6f-a6d8-2015fdb115b6",
                                                    contents: {"en": content},
                                                    // headings: {"en": "Heading"},
                                                    include_player_ids: [userNoti.token]
                                                    };
                                                        
                                                    sendNotification(message);
                                                    res.end()
                                                })
                                            })
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
                                            users.findOne({
                                                where: {
                                                    userId: req.user.userId
                                                }
                                            }).then(function(uname){
                                                mobileTokens.findOne({
                                                    where: {
                                                        userId: post.userId
                                                    }
                                                }).then(function(userNoti){
                                                    const content = `${uname} đã bình luận về video của bạn tại Thể loại ${postInfo[2]} cấp ${postInfo[3]}`
                                                    var message = { 
                                                    app_id: "efa501b3-8346-4a6f-a6d8-2015fdb115b6",
                                                    contents: {"en": content},
                                                    // headings: {"en": "Heading"},
                                                    include_player_ids: [userNoti.token]
                                                    };
                                                        
                                                    sendNotification(message);
                                                    res.end()
                                                })
                                            })
                                        })
                                    }
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
                                if (!f && typeof(profile.userId) === "number" && typeof(isUser.userId) === "number"){
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

    app.post("/user-auth", function(req, res){
        if (req.isAuthenticated()){
            req.session.tryTime = 0
            req.session.blockLogin = false
            userAuth.findOne({
                where: {
                    userId: req.user.userId
                }
            }).then(function(a){
                if (!a){
                    const form = formidable()
                    form.parse(req, (err, fields, f) => {
                        const reg = /image\/jpeg|image\/jpg|image\/png/gi;
                        (async () => {
                            const mineType = await FileType.fromFile(f.file.path)
                            if (mineType.mime.match(reg)){
                                uploadFile(f.file.path, f.file.name, f.file.type).then(function (err) {
                                    const data = fields.image.replace(/^data:image\/\w+;base64,/, "");
                                    const buf = Buffer.from(data, "base64");
                                    const root =  __dirname.replace('\controllers', '')
                                    const filePath = path.join(root, `uploads\\auth_image_${req.user.userId}.png`)
                                    fs.writeFile(filePath, buf, () => {
                                        uploadFile(filePath, `auth_image_${req.user.userId}.png`, 'png').then(function (err) {
                                            userAuth.create({
                                                face: `auth_image_${req.user.userId}.png`,
                                                file: f.file.name,
                                                userId: req.user.userId,
                                                auth: false
                                            }).then(function(){
                                                fs.unlinkSync(filePath)
                                                res.json({
                                                    status: 'done',
                                                })
                                            })
                                        })
                                    })
                                })
                            }
                            else {
                                res.json({
                                    status: "err"
                                })
                            }
                        })()
                    })
                }
                else {
                    res.end()
                }
            })
        }
        else {
            res.json({
                status: 'done',
            })
        }
    })

    app.get("/verify-center", function(req, res){
        if (req.isAuthenticated()){
            users.findOne({
                where: {
                    userId: req.user.userId
                }
            }).then(function(user){
                if (user.role == "moderator"){
                    req.session.tryTime = 0
                    req.session.blockLogin = false
                    userAuth.findAll({
                        where: {
                            auth: false
                        }
                    }).then(function(u){
                        const userList = []
                        const name = [], birthday = [], location = []
                        if (u.length != 0){
                            let count = 0
                            for (let i = 0; i < u.length; i++){
                                userProfile.findOne({
                                    where: {
                                        userId: u[i].userId
                                    }
                                }).then(function(p){
                                    birthday[i] = p.birthday
                                    location[i] = p.location
                                    userList[i] = u[i]
                                    users.findOne({
                                        where: {
                                            userId: u[i].userId
                                        }
                                    }).then(function(user){
                                        count ++
                                        name[i] = user.username
                                        if (count == u.length){
                                            res.render("userAuth", {userList: userList, name: name, birthday: birthday, location: location})
                                        }
                                    })
                                })
                            }
                        }
                        else {
                            res.render("userAuth", {userList: userList, name: name, birthday: birthday, location: location})
                        }
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
                                    let userRank = '', rankIndex = 0
                                    if (req.user.userId == user.userId){
                                        isCurrentUser = true
                                    }
                                    for (let r = 0; r < levelList.length; r++){
                                        if (profile.rank == levelList[r]){
                                            userRank = levelName[r]
                                            rankIndex = r
                                        }
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
                                                                res.render("personal", {isCurrentUser: isCurrentUser, username: req.user.username, currentUsername: currentUser.username, currentUserId: currentUser.userId, currentProfile: currentProfile, followed: followed, user: user, profile: profile, posts: p, postProfile: postProfile, postLiked: postLiked, saved: saved, active: '', cateActive: '', cateName: '', userRank: userRank, rankIndex: rankIndex, rank: false, modal: modal})
                                                            }
                                                        })
                                                    })
                                                })
                                            }
                                        }
                                        else {
                                            res.render("personal", {isCurrentUser: isCurrentUser, username: req.user.username, currentUsername: currentUser.username, currentUserId: currentUser.userId, currentProfile: currentProfile, followed: followed, user: user, profile: profile, posts: p, postProfile: postProfile, postLiked: postLiked, saved: saved, active: '', cateActive: '', cateName: '', userRank: userRank, rankIndex: rankIndex, rank: false, modal: modal})
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