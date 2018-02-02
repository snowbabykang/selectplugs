/*!
 * selectStore 0.0.1
 * by KANGXUE
 * Copyright 2016.6.4
 * 
 * 
 */
 ;(function($){
	 //当前按钮编辑时，需要增加属性data-ids，以逗号相隔
 	var pluginName = 'selectStore',
 		defaults = {
 			host : "",
 			num : 1,      //num为0时可选无数
			rule_sign : 0,  //传1则根据登录者身份获取不同的门店信息
			sid : '',  //商家ID,不同的业务场景需要查看该商家ID下的门店
			type : '0',   //0:普通查询门店; 1:ywk系统内部固定商家主账号查询其他商家门店-"企业支付设置"模块使用; 2:某父商户查询子支付商户的门店-"支付商户"模块使用;
 			alldata : '1',   //1:所有数据不分页，否则分页
 			backdatainfo : function(){},
 		};
 	var selectStore = function(element, options) {
		this.element = $(element);
		if(!this.element.hasClass("disabled")) {
			this.settings = $.extend({}, defaults, options);
			this.element.on({
				 'click.selectStore': $.proxy(this.init, this)
			 });
			 $($.proxy(function() {
				 this.element.trigger('create');
			 }, this));
		}
     };
 	selectStore.prototype = {	
		total:"",
		pageSize:"",
		totalPage:"",
		curPage:1,
		pageData :[],
		storeArray:"",
		storearr:[],
 		//初始化弹出框
 		init: function(){
 			var that = this,
 				element = this.element;
 			that.getstore= that.settings.host+"/index.php/shangjia/softstore/stores";   //获取门店
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
 			modalHTML[0] = '<div id="MystoreModal" class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="true" data-width="700">'
 				  		+'<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3>选择门店</h3><div class="clearfix"></div>'
 				  		+'<div class="inputbox"><input type="text" class="storenameval" placeholder="请输入门店名"><i class="ywkicon icon-search searchstorebtn"></i></div>'
 				  		+'<a href="'+that.settings.host+'/index.php/shangjia/softstore/createstore" class="btn btn-success m-r-md m-l" target="_blank">新建门店</a>'
 				  		+'<span class="btn refreshimgtxt">刷新</span></div>'
		  				+'<div class="modal-body"><div class="scrollbar linkbox" id="mystorelist"></div><div class="prdpagecount"></div></div>'
		 				+'<div class="modal-footer">'
		 				+'<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>'
		 				+'<button class="btn btn-primary storesubmit">确定<span class="store_num"></span></button>'
		 				+'</div></div>';
 			return modalHTML;	
 		},

 		//渲染弹出框    显示弹出层
 		render: function(element){
 			var that = this,
 				$this = $(element),
 				modalHTML = that.create($this);
 			var len = $("body").find("#MystoreModal").length;
        	if(len <= 0){
        		$('body').append(modalHTML[0]);
        	};
 		},
 		//显示弹出框
 		show: function(){
 			$("#MystoreModal").modal("show");
 		},
 		//隐藏弹出框
 		hide: function(){
 			$("#MystoreModal").modal("hide");
 		},
 		//初始化加载数据
 		initdata: function(element){
 			var that = this,
				$this = $(element);
 			that.storearr = [];
 			$("#MystoreModal").find(".store_num").html("");
 			var ids = $this.attr("data-ids");
 			if(ids) that.editstoreid(ids);
 			//if(!$("#mystorelist").find("table").length){
 				that.storelistinit(that.getstore);
 			//}
 		},
 		/*门店初始化*/
 		storelistinit:function(url){
 			var that = this;
 			$("#MystoreModal .prdpagecount span a").die("click");
 			that.getstorelist(1,url);
 			that.ajaxpagestore(url);
 	    },
 	   editstoreid : function(id){
 		  var that = this;
			$.ajax({
				type: 'POST',
				url: that.getstore,
				data: {'store_id':id},
				dataType:'json',
				async:false,
				success:function(json){
					var arr = json.list;
					var storearray = [];
					for(var i in arr){
						var id = arr[i].id,
		 					name = arr[i].name,
		 					address = arr[i].address,
		 					nick = arr[i].nick;
						var obj = {"id" : id,"name" :name,"address" :address,"nick" : nick};
						storearray.push(obj);
					};
					that.storearr = storearray;
					$("#MystoreModal").find(".store_num").html("("+storearray.length+")");
				},
			});
 	   },
 	   getstorelist:function(page,url){
 		  var that = this;
 			$.ajax({
 				type: 'POST',
 				url: url,
				//根据登陆者权限,查询门店列表(如不需要校验权限,rule_sign=0,否则rule_sign=1)
				data: {'page':page, 'rule_sign':that.settings.rule_sign, 'sid':that.settings.sid, 'type':that.settings.type,'alldata' : that.settings.alldata},
 				dataType:'json',
 				beforeSend:function(){
 					$("#mystorelist").html("<div class='dataloading'>加载中...</div>");
 					$("#MystoreModal .prdpagecount").hide();
 				},
 				success:function(json){
 					if(json.status=="40001"){
 						$("#mystorelist").html("<div class='datawarn'>登录超时，请<span class='btn-link' onclick='location.reload();'>刷新</span>页面重新登陆</div>");
 						$("#MystoreModal .prdpagecount").hide();
 					}else{
 						$("#mystorelist").empty();
 						if(json.list.length==0){
 							$("#mystorelist").html("<div class='datawarn'>没有数据</div>");
 							$("#MystoreModal .prdpagecount").hide();
 						}else{
 							that.pageData = json.list;
 							that.total = that.pageData.length;//记录条数  
 							that.pageSize = 10;//设置每页示数目  
 							that.totalPage = Math.ceil(that.total/that.pageSize);//计算总页数  
 							that.curPage = 1;//当前页，默认为1。
 							
 							var table1 = '<table style="width:100%;"><tr><th>门店名称</th><th width="120">店长</th><th width="280">所属区域</th><th width="100">操作</th></tr>';
							var tr = "",list = json.list;
							$.each(list,function(index,array){ 
								tr += '<tr class="storeinfo" data-id="'+array['id']+'"><td><span class="store_title ellip_title" title="'+array['name']+'">'+array['name']+'</span></td>';
								if(array['nick']){
									tr += '<td>'+array['nick']+'</td>';
								}else{
									tr += '<td>/</td>';
								}
							tr += '<td class="ellip_title" title="'+array['address']+'">'+array['address']+'</td>'
								+'<td><a href="javascript:void(0);" class="btn-link selstorebtn" data-id="'+array['id']+'" data-name="'+array['name']+'" '
								+'data-address="'+array['address']+'" data-nick="'+array['nick']+'">选择</a></td></tr>';
							});
							var table2 = '</table>';
							$("#mystorelist").html(table1 + tr +table2);
							
 							that.showstoreinfo(that.curPage);
							
							if(that.storearr.length>0){
								for(var i=0;i<that.storearr.length;i++)	{ 
									var c_id = that.storearr[i].id;
									$("#mystorelist").find(".selstorebtn").each(function(){
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
 				error:function(){
 					$("#mystorelist").html("<div class='datawarn'>数据加载失败</div>");
 					$("#MystoreModal .prdpagecount").hide();
 				}
 			});
 		},
 		showstoreinfo : function(currentpage){
 			var that = this;
			var tr = "";
			$("#mystorelist").find("tr.storeinfo").hide();
			//默认显示第一页数据
			for(i=(currentpage-1) * that.pageSize; i < that.pageSize * currentpage;i++){ 
		        var array = that.pageData[i];
		        if(array){
		        	var id = array['id'];
		        	$("#mystorelist").find("tr[data-id='"+id+"']").show();
		        }
		    }  
			if(that.totalPage > 1){
				var pageStr = that.getPageBar();
				$("#MystoreModal .prdpagecount").show().html(pageStr);
			};
 		},
 		ajaxpagestore:function(pageUrl){
 			var that = this;
 			$("#MystoreModal .prdpagecount span a").live('click',function(){
 				var rel = $(this).attr("rel");
 				if(rel){
 					that.curPage = rel;
 					that.showstoreinfo(rel);
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
    	/*选择门店时，查看是无重添加数组还是移除数组某项*/
    	checkedEle:function(_Ele,ObjData,ObjArr,sLimit){
    		var that = this;
    		if(_Ele.html() == "取消选择"){
    			_Ele.html("选择");
    			var id =_Ele.attr("data-id");
    			that.removeItem(ObjArr,id);
    		}else{
    			if(sLimit == 0){
    				_Ele.html("取消选择");
    				if(jQuery.inArray(ObjData, ObjArr)==-1){//如果-1 在选中时push添加
    					ObjArr.push(ObjData);
    				};
    			}else{
    				if(ObjArr.length<sLimit){
    					_Ele.html("取消选择");
    					if(jQuery.inArray(ObjData, ObjArr)==-1){//如果-1 在选中时push添加
    						ObjArr.push(ObjData);    //ObjData是获取的id，然后push到数组里
    					}
    				}else{
    					alert("您最多选择"+sLimit+"个");
    				};
    			};
    		};
    		$("#MystoreModal").find(".store_num").html("("+ObjArr.length+")");
    	},
 		//(系列事件)
 		trigger: function(element,event){
 			var that = this,
 				$this = $(element);
 			
    		//刷新
    		$(".refreshimgtxt").click(function(){
    			that.storelistinit(that.getstore);
    			$("#MystoreModal .storenameval").val("");
    		});
    		//搜索门店名称
    		$("#MystoreModal .searchstorebtn").undelegate();
    		$('#MystoreModal').delegate('.searchstorebtn','click',function(){
    			var $this = $(this),
    				storename = $(this).prev().val().trim();
    			if(!storename) return alert("请输入门店名");
    	        $("#mystorelist").find(".storeinfo").each(function() {
	    	         var $this = $(this);
	    	         $this.find(".store_title").attr("title").indexOf(storename) > -1 ? $this.show() : $this.hide();
    	        });
    	        $("#MystoreModal .prdpagecount").hide();
    		});
    	    //确认返回事件
 			if($.isFunction(that.settings.backdatainfo)){
 				$("#MystoreModal #mystorelist").undelegate();
	 			$('#MystoreModal #mystorelist').delegate('.selstorebtn','click',function(){
	 				var _t = $(this),
	 					id = _t.attr("data-id"),
	 					name = _t.attr("data-name"),
	 					address = _t.attr("data-address"),
	 					nick = _t.attr("data-nick");
	 				that.storeArray = {"id" : id,"name" :name,"address" :address,"nick" : nick};
	 				if(that.settings.num == 1){
	 					that.settings.backdatainfo($this,that.storeArray);
	 					that.hide();
	 					return false;
	 				};
	 				that.checkedEle(_t,that.storeArray,that.storearr,that.settings.num);
	 			});
	 			if(that.settings.num !== 1){
	 				$(".storesubmit").unbind();
		 			$(".storesubmit").bind("click",function(){
		 				if(that.storearr <= 0) return alert('请选择门店');
		 				var id = "";
 						for(var i = 0;i<that.storearr.length;i++){
 							id += that.storearr[i].id + ",";
 						}
 						$this.attr("data-ids",id);
		 				that.settings.backdatainfo($this,that.storearr);
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
                $.data(this, "plugin_" + pluginName, new selectStore(this, options));			
			}
        });
		return this;
    };
    $.fn[pluginName].noConflict = function () {
        $.fn[pluginName] = old;
        return this
    };
 })(jQuery)
