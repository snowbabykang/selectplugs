/***
 * 标签选择插件
 * 调用1：在元素添加 class='j_select_wsqtag' 
 * 调用2：调用方法 selectWsqTag.open(options) 变量可选，有默认
 	options = {
		ajaxUrl: 请求路径
		searchUrl: 搜索路径
		onselect: 选择事件
 	}); 
 * 不需要记录数据，每次打开都是置空并新生成
***/
var selectWsqTag = {};
(function(sobj) {
	var $modal = $('#selectWsqTagModal'),
		$info = $modal.find('.j_info_bar'),
		$modalList = $modal.find('.j_list'), 
		$openbtn = $('.j_select_wsqtag'),
		$input = $modal.find('.j_autoinput'),
		pageBar = null, inited = false;
		nowpage = 1, lock = false;

	var options = { //默认参数
			ajaxUrl:  API.HOST + '/index.php/shangjia/wsqcommunity/recommendlable?community_id=' + API.community_id,
			searchUrl: API.HOST + '/index.php/shangjia/wsqcommunity/searchlabel?community_id=' + API.community_id,
			onselect:function(data){
				console.log(data);
			}
		};
	sobj.open = function(newoptions){
		if(!inited && newoptions) {
			$.extend(options, newoptions);
			inited = true;
		}
		//加载列表
		sobj.getList(1); 
		$modal.modal("show");
		$input.val('');
		setTimeout(function(){
			$input.focus();
		}, 600);
	};
	sobj.reset = function(){ //全部变量重置
		inited = false;
		return sobj;
	};
	sobj.getList = function(page, word){ //获取列表数据
		if(lock) return;
		lock = true;
		if(page < 1) page = 1;
		//$info.infobar('正在加载...');
		var url = options.ajaxUrl;
		if(word) url = options.searchUrl + '&key_word=' + word;
		sobj.word = word || '';
		$.ajax({
			type: 'POST',
			url: url + "&page=" + page,
			success:function(msg){
				//$modal.modal("show");
				var data = eval('(' + msg + ')');
		
				if(data){
					nowpage = page;
					data.pages = data.total_page || 0;
					sobj.setList(data);
					sobj.setPageBar(data);
				}
				if(data && !data.status){
					//$info.infobar('加载完成', 'success', 1000);
				}else{
					//$info.infobar('没有数据', 'warn', 1000);
				}
			},
			error:function(msg){
				//$info.infobar('请求失败', 'warn', 2000);
			},
			complete:function(){ //生成分页条
				lock = false;
			}
		});

	};
	sobj.setList = function(data){ //列表dom操作
		var tablehead = '<ul class="">',
			tablefoot = '</ul>', tr = '';
		if(data && data.count){
			var list = data.label_list || data.subject_list;
			sobj.tempList = list;
			$.each(list, function(index, x){ //遍历json数据列
				if(x.label_name){
					tr += '<li onclick="selectWsqTag.select(\'selectWsqTag.tempList['+ index +']\')"><span class="icon-tag"></span><a>'+ x.label_name +'</a></li>';
				}
			});
		}else{
			tablehead = '', tablefoot = '', tr = '';
			//tr = '<li style="padding:30px; text-align:center">没有数据！</li>';
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
			sobj.getList(1, sobj.word);
		});
		$prev.bind('click', function(){
			sobj.getList(--nowpage, sobj.word);
		});
		$next.bind('click', function(){
			sobj.getList(++nowpage, sobj.word);
		});
		$end.bind('click', function(){
			sobj.getList(data.pages, sobj.word);
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
		var item = $input.val();
		if(data) item = eval('(' + data + ')');
		(options.onselect(item) !== false) && $modal.modal("hide");
	};

	//open按钮
	$openbtn.live('click', function(){
		sobj.open();
	});
	//自动匹配input 
	var timer;
	$input.live('input', function(){
		var val = $input.val();
		clearTimeout(timer);
	    timer = null;
		timer = setTimeout(function(){
			sobj.getList(1, val);
			timer = null;
		}, 350); //确保输入停顿后350秒搜索
	});
})(selectWsqTag);