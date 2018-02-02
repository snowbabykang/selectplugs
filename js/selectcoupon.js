var opt_coupon = {
	current:"",
	type:"",
	total:"",
	pageSize:"",
	totalPage:"",
	couponArray:[],
	couponarr:[],
	curPage:1,
	getcoupondata:function(page,type){
		$.ajax({
			type: 'POST',
			url: selectcoupon_url,
			data:{page:page},
			dataType:'json',
			beforeSend:function(){
				$("#mycouponlist").html("<div id='loading'>加载中...</div>");
				$("#mycouponModal #mycouponpage").hide();
			},
			success:function(json){
				if(json.status=="40001"){
					$("#mycouponlist").html("<div id='loading'>加载失败...</div>");
					$("#mycouponModal #mycouponpage").hide();
				}else{
					$("#mycouponModal #mycouponpage").show();
					opt_coupon.total = json.totalnum; //总记录数
					opt_coupon.pageSize = json.pagenum; //每页显示条数
					opt_coupon.curPage = page; //当前页
					opt_coupon.totalPage =json.totalpage; //总页数
					var tr = "";
					var list = json.result;
					var tablehead = "<table class='table table-bordered table-striped'><tr><th width='100'>优惠券名称</th><th width='40'>优惠金额</th><th width='100'>过期时间</th>"
						+"<th width='40'>领取数量/数量</th><th width='50'>操作</th></tr>"
					if(opt_coupon.total > 0){
						if(list){
							$.each(list,function(index,array){ //遍历json数据列
								tr += "<tr data-id='"+array['id']+"'><td><span title='"+array['group_name']+"' class='couponname'>"+array['group_name']+"</span></td>"
								+"<td>"+array['group_parvalue']+"</td>"
								+"<td>"+array['group_etime']+"</td>"
								+"<td>"+array['drawNum']+'/'+array['group_quantity']+"</td>";
								if(type == "radio"){
									tr+="<td><span class='btn coupon_submit' data-id='"+array['id']+"' data-name='"+array['group_name']+"' data-value='"+array['group_parvalue']+"' data-num='"+array['group_quantity']+"' data-time='"+array['group_etime']+"'>选择</span></td></tr>";
								}else if(type =="checkbox"){
									tr+="<td><label class='coupon_checkbox' data-id='"+array['id']+"' data-name='"+array['group_name']+"' data-value='"+array['group_parvalue']+"' data-num='"+array['group_quantity']+"' data-time='"+array['group_etime']+"'><input type='checkbox' name='couponcheck'></label></td></tr>";
								}
							});
						}
					}else{
						tr = "<tr><td colspan='5'><span style='line-height:100px;'>暂无优惠券信息"
							+"<a href='{/literal}{$HOST}{literal}/index.php/shangjia/coupon/newcoupons' target='_blank' class='btn-link creatcoupon'>  去创建>></a>"
							+"<a href='javascript:void(0);' class='btn btn-mini hide refreshcoupon mlr05'>刷新</a></span></td></tr>";
						$("#mycouponModal #mycouponpage").hide();
					}
					var tablefoot = "</table>";   
					$("#mycouponlist").html(tablehead+tr+tablefoot);
					if(type =="checkbox"){
						var len=opt_coupon.couponArray.length;
						if(len>0){
							for(var i=0;i<len;i++)	{ 
								var c_id = opt_coupon.couponArray[i]["id"];
								  $("#mycouponlist").find(".coupon_checkbox").each(function(){
										var id = $(this).attr("data-id");
										if(c_id == id){
											$("#mycouponlist").find(".coupon_checkbox[data-id='"+c_id+"']").find("input[type=checkbox]").attr("checked","checked");
										}
								}); 
							};
						};
					};
				}
			},
			complete:function(){ //生成分页条
				opt_coupon.getPageBar(); 
			},
			error:function(){
				$("#mycouponlist").html("数据加载失败");
			}
		}); 
	},
	getPageBar:function(){
		//页码大于最大页数
		if(opt_coupon.curPage>opt_coupon.totalPage) opt_coupon.curPage=opt_coupon.totalPage;
		//页码小于1
		if(opt_coupon.curPage<1) opt_coupon.curPage=1;
		pageStr = "<span>共"+opt_coupon.total+"条</span><span>"+opt_coupon.curPage+"/"+opt_coupon.totalPage+"</span>";
		//如果是第一页
		if(opt_coupon.curPage==1){
			pageStr += "<span>首页</span><span>上一页</span>";
		}else{
			pageStr += "<span><a href='javascript:void(0)' rel='1'>首页</a></span><span><a href='javascript:void(0)' rel='"+(opt_coupon.curPage-1)+"'>上一页</a></span>";
		}
		//如果是最后页
		if(opt_coupon.curPage>=opt_coupon.totalPage){
			pageStr += "<span>下一页</span><span>尾页</span>";
		}else{
			pageStr += "<span><a href='javascript:void(0)' rel='"+(parseInt(opt_coupon.curPage)+1)+"'>下一页</a></span><span><a href='javascript:void(0)' rel='"+opt_coupon.totalPage+"'>尾页</a></span>";
		}
		if(opt_coupon.total > opt_coupon.pageSize){
			$("#mycouponModal #mycouponpage").html(pageStr);
		}
	},
	/* 根据优惠券id获取优惠券信息 */
	getcouponinfo:function(id){
		$.ajax({
			type: 'POST',
			url: selectcouponinfo_url,
			data:{id:id},
			dataType:'json',
			async : false,
			success:function(json){

				opt_coupon.couponarr = json.result;
			}
		}); 
		return opt_coupon.couponarr;
	},
	/*移除数组中符合dataid的某个属性的元素*/
	attrIndexOf:function(target, list) {
	    var i = 0, l = list.length;
	    for (i = 0; i < l; i += 1) {
	        if (list[i]["id"] == target) {
	            return i;
	        }
	    };
	    return -1;
	},
	removeItem:function(ObjArr,id) {
	    var pos = opt_coupon.attrIndexOf(id, ObjArr);
	    if (pos !== -1) {
	    	ObjArr.splice(pos, 1);
	    };
	},
	/*选择商品时，查看是无重添加数组还是移除数组某项*/
	checkedEle:function(_Ele,ObjData,ObjArr,sLimit){
		if(_Ele.attr("checked") !== "checked"){
			var id = _Ele.parent().attr("data-id");
			opt_coupon.removeItem(ObjArr,id);
		}else{ 
			if(sLimit == 0){
				if(jQuery.inArray(ObjData, ObjArr)==-1){//如果-1 在选中时push添加
					ObjArr.push(ObjData); 
				}  
			}else{
				if(ObjArr.length<sLimit){ 
					if(jQuery.inArray(ObjData, ObjArr)==-1){//如果-1 在选中时push添加
						ObjArr.push(ObjData);    //ObjData是获取的id，然后push到数组里
					} 
				}else{
					alert("您最多选择"+sLimit+"个");
				}
			}
		}; 
	}
};
/* 默认点击弹出优惠券选窗 */
$(".couponchoice").live("click",function(){
	opt_coupon.couponArray.splice(0,opt_coupon.couponArray.length);
	$("#coupon_check_confirm").find(".coupon_len").html("");
	/* 默认单选 */
	opt_coupon.type=$(this).attr("coupon-type");
	if(!opt_coupon.type){  
		opt_coupon.type = "radio";
	}
	/* 需要设置当前存放的位置 */
	opt_coupon.current = $(this);
	opt_coupon.getcoupondata(1,opt_coupon.type);
	$("#mycouponModal").modal("show");
});

