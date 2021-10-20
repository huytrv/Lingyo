document.querySelector(".store").onclick = function(){
  let xhttp
                if (window.XMLHttpRequest) {
                    xhttp = new XMLHttpRequest()
                } else {
                    xhttp = new ActiveXObject("Microsoft.XMLHTTP")
                }
                xhttp.onreadystatechange = function() {
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                    }
                  }
                xhttp.open("POST", 'https://lingyo.vn/store', true)
                xhttp.setRequestHeader('Content-Type', 'application/json')
                xhttp.send(JSON.stringify(data))
}