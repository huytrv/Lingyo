const showAlert = function(text){
    if (document.querySelectorAll(".alert").length != 0){
        document.querySelectorAll(".alert").forEach(function(e){
            e.remove()
        })
    }
    let alert = document.createElement("div")
    alert.classList.add("alert")
    let textAlert = document.createTextNode(text)
    alert.appendChild(textAlert)
    document.querySelector(".global").appendChild(alert)
    setTimeout(function() {
        if (document.querySelectorAll(".alert").length != 0){
            document.querySelector(".alert").remove()
        }
    }, 3000)
}

if (document.querySelector(".confirm-auth")) {
    let track, faceItv, dataURL
    let faceValid, faceValid1, faceValid2, faceValid3, faceValid4 = false
    document.querySelector(".confirm-auth").onclick = function(){
        document.querySelector(".unfollow-modal").remove()
        document.querySelector("body").insertAdjacentHTML('beforeend', `<div class="modal unfollow-modal"><div class="user-auth-modal"><div class="modal-content unfollow-modal-content"><div class="group-title d-flex">
        ${(()=>{if (window.innerWidth <= 662){return `
            <span class="font-size-lg-2">Xác thực khuôn mặt</span>
            <div class="close-auth-modal return-but"><span class="iconify" data-icon="heroicons-outline:arrow-left" data-inline="false"></span></div>
        `}
        else {
            return `
            <span class="font-size-lg-4">Xác thực khuôn mặt</span>
            <button class='close close-auth-modal' type="button">
                <span class='iconify dropdown-icon' data-icon='feather:x' data-inline='false'></span>
            </button>
            `
        }
        })()}</div><div class="border-b"></div><div class="edit-profile-frame">
        <div class="pd d-flex">Trước tiên hãy xác thực khuôn mặt, hình ảnh xác thực này ở chế độ riêng tư trong bản ghi của Lingyo.</div>
        <div class="auth-video">
        <video autoplay muted></video>
        <div class="loading-frame d-flex"><span class="iconify spin loading-icon" data-icon="ant-design:loading-3-quarters-outlined" data-inline="false"></span></div>
        </div>
        <div class="d-flex"><h3 class="face-request pd">Chờ một chút trong khi chúng tôi nhận dạng khuôn mặt bạn!</h3></div>
        </div></div></div>`)
        const video = document.querySelector('.auth-video video')
        showAlert(0)
        Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]).then(startVideo)

        function startVideo() {
            // navigator.getUserMedia(
            //     { video: {facingMode: 'environment'} },
            //     stream => video.srcObject = track = stream,
            //     err =>  showAlert(err),
            // )
            const constraints = { audio: false, video: { facingMode: "user" } }
            navigator.mediaDevices.getUserMedia(constraints)
            .then(function(mediaStream) {
            if (typeof video.srcObject == "object") {
                video.srcObject = mediaStream;
            } else {
            video.src = URL.createObjectURL(mediaStream);
            }
            track = mediaStream
            video.onloadedmetadata = function(e) {
                video.play();
                document.querySelector(".loading-frame").remove()
            };
            })
            .catch(function(err) { showAlert(err.name + ": " + err.message); });
        }

        const faceReq = document.querySelector(".face-request")

        video.addEventListener('playing', () => {
        const canvas = faceapi.createCanvasFromMedia(video)
        document.querySelector(".auth-video").append(canvas)
        const displaySize = { width: video.offsetWidth, height: video.offsetHeight }
        faceapi.matchDimensions(canvas, displaySize)
        faceItv = setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
            const resizedDetections = faceapi.resizeResults(detections, displaySize)
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            canvas.style.display = "none"
            // faceapi.draw.drawDetections(canvas, resizedDetections)
            // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
            // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
            if (detections[0]){
                if (!detections[0].expressions){faceValid = false}
                else {
                    faceValid = true
                    if (!faceValid1){
                        faceReq.textContent = "1.Bạn hãy cười lên!"
                        if (detections[0].expressions.happy > 0.9){faceValid1 = true}
                    }
                    if (faceValid1 && !faceValid2){
                        faceReq.textContent = "2.Bạn hãy làm mặt buồn cái nào!"
                        if (detections[0].expressions.sad > 0.5){faceValid2 = true}
                    }
                    if (faceValid1 && faceValid2 && !faceValid3){
                        faceReq.textContent = "3.Bạn hãy tỏ vẻ ngạc nhiên nào!"
                        if (detections[0].expressions.surprised > 0.2){faceValid3 = true}
                    }    
                    if (faceValid1 && faceValid2 && faceValid3 && !faceValid4){  
                        faceReq.textContent = "4.Hãy để mặt tự nhiên nhất..."
                        console.log(detections[0].expressions.neutral)
                        if (detections[0].expressions.neutral >= 0.99){
                            faceValid4 = true
                            const f = document.createElement("CANVAS")
                            f.width = video.offsetWidth
                            f.height = video.offsetHeight
                            f.getContext('2d').drawImage(video, 0, 0, f.width, f.height);
                            dataURL = f.toDataURL()                          
                        }   
                    }                 
                }
                if (faceValid && faceValid1 && faceValid2 && faceValid3 && faceValid4) {
                    clearInterval(faceItv)
                    track.getTracks().forEach(function(e) {
                        e.stop();
                    });
                    faceReq.innerHTML = '<span class="theme-color">Đã hoàn tất xác thực khuôn mặt!</span>'
                    
                    setTimeout(function(){
                        document.querySelectorAll(".modal").forEach(function(e){
                            e.remove()
                        })
                        document.querySelector(".avatar-frame").insertAdjacentHTML('beforeend', `<div class="modal unfollow-modal"><div class="user-auth-modal"><div class="modal-content unfollow-modal-content"><div class="group-title d-flex">
                        ${(()=>{if (window.innerWidth <= 662){return `
                            <span class="font-size-lg-2">Xác minh tài liệu</span>
                            <div class="close-auth-modal return-but"><span class="iconify" data-icon="heroicons-outline:arrow-left" data-inline="false"></span></div>
                        `}
                        else {
                            return `
                            <span class="font-size-lg-4">Xác minh tài liệu</span>
                            <button class='close close-auth-modal' type="button">
                                <span class='iconify dropdown-icon' data-icon='feather:x' data-inline='false'></span>
                            </button>
                            `
                        }
                        })()}</div><div class="border-b"></div><div class="edit-profile-frame">
                        <div class="pd d-flex">Gửi lên giấy tờ tùy thân của bạn (như CMT, Thẻ căn cước..).</div>
                        <div class="pd d-flex">Tài liệu cần rõ ràng, không bị mờ hay khuất góc.</div>
                        <div class="d-flex">
                        <label class="create-post-custom-but upload-label noselect width-40 pd">
                            <input accept="image/jpeg,image/jpg,image/png" type='file' name='auth-files' class="auth-file-upload">
                            <span class='iconify create-post-icon' data-icon='bi:card-image' data-inline='false'></span><span>Tải lên</span>
                        </label>
                        </div>
                        <div class="pd auth-file-name"></div>
                        <div class="pd">
                            <button class="submit-but submit-auth">Gửi</button>
                        </div>
                        </div>
                        </div></div></div>`)

                        document.querySelector(".auth-file-upload").onchange = function(evt){
                            const file = evt.target.files[0]
                            let fileReader = new FileReader();
                            fileReader.onloadend = function(e) {
                                let arr = (new Uint8Array(e.target.result)).subarray(0, 4);
                                let header = "";
                                for(let i = 0; i < arr.length; i++) {
                                    header += arr[i].toString(16);
                                }
                                const reg = /image\/jpeg|image\/jpg|image\/png/gi
                                switch (header) {
                                    case "89504e47":
                                        type = "image/png";
                                        break;
                                    case "ffd8ffe0":
                                    case "ffd8ffe1":
                                    case "ffd8ffe2":
                                    case "ffd8ffe3":
                                    case "ffd8ffdb":
                                    case "ffd8ffee":
                                    case "ffd8ffe8":
                                        type = "image/jpeg";
                                        break;
                                    default:
                                        type = "unknown";
                                        break;
                                }
                                if (type.match(reg)) {
                                    document.querySelector(".auth-file-name").textContent = file.name
                                    document.querySelector(".submit-auth").onclick = function(){
                                        let xhttp
                                        if (window.XMLHttpRequest) {
                                            xhttp = new XMLHttpRequest()
                                        } else {
                                            xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                                        }
                                        let formData = new FormData()
                                        formData.append('image', dataURL)
                                        formData.append('file', file)
                                        document.querySelectorAll(".modal").forEach(function(e){
                                            e.remove()
                                        })
                                        document.querySelector(".avatar-frame").insertAdjacentHTML("afterbegin", `<div class='modal unfollow-modal'><div class='modal-content unfollow-modal-content d-flex-col'><div class='mg-b-lg'><h2 class='d-flex'>Xác thực tài khoản</h2>
                                        <span>Bạn đã gửi yêu cầu xác thực tài khoản thành công, hãy đợi 1 chút để chúng tôi phê duyệt!</span><div class="pd d-flex"><button class='df-but bold-font theme-bg white-color confirm-but'>Xong</button></div></div></div></div>`)
                                        document.querySelector(".confirm-but").onclick = function(){
                                            document.querySelectorAll(".modal").forEach(function(e){
                                                e.remove()
                                                window.history.back()
                                            })
                                        }
                                        xhttp.onreadystatechange = function() {
                                            if (xhttp.readyState == 4 && xhttp.status == 200) {
                                                const res = JSON.parse(xhttp.responseText)
                                                if (res.status == 'done'){
                                                    showAlert("Đã gửi yêu cầu xác thực thành công!")
                                                }
                                                else {
                                                    showAlert("Xác thực không thành công. Hãy thử lại!")
                                                }
                                            }
                                        }
                                        xhttp.open("POST", "/user-auth", true)
                                        xhttp.send(formData)
                                    }
                                }
                                else {
                                    showAlert("Định dạng không hợp lệ!")
                                }
                            }
                            fileReader.readAsArrayBuffer(file);
                        }
                        
                        if (document.querySelector(".return-but")){
                            document.querySelector(".return-but").onclick = function(){
                                document.querySelectorAll(".modal").forEach(function(e){
                                    e.remove()
                                    track.getTracks().forEach(function(e) {
                                        e.stop();
                                    });
                                    window.history.back()
                                })
                            }
                        }
                        if (document.querySelector(".close-auth-modal")){
                            document.querySelector(".close-auth-modal").onclick = function(){
                                document.querySelectorAll(".modal").forEach(function(e){
                                    e.remove()
                                    track.getTracks().forEach(function(e) {
                                        e.stop();
                                    });
                                    window.history.back()
                                })
                            }
                        }
                    }, 2000)
                }
            }
        }, 100)
        })

        document.querySelector(".close-auth-modal").onclick = function(){
            clearInterval(faceItv)
            document.querySelector(".user-auth-modal").remove()
            document.querySelector(".modal").remove()
            track.getTracks().forEach(function(e) {
                e.stop();
            });
            window.history.back()
        }
    }
    document.querySelector(".destroy-auth").onclick = function(){
        document.querySelector(".modal").remove()
    }
}