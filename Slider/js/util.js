var $ = sf = {};
sf.addEvevt = function(ele, type, fu, boo) {
	var ele = ele || window.event;
	if(typeof ele.addEventListener != undefined) {
		ele.addEventListener(type, fu, boo);
	} else if(typeof ele.attachEvent != undefined) {
		ele.attachEvent("on" + type, fu)
	} else {
		ele["on" + type] = fn;
	}
}
sf.addClass = function(ele, clsName) {
		ele.classList.add(clsName);
	}