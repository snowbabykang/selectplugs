/*!
 * selectFunCard 0.0.1
 * by KANGXUE
 * Copyright 2016.2
 * Date: Tus Feb 2 2016
 * 
 * 选择功能卡
 * 
 *  "prdcard" : "提货卡",
	"savingcard" : "储蓄卡",
	"creditcard" : "积分卡",
 * 
 */

 ;(function($){
 	var pluginName = 'selectFunCard',
 		defaults = {
 			host : "",
 			allTabs : ["prdcard","creditcard"],             //默认展示提货卡  积分卡
 			backdatainfo : function(){},
 		};
 	var SelectFunCard = function(element, options) {
 		this.element = $(element);
 		this.settings = $.extend({}, defaults, options);
        this.element.on({
             'click.selectFunCard': $.proxy(this.init, this)
         });
         $($.proxy(function() {
             this.element.trigger('create');
         }, this));
     };
 	SelectFunCard.prototype = {	
		tabs_title : {
			"prdcard" : "提货卡",
			"savingcard" : "储蓄卡",
			"creditcard" : "积分卡",
		},
		tabs_type : {
			"prdcard" : "1",
			"savingcard" : "2",
			"creditcard" : "3",
		},
		card_type : {
			"1" : "提货卡",
			"2" : "储蓄卡",
			"3" : "积分卡",
		},	
		total:"",
		pageSize:"",
		totalPage:"",
		curPage:1,
		cardArray:"",
		cardarr:[],
		cardprdArray : "",
 		//初始化弹出框
 		init: function(){
 			var that = this,
 				element = this.element;
 			that.getfuncardlist= that.settings.host+"/index.php/shangjia/commoncomponent/getpickupcard";   //功能卡列表
 			that.getfuncardprds= that.settings.host+"/index.php/shangjia/commoncomponent/getprddetailinfo";   //使用功能卡的商品
 			that.render(element);
 			that.initdata(element);
 			that.show();
 			that.trigger(element);
 		},

 		//创建弹出框
 		create: function(element){
 			var that = this,
 				$this = $(element),
 				allTabs =  that.settings.allTabs,
 				modalHTML = [];
 			modalHTML[0] = '<div id="myFuncardModal" class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="true">'
 				  		+'<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3 class="fl">选择功能卡</h3>'
 				  		+'<a href="'+that.settings.host+'/index.php/shangjia/cardgroup/add" class="btn btn-success fr" target="_blank" style="margin-right:20px;">新建功能卡</a><span class="btn fr refreshimgtxt">刷新</span><div class="clearfix"></div></div>'
		  				+'<div class="modal-body"><div class="tabbable tabs-left"><ul class="nav nav-tabs tabnavs"></ul><div class="tab-content tabcontent"></div></div></div>'
		  				+'<div class="modal-footer">'
		 				+'<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>'
		 				//+'<button class="btn btn-primary funcardsubmit">确定<span class="funcard_num"></span></button>'
		 				+'</div></div>';
 			modalHTML[1] = "";		
 			modalHTML[2] = "";
 			for(var i = 0;i < allTabs.length;i++){
 				modalHTML[1] += '<li data-mark="'+allTabs[i]+'"><a href="#'+allTabs[i]+'_list" data-toggle="tab">'+that.tabs_title[allTabs[i]]+'</a></li>';
 				if(allTabs.indexOf(allTabs[i]) !== -1){
 	 				modalHTML[2] += '<div class="tab-pane mycardlists" id="'+allTabs[i]+'_list"><div id="my'+allTabs[i]+'List" class="scrollbar linkbox"></div><div class="prdpagecount"></div></div>';
 	 			};
 			};
 			return modalHTML;	
 		},
 		//创建查看商品的弹层
 		creatprdmodal : function(element){
 			var that = this,
				$this = $(element),
				prdHTML = [];
 			prdHTML[0] = '<div id="mycardprdModal" class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="true">'
			  		+'<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3>当前提货卡选择的商品</h3></div>'
	  				+'<div class="modal-body"></div>'
	  				+'<div class="modal-footer">'
	 				+'<button class="btn btn-primary closecardprdmodal" data-dismiss="modal" aria-hidden="true">确定</button>'
	 				+'</div></div>';
 			return prdHTML;	
 		},
 		//渲染弹出框    显示弹出层
 		render: function(element){
 			var that = this,
 				$this = $(element),
 				modalHTML = that.create($this);
 			var len = $("body").find("#myFuncardModal").length;
        	if(len <= 0){
        		$('body').append(modalHTML[0]);
        	};
        	$("#myFuncardModal").find(".tabnavs").html(modalHTML[1]);
        	$("#myFuncardModal").find(".tabcontent").html(modalHTML[2]);
 		},
 		//显示弹出框
 		show: function(){
 			$("#myFuncardModal").modal("show");
 		},
 		//隐藏弹出框
 		hide: function(){
 			$("#myFuncardModal").modal("hide");
 		},
 		//初始化加载数据
 		initdata: function(element){
 			var that = this,
				$this = $(element),
				allTabs =  that.settings.allTabs;
 			//加载第一个列表
 			var mark = $this.attr("data-classfiy");
 			if(!mark){
 				mark = allTabs[0];
 			};
 			that.funcardlistinit(that.getfuncardlist,mark);
 			$("li[data-mark="+mark+"]").addClass("active").siblings().removeClass("active");
 			$("#"+mark+"_list").addClass("active").siblings().removeClass("active");
 		},
 		/*功能卡初始化*/
 		funcardlistinit:function(url,mark){
 			var that = this;
 			$("#myFuncardModal .prdpagecount span a").die("click");
 			that.getfuncardlistlist(1,url,mark);
 			that.ajaxpagefuncard(url,mark);
 	    },
 	   getfuncardlistlist:function(page,url,mark){
 		  var that = this;
 			$.ajax({
 				type: 'POST',
 				url: url,
 				data: {'page':page,"card_type":that.tabs_type[mark]},
 				dataType:'json',
 				beforeSend:function(){
 					$("#my"+mark+"List").html("<div class='dataloading'>加载中...</div>");
 					$("#"+mark+"_list .prdpagecount").hide();
 				},
 				success:function(json){
 					if(json.status=="40001"){
 						$("#my"+mark+"List").html("<div class='datawarn'>登陆超时，请<span class='btn-link' onclick='location.reload();'>刷新</span>页面重新登陆</div>");
 						$("#"+mark+"_list .prdpagecount").hide();
 					}else{
 						$("#my"+mark+"List").empty();
 						if(json.count == 0){
 							$("#my"+mark+"List").html("<div class='datawarn'>没有数据</div>");
 							$("#"+mark+"_list .prdpagecount").hide();
 						}else{
 							//console.log(json);
 							if(json.totalPage > 1){
 								$("#"+mark+"_list .prdpagecount").show();
 	 							that.total = json.count; //总记录数
 	 							that.pageSize = json.pagenum; //每页显示条数
 	 							that.curPage = page; //当前页
 	 							that.totalPage =json.totalPage; //总页数
 							};
 							if(mark == "prdcard"){
 								var table1 = '<table style="width:100%;"><tr><th>功能卡名称</th><th>面值</th><th>数量</th><th>有效期</th><th>已选择商品</th><th>备注</th><th width="80">操作</th></tr>';
 							}else{
 								var table1 = '<table style="width:100%;"><tr><th>功能卡名称</th> <th>积分值</th><th>数量</th><th>有效期</th><th>备注</th><th width="80">操作</th></tr>';
 							};
							var tr = "",list = json.result;
							$.each(list,function(index,array){ 
								var remark;
								if(array['group_remark']){remark = array['group_remark'];}else{remark = "无";}
								tr += '<tr data-id="'+array['group_id']+'"><td><span class="funcard_title" title="'+array['group_name']+'">'+array['group_name']+'</span></td>'
								+'<td>'+array['group_parvalue']+'</td><td>'+array['group_quantity']+'</td><td>'+array['group_valid']+'</td>';
								if(mark == "prdcard"){
									tr += '<td><a class="btn-link getcard_usedprds" data-prdids='+array['prdid']+'>查看商品</a></td>'
								};
								tr += '<td>'+remark+'</td><td><a href="javascript:void(0);" class="btn-link selfuncardbtn" data-id="'+array['group_id']+'" data-title="'+array['group_name']+'" data-value="'+array['group_parvalue']+'" '
								+'data-num="'+array['group_quantity']+'" data-type="'+array['group_type2']+'" data-prdid="'+array['prdid']+'">选择</a></td></tr>';
							});
							var table2 = '</table>';
							$("#my"+mark+"List").html(table1 + tr +table2);
 						};
 					}
 				},
 				complete:function(){ //生成分页条
 					var pageStr = that.getPageBar();
 					$("#"+mark+"_list .prdpagecount").html(pageStr);
 				},
 				error:function(){
 					$("#my"+mark+"List").html("<div class='datawarn'>数据加载失败</div>");
 					$("#"+mark+"_list .prdpagecount").hide();
 				}
 			});
 		},
 		ajaxpagefuncard:function(pageUrl,mark){
 			var that = this;
 			$("#"+mark+"_list .prdpagecount span a").live('click',function(){
 				var rel = $(this).attr("rel");
 				if(rel){
 					that.getfuncardlistlist(rel,pageUrl,mark);
 				}
 			});
 		},
 		/*获取分页*/
    	getPageBar:function(){
    		var that = this;
    		var pageStr;
    		//页码大于最大页数
    		if(that.curPage>that.totalPage) that.curPage=that.totalPage;
    		//页码小于1
    		if(that.curPage<1) that.curPage=1;
    		pageStr = "<span>共"+that.total+"条</span><span>"+that.curPage+"/"+that.totalPage+"</span>";

    		//如果是第一页
    		if(that.curPage==1){
    			pageStr += "<span>首页</span><span>上一页</span>";
    		}else{
    			pageStr += "<span><a href='javascript:void(0)' rel='1'>首页</a></span><span><a href='javascript:void(0)' rel='"+(that.curPage-1)+"'>上一页</a></span>";
    		}

    		//如果是最后页
    		if(that.curPage>=that.totalPage){
    			pageStr += "<span>下一页</span><span>尾页</span>";
    		}else{
    			pageStr += "<span><a href='javascript:void(0)' rel='"+(parseInt(that.curPage)+1)+"'>下一页</a></span><span><a href='javascript:void(0)' rel='"+that.totalPage+"'>尾页</a></span>";
    		};
    		return pageStr;
    	},
    	prdidsajax:function(ids){
    		var that = this;
    		$.ajax({
    			type: 'POST',
    			url: that.getfuncardprds,
    			data: {"ids":ids},
    			dataType:'json',
    			success:function(json){
    				var li = "";
    				for(var i = 0;i<json.length;i++){
    					li += '<li data-id="'+json[i].dataid+'" class="prdinfo"><div class="pic"><img src="'+json[i].pic+'"></div>'
							+'<div class="prd-des"><div class="prdtitle">'+json[i].title+'</div><div class="price">￥'+json[i].price+'</div></div></li>'	;
    				};
    				$("#mycardprdModal").modal("show").find(".modal-body").html('<ul class="modalprdlists">'+li+'</ul>');
    				//关闭弹层，移除弹层
    	    		$('#mycardprdModal').delegate('.closecardprdmodal','click',function(){
    	    			setTimeout(function(){$('#mycardprdModal').remove();},3000);
    	    		});
    			},
    		});
    	},
 		//(系列事件)
 		trigger: function(element,event){
 			var that = this,
 				$this = $(element);
 			//切换分类
 			$("#myFuncardModal .tabnavs").undelegate();
    		$("#myFuncardModal .tabnavs").delegate("li","click",function(){
    			var mark = $(this).attr("data-mark"),
    				len = $("#my"+mark+"List").find("table").length;
    			if(len <= 0){
    				that.funcardlistinit(that.getfuncardlist,mark);
    			};
    			$this.attr("data-classfiy",mark);
    		});
    		//刷新
    		$("#myFuncardModal .refreshimgtxt").click(function(){
    			var mark = $("#myFuncardModal").find(".tabnavs li.active").attr("data-mark");
    			that.funcardlistinit(that.getfuncardlist,mark);
    			$this.attr("data-classfiy",mark);
    		});
    		//查看已选择的商品
    		$("#myFuncardModal .mycardlists").undelegate();
    		$('#myFuncardModal .mycardlists').delegate('.getcard_usedprds','click',function(){
    			var ids = $(this).attr("data-prdids"),
    			prdHTML = that.creatprdmodal($this);
    			$('body').append(prdHTML[0]);
    			that.prdidsajax(ids);
    		});
    		
    	    //确认返回事件    
 			if($.isFunction(that.settings.backdatainfo)){
	 			$('#myFuncardModal .mycardlists').delegate('.selfuncardbtn','click',function(){
	 				var _t = $(this),
	 					id = _t.attr("data-id"),
	 					title = _t.attr("data-title"),
	 					cvalue = _t.attr("data-value"),
	 					type = _t.attr("data-type"),
	 					prdid = _t.attr("data-prdid");
	 				that.cardArray = {"id" : id,"title" :title,"value" :cvalue,"type" :type,"prdid" :prdid};
 					that.settings.backdatainfo($this,that.cardArray);
 					that.hide();
	 			});
 			};
 		}
 	};
 	var old = $.fn[pluginName];
 	$.fn[pluginName] = function(options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new SelectFunCard(this, options));			
			}
        });
		return this;
    };
    $.fn[pluginName].noConflict = function () {
        $.fn[pluginName] = old;
        return this
    };
 })(jQuery)