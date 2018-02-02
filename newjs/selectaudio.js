/*!
 * selectAudio 0.0.1
 * by KANGXUE
 * Copyright 2016.1
 * Date: Thur Feb 25 2016
 * 
 */


 ;(function($){
 	var pluginName = 'selectAudio',
 		defaults = {
 			host : "http://192.168.0.211/egoukx/www/egou",
 			backdatainfo : function(){},
 		};
 	var SelectAudio = function(element, options) {
 		this.element = $(element);
 		this.settings = $.extend({}, defaults, options);
        this.element.on({
             'click.selectAudio': $.proxy(this.init, this)
         });
         $($.proxy(function() {
             this.element.trigger('create');
         }, this));
     };
 	SelectAudio.prototype = {	
		total:"",
		pageSize:"",
		totalPage:"",
		curPage:1,
		localid : "",
		audioArray : [],
		uploadermusic : "",
 		//初始化弹出框
 		init: function(){
 			var that = this,
 				element = this.element;
 			that.getallaudios = that.settings.host+"/index.php/shangjia/commoncomponent/getallaudios"; //获取商家的所有音频分类 
 			that.getsingleaudio = that.settings.host+ "/index.php/shangjia/commoncomponent/getsingleaudio";//获取单个分类下的音频 
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
 			modalHTML = '<div id="myAudioModal" class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="true">'
				  +'<div class="modal-header">'
				   +'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'
				   +'<h3>选择音频<span class="font12 red mlr05">支持mp3格式且单个音频大小不能超过5M</span></h3>'
				  +'</div>'
				  +'<div class="modal-body m-body">'
				    +'<div class="classifylist fl m-body-l">'
				    	+'<div class="input-append"><input type="text" placeholder="输入分类名称" class="searchaudio"><span class="btn saudiobtn">搜索</span></div>'
				    	+'<div id="audiocatelist" class="scrollbar"></div>'
					+'</div>'
					+'<div class="fl m-body-r">'
						+'<audio loop="" src="" id="mymedia" autoplay="" preload=""></audio>'
						+'<div id="webuploadmusic"><div id="musicPicker">选择音乐</div></div>'
						+'<div id="myaudiolist" class="scrollbar"></div>'
					 	+'<div class="prdpagecount"></div>'
					+'</div>'
				  +'</div>'
				  +'<div class="modal-footer">'
				    +'<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>'
				    //+'<button class="btn btn-primary audiosubmit">确定<span class="selectednum"></span></button>'
				  +'</div>'
				+'</div>';
			return modalHTML;	
 		},

 		//渲染弹出框    显示弹出层
 		render: function(element){
 			var that = this,
 				$this = $(element),
 				modalHTML = that.create($this);
 			var len = $("body").find("#myAudioModal").length;
        	if(len <= 0){
        		$('body').append(modalHTML);
        	};
 		},
 		//显示弹出框
 		show: function(){
 			$("#myAudioModal").modal("show");
 		},

 		//隐藏弹出框
 		hide: function(element){
 			$("#myAudioModal").modal("hide");
 		},
 		//初始化加载数据
 		initdata: function(element){
 			var that = this,
				$this = $(element);
 			that.getaudiolist();
 			/*记录上一次点击在哪个分类下，不刷新页面的情况下还是进入那个分类*/
 			that.localid = $this.attr("data-cateid");
 			if(that.localid){
 				$("#audiocatelist").find("li[data-id="+that.localid+"]").addClass("active");
 			}else{
 				$("#audiocatelist").find("ul>li:first-child").addClass("active");
 				that.localid = $("#audiocatelist").find("ul>li:first-child").attr("data-id");
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
 		/*获取所有音频分类*/
 		getaudiolist:function(title){
 			var that = this;
 			$.ajax({
 				type: 'POST',
 				url: that.getallaudios,
 				data: {'title':title},
 				dataType:'json',
 				async:false,
 				beforeSend:function(){
 					$("#audiocatelist").html("<div class='dataloading'>加载中...</div>");
 				},
 				success:function(json){
 					console.log(json);
 					if(json.status=="40001"){
    					$("#audiocatelist").html("");
    				}else{
    					var li = "",list = json.info;
    					$.each(list,function(index,array){ //遍历json数据列
    						li += '<li data-id="'+array['id']+'" title="'+array['audio_desc']+'">'+array['name']+'<code>'+array['audio_num']+'</code></li>';
    						if(array['sub'].length > 0){
    							$.each(array['sub'],function(key,arr){
    								li += '<li class="item_sub" data-id="'+arr['id']+'" title="'+array['audio_desc']+'" rel="'+array['parent_id']+'">'+arr['name']+'<code>'+arr['audio_num']+'</code></li>';
    							});
    						};
    					});
    					$("#audiocatelist").html('<ul>'+li+'</ul>');
    					var keywd = $("#myAudioModal .searchaudio").val();
						keywd = $.trim(keywd);
						that.hilightEle("#audiocatelist",keywd);
    				};
 				}
 			});
 		},
 		/*获取分类下的音频*/
 		getclassfiyaudio:function(page,id){
 			var that = this;
 			$.ajax({
 				type: 'POST',
 				url: that.getsingleaudio,
 				data: {'page':page,'id':id},
 				dataType:'json',
 				beforeSend:function(){
 					$("#myaudiolist").html("<div class='dataloading'>加载中...</div>");
 					$("#myAudioModal .prdpagecount").hide();
 				},
 				success:function(json){
 					if(json.status=="40001"){
    					$("#myaudiolist").html("<div class='datawarn'>登陆超时，请<span class='btn-link' onclick='location.reload();'>刷新</span>页面重新登陆</div>");
    					$("#myAudioModal .prdpagecount").hide();
 					}else{
 						$("#myaudiolist").empty();
	 					if(json.count==0){
	 						$("#myaudiolist").html("<div class='datawarn'>没有数据...</div>");
	 	 					$("#myAudioModal .prdpagecount").hide();
	 					}else{	
	 						if(json.countpage > 1){
    							$("#myAudioModal .prdpagecount").show();
    							that.total = json.count; //总记录数
    	 						that.pageSize = json.pagenum; //每页显示条数
    	 						that.curPage = page; //当前页
    	 						that.totalPage =json.countpage; //总页数
    						};
    						that.uploadermusic.options.formData.audioid = id;
 				        	var table1 = '<table style="width:100%;"><tr><th>音频</th><th>时长</th><th>大小</th><th>操作</th></tr>';
							var tr = "",list = json.info;
							$.each(list,function(index,array){ 
								tr += '<tr><td><span class="audioplay" audio="'+array['audiourl']+'"></span><span class="audio_title" title="'+array['audio_name']+'">'+array['audio_name']+'</span></td>'
								+'<td>'+array['timelong']+'</td><td>'+array['filesize']+'M</td>'
								+'<td><a href="javascript:void(0);" class="btn-link selaudiobtn" data-time="'+array['timelong']+'" data-baseurl="'+array['base64url']+'"'
								+' data-size="'+array['filesize']+'" data-title="'+array['audio_name']+'" data-url="'+array['audiourl']+'">选择</a></td></tr>';
							});
							var table2 = '</table>';
 	    					$("#myaudiolist").html(table1 + tr +table2);
	 						var count = $("#audiocatelist").find("li.active").find("code").html();
	 						if(count !== json.count){
	 							$("#audiocatelist").find("li.active").find("code").html(json.count);
	 						};
	 					};
    				};
 				},
 				complete:function(){ //生成分页条
 					var pageStr = that.getPageBar();
					$("#myAudioModal .prdpagecount").html(pageStr);
 				},
 				error:function(){
 					$("#myaudiolist").html("<div class='datawarn'>数据加载失败</div>");
    				$("#myPrdModal .prdpagecount").hide();
 				}
 			});
 		},
    	/*选择音频初始化*/
    	initInfo:function(id){
    		var that = this;
    		$("#myAudioModal .prdpagecount span a").die("click");
    		that.getclassfiyaudio(1,id);
    		that.ajaxPage(id);  //分页里数据调取
    	},
    	/*点击分页获取音频列表*/
    	ajaxPage:function(id){
    		var that = this;
    		$("#myAudioModal .prdpagecount span a").live('click',function(){
    			var rel = $(this).attr("rel");
    			if(rel){
    				that.getclassfiyaudio(rel,id);
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
    	/*搜索关键词*/
    	execSearch:function(cur){
    		var that = this,
    			keywd=cur.val();
    		if($.trim(keywd)==""){
    			that.getaudiolist();
			}else{
				keywd = $.trim(keywd);
 	    		that.getaudiolist(keywd);
    		};
    	},
 		//(系列事件)
 		trigger: function(element,event){
 			var that = this,
	 			num = that.settings.num,
 				$this = $(element);
 			/*获取分类下的音频*/
 			$("#audiocatelist").undelegate();
			$("#audiocatelist").delegate("li","click",function(e){
				$(this).addClass("active").siblings().removeClass("active");
 				var id = $(this).data("id");
 				that.localid = id;
 				that.initInfo(id);
 			});
 			//选择音频
 			$("#myaudiolist").undelegate();
 			$("#myaudiolist").delegate(".selaudiobtn","click",function(e){
    			e.preventDefault();
    			var _t = $(this),
    				title = _t.attr("data-title"),
    				url = _t.attr("data-url"),
    				baseurl = _t.attr("data-baseurl"),
    				size = _t.attr("data-size"),
    				time = _t.attr("data-time");
            	that.audioArray = {baseurl:baseurl,size:size,url:url,title:title,time:time};
            	var catepageid = $("#audiocatelist").find("li.active").attr("data-id");
        		$this.attr("data-cateid",catepageid);
        		that.settings.backdatainfo($this,that.audioArray);
        		that.hide();
    		});
    		//搜索
    		$("#myAudioModal .saudiobtn").die();
    		$("#myAudioModal .saudiobtn").click(function(){
    			var cur = $(this).prev(".searchaudio");
				that.execSearch(cur);
    		});
    		$('#myAudioModal .searchaudio').live('keyup change', function(event) {
    	        var searchTerm = $(this).val();
    	        searchTerm = $.trim(searchTerm);
    	        if(searchTerm){
    	        	that.hilightEle("#audiocatelist",searchTerm);
    	        };
    			if(event.keyCode ==13){
    				that.execSearch($(this));
    			};
    	    });
    		//预览播放
    		$("#myaudiolist").delegate(".audioplay","click",function(){
    	    	var audio = $(this).attr("audio");
    	    	if($(this).hasClass("play")){
    	    		$(this).removeClass("play");
    	    		document.getElementById('mymedia').pause();
    	    	}else{
    	    		$("#myAudioModal").find("#mymedia").attr("src",audio);
    	    		$(this).addClass("play");
    	    		$(this).parents("tr").siblings().find(".audioplay").removeClass("play");
    	    		document.getElementById('mymedia').play();
    	    	}
    	    });
 			if(!that.uploadermusic){
 				that.webuploader();
 			};
 		},
 		webuploader : function(){
 			var that = this;
 			/* 上传音频 */
 			var $list = $('#webuploadmusic');
 			that.uploadermusic = WebUploader.create({
 		    	formData: {
 		    		 'audioid':that.localid
 		        },
 		        auto: true,
 		        swf: this.host+'/webuploader/dist/Uploader.swf',
 		        server: this.host+'/uploadify/UploadAudio.php',
 		        pick: {
 		        	id:'#musicPicker',
 		        	multiple:false
 		        },
 		        accept: {
 		            title: '音乐',
 		            extensions:'amr,mp3,wma,wav',
 		            mimeTypes: '.amr,.mp3,.wma,.wav'
 		        },
 		        duplicate: true,
 		        fileSingleSizeLimit:5 * 1024 * 1024
 		    });
 			that.uploadermusic.on( 'fileQueued', function( file ) {
 		    	$list.append("<div class='uploadbox'><p class='uploadtitle'>"+file.name+"</p></div>");
 		    });
 			that.uploadermusic.on( 'uploadProgress', function( file, percentage ) {
 		        var $percent = $list.find('.uploadprogress span');
 		        var $box = $list.find(".uploadbox");
 		        if ( !$percent.length ) {
 		            $percent = $('<p class="uploadprogress"><span></span></p>').appendTo($box).find('span');
 		        }
 		        $percent.css( {'width':percentage * 100 + '%',"display":"block"});
 		    });
 			that.uploadermusic.on( 'uploadSuccess', function( file ,data) {
 		    	$("#audiopagebar span a").die("click");
 		    	that.initInfo(that.localid);
 				if(data._raw.indexOf('err')>-1){
 					var err_val=data._raw.substr(6);
 					alert(err_val);
 				}else{
 					alert("上传成功!");
 				}
 		    });
 			that.uploadermusic.on( 'uploadError', function( file ) {
 		        alert('上传失败');
 		    });
 			that.uploadermusic.on( 'uploadComplete', function( file ) {
 		      $list.find('.uploadbox').remove();
 		    });
 			that.uploadermusic.onError = function( code ) {
 		        alert( 'Eroor: ' + code );
 		    };
 		}
 	};
 	var old = $.fn[pluginName];
 	$.fn[pluginName] = function(options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new SelectAudio(this, options));			
			}
        });
		return this;
    };
    $.fn[pluginName].noConflict = function () {
        $.fn[pluginName] = old;
        return this
    };
 })(jQuery)