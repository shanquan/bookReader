var offLen=0.6, // 音频打点提前时长，默认纠偏值
  area={},//点读区域坐标
  canDraw = true; // 允许点读区域绘制
  //不绘制点读区域时，听到翻页音频前，按下btnNext翻页按钮自动记录翻页时间
  //绘制点读区域时，听到点读音频前，按下btnPause按钮暂停音频，显示画板后按下btnNext按钮翻页，
  // 绘制矩形后，按勾记录点读区域和时间

btnPrev.addEventListener('click',function(){
  if(slider)
  slider.prev();
},false);
btnNext.addEventListener('click',function(){
  if(slider)
  slider.next();
},false);
// play
btnPlay.addEventListener('click',playAudio,false);
function playAudio(){
  btnPlay.classList.add('hide');
  btnPause.classList.remove('hide');
  if(slider)
  slider.resume();
  delta += audioCtx.currentTime - offset;
  startAudio();
  if(canDraw)
  canvasRemoveEvents();
}
// pause
btnPause.addEventListener('click',pauseAudio,false);
function pauseAudio(){
  btnPause.classList.add('hide');
  btnPlay.classList.remove('hide');
  if(slider)
  slider.stop();
  stopAudio();
  if(canDraw)
  canvasSetupEvents();
}
document.querySelector("svg.check").addEventListener('click',function(){
  playAudio();
  if(area.x){
      area.time = Number((getCurrentTime()-offLen).toFixed(3));
      var idx = slider.getPos();
      objData.pages[idx].areas.push(area);
      if(objData.audios[source.id].time[idx]===undefined){
          objData.audios[source.id].time.push(area.time)
      }
      // console.log(objData)
  }
},false);
document.querySelector("svg.clear").addEventListener('click',function(){
  if(canvas&&context){
      context.clearRect(1, 1, canvas.width-2, canvas.height-2);
  }
},false);
if(querys.series){
w3.getHttpObject(BASEURL+querys.series+"/"+querys.name+".json",function(obj){
  console.log(obj);
  objData = obj;
  w3.displayObject("audioList", {"audios":obj.audios.map(function(el,idx){el.id=idx;return el})});
  obj.pages.forEach(function(el,idx){
      var swipe = document.querySelector(".swipe-wrap");
      var fg = document.createElement('figure');
      if(idx!=0){
          fg.classList.add('hide')
      }
      if(typeof el.pic == "string"){
          var fc = document.createElement('div');
          fc.classList.add('face');
          fc.style.width = objData.width/objData.picNum + "px";
          fc.innerHTML="<img src=\""+obj.baseDir+el.pic+"\" />"
          fg.appendChild(fc);
      }else{
          var fc = document.createElement('div');
          fc.classList.add('face');
          fc.classList.add('faceInner');
          fc.style.width = objData.width/objData.picNum + "px";
          fc.innerHTML="<img src=\""+obj.baseDir+el.pic[0]+"\" />"
          fg.appendChild(fc);
          fc = document.createElement('div');
          fc.classList.add('face');
          fc.classList.add('faceInner');
          fc.style.width = objData.width/objData.picNum + "px";
          fc.innerHTML="<img src=\""+obj.baseDir+el.pic[1]+"\" />"
          fg.appendChild(fc);
      }
      swipe.append(fg);
  })
  setAlinks();
  // load and store all audio
  obj.audios.forEach(function(el,idx){
      soundBuffer
      .getBuffer(obj.baseDir+el.url)
      .then(buf => {
          soundSources.push({
              id: idx,
              buffer: buf,
              time: el.time
          })
      })
      .catch(e => {
          console.log(e);
      });
  })
  if (window.orientation == 0 || window.orientation == 180){
    // 0/180:portrait,90/-90:landscape
    document.querySelector('.tips').innerText="温馨提示：手机端请横屏操作，支持最小宽度"+objData.width;
  }
  document.getElementById("audioList").style.display="block";
});
}else{
  alert("缺少参数!")
}
function begin(){
  var idx = event.target.dataset["id"];
  source = soundSources.find(function(el){
      return el.id == idx
  });
  if(source){
      document.querySelectorAll('figure').forEach(function(el){
          el.classList.remove('hide')
      });
      document.getElementById("audioList").style.display="none";
      duration = source.buffer.duration;
      timeTags.innerText="00:00/"+formatSecs(duration);
      startAudio();
      // init slider
      slider = new Swipe(document.getElementById('slider'), {
          // auto: 3000,  
          continuous: false,
          callback: function(pos) {
              //在听到音频时,翻页时自动记录时间，保存自动翻页时间audio.time
              if(!canDraw){
                  objData.audios[source.id].time.push(Number(getCurrentTime().toFixed(3)));
                  console.log(getCurrentTime());
              }
              
          }
      });
      // init canvas dimension and position
      var fg = document.querySelector("figure");
      var offsetLeft = (fg.offsetWidth-objData.width)/2;
      document.querySelectorAll(".faceInner:first-child").forEach(function(el){
          el.style.marginLeft = offsetLeft+"px";
      })
      canvas.width = objData.width;
      canvas.height = document.querySelector(".face img").offsetHeight;
      canvas.style.left = offsetLeft + "px";
      current.offsetX = offsetLeft;
  }else{
      alert('音频加载失败!')
  }
}
function startAudio(time){
  if(sound){
      sound = null;
  }
  sound = soundBuffer.createSound(source.buffer);
  time&&time<duration?sound.start(audioCtx.currentTime,time):sound.start(audioCtx.currentTime,getCurrentTime());
  sound.onended = function(){
      if(playInterval){
          clearInterval(playInterval)
      }
      objData.audios[source.id].time.push(Number(duration.toFixed(3)));
      objData.marked = true;
      var str = JSON.stringify(objData);
      console.log(str);
      if(BASEURL=="data/"){
        var blob = new Blob([str], {type: "application/json"});
        var url = (window.URL || window.webkitURL).createObjectURL(blob);
        var link = window.document.createElement('a');
        link.href = url;
        link.download = decodeURI(querys.name)+".json";
        var cr = confirm("是否下载数据文件？")
        if(cr){
            link.click();
        }
      }else{
          // upload to cos
      }
  }
  if(playInterval){
      clearInterval(playInterval)
  }
  playInterval = setInterval(function(){
      var currentTime = getCurrentTime();
      var percent = 100*currentTime/duration;
      percent = percent>100?100:percent;
      document.querySelector('.w3-progressbar').style.width=percent+"%";
      timeTags.innerText = formatSecs(currentTime)+"/"+formatSecs(duration)
  },1000);
}