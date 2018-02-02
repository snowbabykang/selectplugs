var opt_card = {
	current:"",
	total:"",
	pageSize:"",
	totalPage:"",
	cardArray:[],
	curPage:1,

	getcarddata:function(page){

		$.ajax({
			type: 'POST',
			url: selectcard_url,
			data:{page:page},
			dataType:'json',
			beforeSend:function(){
				$("#delcardlist").html("<div id='loading'>加载中...</div>");
				$("#myDelcardModal #cardpagecount").hide();
			},
			success:function(json){
				if(json.status=="40001"){
					$("#delcardlist").html("<div id='loading'>加载失败...</div>");
					$("#myDelcardModal #cardpagecount").hide();
				}else{
					$("#myDelcardModal #cardpagecount").show();
					opt_card.total = json.count; //总记录数
					opt_card.pageSize = json.pagenum; //每页显示条数
					opt_card.curPage = page; //当前页
					opt_card.totalPage =json.totalPage; //总页数
					var tr = "";
					var award = "";
					var card_type = "";
					var list = json.result;
					var tablehead = "<table class='table table-bordered table-striped'><tr><th width='100'>功能卡名称</th><th width='40'>面值</th><th width='40'>数量</th>"
					+"<th width='70'>有效期</th><th width='45'>类型</th><th width='55'>查看</th><th width='100'>备注</th><th width='50'>操作</th></tr>"
					if(list){
						$.each(list,function(index,array){ //遍历json数据列
							if(array['group_type2'] == 1){
								card_type = "提货卡";
								award = "<span class='btn-link lookselectedprd'>查看商品</span>";
							}else if(array['group_type2'] == 2){
								card_type = "储值卡";
								award = "-- -- ";
							}else if(array['group_type2'] == 3){
								card_type = "积分卡";
								award = "-- -- ";
							}else{
								card_type = "--";
								award = "-- -- ";
							}
							tr += "<tr data-id='"+array['group_id']+"'><td><span title='"+array['group_name']+"' class='cardname'>"+array['group_name']+"</span></td>"
							+"<td>"+array['group_parvalue']+"</td>"
							+"<td>"+array['group_quantity']+"</td>"
							+"<td>"+array['group_valid']+"</td>"
							+"<td>"+card_type+"</td>"
							+"<td data-ids="+array['prdid']+">"+award+"</td>"
							+"<td><span title='"+array['group_remark']+"' class='cardmark'>"+array['group_remark']+"</span></td>"
							+"<td><span class='btn choice_delcard' data-id='"+array['group_id']+"' data-title='"+array['group_name']+"' data-val='"+array['group_parvalue']+"' data-num='"+array['group_quantity']+"'>选择</span></td>"
							+"</tr>";
						});
					}else{
						tr = "<tr><td colspan='7'><span style='line-height:100px;'>暂无功能卡信息"
							+"<a href='{/literal}{$HOST}{literal}/index.php/shangjia/cardgroup/add' target='_blank' class='btn-link creatcard'>  去创建>></a>"
							+"<a href='javascript:void(0);' class='btn btn-mini hide refreshcard mlr05'>刷新</a></span></td></tr>";
						$("#myDelcardModal #cardpagecount").hide();
					}
					
					var tablefoot = "</table>";   
					$("#delcardlist").html(tablehead+tr+tablefoot);
				}
			},
			complete:function(){ //生成分页条
				opt_card.getPageBar(); 
			},
			error:function(){
				alert("数据加载失败");
			}
		}); 
	},
	getPageBar:function(){
		//页码大于最大页数
		if(opt_card.curPage>opt_card.totalPage) opt_card.curPage=opt_card.totalPage;
		//页码小于1
		if(opt_card.curPage<1) opt_card.curPage=1;
		pageStr = "<span>共"+opt_card.total+"条</span><span>"+opt_card.curPage+"/"+opt_card.totalPage+"</span>";
		//如果是第一页
		if(opt_card.curPage==1){
			pageStr += "<span>首页</span><span>上一页</span>";
		}else{
			pageStr += "<span><a href='javascript:void(0)' rel='1'>首页</a></span><span><a href='javascript:void(0)' rel='"+(opt_card.curPage-1)+"'>上一页</a></span>";
		}
		//如果是最后页
		if(opt_card.curPage>=opt_card.totalPage){
			pageStr += "<span>下一页</span><span>尾页</span>";
		}else{
			pageStr += "<span><a href='javascript:void(0)' rel='"+(parseInt(opt_card.curPage)+1)+"'>下一页</a></span><span><a href='javascript:void(0)' rel='"+opt_card.totalPage+"'>尾页</a></span>";
		}
		$("#myDelcardModal #cardpagecount").html(pageStr);
	},
	idsajax:function(ids){
		$.ajax({
			type: 'POST',

			url: selectcardinfo_url,

			data: {"ids":ids},
			dataType:'json',
			async : false, 
			success:function(json){
				opt_card.cardArray = json;
			},
			error:function(){
				alert("数据加载失败");
			}
		});
		return opt_card.cardArray;
	},
};


$(".lookselectedprd").live("click",function(){
	var ids = $(this).parent().data("ids");
	opt_card.idsajax(ids);
	var prehtml = "";
	var aLen=opt_card.cardArray.length;
	if(aLen>0){
		for(var i=0;i<aLen;i++)	{ 
			var dataid = opt_card.cardArray[i]['dataid'];
			var prd = opt_card.cardArray[i]['prd'];
			var pic = opt_card.cardArray[i]['pic'];
			var title = opt_card.cardArray[i]['title'];
			var price = opt_card.cardArray[i]['price'];
			prehtml += "<li data-id='"+dataid+"'>"
						+"<a href='"+prd+"'>"
						+"<div class='prdinfo'>"
						+"<div class='pic'><img src='"+pic+"'></div>"
						+"<div class='prd-des'>"
						+"<p class='title'>"+title+"</p>"
						+"<p class='price'>"+price+"</p></div>"
						+"</div>"
						+"</a></li>";
		};
	};
	$("#selectedprdlist ul").html(prehtml);
	$("#selectedPrdModal").modal("show");
});
/* 默认点击弹出提货卡选窗 */
$(".delicardchoice").live("click",function(){
	opt_card.current = $(this);
	opt_card.getcarddata(1);
	$("#myDelcardModal").modal("show");
});
/* 确认选择 */
$(".choice_delcard").live("click",function(){
	/* 定义当前存放内容 */
	//$(".choice_delcard").die();
	var cardid = $(this).attr("data-id"),
	cardname = $(this).attr("data-title"),
	cardval = $(this).attr("data-val"),
	cardnum = $(this).attr("data-num");
	var array = {"id" : cardid ,"cardname" : cardname,"cardval" : cardval,"cardnum" : cardnum};
	var retusn = delicardchoiceinfo(opt_card.current,array);
	if(!retusn){
		$("#myDelcardModal").modal("hide");
	};
});
/* 分页 */
$("#myDelcardModal #cardpagecount a").live("click",function(){
	var rel = $(this).attr("rel");
	console.log(rel);
	opt_card.getcarddata(rel);
});
$("#delcardlist").delegate(".creatcard","click",function(){
	$(this).next().show();
});
$("#myDelcardModal").delegate(".newcard","click",function(){
	$(this).next().show();
});
$("#myDelcardModal").delegate(".refreshcard","click",function(){
	opt_card.getcarddata(1);
});