# Content

- http://localhost:8080/#book?series=ort&name=ort1_1_Who%20Is%20It
- http://localhost:8080/#list?series=goodEnglish&name=1A

## Notice
- APP load html file should end-with '.html', or develop in SPA mode
- resource urls should not start-with '/'
- document.location.protocol+"//"+window.location.host is "file:///" on app, besides history.back() doesn't work, so links(window.location.href=) should use "file:///android_asset/www/*.html"
- generate json: `node ./util/book.js`

## Step 1
Goal: nothing, maybe in case the wechat pages may disappear one day
- scrawl pictures from wechat page: 
1. <https://mp.weixin.qq.com/s/_1EKspDEvY-iblF7ba-0Aw>
2. - [1A](https://mp.weixin.qq.com/s/DBrUy3FIT6xJT5hKQm9Otw)
   - [1B](https://mp.weixin.qq.com/s/3GBjzIdmHbi7-S58iI5ySw)

- user script: scroll.js to help download lazy-load images
- use picture.sh to generate images resources.
- download audios from link-1, and then use page.sh to generate markdown files with audio and images, to serve as local pages.

## Step 2
Goal: Electric book reading has better User Experience, EnglishBook app free version run with annoying ads, while ads-free version charges monthly, which is too expensive(I think).
- use a rooted android emulator(such as yeshen), to install EnglishBook app and rooted ES(com.speedsoftware.rootexplorer), download books in app and then use ES to browse files of the app.
- files downloaded even in app are encoded, but find the log files of the app, find original resources on github, so download them.
- [x] setup book reading webservice.
- [x] generate book list from app file directory
- [x] setup book info marking webservice.

PS: I've found another PDF and mp3 resources on BaiduPan, PDFs and PPTs can play on my Xiaomi Phones.

## Step 3
Goal: ocr and Speech Recognition tech to auto generate marking information.
- ocr to get texts from images
- Speech Recognition to get timestamp of the texts in the audio
- generate json files
- generate pptx with images and audio(auto play), test playing on Phones.
- [ ] online pdf reader(pdf.js), and pdf to images, pdf to pptx, images to pptx.

## Issues
### book
1. book.html点读模式，图片部分无法滑动问题
2. 自动模式（添加沉浸式阅读），2S后自动隐藏播放条，点击屏幕显示播放条；
3. 点读模式，不显示播放条，需添加图片部分滑动问题
4. 默认按屏幕宽度90%居中显示，如图片高度溢出屏幕，则改为按屏幕最大高度显示；
5. 返回list页面时，传递id参数，返回至其所在list的高度位置；

### bookMark
1. 按图片实际宽度显示，仅支持横屏操作，需满足最小宽度要求；
2. 标记支持页面滚动；