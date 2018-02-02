/*!
 * selectCoupon 0.0.1
 * by KANGXUE
 * Copyright 2016.2
 * Date: Mon Feb 1 2016
 * 
 * 
 */

 ;(function($){
 	var pluginName = 'selectCoupon',
 		defaults = {
 			host : "",
 			num : 1,      //num为0时可选无数张
 			backdatainfo : function(){},
 		};
 	var SelectCoupon = function(element, options) {
 		this.element = $(element);
 		this.settings = $.extend({}, defaults, options);
        this.element.on({
             'click.selectCoupon': $.proxy(this.init, this)
         });
         $($.proxy(function() {
             this.element.trigger('create');
         }, this));
     };
 	SelectCoupon.prototype = {	
		total:"",
		pageSize:"",
		totalPage:"",
		curPage:1,
		couponArray:"",
		couponarr:[],
		couponids : "",
 		//初始化弹出框
 		init: function(){
 			var that = this,
 				element = this.element;
 			that.getcoupon= that.settings.host+"/index.php/shangjia/commoncomponent/getcoupon";   //获取优惠券
 			that.couponinfo=that.settings.host+"/index.php/shangjia/commoncomponent/couponinfo"; //获取优惠券信息
 			var flag = /^\d+$/.test(that.settings.num);
 			if(!flag){
 				alert("请填写正确的选择数量的参数");
 				return false;
 			};
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
 			
 			modalHTML[0] = '<div id="MyCouponModal" class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="true">'
 				  		+'<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3 class="fl">选择优惠券</h3>'
 				  		+'<a href="'+that.settings.host+'/index.php/shangjia/coupon/newcoupons" class="btn btn-success fr" target="_blank" style="margin-right:20px;">新建优惠券</a><span class="btn fr refreshimgtxt">刷新</span><div class="clearfix"></div></div>'
		  				+'<div class="modal-body"><div class="scrollbar linkbox" id="mycouponlist"></div><div class="prdpagecount"></div></div>'
		 				+'<div class="modal-footer">'
		 				+'<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>'
		 				+'<button class="btn btn-primary couponsubmit">确定<span class="coupon_num"></span></button>'
		 				+'</div></div>';
 			return modalHTML;	
 		},

 		//渲染弹出框    显示弹出层
 		render: function(element){
 			var that = this,
 				$this = $(element),
 				modalHTML = that.create($this);
 			var len = $("body").find("#MyCouponModal").length;
        	if(len <= 0){
        		$('body').append(modalHTML[0]);
        	};
 		},
 		//显示弹出框
 		show: function(){
 			$("#MyCouponModal").modal("show");
 		},
 		//隐藏弹出框
 		hide: function(){
 			$("#MyCouponModal").modal("hide");
 		},
 		//初始化加载数据
 		initdata: function(element){
 			var that = this,
				$this = $(element);
 			that.couponids = $this.attr("data-ids");
 			if(!that.couponids){
				that.couponids = "";
			};
 			that.couponlistinit(that.getcoupon);
 		},
 		/*优惠券初始化*/
 		couponlistinit:function(url){
 			var that = this;
 			$("#MyCouponModal .prdpagecount span a").die("click");
 			that.getcouponlist(1,url);
 			that.ajaxpagecoupon(url);
 	    },
 	   getcouponlist:function(page,url){
 		  var that = this;
 			$.ajax({
 				type: 'POST',
 				url: url,
 				data: {'page':page},
 				dataType:'json',
 				beforeSend:function(){
 					$("#mycouponlist").html("<div class='dataloading'>加载中...</div>");
 					$("#MyCouponModal .prdpagecount").hide();
 				},
 				success:function(json){
 					if(json.status=="40001"){
 						$("#mycouponlist").html("<div class='datawarn'>登陆超时，请<span class='btn-link' onclick='location.reload();'>刷新</span>页面重新登陆</div>");
 						$("#MyCouponModal .prdpagecount").hide();
 					}else{
 						$("#mycouponlist").empty();
 						if(json.countpage==0){
 							$("#mycouponlist").html("<div class='datawarn'>没有数据</div>");
 							$("#MyCouponModal .prdpagecount").hide();
 						}else{
 							if(json.totalpage > 1){
 								$("#MyCouponModal .prdpagecount").show();
 	 							that.total = json.totalnum; //总记录数
 	 							that.pageSize = json.pagenum; //每页显示条数
 	 							that.curPage = page; //当前页
 	 							that.totalPage =json.totalpage; //总页数
 							};
 							var table1 = '<table style="width:100%;"><tr><th>名称</th><th>优惠金额</th><th>过期时间</th><th>数量</th><th width="80">操作</th></tr>';
							var tr = "",list = json.result;
							$.each(list,function(index,array){ 
								tr += '<tr data-id="'+array['id']+'"><td><span class="coupon_title" title="'+array['group_name']+'">'+array['group_name']+'</span></td>'
								+'<td>'+array['group_parvalue']+'</td><td>'+array['group_etime']+'</td><td>'+array['group_quantity']+'</td>'
								+'<td><a href="javascript:void(0);" class="btn-link selcouponbtn" data-id="'+array['id']+'" data-title="'+array['group_name']+'" data-value="'+array['group_parvalue']+'" '
								+'data-etime="'+array['group_etime']+'" data-num="'+array['group_quantity']+'">选择</a></td></tr>';
							});
							var table2 = '</table>';
							$("#mycouponlist").html(table1 + tr +table2);
							var coupon_idarr = that.couponids.split(",");
							if(coupon_idarr.length>0){
								for(var i=0;i<coupon_idarr.length;i++)	{ 
									var c_id = coupon_idarr[i];
									$("#mycouponlist").find(".selcouponbtn").each(function(){
										var id = $(this).attr("data-id");
										if(c_id == id){
											$(this).html("取消选择");
										};
									}); 
								};
							};
 						};
 					}
 				},
 				complete:function(){ //生成分页条
 					var pageStr = that.getPageBar();
 					$("#MyCouponModal .prdpagecount").html(pageStr);
 				},
 				error:function(){
 					$("#mycouponlist").html("<div class='datawarn'>数据加载失败</div>");
 					$("#MyCouponModal .prdpagecount").hide();
 				}
 			});
 		},
 		ajaxpagecoupon:function(pageUrl){
 			var that = this;
 			$("#MyCouponModal .prdpagecount span a").live('click',function(){
 				var rel = $(this).attr("rel");
 				if(rel){
 					that.getcouponlist(rel,pageUrl);
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
    	    var pos = that.attrIndexOf(id, ObjArr, 'id');
    	    if (pos !== -1) {
    	    	ObjArr.splice(pos, 1);
    	    };
    	},
    	/*选择优惠券时，查看是无重添加数组还是移除数组某项*/
    	checkedEle:function(_Ele,ObjData,ObjArr,sLimit){
    		var that = this;
    		if(_Ele.html() == "取消选择"){
    			_Ele.html("选择");
    			var id =_Ele.attr("data-id");
    			that.removeItem(ObjArr,id);
    			var reg = new RegExp(id+",","g");
    			that.couponids = that.couponids.replace(reg, "");
    		}else{
    			if(sLimit == 0){
    				_Ele.html("取消选择");
    				if(jQuery.inArray(ObjData, ObjArr)==-1){//如果-1 在选中时push添加
    					ObjArr.push(ObjData);
    					that.couponids += ObjData.id+',';
    				};
    			}else{
    				if(ObjArr.length<sLimit){
    					_Ele.html("取消选择");
    					if(jQuery.inArray(ObjData, ObjArr)==-1){//如果-1 在选中时push添加
    						ObjArr.push(ObjData);    //ObjData是获取的id，然后push到数组里
    						that.couponids += ObjData.id+',';
    					}
    				}else{
    					alert("您最多选择"+sLimit+"个");
    				};
    			};
    		};
    		$("#MyCouponModal").find(".coupon_num").html("("+ObjArr.length+")");
    	},
 		//(系列事件)
 		trigger: function(element,event){
 			var that = this,
 				$this = $(element);
 			
    		//刷新
    		$(".refreshimgtxt").click(function(){
    			that.couponlistinit(that.getcoupon);
    		});
    	    //确认返回事件
 			if($.isFunction(that.settings.backdatainfo)){
 				$("#MyCouponModal #mycouponlist").undelegate();
	 			$('#MyCouponModal #mycouponlist').delegate('.selcouponbtn','click',function(){
	 				var _t = $(this),
	 					id = _t.attr("data-id"),
	 					title = _t.attr("data-title"),
	 					cvalue = _t.attr("data-value"),
	 					etime = _t.attr("data-etime"),
	 					num = _t.attr("data-num");
	 				that.couponArray = {"id" : id,"title" :title,"value" :cvalue,"num" : num,"etime" : etime};
	 				if(that.settings.num == 1){
	 					that.settings.backdatainfo($this,that.couponArray);
	 					that.hide();
	 					return false;
	 				};
	 				that.checkedEle(_t,that.couponArray,that.couponarr,that.settings.num);
	 			});
	 			if(that.settings.num !== 1){
	 				$(".couponsubmit").unbind();
		 			$(".couponsubmit").bind("click",function(){
		 				$this.attr("data-ids",that.couponids);
		 				that.settings.backdatainfo($this,that.couponarr);
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
                $.data(this, "plugin_" + pluginName, new SelectCoupon(this, options));			
			}
        });
		return this;
    };
    $.fn[pluginName].noConflict = function () {
        $.fn[pluginName] = old;
        return this
    };
 })(jQuery)