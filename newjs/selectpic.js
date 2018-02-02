/*!
 * selectPic 0.0.1
 * by KANGXUE
 * Copyright 2016.1
 * Date: Thur Feb 25 2016
 * 
 */


 ;(function($){
 	var pluginName = 'selectPic',
 		defaults = {
 			host : "",
 			num : 1,          //选择图片张数，默认选择一张
 			backdatainfo : function(){},
 		};
 	var SelectPic = function(element, options) {
 		this.element = $(element);
 		this.settings = $.extend({}, defaults, options);
        this.element.on({
             'click.selectPic': $.proxy(this.init, this)
         });
         $($.proxy(function() {
             this.element.trigger('create');
         }, this));
     };
 	SelectPic.prototype = {	
		total:"",
		pageSize:"",
		totalPage:"",
		curPage:1,
		localid : "",
		picArray : [],
		albumArr : [],
 		//初始化弹出框
 		init: function(){
 			var that = this,
 				element = this.element;
 			that.getallalbums = that.settings.host+"/index.php/shangjia/commoncomponent/getallalbums"; //获取商家的所有微相册 
 			that.getsinglealbumpic = that.settings.host+ "/index.php/shangjia/commoncomponent/getsinglealbumpic";//获取单个相册下的图片 
 			that.getlocalimgurl = that.settings.host+ "/index.php/shangjia/picture/grabpic"; //根据外部图片链接生成获取内部链接
 			that.render(element);
 			that.initdata(element);
 			that.show();
 			that.trigger(element);
 		},

 		//创建弹出框
 		create: function(element){
 			var that = this,
 				$this = $(element),
 				modalHTML = "";
 			
 			modalHTML = '<div id="myAlbumModal" class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="true">'
				  +'<div class="modal-header" style="padding-bottom: 0;border-bottom: none;">'
				   +'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'
				   +'<h3>选择图片<span class="font12 red mlr05">可以批量上传图片，一次最多能上传20张图片,支持截屏黏贴图片；右侧可以上传本地图片到相册,支持(jpg,png,jpeg,JPG,PNG,JPEG)，不得超过2MB</span></h3>'
				   +'<ul class="nav nav-tabs" style="margin: 0;">'
				   +'<li class="active"><a href="#localimg" data-toggle="tab">图片素材</a></li>'
				   +'<li><a href="#interimg" data-toggle="tab">网络图片</a></li>'
				   +'</ul>'	
				  +'</div>'
				  +'<div class="modal-body m-body" style="height:400px;">'
				  	+'<div class="tab-content">'
				  		+'<div class="tab-pane active" id="localimg">'
						    +'<div class="classifylist fl m-body-l">'
						    	+'<div class="input-append"><input type="text" placeholder="输入相册名称" class="searchalbum"><span class="btn salbumbtn">搜索</span></div>'
						    	+'<div id="catepagelist" class="scrollbar"></div>'
							+'</div>'
							+'<div class="fl m-body-c">'
								+'<div id="myalbumlist" class="scrollbar"></div>'
							 	+'<div class="prdpagecount"></div>'
							+'</div>'
							+'<div id="uploadpic" class="fl scrollbar m-body-r">'
								+'<div id="uploader">'
									+'<div class="queueList scrollbar"><div id="dndArea" class="placeholder"><div id="filePicker"></div></div></div>'
									+'<div class="statusBar" style="display:none;">'
										+'<div class="progress"><span class="text">0%</span><span class="percentage"></span></div><div class="info"></div>'
										+'<div class="btns"><div id="filePicker2"></div><div class="uploadBtn">开始上传</div></div>'
									+'</div>'
								+'</div>'
							+'</div>'
						+'</div>'
						+'<div class="tab-pane" id="interimg">'
							+'<div style="padding: 40px 0 0 40px;">'
								+'<p>输入要添加的图片的网址，然后点击插入图片；<span class="red">只支持后缀为jpg、png、jpeg 的图片</span></p>'
								+'<div class="form-inline">'
									+'<input type="text" style="width:700px;" class="interimg">'
									+'<span class="btn btn-primary addexternalimg">插入图片</span>'
								+'</div>'
								+'<p class="red" style="display: none;"></p>'
							+'</div>'
						+'</div>'
					+'</div>'
				  +'</div>'
				  +'<div class="modal-footer">'
				    +'<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>'
				    +'<button class="btn btn-primary picsubmit">确定<span class="selectednum"></span></button>'
				  +'</div>'
				+'</div>';
			return modalHTML;	
 		},

 		//渲染弹出框    显示弹出层
 		render: function(element){
 			var that = this,
 				$this = $(element),
 				modalHTML = that.create($this);
 			var len = $("body").find("#myAlbumModal").length;
        	if(len <= 0){
        		$('body').append(modalHTML);
        	};
 		},
 		//显示弹出框
 		show: function(){
 			$("#myAlbumModal").modal("show");
 		},

 		//隐藏弹出框
 		hide: function(element){
 			$("#myAlbumModal").modal("hide");
 		},
 		//初始化加载数据
 		initdata: function(element){
 			var that = this,
				$this = $(element);
			$(".interimg").val("");
 			that.albumArr.splice(0,that.albumArr.length);
 			that.getpiclist();
 			/*记录上一次点击在哪个分类下，不刷新页面的情况下还是进入那个分类*/
 			that.localid = $this.attr("data-cateid");
 			if(that.localid){
 				$("#catepagelist").find("li[data-id="+that.localid+"]").addClass("active");
 			}else{
 				$("#catepagelist").find("ul>li:first-child").addClass("active");
 				that.localid = $("#catepagelist").find("ul>li:first-child").attr("data-id");
 			};
 			that.initInfo(that.localid);
 		},
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
 		getpiclist:function(title){
 			var that = this;
 			$.ajax({
 				type: 'POST',
 				url: that.getallalbums,
 				data: {'title':title},
 				dataType:'json',
 				async:false,
 				beforeSend:function(){
 					$("#catepagelist").html("<div class='dataloading'>加载中...</div>");
 				},
 				success:function(json){
 					if(json.status=="40001"){
    					$("#catepagelist").html("");
    				}else{
    					var li = "",list = json.info;
    					$.each(list,function(index,array){ //遍历json数据列
    						li += '<li data-id="'+array['id']+'" title="'+array['album_desc']+'">'+array['name']+'<code>'+array['picture_num']+'</code></li>';
    						if(array['sub'].length > 0){
    							$.each(array['sub'],function(key,arr){
    								li += '<li class="item_sub" data-id="'+arr['id']+'" title="'+array['album_desc']+'" rel="'+array['parent_id']+'">'+arr['name']+'<code>'+arr['picture_num']+'</code></li>';
    							});
    						};
    					});
    					$("#catepagelist").html('<ul>'+li+'</ul>');
    					var keywd = $("#myAlbumModal .searchalbum").val();
						keywd = $.trim(keywd);
						that.hilightEle("#catepagelist",keywd);
    				};
 				}
 			});
 		},
 		/*获取相册下的图片*/
 		getalbumpic:function(page,id){
 			var that = this;
 			$.ajax({
 				type: 'POST',
 				url: that.getsinglealbumpic,
 				data: {'page':page,'id':id},
 				dataType:'json',
 				beforeSend:function(){
 					$("#myalbumlist").html("<div class='dataloading'>加载中...</div>");
 					$("#myAlbumModal .prdpagecount").hide();
 				},
 				success:function(json){
 					if(json.status=="40001"){
    					$("#myalbumlist").html("<div class='datawarn'>登陆超时，请<span class='btn-link' onclick='location.reload();'>刷新</span>页面重新登陆</div>");
    					$("#myAlbumModal .prdpagecount").hide();
 					}else{
 						$("#myalbumlist").empty();
 						//限制的数量
 						var num = parseInt(json.max_num) - parseInt(json.count);
 						if(num >= 20){
 							num = 20;
 						}else if(num <= 0){
 							num = 0;
 						}else{
 							num = num;
 						}
 						var albumnum = num,albumId = id;
 						if(uploader.options){
 							uploader.options.formData.album = albumId;
 							uploader.options.fileNumLimit = num;
 							uploader.options.fileSizeLimit = num * 2 * 1024 * 1024;   
 						}
	 					if(json.count==0){
	 						$("#myalbumlist").html("<div class='datawarn'>没有数据...</div>");
	 	 					$("#myAlbumModal .prdpagecount").hide();
	 					}else{	
	 						if(json.countpage > 1){
    							$("#myAlbumModal .prdpagecount").show();
    							that.total = json.count; //总记录数
    	 						that.pageSize = json.pagenum; //每页显示条数
    	 						that.curPage = page; //当前页
    	 						that.totalPage =json.countpage; //总页数
    						};
 				        	var li = "",list = json.info;
 	    					$.each(list,function(index,array){ 
 	    						li += '<li data-url="'+array['picurl']+'" rel="'+json.albumdir+'" title="'+array['pic_name']+'" data-base="'+array['base64url']+'"><div class="imgboxhidden"><img src="'+array['picurl']+'_180x180.jpg"/></div>'
 	    						+'<span class="imgtitle"  title="'+array['pic_name']+'">'+array['pic_name']+'</span></li>';
 	    					});
 	    					li = that.replaceimg(li,1);
 	    					$("#myalbumlist").html('<ul>'+li+'</ul>');
	 						var len=that.albumArr.length;
	 						if(len>0){
	 							for(var i=0;i<len;i++)	{ 
	 								var pic_url = that.albumArr[i].url;
 								    $("#myalbumlist").find("li").each(function(){
 										var url = $(this).attr("data-url");
 										url = that.replaceimg(url,1);
 										if(pic_url == url){
 											$("#myalbumlist").find("li[data-url='"+pic_url+"']").addClass("active");
 										};
	 								}); 
	 							};
	 						};
	 						var piccount = $("#catepagelist").find("li.active").find("code").html();
	 						if(piccount !== json.count){
	 							$("#catepagelist").find("li.active").find("code").html(json.count);
	 						};
	 					};
    				};
 				},
 				complete:function(){ //生成分页条
 					var pageStr = that.getPageBar();
					$("#myAlbumModal .prdpagecount").html(pageStr);
 				},
 				error:function(){
 					$("#myalbumlist").html("<div class='datawarn'>数据加载失败</div>");
    				$("#myPrdModal .prdpagecount").hide();
 				}
 			});
 		},
    	/*选择图片初始化*/
    	initInfo:function(id){
    		var that = this;
    		$("#myAlbumModal .prdpagecount span a").die("click");
    		that.getalbumpic(1,id);
    		that.ajaxPage(id);  //分页里数据调取
    	},
    	/*点击分页获取图片列表*/
    	ajaxPage:function(id){
    		var that = this;
    		$("#myAlbumModal .prdpagecount span a").live('click',function(){
    			var rel = $(this).attr("rel");
    			if(rel){
    				that.getalbumpic(rel,id);
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
    	/*移除数组中符合baseurl的某个属性的元素*/
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
    	    var pos = that.attrIndexOf(id, ObjArr, 'baseurl');
    	    if (pos !== -1) {
    	    	ObjArr.splice(pos, 1);
    	    };
    	},
    	/*选择图片时，查看是无重添加数组还是移除数组某项*/
    	checkedEle:function(_Ele,ObjData,ObjArr,sLimit){
    		var that = this;
    		if(_Ele.hasClass("active")){
    			_Ele.removeClass("active");
    			var baseurl =_Ele.attr("data-base");
    			that.removeItem(ObjArr,baseurl);
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
    				};
    			};
    		};
    		$("#myAlbumModal").find(".selectednum").html("("+ObjArr.length+")");
    	},
    	/*搜索关键词*/
    	execSearch:function(cur){
    		var that = this,
    			keywd=cur.val();
    		if($.trim(keywd)==""){
    			that.getpiclist();
			}else{
				keywd = $.trim(keywd);
 	    		that.getpiclist(keywd);
    		};
    	},
 		//(系列事件)
 		trigger: function(element,event){
 			var that = this,
	 			num = that.settings.num,
 				$this = $(element);
 			/*获取相册下的图片*/
 			$("#catepagelist").undelegate();
			$("#catepagelist").delegate("li","click",function(e){
				$(this).addClass("active").siblings().removeClass("active");
 				var id = $(this).data("id");
 				that.localid = id;
 				that.initInfo(id);
 			});
 			//选择图片
 			$("#myalbumlist").undelegate();
 			$("#myalbumlist").delegate("li","click",function(e){
    			e.preventDefault();
    			var _t = $(this),
    				title = _t.attr("title"),
    				url = _t.attr("data-url"),
    				baseurl = _t.attr("data-base"),
    				rel = _t.attr("rel");
            	that.picArray = {baseurl:baseurl,rel:rel,url:url,title:title};
            	var catepageid = $("#catepagelist").find("li.active").attr("data-id");
            	if(num == 1){
            		$this.attr("data-cateid",catepageid);
            		that.settings.backdatainfo($this,that.picArray);
            		that.hide();
            		return false;
            	};
            	that.checkedEle(_t,that.picArray,that.albumArr,num);
    		});
    		//搜索
    		$("#myAlbumModal .salbumbtn").die();
    		$("#myAlbumModal .salbumbtn").click(function(){
    			var cur = $(this).prev(".searchalbum");
				that.execSearch(cur);
    		});
    		$('#myAlbumModal .searchalbum').live('keyup change', function(event) {
    	        var searchTerm = $(this).val();
    	        searchTerm = $.trim(searchTerm);
    	        if(searchTerm){
    	        	that.hilightEle("#catepagelist",searchTerm);
    	        };
    			if(event.keyCode ==13){
    				that.execSearch($(this));
    			};
    	    });
    	    //确认返回事件
 			if($.isFunction(that.settings.backdatainfo)){
 				$("#myAlbumModal .picsubmit").unbind();
	 			$('#myAlbumModal .picsubmit').on('click',function(){
	 				var catepageid = $("#catepagelist").find("li.active").attr("data-id");
	 				$this.attr("data-cateid",catepageid);
	 				that.settings.backdatainfo($this,that.albumArr);
	 				that.hide();
	 			});
 			};
 			//添加外部链接
 			$(".addexternalimg").click(function(){
 				var img = $(this).prev().val();
 				var infop = $(this).parent().next(".red");
 				if(img){
 					$.ajax({
 						type: 'POST',
 						url: that.getlocalimgurl,
 						data: {'img_link':img},
 						success:function(data){
 							var data = eval("("+data+")");
 							if(data.code == 1){
 								infop.show().html(data.msg);
 								return false;
 							}else{
 								infop.hide();
 								that.picArray = {baseurl:"",rel:"",url:data.msg,title:"外部图片"};
 								that.settings.backdatainfo($this,that.picArray);
 			            		that.hide();
 							};
 						},
 					});
 				}else{
 					$(this).prev().focus();
 					infop.show().html("请输入外部图片链接");
 				}
 			});
 			that.webuploader();
 	},
 	webuploader : function(){
 		var that = this;
 		var $wrap = $('#uploader'),
    	$code = "",    //后端判断上传数量是否超出限制
        // 图片容器
        $queue = $wrap.find('.queueList').find(".filelist").length <= 0 ? $( '<ul class="filelist"></ul>').appendTo( $wrap.find( '.queueList' ) ) : $wrap.find( '.filelist' ),

        // 状态栏，包括进度和控制按钮
        $statusBar = $wrap.find( '.statusBar' ),

        // 文件总体选择信息。
        $info = $statusBar.find( '.info' ),

        // 上传按钮
        $upload = $wrap.find( '.uploadBtn' ),

        // 没选择文件之前的内容。
        $placeHolder = $wrap.find( '.placeholder' ),

        $progress = $statusBar.find( '.progress' ).hide(),

        // 添加的文件数量
        fileCount = 0,

        // 添加的文件总大小
        fileSize = 0,

        // 优化retina, 在retina下这个值是2
        ratio = window.devicePixelRatio || 1,

        // 缩略图大小
        thumbnailWidth = 110 * ratio,
        thumbnailHeight = 110 * ratio,

        // 可能有pedding, ready, uploading, confirm, done.
        state = 'pedding',

        // 所有文件的进度信息，key为file id
        percentages = {},
        // 判断浏览器是否支持图片的base64
        isSupportBase64 = ( function() {
            var data = new Image();
            var support = true;
            data.onload = data.onerror = function() {
                if( this.width != 1 || this.height != 1 ) {
                    support = false;
                }
            }
            data.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            return support;
        } )(),

        // 检测是否已经安装flash，检测flash的版本
        flashVersion = ( function() {
            var version;

            try {
                version = navigator.plugins[ 'Shockwave Flash' ];
                version = version.description;
            } catch ( ex ) {
                try {
                    version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
                            .GetVariable('$version');
                } catch ( ex2 ) {
                    version = '0.0';
                }
            }
            version = version.match( /\d+/g );
            return parseFloat( version[ 0 ] + '.' + version[ 1 ], 10 );
        } )(),

        supportTransition = (function(){
            var s = document.createElement('p').style,
                r = 'transition' in s ||
                        'WebkitTransition' in s ||
                        'MozTransition' in s ||
                        'msTransition' in s ||
                        'OTransition' in s;
            s = null;
            return r;
        })(),

        // WebUploader实例
        uploader;
	    $statusBar.hide();
	    $placeHolder.show().removeClass("element-invisible");
	    $wrap.find( '.filelist').html("");
	    if ( !WebUploader.Uploader.support('flash') && WebUploader.browser.ie ) {
	
	        // flash 安装了但是版本过低。
	        if (flashVersion) {
	            (function(container) {
	                window['expressinstallcallback'] = function( state ) {
	                    switch(state) {
	                        case 'Download.Cancelled':
	                            alert('您取消了更新！')
	                            break;
	
	                        case 'Download.Failed':
	                            alert('安装失败')
	                            break;
	
	                        default:
	                            alert('安装已成功，请刷新！');
	                            break;
	                    }
	                    delete window['expressinstallcallback'];
	                };
	
	                var swf = './expressInstall.swf';
	                // insert flash object
	                var html = '<object type="application/' +
	                        'x-shockwave-flash" data="' +  swf + '" ';
	
	                if (WebUploader.browser.ie) {
	                    html += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
	                }
	
	                html += 'width="100%" height="100%" style="outline:0">'  +
	                    '<param name="movie" value="' + swf + '" />' +
	                    '<param name="wmode" value="transparent" />' +
	                    '<param name="allowscriptaccess" value="always" />' +
	                '</object>';
	
	                container.html(html);
	
	            })($wrap);
	
	        // 压根就没有安转。
	        } else {
	            $wrap.html('<a href="http://www.adobe.com/go/getflashplayer" target="_blank" border="0"><img alt="get flash player" src="http://www.adobe.com/macromedia/style_guide/images/160x41_Get_Flash_Player.jpg" /></a>');
	        }
	
	        return;
	    } else if (!WebUploader.Uploader.support()) {
	        alert( 'Web Uploader 不支持您的浏览器！');
	        return;
	    };
	    // 实例化
	    uploader = WebUploader.create({
	        pick: {
	            id: '#filePicker',
	            label: '本地上传图片'
	        },
	        formData: {
	        	'is_weialbum': 1,
	            'album': 2771
	        },
	        dnd: '#dndArea',
	        paste: '#uploader',
	        compress :false,
	        swf: that.settings.host+'/webuploader/dist/Uploader.swf',
	        chunked: false,
	        chunkSize: 512 * 1024,
	        server: that.settings.host+'/uploadify/UploadImg.php',
	        // 只允许选择图片文件。
	        accept: {
	            title: 'Images',
	            extensions: 'jpg,jpeg,bmp,png',
	            mimeTypes: 'image/*'
	        },
	        // 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
	        disableGlobalDnd: true,
	        fileNumLimit: 200,
	        fileSizeLimit: 200 * 2 * 1024 * 1024,   
	        fileSingleSizeLimit: 2 * 1024 * 1024    // 2 M
	    });
	    uploader.on( 'uploadSuccess', function( file,ret ) {
	    	$code = ret.code;
	    	if(ret.code == 0){
	        	var currentid = $("#catepagelist").find("li.active").data("id");
	        	that.initInfo(currentid);
	    	}
	    });
	    // 拖拽时不接受 js, txt 文件。
	    uploader.on( 'dndAccept', function( items ) {
	        var denied = false,
	            len = items.length,
	            i = 0,
	            // 修改js类型
	            unAllowed = 'text/plain;application/javascript ';
	
	        for ( ; i < len; i++ ) {
	            // 如果在列表里面
	            if ( ~unAllowed.indexOf( items[ i ].type ) ) {
	                denied = true;
	                break;
	            }
	        }
	
	        return !denied;
	    });
	    // 添加“添加文件”的按钮，
	    uploader.addButton({
	        id: '#filePicker2',
	        label: '继续添加'
	    });
	    uploader.on('ready', function() {
	        window.uploader = uploader;
	    });
	
	    // 当有文件添加进来时执行，负责view的创建
	    function addFile( file ) {
	        var $li = $( '<li id="' + file.id + '">' +
	                '<p class="title">' + file.name + '</p>' +
	                '<p class="imgWrap"></p>'+
	                '<p class="progress"><span></span></p>' +
	                '</li>' ),
	
	            $btns = $('<div class="file-panel">' +
	                '<span class="cancel">删除</span>' +
	                '<span class="rotateRight">向右旋转</span>' +
	                '<span class="rotateLeft">向左旋转</span></div>').appendTo( $li ),
	            $prgress = $li.find('p.progress span'),
	            $wrap = $li.find( 'p.imgWrap' ),
	            $info = $('<p class="error"></p>'),
	
	            showError = function( code ) {
	                switch( code ) {
	                    case 'exceed_size':
	                        text = '文件大小超出';
	                        break;
	
	                    case 'interrupt':
	                        text = '上传暂停';
	                        break;
	
	                    default:
	                        text = '上传失败，请重试';
	                        break;
	                }
	
	                $info.text( text ).appendTo( $li );
	            };
	
	        if ( file.getStatus() === 'invalid' ) {
	            showError( file.statusText );
	        } else {
	            // @todo lazyload
	            $wrap.text( '预览中' );
	            uploader.makeThumb( file, function( error, src ) {
	                var img;
	
	                if ( error ) {
	                    $wrap.text( '不能预览' );
	                    return;
	                }
	
	                if( isSupportBase64 ) {
	                    img = $('<img src="'+src+'">');
	                    $wrap.empty().append( img );
	                } else {
	                    $.ajax('../../server/preview.php', {
	                        method: 'POST',
	                        data: src,
	                        dataType:'json'
	                    }).done(function( response ) {
	                        if (response.result) {
	                            img = $('<img src="'+response.result+'">');
	                            $wrap.empty().append( img );
	                        } else {
	                            $wrap.text("预览出错");
	                        }
	                    });
	                }
	            }, thumbnailWidth, thumbnailHeight );
	
	            percentages[ file.id ] = [ file.size, 0 ];
	            file.rotation = 0;
	        }
	
	        file.on('statuschange', function( cur, prev ) {
	            if ( prev === 'progress' ) {
	                $prgress.hide().width(0);
	            } else if ( prev === 'queued' ) {
	                $li.off( 'mouseenter mouseleave' );
	                $btns.remove();
	            }
	
	            // 成功
	            if ( cur === 'error' || cur === 'invalid' ) {
	                showError( file.statusText );
	                percentages[ file.id ][ 1 ] = 1;
	            } else if ( cur === 'interrupt' ) {
	                showError( 'interrupt' );
	            } else if ( cur === 'queued' ) {
	                percentages[ file.id ][ 1 ] = 0;
	            } else if ( cur === 'progress' ) {
	                $info.remove();
	                $prgress.css('display', 'block');
	            } else if ( cur === 'complete' ) {
	                $li.append( '<span class="success"></span>' );
	            }
	
	            $li.removeClass( 'state-' + prev ).addClass( 'state-' + cur );
	        });
	
	        $li.on( 'mouseenter', function() {
	            $btns.stop().animate({height: 30});
	        });
	
	        $li.on( 'mouseleave', function() {
	            $btns.stop().animate({height: 0});
	        });
	
	        $btns.on( 'click', 'span', function() {
	            var index = $(this).index(),
	                deg;
	
	            switch ( index ) {
	                case 0:
	                    uploader.removeFile( file );
	                    $("#dndArea").show();
	                    return;
	
	                case 1:
	                    file.rotation += 90;
	                    break;
	
	                case 2:
	                    file.rotation -= 90;
	                    break;
	            }
	
	            if ( supportTransition ) {
	                deg = 'rotate(' + file.rotation + 'deg)';
	                $wrap.css({
	                    '-webkit-transform': deg,
	                    '-mos-transform': deg,
	                    '-o-transform': deg,
	                    'transform': deg
	                });
	            } else {
	                $wrap.css( 'filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ (~~((file.rotation/90)%4 + 4)%4) +')');
	            }
	        });
	
	        $li.appendTo( $queue );
	    }
	
	    // 负责view的销毁
	    function removeFile( file ) {
	        var $li = $('#'+file.id);
	
	        delete percentages[ file.id ];
	        updateTotalProgress();
	        $li.off().find('.file-panel').off().end().remove();
	    }
	
	    function updateTotalProgress() {
	        var loaded = 0,
	            total = 0,
	            spans = $progress.children(),
	            percent;
	
	        $.each( percentages, function( k, v ) {
	            total += v[ 0 ];
	            loaded += v[ 0 ] * v[ 1 ];
	        } );
	
	        percent = total ? loaded / total : 0;
	
	
	        spans.eq( 0 ).text( Math.round( percent * 100 ) + '%' );
	        spans.eq( 1 ).css( 'width', Math.round( percent * 100 ) + '%' );
	        updateStatus();
	    }
	
	    function updateStatus() {
	        var text = '', stats;
	
	        if ( state === 'ready' ) {
	            text = '选中' + fileCount + '张图片，共' +
	                    WebUploader.formatSize( fileSize ) + '。';
	        } else if ( state === 'confirm' ) {
	            stats = uploader.getStats();
	            if ( stats.uploadFailNum ) {
	                text = '已成功上传' + stats.successNum+ '张照片至本地相册，'+
	                    stats.uploadFailNum + '张照片上传失败，<a class="retry" href="#">重新上传</a>失败图片或<a class="ignore" href="#">忽略</a>'
	            }
	
	        } else {
	            stats = uploader.getStats();
	            text = '共' + fileCount + '张（' +
	                    WebUploader.formatSize( fileSize )  +
	                    '），已上传' + stats.successNum + '张';
	
	            if ( stats.uploadFailNum ) {
	                text += '，失败' + stats.uploadFailNum + '张';
	            }
	        }
	
	        $info.html( text );
	    }
	
	    function setState( val ) {
	        var file, stats;
	
	        if ( val === state ) {
	            return;
	        }
	
	        $upload.removeClass( 'state-' + state );
	        $upload.addClass( 'state-' + val );
	        state = val;
	        switch ( state ) {
	            case 'pedding':
	                $placeHolder.removeClass( 'element-invisible' );
	                $queue.hide();
	                $statusBar.addClass( 'element-invisible' );
	                uploader.refresh();
	                break;
	
	            case 'ready':
	            	/*图片选择修改*/
	            	$placeHolder.hide();
	                //$placeHolder.addClass( 'element-invisible' );
	                $( '#filePicker2' ).removeClass( 'element-invisible');
	                $queue.show();
	                $statusBar.removeClass('element-invisible');
	                uploader.refresh();
	                break;
	
	            case 'uploading':
	                $( '#filePicker2' ).addClass( 'element-invisible' );
	                $progress.show();
	                $upload.text( '暂停上传' );
	                break;
	
	            case 'paused':
	                $progress.show();
	                $upload.text( '继续上传' );
	                break;
	
	            case 'confirm':
	                $progress.hide();
	                $( '#filePicker2' ).removeClass( 'element-invisible' );
	                $upload.text( '开始上传' );
	                stats = uploader.getStats();
	                if ( stats.successNum && !stats.uploadFailNum ) {
	                    setState( 'finish' );
	                    return;
	                }
	                break;
	            case 'finish':
	                stats = uploader.getStats();
	                if ( stats.successNum ) {
	                	if($code == 1){
	                		alert( '图片超出相册数量限制' );
	                	}else{
	                		alert( '上传成功' );
	                	}
	                } else {
	                    // 没有成功的图片，重设
	                    state = 'done';
	                    location.reload();
	                }
	                break;
	        }
	
	        updateStatus();
	    }
	
	    uploader.onUploadProgress = function( file, percentage ) {
	        var $li = $('#'+file.id),
	            $percent = $li.find('.progress span');
	
	        $percent.css( 'width', percentage * 100 + '%' );
	        percentages[ file.id ][ 1 ] = percentage;
	        updateTotalProgress();
	    };
	
	    uploader.onFileQueued = function( file ) {
	        fileCount++;
	        fileSize += file.size;
	
	        if ( fileCount === 1 ) {
	            $placeHolder.addClass( 'element-invisible' );
	            $statusBar.show();
	        }
	
	        addFile( file );
	        setState( 'ready' );
	        updateTotalProgress();
	    };
	
	    uploader.onFileDequeued = function( file ) {
	        fileCount--;
	        fileSize -= file.size;
	
	        if ( !fileCount ) {
	            setState( 'pedding' );
	        }
	
	        removeFile( file );
	        updateTotalProgress();
	
	    };
	
	    uploader.on( 'all', function( type ) {
	        var stats;
	        switch( type ) {
	            case 'uploadFinished':
	                setState( 'confirm' );
	                break;
	
	            case 'startUpload':
	                setState( 'uploading' );
	                break;
	
	            case 'stopUpload':
	                setState( 'paused' );
	                break;
	
	        }
	    });
	
	    uploader.onError = function( code ) {
	        alert( 'Eroor: ' + code );
	    };
	
	    $upload.on('click', function() {
	        if ( $(this).hasClass( 'disabled' ) ) {
	            return false;
	        }
	
	        if ( state === 'ready' ) {
	            uploader.upload();
	        } else if ( state === 'paused' ) {
	            uploader.upload();
	        } else if ( state === 'uploading' ) {
	            uploader.stop();
	        }
	    });
	
	    $info.on( 'click', '.retry', function() {
	        uploader.retry();
	    } );
	
	    $info.on( 'click', '.ignore', function() {
	        alert( 'todo' );
	    } );
	
	    $upload.addClass( 'state-' + state );
	    updateTotalProgress();
	    $("#filePicker2").live("click",function(){
	    	var flag;
	    	$(".filelist").find("li").each(function(){
	    		if($(this).hasClass("state-complete")){
	    			flag = true;
	    		}else{
	    			flag = false;
	    		}
	    	});
	    	if(flag == true){
	    		uploader.reset();
	    	};
	    });
		}
 	};
 	var old = $.fn[pluginName];
 	$.fn[pluginName] = function(options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new SelectPic(this, options));			
			}
        });
		return this;
    };
    $.fn[pluginName].noConflict = function () {
        $.fn[pluginName] = old;
        return this
    };
 })(jQuery)