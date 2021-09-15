const socket = io("https://fodance.com")

const rankList = ["primary", "intermediate", "highgrade"]
const rankName = ["Sơ cấp", "Trung cấp", "Cao cấp"]
const cateList = ["freestyle", "hiphop", "rap", "contemporary", "ballroom", "modern", "ballet", "shuffle", "jazz", "sexy", "flashmob", "other"]
const cateName = ["Nhảy tự do", "Hiphop", "Rap", "Múa đương đại", "Khiêu vũ", "Nhảy hiện đại", "Múa ba lê", "Shuffle", "Jazz", "Sexy", "Fashmob", "Khác"]

if (document.querySelector("video")){
    document.querySelector("video").play()
}

const postDisplayed = []
const posts = document.querySelectorAll(".post-moderate")

for (let i = 0; i < posts.length; i++){
    postDisplayed.push(posts[i].getAttribute("data-post-df"))
}

socket.emit("displayed-post", postDisplayed)


const userDisplayed = []
const users = document.querySelectorAll(".user-verify")

for (let i = 0; i < users.length; i++){
    userDisplayed.push(users[i].getAttribute("user"))
}

socket.emit("displayed-user", userDisplayed)

function viewImage(){
    const postMedia = document.querySelectorAll(".media-post")
    for (let i = 0; i < postMedia.length; i++){
        postMedia[i].onclick = function(){
            document.querySelector(".main").insertAdjacentHTML("beforeend", `
            <div class="modal view-post-modal">
            <div class="modal-content view-post-modal-content d-flex">
                <div class="close-view-post-modal return-but"><span class="iconify" data-icon="heroicons-outline:arrow-left" data-inline="false"></span></div>
                    <img src="https://cdn.fodance.com/fd-media/${postMedia[i].getAttribute("src")}" class="view-post-img">
                </div>
            </div>
            </div>
        `)
        document.querySelector(".close-view-post-modal").onclick = function(){  
            document.querySelector(".view-post-modal").remove()
        }
        }
    }
}
viewImage()

socket.on("post-need-moderate", function(posts){
    window.navigator.vibrate(800)
    if (posts && posts.length != 0){
        if (document.querySelector(".none-video")){
            document.querySelector(".none-video").remove()
        }
        for(let i = 0; i < posts.length; i++){
            postDisplayed.push(posts[i].postId)
            socket.emit("displayed-post", postDisplayed)
            document.querySelector(".moderate-content").insertAdjacentHTML("beforeend", `<div class="d-flex-col post-moderate" data-post-df="${posts[i].postId}">
            <div class="pre-post-media">
                ${(()=>{if (posts[i].file.type == "video") {return `
                    <video muted controls src="https://cdn.fodance.com/fd-media/${posts[i].file.path[0]}"></video>
                `}
                else {return `
                ${(()=>{if (posts[i].file.path.length == 1){return `
                    <div class="post-file">
                        <img src="https://cdn.fodance.com/fd-media/${posts[i].file.path[0]}" class="media-post post-image">
                    </div>
                `}
                else if (posts[i].file.path.length == 2){return `
                    <div class="post-file thumb-2-files">
                        <div class="thumb-file">
                            <img src="https://cdn.fodance.com/fd-media/${posts[i].file.path[0]}" class="media-post post-image">
                        </div>
                        <div class="thumb-file">
                            <img src="https://cdn.fodance.com/fd-media/${posts[i].file.path[1]}" class="media-post post-image">
                        </div>
                    </div>
                `}
                else if (posts[i].file.path.length == 3){return `
                    <div class="post-file thumb-3-files">
                        <div class="thumb-file">
                            <img src="https://cdn.fodance.com/fd-media/${posts[i].file.path[0]}" class="media-post post-image">
                        </div>
                        <div class="thumb-file">
                            <img src="https://cdn.fodance.com/fd-media/${posts[i].file.path[1]}" class="media-post post-image">
                        </div>
                        <div class="thumb-file">
                            <img src="https://cdn.fodance.com/fd-media/${posts[i].file.path[2]}" class="media-post post-image">
                        </div>
                    </div>
                `}
                else if (posts[i].file.path.length == 4){return `
                    <div class="post-file thumb-4-files">
                        <div class="thumb-file">
                            <img src="https://cdn.fodance.com/fd-media/${posts[i].file.path[0]}" class="media-post post-image">
                        </div>
                        <div class="thumb-file">
                            <img src="https://cdn.fodance.com/fd-media/${posts[i].file.path[1]}" class="media-post post-image">
                        </div>
                        <div class="thumb-file">
                            <img src="https://cdn.fodance.com/fd-media/${posts[i].file.path[2]}" class="media-post post-image">
                        </div>
                        <div class="thumb-file">
                            <img src="https://cdn.fodance.com/fd-media/${posts[i].file.path[3]}" class="media-post post-image">
                        </div>
                    </div>
                `}
                })()}
                `}})()}
                <div class="pre-post-cate">${posts[i].category} - ${posts[i].rank}</div>
            </div>
            <div class="d-flex pd width-100">
                <button class="submit-but validate-video" data-valid="true">Chấp nhận</button>
                <button class="submit-but danger-color validate-video" data-valid="false">Không hợp lệ</button>
            </div>
        </div>`)  
            viewImage()
            validateMedia(posts[i])
        }
    }
})

