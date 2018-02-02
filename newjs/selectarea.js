/*!
 * selectArea 0.0.1
 * by KANGXUE
 * Copyright 2016.2
 * Date: Mon Feb 26 2016
 * 
 * 
 */

 ;(function($){
 	var pluginName = 'selectArea',
 		defaults = {
 			backdatainfo : function(){},
 		};
 	var SelectArea = function(element, options) {
 		this.element = $(element);
 		this.settings = $.extend({}, defaults, options);
        this.element.on({
             'click.selectArea': $.proxy(this.init, this)
         });
         $($.proxy(function() {
             this.element.trigger('create');
         }, this));
     };
 	SelectArea.prototype = {	
		total:"",
		pageSize:"",
		totalPage:"",
		curPage:1,
		areas : '[{"d":"110000","p":"\u5317\u4eac\u5e02","n":1,"c":[{"a":"110100","b":"\u5317\u4eac\u5e02","c":"110000"}]},{"d":"120000","p":"\u5929\u6d25\u5e02","n":1,"c":[{"a":"120100","b":"\u5929\u6d25\u5e02","c":"120000"}]},{"d":"130000","p":"\u6cb3\u5317\u7701","n":11,"c":[{"a":"130100","b":"\u77f3\u5bb6\u5e84\u5e02","c":"130000"},{"a":"130200","b":"\u5510\u5c71\u5e02","c":"130000"},{"a":"130300","b":"\u79e6\u7687\u5c9b\u5e02","c":"130000"},{"a":"130400","b":"\u90af\u90f8\u5e02","c":"130000"},{"a":"130500","b":"\u90a2\u53f0\u5e02","c":"130000"},{"a":"130600","b":"\u4fdd\u5b9a\u5e02","c":"130000"},{"a":"130700","b":"\u5f20\u5bb6\u53e3\u5e02","c":"130000"},{"a":"130800","b":"\u627f\u5fb7\u5e02","c":"130000"},{"a":"130900","b":"\u6ca7\u5dde\u5e02","c":"130000"},{"a":"131000","b":"\u5eca\u574a\u5e02","c":"130000"},{"a":"131100","b":"\u8861\u6c34\u5e02","c":"130000"}]},{"d":"140000","p":"\u5c71\u897f\u7701","n":11,"c":[{"a":"140100","b":"\u592a\u539f\u5e02","c":"140000"},{"a":"140200","b":"\u5927\u540c\u5e02","c":"140000"},{"a":"140300","b":"\u9633\u6cc9\u5e02","c":"140000"},{"a":"140400","b":"\u957f\u6cbb\u5e02","c":"140000"},{"a":"140500","b":"\u664b\u57ce\u5e02","c":"140000"},{"a":"140600","b":"\u6714\u5dde\u5e02","c":"140000"},{"a":"140700","b":"\u664b\u4e2d\u5e02","c":"140000"},{"a":"140800","b":"\u8fd0\u57ce\u5e02","c":"140000"},{"a":"140900","b":"\u5ffb\u5dde\u5e02","c":"140000"},{"a":"141000","b":"\u4e34\u6c7e\u5e02","c":"140000"},{"a":"141100","b":"\u5415\u6881\u5e02","c":"140000"}]},{"d":"150000","p":"\u5185\u8499\u53e4\u81ea\u6cbb\u533a","n":12,"c":[{"a":"150100","b":"\u547c\u548c\u6d69\u7279\u5e02","c":"150000"},{"a":"150200","b":"\u5305\u5934\u5e02","c":"150000"},{"a":"150300","b":"\u4e4c\u6d77\u5e02","c":"150000"},{"a":"150400","b":"\u8d64\u5cf0\u5e02","c":"150000"},{"a":"150500","b":"\u901a\u8fbd\u5e02","c":"150000"},{"a":"150600","b":"\u9102\u5c14\u591a\u65af\u5e02","c":"150000"},{"a":"150700","b":"\u547c\u4f26\u8d1d\u5c14\u5e02","c":"150000"},{"a":"150800","b":"\u5df4\u5f66\u6dd6\u5c14\u5e02","c":"150000"},{"a":"150900","b":"\u4e4c\u5170\u5bdf\u5e03\u5e02","c":"150000"},{"a":"152200","b":"\u5174\u5b89\u76df","c":"150000"},{"a":"152500","b":"\u9521\u6797\u90ed\u52d2\u76df","c":"150000"},{"a":"152900","b":"\u963f\u62c9\u5584\u76df","c":"150000"}]},{"d":"210000","p":"\u8fbd\u5b81\u7701","n":14,"c":[{"a":"210100","b":"\u6c88\u9633\u5e02","c":"210000"},{"a":"210200","b":"\u5927\u8fde\u5e02","c":"210000"},{"a":"210300","b":"\u978d\u5c71\u5e02","c":"210000"},{"a":"210400","b":"\u629a\u987a\u5e02","c":"210000"},{"a":"210500","b":"\u672c\u6eaa\u5e02","c":"210000"},{"a":"210600","b":"\u4e39\u4e1c\u5e02","c":"210000"},{"a":"210700","b":"\u9526\u5dde\u5e02","c":"210000"},{"a":"210800","b":"\u8425\u53e3\u5e02","c":"210000"},{"a":"210900","b":"\u961c\u65b0\u5e02","c":"210000"},{"a":"211000","b":"\u8fbd\u9633\u5e02","c":"210000"},{"a":"211100","b":"\u76d8\u9526\u5e02","c":"210000"},{"a":"211200","b":"\u94c1\u5cad\u5e02","c":"210000"},{"a":"211300","b":"\u671d\u9633\u5e02","c":"210000"},{"a":"211400","b":"\u846b\u82a6\u5c9b\u5e02","c":"210000"}]},{"d":"220000","p":"\u5409\u6797\u7701","n":9,"c":[{"a":"220100","b":"\u957f\u6625\u5e02","c":"220000"},{"a":"220200","b":"\u5409\u6797\u5e02","c":"220000"},{"a":"220300","b":"\u56db\u5e73\u5e02","c":"220000"},{"a":"220400","b":"\u8fbd\u6e90\u5e02","c":"220000"},{"a":"220500","b":"\u901a\u5316\u5e02","c":"220000"},{"a":"220600","b":"\u767d\u5c71\u5e02","c":"220000"},{"a":"220700","b":"\u677e\u539f\u5e02","c":"220000"},{"a":"220800","b":"\u767d\u57ce\u5e02","c":"220000"},{"a":"222400","b":"\u5ef6\u8fb9\u671d\u9c9c\u65cf\u81ea\u6cbb\u5dde","c":"220000"}]},{"d":"230000","p":"\u9ed1\u9f99\u6c5f\u7701","n":13,"c":[{"a":"230100","b":"\u54c8\u5c14\u6ee8\u5e02","c":"230000"},{"a":"230200","b":"\u9f50\u9f50\u54c8\u5c14\u5e02","c":"230000"},{"a":"230300","b":"\u9e21\u897f\u5e02","c":"230000"},{"a":"230400","b":"\u9e64\u5c97\u5e02","c":"230000"},{"a":"230500","b":"\u53cc\u9e2d\u5c71\u5e02","c":"230000"},{"a":"230600","b":"\u5927\u5e86\u5e02","c":"230000"},{"a":"230700","b":"\u4f0a\u6625\u5e02","c":"230000"},{"a":"230800","b":"\u4f73\u6728\u65af\u5e02","c":"230000"},{"a":"230900","b":"\u4e03\u53f0\u6cb3\u5e02","c":"230000"},{"a":"231000","b":"\u7261\u4e39\u6c5f\u5e02","c":"230000"},{"a":"231100","b":"\u9ed1\u6cb3\u5e02","c":"230000"},{"a":"231200","b":"\u7ee5\u5316\u5e02","c":"230000"},{"a":"232700","b":"\u5927\u5174\u5b89\u5cad\u5730\u533a","c":"230000"}]},{"d":"310000","p":"\u4e0a\u6d77\u5e02","n":1,"c":[{"a":"310100","b":"\u4e0a\u6d77\u5e02","c":"310000"}]},{"d":"320000","p":"\u6c5f\u82cf\u7701","n":13,"c":[{"a":"320100","b":"\u5357\u4eac\u5e02","c":"320000"},{"a":"320200","b":"\u65e0\u9521\u5e02","c":"320000"},{"a":"320300","b":"\u5f90\u5dde\u5e02","c":"320000"},{"a":"320400","b":"\u5e38\u5dde\u5e02","c":"320000"},{"a":"320500","b":"\u82cf\u5dde\u5e02","c":"320000"},{"a":"320600","b":"\u5357\u901a\u5e02","c":"320000"},{"a":"320700","b":"\u8fde\u4e91\u6e2f\u5e02","c":"320000"},{"a":"320800","b":"\u6dee\u5b89\u5e02","c":"320000"},{"a":"320900","b":"\u76d0\u57ce\u5e02","c":"320000"},{"a":"321000","b":"\u626c\u5dde\u5e02","c":"320000"},{"a":"321100","b":"\u9547\u6c5f\u5e02","c":"320000"},{"a":"321200","b":"\u6cf0\u5dde\u5e02","c":"320000"},{"a":"321300","b":"\u5bbf\u8fc1\u5e02","c":"320000"}]},{"d":"330000","p":"\u6d59\u6c5f\u7701","n":11,"c":[{"a":"330100","b":"\u676d\u5dde\u5e02","c":"330000"},{"a":"330200","b":"\u5b81\u6ce2\u5e02","c":"330000"},{"a":"330300","b":"\u6e29\u5dde\u5e02","c":"330000"},{"a":"330400","b":"\u5609\u5174\u5e02","c":"330000"},{"a":"330500","b":"\u6e56\u5dde\u5e02","c":"330000"},{"a":"330600","b":"\u7ecd\u5174\u5e02","c":"330000"},{"a":"330700","b":"\u91d1\u534e\u5e02","c":"330000"},{"a":"330800","b":"\u8862\u5dde\u5e02","c":"330000"},{"a":"330900","b":"\u821f\u5c71\u5e02","c":"330000"},{"a":"331000","b":"\u53f0\u5dde\u5e02","c":"330000"},{"a":"331100","b":"\u4e3d\u6c34\u5e02","c":"330000"}]},{"d":"340000","p":"\u5b89\u5fbd\u7701","n":17,"c":[{"a":"340100","b":"\u5408\u80a5\u5e02","c":"340000"},{"a":"340200","b":"\u829c\u6e56\u5e02","c":"340000"},{"a":"340300","b":"\u868c\u57e0\u5e02","c":"340000"},{"a":"340400","b":"\u6dee\u5357\u5e02","c":"340000"},{"a":"340500","b":"\u9a6c\u978d\u5c71\u5e02","c":"340000"},{"a":"340600","b":"\u6dee\u5317\u5e02","c":"340000"},{"a":"340700","b":"\u94dc\u9675\u5e02","c":"340000"},{"a":"340800","b":"\u5b89\u5e86\u5e02","c":"340000"},{"a":"341000","b":"\u9ec4\u5c71\u5e02","c":"340000"},{"a":"341100","b":"\u6ec1\u5dde\u5e02","c":"340000"},{"a":"341200","b":"\u961c\u9633\u5e02","c":"340000"},{"a":"341300","b":"\u5bbf\u5dde\u5e02","c":"340000"},{"a":"341400","b":"\u5de2\u6e56\u5e02","c":"340000"},{"a":"341500","b":"\u516d\u5b89\u5e02","c":"340000"},{"a":"341600","b":"\u4eb3\u5dde\u5e02","c":"340000"},{"a":"341700","b":"\u6c60\u5dde\u5e02","c":"340000"},{"a":"341800","b":"\u5ba3\u57ce\u5e02","c":"340000"}]},{"d":"350000","p":"\u798f\u5efa\u7701","n":9,"c":[{"a":"350100","b":"\u798f\u5dde\u5e02","c":"350000"},{"a":"350200","b":"\u53a6\u95e8\u5e02","c":"350000"},{"a":"350300","b":"\u8386\u7530\u5e02","c":"350000"},{"a":"350400","b":"\u4e09\u660e\u5e02","c":"350000"},{"a":"350500","b":"\u6cc9\u5dde\u5e02","c":"350000"},{"a":"350600","b":"\u6f33\u5dde\u5e02","c":"350000"},{"a":"350700","b":"\u5357\u5e73\u5e02","c":"350000"},{"a":"350800","b":"\u9f99\u5ca9\u5e02","c":"350000"},{"a":"350900","b":"\u5b81\u5fb7\u5e02","c":"350000"}]},{"d":"360000","p":"\u6c5f\u897f\u7701","n":11,"c":[{"a":"360100","b":"\u5357\u660c\u5e02","c":"360000"},{"a":"360200","b":"\u666f\u5fb7\u9547\u5e02","c":"360000"},{"a":"360300","b":"\u840d\u4e61\u5e02","c":"360000"},{"a":"360400","b":"\u4e5d\u6c5f\u5e02","c":"360000"},{"a":"360500","b":"\u65b0\u4f59\u5e02","c":"360000"},{"a":"360600","b":"\u9e70\u6f6d\u5e02","c":"360000"},{"a":"360700","b":"\u8d63\u5dde\u5e02","c":"360000"},{"a":"360800","b":"\u5409\u5b89\u5e02","c":"360000"},{"a":"360900","b":"\u5b9c\u6625\u5e02","c":"360000"},{"a":"361000","b":"\u629a\u5dde\u5e02","c":"360000"},{"a":"361100","b":"\u4e0a\u9976\u5e02","c":"360000"}]},{"d":"370000","p":"\u5c71\u4e1c\u7701","n":17,"c":[{"a":"370100","b":"\u6d4e\u5357\u5e02","c":"370000"},{"a":"370200","b":"\u9752\u5c9b\u5e02","c":"370000"},{"a":"370300","b":"\u6dc4\u535a\u5e02","c":"370000"},{"a":"370400","b":"\u67a3\u5e84\u5e02","c":"370000"},{"a":"370500","b":"\u4e1c\u8425\u5e02","c":"370000"},{"a":"370600","b":"\u70df\u53f0\u5e02","c":"370000"},{"a":"370700","b":"\u6f4d\u574a\u5e02","c":"370000"},{"a":"370800","b":"\u6d4e\u5b81\u5e02","c":"370000"},{"a":"370900","b":"\u6cf0\u5b89\u5e02","c":"370000"},{"a":"371000","b":"\u5a01\u6d77\u5e02","c":"370000"},{"a":"371100","b":"\u65e5\u7167\u5e02","c":"370000"},{"a":"371200","b":"\u83b1\u829c\u5e02","c":"370000"},{"a":"371300","b":"\u4e34\u6c82\u5e02","c":"370000"},{"a":"371400","b":"\u5fb7\u5dde\u5e02","c":"370000"},{"a":"371500","b":"\u804a\u57ce\u5e02","c":"370000"},{"a":"371600","b":"\u6ee8\u5dde\u5e02","c":"370000"},{"a":"371700","b":"\u8377\u6cfd\u5e02","c":"370000"}]},{"d":"410000","p":"\u6cb3\u5357\u7701","n":17,"c":[{"a":"410100","b":"\u90d1\u5dde\u5e02","c":"410000"},{"a":"410200","b":"\u5f00\u5c01\u5e02","c":"410000"},{"a":"410300","b":"\u6d1b\u9633\u5e02","c":"410000"},{"a":"410400","b":"\u5e73\u9876\u5c71\u5e02","c":"410000"},{"a":"410500","b":"\u5b89\u9633\u5e02","c":"410000"},{"a":"410600","b":"\u9e64\u58c1\u5e02","c":"410000"},{"a":"410700","b":"\u65b0\u4e61\u5e02","c":"410000"},{"a":"410800","b":"\u7126\u4f5c\u5e02","c":"410000"},{"a":"410900","b":"\u6fee\u9633\u5e02","c":"410000"},{"a":"411000","b":"\u8bb8\u660c\u5e02","c":"410000"},{"a":"411100","b":"\u6f2f\u6cb3\u5e02","c":"410000"},{"a":"411200","b":"\u4e09\u95e8\u5ce1\u5e02","c":"410000"},{"a":"411300","b":"\u5357\u9633\u5e02","c":"410000"},{"a":"411400","b":"\u5546\u4e18\u5e02","c":"410000"},{"a":"411500","b":"\u4fe1\u9633\u5e02","c":"410000"},{"a":"411600","b":"\u5468\u53e3\u5e02","c":"410000"},{"a":"411700","b":"\u9a7b\u9a6c\u5e97\u5e02","c":"410000"}]},{"d":"420000","p":"\u6e56\u5317\u7701","n":14,"c":[{"a":"420100","b":"\u6b66\u6c49\u5e02","c":"420000"},{"a":"420200","b":"\u9ec4\u77f3\u5e02","c":"420000"},{"a":"420300","b":"\u5341\u5830\u5e02","c":"420000"},{"a":"420500","b":"\u5b9c\u660c\u5e02","c":"420000"},{"a":"420600","b":"\u8944\u6a0a\u5e02","c":"420000"},{"a":"420700","b":"\u9102\u5dde\u5e02","c":"420000"},{"a":"420800","b":"\u8346\u95e8\u5e02","c":"420000"},{"a":"420900","b":"\u5b5d\u611f\u5e02","c":"420000"},{"a":"421000","b":"\u8346\u5dde\u5e02","c":"420000"},{"a":"421100","b":"\u9ec4\u5188\u5e02","c":"420000"},{"a":"421200","b":"\u54b8\u5b81\u5e02","c":"420000"},{"a":"421300","b":"\u968f\u5dde\u5e02","c":"420000"},{"a":"422800","b":"\u6069\u65bd\u571f\u5bb6\u65cf\u82d7\u65cf\u81ea\u6cbb\u5dde","c":"420000"},{"a":"429000","b":"\u7701\u76f4\u8f96\u884c\u653f\u5355\u4f4d","c":"420000"}]},{"d":"430000","p":"\u6e56\u5357\u7701","n":14,"c":[{"a":"430100","b":"\u957f\u6c99\u5e02","c":"430000"},{"a":"430200","b":"\u682a\u6d32\u5e02","c":"430000"},{"a":"430300","b":"\u6e58\u6f6d\u5e02","c":"430000"},{"a":"430400","b":"\u8861\u9633\u5e02","c":"430000"},{"a":"430500","b":"\u90b5\u9633\u5e02","c":"430000"},{"a":"430600","b":"\u5cb3\u9633\u5e02","c":"430000"},{"a":"430700","b":"\u5e38\u5fb7\u5e02","c":"430000"},{"a":"430800","b":"\u5f20\u5bb6\u754c\u5e02","c":"430000"},{"a":"430900","b":"\u76ca\u9633\u5e02","c":"430000"},{"a":"431000","b":"\u90f4\u5dde\u5e02","c":"430000"},{"a":"431100","b":"\u6c38\u5dde\u5e02","c":"430000"},{"a":"431200","b":"\u6000\u5316\u5e02","c":"430000"},{"a":"431300","b":"\u5a04\u5e95\u5e02","c":"430000"},{"a":"433100","b":"\u6e58\u897f\u571f\u5bb6\u65cf\u82d7\u65cf\u81ea\u6cbb\u5dde","c":"430000"}]},{"d":"440000","p":"\u5e7f\u4e1c\u7701","n":21,"c":[{"a":"440100","b":"\u5e7f\u5dde\u5e02","c":"440000"},{"a":"440200","b":"\u97f6\u5173\u5e02","c":"440000"},{"a":"440300","b":"\u6df1\u5733\u5e02","c":"440000"},{"a":"440400","b":"\u73e0\u6d77\u5e02","c":"440000"},{"a":"440500","b":"\u6c55\u5934\u5e02","c":"440000"},{"a":"440600","b":"\u4f5b\u5c71\u5e02","c":"440000"},{"a":"440700","b":"\u6c5f\u95e8\u5e02","c":"440000"},{"a":"440800","b":"\u6e5b\u6c5f\u5e02","c":"440000"},{"a":"440900","b":"\u8302\u540d\u5e02","c":"440000"},{"a":"441200","b":"\u8087\u5e86\u5e02","c":"440000"},{"a":"441300","b":"\u60e0\u5dde\u5e02","c":"440000"},{"a":"441400","b":"\u6885\u5dde\u5e02","c":"440000"},{"a":"441500","b":"\u6c55\u5c3e\u5e02","c":"440000"},{"a":"441600","b":"\u6cb3\u6e90\u5e02","c":"440000"},{"a":"441700","b":"\u9633\u6c5f\u5e02","c":"440000"},{"a":"441800","b":"\u6e05\u8fdc\u5e02","c":"440000"},{"a":"441900","b":"\u4e1c\u839e\u5e02","c":"440000"},{"a":"442000","b":"\u4e2d\u5c71\u5e02","c":"440000"},{"a":"445100","b":"\u6f6e\u5dde\u5e02","c":"440000"},{"a":"445200","b":"\u63ed\u9633\u5e02","c":"440000"},{"a":"445300","b":"\u4e91\u6d6e\u5e02","c":"440000"}]},{"d":"450000","p":"\u5e7f\u897f\u58ee\u65cf\u81ea\u6cbb\u533a","n":14,"c":[{"a":"450100","b":"\u5357\u5b81\u5e02","c":"450000"},{"a":"450200","b":"\u67f3\u5dde\u5e02","c":"450000"},{"a":"450300","b":"\u6842\u6797\u5e02","c":"450000"},{"a":"450400","b":"\u68a7\u5dde\u5e02","c":"450000"},{"a":"450500","b":"\u5317\u6d77\u5e02","c":"450000"},{"a":"450600","b":"\u9632\u57ce\u6e2f\u5e02","c":"450000"},{"a":"450700","b":"\u94a6\u5dde\u5e02","c":"450000"},{"a":"450800","b":"\u8d35\u6e2f\u5e02","c":"450000"},{"a":"450900","b":"\u7389\u6797\u5e02","c":"450000"},{"a":"451000","b":"\u767e\u8272\u5e02","c":"450000"},{"a":"451100","b":"\u8d3a\u5dde\u5e02","c":"450000"},{"a":"451200","b":"\u6cb3\u6c60\u5e02","c":"450000"},{"a":"451300","b":"\u6765\u5bbe\u5e02","c":"450000"},{"a":"451400","b":"\u5d07\u5de6\u5e02","c":"450000"}]},{"d":"460000","p":"\u6d77\u5357\u7701","n":3,"c":[{"a":"460100","b":"\u6d77\u53e3\u5e02","c":"460000"},{"a":"460200","b":"\u4e09\u4e9a\u5e02","c":"460000"},{"a":"469000","b":"\u7701\u76f4\u8f96\u53bf\u7ea7\u884c\u653f\u5355\u4f4d","c":"460000"}]},{"d":"500000","p":"\u91cd\u5e86\u5e02","n":1,"c":[{"a":"500100","b":"\u91cd\u5e86\u5e02","c":"500000"}]},{"d":"510000","p":"\u56db\u5ddd\u7701","n":21,"c":[{"a":"510100","b":"\u6210\u90fd\u5e02","c":"510000"},{"a":"510300","b":"\u81ea\u8d21\u5e02","c":"510000"},{"a":"510400","b":"\u6500\u679d\u82b1\u5e02","c":"510000"},{"a":"510500","b":"\u6cf8\u5dde\u5e02","c":"510000"},{"a":"510600","b":"\u5fb7\u9633\u5e02","c":"510000"},{"a":"510700","b":"\u7ef5\u9633\u5e02","c":"510000"},{"a":"510800","b":"\u5e7f\u5143\u5e02","c":"510000"},{"a":"510900","b":"\u9042\u5b81\u5e02","c":"510000"},{"a":"511000","b":"\u5185\u6c5f\u5e02","c":"510000"},{"a":"511100","b":"\u4e50\u5c71\u5e02","c":"510000"},{"a":"511300","b":"\u5357\u5145\u5e02","c":"510000"},{"a":"511400","b":"\u7709\u5c71\u5e02","c":"510000"},{"a":"511500","b":"\u5b9c\u5bbe\u5e02","c":"510000"},{"a":"511600","b":"\u5e7f\u5b89\u5e02","c":"510000"},{"a":"511700","b":"\u8fbe\u5dde\u5e02","c":"510000"},{"a":"511800","b":"\u96c5\u5b89\u5e02","c":"510000"},{"a":"511900","b":"\u5df4\u4e2d\u5e02","c":"510000"},{"a":"512000","b":"\u8d44\u9633\u5e02","c":"510000"},{"a":"513200","b":"\u963f\u575d\u85cf\u65cf\u7f8c\u65cf\u81ea\u6cbb\u5dde","c":"510000"},{"a":"513300","b":"\u7518\u5b5c\u85cf\u65cf\u81ea\u6cbb\u5dde","c":"510000"},{"a":"513400","b":"\u51c9\u5c71\u5f5d\u65cf\u81ea\u6cbb\u5dde","c":"510000"}]},{"d":"520000","p":"\u8d35\u5dde\u7701","n":9,"c":[{"a":"520100","b":"\u8d35\u9633\u5e02","c":"520000"},{"a":"520200","b":"\u516d\u76d8\u6c34\u5e02","c":"520000"},{"a":"520300","b":"\u9075\u4e49\u5e02","c":"520000"},{"a":"520400","b":"\u5b89\u987a\u5e02","c":"520000"},{"a":"522200","b":"\u94dc\u4ec1\u5730\u533a","c":"520000"},{"a":"522300","b":"\u9ed4\u897f\u5357\u5e03\u4f9d\u65cf\u82d7\u65cf\u81ea\u6cbb\u5dde","c":"520000"},{"a":"522400","b":"\u6bd5\u8282\u5730\u533a","c":"520000"},{"a":"522600","b":"\u9ed4\u4e1c\u5357\u82d7\u65cf\u4f97\u65cf\u81ea\u6cbb\u5dde","c":"520000"},{"a":"522700","b":"\u9ed4\u5357\u5e03\u4f9d\u65cf\u82d7\u65cf\u81ea\u6cbb\u5dde","c":"520000"}]},{"d":"530000","p":"\u4e91\u5357\u7701","n":16,"c":[{"a":"530100","b":"\u6606\u660e\u5e02","c":"530000"},{"a":"530300","b":"\u66f2\u9756\u5e02","c":"530000"},{"a":"530400","b":"\u7389\u6eaa\u5e02","c":"530000"},{"a":"530500","b":"\u4fdd\u5c71\u5e02","c":"530000"},{"a":"530600","b":"\u662d\u901a\u5e02","c":"530000"},{"a":"530700","b":"\u4e3d\u6c5f\u5e02","c":"530000"},{"a":"530800","b":"\u601d\u8305\u5e02","c":"530000"},{"a":"530900","b":"\u4e34\u6ca7\u5e02","c":"530000"},{"a":"532300","b":"\u695a\u96c4\u5f5d\u65cf\u81ea\u6cbb\u5dde","c":"530000"},{"a":"532500","b":"\u7ea2\u6cb3\u54c8\u5c3c\u65cf\u5f5d\u65cf\u81ea\u6cbb\u5dde","c":"530000"},{"a":"532600","b":"\u6587\u5c71\u58ee\u65cf\u82d7\u65cf\u81ea\u6cbb\u5dde","c":"530000"},{"a":"532800","b":"\u897f\u53cc\u7248\u7eb3\u50a3\u65cf\u81ea\u6cbb\u5dde","c":"530000"},{"a":"532900","b":"\u5927\u7406\u767d\u65cf\u81ea\u6cbb\u5dde","c":"530000"},{"a":"533100","b":"\u5fb7\u5b8f\u50a3\u65cf\u666f\u9887\u65cf\u81ea\u6cbb\u5dde","c":"530000"},{"a":"533300","b":"\u6012\u6c5f\u5088\u50f3\u65cf\u81ea\u6cbb\u5dde","c":"530000"},{"a":"533400","b":"\u8fea\u5e86\u85cf\u65cf\u81ea\u6cbb\u5dde","c":"530000"}]},{"d":"540000","p":"\u897f\u85cf\u81ea\u6cbb\u533a","n":7,"c":[{"a":"540100","b":"\u62c9\u8428\u5e02","c":"540000"},{"a":"542100","b":"\u660c\u90fd\u5730\u533a","c":"540000"},{"a":"542200","b":"\u5c71\u5357\u5730\u533a","c":"540000"},{"a":"542300","b":"\u65e5\u5580\u5219\u5730\u533a","c":"540000"},{"a":"542400","b":"\u90a3\u66f2\u5730\u533a","c":"540000"},{"a":"542500","b":"\u963f\u91cc\u5730\u533a","c":"540000"},{"a":"542600","b":"\u6797\u829d\u5730\u533a","c":"540000"}]},{"d":"610000","p":"\u9655\u897f\u7701","n":10,"c":[{"a":"610100","b":"\u897f\u5b89\u5e02","c":"610000"},{"a":"610200","b":"\u94dc\u5ddd\u5e02","c":"610000"},{"a":"610300","b":"\u5b9d\u9e21\u5e02","c":"610000"},{"a":"610400","b":"\u54b8\u9633\u5e02","c":"610000"},{"a":"610500","b":"\u6e2d\u5357\u5e02","c":"610000"},{"a":"610600","b":"\u5ef6\u5b89\u5e02","c":"610000"},{"a":"610700","b":"\u6c49\u4e2d\u5e02","c":"610000"},{"a":"610800","b":"\u6986\u6797\u5e02","c":"610000"},{"a":"610900","b":"\u5b89\u5eb7\u5e02","c":"610000"},{"a":"611000","b":"\u5546\u6d1b\u5e02","c":"610000"}]},{"d":"620000","p":"\u7518\u8083\u7701","n":14,"c":[{"a":"620100","b":"\u5170\u5dde\u5e02","c":"620000"},{"a":"620200","b":"\u5609\u5cea\u5173\u5e02","c":"620000"},{"a":"620300","b":"\u91d1\u660c\u5e02","c":"620000"},{"a":"620400","b":"\u767d\u94f6\u5e02","c":"620000"},{"a":"620500","b":"\u5929\u6c34\u5e02","c":"620000"},{"a":"620600","b":"\u6b66\u5a01\u5e02","c":"620000"},{"a":"620700","b":"\u5f20\u6396\u5e02","c":"620000"},{"a":"620800","b":"\u5e73\u51c9\u5e02","c":"620000"},{"a":"620900","b":"\u9152\u6cc9\u5e02","c":"620000"},{"a":"621000","b":"\u5e86\u9633\u5e02","c":"620000"},{"a":"621100","b":"\u5b9a\u897f\u5e02","c":"620000"},{"a":"621200","b":"\u9647\u5357\u5e02","c":"620000"},{"a":"622900","b":"\u4e34\u590f\u56de\u65cf\u81ea\u6cbb\u5dde","c":"620000"},{"a":"623000","b":"\u7518\u5357\u85cf\u65cf\u81ea\u6cbb\u5dde","c":"620000"}]},{"d":"630000","p":"\u9752\u6d77\u7701","n":8,"c":[{"a":"630100","b":"\u897f\u5b81\u5e02","c":"630000"},{"a":"632100","b":"\u6d77\u4e1c\u5730\u533a","c":"630000"},{"a":"632200","b":"\u6d77\u5317\u85cf\u65cf\u81ea\u6cbb\u5dde","c":"630000"},{"a":"632300","b":"\u9ec4\u5357\u85cf\u65cf\u81ea\u6cbb\u5dde","c":"630000"},{"a":"632500","b":"\u6d77\u5357\u85cf\u65cf\u81ea\u6cbb\u5dde","c":"630000"},{"a":"632600","b":"\u679c\u6d1b\u85cf\u65cf\u81ea\u6cbb\u5dde","c":"630000"},{"a":"632700","b":"\u7389\u6811\u85cf\u65cf\u81ea\u6cbb\u5dde","c":"630000"},{"a":"632800","b":"\u6d77\u897f\u8499\u53e4\u65cf\u85cf\u65cf\u81ea\u6cbb\u5dde","c":"630000"}]},{"d":"640000","p":"\u5b81\u590f\u56de\u65cf\u81ea\u6cbb\u533a","n":5,"c":[{"a":"640100","b":"\u94f6\u5ddd\u5e02","c":"640000"},{"a":"640200","b":"\u77f3\u5634\u5c71\u5e02","c":"640000"},{"a":"640300","b":"\u5434\u5fe0\u5e02","c":"640000"},{"a":"640400","b":"\u56fa\u539f\u5e02","c":"640000"},{"a":"640500","b":"\u4e2d\u536b\u5e02","c":"640000"}]},{"d":"650000","p":"\u65b0\u7586\u7ef4\u543e\u5c14\u81ea\u6cbb\u533a","n":15,"c":[{"a":"650100","b":"\u4e4c\u9c81\u6728\u9f50\u5e02","c":"650000"},{"a":"650200","b":"\u514b\u62c9\u739b\u4f9d\u5e02","c":"650000"},{"a":"652100","b":"\u5410\u9c81\u756a\u5730\u533a","c":"650000"},{"a":"652200","b":"\u54c8\u5bc6\u5730\u533a","c":"650000"},{"a":"652300","b":"\u660c\u5409\u56de\u65cf\u81ea\u6cbb\u5dde","c":"650000"},{"a":"652700","b":"\u535a\u5c14\u5854\u62c9\u8499\u53e4\u81ea\u6cbb\u5dde","c":"650000"},{"a":"652800","b":"\u5df4\u97f3\u90ed\u695e\u8499\u53e4\u81ea\u6cbb\u5dde","c":"650000"},{"a":"652900","b":"\u963f\u514b\u82cf\u5730\u533a","c":"650000"},{"a":"653000","b":"\u514b\u5b5c\u52d2\u82cf\u67ef\u5c14\u514b\u5b5c\u81ea\u6cbb\u5dde","c":"650000"},{"a":"653100","b":"\u5580\u4ec0\u5730\u533a","c":"650000"},{"a":"653200","b":"\u548c\u7530\u5730\u533a","c":"650000"},{"a":"654000","b":"\u4f0a\u7281\u54c8\u8428\u514b\u81ea\u6cbb\u5dde","c":"650000"},{"a":"654200","b":"\u5854\u57ce\u5730\u533a","c":"650000"},{"a":"654300","b":"\u963f\u52d2\u6cf0\u5730\u533a","c":"650000"},{"a":"659000","b":"\u7701\u76f4\u8f96\u884c\u653f\u5355\u4f4d","c":"650000"}]},{"d":"710000","p":"\u53f0\u6e7e\u7701","n":0,"c":""},{"d":"810000","p":"\u9999\u6e2f\u7279\u522b\u884c\u653f\u533a","n":0,"c":""},{"d":"820000","p":"\u6fb3\u95e8\u7279\u522b\u884c\u653f\u533a","n":0,"c":""},{"d":"1000000","p":"\u5176\u4ed6","n":1,"c":[{"a":"659001","b":"\u5176\u4ed6","c":"1000000"}]}] ',
 		//初始化弹出框
 		init: function(){
 			var that = this,
 				element = this.element;
 			that.render(element);
 			that.show();
 			that.trigger(element);
 		},

 		//创建弹出框
 		create: function(element){
 			var that = this,
 				$this = $(element),
 				modalHTML = [];
 			
 			modalHTML[0] = '<div id="myAreaModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
 				+'<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3>选择地区</h3></div>'
 				+'<div class="modal-body"><div class="pdata"></div>'
 				+'<div class="previewarea"><div>已选择区域：</div><ul class="scrollbar"></ul></div>'
 				+'</div>'
 				+'<div class="modal-footer">'
 				+'<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>'
 				+'<button class="btn btn-primary" id="areasubmit">确定</button>'
 				+'</div></div>';
 			return modalHTML;	
 		},

 		//渲染弹出框    显示弹出层
 		render: function(element){
 			var that = this,
 				$this = $(element),
 				modalHTML = that.create($this);
 			var len = $("body").find("#myAreaModal").length;
        	if(len <= 0){
        		$('body').append(modalHTML[0]);
        		that.showJsonPc();
        	};
 		},
 		//显示弹出框
 		show: function(){
 			$("#myAreaModal").modal("show");
 		},
 		//隐藏弹出框
 		hide: function(){
 			$("#myAreaModal").modal("hide");
 		},
 		/** * 解析省市json * 输出至pdata * **/
 		showJsonPc : function(){
 			var that = this,
 				dataObj=eval("("+that.areas+")"),//转换为json对象 
 				p_datas='';
 			$.each(dataObj, function(key, value) { 
 				area_d=value.d;//省id
 				area_p=value.p;//名称
 				area_n=value.n;//该省下的市区数量
 				area_c=value.c;//该省下的所有市区
 				c_datas='';
 				for(j=0; j<area_c.length; j++){
 					c_a=area_c[j].a;//城市id
 					c_b=area_c[j].b;//城市名称
 					c_c=area_c[j].c;//父id
 					c_datas+= "<span class='areacity'><input type='checkbox' value='"+c_a+"' id='J_City_"+c_a+"' class='J_city' aname='"+c_b+"' >"
 					  +"<label for='J_City_"+c_a+"' >"+c_b+"</label></span>";
 				};
 				  p_datas+="<div class='ecitys'><span class='s_province'><input type='checkbox' aname='"+area_p+"'  value='"+area_d+"' id='J_Province_"+area_d+"' class='J_Province' >"
 				  +"<label for='J_Province_"+area_d+"' >"+area_p+"</label><span class='check_num'></span>";
 				  if(c_datas){
 					  p_datas+="<a href='javascript:void(0)' title='点击选择城市' class='select_city'>↓</a>"; 
 				  };
 				  p_datas+="</span>";
 				  if(c_datas){
					  p_datas+="<div class='pcitys'>"+c_datas+"<div class='btn_closecity'><span class='btn btn-small' title='关闭'>关闭</span></div></div>";
				  };
				  p_datas+="</div>";
 			});
 			$('#myAreaModal .pdata').html(p_datas);
 		},
 		//(系列事件)
 		trigger: function(element,event){
 			var that = this,
 				$this = $(element);
 			/*----选值---*/
 			$("#myAreaModal .s_province").undelegate();
 			$('#myAreaModal .s_province').delegate('.J_Province','change',function(){
			   var relid_next=$(this).parent().next('.pcitys'),
				   leng_checkd= relid_next.find('input').length,
				   name = $(this).attr("aname"),
		    	   value = $(this).attr("value");
	    	   if($(this).attr("checked") == "checked"){
	    		   $(this).parent().find('.check_num').html("("+leng_checkd+")").show();
	    		   relid_next.find('input').attr('checked',true);
	    		   $(this).parent().next().find(".J_city").each(function(){
			    	   var cityvalue = $(this).attr("value");
					   $(".previewarea").find("li").each(function(){
						   var pval = $(this).attr("rel");
						   if(cityvalue == pval){
							   $(".previewarea").find("#p"+pval).remove();
						   }
					   });
				   });
	    		   var li = "<li rel='"+value+"' id='p"+value+"' aname='"+name+"' type='p'>"+name+"<span class='canclearea'>×</span></li>";
		    	   $(".previewarea").find("ul").append(li);
	    	   }else{
	    		   $(this).parent().find('.check_num').html("(0)").hide();
	    		   relid_next.find('input').attr('checked',false);
				   relid_next.hide();
				   $(".previewarea").find("li").each(function(){
					   var pval = $(this).attr("rel");
					   if(value == pval){
						   $(".previewarea").find("#p"+pval).remove();
					   }
				   });
	    	   }
		    });
 			$('#myAreaModal .s_province').delegate('.select_city','click',function(){
				 var tp=$(this).parent(),
					 relid_next=tp.next('.pcitys');
					 tp.toggleClass("pupp");
					 relid_next.toggle();
					 tp.parent().siblings().find(".pcitys").hide();
					 tp.parent().siblings().find(".s_province").removeClass('pupp');
 			});
 			$('.btn_closecity .btn').live('click',function(){
 				$(this).parents(".pcitys").hide();
 				$(this).parents(".pcitys").prev().removeClass('pupp');
			});
 			//选择市级
 			$("#myAreaModal .areacity").undelegate();
 			$("#myAreaModal .areacity").delegate('input','click',function(){
				var input=$(this),
					pcitys = $(this).parents(".pcitys");
	   				citylen= pcitys.find('.areacity').length;//城市的总数
	      			lencity_ckd= pcitys.find(":checked").length;//已选择城市的总数
	      			$(this).parents('.pcitys').prev('.s_province').find('.check_num').html("("+lencity_ckd+")").show();
	      			var  f_check=$(this).parents('.pcitys').prev('.s_province').find('input:checkbox');
				if($(this).attr("checked") == "checked"){
					if (lencity_ckd==citylen) {
						f_check.attr("checked",true);
						$(".previewarea").find("li").each(function(){
						   var pval = $(this).attr("rel");
						   input.parents('.pcitys').find(".J_city").each(function(){
							   var cityval = $(this).attr("value");
							   if(cityval == pval){
								   $(".previewarea").find("#p"+cityval).remove();
							   };
						   });
					    });
						var name = f_check.attr("aname"),value = f_check.attr("value");
						var li = "<li rel='"+value+"' id='p"+value+"' aname='"+name+"'  type='c'>"+name+"<span class='canclearea'>x</span></li>";
						$(".previewarea").find("ul").append(li);
					}else{
			    		var name = input.attr("aname"),value = input.attr("value");
			    		var li = "<li rel='"+value+"' id='p"+value+"' aname='"+name+"' type='c'>"+name+"<span class='canclearea'>x</span></li>";
			    		$(".previewarea").find("ul").append(li);
					};
				}else{
					if (parseInt(lencity_ckd) + 1 == parseInt(citylen)) {
						f_check.attr("checked",false);
						var name = f_check.attr("aname"),value = f_check.attr("value");
						$(".previewarea").find("li").each(function(){
						   var pval = $(this).attr("rel"),value = f_check.attr("value");
						   if(value == pval){
								$(".previewarea").find("#p"+value).remove();
							};
					    });
						input.parent().siblings(".areacity").each(function(){
							var name = $(this).find("input").attr("aname"),value = $(this).find("input").attr("value");
							var li = "<li rel='"+value+"' id='p"+value+"' aname='"+name+"' type='c'>"+name+"<span class='canclearea'>x</span></li>";
				    		$(".previewarea").find("ul").append(li);
						});
					}else{
						$(".previewarea").find("li").each(function(){
							var pval = $(this).attr("rel"),value = input.attr("value");
							if(value == pval){
								$(".previewarea").find("#p"+value).remove();
							};
						});
					};
				};
					
			 });
 			/* 取消选择 */
 			$("#myAreaModal .canclearea").live("click",function(){
 				$(this).parent().remove();
 				var pval = $(this).parent().attr("rel");
 				 $("#myAreaModal .pdata").find("input").each(function(){
 					 var value = $(this).attr("value");
 					 if(value == pval){
 						 $("#myAreaModal .pdata").find("input[value='"+pval+"']").attr('checked',false);
 						 var checknum = $(".pdata").find("input[value='"+pval+"']").parents(".pcitys").find(":checked").length;
 						 $("#myAreaModal .pdata").find("input[value='"+pval+"']").parents(".pcitys").prev().find(".check_num").html("("+checknum+")");
 					 }
 				 })
 			});
    	    //确认返回事件
 			if($.isFunction(that.settings.backdatainfo)){
 				$("#myAreaModal .modal-footer").undelegate();
	 			$('#myAreaModal .modal-footer').delegate('#areasubmit','click',function(){
	 				var currentli = $("#myAreaModal .previewarea ul").find("li");
	 				var arealen = currentli.length;
	 				if(arealen > 0){
	 					var areaArr = [],ids = "";
	 					currentli.each(function(key){
	 						var type = $(this).attr('type'),
	 							id = $(this).attr('rel'),
	 							name = $(this).attr('aname'),
	 							arr = {id : id,type : type,name : name};
	 							areaArr.push(arr);
	 							ids += id + ',';
	 					});
	 					//$this.attr("data-ids",ids);
	 					that.settings.backdatainfo($this,areaArr);
	 					that.hide();
	 				};
	 			});
 			};
 		}
 	};
 	var old = $.fn[pluginName];
 	$.fn[pluginName] = function(options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new SelectArea(this, options));			
			}
        });
		return this;
    };
    $.fn[pluginName].noConflict = function () {
        $.fn[pluginName] = old;
        return this
    };
 })(jQuery)