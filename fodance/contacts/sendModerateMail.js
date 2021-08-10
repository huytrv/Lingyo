const nodemailer = require("nodemailer")
const fs = require('fs')


module.exports = function(email, code){
    const output = `<span>Bài viết ${code} cần kiểm duyệt</span><br><a href="https://fodance.com/moderate">Duyệt ngay!</a>`

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service: 'gmail',
        secure: false,
        port: 30,
        auth: {
            user: 'fodancemailer@gmail.com',
            pass: 'stafield2905@'
        }, 
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions= ({
        from: '"Fodance" <fodancemailer@gmail.com>',
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