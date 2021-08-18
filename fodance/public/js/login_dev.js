function createXHR() {
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest()
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP")
    }
    return xhttp
}

if (window.location.pathname == "/login") {
    const xhttpLogin = createXHR()
    xhttpLogin.onreadystatechange = function() {
        if (xhttpLogin.readyState == 4 && xhttpLogin.status == 200) {
            document.querySelector(".signup-container").innerHTML = ""
            history.pushState({
                id: 'login'
            }, '', 'https://fodance.com/login')
            document.querySelector('title').textContent = "Fodance - Mạng xã hội bình chọn"
        }
    }
    xhttpLogin.open("GET", "/login", true)
    xhttpLogin.send(null)
}

if (window.location.pathname == "/signup"){
    const xhttpSignup = createXHR()

    xhttpSignup.onreadystatechange = function() {
        if (xhttpSignup.readyState == 4 && xhttpSignup.status == 200) {
            document.querySelector(".signup-container").innerHTML = "<div class='modal'><div class='modal-content'><div class='logo d-flex pd-t-lg'><a href='/'><img src='/public/images/logo/logo1.png'></a></div><div class='signup-model'><div class='phone-model login-model'><div class='d-flex-start'><h2 class='login-title'>Tạo tài khoản Fodance</h2></div><form class='phone-form d-flex-col-start'><span class='error phone-msg'></span><div class='phone-email-choice'><label class='email-choice'>Sử dụng email?</label></div><input type='tel' name='tel' autofocus='on' placeholder='Số điện thoại' class='tel'><label>Tên người dùng</label><input type='text' name='phone-username' class='phone-username'><div class='d-flex-sb'><div class='signup-choice'><span>hoặc </span><a class='login-redirect'>Đăng nhập?</a></div><div class='next'><span class='iconify spin spinner' data-icon='icomoon-free:spinner9' data-inline='false'></span><button type='button' name='submit-phone' class='submit-phone next-but' disabled='disabled'>Tiếp theo</button></div></div></form></div></div></div></div>"
            document.querySelector(".spinner").style.display = "none"
            signupHandle()
        }
    }
    xhttpSignup.open("GET", "/signup", true)
    xhttpSignup.send(null)
}


let userAgentString = navigator.userAgent
let chromeAgent = userAgentString.indexOf("Chrome") > -1
if (chromeAgent) {
    if (document.querySelector("input:-webkit-autofill")){    
        document.querySelector(".login").disabled = false
    }
}

document.querySelector(".login-form").addEventListener('input', function(e){
    if (document.querySelector("input[name='username']").value != '' && document.querySelector("input[name='password']").value != '') {
        document.querySelector(".login").disabled = false
    }
    else {
        document.querySelector(".login").disabled = true
        if (event.keyCode === 13) {
            event.preventDefault()
            document.querySelector(".login").click()
        }
    }
})

if (document.querySelectorAll(".spinner").length != 0){
    document.querySelector(".spinner").style.display = "none"
}

document.querySelector(".signupBut").onclick = function(){
    //signupBeginPhoneModel
    document.querySelector(".signup-container").innerHTML = "<div class='modal'><div class='modal-content'><div class='logo d-flex pd-t-lg'><a href='/'><img src='/public/images/logo/logo1.png'></a></div><div class='signup-model'><div class='phone-model login-model'><div class='d-flex-start'><h2 class='login-title'>Tạo tài khoản Fodance</h2></div><form class='phone-form d-flex-col-start'><span class='error phone-msg'></span><div class='phone-email-choice'><label class='email-choice'>Sử dụng email?</label></div><input type='tel' name='tel' autofocus='on' placeholder='Số điện thoại' class='tel'><label>Tên người dùng</label><input type='text' name='phone-username' class='phone-username'><div class='d-flex-sb'><div class='signup-choice'><span>hoặc </span><a class='login-redirect'>Đăng nhập?</a></div><div class='next'><span class='iconify spin spinner' data-icon='icomoon-free:spinner9' data-inline='false'></span><button type='button' name='submit-phone' class='submit-phone next-but' disabled='disabled'>Tiếp theo</button></div></div></form></div></div></div></div>"  
    document.querySelector(".spinner").style.display = "none"
    signupHandle()
}

