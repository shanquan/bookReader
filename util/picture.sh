#!/usr/bin/bash
j=15
prefix=6b_
for ((i=1; i<=j; i++))
do
if [ $i -lt 10 ];then
itag="0$i"
else
itag="$i"
fi
if [ -d $itag"_files" ];then
  n=0
  for file in `ls $itag"_files"`
  do
    # pictures with name startwith 640
    if [[ ${file:0:3} == "640" ]];then
      n=$(( $n + 1 ))
      #echo $n": "$file
      mv $itag"_files/"$file "images/"$prefix$itag"_"$n
    fi
  done
  # remove the last pic(qrcode)
  rm "images/"$prefix$itag"_"$n
fi
done