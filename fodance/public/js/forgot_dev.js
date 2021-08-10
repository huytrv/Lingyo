const url = new URL(window.location.href)
let countUsedPReq = countEnterCodeReq = countSubmitResetReq = 0
let xhttp
if (window.XMLHttpRequest) {
    xhttp = new XMLHttpRequest()
} else {
    xhttp = new ActiveXObject("Microsoft.XMLHTTP")
}
if(document.querySelectorAll(".spinner").length != 0){
    document.querySelector(".spinner").style.display = "none"
    window.onkeydown = function(event){
        if(event.keyCode == 13) {
            event.preventDefault()
            return false
        }
    }
}

const showAlert = function(text){
    let alert = document.createElement("div")
    alert.classList.add("alert")
    let textAlert = document.createTextNode(text)
    alert.appendChild(textAlert); 
    document.querySelector(".global-lg").appendChild(alert)
    setTimeout(function() {
        document.querySelector(".global-lg").removeChild(alert)
    }, 3000)
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function validatePhone(phone){
    const re = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    return re.test(phone)
}
if(document.querySelectorAll(".username").length != 0){
    document.querySelector(".username").onkeyup = function(){
        document.querySelector(".error").textContent = ""
        let empty = false, valid = true
        const username = (document.querySelector(".username").value).trim()
        if (!validateEmail(username) && !validatePhone(username)) {
            valid = false
            document.querySelector(".error").textContent = ""
            document.querySelector(".error").textContent = "Địa chỉ email hoặc số điện thoại không hợp lệ."
        }
        else {
            document.querySelector(".error").textContent = ""
        }
        if (username == '') empty = true
        if (empty || !valid) {
            document.querySelector(".submit").disabled = true
        } else {
            document.querySelector(".submit").disabled = false
        }
    }
}

if(document.querySelectorAll(".submit").length != 0){
    document.querySelector(".submit").onclick = function(){
        document.querySelector(".spinner").style.display = "block"
        fetch('https://api.ipify.org/?format=json')
        .then(response => response.json())
        .then((json) => {
            let startTime = new Date()
            startTime = startTime.getTime()
            const data = {
                username: document.querySelector(".username").value,
                ip: json.ip,
                startTime: startTime
            }
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    const res = JSON.parse(xhttp.responseText)
                    if (res.status == "server-send-invalid-reset-username") {
                        countUsedPReq ++
                        if (countUsedPReq <= 5){
                            document.querySelector(".spinner").style.display = "none"
                            document.querySelector(".error").textContent = ""
                            document.querySelector(".error").textContent = "Tài khoản với thông tin vừa nhập không tồn tại."
                        }
                        else {
                            alert("Gửi yêu cầu quá nhiều, trở lại?")
                            window.location = "/forgot-password"
                        }
                    }
                    if (res.status == "server-send-valid-username"){
                        document.querySelector(".spinner").style.display = "none"
                        if (res.dataConfirm.phone && !res.dataConfirm.email) {
                            //resetPhoneChoiceModel
                            document.querySelector(".forgot-password").innerHTML = "<div class='phone-or-email-choice'><div class='d-flex-start mg-b'><h3 class='login-title'>Bạn muốn đặt lại mật khẩu của mình bằng cách nào?</h3></div><div class='reset-info mg-b-lg'><p>Các thông tin sau được tìm thấy trên tài khoản của bạn</p></div><ul class='choice'><li class='phone-choice text-choice'><input type='radio' class='pchoice' name='poll' value='pchoice' checked><label for='pchoice' class='label-choice'><span>Gửi mã tới số điện thoại ***<span class='phone-char'></span></span></label></li></ul><div class='d-flex-sb'><div class='next'><button type='button' name='send-choice' class='send-choice next-but'>Tiếp</button></div></div></div>"
                            document.querySelector(".pchoice").setAttribute('checked', true)      
                            document.querySelector(".phone-char").textContent = ""
                            document.querySelector(".phone-char").textContent = res.dataConfirm.phone.charAt(res.dataConfirm.phone.length-2) + res.dataConfirm.phone.charAt(res.dataConfirm.phone.length-1)
                        }
                        if (res.dataConfirm.email && ! res.dataConfirm.phone) {
                            //resetEmailChoiceModel
                            document.querySelector(".forgot-password").innerHTML = "<div class='phone-or-email-choice'><div class='d-flex-start mg-b'><h3 class='login-title'>Bạn muốn đặt lại mật khẩu của mình bằng cách nào?</h3></div><div class='reset-info mg-b-lg'><p>Các thông tin sau được tìm thấy trên tài khoản của bạn</p></div><ul class='choice'><li class='email-choice text-choice'><input type='radio' class='echoice' name='poll' value='echoice' checked><label for='echoice' class='label-choice'><span>Gửi email liên kết tới <span class='email-char'></span>*****.***</span></label></li></ul><div class='d-flex-sb'><div class='next'><button type='button' name='send-choice' class='send-choice next-but'>Tiếp</button></div></div></div>"
                            document.querySelector(".echoice").setAttribute('checked', true)
                            document.querySelector(".email-char").textContent = ""
                            document.querySelector(".email-char").textContent = res.dataConfirm.email.charAt(0) + res.dataConfirm.email.charAt(1)
                        }
                        if (res.dataConfirm.phone && res.dataConfirm.email) {
                            //resetChoiceModel
                            document.querySelector(".forgot-password").innerHTML = "<div class='phone-or-email-choice'><div class='d-flex-start mg-b'><h3 class='login-title'>Bạn muốn đặt lại mật khẩu của mình bằng cách nào?</h3></div><div class='reset-info mg-b-lg'><p>Các thông tin sau được tìm thấy trên tài khoản của bạn</p></div><ul class='choice'><li class='email-choice text-choice'><input type='radio' class='echoice' name='poll' value='echoice' checked><label for='echoice' class='label-choice'><span>Gửi email liên kết tới <span class='email-char'></span>*****.***</span></label></li><li class='phone-choice text-choice'><input type='radio' class='pchoice' name='poll' value='pchoice'><label for='pchoice' class='label-choice'><span>Gửi mã tới số điện thoại ***<span class='phone-char'></span></span></label></li></ul><div class='d-flex-sb'><div class='next'><button type='button' name='send-choice' class='send-choice next-but'>Tiếp</button></div></div></div>"
                            document.querySelector(".echoice").setAttribute('checked', true)
                            document.querySelector(".email-char").textContent = ""
                            document.querySelector(".email-char").textContent = res.dataConfirm.email.charAt(0) + res.dataConfirm.email.charAt(1)
                            document.querySelector(".phone-char").textContent = ""
                            document.querySelector(".phone-char").textContent = res.dataConfirm.phone.charAt(res.dataConfirm.phone.length-2) + res.dataConfirm.phone.charAt(res.dataConfirm.phone.length-1)
                        }
                        document.querySelector(".send-choice").onclick = function(){
                            let choice
                            if (document.querySelectorAll(".echoice").length != 0){
                                if (document.querySelector(".echoice").checked) choice = 0
                            }
                            if (document.querySelectorAll(".pchoice").length != 0){
                                if (document.querySelector(".pchoice").checked) choice = 1
                            }
                            const data = {
                                choice: choice
                            }
                            xhttp.onreadystatechange = function() {
                                if (xhttp.readyState == 4 && xhttp.status == 200) {
                                    const res = JSON.parse(xhttp.responseText)
                                    if (res.status == "server-send-blocked-ip") {
                                        document.querySelector(".forgot-password").innerHTML = "<div class='d-flex-start'><h2 class='login-title'>Chức năng tạm khóa!</h2></div><div class='email-sent'><p>Bạn đã gửi yêu cầu quá nhiều, tạm thời không thể thực hiện chức năng này!</p><div class='signup-choice'><a href='/login' class=''>Trở lại</a></div></div>"
                                    }
                                    if (res.status == "server-send-reset-email-sent"){
                                        //resetEmailSentModel
                                        document.querySelector(".forgot-password").innerHTML = "<div class='email-sent'><p>Email kèm mã xác nhận đã được gửi tới <span class='to-email'></span>*****.***, vui lòng kiểm tra email để đặt lại mật khẩu của bạn</p><div class='signup-choice'><a href='/forgot-password' class=''>Trở lại</a></div></div>"
                                        document.querySelector(".to-email").textContent = res.dataConfirm.charAt(0) + res.dataConfirm.charAt(1)
                                    }
                                    if (res.status == "server-send-reset-code-sent"){
                                        let times = 0
                                        //resetCodeModel
                                        document.querySelector(".forgot-password").innerHTML = "<div class='d-flex-start'><h2 class='login-title'>Xác nhận mã đặt lại</h2></div><div class='code-model'><p>Chúng tôi đã gửi một mã xác nhận đến số điện thoại của bạn. Vui lòng kiểm tra mã.</p><form class='code-form d-flex-col-start'><span class='code-msg'></span><input name='code' class='code' maxlength='6'><div class='d-flex-sb'><div class='next'><button type='button' disabled='disabled' class='submit-code next-but'>Tiếp</button></div><div class='return-forgot signup-choice'></div></div></form></div>"
                                        document.querySelector(".code-msg").textContent = "Nhập mã đã được gửi tới ***" + res.dataConfirm.charAt(res.dataConfirm.length-2) + res.dataConfirm.charAt(res.dataConfirm.length-1)
                                        document.querySelector(".submit-code").onclick = function(){
                                            times ++
                                            const data = {
                                                times: times,
                                                code: document.querySelector(".code").value
                                            }
                                            xhttp.onreadystatechange = function() {                                                   
                                                if (xhttp.readyState == 4 && xhttp.status == 200) {
                                                    const res = JSON.parse(xhttp.responseText)
                                                    if (res.status == "server-send-enter-code-done") {
                                                        if (res.dataConfirm.valid) {
                                                            //resetConfirmModel
                                                            document.querySelector(".forgot-password").innerHTML = "<div class='d-flex-start'><h2 class='login-title'>Hãy xác nhận mật khẩu mới của bạn</h2></div><div class='confirm-reset-model'><form method='POST' action='/forgot-password/' class='confirm-reset-code-form d-flex-col-start'><label>Mật khẩu</label><input type='password' name='password' class='password' autocomplete='on'><label>Xác nhận mật khẩu</label><input type='password' name='confirm-password' class='password-confirm' autocomplete='on'><button type='button' disabled='disabled' class='submit-code-password submit-but mg-t'>Gửi</button></form><div class='hint d-flex-col-start mg-t'><small class='hint-1'>Mật khẩu phải có ít nhất 8 kí tự</small><small class='hint-2'>Mật khẩu phải chứa ít nhất 1 số</small><small class='hint-3'>Hai mật khẩu phải trùng khớp</small></div></div>"
                                                            handleSubmitReset()
                                                            function handleSubmitReset(){
                                                                document.querySelector(".submit-code-password").onclick = function(){
                                                                    const data = {
                                                                        token: url.pathname.replace("/reset-password/", ""),
                                                                        password: document.querySelector(".password").value
                                                                    }
                                                                    xhttp.onreadystatechange = function() {
                                                                        if (xhttp.readyState == 4 && xhttp.status == 200) {
                                                                            const res = JSON.parse(xhttp.responseText)
                                                                            if (res.status == "server-send-reset-code-done") {
                                                                                document.querySelector(".forgot-password").innerHTML = "<div class='d-flex-start'><h2 class='login-title'>Đặt lại mật khẩu thành công!</h2></div><div class='d-flex-col-start'><p class='reset-info-text'>Bạn đã hoàn tất quá trình thiết lập mật khẩu, hãy ghi nhớ mật khẩu cho những lần sử dụng kế tiếp</p></div><div class='signup-choice'><a href='/' class='font-size-lg-1'>Tiếp tục với Fodance</a></div>"
                                                                            }
                                                                            if (res.status == "server-send-reset-code-err") {
                                                                                countSubmitResetReq ++
                                                                                if (countSubmitResetReq <= 5){
                                                                                    document.querySelector(".confirm-reset-model").innerHTML = "<div class='d-flex-col-start'><p class='reset-info-text'>Có vẻ như mật khẩu bạn thiết lập có vấn đề, quá trình thiết lập mật khẩu thất bại!<br><br>Hãy đảm bảo mật khẩu của bạn thỏa mãn các yêu cầu sau</p></div><div class='hint d-flex-col-start err-color mg-t'><small class='hint-1'>Mật khẩu phải có ít nhất 8 kí tự</small><small class='hint-2'>Mật khẩu phải chứa ít nhất 1 số</small><small class='hint-3'>Hai mật khẩu phải trùng khớp</small></div></div><div class='signup-choice'><a class='font-size-lg-1 return-try-reset'>Thử lại</a></div>"
                                                                                    document.querySelector(".return-try-reset").onclick = function(){
                                                                                        //resetConfirmModel
                                                                                        document.querySelector(".forgot-password").innerHTML = "<div class='d-flex-start'><h2 class='login-title'>Hãy xác nhận mật khẩu mới của bạn</h2></div><div class='confirm-reset-model'><form method='POST' action='/forgot-password/' class='confirm-reset-code-form d-flex-col-start'><label>Mật khẩu</label><input type='password' name='password' class='password' autocomplete='on'><label>Xác nhận mật khẩu</label><input type='password' name='confirm-password' class='password-confirm' autocomplete='on'><button type='button' disabled='disabled' class='submit-code-password submit-but mg-t'>Gửi</button></form><div class='hint d-flex-col-start mg-t'><small class='hint-1'>Mật khẩu phải có ít nhất 8 kí tự</small><small class='hint-2'>Mật khẩu phải chứa ít nhất 1 số</small><small class='hint-3'>Hai mật khẩu phải trùng khớp</small></div></div>"
                                                                                        handleSubmitReset()
                                                                                    }
                                                                                }
                                                                                else {
                                                                                    document.querySelector(".confirm-reset-model").innerHTML = "<div class='d-flex-col-start'><p class='reset-info-text'>Bạn hiện không thể xác nhận mật khẩu mới do đã gửi quá nhiều yêu cầu không hợp lệ!</p></div><div class='signup-choice'><a href='forgot-password' class='font-size-lg-1 return-try-reset'>Trở lại</a></div>"
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                    xhttp.open("POST", "/client-send-reset-code-password", true)
                                                                    xhttp.setRequestHeader('Content-Type', 'application/json')
                                                                    xhttp.send(JSON.stringify(data))
                                                                }
                                                                let valid1 = valid2 = valid3 = false
                                                                document.querySelector(".password").onkeyup = function() {
                                                                    const password = document.querySelector(".password").value
                                                                    const hint1 = document.querySelector(".hint-1")
                                                                    const hint2 = document.querySelector(".hint-2")
                                                                    if (password.length >= 8) {
                                                                        hint1.style.color = "#1AA1C2"
                                                                        valid1 = true
                                                                    }else {
                                                                        hint1.style.color = "black"
                                                                        valid1 = false
                                                                    }
                                                                    if (/[0-9]/.test(password)) {
                                                                        hint2.style.color = "#1AA1C2"
                                                                        valid2 = true
                                                                    } else {
                                                                        hint2.style.color = "black"
                                                                        valid2 = false
                                                                    }
                                                                
                                                                    const passwordConfirm = document.querySelector(".password-confirm").value
                                                                
                                                                    const hint3 = document.querySelector(".hint-3")  
                                                                                                        
                                                                    if (password == passwordConfirm && password != "") {
                                                                        hint3.style.color = "#1AA1C2"
                                                                        valid3 = true
                                                                    }else {
                                                                        hint3.style.color = "black"
                                                                        valid3 = false
                                                                    }
                                                                    if (valid1 && valid2 && valid3) {
                                                                        document.querySelector(".submit-code-password").disabled = false
                                                                    } else {
                                                                        document.querySelector(".submit-code-password").disabled = true
                                                                    }
                                                                }                                                          
                                                                document.querySelector(".password-confirm").onkeyup = function() {
                                                                    const password = document.querySelector(".password").value
                                                                    const passwordConfirm = document.querySelector(".password-confirm").value
                                                                
                                                                    const hint3 = document.querySelector(".hint-3")
                                                                    
                                                                    if (password == passwordConfirm && password != "") {
                                                                        hint3.style.color = "#1AA1C2"
                                                                        valid3 = true
                                                                    }else {
                                                                        hint3.style.color = "black"
                                                                        valid3 = false
                                                                    }
                                                                    if (valid1 && valid2 && valid3) {
                                                                        document.querySelector(".submit-code-password").disabled = false
                                                                    } else {
                                                                        document.querySelector(".submit-code-password").disabled = true
                                                                    }
                                                                }
                                                            }
                                                        }  
                                                        else {
                                                            document.querySelector(".code-msg").textContent = ""
                                                            document.querySelector(".code-msg").textContent = "Mã xác nhận không chính xác"
                                                            document.querySelector(".code-msg").classList.add("theme-color")
                                                            document.querySelector(".code-msg").classList.add('shake-content')
                                                            document.querySelector(".code-msg").onanimationend = function() {
                                                                document.querySelector(".code-msg").classList.remove('shake-content')
                                                            }
                                                        }
                                                        if(res.dataConfirm.blockEnterCode) {
                                                            countEnterCodeReq ++
                                                            if (countEnterCodeReq <= 5) {
                                                                document.querySelector(".code-msg").textContent = ""
                                                                document.querySelector(".code-msg").textContent = "Bạn không thể nhập mã do nhập sai quá nhiều lần"
                                                                document.querySelector(".submit-code").setAttribute('disabled', true)
                                                                document.querySelector(".return-forgot").innerHTML = "<a href='/forgot-password'>Trở lại?</a>"
                                                            }
                                                            else {
                                                                alert("Gửi yêu cầu quá nhiều, trở lại?")
                                                                window.location = "/forgot-password"
                                                            }
                                                        }                                                        
                                                    }
                                                }
                                            }
                                            xhttp.open("POST", "/client-send-reset-code", true)
                                            xhttp.setRequestHeader('Content-Type', 'application/json')
                                            xhttp.send(JSON.stringify(data))                                         
                                        }
                                        document.querySelector(".code-form input").onkeyup = function() {
                                            if (document.querySelector("input[name='code']").value != '' ){       
                                                document.querySelector(".submit-code").disabled = false
                                            }
                                            else {
                                                document.querySelector(".submit-code").disabled = true
                                            }
                                        }
                                    }
                                }
                            }
                            xhttp.open("POST", "/client-send-choice", true)
                            xhttp.setRequestHeader('Content-Type', 'application/json')
                            xhttp.send(JSON.stringify(data))
                        }
                    }
                }
            }
            xhttp.open("POST", "/client-send-reset-password-username", true)
            xhttp.setRequestHeader('Content-Type', 'application/json')
            xhttp.send(JSON.stringify(data))
        })
    }
}
if (document.querySelectorAll(".submit-token-password").length !=0 ){
    document.querySelector(".submit-token-password").onclick = function(){
        const data = {
            token: url.pathname.replace("/reset-password/", ""),
            password: document.querySelector(".password").value
        }
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                const res = JSON.parse(xhttp.responseText)
                if (res.status == "server-send-reset-expired") {
                    document.querySelector(".reset-info-text").innerHTML = "Mã đặt lại mật khẩu đã hết hạn, hãy tạo yêu cầu mới!"
                    document.querySelector(".confirm-reset-model").innerHTML = "<div class='signup-choice'><a href='/forgot-password' class='font-size-lg-1'>Trở lại</a></div>"
                }
                if (res.status == "server-send-reset-err") {
                    document.querySelector(".reset-info-text").innerHTML = "Có vẻ như mật khẩu bạn thiết lập có vấn đề, quá trình thiết lập mật khẩu thất bại!<br><br>Hãy đảm bảo mật khẩu của bạn thỏa mãn các yêu cầu sau"
                    document.querySelector(".confirm-reset-model").innerHTML = `<div class='hint d-flex-col-start err-color mg-t'><small class='hint-1'>Mật khẩu phải có ít nhất 8 kí tự</small><small class='hint-2'>Mật khẩu phải chứa ít nhất 1 số</small><small class='hint-3'>Hai mật khẩu phải trùng khớp</small></div></div><div class='signup-choice'><a href='/reset-password/${data.token}' class='font-size-lg-1'>Thử lại</a></div>`
                }
                if (res.status == "server-send-reset-done") {
                    document.querySelector(".login-title").innerHTML = "Đặt lại mật khẩu thành công!"
                    document.querySelector(".reset-info-text").innerHTML = "Bạn đã hoàn tất quá trình thiết lập mật khẩu, hãy ghi nhớ mật khẩu cho những lần sử dụng kế tiếp"
                    document.querySelector(".confirm-reset-model").innerHTML = "<div class='signup-choice'><a href='/' class='font-size-lg-1'>Tiếp tục với Fodance</a></div>"
                }
            }
        }
        xhttp.open("POST", "/client-send-reset-token-password", true)
        xhttp.setRequestHeader('Content-Type', 'application/json')
        xhttp.send(JSON.stringify(data))
    }
}


let valid1 = valid2 = valid3 = false
if (document.querySelectorAll(".submit-token-password").length !=0 ){
    document.querySelector(".password").onkeyup = function() {
        const password = document.querySelector(".password").value
        const hint1 = document.querySelector(".hint-1")
        const hint2 = document.querySelector(".hint-2")
        if (password.length >= 8) {
            hint1.style.color = "#1AA1C2"
            valid1 = true
        }else {
            hint1.style.color = "black"
            valid1 = false
        }
        if (/[0-9]/.test(password)) {
            hint2.style.color = "#1AA1C2"
            valid2 = true
        } else {
            hint2.style.color = "black"
            valid2 = false
        }
        const passwordConfirm = document.querySelector(".password-confirm").value
    
        const hint3 = document.querySelector(".hint-3")
        
        if (password == passwordConfirm && password != "") {
            hint3.style.color = "#1AA1C2"
            valid3 = true
        }else {
            hint3.style.color = "black"
            valid3 = false
        }
        if (valid1 && valid2 && valid3) {
            document.querySelector(".submit-token-password").disabled = false
        } else {
            document.querySelector(".submit-token-password").disabled = true
        }
    }
}
if (document.querySelectorAll(".submit-token-password").length !=0 ){
    document.querySelector(".password-confirm").onkeyup = function() {
        const password = document.querySelector(".password").value
        const passwordConfirm = document.querySelector(".password-confirm").value
    
        const hint3 = document.querySelector(".hint-3")
        
        if (password == passwordConfirm && password != "") {
            hint3.style.color = "#1AA1C2"
            valid3 = true
        }else {
            hint3.style.color = "black"
            valid3 = false
        }
        if (valid1 && valid2 && valid3) {
            document.querySelector(".submit-token-password").disabled = false
        } else {
            document.querySelector(".submit-token-password").disabled = true
        }
    }
}