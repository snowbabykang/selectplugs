/*!
 * selectImgTxt 0.0.1
 * by KANGXUE
 * Copyright 2016.1
 * Date: Thur Jan 30 2016
 * 

 * 
 */

/**
 * 图文种类
 * 
 *  single             单图文
 *  double             多图文
 *  text               文字消息
 *  voice              语音消息
 * 
 * */

 ;(function($){
 	var pluginName = 'selectImgTxt',
 		defaults = {
 			host : "",
 			isbackimgtxt : 0,      //是否返回当前选中图文的详细内容   默认为0 不显示， 1则显示
 			allTabs : ["single","double","text","voice"],     //图文种类，默认展示全部
 			backdatainfo : function(){},
 		};
 	var SelectImgTxt = function(element, options) {
 		this.element = $(element);
 		this.settings = $.extend({}, defaults, options);
        this.element.on({
             'click.selectImgTxt': $.proxy(this.init, this)
         });
         $($.proxy(function() {
             this.element.trigger('create');
         }, this));
     };
 	SelectImgTxt.prototype = {	
		tabs_title : {
			"single" : "单图文",
			"double" : "多图文",
			"text" : "文字消息",
			"voice" : "语音消息",
		},
		tabs_type : {
			"single" : "2",
			"double" : "3",
			"text" : "1",
			"voice" : "5",
		},
		imgtxt_type : {
			"2" : "单图文",
			"3" : "多图文",
			"1" : "文字消息",
			"5" : "语音消息",
		},
		total:"",
		pageSize:"",
		totalPage:"",
		curPage:1,
 		//初始化弹出框
 		init: function(){
 			var that = this,
 				element = this.element;
 			that.getpicnews= that.settings.host+"/index.php/shangjia/commoncomponent/getpicnews";   //获取图文素材
 			that.getwxreply= that.settings.host+"/index.php/shangjia/catslist/wxreplaydisplay";   //获取图文内容
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
 			
 			modalHTML[0] = '<div id="ImgtxtModal" class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="true">'
 				  		+'<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3>选择图文素材</h3>'
 				  		+'<input type="text"  placeholder="图文素材标题" name="imgtxt_k" class="prd_k"/><button class="btn j-search">查询</button>'
 				  		+'<a href="'+that.settings.host+'/index.php/shangjia/account/wxauto" class="btn btn-success fr" target="_blank">新建图文</a><span class="btn fr refreshimgtxt">刷新</span></div>'
		  				+'<div class="modal-body"><div class="tabbable tabs-left"><ul class="nav nav-tabs tabnavs"></ul><div class="tab-content tabcontent"></div></div></div>'
		 				+'<div class="modal-footer">'
		 				+'<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>'
		 				+'<button class="btn btn-primary imgtxtSubmitBtn">确定<span class="num"></span></button>'
		 				+'</div></div>';
 			modalHTML[1] = "";		
 			modalHTML[2] = "";
 			for(var i = 0;i < allTabs.length;i++){
 				modalHTML[1] += '<li data-mark="'+allTabs[i]+'"><a href="#'+allTabs[i]+'_imgtxt" data-toggle="tab">'+that.tabs_title[allTabs[i]]+'</a></li>';
 				if(allTabs.indexOf(allTabs[i]) !== -1){
 	 				modalHTML[2] += '<div class="tab-pane imgtxtlists" id="'+allTabs[i]+'_imgtxt"><div id="'+allTabs[i]+'List" class="scrollbar linkbox"></div><div class="prdpagecount"></div></div>';
 	 			};
 			};
 			return modalHTML;	
 		},

 		//渲染弹出框    显示弹出层
 		render: function(element){
 			var that = this,
 				$this = $(element),
 				modalHTML = that.create($this);
 			var len = $("body").find("#ImgtxtModal").length;
        	if(len <= 0){
        		$('body').append(modalHTML[0]);
        	};
        	$("#ImgtxtModal").find(".tabnavs").html(modalHTML[1]);
        	$("#ImgtxtModal").find(".tabcontent").html(modalHTML[2]);
 		},
 		//显示弹出框
 		show: function(){
 			$("#ImgtxtModal").modal("show");
 		},
 		//隐藏弹出框
 		hide: function(){
 			$("#ImgtxtModal").modal("hide");
 		},
 		//初始化加载数据
 		initdata: function(element){
 			var that = this,
				$this = $(element),
				allTabs =  that.settings.allTabs;
 			$("#ImgtxtModal .prd_k").val("");
 			var mark = $this.attr("data-classfiy");
 			if(!mark){
 				mark = allTabs[0];
 			};
 			//加载第一个列表
 			that.imgtxtinit(that.getpicnews,mark);
 			$("li[data-mark="+mark+"]").addClass("active").siblings().removeClass("active");
 			$("#"+mark+"_imgtxt").addClass("active").siblings().removeClass("active");
 		},
 		/*图文素材初始化*/
 		imgtxtinit:function(url,mark){
 			var that = this;
 			$("#"+mark+"_imgtxt .prdpagecount span a").die("click");
 			that.getimgtxt(1,url,mark);
 			that.ajaxpageimgtxt(url,mark);
 		},
 		getimgtxt:function(page,url,mark){
 			var that = this;
 			$.ajax({
 				type: 'POST',
 				url: url,
 				data: {'page':page,'type':that.tabs_type[mark]},
 				dataType:'json',
 				beforeSend:function(){
 					$("#"+mark+"List.linkbox").html("<div class='dataloading'>加载中...</div>");
 					$("#"+mark+"_imgtxt .prdpagecount").hide();
 				},
 				success:function(json){
 					//return false;
 					if(json.status=="40001"){
 						$("#"+mark+"List.linkbox").html("<div class='datawarn'>登陆超时，请<span class='btn-link' onclick='location.reload();'>刷新</span>页面重新登陆</div>");
 						$("#"+mark+"_imgtxt .prdpagecount").hide();
 					}else{
 						$("#"+mark+"List.linkbox").empty();
 						if(json.countpage==0){
 							$("#"+mark+"List.linkbox").html("<div class='datawarn'>没有数据</div>");
 							$("#"+mark+"_imgtxt .prdpagecount").hide();
 						}else{
 							if(json.countpage > 1){
 								$("#"+mark+"_imgtxt .prdpagecount").show();
 								that.total = json.count; //总记录数
 								that.pageSize = json.pagenum; //每页显示条数
 								that.curPage = page; //当前页
 								that.totalPage =json.countpage; //总页数
 							};
							var table1 = '<table style="width:100%;"><tr><th>名称</th><th width="35%">创建时间</th><th width="20%">操作</th></tr>';
							var tr = "",list = json.info;
							$.each(list,function(index,array){ 
								tr += '<tr data-id="'+array['id']+'"><td><span class="imgtxt_title" title="'+array['title']+'">'+array['title']+'</span></td>'
								+'<td>'+array['creat_time']+'</td>'
								+'<td><a href="javascript:void(0);" class="btn-link selimgtxtbtn" data-id="'+array['id']+'" data-title="'+array['title']+'" data-type="'+array['type']+'">选择</a></td></tr>';
							});
							var table2 = '</table>';
							$("#"+mark+"List").html(table1 + tr +table2);
 							var keywd = $("#ImgtxtModal .prd_k").val();
    						keywd = $.trim(keywd);
    						that.hilightEle("#"+mark+"List",keywd);
 						};
 					};
 				},
 				complete:function(){ //生成分页条
 					var pageStr = that.getPageBar();
 					$("#"+mark+"_imgtxt .prdpagecount").html(pageStr);
 				},
 				error:function(){
 					$("#"+mark+"List.linkbox").html("<div class='datawarn'>数据加载失败</div>");
 					$("#"+mark+"_imgtxt .prdpagecount").hide();
 				}
 			});
 		},
 		ajaxpageimgtxt:function(pageUrl,mark){
 			var that = this;
 			$("#"+mark+"_imgtxt .prdpagecount span a").live('click',function(){
 				var rel = $(this).attr("rel");
 				if(rel){
 					that.getimgtxt(rel,pageUrl,mark);
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
				keywd=cur.val(),
				mark = $("#ImgtxtModal").find(".tabnavs li.active").attr("data-mark");
    		if($.trim(keywd)==""){
				alert("查询条件不能为空");
				return false;
			}else{
				keywd = $.trim(keywd);
				var url=that.getpicnews+"?title="+encodeURIComponent(keywd);
				that.imgtxtinit(url,mark);
    		};
    	},
 		//(系列事件)
 		trigger: function(element,event){
 			var that = this,
 				$this = $(element);
 			
 			//切换分类
 			$("#ImgtxtModal .tabnavs").undelegate();
    		$("#ImgtxtModal .tabnavs").delegate("li","click",function(){
    			var mark = $(this).attr("data-mark"),
    				len = $("#"+mark+"List").find("table").length;
    			if(len <= 0){
    				that.imgtxtinit(that.getpicnews,mark);
    			};
    			$this.attr("data-classfiy",mark);
    		});
    		//刷新
    		$(".refreshimgtxt").click(function(){
    			var mark = $("#ImgtxtModal").find(".tabnavs li.active").attr("data-mark");
    			that.imgtxtinit(that.getpicnews,mark);
    			$this.attr("data-classfiy",mark);
    		});
    		//搜索
    		$("#ImgtxtModal .j-search").die();
    		$("#ImgtxtModal .j-search").click(function(){
    			var cur = $(this).prev(".prd_k");
				that.execSearch(cur);
    		});
    		$('.prd_k').live('keyup change', function(event) {
    	        var searchTerm = $(this).val(),
    	        	searchTerm = $.trim(searchTerm),
    	        	mark = $("#ImgtxtModal").find(".tabnavs li.active").attr("data-mark");
    	        if(searchTerm){
	        		that.hilightEle("#"+mark+"List",searchTerm);
    	        };
    			if(event.keyCode ==13){
    				that.execSearch($(this));
    			}
    	    });
    	    //确认返回事件
 			if($.isFunction(that.settings.backdatainfo)){
 				$("#ImgtxtModal .tabcontent").undelegate();
	 			$('#ImgtxtModal .tabcontent').delegate('.selimgtxtbtn','click',function(){
	 				var id = $(this).attr("data-id"),
	 					title = $(this).attr("data-title"),
	 					type = $(this).attr("data-type"),
	 					typeinfo = that.imgtxt_type[type];
	 				var obj = {id:id,title:title,type:type,typeinfo:typeinfo};
	 				if(that.settings.isbackimgtxt == 1){
	 					$.ajax({
	 						 type: "POST",
	 						   url: that.getwxreply,
	 						   data: {'id':id},
	 						   success: function(msg){
	 							  //$(".auto_right").html(msg);
	 							  that.settings.backdatainfo($this,obj,msg);
	 						   }
	 					 });
	 				}else{
	 					that.settings.backdatainfo($this,obj);
	 				};
	 				that.hide();
	 			});
 			};
 		}
 	};
 	var old = $.fn[pluginName];
 	$.fn[pluginName] = function(options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new SelectImgTxt(this, options));			
			}
        });
		return this;
    };
    $.fn[pluginName].noConflict = function () {
        $.fn[pluginName] = old;
        return this
    };
 })(jQuery)