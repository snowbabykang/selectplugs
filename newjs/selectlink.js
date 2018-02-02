/*!
 * selectLink 0.0.1
 * by KANGXUE
 * Copyright 2016.1
 * Date: Thur Jan 28 2016
 * 
 */

/**
 * 链接种类
 * 
 *  normal_link             常用连接
 *  classify_link           分类链接
 *  goods_link              商品链接
 *  magazine_link           微杂志连接
 *  local_link              本地连接
 *  agent_link              分销链接
 * 
 * */

 ;(function($){
 	var pluginName = 'selectLink',
 		defaults = {
 			host : "",
 			allTabs : ["normal_link","classify_link","goods_link","magazine_link","local_link"],     //链接种类，默认展示这些，没有展示分销的
 			magmore : "-1",          //是否多选微杂志连接，默认为-1不多选，0代表可多选不限制数量  ，其他数字代表可选的连接个数
 			backdatainfo : function(){},
 		};
 	var SelectLink = function(element, options) {
 		this.element = $(element);
 		this.settings = $.extend({}, defaults, options);
        this.element.on({
             'click.selectlink': $.proxy(this.init, this)
         });
         $($.proxy(function() {
             this.element.trigger('create');
         }, this));
     };
 	SelectLink.prototype = {	
		tabs_title : {
			"normal_link" : "常用连接",
			"classify_link" : "商品分类链接",
			"goods_link" : "商品链接",
			"magazine_link" : "微杂志连接",
			"local_link" : "自定义连接",
			"agent_link" : "分销链接",
		},
		total:"",
		pageSize:"",
		totalPage:"",
		curPage:1,
		linkarr : [],
		maglinkids : "",
 		//初始化弹出框
 		init: function(){
 			var that = this,
 				element = this.element;
 			that.postUrl = that.settings.host+"/index.php/shangjia/commoncomponent/getallprd";
 			that.getactprd = that.settings.host+"/index.php/shangjia/commoncomponent/getallprdactinfo";  //获取众筹商品
 			that.getscoreprd = that.settings.host+"/index.php/shangjia/commoncomponent/getscorechangeprds";//获取 所有  积分换购商品
 			that.noraml_linkurl = that.settings.host+"/index.php/shangjia/commoncomponent/getlinkurl";		//获取店铺的链接信息
 			that.itemList = that.settings.host+"/index.php/shangjia/commoncomponent/getcatslist";  //获取商家的父子分类连接
 			that.goodslink = that.settings.host+"/index.php/shangjia/commoncomponent/getgoodslink";		//获取分类下的商品链接
 			that.magazineurl = that.settings.host+"/index.php/shangjia/commoncomponent/getmagazineurl";  //获取商家的所有微杂志链接
 			that.agentsurl = that.settings.host+"/index.php/shangjia/commoncomponent/getfxwxmenulink";  //获取分销链接
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
 			
 			modalHTML[0] = '<div id="UrlModal" class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="true">'
 				  		+'<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3>选择链接</h3></div>'
		  				+'<div class="modal-body"><ul class="nav nav-tabs tabnavs"></ul><div class="tab-content tabcontent"></div></div>'
		 				+'<div class="modal-footer">'
		 				+'<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>'
		 				+'<button class="btn btn-primary UrlSubmitBtn">确定<span class="num"></span></button>'
		 				+'</div></div>';
 			modalHTML[1] = "";			
 			for(var i = 0;i < allTabs.length;i++){
 				modalHTML[1] += '<li data-mark="'+allTabs[i]+'"><a href="#'+allTabs[i]+'" data-toggle="tab">'+that.tabs_title[allTabs[i]]+'</a></li>';
 			};
 			modalHTML[2] = "";
 			if(allTabs.indexOf("normal_link") !== -1){
 				modalHTML[2] += '<div class="tab-pane active linkbox scrollbar" id="normal_link"></div>';
 			};
 			if(allTabs.indexOf("classify_link") !== -1){
 				modalHTML[2] += '<div class="tab-pane linkbox scrollbar" id="classify_link"></div>';
 			};
 			if(allTabs.indexOf("goods_link") !== -1){
 				modalHTML[2] += '<div class="tab-pane" id="goods_link">'
 					+'<div class="mod-searchprd" style="margin-bottom: 10px;">'
 					+'<input type="text"  placeholder="商品标题" name="prdlink_k" class="prd_k"/><button class="btn j-search">查询</button>'
 					+'</div>'
 					+'<div id="assortlist" class="fl scrollbar m-body-l"></div>'
 					+'<div class="fl m-body-c">'
 					+'<div id="prdLinklist" class="scrollbar linkbox modalprdlists"></div>'
 					+'<div class="prdpagecount"></div></div></div>';
 			};
 			if(allTabs.indexOf("magazine_link") !== -1){
 				modalHTML[2] += '<div class="tab-pane" id="magazine_link">'
 					+'<div style="margin-bottom: 10px;">'
 					+'<input type="text" placeholder="微杂志标题" name="mag_k" class="prd_k"/><button class="btn j-search">查询</button><button class="btn btn-primary fr backMaglist">返回列表</button>'
 					+'</div>'
 					+'<div id="magazineList" class="scrollbar linkbox"></div><div class="prdpagecount"></div></div>';
 			};
 			if(allTabs.indexOf("local_link") !== -1){
 				modalHTML[2] += '<div class="tab-pane" id="local_link">'
 					+'<ul><li><span><input type="text" class="locallinkadd" placeholder="请输入自定义链接" style="width:330px!important;"></span>'
 					+'<a href="javascript:void(0);" data-title="自定义链接" class="btn-link confirmgetlink diyurl">选择</a></li></ul>'
 					+'</div>';
 			};
 			if(allTabs.indexOf("agent_link") !== -1){
 				modalHTML[2] += '<div class="tab-pane linkbox scrollbar" id="agent_link"></div>';
 			};
 			return modalHTML;	
 		},

 		//渲染弹出框    显示弹出层
 		render: function(element){
 			var that = this,
 				$this = $(element),
 				modalHTML = that.create($this);
 			var len = $("body").find("#UrlModal").length;
        	if(len <= 0){
        		$('body').append(modalHTML[0]);
        	};
        	$("#UrlModal").find(".tabnavs").html(modalHTML[1]);
        	$("#UrlModal").find(".tabcontent").html(modalHTML[2]);
 		},
 		//显示弹出框
 		show: function(){
 			$("#UrlModal").modal("show");
 		},
 		//隐藏弹出框
 		hide: function(){
 			$("#UrlModal").modal("hide");
 		},
 		//初始化加载数据
 		initdata: function(element){
 			var that = this,
				$this = $(element),
				allTabs =  that.settings.allTabs;
 			$("#UrlModal .prd_k").val("");
 			if(that.settings.magmore > -1){
 				that.linkarr = [];
 				$(".UrlSubmitBtn").find(".num").html("");
 			};
 			var mark = $this.attr("data-classfiy");
 			if(!mark){
 				mark = allTabs[0];
 			};
 			//加载第一个列表
 			that.geteachlistlink(mark);
 			$("li[data-mark="+mark+"]").addClass("active").siblings().removeClass("active");
 			$("#"+mark).addClass("active").siblings().removeClass("active");
 		},
 		geteachlistlink : function(mark){
 			var that = this;
 			if(mark == "normal_link"){
 				that.getnormalLink("normal_link");
 			}else if(mark == "classify_link"){
 				that.getclassfiyLink("classify_link");
 			}else if(mark == "goods_link"){
 				that.initLinkInfo(that.postUrl+"?sale=1");
 				that.itemlist();
	 		}else if(mark == "magazine_link"){
	 			$("#magazine_link .prdpagecount span a").die("click");
	 			that.getDataLinkM(1,that.magazineurl);
	 			that.ajaxPageLink(that.magazineurl);
		 	}else if(mark == "agent_link"){
				that.getAgentLink("agent_link");
			};
 		},
 		/*获取常用链接*/
 		getnormalLink:function(){
 			var that = this;
 			$.ajax({
 				type: 'POST',
 				url: that.noraml_linkurl,
 				data: {"platform":2},
 				dataType:'json',
 				beforeSend:function(){
 					$("#normal_link.linkbox").html("<div class='dataloading'>加载中...</div>");
 				},
 				success:function(json){
 					if(json.status=="40001"){
 						$("#normal_link.linkbox").html("<div class='datawarn'>登陆超时，请<span class='btn-link' onclick='location.reload();'>刷新</span>页面重新登陆</div>");
 					}else{
 						$("#normal_link.linkbox").empty();
						var html = '<ul>'
						    +'<li><span>店铺首页链接</span><a href="javascript:void(0);" data-url="'+json.info.indexurl+'" data-title="店铺首页链接" class="btn-link confirmgetlink">选择</a></li>'
						    +'<li><span>个人中心（订单页面）</span><a href="javascript:void(0);" data-url="'+json.info.personalurl+'" data-title="个人中心（订单页面）" class="btn-link confirmgetlink">选择</a></li>'
						   	+'<li><span>购物车</span><a href="javascript:void(0);" data-url="'+json.info.shoppingurl+'" data-title="购物车" class="btn-link confirmgetlink">选择</a></li>'
						  	+'<li><span>礼品中心</span><a href="javascript:void(0);" data-url="'+json.info.giftcenterurl+'" data-title="礼品中心" class="btn-link confirmgetlink">选择</a></li>'
						 	+'<li><span>红包</span><a href="javascript:void(0);" data-url="'+json.info.redpacketurl+'" data-title="红包" class="btn-link confirmgetlink">选择</a></li>'
					 		+'<li><span>分类（分类页面）</span><a href="javascript:void(0);" data-url="'+json.info.catslistUrl+'" data-title="分类页面" class="btn-link confirmgetlink">选择</a></li>'
					 		+'<li><span>返回上一页（选择后点击可返回上一页）</span><a href="javascript:void(0);" data-url="javascript:history.go(-1);" data-title="返回上一页" class="btn-link confirmgetlink">选择</a></li>'
					 		+'</ul>';
 						$("#normal_link").html(html);
 					};
 				},
 				error:function(){
 					$("#normal_link.linkbox").html("<div class='datawarn'>数据加载失败</div>");
 				}
 			});
 		},
 		/*获取分类链接*/
 		getclassfiyLink:function(){
 			var that = this;
 			$.ajax({
 				type: 'POST',
 				url: that.itemList,
 				data: {"platform":2},
 				dataType:'json',
 				beforeSend:function(){
 					$("#classify_link.linkbox").html("<div class='dataloading'>加载中...</div>");
 				},
 				success:function(json){
 					if(json.status=="40001"){
 						$("#classify_link.linkbox").html("<div class='datawarn'>登陆超时，请<span class='btn-link' onclick='location.reload();'>刷新</span>页面重新登陆</div>");
 					}else{
 						$("#classify_link.linkbox").empty();
						var li = "",list = json.info;
						$.each(list,function(index,array){ 
							li += '<li data-id="'+array['cid']+'"><span>'+array['listname']+'</span><code>'+array['prd_count']+'</code>'
							+'<a href="javascript:void(0);" data-url="'+array['cats_link']+'" data-title="'+array['listname']+'" data-id="'+array['id']+'" class="btn-link confirmgetlink">选择</a></li>';
							if(array['sub'].length > 0){
								$.each(array['sub'],function(key,arr){
									li += '<li class="item_sub" data-id="'+arr['cid']+'"><span>'+arr['listname']+'</span><code>'+arr['prd_count']+'</code>'
									+'<a href="javascript:void(0);" data-url="'+arr['cats_link']+'" data-title="'+arr['listname']+'" data-id="'+arr['id']+'" class="btn-link confirmgetlink">选择</a></li>';
								});
							};
						});
 						$("#classify_link").html('<ul>' + li +'</ul>');
 					};
 				},
 				error:function(){
 					$("#classify_link.linkbox").html("<div class='datawarn'>数据加载失败</div>");
 				}
 			});
 		},
 		
 		/*微杂志选择链接*/
 		getDataLinkM:function(page,url){
 			var that = this;
 			$.ajax({
 				type: 'POST',
 				url: url,
 				data: {"page":page,"platform":2},
 				dataType:'json',
 				beforeSend:function(){
 					$("#magazineList.linkbox").html("<div class='dataloading'>加载中...</div>");
 					$("#magazine_link").find(".prdpagecount").hide();
 				},
 				success:function(json){
 					if(json.status=="40001"){
 						$("#magazineList.linkbox").html("<div class='datawarn'>登陆超时，请<span class='btn-link' onclick='location.reload();'>刷新</span>页面重新登陆</div>");
 						$("#magazine_link").find(".prdpagecount").hide();
 					}else{
 						$("#magazineList").empty();
 						if(json.countpage==0){
 							$("#magazineList").html("<div class='datawarn'>没有数据</div>");
 							$("#magazine_link").find(".prdpagecount").hide();
 						}else{
 							if(json.countpage > 1){
 								$("#magazine_link").find(".prdpagecount").show();
 								that.total = json.count; //总记录数
 								that.pageSize = json.pagenum; //每页显示条数
 								that.curPage = page; //当前页
 								that.totalPage =json.countpage; //总页数
 							};
 							var li = "",list = json.info;
 							$.each(list,function(index,array){
 								li += '<li data-id="'+array['id']+'"><span>'+array['title']+'</span>'
 								   +'<a href="javascript:void(0);" data-url="'+array['magurl']+'" data-title="'+array['title']+'" data-id="'+array['id']+'"';
 								if(that.settings.magmore !== "-1"){
 									li += ' class="btn-link confirm_morelink">选择</a></li>';
 								}else{
 									li += ' class="btn-link confirmgetlink">选择</a></li>';
 								};
 							});
 							$("#magazineList").html('<ul>' + li +'</ul>');
 							var keywd = $("#magazine_link .prd_k").val();
    						keywd = $.trim(keywd);
 							that.hilightEle("#magazineList",keywd);
 							//如果是多选
 							if(that.settings.magmore > -1){
 								var aLen=that.linkarr.length;
 								if(aLen>0){
 									for(var i=0;i<aLen;i++)	{
 										var id = that.linkarr[i]['id'];
 										$("#magazineList").find("li").each(function(){
 											var allid = $(this).attr("data-id");
 											if(id == allid){
 												$(this).find("a").attr("data-select","1").html("取消选择");
 											};
 										});
 									};
 								};
 							};
 						}
 					}
 				},
 				complete:function(){ //生成分页条
 					var pageStr = that.getPageBar();
 					$("#magazine_link .prdpagecount").html(pageStr);
 				},
 				error:function(){
 					$("#magazineList.linkbox").html("<div class='datawarn'>数据加载失败</div>");
 					$("#magazine_link").find(".prdpagecount").hide();
 				}
 			});
 		},
 		/*自定义微杂志分页*/
 		ajaxPageLink:function(url){
 			var that = this;
 			$("#magazine_link .prdpagecount span a").live('click',function(){
 				var rel = $(this).attr("rel");
 				if(rel){
 					that.getDataLinkM(rel,url);
 				}
 			});
 		},
 		/*获取父子分类*/
    	itemlist:function(){
    		var that = this;
    		var len = $("#assortlist").find("li").length;
    		if(len <= 0){
	    		$.ajax({
	    			type: 'POST',
	    			url: that.itemList,
	    			data: {'platform':2,'sale':that.onsale},
	    			dataType:'json',
	    			async:false,
	    			beforeSend:function(){
	    				$("#assortlist").append("<div id='loading'>加载中...</div>");
	    			},
	    			success:function(json){
	    				var li = "",html = "";
						var list = json.info;
						$.each(list,function(index,array){ //遍历json数据列
							li += '<li data-cid="'+array['cid']+'" data-id="'+array['id']+'" data-show="'+array['visible']+'">'+array['listname']+'<code>'+array['prd_count']+'</code></li>';
							if(array['sub'].length > 0){
								$.each(array['sub'],function(key,arr){
									li += '<li class="item_sub" data-cid="'+arr['cid']+'" data-id="'+arr['id']+'" data-show="'+arr['visible']+'">'+arr['listname']+'<code>'+arr['prd_count']+'</code></li>';
								});
							};
				 		});
						html = '<ul>'
	    					+'<li data-cid="0" data-id="0" data-show="0" class="active">所有分类</li>'
	    					+'<li data-cid="zc" data-id="0" data-show="0" data-act="zc">众筹商品</li>'
	    					+'<li data-cid="jf" data-id="0" data-show="0" data-act="jf">积分换购商品</li>'
	    					+ li +'</ul>';
						$("#assortlist").html(html);
	    			},
	    		});
    		};
    	},
 		/*商品选择链接*/
 		getDataLinkP:function(page,url){
 			var that = this;
 			$.ajax({
 				type: 'POST',
 				url: url,
 				data: {'page':page,"platform":2},
 				dataType:'json',
 				beforeSend:function(){
 					$("#goods_link .linkbox").html("<div class='dataloading'>加载中...</div>");
 					$("#goods_link .prdpagecount").hide();
 				},
 				success:function(json){
 					if(json.status=="40001"){
 						$("#goods_link .linkbox").html("<div class='datawarn'>登陆超时，请<span class='btn-link' onclick='location.reload();'>刷新</span>页面重新登陆</div>");
 						$("#goods_link .prdpagecount").hide();
 					}else{
 						$("#prdLinklist").empty();
 						if(json.count==0){
 							$("#goods_link .linkbox").html("<div class='datawarn'>没有数据</div>");
 							$("#goods_link .prdpagecount").hide();
 						}else{
 							if(url !== that.getactprd && url !== that.getscoreprd && json.countpage > 1){
 								$("#goods_link .prdpagecount").show();
 								that.total = json.count; //总记录数
 								that.pageSize = json.pagenum; //每页显示条数
 								that.curPage = page; //当前页
 								that.totalPage =json.countpage; //总页数
 							}else{
 								$("#goods_link .prdpagecount").html('<div id="pagecount"><span>共'+json.count+'条数据</span></div>');
 							};
 							var li = "";
    						var list = json.info;
    						$.each(list,function(index,array){ //遍历json数据列
    							var tags = '';
    							if(array['approve_status'] == "onsale"){
									tags += '<span class="label label-warning c_onsale">销售中</span>';
								}else{
									tags += '<span class="label">已下架</span>';
								};
    							li += '<li data-id="'+array['id']+'" id="a'+array['id']+'">'
    								+'<a href="javascript:void(0);" class="prdinfo">'
									+'<div class="pic"><img src="'+array['pic_url']+'_180x180.jpg"/></div>'
    							    +'<div class="prd-des"><p class="title">'+array['title']+'</p><div>'
    							    +'<p class="price fl" price="'+array['price']+'">￥'+array['price']+'</p>'
    							    +'<div class="fr">'+tags+'</div><div class="clearfix"></div></div></div>'
    							    +'<div class="confirmgetlink" data-url="'+array['prd_url']+'" data-title="'+array['title']+'" data-id="'+array['id']+'"><span class="btn">选择</span></div></a></li>';
    						});
    						$("#prdLinklist").html("<ul>"+li+"</ul>");
    						var keywd = $("#goods_link .prd_k").val();
    						keywd = $.trim(keywd);
    						that.hilightEle("#prdLinklist",keywd);
 						};
 					}
 				},
 				complete:function(){ //生成分页条
 					if(url !== that.getactprd && url !== that.getscoreprd){
 						var pageStr = that.getPageBar();
 						$("#goods_link .prdpagecount").html(pageStr);
 					}
 				},
 				error:function(){
 					$("#prdLinklist").html("<div class='datawarn'>数据加载失败</div>");
    				$("#goods_link .prdpagecount").hide();
 				}
 			});
 		},
 		/*商品链接初始化*/
 		initLinkInfo:function(url){
 			var that = this;
   			$("#goods_link .prdpagecount span a").die("click");
 			that.getDataLinkP(1,url);
 			that.PagePrdLink(url);
 		},
 		PagePrdLink:function(pageUrl){
 			var that = this;
 			$("#goods_link .prdpagecount span a").live('click',function(){
 				var rel = $(this).attr("rel");
 				if(rel){
 					that.getDataLinkP(rel,pageUrl);
 				}
 			});
 		},
 		/*选择分销链接*/
 		getAgentLink:function(){
 			var that = this;
 			$.ajax({
 				type: 'POST',
 				url: that.agentsurl,
 				dataType:'json',
 				beforeSend:function(){
 					$("#agent_link.linkbox").html("<div class='dataloading'>加载中...</div>");
 				},
 				success:function(json){
 					if(json.code=="0"){
 						$("#agent_link.linkbox").empty();
	 					var li = "",list = json.data;
						$.each(list,function(index,array){ 
							li += '<li><span>'+array['title']+'</span><a href="javascript:void(0);" data-title="'+array['title']+'" data-url="'+array['link']+'" class="btn-link confirmgetlink">选择</a></li>';
						});
						$("#agent_link").html('<ul>' + li +'</ul>');
 					};
 				},
 				error:function(){
 					$("#agent_link.linkbox").html("<div class='datawarn'>数据加载失败</div>");
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
				type = cur.attr("name");
    		if($.trim(keywd)==""){
				alert("查询条件不能为空");
				return false;
			}else{
				keywd = $.trim(keywd);
    			if(type == "mag_k"){
    				var k_url=that.magazineurl+"?title="+encodeURIComponent(keywd);
    				$("#magazine_link .prdpagecount span a").die("click");
    				that.getDataLinkM(1,k_url);
    				that.ajaxPageLink(k_url);
    			}else if(type == "prdlink_k"){
    				var cid = $("#assortlist").find("li.active").attr("data-cid");
    				if(cid==0){
    					var k_url=that.postUrl+"?title="+encodeURIComponent(keywd)+"&sale=1";
     	    		}else{
     	    			var k_url=that.classifyprd+"?classifyid="+cid+"&title="+encodeURIComponent(keywd)+"&sale=1";
     	    		};
    				that.initLinkInfo(k_url);
    			};
    		};
    	},
    	showsearchbox : function(){
 			$("#goods_link .mod-searchprd").find(".prd_k").removeAttr("disabled");
 			$("#goods_link .mod-searchprd").find(".j-search").removeClass("disabled");
 		},
 		hidesearchbox : function(){
 			$("#goods_link .mod-searchprd").find(".prd_k").attr("disabled","disabled");
 			$("#goods_link .mod-searchprd").find(".j-search").addClass("disabled");
 		},
    	attrIndexOf:function(target, list, attr) {
    	    var i = 0, l = list.length;
    	    for (i = 0; i < l; i += 1) {
    	        if (list[i][attr] == target) {
    	            return i;
    	        }
    	    };
    	    return -1;
    	},
    	removeItem:function(ObjArr,id,did) {
    		var that = this;
    	    var pos = that.attrIndexOf(id, ObjArr, did);
    	    if (pos !== -1) {
    	    	ObjArr.splice(pos, 1);
    	    };
    	},
 		//(系列事件)
 		trigger: function(element,event){
 			var that = this,
 				$this = $(element);
 			
 			//切换分类
 			$("#UrlModal .tabnavs").undelegate();
    		$("#UrlModal .tabnavs").delegate("li","click",function(){
    			var mark = $(this).attr("data-mark"),
    				len = $("#"+mark).find("li").length;
    			if(len <= 0 && mark !== 'local_link'){
    				that.geteachlistlink(mark);
    			};
    			$this.attr("data-classfiy",mark);
    		});
    		//点击分类
 			$("#assortlist").undelegate();
			$("#assortlist").delegate("li","click",function(e){
 				var _t = $(this),
 	        		cid=_t.attr("data-cid");
 	    		that.classfiyid = cid;
 	    		if(cid==0){
 	    			that.showsearchbox();
 	    			that.initLinkInfo(that.postUrl+"?sale=1");
 	    		}else if(cid=="zc"){
 	    			that.hidesearchbox();
 	    			that.getDataLinkP("",that.getactprd);
 	    		}else if(cid=="jf"){
 	    			that.hidesearchbox();
 	    			that.getDataLinkP("",that.getscoreprd);
 	    		}else{
 	    			that.showsearchbox();
 	    			var c_url=that.goodslink+"?classifyid="+cid+"&sale=1";
 	    			that.initLinkInfo(c_url);
 	    		};
 	    		_t.parent().children("li").removeClass("active");//将所有选项置为未选中
 	    		_t.addClass("active");
 			});
			//返回微杂志列表
			$("#magazine_link").undelegate();
			$("#magazine_link").delegate(".backMaglist","click",function(){
				that.geteachlistlink("magazine_link");
			});
    		//搜索
    		$("#UrlModal .j-search").die();
    		$("#UrlModal .j-search").click(function(){
    			var cur = $(this).prev(".prd_k");
    			if(!$(this).hasClass("disabled")){
    				that.execSearch(cur);
    			};
    		});
    		$('.prd_k').live('keyup change', function(event) {
    	        var searchTerm = $(this).val(),
    	        	searchTerm = $.trim(searchTerm),
    	        	name = $(this).attr("name");
    	        if(searchTerm){
    	        	if(name == "mag_k"){
    	        		that.hilightEle("#magazineList",searchTerm);
    	        	}else if(name == "prdlink_k"){
    	        		that.hilightEle("#prdLinklist",searchTerm);
    	        	};
    	        };
    			if(event.keyCode ==13){
    				that.execSearch($(this));
    			}
    	    });
    		$('.locallinkadd').live('keyup change', function(event) {
    			var url = $(this).val();
    			url = $.trim(url);
    			if(url){
    				$(this).parent().next().attr("data-url",url);
    			};
    		});
    	    //确认返回事件
 			if($.isFunction(that.settings.backdatainfo)){
 				$("#UrlModal .tabcontent").undelegate();
	 			$('#UrlModal .tabcontent').delegate('.confirmgetlink','click',function(){
	 				var id = $(this).attr("data-id"),
	 					title = $(this).attr("data-title"),
	 					url = $(this).attr("data-url");
	 				if(id){id = id;}else{id = "";}
	 				if(title){title = title;}else{title = "";}
	 				if(url){url = url;}else{url = "";}
	 				if($(this).hasClass("diyurl")){
	 					if(url == ""){
	 						alert("请输入正确的连接");
	 						$(this).prev().find("input").focus();
	 						return false;
	 					};
	 					var link = url.match(/^(http|https):\/\/.+/);
	 					if (link == null){
	 						alert('您输入的链接无效，请重新输入');
	 						$(this).prev().find("input").focus();
	 						return false;
	 					};
	 				};
	 				if(id){id = id;}else{id = "";}
	 				var obj_url = {id:id,title:title,url:url};
	 				that.settings.backdatainfo($this,obj_url);
	 				that.hide();
	 			});
	 			var linknum = 0;
	 			$('#UrlModal .tabcontent').delegate('.confirm_morelink','click',function(){
	 				var id = $(this).attr("data-id"),
	 				title = $(this).attr("data-title"),
	 				url = $(this).attr("data-url");
	 				if(id){id = id;}else{id = "";}
	 				if(title){title = title;}else{title = "";}
	 				if(url){url = url;}else{url = "";}
	 				var obj_url = {id:id,title:title,url:url};
	 				if($(this).attr("data-select") == "1"){
	 					that.removeItem(that.linkarr,id,"id");
	 					$(this).attr("data-select","0").html("选择");
	 					linknum -= 1;
	 				}else{
	 					if(parseInt(linknum) == parseInt(that.settings.magmore) && parseInt(that.settings.magmore) > 0){
		 					alert("只能选择"+that.settings.magmore+"条连接");
		 					return false;
		 				}else{
		 					that.linkarr.push(obj_url);
		 					$(this).attr("data-select","1").html("取消选择");
		 					linknum += 1;
		 				}
	 					
	 				};
	 				$(".UrlSubmitBtn").find(".num").html("("+linknum+")");
	 			});
	 			if(that.settings.magmore > -1){
	 				$("#UrlModal .modal-footer").undelegate();
 					$("#UrlModal .modal-footer").delegate('.UrlSubmitBtn','click',function(){
 						var ids = "";
 		 				for(var i=0;i<that.linkarr.length;i++){
 		 					ids += that.linkarr[i].id + ',';
 		 				};
 		 				ids=ids.substring(0,ids.length-1);
 		 				that.maglinkids = ids;
 						$this.attr("data-arr",that.maglinkids);
 						that.settings.backdatainfo($this,that.linkarr);
 		 				that.hide();
 					});
 				};
 			};
 		}
 	};
 	var old = $.fn[pluginName];
 	$.fn[pluginName] = function(options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new SelectLink(this, options));			
			}
        });
		return this;
    };
    $.fn[pluginName].noConflict = function () {
        $.fn[pluginName] = old;
        return this
    };
 })(jQuery)