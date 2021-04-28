var mode=0, // 0: 自动 1: 点读
  imgWidth = 90, // 默认图片宽度百分比
  imgLeft = 5, // 默认图片左移百分比
  hideTimer, // 控件自动隐藏定时器
  hideSec = 3000,
  stopTimer, // 点读结束定时器
  ratio; // 图片显示比

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
// refresh
document.querySelector("svg.refresh").addEventListener('click',function(){
    //location.reload();
    playAtPos(0);
},false);
function playAudio(){
  if(mode===1||!slider) return;
  btnPlay.classList.add('hide');
  btnPause.classList.remove('hide');
  if(slider)
  slider.resume();
  delta += audioCtx.currentTime - offset;
  startAudio();
  if(hideTimer){
    clearTimeout(hideTimer); 
  }
  hideTimer = setTimeout(hideControls,hideSec);
}
// pause
btnPause.addEventListener('click',pauseAudio,false);
function pauseAudio(){
  if(mode===1||!slider) return;
  btnPause.classList.add('hide');
  btnPlay.classList.remove('hide');
  if(slider)
  slider.stop();
  stopAudio();
  if(hideTimer){
      clearTimeout(hideTimer);
  }
}
document.getElementById('mode').addEventListener('click',function(){
  if(!slider){return}
  if(mode === 1){
      mode = 0;
      this.innerText = "自动";
      document.querySelector(".mcontainer").classList.add('hide');
      // 从当前页开始自动播放；
      if(stopTimer){
          clearTimeout(stopTimer);
      }
      if(objData.marked){
          playAtPos(source.time[slider.getPos()]);
      }else{
          playAudio();
      }
      document.querySelector("nav").classList.add('hide');
      document.querySelector("svg.goBack").classList.add('hide');
      document.getElementById('mode').classList.add('hide');
      document.getElementById('slider').addEventListener('click',showControls,false);
  }else{
      mode = 1;
      this.innerText = "点读";
      if(hideTimer){
        clearTimeout(hideTimer);
      }
      document.querySelector("nav").classList.remove('hide');
      document.querySelector("svg.goBack").classList.remove('hide');
      document.getElementById('mode').classList.remove('hide');
      document.getElementById('slider').removeEventListener('click',showControls,false);
      // 停止自动播放；
      document.querySelector(".mcontainer").classList.remove('hide');
      document.getElementById('tags').innerText = "00:00/00:00";
      document.querySelector(".w3-progressbar").style.width = "0";
      btnPause.classList.remove('hide');
      btnPlay.classList.add('hide');
      stopAudio();
      showTags(slider.getPos());
  }
},false)
// Load book Data
if(querys.series){
w3.getHttpObject(BASEURL+querys.series+"/"+querys.name+".json",function(obj){
  console.log(obj);
  objData = obj;
  w3.displayObject("audioList", {"audios":obj.audios.map(function(el,idx){el.id=idx;return el})});
  var swipe = document.querySelector(".swipe-wrap");
  var srWidth = screen.width;
  var srHeight = screen.height;
  var imgHeight = objData.height*0.9*(srWidth)/(objData.width*objData.picNum);
  imgWidth = 90/objData.picNum;
  if(imgHeight>srHeight){
    imgWidth = (100*srHeight*objData.width)/(objData.height*srWidth);
  }
  imgLeft = (99-imgWidth*objData.picNum)/2;
  obj.pages.forEach(function(el,idx){
      var fg = document.createElement('figure');
      if(idx!=0){
          fg.classList.add('hide')
      }
      if(typeof el.pic == "string"){
          var fc = document.createElement('div');
          fc.classList.add('face');
          fc.style.width = imgWidth + "%";
          fc.innerHTML="<img src=\""+obj.baseDir+el.pic+"\" />"
          fg.appendChild(fc);
      }else{
          var fc = document.createElement('div');
          fc.classList.add('face');
          fc.classList.add('faceInner');
          fc.style.width = imgWidth + "%";
          fc.style.marginLeft = imgLeft + "%"
          fc.innerHTML="<img src=\""+obj.baseDir+el.pic[0]+"\" />"
          fg.appendChild(fc);
          fc = document.createElement('div');
          fc.classList.add('face');
          fc.classList.add('faceInner');
          fc.style.width = imgWidth + "%";
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
  document.getElementById("audioList").style.display="block";
})
}else{
  alert("缺少参数!")
}

// 初始化点读区域
function initTagsContainer(){
  var img = document.querySelector('.face img');
  var mcontainer =  document.querySelector('.mcontainer');
  ratio = objData.picNum*img.offsetWidth/objData.width;
  mcontainer.style.width = objData.picNum*img.offsetWidth+"px";
  mcontainer.style.height = img.offsetHeight+"px";
  mcontainer.style.left = imgLeft+"%";
  mcontainer.classList.add('hide');
}
// 点读
function showTags(pos){
  var tags = objData.pages[pos].areas;
  var mbox = document.querySelector('.mbox');
  mbox.innerHTML = "";
  tags.forEach(function(el,idx){
      var dv = document.createElement("div");
      dv.classList.add('mtag');
      dv.style.left = el.x*ratio+"px";
      dv.style.top = el.y*ratio+"px";
      dv.style.width = el.w*ratio+"px";
      dv.style.height = el.h*ratio+"px";
      dv.onclick = function(){
          dv.classList.add('border1');
          playAtPos(el.time);
          try{
              var nextTime=el.time;
              if(idx<tags.length-1){
                  nextTime = tags[idx+1].time;
              }else{
                  nextTime = source.time[pos+1];
              }
              if(stopTimer){
                  clearTimeout(stopTimer);
              }
              stopTimer = setTimeout(function(){
                  stopAudio();
              },(nextTime-el.time)*1000);
          }catch(e){
              console.log(e);
          }
      }
      mbox.append(dv);
  })
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
              if(pos=="0"){
                document.querySelector("svg.refresh").classList.remove('hide');
              }else{
                document.querySelector("svg.refresh").classList.add('hide');
              }
              if(mode===1){
                  showTags(pos);
              }else{
                  document.querySelector('.mbox').innerHTML = "";
                  if(autoSlide===true){
                      autoSlide = false;
                  }else if(objData.marked){
                      btnPlay.classList.add('hide');
                      btnPause.classList.remove('hide');
                      playAtPos(source.time[slider.getPos()]);
                  }
                  if(hideTimer){
                      clearTimeout(hideTimer); 
                  }
                  hideTimer = setTimeout(hideControls,hideSec);
              }
          }
      });
      document.getElementById('slider').addEventListener('click',showControls,false);
      initTagsContainer();
  }else{
      alert('音频加载失败!')
  }
}
function showControls(){
    document.querySelector("nav").classList.remove('hide');
    document.querySelector("svg.goBack").classList.remove('hide');
    if(objData.marked){
        document.getElementById('mode').classList.remove('hide');
    }
    if(hideTimer){
        clearTimeout(hideTimer);
    }
    if(btnPlay.classList.contains('hide'))
    hideTimer = setTimeout(hideControls,hideSec);
}
function hideControls(){
    document.querySelector("nav").classList.add('hide');
    document.querySelector("svg.goBack").classList.add('hide');
    if(objData.marked){
        document.getElementById('mode').classList.add('hide');
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
  }
  if(playInterval){
      clearInterval(playInterval)
  }
  if(mode===0)
  playInterval = setInterval(function(){
      var currentTime = getCurrentTime();
      if(source.time.length>objData.pages.length){
          var pos = 0;
          for(var i=0;i<source.time.length;i++){
              if(currentTime<=source.time[i]){
                  pos = i-1;
                  break;
              }
          }
          if(slider.getPos()!=pos&&slider){
              autoSlide = true;
              slider.slide(pos);
          }
      }
      var percent = 100*currentTime/duration;
      percent = percent>100?100:percent;
      document.querySelector('.w3-progressbar').style.width=percent+"%";
      timeTags.innerText = formatSecs(currentTime)+"/"+formatSecs(duration)
  },1000);
}