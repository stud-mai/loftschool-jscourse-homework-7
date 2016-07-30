let body = document.body,
    button = document.querySelector('#button'),
    saveBtn = document.querySelector('#saveButton'),
    container = document.querySelector('#container'),
    divs = body.getElementsByTagName('div'),
    targetDiv, targetDivX, targetDivY;

function generateNewDiv() {
    let div = document.createElement('div'),
        currentNumb = 0,
        top, left,
        width, height;
    let minDimension = 30,
        maxDimension = 300;

    function random(min,max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    for (let i = divs.length-1; i>=0; i--){
        if (divs[i].getAttribute('id').indexOf('div-') == 0){
            currentNumb = Number(divs[i].getAttribute('id').slice(4));
            break;
        }
    }

    width = random(minDimension,maxDimension);
    height = random(minDimension,maxDimension);
    top = random(0,window.innerHeight - height/2);
    left = random(0,window.innerWidth - width/2);
    div.id = 'div-' + ++currentNumb;
    div.style.position = 'absolute';
    div.style.width = width + 'px';
    div.style.height = height + 'px';
    div.style.top = top + 'px';
    div.style.left = left + 'px';
    div.style.backgroundColor = `rgb(${random(0,255)},${random(0,255)},${random(0,255)})`;
    container.appendChild(div);
}
function capture(e) {
    if (e.target.getAttribute('id').indexOf('div-') == 0){
        targetDiv = e.target;
        targetDivX = e.offsetX;
        targetDivY = e.offsetY;
        targetDiv.style.zIndex = 500;
    }
}
function move(e) {
    if (targetDiv){
        targetDiv.style.left = e.pageX - targetDivX + 'px';
        targetDiv.style.top = e.pageY - targetDivY + 'px';
    }
}
function release(e) {
    if (e.target.getAttribute('id').indexOf('div-') == 0) {
        targetDiv.style.zIndex = 0;
        targetDiv = null;
        targetDivX = null;
        targetDivY = null;
    }
}
function savePositionBase64() {
    let date = new Date(),
        string = container.innerHTML;

    date.setTime(date.valueOf()+(31*24*3600*1000));
    document.cookie=`savedState=${btoa(string)}; expires=${date.toGMTString()}`;
}
function resetPositionBase64() {
    let cookies = document.cookie;

    if (cookies) {
        let tempCookie = cookies.split('; ');
        for (let i = 0; i < tempCookie.length; i++){
            let parts = tempCookie[i].split('=');
            if (parts[0] == 'savedState'){
                container.innerHTML = atob(parts[1]);
                break;
            }
        }
    }
}
function savePositionJSON() {
    let date = new Date(),
        json = {};

    for (let div of container.children){
        json[div.id] = {
            width: div.style.width,
            height: div.style.height,
            top: div.style.top,
            left: div.style.left,
            color: div.style.backgroundColor
        }
    }
    date.setTime(date.valueOf()+(31*24*3600*1000));
    document.cookie=`savedState=${JSON.stringify(json)}; expires=${date.toGMTString()}`;
}
function resetPositionJSON() {
    let cookies = document.cookie;

    if (cookies) {
        let tempCookie = cookies.split('; ');
        for (let i = 0; i < tempCookie.length; i++){
            let parts = tempCookie[i].split('=');
            if (parts[0] == 'savedState'){
                let json = JSON.parse(parts[1]);
                for (let obj in json){
                    let div = document.createElement('div');
                    div.id = obj;
                    div.style.position = 'absolute';
                    div.style.width = json[obj].width;
                    div.style.height = json[obj].height;
                    div.style.top = json[obj].top;
                    div.style.left = json[obj].left;
                    div.style.backgroundColor = json[obj].color;
                    container.appendChild(div);
                }
                break;
            }
        }
    }
}

button.addEventListener('click', generateNewDiv);
//saveBtn.addEventListener('click', savePositionBase64); // Using Base64 encoding
//document.addEventListener('DOMContentLoaded', resetPositionBase64); // Using Base64 decoding
saveBtn.addEventListener('click', savePositionJSON); // Using json.stringify
document.addEventListener('DOMContentLoaded', resetPositionJSON); // Using json.stringify
document.addEventListener('mousedown', capture);
document.addEventListener('mousemove', move);
document.addEventListener('mouseup', release);