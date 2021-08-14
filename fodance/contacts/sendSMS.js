module.exports = function(number, code){
    console.log(code)
    let text = `Mã xác nhận Fodance của bạn là ${code}`
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    String.prototype.replaceBetween = function(start, end, what) {
        return this.substring(0, start) + what + this.substring(end)
    }
    toNumber = number.replaceBetween(0, 1, '+84')
    client.messages
    .create({
        body: text,
        from: '+12185101268',
        to: toNumber
    })
    .then(message => console.log(message))
    .catch(err => console.log(err));
}
