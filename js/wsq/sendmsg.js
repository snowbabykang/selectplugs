/* 发送话题 / 者发送评论插件 */
/**
 * 点击某个按钮在指定位置添加相应的发送信息的插件，默认为 this 之前
 * 选择：是否可以添加附件，默认 ture
 * 定义：发送按钮的文字， 默认确定
 * 定义：发送按钮触发的事件 data获取的数据
 * data: 包括输入的内容 text 和附件 attach.
 */

var sendMsg = {};
function createSendMsg(sobj){
	var doption = {
		inData: null,
		defaultText: null, //默认文字数据
		attachData: null, //默认附加数据
		target : '#',  //要插入的div
		hasattach : true, //属否能添加附件信息
		sendPlaceholder: '继续补充话题内容...', //输入时候的文字提示
		sendTitle: '补充话题', //标题默认补充话题
		sendText : '确定',  //发送按钮文字
		onSend : function(data){ //发送按钮绑定事件
			return true;
		}
	};
	
	var $target,
		$send_div, $send_title, $send_close, $send_result, $send_face_div, 
		$send_attach, $send_pic, $send_topic, $send_prd, $send_face,
		$send_in, $send_btn, facesCodeArry = [], facesArry = [];
	
	var sendData = {
		inData: "", //默认需要传入的数据，比如回复的id等
		info: "",
		attach: ""
	};

	function setFacesArry() {
		if(facesCodeArry.length > 0) return;
		if(facesArry.length > 0) return;
		$send_face_div.find("span:not(.j_back)").each(function(){
			var _this = $(this),
				text = _this.data('text'),
				code = _this.data('code'),
				_img = _this.find('img'), str;
			if(_img.length > 0){
				str = _img.attr('alt');
			}else{
				str = _this.text();
			}

			facesArry[text] = str; //表情数组
			facesCodeArry[code] = text;
		});
	}

	sobj.open = function(options){
		if(!$send_div) sobj.init(options);
		$send_div.slideDown();
		$send_in.focus();
	};
	sobj.change = function(options){
		sobj.setDom(options);
		sobj.open(options);
	};
	sobj.init = function(options){
		$.extend(doption, options);	

		sobj.initdom(doption);
		sobj.initEvent(doption);
	};
	sobj.initdom = function(options){
		$target      = $(options.target);
		if(!$send_div) $target.html($("#J_sendMsgDom").html());
		$send_div    = $target.find('.j_send_div');
		$send_title  = $target.find('.j_send_title');
		$send_close  = $target.find('.j_send_close');
		$send_attach = $target.find('.j_send_attach');
		$send_result = $target.find('.j_send_result');
		$send_in     = $target.find('.j_send_in');
		$send_btn    = $target.find('.j_send_btn');
		$send_pic    = $target.find('.j_send_pic');
		$send_topic  = $target.find('.j_send_topic'); 
		$send_prd    = $target.find('.j_send_prd');
		$send_face   = $target.find('.j_send_face');
		$send_face_div   = $target.find('.j_send_face_div'),
		$send_face_close = $target.find('.j_send_face_close');
		sobj.setDom(options);
	};
	//设置附加信息 图片
	function setPicDom(data){
		var prd_html = '<div class="attach_img_big"><img src="'+ data +'"></div>';
		
		$send_attach.hide();
		$send_result.append(prd_html);
	}
	//图片选择
	sobj.addPicDom = function(url){
		setPicDom(url);
		sendData.attach = {
			type: 'pic',
			url: url
		};
	};

	//设置附加信息 话题
	function setTopicDom(data){
		var prd_html = '<div class="attach_div"><div class="attach_img"><div class="img"><img src="'+ data.pic_url +'"></div></div>';
		prd_html += '<div class="attach_info"><p class="attach_title">'+ data.subject_name +'</p>';
		prd_html += '<p class="attach_subtitle">描述：'+ data.sub_content +'</p>';
		prd_html += '<p class="attach_sub">点赞：'+ data.laud_num +'</p></div></div>';
		
		$send_attach.hide();
		$send_result.append(prd_html);
	}
	//话题选择
	sobj.addTopicDom = function(data){
		setTopicDom(data);
		sendData.attach = {
			type: 'topic',
			id: data.id,
			circle_id: data.circle_id
		};
	};
	//设置附加信息 商品
	function setPrdDom(data){
		var prd_html = '<div class="attach_div"><div class="attach_img"><div class="img"><img src="'+ data.prd_img +'"></div></div>';
		prd_html += '<div class="attach_info"><p class="attach_title">'+ data.prd_name +'</p>';
		prd_html += '<p class="attach_sub">参考价格：￥'+ data.prd_price +'</p></div></div>';
		
		$send_attach.hide();
		$send_result.append(prd_html);
	}
	//商品选择
	sobj.addPrdDom = function(data){
		setPrdDom(data);
		sendData.attach = {
			type: 'prd',
			id: data.prd_id
		};
	};
	sobj.setDom = function(options){ //可用于重置数据
		if(options.inData) sendData.inData = options.inData;

		$send_title.html(options.sendTitle);
		if(options.defaultText){
			//表情处理
			setFacesArry();
			options.defaultText = twemoji.replace(options.defaultText, function(icon){
				return facesCodeArry[twemoji.convert.toCodePoint(icon)];
			});

			$send_in.val(options.defaultText);
		}else{
			$send_in.val('');
		}
		$send_in.attr("placeholder", options.sendPlaceholder).focus();
		
		if(!options.hasattach) {
			$send_attach.hide();
			$send_result.html('');
			$send_div.addClass('hideAttach');
			sendData.attach = '';
		}else{
			$send_attach.show();
			$send_div.removeClass('hideAttach');

			if(options.attachData){
				options.attachData.type == 'pic' && sobj.addPicDom(options.attachData.data);
				options.attachData.type == 'topic' && sobj.addTopicDom(options.attachData.data);
				options.attachData.type == 'prd' && sobj.addPrdDom(options.attachData.data);
			}
		}
		$send_btn.text(options.sendText);
	};

	sobj.clear = function(hasattach){
		$send_in.val('');
		if(hasattach) {
			$send_attach.show();
			$send_result.html('');
		}
		//数据清理
		sendData = {
			inData: "",
			info: "",
			attach: ""
		};
	};
	sobj.initEvent = function(options){
		$send_close.bind('click', function(){
			$send_div.slideUp();
		});

		$send_btn.bind('click', function(){
			var target = $(this);
			$send_face_div.slideUp();
			var str = $send_in.val(),
				strs= new Array(); //定义一数组 
			strs = str.split("/"); //字符分割 
			for(var i = 1; i < strs.length; i++ ){
				var text = "/" + strs[i].slice(0, 2);
				strs[i] = (facesArry[text] || text) + strs[i].slice(2);
			}

			sendData.info = strs.join('');
			console.log(sendData.info);
			if(options.onSend(sendData, target) !== false){
				$send_div.slideUp();
				sobj.clear(true);
			}
		});

		$send_face.bind('click', function(){
			sobj.initFaces();
			$send_face_div.slideDown();
		});

		$send_face_close.bind('click', function(){
			$send_face_div.slideUp();
		});
		//当有附加内容时候
		if(options.hasattach){
			//话题选择事件绑定
			$send_topic.bind('click', function(){
				selectTopic.open({
					onselect:function(data){
						sobj.addTopicDom(data);
					}
				});
			});
			//商品选择事件绑定
			$send_prd.bind('click', function(){
				selectWsqPrd.open({
					onselect:function(data){
						sobj.addPrdDom(data);
					}
				});
			});
			
			//统一删除附加数据
			$send_result.bind('click', function(){
				if(!sendData.attach) return;
				if(confirm("是否删除附件数据")){
					$send_result.html('');
					$send_attach.show();
					sendData.attach = null;
				}
			});
		}
	}; 
	sobj.initFaces = function (){
		if($send_face_div.attr('inited')) return; //已经实例化
		$send_face_div.attr('inited', true);
		/******表情相关事件*******/
		var $slideBar = $send_face_div.find('.j_faceSlider');
		twemoji.parse($slideBar[0], {"size": 36});

		/******表情相关事件*******/
		setTimeout(function(){
			$slideBar.unslider({
				speed: 500,               //  The speed to animate each slide (in milliseconds)
				delay: 0,              //  The delay between slide animations (in milliseconds)
				keys: false,               //  Enable keyboard (left, right) arrow shortcuts
				dots: true,               //  Display dot navigation
				fluid: false              //  Support responsive design. May break non-responsive designs
			});
		}, 100);
		//表情添加按钮
		setFacesArry();
		$send_face_div.find("span:not(.j_back)").live('click', function(){
		    var _this = $(this),
		        text = _this.data('text'),
		    	start = getCursortPosition ($send_in[0]), //获取光标位置
		   		str = $send_in.val(),
		    	strA = str.substring(0, start),
		    	strB = str.substring(start, str.length);
		    
		    $send_in.val(strA + text + strB);
		    setCaretPosition($send_in[0], start + text.length); //设置光标位置

		});

		//表情删除按钮
		$send_face_div.find(".j_back").live('click', function(){ 
		    var _this = $(this), instr,
		    	start = getCursortPosition ($send_in[0]), //获取光标位置
		   		str = $send_in.val(),
		    	strA = str.substring(0, start),
		    	strB = str.substring(start, str.length),
		        Alen = strA.length;

		    instr = strA.substring(0, Alen - 1);
		    if(Alen > 2){ //三个以上字符 //表情识别
		    	var last = strA.substring(Alen - 3, Alen - 2);
			    if(last == '/') instr = strA.substring(0, Alen - 3);
		    }
		    
		    $send_in.val(instr + strB);
		    setCaretPosition($send_in[0], instr.length); //设置光标位置
		});
		//获取光标位置
		function getCursortPosition (ctrl) {
		    var CaretPos = 0;   // IE Support
		    if (document.selection) {
		    ctrl.focus ();
		        var Sel = document.selection.createRange ();
		        Sel.moveStart ('character', -ctrl.value.length);
		        CaretPos = Sel.text.length;
		    }
		    // Firefox support
		    else if (ctrl.selectionStart || ctrl.selectionStart == '0')
		        CaretPos = ctrl.selectionStart;
		    return (CaretPos);
		}
		//设置光标位置
		function setCaretPosition(ctrl, pos){
		    if(ctrl.setSelectionRange)
		    {
		        ctrl.focus();
		        ctrl.setSelectionRange(pos,pos);
		    }
		    else if (ctrl.createTextRange) {
		        var range = ctrl.createTextRange();
		        range.collapse(true);
		        range.moveEnd('character', pos);
		        range.moveStart('character', pos);
		        range.select();
		    }
		}
	};
	return sobj;
}
sendMsg = createSendMsg(sendMsg);