/* 分页 */
$("#mycouponModal #mycouponpage a").live("click",function(){
	var rel = $(this).attr("rel");
	opt_coupon.getcoupondata(rel,opt_coupon.type);
});
$("#mycouponlist").delegate(".creatcoupon","click",function(){
	$(this).next().show();
});
$("#mycouponModal").delegate(".newcoupon","click",function(){
	$(this).next().show();
});
$("#mycouponModal").delegate(".refreshcoupon","click",function(){
	opt_coupon.getcoupondata(1,opt_coupon.type);
});
/* 单选优惠券 */
$("#mycouponlist").delegate(".coupon_submit","click",function(){
	var id = $(this).data("id");
	var name = $(this).data("name");
	var value = $(this).data("value");
	var num = $(this).data("num");
	var endtime = $(this).data("time");
	opt_coupon.couponArray["id"] = id;
	opt_coupon.couponArray["name"] = name;
	opt_coupon.couponArray["value"] = value;
	opt_coupon.couponArray["num"] = num;
	opt_coupon.couponArray["time"] = endtime;
	var retusn = couponchoiceinfo(opt_coupon.current,opt_coupon.couponArray);
	if(!retusn){
		$("#mycouponModal").modal("hide");
	}
});
/* 多选优惠券 */
$("#mycouponlist").delegate(".coupon_checkbox","click",function(){
	var _t=$(this).find("input[type=checkbox]");
	var id = $(this).data("id");
	var name = $(this).data("name");
	var value = $(this).data("value");
	var num = $(this).data("num");
	var endtime = $(this).data("time");
	var cou_arr = [];
	cou_arr["id"] = id;
	cou_arr["name"] = name;
	cou_arr["value"] = value;
	cou_arr["num"] = num;
	cou_arr["time"] = endtime;
	opt_coupon.checkedEle(_t,cou_arr,opt_coupon.couponArray,0);
	var len = opt_coupon.couponArray.length;
	$("#coupon_check_confirm").find(".coupon_len").html("("+len+")");
});
$("#coupon_check_confirm").click(function(){
	var len=opt_coupon.couponArray.length;
	if(len>0){
		couponchoiceinfo(opt_coupon.current,opt_coupon.couponArray);
		$("#mycouponModal").modal("hide");
	}else{
		alert("请选择优惠券");
		return false;
	};
})