#!/usr/bin/bash
#@author wang.weili
#@usage 脚本根据audio-*目录自动生成md页面，提供绘本图片和音频，其中绘本图片来源：https://mp.weixin.qq.com/s/_1EKspDEvY-iblF7ba-0Aw
#1. 访问网页图片，设置userscipt:scroll.js，页面打开后自动滚动（加载所有lazy-load图片）
#2. 网页另存为保存至本地，1A系列全部保存后执行：bash picture.sh脚本，将所有图片移动至images文件夹，按编号命名
#3. 运行脚本：bash ./page.sh Directory, 根据audio-*目录音频及images下的图片自动生成1A.md文件内容
#4. 通过vs code的Markdown All in One将md文档打印成html,或直接在vs code中预览（仅可加载图片，无法加载音频）
prefix=6b_
mdfile=6B.md
#clear mdfile
:> $mdfile
echo "# Content" >> $mdfile
echo "" >> $mdfile
for file in `ls ${1}`
do
  num=${#file}
  num=`expr $num - 7`
  idx=${file:3:2}
  filename=${file:3:$num}
  echo "## "$filename >> $mdfile
  echo "<audio controls='' preload='none'><source src=\""${1}"/"$prefix$filename".mp3\"></audio>" >> $mdfile
  for pic in `ls images | grep $prefix$idx`
  do
  echo "- ![$pic](images/"$pic")" >> $mdfile
  done
  echo "" >> $mdfile
done