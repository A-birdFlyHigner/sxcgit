
//使用方法:1.创建一个新的Slider实例，最好是靠近</body>
				//2.必须传入父级选择器(id,class,tagName均可,此处，若您使用的是后两位选择器，这里有一个eq属性，您在eq属性中传入您想插入轮播的选择器的index数即可，默认第一元素),或者标签名字和对象的Imgarr属性，以下API供选择：
					// arrow:false,//左右箭头，true打开，false关闭，默认false
					// nav_icon:false,//分页器，true打开，false关闭，默认true
					// autoPlay:{
					// 	isPlay:true,
					// 	time:100,
					//	direction:,
					// }//自动播放
					//	您亦可以在对象中设置属性：isPlay为false关闭自动播放，默认为true，
					//						  time,自动播放间隔，默认2000(ms)
					//						  direction，播放方向'next'顺序播放,'previous'逆序播放，默认顺序
					//样式请根据自己喜好修改,类名：最大的容器：container,上箭头：arow_prev，下箭头：arow_next，分页器：banner_nav，鼠标悬停分页器样式：
					//banner_navActive

function Slider(selector,obj) {
			this.obj=null;
			this.odiv = null;
			this.num=0;		
			this.spanleft = null;
			this.spanright = null;
			this.divban = null;
			this.oul = null;
			this.usersData(selector,obj);
		 	this.init();

}
Slider.prototype.usersData = function(selector,objUser){
	var seleContent=selector.slice(1);
	//处理选择器
	var maxBox;
	var eq=0;
	if (selector[0]==="#") {
		maxBox=document.getElementById(seleContent)
	}else if (selector[0]===".") {
		maxBox=document.querySelectorAll(selector);
	}else{
		maxBox=document.querySelectorAll(selector);
	}
	if (!maxBox) {
		throw Error("请确定传入的选择器或者元素正确！")
	}
	if (objUser.eq) {
		eq=objUser.eq;
	}
	//处理左右按钮
	var arrowx=false;//是否有按钮
	if ( objUser.arrow === true ) {
		arrowx=true;
	}
	//处理轮播时间
	var isPlay=true;     //是否执行
		timerx=2000;     //轮播间隔时间
		directionx="next"; //轮播方向	
		if (objUser.autoPlay) {
			if (objUser.autoPlay.isPlay===false) {
				isPlay=false;
			}
			if (objUser.autoPlay.time){
				timerx=objUser.autoPlay.time;
			}
			if(objUser.autoPlay.direction){
				objUser.autoPlay.direction==="next"?directionx="next":directionx="prev";	
			}
		}
		
	//处理分页器
	var nav_iconx=true//是否有分页器
	if(objUser.nav_icon===false){
			var nav_iconx=false;
		}
	this.obj={
		eq:eq,
		maxBox:maxBox,
		Imgarr:objUser.Imgarr,
		arrow:arrowx,
		autoPlay:{
			isPlay:isPlay,
			time:timerx,
			direction:directionx,
		},
		nav_icon:nav_iconx
	};
};
//执行函数	
Slider.prototype.init = function(){
	var that=this;
	this.createMaxDiv();
	this.createDivban();
	//左右箭头
	if(this.obj.arrow==true){		
		this.createspanleft();
		this.createspanright();
		$.addEvevt(this.spanright, "click", function() {
			that.next();
		}, false);
		$.addEvevt(this.spanleft, "click", function() {
			that.pre();
		}, false);
		$.addEvevt(this.odiv, "mouseover", function(){
			that.divban.style.display='block';	
			that.clearAutoPlay();
		}, false);
		$.addEvevt(this.odiv, "mouseout", function() {
			that.divban.style.display='none'
			if (that.obj.autoPlay.isPlay==true) {
				that.autoPlay(that.obj.autoPlay.time);
			}
		}, false);
	}	
	//定时器
	if (this.obj.autoPlay.isPlay==true) {
		this.autoPlay(this.obj.autoPlay.time);
	}
	//分页器
	if(this.obj.nav_icon==true){		
		this.createIndexUl();
		this.createIndexLi();
		for(var i = 0; i < (this.obj.Imgarr).length; i++) {
			this.xli[i].index = i;
			this.xli[i].onmouseover = function(){
				for(var i = 0; i < (that.obj.Imgarr).length; i++) {
					that.xli[i].classList.remove("banner_navActive");
				}
				that.num = this.index;
				this.classList.add("banner_navActive");
				that.odiv.style.backgroundImage = "url(" + that.obj.Imgarr[this.index] + " )";
			}
		}
	};
}	
Slider.prototype.createMaxDiv = function() {
	var odivx = document.createElement("div");
	odivx.style.cssText='width:100%;'+'height:100%;'+'background-position: center;'+'position:relative;'+'background-repeat:no-repeat';
	odivx.classList.add("container");
	odivx.style.backgroundImage = "url(" + this.obj.Imgarr[this.num] + " )";
	// 此处处理选择器
	var eleLength=this.obj.maxBox.length-1;
	if (eleLength<this.obj.eq&&eleLength>this.obj.eq) {
		throw Error("请确定对应下标元素是否存在！")
	}else {
		objx=this.obj.maxBox[this.obj.eq];
	}
	objx.appendChild(odivx);
	this.odiv = odivx;
};

