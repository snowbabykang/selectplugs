/*!
 * selectForm 0.0.1
 * by KANGXUE
 * Copyright 2016.2
 * Date: Mon Feb 1 2016
 * 
 * 
 */

 ;(function($){
 	var pluginName = 'selectForm',
 		defaults = {
 			host : "",
 			backdatainfo : function(){},
 		};
 	var SelectForm = function(element, options) {
 		this.element = $(element);
 		this.settings = $.extend({}, defaults, options);
        this.element.on({
             'click.selectForm': $.proxy(this.init, this)
         });
         $($.proxy(function() {
             this.element.trigger('create');
         }, this));
     };
 	SelectForm.prototype = {	
		total:"",
		pageSize:"",
		totalPage:"",
		curPage:1,
 		//初始化弹出框
 		init: function(){
 			var that = this,
 				element = this.element;
 			that.getallform= that.settings.host+"/index.php/shangjia/commoncomponent/getforminfo";   //获取万能表单列表
 			that.previewform=that.settings.host+"/index.php/shangjia/diypage/previewdiyform"; //获取万能表单内容
 			that.render(element);
 			that.initdata(element);
 			that.show();
 			that.trigger(element);
 		},

 		//创建弹出框
 		create: function(element){
 			var that = this,
 				$this = $(element),
 				modalHTML = [];
 			
 			modalHTML[0] = '<div id="MyFromModal" class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="true">'
 				  		+'<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3>选择表单</h3>'
 				  		+'<input type="text"  placeholder="万能表单标题" name="form_k" class="prd_k"/><button class="btn j-search">查询</button>'
 				  		+'<a href="'+that.settings.host+'/index.php/shangjia/diypage/newform" class="btn btn-success fr" target="_blank">新建万能表单</a><span class="btn fr refreshimgtxt">刷新</span></div>'
		  				+'<div class="modal-body"><div class="scrollbar linkbox" id="myformlist"></div><div class="prdpagecount"></div></div>'
		 				+'<div class="modal-footer">'
		 				+'<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>'
		 				+'<button class="btn btn-primary formsubmit">确定</button>'
		 				+'</div></div>';
 			return modalHTML;	
 		},

 		//渲染弹出框    显示弹出层
 		render: function(element){
 			var that = this,
 				$this = $(element),
 				modalHTML = that.create($this);
 			var len = $("body").find("#MyFromModal").length;
        	if(len <= 0){
        		$('body').append(modalHTML[0]);
        	};
 		},
 		//显示弹出框
 		show: function(){
 			$("#MyFromModal").modal("show");
 		},
 		//隐藏弹出框
 		hide: function(){
 			$("#MyFromModal").modal("hide");
 		},
 		//初始化加载数据
 		initdata: function(element){
 			var that = this,
				$this = $(element);
 			$("#MyFromModal .prd_k").val("");
 			that.formlistinit(that.getallform);
 		},
 		/*万能表单初始化*/
 		formlistinit:function(url){
 			var that = this;
 			$("#MyFromModal .prdpagecount span a").die("click");
 			that.getformlist(1,url);
 			that.ajaxpageform(url);
 	    },
 	   getformlist:function(page,url){
 		  var that = this;
 			$.ajax({
 				type: 'POST',
 				url: url,
 				data: {'page':page},
 				dataType:'json',
 				beforeSend:function(){
 					$("#myformlist").html("<div class='dataloading'>加载中...</div>");
 					$("#MyFromModal .prdpagecount").hide();
 				},
 				success:function(json){
 					if(json.status=="40001"){
 						$("#myformlist").html("<div class='datawarn'>登陆超时，请<span class='btn-link' onclick='location.reload();'>刷新</span>页面重新登陆</div>");
 						$("#MyFromModal .prdpagecount").hide();
 					}else{
 						$("#myformlist").empty();
 						if(json.countpage==0){
 							$("#myformlist").html("<div class='datawarn'>没有数据</div>");
 							$("#MyFromModal .prdpagecount").hide();
 						}else{
 							if(json.countpage > 1){
 								$("#MyFromModal .prdpagecount").show();
 	 							that.total = json.count; //总记录数
 	 							that.pageSize = json.pagenum; //每页显示条数
 	 							that.curPage = page; //当前页
 	 							that.totalPage =json.countpage; //总页数
 							};
 							var table1 = '<table style="width:100%;"><tr><th>名称</th><th width="35%">创建时间</th><th width="20%">操作</th></tr>';
							var tr = "",list = json.info;
							$.each(list,function(index,array){ 
								tr += '<tr data-id="'+array['id']+'"><td><span class="from_title" title="'+array['name']+'">'+array['name']+'</span></td>'
								+'<td>'+array['creat_time']+'</td>'
								+'<td><a href="javascript:void(0);" class="btn-link selformbtn" data-id="'+array['id']+'" data-title="'+array['name']+'" data-url="'+array['redirect_url']+'">选择</a></td></tr>';
							});
							var table2 = '</table>';
							$("#myformlist").html(table1 + tr +table2);
 							var keywd = $("#MyFromModal .prd_k").val();
    						keywd = $.trim(keywd);
    						that.hilightEle("#myformlist",keywd);
 						};
 					}
 				},
 				complete:function(){ //生成分页条
 					var pageStr = that.getPageBar();
 					$("#MyFromModal .prdpagecount").html(pageStr);
 				},
 				error:function(){
 					$("#myformlist").html("<div class='datawarn'>数据加载失败</div>");
 					$("#MyFromModal .prdpagecount").hide();
 				}
 			});
 		},
 		ajaxpageform:function(pageUrl){
 			var that = this;
 			$("#MyFromModal .prdpagecount span a").live('click',function(){
 				var rel = $(this).attr("rel");
 				if(rel){
 					that.getformlist(rel,pageUrl);
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
    	/*高亮显示*/
    	hilightEle:function(ele,words){
    		var that = this;
    		$(ele).removeHighlight();// 如果为空则清除hilight
    		if (words) {
    			$(ele).highlight(words);
    		}
    	},
    	execSearch:function(cur){
    		var that = this,
				keywd=cur.val();
    		if($.trim(keywd)==""){
				alert("查询条件不能为空");
				return false;
			}else{
				keywd = $.trim(keywd);
				var url = that.getallform+"?title="+encodeURIComponent(keywd);
				that.formlistinit(url);
    		};
    	},
 		//(系列事件)
 		trigger: function(element,event){
 			var that = this,
 				$this = $(element);
 			
    		//刷新
    		$(".refreshimgtxt").click(function(){
    			that.formlistinit(that.getallform);
    		});
    		//搜索
    		$("#MyFromModal .j-search").die();
    		$("#MyFromModal .j-search").click(function(){
    			var cur = $(this).prev(".prd_k");
				that.execSearch(cur);
    		});
    		$('.prd_k').live('keyup change', function(event) {
    	        var searchTerm = $(this).val(),
    	        	searchTerm = $.trim(searchTerm);
    	        if(searchTerm){
	        		that.hilightEle("#myformlist",searchTerm);
    	        };
    			if(event.keyCode ==13){
    				that.execSearch($(this));
    			}
    	    });
    	    //确认返回事件
 			if($.isFunction(that.settings.backdatainfo)){
 				$("#MyFromModal #myformlist").undelegate();
	 			$('#MyFromModal #myformlist').delegate('.selformbtn','click',function(){
	 				var id = $(this).attr("data-id"),
	 					title = $(this).attr("data-title"),
	 					url = $(this).attr("data-url");
	 				var obj = {id:id,title:title,url:url};
	 				$.ajax({
	 					 type: "POST",
	 					   url: that.previewform,
	 					   data: {'id':id,"t":1},
	 					   success: function(msg){
	 						   that.settings.backdatainfo($this,obj,msg);
	 			 			   that.hide();
	 					   }
	 				 });
	 				
	 			});
 			};
 		}
 	};
 	var old = $.fn[pluginName];
 	$.fn[pluginName] = function(options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new SelectForm(this, options));			
			}
        });
		return this;
    };
    $.fn[pluginName].noConflict = function () {
        $.fn[pluginName] = old;
        return this
    };
 })(jQuery)