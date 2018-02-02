/*!
 * selectPrds 0.0.1
 * by KANGXUE
 * Copyright 2016.1
 * Date: Thur Jan 28 2016
 */

 ;(function($){
	 /**
	     * 插件默认配置项
	     * @type {{}}
	     * 
	     * prdnum ： 选择商品数量       0代表无数件     
	     * notEle ： 不能选择的商品的活动组成的数组     
	     * presell        ——>预售
	     * fans_special   ——>粉丝特价
	     * commonactivity ——>微团购
	     * full_postage   ——>满多少元包邮
	     * fullreduced    ——>满减现金
	     * groupbuy       ——>组团购
	     * zcset          ——>众筹
	     * prd_card       ——>提货卡
	     * coupon         ——>优惠券
	     * credit_cash    ——>积分抵现
	     * credit_exchange——>积分换购
	     * 
	     */
 	var pluginName = 'selectPrds',
 		defaults = {
 			host : "",
 			sel : "1",       //1 上架商品           2 下架商品      3不限
 	        prdnum: "0",     //选择的商品数量
 	        notEle: [],      //与哪些活动互斥（默认所有商品都可以选择）
 	        alltag : ["presell","fans_special","commonactivity","full_postage","fullreduced","groupbuy","zcset","prd_card","coupon","credit_exchange","credit_exchange"],    //显示哪些商品标签，默认全部显示
 	        hasonsale : "1", //是否显示销售中与已下架的标签         0不显示
 	        community_id : "", //社区id
 	        prdids : "",      //编辑时的商品id，默认为空
 	        backdatainfo : function(){},
 		};
 	var SelectPrds = function(element, options) {
 		this.element = $(element);
 		this.settings = $.extend({}, defaults, options);
        this.element.on({
             'click.selectprds': $.proxy(this.init, this)
         });
         $($.proxy(function() {
             this.element.trigger('create');
         }, this));
     };
 	SelectPrds.prototype = {	
		onsale:1,
		total:"",
		pageSize:"",
		totalPage:"",
		curPage:1,
		classfiyid : "",
		prdArray : [],
		newArray : [],
		act_title : {
			 "presell" : "预售",
		     "fans_special" : "粉丝特价",
		     "commonactivity" : "微团购",
		     "full_postage" : "满多少元包邮",
		     "fullreduced" : "满减现金",
		     "groupbuy" : "组团购",
		     "zcset" : "众筹",
		     "prd_card" : "功能卡",
		     "coupon" : "优惠券",
		     "credit_cash" : "积分抵现",
		     "credit_exchange" : "积分换购",
		},
 		//初始化弹出框
 		init: function(){
 			var that = this,
 				element = this.element;
 			
 			that.postUrl = that.settings.host+"/index.php/shangjia/commoncomponent/getallprd";
 			that.itemList = that.settings.host+"/index.php/shangjia/commoncomponent/getcatslist";  //获取商家的父子分类
 			that.classifyprd = that.settings.host+"/index.php/shangjia/commoncomponent/getclassifyprd";  //获取分类下的商品
 			that.getactprd = that.settings.host+"/index.php/shangjia/commoncomponent/getallprdactinfo";  //获取众筹商品
 			that.getscoreprd = that.settings.host+"/index.php/shangjia/commoncomponent/getscorechangeprds";//获取 所有  积分换购商品
 			that.getprdbyids = that.settings.host+"/index.php/shangjia/commoncomponent/getprddetailinfo"; //根据一串商品id获得商品详细信息，格式为id1,id2,id3,id4

 			that.render(element);
 			that.initdata(element);
 			that.show();
 			that.trigger(element);
 		},

 		//创建弹出框
 		create: function(element){
 			var that = this,
 				$this = $(element),
 				prdHTML = "";
 			
 			prdHTML = '<div id="myPrdModal" class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="true">'
				  +'<div class="modal-header">'
				    +'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'
				   +' <h3>选择商品</h3>'
				    +'<div class="mod-searchprd">'
				          +'<input type="text"  placeholder="商品标题" name="prd_k" class="prd_k"/><button class="btn j-search">查询</button>'
				          +'<select name="list" id="sale_status" style="margin:0 0 0 10px;width:150px;">'
								+'<option value="1" selected = "selected">上架商品</option>'
								+'<option value="2" >下架商品</option>'
								+'<option value="3">不限</option>'
						 +'</select>'
				          +'<span class="mlr05 red">提示：选择商品后可以拖拽排序</span>'
				    +'</div>'
				  +'</div>'
				  +'<div class="modal-body m-body">'
				    +'<div id="classifylist" class="fl scrollbar m-body-l">'
					+'</div>'
					+'<div class="fl m-body-c">'
						+'<div id="prdlist" class="scrollbar modalprdlists"></div>'
					 	+'<div class="prdpagecount"></div>'
					+'</div>'
					+'<div id="previewprd" class="fl scrollbar m-body-r modalprdlists">'
						+'<ul></ul>'
					+'</div>'
				  +'</div>'
				  +'<div class="modal-footer">'
				    +'<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>'
				    +'<button class="btn btn-primary prdsubmit">确定<span class="selectednum"></span></button>'
				  +'</div>'
				+'</div>';
 			return prdHTML;	
 		},

 		//渲染弹出框    显示弹出层
 		render: function(element){
 			var that = this,
 				$this = $(element),
 				prdHTML = that.create($this);
 			var len = $("body").find("#myPrdModal").length;
        	if(len <= 0){
        		$('body').append(prdHTML);
        	};
 		},
 		//显示弹出框
 		show: function(){
 			$("#myPrdModal").modal("show");
 		},

 		//隐藏弹出框
 		hide: function(element){
 			$("#myPrdModal").modal("hide");
 		},
 		showsearchbox : function(){
 			$(".mod-searchprd").find(".prd_k").removeAttr("disabled");
 			$(".mod-searchprd").find(".j-search").removeClass("disabled");
 			$(".mod-searchprd").find("#sale_status").removeAttr("disabled");
 		},
 		hidesearchbox : function(){
 			$(".mod-searchprd").find(".prd_k").attr("disabled","disabled");
 			$(".mod-searchprd").find(".j-search").addClass("disabled");
 			$(".mod-searchprd").find("#sale_status").attr("disabled","disabled");
 		},
 		//初始化加载数据
 		initdata: function(element){
 			var that = this,
				$this = $(element);
 			
 			/*将数组与预览部分全部清空，搜索也清空*/
 			$("#previewprd ul").empty();
 			$("#myPrdModal .prd_k").val("");
 			$("#myPrdModal .selectednum").html("");
 			that.newArray.splice(0,that.newArray.length);
 			var prdids = that.settings.prdids;
 			if(prdids){   //获取已选择的商品，重新赋值
 				var prdid = $this.attr("data-prdid"),id = "";
 				if(prdid){
 					id = prdid;
 				}else{
 					id = prdids;
 				};
 				that.idsajax(id);
 	 			that.previewhtml();
 			}else{
 				var prdid = $this.attr("data-prdid");
 				if(prdid){
 					that.idsajax(prdid);
 		 			that.previewhtml();
 				}
 			};
 			var cid = $this.attr("data-cid");
 			that.classfiyid = cid;
 			that.itemlist();
 			if(cid==0 || !cid){
 				that.showsearchbox();
    			cid = 0;
    			that.initInfo(that.postUrl+"?sale="+that.onsale+'&community_id'+that.settings.community_id);
    		}else if(cid=="zc"){
    			that.hidesearchbox();
    			that.getDataPrd("",that.getactprd);
    		}else if(cid=="jf"){
    			that.hidesearchbox();
    			that.getDataPrd("",that.getscoreprd);
    		}else{
    			that.showsearchbox();
    			that.getprdBycid(cid,that.settings.community_id);
    		};
    		$("#classifylist").find("li[data-cid="+cid+"]").addClass("active").siblings().removeClass("active");
 		},
 		/*获取父子分类*/
    	itemlist:function(){
    		var that = this;
    		var len = $("#classifylist").find("li").length;
    		if(len <= 0){
	    		$.ajax({
	    			type: 'POST',
	    			url: that.itemList,
	    			data: {'platform':2,'sale':that.onsale},
	    			dataType:'json',
	    			async:false,
	    			beforeSend:function(){
	    				$("#classifylist").html("<div class='dataloading'>加载中...</div>");
	    			},
	    			success:function(json){
	    				if(json.status=="40001"){
	    					$("#classifylist").html("");
	    				}else{
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
	    					$("#classifylist").html(html);
	    				}
	    			},
	    		});
    		};
    	},
    	//获取分类下的商品
        getprdBycid:function(cid,community_id){
        	var that = this;
			var c_url=that.classifyprd+"?classifyid="+cid+"&sale="+that.onsale+'&community_id='+community_id;
			that.initInfo(c_url);
		},
    	/*选择商品初始化*/
    	initInfo:function(url){
    		var that = this;
    		$("#myPrdModal .prdpagecount span a").die("click");
    		that.getDataPrd(1,url);
    		that.ajaxPage(url);  //分页里数据调取
    	},
    	/*获取所有商品*/
    	getDataPrd:function(page,url){
    		var that = this,
    			alltag =  that.settings.alltag,
				hasonsale =  that.settings.hasonsale;
    		$.ajax({
    			type: 'POST',
    			url: url,
    			data: {'page':page,"platform":2},
    			dataType:'json',
    			beforeSend:function(){
    				$("#prdlist").html("<div class='dataloading'>加载中...</div>");
    				$("#myPrdModal .prdpagecount").hide();
    			},
    			success:function(json){
    				if(json.status=="40001"){
    					$("#prdlist").html("<div class='datawarn'>登陆超时，请<span class='btn-link' onclick='location.reload();'>刷新</span>页面重新登陆</div>");
    					$("#myPrdModal .prdpagecount").hide();
    				}else{
    					$("#prdlist").empty();
    					if(json.count==0){
    						$("#prdlist").html("<div class='datawarn'>没有数据...</div>");
    						$("#myPrdModal .prdpagecount").hide();
    					}else{
    						if(url !== that.getactprd && url !== that.getscoreprd && json.countpage > 1){
    							$("#myPrdModal .prdpagecount").show();
    							that.total = json.count; //总记录数
    							that.pageSize = json.pagenum; //每页显示条数
    							that.curPage = page; //当前页
    							that.totalPage =json.countpage; //总页数
    						}else{
    							$("#myPrdModal .prdpagecount").html('<span>共'+json.count+'条数据</span>');
    						};
    						var li = "";
    						var list = json.info;
    						$.each(list,function(index,array){ //遍历json数据列
    							var tagarr = '',tags = '';
    							if(hasonsale == '1'){
    								if(array['approve_status'] == "onsale"){
    									tags += '<span class="label label-warning c_onsale">销售中</span>';
    								}else{
    									tags += '<span class="label">已下架</span>';
    								};
    							};
    							if(array['prd_presell']['status']){
    								if(alltag.indexOf("presell") !== -1){
    									tags += '<span class="label label-warning c_presell"  title="该商品正在参加<<'+array['prd_presell']['actinfo']['act_name']+'>>活动">'+that.act_title["presell"]+'</span>';
    								};
    								tagarr += "presell" + ",";
    							};
    							if(array['fans_special_price']['status']){
    								if(alltag.indexOf("fans_special") !== -1){
    									tags += '<span class="label label-warning c_fans_special"  title="该商品正在参加<<'+array['fans_special_price']['actinfo']['act_name']+'>>活动">'+that.act_title["fans_special"]+'</span>';
    								};
    								tagarr += "fans_special" + ",";
								};
    							if(array['prd_commonactivity']['status']){
    								if(alltag.indexOf("commonactivity") !== -1){
    									tags += '<span class="label label-warning c_commonactivity"  title="该商品正在参加<<'+array['prd_commonactivity']['actinfo']['act_name']+'>>活动">'+that.act_title["commonactivity"]+'</span>';
    								};
    								tagarr += "commonactivity" + ",";
    							};
    							if(array['full_price_reduce_postage']['status']){
    								if(alltag.indexOf("full_postage") !== -1){
    									tags += '<span class="label label-warning c_full_postage"  title="该商品正在参加<<'+array['full_price_reduce_postage']['actinfo']['act_name']+'>>活动">满'+array['full_price_reduce_postage']['actinfo']['money']+'元包邮</span>';
    								};
    								tagarr += "full_postage" + ",";
    							};
    							if(array['prd_fullreduced']['status']){
    								if(alltag.indexOf("fullreduced") !== -1){
    									tags += '<span class="label label-warning c_fullreduced"  title="该商品正在参加<<'+array['prd_fullreduced']['actinfo']['act_name']+'>>活动">'+that.act_title["fullreduced"]+'</span>';
    								};
    								tagarr += "fullreduced" + ",";
    							};
    							if(array['prd_groupbuy']['status']){
    								if(alltag.indexOf("groupbuy") !== -1){
    									tags += '<span class="label label-warning c_groupbuy"  title="该商品正在参加<<'+array['prd_groupbuy']['actinfo']['act_name']+'>>活动">'+that.act_title["groupbuy"]+'</span>';
    								};
    								tagarr += "groupbuy" + ",";
    							};
    							if(array['prd_zcset']['status']){
    								if(alltag.indexOf("zcset") !== -1){
    									tags += '<span class="label label-warning c_zcset"  title="该商品正在参加<<'+array['prd_zcset']['actinfo']['act_name']+'>>活动">'+that.act_title["zcset"]+'</span>';
    								};
    								tagarr += "zcset" + ",";
    							};
    							if(array['prd_cardinfo']['status']){
    								if(alltag.indexOf("prd_card") !== -1){
    									tags += '<span class="label label-warning c_prd_card"  title="该商品正在参加<<'+array['prd_cardinfo']['actinfo']['act_name']+'>>活动">'+that.act_title["prd_card"]+'</span>';
    								};
    								tagarr += "prd_card" + ",";
    							};
    							if(array['prd_ticket']['status']){
    								if(alltag.indexOf("coupon") !== -1){
    									tags += '<span class="label label-warning c_coupon"  title="该商品正在参加<<'+array['prd_ticket']['actinfo']['act_name']+'>>活动">'+that.act_title["coupon"]+'</span>';
    								};
    								tagarr += "coupon" + ",";
    							};
    							if(array['credit_to_price']['status'] == "1"){
    								if(alltag.indexOf("credit_cash") !== -1){
    									tags += '<span class="label label-warning c_credit_cash"  title="该商品正在参加<<'+array['prd_cardinfo']['actinfo']['act_name']+'>>活动">'+that.act_title["credit_cash"]+'</span>';
    								};
    								tagarr += "credit_cash" + ",";
    							};
    							if(array['credit_to_price']['status'] == "2"){
    								if(alltag.indexOf("credit_exchange") !== -1){
    									tags += '<span class="label label-warning c_credit_exchange"  title="该商品正在参加<<'+array['prd_cardinfo']['actinfo']['act_name']+'>>活动">'+that.act_title["credit_exchange"]+'</span>';
    								};
    								tagarr += "credit_exchange" + ",";
    							};
    							tagarr = tagarr.substring(0,tagarr.length-1);
    							li += '<li data-id="'+array['id']+'" id="a'+array['id']+'" data-tag="'+tagarr+'">';
    							if(array['prd_url']){
    								li += '<a href="'+array['prd_url']+'" class="prdinfo">';
    							}else{
    								li += '<a href="javascript:void(0);" class="prdinfo">';
    							};
    							li += '<div class="pic"><img src="'+array['pic_url']+'_180x180.jpg"/></div>'
    							    +'<div class="prd-des"><p class="title">'+array['title']+'</p><div>'
    							    +'<p class="price fl" price="'+array['price']+'">￥'+array['price']+'</p>'
    							    +'<div class="fr">'+tags+'</div><div class="clearfix"></div></div></div></a></li>';
    							
    						});
    						$("#prdlist").html("<ul>"+li+"</ul>");
    						var keywd = $("#myPrdModal .prd_k").val();
    						keywd = $.trim(keywd);
    						that.hilightEle("#prdlist",keywd);
    						//调用数据就开始进行记录
    						var aLen=that.newArray.length;
    						if(aLen>0){
    							for(var i=0;i<aLen;i++)	{
    								var id = that.newArray[i]['dataid'];
									  $("#prdlist").find("li").each(function(){
											var allid = $(this).attr("data-id");
											if(id == allid){
												$("#a"+id).addClass("btn-success");
											};
									  });
    							};
    						};
    					}
    				}
    			},
    			complete:function(){ //生成分页条
    				if(url !== that.getactprd  && url !== that.getscoreprd){
    					var pageStr = that.getPageBar();
    					$("#myPrdModal .prdpagecount").html(pageStr);
    				}
    			},
    			error:function(){
    				$("#prdlist").html("<div class='datawarn'>数据加载失败</div>");
    				$("#myPrdModal .prdpagecount").hide();
    			}
    		});
    	},
    	/*点击分页获取商品列表*/
    	ajaxPage:function(pageUrl){
    		var that = this;
    		$("#myPrdModal .prdpagecount span a").live('click',function(){
    			var rel = $(this).attr("rel");
    			if(rel){
    				that.getDataPrd(rel,pageUrl);
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
    	
    	/*根据ids获取商品信息，id的格式为id1,id2,id3这类*/
    	idsajax:function(ids){
    		var that = this;
    		var str = ids.substr(ids.length-1,1);
    		if(str == ','){
    			ids=ids.substring(0,ids.length-1);
    		};
    		$.ajax({
    			type: 'POST',
    			url: that.getprdbyids,
    			data: {"ids":ids},
    			dataType:'json',
    			async : false,
    			success:function(json){
    				that.newArray = json;
    			},
    		});
    		return that.newArray;
    	},
    	/*创建一维数组*/
    	creatArray:function(t,dataid){
    		var that = this,
	    		prd=t.find("a").attr("href"),
	    	    pic = t.find(".pic img").attr("src"),
	    	    title = t.find(".title").html(),
	    	    price = t.find(".price").attr("price");
    	    that.prdArray = {dataid:dataid,prd:prd,pic:pic,title:title,price:price};
    	},
    	/*移除数组中符合dataid的某个属性的元素*/
    	attrIndexOf:function(target, list, attr) {
    	    var i = 0, l = list.length;
    	    for (i = 0; i < l; i += 1) {
    	        if (list[i][attr] == target) {
    	            return i;
    	        }
    	    };
    	    return -1;
    	},
    	removeItem:function(ObjArr,id) {
    		var that = this;
    	    var pos = that.attrIndexOf(id, ObjArr, 'dataid');
    	    if (pos !== -1) {
    	    	ObjArr.splice(pos, 1);
    	    };
    	},
    	/*选择商品时，查看是无重添加数组还是移除数组某项*/
    	checkedEle:function(_Ele,ObjData,ObjArr,sLimit){
    		var that = this;
    		if(_Ele.hasClass("btn-success")){
    			_Ele.removeClass("btn-success");
    			var id =_Ele.attr("data-id");
    			that.removeItem(ObjArr,id);
    		}else{
    			if(sLimit == 0){
    				_Ele.addClass("btn-success");
    				if(jQuery.inArray(ObjData, ObjArr)==-1){//如果-1 在选中时push添加
    					ObjArr.push(ObjData);
    				}
    			}else{
    				if(ObjArr.length<sLimit){
    					_Ele.addClass("btn-success");
    					if(jQuery.inArray(ObjData, ObjArr)==-1){//如果-1 在选中时push添加
    						ObjArr.push(ObjData);    //ObjData是获取的id，然后push到数组里
    					}
    				}else{
    					alert("您最多选择"+sLimit+"个");
    				};
    			};
    		};
    	},
    	/*预览*/
    	previewhtml:function(){
    		var that = this,
    			prehtml = "",
    			aLen=that.newArray.length;
    		$("#myPrdModal .selectednum").html("(<b>&nbsp;"+aLen+"&nbsp;</b>)");
    		if(aLen>0){
    			for(var i=0;i<aLen;i++)	{
    				var dataid = that.newArray[i]['dataid'];
    				var prd = that.newArray[i]['prd'];
    				var pic = that.newArray[i]['pic'];
    				var title = that.newArray[i]['title'];
    				var price = that.newArray[i]['price'];
    				prehtml += "<li data-id='"+dataid+"' id='p"+dataid+"'>"
    							+"<span class='move_area'><i class='layer_icon_move' title='点击我可以拖拽排序哦'></i></span>"
    							+"<a href='"+prd+"'>"
    							+"<div class='prdinfo'>"
    							+"<div class='pic'><img src='"+pic+"'></div>"
    							+"<div class='prd-des'>"
    							+"<p class='title'>"+title+"</p>"
    							+"<p class='price'>￥"+price+"</p></div>"
    							+"</div>"
    							+"<div class='cancleprd'>X</div>"
    							+"</a></li>";
    			};
    		};
    		$("#previewprd ul").html(prehtml);
    	},
    	/*搜索关键词*/
    	execSearch:function(cur){
    		var that = this,
    			keywd=cur.val();
    		if($.trim(keywd)==""){
				alert("查询条件不能为空");
				return false;
			}else{
				keywd = $.trim(keywd);
				var cid = $("#classifylist").find("li.active").attr("data-cid");
				if(cid==0){
					var k_url=that.postUrl+"?title="+encodeURIComponent(keywd)+"&sale="+that.onsale;
 	    		}else{
 	    			var k_url=that.classifyprd+"?classifyid="+cid+"&title="+encodeURIComponent(keywd)+"&sale="+that.onsale+'&community_id='+that.settings.community_id;
 	    		};
 	    		that.initInfo(k_url);
    		};
    	},

 		//(系列事件)
 		trigger: function(element,event){
 			var that = this,
	 			num = that.settings.prdnum,
	 			notEle_arr = that.settings.notEle,
	 			community_id = that.settings.community_id,
 				$this = $(element);
 			//改变查看状态
 			$('#sale_status').unbind();
 			$('#sale_status').bind("change",function(){
				that.onsale=$(this).val();
				var clssifid=$("#classifylist li.active").attr("data-cid");
				that.itemlist();
				if(clssifid == 0){
					that.initInfo(that.postUrl+"?sale="+that.onsale);
				}else{
					$("#classifylist li[data-cid='"+clssifid+"']").addClass("active").trigger("click");
				}
			});
 			//点击分类
 			$("#classifylist").undelegate();
			$("#classifylist").delegate("li","click",function(e){
 				var _t = $(this),
 	        		cid=_t.attr("data-cid");
 	    		that.classfiyid = cid;
 	    		if(cid==0){
 	    			that.showsearchbox();
 	    			that.initInfo(that.postUrl+"?sale="+that.onsale+'&community_id'+community_id);
 	    		}else if(cid=="zc"){
 	    			that.hidesearchbox();
 	    			that.getDataPrd("",that.getactprd);
 	    		}else if(cid=="jf"){
 	    			that.hidesearchbox();
 	    			that.getDataPrd("",that.getscoreprd);
 	    		}else{
 	    			that.showsearchbox();
 	    			that.getprdBycid(cid,community_id);
 	    		};
 	    		_t.parent().children("li").removeClass("active");//将所有选项置为未选中
 	    		_t.addClass("active");
 	    		$this.attr("data-cid",cid);
 			});
 			//选择商品
 			$("#prdlist").undelegate();
 			$("#prdlist").delegate("li","click",function(e){
    			e.preventDefault();
    			var _t = $(this),
    				dataid = _t.attr("data-id"),
    				tags = _t.attr("data-tag");
            	for(var i = 0 ; i< notEle_arr.length;i++){
            		if(tags.indexOf(notEle_arr[i]) !== -1){
            			//编辑时，这个活动是选中状态，也打上了标签，点击时需要移除标签再进行后面的判断
            			if(_t.hasClass("btn-success")){
            				//移除标签
            				var str = tags.substr(tags.length-1,1);
            	    		if(str !== ','){
            	    			tags += ',';
            	    		};
            	    		tags = tags.replace(notEle_arr[i]+",","");
            	    		tags = tags.substring(0,tags.length-1);
            	    		_t.find(".c_"+notEle_arr[i]).remove();
            	    		_t.attr("data-tag",tags);
            			};
            		};
        			if(tags.indexOf(notEle_arr[i]) !== -1){
        				alert("该商品正在参加"+that.act_title[notEle_arr[i]]+"活动，请选择其他商品！");
        				return false;
        			};
            	};
            	that.creatArray(_t,dataid);
            	if(num == 1){
            		$this.attr("data-prdid",that.prdArray.dataid);
            		that.settings.backdatainfo($this,that.prdArray);
            		that.hide();
            		return false;
            	};
            	that.checkedEle(_t,that.prdArray,that.newArray,num);
            	that.previewhtml();
    		});
    	    /*选择的商品点击取消操作*/
    	    $("#previewprd").undelegate();
    		$("#previewprd").delegate("li .cancleprd","click",function(){
    			var _t = $(this);
    			var id=_t.parents("li").attr("data-id");
    			_t.parents("li").remove();
    			/* 数组移除 */
    			that.removeItem(that.newArray,id);
    			var aLen=that.newArray.length;
    			$("#myPrdModal .selectednum").html("(<b>&nbsp;"+aLen+"&nbsp;</b>)");
    			if(aLen>=0){
    				$("#prdlist").find("li.btn-success").each(function(){
    						var selid = $(this).attr("data-id");
    						$(this).removeClass("btn-success");
    						for(var i=0;i<aLen;i++)	{
    							var dataid = that.newArray[i]['dataid'];
    								if(selid == dataid){
    									$("#a"+selid).addClass("btn-success");
    								};
    						};
    				});
    			};
    		});
    		/*预览框阻止默认操作*/
    	    $("#previewprd").delegate("li","click",function(e){
    	    	e.preventDefault();
    	    });
    	    /*商品可以拖拽排序*/
    		$("#previewprd ul").sortable({ opacity: 0.8, cursor: 'move',axis:'y',update: function() {
    			/*拖动换位的时候，将数组先清空，然后将新排好的顺序放入数组*/
    			that.newArray.splice(0,that.newArray.length);
    			$("#previewprd").find("li").each(function(){
    				  var _t=$(this);
    			      var dataid=_t.attr("data-id");
    			      that.creatArray(_t,dataid);
    			      that.newArray.push(that.prdArray);
    			});
    		}});
    		//搜索
    		$("#myPrdModal .j-search").die();
    		$("#myPrdModal .j-search").click(function(){
    			var cur = $(this).prev(".prd_k");
    			if(!$(this).hasClass("disabled")){
    				that.execSearch(cur);
    			};
    		});
    		$('.prd_k').live('keyup change', function(event) {
    	        var searchTerm = $(this).val();
    	        searchTerm = $.trim(searchTerm);
    	        if(searchTerm){
    	        	that.hilightEle("#prdlist",searchTerm);
    	        };
    			if(event.keyCode ==13){
    				that.execSearch($(this));
    			};
    	    });
    	    //确认返回事件
 			if($.isFunction(that.settings.backdatainfo)){
 				$("#myPrdModal .prdsubmit").unbind();
	 			$('#myPrdModal .prdsubmit').on('click',function(){
	 				var ids = "";
	 				for(var i=0;i<that.newArray.length;i++){
	 					ids += that.newArray[i].dataid + ',';
	 				};
	 				ids=ids.substring(0,ids.length-1);
	 				$this.attr("data-prdid",ids);
	 				that.settings.backdatainfo($this,that.newArray);
	 				that.hide();
	 			});
 			};
 		}
 	};
 	var old = $.fn[pluginName];
 	$.fn[pluginName] = function(options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new SelectPrds(this, options));			
			};
        });
		return this;
    };
    $.fn[pluginName].noConflict = function () {
        $.fn[pluginName] = old;
        return this
    };
 })(jQuery)