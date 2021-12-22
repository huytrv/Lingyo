document.querySelector(".submit-but").onclick = function(){
    const user = document.querySelector(".nickname").value.trim()
    const data = {
        user: user
    }
    if (document.querySelector(".add-admin").checked){
        data.permission = "add-admin"
        document.querySelector(".add-admin").checked = false
    }
    else if (document.querySelector(".add-moderator").checked){
        data.permission = "add-moderator"
        document.querySelector(".add-moderator").checked = false
    }
    else if (document.querySelector(".remove-admin").checked){
        data.permission = "remove-admin"
        document.querySelector(".remove-admin").checked = false
    }
    else if (document.querySelector(".remove-moderator").checked){
        data.permission = "remove-moderator"
        document.querySelector(".remove-moderator").checked = false
    }

    let xhttp
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest()
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP")
    }

    xhttp.open("POST", "/permission-changed", true)
    xhttp.setRequestHeader('Content-Type', 'application/json')
    xhttp.send(JSON.stringify(data))

    document.querySelector(".nickname").value = null
    alert("Đã thay đổi quyền!")
}