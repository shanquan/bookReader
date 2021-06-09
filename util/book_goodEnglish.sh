#!/usr/bin/bash
#@author wang.weili
#@description 脚本根据audio-*目录自动生成json数据文件,包含list.json和book.json
#@usage bash book.sh audio-1A
prefix=1a_
jsonf=1A
series=goodEnglish

#clear jsonf
:> $jsonf".json"
echo "{\"name\":\"$jsonf\",\"series\":\"$series\",\"books\":[" >> $jsonf".json"
i=0
for file in `ls ${1}`
do
  num=${#file}
  num=`expr $num - 7`
  idx=${file:3:2}
  filename=${file:3:$num}
  if [ $i == "0" ];then
    echo "{\"name\": \"$prefix$filename\"}" >> $jsonf".json"
  else
    echo ",{\"name\": \"$prefix$filename\"}" >> $jsonf".json"
  fi
  let i++
  # clear book.json and append to book.json
  :> $prefix$filename".json"
  echo "{\"name\": \"$filename\",\"baseDir\":\"data/goodEnglish\",\"width\":700,\"height\":880,\"picNum\":1,\"marked\":false,\"pages\":[" >> $prefix$filename".json"
  j=0
  for pic in `ls images | grep $prefix$idx`
  do
  if [ $j == 0 ];then
    echo "{\"pic\":\"/images/$pic\",\"areas\":[]}" >> $prefix$filename".json"
  else
    echo ",{\"pic\":\"/images/$pic\",\"areas\":[]}" >> $prefix$filename".json"
  fi
  let j++
  done
  echo "],\"audios\":[{\"title\":\"英音版\",\"url\":\"/${1}/$prefix$filename.mp3\",\"time\":[0]}]}" >> $prefix$filename".json"
done
echo "]}" >> $jsonf".json"