/*!
 * selectRedPacket 0.0.1
 * by KANGXUE
 * Copyright 2016.2
 * Date: Tus Feb 2 2016
 * 
 * 
 *	"balance" : "余额红包",
	"share" : "分享红包",
 * 
 */

 ;(function($){
 	var pluginName = 'selectRedPacket',
 		defaults = {
 			host : "",
 			allTabs : ["balance","share"],         //展示什么类型的红包，默认全部
 			backdatainfo : function(){},
 		};
 	var SelectRedPacket = function(element, options) {
 		this.element = $(element);
 		this.settings = $.extend({}, defaults, options);
        this.element.on({
             'click.selectRedPacket': $.proxy(this.init, this)
         });
         $($.proxy(function() {
             this.element.trigger('create');
         }, this));
     };
 	SelectRedPacket.prototype = {	
		tabs_title : {
			"balance" : "余额红包",
			"share" : "分享红包",
		},
		tabs_type : {
			"balance" : "1",
			"share" : "2",
		},
		rpacket_type : {
			"1" : "余额红包",
			"2" : "分享红包",
		},	
		total:"",
		pageSize:"",
		totalPage:"",
		curPage:1,
		rpacketArray:"",
		rpacketarr:[],
 		//初始化弹出框
 		init: function(){
 			var that = this,
 				element = this.element;
 			that.getrpacket= that.settings.host+"/index.php/shangjia/commoncomponent/shoprpacket";   //红包列表
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
 			modalHTML[0] = '<div id="myRpacketModal" class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="true">'
 				  		+'<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3 class="fl">选择红包</h3>'
 				  		+'<a href="'+that.settings.host+'/index.php/shangjia/activity/redbagnew" class="btn btn-success fr" target="_blank" style="margin-right:20px;">新建红包</a><span class="btn fr refreshimgtxt">刷新</span><div class="clearfix"></div></div>'
		  				+'<div class="modal-body"><div class="tabbable tabs-left"><ul class="nav nav-tabs tabnavs"></ul><div class="tab-content tabcontent"></div></div></div>'
		  				+'<div class="modal-footer">'
		 				+'<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>'
		 				+'<button class="btn btn-primary rpacketsubmit">确定<span class="rpacket_num"></span></button>'
		 				+'</div></div>';
 			modalHTML[1] = "";		
 			modalHTML[2] = "";
 			for(var i = 0;i < allTabs.length;i++){
 				modalHTML[1] += '<li data-mark="'+allTabs[i]+'"><a href="#red'+allTabs[i]+'_list" data-toggle="tab">'+that.tabs_title[allTabs[i]]+'</a></li>';
 				if(allTabs.indexOf(allTabs[i]) !== -1){
 	 				modalHTML[2] += '<div class="tab-pane myrpacketlist" id="red'+allTabs[i]+'_list"><div id="my'+allTabs[i]+'List" class="scrollbar linkbox"></div><div class="prdpagecount"></div></div>';
 	 			};
 			};
 			return modalHTML;	
 		},

 		//渲染弹出框    显示弹出层
 		render: function(element){
 			var that = this,
 				$this = $(element),
 				modalHTML = that.create($this);
 			var len = $("body").find("#myRpacketModal").length;
        	if(len <= 0){
        		$('body').append(modalHTML[0]);
        	};
        	$("#myRpacketModal").find(".tabnavs").html(modalHTML[1]);
        	$("#myRpacketModal").find(".tabcontent").html(modalHTML[2]);
 		},
 		//显示弹出框
 		show: function(){
 			$("#myRpacketModal").modal("show");
 		},
 		//隐藏弹出框
 		hide: function(){
 			$("#myRpacketModal").modal("hide");
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
			that.rpacketlistinit(that.getrpacket,mark);
			$("li[data-mark="+mark+"]").addClass("active").siblings().removeClass("active");
			$("#red"+mark+"_list").addClass("active").siblings().removeClass("active");
 		},
 		/*红包初始化*/
 		rpacketlistinit:function(url,mark){
 			var that = this;
 			$("#myRpacketModal .prdpagecount span a").die("click");
 			that.getrpacketlist(1,url,mark);
 			that.ajaxpagerpacket(url,mark);
 	    },
 	   getrpacketlist:function(page,url,mark){
 		  var that = this;
 			$.ajax({
 				type: 'POST',
 				url: url,
 				data: {'page':page,"r_type":that.tabs_type[mark],"page_size":10},
 				dataType:'json',
 				beforeSend:function(){
 					$("#my"+mark+"List").html("<div class='dataloading'>加载中...</div>");
 					$("#red"+mark+"_list .prdpagecount").hide();
 				},
 				success:function(json){
 					if(json.status=="40001"){
 						$("#my"+mark+"List").html("<div class='datawarn'>登陆超时，请<span class='btn-link' onclick='location.reload();'>刷新</span>页面重新登陆</div>");
 						$("#red"+mark+"_list .prdpagecount").hide();
 					}else{
 						$("#my"+mark+"List").empty();
 						if(json.count==0){
 							$("#my"+mark+"List").html("<div class='datawarn'>没有数据</div>");
 							$("#red"+mark+"_list .prdpagecount").hide();
 						}else{
 							if(json.totalPage > 1){
 								$("#red"+mark+"_list .prdpagecount").show();
 	 							that.total = json.count; //总记录数
 	 							that.pageSize = json.pagenum; //每页显示条数
 	 							that.curPage = page; //当前页
 	 							that.totalPage =json.totalPage; //总页数
 							};
 							var table1 = '<table style="width:100%;"><tr><th>红包名称</th><th>红包类型</th><th>红包数量</th><th>红包预算</th><th width="60">操作</th></tr>';
							var tr = "",list = json.result;
							$.each(list,function(index,array){ 
								tr += '<tr data-id="'+array['id']+'"><td><span class="rpacket_title" title="'+array['r_name']+'">'+array['r_name']+'</span></td>'
								+'<td>'+array['rtype_chinese']+'</td><td>'+array['rcount']+'</td><td>'+array['r_budget']+'</td>'
								+'<td><a href="javascript:void(0);" class="btn-link selrpacketbtn" data-id="'+array['id']+'" data-title="'+array['r_name']+'" '
								+'data-value="'+array['r_budget']+'" data-num="'+array['rcount']+'" data-type="'+array['r_type']+'" data-usetype="'+array['r_usetype']+'">选择</a></td></tr>';
							});
							var table2 = '</table>';
							$("#my"+mark+"List").html(table1 + tr +table2);
 						};
 					}
 				},
 				complete:function(){ //生成分页条
 					var pageStr = that.getPageBar();
 					$("#red"+mark+"_list .prdpagecount").html(pageStr);
 				},
 				error:function(){
 					$("#my"+mark+"List").html("<div class='datawarn'>数据加载失败</div>");
 					$("#red"+mark+"_list .prdpagecount").hide();
 				}
 			});
 		},
 		ajaxpagerpacket:function(pageUrl,mark){
 			var that = this;
 			$("#red"+mark+"_list .prdpagecount span a").live('click',function(){
 				var rel = $(this).attr("rel");
 				if(rel){
 					that.getrpacketlist(rel,pageUrl,mark);
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
 		//(系列事件)
 		trigger: function(element,event){
 			var that = this,
 				$this = $(element);
 			//切换分类
 			$("#myRpacketModal .tabnavs").undelegate();
    		$("#myRpacketModal .tabnavs").delegate("li","click",function(){
    			var mark = $(this).attr("data-mark"),
    				len = $("#my"+mark+"List").find("table").length;
    			if(len <= 0){
    				that.rpacketlistinit(that.getrpacket,mark);
    			};
    			$this.attr("data-classfiy",mark);
    		});
    		//刷新
    		$("#myRpacketModal .refreshimgtxt").click(function(){
    			var mark = $("#myRpacketModal").find(".tabnavs li.active").attr("data-mark");
    			that.rpacketlistinit(that.getrpacket,mark);
    			$this.attr("data-classfiy",mark);
    		});
    	    //确认返回事件
 			if($.isFunction(that.settings.backdatainfo)){
 				$("#myRpacketModal .myrpacketlist").undelegate();
	 			$('#myRpacketModal .myrpacketlist').delegate('.selrpacketbtn','click',function(){
	 				var _t = $(this),
	 					id = _t.attr("data-id"),
	 					title = _t.attr("data-title"),
	 					cvalue = _t.attr("data-value"),
	 					num = _t.attr("data-num"),
	 					type = _t.attr("data-type"),
	 					usetype = _t.attr("data-usetype");
	 				that.rpacketArray = {"id" : id,"title" :title,"value" :cvalue,"num" :num,"type" :type,"usetype" :usetype};
 					that.settings.backdatainfo($this,that.rpacketArray);
 					that.hide();
	 			});
 			};
 		}
 	};
 	var old = $.fn[pluginName];
 	$.fn[pluginName] = function(options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new SelectRedPacket(this, options));			
			}
        });
		return this;
    };
    $.fn[pluginName].noConflict = function () {
        $.fn[pluginName] = old;
        return this
    };
 })(jQuery)