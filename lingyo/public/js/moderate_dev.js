const socket = io("https://fodance.com")

if (document.querySelector("video")){
    document.querySelector("video").play()
}

const postDisplayed = []
const posts = document.querySelectorAll(".post-moderate")

for (let i = 0; i < posts.length; i++){
    postDisplayed.push(posts[i].getAttribute("data-post-df"))
}

socket.emit("displayed post", postDisplayed)

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

socket.on("post need moderate", function(posts){
    window.navigator.vibrate(800)
    if (posts && posts.length != 0){
        if (document.querySelector(".none-video")){
            document.querySelector(".none-video").remove()
        }
        for(let i = 0; i < posts.length; i++){
            postDisplayed.push(posts[i].postId)
            socket.emit("displayed post", postDisplayed)
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
                <div class="pre-post-cate">${posts[i].category}</div>
            </div>
            <div class="d-flex pd width-100">
                <button class="submit-but validate-video" data-valid="true">Chấp nhận</button>
                <button class="submit-but danger-color validate-video" data-valid="false">Không hợp lệ</button>
            </div>
        </div>`)  
            viewImage()
            validateMedia()
        }
    }
})

socket.off("post need moderate", function(){
})

function validateMedia(){
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
