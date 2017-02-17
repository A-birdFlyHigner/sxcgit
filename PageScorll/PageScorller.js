
//页面滚动
		//使用方法：
		//1.创建实例一个新的PageScorll实例，传入容器的类名即可，样式可自己设置,实例创建尽可能靠近</body>
		//2.建议不要轻易改动html，body，以及容器position，margin，width，height，属性如需更改请使用!important
		//3.备选对象参数(可不传)，提供scorllTime(滚动时间，默认600),banner_nav(是否设置分页器，true为打开，默认为false),
		//banner_navPos(分页器位置，请传入'left'或者'right'，默认为right)
		//4.提供banner_nav(分页器样式),选中样式banner_navChose(分页器选中样式)，liHover(分页器鼠标悬停样式)，
		//不建议修改布局，如有需要建议使用!important修改
		//PageScorll1.0使用方式到此结束，更多功能请期待PageScorll2.0
		//(此句纯属yy，权当搞笑~~思路有局限，欢迎指正，技术博客地址：http://www.cnblogs.com/sxcflyhigher/)
		
var PageScorll=function(selector,objUser){
	this.init(selector,objUser)
}
PageScorll.prototype.init = function(selector,objUser){
	!function($,selector,objUser){			
		var PageScorllx=function($,selector,objUser){
				this.oul = null;
				this.oli = null;
				this.oa = null;
				this.oax=null;
				this.usersData(selector,objUser);
				this.init($,selector,objUser);										
		};
	/**默认参数块**/  
		PageScorllx.prototype.defaults = {
		    Number:0,
		    isScroll:false,//设立一个指针，以判断动画确实执行完毕
		    $htmlbody:$("html,body"),
		};
	 /**用户参数块**/
		 PageScorllx.prototype.usersData = function(selector,objUser){	
		 	//处理选择器
		 	var selectorPre=selector.slice(0,1);
		 	if (selectorPre!=".") {
		 		throw Error("请传入类选择器!")
		 	}
		 	this.selector=$(selector);
		 	this.selector.css({	position: 'relative',margin: 'auto',width: '100%',height:'100%'})
		 	//处理备选对象
		 	if (!objUser) {
		 		var nav=false;
		 		var scorllTimex=600;
		 		var banner_navPosx="right"
		 	}else {
		 		//处理分页器
			 	var nav=false;
			 	if (objUser.banner_nav==true) {
			 		nav=true;
			 	}				 	
			 	if(nav==true){
			 		this.creatNav();				 		
			 	}
			 	//滚动时间
			 	var scorllTimex=600;
			 	if (objUser.scorllTime) {
			 		scorllTimex=objUser.scorllTime;
			 	}
			 	//分页器位置
			 	var banner_navPosx="right";
			 	if (objUser.banner_navPos) {
			 		banner_navPos=objUser.banner_navPos
			 	}		 	
		 	};		 	
		 	this.userObj={
		 		pageAnchorName:selector,
		 		scorllTime:scorllTimex,
		 		banner_navPos:banner_navPosx,
		 	}					
		 };
		/**执行函数**/
	PageScorllx.prototype.init=function(jQuery,selector,userObj){	
		$('html').css({width:'100%',height: '100%',overflow:'hidden'});
		$('body').css({width:'100%',height:'100%',marginLeft: 'auto',marginTop: 'auto'});
		if (this.oul) {
			if (this.userObj.banner_navPos==="left") {
				this.oul.style.cssText='position: fixed;'
				+'z-index: 999;'
				+'top: 50%;'+'left:5%;';
			}else {
				this.oul.style.cssText='position: fixed;'
				+'z-index: 999;'
				+'top: 50%;'
				+'right:5%;';
			}
		}				
		this.isScroll = this.defaults.isScroll;				
		this.$htmlbody = this.defaults.$htmlbody;
		this.pagenum =  this.defaults.Number;
		this.scorllTime = this.userObj.scorllTime;	
		this.$navIndex = this.oa;
		this.pageAnchorName =this.userObj.pageAnchorName;
		this.direction=this.userObj.direction;
		var that=this;
		if (that.oul) {
			that.scrollTo(that.scorllTime);
		}
		$(window).on("mousewheel DOMMouseScroll", function (e) {//mousewheel事件滚轮接受
			var e=e||window.event;
			 var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
		                	(e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));//firfox
			$(window).trigger("scrollchangePageScroll", [delta])
		});
		$(window).on("scrollchangePageScroll", function (e,delta){  
			var  selectorLen=that.selector.length;    
		    if (delta > 0) {
		        if(that.pagenum<=0){
		        		 that.pagenum=0;
		        }else{
		        		if(that.isScroll==false){
		        			that.isScroll=true;	 
		        			that.pagenum--;				        			
		        		}  		
		        } 
		    } else {
		        if(that.pagenum>=selectorLen-1){
		        		that.pagenum=selectorLen-1;
		        }else{
		       	 	if(that.isScroll==false){
		       	 		that.isScroll=true;     	 		
		        		that.pagenum++;	
		        	}
		        }				         
		    }	 
		    that.changeBg();
		}); 
		//监听页面变化
		$(window).resize(function(){
			that.$htmlbody.scrollTop($(that.pageAnchorName).eq(that.pagenum).offset().top)
		});				
	}
	PageScorllx.prototype.scrollTo=function(scrolltime){
	 	var that=this;
		this.$navIndex.click(function(){
			$(this).addClass("banner_navChose").parent().siblings("li").find("a").removeClass("banner_navChose");
			$(this).parent().removeClass("liHover").siblings("li").addClass("liHover");
			 that.pagenum=String($(this).parents("ul").find("li").not($(".liHover")).index())
			 var scrollToDom=$(that.pageAnchorName).eq(that.pagenum);
			 if(that.$htmlbody.is(":animated")){
				console.log('戳那么快干嘛!!') 					
			}else{ 	
				 that.defaults.$htmlbody.animate(
				{	
					scrollTop:scrollToDom.offset().top//核心思想
				},scrolltime,function(){
					that.isScroll=false;
				});
			}																	
	 	});							
	}

	PageScorllx.prototype.changeBg=function(){ 
		var that=this;
		if(this.$htmlbody.is(":animated")){
			console.log('isScrolling!!') 					
		}else{ 	
			var pageName= this.pageAnchorName;
			var pagenum = that.pagenum;
			var scorllTime = that.scorllTime;
			if (this.oul) {
				this.$navIndex.eq(pagenum).addClass("banner_navChose").parent().siblings("li").find("a").removeClass("banner_navChose");
				this.$navIndex.eq(pagenum).parents().removeClass("liHover").siblings("li").addClass("liHover");
			}					
			if (that.pagenum<=that.selector.length-1){						
					this.$htmlbody.animate({scrollTop:$(pageName).eq(pagenum).offset().top},scorllTime,"swing", function () {
										that.isScroll=false;												
									});
			}
		}
	};
	
	PageScorllx.prototype.creatNav=function(){
			var oul=document.createElement("ul");					
			oul.classList.add("banner_navUl")
			var body=document.querySelector("body")
			body.appendChild(oul);
			this.oul=oul;
			for(var i=0;i<this.selector.length;i++){
				var oli=document.createElement("li");
				oli.style.cssText='width: 16px;'
				+'height: 16px;'
				+'line-height: 12px;'
				+'margin-top: 6px;'
				+'cursor: pointer;';
				oli.classList.add("banner_navLi");
				this.oul.appendChild(oli)
				var oa=document.createElement("a");
				oa.style.cssText='display: inline-block;'
				+'border-radius: 50%;';
				oa.classList.add("banner_nav");
				oli.appendChild(oa);
			}
			this.oli=this.oul.querySelectorAll("li");
			this.oax=this.oli[0].firstChild;
			this.oax.classList.add("banner_navChose");
			this.oa=$(".banner_nav");
		};
		 return new PageScorllx($,selector,objUser);
	}($,selector,objUser)
};

window.addEventListener("load", function(){
	$('html,body').animate({scrollTop:0},600,"swing");
}, false)