module.exports = function(number, code){
    console.log(code)
    let text = `Mã xác nhận Fodance của bạn là ${code}`
    const accountSid = "AC8b975ff51ce434185551336f53ca60f9";
    const authToken = "3957c1a689e6815adbd948fa2abf937b";
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
