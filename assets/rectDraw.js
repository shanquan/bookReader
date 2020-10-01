/**
 * 绘制点读区域
 */
var canvas = document.getElementById('area');
var context = canvas.getContext('2d');
var current = {
  color: 'black',
  offsetX: 0,
  offsetY: 8
};
var drawing = false;
// add events
function canvasSetupEvents(){
  document.getElementById('mark').classList.remove('hide');
  drawDashRect(0, 0, canvas.width, canvas.height, "black", true);
  canvas.style.zIndex = 99;
  canvas.addEventListener('mousedown', onMouseDown, false);
  canvas.addEventListener('mouseup', onMouseUp, false);
  canvas.addEventListener('mouseout', onMouseUp, false);
  canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);
  
  canvas.addEventListener('touchstart', onMouseDown, false);
  canvas.addEventListener('touchend', onMouseUp, false);
  canvas.addEventListener('touchcancel', onMouseUp, false);
  canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);
}
//remove events
function canvasRemoveEvents(){
  document.getElementById('mark').classList.add('hide');
  context.clearRect(0, 0, canvas.width, canvas.height);
  canvas.style.zIndex = 0;
  canvas.removeEventListener('mousedown', onMouseDown, false);
  canvas.removeEventListener('mouseup', onMouseUp, false);
  canvas.removeEventListener('mouseout', onMouseUp, false);
  canvas.removeEventListener('mousemove', throttle(onMouseMove, 500), false);
  
  canvas.removeEventListener('touchstart', onMouseDown, false);
  canvas.removeEventListener('touchend', onMouseUp, false);
  canvas.removeEventListener('touchcancel', onMouseUp, false);
  canvas.removeEventListener('touchmove', throttle(onMouseMove, 500), false);
}


// draw dash line
const drawDashLine = ([x1, y1], [x2, y2], step = 5) => {
  const x = x2 - x1,
  y = y2 - y1,
  count = Math.floor(Math.sqrt(x * x + y * y) / step),
  xv = x / count,
  yv = y / count;

  context.beginPath();
  for (let i = 0; i < count; i ++) {
      if (i % 2 === 0) {
        context.moveTo(x1, y1);
      } else {
        context.lineTo(x1, y1);
      }
    x1 += xv;
    y1 += yv;
  }
  context.lineWidth=current.lw||1;
  context.strokeStyle=current.color;
  context.lineTo(x2, y2);
  context.closePath();
}

// basic draw dash rect
const drawDashRectBase = (left, top, width, height, step = 5) => {
    drawDashLine([left, top], [left + width, top], step);
    context.stroke();
    drawDashLine([left + width, top], [left + width, top + height], step);
    context.stroke();
    drawDashLine([left + width, top + height], [left, top + height], step);
    context.stroke();
    drawDashLine([left, top + height], [left, top], step);
    context.stroke();
}

// draw dash Round
const drawDashRound = (x, y, radius, step = 5) => {
    const count = Math.floor(360 / step);
    step = 5 / 180 * Math.PI * 2;
    for (let b = 0, e = step / 2; e <= 360; b += step, e += step) {
      context.beginPath()
      context.arc(x, y, radius, b, e);
      context.stroke();
    }
}

function drawRect(x0, y0, x1, y1, color){
  if(x0==x1 && y0==y1){
    return false;
  }
  var w = Math.abs(x0-x1);
  var h = Math.abs(y0-y1);
  x0=Math.min(x0,x1);
  y0=Math.min(y0,y1);
  if(color)
  current.color = color;
  context.beginPath();
  context.lineWidth=current.lw||2;
  context.strokeStyle=current.color;
  context.rect(x0,y0,w,h);
  context.stroke();
  context.closePath();
  area = {"x":x0,"y":y0,"w":w,"h":h};
}

function drawDashRect(x0,y0,x1,y1,color){
  if(x0==x1 && y0==y1){
    return false;
  }
  var w = Math.abs(x0-x1);
  var h = Math.abs(y0-y1);
  x0=Math.min(x0,x1);
  y0=Math.min(y0,y1);
  if(color)
  current.color = color;
  drawDashRectBase(x0,y0,w,h)
}
function clearRect2(x0,y0,x1,y1){
  if(x0==x1 && y0==y1){
    return false;
  }
  var w = Math.abs(x0-x1);
  var h = Math.abs(y0-y1);
  x0=Math.min(x0,x1);
  y0=Math.min(y0,y1);
  // clear rect contains lineWidth
  var lineWidth = 2;
  context.clearRect(x0-lineWidth,y0-lineWidth,w+2*lineWidth,h+2*lineWidth)
}

function onMouseDown(e){
    drawing = true;
    current.offsetY = 8 - document.documentElement.scrollTop;
    current.x0 = Number(e.clientX||e.touches[0].clientX) - Number(current.offsetX);
    current.y0 = Number(e.clientY||e.touches[0].clientY) - Number(current.offsetY);
    e.preventDefault();
}

function onMouseUp(e){
    if (!drawing) { return; }
    drawing = false;
    try{
      if(current.x && current.y)
      clearRect2(current.x0, current.y0, current.x, current.y);
      var touch;
      if(e.touches){
        touch = e.touches.length?e.touches[0]:e.changedTouches[0];
      }
      current.x = Number(e.clientX||touch.clientX) - Number(current.offsetX);
      current.y = Number(e.clientY||touch.clientY) - Number(current.offsetY);
      drawRect(current.x0, current.y0, current.x, current.y, "green");
    }catch(e){console.log(e)}
}

function onMouseMove(e){
    if (!drawing) { return; }
    if(current.x&&current.y){
      clearRect2(current.x0, current.y0, current.x, current.y);
    }
    var touch;
    if(e.touches){
      touch = e.touches.length?e.touches[0]:e.changedTouches[0];
    }
    current.x = Number(e.clientX||touch.clientX) - Number(current.offsetX);
    current.y = Number(e.clientY||touch.clientY) - Number(current.offsetY);
    drawDashRect(current.x0, current.y0, current.x, current.y, "black");
}

// limit the number of events per second
function throttle(callback, delay) {
var previousCall = new Date().getTime();
return function() {
  var time = new Date().getTime();

  if ((time - previousCall) >= delay) {
    previousCall = time;
    callback.apply(null, arguments);
  }
};
}