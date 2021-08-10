const sharp = require('sharp');
const formidable = require('formidable')
const randomize = require("randomatic")
const path = require("path");
const fs = require('fs')


module.exports = function(app, users){
    app.get('/tester', function(req, res){
        res.render("tester")
    })

    const {Storage} = require('@google-cloud/storage');
    const gc = new Storage({
        keyFilename: path.join(__dirname, "../cf-project-318304-41a96963c2de.json"),
        projectId: "cf-project-318304"
    })

    const cfFileBucket = gc.bucket("fodance-bk")

    app.post("/record", function(req, res){
        async function saveFile() {
            const form = formidable()
            form.parse(req, (err, fields, f) => {
                console.log(f.file)
                var rawData = fs.readFileSync(f.file.path)
                const blob = cfFileBucket.file("cf-media/record-file.webm");
                const blobStream = blob.createWriteStream();
                blobStream.end(rawData)
               
            })
        }
        saveFile()
    })
}