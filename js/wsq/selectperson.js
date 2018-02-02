/***
 * 身份选择插件
 * 调用1：在元素添加 class='j_select_person' 
 * 调用2：调用方法 selectPerson.open(options, this) 变量均可选，有默认
 	options = {
		ajaxUrl: 请求路径   默认: API.HOST + '/index.php/wsq/personalcenter/index?sid='+ API.sid +'&community_id=' + API.community_id, 
		defaultId: 默认id   默认: ''
		onselect: 选择事件  默认: function(data) {}
		nowpage: 加载第几页 默认: 1
 	}, this); 最后的this 可以不写，
 * 会记录元素上次选择的数据，再次打开时重新配置
***/
var selectPerson = {};
(function(sobj) {
	
	var $modal = $('#selectPersonModal'),
		$info = $modal.find('.j_info_bar'),
		$modalList = $modal.find('.j_list'), 
		$openbtn = $('.j_select_person'),
		$target = null,
		pageBar = null, lock = false, options;

	sobj.open = function(newoptions, target){
		options = { //默认参数
			clear: false,
			ajaxUrl: API.HOST + '/index.php/shangjia/commoncomponent/offlinelist', 
			defaultId: null, //默认Id
			onselect: function(data){
				console.log(data); //选中的数据
			},
			nowpage: 1
		};

		if(target) {
			$target = $(target);
			//所有默认配置
			var oldoptions =  $target.data('options') || null;
			if(typeof(oldoptions) == 'string'){
				oldoptions = eval('(' + oldoptions + ')');
			}
			if(!oldoptions){
				var defaultId = $target.data('id');
				if(defaultId) newoptions.defaultId = defaultId;
			}

			!newoptions.clear && (newoptions = oldoptions || newoptions);
			//默认id
		}

		newoptions && $.extend(options, newoptions);
		sobj.getList(options.nowpage || 1);
		$modal.modal("show");
	};
	sobj.getList = function(page){ //获取列表数据
		if(lock) return;
		lock = true;
		if(page < 1) page = 1;
		$info.infobar('正在加载...');
		$.ajax({
			type: 'POST',
			url: options.ajaxUrl,
			data : {"page":page},
			success:function(msg){
				var data = eval('(' + msg + ')');
				if(data){
					options.nowpage = page;
					data.pages = data.countpage || 0;
					sobj.setList(data);
					sobj.setPageBar(data);
					$target.data('options', options);
				}
				if(data && !data.status){
					$info.infobar('加载完成', 'success', 1000);
				}else{
					$info.infobar('没有数据', 'warn',  1000);
				}
			},
			error:function(msg){
				$info.infobar('请求失败', 'warn', 2000);
			},
			complete:function(){ //生成分页条
				lock = false;
			}
		});

	};
	sobj.setList = function(data){ //列表dom操作
		if(data && data.count){
			var list = data.offline;
			var tablehead = '<table class="table"><tr><th width="200">身份信息</th><th width="100">操作</th></tr>',
				tablefoot = '</table>', tr = '';
			sobj.tempList = list; //缓存数据
			
			$.each(list, function(index, x){ //遍历json数据列
				var btnclass = '';
				if(x.OpenId == options.defaultId){
					x.selected = true;
					btnclass = 'btn btn-success';
				}else{
					x.selected = false;
					btnclass = 'btn';
				}
				tr += '<tr><td><span class="img"><img src="'+ x.headimgurl +'"/></span>';
				tr += '<span class="name">'+ x.ServeNick +'</span></td>';
				tr += '<td><span class="'+ btnclass +'" onclick="selectPerson.select(\'selectPerson.tempList['+ index +']\')" data-id="'+ x.OpenId +'">选择</span></td>';
				tr += '</tr>';
			});
		}else{
			tablehead = '', tablefoot = '',
			tr = '<div class="nodatapage"><i class="ywkicon icon-exclamationcircle"></i>暂无数据</div>';
		}

		$modalList.html(tablehead + tr + tablefoot);
	};
	sobj.initPageBar = function(data){
		var $pageBar = $('<div class="sabrosus">'),
			$pagebarinfo = $('<span class="">'),
			$home = $('<a class="">首页</a>'),
		    $prev = $('<a class="">上一页</a>'),
		    $next = $('<a class="">下一页</a>'),
		    $end = $('<a class="">尾页</a>')

		$pageBar.append($pagebarinfo, $home, $prev, $next, $end);
		$modalList.after($pageBar);

		$home.bind('click', function(){
			if($(this).hasClass("btn-link")){
			sobj.getList(1);
			}
		});
		$prev.bind('click', function(){
			if($(this).hasClass("btn-link")){
			sobj.getList(--options.nowpage);
			}
		});
		$next.bind('click', function(){
			if($(this).hasClass("btn-link")){
			sobj.getList(++options.nowpage);
			}
		});
		$end.bind('click', function(){
			if($(this).hasClass("btn-link")){
			sobj.getList(data.pages);
			}
		});

		pageBar = {
			$pageBar : $pageBar,
			$pagebarinfo : $pagebarinfo,
			$home : $home,
		    $prev : $prev,
		    $next : $next,
		    $end : $end
		};
	};
	sobj.setPageBar = function(data){
		if(!pageBar) sobj.initPageBar(data);
		if(!data.count || data.count <= data.page_size ) { //没有数据
			pageBar.$pagebarinfo.html('');
			pageBar.$home.hide(), pageBar.$prev.hide();
			pageBar.$next.hide(), pageBar.$end.hide();
			return false;
		}
		pageBar.$pagebarinfo.html('共'+ data.count +'条  第'+ data.page +'/'+ data.pages +'页');
		if(data.page == 1){
			pageBar.$home.removeClass("btn-link"), pageBar.$prev.removeClass("btn-link");
		}else{
			pageBar.$home.show().addClass("btn-link"), pageBar.$prev.show().addClass("btn-link");
		}
		//如果是最后页
		if(data.page >= data.pages){
			pageBar.$next.removeClass("btn-link"), pageBar.$end.removeClass("btn-link");
		}else{
			pageBar.$next.show().addClass("btn-link"), pageBar.$end.show().addClass("btn-link");
		};
	};
	sobj.select = function(data){ //选中
		var item = eval('(' + data + ')');
		//在defaultId里添加数据 只能选择一个，处理相对简单
		if(!options.defaultId || (options.defaultId && item.OpenId != options.defaultId)){
			options.defaultId = item.OpenId;
			sobj.selectList(item);
			$target.data('options', options);
		}
		(options.onselect(item) !== false) && $modal.modal("hide");
	};
	sobj.selectList = function(item){ //列表dom修改
		$modal.find(".j_list .btn.btn-success").removeClass("btn-success");
		$modal.find(".j_list .btn[data-id='" + item.OpenId + "']").addClass("btn-success");
	}; 

	//open按钮
	$openbtn.live('click', function(){
		var _this = $(this);
		sobj.open({
			onselect: function(item){
				_this.prev('input').val(item.ServeNick).data('id', item.OpenId);
			}
		}, this);
	});
})(selectPerson);
