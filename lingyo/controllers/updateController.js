const sharp = require('sharp');
const formidable = require('formidable')
const randomize = require("randomatic")
const path = require("path");
const fs = require('fs')
// var ffmpeg = require('fluent-ffmpeg');
const ffmpeg = require('ffmpeg');
const Ffmpeg = require('fluent-ffmpeg');


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
                var buffer = fs.readFileSync(f.file.path);
                console.log(buffer)
                const filePath = path.join(__dirname, "../uploads/record-file.webm")
                // fs.writeFile(filePath, buffer, () => {
                //     if (err)
                //         console.log(err);
                //     else {
                //         console.log("done!")
                //     }
                    try {
                    var process = new ffmpeg(path.join(__dirname, "../public/videos/video.mp4"));
                    Ffmpeg(path.join(__dirname, "../public/videos/video.mp4"))
                    .output(path.join(__dirname, "../uploads/record-file-new.mp4"))
                    .size('1920x1080')
                    .on('error', function(err) {
                        console.log('An error occurred: ' + err.message);
                        
                    })	
                    .on('progress', function(progress) { 
                        console.log('... frames: ' + progress.frames);
                        
                    })
                    .on('end', function() { 
                        console.log('Finished processing'); 
                        
                    })
                    .run();
                    // process.then(function (video) {
                    //     console.log('Video is ready to be processed');
                    //     var watermarkPath = path.join(__dirname, "../public/images/logo/logo1.png"),
                    //     newFilepath = path.join(__dirname, "../uploads/record-file-new.mp4"),
                    //     settings = {
                    //         position        : "SE"      // Position: NE NC NW SE SC SW C CE CW
                    //         , margin_nord     : null      // Margin nord
                    //         , margin_sud      : null      // Margin sud
                    //         , margin_east     : null      // Margin east
                    //         , margin_west     : null      // Margin west
                    //     };
                    //     var callback = function (error, files) {
                    //     if(error){
                    //         console.log('ERROR: ', error);
                    //     }
                    //     else{
                    //         console.log('TERMINOU', files);
                    //     }
                    //     }
                    //     //add watermark Function
                    //     video.fnAddWatermark(watermarkPath, newFilepath, settings, callback)

                    // }, function (err) {
                    //     console.log('Error: ' + err);
                    // });
                    } catch (err) {
                    console.log(err);
                    }
                })

                // var rawData = fs.readFileSync(f.file.path)
                // const blob = cfFileBucket.file("lingyo-media/record-file.webm");
                // const blobStream = blob.createWriteStream();
                // blobStream.end(rawData)
               
            // })
        }
        saveFile()
    })
}