var countBlockPhoneReq = countBlockEmailReq = countUsedPhoneReq = countUsedEmailReq = countEnterCodeReq = countSubmitReq = 0
const signupHandle = function(){
    const xhttp = createXHR()
    let count = emailReq = phoneReq = 0
    window.onkeydown = function(event){
        if(event.keyCode == 13) {
            event.preventDefault()
            return false
        }
    }
    if (document.querySelectorAll(".toggle-password").length != 0){
        document.querySelector(".toggle-password").onclick = function(){
            const x = document.querySelector(".confirm-password")
            if (x.getAttribute('type') === "password") {
                document.querySelector(".toggle-password").textContent = ''
                document.querySelector(".toggle-password").textContent = "Ẩn mật khẩu"
                x.setAttribute('type', 'text')
            } else {
                document.querySelector(".toggle-password").textContent = ''
                document.querySelector(".toggle-password").textContent = "Hiện mật khẩu"
                x.setAttribute('type', 'password')
            }
        }
    }

    history.pushState({
        id: 'signup'
    }, '', 'https://fodance.com/signup')
    document.querySelector('title').textContent = "Fodance - Mạng xã hội bình chọn"
    if (document.querySelectorAll(".login-redirect").length != 0){
        document.querySelector(".login-redirect").onclick = function(){
            document.querySelector(".modal-content").classList.add("modal-remove-down")
            document.querySelector(".modal-content").onanimationend = function () {
                document.querySelector(".signup-container").innerHTML = ""
            }
            history.pushState({
                id: 'login'
            }, 'Fodance - Mạng xã hội bình chọn', 'https://fodance.com/login')
            document.querySelector('title').textContent = "Fodance - Mạng xã hội bình chọn"
        }
    }

    function emailChoice(){
        if (document.querySelectorAll(".email-choice").length != 0){
            document.querySelector(".email-choice").onclick = function(){
                if (document.querySelectorAll(".signup-container").length != 0){
                    document.querySelector(".signup-container").innerHTML = "<div class='modal'><div class='modal-content'><div class='logo d-flex pd-t-lg'><a href='/'><img src='/public/images/logo/logo1.png'></a></div><div class='email-model login-model'><div class='d-flex-start'><h2 class='login-title'>Tạo tài khoản Fodance</h2></div><form class='email-form d-flex-col-start'><span class='error email-msg'></span><div class='phone-email-choice'><label class='phone-choice'>Sử dụng số điện thoại?</label></div><input type='email' name='email' autofocus='on' placeholder='Email' class='email'><label>Tên người dùng</label><input type='text' name='email-username' class='email-username'><div class='d-flex-sb'><div class='signup-choice'><span>hoặc </span><a class='login-redirect'>Đăng nhập?</a></div><div class='next'><button type='button' name='submit-email' class='submit-email next-but' disabled='disabled'>Tiếp theo</button></div></div></form></div></div></div>"
                    phoneChoice()
                    signupHandle()
                }
            }
        }
    }
    emailChoice()

    function phoneChoice(){
        if (document.querySelectorAll(".phone-choice").length != 0){
            document.querySelector(".phone-choice").onclick = function(){
                if (document.querySelectorAll(".signup-container").length != 0){
                    document.querySelector(".signup-container").innerHTML = "<div class='modal'><div class='modal-content'><div class='logo d-flex pd-t-lg'><a href='/'><img src='/public/images/logo/logo1.png'></a></div><div class='phone-model login-model'><div class='d-flex-start'><h2 class='login-title'>Tạo tài khoản Fodance</h2></div><form class='phone-form d-flex-col-start'><span class='error phone-msg'></span><div class='phone-email-choice'><label class='email-choice'>Sử dụng email?</label></div><input type='tel'  name='tel' autofocus='on' placeholder='Số điện thoại' class='tel'><label>Tên người dùng</label><input type='text' name='phone-username' class='phone-username'><div class='d-flex-sb'><div class='signup-choice'><span>hoặc </span><a class='login-redirect'>Đăng nhập?</a></div><div class='next'> <span class='iconify spin spinner' data-icon='icomoon-free:spinner9' data-inline='false'></span><button type='button' name='submit-phone' class='submit-phone next-but' disabled='disabled'>Tiếp theo</button></div></div></form></div></div></div>"
                    document.querySelector(".spinner").style.display = "none"
                    emailChoice()
                    signupHandle()
                }
            }
        }
    }
    phoneChoice()
    if (document.querySelectorAll(".submit-email").length != 0){
        document.querySelector(".submit-email").onclick = function(){
            emailReq ++
            let startTime = new Date()
            let timeStamp = startTime
            startTime = startTime.getTime()
            const email = document.querySelector(".email").value.trim()
            const data = {
                email: email,
                username: document.querySelector(".email-username").value.trim(),
                startTime: startTime,
                emailReq: emailReq,
                timeStamp: timeStamp
            }
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    const res = JSON.parse(xhttp.responseText)
                    if (res.status == "server-send-email-result") {
                        if (res.dataConfirm.emailValid) {
                            //signupCodeModel
                            document.querySelector(".signup-container").innerHTML = "<div class='modal'><div class='modal-content'><div class='logo d-flex pd-t-lg'><a href='/'><img src='/public/images/logo/logo1.png'></a></div><div class='code-model login-model'><form class='code-form d-flex-col-start'><span class='code-msg'></span><input type='text' name='code' class='code' autofocus='on'><div class='d-flex-sb'><div class='signup-choice'><a class='return-signup'>Trở lại</a></div><button type='button' name='submit-code' class='submit-code next-but' disabled='disabled'>Tiếp theo</button></div></form></div></div></div>"
                            document.querySelector(".code-msg").textContent = ''
                            document.querySelector(".code-msg").textContent = `Nhập mã đã được gửi tới ${res.dataConfirm.email} (chú ý cả mục thư spam).`
                        }    
                        else {
                            countUsedEmailReq ++
                            if (countUsedEmailReq <= 10){
                                document.querySelector(".email-msg").textContent = ''
                                document.querySelector(".email-msg").textContent = "Email đã được sử dụng"
                            }
                            else {
                                alert("Gửi yêu cầu quá nhiều, trở lại?")
                                window.location = "/signup"
                            }
                        }
                        if (document.querySelectorAll(".return-signup").length != 0){
                            document.querySelector(".return-signup").onclick = function(){
                                //signupEmailModel
                                document.querySelector(".signup-container").innerHTML = "<div class='modal'><div class='modal-content'><div class='logo d-flex pd-t-lg'><a href='/'><img src='/public/images/logo/logo1.png'></a></div><div class='email-model login-model'><div class='d-flex-start'><h2 class='login-title'>Tạo tài khoản Fodance</h2></div><form class='email-form d-flex-col-start'><span class='error email-msg'></span><div class='phone-email-choice'><label class='phone-choice'>Sử dụng số điện thoại?</label></div><input type='email' name='email' autofocus='on' placeholder='Email' class='email'><label>Tên người dùng</label><input type='text' name='email-username' class='email-username'><div class='d-flex-sb'><div class='signup-choice'><span>hoặc </span><a class='login-redirect'>Đăng nhập?</a></div><div class='next'><button type='button' name='submit-email' class='submit-email next-but' disabled='disabled'>Tiếp theo</button></div></div></form></div></div></div>"
                                signupHandle()
                            }
                        }
                        signupHandle()
                    }
                    if (res.status == "server-send-blocked-email"){
                        countBlockEmailReq ++
                        if (countBlockEmailReq <= 5){
                            //signupBlockedEmail
                            document.querySelector(".signup-container").innerHTML = "<div class='modal'><div class='modal-content'><div class='logo d-flex pd-t-lg'><a href='/'><img src='/public/images/logo/logo1.png'></a></div><div class='email-model login-model'><div class='d-flex-start'><h2 class='login-title'>Tạo tài khoản Fodance</h2></div><form class='email-form d-flex-col-start'><span class='error email-msg'></span><div class='phone-email-choice'><label class='phone-choice'>Sử dụng số điện thoại?</label></div><input type='email' name='email' autofocus='on' placeholder='Email' class='email'><label>Tên người dùng</label><input type='text' name='email-username' class='email-username'><div class='d-flex-sb'><div class='signup-choice'><span>hoặc </span><a class='login-redirect'>Đăng nhập?</a></div><div class='next'><button type='button' name='submit-email' class='submit-email next-but' disabled='disabled'>Tiếp theo</button></div></div></form></div></div></div>"
                            document.querySelector(".email-msg").innerHTML = "Bạn đã vượt quá số lần thử. Vui lòng thử lại sau."
                            signupHandle()
                        }
                        else {
                            alert("Gửi yêu cầu quá nhiều, trở lại?")
                            window.location = "/signup"
                        }
                    }
                }
            }
            xhttp.open("POST", "/client-send-email-and-username", true)
            xhttp.setRequestHeader('Content-Type', 'application/json')
            xhttp.send(JSON.stringify(data))
        }
    }
    if (document.querySelectorAll(".submit-phone").length != 0){
        document.querySelector(".submit-phone").onclick = function(){
            document.querySelector(".spinner").style.display = "block"
            phoneReq ++
            let startTime = new Date()
            startTime = startTime.getTime()
            const phone = document.querySelector(".tel").value.trim()
            fetch('https://api.ipify.org/?format=json')
            .then(response => response.json())
            .then((json) => {
                const data = {
                    phone: phone,
                    username: document.querySelector(".phone-username").value.trim(),
                    startTime: startTime,
                    phoneReq: phoneReq,
                    ip: json.ip
                }
                xhttp.onreadystatechange = function() {
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        const res = JSON.parse(xhttp.responseText)
                        if (res.status == "server-send-phone-result") {
                            document.querySelector(".spinner").style.display = "none"
                            if (res.dataConfirm.phoneValid) {
                                //signupCodeModel
                                document.querySelector(".signup-container").innerHTML = "<div class='modal'><div class='modal-content'><div class='logo d-flex pd-t-lg'><a href='/'><img src='/public/images/logo/logo1.png'></a></div><div class='code-model login-model'><form class='code-form d-flex-col-start'><span class='code-msg'></span><input type='text' name='code' class='code' autofocus='on'><div class='d-flex-sb'><div class='signup-choice'><a class='return-signup'>Trở lại</a></div><button type='button' name='submit-code' class='submit-code next-but' disabled='disabled'>Tiếp theo</button></div></form></div></div></div>"
                                document.querySelector(".code-msg").textContent = ''
                                document.querySelector(".code-msg").textContent = `Nhập mã đã được gửi tới ${res.dataConfirm.phone}`
                            }    
                            else {
                                countUsedPhoneReq ++
                                if (countUsedPhoneReq <= 10){
                                    document.querySelector(".phone-msg").textContent = ''
                                    document.querySelector(".phone-msg").textContent = "Số điện thoại đã được sử dụng"
                                }
                                else {
                                    alert("Gửi yêu cầu quá nhiều, trở lại?")
                                    window.location = "/signup"
                                }
                            }
                            if (document.querySelectorAll(".return-signup").length != 0){
                                document.querySelector(".return-signup").onclick = function(){
                                    //singupPhoneModel
                                    document.querySelector(".signup-container").innerHTML = "<div class='modal'><div class='modal-content'><div class='logo d-flex pd-t-lg'><a href='/'><img src='/public/images/logo/logo1.png'></a></div><div class='phone-model login-model'><div class='d-flex-start'><h2 class='login-title'>Tạo tài khoản Fodance</h2></div><form class='phone-form d-flex-col-start'><span class='error phone-msg'></span><div class='phone-email-choice'><label class='email-choice'>Sử dụng email?</label></div><input type='tel'  name='tel' autofocus='on' placeholder='Số điện thoại' class='tel'><label>Tên người dùng</label><input type='text' name='phone-username' class='phone-username'><div class='d-flex-sb'><div class='signup-choice'><span>hoặc </span><a class='login-redirect'>Đăng nhập?</a></div><div class='next'> <span class='iconify spin spinner' data-icon='icomoon-free:spinner9' data-inline='false'></span><button type='button' name='submit-phone' class='submit-phone next-but' disabled='disabled'>Tiếp theo</button></div></div></form></div></div></div>"
                                    document.querySelector(".spinner").style.display = "none"
                                    signupHandle()
                                }
                            }
                            signupHandle()
                        }
                        else if (res.status == "server-send-block-ip") {           
                            countBlockPhoneReq ++
                            if (countBlockPhoneReq <= 5){
                            //signupBlockedPhone
                            document.querySelector(".signup-container").innerHTML = "<div class='modal'><div class='modal-content'><div class='logo d-flex pd-t-lg'><a href='/'><img src='/public/images/logo/logo1.png'></a></div><div class='phone-model login-model'><div class='d-flex-start'><h2 class='login-title'>Tạo tài khoản Fodance</h2></div><form class='phone-form d-flex-col-start'><span class='error phone-msg'></span><div class='phone-email-choice'><label class='email-choice'>Sử dụng email?</label></div><input type='tel'  name='tel' autofocus='on' placeholder='Số điện thoại' class='tel'><label>Tên người dùng</label><input type='text' name='phone-username' class='phone-username'><div class='d-flex-sb'><div class='signup-choice'><span>hoặc </span><a class='login-redirect'>Đăng nhập?</a></div><div class='next'> <span class='iconify spin spinner' data-icon='icomoon-free:spinner9' data-inline='false'></span><button type='button' name='submit-phone' class='submit-phone next-but' disabled='disabled'>Tiếp theo</button></div></div></form></div></div></div>"
                            document.querySelector(".spinner").style.display = "none"
                            document.querySelector(".phone-msg").innerHTML = "Bạn đã vượt quá số lần thử. Vui lòng thử lại sau."
                            signupHandle()
                            }
                            else {
                                alert("Gửi yêu cầu quá nhiều, trở lại?")
                                window.location = "/signup"
                            }
                        }
                        else if (res.status == "server-send-invalid-phone-or-username"){
                            document.querySelector(".spinner").style.display = "none"
                            document.querySelector(".phone-msg").innerHTML = "Số điện thoại hoặc tên người dùng không hợp lệ!"
                        }
                    }
                }
                xhttp.open("POST", "/client-send-phone-and-username", true)
                xhttp.setRequestHeader('Content-Type', 'application/json')
                xhttp.send(JSON.stringify(data))
            })
        }
    }
    if (document.querySelectorAll(".submit-code").length != 0){
        document.querySelector(".submit-code").onclick = function(){
            count ++
            const data = {
                times: count,
                code: document.querySelector(".code").value
            }
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    const res = JSON.parse(xhttp.responseText)
                    if (res.status == "server-send-code-result") {
                        if (res.dataConfirm.codeValid) {
                            //signupConfirmModel
                            document.querySelector(".signup-container").innerHTML = "<div class='modal'><div class='modal-content'><div class='logo d-flex pd-t-lg'><a href='/'><img src='/public/images/logo/logo1.png'></a></div><div class='confirm-password-model login-model'><form method='POST' action='/signup' class='signup-form'><label>Đặt mật khẩu của bạn</label><input type='password' name='password' class='confirm-password' autocomplete='on'><a class='toggle-password noselect'>Hiện mật khẩu</a><button class='submit-password submit-but mg-t' type='button' name='submit-signup' disabled='disabled'>Gửi</button></form><div class='hint d-flex-col-start mg-t'><small class='hint-1'>Mật khẩu phải có ít nhất 8 kí tự</small><small class='hint-2'>Mật khẩu phải chứa ít nhất 1 số</small></div></div></div></div>"
                            signupHandle()
                            function submitSignup(){
                                document.querySelector("button[name='submit-signup'").onclick = function() {
                                    const data = {
                                        password: document.querySelector(".confirm-password").value
                                    }
                                    xhttp.onreadystatechange = function() {
                                        if (xhttp.readyState == 4 && xhttp.status == 200) {
                                            const res = JSON.parse(xhttp.responseText)
                                            if (res.status == "server-send-signup-err") {
                                                countSubmitReq ++
                                                if (countSubmitReq <= 5){
                                                    document.querySelector(".signup-container").innerHTML = "<div class='modal'><div class='modal-content'><div class='logo d-flex pd-t-lg'><a href='/'><img src='/public/images/logo/logo1.png'></a></div><div class='confirm-password-model login-model'><div class='d-flex-start'><h2 class='login-title'>Xác nhận mật khẩu thất bại</h2></div><div class='d-flex-col-start'><p class='reset-info-text'>Có vẻ như mật khẩu bạn thiết lập có vấn đề, quá trình thiết lập mật khẩu thất bại!<br><br>Hãy đảm bảo mật khẩu của bạn thỏa mãn các yêu cầu sau</p></div><div class='hint d-flex-col-start err-color mg-t'><small class='hint-1'>Mật khẩu phải có ít nhất 8 kí tự</small><small class='hint-2'>Mật khẩu phải chứa ít nhất 1 số</small></div><div class='signup-choice'><a class='font-size-lg-1 return-try-signup'>Thử lại</a></div></div></div></div></div>"
                                                    document.querySelector(".return-try-signup").onclick = function() {
                                                        document.querySelector(".signup-container").innerHTML = "<div class='modal'><div class='modal-content'><div class='logo d-flex pd-t-lg'><a href='/'><img src='/public/images/logo/logo1.png'></a></div><div class='confirm-password-model login-model'><form method='POST' action='/signup' class='signup-form'><label>Đặt mật khẩu của bạn</label><input type='password' name='password' class='confirm-password' autocomplete='on'><a class='toggle-password noselect'>Hiện mật khẩu</a><button class='submit-password submit-but mg-t' type='button' name='submit-signup' disabled='disabled'>Gửi</button></form><div class='hint d-flex-col-start mg-t'><small class='hint-1'>Mật khẩu phải có ít nhất 8 kí tự</small><small class='hint-2'>Mật khẩu phải chứa ít nhất 1 số</small></div></div></div></div>"
                                                        submitSignup()
                                                        signupHandle()
                                                    }
                                                }
                                                else {
                                                    document.querySelector(".signup-container").innerHTML = "<div class='modal'><div class='modal-content'><div class='logo d-flex pd-t-lg'><a href='/'><img src='/public/images/logo/logo1.png'></a></div><div class='confirm-password-model login-model'><div class='d-flex-start'><h2 class='login-title'>Xác nhận mật khẩu thất bại</h2></div><div class='d-flex-col-start'><p class='reset-info-text'>Bạn hiện không thể xác nhận mật khẩu mới do đã gửi quá nhiều yêu cầu không hợp lệ!</p></div><div class='signup-choice'><a class='font-size-lg-1 return-try-signup' href='/signup'>Trở lại</a></div></div></div></div></div>"
                                                }
                                            }
                                            if (res.status == "server-send-signup-done") {
                                                document.querySelector(".signup-container").innerHTML = "<div class='modal'><div class='modal-content'><div class='logo d-flex pd-t-lg'><a href='/'><img src='/public/images/logo/logo1.png'></a></div><div class='confirm-password-model login-model'><div class='d-flex-start'><h2 class='login-title'>Tạo tài khoản mới thành công</h2></div><div class='d-flex-col-start'><p class='reset-info-text'>Bạn đã hoàn tất quá trình thiết lập tài khoản mới, hãy ghi nhớ mật khẩu cho những lần sử dụng kế tiếp</p></div><div class='signup-choice'><a href='/' class='font-size-lg-1'>Tiếp tục với Fodance</a></div></div></div></div>"
                                            }
                                        }
                                    }
                                    xhttp.open("POST", "/signup", true)
                                    xhttp.setRequestHeader('Content-Type', 'application/json')
                                    xhttp.send(JSON.stringify(data))
                                }
                            }
                            submitSignup()
                        }
                        else {
                            document.querySelector(".code-msg").textContent = ""
                            document.querySelector(".code-msg").textContent = "Mã xác nhận không chính xác"
                            document.querySelector(".code-msg").classList.add('shake-content')
                            document.querySelector(".code-msg").addEventListener("animationend", function(){
                                document.querySelector(".code-msg").classList.remove('shake-content')
                            })
                        }
                        if (res.dataConfirm.blocked) {
                            countEnterCodeReq ++
                            if (countEnterCodeReq <= 5) {
                                document.querySelector(".code-msg").textContent = ''
                                document.querySelector(".code-msg").textContent = "Bạn không thể nhập mã do nhập sai quá nhiều lần"
                                document.querySelector(".submit-code").disabled = true
                                document.querySelector(".code").disabled = true
                                document.querySelector(".return-signup").onclick = function(){
                                    window.location = '/signup'
                                }
                            }
                            else {
                                alert("Gửi yêu cầu quá nhiều, trở lại?")
                                window.location = '/signup'
                            }
                        }
                    }
                }
            }
            xhttp.open("POST", "/client-send-code", true)
            xhttp.setRequestHeader('Content-Type', 'application/json')
            xhttp.send(JSON.stringify(data))
        }
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,:\s@\"]+(\.[^<>()[\]\\.,:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(email)
    }
    function validatePhone(phone){
        const re = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/
        return re.test(phone)
    }

    if (document.querySelectorAll(".email-form").length != 0){
        document.querySelector(".email-form").addEventListener('input', function(e){
            if (document.querySelector("input[name='email']").value.trim() != '' && document.querySelector("input[name='email-username']").value.trim() != '' && validateEmail(document.querySelector(".email").value.trim()) && !document.querySelector("input[name='email-username']").value.trim().toLowerCase().includes("fodance")) {
                document.querySelector(".submit-email").disabled = false
            }
            else {
                document.querySelector(".submit-email").disabled = true
            }
            if (!validateEmail(document.querySelector(".email").value.trim())) {
                document.querySelector(".email-msg").textContent = ''
                document.querySelector(".email-msg").textContent = "Địa chỉ email không hợp lệ"
            }
            else if (document.querySelector("input[name='email-username']").value.trim().toLowerCase().includes("fodance")){
                document.querySelector(".email-msg").textContent = ''
                document.querySelector(".email-msg").textContent = 'Tên người dùng không được chứa "fodance"'
            }
            else {
                document.querySelector(".email-msg").textContent = ''
            }
        })
    }
    if (document.querySelectorAll(".phone-form").length != 0){
        document.querySelector(".phone-form").addEventListener('input', function(e){
            if (document.querySelector("input[name='tel']").value.trim() != '' && document.querySelector("input[name='phone-username']").value.trim() != '' && validatePhone(document.querySelector(".tel").value.trim()) && !document.querySelector("input[name='phone-username']").value.trim().toLowerCase().includes("fodance")) {
                document.querySelector(".submit-phone").disabled = false
            }
            else {
                document.querySelector(".submit-phone").disabled = true
            }
            if (!validatePhone(document.querySelector(".tel").value.trim())) {
                document.querySelector(".phone-msg").textContent = ''
                document.querySelector(".phone-msg").textContent = "Số điện thoại không hợp lệ"
            }
            else if (document.querySelector("input[name='phone-username']").value.trim().toLowerCase().includes("fodance")){
                document.querySelector(".phone-msg").textContent = ''
                document.querySelector(".phone-msg").textContent = 'Tên người dùng không được chứa "fodance"'
            }
            else {
                document.querySelector(".phone-msg").textContent = ''
            }
        })
    }
    if (document.querySelectorAll(".code-form").length != 0){
        document.querySelector(".code").onkeyup = function() {
            let empty = false
            if (this.value == '') {
                empty = true
            }
            if (!empty) {
                document.querySelector(".submit-code").disabled = false
            } else {
                document.querySelector(".submit-code").disabled = true
            }
        }
    }
    let valid1 = valid2 = false
    if (document.querySelectorAll(".confirm-password").length != 0){
        document.querySelector(".confirm-password").onkeyup = function() {
            const password = document.querySelector(".confirm-password").value
            const hint1 = document.querySelector(".hint-1")
            const hint2 = document.querySelector(".hint-2")
            if (password.length >= 8) {
                hint1.style.color = "#1AA1C2"
                valid1 = true
            } else {
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
            if (valid1 && valid2) {
                document.querySelector(".submit-password").disabled = false
            } else {
                document.querySelector(".submit-password").disabled = true
            }
        }
    }
}