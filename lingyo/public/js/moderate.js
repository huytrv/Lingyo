const socket=io("https://lingyo.vn");const rankList=["primary","intermediate","highgrade"];const rankName=["S\u01a1 c\u1ea5p","Trung c\u1ea5p","Cao c\u1ea5p"];const cateList=["freestyle","hiphop","rap","contemporary","ballroom","modern","ballet","shuffle","jazz","sexy","flashmob","other"];const cateName=["Nh\u1ea3y t\u1ef1 do","Hiphop","Rap","M\xFAa \u0111\u01b0\u01a1ng \u0111\u1ea1i","Khi\xEAu v\u0169","Nh\u1ea3y hi\u1ec7n \u0111\u1ea1i","M\xFAa ba l\xEA","Shuffle","Jazz","Sexy","Fashmob","Kh\xE1c"];if(document["querySelector"]("video")){document["querySelector"]("video")["play"]()};const postDisplayed=[];const posts=document["querySelectorAll"](".post-moderate");for(let i=0;i< posts["length"];i++){postDisplayed["push"](posts[i]["getAttribute"]("data-post-df"))};socket["emit"]("displayed-post",postDisplayed);function viewImage(){const postMedia=document["querySelectorAll"](".media-post");for(let i=0;i< postMedia["length"];i++){postMedia[i]["onclick"]= function(){document["querySelector"](".main")["insertAdjacentHTML"]("beforeend",`
            <div class="modal view-post-modal">
            <div class="modal-content view-post-modal-content d-flex">
                <div class="close-view-post-modal return-but"><span class="iconify" data-icon="heroicons-outline:arrow-left" data-inline="false"></span></div>
                    <img src="https://cdn.lingyo.vn/lingyo-media/${postMedia[i]["getAttribute"]("src")}" class="view-post-img">
                </div>
            </div>
            </div>
        `);document["querySelector"](".close-view-post-modal")["onclick"]= function(){document["querySelector"](".view-post-modal")["remove"]()}}}}viewImage();socket["on"]("post-need-moderate",function(posts){console["log"](123);window["navigator"]["vibrate"](800);if(posts&& posts["length"]!= 0){if(document["querySelector"](".none-video")){document["querySelector"](".none-video")["remove"]()};for(let i=0;i< posts["length"];i++){if(document["querySelector"](`.post[data-post-df='${posts[i]["postId"]}']`)){postDisplayed["push"](posts[i]["postId"]);socket["emit"]("displayed-post",postDisplayed)};document["querySelector"](".moderate-content")["insertAdjacentHTML"]("beforeend",`<div class="d-flex-col post-moderate" data-post-df="${posts[i]["postId"]}" data-post-ms="${posts[i]["ms"]}" data-post-competition="${posts[i]["competition"]}">
            <div class="pre-post-media">
                ${(()=>{if(posts[i]["file"]["type"]== "video"){return `
                    <video muted controls src="https://cdn.lingyo.vn/lingyo-media/${posts[i]["file"]["path"][0]}"></video>
                `}else {return `
                ${(()=>{if(posts[i]["file"]["path"]["length"]== 1){return `
                    <div class="post-file">
                        <img src="https://cdn.lingyo.vn/lingyo-media/${posts[i]["file"]["path"][0]}" class="media-post post-image">
                    </div>
                `}else {if(posts[i]["file"]["path"]["length"]== 2){return `
                    <div class="post-file thumb-2-files">
                        <div class="thumb-file">
                            <img src="https://cdn.lingyo.vn/lingyo-media/${posts[i]["file"]["path"][0]}" class="media-post post-image">
                        </div>
                        <div class="thumb-file">
                            <img src="https://cdn.lingyo.vn/lingyo-media/${posts[i]["file"]["path"][1]}" class="media-post post-image">
                        </div>
                    </div>
                `}else {if(posts[i]["file"]["path"]["length"]== 3){return `
                    <div class="post-file thumb-3-files">
                        <div class="thumb-file">
                            <img src="https://cdn.lingyo.vn/lingyo-media/${posts[i]["file"]["path"][0]}" class="media-post post-image">
                        </div>
                        <div class="thumb-file">
                            <img src="https://cdn.lingyo.vn/lingyo-media/${posts[i]["file"]["path"][1]}" class="media-post post-image">
                        </div>
                        <div class="thumb-file">
                            <img src="https://cdn.lingyo.vn/lingyo-media/${posts[i]["file"]["path"][2]}" class="media-post post-image">
                        </div>
                    </div>
                `}else {if(posts[i]["file"]["path"]["length"]== 4){return `
                    <div class="post-file thumb-4-files">
                        <div class="thumb-file">
                            <img src="https://cdn.lingyo.vn/lingyo-media/${posts[i]["file"]["path"][0]}" class="media-post post-image">
                        </div>
                        <div class="thumb-file">
                            <img src="https://cdn.lingyo.vn/lingyo-media/${posts[i]["file"]["path"][1]}" class="media-post post-image">
                        </div>
                        <div class="thumb-file">
                            <img src="https://cdn.lingyo.vn/lingyo-media/${posts[i]["file"]["path"][2]}" class="media-post post-image">
                        </div>
                        <div class="thumb-file">
                            <img src="https://cdn.lingyo.vn/lingyo-media/${posts[i]["file"]["path"][3]}" class="media-post post-image">
                        </div>
                    </div>
                `}}}}})()}
                `}})()}
                <div class="pre-post-cate">${posts[i]["category"]} - ${posts[i]["rank"]}</div>
            </div>
            <div class="d-flex pd width-100">
                <button class="submit-but validate-video" data-valid="true">Chấp nhận</button>
                <button class="submit-but danger-color validate-video" data-valid="false">Không hợp lệ</button>
            </div>
            </div>`);viewImage();console["log"](0);validateMedia(posts[i])}}});socket["off"]("post-need-moderate",function(){});function handleNotification(type,source){let xhttp;if(window["XMLHttpRequest"]){xhttp=  new XMLHttpRequest()}else {xhttp=  new ActiveXObject("Microsoft.XMLHTTP")};const data={type:type,source:source};xhttp["open"]("POST","/notification",true);xhttp["setRequestHeader"]('Content-Type','application/json');xhttp["send"](JSON["stringify"](data))}function validateMedia(post){const validateBut=document["querySelectorAll"](".validate-video");for(let i=0;i< validateBut["length"];i++){validateBut[i]["onclick"]= function(){const data={validData:validateBut[i]["getAttribute"]("data-valid"),postId:validateBut[i]["parentNode"]["parentNode"]["getAttribute"]("data-post-df")};socket["emit"]("/validate-video",data);console["log"](data["validData"]);if(post){let cate,rank;for(let i=0;i< cateList["length"];i++){if(post["category"]== cateList[i]){cate= cateName[i]}};for(let i=0;i< rankList["length"];i++){if(post["rank"]== rankList[i]){rank= rankName[i]}};if(data["validData"]== "true"){handleNotification("post-done",[post["postId"],cate,rank,post["ms"],post["competition"]])}else {handleNotification("post-err",[post["postId"],cate,rank,post["ms"],post["competition"]])}}else {const ps=validateBut[i]["parentNode"]["parentNode"]["parentNode"]["querySelector"](".post-moderate");postId= ps["getAttribute"]("data-post-df");c= ps["querySelector"](".pre-post-cate")["textContent"];r= ps["querySelector"](".pre-post-rank")["textContent"];ms= ps["getAttribute"]("data-post-ms");competition= ps["getAttribute"]("data-post-competition");for(let i=0;i< cateList["length"];i++){if(c== cateList[i]){cate= cateName[i]}};for(let i=0;i< rankList["length"];i++){if(rank== rankList[i]){rank= rankName[i]}};if(data["validData"]== "true"){handleNotification("post-done",[postId,cate,rank,ms,competition])}else {handleNotification("post-err",[postId,cate,rank,ms,competition])}};validateBut[i]["parentNode"]["parentNode"]["remove"]()}}}validateMedia();socket["on"]("video-validated",function(data){if(document["querySelector"](`.post-moderate[data-post-df='${data}']`)){document["querySelector"](`.post-moderate[data-post-df='${data}']`)["remove"]()}})