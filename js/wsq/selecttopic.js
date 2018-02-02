/***
 * 话题选择插件
 * 调用1：在元素添加 class='j_select_topic' 
 * 调用2：调用方法 selectTopic.open(options) 变量可选，有默认
 	options = {
		ajaxUrl: 请求路径
		searchUrl: 搜索路径
		defaultId: 默认id
		onselect: 选择事件
 	}
 * 不需要记录数据，每次打开都重置
 * 商品搜索 input 
***/
var selectTopic = {};
(function(sobj) {
	var $modal = $('#selectTopicModal'),
		$info = $modal.find('.j_info_bar'),
		$modalList = $modal.find('.j_list'), 
		$input = $modal.find('.j_searchinput'),
		$openbtn = $('.j_select_topic'),
		pageBar = null, inited = false;
		nowpage = 1, lock = false;

	var options = { //默认参数
			ajaxUrl:  API.HOST + '/index.php/shangjia/wsqsubject/comsubject?community_id=' + API.community_id,
			searchUrl: API.HOST + '/index.php/shangjia/wsqcommunity/searchtopic?community_id=' + API.community_id,
			defaultId: '',
			onselect:function(data){
				console.log(data);
			}
		};

	sobj.open = function(newoptions){
		//加载列表
		if(!inited && newoptions) {
			$.extend(options, newoptions);
			inited = true;
		}
		//加载列表
		sobj.getList(1); 
		$modal.modal("show");
	};
	sobj.reset = function(){ //全部变量重置
		inited = false;
		return sobj;
	};
	sobj.getList = function(page, word){ //获取列表数据
		if(lock) return;
		lock = true;
		if(page < 1) page = 1;
		var url = options.ajaxUrl;
		if(word) url = options.searchUrl + '&key_word=' + word;
		sobj.word = word;
		$info.infobar('正在加载...');
		$.ajax({
			type: 'POST',
			url: url + "&page=" + page,
			success:function(msg){
				$modal.modal("show");
				var data = eval('(' + msg + ')');
				if(data){
					nowpage = page;
					sobj.setList(data);
					sobj.setPageBar(data);
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
		var tablehead = '<table class="table table-bordered table-striped"><tr><th width="200">话题信息</th><th width="50">点赞数</th><th width="100">操作</th></tr>',
			tablefoot = '</table>', tr = '';
		if(data && data.count){
			var list = data.subject_list;
			sobj.tempList = list;
			$.each(list, function(index, x){ //遍历json数据列
				var tclass = '';
				if(options.defaultId && x.id == options.defaultId){
					x.selected = true;
					tclass = 'btn btn-success';
				}else{
					x.selected = false;
					tclass = 'btn';
				}
				tr += '<tr><td><div class="img"><img src="'+ x.pic_url +'"/></div>';
				tr += '<div class="name"><p class="title">'+ x.subject_name +'</p><p class="info"> '+ x.sub_content +'</p></div></td>';
				tr += '<td>'+ x.laud_num +'</td>';
				tr += '<td><span class="'+ tclass +'" onclick="selectTopic.select(\'selectTopic.tempList['+ index +']\')" data-id="'+ x.id +'">选择</span></td>';
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
		var item = eval('(' + data + ')');
		//在defaultId里添加数据 只能选择一个，处理相对简单
		//多个默认的时候在这扩展
		if(!options.defaultId || (options.defaultId && item.id != options.defaultId)){
			options.defaultId = item;
			sobj.selectList(item);
		}
		(options.onselect(item) !== false) && $modal.modal("hide");
	};
	sobj.selectList = function(item){ //列表dom修改
		$modal.find(".j_list .btn.btn-success").removeClass("btn-success");
		$modal.find(".j_list .btn[data-id='" + item.id + "']").addClass("btn-success");
	};
	sobj.search = function(word){ //重新加载
		word = word || $input.val();
		sobj.getList(1, word);
	};

	//open按钮
	$openbtn.live('click', function(){
		sobj.open();
	});

})(selectTopic);