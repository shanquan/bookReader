/**
 * ref: [音频API => AudioContext](https://www.jianshu.com/p/ee1ad766d8a7)
 * usage:
soundBuffer
.getBuffer(obj.audios[0].url)
.then(buf => {
    sound = soundBuffer.createSound(buf);
    sound.start(0);
})
.catch(e => {
    console.log(e);
});
 */
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx = AudioContext ? new AudioContext() : '';

var soundBuffer = {
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
      // console.log('重启audioCtx');
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