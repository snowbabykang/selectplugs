/*!
 * jQuery Taggd
 * A helpful plugin that helps you adding 'tags' on images.
 *
 * rewrite by mingyili
 */

(function($) {
	'use strict';
	//编辑标签的默认事件
	var defaults = { //默认配置 
		offset: 20,
		onDiytag: function(){return true;}, //点击添加自定义标签事件
		onPrdtag: function(){return true;} //点击添加商品标签事件
	};
	//当时输出标签时候写对点击标签要只执行事件 onLanel 提供标签 data{text: , link: }
	
	/****************************************************************
	 * TAGGD
	 * element //加标签的图片
	 * options //默认配置
	 * data //默认和要存储的标签数据
	 ****************************************************************/
	
	var Taggd = function(element, options, data) {
		var _this = this;
		this.initialized = false; //实例化标记
		this.element = $(element);
		this.options = $.extend(true, {}, defaults, options);
		this.onDiytag = this.options.onDiytag;
		this.onPrdtag = this.options.onPrdtag;
		this.offset = this.options.offset;
		this.data = data || []; //标签数据
		
		//this.initialize();
		// if(!this.element.height() || !this.element.width()) {
		// 	this.element.on('load', _this.initialize.bind(this));
		// } else 
		this.initialize();
	};

	/****************************************************************
	 * INITIALISATION 实例化
	 ****************************************************************/
	Taggd.prototype.initialize = function() {
		if(this.initialized) return;
		var _this = this;
		//don操作
		this.initialized = true;
		this.initWrapper();
		if(_this.data.length < 1) this.newTag({ x: .5, y: .5, text:''});

		//点击添加事件
		this.element.on('click', function(e) { //点击图片

			if(typeof(_this.editing.ele) !== 'undefined') { //正在编辑 删除
				_this.deltTag(_this.editing);
				_this.editing = {};
				_this.btn_cont.hide();
			}else{ //新增
				var poffset = $(this).parent().offset(),
					x = (e.pageX - poffset.left) / _this.element.width(),
					y = (e.pageY - poffset.top) / _this.element.height(),
					data = { x: x, y: y, text: ''};
				
				_this.newTag(data);
				_this.btn_cont.show();
			}
		});
		
	};

	/****************************************************************
	 * initWrapper 添加图片加wapper
	 ****************************************************************/
	Taggd.prototype.initWrapper = function() {
		//if(this.initialized) return;
		var wrapper = $('<div class="taggd-wrapper" />');
		this.element.wrap(wrapper); //添加dom
		this.wrapper = this.element.parent('.taggd-wrapper'); //b暴露变量
		this.wrapper.removeAttr('style').css({
			height: this.element.height(),
			width: this.element.width()
		});
		
		this.initButton(); //添加btn
		this.initTags(); //添加btn
	};

	/****************************************************************
	 * initButton 添加加编辑按钮组
	 ****************************************************************/
	Taggd.prototype.initButton = function() {
		var $btn_cont = $('<div class="taggd_btn_cont" />'),
			$btn_diytag = $('<a class="taggd_btn"><span class="icon-white icon-tag"></span>自定义</a>'),
			$btn_prdtag = $('<a class="taggd_btn"><span class="">+</span>商品</a>');
		
		//绑定事件
		$btn_diytag.on("click", this.onDiytag);
		$btn_prdtag.on("click", this.onPrdtag);
		
		//添加dom
		$btn_cont.append($btn_prdtag, $btn_diytag).hide();
		this.wrapper.append($btn_cont);
		
		//暴露变量
		this.btn_diytag = $btn_diytag;
		this.btn_prdtag = $btn_prdtag;
		this.btn_cont = $btn_cont;
	};

	/****************************************************************
	 * 添加默认标签
	 ****************************************************************/
	Taggd.prototype.initTags = function() {
		var _this = this;
		
		$.each(_this.data, function(i, v) {
			_this.addDOM(v); 
			//_this.editing = v; //将新添加的设为正在编辑
		});

	};
	/****************************************************************
	 * newTag 添加tag
	 ****************************************************************/
	Taggd.prototype.newTag = function(data) {
		var _this = this;

		if(this.initialized) {
			//添加 dom 将添加的ele返回 
			_this.addDOM(data); 
			_this.editing = data; //将新添加的设为正在编辑
			_this.btn_cont.show();
			//data 加到数组中
			if($.isArray(data)) {
				this.data = $.merge(this.data, data);
			} else {
				this.data.push(data);
			}
		}
	};

	/****************************************************************
	 * addDOM
	 ****************************************************************/
	Taggd.prototype.addDOM = function(data) {
		var _this = this;
		
		var $item = $('<div class="taggd-item" />'), //点
			$hover = $('<span class="taggd-item-hover" />'); //标签
			
		if(data.x > 1 && data.y > 1) {
			data.x = data.x % 1;
			data.y = data.y % 1;
		} //当位置超出范围的时候

		$item.attr({
			'data-x': data.x,
			'data-y': data.y
		});
		$item.css({
			left: data.x * _this.element.width() - $item[0].clientWidth / 2,
			top: data.y * _this.element.height() - $item[0].clientHeight / 2
		});

		if(data.text === "") $hover.hide();
		$hover.attr({
			'data-x': data.x,
			'data-y': data.y
		});
		
		$item.append($hover);
		_this.wrapper.append($item);

		data.ele = $item;
		_this.setTag(data); //设置点位置
	};

	/****************************************************************
	 * deltTag 删除tag
	 ****************************************************************/
	Taggd.prototype.deltTag = function(data) {
		var _this = this;

		//删除dom
		if(typeof(data.ele) !== 'undefined') data.ele.remove();
		//从数组中剔除要删除的tag
		_this.data = $.grep(_this.data, function(v) {
			return v.x != data.x || v.y != data.y;
		});
	};

	/****************************************************************
	 * setTag 设置tag 文字，属性，和拖动事件
	 ****************************************************************/
	Taggd.prototype.setTag = function(data) {
		var _this = this;

		var $el = data.ele.find(".taggd-item-hover"), //
			$span = $('<span />').text(data.text), //标签文字
			$btn_delt = $('<button class="icon-white icon-remove" />').hide(); //删除按钮
		if(data.text !== ''){
			$el.show();
			data.ele.addClass("flashAnim");
		}
		$el.on('click', function() {
			$btn_delt.toggle();
		});
		$btn_delt.on('click', function() {
			_this.deltTag(data);
		});

		$el.empty().append($span, $btn_delt);

		_this.editing = {};
		_this.btn_cont.hide();

		_this.updateTag(data); //设置标签样式
		//_this.dragTag(data); //拖动事件
	};
	/****************************************************************
	 * addTag 新增标签用于程序外添加tag, 保存更多的数据
	 ****************************************************************/
	Taggd.prototype.addTag = function(data) {
		var _this = this;
		if(typeof(data) === 'string'){ //传字符默认为字
			_this.editing.text = data; 
		}else if(typeof(data) === 'object'){ //传对象
			$.extend(_this.editing, data); //对象合并
		}
		_this.setTag(_this.editing); //设置数据
	};

	/****************************************************************
	 * updateTag
	 ****************************************************************/
	Taggd.prototype.updateTag = function(data) {
		var _this = this;

		var $el = data.ele,
			$e = $el.find(".taggd-item-hover"),
			e = $e[0],
			left = data.x * _this.element.width(),
			top = data.y * _this.element.height();
		//左右定位
		if(e.clientWidth > 120){
			$e.find('span').css({
				'width': 120,
				'white-space': 'normal'
			});
		}
		if(left < e.clientWidth + _this.offset){ //太靠右
			$e.removeClass("right");
		}else{
			$e.addClass("right");
		}
				
	};

	/****************************************************************
	 * dragTag tag 拖动事件
	 ****************************************************************/
	Taggd.prototype.dragTag = function(data) {
		var _this = this;

		//可拖动
		var transform = {
	        translate: { x: 0, y: 0}
	    };
	    var oldx = parseFloat(data.ele.attr("data-x")),
	    	oldy = parseFloat(data.ele.attr("data-y")),
	    	offset = _this.offset/3,
	    	width = _this.element.width(),
	    	height = _this.element.height();
		var maxx = width * (1 - oldx) - offset,
			maxy = height * (1 - oldy) - offset,
			minx = offset - width * oldx,
			miny = offset - height * oldy;
	    var mc = Hammer(data.ele[0]);
		//mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc.get('pan')]);
		var display_transform = function (field, val){
			//可扩展，根据传入的不同值改变不同的css 位移或缩放 缩放已删
			if(field) transform[field] = val; 
			var tx = transform.translate.x,
				ty = transform.translate.y;
			tx = tx >= maxx ? maxx : tx;
			tx = tx <= minx ? minx : tx;
			ty = ty >= maxy ? maxy : ty;
			ty = ty <= miny ? miny : ty;
			transform.translate.x = tx,
			transform.translate.y = ty;
			var value = 'translate3d(' + tx + 'px, ' + ty + 'px, 0)';
			data.ele.css({"-webkit-transform": value});
			
			//r2 = (w*r1 + x2)/w 新位置的公式化简之后就是上面的
			data.x = oldx + (tx / width);
			data.y = oldy + (ty / height);
			_this.updateTag(data);
		};
		var START_X,　START_Y,　initScale;
		mc.on("panstart panmove", function (ev) {
			if(ev.type == 'panstart'){
				START_X = transform.translate.x;
				START_Y = transform.translate.y;
			}else{
				display_transform('translate', { x: START_X + ev.deltaX, y: START_Y + ev.deltaY});
			}
		});
	};

	/****************************************************************
	 * reset 处理并抛出最后获得的数据
	 ****************************************************************/
	Taggd.prototype.result = function() {
		var _this = this, data = [];
		$.each(_this.data,function(i, v){
			data[i] = v;
			data[i].ele = '';
		});
		return data;
	};
	/****************************************************************
	 * clear清除所有标签
	 ****************************************************************/
	Taggd.prototype.clear = function() {
		if(!this.initialized) return;
		this.data = [];
		this.wrapper.find('.taggd-item').remove().find('.taggd_btn_cont').hide();
	};

	/****************************************************************
	 * reset
	 ****************************************************************/
	Taggd.prototype.reset = function() {
		this.clear();
		this.newTag({ x: .5, y: .5, text:''});
	};
	
	
	/****************************************************************
	 * JQUERY LINK
	 ****************************************************************/
	
	$.fn.taggd = function(options, data) {
		return new Taggd(this, options, data);
	};
})(jQuery);