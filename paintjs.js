const canvas=document.querySelector("canvas"),
toolbtns=document.querySelectorAll(".tool"),
fillcolor=document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorbtns=document.querySelectorAll(".colors .option"),
colorpicker=document.querySelector("#color-picker"),
clearcanvas=document.querySelector(".clear-canvas"),
saveimg=document.querySelector(".save-img"),
ctx=canvas.getContext("2d");

let prevmouseX,prevmouseY,snapshot,
isDrawing=false,
selectedtool="brush",
brushwidth=5,
selectedcolor ="#000";

const setcanvasbackground=()=>{
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle=selectedcolor;
}

window.addEventListener("load",()=>{
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
    setcanvasbackground();
})

const drawrect=(e) => {
    if(!fillcolor.checked){
      return  ctx.strokeRect(e.offsetX,e.offsetY,prevmouseX- e.offsetX,prevmouseY- e.offsetY);
    }
    ctx.fillRect(e.offsetX,e.offsetY,prevmouseX-e.offsetX,prevmouseY-e.offsetY);

}

const drawcircle=(e)=>{
    ctx.beginPath();
    let radius=Math.sqrt(Math.pow((prevmouseX-e.offsetX),2)+Math.pow((prevmouseY-e.offsetY),2));
    ctx.arc(prevmouseX, prevmouseY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    fillcolor.checked?ctx.fill():ctx.stroke();
}

const drawtriangle=(e)=>{
    ctx.beginPath();
    ctx.moveTo(prevmouseX,prevmouseY);
    ctx.lineTo(e.offsetX,e.offsetY);
    ctx.lineTo(prevmouseX* 2- e.offsetX, e.offsetY);
    ctx.closePath();
    fillcolor.checked?ctx.fill():ctx.stroke();
}
const startdraw=(e) =>{
    isDrawing=true;
    prevmouseX=e.offsetX;
    prevmouseY=e.offsetY;
    ctx.beginPath();
    ctx.lineWidth=brushwidth;
    ctx.strokeStyle=selectedcolor;
    ctx.fillStyle=selectedcolor;
    snapshot=ctx.getImageData(0,0,canvas.width,canvas.height);
}
const drawing=(e) =>{
    if(!isDrawing) return;
    ctx.putImageData(snapshot,0,0);

    if(selectedtool==="brush"||selectedtool==="eraser"){
    ctx.strokeStyle=selectedtool==="eraser"?"#fff":selectedcolor;
    ctx.lineTo(e.offsetX,e.offsetY);
    ctx.stroke();}

    else if(selectedtool==="rectangle"){
        drawrect(e);}

    else if(selectedtool==="circle"){
            drawcircle(e);
        }
        
    else if(selectedtool==="triangle"){
            drawtriangle(e);
        }}

toolbtns.forEach(btn => {
    btn.addEventListener("click",() => {
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedtool=btn.id;
        console.log(selectedtool);
    });
});
sizeSlider.addEventListener("change",()=>brushwidth=sizeSlider.value);

colorbtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
   selectedcolor=window.getComputedStyle(btn).getPropertyValue("background-color");
});
});

colorpicker.addEventListener("change",()=>{
    colorpicker.parentElement.style.background=colorpicker.value;
    colorpicker.parentElement.click();
});

clearcanvas.addEventListener("click",()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    setcanvasbackground();
});
saveimg.addEventListener("click",()=>{
    const link=document.createElement("a");
    link.download=`${Date.now()}.jpg`;
    link.href=canvas.toDataURL();
    link.click();
});

canvas.addEventListener("mousedown",startdraw);
canvas.addEventListener("mousemove",drawing);
canvas.addEventListener("mouseup",()=>isDrawing=false);