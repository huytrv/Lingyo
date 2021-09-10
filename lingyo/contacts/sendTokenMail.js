const nodemailer = require("nodemailer")

module.exports = function(email, token){
    const link = "https://fodance.com/reset-password/" + token
    const output = `<table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#ffffff" style="padding:0px;line-height:1px;font-size:1px;margin:0px auto; color: black">
    <tbody>
    <tr>
    <td width="100%" align="center" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px">
    
    <table cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#88c8e8" width="100%" dir="ltr" style="padding:0px;line-height:1px;font-size:1px;margin:0px auto">
    <tbody>
    <tr>
    <td style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px">
    <table cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#ffffff" width="450" style="padding:0px;line-height:1px;font-size:1px;margin:0px auto">
    <tbody>
    <tr>
    <td width="24" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    <td style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px">
    <table cellpadding="0" cellspacing="0" border="0" align="center" dir="ltr" style="padding:0px;line-height:1px;font-size:1px;margin:0px auto">
    <tbody>
    <tr>
    <td height="24" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    </tr>
    <tr>
    <td align="center" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px;font-size:0px;line-height:100%;padding:0px"> <a href="http://https://fodance.com" style="text-decoration:none;border-style:none;border:0px;padding:0px;margin:0px;color:#FFF6F6;text-decoration:none" target="_blank" data-saferedirecturl="https://fodance.com"> <img src="https://cdn.fodance.com/fd-media/logo1.png" width="50px" height="50px" alt="Lingyo" title="Lingyo" style="margin:0px;padding:0px;display:inline-block;border:none;outline:none"> </a> </td>
    </tr>
    <tr>
    <td height="24" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    </tr>
    <tr>
    <td align="left" dir="ltr" style="padding:0px;margin:0px auto;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:24px;padding:0px;margin:0px;font-weight:bold;line-height:32px"> Xác nhận đặt lại mật khẩu
    </td>
    </tr>
    <tr>
    <td height="24" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    </tr>
    <tr>
    <td align="left" dir="ltr" style="padding:0px;margin:0px auto;font-family:'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;padding:0px;margin:0px;font-weight:normal;line-height:20px;font-family:'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;padding:0px;margin:0px;font-weight:normal;line-height:22px"> Bạn đã gửi yêu cầu đặt lại mật khẩu, vui lòng truy cập liên kết sau để tiếp tục:
    </td>
    </tr>
    <tr>
    <td style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    </tr>
    <tr>
    <td height="5" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    </tr>
    <tr>
    <td align="left" dir="ltr" style="padding:0px;margin:0px auto;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size: 13px;padding:0px;margin:0px; color: blue; line-height:36px;"> <button style="background-color: #0c99bd; border-radius: 3px; border: 1px solid transparent; padding: 5px 8px;"> <a href="${link}" style="color: white; text-decoration: none">Đặt lại mật khẩu</a></button></td>
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
    <td align="left" dir="ltr" style="padding:0px;margin:0px auto;font-family:'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;padding:0px;margin:0px;font-weight:normal;line-height:20px;font-family:'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;padding:0px;margin:0px;font-weight:normal;line-height:22px"> Cảm ơn,<br> Lingyo </td>
    </tr>
    <tr>
    <td height="32" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    </tr>
    </tbody>
    </table> </td>
    <td width="24" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    </tr>
    </tbody>
    </table>
    <table cellpadding="0" cellspacing="0" border="0" align="center" width="450" bgcolor="#ffffff" style="padding:0px;line-height:1px;font-size:1px;margin:0px auto">
    <tbody>
    <tr>
    <td width="24" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
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
    <td align="center" style="padding:0px;margin:0px auto;font-family:'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:12px;padding:0px;margin:0px;font-weight:normal;line-height:16px;text-align:center;margin:auto;color:#8899a6"> <span>Lingyo 2020</span> </td>
    </tr>
    <tr>
    <td height="50" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    </tr>
    </tbody>
    </table> </td>
    <td width="24" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    </tr>
    </tbody>
    </table> </td>
    </tr>
    <tr>
    <td height="32" style="padding:0px;margin:0px auto;font-size:0px;line-height:1px;padding:0px"> &nbsp; </td>
    </tr>
    </tbody>
    </table>
        </td>
    </tr>
    <tr>
    <td align="center" style="padding:0px;margin:0px auto;color:#ffffff;font-family:Arial,sans-serif;font-size:14px"> ———————————————————————————— </td>
    </tr>
    <tr>
    <td align="center" style="padding:0px;margin:0px auto">
    <table align="center" style="padding:0px;line-height:1px;font-size:1px;margin:0px auto">
    <tbody>
    <tr>
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
        from: '"Lingyo" <fodancemailer@gmail.com>',
        to: email,
        subject: "Đặt lại mật khẩu",
        html: output 
    })

    transporter.sendMail(mailOptions, function(error){
    })
}