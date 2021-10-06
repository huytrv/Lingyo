const socket = io("https://fodance.com")

const rankList = ["primary", "intermediate", "highgrade"]
const rankName = ["Sơ cấp", "Trung cấp", "Cao cấp"]
const cateList = ["freestyle", "hiphop", "rap", "contemporary", "ballroom", "modern", "ballet", "shuffle", "jazz", "sexy", "flashmob", "other"]
const cateName = ["Nhảy tự do", "Hiphop", "Rap", "Múa đương đại", "Khiêu vũ", "Nhảy hiện đại", "Múa ba lê", "Shuffle", "Jazz", "Sexy", "Fashmob", "Khác"]

const userDisplayed = []
const users = document.querySelectorAll(".user-verify")

for (let i = 0; i < users.length; i++){
    userDisplayed.push(users[i].getAttribute("user"))
}

socket.emit("displayed-user", userDisplayed)

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