socket.off("post-need-moderate", function(){
})

function handleNotification(type, source){
    let xhttp
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest()
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP")
    }
    const data = {
        type: type,
        source: source
    }
    xhttp.open("POST", "/notification", true)
    xhttp.setRequestHeader('Content-Type', 'application/json')
    xhttp.send(JSON.stringify(data))
}

function validateMedia(post){
    const validateBut = document.querySelectorAll(".validate-video")
    for (let i = 0; i < validateBut.length; i++){
        validateBut[i].onclick = function(){
            const data = {
                validData: validateBut[i].getAttribute("data-valid"),
                postId: validateBut[i].parentNode.parentNode.getAttribute("data-post-df")
            }
            // let xhttp
            // if (window.XMLHttpRequest) {
            //     xhttp = new XMLHttpRequest()
            // } else {
            //     xhttp = new ActiveXObject("Microsoft.XMLHTTP")
            // }
            // xhttp.onreadystatechange = function() {    
            //     if (xhttp.readyState == 4 && xhttp.status == 200) {
            //         const res = JSON.parse(xhttp.responseText)
            //         if (res.status == "done"){
            //         }
            //     }
            // }
            // xhttp.open("POST", "/validate-video", true)
            // xhttp.setRequestHeader('Content-Type', 'application/json')
            // xhttp.send(JSON.stringify(data))
            socket.emit("/validate-video", data)
            let cate, rank
            for(let i = 0; i < cateList.length; i++){
                if (post.category == cateList[i]){cate = cateName[i]}
            }
            for(let i = 0; i < rankList.length; i++){
                if (post.rank == rankList[i]){rank = rankName[i]}
            }
            handleNotification("post-done", [post.postId, cate, rank])
            validateBut[i].parentNode.parentNode.remove()
        }
    }
}
validateMedia()

socket.on("video-validated", function(data){
    if (document.querySelector(`.post-moderate[data-post-df='${data}']`)){
        document.querySelector(`.post-moderate[data-post-df='${data}']`).remove()
    }
})

socket.on("user-need-verify", function(data){
    for (let i = 0; i < data.authList.length; i++){
        document.querySelector(".moderate-content").insertAdjacentHTML("beforeend", `
        <div class="d-flex-col">
            <div class="d-flex">
                <div class="d-flex-col-start">
                    <span>${data.username[i]}</span>
                    <span>${data.birthday[i]}</span>
                    <span>${data.location[i]}</span>
                </div>
                <img src="https://cdn.fodance.com/fd-media/${data.authList[i].face}">
                <img src="https://cdn.fodance.com/fd-media/${data.authList[i].file}">
            </div>
            <div class="d-flex pd width-100">
                <button class="submit-but validate-auth" data-valid="true">Chấp nhận</button>
                <button class="submit-but danger-color validate-auth" data-valid="false">Không hợp lệ</button>
            </div>
        </div>
        `)
    }
    validateUser()
})

function validateUser(){
    const validateBut = document.querySelectorAll(".validate-user")
    for (let i = 0; i < validateBut.length; i++){
        validateBut[i].onclick = function(){
            const data = {
                validData: validateBut[i].getAttribute("data-valid"),
                user: validateBut[i].parentNode.parentNode.getAttribute("user")
            }
            socket.emit("/validate-user", data)
            handleNotification("verify-user", [data.user, data.validData])
            validateBut[i].parentNode.parentNode.remove()
        }
    }
}
validateUser()

function viewAuthMedia(){
    let d = 0
    const authMedia = document.querySelectorAll(".user-verify img")
    authMedia.forEach(function(e){
        e.onclick = function(){
            d += 90
            e.style.transform = `rotate(${d}deg)`
            e.style.transform = `rotate(${d}deg)`
        }

        e.onmouseover = function(){
            console.log(e.naturalWidth)
            e.style.width = `${e.naturalWidth * 0.7}px`
            e.style.height = `${e.naturalHeight * 0.7}px`
        }
        e.onmouseout = function(){
            e.style.width = "200px"
            e.style.height = "150px"
        }
    })
}
viewAuthMedia()

socket.off("user-need-moderate", function(){
})

socket.on("user-validated", function(data){
    if (document.querySelector(`.user-verify[user='${data}']`)){
        document.querySelector(`.user-verify[user='${data}']`).remove()
    }
})
