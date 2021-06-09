#!/usr/bin/bash
#@author wang.weili
#@description 脚本根据目录自动生成json数据文件,包含list.json和book.json
#@usage bash book.sh yyhb2

name="牛津阅读树第四级"
jsonf=ort4
series=ort

#clear jsonf
:> "$jsonf.json"
echo "{\"name\":\"$name\",\"series\":\"$series\",\"books\":[" >> "$jsonf.json"
# 名称包含空格的文件列表循环，不能使用for in `ls`
num=`ls yyhb2 | grep $jsonf | wc -l`
for ((i=1; i<=num; i++))
do
  if [ $i -lt 10 ];then
  itag="0$i"
  fnum=`ls ${1} | grep $jsonf"_"$itag"_" | wc -l`
  if [ $fnum == 0 ];then
    file=`ls ${1} | grep $jsonf"_"$i"_"`
    if [ -n "$file" ];then
    filename=${file:7}
    mv "${1}/$file" "${1}/$jsonf"_"$itag"_"$filename"
    fi
  fi
  else
  itag="$i"
  fi
  file=`ls ${1} | grep $jsonf"_"$itag"_"`
  fileLen=${#file}
  filename=${file:8:$fileLen}
  if [ $i == "1" ];then
    echo "{\"name\": \"$file\",\"cover\":\"data/$series/$file/Images/1.jpeg\"}" >> "$jsonf.json"
  else
    echo ",{\"name\": \"$file\",\"cover\":\"data/$series/$file/Images/1.jpeg\"}" >> "$jsonf.json"
  fi
  # clear book.json and append to book.json
  :> "$file.json"
  echo "{\"name\": \"$filename\",\"baseDir\":\"data/$series/$file\",\"width\":640,\"height\":856,\"picNum\":2,\"marked\":false,\"pages\":[" >> "$file.json"
  # 获取Images下的图片总数
  m=`ls ${1}/"$file"/Images/ -l |grep "^-"|wc -l`
  for ((j=1; j<=m; j++))
  do
    if [ $j == 1 ];then
      echo "{\"pic\":\"/Images/$j.jpeg\",\"areas\":[]}" >> "$file.json"
    elif [ $j == 3 ];then
      echo ",{\"pic\":\"/Images/$j.jpeg\",\"areas\":[]}" >> "$file.json"
    elif [[ $j -gt 3 && $j -lt $((m-2)) ]];then
      echo ",{\"pic\":[\"/Images/$j.jpeg\",\"/Images/$((j+1)).jpeg\"],\"areas\":[]}" >> "$file.json"
      let j++
    elif [ $j -eq $((m-2)) ];then
      echo ",{\"pic\":\"/Images/$j.jpeg\",\"areas\":[]}" >> "$file.json"
    fi
  done
  echo "],\"audios\":[" >> "$file.json"
  k=0
  for audio in `ls ${1}/"$file" | grep .mp3`;do
  anum=${#audio}
  anum=`expr $anum - 4`
  afilename=${audio:0:$anum}
  if [ $k == 0 ];then
    echo "{\"title\":\"$afilename\",\"url\":\"/$audio\",\"time\":[0]}" >> "$file.json"
  else
    echo ",{\"title\":\"$afilename\",\"url\":\"/$audio\",\"time\":[0]}" >> "$file.json"
  fi
  let k++
  done
  echo "]}" >> "$file.json"
done
echo "]}" >> "$jsonf.json"