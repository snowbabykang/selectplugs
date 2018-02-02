var opt_rpacket = {
        current:"",
        total:"",
        pageSize:"",
        totalPage:"",
        cardArray:[],
        curPage:1,

        getcarddata:function(page){
            $.ajax({
                type: 'POST',
                url: selectpacket_url,
                data:{page:page},
                dataType:'json',
                beforeSend:function(){
                    $("#delrpacketlist").html("<div id='loading'>加载中...</div>");
                    $("#myRpacketModal #packetcount").hide();
                },
                success:function(json){
                    if(json.status=="40001"){
                        $("#delrpacketlist").html("<div id='loading'>加载失败...</div>");
                        $("#myRpacketModal #packetcount").hide();
                    }else{
                        $("#myRpacketModal #packetcount").show();
                        opt_rpacket.total = json.count; //总记录数
                        opt_rpacket.pageSize = json.pagenum; //每页显示条数
                        opt_rpacket.curPage = page; //当前页
                        opt_rpacket.totalPage =json.totalPage; //总页数
                        var tr = "";
                        var list = json.result;
                        var tablehead = "<table class='table table-bordered table-striped'><tr><th width='100'>红包名称</th><th width='40'>红包类型</th><th width='40'>可发放数量</th>"
                                +"<th width='70'>红包预算</th><th width='50'>操作</th></tr>"
                        if(list){
                            $.each(list,function(index,array){ //遍历json数据列
                                var expiration ="";
                                var redbag_status = "";
                                if(array['expiration'] == 1){
                                    redbag_status = 1;
                                    expiration = "class='gray'";
                                }
                                tr += "<tr data-id='"+array['id']+"' "+expiration+"><td><span title='"+array['r_name']+"' class='rpname'>"+array['r_name']+"</span></td>"
                                        +"<td>"+array['rtype_chinese']+"</td>"
                                        +"<td>"+array['rcount']+"</td>"
                                        +"<td>"+array['r_budget']+"</td>"
                                        +"<td><span class='btn choice_delrpacket'r data-id='"+array['id']+"' data-title='"+array['r_name']+"' data-num='"+array['rcount']+"' data-budget='"+array['r_budget']+"'  redbag_status='"+redbag_status+"'>选择</span></td>"
                                        +"</tr>";
                            });
                        }else{
                            tr = "<tr><td colspan='7'><span style='line-height:100px;'>暂无红包信息"
                                    +"<a href='{/literal}{$HOST}{literal}/index.php/shangjia/activity/redbagnew' target='_blank' class='btn-link creatrpacket'>  去创建>></a>"
                                    +"<a href='javascript:void(0);' class='btn btn-mini hide refreshrpacket mlr05'>刷新</a></span></td></tr>";
                            $("#myRpacketModal #packetcount").hide();
                        }

                        var tablefoot = "</table>";
                        $("#delrpacketlist").html(tablehead+tr+tablefoot);
                    }
                },
                complete:function(){ //生成分页条
                    opt_rpacket.getPageBar();
                },
                error:function(){
                    alert("数据加载失败");
                }
            });
        },
        getPageBar:function(){
            //页码大于最大页数
            if(opt_rpacket.curPage>opt_rpacket.totalPage) opt_rpacket.curPage=opt_rpacket.totalPage;
            //页码小于1
            if(opt_rpacket.curPage<1) opt_rpacket.curPage=1;
            pageStr = "<span>共"+opt_rpacket.total+"条</span><span>"+opt_rpacket.curPage+"/"+opt_rpacket.totalPage+"</span>";
            //如果是第一页
            if(opt_rpacket.curPage==1){
                pageStr += "<span>首页</span><span>上一页</span>";
            }else{
                pageStr += "<span><a href='javascript:void(0)' rel='1'>首页</a></span><span><a href='javascript:void(0)' rel='"+(opt_rpacket.curPage-1)+"'>上一页</a></span>";
            }
            //如果是最后页
            if(opt_rpacket.curPage>=opt_rpacket.totalPage){
                pageStr += "<span>下一页</span><span>尾页</span>";
            }else{
                pageStr += "<span><a href='javascript:void(0)' rel='"+(parseInt(opt_rpacket.curPage)+1)+"'>下一页</a></span><span><a href='javascript:void(0)' rel='"+opt_rpacket.totalPage+"'>尾页</a></span>";
            }
            $("#myRpacketModal #packetcount").html(pageStr);
        }
    };
    /* 默认点击弹出店铺红包列表选窗 */
    $(".delishoprpacketchoice").live("click",function(){
        /* 需要设置当前存放的位置 */
        opt_rpacket.current = $(this);
        opt_rpacket.getcarddata(1);
        $("#myRpacketModal").modal("show");
    });
    
  //点击选择的事件
    $(".choice_delrpacket").live("click",function(){
        //$(".choice_delrpacket").die();

        var redbag_status = $(this).attr("redbag_status");
        if(redbag_status == '1'){
            alert("该红包已过期，请重新选择！");
            return false;
        }
        var rid = $(this).attr("data-id"),
        rname = $(this).attr("data-title"),
    	rnum = $(this).attr("data-num"),
    	rbudget = $(this).attr("data-budget");
    	var array = {"id" : rid ,"rname" : rname,"rnum" : rnum,"rbudget" : rbudget};
    	var retusn = rpacketchoiceinfo(opt_rpacket.current,array);
    	if(!retusn){
    		$("#myRpacketModal").modal("hide");
    	};
    });
    /* 分页 */
    $("#myRpacketModal #packetcount a").live("click",function(){
        var rel = $(this).attr("rel");
        opt_rpacket.getcarddata(rel);
    });
    $("#delrpacketlist").delegate(".creatrpacket","click",function(){
        $(this).next().show();
    });
    $("#delrpacketlist").delegate(".refreshrpacket","click",function(){
        opt_rpacket.getcarddata(1);
    });