const nodemailer = require("nodemailer")
const fs = require('fs')


module.exports = function(email, code){
    const output = `<span>Video ${code} cần kiểm duyệt</span><br><a href="https://fodance.com/moderate">Duyệt ngay!</a>`

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service: 'gmail',
        secure: false,
        port: 30,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }, 
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions= ({
        from: '"Lingyo" <fodancemailer@gmail.com>',
        to: email,
        subject: `Kiểm duyệt`,
        html: output
    })

    transporter.sendMail(mailOptions, function(error){
        if (error) {
            console.log(error)
        }
    })
}