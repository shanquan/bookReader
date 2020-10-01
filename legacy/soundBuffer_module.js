/**
 * ref: [音频API => AudioContext](https://www.jianshu.com/p/ee1ad766d8a7)
 * usage:
import soundBuffer from './soundBuffer';
// preload
soundBuffer
  .getBuffer(item.sound)  // item.sound是音频线上地址
  .then(buf => {
    this.soundBuf[item.name] = buf;  // 存储，方便调用
  })
  .catch(e => {
    console.log(e);
  });

// 使用 
let sound;
if (this.soundBuf[item.name]) {
  sound = soundBuffer.createSound(this.soundBuf[item.name]);
  sound.start(0); // 播放
} else {
  console.log("download sound failed？");
}
 */
let AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = AudioContext ? new AudioContext() : '';

let soundBuffer = {
  getBuffer(link) {
    return new Promise((resolve, reject) => {
      if (audioCtx) {
        let request = new XMLHttpRequest();
        request.open("GET", link, true);
        request.responseType = "arraybuffer";
        request.onload = function() {
          audioCtx.decodeAudioData(request.response, function(buffer) {
            resolve(buffer)
          }, function(e) {
            console.log('reject');
            reject(e);
          });
        };
        request.send();
      } else {
        reject('not support AudioContext');
      }
    })
  },
  createSound(buffer) {
    if (audioCtx.state != 'running') {
      console.log('重启audioCtx');
      audioCtx.resume();
    }
    // let analyser = audioCtx.createAnalyser();
    // let gainNode = audioCtx.createGain();
    let source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    // source.connect(analyser);
    // analyser.connect(gainNode);
    // gainNode.connect(audioCtx.destination);
    return source;
  }
}
export default soundBuffer;