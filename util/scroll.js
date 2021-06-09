// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Wwl
// @match        https://mp.weixin.qq.com/s/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    var timer=setTimeout(saveAs,500)
    var i=0;
    var unit=document.body.scrollHeight/5;
    function saveAs(){
      if(i<=5){
        i++;
        window.scrollTo(0,unit*i);
        timer=setTimeout(saveAs,500)
      }else{
        clearTimeout(timer);
        document.execCommand('saveAs');
      }
    }
})();