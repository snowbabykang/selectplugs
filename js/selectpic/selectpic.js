var opt_pic = {
	total:"",
	pageSize:"",
	totalPage:"",
	curPage:1,
	picArray:[],
	mark:"",
	spec:"",
	num:"",
	current:"",
	localid:"",
	getallalbums:MAINHOST+"/index.php/shangjia/commoncomponent/getallalbums", //获取商家的所有微相册 
	getsinglealbumpic:MAINHOST+ "/index.php/shangjia/commoncomponent/getsinglealbumpic",//获取单个相册下的图片 
	getlocalimgurl : MAINHOST+ "/index.php/shangjia/picture/grabpic",   //根据外部图片链接生成获取内部链接
	/*替换图片链接*/
	replaceimg : function(url,type){
		if(type == "1"){
			var str = url.indexOf("http://img.midite.com/");
			if(str >= 0){
				url =url.replace(/\http:\/\/img.midite.com\//g, "http:\/\/img1.midite.com\/");
			}
			return url;
		}else if(type == "2"){
			var str = url.indexOf("http://img1.midite.com/");
			if(str >= 0){
				url =url.replace(/\http:\/\/img1.midite.com\//g, "http:\/\/img.midite.com\/");
			}
			return url;
		}
	},
	/*获取所有相册*/
	piclist:function(title){
		$.ajax({
			type: 'POST',
			url: opt_pic.getallalbums,
			data: {'title':title},
			dataType:'json',
			async:false,
			beforeSend:function(){
				$("#albumlist").html("<div id='loading'>加载中...</div>");
			},
			success:function(json){
				var html = template('album_list', json);
				document.getElementById("albumlist").innerHTML = html;
			}
		});
	},
	/*获取相册下的图片*/
	albumpic:function(page,id){
		$.ajax({
			type: 'POST',
			url: opt_pic.getsinglealbumpic,
			data: {'page':page,'id':id},
			dataType:'json',
			beforeSend:function(){
				$("#mypiclist").html("<div class='nonedata'>加载中...</div>");
			},
			success:function(json){
               	var max_num=json.max_num;
				    max_num=parseInt(max_num);
				if(max_num<=json.count){
					
					$("#uploader").css('display','none');
				}else{
					
					$("#uploader").css('display','block');
				}
				//限制的数量
				var num = parseInt(json.max_num) - parseInt(json.count);
				if(num >= 20){
					num = 20;
				}else if(num <= 0){
					num = 0;
				}else{
					num = num;
				}
				albumnum = num;
				albumId = id;
				if(uploader.options){
					uploader.options.formData.album = albumId;
					uploader.options.fileNumLimit = num;
					uploader.options.fileSizeLimit = num * 2 * 1024 * 1024; 
				}
				if(json.count==0){
					$("#mypiclist").html("<div class='nonedata'>没有数据...</div>");
					$("#picpagebar").hide();
				}else{	
					if(json.count<=json.pagenum){
						$("#picpagebar").hide();
					}else{
						$("#picpagebar").show();
					}
					opt_pic.total = json.count; //总记录数
					opt_pic.pageSize = json.pagenum; //每页显示条数
					opt_pic.curPage = page; //当前页
					opt_pic.totalPage =json.countpage; //总页数
					var html = template('mypic_list', json);
					html = opt_pic.replaceimg(html,1);
					document.getElementById("mypiclist").innerHTML = html;
					var len=opt_pic.picArray.length;
					if(len>0){
						for(var i=0;i<len;i++)	{ 
							var pic_url = opt_pic.picArray[i];
							  $("#mypiclist").find("li").each(function(){
									var url = $(this).attr("url");
									url = opt_pic.replaceimg(url,1);
									if(pic_url == url){
										$("#mypiclist").find("li[url='"+pic_url+"']").addClass("active");
									}
							}); 
						};
					};
		        	$("#albumlist").find("li.active").find("code").html(opt_pic.total);
				};
			},
			complete:function(){ //生成分页条
				opt_pic.getPageBar(); 
				$("#picpagebar").html(pageStr);
			},
			error:function(){
				$("#mypiclist").html("<div class='nonedata'>数据加载失败</div>");
			}
		});
	},
	/*获取分页*/
	getPageBar:function(){
		//页码大于最大页数
		if(opt_pic.curPage>opt_pic.totalPage) opt_pic.curPage=opt_pic.totalPage;
		//页码小于1
		if(opt_pic.curPage<1) opt_pic.curPage=1;
		pageStr = "<span>共"+opt_pic.total+"条</span><span>"+opt_pic.curPage+"/"+opt_pic.totalPage+"</span>";
		
		//如果是第一页
		if(opt_pic.curPage==1){
			pageStr += "<span>首页</span><span>上一页</span>";
		}else{
			pageStr += "<span><a href='javascript:void(0)' rel='1'>首页</a></span><span><a href='javascript:void(0)' rel='"+(opt_pic.curPage-1)+"'>上一页</a></span>";
		}
		
		//如果是最后页
		if(opt_pic.curPage>=opt_pic.totalPage){
			pageStr += "<span>下一页</span><span>尾页</span>";
		}else{
			pageStr += "<span><a href='javascript:void(0)' rel='"+(parseInt(opt_pic.curPage)+1)+"'>下一页</a></span><span><a href='javascript:void(0)' rel='"+opt_pic.totalPage+"'>尾页</a></span>";
		}
	},
	/*点击分页获取商品列表*/
	ajaxPage:function(id){
		$("#picpagebar span a").live('click',function(){
			var rel = $(this).attr("rel");
			if(rel){
				opt_pic.albumpic(rel,id);
			} 
		});	
	},
	/*移除数组中符合dataid的某个属性的元素*/
	attrIndexOf:function(target, list) {
	    var i = 0, l = list.length;
	    for (i = 0; i < l; i += 1) {
	        if (list[i]["picurl"] == target) {
	            return i;
	        }
	    };
	    return -1;
	},
	removeItem:function(ObjArr,id) {
	    var pos = opt_pic.attrIndexOf(id, ObjArr);
	    if (pos !== -1) {
	    	ObjArr.splice(pos, 1);
	    };
	},
	/*选择商品时，查看是无重添加数组还是移除数组某项*/
	checkedEle:function(_Ele,ObjData,ObjArr,sLimit){
		if(_Ele.hasClass("active")){
			_Ele.removeClass("active");
			var url = _Ele.attr("url");
			opt_pic.removeItem(ObjArr,url);
		}else{ 
			if(sLimit == 0){
				_Ele.addClass("active");
				if(jQuery.inArray(ObjData, ObjArr)==-1){//如果-1 在选中时push添加
					ObjArr.push(ObjData); 
				}  
			}else{
				if(ObjArr.length<sLimit){ 
					_Ele.addClass("active");
					if(jQuery.inArray(ObjData, ObjArr)==-1){//如果-1 在选中时push添加
						ObjArr.push(ObjData);    //ObjData是获取的id，然后push到数组里
					} 
				}else{
					alert("您最多选择"+sLimit+"个");
				}
			}
		}; 
	}
}
$(document).ready(function(){
	/*选择图片*/
	$(".selectimage").live("click",function(){
		opt_pic.piclist();
		opt_pic.mark = $(this).data("mark");
		opt_pic.num = $(this).attr("data-num");
		if(!opt_pic.num){
			opt_pic.num = 1;
		}
		$("#albumlist").find("li").removeClass("active");
		$(".interimg").val("");
		opt_pic.picArray.splice(0,opt_pic.picArray.length);
		$("#picpagebar span a").die("click");
		/*记录上一次点击在哪个分类下，不刷新页面的情况下还是进入那个分类*/
		if(opt_pic.localid){
			$("#albumlist").find("li[data-id="+opt_pic.localid+"]").addClass("active");
		}else{
			$("#albumlist").find("ul>li:first-child").addClass("active");
			opt_pic.localid = $("#albumlist").find("ul>li:first-child").data("id");
		}
		opt_pic.albumpic(1,opt_pic.localid);
		opt_pic.ajaxPage(opt_pic.localid);
		opt_pic.current = $(this);
		if(opt_pic.mark == "chat"){  //客服聊天
			$("#myPicModal").removeClass("hide");
		};
		 $("#myPicModal").modal("show"); 
	});
	/*获取相册下的图片*/
	$("#albumlist").delegate("li","click",function(){
		$("#albumlist").find("li").removeClass("active");//将所有选项置为未选中
	    $(this).addClass("active");
		var id = $(this).data("id");
		opt_pic.localid = id;
		$("#picpagebar span a").die("click");
		opt_pic.albumpic(1,id);
		opt_pic.ajaxPage(id);
	});
	$("#mypiclist").delegate("li","click",function(){ 
		var _t = $(this);
		var pic = _t.attr("url");
		pic = opt_pic.replaceimg(pic,2);
		var rel = _t.attr("rel");
		var title = _t.find(".imgtitle").attr("title");
		var picarr = [];
		picarr["picurl"] = pic;
		picarr["rel"] = rel;
		picarr["title"] = title;
		if(opt_pic.num == 1){
			picbackinfo(opt_pic.current,picarr);
			$("#myPicModal").modal("hide");
		}else{
			opt_pic.checkedEle(_t,picarr,opt_pic.picArray,opt_pic.num);
			//console.log(opt_pic.picArray);
		}
	});
	/*搜索功能*/
	$(".salbumbtn").live("click",function(){
		var val = $(this).prev().val();
		opt_pic.piclist(val);
	});
	$('.searchalbum').live('keyup change', function(ev) { 
        var val = $(this).val();  
		if(event.keyCode ==13){
			opt_pic.piclist(val);
		}
    });
	/*如果选择多张图片，点击确定*/
	$(".picsubmit").live("click",function(){
		var len=opt_pic.picArray.length;
		if(len>0){
			picbackinfo(opt_pic.current,opt_pic.picArray);
			$("#myPicModal").modal("hide");
		}else{
			alert("请选择图片");
			return false;
		};
	});
	//添加外部链接
	$(".addexternalimg").click(function(){
		var img = $(this).prev().val();
		var infop = $(this).parent().next(".red");
		if(img){
			$.ajax({
				type: 'POST',
				url: opt_pic.getlocalimgurl,
				data: {'img_link':img},
				success:function(data){
					var data = eval("("+data+")");
					if(data.code == 1){
						infop.show().html(data.msg);
						return false;
					}else{
						infop.hide();
						var picarr = [];
						picarr["picurl"] = data.msg;
						picarr["rel"] = "";
						picarr["title"] = "外部图片";
						picbackinfo(opt_pic.current,picarr);
						$("#myPicModal").modal("hide");
					};
				},
			});
		}else{
			$(this).prev().focus();
			infop.show().html("请输入外部图片链接");
		}
	});
});
