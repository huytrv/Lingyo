window.onresize = toggleHeader;
window.onload = toggleHeader;

let scrollRange = scrollPage = stopScrollPage = round = 0
let rankIndex = 5, cateSort = "rank-sort-content", rankLink = rankLinkPost = "primary", rankName = "Sơ cấp", filter = "current"
let cateLink = competitionContentText = "competition"
let roundType = navLink = statusRedirect = infoContentText = homeContentText = personalPostText = categoryContentText = postContentText = cateName = avtUpdate = usernameUpdate = nicknameUpdate = nicknameBeforeUpdate = cateLinkPost = filter = searchQuery = ''
let headerInnerMobile = navbarMobile = headerInner = creatorMobile = mainInfo = leftNav = frameSort = highLightMobile = followUserInfoMobile = settingBarMobile = avtName = avtNameMobile = followUserInfo = categoryInfo = ''
let headerContentText = document.querySelector(".header").innerHTML
let personalLink = interval = null
let openVolume = fullscreen = false
let videoAjaxSend = [], paused = []
let postDisplayedList = [], cmtDisplayedList = {}, repCmtDisplayedList = {}, searchDisplayedList = []
let param = navState = cateState = ''
const url = window.location.href
const cateList = ["freestyle", "hiphop", "rap", "contemporary", "ballroom", "modern", "ballet", "shuffle", "jazz", "sexy", "flashmob", "other"]
const navList = ["competition", "fame", "notifications", "saved", "honors", "add-topic", "setting"]
const navName = ["Vòng đấu", "Xếp hạng", "Thông báo", "Đã lưu", "Vinh danh", "Thêm thể loại", "Cài đặt"]
if (new Date().getDay() >= 1 && new Date().getDay() <= 5) {roundType = "group-stage"}else {roundType = "final"}


//start

function pretreatment(){
    // const startTimeline = new Date("Mon Oct 05 2020 00:00:00")
    // round = Math.floor((Date.now() - startTimeline)/1000/60/60/24/7)
    // localStorage.roundVisit = round + 1
    if (document.querySelector(".header-inner-mobile") && document.querySelector(".header-inner-mobile").innerHTML != ''){
        headerInnerMobile = document.querySelector(".header").innerHTML
    }
    if (document.querySelector(".header-inner") && document.querySelector(".header-inner").innerHTML != ''){
        headerInner = document.querySelector(".header").innerHTML
    }
    if (document.querySelector(".nav-bar-mobile") && document.querySelector(".nav-bar-mobile").innerHTML != ''){
        navbarMobile = document.querySelector(".nav-bar-mobile-frame").innerHTML
    }
    if (document.querySelector(".mobile-creator") && document.querySelector(".mobile-creator").innerHTML != ''){
        creatorMobile = document.querySelector(".mobile-creator-frame").innerHTML
    }
    window.addEventListener("load", function (){
        if (document.querySelector(".main-info") && document.querySelector(".main-info") != ''){
            mainInfo = document.querySelector(".main-info").innerHTML
        }
    })
    if (document.querySelector(".left-nav") && document.querySelector(".left-nav").innerHTML != ''){
        leftNav = document.querySelector(".left-nav").innerHTML
    }
    if (document.querySelector(".main-frame-post-sort-rounder") && document.querySelector(".main-frame-post-sort-rounder") != ''){
        frameSort = document.querySelector(".main-frame-post-sort-rounder").innerHTML
    }
    if (document.querySelector(".highlights-mobile") && document.querySelector(".highlights-mobile").innerHTML != ''){
        highLightMobile = document.querySelector(".highlights-mobile-frame").innerHTML
    }
    if (document.querySelector(".follow-user-info-mobile") && document.querySelector(".follow-user-info-mobile").innerHTML != ''){
        followUserInfoMobile = document.querySelector(".follow-user-info-mobile-frame").innerHTML
    }
    if (document.querySelector(".setting-bar-mobile") && document.querySelector(".setting-bar-mobile").innerHTML != ''){
        settingBarMobile = document.querySelector(".setting-bar-mobile-frame").innerHTML
    }
    if (document.querySelector(".avatar-name") && document.querySelector(".avatar-name").innerHTML != ''){
        avtName = document.querySelector(".avatar-name-frame").innerHTML
    }
    if (document.querySelector(".avatar-name-mobile") && document.querySelector(".avatar-name-mobile").innerHTML != ''){
        avtNameMobile = document.querySelector(".avatar-name-mobile-frame").innerHTML
    }
    if (document.querySelector(".follow-user-info") && document.querySelector(".follow-user-info").innerHTML != ''){
        followUserInfo = document.querySelector(".follow-user-info-frame").innerHTML
    }
    if (document.querySelector(".category") && document.querySelector(".category").innerHTML != ''){
        categoryInfo = document.querySelector(".category-frame").innerHTML
    }
    if (document.querySelector(".congrat-submit")){
        document.querySelector(".congrat-submit").onclick = function(){
            document.querySelector(".congrat-modal").remove()
            if (document.querySelector(".frame-post-home")){
                competitionContentText = document.querySelector(".main-frame").innerHTML
            }
        }
    }

    // document.querySelectorAll(".verified").forEach(function(e){
    //     e.onmouseover = function(){
    //         if (!document.querySelector(".tooltiptext")){
    //             e.parentNode.insertAdjacentHTML('beforeend', '<span class="tooltiptext" style="visibility: visible;">Tài khoản đã xác minh</span>')
    //         }
    //     }
    //     e.onmouseout = function(){
    //         if (document.querySelector(".tooltiptext")){
    //             document.querySelector(".tooltiptext").remove()
    //         }
    //     }
    // })
    const urlSearchParams = new URLSearchParams(window.location.search);
    const currentRank = Object.fromEntries(urlSearchParams.entries())
    if (currentRank != '') {
        rankLink = currentRank.rank
    }

    document.querySelectorAll(".mobile-download-img").forEach(function(e){
        e.onclick = function(){
            showAlert("Sắp có trên di động!")
        }
    })
    
    if (document.querySelector(".main-frame").querySelector(".frame-post-home")){
        competitionContentText = document.querySelector(".main-frame").innerHTML
    }
    else {
        // document.querySelector(".main-frame").style.minHeight = "calc(100vh - 55px)"
    }
    
    if (document.querySelector(".main-info")){
        infoContentText = document.querySelector(".main-info").innerHTML
    }
    
    if (document.querySelector(".info-frame")){
        personalPostText = document.querySelector(".info-frame").innerHTML
    }
    
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual'
    }
    
    document.querySelectorAll(".header-rank-but").forEach(function(e){
        if (e.classList.contains("header-rank-but-active")){
            rankLink = e.getAttribute("rank-data")
            rankName = e.querySelector(".header-rank-but-name").textContent
        }
    })

    
    
    const cate = window.location.pathname.replace('/', '')
    
    if (cate == 'competition' || cate == '') {
        const rankButs = document.querySelectorAll(".header-rank-but")
        for (let i = 0; i < rankButs.length; i++){
            if (rankButs[i].getAttribute("rank-data") == rankLink){
                rankButs[i].classList.add("header-rank-but-active")
            }
            else {
                rankButs[i].classList.remove("header-rank-but-active")
            }
        }
    }

    if (cate != '' && cateList.includes(cate)){
        if (document.querySelectorAll(".category-but").length != 0){
            document.querySelector(".category-but[topic-data='" + cate + "'").scrollIntoView({block: "end", inline: "center"})
            scrollRange = document.querySelector('.category-slidebar').scrollLeft
            categoryContentText = document.querySelector(".category").innerHTML
        }
        cateLink = cate
    }
    
    if (cate == 'create-post'){navLink = 'competition'}
    if (document.querySelector(".main-frame-post-inner-personal")){navLink = 'personal'}

    if (document.querySelector(".home-frame")) {
        homeContentText = document.querySelector(".main-frame").innerHTML
    }
    
    if (document.querySelectorAll(".post").length != 0){
        const posts = document.querySelectorAll(".post")
        postDisplayedList = []
        param = ''
        for (let i = 0; i < posts.length; i++){
            if (posts[i].getAttribute("data-post-df")){
                postDisplayedList.push(posts[i].getAttribute("data-post-df"))
            }
        }
    }

    let params = (new URL(document.location)).searchParams;
    searchQuery = params.get("q");

    if (document.querySelectorAll(".search-item").length != 0){
        const sItem = document.querySelectorAll(".search-item")
        searchDisplayedList = []
        for (let i = 0; i < sItem.length; i++){
            if (sItem[i].getAttribute("data-user-id")){
                searchDisplayedList.push(sItem[i].getAttribute("data-user-id"))
            }
        }
    }

    if (document.querySelector(".copy-link")){
        document.querySelector(".copy-link").onclick = function(){
            const copyToClipboard = function(str) {
                const el = document.createElement('input')
                el.value = str
                document.body.appendChild(el)
                el.select()
                el.setSelectionRange(0, 99999)
                document.execCommand('copy')
                document.body.removeChild(el)
            }
            copyToClipboard("https://fodance.com/")
            showAlert("Đã sao chép liên kết")
        }
    }

    function removeFacebookAppendedHash() {
        if (!window.location.hash || window.location.hash !== '#_=_')
          return
        if (window.history && window.history.replaceState)
          return window.history.replaceState('', document.title, window.location.pathname + window.location.search)
        var scroll = {
          top: document.body.scrollTop,
          left: document.body.scrollLeft
        }
        window.location.hash = ""
        document.body.scrollTop = scroll.top
        document.body.scrollLeft = scroll.left
    }
    removeFacebookAppendedHash()

    window.scrollTo(0, 0)
}
pretreatment()


function toggleHeader() {
    if (document.querySelector(".header-inner-mobile") && document.querySelector(".header-inner-mobile").innerHTML != ''){
        headerInnerMobile = document.querySelector(".header").innerHTML
    }
    if (document.querySelector(".header-inner") && document.querySelector(".header-inner").innerHTML != ''){
        headerInner = document.querySelector(".header").innerHTML
    }
    if (document.querySelector(".nav-bar-mobile") && document.querySelector(".nav-bar-mobile").innerHTML != ''){
        navbarMobile = document.querySelector(".nav-bar-mobile-frame").innerHTML
    }
    if (document.querySelector(".mobile-creator") && document.querySelector(".mobile-creator").innerHTML != ''){
        creatorMobile = document.querySelector(".mobile-creator-frame").innerHTML
    }

    handleMobileResponse()
    if (document.querySelector(".search-but")){
        let myWidth = window.innerWidth;
        if (myWidth >= 1200) {
            document.querySelector(".search-but").onmouseover = function() {
                return false
            }
    
            document.querySelector(".search-but").onmouseout = function() {
                return false
            }
        }
        else {
            document.querySelector(".search-but").onmouseover = function(){
                if (document.querySelector(".header-rank")){
                    document.querySelector(".header-rank").style.display = "none"
                }
            }
            
            document.querySelector(".search-but").onmouseout = function(){
                if (document.querySelector(".header-rank")){
                    document.querySelector(".header-rank").style.display = "flex"
                }
            }
        }
    }
}
toggleHeader()

function handleCategoryScroll() {
    if (document.querySelector(".category-frame")){
        let isDown = false
        let startY = 0, walk = 0, pageLoad = 0
        document.addEventListener('touchstart', (e) => {
            startY = 0, walk = 0
            isDown = true
            startY = e.touches[0].clientY
        })
        document.addEventListener('touchcancel', () => {
            isDown = false
            if (pageLoad < -150 && !document.querySelector(".modal")){
                let xhttp
                if (window.XMLHttpRequest) {
                    xhttp = new XMLHttpRequest()
                } else {
                    xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                }
                xhttp.onreadystatechange = function() {
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        const parser = new DOMParser()
                        const page = parser.parseFromString(xhttp.responseText, 'text/html')
                        if (document.querySelector(".loading-frame")){
                            document.querySelector(".loading-frame").remove()
                        }
                        document.querySelector(".main-frame").innerHTML = page.querySelector(".main-frame").innerHTML
                        pageLoad = 0
                        handleMobileResponse()
                        handleMainFrame()
                        handleNavigation()
                        handleRankPostCount()
                        handleUpdateProfile()
                        handleSetting()
                        handleMainInfo()
                    }
                }
                xhttp.open("GET", window.location.href.replace("https://fodance.com", ''), true)
                xhttp.setRequestHeader('Content-Type', 'application/json')
                xhttp.send()
            }
            if (walk < -25){
                document.querySelector(".category-frame").style.top = "50px"
            }
            else if (walk > 25){
                document.querySelector(".category-frame").style.top = "0px"
            }
            walk = 0
        })
        document.addEventListener('touchend', (e) => {
            isDown = false
            console.log(walk)
            if (pageLoad < -150 && !document.querySelector(".modal")){
                let xhttp
                if (window.XMLHttpRequest) {
                    xhttp = new XMLHttpRequest()
                } else {
                    xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                }
                xhttp.onreadystatechange = function() {
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        const parser = new DOMParser()
                        const page = parser.parseFromString(xhttp.responseText, 'text/html')
                        if (document.querySelector(".loading-frame")){
                            document.querySelector(".loading-frame").remove()
                        }
                        document.querySelector(".main-frame").innerHTML = page.querySelector(".main-frame").innerHTML
                        pageLoad = 0
                        handleMobileResponse()
                        handleMainFrame()
                        handleNavigation()
                        handleRankPostCount()
                        handleUpdateProfile()
                        handleSetting()
                        handleMainInfo()
                    }
                }
                xhttp.open("GET", window.location.href.replace("https://fodance.com", ''), true)
                xhttp.setRequestHeader('Content-Type', 'application/json')
                xhttp.send()
            }
            if (walk < -25){
                document.querySelector(".category-frame").style.top = "50px"
            }
            else if (walk > 25){
                document.querySelector(".category-frame").style.top = "0px"
            }
            walk = 0
        })
        document.addEventListener('touchmove', (e) => {
            if(!isDown) return 
            const y = e.touches[0].clientY
            const oldWalk = walk
            let count = oldWalk
            walk = Math.round((startY - y) * 1)
            if (walk < -150 && !document.querySelector(".loading-frame") && !document.querySelector(".modal")) {
                console.log(window.location.href.replace("https://fodance.com", ''))
                if (window.pageYOffset == 0) {
                    document.querySelector(".main-frame").insertAdjacentHTML("afterend", `<div class="loading-frame d-flex"><span class="iconify spin loading-icon" data-icon="ant-design:loading-3-quarters-outlined" data-inline="false"></span></div>`)
                    pageLoad = walk
                }
            }
            if (walk > 50) {walk = 50}
            else if (walk < -50){walk = -50}
            document.querySelector(".category-frame").style.scrollBehavior = 'smooth'
            if (oldWalk != walk){
                if (walk < 0){
                    if (document.querySelector(".category-frame").style.top != "50px"){
                        // for(let i = oldWalk; i > walk; i--){
                        //     count --
                        //     document.querySelector(".category-frame").style.top = -count + "px"
                        // }
                        document.querySelector(".category-frame").style.top =  "50px"
                    }
                }
                else {
                    if (document.querySelector(".category-frame").style.top != "0px"){
                        // for(let i = oldWalk; i < walk; i++){
                        //     count ++
                        //     document.querySelector(".category-frame").style.top = 50 - count + "px"
                        // }
                        document.querySelector(".category-frame").style.top =  "0px"
                    }
                }
            }
        })
    }

}
handleCategoryScroll()

function handleMobileResponse() {
    if(window.innerWidth <= 662){
        window.addEventListener("load", function () {
            if (document.querySelector(".main-info-inner")){
                document.querySelector(".main-info-inner").remove()
            }
            if (document.querySelector(".left-nav-inner")){
                document.querySelector(".left-nav-inner").remove()
            }
            if (document.querySelector(".header-inner")){
                document.querySelector(".header-inner").remove()
            }
            if (document.querySelector(".main-frame-post-sort")){
                document.querySelector(".main-frame-post-sort").remove()
            }
        })
        if (headerInnerMobile && !document.querySelector(".header-inner-mobile")){
            document.querySelector(".header").innerHTML = headerInnerMobile
        }
        if (navbarMobile && !document.querySelector(".nav-bar-mobile")){
            document.querySelector(".nav-bar-mobile-frame").innerHTML = navbarMobile
        }
        if (creatorMobile && !document.querySelector(".mobile-creator")){
            document.querySelector(".mobile-creator-frame").innerHTML = creatorMobile
        }
        document.querySelector(".main").style.paddingBottom = "55px"
        if (!document.querySelector(".category-slidebar")){
            document.querySelector(".category-frame").style.height = "0px"
        }
        document.querySelectorAll("input[data-plyr='volume']").forEach(function(e){
            e.remove()
        })
        if (navLink == ''){navLinkTitle = window.location.pathname.replace('/', '')} else {navLinkTitle = navLink}
        if (cateLink == ''){cateLinkTitle = window.location.pathname.replace('/', '')} else {cateLinkTitle = cateLink}
        for (let i = 0; i < navList.length; i++){
            if (navLinkTitle == navList[i]){
                if (roundType == "final" && navLinkTitle == "competition"){
                    document.querySelector(".title-content").textContent = "Chung kết"
                }
                else {
                    document.querySelector(".title-content").textContent = navName[i]
                }
                if (document.querySelector(".mobile-creator")){
                    if (i < 4) {document.querySelector(".mobile-creator").style.display = "block"}
                    else {document.querySelector(".mobile-creator").style.display = "none"}
                }
            }
            else if (navLinkTitle == ''){
                document.querySelector(".title-content").textContent = "Trang chủ"
            }
            else if (navLinkTitle == 'personal'){
                document.querySelector(".title-content").textContent = "Hồ sơ"
            }
        }

        handleCreatePost()
        handleNavigation()
        handleRankHeader()
        handleToggle()
        handlePayment()
        handleStars()

        for (let i = 0; i < cateList.length; i++){
            if (cateLinkTitle == cateList[i] && (navLink == "competition" || cateList.includes(window.location.pathname.replace('/', '')))){
                if (roundType == "final"){
                    document.querySelector(".title-content").textContent = "Chung kết"
                }
                else {
                    document.querySelector(".title-content").textContent = "Vòng đấu"
                }
            }
        }
        if(!document.querySelector(".category-slidebar")){
            if (document.querySelector(".category")){
                document.querySelector(".category").remove()
            }
        }
        
        // let prevScrollpos = window.pageYOffset
        // window.addEventListener('scroll', function() {
        //     let currentScrollPos = window.pageYOffset
        //     // if (document.querySelector(".bg-music")){
        //         if (prevScrollpos > currentScrollPos) {
        //             // document.querySelector(".header").style.top = "0"
        //             document.querySelector(".main").style.paddingTop = "48px"
        //             document.querySelector(".category-frame").style.top = "48px"
        //             document.querySelector(".category").style.top = "48px"
        //         } else {
        //             // document.querySelector(".header").style.top = "-48px"
        //             document.querySelector(".main").style.paddingTop = "0"
        //             document.querySelector(".category-frame").style.top = "0"
        //             document.querySelector(".category").style.top = "0"
        //         }
        //     // }
        //     prevScrollpos = currentScrollPos
        // })

        if (document.querySelector(".sidenav")){
            // document.querySelector(".sidenav").style.width = "0";
            // document.querySelector(".sidenav-frame").style.position = "relative"

            document.querySelector(".open-nav").onclick = function() {
                document.querySelector(".header").style.zIndex = 2000;
                document.querySelector(".sidenav").style.width = "75%";
                document.querySelector(".sidenav-frame").style.position = "fixed";
                document.querySelector(".mobile-creator").style.zIndex = 1000
            }
              
            document.querySelector(".close-nav").onclick = function() {
                document.querySelector(".sidenav").style.width = "0";
                document.querySelector(".sidenav-frame").style.position = "relative"
                document.querySelector(".mobile-creator").style.zIndex = 5000
            }

            document.querySelector(".sidenav-frame").onclick = function(e) {
                if (e.target != document.querySelector(".home-input")){
                    document.querySelector(".sidenav").style.width = "0";
                    document.querySelector(".sidenav-frame").style.position = "relative"
                    document.querySelector(".mobile-creator").style.zIndex = 5000
                }
            }
        }

        if (document.querySelector(".return-but") && !document.querySelector(".return-but").classList.contains("close-view-post-modal")){
            document.querySelector(".return-but").onclick = function(){
                this.parentNode.parentNode.classList.add("modal-remove-down")
                this.parentNode.parentNode.onanimationend = function () {
                    window.history.back()
                }
            }
        }
    }
    else {
        if (document.querySelector(".nav-bar-mobile")){
            document.querySelector(".nav-bar-mobile").remove()
        }
        if (document.querySelector(".header-inner-mobile")){
            document.querySelector(".header-inner-mobile").remove()
        }
        if (document.querySelector(".mobile-creator")){
            document.querySelector(".mobile-creator").remove()
        }
        if (headerInner != '' && !document.querySelector(".header-inner")){
            document.querySelector(".header").innerHTML = headerInner
        }
        if (mainInfo != '' && !document.querySelector(".main-info-inner")){
            document.querySelector(".main-info").innerHTML = mainInfo
        }
        if (leftNav != '' && !document.querySelector(".left-nav-inner")){
            document.querySelector(".left-nav").innerHTML = leftNav
        }
        if (frameSort != '' && document.querySelector(".main-frame-post-sort-rounder") && !document.querySelector(".main-frame-post-sort")){
            document.querySelector(".main-frame-post-sort-rounder").innerHTML = frameSort
        }
        if (categoryInfo != '' && document.querySelector(".category-frame") && !document.querySelector(".category")){
            document.querySelector(".category-frame").innerHTML = categoryInfo
        }
        document.querySelector(".category-frame").style.height = "45px"
    }

    if(!document.querySelector(".category")){
        document.querySelector(".main-inner").style.marginTop = "5px"
    } else {
        document.querySelector(".main-inner").style.marginTop = "0"
    }

    if (window.innerWidth <= 1024) {
        if (document.querySelector(".avatar-name")){
            document.querySelector(".avatar-name").remove()
            document.querySelector(".follow-user-info").remove()
        }
        if (highLightMobile != '' && document.querySelector(".highlights-mobile-frame") && !document.querySelector(".highlights-mobile")){
            document.querySelector(".highlights-mobile-frame").innerHTML = highLightMobile
        }
        if (followUserInfoMobile != '' && document.querySelector(".follow-user-info-mobile-frame") && !document.querySelector(".follow-user-info-mobile")){
            document.querySelector(".follow-user-info-mobile-frame").innerHTML = followUserInfoMobile
        }
        if (settingBarMobile != '' && document.querySelector(".setting-bar-mobile-frame") && !document.querySelector(".setting-bar-mobile")){
            document.querySelector(".setting-bar-mobile-frame").innerHTML = settingBarMobile
            handleSetting()
        }
        if (avtNameMobile != '' && document.querySelector(".avatar-name-mobile-frame") && !document.querySelector(".avatar-name-mobile")){
            document.querySelector(".avatar-name-mobile-frame").innerHTML = avtNameMobile
            document.querySelector(".avatar-name-mobile").style.display = "flex"
        }
    }
    else {
        if (document.querySelector(".highlights-mobile")){
            document.querySelector(".highlights-mobile").remove()
        }
        if (document.querySelector(".follow-user-info-mobile")){
            document.querySelector(".follow-user-info-mobile").remove()
        }
        if (document.querySelector(".setting-bar-mobile")){
            document.querySelector(".setting-bar-mobile").remove()
        }
        if (document.querySelector(".avatar-name-mobile")) {
            document.querySelector(".avatar-name-mobile").remove()
        }
        if (avtName != '' && document.querySelector(".avatar-name-frame") && !document.querySelector(".avatar-name")){
            document.querySelector(".avatar-name-frame").innerHTML = avtName
        }
        if (followUserInfo != '' && document.querySelector(".follow-user-info-frame") && !document.querySelector(".follow-user-info")){
            document.querySelector(".follow-user-info-frame").innerHTML = followUserInfo
        }
    }
    handleFollow()
    handleRankHeader()
    handleNavigation()
    handleNavInfo()
    handleCreatePost()
    handleToggle()
    handleSetting()
    handlePayment()
    handleStars()
}
handleMobileResponse()


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

const showAlertCateRank = function(text){
    if (document.querySelectorAll(".alert-cate-rank").length != 0){
        document.querySelectorAll(".alert-cate-rank").forEach(function (e) {
            e.remove()
        })
    }
    let alert = document.createElement("div")
    alert.classList.add("alert-cate-rank")
    let textAlert = document.createTextNode(text)
    alert.appendChild(textAlert)
    document.querySelector(".global").appendChild(alert)
    setTimeout(function() {
        if (document.querySelectorAll(".alert-cate-rank").length != 0){
            document.querySelector(".alert-cate-rank").remove()
        }
    }, 3000)
}

const showAlertWithLink = function(link){
    if (document.querySelectorAll(".alert").length != 0){
        if (document.querySelectorAll(".alert").length != 0){
            document.querySelectorAll(".alert").forEach(function(e){
                e.remove()
            })
        }
    }
    let alert = document.createElement("div")
    alert.classList.add("alert-link")
    alert.innerHTML = link
    document.querySelector(".global").appendChild(alert)
    setTimeout(function() {
        if (document.querySelectorAll(".alert-link").length != 0){
            document.querySelector(".alert-link").remove()
        }
    }, 8000)
}

const showSuccessAlert = function(text) {
    if (document.querySelectorAll(".alert-success").length != 0){
        document.querySelector(".alert-success").remove()
    }
    let alert = document.createElement("div")
    alert.classList.add("alert-success")
    let textAlert = document.createTextNode(text)
    alert.appendChild(textAlert)
    document.querySelector(".global").appendChild(alert)
    setTimeout(function() {
        if (document.querySelectorAll(".alert-success").length != 0){
            document.querySelector(".alert-success").remove()
        }
    }, 3000)
}

const showFailureAlert = function(text) {
    if (document.querySelectorAll(".alert-failure").length != 0){
        document.querySelector(".alert-failure").remove()
    }
    let alert = document.createElement("div")
    alert.classList.add("alert-failure")
    let textAlert = document.createTextNode(text)
    alert.appendChild(textAlert)
    document.querySelector(".global").appendChild(alert)
    setTimeout(function() {
        if (document.querySelectorAll(".alert-failure").length != 0){
            document.querySelector(".alert-failure").remove()
        }
    }, 3000)
}


function starRedirect(c, pushState){
    let xhttp
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest()
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP")
    }
    document.querySelector(".global").insertAdjacentHTML("afterend", `<div class="modal payment-modal"><div class="loading-frame d-flex"><span class="iconify spin loading-icon" data-icon="ant-design:loading-3-quarters-outlined" data-inline="false"></span></div></div>`)
    xhttp.onreadystatechange = function() {    
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            const res = JSON.parse(xhttp.responseText)
            document.querySelector(".payment-modal").innerHTML = `<div class="modal-content star-modal-content"><div class="group-title d-flex">
            ${(()=>{if (window.innerWidth <= 662){return `
            <span class="font-size-lg-2">Phần tiền thưởng</span>
            <div class="close-edit-modal return-but"><span class="iconify" data-icon="heroicons-outline:arrow-left" data-inline="false"></span></div>
            `}
            else {
                return `
                <span class="font-size-lg-4">Phần tiền thưởng</span>
                <button class='close close-edit-modal' type="button">
                    <span class='iconify dropdown-icon' data-icon='feather:x' data-inline='false'></span>
                </button>
                `
            }})()}</div><div class="border-b"></div><div class="payment-content-frame"><div class="d-flex pd"><div class="d-flex font-size-lg-1 bold-font">Bạn hiện có <span class="theme-color mg-l-sm">${document.querySelector(".star-total").textContent}$</span></div></span></div><div class="d-flex-start pd"><span>Thêm số thẻ thanh toán của bạn để nhận tiền thưởng vào cuối Vòng bình chọn. Hãy nhập chính xác số thẻ và tên ngân hàng của bạn!</span></div><div class="pd mg-t"><div><label>Số thẻ</label><input type="number" class="card-number"></div><div class="mg-t"><label>Tên ngân hàng<input type="text" class="bank-name"></div><div class="d-flex pd"><div class="keep-stars mg-r-lg d-flex"><input type="radio" class="keep mg-r-sm" name="keep" value="keep" ${(()=>{if(!res.starStatus){return 'checked'} else {return ''}})()}><label for="keep">Giữ tiền thưởng</label></div><div class="d-flex exchange-stars"><input type="radio" class="exchange mg-r-sm" name="exchange" value="exchange" ${(()=>{if(res.starStatus){return 'checked'} else {return ''}})()}><label for="exchange">Để quy đổi</label></div></div><button class="submit-but submit-card mg-t-lg" disabled>Xác nhận</button></div></div><div class="d-flex">${(()=>{if (res.status == "exist") {return `Bạn đã thêm một thẻ kết thúc bằng ***${res.card}`} else {return 'Bạn hiện chưa thêm thẻ nào!'}})()}</div></div>`

            function handleStarStatus(status){
                let xhttp
                if (window.XMLHttpRequest) {
                    xhttp = new XMLHttpRequest()
                } else {
                    xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                }
                const data = {
                    status: status
                }
                xhttp.open("POST", "/update-star-status", true)
                xhttp.setRequestHeader('Content-Type', 'application/json')
                xhttp.send(JSON.stringify(data))
            }

            document.querySelector(".keep-stars").onclick = function(){
                document.querySelector(".keep").checked = true
                document.querySelector(".exchange").checked = false
                handleStarStatus(false)
            }

            document.querySelector(".exchange-stars").onclick = function(){
                document.querySelector(".exchange").checked = true
                document.querySelector(".keep").checked = false
                handleStarStatus(true)
            }

            document.querySelector(".card-number").onkeyup = function(){
                if (this.value != '' && document.querySelector(".bank-name").value != ''){
                    document.querySelector(".submit-card").disabled = false
                }
                else {
                    document.querySelector(".submit-card").disabled = true
                }
            }
            document.querySelector(".bank-name").onkeyup = function(){
                if (this.value != '' && document.querySelector(".card-number").value != ''){
                    document.querySelector(".submit-card").disabled = false
                }
                else {
                    document.querySelector(".submit-card").disabled = true
                }
            }

            document.querySelector(".submit-card").onclick = function(){
                if (document.querySelector(".bank-name").value != '' && document.querySelector(".card-number").value != ''){
                    this.parentNode.parentNode.classList.add("modal-remove-down")
                    this.parentNode.parentNode.onanimationend = function () {
                        window.history.back()
                    }
                    let xhttp
                    if (window.XMLHttpRequest) {
                        xhttp = new XMLHttpRequest()
                    } else {
                        xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                    }
                    const data = {
                        cardNumber: document.querySelector(".card-number").value,
                        bankName: document.querySelector(".bank-name").value
                    }
                    xhttp.onreadystatechange = function() {    
                        if (xhttp.readyState == 4 && xhttp.status == 200) {
                            const res = JSON.parse(xhttp.responseText)
                            if (res.status == "done"){
                                showAlert("Thêm số thẻ nhận tiền thưởng thành công!")
                            }
                            else if (res.status == "empty") {
                                showAlert("Số thẻ và tên tài khoản không được để trống!")
                            }
                        }
                    }
                    xhttp.open("POST", "/update-card", true)
                    xhttp.setRequestHeader('Content-Type', 'application/json')
                    xhttp.send(JSON.stringify(data))
                }
                else {
                    showAlert("Số thẻ và tên tài khoản không được để trống!")
                }
            }

            if (pushState){
                if (pushState){
                    history.pushState({
                        paymentModal: c.outerHTML,
                    }, '', 'https://fodance.com/star-reward')
                }
            }

            const modal = document.querySelector(".payment-modal")
            document.querySelector(".close-edit-modal").onclick = function(){
                modal.querySelector(".modal-content").classList.add("modal-remove-down")
                modal.querySelector(".modal-content").onanimationend = function () {
                    window.history.back()
                }
            }

            window.onclick = function(e){
                if (e.target == modal){
                    modal.querySelector(".modal-content").classList.add("modal-remove-down")
                    modal.querySelector(".modal-content").onanimationend = function () {
                        window.history.back()
                    }                
                }
            }
        }
    }
    xhttp.open("POST", "/card-modal", true)
    xhttp.setRequestHeader('Content-Type', 'application/json')
    xhttp.send()
}

function handleStars(){
    document.querySelectorAll(".user-stars").forEach(function(e){
        e.onclick = function(){
            starRedirect(this, true)
        }
    })

    if (document.querySelector(".create-post-handler") && document.querySelector(".create-post-handler").classList.contains("star-reward-handler-begin")){
        const starBut = document.querySelector(".user-stars")
        starRedirect(starBut, false)
        document.querySelector(".create-post-handler").classList.remove("star-reward-handler-begin")
    }
}
handleStars()

function paymentRedirect(c, pushState){
    document.querySelector(".global").insertAdjacentHTML("afterend", `<div class="modal payment-modal"><div class="modal-content payment-modal-content"><div class="group-title d-flex">
    ${(()=>{if (window.innerWidth <= 662){return `
    <span class="font-size-lg-2">Mua vé bình chọn</span>
    <div class="close-edit-modal return-but"><span class="iconify" data-icon="heroicons-outline:arrow-left" data-inline="false"></span></div>
    `}
    else {
        return `
        <span class="font-size-lg-4">Mua vé bình chọn</span>
        <button class='close close-edit-modal' type="button">
            <span class='iconify dropdown-icon' data-icon='feather:x' data-inline='false'></span>
        </button>
        `
    }})()}</div><div class="border-b"></div><div class="payment-content-frame"><div class="d-flex mg-t pd"><span class="font-size-lg-1 bold-font">Bạn có thể mua vé để tham gia bình chọn trên Lingyo tại cấp Trung cấp và Cao cấp</span></div><div class="pd"><span>Bạn sẽ được trả lại vé nếu có ít hơn 3 người tham gia ở mỗi thể loại.</span></div><div class="d-flex-start pd-t pd-l mg-l-lg"><span>Chọn số lượng vé:</span></div><div class="ticket-frame mg-t-lg"><button class="ticket-but" data-tickets="5"><span class="iconify font-icon mg-r-sm red-color" data-icon="foundation:ticket" data-inline="false"></span>5</button><button class="ticket-but" data-tickets="10"><span class="iconify font-icon mg-r-sm red-color" data-icon="foundation:ticket" data-inline="false"></span>10</button><button class="ticket-but" data-tickets="20"><span class="iconify font-icon mg-r-sm red-color" data-icon="foundation:ticket" data-inline="false"></span>20</button><button class="ticket-but" data-tickets="50"><span class="iconify font-icon mg-r-sm red-color" data-icon="foundation:ticket" data-inline="false"></span>50</button><button class="ticket-but" data-tickets="70"><span class="iconify font-icon mg-r-sm red-color" data-icon="foundation:ticket" data-inline="false"></span>70</button><button class="ticket-but" data-tickets="100"><span class="iconify font-icon mg-r-sm red-color" data-icon="foundation:ticket" data-inline="false"></span>100</button><button class="ticket-but" data-tickets="150"><span class="iconify font-icon mg-r-sm red-color" data-icon="foundation:ticket" data-inline="false"></span>150</button><button class="ticket-but" data-tickets="200"><span class="iconify font-icon mg-r-sm red-color" data-icon="foundation:ticket" data-inline="false"></span>200</button></div><div class="d-flex-col-start pd mg-t"><span class="font-size-lg-1 bold-font">Chọn hình thức thanh toán</span><div class="paypal-payment mg-t"><div><input type="radio" name="paypay-radio" value="paypal" checked><span class="font-size-lg-1 mg-l bold-font">Paypal</span></div><div><img src="/public/images/paypal.png"></div></div></div><div class="pd"><span class="font-size-lg-2 bold-font">Tổng tiền:</span><span class="payment-total font-size-lg-2 mg-l bold-font mg-l">0 $</span></div><div class="pd"><form action="payment" method="post"><input class="payment-amount" name="totalAmount"><input class="payment-value" name="totalCost"><button class="submit-but submit-payment" disabled>Xác nhận</button></form></div></div></div></div></div>`)

    document.querySelectorAll(".ticket-but").forEach(function(e){
        e.onclick = function(){
            document.querySelector(".payment-total").innerHTML = e.getAttribute("data-tickets") + '$'
            document.querySelector(".payment-value").value = e.getAttribute("data-tickets")
            document.querySelector(".payment-amount").value = e.getAttribute("data-tickets")
            document.querySelector(".submit-payment").disabled = false
        }
    })

    if (pushState){
        if (pushState){
            history.pushState({
                paymentModal: c.outerHTML,
            }, '', 'https://fodance.com/ticket-payment')
        }
    }

    const modal = document.querySelector(".payment-modal")
    document.querySelector(".close-edit-modal").onclick = function(){
        modal.querySelector(".modal-content").classList.add("modal-remove-down")
        modal.querySelector(".modal-content").onanimationend = function () {
            window.history.back()
        }
    }

    window.onclick = function(e){
        if (e.target == modal){
            modal.querySelector(".modal-content").classList.add("modal-remove-down")
            modal.querySelector(".modal-content").onanimationend = function () {
                window.history.back()
            }
        }
    }
}

function handlePayment(){
    document.querySelectorAll(".user-tickets").forEach(function(e){
        e.onclick = function(){
            paymentRedirect(this, true)
        }
    })

    if (document.querySelector(".create-post-handler")){
        if (document.querySelector(".create-post-handler").classList.contains("ticket-payment-handler-begin")){
            const paymentBut = document.querySelector(".user-tickets")
            paymentRedirect(paymentBut, false)
            document.querySelector(".create-post-handler").classList.remove("ticket-payment-handler-begin")
        }
        if (document.querySelector(".create-post-handler").classList.contains("alert-success-begin")){
            showSuccessAlert("Giao dịch mua vé thành công!")
            document.querySelector(".create-post-handler").classList.remove("alert-success-begin")
        }
        if (document.querySelector(".create-post-handler").classList.contains("alert-failure-begin")){
            showFailureAlert("Giao dịch mua vé không thành công!")
            document.querySelector(".create-post-handler").classList.remove("alert-failure-begin")
        }
    }
}
handlePayment()

function replaceLinkName(){
    String.prototype.replaceBetween = function(start, end, what) {
        return this.substring(0, start) + what + this.substring(end)
    }

    const avtUsername = document.querySelectorAll(".avt-username")
    avtUsername.forEach(function(e){
        if (e.textContent.length > 13){
            e.textContent = e.textContent.replaceBetween(10, e.textContent.length, '...')
        }
    })

    const avtNickname = document.querySelectorAll(".avt-nickname")
    avtNickname.forEach(function(e){
        if (e.textContent.length > 15){
            e.textContent = e.textContent.replaceBetween(12, e.textContent.length, '...')
        }
    })

    // if (document.querySelectorAll(".topic-theme")){
    //     const avtNickname = document.querySelectorAll(".topic-theme")
    //     avtNickname.forEach(function(e){
    //         if (e.textContent.length > 8){
    //             e.textContent = e.textContent.replaceBetween(5, e.textContent.length, '...')
    //         }
    //     })
    // }

    // const url = document.querySelectorAll("[src]")

    // url.forEach(function(e){
    //     const path = e.getAttribute('src')
    //     if (!path.includes("https")) {
    //         if ((e.tagName == "IMG" || e.tagName == "VIDEO") && !e.classList.contains("cf-img") && e.getAttribute("src") != "/public/images/default-cover.png" && e.getAttribute("src") != "/public/images/default-user.png"){
    //             e.setAttribute('src', "https://cdn.fodance.com/fd-media/" + path)
    //         }
    //         else {
    //             e.setAttribute('src', "https://fodance.com" + path)
    //         }
    //     }
    //     // if (!path.includes("http") && !e.classList.contains("post-video")){
    //     //     e.setAttribute('src', "https://fodance.com" + path)
    //     // }
    //     // else if (!path.includes("http") && e.classList.contains("post-video")){
    //     //     // const file = new File([path], path, {
    //     //     //     type: "video/mp4",
    //     //     // })
    //     //     // const urlBlob = URL.createObjectURL(file)
    //     //     // e.setAttribute('src', urlBlob)
    //     //     // let blob = fetch("https://fodance.com" + path).then(function(r){
    //     //     // });
    //     // }
    // })
}
replaceLinkName()

function searchRedirect(text, pushState){
    if (text.length > 0 && text.length <= 30){
        let xhttp
        if (window.XMLHttpRequest) {
            xhttp = new XMLHttpRequest()
        } else {
            xhttp = new ActiveXObject("Microsoft.XMLHTTP")
        }
        const data = {
            searchText: text,
            searchDisplayedList: searchDisplayedList
        }
        window.scrollTo(0, 0)
        navLink = "search"
        if (document.querySelector(".category") && ! document.querySelector(".category-slidebar")){
            document.querySelector(".category").innerHTML = `<div class="d-flex group-title"><span class="mg-l-lg font-size-lg-2 none-deco none-mg">Kết quả tìm kiếm cho "${text}"</div>`
        }
        if (document.querySelector(".post-frame")){
            document.querySelector(".post-frame").innerHTML = '<div class="loading-post"><div class="d-flex-start loading-content"><div class="loading-post-circle mg-r"></div><div class="d-flex-col-start-content width-80"><div class="loading-post-line width-30 mg-b-sm"></div><div class="loading-post-line width-20"></div></div></div><div class="loading-post-line width-90 mg-b-sm"></div></div></div>'
        }
        if (document.querySelector(".title-content")){
            document.querySelector(".title-content").textContent = "Tìm kiếm"
        }
        xhttp.onreadystatechange = function() {    
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                const res = JSON.parse(xhttp.responseText)
                if (document.querySelector(".loading-post")){
                    document.querySelector(".loading-post").remove()
                }
                if (!document.querySelector(".search-content")){
                    document.querySelector(".main-frame").innerHTML = '<div class="response-frame mg-t"><div class="search-content"></div><div class="seemore-frame pd-l-lg pd-r-lg pd-t pd-b"><span class="seemore-result">Hiển thị thêm</span></div></div>'
                }
                console.log(res.end)
                if (!res.end){
                    for (let i = 0; i < res.result.length; i++){
                        searchDisplayedList.push(res.result[i][0])
                        document.querySelector(".search-content").insertAdjacentHTML('beforeend', `
                        <div class="search-item border-b nav-red" nav-data='personal' data-user-df="${res.result[i][2]}" data-user-id="${res.result[i][0]}">
                            <div class="d-flex-sb">
                                <div class="d-flex">
                                    ${(()=>{if (res.result[i][3].includes("http")) {return `
                                    <a class="avt"><img src="${res.result[i][3]}" class="user-avt" username="${res.result[i][1]}"></a>
                                    `}
                                    else {return `
                                    <a class="avt"><img src="https://cdn.fodance.com/fd-media/${res.result[i][3]}" class="user-avt" username="${res.result[i][1]}"></a>
                                    `}
                                    })()}
                                    <div class="d-flex-col-start">
                                        <a class="avt"><span class="avt-username user-username">${res.result[i][1]}</span></a>
                                        <a class="avt">
                                            <span class="post-time nickname-content">
                                                @${res.result[i][2]}
                                            </span>
                                        </a>
                                    </div>
                                </div>
                                <div>
                                    ${(()=>{if (res.result[i][5]){return `
                                    <button class="follow-but following-but" data-following="${res.result[i][5]}">
                                        <span class="follow-text">Đang theo dõi</span>
                                    </button>`}
                                    else {return `<button class="follow-but" data-following="${res.result[i][5]}">
                                        <span class="follow-text">Theo dõi</span>
                                    </button>`}
                                    })()}
                                </div>
                            </div>
                            <div><span>${res.result[i][4]}</span></div>
                        </div>
                        `)
                    }
                    if (document.querySelector(".seemore-result")){
                        document.querySelector(".seemore-result").onclick = function(){
                            searchRedirect(text, false)
                        }
                    }
                }
                else {
                    if (document.querySelector(".seemore-result")){
                        document.querySelector(".seemore-result").remove()
                        document.querySelector(".search-content").insertAdjacentHTML('beforeend', '<div class="pd mg no-result d-flex"><span class="">Không còn kết quả tìm kiếm!</span></div>')
                    }
                    else {
                        document.querySelector(".search-content").insertAdjacentHTML('beforeend', '<div class="pd mg no-result d-flex"><span class="">Không còn kết quả tìm kiếm!</span></div>')
                    }
                }
                document.querySelector(".search-input").value = ''
                document.querySelector(".search-input").blur()
                handleMobileResponse()
                handleNavigation()
            }
        }
        xhttp.open("POST", "/search-scription", true)
        xhttp.setRequestHeader('Content-Type', 'application/json')
        xhttp.send(JSON.stringify(data))
        const textUrl = text.replace(/[^a-zA-Z0-9_]/g, "")
        if (pushState){
            history.pushState({
                searchAgent: textUrl
            }, '', 'https://fodance.com/search?q=' + textUrl)
            document.querySelector('title').textContent = 'Lingyo | ' + text + ' - ' + "Tìm kiếm"
        }
    }
    else {
        showAlert("Từ khoá tìm kiếm quá dài!")
    }
}

function handleSearch(){
    if (document.querySelector(".search-form")){
        document.querySelector(".search-form").onsubmit = function(e){
            e.preventDefault()
            if (document.querySelector(".sidenav-frame")){
                document.querySelector(".sidenav").style.width = "0";
                document.querySelector(".sidenav-frame").style.position = "relative"
            }
            const text = document.querySelector(".search-input").value
            searchDisplayedList = []
            if (document.querySelectorAll(".search-item").length != 0){
                document.querySelector(".search-content").innerHTML = ''
            }
            if (document.querySelectorAll(".no-result").length != 0){
                document.querySelector(".no-result").remove()
            }
            // if (window.innerWidth <= 662){
            //     document.querySelector(".header").style.top = "-48px"
            //     document.querySelector(".category").remove()
            //     document.querySelector(".main").style.paddingTop = "0"
            // }
            searchRedirect(text, true)
        }
    
        if (document.querySelector(".seemore-result")){
            document.querySelector(".seemore-result").onclick = function(){
                searchRedirect(searchQuery, false)
            }
        }
    }
}
handleSearch()


function rankRedirect(rankBut, pushState){
    window.scrollTo(0, 0)
    const rankAgent = rankBut.outerHTML
    rankLink = rankBut.getAttribute("rank-data")
    rankName = rankBut.querySelector(".header-rank-but-name").textContent
    if(window.innerWidth <= 662){
        showAlertCateRank("Đã chọn phòng " + rankName)
        if (roundType == "group-stage"){
            document.querySelector(".title-content").textContent = "Vòng đấu"
        }
        else {
            document.querySelector(".title-content").textContent = "Chung kết"
        }
    }
    const rankHeader = document.querySelectorAll(".header-rank-but")
    for (let i = 0; i < rankHeader.length; i++){
        rankHeader[i].classList.remove("header-rank-but-active")
        if (rankBut.getAttribute("rank-data") == rankHeader[i].getAttribute("rank-data")){
            rankHeader[i].classList.add("header-rank-but-active")
        }
    }
    if (window.location.pathname != '/'){
        let xhttp
        if (window.XMLHttpRequest) {
            xhttp = new XMLHttpRequest()
        } else {
            xhttp = new ActiveXObject("Microsoft.XMLHTTP")
        }
        if (document.querySelectorAll(".post-frame").length != 0){
            document.querySelector(".post-frame").innerHTML = '<div class="loading-post"><div class="d-flex-start loading-content"><div class="loading-post-circle mg-r"></div><div class="d-flex-col-start-content width-80"><div class="loading-post-line width-30 mg-b-sm"></div><div class="loading-post-line width-20"></div></div></div><div class="loading-post-line width-90 mg-b-sm"></div></div></div>'
        }
        else {
            document.querySelector(".main-frame").innerHTML = '<div class="loading-frame d-flex"><span class="iconify spin loading-icon" data-icon="ant-design:loading-3-quarters-outlined" data-inline="false"></span></div>'
        }
        filter = "current"
        if (document.querySelector(".all-filter") && document.querySelector(".all-filter").classList.contains("theme-color")){
            document.querySelector(".all-filter").classList.remove("theme-color")
        }     
        if (document.querySelector(".all-filter") && !document.querySelector(".current-filter").classList.contains("theme-color")){
            document.querySelector(".current-filter").classList.add("theme-color")
        }
        document.querySelectorAll(".nav-ele").forEach(function(e){
            if (e.getAttribute("nav-data") == 'competition'){
                e.classList.add("active")
            }
            else {
                e.classList.remove("active")
            }
        })
        xhttp.onreadystatechange = function() {    
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                const parser = new DOMParser()
                const page = parser.parseFromString(xhttp.responseText, 'text/html')
                const mainFrameText = page.querySelector(".main-frame").innerHTML
                const contentText = page.querySelector(".post-frame").innerHTML
                if (document.querySelectorAll(".post-frame").length != 0){
                    document.querySelector(".post-frame").innerHTML = contentText
                }
                else {
                    document.querySelector(".main-frame").innerHTML = mainFrameText
                }
                if (document.querySelectorAll(".category-slidebar").length != 0){
                    document.querySelector('.category-slidebar').scrollLeft = scrollRange
                }
                if (document.querySelector(".main-info-inner") && document.querySelector(".main-info-inner").classList.contains("info-personal")) {
                    const mainInfo = page.querySelector(".main-info")
                    const mainInfoText = mainInfo.innerHTML
                    document.querySelector(".main-info").innerHTML = mainInfoText
                    handleMainInfo()
                }
                if (document.querySelector(".main-info-inner") && document.querySelector(".main-info-inner").classList.contains("info-setting")) {
                    const mainInfo = page.querySelector(".main-info")
                    const mainInfoText = mainInfo.innerHTML
                    document.querySelector(".main-info").innerHTML = mainInfoText
                    handleMainInfo()
                }
                if (document.querySelector(".frame-post-home")){
                    competitionContentText = document.querySelector(".main-frame").innerHTML
                }
                if (document.querySelector(".main-info")){
                    infoContentText = document.querySelector(".main-info").innerHTML
                }
                if (document.querySelectorAll(".post").length != 0){
                    const posts = document.querySelectorAll(".post")
                    postDisplayedList = []
                    param = ''
                    for (let i = 0; i < posts.length; i++){
                        if (posts[i].getAttribute("data-post-df")){
                            postDisplayedList.push(posts[i].getAttribute("data-post-df"))
                        }
                    }
                }
                rankIndex = 5
                stopScrollPage = 0
                statusRedirect = "competition"
                handleMainFrame()
                handleNavigation()
                handleRankPostCount()
                if(window.innerWidth <= 662){
                    if (roundType == "group-stage"){
                        document.querySelector(".title-content").textContent = "Vòng đấu"
                    }
                    else {
                        document.querySelector(".title-content").textContent = "Chung kết"
                    }
                }
                if (pushState){
                    history.pushState({
                        rankAgent: rankAgent
                    }, '', 'https://fodance.com/' + cateLink + "?rank=" + rankLink)
                    document.querySelector('title').textContent = 'Lingyo | ' + cateName + ' - ' + rankName
                }
            }    
        }
        xhttp.open("GET", '/' + cateLink + "?rank=" + rankLink, true)
        xhttp.setRequestHeader('Content-Type', 'application/json')
        xhttp.send()
    }
    else {
        let xhttp
        if (window.XMLHttpRequest) {
            xhttp = new XMLHttpRequest()
        } else {
            xhttp = new ActiveXObject("Microsoft.XMLHTTP")
        }
        document.querySelector(".main-frame").innerHTML = '<div class="loading-frame d-flex"><span class="iconify spin loading-icon" data-icon="ant-design:loading-3-quarters-outlined" data-inline="false"></span></div>'
        xhttp.onreadystatechange = function() {    
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                const parser = new DOMParser()
                const page = parser.parseFromString(xhttp.responseText, 'text/html')
                const mainFrameText = page.querySelector(".main-frame").innerHTML
                document.querySelector(".main-frame").innerHTML = mainFrameText
                handleRoundTimerBar()
                handleRankPostCount()
                handleNavigation()
                handleMainFrame()
                lottie()
                if(window.innerWidth <= 662){
                    if (roundType == "group-stage"){
                        document.querySelector(".title-content").textContent = "Vòng đấu"
                    }
                    else {
                        document.querySelector(".title-content").textContent = "Chung kết"
                    }
                }
            }    
        }
        xhttp.open("GET", "/?rank=" + rankLink, true)
        xhttp.setRequestHeader('Content-Type', 'application/json')
        xhttp.send()
        if (pushState){
            history.pushState({
                rankAgent: rankAgent
            }, '', 'https://fodance.com' + "?rank=" + rankLink)
        }
        document.querySelector('title').textContent = 'Lingyo | ' + rankName
        statusRedirect = navLink
    }
}

function handleRankHeader(){
    const rankHeader = document.querySelectorAll(".header-rank-but")
    for (let i = 0; i < rankHeader.length; i++){
        rankHeader[i].onclick = function(e){
            rankRedirect(rankHeader[i], true)
        }
    }
}
handleRankHeader()

function handleAddTopic(){
    if (document.querySelector(".submit-add-topic")){
        document.querySelector(".submit-add-topic").onclick = function(){
            if (document.querySelector(".add-topic-input").value.trim().length <= 100){
                let xhttp
                if (window.XMLHttpRequest) {
                    xhttp = new XMLHttpRequest()
                } else {
                    xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                }
                const data = {
                    topic: document.querySelector(".add-topic-input").value
                }
                xhttp.onreadystatechange = function() {    
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        const res = JSON.parse(xhttp.responseText)
                        if (res.status == "add-topic-done"){
                            if (!document.querySelector(".add-topic-success")){
                                document.querySelector(".add-topic-input").value = ''
                                document.querySelector(".total-left").textContent = res.totalLeft
                                document.querySelector(".add-topic-content").insertAdjacentHTML("beforeend", `<span class="add-topic-success theme-color mg-t">Bạn đã thêm một yêu cầu Thể loại mới thành công: ${data.topic}</span>`)
                                document.querySelector(".topic-added").insertAdjacentHTML("beforeend", `<button class="topic-but mg-r">${res.topic}</button>`)
                                setTimeout(function(){
                                    if (document.querySelector(".add-topic-success")){document.querySelector(".add-topic-success").remove()}
                                }, 5000)
                            }
                        }
                        else {
                            if (!document.querySelector(".add-topic-fail")){
                                document.querySelector(".add-topic-input").value = ''
                                document.querySelector(".add-topic-content").insertAdjacentHTML("beforeend", '<span class="add-topic-fail red-color mg-t">Bạn đã hết số lần thêm Thể loại.</span>')
                                setTimeout(function(){
                                    if (document.querySelector(".add-topic-fail")){document.querySelector(".add-topic-fail").remove()}
                                }, 5000)
                            }
                        }
                    }
                }
                xhttp.open("POST", "/add-topic-request", true)
                xhttp.setRequestHeader('Content-Type', 'application/json')
                xhttp.send(JSON.stringify(data))
            }
            else {
                showAlert("Thể loại không vượt quá 100 kí tự!")
            }
        }

        document.querySelector(".del-all-topic").onclick = function(){
            let xhttp
            if (window.XMLHttpRequest) {
                xhttp = new XMLHttpRequest()
            } else {
                xhttp = new ActiveXObject("Microsoft.XMLHTTP")
            }
            xhttp.onreadystatechange = function() {    
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    document.querySelector(".topic-added").innerHTML = ''               
                    document.querySelector(".total-left").textContent = 5       
                }
            }
            xhttp.open("POST", "/remove-topic-request", true)
            xhttp.setRequestHeader('Content-Type', 'application/json')
            xhttp.send()
        }
    }
}
handleAddTopic()

function handleRankPostCount(){
    let xhttp
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest()
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP")
    }
    if (!rankLink){rankLink = 'primary'}
    const data = {
        rank: rankLink,
        cate: cateLink
    }
    xhttp.onreadystatechange = function() {    
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            const res = JSON.parse(xhttp.responseText)
            if (document.querySelectorAll(".cate-post-count").length != 0){
                const postCateCountEle = document.querySelectorAll(".cate-post-count")
                for (let i = 0; i < res.postCateCountList.length; i++){
                    if (res.postCateCountList[i] != 0){
                        postCateCountEle[i].textContent = res.postCateCountList[i] 
                        postCateCountEle[i].classList.add("cate-post-count-pd")
                    }
                    else {
                        postCateCountEle[i].textContent = ''
                        postCateCountEle[i].classList.remove("cate-post-count-pd")
                    }
                }
            }

            if (document.querySelectorAll(".rank-post-count").length != 0){
                const postRankCountEle = document.querySelectorAll(".rank-post-count")
                // if (cateLink != 'competition'){
                    for (let i = 0; i < res.postRankCountList.length; i++){
                        if (res.postRankCountList[i] != 0){
                            postRankCountEle[i].textContent = res.postRankCountList[i] 
                            postRankCountEle[i].classList.add("rank-post-count-pd")
                        }
                        else {
                            postRankCountEle[i].textContent = ''
                            postRankCountEle[i].classList.remove("rank-post-count-pd")
                        }
                    }
                // }
                // else {
                //     for (let i = 0; i < postRankCountEle.length; i++){
                //         postRankCountEle[i].textContent = ''
                //         postRankCountEle[i].classList.remove("rank-post-count-pd")
                //     }
                // }
            }
        }
    }
    xhttp.open("POST", "/cate-post-count", true)
    xhttp.setRequestHeader('Content-Type', 'application/json')
    xhttp.send(JSON.stringify(data))
}
handleRankPostCount()

function handleRefreshTask(){
    function listening(){
        let xhttp
        if (window.XMLHttpRequest) {
            xhttp = new XMLHttpRequest()
        } else {
            xhttp = new ActiveXObject("Microsoft.XMLHTTP")
        }
        let currentView = false
        if (document.querySelector(".notifications-but") && document.querySelector(".notifications-but").classList.contains("active")){currentView = true}
        const data = {
            currentView: currentView
        }
        xhttp.onreadystatechange = function() {    
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                const res = JSON.parse(xhttp.responseText)
                if (res.total > 0){
                    if (!document.querySelector(".unread-notifications")){
                        document.querySelector(".notifications-but").insertAdjacentHTML("beforeend", `<span class="unread-notifications">${res.total}</span>`)
                    }
                    else {
                        document.querySelector(".unread-notifications").textContent = res.total
                    }
                    if (currentView){
                        setTimeout(function(){
                            document.querySelector(".unread-notifications").remove()     
                        }, 1000)
                        for (let i = 0; i < res.notifications.length; i++){
                            if (res.notifications[i].type == "follow"){
                                document.querySelector(".notifications-inner").insertAdjacentHTML("afterbegin", `
                                <div class="notification-item unread-notification-bg border-b">
                                    <div class="d-flex-start pd">
                                        <div class="d-flex">
                                            <a class="avt nav-red" nav-data='personal' data-user-df="${res.notificationProfile[i].nickname}">
                                            ${(()=>{if (res.notificationProfile[i].avatar.includes("http")) {return `
                                            <img src="${res.notificationProfile[i].avatar}" class="user-avt" username="${res.notificationName[i]}">
                                            `}
                                            else {return `
                                            <img src="https://cdn.fodance.com/fd-media/${res.notificationProfile[i].avatar}" class="user-avt" username="${res.notificationName[i]}">
                                            `}
                                            })()}
                                            </a>
                                            <div class="d-flex-col-start">
                                                <a class="avt"><span class="avt-username user-username">${res.notificationName[i]}</span></a>
                                                <a class="avt">
                                                    <span class="post-time nickname-content">
                                                        @${res.notificationProfile[i].nickname}
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                        <span class="mg-l-lg">đã theo dõi bạn.</span>
                                    </div>
                                    <div class="time-noti">
                                    ${(() => {if ((Date.now() - Date.parse(res.notifications[i].time))/1000 < 5) {return `<span class="theme-color">Vừa xong</span>`} else if((Date.now() - Date.parse(res.notifications[i].time))/1000 > 5 && (Date.now() - Date.parse(res.notifications[i].time))/1000 < 60) {return `<span class="theme-color">${Math.floor((Date.now() - Date.parse(res.notifications[i].time))/1000)} giây trước</span>`} else if ((Date.now() - Date.parse(res.notifications[i].time))/1000/60 >= 1 && (Date.now() - Date.parse(res.notifications[i].time))/1000/60 < 60){return `<span class="theme-color">${Math.floor((Date.now() - Date.parse(res.notifications[i].time))/1000/60)} phút trước</span>`} else if ((Date.now() - Date.parse(res.notifications[i].time))/1000/3600 >= 1 && (Date.now() - Date.parse(res.notifications[i].time))/1000/3600 < 24){return `${Math.floor((Date.now() - Date.parse(res.notifications[i].time))/1000/3600)} giờ trước`} else if ((Date.now() - Date.parse(res.notifications[i].time))/1000/3600/24 >= 1 && (Date.now() - Date.parse(res.notifications[i].time))/1000/3600/24 < 8){return `${Math.floor((Date.now() - Date.parse(res.notifications[i].time))/1000/3600/24)} ngày trước`} else if ((Date.now() - Date.parse(res.notifications[i].time))/1000/3600/24 >= 8) {return `${new Date(res.notifications[i].time).getDate() + " tháng " + (new Date(res.notifications[i].time).getMonth() + 1) + " lúc " + new Date(res.notifications[i].time).getHours() + ':' + new Date(res.notifications[i].time).getMinutes()}`}})()}
                                    </div>
                                </div>
                            `)
                            }
                            else if (res.notifications[i].type == "verify-user"){
                                document.querySelector(".notifications-inner").insertAdjacentHTML("afterbegin", `
                                <div class="notification-item nav-red <% if (!read[i]) { %>unread-notification-bg<% } %> <% if (i < notifications.length - 1) { %>border-b<% } %>" nav-data="personal" data-user-df="${res.notificationProfile[i].nickname}">
                                <div class="d-flex-col-start">
                                    <div class="d-flex-start">
                                        <div class="d-flex">
                                            <a class="avt">
                                            ${(()=>{if (res.notificationProfile[i].avatar.includes("http")) {return `
                                            <img src="${res.notificationProfile[i].avatar}" class="user-avt" username="${res.notificationName[i]}">
                                            `}
                                            else {return `
                                            <img src="https://cdn.fodance.com/fd-media/${res.notificationProfile[i].avatar}" class="user-avt" username="${res.notificationName[i]}">
                                            `}
                                            })()}
                                        </a>
                                        </div>
                                        <div class="d-flex-col-start">
                                            ${(()=>{if (res.notifications[i].postInfo[1] == "false") {return `
                                            <div class="noselect"><span>Xác thực tài khoản không thành công! Hãy thử lại và đảm bảo thông tin bạn gửi đi là chính xác và trùng khớp.</span></div>
                                            `}
                                            else {return `
                                            <div class="noselect"><span>Bạn đã xác thực tài khoản thành công! Bạn sẽ nhận được 1 huy hiệu xác nhận bên cạnh tên của bạn, cảm ơn bạn đã tham gia xác thực tài khoản.</span>
                                                </div>
                                            `}
                                            })()}
                                        </div>
                                    </div>
                                </div>
                                <div class="time-noti">
                                    ${(() => {if ((Date.now() - Date.parse(res.notifications[i].time))/1000 < 5) {return `<span class="theme-color">Vừa xong</span>`} else if((Date.now() - Date.parse(res.notifications[i].time))/1000 > 5 && (Date.now() - Date.parse(res.notifications[i].time))/1000 < 60) {return `<span class="theme-color">${Math.floor((Date.now() - Date.parse(res.notifications[i].time))/1000)} giây trước</span>`} else if ((Date.now() - Date.parse(res.notifications[i].time))/1000/60 >= 1 && (Date.now() - Date.parse(res.notifications[i].time))/1000/60 < 60){return `<span class="theme-color">${Math.floor((Date.now() - Date.parse(res.notifications[i].time))/1000/60)} phút trước</span>`} else if ((Date.now() - Date.parse(res.notifications[i].time))/1000/3600 >= 1 && (Date.now() - Date.parse(res.notifications[i].time))/1000/3600 < 24){return `${Math.floor((Date.now() - Date.parse(res.notifications[i].time))/1000/3600)} giờ trước`} else if ((Date.now() - Date.parse(res.notifications[i].time))/1000/3600/24 >= 1 && (Date.now() - Date.parse(res.notifications[i].time))/1000/3600/24 < 8){return `${Math.floor((Date.now() - Date.parse(res.notifications[i].time))/1000/3600/24)} ngày trước`} else if ((Date.now() - Date.parse(res.notifications[i].time))/1000/3600/24 >= 8) {return `${new Date(res.notifications[i].time).getDate() + " tháng " + (new Date(res.notifications[i].time).getMonth() + 1) + " lúc " + new Date(res.notifications[i].time).getHours() + ':' + new Date(res.notifications[i].time).getMinutes()}`}})()}
                                </div>
                            </div>`)
                            }
                            else if (res.notifications[i].type == "post"){
                                document.querySelector(".notifications-inner").insertAdjacentHTML("afterbegin", `
                                <div class="notification-item unread-notification-bg border-b nav-red" nav-data='personal' data-user-df="${res.notifications[i].postInfo[0]}>
                                    <div class="d-flex-start">
                                        <div class="d-flex-start">
                                            <div class="d-flex">
                                                <a class="avt">
                                                    ${(()=>{if (res.notificationProfile[i].avatar.includes("http")) {return `
                                                    <img src="${res.notificationProfile[i].avatar}" class="user-avt" username="${res.notificationName[i]}">
                                                    `}
                                                    else {return `
                                                    <img src="https://cdn.fodance.com/fd-media/${res.notificationProfile[i].avatar}" class="user-avt" username="${res.notificationName[i]}">
                                                    `}
                                                    })()}
                                                </a>
                                                <div class="d-flex-col-start">
                                                    <a class="avt"><span class="avt-username user-username">${res.notificationName[i]}</span></a>
                                                    <a class="avt">
                                                        <span class="post-time nickname-content">
                                                            @${res.notificationProfile[i].nickname}
                                                        </span>
                                                    </a>
                                                </div>
                                            </div>
                                            ${(()=>{if (res.notifications[i].postInfo[1]) {return `<div class="mg-l-lg"><span>đã đăng một video mới vào Thể loại <span class="theme-color font-size-lg-1">${res.notifications[i].postInfo[1]}</span> cấp <span class="theme-color font-size-lg-1">${res.notifications[i].postInfo[2]}</span></span></div>`}
                                                else {return `<div class="mg-l-lg"><span>đã đăng một video mới</span></div>`}
                                            })()}
                                        </div>
                                        <div class="mg-t"><span>Click để xem video và bình chọn</span></div>
                                    </div>
                                    <div class="time-noti">
                                    ${(() => {if ((Date.now() - Date.parse(res.notifications[i].time))/1000 < 5) {return `<span class="theme-color">Vừa xong</span>`} else if((Date.now() - Date.parse(res.notifications[i].time))/1000 > 5 && (Date.now() - Date.parse(res.notifications[i].time))/1000 < 60) {return `<span class="theme-color">${Math.floor((Date.now() - Date.parse(res.notifications[i].time))/1000)} giây trước</span>`} else if ((Date.now() - Date.parse(res.notifications[i].time))/1000/60 >= 1 && (Date.now() - Date.parse(res.notifications[i].time))/1000/60 < 60){return `<span class="theme-color">${Math.floor((Date.now() - Date.parse(res.notifications[i].time))/1000/60)} phút trước</span>`} else if ((Date.now() - Date.parse(res.notifications[i].time))/1000/3600 >= 1 && (Date.now() - Date.parse(res.notifications[i].time))/1000/3600 < 24){return `${Math.floor((Date.now() - Date.parse(res.notifications[i].time))/1000/3600)} giờ trước`} else if ((Date.now() - Date.parse(res.notifications[i].time))/1000/3600/24 >= 1 && (Date.now() - Date.parse(res.notifications[i].time))/1000/3600/24 < 8){return `${Math.floor((Date.now() - Date.parse(res.notifications[i].time))/1000/3600/24)} ngày trước`} else if ((Date.now() - Date.parse(res.notifications[i].time))/1000/3600/24 >= 8) {return `${new Date(res.notifications[i].time).getDate() + " tháng " + (new Date(res.notifications[i].time).getMonth() + 1) + " lúc " + new Date(res.notifications[i].time).getHours() + ':' + new Date(res.notifications[i].time).getMinutes()}`}})()}
                                    </div>
                                </div>
                            `)
                            }
                            else if (res.notifications[i].type == "vote"){
                                document.querySelector(".notifications-inner").insertAdjacentHTML("afterbegin", `
                                <div class="notification-item unread-notification-bg border-b nav-red" nav-data='view-post' data-post-df="${res.notifications[i].postInfo[0]}">
                                    <div class="d-flex-start">
                                        <a class="avt nav-red" nav-data='personal' data-user-df="${res.notificationProfile[i].nickname}">
                                        ${(()=>{if (res.notificationProfile[i].avatar.includes("http")) {return `
                                        <img src="${res.notificationProfile[i].avatar}" class="user-avt" username="${res.notificationName[i]}"></a>
                                            `}
                                        else {return `
                                        <img src="https://cdn.fodance.com/fd-media/${res.notificationProfile[i].avatar}" class="user-avt" username="${res.notificationName[i]}"></a>
                                        `}
                                        })()}
                                    </div>
                                    <div class="d-flex-col-start">
                                        <a class="avt"><span class="avt-username user-username">${res.notificationName[i]}</span></a>
                                        <a class="avt">
                                            <span class="post-time nickname-content">
                                                @${res.notificationProfile[i].nickname}
                                            </span>
                                        </a>
                                    </div>
                                        <span class="mg-l">đã có video đạt <span class="theme-color"> ${res.notifications[i].postInfo[1]}</span> lượt bình chọn</span>
                                    </div>
                                    <div class="time-noti">
                                    ${(() => {if ((Date.now() - Date.parse(res.notifications[i].time))/1000 < 5) {return `<span class="theme-color">Vừa xong</span>`} else if((Date.now() - Date.parse(res.notifications[i].time))/1000 > 5 && (Date.now() - Date.parse(res.notifications[i].time))/1000 < 60) {return `<span class="theme-color">${Math.floor((Date.now() - Date.parse(res.notifications[i].time))/1000)} giây trước</span>`} else if ((Date.now() - Date.parse(res.notifications[i].time))/1000/60 >= 1 && (Date.now() - Date.parse(res.notifications[i].time))/1000/60 < 60){return `<span class="theme-color">${Math.floor((Date.now() - Date.parse(res.notifications[i].time))/1000/60)} phút trước</span>`} else if ((Date.now() - Date.parse(res.notifications[i].time))/1000/3600 >= 1 && (Date.now() - Date.parse(res.notifications[i].time))/1000/3600 < 24){return `${Math.floor((Date.now() - Date.parse(res.notifications[i].time))/1000/3600)} giờ trước`} else if ((Date.now() - Date.parse(res.notifications[i].time))/1000/3600/24 >= 1 && (Date.now() - Date.parse(res.notifications[i].time))/1000/3600/24 < 8){return `${Math.floor((Date.now() - Date.parse(res.notifications[i].time))/1000/3600/24)} ngày trước`} else if ((Date.now() - Date.parse(res.notifications[i].time))/1000/3600/24 >= 8) {return `${new Date(res.notifications[i].time).getDate() + " tháng " + (new Date(res.notifications[i].time).getMonth() + 1) + " lúc " + new Date(res.notifications[i].time).getHours() + ':' + new Date(res.notifications[i].time).getMinutes()}`}})()}
                                    </div>
                                </div>`)
                            }
                            else if (res.notifications[i].type == "like"){
                                document.querySelector(".notifications-inner").insertAdjacentHTML("afterbegin", `
                                <div class="notification-item unread-notification-bg border-b nav-red" nav-data='view-post' data-post-df="${res.notifications[i].postInfo[0]}">
                                    <div class="d-flex-start">
                                        <a class="avt">
                                        ${(()=>{if (res.notificationProfile[i].avatar.includes("http")) {return `
                                        <img src="${res.notificationProfile[i].avatar}" class="user-avt" username="${res.notificationName[i]}">
                                        `}
                                        else {return `
                                        <img src="https://cdn.fodance.com/fd-media/${res.notificationProfile[i].avatar}" class="user-avt" username="${res.notificationName[i]}">
                                        `}
                                        })()}
                                        </a>
                                        <div class="d-flex-col-start">
                                            ${(()=>{if (res.notifications[i].postInfo[1] == '1' && res.notifications[i].postInfo[2] != '') {return `<div><b>${res.notificationName}</b> đã bình chọn video của bạn tại Thể loại ${res.notifications[i].postInfo[2]} cấp ${res.notifications[i].postInfo[3]}</div>`} else if (res.notifications[i].postInfo[1] == '1' && !res.notifications[i].postInfo[2] == '') {return `<div><b>${res.notificationName}</b> đã bình chọn video của bạn</div>`} else if (res.notifications[i].postInfo[1] != '1' && res.notifications[i].postInfo[2] != '') {return `<div><b>${res.notificationName}</b> và ${res.notifications[i].postInfo[1] - 1} người khác đã bình chọn video của bạn tại Thể loại ${res.notifications[i].postInfo[2]} cấp ${res.notifications[i].postInfo[3]}</div>`} else if (res.notifications[i].postInfo[1] != '1' && res.notifications[i].postInfo[2] == '') {return `<div><b>${res.notificationName}</b> và ${res.notifications[i].postInfo[1] - 1} người khác đã bình chọn video của bạn</div>`}})()}
                                        </div>
                                    </div>
                                    <div class="time-noti">
                                    ${(() => {if ((Date.now() - Date.parse(res.notifications[i].time))/1000 < 5) {return `<span class="theme-color">Vừa xong</span>`} else if((Date.now() - Date.parse(res.notifications[i].time))/1000 > 5 && (Date.now() - Date.parse(res.notifications[i].time))/1000 < 60) {return `<span class="theme-color">${Math.floor((Date.now() - Date.parse(res.notifications[i].time))/1000)} giây trước</span>`} else if ((Date.now() - Date.parse(res.notifications[i].time))/1000/60 >= 1 && (Date.now() - Date.parse(res.notifications[i].time))/1000/60 < 60){return `<span class="theme-color">${Math.floor((Date.now() - Date.parse(res.notifications[i].time))/1000/60)} phút trước</span>`} else if ((Date.now() - Date.parse(res.notifications[i].time))/1000/3600 >= 1 && (Date.now() - Date.parse(res.notifications[i].time))/1000/3600 < 24){return `${Math.floor((Date.now() - Date.parse(res.notifications[i].time))/1000/3600)} giờ trước`} else if ((Date.now() - Date.parse(res.notifications[i].time))/1000/3600/24 >= 1 && (Date.now() - Date.parse(res.notifications[i].time))/1000/3600/24 < 8){return `${Math.floor((Date.now() - Date.parse(res.notifications[i].time))/1000/3600/24)} ngày trước`} else if ((Date.now() - Date.parse(res.notifications[i].time))/1000/3600/24 >= 8) {return `${new Date(res.notifications[i].time).getDate() + " tháng " + (new Date(res.notifications[i].time).getMonth() + 1) + " lúc " + new Date(res.notifications[i].time).getHours() + ':' + new Date(res.notifications[i].time).getMinutes()}`}})()}
                                    </div>
                                </div>`)
                            }
                            else if (res.notifications[i].type == "comment"){
                                document.querySelector(".notifications-inner").insertAdjacentHTML("afterbegin", `
                                <div class="notification-item unread-notification-bg border-b nav-red" nav-data='view-post' data-post-df="${res.notifications[i].postInfo[0]}" data-cmt-df="${res.notifications[i].postInfo[1]}">
                                    <div class="d-flex-start">
                                        <a class="avt">
                                        ${(()=>{if (res.notificationProfile[i].avatar.includes("http")) {return `
                                        <img src="${res.notificationProfile[i].avatar}" class="user-avt" username="${res.notificationName[i]}">
                                        `}
                                        else {return `
                                        <img src="https://cdn.fodance.com/fd-media/${res.notificationProfile[i].avatar}" class="user-avt" username="${res.notificationName[i]}">
                                        `}
                                        })()}
                                        </a>
                                        <div class="d-flex-col-start">
                                            ${(()=>{if (res.notifications[i].postInfo[4] == '0' && res.notifications[i].postInfo[2] != '') {return `<div><b>${res.notificationName}</b> đã bình luận về video của bạn tại Thể loại ${res.notifications[i].postInfo[2]} cấp ${res.notifications[i].postInfo[3]}</div>`} else if (res.notifications[i].postInfo[4] == '0' && !res.notifications[i].postInfo[2] == '') {return `<div><b>${res.notificationName}</b> đã bình luận về video của bạn</div>`} else if (res.notifications[i].postInfo[4] != '0' && res.notifications[i].postInfo[2] != '') {return `<div><b>${res.notificationName}</b> và ${res.notifications[i].postInfo[4]} người khác đã bình luận về video của bạn tại Thể loại ${res.notifications[i].postInfo[2]} cấp ${res.notifications[i].postInfo[3]}</div>`} else if (res.notifications[i].postInfo[4] != '0' && res.notifications[i].postInfo[2] == '') {return `<div><b>${res.notificationName}</b> và ${res.notifications[i].postInfo[4]} người khác đã bình luận về video của bạn</div>`}})()}
                                        </div>
                                    </div>
                                    <div class="time-noti">
                                        ${(() => {if ((Date.now() - Date.parse(res.notifications[i].time))/1000 < 5) {return `<span class="theme-color">Vừa xong</span>`} else if((Date.now() - Date.parse(res.notifications[i].time))/1000 > 5 && (Date.now() - Date.parse(res.notifications[i].time))/1000 < 60) {return `<span class="theme-color">${Math.floor((Date.now() - Date.parse(res.notifications[i].time))/1000)} giây trước</span>`} else if ((Date.now() - Date.parse(res.notifications[i].time))/1000/60 >= 1 && (Date.now() - Date.parse(res.notifications[i].time))/1000/60 < 60){return `<span class="theme-color">${Math.floor((Date.now() - Date.parse(res.notifications[i].time))/1000/60)} phút trước</span>`} else if ((Date.now() - Date.parse(res.notifications[i].time))/1000/3600 >= 1 && (Date.now() - Date.parse(res.notifications[i].time))/1000/3600 < 24){return `${Math.floor((Date.now() - Date.parse(res.notifications[i].time))/1000/3600)} giờ trước`} else if ((Date.now() - Date.parse(res.notifications[i].time))/1000/3600/24 >= 1 && (Date.now() - Date.parse(res.notifications[i].time))/1000/3600/24 < 8){return `${Math.floor((Date.now() - Date.parse(res.notifications[i].time))/1000/3600/24)} ngày trước`} else if ((Date.now() - Date.parse(res.notifications[i].time))/1000/3600/24 >= 8) {return `${new Date(res.notifications[i].time).getDate() + " tháng " + (new Date(res.notifications[i].time).getMonth() + 1) + " lúc " + new Date(res.notifications[i].time).getHours() + ':' + new Date(res.notifications[i].time).getMinutes()}`}})()}
                                    </div>
                                </div>`)
                            }
                        }
                        handleNavigation()
                        document.querySelectorAll(".post-create-down").forEach(function(e){
                            e.onanimationend = function() {
                                e.classList.remove("post-create-down")
                            }
                        })
                    }
                }
            }
        }
        xhttp.open("POST", "/listening-task", true)
        xhttp.setRequestHeader('Content-Type', 'application/json')
        xhttp.send(JSON.stringify(data))
    }
    listening()

    setInterval(function(){
        listening()
    }, 30000)
}
handleRefreshTask()

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

function handleRoundTimerBar(){
    const startTimeline = new Date("Mon Dec 28 2020 00:00:00")
    round = Math.floor((Date.now() - startTimeline)/1000/60/60/24/7)
    const timeline = Date.parse(startTimeline) + round*7*24*60*60*1000
    if (document.querySelector(".home-round-timer")){
        var i = 0;
        function countTimerLeft() {
            if (i == 0) {
                i = 1;
                const elem = document.querySelector(".timer-bar");
                const walking = document.querySelector(".walking-lottie");
                const valueText = document.querySelector(".timer-bar-value");
                elem.innerHTML = `
                <div class="fire-ele"></div>
                <div class="fire-ele"></div>
                <div class="fire-ele"></div>
                <div class="fire-ele"></div>
                <div class="fire-ele"></div>
                <div class="fire-ele"></div>
                <div class="fire-ele"></div>`
                const fires = document.querySelectorAll(".fire-ele");
                var id = setInterval(frame, 1000);
                if (roundType == "group-stage"){roundDay = 5, roundLeft = 5} else {roundDay = 7, roundLeft = 2}
                function frame() {
                    const timeLeft = roundDay*24*60*60 - Math.floor((Date.now() - timeline)/1000)
                    if (timeLeft <= 0) {
                        clearInterval(id);
                        i = 0;
                    } else {
                        const percentTimeLeft = Math.floor(((roundLeft*24*60*60 - timeLeft)/(roundLeft*24*60*60)) * 100)
                        elem.style.width = percentTimeLeft + "%";
                        walking.style.marginLeft = percentTimeLeft-1.5 + "%";
                        fires.forEach(function(e){
                            e.style.marginLeft = elem.clientWidth + "px"
                        })
                        if (valueText) {
                            valueText.textContent = (roundDay - 1 - Math.floor((Date.now() - timeline)/1000/60/60/24)) + " ngày, " + (23 - Math.floor((Date.now() - timeline)/1000/60/60 % 24)) + " giờ, " + (59 - Math.floor((Date.now() - timeline)/1000/60 % 60)) + " phút, " + (59 - Math.floor((Date.now() - timeline)/1000 % 60)) + " giây"
                        }
                    }
                }
                frame()
            }
        }
        countTimerLeft()
    }
}
handleRoundTimerBar()

function handleMainInfo(){
    function handleVoteRound() {
        const startTimeline = new Date("Mon Dec 28 2020 00:00:00")
        round = Math.floor((Date.now() - startTimeline)/1000/60/60/24/7)
        const timeline = Date.parse(startTimeline) + round*7*24*60*60*1000
        if (document.querySelector(".vote-round")){
            document.querySelector(".vote-round-title-text").textContent = `Vòng ${round + 1}`
            function showTimer(){
                if (document.querySelector(".vote-round-timer")) {
                    document.querySelector(".vote-round-timer").textContent = (6 - Math.floor((Date.now() - timeline)/1000/60/60/24)) + " ngày, " + (23 - Math.floor((Date.now() - timeline)/1000/60/60 % 24)) + " giờ, " + (59 - Math.floor((Date.now() - timeline)/1000/60 % 60)) + " phút, " + (59 - Math.floor((Date.now() - timeline)/1000 % 60)) + " giây"
                }
            }
            showTimer()
            setInterval(function(){ 
                if (document.querySelector(".vote-round")){
                    showTimer()
                    const newRound = Math.floor((Date.now()- startTimeline)/1000/60/60/24/7) + 1
                    if (newRound > round){
                        round = newRound
                    }
                }
            }, 1000)
        }
    }
    handleVoteRound()

    function getSuggestion(){
        if (document.querySelector(".follow-suggestion-content")){
            let xhttp
            if (window.XMLHttpRequest) {
                xhttp = new XMLHttpRequest()
            } else {
                xhttp = new ActiveXObject("Microsoft.XMLHTTP")
            }
            document.querySelector(".follow-suggestion-content").innerHTML = '<div class="loading-frame d-flex"><span class="iconify spin loading-icon" data-icon="ant-design:loading-3-quarters-outlined" data-inline="false"></span></div>'
            xhttp.onreadystatechange = function() {    
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    const res = JSON.parse(xhttp.responseText)
                    if (document.querySelector(".loading-frame")){
                        document.querySelector(".loading-frame").remove()
                    }
                    if (document.querySelector(".follow-suggestion-content")){
                        document.querySelector(".follow-suggestion-content").innerHTML = ''
                        if (res.topSuggestion.length == 0){
                            document.querySelector(".follow-suggestion-content").innerHTML = '<div class="mg-t"><span class="pd-l">Oops! Không có ai ở đây!</span></div>'
                        }
                        else {
                            for (let i = 0; i < res.topSuggestion.length; i++){
                                document.querySelector(".follow-suggestion-content").insertAdjacentHTML('beforeend', `<div class="follow-hint"><a class="avt none-deco d-flex d-flex-start nav-red" nav-data='personal' data-user-df="${res.profileSuggestion[i].nickname}">
                                ${(()=>{if (res.profileSuggestion[i].avatar.includes("http")) {return `
                                <img src="${res.profileSuggestion[i].avatar}">                            
                                `}
                                else {return `
                                <img src="https://cdn.fodance.com/fd-media/${res.profileSuggestion[i].avatar}">                            
                                `}})()}<div class="d-flex-col-start"><div class="d-flex"><span class="avt-username" data-user-df="${res.profileSuggestion[i].nickname}">${res.userSuggestion[i]}</span>${(()=>{if(res.profileSuggestion[i].auth){return '<span class="iconify mg-l-sm mg-t-sm theme-color verified" data-icon="ic:round-verified"></span>'}else{return ''}})()}</div><span class="avt-nickname">${res.profileSuggestion[i].nickname}</span></div></a><button class="follow-but" data-following="false"><span class="follow-text">Theo dõi</span></button></div>`)
                            }   
                            replaceLinkName()
                            handleNavigation()
                            document.querySelectorAll(".follow-but").forEach(function(e){
                                if (e.parentNode.querySelector(".avt-username")){
                                    handleFollow(e, e.parentNode, e.parentNode.querySelector(".avt-username").textContent)
                                }
                                else if (e.parentNode.parentNode.querySelector(".avatar-username")){
                                    handleFollow(e, e.parentNode.parentNode, e.parentNode.parentNode.querySelector(".avatar-username").textContent)
                                }
                            })
                        }
                    }
                }
            }
            xhttp.open("POST", "/top-suggestion", true)
            xhttp.setRequestHeader('Content-Type', 'application/json')
            xhttp.send()
        }
    }
    getSuggestion()

    function handleGallery(){
        if (document.querySelector(".gallery-highlights")){
            var slideIndex, slides, dots, captionText
            let xhttp
            if (window.XMLHttpRequest) {
                xhttp = new XMLHttpRequest()
            } else {
                xhttp = new ActiveXObject("Microsoft.XMLHTTP")
            }
            let holder
            let pathIdx = 0, cateIdx = 1
            xhttp.onreadystatechange = function() {    
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    const res = JSON.parse(xhttp.responseText)
                    if (res.status == "done"){
                        function initVideoPlayerHolder(){
                            for (let i = 0; i < res.posts.length; i++){
                                if (document.querySelectorAll(".img-holder").length == 0){
                                    document.querySelector(".gallery-container").insertAdjacentHTML("beforeend", `<div class="img-holder"><div class="player-holder"><span class="iconify img-holder-play-but" data-icon="ant-design:play-circle-twotone" data-inline="false"></span></div><video><source></video><span class="caption-text">Top 1</span></div>`)
                                    if (i == 0) {document.querySelector(".img-holder").classList.add("init-holder")}
                                    cateIdx ++
                                    holder = document.querySelectorAll(".img-holder")
                                }
                            }
                            if (holder){
                                for (let i = 0; i < holder.length; i++){
                                    if (res.posts[pathIdx].file){
                                        holder[i].querySelector('source').setAttribute('src', res.posts[pathIdx].file.path[0])
                                    }
                                    pathIdx ++
                                    holder[i].querySelector('video').load()
                                    holder[i].onclick = function(){
                                        holder[i].querySelector(".player-holder").insertAdjacentHTML("afterend", '<div class="dblclick-notify">Double click!</div>') 
                                        setTimeout(function(){
                                            holder[i].querySelector(".dblclick-notify").remove()
                                        }, 500)
                                    }
                                    holder[i].ondblclick = function(){
                                        if (document.querySelectorAll(".player-holder-modal").length == 0){
                                            document.querySelector(".main-info").style.zIndex = 5000
                                            holder[i].insertAdjacentHTML("afterend", `<div class='modal player-holder-modal'><div class='modal-content player-holder-modal-content d-flex-col'><h2 class='d-flex'>${holder[i].querySelector(".caption-text").textContent}</h2><div class="player-video-wrapper"><video class="player player-video-modal">${holder[i].querySelector("video").innerHTML}</div><h3 class="d-flex mg-t"><a class="theme-color">Xem bài viết</a></h3></div></div></div>`)
                                            Plyr.setup('video.player')
                                            const playPromise = document.querySelector(".player-video-modal").play()
                                            if (playPromise !== undefined) {
                                                playPromise.then(_ => {
                                                })
                                                .catch(error => {
                                                })
                                            }
                                            const modal = document.querySelector(".player-holder-modal")
                                            window.onclick = function(event) {
                                                if (event.target == modal) {
                                                    modal.remove()
                                                    document.querySelector(".main-info").style.zIndex = 1500
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        initVideoPlayerHolder()

                        function initGallery() {
                            slideIndex = 0
                            if (document.querySelectorAll(".img-holder").length != 0){
                                slides = document.querySelectorAll(".img-holder")
                                slides[slideIndex].style.opacity = 1
                        
                                captionText = document.querySelector(".caption-text-holder")
                                captionText.textContent = slides[slideIndex].querySelector(".caption-text").innerText
                            
                                if (document.querySelectorAll(".dots-container dots").length == 0){
                                    dots = []
                                    let dotsContainer = document.querySelector(".dots-container")
                                    for(let i = 0; i < slides.length; i++){
                                        let dot = document.createElement("span")
                                        dot.classList.add("dots")
                                        dotsContainer.append(dot)
                                        dots.push(dot)
                                    }
                                    dots[slideIndex].classList.add("active")
                                }  
                            }    
                        }
                        initGallery()

                        function handleSlide(){
                            document.querySelectorAll(".dots").forEach(function (dot, i) {
                                dot.onclick = function () {
                                    moveSlide(i)
                                }
                            })
                    
                            const gallery = document.querySelector('.gallery-container')
                            let isDown = false, startX = walk = 0
                            gallery.addEventListener('mousedown', (e) => {
                                walk = 0
                                isDown = true
                                startX = e.pageX
                                scrollLeft = gallery.scrollLeft
                            })
                            gallery.addEventListener('mouseleave', () => {
                                isDown = true
                            })
                            gallery.addEventListener('mousemove', (e) => {
                                if(!isDown) return
                                e.preventDefault()
                                const x = e.pageX
                                walk = (startX - x) * 1
                            })
                            gallery.addEventListener('mouseup', () => {
                                if (walk >= 50){
                                    moveSlide(slideIndex + 1)
                                }
                                if (walk <= -50) {
                                    moveSlide(slideIndex - 1)
                                }
                            })
                        }
                        handleSlide()

                        function moveSlide(n) {
                            let i, current, next
                            let moveSlideAniClass = {
                                forCurrent: "",
                                forNext: ""
                            }
                            let slideTextAniClass = "slide-text-from-top"
                            if (n > slideIndex) {
                                if (n >= slides.length) {n = 0}
                                moveSlideAniClass.forCurrent = "move-left-current-slide"
                                moveSlideAniClass.forNext = "move-left-next-slide"
                            } else if(n < slideIndex){
                                if (n < 0) {n = slides.length - 1}
                                moveSlideAniClass.forCurrent = "move-right-current-slide"
                                moveSlideAniClass.forNext = "move-right-next-slide"
                            }
                        
                            if (n != slideIndex) {
                                next = slides[n]
                                current =  slides[slideIndex]
                                for (i = 0; i < slides.length; i++) {
                                    slides[i].className = "img-holder"
                                    slides[i].style.opacity = 0
                                    slides[i].style.zIndex = 0
                                    dots[i].classList.remove("active")
                                }
                                current.classList.add(moveSlideAniClass.forCurrent)
                                next.style.zIndex = 1000
                                next.classList.add(moveSlideAniClass.forNext)
                                dots[n].classList.add("active")
                                slideIndex = n
                            }
                            captionText.style.display = "none"
                            captionText.className = "caption-text-holder " + slideTextAniClass
                            captionText.textContent = slides[n].querySelector(".caption-text").innerText
                            captionText.style.display = "block"
                        }
                    }
                }
            }
            xhttp.open("POST", "/top-video-holder", true)
            xhttp.setRequestHeader('Content-Type', 'application/json')
            xhttp.send()
        }
    }
    handleGallery()    
}
handleMainInfo()

//handle Category
function categoryRedirect(cate, pushState){
    let xhttp
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest()
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP")
    }
    const cateAgent = cate.outerHTML
    stopScrollPage = 0
    cateSort = "rank-sort-content"
    filter = "current"
    if (!pushState){rankLink = "primary"}
    if (document.querySelector(".all-filter") && document.querySelector(".all-filter").classList.contains("theme-color")){
        document.querySelector(".all-filter").classList.remove("theme-color")
    }     
    if (document.querySelector(".all-filter") && !document.querySelector(".current-filter").classList.contains("theme-color")){
        document.querySelector(".current-filter").classList.add("theme-color")
    }
    const category = document.querySelectorAll('.category-but')
    for (let i = 0; i < category.length; i++){
        category[i].classList.remove("active")
        if (cate.getAttribute("topic-data") == category[i].getAttribute("topic-data")){
            category[i].classList.add("active")
        }
    }
    cateLink = cate.getAttribute("topic-data")
    cateName = cate.querySelector(".category-item-name").textContent
    if (roundType == "final") {cateLink = 'competition'}
    const rankButs = document.querySelectorAll(".header-rank-but")
    for (let i = 0; i < rankButs.length; i++){
        if (rankButs[i].getAttribute("rank-data") == rankLink){
            rankButs[i].classList.add("header-rank-but-active")
        }
        else {
            rankButs[i].classList.remove("header-rank-but-active")
        }
    }
    window.scrollTo(0, 0)
    if (document.querySelectorAll(".post-frame").length != 0){
        document.querySelector(".post-frame").innerHTML = '<div class="loading-post"><div class="d-flex-start loading-content"><div class="loading-post-circle mg-r"></div><div class="d-flex-col-start-content width-80"><div class="loading-post-line width-30 mg-b-sm"></div><div class="loading-post-line width-20"></div></div></div><div class="loading-post-line width-90 mg-b-sm"></div></div></div>'
    }
    handleRankHeader()
    if (document.querySelector(".nav-red")){
        document.querySelectorAll(".nav-red").forEach(function(e){
            e.classList.remove("active")
        })
        document.querySelector(".nav-item.nav-red[nav-data='competition']").classList.add("active")
    }
    if (document.querySelector(".frame-post-home")){
        competitionContentText = document.querySelector(".main-frame").innerHTML
    }
    xhttp.onreadystatechange = function() {  
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            const parser = new DOMParser()
            const page = parser.parseFromString(xhttp.responseText, 'text/html')
            const contentText = page.querySelector(".post-frame").innerHTML
            competitionContentText = page.querySelector(".main-frame").innerHTML
            if (document.querySelectorAll(".post-frame").length != 0){
                document.querySelector(".post-frame").innerHTML = contentText
            }
            else {
                document.querySelector(".main-frame").innerHTML = competitionContentText
            }
            if (document.querySelector(".main-info-inner") && document.querySelector(".main-info-inner").classList.contains("info-personal")) {
                const mainInfo = page.querySelector(".main-info")
                const mainInfoText = mainInfo.innerHTML
                document.querySelector(".main-info").innerHTML = mainInfoText
                handleMainInfo()
            }

            const currentCate = window.location.pathname.replace('/', '')
            if (currentCate != '' && (cateList.includes(currentCate) || cateLink == 'competition')){
                if (document.querySelectorAll(".category-but").length != 0){
                    document.querySelector(".category-but[topic-data='" + cateLink + "'").scrollIntoView({block: "end", inline: "center"})
                    scrollRange = document.querySelector('.category-slidebar').scrollLeft
                }
            }

            if (document.querySelectorAll(".category-slidebar").length != 0){
                document.querySelector('.category-slidebar').scrollLeft = scrollRange
            }
            const sortEle = document.querySelectorAll(".sort-content-but")
            for (let i = 0; i < sortEle.length; i++){
                if (i==0 && cateLink != 'competition'){sortEle[i].classList.add("sort-content-but-active")}
                else {sortEle[i].classList.remove("sort-content-but-active")}
            }
            rankIndex = 5
            statusRedirect = cateLink
            if (document.querySelectorAll(".post").length != 0){
                const posts = document.querySelectorAll(".post")
                postDisplayedList = []
                param = ''
                for (let i = 0; i < posts.length; i++){
                    if (posts[i].getAttribute("data-post-df")){
                        postDisplayedList.push(posts[i].getAttribute("data-post-df"))
                    }
                }
            }
            handleMainFrame()     
            handleNavigation()
            handleRankPostCount()
        }
    }
    if (pushState){
        // if (cateLink != 'competition'){
            history.pushState({
                cateAgent: cateAgent,
            }, '', 'https://fodance.com/' + cateLink + '?rank=' + rankLink )
            document.querySelector('title').textContent = 'Lingyo | ' + cateName + ' - ' + rankName
        // }
        // else {
        //     history.pushState({
        //         cateAgent: cateAgent,
        //     }, '', 'https://fodance.com/competition')
        //     document.querySelector('title').textContent = 'Lingyo | Vòng đấu'
        // }
    }
    xhttp.open("GET", '/' + cateLink + '?rank=' + rankLink , true)
    xhttp.setRequestHeader('Content-Type', 'application/json')
    xhttp.send()
}

function createPostRedirect(c, pushState){
    let isMobile = false
    if (document.querySelector(".left-nav")){
        document.querySelector(".left-nav").style.zIndex = 10000
    }
    if (document.querySelector(".header")){
        document.querySelector(".header").style.zIndex = 1000
    }
    if (window.innerWidth <= 662){
        isMobile = true
    }
    document.querySelectorAll(".create-post-handler")[document.querySelectorAll(".create-post-handler").length - 1].innerHTML = `<div class='modal create-post-modal'>
        <form action='/' method='POST' enctype='multipart/form-data' class='modal-content create-post-modal-content'>
            <div class='group-title d-flex border-b'>
            ${(()=>{if (c.getAttribute("data-create-but") == "layout") {return '<span>Tạo bài viết</span>'} else {if (cateLink == '') {return `<span>Tạo video</span>`} else {return `<span>Tạo ${cateName}</span>`}}})()}
            ${(()=>{if (isMobile){return `
                <div class="close-post-modal return-but"><span class="iconify" data-icon="heroicons-outline:arrow-left" data-inline="false"></span></div>
            `}
            else {
                return `
                <button class='close close-post-modal' type="button">
                    <span class='iconify dropdown-icon' data-icon='feather:x' data-inline='false'></span>
                </button>
                `
            }
            })()}
            </div>
            <div class='post-user'>
                <div class="post-info">
                    <a class='avt'>
                        <img src="${document.querySelector(".header-avatar").getAttribute("src")}" class="user-avt" username="${document.querySelector(".header-username").textContent}">
                    </a>
                    <div class='avt-info'>
                        <a class='avt nav-red'><span class='post-avt-username avt-username user-username'>${document.querySelector(".header-username").textContent}</span></a>
                        <a class='avt nav-red'><span class='post-time nickname-content'>
                            @${document.querySelector(".header-nickname").getAttribute("data-user-df")}
                        </span></a>
                    </div>
                </div>
            </div>
            <div class='pd create-post-content'>
                <textarea class='create-post-textarea' placeholder='${document.querySelector(".header-username").textContent}, bạn có gì mới?' name="textarea" maxlength="1000"></textarea>                                      
            </div>
            <div class="thumb-content"></div>
            <div class="create-post-topic d-flex">
                ${(()=>{if (cateLink != 'competition' || c.getAttribute("data-create-but") == "layout") {return `
                    <button type="button" class="create-post-rank-but d-flex ${(()=>{if (cateLink != 'competition' && rankLink == "primary" && c.getAttribute("data-create-but") != "layout") {return 'create-post-rank-but-active'}})()}" data-rank-create-post="primary"><span class="mg-r-sm">${(()=>{if (isMobile){return "Sơ"}else {return "Sơ cấp:" }})()}</span><span>0</span><span class="iconify font-icon mg-l-sm red-color" data-icon="foundation:ticket" data-inline="false"></span></button>
                    <button type="button" class="create-post-rank-but d-flex ${(()=>{if (cateLink != 'competition' && rankLink == "intermediate" && c.getAttribute("data-create-but") != "layout") {return 'create-post-rank-but-active'}})()}" data-rank-create-post="intermediate"><span class="mg-r-sm">${(()=>{if (isMobile){return "Trung"}else {return "Trung cấp:" }})()}</span><span>1</span><span class="iconify font-icon mg-l-sm red-color" data-icon="foundation:ticket" data-inline="false"></span></button><button type="button" class="create-post-rank-but d-flex ${(()=>{if (cateLink != 'competition' && rankLink == "highgrade" && c.getAttribute("data-create-but") != "layout") {return 'create-post-rank-but-active'}})()}" data-rank-create-post="highgrade"><span class="mg-r-sm">${(()=>{if (isMobile){return "Cao"}else {return "Cao cấp:" }})()}</span><span>3</span><span class="iconify font-icon mg-l-sm red-color" data-icon="foundation:ticket" data-inline="false"></span></button>
                `} else {
                    return ''
                }})()}
            </div>
            ${(()=>{if (c.getAttribute("data-create-but") == "layout") {return `
            <div class="create-post-category d-flex">
                <button type="button" class="create-post-category-but" data-category-create-post="freestyle">Nhảy tự do</button>
                <button type="button" class="create-post-category-but" data-category-create-post="hiphop">Hiphop</button>
                <button type="button" class="create-post-category-but" data-category-create-post="rap">Rap</button>
                <button type="button" class="create-post-category-but" data-category-create-post="contemporary">Múa đương đại</button>
                <button type="button" class="create-post-category-but" data-category-create-post="ballroom">Khiêu vũ</button>
                <button type="button" class="create-post-category-but" data-category-create-post="modern">Nhảy hiện đại</button>
                <button type="button" class="create-post-category-but" data-category-create-post="ballet">Múa ba lê</button>
                <button type="button" class="create-post-category-but" data-category-create-post="shuffle">Shuffle</button>
                <button type="button" class="create-post-category-but" data-category-create-post="jazz">Jazz</button>
                <button type="button" class="create-post-category-but" data-category-create-post="sexy">Sexy</button>
                <button type="button" class="create-post-category-but" data-category-create-post="flashmob">Fashmob</button>
                <button type="button" class="create-post-category-but" data-category-create-post="other">Khác</button>
                </div>
            `} else {return ''}})()}
            <div class='pd mg-b'>
                <div class='d-flex-sar custom-post mg-b-lg'>
                    <label class="create-post-custom-but upload-label noselect">
                        <input accept="image/jpeg,image/jpg,image/png,image/gif,video/mp4,video/mpv,video/webm,video/wmv,video/plv" type='file' name='files' class="file-upload" multiple>
                        <span class='iconify create-post-icon' data-icon='bi:card-image' data-inline='false'></span><span>Ảnh/Video</span>
                    </label>
                    <label class='create-post-custom-but d-flex create-post-emoji-but emoji-but noselect'><span class='iconify create-post-icon' data-icon='bi:emoji-smile' data-inline='false'></span>Cảm xúc</label>
                </div>
                <button class='submit-but' type='button' data-submit-but="${c.getAttribute("data-create-but")}" disabled>Đăng</button>                                  
            </div>
        </form>
    </div>`

    if (pushState){
        history.pushState({
            createPostModal: c.outerHTML,
        }, '', 'https://fodance.com/create-post')
    }
    const textarea = document.querySelector(".create-post-textarea")
    textarea.oninput = function() {
        textarea.style.height = ""
        textarea.style.height = textarea.scrollHeight + "px"
        if (textarea.scrollHeight >= 180) {
            textarea.style.overflowY = "scroll"
        }
        else {
            textarea.style.overflowY = "hidden"
        }
    }
    const modal = document.querySelector(".create-post-modal")
    document.querySelector(".close-post-modal").onclick = function(){
        cateLinkPost = rankLinkPost = ''
        document.querySelectorAll(".create-post-category-but").forEach(function(e){
            if (e.classList.contains("create-post-category-but-active")){
                e.classList.remove("create-post-category-but-active")
            }
        })
        this.parentNode.parentNode.classList.add("modal-remove-down")
        this.parentNode.parentNode.onanimationend = function () {
            window.history.back()
        }
    }

    const createPostCateBut = document.querySelectorAll(".create-post-category-but")
    const createPostRankBut = document.querySelectorAll(".create-post-rank-but")
    for (let i = 0; i < createPostCateBut.length; i++){
        if (createPostCateBut[i].getAttribute("data-category-create-post") == 'freestyle') {
            createPostCateBut[i].classList.add("create-post-category-but-active")
            createPostRankBut[0].classList.add("create-post-rank-but-active")
            cateLinkPost = "freestyle"
        }
        createPostCateBut[i].onclick = function(){
            if (!this.classList.contains("create-post-category-but-active")){
                for (let i = 0; i < createPostCateBut.length; i++){
                    createPostCateBut[i].classList.remove("create-post-category-but-active")
                }
                let rankActive = false
                for (let i = 0; i < createPostRankBut.length; i++){
                    if (createPostRankBut[i].classList.contains("create-post-rank-but-active")){rankActive = true}
                }
                if (!rankActive){
                    createPostRankBut[0].classList.add("create-post-rank-but-active")
                    rankLinkPost = createPostRankBut[0].getAttribute("data-rank-create-post")
                }
                this.classList.add("create-post-category-but-active")
                cateLinkPost = this.getAttribute("data-category-create-post")
            }
            // else {
            //     this.classList.remove("create-post-category-but-active")
            //     for (let i = 0; i < createPostRankBut.length; i++){
            //         createPostRankBut[i].classList.remove("create-post-rank-but-active")
            //     }
            //     cateLinkPost = ''
            //     rankLinkPost = ''
            // }
        }
    }

    for (let i = 0; i < createPostRankBut.length; i++){
        createPostRankBut[i].onclick = function(){
            let valid = false
            for (let i = 0; i < createPostCateBut.length; i++){
                if (createPostCateBut[i].classList.contains("create-post-category-but-active")){valid = true}
            }
            if (valid || (cateLink != 'competition' && c.getAttribute("data-create-but") == "home")){
                if (!this.classList.contains("create-post-rank-but-active")){
                    for (let i = 0; i < createPostRankBut.length; i++){
                        createPostRankBut[i].classList.remove("create-post-rank-but-active")
                    }
                    this.classList.add("create-post-rank-but-active")
                    rankLinkPost = this.getAttribute("data-rank-create-post")
                }
            }
            else {
                showAlert("Chọn một Thể loại trước khi chọn cấp bậc!")
            }
        }
    }

    if (document.querySelectorAll('.create-post-emoji-but').length != 0){
        const emojiButton = document.querySelector('.create-post-emoji-but')
        emojiButton.addEventListener('click', () => {
            picker.pickerVisible ? picker.hidePicker() : picker.showPicker(emojiButton)
        })    
    }

    let picker = new EmojiButton({
        emojiSize: '1.4em',
        emojiVersion: '12.1',
        position: 'right-end',
        style: 'native',
        zIndex: 2000,
        recentsCount: 16,
        autoHide: true,
        theme: 'light',
        emojisPerRow: '8',
        i18n: {
            search: 'Tìm biểu tượng...',
            categories: {
            recents: 'Biểu tượng vừa sử dụng',
            smileys: 'Mặt cười & Cảm xúc',
            people: 'Người và cơ thể',
            animals: 'Động vật & Thiên nhiên',
            food: 'Đồ ăn & Thức uống',
            activities: 'Hoạt động',
            travel: 'Du lịch & Địa điểm',
            objects: 'Các đối tượng',
            symbols: 'Biểu tượng',
            flags: 'Cờ'
            },
            notFound: 'Không tìm thấy biểu tượng'
        }
    })
    
    picker.on('emoji', emoji => {
        document.querySelector(".create-post-textarea").value += emoji
    })
    
    // toggleInputBut
    if (document.querySelectorAll(".file-upload").length != 0){
        document.querySelector(".file-upload").onclick = function(e){
            e.target.value = ""
        }
    }

    function disableFileInput() {
        event.preventDefault()
    }
    
    if (document.querySelectorAll(".create-post-modal-content").length != 0){
        document.querySelector(".create-post-modal-content").addEventListener('input', function(e){
            if (document.querySelector(".create-post-textarea").value != '') {
                document.querySelector(".submit-but").disabled = false
            }
            else {
                if (document.querySelectorAll(".thumb-preview").length == 0){
                    document.querySelector(".submit-but").disabled = true
                }
            }
        })
    }

    // fileUpload
    let files = fileCounter = fileCate = fileValid = 0, arrayFile = []
    if (document.querySelectorAll(".file-upload").length != 0){
        document.querySelector(".file-upload").onchange = function(evt){
            if (document.querySelectorAll(".thumb-preview").length != 0){
                document.querySelector(".submit-but").disabled = false
            }
            files = evt.target.files
            if (files.length > 4 || fileCounter + files.length > 4) {fileValid = 1}
            for (let i = 0; i < files.length; i++){
                const file = files[i]
                let fileReader = new FileReader();
                fileReader.onloadend = function(e) {
                    let arr = (new Uint8Array(e.target.result)).subarray(0, 4);
                    let header = "";
                    for(let i = 0; i < arr.length; i++) {
                        header += arr[i].toString(16);
                    }
                    const reg = /image\/jpeg|image\/jpg|image\/png|image\/gif|video\/mp4|video\/webm|video\/flv|video\/mov|video\/wmv|video\/avi/gi
                    switch (header) {
                        case "89504e47":
                            type = "image/png";
                            break;
                        case "ffd8ffe0":
                        case "ffd8ffe1":
                        case "ffd8ffe2":
                        case "ffd8ffe3":
                        case "ffd8ffe8":
                        case "ffd8ffdb":
                        case "ffd8ffee":
                            type = "image/jpeg";
                            break;
                        case "47494638":
                            type = "image/gif";
                            break;
                        case "66747970":
                            type = "video/mp4";
                            break;
                        case "1a45dfa3":
                            type = "video/webm";
                            break;
                        case "464c5601":
                            type = "video/flv";
                            break;
                        case "3026b275":
                            type = "video/wmv";
                            break;
                        case "52494646":
                            type = "video/avi";
                            break;
                        default:
                            type = "unknown";
                            break;
                    }
                    if (header[0] == '0' && header[1] == '0' && header[2] == '0' && header[3] != '0') {type = "video/mp4"}
                    if (type.includes("video") && (files.length > 1 || fileCounter > 0)) {fileValid = 1}
                    if ((navLink != 'community') && !type.includes("video")) {fileValid = 1}
                    if (!type.match(reg) || file.size > 209715200) {fileValid = 1}
                    if (fileValid == 0) {
                        for (let i = 0, f; f = files[i]; i++) {
                            arrayFile.push(f)
                            fileCounter ++
                            let ele = document.createElement('div')
                            ele.classList.add("thumb-preview")
                            ele.classList.add(`preview`)
                            let src = URL.createObjectURL(f)
                            if (f.type.match('image.*')) {
                                fileCate = 1
                                ele.innerHTML = `<img class="thumb" src="${src}">
                                <button class='close-thumb close-thumb' type='button'><span class='iconify dropdown-icon' data-icon='feather:x' data-inline='false'></span></button>`
                                document.querySelector(".thumb-content").insertBefore(ele, null)
                            }                   
                            if (f.type.match('video.*')) {
                                fileCate = 2
                                ele.innerHTML = `<video class="thumb player" playsinline controls src="${src}"></video>
                                                <button class='close-thumb close-thumb' type='button'><span class='iconify dropdown-icon' data-icon='feather:x' data-inline='false'></span></button>`
                                if(document.querySelectorAll(".thumb-preview").length == 0) {
                                    document.querySelector(".thumb-content").insertBefore(ele, null)
                                }
                                document.querySelector(".upload-label").style.opacity = 0.6
                                document.querySelector(".file-upload").addEventListener("click", disableFileInput)
                            }
                            document.querySelector(".create-post-content").style.height = "auto"
                        }
                        if (document.querySelectorAll(".close-thumb").length != 0){
                            const thumb = document.querySelectorAll(".close-thumb")
                            for(let i = 0; i < thumb.length; i++){
                                thumb[i].onclick = function() {
                                    fileCounter -= 1
                                    document.querySelector(".file-upload").removeEventListener("click", disableFileInput)
                                    document.querySelector(".upload-label").style.opacity = 1
                                    if(document.querySelectorAll(".thumb-preview").length == 2) {
                                        document.querySelector(".thumb-content").classList.remove("thumb-2-files")
                                    }
                                    if(document.querySelectorAll(".thumb-preview").length == 3) {
                                        document.querySelector(".thumb-content").classList.remove("thumb-3-files")
                                        document.querySelector(".thumb-content").classList.add("thumb-2-files")        
                                    }
                                    if(document.querySelectorAll(".thumb-preview").length == 4) {
                                        document.querySelector(".thumb-content").classList.remove("thumb-4-files")
                                        document.querySelector(".thumb-content").classList.add("thumb-3-files")                           
                                    }
                                    thumb[i].parentNode.remove()
                                    arrayFile[i] = null
                                    if(document.querySelectorAll(".thumb-preview").length == 0){
                                        if (document.querySelector(".create-post-textarea").value == '') {
                                            document.querySelector(".submit-but").disabled = true
                                        }
                                        fileCate = fileCounter = 0
                                        arrayFile = []
                                        document.querySelector(".create-post-content").style.height = "14rem"
                                    }
                                }
                            }
                        }
                        for (let i = 0; i < document.querySelectorAll(".thumb-preview").length; i++){
                            if(document.querySelectorAll(".thumb-preview").length == 2) {
                                document.querySelector(".thumb-content").classList.add("thumb-2-files")
                                document.querySelector(".thumb-content").classList.remove("thumb-3-files")
                                document.querySelector(".thumb-content").classList.remove("thumb-4-files")
                            }
                            if(document.querySelectorAll(".thumb-preview").length == 3) {
                                document.querySelector(".thumb-content").classList.add("thumb-3-files")
                                document.querySelector(".thumb-content").classList.remove("thumb-2-files")
                                        document.querySelector(".thumb-content").classList.remove("thumb-4-files")
                            }
                            if(document.querySelectorAll(".thumb-preview").length == 4) {
                                document.querySelector(".file-upload").addEventListener("click", disableFileInput)
                                document.querySelector(".upload-label").style.opacity = 0.6
                                document.querySelector(".thumb-content").classList.add("thumb-4-files")
                                document.querySelector(".thumb-content").classList.remove("thumb-2-files")
                                document.querySelector(".thumb-content").classList.remove("thumb-3-files")
                            }
                        }
                        if (document.querySelectorAll(".thumb-preview").length != 0){
                            document.querySelector(".submit-but").disabled = false
                        }
                    }
                    else {
                        if (navLink != 'community'&& !type.includes("video")) {
                            showAlert("Hãy chọn 1 video cho thể loại!")
                        }
                        else {
                            showAlert("Hãy chọn tối đa 4 ảnh hoặc 1 video!")
                        }
                        document.querySelector(".submit-but").disabled = true
                        if(document.querySelectorAll(".thumb-preview").length != 0) {
                            document.querySelectorAll(".thumb-preview").forEach(function(e) {
                                e.remove()
                            })
                        }
                        document.querySelector(".thumb-content").classList.remove("thumb-2-files")
                        document.querySelector(".thumb-content").classList.remove("thumb-3-files")
                        document.querySelector(".thumb-content").classList.remove("thumb-4-files")
                        document.querySelector(".file-upload").value = null
                        document.querySelector(".create-post-content").style.height = "14rem"
                        fileCate = fileValid = fileCounter = 0
                        arrayFile = []
                    }
                }
                fileReader.readAsArrayBuffer(files[i]);
            }
        }
    }
    
    if (document.querySelectorAll(".submit-but").length != 0){
        document.querySelector(".submit-but").onclick = function(){
            const postiton = document.querySelector(".submit-but").getAttribute("data-submit-but")
            const description = document.querySelector(".create-post-textarea").value.trim()
            window.history.back()
            if ((description == '' || description.length > 1000) && arrayFile.length == 0) {
                showAlert("Hãy nhập nội dung ngắn cho video!")
            } 
            else if (arrayFile.length == 0 && cateLink != 'community'){
                showAlert("Hãy chọn một video cho Thể loại!")
            }
            else if (arrayFile.length != 0 && !arrayFile[0].type.includes("video") && cateLink != 'community'){
                showAlert("Hãy chọn một video cho Thể loại!")
            }
            else {
                const ticket = parseInt(document.querySelector(".ticket-total").textContent)
                let ticketValid = true
                if (rankLinkPost == "intermediate" && ticket < 1){ticketValid = false}
                if (rankLinkPost == "highgrade" && ticket < 3){ticketValid = false}
                if (ticketValid){
                    let xhttp
                    if (window.XMLHttpRequest) {
                        xhttp = new XMLHttpRequest()
                    } else {
                        xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                    }
                    fileCate = fileCounter = 0
                    showAlert("Video của bạn đang được xử lý!")
                    let formData = new FormData()
                    function createFormData(removePostBuffer){
                        formData.append("fileValid", fileValid)
                        formData.append("description", description)
                        if (postiton == "layout"){
                            formData.append("category", cateLinkPost)
                        }
                        else {
                            formData.append("category", cateLink)
                        }
                        if (navLink != "community"){formData.append("competition", true)}
                        else {formData.append("competition", false)}
                        if (cateLink != 'competition' && postiton == "home" && rankLinkPost == ''){rankLinkPost = rankLink}
                        formData.append("rank", rankLinkPost)
                        for (let i = 0; i < arrayFile.length; i++){
                            formData.append("file", arrayFile[i])
                        }
                        removePostBuffer()
                    }
                    function removePostBuffer(){
                        arrayFile = []
                        cateLinkPost = rankLinkPost = ''
                    }
                    createFormData(removePostBuffer)
                    xhttp.onreadystatechange = function() {
                        if (xhttp.readyState == 4 && xhttp.status == 200) {
                            const res = JSON.parse(xhttp.responseText)
                            const interv = setInterval(function(){
                                if (res.status == "post-created") {
                                    clearInterval(interv)
                                    if ((res.data.category == cateLink && res.data.rank == rankLink) || (cateLink == 'competition')){
                                        if ( document.querySelector(".post-section")){
                                        document.querySelector(".post-section").insertAdjacentHTML("afterbegin", `<div class='post post-create-down' data-post-df=${res.data.post.postId}><div class='post-util'><button class='avt-but header-but dropdown-but util-dropdown-but'><span class='iconify dropdown-icon bg-white' data-icon='vaadin:ellipsis-dots-h' data-inline='false'></span></button><div class='util-dropdown-content dropdown-content'><a class='nav-item save-post'><span class='iconify' data-icon='bi:bookmark-plus' data-inline='false'></span>Lưu bài viết</a><a class="nav-item post-notice"><span class="iconify" data-icon="clarity:bell-outline-badged" data-inline="false"></span>Bật thông báo bình chọn</a><a class="nav-item copy-link-post"><span class="iconify" data-icon="clarity:copy-line" data-inline="false"></span>Sao chép liên kết</a><a class='nav-item del-post'><span class='iconify' data-icon='bx:bx-hide' data-inline='false'></span>Xóa bài viết</a></div></div><div class='post-user'><div class='post-info'><a class='avt nav-red' nav-data='personal' data-user-df="${res.data.profile.nickname}">${(()=>{if (res.data.profile.avatar.includes("http")) {return `<img src="${res.data.profile.avatar}" class='user-avt'>`}else {return `<img src="https://cdn.fodance.com/fd-media/${res.data.profile.avatar}" class='user-avt'>`}})()}</a>
                                        <div class='avt-info'>
                                        <div class="d-flex"><a class='avt nav-red' nav-data='personal' data-user-df="${res.data.profile.nickname}"><span class='avt-username user-username'>${res.data.username}</span></a>
                                        ${(()=>{if(res.data.profile.auth){return '<span class="iconify mg-l-sm mg-t-sm theme-color verified" data-icon="ic:round-verified"></span>'}else{return ''}})()}<div class='mark-icon'>
                                        </div>
                                        <a class='avt nav-red' nav-data='personal' data-user-df="${res.data.profile.nickname}"><span class='post-time nickname-content'>${(() => {if(res.data.profile && res.data.profile.nickname) {return `@${res.data.profile.nickname}`}else {return `@${res.data.username}`}})()}</span></a>
                                        <div class='mg-l d-flex'><span class='contact-item'></span><a class='avt'><span class='post-time theme-color'>Vừa xong</span></a></div></div>
                                        <div class='post-description'>${res.data.post.description} - đã tham gia #${res.data.post.category}</div>
                                        </div></div></div><div class='post-content'>${(() => {if(res.data.post.file) {if(res.data.post.file.type == 'video'){return `<div class='post-file'><video class='player media-post' poster="/public/images/poster.png" src="https://cdn.fodance.com/fd-media/${res.data.post.file.path}"></video></div>`}else{if (res.data.post.file.path.length == 1) {return `<div class='post-file'><img src="https://cdn.fodance.com/fd-media/${res.data.post.file.path[0]}" class='media-post post-image'></div>`}if (res.data.post.file.path.length == 2) {return `<div class='post-file thumb-2-files'><div class='thumb-file'><img src="https://cdn.fodance.com/fd-media/${res.data.post.file.path[0]}" class='media-post post-image'></div><div class='thumb-file'><img src="https://cdn.fodance.com/fd-media/${res.data.post.file.path[1]}" class='media-post post-image'></div></div>`}if (res.data.post.file.path.length == 3) {return `<div class='post-file thumb-3-files'><div class='thumb-file'><img src="https://cdn.fodance.com/fd-media/${res.data.post.file.path[0]}" class='media-post post-image'></div><div class='thumb-file'><img src="https://cdn.fodance.com/fd-media/${res.data.post.file.path[1]}" class='media-post post-image'></div><div class='thumb-file'><img src="https://cdn.fodance.com/fd-media/${res.data.post.file.path[2]}" class='media-post post-image''></div></div>`}if (res.data.post.file.path.length == 4) {return `<div class='post-file thumb-4-files'><div class='thumb-file'><img src="https://cdn.fodance.com/fd-media/${res.data.post.file.path[0]}" class='media-post post-image'></div><div class='thumb-file'><img src="https://cdn.fodance.com/fd-media/${res.data.post.file.path[1]}" class='media-post post-image'></div><div class='thumb-file'><img src="https://cdn.fodance.com/fd-media/${res.data.post.file.path[2]}" class='media-post post-image'></div><div class='thumb-file'><img src="https://cdn.fodance.com/fd-media/${res.data.post.file.path[3]}" class='media-post post-image'></div></div>`}}} else {return ''}})()}</div><div class="d-flex-start pd-l-lg pd-r-lg"><div class="interactive-but-total d-flex vote-total"></div></div><div class="border-b mg-t-sm mg-b-sm mg-r-lg mg-l-lg"></div><div class='post-interactive'><button class="interactive-but like-but" data-liked="false"><span class="iconify font-size-lg-5" data-icon="ant-design:heart-twotone"></span><span>Bình chọn</span></button><button class='interactive-but comment-but'><span class='iconify font-size-lg-1' data-icon='bi:chat-square' data-inline='false'></span><span>Bình luận<span class="interactive-comment-total"></span></span></button><button class='interactive-but'><span class='iconify font-size-lg-1' data-icon='simple-line-icons:share-alt' data-inline='false'></span><span>Chia sẻ</span></button></div></div>`)                    
                                        document.querySelector('.post-create-down').onanimationend = function() {
                                            document.querySelector(`[data-post-df='${res.data.post.postId}']`).classList.remove('post-create-down')
                                            if (document.querySelector(".frame-post-home")){
                                                competitionContentText = document.querySelector(".main-frame").innerHTML
                                            }
                                            if (document.querySelector(".info-frame")){
                                                personalPostText = document.querySelector(".info-frame").innerHTML
                                            }
                                        }
                                        }
                                    }
                                    console.log(124)
                                    handleNotification("post", [res.data.post.postId, res.data.cateNamePost, res.data.rankNamePost])
                                    postDisplayedList.push(res.data.post.postId)
                                    Plyr.setup('video.player')
                                    showAlertWithLink(`Video của bạn đã được xử lý thành công! <span class="nav-red underline-deco" nav-data="view-post" data-post-df="${res.data.post.postId}">Xem video?<span class="avt-username"></span></span>`)
                                    handleRankPostCount()
                                    if (rankLink == "intermediate"){document.querySelector(".ticket-total").textContent = ticket - 1}
                                    if (rankLink == "highgrade"){document.querySelector(".ticket-total").textContent = ticket - 3}
                                    handleNavigation()
                                    handleMainFrame()
                                    replaceLinkName()
                                }
                                else if (res.status == "no files chosen"){
                                    clearInterval(interv)
                                    showAlert("Hãy chọn 1 video cho Thể loại!")
                                }
                                else if (res.status == "rank invalid"){
                                    clearInterval(interv)
                                    showAlert("Cấp bậc không hợp lệ!")
                                }
                                else if (res.status == "topic invalid"){
                                    clearInterval(interv)
                                    showAlert("Thể loại không hợp lệ!")
                                }
                                else if (res.status == "topic rank invalid"){
                                    clearInterval(interv)
                                    showAlert("Thể loại với cấp bậc không hợp lệ!")
                                }
                                else if (res.status == "not enough ticket"){
                                    clearInterval(interv)
                                    showAlert("Bạn hiện không đủ vé!")
                                }
                                else {
                                    clearInterval(interv)
                                    showAlert("Tạo video không thành công, hãy thử lại!")
                                }
                            }, 3000)
                            
                        }
                    }
                    xhttp.open("POST", "/", true)
                    xhttp.send(formData)
                }
                else {
                    showAlert("Bạn hiện không đủ vé!")
                }
            }
        } 
    }
}

function commentPostHandle(viewPost, viewWithCmt){
    function showComment(post){
        let isExpand = false
        if (post.querySelectorAll(".comment-section").length == 0 || viewWithCmt){
            post.insertAdjacentHTML('beforeend', `<div class="comment-section mg-l-lg mg-r-lg border-t"><div class="comment-textarea-frame d-flex-start pd-b pd-t"><a class="avt d-flex"><img src="${document.querySelectorAll(".user-avt")[0].getAttribute('src')}"></a><textarea type="text" name="comment" class="mg-l-sm comment-textarea d-flex-col" maxlength="1000" placeholder="Viết bình luận..."></textarea><button class="comment-emoji-but comment-emoji emoji-but d-flex"><span class="iconify" data-icon="bi:emoji-smile" data-inline="false"></span></button></div><div class="comment-loading d-flex pd-b"><span class="iconify spin loading-icon" data-icon="ant-design:loading-3-quarters-outlined" data-inline="false"></span></div></div>`)
            function areaHandle(area, emj){
                const cmtArea = post.querySelectorAll(area)
                const emojiButton = post.querySelectorAll(emj)
                for (let i = 0 ; i < cmtArea.length; i++){
                    cmtArea[i].oninput = function() {
                        cmtArea[i].style.height = ""
                        cmtArea[i].style.height = cmtArea[i].scrollHeight + "px"
                        if (cmtArea[i].scrollHeight >= 200) {
                            cmtArea[i].style.overflowY = "scroll"
                        }
                        else {
                            cmtArea[i].style.overflowY = "hidden"
                        }
                    }
                    emojiButton[i].addEventListener('click', function() {
                        picker.pickerVisible ? picker.hidePicker() : picker.showPicker(emojiButton[i])
                    })    
                    let picker = new EmojiButton({
                        emojiSize: '1.4em',
                        emojiVersion: '12.1',
                        position: 'right-end',
                        style: 'native',
                        zIndex: 2000,
                        recentsCount: 16,
                        autoHide: true,
                        theme: 'light',
                        emojisPerRow: '8',
                        i18n: {
                            search: 'Tìm biểu tượng...',
                            categories: {
                            recents: 'Biểu tượng vừa sử dụng',
                            smileys: 'Mặt cười & Cảm xúc',
                            people: 'Người và cơ thể',
                            animals: 'Động vật & Thiên nhiên',
                            food: 'Đồ ăn & Thức uống',
                            activities: 'Hoạt động',
                            travel: 'Du lịch & Địa điểm',
                            objects: 'Các đối tượng',
                            symbols: 'Biểu tượng',
                            flags: 'Cờ'
                            },
                            notFound: 'Không tìm thấy biểu tượng'
                        }
                    })
                    
                    picker.on('emoji', emoji => {
                        cmtArea[i].value += emoji
                    })
                }
            }
            areaHandle(".comment-textarea", ".comment-emoji-but")
            cmtDisplayedList[post.getAttribute("data-post-df")] = []
            const data = {
                dataPostDf: post.getAttribute("data-post-df"),
                isExpand: isExpand,
                reply: null,
                cmtDisplayedList: cmtDisplayedList[post.getAttribute("data-post-df")],
                viewWithCmt: viewWithCmt
            }
            function loadCmt(){    
                let xhttp
                if (window.XMLHttpRequest) {
                    xhttp = new XMLHttpRequest()
                } else {
                    xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                }
                xhttp.onreadystatechange = function(){
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        const res = JSON.parse(xhttp.responseText)
                        if (post.querySelectorAll(".comment-loading").length != 0){
                            post.querySelector(".comment-loading").remove()
                        }
                        post.querySelector(".comment-textarea-frame").classList.remove("pd-t")
                        if (post.querySelectorAll(".total-comment").length == 0){
                            post.querySelector(".comment-section").insertAdjacentHTML('afterbegin', `<div class="total-comment"><span class="mg-r total-commment-text">${res.data.total} bình luận</span></div>`)
                        }
                        if (res.status == "end"){
                            if (post.querySelectorAll(".commented").length == 0){
                                post.querySelector(".comment-section").insertAdjacentHTML('beforeend', '<div class="commented pd-b"></div>')
                            }
                        }
                        if (res.status == 'done'){
                            if (post.querySelectorAll(".commented").length == 0){
                                post.querySelector(".comment-section").insertAdjacentHTML('beforeend', '<div class="commented pd-b"></div><div class="comment-expand noselect"><span class="comment-expand-text">Xem thêm</span></div>')
                            }
                            for(let i = 0; i < res.data.cmts.length; i++) {
                                function showCmt(cmtFrame, data, reply, i){
                                    cmtFrame.insertAdjacentHTML('beforeend', `<div class="comment-item d-flex-start-top" data-cmt-df="${data.cmts[i].cmtId}"><div class="comment-content"><a class="avt nav-red mg-t ${(()=>{if (reply) {return 'rep-avt-small'} else {return ''}})()}" nav-data="personal" data-user-df="${data.cmtNicknames[i]}"><img src="${(()=>{if (data.cmtAvts[i].includes("https")) {return `${data.cmtAvts[i]}`} else {return `https://cdn.fodance.com/fd-media/${data.cmtAvts[i]}`}})()}"></a><div class="comment-inner d-flex-col-start mg-l-sm"><div class="comment-wrapper d-flex-col-start"><div class="d-flex"><div class="d-flex"><a class="avt nav-red username" nav-data="personal" data-user-df="${data.cmtNicknames[i]}">${(()=>{if (data.user == data.cmts[i].user) {return '<span class="avt-username user-username cmt-username">'} else {return '<span class="avt-username cmt-username">'}})()}${data.cmtUsernames[i]}</span></a>${(()=>{if(data.cmtAuth[i]){return '<span class="iconify mg-l-sm mg-t-sm theme-color verified" data-icon="ic:round-verified"></span>'}else{return ''}})()}<div class="mark-icon"></div></div><a class="avt nav-red d-flex mg-l-sm" nav-data="personal" data-user-df="${data.cmtNicknames[i]}">${(()=>{if (data.user == data.cmts[i].user) {return '<span class="post-time nickname-content">'} else {return '<span class="post-time nickname-content">'}})()}@${data.cmtNicknames[i]}</span></a></div><div>${(()=>{if (data.cmts[i].tag){return`<a class="nav-red username mg-r-sm" nav-data="personal" data-user-df="${data.cmtTagNickname[i]}">${(()=>{if (data.user == data.cmts[i].user) {return '<span class="avt-username user-username cmt-username">'} else {return '<span class="avt-username cmt-username">'}})()}${data.cmtTags[i]}</span></a>`} else {return ''}})()}${data.cmts[i].content}</div></div><div class="d-flex"><div class="comment-interactive d-flex-start">${(() => {if (data.cmtLiked[i]) {return '<a class="like-cmt-but interactive-but-liked d-flex-start mg-r noselect" data-cmt-liked="true">'} else {return '<a class="like-cmt-but d-flex-start noselect" data-cmt-liked="false">'}})()}<span class="iconify mg-r-sm" data-icon="simple-line-icons:like" data-inline="false"></span><span>Thích </span><span class="comment-total mg-r-sm">${(() => {if (data.likeTotal != 0) {return `(${data.likeTotal})`} else {return ''}})()}</span></a><a class="rep-comment-but ${(()=>{if (reply) {return 'rep-with-tag'} else {return ''}})()} d-flex-start noselect"><span class="iconify mg-r-sm" data-icon="bi:chat-square" data-inline="false"></span><span>Trả lời</span></a></div><div class="d-flex mg-l"><span class="contact-item"></span><a class="avt"><span class='post-time'>${(() => {if ((Date.now() - Date.parse(data.cmts[i].time))/1000 < 5) {return `<span class="theme-color">Vừa xong</span>`} else if((Date.now() - Date.parse(data.cmts[i].time))/1000 > 5 && (Date.now() - Date.parse(data.cmts[i].time))/1000 < 60) {return `<span class="theme-color">${Math.floor((Date.now() - Date.parse(data.cmts[i].time))/1000)} giây</span>`} else if ((Date.now() - Date.parse(data.cmts[i].time))/1000/60 >= 1 && (Date.now() - Date.parse(data.cmts[i].time))/1000/60 < 60){return `<span class="theme-color">${Math.floor((Date.now() - Date.parse(data.cmts[i].time))/1000/60)} phút</span>`} else if ((Date.now() - Date.parse(data.cmts[i].time))/1000/3600 >= 1 && (Date.now() - Date.parse(data.cmts[i].time))/1000/3600 < 24){return `${Math.floor((Date.now() - Date.parse(data.cmts[i].time))/1000/3600)} giờ`} else if ((Date.now() - Date.parse(data.cmts[i].time))/1000/3600/24 >= 1 && (Date.now() - Date.parse(data.cmts[i].time))/1000/3600/24 < 8){return `${Math.floor((Date.now() - Date.parse(data.cmts[i].time))/1000/3600/24)} ngày`} else if ((Date.now() - Date.parse(data.cmts[i].time))/1000/3600/24 >= 8) {return `${new Date(data.cmts[i].time).getDate() + " tháng " + (new Date(data.cmts[i].time).getMonth() + 1) + " lúc " + new Date(data.cmts[i].time).getHours() + ':' + new Date(data.cmts[i].time).getMinutes()}`}})()}</span></a></div></div></div><div class="comment-util noselect"><button class="avt-but header-but dropdown-but util-dropdown-but"><span class="iconify dropdown-icon bg-white" data-icon="vaadin:ellipsis-dots-h" data-inline="false"></span></button><div class="comment-util-dropdown-content dropdown-content">${(()=> {if (data.user == data.cmts[i].user || data.postUser == data.user) {return '<a class="nav-item del-cmt"><span class="iconify" data-icon="bx:bx-hide" data-inline="false"></span>Xóa bình luận</a>'} else {return '<a class="nav-item report-cmt"><span class="iconify" data-icon="octicon:issue-opened" data-inline="false"></span>Báo cáo bình luận</a>'}})()}</div></div></div></div>`)
                                    handleToggle()
                                    handleNavigation()
                                    replaceLinkName()
                                    delCmtHandle(post, post.querySelector(`.comment-item[data-cmt-df="${data.cmts[i].cmtId}"]`), reply)
                                    likeCmtHandle(post.querySelector(`.comment-item[data-cmt-df="${data.cmts[i].cmtId}"]`))
                                    reportCmtHandle(post, post.querySelector(`.comment-item[data-cmt-df="${data.cmts[i].cmtId}"]`))
                                    // competitionContentText = document.querySelector(".main-frame").innerHTML
                                    if (!reply) {
                                        cmtDisplayedList[post.getAttribute("data-post-df")].push(data.cmts[i].cmtId)
                                        repCmtDisplayedList[data.cmts[i].cmtId] = []
                                    }
                                }
                                showCmt(post.querySelector(".commented"), res.data, false, i)
                     
                                const comment = post.querySelector(`.comment-item[data-cmt-df="${res.data.cmts[i].cmtId}"]`)
                                function showTextarea(focus, tag, tagUsername){
                                    const cmtId = comment.getAttribute("data-cmt-df")
                                    if (comment.querySelectorAll(".comment-textarea-frame").length == 0){
                                        comment.querySelector(".rep-comment").insertAdjacentHTML('beforeend', `<div class="comment-textarea-frame d-flex-start pd-b mg-t-sm"><a class="avt d-flex rep-avt-small"><img src="${document.querySelectorAll(".user-avt")[0].getAttribute('src')}"></a><textarea type="text" name="comment" class="mg-l-sm comment-textarea rep-comment-textarea d-flex-col" maxlength="1000" placeholder="Viết bình luận..."></textarea><button class="comment-emoji-but comment-emoji rep-comment-emoji-but emoji-but d-flex"><span class="iconify" data-icon="bi:emoji-smile" data-inline="false"></span></button></div></div></div>`)
                                        areaHandle(".rep-comment-textarea", ".rep-comment-emoji-but")
                                        
                                    } else{
                                        if (focus){
                                            comment.querySelector(".rep-comment-textarea").scrollIntoView({block: "center"})
                                            // comment.querySelector(".rep-comment-textarea").focus()
                                        }
                                    }     
                                    const repCmtTextarea = comment.querySelector(".rep-comment-textarea")
                                    if (focus) {repCmtTextarea.focus()}
                                    const repCommented = comment.querySelector(".rep-commented")
                                    if (tagUsername){repCmtTextarea.value = tagUsername + ' '  }
                                    repCmtTextarea.onkeydown = function(event){
                                        createCmt(event, repCmtTextarea, repCommented, cmtId, tag, tagUsername, 'beforeend')
                                    }
                                }

                                function showRepCmt(){
                                    let xhttp
                                    if (window.XMLHttpRequest) {
                                        xhttp = new XMLHttpRequest()
                                    } else {
                                        xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                                    }
                                    const cmtId = comment.getAttribute("data-cmt-df")
                                    data.reply = cmtId
                                    data.repCmtDisplayedList = repCmtDisplayedList[comment.getAttribute("data-cmt-df")]
                                    xhttp.onreadystatechange = function(){
                                        if (xhttp.readyState == 4 && xhttp.status == 200){
                                            const res = JSON.parse(xhttp.responseText)
                                            if (res.status == 'done'){
                                                const repCommented = comment.querySelector(".rep-commented")
                                                for(let i = 0; i < res.data.cmts.length; i++){
                                                    showCmt(repCommented, res.data, true, i)
                                                    repCmtDisplayedList[comment.getAttribute("data-cmt-df")].push(res.data.cmts[i].cmtId)
                                                    comment.querySelector(".rep-comment-expand-text").innerHTML = `${(() => {if (res.data.total - repCmtDisplayedList[comment.getAttribute("data-cmt-df")].length > 0){return `Xem thêm ${res.data.total - repCmtDisplayedList[comment.getAttribute("data-cmt-df")].length} phản hồi`} else {return ''}})()}`
                                                    const repComment = comment.querySelector(`.comment-item[data-cmt-df="${res.data.cmts[i].cmtId}"]`)
                                                    repComment.querySelector(".rep-with-tag").onclick = function(){
                                                        const user = repComment.querySelector(".username").getAttribute("data-user-df"
                                                        )
                                                        const username = repComment.querySelector(".avt-username").textContent
                                                        const tag = user
                                                        const tagUsername = username
                                                        showTextarea(true, tag, tagUsername)
                                                    }
                                                }
                                                if (repCmtDisplayedList[comment.getAttribute("data-cmt-df")].length == res.data.total){
                                                    if (comment.querySelector(".rep-comment-expand")){
                                                        comment.querySelector(".rep-comment-expand").remove()
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    
                                    xhttp.open("POST", "/load-comment-scription", true)
                                    xhttp.setRequestHeader('Content-Type', 'application/json')
                                    xhttp.send(JSON.stringify(data))
                                }
                                if (res.data.repTotal[i]) {
                                    comment.insertAdjacentHTML('beforeend', `<div class="d-flex-end"><div class="rep-comment"><div class="rep-commented"></div>${(() => {if (res.data.repTotal[i] >= 1 && res.data.repTotal[i] <= 5){return `<div class="rep-comment-expand noselect"><span class="rep-comment-expand-text">Xem thêm ${res.data.repTotal[i]} phản hồi</span></div>`} else if(res.data.repTotal[i] > 5){return `<div class="rep-comment-expand noselect"><span class="rep-comment-expand-text">Xem thêm 5 phản hồi</span></div>`} else {return ''}})()}</div>`)
                                    // showCmt(comment.querySelector(".rep-commented"), res.data.repCmt, true, i)
                                    if (comment.querySelectorAll(".rep-comment-expand-text").length != 0){
                                        comment.querySelector(".rep-comment-expand-text").onclick = function(){  
                                            showTextarea(false, null, null)
                                            showRepCmt()
                                        }
                                    }
                                    // const repComment = comment.querySelector(`.comment-item[data-cmt-df="${res.data.repCmt[i].cmtId}"]`)
                                    // repComment.querySelector(".rep-with-tag").onclick = function(){
                                    //     const user = repComment.querySelector(".username").getAttribute("data-user-df")
                                    //     const username = repComment.querySelector(".avt-username").textContent
                                    //     const tag = user
                                    //     const tagUsername = username
                                    //     showTextarea(true, tag, tagUsername)
                                    // }
                                }
                                comment.querySelector(".rep-comment-but").onclick = function(){
                                    comment.insertAdjacentHTML('beforeend', `<div class="d-flex-end"><div class="rep-comment"><div class="rep-commented"></div></div>`)
                                    showTextarea(true, null, null)
                                }
                            }
                            if (post.querySelectorAll(".comment-expand-text").length != 0){
                                post.querySelector(".comment-expand-text").onclick = function(){
                                    data.reply = null
                                    data.isExpand = true
                                    loadCmt()
                                }
                            }
                            if (cmtDisplayedList[post.getAttribute("data-post-df")].length == res.data.total){
                                if (post.querySelectorAll(".comment-expand").length != 0){
                                    post.querySelector(".comment-expand").remove() 
                                    // competitionContentText = document.querySelector(".main-frame").innerHTML
                                }   
                            }
                        }
                        else if (res.status == "removed"){
                            document.querySelector(".comment-section").remove()
                            showAlert("Bình luận đã bị xoá!")
                            viewWithCmt = false
                            showComment(document.querySelector(".post"))
                        }
                    }
                }
                xhttp.open("POST", "/load-comment-scription", true)
                xhttp.setRequestHeader('Content-Type', 'application/json')
                xhttp.send(JSON.stringify(data))
            }
            loadCmt()
            const cmtTextarea = post.querySelector(".comment-textarea")
            // cmtTextarea.focus()
            function createCmt(event, cmtTextarea, commented, cmtId, tag, tagUsername, pos){
                if (event.keyCode === 13 && !event.shiftKey) {
                    event.preventDefault()
                    let content = cmtTextarea.value.trim()
                    data.content = content
                    data.cmtId = cmtId
                    if (tag){
                        if (!content.includes(tagUsername) || content.indexOf(tagUsername) != 0){
                            data.tag = null}
                        else{
                            data.tag = tag
                            content = content.slice(tagUsername.length)
                            data.content = content
                        }
                    }
                    if (content.length > 0 && content.length <= 1000){
                        let xhttp
                        if (window.XMLHttpRequest) {
                            xhttp = new XMLHttpRequest()
                        } else {
                            xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                        }
                        xhttp.onreadystatechange = function(){
                            if (xhttp.readyState == 4 && xhttp.status == 200) {
                                const res = JSON.parse(xhttp.responseText)
                                if (res.status == 'done'){
                                    commented.insertAdjacentHTML(pos, `<div class="comment-item d-flex-start-top" data-cmt-df="${res.data.cmtId}"><div class="comment-content"><a class="avt mg-t nav-red ${(()=>{if (cmtId) {return 'rep-avt-small'} else {return ''}})()}" nav-data="personal" data-user-df="${res.data.nickname}"><img src="${(()=>{if (res.data.avt.includes("https")) {return `${res.data.avt}`} else {return `https://cdn.fodance.com/fd-media/${res.data.avt}`}})()}"></a><div class="comment-inner d-flex-col-start mg-l-sm"><div class="comment-wrapper d-flex-col-start"><div class="d-flex"><a class="nav-red username" nav-data="personal" data-user-df="${res.data.nickname}"><span class="avt-username user-username cmt-username">${res.data.username}</span></a>${(()=>{if(res.data.auth){return '<span class="iconify mg-l-sm mg-t-sm theme-color verified" data-icon="ic:round-verified"></span>'}else{return ''}})()}<div class="mark-icon"></div><a class="avt d-flex mg-l-sm"><span class="post-time nickname-content">@${res.data.nickname}</span></a></div><div>${(() => {if (data.tag){return `<a class="nav-red" nav-data="personal" data-user-df="${data.tag}"><span class="avt-username cmt-username">${tagUsername}</span></a>`} else {return ""}})()}${data.content}</div></div><div class="d-flex"><div class="comment-interactive d-flex-start"><a class="like-cmt-but d-flex-start noselect" data-cmt-liked="false"><span class="iconify mg-r-sm" data-icon="simple-line-icons:like" data-inline="false"></span><span>Thích </span><span class="comment-total mg-r-sm"></span></a><a class="rep-comment-but d-flex-start noselect"><span class="iconify mg-r-sm" data-icon="bi:chat-square" data-inline="false"></span><span>Trả lời</span></a></div><div class="mg-l d-flex"><span class="contact-item"></span><a class="avt"><span class="post-time"><span class="theme-color">Vừa xong</span></a></div></div></div><div class="comment-util noselect"><button class="avt-but header-but dropdown-but util-dropdown-but"><span class="iconify dropdown-icon bg-white" data-icon="vaadin:ellipsis-dots-h" data-inline="false"></span></button><div class="comment-util-dropdown-content dropdown-content"><a class="nav-item del-cmt"><span class="iconify" data-icon="bx:bx-hide" data-inline="false"></span>Xóa bình luận</a></div></div><div></div>`)
                                    cmtTextarea.value = null
                                    cmtTextarea.style.height = '35px'
                                    cmtTextarea.style.overflowY = "hidden"
                                    if (!res.data.reply){
                                        console.log(123)
                                        handleNotification("comment", [`${res.data.postId}`, `${res.data.cmtId}`])
                                    }
                                    if (!cmtId){
                                        cmtDisplayedList[data.dataPostDf].push(res.data.cmtId)
                                        post.querySelector(".total-commment-text").textContent = res.data.total + 1 + " bình luận"
                                        if (post.querySelector(".interactive-comment-total").textContent == ''){
                                            post.querySelector(".interactive-comment-total").parentNode.innerHTML = `Bình luận (<span class="interactive-comment-total">${res.data.total + 1}</span>)`
                                        }
                                        else {
                                            post.querySelector(".interactive-comment-total").textContent = `${res.data.total + 1}`
                                        }
                                    }
                                    else {
                                        if (!repCmtDisplayedList[cmtId]){
                                            repCmtDisplayedList[cmtId] = []
                                        }
                                        repCmtDisplayedList[cmtId].push(res.data.cmtId)
                                    }
                                    // competitionContentText = document.querySelector(".main-frame").innerHTML
                                    const comment = post.querySelector(`.comment-item[data-cmt-df="${res.data.cmtId}"]`)
                                    comment.querySelector(".rep-comment-but").onclick = function(){
                                        // const user = comment.querySelector(".username").getAttribute("data-user-df"
                                        // )
                                        // const username = comment.querySelector(".avt-username").textContent
                                        // const tag = user
                                        // const tagUsername = username
                                        if (!comment.querySelector(".rep-comment") && !cmtId){
                                            comment.insertAdjacentHTML('beforeend', '<div class="d-flex-end"><div class="rep-comment"><div class="rep-commented"></div>')
                                            comment.querySelector(".rep-comment").insertAdjacentHTML('beforeend', `<div class="comment-textarea-frame d-flex-start pd-b mg-t-sm"><a class="avt d-flex rep-avt-small"><img src="${document.querySelectorAll(".user-avt")[0].getAttribute('src')}"></a><textarea type="text" name="comment" class="mg-l-sm comment-textarea rep-comment-textarea d-flex-col" maxlength="1000" placeholder="Viết bình luận..."></textarea><button class="comment-emoji-but comment-emoji rep-comment-emoji-but emoji-but d-flex"><span class="iconify" data-icon="bi:emoji-smile" data-inline="false"></span></button></div></div></div>`)
                                            areaHandle(".rep-comment-textarea", ".rep-comment-emoji-but")  
                                            const repCmtTextarea = comment.querySelector(".rep-comment-textarea")
                                            // repCmtTextarea.focus()
                                            const repCommented = comment.querySelector(".rep-commented")
                                            // repCmtTextarea.value = tag.username + ' '
                                            repCmtTextarea.onkeydown = function(event){
                                                createCmt(event, repCmtTextarea, repCommented, comment.getAttribute("data-cmt-df"), null, null, 'beforeend')
                                            }
                                        }
                                    }      
                                    handleToggle()
                                    handleNavigation()
                                    delCmtHandle(post, comment, cmtId)
                                    likeCmtHandle(comment)
                                }   
                                else {
                                    showAlert("Bình luận không được vượt quá 1000 kí tự!")
                                }                 
                            }
                        }
                        xhttp.open("POST", "/comment-scription", true)
                        xhttp.setRequestHeader('Content-Type', 'application/json')
                        xhttp.send(JSON.stringify(data))
                    }
                }
            }
            cmtTextarea.onkeydown = function(event) {
                createCmt(event, cmtTextarea, post.querySelector(".commented"), null, null, null, 'afterbegin')
            }
        }

        function delCmtHandle(post, cmt, reply){
            if (cmt.querySelectorAll(".del-cmt").length != 0){
                cmt.querySelector(".del-cmt").onclick = function(){
                    if (document.querySelectorAll(".del-cmt-modal").length == 0) {
                        cmt.insertAdjacentHTML("afterbegin", "<div class='modal del-cmt-modal'><div class='modal-content del-cmt-modal-content d-flex-col'><div class='mg-b-lg'><h2 class='d-flex'>Xóa bình luận</h2><span>Bạn có chắc muốn xóa bình luận này không? Điều này sẽ không thể hoàn tác và mọi người sẽ không còn thấy bình luận này nữa.</span></div><div class='d-flex-sb'><button class='df-but bold-font width-40 destroy-but'>Hủy</button><button class='df-but bold-font danger-color white-color width-40 confirm-but'>Xóa</button></div></div></div>")
                        cmt.querySelector(".destroy-but").onclick = function(){
                            cmt.querySelector(".del-cmt-modal").remove()
                        }
                        cmt.querySelector(".confirm-but").onclick = function(){
                            let xhttp
                            if (window.XMLHttpRequest) {
                                xhttp = new XMLHttpRequest()
                            } else {
                                xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                            }
                            let cmtParentDf = null
                            if (reply){
                                cmtParentDf = cmt.parentNode.parentNode.parentNode.parentNode.getAttribute("data-cmt-df")
                                repCmtDisplayedList[cmtParentDf].splice(repCmtDisplayedList[cmtParentDf].indexOf(cmt.getAttribute("data-cmt-df")), 1)
                            }
                            else {
                                cmtDisplayedList[post.getAttribute("data-post-df")].splice(cmtDisplayedList[post.getAttribute("data-post-df")].indexOf(cmt.getAttribute("data-cmt-df")), 1)
                            }
                            const data = {
                                dataCmtDf: cmt.getAttribute("data-cmt-df"),
                                dataPostDf: post.getAttribute("data-post-df"),
                                cmtParentDf: cmtParentDf,
                            }
                            cmt.querySelector(".modal").remove()
                            cmt.remove()
                            // competitionContentText = document.querySelector(".main-frame").innerHTML
                            if (post.querySelector(".interactive-comment-total").textContent != '' && !cmtParentDf){
                                post.querySelector(".total-commment-text").textContent = parseInt(post.querySelector(".total-commment-text").textContent) - 1 + " bình luận"
                                const totalCmt = parseInt(post.querySelector(".interactive-comment-total").textContent.replace(')', '').replace('(', '')) - 1
                                if (totalCmt != 0){
                                    post.querySelector(".interactive-comment-total").textContent = `${totalCmt}`
                                }
                                else {
                                    post.querySelector(".interactive-comment-total").parentNode.innerHTML = 'Bình luận <span class="interactive-comment-total"></span>'
                                }
                            }
                            xhttp.open("POST", "/del-cmt", true)
                            xhttp.setRequestHeader('Content-Type', 'application/json')
                            xhttp.send(JSON.stringify(data))
                        }
                    }
                }
            }
        }

        function likeCmtHandle(comment){
            const likeCmt = comment.querySelector(".like-cmt-but")
            likeCmt.onclick = function(){
                let xhttp
                if (window.XMLHttpRequest) {
                    xhttp = new XMLHttpRequest()
                } else {
                    xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                }
                const data = {
                    dataCmtDf: comment.getAttribute("data-cmt-df")
                }
                let likeTotal
                if (likeCmt.querySelector(".comment-total").textContent == ''){
                    likeTotal = 0
                } else {
                    likeTotal = parseInt(likeCmt.querySelector(".comment-total").textContent.replace('(', '').replace(')', ''))
                }
                if (likeCmt.getAttribute("data-cmt-liked") != "true"){
                    data.liked = true
                    likeCmt.classList.add("interactive-but-liked")
                    likeCmt.setAttribute("data-cmt-liked", "true")
                    likeCmt.querySelector(".comment-total").textContent = `(${likeTotal + 1})`
                }
                else {
                    data.liked = false
                    likeCmt.classList.remove("interactive-but-liked")
                    likeCmt.setAttribute("data-cmt-liked", "false")
                    if (likeTotal - 1 > 0){
                        likeCmt.querySelector(".comment-total").textContent = `(${likeTotal - 1})`
                    } else {
                        likeCmt.querySelector(".comment-total").textContent = ''
                    }
                }
                xhttp.onreadystatechange = function(){
                    if (xhttp.readyState == 4 && xhttp.status == 200){
                        const res = JSON.parse(xhttp.responseText)
                        if (res.data.total > 0){
                            likeCmt.querySelector(".comment-total").textContent = `(${res.data.total})`
                        } else {
                            likeCmt.querySelector(".comment-total").textContent = ''
                        }
                    }
                }
                xhttp.open("POST", "/like-cmt-post", true)
                xhttp.setRequestHeader('Content-Type', 'application/json')
                xhttp.send(JSON.stringify(data))
            }
        }
    }

    function reportCmtHandle(post, comment){
        const reportCmt = comment.querySelector(".report-cmt")
        if (reportCmt){
            reportCmt.onclick = function(){
                post.insertAdjacentHTML("afterbegin", '<div class="modal report-cmt-modal"><div class="modal-content report-cmt-modal-content d-flex-col"><div class="group-title"><span class="font-size-lg-2 none-deco pd-l feedback-setting-content">Báo cáo bình luận</span></div><div class="border-b"></div><div class="setting-handle"><textarea class="opinion-textarea report-cmt-textarea" placeholder="Nhập nội dung" name="opinion" maxlength="1000"></textarea><div class="mg-t"><span>Hãy cho chúng tôi biết chi tiết bình luận này có vấn đề gì</span></div><button class="next-but submit-report-cmt mg-t">Gửi</button></div>')
                const modal = post.querySelector(".report-cmt-modal")
                document.querySelector(".submit-report-cmt").onclick = function(){
                    if (document.querySelector(".report-cmt-textarea").value.trim().length > 0){
                        let xhttp
                        if (window.XMLHttpRequest) {
                            xhttp = new XMLHttpRequest()
                        } else {
                            xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                        }
                        const data = {
                            obj: comment.getAttribute("data-cmt-df"),
                            content: document.querySelector(".report-cmt-textarea").value,
                            type: "comment"
                        }
                        xhttp.onreadystatechange = function() {    
                            if (xhttp.readyState == 4 && xhttp.status == 200) {
                                const res = JSON.parse(xhttp.responseText)
                                if (res.status == "done"){
                                    showAlert("Cảm ơn bạn đã gửi báo cáo!")
                                }
                                else {
                                    showAlert("Không thể gửi báo cáo!")
                                }
                                modal.remove()
                            } 
                        }
                        xhttp.open("POST", '/comment-issue', true)
                        xhttp.setRequestHeader('Content-Type', 'application/json')
                        xhttp.send(JSON.stringify(data))
                    }
                    else {
                        showAlert("Nội dung không được bỏ trống!")
                    }
                }

                window.onclick = function(event) {
                    if (event.target == modal) {
                        modal.remove()
                    }
                }
            }
        }
    }

    const cmtBut = document.querySelectorAll(".comment-but")
    for (let i = 0; i < cmtBut.length; i++){
        if (viewPost) {
            showComment(viewPost)
        }
        else {
            cmtBut[i].onclick = function(){
                const post = cmtBut[i].parentNode.parentNode
                showComment(post)
            }
        }
    }
}

function handleToggle(){
    function dropdownToggle(d) {
        let showing = 0
        if (d.parentNode.querySelector(".dropdown-content").classList.contains("show-content")){
            showing = 1
        }
        let dropdowns = document.querySelectorAll(".dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove('show-content')
        }
        if (showing == 0) {
            d.parentNode.querySelector(".dropdown-content").classList.toggle("show-content")
        }
        window.addEventListener('click', function(event) {
            if (!event.target.matches('.dropdown-but')) {
                let dropdowns = document.querySelectorAll(".dropdown-content");
                for (let i = 0; i < dropdowns.length; i++) {
                    let openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show-content')) {
                        openDropdown.classList.remove('show-content')
                    }
                }
            }
        })
    }

    document.querySelectorAll(".dropdown-but").forEach(function(e){
        e.onclick = function() {
            dropdownToggle(this)
        }
    })
}
handleToggle()

function viewPostRedirect(t, post, pushState){
    const currentUrl = window.location.href
    if (!document.querySelector(".view-post-modal")){
        const mediaPost = post.querySelectorAll(".media-post")
        if (post.querySelector(".comment-section")){
            post.querySelector(".comment-section").remove()
        }
        if(window.innerWidth <= 662){
            document.querySelector(".global").insertAdjacentHTML("beforeend", `
            <div class="modal view-post-modal">
                <div class="modal-content view-post-modal-content view-post-mobile post-viewer d-flex" data-post-df="${post.getAttribute("data-post-df")}">
                    <div class="close-view-post-modal return-but"><span class="iconify" data-icon="heroicons-outline:arrow-left" data-inline="false"></span></div>
                    <div class="view-media-content">
                        <img src="${mediaPost[t].getAttribute("src")}" class="view-post-img">
                    </div>
                    <div class="post-description post-description-mobile">${post.querySelector(".post-description").textContent.trim()}</div>
                    <div class="interactive-but-total interactive-but-total-mobile d-flex vote-total">${post.querySelector(".interactive-but-total").innerHTML}</div>
                    <div class="post-interactive post-interactive-mobile">${post.querySelector(".post-interactive").innerHTML}</div>
                </div>
            </div>
            `)
        }
        else {
            document.querySelector(".global").insertAdjacentHTML("beforeend", `
            <div class="modal view-post-modal">
                <div class="modal-content view-post-modal-content d-flex">
                    <button class="close close-view-post-modal" type="button"><span class="iconify dropdown-icon" data-icon="feather:x" data-inline="false"></span></button>
                    <button class="close expand-view-post-modal" type="button"><span class="iconify dropdown-icon" data-icon="entypo:resize-full-screen" data-inline="false"></span></button>
                    <button class="close preview-view-post-modal" type="button"><span class="iconify dropdown-icon" data-icon="radix-icons:double-arrow-left" data-inline="false"></span></button>
                    <button class="close next-view-post-modal" type="button"><span class="iconify dropdown-icon" data-icon="radix-icons:double-arrow-right" data-inline="false"></span></button>
                    <div class="view-media-content">
                        <img src="${mediaPost[t].getAttribute("src")}" class="view-post-img">
                    </div>
                    <div class="post-details post-viewer" data-post-df="${post.getAttribute("data-post-df")}">
                        <div class="post-util">
                            ${post.querySelector(".post-util").innerHTML}
                        </div>
                        <div class="post-user mg-t">
                        ${post.querySelector(".post-user").innerHTML}
                        </div>
                        <div class="post-content">
                            <div class="post-description">${post.querySelector(".post-description").textContent.trim()}</div>
                        </div>
                        <div class="d-flex-start pd-l-lg pd-r-lg">
                            <div class="interactive-but-total d-flex vote-total">${post.querySelector(".interactive-but-total").innerHTML}</div>
                        </div>
                        <div class="border-b mg-t-sm mg-b-sm mg-r-lg mg-l-lg"></div>
                        <div class="post-interactive">
                            ${post.querySelector(".post-interactive").innerHTML}
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            `)
            commentPostHandle(document.querySelector(".post-details"), false)
        }
        if (pushState){
            history.pushState({
                viewPostBut: t,
                post: post.outerHTML
            }, '', 'https://fodance.com/post/' + post.getAttribute("data-post-df"))
        }
        document.querySelectorAll(".interactive-but").forEach(function(e){
            e.style.padding = "8px 10px"
        })
        if (t == 0 && document.querySelector(".preview-view-post-modal")){document.querySelector(".preview-view-post-modal").innerHTML = ''}
        else if (t == mediaPost.length-1 && document.querySelector(".next-view-post-modal")){document.querySelector(".next-view-post-modal").innerHTML = ''}
        if (mediaPost.length == 1 && document.querySelector(".preview-view-post-modal") && document.querySelector(".next-view-post-modal")){
            document.querySelector(".preview-view-post-modal").innerHTML = ''
            document.querySelector(".next-view-post-modal").innerHTML = ''
        }
        if (document.querySelector(".preview-view-post-modal")){
            document.querySelector(".preview-view-post-modal").onclick = function(){
                if (t > 0){
                    document.querySelector(".view-media-content").innerHTML = `<img src="${mediaPost[t-1].getAttribute("src")}" class="view-post-img">`
                    if (document.querySelector(".next-view-post-modal").innerHTML == ''){
                        document.querySelector(".next-view-post-modal").innerHTML = '<span class="iconify dropdown-icon" data-icon="radix-icons:double-arrow-right" data-inline="false"></span>'
                    }
                    t -= 1
                }
                if (t == 0) {
                    document.querySelector(".preview-view-post-modal").innerHTML = ''
                }
            }
        }

        if (document.querySelector(".next-view-post-modal")){
            document.querySelector(".next-view-post-modal").onclick = function(){
                if (t < mediaPost.length-1){
                    document.querySelector(".view-media-content").innerHTML = `<img src="${mediaPost[t+1].getAttribute("src")}" class="view-post-img">`
                    if (document.querySelector(".preview-view-post-modal").innerHTML == ''){
                        document.querySelector(".preview-view-post-modal").innerHTML = '<span class="iconify dropdown-icon" data-icon="radix-icons:double-arrow-left" data-inline="false"></span>'
                    }
                    t += 1
                }
                if (t == mediaPost.length-1){
                    document.querySelector(".next-view-post-modal").innerHTML = ''
                }
            }
        }

        function slideMedia(){
            let slider =  document.querySelector(".view-post-img")
            let isDown = false
            let startX, slide = false, walk = 0
            slider.addEventListener('touchstart', (e) => {
                isDown = true
                for (i=0; i < e.changedTouches.length; i++) {
                    startX = e.changedTouches[i].pageX
                }
                // startX = e.pageX
                // scrollLeft = slider.scrollLeft
            })
            slider.addEventListener('touchcancel', () => {
                isDown = false
            })
            slider.addEventListener('touchmove', (e) => {
                if(!isDown) return 
                e.preventDefault()
                for (i=0; i < e.changedTouches.length; i++) {
                    const x = e.changedTouches[i].pageX
                    walk = (startX - x) * 1
                }
            })
            slider.addEventListener('touchend', (e) => {
                if (walk > 50){
                    if (t < mediaPost.length-1){
                        t += 1
                        document.querySelector(".view-post-img").style.marginLeft = "-500px"
                        document.querySelector(".view-post-img").ontransitionend = function(){
                            document.querySelector(".view-media-content").innerHTML = `<img src="${mediaPost[t].getAttribute("src")}" class="view-post-img">`
                            slideMedia()
                        }
                    }
                    else {
                        document.querySelector(".view-post-img").style.marginLeft = "-100px"
                        document.querySelector(".view-post-img").ontransitionend = function(){
                            document.querySelector(".view-post-img").style.marginLeft = "0"
                        }
                    }
                }
                else if (walk < -50) {
                    if (t > 0){
                        t -= 1
                        document.querySelector(".view-post-img").style.marginLeft = "500px"
                        document.querySelector(".view-post-img").ontransitionend = function(){
                            document.querySelector(".view-media-content").innerHTML = `<img src="${mediaPost[t].getAttribute("src")}" class="view-post-img">`
                            slideMedia()
                        }
                    }
                    else {
                        document.querySelector(".view-post-img").style.marginLeft = "100px"
                        document.querySelector(".view-post-img").ontransitionend = function(){
                            document.querySelector(".view-post-img").style.marginLeft = "0"
                        }
                    }
                }
            })
        }
        slideMedia()
        
        document.querySelector(".close-view-post-modal").onclick = function(){  
            this.parentNode.parentNode.classList.add("modal-remove-down")
                this.parentNode.parentNode.onanimationend = function () {
                    window.history.back()
                }
        }
        function expandPost(){
            if (document.querySelector(".expand-view-post-modal")){
                document.querySelector(".expand-view-post-modal").onclick = function(){
                    this.remove()
                    document.querySelector(".view-post-modal-content").insertAdjacentHTML("beforebegin", '<button class="close narrow-view-post-modal" type="button"><span class="iconify dropdown-icon" data-icon="si-glyph:arrow-resize-3" data-inline="false"></span></button>')
                    document.querySelector(".post-details").style.display = "none"
                    document.querySelector(".next-view-post-modal").style.right = '10px'
                    narrowPost()
                }
            }
        }
        expandPost()

        function narrowPost(){
            if (document.querySelector(".narrow-view-post-modal")){
                document.querySelector(".narrow-view-post-modal").onclick = function(){
                    this.remove()
                    document.querySelector(".view-post-modal-content").insertAdjacentHTML("beforebegin", '<button class="close expand-view-post-modal" type="button"><span class="iconify dropdown-icon" data-icon="entypo:resize-full-screen" data-inline="false"></span></button>')
                    document.querySelector(".post-details").style.display = "block"
                    expandPost()
                    document.querySelector(".next-view-post-modal").style.right = '450px'
                }
            }
        }
        handleMainFrame()
        handleNavigation()
    }
}

function handleCreatePost(){
    if (document.querySelectorAll(".create-post-but").length != 0){
        document.querySelectorAll(".create-post-but").forEach(function(c){
            c.onclick = function(){
                createPostRedirect(c, true)
            }
        })
    }

    if (document.querySelector(".create-post-handler") && document.querySelector(".create-post-handler").classList.contains("create-post-handler-begin")){
        const createBut = document.querySelector(".create-post-handler").parentNode.querySelector(".create-post-but")
        createPostRedirect(createBut, false)
        document.querySelector(".create-post-handler").classList.remove("create-post-handler-begin")
    }

}
handleCreatePost()

function lottie() {
    bodymovin.loadAnimation({
        container: document.querySelector('.dance-lottie'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets2.lottiefiles.com/packages/lf20_6aYlBl.json'
    })
    bodymovin.loadAnimation({
        container: document.querySelector('.walking-lottie'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets3.lottiefiles.com/packages/lf20_h4mjsyjz.json'
    })
    if (document.querySelectorAll(".no-post-lottie").length == 1){
        bodymovin.loadAnimation({
            container: document.querySelector(".no-post-lottie"),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets2.lottiefiles.com/packages/lf20_6aYlBl.json'
        })
        handleCreatePost()
    }
}
lottie()

function handleMainFrame(){
    Plyr.setup('video.player')
    replaceLinkName()
    handleMobileResponse()
    handleStars()
    handlePayment()

    function runningReward() {
        let rewardMoney = document.querySelectorAll(".usd-rw")
        let rewardFP = document.querySelectorAll(".fp-rw")
        for (let i = 0; i < rewardMoney.length; i++){
            const staticMoney = parseFloat(rewardMoney[i].textContent)
            let animationTimer = setInterval(function() {
                rewardMoney[i].textContent = (Math.round((Math.random() * (staticMoney - 0.00) + 0.00) * 100) / 100).toFixed(2)
            }, 50)
            setTimeout(function(){
                clearInterval(animationTimer)
                rewardMoney[i].textContent = staticMoney.toFixed(2)
            }, 800)
        }
        for (let i = 0; i < rewardFP.length; i++){
            const staticFP = parseFloat(rewardFP[i].textContent)
            let animationTimer = setInterval(function() {
                rewardFP[i].textContent = Math.round((Math.random() * (staticFP - 0) + 0))
            }, 50)
            setTimeout(function(){
                clearInterval(animationTimer)
                rewardFP[i].textContent = staticFP
            }, 800)
        }
    }
    runningReward()

    function handleOpenAudioMusic(){
        document.querySelectorAll("audio").forEach(function(e){
            e.muted = false
        })
        document.querySelectorAll(".bg-music .plyr__controls .plyr__controls__item:first-child").forEach(function(e){
            e.onclick = function(){
                const au = e.parentNode.parentNode.querySelector("audio")
                if (au.paused == false) {
                    document.querySelectorAll("audio").forEach(function(el){
                        if (au != el && el.paused == false) {
                            el.pause()
                        }
                    })
                }
            }
        })   
    }
    handleOpenAudioMusic()

    function handleFullscreen(){
        document.querySelectorAll("[data-plyr='fullscreen']").forEach(function(e){
            e.onclick = function(){
                fullscreen = !fullscreen
                if (e.parentNode.parentNode.querySelector("video").paused){
                    const playPromise = e.parentNode.parentNode.querySelector("video").play()
                    if (playPromise !== undefined) {
                        playPromise.then(_ => {
                        })
                        .catch(error => {
                        })
                    }
                }
                if (!fullscreen){
                    window.scrollTo(0, scrollPage)
                    if(window.innerWidth <= 662){
                        e.parentNode.parentNode.querySelector("video").style.maxHeight = "380px"
                        e.parentNode.parentNode.querySelector("video").style.objectFit = "cover"
                    }
                    else {
                        e.parentNode.parentNode.querySelector("video").style.maxHeight = "320px"
                        e.parentNode.parentNode.querySelector("video").style.objectFit = "contain"
                    }
                    document.querySelectorAll(".post").forEach(function (el) {
                        el.style.zIndex = 0
                    })
                    e.parentNode.parentNode.querySelector("video").style.zIndex = 0
                    if (document.querySelector(".nav-bar-mobile")){
                        document.querySelector(".nav-bar-mobile").style.zIndex = 1000
                    }
                    if (document.querySelector(".header")){
                        document.querySelector(".header").style.zIndex = 2000
                    }
                    if (document.querySelector(".category-frame")){
                        document.querySelector(".category-frame").style.zIndex = 1000
                    }
                    if (document.querySelector(".mobile-creator")){
                        document.querySelector(".mobile-creator").style.zIndex = 1000
                    }
                    if (document.querySelector(".left-nav")){
                        document.querySelector(".left-nav").style.zIndex = 1000
                    }
                    if (document.querySelector(".main-frame-post-sort")){
                        document.querySelector(".main-frame-post-sort").style.zIndex = 1000
                    }
                    // handleMainFrame()
                    // handleNavigation()
                    // handleRankPostCount()
                }
                else {
                    e.parentNode.parentNode.querySelector("video").style.maxHeight = "100%"
                    document.querySelectorAll(".post").forEach(function (el) {
                        if (el != e.parentNode.parentNode.parentNode.parentNode.parentNode){
                            el.style.zIndex = -1
                        }
                        else {
                            el.style.zIndex = 100000
                        }
                    })
                    e.parentNode.parentNode.querySelector("video").style.zIndex = 100000
                    e.parentNode.parentNode.querySelector("video").style.objectFit = "contain"
                    if (document.querySelector(".nav-bar-mobile")){
                        document.querySelector(".nav-bar-mobile").style.zIndex = 0
                    }
                    if (document.querySelector(".header")){
                        document.querySelector(".header").style.zIndex = 0
                    }
                    if (document.querySelector(".category-frame")){
                        document.querySelector(".category-frame").style.zIndex = 0
                    }
                    if (document.querySelector(".mobile-creator")){
                        document.querySelector(".mobile-creator").style.zIndex = 0
                    }
                    if (document.querySelector(".left-nav")){
                        document.querySelector(".left-nav").style.zIndex = 0
                    }
                    if (document.querySelector(".main-frame-post-sort")){
                        document.querySelector(".main-frame-post-sort").style.zIndex = 0
                    }
                }
            }
        }) 

        // document.querySelectorAll(".post-file").forEach(function(e){
        //     e.ondblclick = function(){
        //         if(e.querySelector("video").offsetWidth < window.innerWidth){
        //             e.querySelector("video").style.maxHeight = "100%"
        //             e.querySelector("video").style.zIndex = 10000
        //         }
        //         else {
        //             if(window.innerWidth <= 662){
        //                 e.querySelector("video").style.maxHeight = "380px"
        //                 e.querySelector("video").style.objectFit = "cover"
        //             }
        //             else {
        //                 e.querySelector("video").style.maxHeight = "320px"
        //                 e.querySelector("video").style.objectFit = "contain"
        //             }
        //             e.querySelector("video").style.zIndex = 500
        //         }
        //     }
        // }) 
    }
    handleFullscreen()

    handleToggle()

    function handleUrlDetect(){
        function urlify(text) {
            var urlRegex = /(https?:\/\/[^\s]+)/g;
            return text.replace(urlRegex, function(url) {
              return '<a href="' + url + '" class="theme-color" target="_blank">' + url + '</a>';
            })
        }
        
        const postDes = document.querySelectorAll(".post-description")
        for (let i = 0; i < postDes.length; i++){
            const postDesConvert = urlify(postDes[i].textContent)
            postDes[i].innerHTML = postDesConvert
        }
    }
    handleUrlDetect()

    function handleViewPost(){
        const mediaItem = document.querySelectorAll(".media-post")
        for (let i = 0; i < mediaItem.length; i++){
            mediaItem[i].onclick = function(){
                let post
                if (mediaItem[i].parentNode.classList.contains("thumb-file")){
                    post = mediaItem[i].parentNode.parentNode.parentNode.parentNode
                }
                else {
                    post = mediaItem[i].parentNode.parentNode.parentNode
                }
                const mediaPost = post.querySelectorAll(".media-post")
                for (let j = 0; j < mediaPost.length; j++){
                    if (mediaPost[j] == mediaItem[i]){
                        t = j
                    }
                }
                viewPostRedirect(t, post, true)
            }
        }
    }
    handleViewPost()

    function handleCategory(){
        if (document.querySelectorAll('.category-slidebar').length != 0 || navLink == ''){
            let clickValid = true
            if (document.querySelector('.category-slidebar')){
                const slider = document.querySelector('.category-slidebar')
                let isDown = false
                let startX
                let scrollLeft
                let clickBuf = 0
                slider.addEventListener('mousedown', (e) => {
                    isDown = true
                    startX = e.pageX
                    scrollLeft = slider.scrollLeft
                    clickBuf = 1
                })
                slider.addEventListener('mouseleave', () => {
                    isDown = false
                })
                slider.addEventListener('mouseup', (e) => {
                    isDown = false
                    if (clickBuf == 1){clickValid = true}
                    else {clickValid = false}
                })
                slider.addEventListener('mousemove', (e) => {
                    clickBuf += 1
                    document.querySelector(".category-slidebar").style.scrollBehavior = 'auto'
                    if(!isDown) return 
                    e.preventDefault()
                    const x = e.pageX
                    const walk = (startX - x) * 1
                    scrollRange = scrollLeft + walk
                    slider.scrollLeft = scrollRange
                })
    
                slider.addEventListener('touchstart', (e) => {
                    isDown = true
                    for (i=0; i < e.changedTouches.length; i++) {
                        startX = e.changedTouches[i].pageX
                        scrollLeft = slider.scrollLeft
                    }
                })
                slider.addEventListener('touchcancel', () => {
                    isDown = false
                })
                slider.addEventListener('touchend', (e) => {
                    isDown = false
                })
                slider.addEventListener('touchmove', (e) => {
                    document.querySelector(".category-slidebar").style.scrollBehavior = 'auto'
                    if(!isDown) return 
                    e.preventDefault()
                    for (i=0; i < e.changedTouches.length; i++) {
                        // const x = e.pageX
                        const x = e.changedTouches[i].pageX
                        const walk = (startX - x) * 1
                        scrollRange = scrollLeft + walk
                        slider.scrollLeft = scrollRange
                    }
                })
                
                if (document.querySelector(".arrow-to-left")){
                    document.querySelector(".arrow-to-left").onclick = function(){
                        document.querySelector(".category-slidebar").style.scrollBehavior = 'smooth'
                        if (scrollRange > 300){scrollRange -= 300}
                        else {scrollRange = 0}
                        slider.scrollLeft = scrollRange
                    }
                    document.querySelector(".arrow-to-right").onclick = function(){
                        document.querySelector(".category-slidebar").style.scrollBehavior = 'smooth'
                        const maxScrollLeft = slider.scrollWidth - slider.clientWidth
                        if (scrollRange < maxScrollLeft){scrollRange += 300}
                        else {scrollRange = maxScrollLeft}
                        slider.scrollLeft = scrollRange
                    }
                }
            }
            
            const category = document.querySelectorAll('.category-but')
            for (let i = 0; i < category.length; i++){
                if (category[i].classList.contains("active")){
                    statusRedirect = cateLink = category[i].getAttribute("topic-data")
                    cateName = category[i].querySelector(".category-item-name").textContent
                }
                category[i].onclick = function(e){
                    if (!clickValid){
                        e.preventDefault()
                    }
                    else {
                        categoryRedirect(category[i], true)
                    }
                }
            }
        }
    }
    handleCategory()

    commentPostHandle(false, false)
     
    function delPostHandle(){
        const delPost = document.querySelectorAll(".del-post")
        for (let i = 0; i < delPost.length; i++){
            delPost[i].onclick = function(){
                if (document.querySelectorAll(".del-post-modal").length == 0) {
                    const post = delPost[i].parentNode.parentNode.parentNode
                    post.insertAdjacentHTML("afterbegin", "<div class='modal del-post-modal'><div class='modal-content del-post-modal-content d-flex-col'><div class='mg-b-lg'><h2 class='d-flex'>Xóa video</h2><span>Bạn có chắc muốn xóa video này không? Điều này sẽ không thể hoàn tác và mọi người sẽ không còn thấy video này nữa.</span></div><div class='d-flex-sb'><button class='df-but bold-font width-40 destroy-but'>Hủy</button><button class='df-but bold-font danger-color white-color width-40 confirm-but'>Xóa</button></div></div></div>")
                    post.querySelector(".destroy-but").onclick = function(){
                        post.querySelector(".del-post-modal").remove()
                    }
                    post.querySelector(".confirm-but").onclick = function(){
                        let xhttp
                        if (window.XMLHttpRequest) {
                            xhttp = new XMLHttpRequest()
                        } else {
                            xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                        }
                        const data = {
                            dataPostDf: post.getAttribute("data-post-df")
                        }
                        post.querySelector(".modal").remove()
                        post.classList.add('post-remove-up')
                        postDisplayedList.splice(postDisplayedList.indexOf(data.dataPostDf), 1)
                        post.onanimationend = function() {
                            post.remove()
                            if (statusRedirect == ''){
                                if (document.querySelector(".frame-post-home")){
                                    competitionContentText = document.querySelector(".main-frame").innerHTML
                                }
                            }
                            else {
                                const mainWrap = '<div class="main-frame">' + competitionContentText + '</div>'
                                const parser = new DOMParser()
                                const home = parser.parseFromString(mainWrap, 'text/html')
                                if (home.querySelector(`.post[data-post-df='${data.dataPostDf}']`)){
                                    home.querySelector(`.post[data-post-df='${data.dataPostDf}']`).remove()
                                    competitionContentText = home.querySelector(".main-frame").innerHTML
                                    if (document.querySelector(".info-frame")){
                                        personalPostText = document.querySelector(".info-frame").innerHTML
                                    }
                                }
                            }
                            handleRankPostCount()
                        }
                        xhttp.open("POST", "/del-post", true)
                        xhttp.setRequestHeader('Content-Type', 'application/json')
                        xhttp.send(JSON.stringify(data))
                    }
                }
            }
        }
    }
    delPostHandle()
    
    function likePostHandle(){
        const likePost = document.querySelectorAll(".like-but")
        for (let i = 0; i < likePost.length; i++){
            likePost[i].onclick = function(){
                let xhttp
                if (window.XMLHttpRequest) {
                    xhttp = new XMLHttpRequest()
                } else {
                    xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                }
                const data = {
                    dataPostDf: likePost[i].parentNode.parentNode.getAttribute("data-post-df"),
                }
                const interactiveTotal = likePost[i].parentNode.parentNode.querySelector(".interactive-but-total")
                let likeTotal
                if (interactiveTotal.textContent == ''){
                    likeTotal = 0
                } else {
                    likeTotal = parseInt(interactiveTotal.textContent)
                }
                if (likePost[i].getAttribute("data-liked") != "true"){
                    data.liked = true
                    likePost[i].classList.add("interactive-but-liked")
                    likePost[i].setAttribute("data-liked", "true")
                    if (likeTotal == 0) {interactiveTotal.innerHTML = `<span class="iconify vote-icon mg-r-sm" data-icon="ic:twotone-how-to-vote" data-inline="false"></span></span><span class="like-total">${likeTotal + 1}</span>`}
                    else {likePost[i].parentNode.parentNode.querySelector(".like-total").innerHTML = likeTotal + 1}
                }
                else {
                    data.liked = false
                    likePost[i].classList.remove("interactive-but-liked")
                    likePost[i].setAttribute("data-liked", "false")
                    if (likeTotal - 1 != 0){
                        if (likeTotal != 1) {likePost[i].parentNode.parentNode.querySelector(".like-total").innerHTML = likeTotal - 1}
                        else {interactiveTotal.innerHTML = `<span class="iconify vote-icon mg-r-sm" data-icon="ic:twotone-how-to-vote" data-inline="false"></span></span><span class="like-total">${likeTotal - 1}</span>`}
                    } else {
                        interactiveTotal.innerHTML = ''
                    }
                }
                xhttp.onreadystatechange = function(){
                    if (xhttp.readyState == 4 && xhttp.status == 200){
                        const res = JSON.parse(xhttp.responseText)
                        if (res.data.total != 0){
                            likePost[i].parentNode.parentNode.querySelector(".like-total").innerHTML = res.data.total
                            if (res.data.total == 10 || res.data.total == 50 || res.data.total == 100 || res.data.total == 500 || res.data.total == 1000 || res.data.total % 1000 == 0){
                                handleNotification("vote", [`${res.data.postId}`, `${res.data.total}`])
                            }
                            handleNotification("like", [`${res.data.postId}`, `${res.data.total}`])
                        } else {
                            interactiveTotal.innerHTML = ''
                        }
                        const postId = likePost[i].parentNode.parentNode.getAttribute("data-post-df")
                        const postInner = likePost[i].parentNode.parentNode.innerHTML
                        const mainWrap = '<div class="main-frame">' + competitionContentText + '</div>'
                        const parser = new DOMParser()
                        const home = parser.parseFromString(mainWrap, 'text/html')
                        if (home.querySelector(`.post[data-post-df='${postId}']`) && !window.location.href.includes("/post")){
                            home.querySelector(`.post[data-post-df='${postId}']`).innerHTML = postInner
                            competitionContentText = home.querySelector(".main-frame").innerHTML
                            if (document.querySelector(".info-frame")){
                                personalPostText = document.querySelector(".info-frame").innerHTML
                            }
                        }
                    }
                }
                xhttp.open("POST", "/like-post", true)
                xhttp.setRequestHeader('Content-Type', 'application/json')
                xhttp.send(JSON.stringify(data))
            }
        }
    }
    likePostHandle()

    function copyLinkPostHandle(){
        const copyToClipboard = function(str) {
            const el = document.createElement('input')
            el.value = str
            document.body.appendChild(el)
            el.select()
            el.setSelectionRange(0, 99999)
            document.execCommand('copy')
            document.body.removeChild(el)
        }
        const copyBut = document.querySelectorAll(".copy-link-post")
        for (let i = 0; i < copyBut.length; i++){
            copyBut[i].onclick = function(){
                const post = this.parentNode.parentNode.parentNode
                const link = "https://fodance.com/post/" + post.getAttribute("data-post-df")
                copyToClipboard(link)
            }
        }
    }
    copyLinkPostHandle()

    function followPostUserHandle(){
        const followPostbut = document.querySelectorAll(".follow-post-user")
        for (let i = 0; i < followPostbut.length; i++){
            const post = followPostbut[i].parentNode.parentNode.parentNode
            handleFollow(followPostbut[i], post, post.querySelector(".avt-username").textContent)  
        }
    }
    followPostUserHandle()

    function noticePostHandle(){
        function doNotice(noticeBut){
            let xhttp
            if (window.XMLHttpRequest) {
                xhttp = new XMLHttpRequest()
            } else {
                xhttp = new ActiveXObject("Microsoft.XMLHTTP")
            }
            const data = {
                dataPostDf: noticeBut.parentNode.parentNode.parentNode.getAttribute("data-post-df")
            }
            xhttp.onreadystatechange = function() {    
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    const res = JSON.parse(xhttp.responseText)
                    if (res.status == "post-notice-removed") {
                        noticeBut.classList.remove("remove-post-notice")
                        noticeBut.classList.add("post-notice")
                        noticeBut.innerHTML = '<span class="iconify" data-icon="clarity:bell-outline-badged" data-inline="false"></span>Bật thông báo bình chọn'
                        if (document.querySelector(".frame-post-home")){
                            competitionContentText = document.querySelector(".main-frame").innerHTML
                        }
                        showAlert("Đã tắt thông báo bình chọn!")
                    }
                    else {
                        noticeBut.classList.remove("post-notice")
                        noticeBut.classList.add("remove-post-notice")
                        noticeBut.innerHTML = '<span class="iconify" data-icon="ph:bell-simple-slash" data-inline="false"></span>Tắt thông báo bình chọn'
                        if (document.querySelector(".frame-post-home")){
                            competitionContentText = document.querySelector(".main-frame").innerHTML
                        }
                        showAlert("Đã bật thông báo bình chọn!")
                    }
                } 
            }
            xhttp.open("POST", '/notice-post', true)
            xhttp.setRequestHeader('Content-Type', 'application/json')
            xhttp.send(JSON.stringify(data))
        }

        const noticebut = document.querySelectorAll(".post-notice")
        for (let i = 0; i < noticebut.length; i++){
            noticebut[i].onclick = function(){
                doNotice(this)
            }
        }
        const removeNoticeBut = document.querySelectorAll(".remove-post-notice")
        for (let i = 0; i < removeNoticeBut.length; i++){
            removeNoticeBut[i].onclick = function(){
                doNotice(this)
            }
        }
    }
    noticePostHandle()
    
    function savePostHandle(){
        function doSave(saveBut){
            let xhttp
            if (window.XMLHttpRequest) {
                xhttp = new XMLHttpRequest()
            } else {
                xhttp = new ActiveXObject("Microsoft.XMLHTTP")
            }
            const data = {
                post: saveBut.parentNode.parentNode.parentNode.getAttribute("data-post-df")
            }
            xhttp.onreadystatechange = function() {    
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    const res = JSON.parse(xhttp.responseText)
                    if (res.status == "post-save-removed") {
                        saveBut.classList.remove("remove-save-post")
                        saveBut.classList.add("save-post")
                        saveBut.innerHTML = "<span class='iconify' data-icon='bi:bookmark-plus' data-inline='false'></span>Lưu bài viết"
                        postContentText = document.querySelector(`.post[data-post-df='${data.post}']`).outerHTML
                        if (navLink == 'saved'){
                            document.querySelector(`.post[data-post-df='${data.post}']`).remove()
                        }
                        showAlert("Đã bỏ lưu video!")
                    }
                    else {
                        saveBut.classList.remove("save-post")
                        saveBut.classList.add("remove-save-post")
                        saveBut.innerHTML = '<span class="iconify" data-icon="bi:bookmark-dash" data-inline="false"></span>Bỏ lưu bài viết'
                        postContentText = document.querySelector(`.post[data-post-df='${data.post}']`).outerHTML
                        if (document.querySelector(".frame-post-home")){
                            competitionContentText = document.querySelector(".main-frame").innerHTML
                        }
                        showAlert("Đã lưu video!")
                    }
                } 
            }
            xhttp.open("POST", '/save-post', true)
            xhttp.setRequestHeader('Content-Type', 'application/json')
            xhttp.send(JSON.stringify(data))
        }

        const saveButs = document.querySelectorAll(".save-post")
        for (let i = 0; i < saveButs.length; i++){
            saveButs[i].onclick = function(){
                doSave(this)
            }
        }
        const removeSaveButs = document.querySelectorAll(".remove-save-post")
        for (let i = 0; i < removeSaveButs.length; i++){
            removeSaveButs[i].onclick = function(){
                doSave(this)
            }
        }
    }
    savePostHandle()

    function sharePostHanle(){
        const shareBut = document.querySelectorAll(".share-but")
        for (let i = 0; i < shareBut.length; i++){
            shareBut[i].onclick = function(){
                const postLink = "https://fodance.com/post/" + shareBut[i].parentNode.parentNode.getAttribute("data-post-df")
                const content = shareBut[i].parentNode.parentNode.querySelector(".post-description").textContent
                if (!this.querySelector(".social-share")){
                    this.insertAdjacentHTML("beforeend", `
                    <div class="social-share d-flex-col-start pd-t pd-b">
                        <div class="fb-share-button social-share-item pd" data-href="${postLink}" data-layout="button" data-size="large">
                            <a class="d-flex-start" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Ffodance.com%2Fpost%2F${shareBut[i].parentNode.parentNode.getAttribute("data-post-df")}" aria-label="${content}" class="fb-xfbml-parse-ignore"><span class="iconify share-icon share-fb-icon mg-r" data-icon="fa-brands:facebook" data-inline="false"></span>Chia sẻ với Facebook
                            </a>
                        </div>
                        <div class="social-share-item pd">
                            <a class="twitter-share-button d-flex-start" href="https://twitter.com/intent/tweet?text=${postLink} Tôi đang tham gia Vòng đấu trên Lingyo, hãy bình chọn cho tôi nhé!">
                                <span class="iconify share-icon share-twitter-icon mg-r" data-icon="entypo-social:twitter-with-circle" data-inline="false"></span>Chia sẻ với Twitter
                            </a>
                        </div>
                        <div class="social-share-item pd">
                            <a class="d-flex-start" href="https://api.whatsapp.com/send?phone&text=${postLink} Tôi đang tham gia Vòng đấu trên Lingyo, hãy bình chọn cho tôi nhé!" target="_blank">
                                <span class="iconify share-icon share-whatsapp-icon mg-r" data-icon="whh:whatsapp" data-inline="false"></span>Chia sẻ với Whatsapp                                 
                            </a> 
                        </div>
                    </div>`)
                    document.addEventListener('mouseup', function(e) {
                        const container = document.querySelector(".social-share")
                        if (container && !container.contains(e.target)) {
                          container.remove()
                        }
                    })
                }
            }
        }
    }
    sharePostHanle()

    function handleSortContent(){
        const sortItem = document.querySelectorAll(".sort-content-but")
        function handleSortAjax(item, filter){
            let xhttp
            if (window.XMLHttpRequest) {
                xhttp = new XMLHttpRequest()
            } else {
                xhttp = new ActiveXObject("Microsoft.XMLHTTP")
            }
            window.scrollTo(0, 0)
            stopScrollPage = 0
            rankIndex = 5
            const data = {
                category: cateLink,
                filter: filter,
                rankLink: rankLink,
                rankName: rankName
            }
            cateSort = item.getAttribute("sort-data")
            if(window.innerWidth <= 662){
                if (cateSort == "rank-sort-content"){sortType = "Thứ hạng"}
                if (cateSort == "latest-sort-content"){sortType = "Mới nhất"}
                if (cateSort == "random-sort-content"){sortType = "Ngẫu nhiên"}
                if (cateSort == "follow-sort-content"){sortType = "Theo dõi"}
                showAlertCateRank("Xem theo " + sortType)
            }
            document.querySelector(".post-frame").innerHTML = '<div class="loading-post"><div class="d-flex-start loading-content"><div class="loading-post-circle mg-r"></div><div class="d-flex-col-start-content width-80"><div class="loading-post-line width-30 mg-b-sm"></div><div class="loading-post-line width-20"></div></div></div><div class="loading-post-line width-90 mg-b-sm"></div></div></div>'
            xhttp.onreadystatechange = function() {    
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    const parser = new DOMParser()
                    const page = parser.parseFromString(xhttp.responseText, 'text/html')
                    const contentText = page.querySelector(".post-frame").innerHTML
                    document.querySelector(".post-frame").innerHTML = contentText
                    if (document.querySelectorAll(".post").length != 0){
                        const posts = document.querySelectorAll(".post")
                        postDisplayedList = []
                        param = ''
                        for (let i = 0; i < posts.length; i++){
                            if (posts[i].getAttribute("data-post-df")){
                                postDisplayedList.push(posts[i].getAttribute("data-post-df"))
                            }
                        }
                    }
                    handleMainFrame()
                    handleNavigation()
                } 
            }
            xhttp.open("POST", '/' + cateSort, true)
            xhttp.setRequestHeader('Content-Type', 'application/json')
            xhttp.send(JSON.stringify(data))
        }

        for(let i = 0; i < sortItem.length; i++){
            sortItem[i].onclick = function(){
                // if (cateLink != 'competition'){
                    for (let i = 0; i < sortItem.length; i++){
                        sortItem[i].classList.remove("sort-content-but-active")
                    }
                    sortItem[i].classList.add("sort-content-but-active")
                    handleSortAjax(sortItem[i], "current")
                    // if (document.querySelector(".current-filter").classList.contains("theme-color")){
                    //     handleSortAjax(sortItem[i], "current")
                    //     if (filter == "all"){
                    //         if (document.querySelector(".current-filter").classList.contains("theme-color")){
                    //             document.querySelector(".current-filter").classList.remove("theme-color")
                    //         }
                    //         if (!document.querySelector(".all-filter").classList.contains("theme-color")){
                    //             document.querySelector(".all-filter").classList.add("theme-color")
                    //         }
                    //     }
                    // }
                    // if (document.querySelector(".all-filter").classList.contains("theme-color")){
                    //     if (sortItem[i].getAttribute("sort-data") == "rank-sort-content"){
                    //         handleSortAjax(sortItem[i], "current")
                    //         if (document.querySelector(".all-filter").classList.contains("theme-color")){
                    //             document.querySelector(".all-filter").classList.remove("theme-color")
                    //         }
                    //         if (!document.querySelector(".current-filter").classList.contains("theme-color")){
                    //             document.querySelector(".current-filter").classList.add("theme-color")
                    //         }
                    //     }
                    //     else {
                    //         handleSortAjax(sortItem[i], "all")
                    //     }
                    // }
                // }
                // else {
                //     showAlert("Chỉ áp dụng cho Thể loại!")
                // }
            }
        }
        // if (document.querySelector(".filter-but")){
        //     if (cateLink == 'competition'){
        //         document.querySelector(".filter-but").onclick = function(){
        //             if (this.querySelectorAll(".sort-notify-alert").length == 0){
        //                 showAlert("Lọc chỉ áp dụng cho Thể loại!")
        //             }
        //         }
        //     }
        //     else {
        //         let item
        //         for(let i = 0; i < sortItem.length; i++){
        //             if (sortItem[i].classList.contains("sort-content-but-active")){
        //                 item = sortItem[i]
        //             }
        //         }
        //         document.querySelector(".current-filter").onclick = function(){
        //             filter = "current"
        //             if (document.querySelector(".all-filter").classList.contains("theme-color")){
        //                 document.querySelector(".all-filter").classList.remove("theme-color")
        //             }     
        //             if (!document.querySelector(".current-filter").classList.contains("theme-color")){
        //                 document.querySelector(".current-filter").classList.add("theme-color")
        //             } 
        //             handleSortAjax(item, filter)
        //         }
        //         document.querySelector(".all-filter").onclick = function(){
        //             filter = "all"
        //             if (document.querySelector(".current-filter").classList.contains("theme-color")){
        //                 document.querySelector(".current-filter").classList.remove("theme-color")
        //             }
        //             if (!document.querySelector(".all-filter").classList.contains("theme-color")){
        //                 document.querySelector(".all-filter").classList.add("theme-color")
        //             }
        //             if (item.getAttribute("sort-data") == "rank-sort-content"){
        //                 const but = document.querySelector(".sort-content-but[sort-data='random-sort-content']")
        //                 document.querySelector(".sort-content-but[sort-data='random-sort-content']").classList.add("sort-content-but-active")
        //                 document.querySelector(".sort-content-but[sort-data='rank-sort-content']").classList.remove("sort-content-but-active")
        //                 handleSortAjax(but, filter)
        //             }
        //             else {
        //                 handleSortAjax(item, filter)
        //             }
        //         }
        //     }
        // }
    }
    handleSortContent()

    function handleVideoScroll(){
        const vds = document.querySelectorAll("video.player")    
        const v = document.querySelectorAll(".post-file")
        let buf = -1, playTime = [], interval = null
        for (let i = 0; i < v.length; i++){
            if (v[i].querySelectorAll(".plyr").length != 0){
                v[i].querySelector(".plyr").querySelector(".plyr__controls").querySelector(".plyr__volume").querySelector("button").onclick = function(){
                    if (v[i].querySelector(".plyr").querySelector(".plyr__controls").querySelector(".plyr__volume").querySelector(".plyr__control--pressed") != null){
                        v[i].querySelector("video").muted = false
                        openVolume = true
                    }
                    else {
                        openVolume = false
                        v[i].querySelector("video").muted = true
                    }
                }
                if (v[i].querySelector(".plyr").querySelector(".plyr__controls").querySelector(".plyr__volume").querySelector("input")){
                    v[i].querySelector(".plyr").querySelector(".plyr__controls").querySelector(".plyr__volume").querySelector("input").onclick = function(){
                        if (v[i].querySelector(".plyr").querySelector(".plyr__controls").querySelector(".plyr__volume").querySelector(".plyr__control--pressed") == null){
                            openVolume = true
                        }
                        else {
                            openVolume = false
                        }
                    }
                }
                v[i].onclick = function(){
                    const video = v[i].querySelector(".plyr").querySelector(".plyr__video-wrapper").querySelector("video")
                    if (video && video.paused){
                        for (let j = 0; j < vds.length; j++){
                            if (v[i].parentElement.parentElement.getAttribute("data-post-df") == vds[j].parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("data-post-df")){
                                paused[j] = true
                            }
                        }
                    }
                    else {
                        for (let j = 0; j < vds.length; j++){
                            if (v[i].parentElement.parentElement.getAttribute("data-post-df") == vds[j].parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("data-post-df")){
                                paused[j] = false
                            }
                        }
                    }
                }
            }
        }
        for (let i = 0; i < vds.length; i++){
            vds[i].muted = true
        }

        function elementInViewport2(el) {
            if (el){
                var top = el.offsetTop
                var left = el.offsetLeft
                var width = el.offsetWidth
                var height = el.offsetHeight
            
                while(el.offsetParent) {
                el = el.offsetParent
                top += el.offsetTop
                left += el.offsetLeft
                }
            
                return (
                    top < (window.pageYOffset + window.innerHeight) &&
                    left < (window.pageXOffset + window.innerWidth) &&
                    (top + height) > window.pageYOffset &&
                    (left + width) > window.pageXOffset
                )
            }
            else {return false}
        }

        function countVideoViews(post){
            let xhttp
            if (window.XMLHttpRequest) {
                xhttp = new XMLHttpRequest()
            } else {
                xhttp = new ActiveXObject("Microsoft.XMLHTTP")
            }
            const data = {
                post: post
            }
            xhttp.open("POST", '/video-count-scription', true)
            xhttp.setRequestHeader('Content-Type', 'application/json')
            xhttp.send(JSON.stringify(data))
        }

        if (elementInViewport2(vds[0])) {
            const playPromise = vds[0].play()
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                })
                .catch(error => {
                })
            }
            if (openVolume) {
                vds[0].muted = false
            }
            if (!playTime[0]){playTime[0] = 0}
            if (interval){clearInterval(interval)}
            interval = setInterval(function(){
                if (elementInViewport2(vds[0]) && document.querySelector("video.player") && !paused[0] && buf != -1) {
                    playTime[0] ++
                    if ((playTime[0] >= 15 || playTime[0] >= document.querySelectorAll("video.player")[0].duration) && !videoAjaxSend[0]){
                        countVideoViews(document.querySelectorAll("video.player")[buf].parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-post-df"))
                        videoAjaxSend[0] = true
                    }
                }
            }, 1000)
        }
        window.addEventListener('scroll', function(){
            for (let i = 0; i < vds.length; i++){
                let cd = vds[i].getBoundingClientRect()
                if (cd.bottom < window.innerHeight && cd.bottom != 0) {buf = i}
                if (cd.top < 0 || (vds.length == 1 && cd.bottom > window.innerHeight) || cd.bottom == 0) {buf = -1}
            }
            for (let j = 0; j < vds.length; j++){
                if (buf != j){
                    vds[j].pause()
                    vds[j].muted = true
                }
                else {
                    if (!paused[buf]) {
                        if (vds[buf].paused){
                            const playPromise = vds[buf].play()
                            if (playPromise !== undefined) {
                                playPromise.then(_ => {
                                })
                                .catch(error => {
                                })
                            }
                            if (openVolume) {
                                vds[buf].muted = false
                            }
                            if (!playTime[buf]){playTime[buf] = 0}
                            if (interval){clearInterval(interval)}
                            interval = setInterval(function(){
                                if (buf != -1 && document.querySelector("video.player") && !paused[buf]){
                                    playTime[buf] ++
                                    if ((playTime[buf] >= 15 || playTime[buf] >= document.querySelectorAll("video.player")[buf].duration) && !videoAjaxSend[buf]){
                                        countVideoViews(document.querySelectorAll("video.player")[buf].parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-post-df"))
                                        videoAjaxSend[buf] = true
                                    }
                                }
                            }, 1000)
                        }
                    }
                }
            }
        })
    }
    handleVideoScroll()

    if (document.querySelectorAll(".post-section").length != 0 && document.querySelectorAll(".post-section .post").length < 5 && document.querySelector(".loading-post")) {
        if (!document.querySelector(".post-section .post") && !document.querySelector(".category")){
            document.querySelector(".loading-post").style.marginTop = "0px"
        }
        if (window.location.pathname != "/saved"){
            const cateTitle = window.location.pathname.replace('/', '')
            if (cateTitle == 'competition'){cname = "Tất cả"}
            if (navLink == '' && !cateList.includes(cateTitle) && cateTitle != 'competition') {cname = ''}else {cname = cateName}
            if (roundType == "final") {
                document.querySelector(".loading-post").innerHTML = `<div class="no-post-text"><div>Oops! Mọi người đang chuẩn bị!</div>Nếu bạn đã nằm trong Top những người chiến thắng Vòng bảng, bạn sẽ tham gia bình chọn Vòng chung kết tại đây!${cname}!</div><div class="no-post-lottie"></div><button class="create-post-but" data-create-but="layout">Tạo video tham dự!</button>`
                lottie()
            }
            else {
                document.querySelector(".loading-post").innerHTML = `<div class="no-post-text">Oops! Mọi người đang chuẩn bị ở ${cname}!</div><div class="no-post-lottie"></div><button class="create-post-but" data-create-but="layout">Tham dự!</button>`
                lottie()
            }
        }
        else {
            document.querySelector(".loading-post").innerHTML = '<div class="no-post-text">Oops! Bạn không còn video nào đang lưu!</div><div class="no-post-lottie"></div>'
            lottie()
        }
        if (document.querySelector(".info-personal")) {
            document.querySelector(".loading-post").innerHTML = `<div class="no-post-text">Oops! Không còn video nào!${cateName}!</div><div class="no-post-lottie"></div><button class="create-post-but" data-create-but="layout">Be The First!</button>`
            lottie()
        }
        stopScrollPage = 1
    }
}
handleMainFrame()

function handleScroll(){
    function handleMainInfoScroll(){
        let scrollPos = 0
        window.addEventListener('scroll', function(){
            if (document.querySelectorAll(".main-info-inner").length != 0){
                if (pageYOffset > scrollPos){
                    document.querySelector(".main-info-inner").scrollTop = document.querySelector(".main-info-inner").scrollTop + (pageYOffset - scrollPos)
                }
                else {
                    document.querySelector(".main-info-inner").scrollTop = document.querySelector(".main-info-inner").scrollTop - (scrollPos - pageYOffset)
                }
                scrollPos = pageYOffset
            }
        })
    }
    handleMainInfoScroll()
    
    function handlePageScroll(){
        let ajaxCall = false
        let savedView = false
        let main = document.querySelector(".main")
        window.addEventListener('scroll', function(){
            if (navLink == 'competition' || window.location.pathname.replace('/', '') == "competition" || cateList.includes(window.location.pathname.replace('/', ''))){
                if (Math.round(window.pageYOffset) > 0 || Math.round(document.documentElement.scrollTop) > 0){
                    scrollPage = Math.round(window.pageYOffset) || Math.round(document.documentElement.scrollTop)
                }
            }
            let contentHeight = main.offsetHeight
            let y = Math.ceil(window.pageYOffset) + window.innerHeight
            if (document.querySelector(".loading-post") && document.querySelector(".no-post-text") && document.querySelector(".no-post-text").textContent != ''){
                stopScrollPage = 1
            }
            else {
                stopScrollPage = 0
            }
            if (y >= contentHeight - 100 && stopScrollPage == 0 && ajaxCall == false  && document.querySelector(".main-frame").querySelectorAll(".frame-post-content").length != 0) {
                let xhttp
                if (window.XMLHttpRequest) {
                    xhttp = new XMLHttpRequest()
                } else {
                    xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                }
                if (window.location.pathname == "/saved"){savedView = true}
                const data = {
                    category: cateLink,
                    cateSort: cateSort,
                    postDisplayedList: postDisplayedList,
                    param: param,
                    rankLink: rankLink,
                    savedView: savedView
                }
                ajaxCall = true
                xhttp.onreadystatechange = function() {
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        ajaxCall = false
                        const res = JSON.parse(xhttp.responseText)
                        if (res.status == "done" && stopScrollPage == 0){
                            if (postDisplayedList.length <= res.data.total){
                                for (let i = 0 ; i < res.data.limit; i++){
                                    rankIndex ++
                                    postDisplayedList.push(res.data.posts[i].postId)
                                    if (document.querySelectorAll(".post-section").length != 0){
                                        document.querySelector(".post-section").insertAdjacentHTML("beforeend", `
                                        <div class='post' data-post-df='${res.data.posts[i].postId}'>
                                        ${(()=>{if(res.data.rank){if (rankIndex > 3 && rankIndex <= 10){return `<div class="ranking"><span>${rankIndex}th</span></div>`} else{return ''}} else{return ''}})()}
                                        <div class='post-util'><button class='avt-but header-but dropdown-but util-dropdown-but'><span class='iconify dropdown-icon bg-white' data-icon='vaadin:ellipsis-dots-h' data-inline='false'></span></button><div class='util-dropdown-content dropdown-content'>${(() => {if(!res.data.saved[i]) {return "<a class='nav-item save-post'><span class='iconify' data-icon='bi:bookmark-plus' data-inline='false'></span>Lưu bài viết</a>"} else {return '<a class="nav-item remove-save-post"><span class="iconify" data-icon="bi:bookmark-dash" data-inline="false"></span>Bỏ lưu bài viết</a>'}})()}${(() => {if(!res.data.notice[i]) {return '<a class="nav-item post-notice"><span class="iconify" data-icon="clarity:bell-outline-badged" data-inline="false"></span>Bật thông báo bình chọn</a>'} else {return '<a class="nav-item remove-post-notice"><span class="iconify" data-icon="ph:bell-simple-slash" data-inline="false"></span>Tắt thông báo bình chọn</a>'}})()}<a class="nav-item copy-link-post"><span class="iconify" data-icon="clarity:copy-line" data-inline="false"></span>Sao chép liên kết</a>${(() => {if(res.data.userId != res.data.posts[i].userId) {if (!res.data.followed[i]){return `<a class="nav-item follow-post-user" data-following="false"><span class="iconify" data-icon="simple-line-icons:user-following" data-inline="false"></span><span class="follow-text mg-r-sm">Theo dõi</span> ${(()=>{if(res.data.postUsername && res.data.postUsername[i]) {return res.data.postUsername[i]} else {return res.data.posts[i]['user.username']}})()}</a>`} else {return `<a class="nav-item follow-post-user" data-following="true"><span class="iconify" data-icon="simple-line-icons:user-following" data-inline="false"></span><span class="follow-text mg-r-sm">Bỏ theo dõi</span> ${(()=>{if(res.data.postUsername && res.data.postUsername[i]) {return res.data.postUsername[i]} else {return res.data.posts[i]['user.username']}})()}</a>`}}else {return "<a class='nav-item del-post'><span class='iconify' data-icon='bx:bx-hide' data-inline='false'></span>Xóa bài viết</a>"}})()}</div></div><div class='post-user'><div class='post-info'><a class='avt nav-red' nav-data='personal' data-user-df="${res.data.postProfile[i].nickname}"> ${(()=>{if (res.data.postProfile[i].avatar.includes("http")) {return `<img src="${res.data.postProfile[i].avatar}" class="user-avt" username="${(()=>{if(res.data.postUsername && res.data.postUsername[i]) {return res.data.postUsername[i]} else {return res.data.posts[i]['user.username']}})()}">`}else {return `<img src="https://cdn.fodance.com/fd-media/${res.data.postProfile[i].avatar}" class="user-avt" username="${(()=>{if(res.data.postUsername && res.data.postUsername[i]) {return res.data.postUsername[i]} else {return res.data.posts[i]['user.username']}})()}">`}})()}</a><div class='avt-info'><div class="d-flex"><a class='avt nav-red' nav-data='personal' data-user-df="${res.data.postProfile[i].nickname}">${(() => {if(res.data.userId == res.data.posts[i].userId) {return "<span class='avt-username user-username'>"}else {return "<span class='avt-username'>"}})()}${(()=>{if(res.data.postUsername && res.data.postUsername[i]) {return res.data.postUsername[i]} else {return res.data.posts[i]['user.username']}})()}</span></a>
                                        ${(()=>{if(res.data.postPtofile[i].auth){return '<span class="iconify mg-l-sm mg-t-sm theme-color verified" data-icon="ic:round-verified"></span>'}else{return ''}})()}
                                        <div class='mark-icon'></div>
                                        <a class='avt nav-red' nav-data='personal' data-user-df="${res.data.postProfile[i].nickname}">${(() => {if(res.data.userId == res.data.posts[i].userId) {return "<span class='post-time nickname-content'>"}else {return "<span class='post-time'>"}})()}@${res.data.postProfile[i].nickname}</span></a>
                                        <div class='mg-l d-flex'><span class='contact-item'></span><a class='avt'><span class='post-time'>${(() => {if ((Date.now() - Date.parse(res.data.posts[i].time))/1000 < 5) {return `<span class="theme-color">Vừa xong</span>`} else if((Date.now() - Date.parse(res.data.posts[i].time))/1000 > 5 && (Date.now() - Date.parse(res.data.posts[i].time))/1000 < 60) {return `<span class="theme-color">${Math.floor((Date.now() - Date.parse(res.data.posts[i].time))/1000)} giây</span>`} else if ((Date.now() - Date.parse(res.data.posts[i].time))/1000/60 >= 1 && (Date.now() - Date.parse(res.data.posts[i].time))/1000/60 < 60){return `<span class="theme-color">${Math.floor((Date.now() - Date.parse(res.data.posts[i].time))/1000/60)} phút</span>`} else if ((Date.now() - Date.parse(res.data.posts[i].time))/1000/3600 >= 1 && (Date.now() - Date.parse(res.data.posts[i].time))/1000/3600 < 24){return `${Math.floor((Date.now() - Date.parse(res.data.posts[i].time))/1000/3600)} giờ`} else if ((Date.now() - Date.parse(res.data.posts[i].time))/1000/3600/24 >= 1 && (Date.now() - Date.parse(res.data.posts[i].time))/1000/3600/24 < 8){return `${Math.floor((Date.now() - Date.parse(res.data.posts[i].time))/1000/3600/24)} ngày`} else if ((Date.now() - Date.parse(res.data.posts[i].time))/1000/3600/24 >= 8) {return `${new Date(res.data.posts[i].time).getDate() + " tháng " + (new Date(res.data.posts[i].time).getMonth() + 1) + " lúc " + new Date(res.data.posts[i].time).getHours() + ':' + new Date(res.data.posts[i].time).getMinutes()}`}})()}</span></a></div></div>
                                        <div class='post-description'>${res.data.posts[i].description} - đã tham gia #${res.data.posts[i].category}</div>
                                        </div></div></div><div class='post-content'>${(() => {if(res.data.posts[i].file) {if(res.data.posts[i].file.type == 'video'){return `<div class='post-file'><video class='player media-post post-video' poster="/public/images/poster.png" src="https://cdn.fodance.com/fd-media/${res.data.posts[i].file.path}"></video></div>`}else{if (res.data.posts[i].file.path.length == 1) {return `<div class='post-file'><img src="https://cdn.fodance.com/fd-media/${res.data.posts[i].file.path[0]}" class='media-post post-image'></div>`}if (res.data.posts[i].file.path.length == 2) {return `<div class='post-file thumb-2-files'><div class='thumb-file'><img src="https://cdn.fodance.com/fd-media/${res.data.posts[i].file.path[0]}" class='media-post post-image'></div><div class='thumb-file'><img src="https://cdn.fodance.com/fd-media/${res.data.posts[i].file.path[1]}" class='media-post post-image'></div></div>`}if (res.data.posts[i].file.path.length == 3) {return `<div class='post-file thumb-3-files'><div class='thumb-file'><img src="https://cdn.fodance.com/fd-media/${res.data.posts[i].file.path[0]}" class='media-post post-image'></div><div class='thumb-file'><img src="https://cdn.fodance.com/fd-media/${res.data.posts[i].file.path[1]}" class='media-post post-image'></div><div class='thumb-file'><img src="https://cdn.fodance.com/fd-media/${res.data.posts[i].file.path[2]}" class='media-post post-image'></div></div>`}if (res.data.posts[i].file.path.length == 4) {return `<div class='post-file thumb-4-files'><div class='thumb-file'><img src="https://cdn.fodance.com/fd-media/${res.data.posts[i].file.path[0]}" class='media-post post-image'></div><div class='thumb-file'><img src="https://cdn.fodance.com/fd-media/${res.data.posts[i].file.path[1]}" class='media-post post-image'></div><div class='thumb-file'><img src="https://cdn.fodance.com/fd-media/${res.data.posts[i].file.path[2]}" class='media-post post-image'></div><div class='thumb-file'><img src="https://cdn.fodance.com/fd-media/${res.data.posts[i].file.path[3]}" class='media-post post-image'></div></div>`}}} else {return ''}})()}</div><div class="d-flex-sb pd-l-lg pd-r-lg"><div class="interactive-but-total d-flex vote-total">${(() => {if (res.data.posts[i].like != 0) {return `<span class="iconify vote-icon mg-r-sm" data-icon="ic:twotone-how-to-vote" data-inline="false"></span></span><span class="like-total">${res.data.posts[i].like.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>`} else {return ''}})()}</div>${(() => {if (res.data.posts[i].file && res.data.posts[i].file.type == 'video') {return `<div class="video-views"><span class="view-total">${res.data.posts[i].videoViews}</span><span> lượt xem</span></div>`} else {return ''}})()}</div><div class="border-b mg-t-sm mg-b-sm mg-r-lg mg-l-lg"></div><div class='post-interactive'>${(() => {if(res.data.postLiked[i]) { return `<button class="interactive-but like-but interactive-but-liked" data-liked="true">`} else {return `<button class="interactive-but like-but" data-liked="false">`}})()}<span class="iconify font-size-lg-5" data-icon="ant-design:heart-twotone"></span><span>Bình chọn</span></button><button class="interactive-but comment-but"><span class="iconify font-size-lg-1" data-icon="bi:chat-square" data-inline="false"></span><span>Bình luận ${(() => {if(res.data.posts[i].comment != 0) {return `(<span class="interactive-comment-total">${res.data.posts[i].comment}</span>)`} else {return '<span class="interactive-comment-total"></span>'}})()}</span></button><button class="interactive-but share-but"><span class="iconify font-size-lg-1" data-icon="simple-line-icons:share-alt" data-inline="false"></span><span>${(() => {if(res.data.posts[i].share != 0) {res.data.posts[i].share} else {return ''}})()}</span><span>Chia sẻ</span></button></div></div>`)
                                    }
                                    Plyr.setup('video.player')
                                    handleMainFrame()
                                    handleNavigation()
                                    if (statusRedirect == ''){
                                        if (document.querySelector(".frame-post-home")){
                                            competitionContentText = document.querySelector(".main-frame").innerHTML
                                        }
                                    }
                                }
                                if (postDisplayedList.length == res.data.total){
                                    if (document.querySelectorAll(".loading-post").length != 0){
                                        document.querySelector(".loading-post").innerHTML = '<div class="no-post-text">Oops! Không còn ai tham gia ở đây!</div><div class="no-post-lottie"></div><button class="create-post-but" data-create-but="layout">Be The First!</button>'
                                        stopScrollPage = 1
                                        rankIndex = 5
                                        if (statusRedirect == ''){
                                            if (document.querySelector(".frame-post-home")){
                                                competitionContentText = document.querySelector(".main-frame").innerHTML
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                xhttp.open("POST", "update-content-post", true)
                xhttp.setRequestHeader('Content-Type', 'application/json')
                xhttp.send(JSON.stringify(data))
            }
        })
    }
    handlePageScroll()
}
handleScroll()

//handle Navigation
function handleNavigation(){
    function redirect(agent, pushState){
        agentText = agent.outerHTML
        // if (interval){clearInterval(interval)}
        if (document.querySelector(".view-post-modal")){
            document.querySelector(".view-post-modal").remove()
        }
        navLink = agent.getAttribute("nav-data")
        let navName
        if (agent.querySelectorAll(".nav-item-name-red").length != 0){
            navName = agent.querySelector(".nav-item-name-red").textContent
        }
        else if (agent.querySelectorAll(".user-avt").length != 0){
            navName = agent.querySelector(".user-avt").getAttribute("username")
        }
        else if (agent.querySelector(".avt-username")) {
            navName = agent.querySelector(".avt-username").textContent
        }
        else if (agent.querySelector(".avatar-username")) {
            navName = agent.querySelector(".avatar-username").textContent
        }
        else {
            navName = agent.parentNode.querySelector(".avt-username").textContent
        }
        const navRed = document.querySelectorAll(".nav-red")
        for (let i = 0; i < navRed.length; i++){
            navRed[i].classList.remove("active")
            if (navRed[i].getAttribute("nav-data") == agent.getAttribute("nav-data")){
                navRed[i].classList.add("active")
            }
        }
        if (document.querySelector(".mobile-creator")){
            document.querySelector(".mobile-creator").style.display = "flex"
            handleCreatePost()
        }
        if (interval){clearInterval(interval)}
        if (document.querySelector(".title-content")){
            document.querySelector(".title-content").innerHTML = navName
        }
        if (navLink != ''){
            if (navLink != 'competition'){
                personalLink = agent.getAttribute("data-user-df")
                postLink = agent.getAttribute("data-post-df")
                if (document.querySelector(".setting-content")){
                    const settingType = agent.getAttribute("setting-data")
                    if (settingType == "feedback"){
                        document.querySelector(".setting-content").innerHTML = '<div class="group-title"><span class="font-size-lg-2 none-deco pd-l feedback-setting-content">Đóng góp ý kiến</span></div><div class="border-b"></div><div class="setting-handle"><textarea class="opinion-textarea" placeholder="Thêm ý kiến của bạn" name="opinion" maxlength="1000"></textarea><div class="mg-t d-flex-mg-start"><span>Hãy cho chúng tôi biết nếu bạn có ý tưởng cái thiện Lingyo hoặc nếu phát hiện bất kì lỗi nào nhé!</span><button class="next-but submit-feedback mg-t">Gửi</button>'
                    }
                    else if (settingType == "normal"){
                        let xhttp
                        if (window.XMLHttpRequest) {
                            xhttp = new XMLHttpRequest()
                        } else {
                            xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                        }
                        xhttp.onreadystatechange = function() {
                            if (xhttp.readyState == 4 && xhttp.status == 200) {
                                const parser = new DOMParser()
                                const page = parser.parseFromString(xhttp.responseText, 'text/html')
                                document.querySelector(".setting-content").innerHTML = page.querySelector(".setting-content").innerHTML
                            }
                        }
                        xhttp.open("GET", '/setting', true)
                        xhttp.setRequestHeader('Content-Type', 'application/json')
                        xhttp.send()
                    }
                }
                if (statusRedirect != navLink && statusRedirect != personalLink && statusRedirect != postLink){
                    let xhttp
                    if (window.XMLHttpRequest) {
                        xhttp = new XMLHttpRequest()
                    } else {
                        xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                    }
                    window.scrollTo(0, 0)
                    if (document.querySelector(".main-frame")){
                        document.querySelector(".main-frame").innerHTML = '<div class="loading-frame d-flex"><span class="iconify spin loading-icon" data-icon="ant-design:loading-3-quarters-outlined" data-inline="false"></span></div>'
                    }
                    if (navLink != 'personal'){
                        // document.querySelector(".main-frame").style.minHeight = "calc(100vh - 55px)"
                        if (navLink == "notifications"){
                            if (document.querySelector(".unread-notifications")){
                                document.querySelector(".unread-notifications").remove()
                            }
                        }
                        if (navLink == "view-post"){
                            let comment = false
                            if (agent.getAttribute("data-cmt-df")){
                                comment = agent.getAttribute("data-cmt-df")
                            }
                            xhttp.onreadystatechange = function() {
                                if (xhttp.readyState == 4 && xhttp.status == 200) {
                                    const parser = new DOMParser()
                                    const page = parser.parseFromString(xhttp.responseText, 'text/html')
                                    if (page.querySelector(".main-frame")){
                                        if (document.querySelector(".loading-frame")){
                                            document.querySelector(".loading-frame").remove()
                                        }
                                        const contentText = page.querySelector(".main-frame").innerHTML
                                        document.querySelector(".main-frame").innerHTML = contentText
                                        const post = document.querySelector(".post")
                                        commentPostHandle(post, comment)
                                        handleMainFrame()
                                        handleUpdateProfile()
                                        handleMainInfo()
                                        handleNavInfo()
                                        if (pushState){
                                            history.pushState({
                                                agent: agentText,
                                            }, '', `https://fodance.com/post/${postLink}`)
                                        }
                                        document.querySelector('title').textContent = `Lingyo | Video`
                                    }
                                    else {
                                        showAlert("Video này đã bị xóa bởi chủ sở hữu!")
                                        document.querySelector(".home-but").click()
                                    }
                                    // if (page.querySelector(".main-info")){
                                    //     const mainInfoText = page.querySelector(".main-info").innerHTML
                                    // }
                                }
                            }
                            statusRedirect = postLink
                            xhttp.open("GET", '/post/' + postLink, true)
                            xhttp.setRequestHeader('Content-Type', 'application/json')
                            xhttp.send()
                        }
                        else {
                            xhttp.onreadystatechange = function() {
                                if (xhttp.readyState == 4 && xhttp.status == 200) {
                                    if (document.querySelector(".loading-frame")){
                                        document.querySelector(".loading-frame").remove()
                                    }
                                    const parser = new DOMParser()
                                    const page = parser.parseFromString(xhttp.responseText, 'text/html')
                                    const contentText = page.querySelector(".main-frame").innerHTML
                                    document.querySelector(".main-frame").innerHTML = contentText
                                    if (navLink != "setting"){
                                        if (document.querySelector(".main-info-inner") && document.querySelector(".main-info-inner").classList.contains("info-personal")) {
                                            const mainInfo = page.querySelector(".main-info")
                                            const mainInfoText = mainInfo.innerHTML
                                            document.querySelector(".main-info").innerHTML = mainInfoText
                                            handleMainInfo()
                                        }
                                        if (document.querySelector(".main-info-inner") && document.querySelector(".main-info-inner").classList.contains("info-setting")) {
                                            const mainInfo = page.querySelector(".main-info")
                                            const mainInfoText = mainInfo.innerHTML
                                            document.querySelector(".main-info").innerHTML = mainInfoText
                                            handleMainInfo()
                                        }
                                    }
                                    else {
                                        if (document.querySelector(".mobile-creator")){
                                            document.querySelector(".mobile-creator").style.display = "none"
                                        }
                                        const settingType = agent.getAttribute("setting-data")
                                        const mainInfoText = page.querySelector(".main-info").innerHTML
                                        if (document.querySelector(".main-info")){
                                            document.querySelector(".main-info").innerHTML = mainInfoText
                                        }
                                        if (settingType == "feedback"){
                                            document.querySelector(".setting-content").innerHTML = '<div class="group-title"><span class="font-size-lg-2 none-deco pd-l feedback-setting-content">Đóng góp ý kiến</span></div><div class="border-b"></div><div class="setting-handle"><textarea class="opinion-textarea" placeholder="Thêm ý kiến của bạn" name="opinion" maxlength="1000"></textarea><div class="mg-t d-flex-col-start"><span>Hãy cho chúng tôi biết nếu bạn có ý tưởng cái thiện Lingyo hoặc nếu phát hiện bất kì lỗi nào nhé!</span><button class="next-but submit-feedback mg-t">Gửi</button>'
                                        }
                                        handleSetting(settingType)
                                    }
                                    if (navLink == "saved"){
                                        if (document.querySelectorAll(".post").length != 0){
                                            const posts = document.querySelectorAll(".post")
                                            postDisplayedList = []
                                            param = ''
                                            for (let i = 0; i < posts.length; i++){
                                                if (posts[i].getAttribute("data-post-df")){
                                                    postDisplayedList.push(posts[i].getAttribute("data-post-df"))
                                                }
                                            }
                                        }
                                    }
                                    handleMainFrame()
                                    handleNavigation()
                                    if (navLink == "add-topic"){handleAddTopic()}
                                    if (navLink == "notifications"){handleRefreshTask()}
                                }
                            }
                            if (pushState){
                                history.pushState({
                                    agent: agentText,
                                }, '', `https://fodance.com/${navLink}`)
                            }
                            document.querySelector('title').textContent = `Lingyo | ${navName}`
                            statusRedirect = navLink
                            xhttp.open("GET", '/' + navLink, true)
                            xhttp.setRequestHeader('Content-Type', 'application/json')
                            xhttp.send()
                        }
                    }
                    else {
                        // document.querySelector(".main-frame").style.minHeight = "1162px"
                        document.querySelector(".main-frame").innerHTML = '<div class="loading-frame d-flex"><span class="iconify spin loading-icon" data-icon="ant-design:loading-3-quarters-outlined" data-inline="false"></span></div>'
                        xhttp.onreadystatechange = function() {
                            if (xhttp.readyState == 4 && xhttp.status == 200) {
                                if (document.querySelector(".loading-frame")){
                                    document.querySelector(".loading-frame").remove()
                                }
                                const parser = new DOMParser()
                                const page = parser.parseFromString(xhttp.responseText, 'text/html')
                                const contentText = page.querySelector(".main-frame").innerHTML
                                const mainInfoText = page.querySelector(".main-info").innerHTML
                                document.querySelector(".main-frame").innerHTML = contentText
                                if (document.querySelector(".main-info")){
                                    document.querySelector(".main-info").innerHTML = mainInfoText  
                                }
                                if (document.querySelector(".info-frame")){
                                    personalPostText = document.querySelector(".info-frame").innerHTML
                                }
                                if (document.querySelectorAll(".post").length != 0){
                                    const posts = document.querySelectorAll(".post")
                                    postDisplayedList = []
                                    for (let i = 0; i < posts.length; i++){
                                        if (posts[i].getAttribute("data-post-df")){
                                            postDisplayedList.push(posts[i].getAttribute("data-post-df"))
                                        }
                                    }
                                }
                                const follow = document.querySelectorAll(".follow-but")
                                for (let i = 0; i < follow.length; i++){
                                    if (follow[i].parentNode.querySelector(".avt-username")){
                                        handleFollow(follow[i], follow[i].parentNode.parentNode, follow[i].parentNode.parentNode.querySelector(".avt-username").textContent)
                                    }
                                    if (follow[i].parentNode.querySelector(".avatar-username")){
                                        handleFollow(follow[i], follow[i].parentNode.parentNode, follow[i].parentNode.parentNode.querySelector(".avatar-username").textContent)
                                    }
                                }
                                document.querySelector('title').textContent = `Lingyo | ${document.querySelector(".category-username").textContent}`
                                rankIndex = 5
                                stopScrollPage = 0
                                videoAjaxSend = []
                                handleMainFrame()
                                handleUpdateProfile()
                                handleNavInfo()
                                handleMainInfo()
                            }
                        }
                        if (pushState){
                            history.pushState({
                                agent: agentText,
                            }, '', `https://fodance.com/${personalLink}`)
                        }
                        statusRedirect = personalLink
                        xhttp.open("GET", '/' + personalLink, true)
                        xhttp.setRequestHeader('Content-Type', 'application/json')
                        xhttp.send()
                    }

                }  
                
            }
            else {
                // document.querySelector(".main-frame").style.minHeight = "1162px"
                if (statusRedirect == cateLink || competitionContentText == 'competition'){
                    let xhttp
                    if (window.XMLHttpRequest) {
                        xhttp = new XMLHttpRequest()
                    } else {
                        xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                    }
                    window.scrollTo(0, 0)
                    if (document.querySelectorAll(".post-frame").length != 0){
                        document.querySelector(".post-frame").innerHTML = '<div class="loading-post"><div class="d-flex-start loading-content"><div class="loading-post-circle mg-r"></div><div class="d-flex-col-start-content width-80"><div class="loading-post-line width-30 mg-b-sm"></div><div class="loading-post-line width-20"></div></div></div><div class="loading-post-line width-90 mg-b-sm"></div></div></div>'
                    }
                    else {
                        document.querySelector(".main-frame").innerHTML = '<div class="loading-frame d-flex"><span class="iconify spin loading-icon" data-icon="ant-design:loading-3-quarters-outlined" data-inline="false"></span></div>'
                    }
                    const rankButs = document.querySelectorAll(".header-rank-but")
                    for (let i = 0; i < rankButs.length; i++){
                        if (rankButs[i].getAttribute("rank-data") == rankLink){
                            rankButs[i].classList.add("header-rank-but-active")
                        }
                        else {
                            rankButs[i].classList.remove("header-rank-but-active")
                        }
                    }
                    const cateButs = document.querySelectorAll(".category-but")
                    for (let i = 0; i < cateButs.length; i++){
                        if (cateButs[i].getAttribute("topic-data") == 'competition'){
                            cateButs[i].classList.add("active")
                        }
                        else {
                            cateButs[i].classList.remove("active")
                        }
                    }
                    cateLink = 'competition'
                    xhttp.onreadystatechange = function() {    
                        if (xhttp.readyState == 4 && xhttp.status == 200) {
                            const parser = new DOMParser()
                            const page = parser.parseFromString(xhttp.responseText, 'text/html')
                            const mainFrameText = page.querySelector(".main-frame").innerHTML
                            const contentText = page.querySelector(".post-frame").innerHTML
                            if (document.querySelectorAll(".post-frame").length != 0){
                                document.querySelector(".post-frame").innerHTML = contentText
                            }
                            else {
                                document.querySelector(".main-frame").innerHTML = mainFrameText
                            }

                            const currentCate = window.location.pathname.replace('/', '')
                            if (currentCate != '' && (cateList.includes(currentCate) || cateLink == 'competition')){
                                if (document.querySelectorAll(".category-but").length != 0){
                                    document.querySelector(".category-but[topic-data='" + cateLink + "'").scrollIntoView({block: "end", inline: "center"})
                                    scrollRange = document.querySelector('.category-slidebar').scrollLeft
                                }
                            }

                            if (document.querySelectorAll(".category-slidebar").length != 0){
                                document.querySelector('.category-slidebar').scrollLeft = scrollRange
                            }
                            if (document.querySelector(".main-info-inner") && document.querySelector(".main-info-inner").classList.contains("info-personal")) {
                                const mainInfo = page.querySelector(".main-info")
                                const mainInfoText = mainInfo.innerHTML
                                document.querySelector(".main-info").innerHTML = mainInfoText
                                handleMainInfo()
                            }
                            if (document.querySelector(".main-info-inner") && document.querySelector(".main-info-inner").classList.contains("info-setting")) {
                                const mainInfo = page.querySelector(".main-info")
                                const mainInfoText = mainInfo.innerHTML
                                document.querySelector(".main-info").innerHTML = mainInfoText
                                handleMainInfo()
                            }
                            if (document.querySelector(".frame-post-home")){
                                competitionContentText = document.querySelector(".main-frame").innerHTML
                            }
                            if (document.querySelector(".main-info")){
                                infoContentText = document.querySelector(".main-info").innerHTML
                            }
                            if (document.querySelectorAll(".post").length != 0){
                                const posts = document.querySelectorAll(".post")
                                postDisplayedList = []
                                param = ''
                                for (let i = 0; i < posts.length; i++){
                                    if (posts[i].getAttribute("data-post-df")){
                                        postDisplayedList.push(posts[i].getAttribute("data-post-df"))
                                    }
                                }
                            }
                            rankIndex = 5
                            stopScrollPage = 0
                            videoAjaxSend = []
                            if (categoryContentText != ''){
                                document.querySelector(".category").innerHTML = categoryContentText
                            }
                            if (document.querySelector('.category-slidebar')){
                                document.querySelector('.category-slidebar').scrollLeft = scrollRange
                            }
                            handleRankHeader()
                            handleMainFrame()
                            handleNavigation()
                            handleRankPostCount()
                        }    
                    }
                    xhttp.open("GET", '/competition' + '?rank=' + rankLink, true)
                    xhttp.setRequestHeader('Content-Type', 'application/json')
                    xhttp.send()
                    if (pushState){
                        history.pushState({
                            agent: agentText,
                        }, '', 'https://fodance.com/competition' + '?rank=' + rankLink)
                    }
                    document.querySelector('title').textContent = 'Lingyo | Tất cả - ' + rankName
                }
                else {
                    document.querySelector(".main-frame").innerHTML = competitionContentText
                    if (postContentText != ''){
                        const parser = new DOMParser()
                        const post = parser.parseFromString(postContentText, 'text/html').querySelector(".post")
                        if (document.querySelector(`.post[data-post-df='${post.getAttribute("data-post-df")}']`)){
                            document.querySelector(`.post[data-post-df='${post.getAttribute("data-post-df")}']`).innerHTML = post.innerHTML
                        }
                    }
                    window.scrollTo(0, scrollPage)
                    if (avtUpdate != '') {
                        if (document.querySelectorAll(".user-avt")){
                            document.querySelectorAll(".user-avt").forEach(function(e){
                                if (e.parentNode.getAttribute("data-user-df") == document.querySelector(".header-nickname").getAttribute("data-user-df")){
                                    e.setAttribute("src", "https://cdn.fodance.com/fd-media/" + avtUpdate)
                                }
                            })
                        }
                    }
                    if (usernameUpdate != '') {
                        document.querySelectorAll(".user-username").forEach(function(e){
                            e.textContent = usernameUpdate
                        })
                    }

                    if (nicknameUpdate != '') {
                        const navRed = document.querySelectorAll(".nav-red")
                        for (let i = 0; i < navRed.length; i++){
                            if (agent.getAttribute("data-user-df") == nicknameBeforeUpdate) {
                                agent.setAttribute("data-user-df", nicknameUpdate)
                            }
                        }
                        document.querySelectorAll(".nickname-content").forEach(function(e){
                            e.textContent = '@' + nicknameUpdate
                        })
                    }
                    if (document.querySelectorAll(".category-slidebar").length != 0){
                        document.querySelector('.category-slidebar').scrollLeft = scrollRange
                    }
                    if (document.querySelector(".main-info-inner") && document.querySelector(".main-info-inner").classList.contains("info-personal")) {
                        document.querySelector(".main-info").innerHTML = infoContentText
                        handleMainInfo()
                    }
                    if (document.querySelector(".main-info-inner") && document.querySelector(".main-info-inner").classList.contains("info-setting")) {
                        document.querySelector(".main-info").innerHTML = infoContentText
                        handleMainInfo()
                    }
                    if (document.querySelectorAll(".post").length != 0){
                        const posts = document.querySelectorAll(".post")
                        postDisplayedList = []
                        param = ''
                        for (let i = 0; i < posts.length; i++){
                            if (posts[i].getAttribute("data-post-df")){
                                postDisplayedList.push(posts[i].getAttribute("data-post-df"))
                            }
                        }
                    }
                    stopScrollPage = 0
                    statusRedirect = cateLink
                    videoAjaxSend = []
                    // if (cateLink != 'competition'){
                        if (categoryContentText != ''){
                            document.querySelector(".category").innerHTML = categoryContentText
                        }
                        if (document.querySelector('.category-slidebar')){
                            document.querySelector('.category-slidebar').scrollLeft = scrollRange
                        }
                        handleRankHeader()
                        if (pushState){
                            history.pushState({
                                agent: agentText,
                            }, '', 'https://fodance.com/' + cateLink + "?rank=" + rankLink)
                        }
                        document.querySelector('title').textContent = 'Lingyo | ' + cateName + ' - ' + rankName
                    // }
                    // else {
                    //     if (pushState){
                    //         history.pushState({
                    //             agent: agentText,
                    //         }, '', 'https://fodance.com/competition')
                    //     }
                    //     document.querySelector('title').textContent = 'Lingyo | Vòng đấu'
                    // }
                    handleMainFrame()
                    handleNavigation()
                    handleRankPostCount()
                }
            }
        }
        else {
            let xhttp
            if (window.XMLHttpRequest) {
                xhttp = new XMLHttpRequest()
            } else {
                xhttp = new ActiveXObject("Microsoft.XMLHTTP")
            }
            window.scrollTo(0, 0)
            document.querySelector(".main-frame").innerHTML = '<div class="loading-frame d-flex"><span class="iconify spin loading-icon" data-icon="ant-design:loading-3-quarters-outlined" data-inline="false"></span></div>'
            const rankHeader = document.querySelectorAll(".header-rank-but")
            for (let i = 0; i < rankHeader.length; i++){
                if (rankHeader[i].getAttribute("rank-data") == rankLink){
                    rankHeader[i].classList.add("header-rank-but-active")
                }
            }
            xhttp.onreadystatechange = function() {    
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    const parser = new DOMParser()
                    const page = parser.parseFromString(xhttp.responseText, 'text/html')
                    const mainFrameText = page.querySelector(".main-frame").innerHTML
                    document.querySelector(".main-frame").innerHTML = mainFrameText
                    if (document.querySelector(".main-info-inner") && document.querySelector(".main-info-inner").classList.contains("info-personal")) {
                        const mainInfo = page.querySelector(".main-info")
                        const mainInfoText = mainInfo.innerHTML
                        document.querySelector(".main-info").innerHTML = mainInfoText
                        handleMainInfo()
                    }
                    if (document.querySelector(".main-info-inner") && document.querySelector(".main-info-inner").classList.contains("info-setting")) {
                        const mainInfo = page.querySelector(".main-info")
                        const mainInfoText = mainInfo.innerHTML
                        document.querySelector(".main-info").innerHTML = mainInfoText
                        handleMainInfo()
                    }
                    handleRoundTimerBar()
                    handleRankPostCount()
                    handleNavigation()
                    handleMainFrame()
                    lottie()
                }    
            }
            xhttp.open("GET", '/' + "?rank=" + rankLink, true)
            xhttp.setRequestHeader('Content-Type', 'application/json')
            xhttp.send()
            if (pushState){
                history.pushState({
                    agent: agentText,
                }, '', 'https://fodance.com' + "?rank=" + rankLink)
            }
            document.querySelector('title').textContent = 'Lingyo | ' + rankName
            statusRedirect = navLink
        }
    }
    const url = window.location.href
    window.onpopstate = function(e){
        const parser = new DOMParser()
        if (document.querySelector(".modal")){
            if (document.querySelector(".view-post-modal")){
                if (document.querySelector(".post-viewer")){
                    const postId = document.querySelector(".post-viewer").getAttribute("data-post-df")
                    const post = document.querySelector(`.post[data-post-df="${postId}"]`)
                    post.querySelector(".post-interactive").innerHTML = document.querySelector(".post-viewer").querySelector(".post-interactive").innerHTML
                    post.querySelector(".interactive-but-total").innerHTML = document.querySelector(".post-viewer").querySelector(".interactive-but-total").innerHTML
                    document.querySelector(".main").zIndex = 1000
                    if(window.innerWidth >= 662){
                        document.querySelectorAll(".interactive-but").forEach(function(e){
                            e.style.padding = "8px 30px"
                        })
                    }
                    handleMainFrame()
                    lottie()
                }
            }
            if (document.querySelector(".modal-remove-down")){
                document.querySelector(".modal").remove()
                if (document.querySelector(".left-nav")){
                    document.querySelector(".left-nav").style.zIndex = 1000
                }
                if (document.querySelector(".header")){
                    document.querySelector(".header").style.zIndex = 2000
                }
            }
            else {
                if (!document.querySelector(".create-post-modal-content")){
                    document.querySelector(".modal-content").classList.add("modal-remove-down")
                }
                if (document.querySelector(".modal-content").querySelector(".modal-remove-down")){
                    document.querySelector(".modal-content").onanimationend = function (){
                        document.querySelector(".modal").remove()
                        if (document.querySelector(".left-nav")){
                            document.querySelector(".left-nav").style.zIndex = 1000
                        }
                        if (document.querySelector(".header")){
                            document.querySelector(".header").style.zIndex = 2000
                        }
                    }
                }
                else {
                    document.querySelector(".modal").remove()
                    if (document.querySelector(".left-nav")){
                        document.querySelector(".left-nav").style.zIndex = 1000
                    }
                    if (document.querySelector(".header")){
                        document.querySelector(".header").style.zIndex = 2000
                    }
                }
            }
        }
        else if (fullscreen){
            document.querySelectorAll("[data-plyr='fullscreen']").forEach(function(e){
                if (e.classList.contains("plyr__control--pressed")){
                    e.click()
                    history.pushState({
                    }, '', url)
                }
            })
        }
        else {
            if (e.state !== null){
                if (e.state.agent) {
                    const stateAgent = parser.parseFromString(e.state.agent, 'text/html').querySelector(".nav-red")
                    redirect(stateAgent, false)
                }
                else if (e.state.cateAgent){
                    const cateAgent = parser.parseFromString(e.state.cateAgent, 'text/html').querySelector(".category-but")
                    categoryRedirect(cateAgent, false)
                }
                else if (e.state.rankAgent){
                    const rankAgent = parser.parseFromString(e.state.rankAgent, 'text/html').querySelector(".header-rank-but")
                    rankRedirect(rankAgent, false)
                }
                else if (e.state.searchAgent){
                    const searchAgent = e.state.searchAgent
                    searchDisplayedList = []
                    statusRedirect = ''
                    searchRedirect(searchAgent, false)
                }
                else if (e.state.createPostModal){
                    const modalBut = parser.parseFromString(e.state.createPostModal, 'text/html').querySelector(".create-post-but")
                    createPostRedirect(modalBut, false)
                }
                else if (e.state.editProfileModal){
                    const modalBut = parser.parseFromString(e.state.editProfileModal, 'text/html').querySelector(".add-info-but")
                    editProfileRedirect(modalBut, false)
                }
                else if (e.state.viewPostBut != null){
                    const mediaIndex = e.state.viewPostBut
                    const post = parser.parseFromString(e.state.post, 'text/html').querySelector(".post")
                    viewPostRedirect(mediaIndex, post, false)
                }
                else if (e.state.paymentModal){
                    const modalBut = parser.parseFromString(e.state.paymentModal, 'text/html').querySelector(".user-tickets")
                    paymentRedirect(modalBut, false)
                }
            }
            else {
                redirect(document.querySelector(`.nav-red[nav-data='']`), false)
            }
        }
        
        // history.replaceState({agent: null}, 'Lingyo', 'https://fodance.com/')
    }

    const navRed = document.querySelectorAll('.nav-red')
    for (let i = 0; i < navRed.length; i++){
        navRed[i].onclick = function(){
            redirect(navRed[i], true)
        }
    }

    // history.replaceState({agent: null}, 'Lingyo', 'https://fodance.com/')
}
handleNavigation()

function editProfileRedirect(editBut, pushState){
    const url = window.location.href
    if (document.querySelector(".mobile-creator")){
        document.querySelector(".mobile-creator").style.zIndex = 1000
    }
    if (document.querySelectorAll(".edit-profile").length == 0){
        document.querySelector(".avatar-frame").insertAdjacentHTML('beforeend', `<div class="edit-profile modal"><div class="modal edit-profile-modal"><div class="modal-content edit-profile-modal-content"><div class="group-title d-flex">${(()=>{if (window.innerWidth <= 662){return `
        <span class="font-size-lg-2">Chỉnh sửa hồ sơ</span>
        <div class="close-edit-modal return-but"><span class="iconify" data-icon="heroicons-outline:arrow-left" data-inline="false"></span></div>
    `}
    else {
        return `
        <span class="font-size-lg-4">Chỉnh sửa hồ sơ</span>
        <button class='close close-edit-modal' type="button">
            <span class='iconify dropdown-icon' data-icon='feather:x' data-inline='false'></span>
        </button>
        `
    }
    })()}<button class="next-but save-edit-profile" type="submit">Lưu</button></div><div class="border-b"></div><div class="edit-profile-frame"><div><div class="edit-cover"><img src="${document.querySelector(".user-cover").getAttribute('src')}"><label class="update-cover-but cover-upload-label noselect"><input accept="image/jpeg,image/jpg,image/png" type="file" name="cover-file" class="cover-upload"><span class="iconify profile-cover-upload-icon" data-icon="ant-design:camera-filled" data-inline="false"></span></label></div><div class="edit-avt-frame"><div class="edit-avt"><img src="${document.querySelector(".user-avt").getAttribute('src')}" class="user-avt"><label class="update-avt-but avt-upload-label noselect"><input accept="image/jpeg,image/jpg,image/png" type="file" name="avt-file" class="avt-upload"><span class="iconify profile-avt-upload-icon" data-icon="ant-design:camera-filled" data-inline="false"></span></label></div></div></div><div class="edit-info"><div class="mg-b-lg"><label class="username mg-b">Tên</label><input class="mg-t-sm" type="text" name="username" value="${document.querySelector(".avatar-username").textContent.trim()}" maxlength="50"></div><div class="mg-b-lg"><label class="introduce">Giới thiệu ngắn</label><input class="mg-t-sm" type="text" name="introduce" value="${(()=>{if (document.querySelector(".introduce-content") && document.querySelector(".introduce-content").textContent.trim() == "Thêm đoạn ngắn giới thiệu bản thân..") {return ''} else {return document.querySelector(".introduce-content").textContent.trim()}})()}" maxlength="120"><div class="mg-b-lg"><label class="birthday">Ngày sinh</label><div class="birthday-frame mg-t-sm"><select name="day-select" class="birtday-select day-select mg-r"><option>${(()=>{if (document.querySelector(".birthday-content") && document.querySelector(".birthday-content").textContent.trim() == "Chưa cập nhật ngày sinh") {return 'Ngày'} else {return document.querySelector(".day-birthday").textContent}})()}</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option><option value="24">24</option><option value="25">25</option><option value="26">26</option><option value="27">27</option><option value="28">28</option><option value="29">29</option><option value="30">30</option><option value="31">31</option></select><select name="month-select" class="birtday-select month-select mg-r"><option>${(()=>{if (document.querySelector(".birthday-content") && document.querySelector(".birthday-content").textContent.trim() == "Chưa cập nhật ngày sinh") {return 'Tháng'} else {return document.querySelector(".month-birthday").textContent}})()}</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option></select><select name="year-select" class="birtday-select year-select"><option>${(()=>{if (document.querySelector(".birthday-content") && document.querySelector(".birthday-content").textContent.trim() == "Chưa cập nhật ngày sinh") {return 'Năm'} else {return document.querySelector(".year-birthday").textContent}})()}</option><option value="2020">2020</option><option value="2019">2019</option><option value="2018">2018</option><option value="2017">2017</option><option value="2016">2016</option><option value="2015">2015</option><option value="2014">2014</option><option value="2013">2013</option><option value="2012">2012</option><option value="2011">2011</option><option value="2010">2010</option><option value="2009">2009</option><option value="2008">2008</option><option value="2007">2007</option><option value="2006">2006</option><option value="2005">2005</option><option value="2004">2004</option><option value="2003">2003</option><option value="2002">2002</option><option value="2001">2001</option><option value="2000">2000</option><option value="1999">1999</option><option value="1998">1998</option><option value="1997">1997</option><option value="1996">1996</option><option value="1995">1995</option><option value="1994">1994</option><option value="1993">1993</option><option value="1992">1992</option><option value="1991">1991</option><option value="1990">1990</option><option value="1989">1989</option><option value="1988">1988</option><option value="1987">1987</option><option value="1986">1986</option><option value="1985">1985</option><option value="1984">1984</option><option value="1983">1983</option><option value="1982">1982</option><option value="1981">1981</option><option value="1980">1980</option><option value="1979">1979</option><option value="1978">1978</option><option value="1977">1977</option><option value="1976">1976</option><option value="1975">1975</option><option value="1974">1974</option><option value="1973">1973</option><option value="1972">1972</option><option value="1971">1971</option><option value="1970">1970</option><option value="1969">1969</option><option value="1968">1968</option><option value="1967">1967</option><option value="1966">1966</option><option value="1965">1965</option><option value="1964">1964</option><option value="1963">1963</option><option value="1962">1962</option><option value="1961">1961</option><option value="1960">1960</option><option value="1959">1959</option><option value="1958">1958</option><option value="1957">1957</option><option value="1956">1956</option><option value="1955">1955</option><option value="1954">1954</option><option value="1953">1953</option><option value="1952">1952</option><option value="1951">1951</option><option value="1950">1950</option><option value="1949">1949</option><option value="1948">1948</option><option value="1947">1947</option><option value="1946">1946</option><option value="1945">1945</option><option value="1944">1944</option><option value="1943">1943</option><option value="1942">1942</option><option value="1941">1941</option><option value="1940">1940</option><option value="1939">1939</option><option value="1938">1938</option><option value="1937">1937</option><option value="1936">1936</option><option value="1935">1935</option><option value="1934">1934</option><option value="1933">1933</option><option value="1932">1932</option><option value="1931">1931</option><option value="1930">1930</option></select></div></div><div class="mg-b-lg"><label class="location">Địa điểm</label><input class="mg-t-sm" type="text" name="location" value="${(()=>{if (document.querySelector(".location-content") && document.querySelector(".location-content").textContent.trim() == "Chưa cập nhật địa điểm") {return ''} else {return document.querySelector(".location-content").textContent.trim()}})()}" maxlength="100"></div></div></div></div></div></div>`)
        if (pushState){
            history.pushState({
                editProfileModal: editBut.outerHTML,
            }, '', "https://fodance.com/" + window.location.pathname.replace('/', '') + "/edit-profile")
        }
        const modal = document.querySelector(".edit-profile")
        const editModal = document.querySelector(".edit-profile-modal")
        document.querySelector(".close-edit-modal").onclick = function(){
            if (document.querySelector(".mobile-creator")){
                document.querySelector(".mobile-creator").style.zIndex = 1000
            }
            modal.querySelector(".modal-content").classList.add("modal-remove-down")
            modal.querySelector(".modal-content").onanimationend = function () {
                window.history.back()
            }
        }
        if (document.querySelector(".change-profile")){
            document.querySelector(".save-edit-profile").onclick = function(){
                const username = document.querySelector("input[name='username']").value
                const introduce = document.querySelector("input[name='introduce']").value
                const dayBithday = document.querySelector(".day-select").value
                const monthBithday = document.querySelector(".month-select").value
                const yearBithday = document.querySelector(".year-select").value
                const location = document.querySelector("input[name='location']").value
                let birthday
                if (yearBithday != "Năm" && monthBithday != "Tháng" && dayBithday != "Ngày") {
                    birthday = yearBithday + '-' + monthBithday + '-' + dayBithday
                }
                else {
                    birthday = null
                }
                this.parentNode.parentNode.classList.add("modal-remove-down")
                this.parentNode.parentNode.onanimationend = function () {
                    window.history.back()
                }
                let xhttp
                if (window.XMLHttpRequest) {
                    xhttp = new XMLHttpRequest()
                } else {
                    xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                }
                const data = {
                    username: username,
                    introduce: introduce,
                    birthday: birthday,
                    location: location
                }
                xhttp.onreadystatechange = function() {
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        const res = JSON.parse(xhttp.responseText)
                        if (res.status == 'done'){
                            document.querySelectorAll(".user-username").forEach(function(e){
                                e.textContent = username
                                usernameUpdate = username
                            })
                            if (introduce == "") {document.querySelector(".introduce-content").textContent = "Thêm đoạn ngắn giới thiệu bản thân.."}
                            else {document.querySelector(".introduce-content").textContent = introduce}
                            if (birthday == null) {document.querySelector(".birthday-content").textContent = "Chưa cập nhật ngày sinh"}
                            else {document.querySelector(".birthday-content").innerHTML = `<div>Sinh ngày <span class="day-birthday">${dayBithday}</span>, tháng <span class="month-birthday">${monthBithday}</span>, năm <span class="year-birthday">${yearBithday}</span></div>`}
                            if (location == "") {document.querySelector(".location-content").textContent = "Chưa cập nhật địa điểm"}
                            else {document.querySelector(".location-content").textContent =  location} 
                        }
                    }
                }
                xhttp.open("POST", "/update-profile", true)
                xhttp.setRequestHeader('Content-Type', 'application/json')
                xhttp.send(JSON.stringify(data))
            }
        }
        let xCrop, yCrop = 0
        let zoom = 1
        if (document.querySelector(".avt-upload")){
            document.querySelector(".avt-upload").onchange = function(e){
                let file = e.target.files[0]
                const reg = /image\/jpeg|image\/jpg|image\/png/gi
                let fileReader = new FileReader();
                fileReader.onloadend = function(e) {
                    let arr = (new Uint8Array(e.target.result)).subarray(0, 4);
                    let header = "";
                    for(let i = 0; i < arr.length; i++) {
                        header += arr[i].toString(16);
                    }
                    switch (header) {
                        case "89504e47":
                            type = "image/png";
                            break;
                        case "ffd8ffe0":
                        case "ffd8ffe1":
                        case "ffd8ffe2":
                        case "ffd8ffe3":
                        case "ffd8ffe8":
                        case "ffd8ffdb":
                        case "ffd8ffee":
                            type = "image/jpeg";
                            break;
                        default:
                            type = "unknown";
                            break;
                    }
                    if (type.match(reg)) {
                        if (window.innerWidth <= 662) {
                            document.querySelector(".edit-profile").insertAdjacentHTML('beforeend', `<div class="modal avt-crop-modal"><div class="modal-content avt-crop-modal-content"><div class="group-title d-flex"><span>Ảnh hồ sơ</span><div class="close-edit-avt-modal return-but"><span class="iconify" data-icon="heroicons-outline:arrow-left" data-inline="false"></span></div><button class="next-but save-edit-avt" type="button">Áp dụng</button></div><div class="gradient-line"></div><div class="avt-preview"><div class="avt-frame"><div class="pos-avt"><div class="avt-canvas"></div></div><div class="crop-circle"></div></div></div><div class="d-flex mg-t-lg"><input type="range" min="0", max="100", value="0" class="input-zoom"><div class="output-zoom mg-l-sm">0</div></div><div>`)
                        }
                        else {
                            document.querySelector(".edit-profile").insertAdjacentHTML('beforeend', `<div class="modal avt-crop-modal"><div class="modal-content avt-crop-modal-content"><div class="group-title d-flex"><span>Ảnh hồ sơ</span><button class="close close-edit-avt-modal" type="button"><span class="iconify dropdown-icon" data-icon="feather:x" data-inline="false"></span></button><button class="next-but save-edit-avt" type="button">Áp dụng</button></div><div class="gradient-line"></div><div class="avt-preview"><div class="avt-frame"><div class="pos-avt"><div class="avt-canvas"></div></div><div class="crop-circle"></div></div></div><div class="d-flex mg-t-lg"><input type="range" min="0", max="100", value="0" class="input-zoom"><div class="output-zoom mg-l-sm">0</div></div><div>`)
                        }
                        document.querySelector(".close-edit-avt-modal").onclick = function(){
                            this.parentNode.parentNode.classList.add("modal-remove-down")
                            this.parentNode.parentNode.onanimationend = function () {
                                document.querySelector(".avt-crop-modal").remove()
                                document.querySelector(".avt-upload").value = null
                            }
                        }
                        const img = new Image()
                        const objectUrl = URL.createObjectURL(file)
                        document.querySelector(".avt-canvas").style.backgroundImage = `url(${objectUrl})`
                        const myDiv = document.querySelector(".avt-canvas")
                        const inputZoom = document.querySelector(".input-zoom")
                        const outputZoom = document.querySelector(".output-zoom")
                        let formData = new FormData()
                        formData.append('file', file)
                        img.onload = function () {
                            const width = this.width
                            const height = this.height
                            let outWidth = 300*this.width/this.height
                            let size = this.height/300
                            if (outWidth < 300){
                                document.querySelector(".pos-avt").style.height = (300/outWidth * 300) + 'px'
                                xCrop = 0
                                yCrop = (300/outWidth * 300)/2 - 150
                                outWidth = 300
                                size = this.width/300
                                document.querySelector(".pos-avt").style.width = outWidth + 'px'
                            }
                            else{
                                document.querySelector(".pos-avt").style.width = outWidth + 'px'
                                xCrop = myDiv.offsetWidth/2 - 150, yCrop = 0
                            }
                            if (xCrop < 0){xCrop = 0}
                            if (yCrop < 0){yCrop = 0}
                            let inputValue = 0
                            inputZoom.oninput = function(){
                                this.style.backgroundImage = 'linear-gradient(to right, #0cb5e0 0%, #0cb5e0 ' + this.value + '%, #e6e6e6 ' + this.value + '%, #e6e6e6 100%)'
                                zoom = 1 + this.value/100
                                outputZoom.textContent = this.value
                                document.querySelector(".avt-canvas").style.transform = `scale(${zoom}`
                                const pic = document.querySelector(".avt-canvas").getBoundingClientRect()
                                const circle = document.querySelector(".crop-circle").getBoundingClientRect()
                                if (pic.left >= circle.left){
                                const left = parseFloat(myDiv.style.left.replace('px', ''))
                                const walk = parseFloat(((inputValue - this.value)/100).toFixed(2))
                                const range = left - walk * myDiv.offsetWidth/2
                                myDiv.style.left = range + "px"
                                }
                                if (pic.top >= circle.top){
                                const top = parseFloat(myDiv.style.top.replace('px', ''))
                                const walk = parseFloat(((inputValue - this.value)/100).toFixed(2))
                                const range = top - walk * myDiv.offsetHeight/2
                                myDiv.style.top = range + "px"
                                }
                                if (pic.right <= circle.right){
                                const left = parseFloat(myDiv.style.left.replace('px', ''))
                                const walk = parseFloat(((inputValue - this.value)/100).toFixed(2))
                                const range = left + walk * myDiv.offsetWidth/2
                                myDiv.style.left = range + "px"
                                }
                                if (pic.bottom <= circle.bottom){
                                const top = parseFloat(myDiv.style.top.replace('px', ''))
                                const walk = parseFloat(((inputValue - this.value)/100).toFixed(2))
                                const range = top + walk * myDiv.offsetHeight/2
                                myDiv.style.top = range + "px"
                                }
                                inputValue = this.value
                        
                                xCrop = circle.left - pic.left
                                yCrop = circle.top - pic.top
                                if (xCrop < 0){xCrop = 0}
                                if (yCrop < 0){yCrop = 0}
                            }
                            dragElement(document.querySelector(".avt-frame"))
                            function dragElement(elmnt) {
                                let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0
                                elmnt.onmousedown = dragMouseDown
                                
                                function dragMouseDown(e) {
                                e = e || window.event
                                e.preventDefault()
                                pos3 = e.clientX
                                pos4 = e.clientY
                                document.onmouseup = closeDragElement
                                document.onmousemove = elementDrag
                                }
                        
                                function elementDrag(e) {
                                e = e || window.event
                                e.preventDefault()
                                pos1 = pos3 - e.clientX
                                pos2 = pos4 - e.clientY
                                pos3 = e.clientX
                                pos4 = e.clientY
                                const pic = document.querySelector(".avt-canvas").getBoundingClientRect()
                                const circle = document.querySelector(".crop-circle").getBoundingClientRect()
                                xCrop = circle.left - pic.left
                                yCrop = circle.top - pic.top
                                if (xCrop < 0){xCrop = 0}
                                if (yCrop < 0){yCrop = 0}
                                if (myDiv.offsetTop - pos2 >= - (myDiv.offsetHeight*zoom/2 - 150)  && myDiv.offsetTop - pos2 <= myDiv.offsetHeight*zoom/2 - 150){
                                    myDiv.style.top = (myDiv.offsetTop - pos2) + "px"
                                }
                                if (myDiv.offsetLeft - pos1 >= - (myDiv.offsetWidth*zoom/2 - 150) && myDiv.offsetLeft - pos1 <= myDiv.offsetWidth*zoom/2 - 150){
                                    myDiv.style.left = (myDiv.offsetLeft - pos1) + "px"
                                }
                                }
                        
                                function closeDragElement() {
                                document.onmouseup = null
                                document.onmousemove = null
                                }
                            }
    
                            dragElementOnTouch(document.querySelector(".avt-frame"))
                            function dragElementOnTouch(elmnt) {
                                let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0
                                elmnt.ontouchstart = dragMouseDownOnTouch
                                
                                function dragMouseDownOnTouch(e) {
                                    e = e || window.event
                                    e.preventDefault()
                                    pos3 = e.pageX
                                    pos4 = e.pageY
                                    elmnt.ontouchend = closeDragElementOnTouch
                                    elmnt.addEventListener("touchmove", function(e){
                                        e = e || window.event
                                        e.preventDefault()
                                        for (i=0; i < e.changedTouches.length; i++) {
                                            pos1 = pos3 - e.changedTouches[i].pageX
                                            pos2 = pos4 - e.changedTouches[i].pageY
                                            pos3 = e.changedTouches[i].pageX
                                            pos4 = e.changedTouches[i].pageY
                                        }
                                        const pic = document.querySelector(".avt-canvas").getBoundingClientRect()
                                        const circle = document.querySelector(".crop-circle").getBoundingClientRect()
                                        xCrop = circle.left - pic.left
                                        yCrop = circle.top - pic.top
                                        if (xCrop < 0){xCrop = 0}
                                        if (yCrop < 0){yCrop = 0}
                                        if (myDiv.offsetTop - pos2 >= - (myDiv.offsetHeight*zoom/2 - 150)  && myDiv.offsetTop - pos2 <= myDiv.offsetHeight*zoom/2 - 150){
                                            myDiv.style.top = (myDiv.offsetTop - pos2) + "px"
                                        }
                                        if (myDiv.offsetLeft - pos1 >= - (myDiv.offsetWidth*zoom/2 - 150) && myDiv.offsetLeft - pos1 <= myDiv.offsetWidth*zoom/2 - 150){
                                            myDiv.style.left = (myDiv.offsetLeft - pos1) + "px"
                                        }
                                    })
                                }
                        
                                function closeDragElementOnTouch() {
                                    document.ontouchend = null
                                    document.ontouchmove = null
                                }
                            }
    
                            document.querySelector(".save-edit-avt").onclick = function(){
                                document.querySelector(".avt-crop-modal").remove()
                                this.parentNode.parentNode.classList.add("modal-remove-down")
                                this.parentNode.parentNode.onanimationend = function () {
                                    window.history.back()
                                }
                                let xhttp
                                if (window.XMLHttpRequest) {
                                    xhttp = new XMLHttpRequest()
                                } else {
                                    xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                                }
                                let x, y
                                x = xCrop*size/zoom
                                y = yCrop*size/zoom
                                formData.append("xCrop", x)
                                formData.append("yCrop", y)
                                let ratio = Math.floor(size/zoom * 100) / 100
                                if (ratio * 300 > width - x && ratio * 300 < height){ratio = (width - x)/300}
                                if (ratio * 300 > height - y && ratio * 300 < width){ratio = (height - y)/300}
                                if (ratio * 300 > width - x && ratio * 300 > height - y){ratio = Math.min(width - x, height - y)/300}
                                formData.append("size", ratio)
                                xhttp.onreadystatechange = function() {
                                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                                        const res = JSON.parse(xhttp.responseText)
                                        if (res.status == 'done'){
                                            avtUpdate = res.data.avt
                                            document.querySelectorAll(".user-avt").forEach(function(e){
                                                e.setAttribute("src", "https://cdn.fodance.com/fd-media/" + res.data.avt)
                                            })
                                        }
                                        else {
                                            showAlert("Cập nhật ảnh không thành công!")
                                        }
                                    }
                                }
                                xhttp.open("POST", "/upload-avt", true)
                                xhttp.send(formData)
                            }
                            URL.revokeObjectURL(img)
                        }
                        img.src = objectUrl
                    }
                    else {
                        document.querySelector(".avt-upload").value = null
                        showAlert("Hãy chọn ảnh đúng định dạng!")
                    }
                }
                fileReader.readAsArrayBuffer(file)
            }
        }
        if (document.querySelector(".cover-upload")){
            document.querySelector(".cover-upload").onchange = function(e){
                let file = e.target.files[0]
                const reg = /image\/jpeg|image\/jpg|image\/png/gi
                let fileReader = new FileReader();
                fileReader.onloadend = function(e) {
                    let arr = (new Uint8Array(e.target.result)).subarray(0, 4);
                    let header = "";
                    for(let i = 0; i < arr.length; i++) {
                        header += arr[i].toString(16);
                    }
                    switch (header) {
                        case "89504e47":
                            type = "image/png";
                            break;
                        case "ffd8ffe0":
                        case "ffd8ffe1":
                        case "ffd8ffe2":
                        case "ffd8ffe3":
                        case "ffd8ffe8":
                        case "ffd8ffdb":
                        case "ffd8ffee":
                            type = "image/jpeg";
                            break;
                        default:
                            type = "unknown";
                            break;
                    }
                    if (type.match(reg)) {
                        if (window.innerWidth <= 662) {
                            document.querySelector(".edit-profile").insertAdjacentHTML('beforeend', '<div class="modal avt-crop-modal"><div class="modal-content cover-crop-modal-content"><div class="group-title d-flex"><span>Ảnh hồ sơ</span><div class="close-edit-avt-modal return-but"><span class="iconify" data-icon="heroicons-outline:arrow-left" data-inline="false"></span></div><button class="next-but save-edit-avt" type="button">Áp dụng</button></div><div class="gradient-line"></div><div class="avt-preview"><div class="avt-frame"><div class="pos-cover"><div class="avt-canvas"></div></div><div class="crop-frame"></div></div></div><div class="d-flex mg-t-lg"><input type="range" min="0", max="100", value="0" class="input-zoom"><div class="output-zoom mg-l-sm">0</div></div><div>')
                        }
                        else {
                            document.querySelector(".edit-profile").insertAdjacentHTML('beforeend', '<div class="modal avt-crop-modal"><div class="modal-content cover-crop-modal-content"><div class="group-title d-flex"><span>Cập nhật ảnh hồ sơ</span><button class="close close-edit-avt-modal" type="button"><span class="iconify dropdown-icon" data-icon="feather:x" data-inline="false"></span></button><button class="next-but save-edit-avt" type="button">Áp dụng</button></div><div class="gradient-line"></div><div class="avt-preview"><div class="avt-frame"><div class="pos-cover"><div class="avt-canvas"></div></div><div class="crop-frame"></div></div></div><div class="d-flex mg-t-lg"><input type="range" min="0", max="100", value="0" class="input-zoom"><div class="output-zoom mg-l-sm">0</div></div><div>')
                        }
                        document.querySelector(".close-edit-avt-modal").onclick = function(){
                            this.parentNode.parentNode.classList.add("modal-remove-down")
                            this.parentNode.parentNode.onanimationend = function () {
                                document.querySelector(".avt-crop-modal").remove()
                                document.querySelector(".cover-upload").value = null
                            }
                        }
                        const img = new Image()
                        const objectUrl = URL.createObjectURL(file)
                        document.querySelector(".avt-canvas").style.backgroundImage = `url(${objectUrl})`
                        const myDiv = document.querySelector(".avt-canvas")
                        const inputZoom = document.querySelector(".input-zoom")
                        const outputZoom = document.querySelector(".output-zoom")
                        let formData = new FormData()
                        formData.append('file', file)
                        img.onload = function () {
                            const width = this.width
                            const height = this.height
                            let outWidth = 200*this.width/this.height
                            let size = this.height/200
                            if (outWidth < 500){
                                document.querySelector(".pos-cover").style.height = (200/outWidth * 500) + 'px'
                                xCrop = 0
                                yCrop = (200/outWidth * 500)/2 - 100
                                outWidth = 500
                                size = this.width/500
                                document.querySelector(".pos-cover").style.width = outWidth + 'px'
                            }
                            else{
                                document.querySelector(".pos-cover").style.width = outWidth + 'px'
                                xCrop = myDiv.offsetWidth/2 - 100, yCrop = 0
                            }
                            if (xCrop < 0){xCrop = 0}
                            if (yCrop < 0){yCrop = 0}
                            let inputValue = 0
                            inputZoom.oninput = function(){
                                this.style.backgroundImage = 'linear-gradient(to right, #0cb5e0 0%, #0cb5e0 ' + this.value + '%, #e6e6e6 ' + this.value + '%, #e6e6e6 100%)'
                                zoom = 1 + this.value/100
                                outputZoom.textContent = this.value
                                document.querySelector(".avt-canvas").style.transform = `scale(${zoom}`
                                const pic = document.querySelector(".avt-canvas").getBoundingClientRect()
                                const frame = document.querySelector(".crop-frame").getBoundingClientRect()
                                if (pic.left >= frame.left){
                                const left = parseFloat(myDiv.style.left.replace('px', ''))
                                const walk = parseFloat(((inputValue - this.value)/100).toFixed(2))
                                const range = left - walk * myDiv.offsetWidth/2
                                myDiv.style.left = range + "px"
                                }
                                if (pic.top >= frame.top){
                                const top = parseFloat(myDiv.style.top.replace('px', ''))
                                const walk = parseFloat(((inputValue - this.value)/100).toFixed(2))
                                const range = top - walk * myDiv.offsetHeight/2
                                myDiv.style.top = range + "px"
                                }
                                if (pic.right <= frame.right){
                                const left = parseFloat(myDiv.style.left.replace('px', ''))
                                const walk = parseFloat(((inputValue - this.value)/100).toFixed(2))
                                const range = left + walk * myDiv.offsetWidth/2
                                myDiv.style.left = range + "px"
                                }
                                if (pic.bottom <= frame.bottom){
                                const top = parseFloat(myDiv.style.top.replace('px', ''))
                                const walk = parseFloat(((inputValue - this.value)/100).toFixed(2))
                                const range = top + walk * myDiv.offsetHeight/2
                                myDiv.style.top = range + "px"
                                }
                                inputValue = this.value
                        
                                xCrop = frame.left - pic.left
                                yCrop = frame.top - pic.top
                                if (xCrop < 0){xCrop = 0}
                                if (yCrop < 0){yCrop = 0}
                            }
                            dragElement(document.querySelector(".avt-frame"))
                            function dragElement(elmnt) {
                                let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0
                                elmnt.onmousedown = dragMouseDown
                                
                                function dragMouseDown(e) {
                                    e = e || window.event
                                    e.preventDefault()
                                    pos3 = e.clientX
                                    pos4 = e.clientY
                                    document.onmouseup = closeDragElement
                                    document.onmousemove = elementDrag
                                }
                        
                                function elementDrag(e) {
                                    e = e || window.event
                                    e.preventDefault()
                                    pos1 = pos3 - e.clientX
                                    pos2 = pos4 - e.clientY
                                    pos3 = e.clientX
                                    pos4 = e.clientY
                                    const pic = document.querySelector(".avt-canvas").getBoundingClientRect()
                                    const frame = document.querySelector(".crop-frame").getBoundingClientRect()
                                    xCrop = frame.left - pic.left
                                    yCrop = frame.top - pic.top
                                    if (xCrop < 0){xCrop = 0}
                                    if (yCrop < 0){yCrop = 0}
                                    if (myDiv.offsetTop - pos2 >= - (myDiv.offsetHeight*zoom/2 - 100)  && myDiv.offsetTop - pos2 <= myDiv.offsetHeight*zoom/2 - 100){
                                        myDiv.style.top = (myDiv.offsetTop - pos2) + "px"
                                    }
                                    if (myDiv.offsetLeft - pos1 >= - (myDiv.offsetWidth*zoom/2 - 250) && myDiv.offsetLeft - pos1 <= myDiv.offsetWidth*zoom/2 - 250){
                                        myDiv.style.left = (myDiv.offsetLeft - pos1) + "px"
                                    }
                                }
                        
                                function closeDragElement() {
                                    document.onmouseup = null
                                    document.onmousemove = null
                                }
                            }
    
                            dragElementOnTouch(document.querySelector(".avt-frame"))
                            function dragElementOnTouch(elmnt) {
                                let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0
                                elmnt.ontouchstart = dragMouseDownOnTouch
                                
                                function dragMouseDownOnTouch(e) {
                                    e = e || window.event
                                    e.preventDefault()
                                    pos3 = e.pageX
                                    pos4 = e.pageY
                                    elmnt.ontouchend = closeDragElementOnTouch
                                    elmnt.addEventListener("touchmove", function(e){
                                        e = e || window.event
                                        e.preventDefault()
                                        for (i=0; i < e.changedTouches.length; i++) {
                                            pos1 = pos3 - e.changedTouches[i].pageX
                                            pos2 = pos4 - e.changedTouches[i].pageY
                                            pos3 = e.changedTouches[i].pageX
                                            pos4 = e.changedTouches[i].pageY
                                        }
                                        const pic = document.querySelector(".avt-canvas").getBoundingClientRect()
                                        const frame = document.querySelector(".crop-frame").getBoundingClientRect()
                                        xCrop = frame.left - pic.left
                                        yCrop = frame.top - pic.top
                                        if (xCrop < 0){xCrop = 0}
                                        if (yCrop < 0){yCrop = 0}
                                        if (myDiv.offsetTop - pos2 >= - (myDiv.offsetHeight*zoom/2 - 100)  && myDiv.offsetTop - pos2 <= myDiv.offsetHeight*zoom/2 - 100){
                                            myDiv.style.top = (myDiv.offsetTop - pos2) + "px"
                                        }
                                        if (myDiv.offsetLeft - pos1 >= - (myDiv.offsetWidth*zoom/2 - 250) && myDiv.offsetLeft - pos1 <= myDiv.offsetWidth*zoom/2 - 250){
                                            myDiv.style.left = (myDiv.offsetLeft - pos1) + "px"
                                        }
                                    })
                                }
                        
                                function closeDragElementOnTouch() {
                                    document.ontouchend = null
                                    document.ontouchmove = null
                                }
                            }
                            document.querySelector(".save-edit-avt").onclick = function(){
                                document.querySelector(".avt-crop-modal").remove()
                                this.parentNode.parentNode.classList.add("modal-remove-down")
                                this.parentNode.parentNode.onanimationend = function () {
                                    window.history.back()
                                }
                                let xhttp
                                if (window.XMLHttpRequest) {
                                    xhttp = new XMLHttpRequest()
                                } else {
                                    xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                                }
                                let x, y
                                x = xCrop*size/zoom
                                y = yCrop*size/zoom
                                formData.append("xCrop", x)
                                formData.append("yCrop", y)
                                let ratio = Math.floor(size/zoom * 100) / 100
                                if (ratio * 500 > width - x && ratio * 200 < height){ratio = (width - x)/500}
                                if (ratio * 200 > height - y && ratio * 500 < width){ratio = (height - y)/200}
                                if (ratio * 500 > width - x && ratio * 200 > height - y){
                                    if (width - x > height - x) {ratio = (height - y)/200}
                                    else {ratio = (width - x)/500}
                                }
                                formData.append("size", ratio)
                                xhttp.onreadystatechange = function() {
                                if (xhttp.readyState == 4 && xhttp.status == 200) {
                                    const res = JSON.parse(xhttp.responseText)
                                    if (res.status == 'done'){
                                        document.querySelectorAll(".user-cover").forEach(function(e){
                                            e.setAttribute("src", "https://cdn.fodance.com/fd-media/" + res.data.cover)
                                        })
                                    }
                                    else {
                                        showAlert("Cập nhật ảnh không thành công!")
                                    }
                                }
                                }
                                xhttp.open("POST", "/upload-cover", true)
                                xhttp.send(formData)
                            }
                            URL.revokeObjectURL(img)
                        }
                        img.src = objectUrl
                    }
                    else {
                        document.querySelector(".cover-upload").value = null
                        showAlert("Hãy chọn ảnh đúng định dạng!")
                    }
                }
                fileReader.readAsArrayBuffer(file)
            }
        }
    }
}

function handleUpdateProfile(){
    if (document.querySelector(".add-info-but")){
        if (document.querySelector(".add-info-but").classList.contains("add-info-begin")){
            editProfileRedirect(document.querySelector(".add-info-but"), false)
        }
        document.querySelector(".add-info-but").onclick = function(){
            editProfileRedirect(this, true)
        }
    }
    if (document.querySelector(".user-auth")){
        let track, faceItv, dataURL
        let faceValid, faceValid1, faceValid2, faceValid3, faceValid4 = false
        document.querySelector(".user-auth").onclick = function(){
            if (document.querySelectorAll(".user-auth-modal").length == 0){
                const url = window.location.href
                history.pushState({
                }, '', url)
            
                document.querySelector(".avatar-frame").insertAdjacentHTML("afterbegin", `<div class='modal unfollow-modal'><div class='modal-content unfollow-modal-content d-flex-col'><div class='mg-b-lg'><h2 class='d-flex'>Xác thực tài khoản</h2><span>1.Bạn cần xác thực tài khoản của mình để có thể đăng video tham dự lên Lingyo, việc xác thực sẽ giúp chúng tôi xác nhận người tham gia trong video là bạn.</span><br><span>2.Bạn vẫn có thể tích điểm FP để tăng hạng dựa trên việc bình chọn video nếu không xác thực, tuy nhiên điểm cộng sẽ không nhiều!</span><br><span>3.Bạn cần điền đầy đủ thông tin trong phần cập nhật hồ sơ trước khi tiến hành xác thực</span></div><div class='d-flex-sb'><button class='df-but bold-font width-40 destroy-but'>Hủy</button><button class='df-but bold-font theme-bg white-color confirm-but'>Xác thực</button></div></div></div>`)
                document.querySelector(".confirm-but").onclick = function(){
                    document.querySelector(".unfollow-modal").remove()
                    document.querySelector(".avatar-frame").insertAdjacentHTML('beforeend', `<div class="modal unfollow-modal"><div class="user-auth-modal"><div class="modal-content unfollow-modal-content"><div class="group-title d-flex">
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
                    <div class="loading-frame d-flex"><span class="iconify spin loading-icon" data-icon="ant-design:loading-3-quarters-outlined" data-inline="false"></span></div>
                    </div>
                    <div class="d-flex"><h3 class="face-request pd">Chờ một chút trong khi chúng tôi nhận dạng khuôn mặt bạn!</h3></div>
                    </div></div></div>`)
                    const authVideo = document.querySelector('.auth-video')
                    showAlert(0)
                    Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                    faceapi.nets.faceExpressionNet.loadFromUri('/models')
                    ]).then(startVideo)
                    const video = document.createElement('video');
                    video.setAttribute('autoplay', '');
                    video.setAttribute('muted', '');
                    function startVideo() {

    const constraints = {
      video: true,
      audio: false
    };

    const handleSuccess = (stream) => {
      window.stream = stream;
      video.srcObject = stream;
    };

    const handleError = (error) => {
      const p = document.createElement('p');
      p.innerHTML = 'navigator.getUserMedia error: ' + error.name + ', ' + error.message;
      showAlert(error.name + ', ' + error.message)
      authVideo.nativeElement.appendChild(p);
    };

    navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
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
                document.querySelector(".destroy-but").onclick = function(){
                    document.querySelector(".modal").remove()
                }
            }
        }
    }
}
handleUpdateProfile()

function handleFollow(followBut, parent, username){
    if (followBut){
        followBut.onclick = function(){
            const user = parent.querySelector(".nav-red").getAttribute("data-user-df")
            const currentUserView = window.location.pathname.replace('/', '')
            const data = {
                user: user,
                currentUserView: currentUserView
            }
            if (this.getAttribute("data-following") == "false") {
                this.classList.add("following-but")
                this.setAttribute("data-following", "true")
                this.querySelector(".follow-text").textContent = "Đang theo dõi"
                data.following = false
                sendFollowAjax()
                if (document.querySelector(".frame-post-home")){
                    competitionContentText = document.querySelector(".main-frame").innerHTML
                }
            }
            else {
                document.querySelector(".main").insertAdjacentHTML("afterbegin", `<div class='modal unfollow-modal'><div class='modal-content unfollow-modal-content d-flex-col'><div class='mg-b-lg'><h2 class='d-flex'>Bỏ theo dõi ${username} ?</h2><span>Các video của họ sẽ không còn xuất hiện trên dòng thời gian cũng như xem người theo dõi trong Thể loại. Bạn sẽ không còn nhận thông báo về họ nhưng vẫn có thể thấy hồ sơ của họ.</span></div><div class='d-flex-sb'><button class='df-but bold-font width-40 destroy-but'>Hủy</button><button class='df-but bold-font theme-bg white-color confirm-but'>Bỏ theo dõi</button></div></div></div>`)
                if (document.querySelector(".main-frame-post-sort")){
                    document.querySelector(".main-frame-post-sort").style.zIndex = 0
                }
                document.querySelector(".main").querySelector(".destroy-but").onclick = function(){
                    document.querySelector(".unfollow-modal").remove()
                    if (document.querySelector(".main-frame-post-sort")){
                        document.querySelector(".main-frame-post-sort").style.zIndex = 2000
                    }
                }
                document.querySelector(".main").querySelector(".confirm-but").onclick = function(){
                    document.querySelector(".unfollow-modal").remove()
                    followBut.classList.remove("following-but")
                    followBut.setAttribute("data-following", "false")
                    followBut.querySelector(".follow-text").textContent = "Theo dõi"
                    data.following = true
                    if (document.querySelector(".main-frame-post-sort")){
                        document.querySelector(".main-frame-post-sort").style.zIndex = 2000
                    }
                    sendFollowAjax()
                    if (document.querySelector(".frame-post-home")){
                        competitionContentText = document.querySelector(".main-frame").innerHTML
                    }
                }            
            }
            function sendFollowAjax(){
                let xhttp
                if (window.XMLHttpRequest) {
                    xhttp = new XMLHttpRequest()
                } else {
                    xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                }
                xhttp.onreadystatechange = function() {
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        const res = JSON.parse(xhttp.responseText)
                        if (res.notification){
                            handleNotification("follow", data.user)
                        }
                        if (document.querySelector(".followers-total")){
                            document.querySelector(".followers-total").textContent = res.followers
                        }

                        if (document.querySelector(".following-total")){
                            document.querySelector(".following-total").textContent = res.following
                        }
                    }
                }
                xhttp.open("POST", '/follow-scription', true)
                xhttp.setRequestHeader('Content-Type', 'application/json')
                xhttp.send(JSON.stringify(data))
            }
        }
    }
}

function viewMediaRedirect(e, media, pushState){
    if (media == "photo"){
        if (window.innerWidth <= 662) {
            document.querySelector(".global").insertAdjacentHTML("beforeend", `
            <div class="modal view-post-modal">
            <div class="modal-content view-post-modal-content d-flex">
                <div class="close-view-post-modal return-but"><span class="iconify" data-icon="heroicons-outline:arrow-left" data-inline="false"></span></div>
                    <img src="${e.getAttribute("src")}" class="view-post-img">
                </div>
            </div>
            </div>
        `)
        }
        else {
            document.querySelector(".global").insertAdjacentHTML("beforeend", `
            <div class="modal view-post-modal">
            <div class="modal-content view-post-modal-content d-flex">
                <button class="close close-view-post-modal" type="button"><span class="iconify dropdown-icon" data-icon="feather:x" data-inline="false"></span></button>
                    <img src="${e.getAttribute("src")}" class="view-post-img">
                </div>
            </div>
            </div>
        `)
        }
    }
    else {
        if (window.innerWidth <= 662) {
            document.querySelector(".global").insertAdjacentHTML("beforeend", `
            <div class="modal view-post-modal">
            <div class="modal-content view-post-modal-content d-flex">
                <div class="close-view-post-modal return-but"><span class="iconify" data-icon="heroicons-outline:arrow-left" data-inline="false"></span></div>
                    <video src="${e.getAttribute("src")}" poster="/public/images/poster.png" class="view-post-img profile-video-view player">
                </div>
            </div>
            </div>
        `)
        }
        else {
            document.querySelector(".global").insertAdjacentHTML("beforeend", `
            <div class="modal view-post-modal">
            <div class="modal-content view-post-modal-content d-flex">
                <button class="close close-view-post-modal" type="button"><span class="iconify dropdown-icon" data-icon="feather:x" data-inline="false"></span></button>
                    <video poster="/public/images/poster.png" src="${e.getAttribute("src")}" class="view-post-img profile-video-view player">
                </div>
            </div>
            </div>
        `)
        }
        document.querySelector(".profile-video-view").play()
        Plyr.setup('video.player')
    }

    const url = window.location.href
    if (pushState){
        history.pushState({
        }, '', url)
    }

    document.querySelector(".close-view-post-modal").onclick = function(){  
        this.parentNode.parentNode.classList.add("modal-remove-down")
        this.parentNode.parentNode.onanimationend = function () {
            window.history.back()
        }
    }
}

function handleNavInfo(){
    function handleViewProfile(){
        if (document.querySelector(".user-avatar")){
            document.querySelector(".user-avatar").onclick = function(){
                viewMediaRedirect(this, "photo", true)
            }
        }
        if (document.querySelector(".user-cover")){
            document.querySelector(".user-cover").onclick = function(){
                viewMediaRedirect(this, "photo", true)
            }
        }
    }
    handleViewProfile()

    if (document.querySelector(".nav-info")){
        let followersDisplayedList = []
        function getFollowers(){
            let xhttp
            if (window.XMLHttpRequest) {
                xhttp = new XMLHttpRequest()
            } else {
                xhttp = new ActiveXObject("Microsoft.XMLHTTP")
            }
            const data = {
                nickname: window.location.pathname.replace('/', ''),
                followersDisplayedList: followersDisplayedList
            }
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    const res = JSON.parse(xhttp.responseText)
                    if (!document.querySelector(".follow-frame")){
                        document.querySelector(".info-frame").innerHTML = '<div class="info-personal-inner mg-t"><div class="follow-frame post none-pd"><div class="follow-title-frame d-flex"><div class="follow-title followers-title follow-title-active d-flex noselect"><span>Người theo dõi</span></div><div class="follow-title following-title d-flex noselect"><span>Đang theo dõi</span></div></div><div class="border-b"></div><div class="follow-content pd-l-lg pd-r-lg"></div><div class="seemore-frame pd-l-lg pd-r-lg pd-t pd-b"><span class="seemore-follow seemore-followers">Hiển thị thêm</span></div></div></div>'
                        document.querySelector(".info-personal-inner").scrollIntoView({block: "center"})
                    }
                    document.querySelector(".following-title").classList.remove("follow-title-active")
                    document.querySelector(".followers-title").classList.add("follow-title-active")
                    if (res.followersList.length == 0){
                        document.querySelector(".follow-content").innerHTML = '<div class="follow-hint">Hiện không có người theo dõi!</div>'
                        if (document.querySelector(".seemore-frame")){document.querySelector(".seemore-frame").remove()}
                    }
                    else {
                        if (followersDisplayedList.length <= res.total){
                            for(let i = 0; i < res.followersList.length; i++){
                                followersDisplayedList.push(res.followersId[i])
                                document.querySelector(".follow-content").insertAdjacentHTML('beforeend', `<div class="follow-hint"><a class="avt none-deco d-flex d-flex-start nav-red" nav-data="personal" data-user-df=${res.followersId[i]}>${(()=>{if (res.followersAvt[i].includes("http")) {return `
                                <img src="${res.followersAvt[i]}">
                                `}
                                else {return `
                                <img src="https://cdn.fodance.com/fd-media/${res.followersAvt[i]}">
                                `}
                                })()}<div class="d-flex-col-start"><span class="avt-username font-size-lg-1">${res.followersUsername[i]}</span><span class="avt-nickname">${res.followersList[i]}</span></div></a>${(() => {if (res.isFollowing[i]) {return '<button class="follow-but following-but" data-following="true"><span class="follow-text">Đang theo dõi</span></button>'} else if (res.isCurrentUser[i]) {return ''} else {return '<button class="follow-but" data-following="false"><span class="follow-text">Theo dõi</span></button>'}})()}</div>`)
                            }
                            if (followersDisplayedList.length == res.total){
                                if (document.querySelector(".seemore-frame")){document.querySelector(".seemore-frame").remove()}
                            }
                        }     
                    }
                    if (document.querySelector(".seemore-followers")){
                        document.querySelector(".seemore-followers").onclick = function(){
                            getFollowers()
                        }
                    }
                    const follow = document.querySelectorAll(".follow-but")
                    for (let i = 0; i < follow.length; i++){
                        if (follow[i].parentNode.querySelector(".avt-username")){
                            handleFollow(follow[i], follow[i].parentNode, follow[i].parentNode.querySelector(".avt-username").textContent)
                        }
                        if (follow[i].parentNode.querySelector(".avatar-username")){
                            handleFollow(follow[i], follow[i].parentNode, follow[i].parentNode.querySelector(".avatar-username").textContent)
                        }
                    }
                    handleNavigation()
                    document.querySelector(".following-title").onclick = function(){
                        followingDisplayedList = []
                        followersDisplayedList = []
                        document.querySelector(".followers-title").classList.remove("follow-title-active")
                        this.classList.add("follow-title-active")
                        document.querySelector(".follow-content").innerHTML = ''
                        if (!document.querySelector(".seemore-frame")){
                            document.querySelector(".follow-frame").insertAdjacentHTML('beforeend', '<div class="seemore-frame pd-l-lg pd-r-lg pd-t pd-b"><span class="seemore-follow seemore-following">Hiển thị thêm</span></div>')
                        }
                        getFollowing()
                    }
                }
            }
            xhttp.open("POST", '/personal-followers-scription', true)
            xhttp.setRequestHeader('Content-Type', 'application/json')
            xhttp.send(JSON.stringify(data))
        }

        let followingDisplayedList = []
        function getFollowing(){
            let xhttp
            if (window.XMLHttpRequest) {
                xhttp = new XMLHttpRequest()
            } else {
                xhttp = new ActiveXObject("Microsoft.XMLHTTP")
            }
            const data = {
                nickname: window.location.pathname.replace('/', ''),
                followingDisplayedList: followingDisplayedList
            }
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    const res = JSON.parse(xhttp.responseText)
                    if (!document.querySelector(".follow-frame")){
                        document.querySelector(".info-frame").innerHTML = '<div class="info-personal-inner mg-t"><div class="follow-frame post none-pd"><div class="follow-title-frame d-flex"><div class="follow-title followers-title d-flex noselect"><span>Người theo dõi</span></div><div class="follow-title following-title follow-title-active d-flex noselect"><span>Đang theo dõi</span></div></div><div class="border-b"></div><div class="follow-content pd-l-lg pd-r-lg"></div><div class="seemore-frame pd-l-lg pd-r-lg pd-t pd-b"><span class="seemore-follow seemore-following">Hiển thị thêm</span></div></div></div>'
                        document.querySelector(".info-personal-inner").scrollIntoView({block: "center"})
                    }
                    document.querySelector(".followers-title").classList.remove("follow-title-active")
                    document.querySelector(".following-title").classList.add("follow-title-active")
                    if (res.followingList.length == 0){
                        document.querySelector(".follow-content").innerHTML = '<div class="follow-hint">Hiện không theo dõi ai!</div>'
                        if (document.querySelector(".seemore-frame")){document.querySelector(".seemore-frame").remove()}
                    }
                    else {
                        if (followingDisplayedList.length <= res.total){
                            for(let i = 0; i < res.followingList.length; i++){
                                followingDisplayedList.push(res.followingId[i])
                                document.querySelector(".follow-content").insertAdjacentHTML('beforeend', `<div class="follow-hint"><a class="avt none-deco d-flex d-flex-start nav-red" nav-data="personal" data-user-df=${res.followingId[i]}>
                                ${(()=>{if (res.followingAvt[i].includes("http")) {return `
                                <img src="${res.followingAvt[i]}">
                                `}
                                else {return `
                                <img src="https://cdn.fodance.com/fd-media/${res.followingAvt[i]}">
                                `}
                                })()}
                                <div class="d-flex-col-start"><span class="avt-username font-size-lg-1">${res.followingUsername[i]}</span><span class="avt-nickname">${res.followingList[i]}</span></div></a>${(() => {if (res.isFollowing[i]) {return '<button class="follow-but following-but" data-following="true"><span class="follow-text">Đang theo dõi</span></button>'} else if (res.isCurrentUser[i]) {return ''} else {return '<button class="follow-but" data-following="false"><span class="follow-text">Theo dõi</span></button>'}})()}</div>`)
                            }
                            if (followingDisplayedList.length == res.total){
                                if (document.querySelector(".seemore-frame")){document.querySelector(".seemore-frame").remove()}
                            }
                        }
                    }
                    if (document.querySelector(".seemore-following")){
                        document.querySelector(".seemore-following").onclick = function(){
                            getFollowing()
                        }
                    }
                    const follow = document.querySelectorAll(".follow-but")
                    for (let i = 0; i < follow.length; i++){
                        if (follow[i].parentNode.querySelector(".avt-username")){
                            handleFollow(follow[i], follow[i].parentNode, follow[i].parentNode.querySelector(".avt-username").textContent)
                        }
                        if (follow[i].parentNode.querySelector(".avatar-username")){
                            handleFollow(follow[i], follow[i].parentNode, follow[i].parentNode.querySelector(".avatar-username").textContent)
                        }
                    }
                    handleNavigation()
                    document.querySelector(".followers-title").onclick = function(){
                        followingDisplayedList = []
                        followersDisplayedList = []
                        document.querySelector(".following-title").classList.remove("follow-title-active")
                        this.classList.add("follow-title-active")
                        document.querySelector(".follow-content").innerHTML = ''
                        if (!document.querySelector(".seemore-frame")){
                            document.querySelector(".follow-frame").insertAdjacentHTML('beforeend', '<div class="seemore-frame pd-l-lg pd-r-lg pd-t pd-b"><span class="seemore-follow seemore-followers">Hiển thị thêm</span></div>')
                        }
                        getFollowers()
                    }
                }
            }
            xhttp.open("POST", '/personal-following-scription', true)
            xhttp.setRequestHeader('Content-Type', 'application/json')
            xhttp.send(JSON.stringify(data))
        }
        const navInfo = document.querySelectorAll(".nav-info-but")
        for (let i = 0; i < navInfo.length; i++){
            navInfo[i].onclick = function(){
                for (let i = 0; i < navInfo.length; i++){
                    navInfo[i].classList.remove("nav-info-but-active")
                }
                navInfo[i].classList.add("nav-info-but-active")
                document.querySelector(".info-frame").innerHTML = '<div class="loading-frame d-flex"><span class="iconify spin loading-icon" data-icon="ant-design:loading-3-quarters-outlined" data-inline="false"></span></div>'
                if (i == 0){
                    document.querySelector(".info-frame").innerHTML = personalPostText
                    handleMainFrame()
                }
                if (i == 1){
                    followersDisplayedList = []
                    followingDisplayedList = []
                    getFollowers()
                }
                if (i == 2){
                    let imageDisplayedList = []
                    function getImages(){
                        let xhttp
                        if (window.XMLHttpRequest) {
                            xhttp = new XMLHttpRequest()
                        } else {
                            xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                        }
                        const data = {
                            nickname: window.location.pathname.replace('/', ''),
                            imageDisplayedList: imageDisplayedList
                        }
                        xhttp.onreadystatechange = function() {
                            if (xhttp.readyState == 4 && xhttp.status == 200) {
                                const res = JSON.parse(xhttp.responseText)
                                if (!document.querySelector(".image-frame")){
                                    document.querySelector(".info-frame").innerHTML = '<div class="info-personal-inner mg-t"><div class="post image-frame none-pd"><div class="group-title"><span>Ảnh đã tải lên</span></div><div class="border-b"></div><div class="media-content"></div><div class="seemore-frame pd-l-lg pd-r-lg pd-t pd-b"><span class="seemore-media seemore-image">Hiển thị thêm</span></div></div></div>'
                                    document.querySelector(".info-personal-inner").scrollIntoView({block: "center"})
                                }
                                if (res.images.length == 0){
                                    document.querySelector(".media-content").innerHTML = '<div class="follow-hint pd">Không có ảnh nào!</div>'
                                    if (document.querySelector(".seemore-frame")){document.querySelector(".seemore-frame").remove()}
                                }
                                else {
                                    if (imageDisplayedList.length <= res.total){
                                        for(let i = 0; i < res.postIdList.length; i++){
                                            imageDisplayedList.push(res.postIdList[i])
                                        }
                                        for(let i = 0; i < res.images.length; i++){
                                            document.querySelector(".media-content").insertAdjacentHTML('beforeend', `<div class="image-item"><img src="https://cdn.fodance.com/fd-media/${res.images[i]}" class="profile-images"><div>`)
                                        }
                                        if (imageDisplayedList.length == res.total){
                                            if (document.querySelector(".seemore-frame")){document.querySelector(".seemore-frame").remove()}
                                        }
                                    }
                                    document.querySelectorAll(".profile-images").forEach(function(e){
                                        e.onclick = function(){
                                            viewMediaRedirect(e, "photo", true)
                                        }
                                    })
                                }
                                if (document.querySelector(".seemore-image")){
                                    document.querySelector(".seemore-image").onclick = function(){
                                        getImages()
                                    }
                                }
                            }
                        }
                        xhttp.open("POST", '/personal-image-scription', true)
                        xhttp.setRequestHeader('Content-Type', 'application/json')
                        xhttp.send(JSON.stringify(data))
                    }
                    getImages()
                }
                if (i == 3){
                    let videoDisplayedList = []
                    function getVideos(){
                        let xhttp
                        if (window.XMLHttpRequest) {
                            xhttp = new XMLHttpRequest()
                        } else {
                            xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                        }
                        const data = {
                            nickname: window.location.pathname.replace('/', ''),
                            videoDisplayedList: videoDisplayedList
                        }
                        xhttp.onreadystatechange = function() {
                            if (xhttp.readyState == 4 && xhttp.status == 200) {
                                const res = JSON.parse(xhttp.responseText)
                                if (!document.querySelector(".video-frame")){
                                    document.querySelector(".info-frame").innerHTML = '<div class="info-personal-inner mg-t"><div class="post video-frame none-pd"><div class="group-title"><span>Video đã tải lên</span></div><div class="border-b"></div><div class="media-content"></div><div class="seemore-frame pd-l-lg pd-r-lg pd-t pd-b"><span class="seemore-media seemore-video">Hiển thị thêm</span></div></div></div>'
                                    document.querySelector(".info-personal-inner").scrollIntoView({block: "center"})
                                }
                                if (res.videos.length == 0){
                                    document.querySelector(".media-content").innerHTML = '<div class="follow-hint pd">Không có video nào!</div>'
                                    if (document.querySelector(".seemore-frame")){document.querySelector(".seemore-frame").remove()}
                                }
                                else {
                                    if (videoDisplayedList.length <= res.total){
                                        for(let i = 0; i < res.postIdList.length; i++){
                                            videoDisplayedList.push(res.postIdList[i])
                                        }
                                        for(let i = 0; i < res.videos.length; i++){
                                            document.querySelector(".media-content").insertAdjacentHTML('beforeend', `<div class="video-item"><video poster="/public/images/poster.png" src="https://cdn.fodance.com/fd-media/${res.videos[i]}#t=3" class="profile-videos"></video><div>`)
                                        }
                                        const videoItem = document.querySelectorAll(".video-item video")
                                        for (let i = 0; i < videoItem.length; i++){
                                            videoItem[i].onmouseover = function(){
                                                this.play()
                                                this.muted = true
                                            }
                                            videoItem[i].onmouseout = function(){
                                                this.pause()
                                                this.muted = true
                                            }
                                        }
                                        if (videoDisplayedList.length == res.total){
                                            if (document.querySelector(".seemore-frame")){document.querySelector(".seemore-frame").remove()}
                                        }
                                    }
                                    document.querySelectorAll(".profile-videos").forEach(function(e){
                                        e.onclick = function(){
                                            viewMediaRedirect(e, "video", true)
                                        }
                                    })
                                }
                                if (document.querySelector(".seemore-video")){
                                    document.querySelector(".seemore-video").onclick = function(){
                                        getVideos()
                                    }
                                }
                            }
                        }
                        xhttp.open("POST", '/personal-video-scription', true)
                        xhttp.setRequestHeader('Content-Type', 'application/json')
                        xhttp.send(JSON.stringify(data))
                    }
                    getVideos()
                }
            }
        }

        function navFollow(){
            followingDisplayedList = []
            followersDisplayedList = []
            if (document.querySelector(".follow-content")){
                document.querySelector(".follow-content").innerHTML = ''
            }
            const navInfo = document.querySelectorAll(".nav-info-but")
            for (let i = 0; i < navInfo.length; i++){
                navInfo[i].classList.remove("nav-info-but-active")
            }
            navInfo[1].classList.add("nav-info-but-active")
        }

        document.querySelector(".following").onclick = function(){
            document.querySelector(".info-personal-inner").scrollIntoView({block: "center"})
            navFollow()
            getFollowing()
        }
        document.querySelector(".followers").onclick = function(){
            document.querySelector(".info-personal-inner").scrollIntoView({block: "center"})
            navFollow()
            getFollowers()
        }
    }
}
handleNavInfo()

function handleSetting(type){
    if (document.querySelector(".setting-bar")){
        const settingItem = document.querySelectorAll(".setting-item")
        let generalSettingContentText
        if (document.querySelector(".general-setting-content")){
            generalSettingContentText = document.querySelector(".setting-content").innerHTML
            handleGeneralSetting()
        }
        function handleGeneralSetting(){
            document.querySelectorAll(".notification-checkbox").forEach(function(e){
                e.onchange = function(){
                    const data = {
                        checkboxData: e.getAttribute("data-checkbox"),
                        checkboxValue: e.checked
                    }
                    if (!e.checked){e.removeAttribute("checked")}
                    else {
                        const att = document.createAttribute("checked")
                        e.setAttributeNode(att)
                    }
                    generalSettingContentText = document.querySelector(".setting-content").innerHTML
                    let xhttp
                    if (window.XMLHttpRequest) {
                        xhttp = new XMLHttpRequest()
                    } else {
                        xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                    }
                    xhttp.open("POST", '/general-scription', true)
                    xhttp.setRequestHeader('Content-Type', 'application/json')
                    xhttp.send(JSON.stringify(data))
                }
            })
        }

        function handleFeedback(){
            document.querySelector(".setting-content").innerHTML = '<div class="group-title"><span class="font-size-lg-2 none-deco pd-l feedback-setting-content">Đóng góp ý kiến</span></div><div class="border-b"></div><div class="setting-handle"><textarea class="opinion-textarea" placeholder="Thêm ý kiến của bạn" name="opinion" maxlength="1000"></textarea><div class="mg-t"><span>Hãy cho chúng tôi biết nếu bạn có ý tưởng cái thiện Lingyo hoặc nếu phát hiện bất kì lỗi nào nhé!</span></div><button class="next-but submit-feedback mg-t">Gửi</button>'
            if (document.querySelector(".category")){
                document.querySelector(".category").innerHTML = '<div class="d-flex group-title"><span class="mg-l-lg font-size-lg-2 none-deco none-mg">Ý kiến và phản hồi</span></div>'
            }
            handleMobileResponse()
            document.querySelector(".submit-feedback").onclick = function(){
                if (document.querySelector(".opinion-textarea").value.trim().length <= 1000){
                    let xhttp
                    if (window.XMLHttpRequest) {
                        xhttp = new XMLHttpRequest()
                    } else {
                        xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                    }
                    const data = {
                        feedback: document.querySelector(".opinion-textarea").value.trim()
                    }
                    xhttp.onreadystatechange = function() {
                        if (xhttp.readyState == 4 && xhttp.status == 200) {
                            const res = JSON.parse(xhttp.responseText)
                            document.querySelector(".opinion-textarea").value = null
                            if (res.status == "thankyou"){
                                showAlert("Cảm ơn bạn đã gửi phản hồi!")
                            }
                            else {
                                showAlert("Hiện không thể gửi phản hồi!")
                            }
                        }
                    }
                    xhttp.open("POST", '/feedback-scription', true)
                    xhttp.setRequestHeader('Content-Type', 'application/json')
                    xhttp.send(JSON.stringify(data))
                }
                else {
                    showAlert("Hình như phản hồi của bạn quá dài!")
                }
            }
        }

        for (let i = 0; i < settingItem.length; i++){
            if (type == "feedback"){
                if (settingItem[i].classList.contains("setting-item-active")){
                    settingItem[i].classList.remove("setting-item-active")
                }
                if (settingItem[i].classList.contains("feedback-setting")){
                    settingItem[i].classList.add("setting-item-active")
                }
                handleFeedback()
            }
            settingItem[i].onclick = function(){
                if (document.querySelector(".setting-bar-mobile")) {
                    document.querySelector(".setting-content").scrollIntoView(true)
                }
                for (let i = 0; i < settingItem.length; i++){
                    settingItem[i].classList.remove("setting-item-active")
                }
                this.classList.add("setting-item-active")
                function delay(callback, ms) {
                    var timer = 0
                    return function() {
                      var context = this, args = arguments
                      clearTimeout(timer)
                      timer = setTimeout(function () {
                        callback.apply(context, args)
                      }, ms || 0)
                    }
                }
                if (document.querySelector(".category")){
                    document.querySelector(".category").innerHTML = '<div class="d-flex group-title"><span class="mg-l-lg font-size-lg-2 none-deco none-mg">Cài đặt</span></div>'
                }
                handleMobileResponse()
                if (this.classList.contains("general-setting")){
                    if (!document.querySelector(".general-setting-content")){
                        if (generalSettingContentText){
                            document.querySelector(".setting-content").innerHTML = generalSettingContentText
                        }
                        else {
                            let xhttp
                            if (window.XMLHttpRequest) {
                                xhttp = new XMLHttpRequest()
                            } else {
                                xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                            }
                            xhttp.onreadystatechange = function() {
                                if (xhttp.readyState == 4 && xhttp.status == 200) {
                                    const parser = new DOMParser()
                                    const page = parser.parseFromString(xhttp.responseText, 'text/html')
                                    document.querySelector(".setting-content").innerHTML = page.querySelector(".setting-content").innerHTML
                                }
                            }
                            xhttp.open("GET", '/setting', true)
                            xhttp.setRequestHeader('Content-Type', 'application/json')
                            xhttp.send()
                        }
                        handleGeneralSetting()
                    }
                }
                if (this.classList.contains("nickname-setting")){
                    let xhttp
                    if (window.XMLHttpRequest) {
                        xhttp = new XMLHttpRequest()
                    } else {
                        xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                    }
                    xhttp.onreadystatechange = function() {
                        if (xhttp.readyState == 4 && xhttp.status == 200) {
                            const res = JSON.parse(xhttp.responseText)
                            nicknameBeforeUpdate = res.nickname
                            if (!document.querySelector(".nickname-setting-content")){
                                document.querySelector(".setting-content").innerHTML = `<div class="group-title"><span class="font-size-lg-2 none-deco pd-l nickname-setting-content">Thay đổi tên người dùng</span></div><div class="border-b"></div><div class="setting-handle"><div class="mg-b"><span>Tên người dùng của bạn phải là duy nhất!</span></div><input type="text" name="nickname" class="nickname mg-t-sm" value="${res.nickname}"><span class="error red-color"></span><div class="pd-b"><button class="next-but mg-t-sm submit-nickname" disabled>Lưu</button></div></div>`
                            }
                            document.querySelector(".nickname").onkeyup = delay(function (e) {
                                document.querySelector(".error").textContent = ''
                                const special = /[^a-zA-Z0-9_]/
                                if (!special.test(this.value)){
                                    if (this.value.length >= 4 && this.value.length <= 15){
                                        let xhttp
                                        if (window.XMLHttpRequest) {
                                            xhttp = new XMLHttpRequest()
                                        } else {
                                            xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                                        }
                                        const data =  {
                                            nickname: this.value
                                        }
                                        xhttp.onreadystatechange = function() {
                                            if (xhttp.readyState == 4 && xhttp.status == 200) {
                                                const res = JSON.parse(xhttp.responseText)
                                                if (res.status == "valid"){
                                                    document.querySelector(".submit-nickname").disabled = false
                                                    document.querySelector(".submit-nickname").onclick = function(){
                                                        let xhttp
                                                        if (window.XMLHttpRequest) {
                                                            xhttp = new XMLHttpRequest()
                                                        } else {
                                                            xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                                                        }
                                                        xhttp.onreadystatechange = function() {
                                                            if (xhttp.readyState == 4 && xhttp.status == 200) {
                                                                const res = JSON.parse(xhttp.responseText)
                                                                if (res.status == 'done'){
                                                                    let xhttp
                                                                    if (window.XMLHttpRequest) {
                                                                        xhttp = new XMLHttpRequest()
                                                                    } else {
                                                                        xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                                                                    }
                                                                    xhttp.onreadystatechange = function() {
                                                                        if (xhttp.readyState == 4 && xhttp.status == 200) {
                                                                            const parser = new DOMParser()
                                                                            const page = parser.parseFromString(xhttp.responseText, 'text/html')
                                                                            document.querySelector(".setting-content").innerHTML = page.querySelector(".setting-content").innerHTML
                                                                        }
                                                                    }
                                                                    xhttp.open("GET", '/setting', true)
                                                                    xhttp.setRequestHeader('Content-Type', 'application/json')
                                                                    xhttp.send()
                                                                    showAlert("Bạn đã cập nhật tên người dùng của mình!")
                                                                    nicknameUpdate = data.nickname
                                                                    document.querySelectorAll(".header-nickname").forEach(function(e){
                                                                        e.setAttribute("data-user-df", nicknameUpdate)
                                                                    })
                                                                    document.querySelectorAll(".avatar-nickname").forEach(function(e){
                                                                        e.textContent = nicknameUpdate
                                                                    })
                                                                }
                                                                else {
                                                                    showAlert("Cập nhật tên người dùng không thành công!")
                                                                }
                                                            }
                                                        }
                                                        xhttp.open("POST", '/nickname-submit', true)
                                                        xhttp.setRequestHeader('Content-Type', 'application/json')
                                                        xhttp.send(JSON.stringify(data))
                                                    }
                                                }
                                                else {
                                                    document.querySelector(".error").textContent = "Tên người dùng đã có người đăng kí, vui lòng chọn tên khác!"
                                                    document.querySelector(".submit-nickname").disabled = true
                                                }
                                            }
                                        }
                                        xhttp.open("POST", '/nickname-registration', true)
                                        xhttp.setRequestHeader('Content-Type', 'application/json')
                                        xhttp.send(JSON.stringify(data))
                                    }
                                    else {
                                        document.querySelector(".error").textContent = "Tên người dùng của bạn phải có độ dài từ 4 đến 15 kí tự"
                                        document.querySelector(".submit-nickname").disabled = true
                                    }
                                }
                                else {
                                    document.querySelector(".error").textContent = "Tên người dùng của bạn chỉ có thể chứa kí tự, số và '_'"
                                    document.querySelector(".submit-nickname").disabled = true
                                }
                                
                            }, 500)
                        }
                    }
                    xhttp.open("POST", '/nickname-scription', true)
                    xhttp.setRequestHeader('Content-Type', 'application/json')
                    xhttp.send()
                }

                if (this.classList.contains("phone-setting")){
                    document.querySelector(".setting-content").innerHTML = '<div class="group-title"><span class="font-size-lg-2 none-deco pd-l">Thay đổi số điện thoại</span></div><div class="border-b"></div><div class="setting-handle"><div class="mg-b"><span>Trước hết hãy nhập mật khẩu hiện tại của bạn</span></div><input type="password" name="current-password" class="current-password mg-t-sm" autocomplete="new-password" placeholder="Nhập mật khẩu hiện tại"><span class="error red-color"></span><div class="pd-b"><button class="next-but submit-current-password mg-t" disabled>Xác nhận</button></div></div>'
                    document.querySelector(".current-password").onkeyup = function(){
                        document.querySelector(".submit-current-password").disabled = false
                    }
                    document.querySelector(".submit-current-password").onclick = function(){
                        let xhttp
                        if (window.XMLHttpRequest) {
                            xhttp = new XMLHttpRequest()
                        } else {
                            xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                        }
                        const data = {
                            password: document.querySelector(".current-password").value
                        }
                        xhttp.onreadystatechange = function() {
                            if (xhttp.readyState == 4 && xhttp.status == 200) {
                                const res = JSON.parse(xhttp.responseText)
                                if (res.status == 'correct-current-password'){
                                    document.querySelector(".setting-content").innerHTML = `<div class="group-title"><span class="font-size-lg-2 none-deco pd-l">Thay đổi số điện thoại</span></div><div class="border-b"></div><div class="setting-handle"><div class="mg-b"><span>${(()=>{if (res.phone){return `Số điện thoại hiện tại của bạn là ${res.phone}`} else {return 'Hiện chưa có số điện thoại nào liên kết với tài khoản của bạn'}})()}</span></div><input type="tel" name="new-phone" class="new-phone mg-t-sm" placeholder="Nhập số điện thoại mới"><span class="error red-color"></span><div class="pd-b"><button class="next-but submit-new-phone mg-t" disabled>Xác nhận</button></div></div>`
                                    function validatePhone(phone){
                                        const re = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
                                        return re.test(phone)
                                    }
                                    document.querySelector(".new-phone").onkeyup = delay(function (e) {
                                        document.querySelector(".error").textContent = ''
                                        if (validatePhone(this.value)){
                                            document.querySelector(".error").textContent = ''
                                            document.querySelector(".submit-new-phone").disabled = false
                                            document.querySelector(".submit-new-phone").onclick = function(){
                                                let xhttp
                                                if (window.XMLHttpRequest) {
                                                    xhttp = new XMLHttpRequest()
                                                } else {
                                                    xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                                                }
                                                const data = {
                                                    phone: document.querySelector(".new-phone").value
                                                }
                                                xhttp.onreadystatechange = function() {
                                                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                                                        const res = JSON.parse(xhttp.responseText)
                                                        if (res.status == "sms-sent"){
                                                            document.querySelector(".setting-content").innerHTML = `<div class="group-title"><span class="font-size-lg-2 none-deco pd-l">Thay đổi số điện thoại</span></div><div class="border-b"></div><div class="setting-handle"><div class="mg-b"><span>Nhập mã được gửi đến ${data.phone} để xác nhận</span></div><input type="text" name="code" class="code mg-t-sm" placeholder="Mã xác thực"><span class="error red-color"></span><div class="pd-b"><button class="next-but submit-code mg-t" disabled>Xác nhận</button></div></div>`
                                                            document.querySelector(".code").onkeyup = function(){
                                                                if (this.value != ''){
                                                                    document.querySelector(".submit-code").disabled = false
                                                                }
                                                                else {
                                                                    document.querySelector(".submit-code").disabled = true
                                                                } 
                                                            }
                                                            document.querySelector(".submit-code").onclick = function() {
                                                                let xhttp
                                                                if (window.XMLHttpRequest) {
                                                                    xhttp = new XMLHttpRequest()
                                                                } else {
                                                                    xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                                                                }
                                                                const data = {
                                                                    code: document.querySelector(".code").value
                                                                }
                                                                xhttp.onreadystatechange = function() {
                                                                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                                                                        const res = JSON.parse(xhttp.responseText)
                                                                        if (res.status == "phone-changed"){
                                                                            document.querySelector(".error").textContent = ""
                                                                            document.querySelector(".setting-content").innerHTML = '<div class="group-title"><span class="font-size-lg-2 none-deco pd-l">Thay đổi số điện thoại</span></div><div class="setting-handle"><div class="mg-b"><span class="theme-color">Bạn đã cập nhật số điện thoai mới thành công</span></div></div>'
                                                                        }
                                                                        else {
                                                                            document.querySelector(".error").textContent = "Mã xác nhận không chính xác!"
                                                                            document.querySelector(".error").classList.add('shake-content')
                                                                            document.querySelector(".error").onanimationend = function() {
                                                                                this.classList.remove('shake-content')
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                                xhttp.open("POST", '/code-submit', true)
                                                                xhttp.setRequestHeader('Content-Type', 'application/json')
                                                                xhttp.send(JSON.stringify(data))
                                                            }
                                                        }
                                                        else {
                                                            document.querySelector(".error").textContent = "Số điện thoại đã được sử dụng!"
                                                            document.querySelector(".error").classList.add('shake-content')
                                                            document.querySelector(".error").onanimationend = function() {
                                                                this.classList.remove('shake-content')
                                                            }
                                                        }
                                                    }
                                                }
                                                xhttp.open("POST", '/new-phone-submit', true)
                                                xhttp.setRequestHeader('Content-Type', 'application/json')
                                                xhttp.send(JSON.stringify(data))
                                            }
                                        }
                                        else {
                                            document.querySelector(".submit-new-phone").disabled = true
                                            document.querySelector(".error").textContent = "Số điện thoại không hợp lệ!"
                                            document.querySelector(".error").classList.add('shake-content')
                                            document.querySelector(".error").onanimationend = function() {
                                                this.classList.remove('shake-content')
                                            }
                                        }
                                    }, 500)
                                }
                                else {
                                    document.querySelector(".error").textContent = "Mật khẩu hiện tại không chính xác!"
                                    document.querySelector(".error").classList.add('shake-content')
                                    document.querySelector(".error").onanimationend = function() {
                                        this.classList.remove('shake-content')
                                    }
                                }
                            }
                        }
                        xhttp.open("POST", '/current-password-submit', true)
                        xhttp.setRequestHeader('Content-Type', 'application/json')
                        xhttp.send(JSON.stringify(data))
                    }
                }

                if (this.classList.contains("email-setting")){
                    document.querySelector(".setting-content").innerHTML = '<div class="group-title"><span class="font-size-lg-2 none-deco pd-l">Thay đổi email</span></div><div class="border-b"></div><div class="setting-handle"><div class="mg-b"><span>Trước hết hãy nhập mật khẩu hiện tại của bạn</span></div><input type="password" name="current-password" class="current-password mg-t-sm" autocomplete="new-password" placeholder="Nhập mật khẩu hiện tại"><span class="error red-color"></span><div class="pd-b"><button class="next-but submit-current-password mg-t" disabled>Xác nhận</button></div></div>'
                    document.querySelector(".current-password").onkeyup = function(){
                        document.querySelector(".submit-current-password").disabled = false
                    }
                    document.querySelector(".submit-current-password").onclick = function(){
                        let xhttp
                        if (window.XMLHttpRequest) {
                            xhttp = new XMLHttpRequest()
                        } else {
                            xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                        }
                        const data = {
                            password: document.querySelector(".current-password").value
                        }
                        xhttp.onreadystatechange = function() {
                            if (xhttp.readyState == 4 && xhttp.status == 200) {
                                const res = JSON.parse(xhttp.responseText)
                                if (res.status == 'correct-current-password'){
                                    document.querySelector(".setting-content").innerHTML = `<div class="group-title"><span class="font-size-lg-2 none-deco pd-l">Thay đổi email</span></div><div class="border-b"></div><div class="setting-handle"><div class="mg-b"><span>${(()=>{if (res.email){return `Email hiện tại của bạn là ${res.email}`} else {return 'Hiện chưa có email nào liên kết với tài khoản của bạn'}})()}</span></div><input type="email" name="new-email" class="new-email mg-t-sm" placeholder="Nhập địa chỉ email mới"><span class="error red-color"></span><div class="pd-b"><button class="next-but submit-new-email mg-t" disabled>Xác nhận</button></div></div>`
                                    function validateEmail(email) {
                                        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                        return re.test(email);
                                    }
                                    document.querySelector(".new-email").onkeyup = delay(function (e) {
                                        document.querySelector(".error").textContent = ''
                                        if (validateEmail(this.value)){
                                            document.querySelector(".error").textContent = ''
                                            document.querySelector(".submit-new-email").disabled = false
                                            document.querySelector(".submit-new-email").onclick = function(){
                                                let xhttp
                                                if (window.XMLHttpRequest) {
                                                    xhttp = new XMLHttpRequest()
                                                } else {
                                                    xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                                                }
                                                const data = {
                                                    email: document.querySelector(".new-email").value
                                                }
                                                xhttp.onreadystatechange = function() {
                                                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                                                        const res = JSON.parse(xhttp.responseText)
                                                        if (res.status == "sms-sent"){
                                                            document.querySelector(".setting-content").innerHTML = `<div class="group-title"><span class="font-size-lg-2 none-deco pd-l">Thay đổi email</span></div><div class="border-b"></div><div class="setting-handle"><div class="mg-b"><span>Nhập mã được gửi đến ${data.email} để xác nhận</span></div><input type="text" name="code" class="code mg-t-sm" placeholder="Mã xác thực"><span class="error red-color"></span><div class="pd-b"><button class="next-but submit-code mg-t" disabled>Xác nhận</button></div></div>`
                                                            document.querySelector(".code").onkeyup = function(){
                                                                if (this.value != ''){
                                                                    document.querySelector(".submit-code").disabled = false
                                                                }
                                                                else {
                                                                    document.querySelector(".submit-code").disabled = true
                                                                } 
                                                            }
                                                            document.querySelector(".submit-code").onclick = function() {
                                                                let xhttp
                                                                if (window.XMLHttpRequest) {
                                                                    xhttp = new XMLHttpRequest()
                                                                } else {
                                                                    xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                                                                }
                                                                const data = {
                                                                    code: document.querySelector(".code").value
                                                                }
                                                                xhttp.onreadystatechange = function() {
                                                                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                                                                        const res = JSON.parse(xhttp.responseText)
                                                                        if (res.status == "email-changed"){
                                                                            document.querySelector(".error").textContent = ""
                                                                            document.querySelector(".setting-content").innerHTML = '<div class="group-title"><span class="font-size-lg-2 none-deco pd-l">Thay đổi email</span></div><div class="setting-handle"><div class="mg-b"><span class="theme-color">Bạn đã cập nhật địa chỉ email mới thành công</span></div></div>'
                                                                        }
                                                                        else {
                                                                            document.querySelector(".error").textContent = "Mã xác nhận không chính xác!"
                                                                            document.querySelector(".error").classList.add('shake-content')
                                                                            document.querySelector(".error").onanimationend = function() {
                                                                                this.classList.remove('shake-content')
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                                xhttp.open("POST", '/code-submit', true)
                                                                xhttp.setRequestHeader('Content-Type', 'application/json')
                                                                xhttp.send(JSON.stringify(data))
                                                            }
                                                        }
                                                        else {
                                                            document.querySelector(".error").textContent = "Email đã được sử dụng!"
                                                            document.querySelector(".error").classList.add('shake-content')
                                                            document.querySelector(".error").onanimationend = function() {
                                                                this.classList.remove('shake-content')
                                                            }
                                                        }
                                                    }
                                                }
                                                xhttp.open("POST", '/new-email-submit', true)
                                                xhttp.setRequestHeader('Content-Type', 'application/json')
                                                xhttp.send(JSON.stringify(data))
                                            }
                                        }
                                        else {
                                            document.querySelector(".submit-new-email").disabled = true
                                            document.querySelector(".error").textContent = "Địa chỉ email không hợp lệ!"
                                            document.querySelector(".error").classList.add('shake-content')
                                            document.querySelector(".error").onanimationend = function() {
                                                this.classList.remove('shake-content')
                                            }
                                        }
                                    }, 500)
                                }
                                else {
                                    document.querySelector(".error").textContent = "Mật khẩu hiện tại không chính xác!"
                                    document.querySelector(".error").classList.add('shake-content')
                                    document.querySelector(".error").onanimationend = function() {
                                        this.classList.remove('shake-content')
                                    }
                                }
                            }
                        }
                        xhttp.open("POST", '/current-password-submit', true)
                        xhttp.setRequestHeader('Content-Type', 'application/json')
                        xhttp.send(JSON.stringify(data))
                    }
                }

                if (this.classList.contains("password-setting")){
                    document.querySelector(".setting-content").innerHTML = '<div class="group-title"><span class="font-size-lg-2 none-deco pd-l">Đổi mật khẩu</span></div><div class="border-b"></div><div class="setting-handle"><div class="mg-b"><span>Mật khẩu bao gồm ít nhất 8 kí tự và chứa số</span></div><input type="password" name="old-password" class="old-password mg-t-sm" autocomplete="new-password" placeholder="Nhập mật khẩu hiện tại"><input type="password" name="new-password" class="new-password mg-t-sm" autocomplete="new-password" placeholder="Nhập mật khẩu mới"><input type="password" name="confirm-password" class="confirm-password mg-t-sm" autocomplete="new-password" placeholder="Xác nhận mật khẩu mới"><span class="error red-color"></span><div class="pd-b"><button class="next-but submit-new-password mg-t" disabled>Lưu thay đổi</button></div></div>'
                    document.querySelector(".old-password").onkeyup = function(){
                        if (document.querySelector(".old-password").value != '' && document.querySelector(".new-password").value != '' && document.querySelector(".confirm-password").value != ''){
                            document.querySelector(".submit-new-password").disabled = false
                        }
                        else {
                            document.querySelector(".submit-new-password").disabled = true
                        }
                    }
                    document.querySelector(".new-password").onkeyup = function(){
                        if (document.querySelector(".old-password").value != '' && document.querySelector(".new-password").value != '' && document.querySelector(".confirm-password").value != ''){
                            document.querySelector(".submit-new-password").disabled = false
                        }
                        else {
                            document.querySelector(".submit-new-password").disabled = true
                        }
                    }
                    document.querySelector(".confirm-password").onkeyup = function(){
                        if (document.querySelector(".old-password").value != '' && document.querySelector(".new-password").value != '' && document.querySelector(".confirm-password").value != ''){
                            document.querySelector(".submit-new-password").disabled = false
                        }
                        else {
                            document.querySelector(".submit-new-password").disabled = true
                        }
                    }
                    document.querySelector(".submit-new-password").onclick = function(){
                        let xhttp
                        if (window.XMLHttpRequest) {
                            xhttp = new XMLHttpRequest()
                        } else {
                            xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                        }
                        const data = {
                            oldPassword: document.querySelector(".old-password").value,
                            newPassword: document.querySelector(".new-password").value,
                            confirmPassword: document.querySelector(".confirm-password").value
                        }
                        xhttp.onreadystatechange = function() {
                            if (xhttp.readyState == 4 && xhttp.status == 200) {
                                const res = JSON.parse(xhttp.responseText)
                                if (res.status == 'done'){
                                    document.querySelector(".error").textContent = ""
                                    document.querySelector(".setting-content").innerHTML = '<div class="group-title"><span class="font-size-lg-2 none-deco pd-l">Thay đổi mật khẩu</span></div><div class="setting-handle"><div class="mg-b"><span>Bạn đã cập nhật mật khẩu mới thành công</span></div></div>'
                                    showAlert("Bạn đã cập nhật mật khẩu mới thành công!")
                                }
                                else if (res.status == "same-password"){
                                    document.querySelector(".error").textContent = "Mật khẩu mới phải khác mật khẩu hiện tại!"
                                    document.querySelector(".error").classList.add('shake-content')
                                    document.querySelector(".error").onanimationend = function() {
                                        this.classList.remove('shake-content')
                                    }
                                }
                                else if (res.status == "two-password-not-match"){
                                    document.querySelector(".error").textContent = "Mật khẩu mới không trùng khớp!"
                                    document.querySelector(".error").classList.add('shake-content')
                                    document.querySelector(".error").onanimationend = function() {
                                        this.classList.remove('shake-content')
                                    }
                                }
                                else if (res.status == "new-password-not-valid"){
                                    document.querySelector(".error").textContent = "Mật khẩu mới không hợp lệ!"
                                    document.querySelector(".error").classList.add('shake-content')
                                    document.querySelector(".error").onanimationend = function() {
                                        this.classList.remove('shake-content')
                                    }
                                }
                                else if (res.status == "old-password-incorect"){
                                    document.querySelector(".error").textContent = "Mật khẩu hiện tại không chính xác!"
                                    document.querySelector(".error").classList.add('shake-content')
                                    document.querySelector(".error").onanimationend = function() {
                                        this.classList.remove('shake-content')
                                    }
                                }
                            }
                        }
                        xhttp.open("POST", '/password-change-submit', true)
                        xhttp.setRequestHeader('Content-Type', 'application/json')
                        xhttp.send(JSON.stringify(data))
                    }
                }

                if (this.classList.contains("feedback-setting")){
                    handleFeedback()
                }

                if (this.classList.contains("block-setting")){
                    document.querySelector(".setting-content").innerHTML = '<div class="group-title"><span class="font-size-lg-2 none-deco pd-l feedback-setting-content">Danh sách chặn</span></div><div class="border-b"></div><div class="setting-handle"><span>Không có gì hết!</span>'
                }
            }
        }
    }
}
handleSetting("setting")