Slider.prototype.createDivban = function() {
	var divban = document.createElement("div");
	divban.style.cssText='width: 50%;'+'height: 100%;'+'position: absolute;'+'left: 25%;'+'background: rgba(0, 0, 0, 0.2);'+'display:none';
	divban.id = "bannerBox";
	this.odiv.insertBefore(divban, this.spanleft); //父节点.insertBefore(要插入节点,插入这个节点之前)
	this.divban = divban;
}

Slider.prototype.createspanleft = function() {
	var spanleft = document.createElement("span");
	spanleft.classList.add("arow_prev");
	this.divban.appendChild(spanleft);
	this.spanleft = spanleft;			
};

Slider.prototype.createspanright = function() {
	var spanright = document.createElement("span");
	spanright.classList.add("arow_next");
	this.divban.appendChild(spanright); //加强绑定
	this.spanright = spanright;	
}

Slider.prototype.createIndexUl = function() {
	var oul = document.createElement("ul");
	oul.style.cssText =	'display: inline-block;'+'position: absolute;'+'left: 43%;'+'top: 90%;';
	oul.classList.add("banner_ul");
	this.odiv.appendChild(oul);
	this.oul = oul;
}

Slider.prototype.createIndexLi = function(arr) {
	for(i = 0; i < (this.obj.Imgarr).length; i++) {
		var oLi = document.createElement("li");
		this.oul.appendChild(oLi);
		oLi.innerText = i + 1;
		oLi.style.cssText = 'float: left;'+'text-align: center;'+'cursor:pointer;'
	}
	this.xli = this.oul.getElementsByTagName("li");
}

Slider.prototype.next = function() {	
	this.num++; 
	if(this.num > (this.obj.Imgarr).length - 1) {
		this.num = 0
	}
	if (this.obj.nav_icon==true) {
		this.indexClear();
	}	
	this.changeStyle();
}

Slider.prototype.pre = function() {
	this.num--;
	if(this.num < 0) {
		this.num = (this.obj.Imgarr).length - 1;
	}
	if (this.obj.nav_icon==true) {
		this.indexClear();
	}
	this.changeStyle();
}

Slider.prototype.autoPlay = function(time) {
	var that = this;
	this.timer = setInterval(function(){
		if (that.obj.autoPlay.direction==="next") {
			that.next();
		}else {
			that.pre();
		}		
	}, time)
}

Slider.prototype.clearAutoPlay = function() {
	clearInterval(this.timer);
}

Slider.prototype.changeStyle = function() {
	if (this.obj.nav_icon==true) {
		this.xli[this.num].classList.add("banner_navActive");
	}
	
	this.odiv.style.backgroundImage = "url(" + this.obj.Imgarr[this.num] + " )";
}

Slider.prototype.indexClear = function() {
	for(i = 0; i < (this.obj.Imgarr).length; i++){
		this.xli[i].classList.remove("banner_navActive");
	}
}



