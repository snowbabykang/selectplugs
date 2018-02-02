/***
 * 圈子选择插件
 * 调用1：在元素添加 class='j_select_circle' 
 * 调用2：调用方法 selectCircle.open(options, this) 变量均可选，有默认
 	options = {
		ajaxUrl: 请求路径   默认: API.HOST + '/index.php/wsq/personalcenter/index?sid='+ API.sid +'&community_id=' + API.community_id, 
		defaultId: 默认id   默认: ''
		onselect: 选择事件  默认: function(data) {}
		nowpage: 加载第几页 默认: 1
 	}, this); 最后的this 可以不写，
 * 会记录元素上次选择的数据，再次打开时重新配置
***/
var selectCircle = {};
(function(sobj) {
	
	var $modal = $('#selectCircleModal'),
		$info = $modal.find('.j_info_bar'),
		$modalList = $modal.find('.j_list'), 
		$openbtn = $('.j_select_circle'),
		$target = null,
		pageBar = null, lock = false, options;

	sobj.open = function(newoptions, target){
		options = { //默认参数
			ajaxUrl: API.HOST + '/index.php/shangjia/wsqcommunity/circlelist?community_id=' + API.community_id, 
			defaultId: null, //默认id
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

			newoptions = oldoptions || newoptions;
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
			url: options.ajaxUrl + "&page=" + page,
			success:function(msg){
				var data = eval('(' + msg + ')');
				if(data){
					options.nowpage = page;
					sobj.setList(data);
					sobj.setPageBar(data);
					$target.data('options', options);
				}
				if(data && !data.status){
					$info.infobar('加载完成', 'success', 1000);
				}else{
					$info.infobar('没有数据', 'warn', 1000);
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
			var list = data.circle_list;
			var tablehead = '<table class="table table-bordered table-striped"><tr><th width="200">圈子</th><th width="100">成员</th><th width="100">操作</th></tr>',
				tablefoot = '</table>', tr = '';
			sobj.tempList = list; //缓存数据
			
			$.each(list, function(index, x){ //遍历json数据列
				var btnclass = '';
				if(x.id == options.defaultId){
					x.selected = true;
					btnclass = 'btn btn-success';
				}else{
					x.selected = false;
					btnclass = 'btn';
				}
				tr += '<tr><td><span class="img"><img src="'+ x.circle_cover +'"/></span><span class="name">'+ x.circle_name +'</span></td>';
				tr += '<td>'+ x.circle_member_num +'</td>';
				tr += '<td><span class="'+ btnclass +'" onclick="selectCircle.select(\'selectCircle.tempList['+ index +']\')" data-id="'+ x.id +'">选择</span></td>';
				tr += '</tr>';
			});
		}else{
			tablehead = '', tablefoot = '',
			tr = '<div style="padding:30px; text-align:center">没有数据！</div>';
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
			sobj.getList(1);
		});
		$prev.bind('click', function(){
			sobj.getList(--options.nowpage);
		});
		$next.bind('click', function(){
			sobj.getList(++options.nowpage);
		});
		$end.bind('click', function(){
			sobj.getList(data.pages);
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
		if(!data.count) { //没有数据
			pageBar.$pagebarinfo.html('共0条数据');
			pageBar.$home.hide(), pageBar.$prev.hide();
			pageBar.$next.hide(), pageBar.$end.hide();
			return false;
		}
		pageBar.$pagebarinfo.html('总共'+ data.count +'条数据，每页'+ data.page_size +'条，第'+ data.page +'/'+ data.pages +'页');
		
		if(data.page != 1 || data.page != data.pages){
			pageBar.$home.show(), pageBar.$prev.show();
			pageBar.$next.show(), pageBar.$end.show();
		}
		if(data.page == 1) {
			pageBar.$home.hide(), pageBar.$prev.hide();
		}
		if(data.page == data.pages) {
			pageBar.$next.hide(), pageBar.$end.hide();
		}
	};
	sobj.select = function(data){ //选中
		var item = eval('(' + data + ')');
		//在defaultId里添加数据 只能选择一个，处理相对简单
		if(!options.defaultId || (options.defaultId && item.id != options.defaultId)){
			options.defaultId = item.id;
			sobj.selectList(item);
			$target.data('options', options);
		}
		(options.onselect(item) !== false) && $modal.modal("hide");
	};
	sobj.selectList = function(item){ //列表dom修改
		$modal.find(".j_list .btn.btn-success").removeClass("btn-success");
		$modal.find(".j_list .btn[data-id='" + item.id + "']").addClass("btn-success");
	}; 

	//open按钮
	$openbtn.live('click', function(){
		var _this = $(this);
		sobj.open({
			onselect: function(item){
				_this.prev('input').val(item.circle_name).data('id', item.id);
			}
		}, this);
	});
})(selectCircle);