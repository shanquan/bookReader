/**
 * 因for in读取目录不支持文件名包含空格，所以开发nodejs版本脚本
 * marked: 无时间数据设置为false,否则播放报错
 */
const fs=require('fs');
const path=require('path');

const DIR="yyhb3",
NAME="海尼曼分级",
JSONF="hnmg2",
SERIES="hnm";

/**
 * series配置
 */
const CONFIG={
  "ort":{
    "width":640,
    "height":856,
    "picNum":2,
    "generatePages":function(len){
      let pages=[];
      for(let i=1;i<=len-2;i++){
        if(i==1||i==3||i==len-2){
          pages.push({
            "pic":`/Images/${i}.jpeg`,
            "areas":[]
          })
        }else if(i>3 && i<len-2){
          pages.push({
            "pic":[`/Images/${i}.jpeg`,`/Images/${++i}.jpeg`],
            "areas":[]
          })
        }
      }
      return pages;
    }
  },
  "pearson":{
    "width":640,
    "height":640,
    "picNum":2,
    "generatePages":function(len){
      let pages=[];
      for(let i=1;i<=len;i++){
        if(i==1){
          pages.push({
            "pic":`/Images/${i}.jpeg`,
            "areas":[]
          })
        }else{
          if(i<len){
            pages.push({
              "pic":[`/Images/${i}.jpeg`,`/Images/${++i}.jpeg`],
              "areas":[]
            })
          }else{
            pages.push({
              "pic":`/Images/${i}.jpeg`,
              "areas":[]
            })
          }
        }
      }
      return pages;
    }
  },
  "biscuit":{
    "width":640,
    "height":918,
    "picNum":2,
    "generatePages":function(len){
      let pages=[];
      for(let i=1;i<=len;i++){
        if(i==1||i==3||i==len){
          pages.push({
            "pic":`/Images/${i}.jpeg`,
            "areas":[]
          })
        }else if(i>3){
          pages.push({
            "pic":[`/Images/${i}.jpeg`,`/Images/${++i}.jpeg`],
            "areas":[]
          })
        }
      }
      return pages;
    }
  }
}
/**
 * 遍历指定目录下的所有文件
 * @param {*} dir 
 */
const getAllFile=function(dir){
    let res=[];
    function trJSONaverse(dir){
        fs.readdirSync(dir).forEach((file)=>{
            const pathname=path.join(dir,file)
            if(fs.statSync(pathname).isDirectory()){
                traverse(pathname)
            }else{
                res.push(pathname)
            }
        })
    }
    traverse(dir)
    return res;
}

/**
 * 打印指定目录下的以str开头或以str结尾的子文件和子目录
 * @param {*} dir 
 * @param {*} str 
 * @param {Boolean} endw
 */
const printDir=function(dir,str,endw){
  let res=[]
  fs.readdirSync(dir).forEach((file)=>{
    if(str){
      if(endw===true){
        if(file.endsWith(str))
        res.push(file)
      }else{
        if(file.startsWith(str))
        res.push(file)
      }
    }else{
      res.push(file)
    }
  })
  return res;
}

/**
 * 根据res目录生成json文件
 * @param {Array} res 
 */
const generateJson=function(res){
  let jsn={"name":NAME,"series":SERIES}
  jsn.books = res.map(el=>{
    return {
      "name":el,
      "cover":`data/${SERIES}/${el}/Images/1.jpeg`
    }
  })
  fs.writeFile(`${JSONF}.json`, JSON.stringify(jsn),function (err) {
    if(err){
      console.log(err)
    }
  })
  res.forEach(el=>{
    let obj={
      "name":el.substring(JSONF.length+1),
      "baseDir":`data/${SERIES}/${el}`,
      "width":CONFIG[SERIES].width,
      "height":CONFIG[SERIES].height,
      "picNum":CONFIG[SERIES].picNum,
      "marked":false,
      "pages":[],
      "audios":[]
    }
    let imgs = printDir(`${DIR}/${el}/Images`,".jpeg",true);
    let audios = printDir(`${DIR}/${el}`,".mp3",true);
    obj.audios = audios.map(it=>{
      return {
        "title": it.substring(0,it.length-4),
        "url": `/${it}`,
        "time":[0]
      }
    })
    obj.pages = CONFIG[SERIES].generatePages(imgs.length);
    fs.writeFile(`${el}.json`, JSON.stringify(obj),function (err) {
      if(err){
        console.log(err)
      }
    })
  })
}
/**
 * 修复目录下的文件名
 */
const fixFilenames=function(){
  fs.readdirSync(DIR).forEach((file)=>{
    const pathname=path.join(DIR,file)
    if(file.startsWith("kmgGK"))
    fs.renameSync(pathname, path.join(DIR,"hnmgk"+file.substring(5)));
  })
}
/**
 * 根据JSON文件重命名目录文件
 */
const renameFiles=function(){
  fs.readFile(`${JSONF}.json`,function (err,data) {
    if(err){
      console.log(err)
    }
    let res = JSON.parse(data.toString());
    res.forEach((el,idx)=>{
      let name = el.substring(3);
      // idx++;
      // if(idx<10){
      //   idx = "0"+idx
      // }
      try{
        if(fs.statSync(`${DIR}/${name}`))
        fs.renameSync(`${DIR}/${name}`, `${DIR}/${JSONF}_${el}`);
      }catch(e){}
    })
  })
}

try{
  // let res = printDir(DIR,JSONF);
  // console.log(res.length)
  // generateJson(res);

  renameFiles()
}catch(e){
  console.log(e)
}