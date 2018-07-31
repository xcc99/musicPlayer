		var musicList = []
		var currentIndex = 0
		var audio = new Audio()
		// audio.muted = true
		audio.autoplay = true //设置自动播放，当设置了播放地址之后会自动播放

		function $(s){
			return document.querySelector(s)
		}
		function $$(s){	
			return document.querySelectorAll(s)
		}

		getMusicList(function(list){//②调用函数
			musicList = list //把获得的音乐列表赋值给musicList成为全局变量
			loadMusic(list[currentIndex]) //调用函数修改播放的音乐
			addList(list)
			change(list)
		})

		audio.ontimeupdate = function(){ //当currentTime更新时会触发这个事件，
			// console.log(this.currentTime) //获取到的是实时的时间
			$('.newbar').style.width = (this.currentTime/this.duration) * 100 + '%' //刷新进度条
			// var min = Math.floor(this.currentTime/60) //当前时间的分钟
			// var sec = (Math.floor(this.currentTime%60) + '').length === 2 ? Math.floor(this.currentTime%60) : '0' + Math.floor(this.currentTime%60) //当前时间的秒
			// $('.time').innerText = min + ':' + sec //实时更新的时间，但是时间间隔是系统随机的
		}

		//利用setInterval来控制时间，每隔一秒变一次
		audio.onplay = function(){//音乐开始播放时触发
			clock = setInterval(function(){ //使用定时器设置时间间隔
				var min = Math.floor(audio.currentTime/60)
				var sec = (Math.floor(audio.currentTime%60) + '').length === 2 ? Math.floor(audio.currentTime%60) : '0' + Math.floor(audio.currentTime%60)
				$('.time').innerText = min + ':' + sec
			},1000)//每1秒变一次
		}
		audio.onpause = function(){ //音乐停止时触发
			clearInterval(clock) //音乐停止时，清除定时器
		}
		audio.onended = function(){//音乐结束时触发
			loadMusic(musicList[++currentIndex % musicList.length]) //音乐结束时自动播放下一首
		}

		function getMusicList(callback){ //①封装一个函数，参数是另一个函数
			//通过ajax获取数据
			var xhr = new XMLHttpRequest()
			xhr.open('GET','https://easy-mock.com/mock/5b514a2bfe14b078aee5b1eb/wangyi/musiclist',true)
			xhr.onload = function(){
				if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 ){
					callback(JSON.parse(this.responseText))
				}else{
					console.log(404,'Not found')
				}
			}
			xhr.onerror = function(){
				console.log('连接失败')
			}
			xhr.send()
		}
		
		function loadMusic(musicObj){ //封装一个控制音乐播放的函数
			// console.log('begin',musicObj)
			audio.src = musicObj.src //设置对象audio的播放地址
			$('.musicbox .title').innerText = musicObj.title //修改作者和歌名
			$('.musicbox .author').innerText = musicObj.author
			// console.log(musicObj.img)
			$('.cover').style.backgroundImage = 'url('+ musicObj.img + ')'//更换背景
			// listStyle()
		}

		//暂停键
		$('.musicbox .play').addEventListener('click',function(){
			if(audio.paused){//paused=true时表示暂停中
				audio.play()
				this.querySelector('.iconfont').classList.remove('icon-play')
				this.querySelector('.iconfont').classList.add('icon-stop')
			}else{
				audio.pause()
				this.querySelector('.iconfont').classList.remove('icon-stop')
				this.querySelector('.iconfont').classList.add('icon-play')
			}
		})
		//上一首
		$('.musicbox .before').addEventListener('click',function(){
			currentIndex = (musicList.length + --currentIndex) % musicList.length
			loadMusic(musicList[currentIndex])
		})
		//下一首
		$('.musicbox .next').addEventListener('click',function(){
			currentIndex = ++currentIndex % musicList.length
			loadMusic(musicList[currentIndex] )//播放音乐列表中当前的音乐
		})
		//点击进度条offsetX
		$('.musicbox .bar').addEventListener('click',function(e){
			// console.log(e.offsetX)//点击到进度条的长度
			// console.log(parseInt(getComputedStyle(this).width))//总长度
			var proportion = (e.offsetX / parseInt(getComputedStyle(this).width))
			// console.log('pro' + proportion) //比例（小数）
			// $('.newbar').style.width = proportion * 100 + '%'
			// console.log(parseInt(audio.duration)) //音乐的总时长
			audio.currentTime = audio.duration * proportion //改变当前时间
		})
		
		//添加列表
		function addList(musicList){
			for(var i = 0;i<musicList.length;i++ ){
				var list = musicList[i].title + '-' + musicList[i].author//每一个播放列表
				$('.musiclist').innerHTML += '<li>' + list + '</li>' //添加到html
				 
			}
		}
		//点击列表播放
		function change(e){
			for(var i = 0; i < $$('li').length;i++){
				$$('li')[i].index = i //获取索引值
				$$('li')[i].addEventListener('click',function(e){
					currentIndex = this.index
					loadMusic(musicList[currentIndex])
				})
			}
		}