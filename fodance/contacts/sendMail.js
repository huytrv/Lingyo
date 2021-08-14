const nodemailer = require("nodemailer")
const fs = require('fs')


module.exports = function(email, code){
    const output = `<table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#ffffff" style="padding:0px;line-height:1px;font-size:1px;margin:0px auto">
    <tbody>
    <tr>
    <td width="100%" align="center" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px">
    
    <table cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#88c8e8" width="100%" class="m_-8068505498448462036width_full" dir="ltr" style="padding:0px;line-height:1px;font-size:1px;margin:0px auto">
    <tbody>
    <tr>
    <td style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px">
    <table cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#ffffff" width="450" class="m_-8068505498448462036width_full" style="padding:0px;line-height:1px;font-size:1px;margin:0px auto">
    <tbody>
    <tr>
    <td class="m_-8068505498448462036width_20" width="24" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    <td style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px">
    <table cellpadding="0" cellspacing="0" border="0" align="center" dir="ltr" style="padding:0px;line-height:1px;font-size:1px;margin:0px auto">
    <tbody>
    <tr>
    <td height="24" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    </tr>
    <tr>
    <td align="center" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px;font-size:0px;line-height:100%;padding:0px"> <a href="https://fodance.com" style="text-decoration:none;border-style:none;border:0px;padding:0px;margin:0px;color:#FFF6F6;text-decoration:none" target="_blank" data-saferedirecturl=""> <img src="https://cdn.fodance.com/fd-media/logo1.png" width="50px" height="50px" alt="Fodance" title="Fodance" style="margin:0px;padding:0px;display:inline-block;border:none;outline:none" class="CToWUd"> </a> </td>
    </tr>
    <tr>
    <td height="24" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    </tr>
    <tr>
    <td align="left" dir="ltr" style="padding:0px;margin:0px auto;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:24px;padding:0px;margin:0px;font-weight:bold;line-height:32px"> Xác nhận địa chỉ email của bạn
    </td>
    </tr>
    <tr>
    <td height="24" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    </tr>
    <tr>
    <td align="left" dir="ltr" style="padding:0px;margin:0px auto;font-family:'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;padding:0px;margin:0px;font-weight:normal;line-height:20px;font-family:'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;padding:0px;margin:0px;font-weight:normal;line-height:22px"> Chào mừng bạn đến với Fodance. Trước khi bắt đầu, bạn cần đảm bảo đây là địa chỉ email chính xác để sử dụng cho tài khoản mới của bạn.
    </td>
    </tr>
    <tr>
    <td height="24" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    </tr>
    <tr>
    <td align="left" dir="ltr" style="padding:0px;margin:0px auto;font-family:'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;padding:0px;margin:0px;font-weight:normal;line-height:20px;font-family:'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;padding:0px;margin:0px;font-weight:normal;line-height:22px"> Vui lòng nhập mã xác minh này để bắt đầu trên Fodance: </td>
    </tr>
    <tr>
    <td style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    </tr>
    <tr>
    <td align="left" dir="ltr" style="padding:0px;margin:0px auto;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:32px;padding:0px;margin:0px;font-weight:bold;line-height:36px"> ${code} </td>
    </tr>
    <tr>
    <td height="6" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    </tr>
    <tr>
    <td align="left" dir="ltr" style="padding:0px;margin:0px auto;font-family:'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:14px;padding:0px;margin:0px;font-weight:normal;line-height:18px"> Xác minh hết hạn sau hai giờ.
    </td>
    </tr>
    <tr>
    <td height="24" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    </tr>
    <tr>
    <td align="left" dir="ltr" style="padding:0px;margin:0px auto;font-family:'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;padding:0px;margin:0px;font-weight:normal;line-height:20px;font-family:'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;padding:0px;margin:0px;font-weight:normal;line-height:22px"> Cảm ơn,<br> Fodance </td>
    </tr>
    <tr>
    <td height="32" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    </tr>
    </tbody>
    </table> </td>
    <td class="m_-8068505498448462036width_20" width="24" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    </tr>
    </tbody>
    </table>
    <table cellpadding="0" cellspacing="0" border="0" align="center" width="450" class="m_-8068505498448462036width_full" bgcolor="#ffffff" style="padding:0px;line-height:1px;font-size:1px;margin:0px auto">
    <tbody>
    <tr>
    <td class="m_-8068505498448462036width_20" width="24" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    <td style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px">
    <table align="center" dir="ltr" style="padding:0px;line-height:1px;font-size:1px;margin:0px auto">
    <tbody>
    <tr>
    <td height="48" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    </tr>
    <tr>
    <td height="12" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    </tr>
    <tr>
    <td align="center" style="padding:0px;margin:0px auto;font-family:'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:12px;padding:0px;margin:0px;font-weight:normal;line-height:16px;text-align:center;margin:auto;color:#8899a6"> <span class="m_-8068505498448462036addressLink">Fodance 2020</span> </td>
    </tr>
    <tr>
    <td height="50" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    </tr>
    </tbody>
    </table> </td>
    <td class="m_-8068505498448462036width_20" width="24" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    </tr>
    </tbody>
    </table> </td>
    </tr>
    <tr class="m_-8068505498448462036hide">
    <td class="m_-8068505498448462036hide" height="32" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    </tr>
    </tbody>
    </table>
        </td>
    </tr>
    <tr>
    <td id="m_-8068505498448462036hide" align="center" style="padding:0px;margin:0px auto;color:#ffffff;font-family:Arial,sans-serif;font-size:14px"> ———————————————————————————— </td>
    </tr>
    <tr>
    <td id="m_-8068505498448462036hide" align="center" style="padding:0px;margin:0px auto">
    <table align="center" style="padding:0px;line-height:1px;font-size:1px;margin:0px auto">
    <tbody>
    <tr>
    <td width="135" height="1" style="padding:0px;margin:0px auto"> <img src="https://ci4.googleusercontent.com/proxy/SoWCQOMRDq_a0-Djhzpfp0WjZ4MR3e8NGibOFCVxwar8sSCZv4TE74DAvAXin4Y7Jfs8YhqRIBdHtvR8MPYX1FcunlJ_S8z4BWfwaJHFXYXntCYjqpCX=s0-d-e1-ft#https://ea.twimg.com/email/self_serve/media/spacer-1476918453497.png" height="1" width="130" style="margin:0px;padding:0px;display:inline-block;border:none;outline:none" class="CToWUd"> </td>
    <td width="135" height="1" style="padding:0px;margin:0px auto"> <img src="https://ci4.googleusercontent.com/proxy/SoWCQOMRDq_a0-Djhzpfp0WjZ4MR3e8NGibOFCVxwar8sSCZv4TE74DAvAXin4Y7Jfs8YhqRIBdHtvR8MPYX1FcunlJ_S8z4BWfwaJHFXYXntCYjqpCX=s0-d-e1-ft#https://ea.twimg.com/email/self_serve/media/spacer-1476918453497.png" height="1" width="130" style="margin:0px;padding:0px;display:inline-block;border:none;outline:none" class="CToWUd"> </td>
    <td width="135" height="1" style="padding:0px;margin:0px auto"> <img src="https://ci4.googleusercontent.com/proxy/SoWCQOMRDq_a0-Djhzpfp0WjZ4MR3e8NGibOFCVxwar8sSCZv4TE74DAvAXin4Y7Jfs8YhqRIBdHtvR8MPYX1FcunlJ_S8z4BWfwaJHFXYXntCYjqpCX=s0-d-e1-ft#https://ea.twimg.com/email/self_serve/media/spacer-1476918453497.png" height="1" width="130" style="margin:0px;padding:0px;display:inline-block;border:none;outline:none" class="CToWUd"> </td>
    <td width="135" height="1" style="padding:0px;margin:0px auto"> <img src="https://ci4.googleusercontent.com/proxy/SoWCQOMRDq_a0-Djhzpfp0WjZ4MR3e8NGibOFCVxwar8sSCZv4TE74DAvAXin4Y7Jfs8YhqRIBdHtvR8MPYX1FcunlJ_S8z4BWfwaJHFXYXntCYjqpCX=s0-d-e1-ft#https://ea.twimg.com/email/self_serve/media/spacer-1476918453497.png" height="1" width="130" style="margin:0px;padding:0px;display:inline-block;border:none;outline:none" class="CToWUd"> </td>
    <td width="135" height="1" style="padding:0px;margin:0px auto"> <img src="https://ci4.googleusercontent.com/proxy/SoWCQOMRDq_a0-Djhzpfp0WjZ4MR3e8NGibOFCVxwar8sSCZv4TE74DAvAXin4Y7Jfs8YhqRIBdHtvR8MPYX1FcunlJ_S8z4BWfwaJHFXYXntCYjqpCX=s0-d-e1-ft#https://ea.twimg.com/email/self_serve/media/spacer-1476918453497.png" height="1" width="130" style="margin:0px;padding:0px;display:inline-block;border:none;outline:none" class="CToWUd"> </td>
    </tr>
    </tbody>
    </table> </td>
    </tr>
    </tbody>
    </table>`

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
        from: '"Fodance" <fodancemailer@gmail.com>',
        to: email,
        subject: `${code} là mã xác nhận Fodance của bạn`,
        html: output
    })

    transporter.sendMail(mailOptions, function(error){
        if (error) {
            console.log(error)
        }
    })
}