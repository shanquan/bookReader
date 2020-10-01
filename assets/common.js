/**
 * common book codes
 * @2020-09-24
 * author wang.weili
 */
var querys = getQuerys();
var slider,
objData,
sound,
duration,// 音频时长
offset=0,
delta=0,//累计暂停时间
playInterval,
autoSlide=false,
source,//当前音频资源
soundSources = [];

var btnPrev = document.querySelector("svg.prev"),
btnNext = document.querySelector("svg.next"),
btnPlay = document.getElementsByName('play')[0],
btnPause = document.getElementsByName('play')[1],
timeTags = document.getElementById("tags");

// position:absolute改为position:fixed即可
// document.onscroll = function(){
//   var tp = document.documentElement.scrollTop;
//   var mark = document.getElementById("mark");
//   var mode = document.getElementById("mode")
//   document.querySelector("svg.goBack").style.top = tp;
//   if(mark)
//   document.getElementById("mark").style.top = tp+"px";
//   if(mode)
//   document.getElementById("mode").style.top = tp+"px";
// }
// 侦听空格键暂停与播放
document.addEventListener('keydown',function (event) {
  var code = event.keyCode || event.charCode || event.which;
  if(code==32){
      if(btnPlay.classList.contains('hide')){
          pauseAudio();
      }else{
          playAudio()
      }
      event.preventDefault();
  }
},true)
document.querySelector("svg.goBack").addEventListener('click',goList,false);
function goList(){
  if(location.hash){
    var prefix = window.cordova?"file:///android_asset/www/index.html":document.location.protocol+"//"+window.location.host
    switch(querys.series){
      case "ort": location.href = prefix+"#list?series="+querys.series+"&name="+querys.name.substring(0,4);location.reload();break;
      case "goodEnglish": location = prefix+"#list?series="+querys.series+"&name="+querys.name.substring(0,2).toUpperCase();location.reload();break;
    }
  }else{
    var prefix = window.cordova?"file:///android_asset/www/":document.location.protocol+"//"+window.location.host+"/"
    switch(querys.series){
      case "ort": location.href = prefix+"list_.html?series="+querys.series+"&name="+querys.name.substring(0,4);location.reload();break;
      case "goodEnglish": location = prefix+"list_.html?series="+querys.series+"&name="+querys.name.substring(0,2).toUpperCase();location.reload();break;
    }
  }
}
// document.querySelector("svg.nextBk").addEventListener('click',function(){
//     console.log('load next book')
// },false);
// 从指定时间重新开始播放
function playAtPos(time){
  stopAudio();
  if(time){
    delta = audioCtx.currentTime - time;
    startAudio(time)
  }else{
    delta = audioCtx.currentTime - source.time[slider.getPos()];
    startAudio(source.time[slider.getPos()])
  }
}
// 获取音频播放时间
function getCurrentTime(){
  return Math.min(audioCtx.currentTime-delta,duration);
}
function formatSecs(seconds){
  if(seconds&&seconds>=0){
      var mins=0,secs=0;
      if(seconds>=60){
          mins = parseInt(seconds/60);
          secs = parseInt(seconds%60);
      }else{
          secs = parseInt(seconds)
      }
      mins = mins>=10?mins:'0'+mins;
      secs = secs>=10?secs:'0'+secs;
      return mins+':'+secs
  }else{
      return "00:00"
  }
}

function stopAudio(){
  if(sound){
      offset = audioCtx.currentTime;
      sound.stop();
      sound.onended = null;
      sound=null
  }
  if(playInterval){
      clearInterval(playInterval);
  }
}