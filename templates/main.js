w3.getHttpObject(BASEURL+"json/series.json",function(obj){
  try{
    w3.displayObject('main',{"series":obj.map(function(el){
      el.ll = el.list.length;
      return el;
    })});
    obj.forEach(function(el){
      var tr = document.getElementById(el.name);
      tr.innerHTML = "<td w3-repeat='list'><a href='/list?series="+el.name+"&name={{name}}'>{{name}}</a></td>"
      w3.displayObject(el.name,{"list":el.list});
    })
    setAlinks();
  }catch(e){
    console.log(e)
  }
})