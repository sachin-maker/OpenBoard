let optionsCount = document.querySelector(".options-cont");
let toolCount = document.querySelector(".tools-cont");
let pencilToolCont = document.querySelector(".pencil-tool");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let pencil = document.querySelector(".pencils");
let eraser = document.querySelector(".eragers")
let sticky = document.querySelector(".sticky-notes");
let upload = document.querySelector(".upload");


let pencilFlag = false;
let eraserFlag = false;
let optionsFlag = true;

optionsCount.addEventListener("click", (e) => {
    optionsFlag = !optionsFlag;

    if (optionsFlag) openTool();
    else closedTool();


})

function openTool() {
    let iconElem = optionsCount.children[0];
    iconElem.classList.remove("fa-times");
    iconElem.classList.add("fa-bars");
    toolCount.style.display = "flex";

}
function closedTool() {
    let iconElem = optionsCount.children[0];
    iconElem.classList.remove("fa-bars");
    iconElem.classList.add("fa-times");
    toolCount.style.display = "none";
    pencilToolCont.style.display = "none";
    eraserToolCont.style.display = "none";
}

pencil.addEventListener("click", (e) => {
    pencilFlag = !pencilFlag;
    if (pencilFlag) pencilToolCont.style.display = "block";
    else pencilToolCont.style.display = "none"
})
eraser.addEventListener("click", (e) => {
    eraserFlag = !eraserFlag;
    if (eraserFlag) eraserToolCont.style.display = "flex";
    else eraserToolCont.style.display = "none"
})


sticky.addEventListener("click", (e) => {

    let stickytempleteHTML = `
    <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-cont">
            <textarea ></textarea>
        </div>
    `;

    createSticky(stickytempleteHTML)



})

upload.addEventListener("click", (e) => {

    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickytempleteHTML = `
        <div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>
    <div class="note-cont">
        <img src="${url}"/>
    </div>
        `;

        createSticky(stickytempleteHTML);



    })
});

 function createSticky(stickytempleteHTML) {
        let stickyCont = document.createElement("div");
        stickyCont.setAttribute("class", "sticky-cont");
        stickyCont.innerHTML = stickytempleteHTML

        document.body.appendChild(stickyCont);

        let minimize = stickyCont.querySelector(".minimize");
        let remove = stickyCont.querySelector(".remove");
        notesAction(minimize, remove, stickyCont);

        stickyCont.onmousedown = function (event) {
            dragAndDrop(stickyCont, event);
        };

        stickyCont.ondragstart = function () {
            return false;
        };
    }



function notesAction(minimize, remove, stickyCont) {
    remove.addEventListener("click", (e) => {
        stickyCont.remove();
    })

    minimize.addEventListener("click", (e) => {
        let noteCount = stickyCont.querySelector(".note-cont");
        let display = getComputedStyle(noteCount).getPropertyValue("display");
        if (display === "none") noteCount.style.display = "block";
        else noteCount.style.display = "none";
    })

}


function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the ball, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}