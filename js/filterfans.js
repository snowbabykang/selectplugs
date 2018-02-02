$(document).ready(function(){
	/* 筛选粉丝kx  add */
	 $(".mass_unlimited").click(function(){
		$(this).find(".btn").toggleClass("active");
		$(this).next().find(".masschoice").removeClass("active");
	});
	$(".masschoice").click(function(){
		$(this).parent().prev(".mass_unlimited").find(".btn").removeClass("active");
		var flag = $(this).hasClass("active");
		if(flag){
			$(this).removeClass("active");
		}else{
			$(this).addClass("active");
		}
	});
	$(".sexchoice").click(function(){
		var flag = $(this).hasClass("active");
		if(!flag){
			$(this).addClass("active");
			$(this).siblings().removeClass("active");
		}
	});
	/*清空筛选条件*/
	$(".clearsearch").click(function(){
		var area = $(".filter_area");
		area.find("input[type=text]").val("");
		if(area.find(".j_select_areas")){
			$(".j_select_areas").remove();
			$(".selectedarea").hide().find(".red").html("0");
			cleararea();
		};
		area.find(".sexchoice").removeClass("active");
		area.find(".sexchoice[value=all]").addClass("active");
		area.find(".masschoice").removeClass("active");
		area.find(".mass_unlimited span").removeClass("active");
		area.find(".mass_unlimited span").addClass("active");
		/*area.find(".j_sear_fans_level[value='']").attr("selected","selected");*/
	})
	/*更多选择*/
	$(".morefilter").click(function(){
		$(this).next("table").toggle();
	})
	/*筛选*/
	 $(".filterfans").click(function(){
		 $("#filter_fans").modal("show");
	 })
	 /*确定筛选*/
	 $(".j_search_fans").click(function(){
			var param=getSearchParam();
			$("#filter_fans").modal("hide");
			send_type='search';
			showSendMsg("search");
	 });
});
function showActiveNum(info){
	if(info['active_status']==1){
		$(".j_chat_all_num").html(info['active_all']);
		$(".j_chat_man_num").html(info['active_man']);
		$(".j_chat_woman_num").html(info['active_woman']);
		$(".j_chat_others_num").html(info['active_others']);
	}
}
function addSearchKey(param){
	sessionStorage.setItem(seller_id+'_fans_search_key_2015',JSON.stringify(param));
}
function getSearchParam(){
	var nick=$(".j_fans_nick").val().trim();
	var label=$(".j_label_key").attr("choosed_label").trim();
	var label_name=$(".j_label_key").attr("title");
	var subscribe_start=$(".j_subscribe_s").val().trim();
	var subscribe_end=$(".j_subscribe_e").val().trim();
	var chat_start=$(".j_chat_s").val().trim();
	var chat_end=$(".j_chat_e").val().trim(); 
	
	var level=$(".j_sear_fans_level").val();
	if(level){
		var level_name=$(".j_sear_fans_level").find("option[value='"+level+"']").html();
	}else{
		var level_name='';
	} 
	var sex='';
	$(".j_sex").each(function(){
		if($(this).hasClass("active")){
			sex=$(this).attr("value");
		}
	});
	var mass='';
	$(".j_mass_count ").each(function(key){
		if($(this).hasClass('active')){
			mass+=mass?(";"+$(this).attr("value")):$(this).attr("value");
		}
	});
	var province=$(".j_select_areas").attr("p_id");
	var city=$(".j_select_areas").attr("c_id"); 
	var p_c_name=$(".j_select_areas").attr("title");  
	var fee_start=$(".j_order_fee_s").val().trim();
	var fee_end=$(".j_order_fee_e").val().trim();
	
	var ordernum_start=$(".j_order_num_s").val().trim();
	var ordernum_end=$(".j_order_num_e").val().trim();
	
	var active_start=$(".j_active_s").val().trim();
	var active_end=$(".j_active_e").val().trim(); 
	var param={
			nick:nick,
			fee_start:fee_start,
			fee_end:fee_end,
			ordernum_start:ordernum_start,
			ordernum_end:ordernum_end,
			label:label,
			label_name:label_name,
  			subscribe_start:subscribe_start,
			subscribe_end:subscribe_end, 
			chat_start:chat_start,
			chat_end:chat_end,  
			level:level,
			level_name:level_name,
			sex:sex,
			mass:mass,
			province:province,
			city:city,
			p_c_name:p_c_name,
			subscribe:1,
			active_start:active_start,
			active_end:active_end,
	};
	addSearchKey(param); 
	return param;
}
