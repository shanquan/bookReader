function filterLst(){
  var qs = document.getElementsByName('search')[0].value;
  if(qs){
    w3.displayObject('list',{"books":books.filter(function(el){
      return el.name.indexOf(qs)>-1
    })});
  }else{
    w3.displayObject('list',{"books":books});
  }
}
var books=[];
(function(){
  var prefix=8; // name前面过滤的字符数
  var mode = 0; // 0: 阅读模式，1: 标记模式
  var querys = getQuerys();
  if(querys.series){
    switch(querys.series){
      case "ort": prefix=8;break;
      case "goodEnglish": prefix=6;break;
    }
    w3.displayObject("title",{title:querys.series+" "+querys.name})
    w3.getHttpObject("data/"+querys.series+"/"+querys.name+".json",function(obj){
      books = obj.books.map(function(el,idx){
        el.url = "/book?series="+querys.series+"&name="+el.name;
        el.title = el.name.substring(prefix);
        el.id = idx;
        return el
      });
      w3.displayObject('list',{"books":books});
    setAlinks();
    })
  }else{
    alert("缺少参数！")
  }
  document.querySelector("svg.goBack").addEventListener('click',function(){
    // document.location.protocol+"//"+window.location.host is "file:///" on app
    // besides history.back() don't work
    if(window.cordova){
      location.href = "file:///android_asset/www/index.html";
    }else{
      location.href = document.location.protocol+"//"+window.location.host;
    }
  },false);
  document.getElementById('mode').addEventListener('click',function(){
    var t =  this.innerText;
    var pathname;
    if(mode == 0){
      this.innerText = "标记模式";
      mode = 1;
      pathname = "BookMark"; 
    }else{
      this.innerText = "阅读模式";
      mode = 0;
      pathname = "book";
    }
    w3.displayObject('list',{"books":books.map(function(el,idx){
        el.url = "/"+pathname+"?series="+querys.series+"&name="+el.name;
        el.title = el.name.substring(prefix);
        el.id = idx;
        return el
      })});
    setAlinks()
  },false);
}())