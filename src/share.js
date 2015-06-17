define('share', function(require, exports, module){

	var options = {
		url: '',
		content: '',
		pic: ''
	};

	function share(options) {
		var param = {
			url:options.url,
			type:'2',
			count:'', /**是否显示分享数，1显示(可选)*/
			appkey:'', /**您申请的应用appkey,显示分享来源(可选)*/
			title: options.content, /**分享的文字内容(可选，默认为所在页面的title)*/
			pic: options.pic, /**分享图片的路径(可选)*/
			ralateUid:'', /**关联用户的UID，分享微博会@该用户(可选)*/
			language:'zh_cn', /**设置语言，zh_cn|zh_tw(可选)*/
			rnd:new Date().valueOf()
		}
		var temp = [];
		for( var p in param ){
			temp.push(p + '=' + encodeURIComponent( param[p] || '' ) )
		}
		window.open("http://service.weibo.com/share/share.php?" + temp.join('&'), "_blank", "width=615,height=505");
	}

	function postToQzone(options){
		var p = {
			url: options.url,
			showcount:'0',/*是否显示分享总数,显示：'1'，不显示：'0' */
			desc:'',/*默认分享理由(可选)*/
			summary: options.content, 
			title:'',/*分享标题(可选)*/
			site:'',/*分享来源 如：腾讯网(可选)*/
			pics: options.pic  /*分享图片的路径(可选)*/
		};
		var s = [];
		for(var i in p){
			s.push(i + '=' + encodeURIComponent(p[i]||''));
		}

		window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?'+ s.join('&'));
	}

	exports.postToWeibo = share;
	exports.postToQzone = postToQzone;

});