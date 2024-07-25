//数量的获取与设置
layui.config({
	base : "js/"
}).use(['form','element','layer','jquery'],function(){
	var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		element = layui.element(),
		$ = layui.jquery;

	$(".panel a").on("click",function(){
		window.parent.addTab($(this));
	})



	//动态获取文章总数和待审核文章数量,最新文章
	//$.get("../json/newsList.json",
	//	function(data){
	//		var waitNews = [];
	//		$(".allNews span").text(data.length);  //文章总数
	//		for(var i=0;i<data.length;i++){
	//			var newsStr = data[i];
	//			if(newsStr["newsStatus"] == "待审核"){
	//				waitNews.push(newsStr);
	//			}
	//		}
	//		$(".waitNews span").text(waitNews.length);  //待审核文章
	//		//加载最新文章
	//		var hotNewsHtml = '';
	//		for(var i=0;i<5;i++){
	//			hotNewsHtml += '<tr>'
	//	    	+'<td align="left">'+data[i].newsName+'</td>'
	//	    	+'<td>'+data[i].newsTime+'</td>'
	//	    	+'</tr>';
	//		}
	//		$(".hot_news").html(hotNewsHtml);
	//	}
	//)

    //商店数
	$.ajax({
	    url: "/Shop/GetAllShop",
	    async: false,
	    type: "post",
	    datatype: "json",
	    data: {},
	    success: function (data) {
	        $(".addShopAll span").text(data.length);
	    }
	});

	//用户数
	$.ajax({
	    url: "/Admin/GetAllUser",
	    async: false,
	    type: "post",
	    datatype: "json",
	    data: {},
	    success: function (data) {
	        $(".addUserAll span").text(data.length);
	    }
	});

    //获取所有商家的用户的预约信息数量
	$.ajax({
	    url: "/Admin/GetAllUserYYInfo",
	    async: false,
	    type: "post",
	    datatype: "json",
	    data: {},
	    success: function (data) {
	        $(".addShopReservationAll span").text(data.length);
	    }
	});

    //获取所有用户的商家预约信息数量
	$.ajax({
	    url: "/Admin/GetAllWDYYInfo",
	    async: false,
	    type: "post",
	    datatype: "json",
	    data: {},
	    success: function (data) {
	        $(".addUserReservationAll span").text(data.length);
	    }
	});

    //获取收藏的商店的数量
	$.ajax({
	    url: "/Admin/GetAllColShop",
	    async: false,
	    type: "post",
	    datatype: "json",
	    data: {},
	    success: function (data) {
	        $(".addShopCol span").text(data.length);
	    }
	});

    //获取收藏的商品的数量
	$.ajax({
	    url: "/Admin/GetAllColGoods",
	    async: false,
	    type: "post",
	    datatype: "json",
	    data: {},
	    success: function (data) {
	        $(".addGoodsCol span").text(data.length);
	    }
	});


    //获取评论数量
	$.ajax({
	    url: "/Admin/GetAllEvaluate",
	    async: false,
	    type: "post",
	    datatype: "json",
	    data: {},
	    success: function (data) {
	        $(".addEvaluateAll span").text(data.length);
	    }
	});

    //公告数
	$.ajax({
	    url: "/Admin/GetAllNotice",
	    async: false,
	    type: "post",
	    datatype: "json",
	    data: {},
	    success: function (data) {
	        $(".addNoticeAll span").text(data.length);
	    }
	});

    //商品数
	$.ajax({
	    url: "/Admin/GetGoodsCount",
	    async: false,
	    type: "post",
	    datatype: "json",
	    data: {},
	    success: function (data) {
	        $(".addGoodsAll span").text(data);
	    }
	});

    //订单数
	$.ajax({
	    url: "/Admin/GetAllOrder",
	    async: false,
	    type: "post",
	    datatype: "json",
	    data: {},
	    success: function (data) {
	        $(".addOrderAll span").text(data.length);
	    }
	});

	//数字格式化
	$(".panel span").each(function(){
		$(this).html($(this).text()>9999 ? ($(this).text()/10000).toFixed(2) + "<em>万</em>" : $(this).text());	
	})

	//系统基本参数
	if(window.sessionStorage.getItem("systemParameter")){
		var systemParameter = JSON.parse(window.sessionStorage.getItem("systemParameter"));
		fillParameter(systemParameter);
	}else{
		//$.ajax({
		//	url : "../json/systemParameter.json",
		//	type : "get",
		//	dataType : "json",
		//	success : function(data){
		//		fillParameter(data);
		//	}
		//})
	}

	//填充数据方法
 	function fillParameter(data){
 		//判断字段数据是否存在
 		function nullData(data){
 			if(data == '' || data == "undefined"){
 				return "未定义";
 			}else{
 				return data;
 			}
 		}
 		$(".version").text(nullData(data.version));      //当前版本
		$(".author").text(nullData(data.author));        //开发作者
		$(".homePage").text(nullData(data.homePage));    //网站首页
		$(".server").text(nullData(data.server));        //服务器环境
		$(".dataBase").text(nullData(data.dataBase));    //数据库版本
		$(".maxUpload").text(nullData(data.maxUpload));    //最大上传限制
		$(".userRights").text(nullData(data.userRights));//当前用户权限
 	}

})