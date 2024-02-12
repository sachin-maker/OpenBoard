let canvas=document.querySelector("canvas");
let pencilColor=document.querySelectorAll(".pencil-color");
let pencilWidthElem=document.querySelector(".pencil-width");
let eraserWidthElem=document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");

let penColor = "red";
let eraserColor = "white";
let penWidth = "3";
let eraserWidth = "3";


let undoRedoTracker=[];
let track=0;


canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let mouseDown = false;

let tool = canvas.getContext("2d");

tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

canvas.addEventListener("mousedown",(e)=>{
    mouseDown=true;
    // beginPath({
    //     x :e.clientX,
    //     y : e.clientY
    // });

    let data={
        x :e.clientX,
        y : e.clientY
    }
    //send data ro server
    socket.emit("beginPath",data);

    beginPath(data);
   
})
canvas.addEventListener("mousemove",(e)=>{
    if(mouseDown)
    {
        let data={
            x:e.clientX,
            y:e.clientY,
            color: eraserFlag ? eraserColor : penColor,
            width: eraserFlag ? eraserWidth : penWidth,
        }
        socket.emit("strokePath",data);
        strokePath(data);
    }

    


    

    
})

canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;

    undoRedoTracker.push(canvas.toDataURL());
    track = undoRedoTracker.length - 1;
    
})

function beginPath(strokObj){
    tool.beginPath();
    tool.moveTo(strokObj.x,strokObj.y);
}
function strokePath(strokeObj){

    tool.lineWidth = strokeObj.width;
    tool.strokeStyle = strokeObj.color;
    tool.lineTo(strokeObj.x,strokeObj.y);
    tool.stroke();
}

pencilColor.forEach((colorElem)=> {
    colorElem.addEventListener("click",(e)=>{
        let color=colorElem.classList[0];
        penColor=color;
        tool.strokeStyle=penColor;
    })
})

pencilWidthElem.addEventListener("change",(e)=>{
    penWidth=pencilWidthElem.value;
    tool.lineWidth=penWidth;
})

eraserWidthElem.addEventListener("change",(e)=>{
    eraserWidth=eraserWidthElem.value;
    tool.lineWidth=eraserWidth;
})

eraser.addEventListener("click", (e) => {
    

    if (eraserFlag) {
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    }
    else {
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})

download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "image.jpg";
    a.click();
})



undo.addEventListener("click",(e)=>{
    if (track > 0) track--;
    
    let data ={
        trackValue:track,
        undoRedoTracker
    }
   
    socket.emit("redoUndo",data);
     undoRedoCanvas(data);

})
redo.addEventListener("click",(e)=>{
      if (track < undoRedoTracker.length - 1) track++;

      let data ={
        trackValue:track,
        undoRedoTracker
    }
    // undoRedoCanvas(trackObj);

    socket.emit("redoUndo",data);
     undoRedoCanvas(data);

})

function undoRedoCanvas(trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;
    // console.log(trackObj);
    let img = new Image();
    img.src = undoRedoTracker[track];
    img.onload = (e) => tool.drawImage(img, 0, 0, canvas.width, canvas.height);
}



socket.on("beginPath",(data)=>{
    beginPath(data);
})


socket.on("beginPath",(data)=>{
   strokePath(data);
   
})

socket.on("redoUndo",(data)=>{
   undoRedoCanvas(data);
})


function KeyPress(e) {
    var evtobj = window.event ? event : e;
    if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
        tool.fillStyle = "white";
        tool.fillRect(0,0,window.innerWidth,window.innerHeight);
    }
}

document.onkeydown = KeyPress;