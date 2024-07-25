
//全局变量
var proposals = [];//存放搜索框自动提示数据
var shopJsonData = [{ 'title': '瀑布流其实就是几个函数的事！', 'intro': '爆料，苏亚雷斯又咬人啦，C罗哪有内马尔帅，梅西今年要不夺冠，你就去泰国吧，老子买了阿根廷赢得彩票，输了就去不成了。', 'src': '/PageUI/WaterfallDataUi/images/one.jpg', 'writer': '标题', 'date': '2小时前', 'looked': 321 }];//商店WaterfallDataUi
var alreadyPushShopNum = 0;//在瀑布流中已经显示的数据个数
var Notices_LimitNum = 8;//公告限制显示个数
var waterfall_LimitNum = 20;//瀑布流每一页限制显示个数

/*瀑布流开始*/
var container = $('.waterfull ul');
var loading = $('#imloading');

if (sessionStorage.user != null && sessionStorage.user != "") {
    var user = JSON.parse(sessionStorage.getItem("user"));
}

//预加载
$(function () {

    //全部电子产品显示与隐藏
    $(".notice_img");
    $(".aside").css({ display: "block" })
    $(".important").mouseenter(function () {
        $(".aside").css({ display: "block" })
    })
    //    .mouseleave(function () {
    //    $(".aside").css({ display: "none" })
    //})


    //干掉样式
    $(".searchk").children().eq(1).css("width", "");
    $(".searchk").children().eq(1).css("height", "");
    $(".lunbo").css("margin-top", "");

    $("#search_source").css("width", "50%");

    $(".row>div").mouseenter(function () {
        $(this).find(".bg").show();
        $(this).find(".title").show();
    }).mouseleave(function () {
        $(this).find(".bg").hide();
        $(this).find(".title").hide();
    });

    //轮播
    layui.use(['carousel', 'form'], function () {
        var carousel = layui.carousel
        , form = layui.form;

        //常规轮播
        carousel.render({
            elem: '#mainbanner'
          , arrow: 'always'
        });
        $(".mainbanner").css("width", "");
        $(".mainbanner").css("height", "");
        $(".mainbanner").css("left", "");

    });

    //初始化界面数据
    GetAllHotShop();
    GetAllHotGoods();
    GetNoticesAndSetFY();

    //多图轮播--放在初始化界面数据的方法下面
    jQuery(".picScroll").slide({ mainCell: "ul", effect: "leftLoop", vis: 6, scroll: 1, autoPage: true, switchLoad: "_src", autoPlay: true });

    //模拟下拉菜单的js*/
    $(".sjhcp_in span").on("mouseenter", function (e) {
        if ($(".little_list").is(":hidden")) {
            $(".little_list").show();
        } else {
            $(".little_list").hide();
        }
        $(".little_list em").click(function () {
            var txt = $(this).text();
            $(".sjhcp_in span").text(txt);
            $(".little_list").hide();
        })
        $(document).one("click", function () {
            $(".little_list").hide();
        });
        e.stopPropagation();
    });
    $(".little_list").on("click", function (e) {
        e.stopPropagation();
    });

    //搜索框自动提示
    $("#search_source").autocomplete({
        source: proposals
    });

    //三级城市选择点击事件绑定
    $("#SelectCity").click(function (e) {
        SelCity(this, e);
        console.log(this);
    });

    /*商店分页流加载*/
    GetShopAndSetFY();
    //loadImage('~/PageUI/WaterfallDataUi/images/one.jpg');
    /*item hover效果*/
    var rbgB = ['#71D3F5', '#F0C179', '#F28386', '#8BD38B'];
    $('#Waterfull_ShopData').on('mouseover', '.item', function () {
        var random = Math.floor(Math.random() * 4);
        $(this).stop(true).animate({ 'backgroundColor': rbgB[random] }, 1000);
    });
    $('#Waterfull_ShopData').on('mouseout', '.item', function () {
        $(this).stop(true).animate({ 'backgroundColor': '#fff' }, 1000);
    });
});

//获取热门的商店
function GetAllHotShop() {
    $.ajax({
        async: false,
        type: "post",
        dataType: "json",
        data: {},
        url: "/Shop/GetAllHotShop",
        success: function (data) {
            var dImg = "/Img/DefaultImg/DFMImg.jpg";
            for (var i = 0; i < data.length; i++) {
                if (data[i].ShopFMImgPath == "" || data[i].ShopFMImgPath == null) {
                    data[i].ShopFMImgPath = dImg;
                }
                $("#ul_HotShopTJ").append(
                    "<li class='mydiv'>"
                        + "<a target='_blank' href='javascript:(0)'>"
                            + "<img src='" + data[i].ShopFMImgPath + '?' + Math.random() + "' onclick=\"GotoShopIndex('" + data[i].ShopId + "')\"/>"
                            + "<div class='img-text'>"
                            + " <div style='width:auto;'  onclick=\"GotoShopIndex('" + data[i].ShopId + "')\">" + data[i].ShopName + "</div><br/>"
                            + "<div style='font-size:13px;color:gray;'>收藏数:" + data[i].ConcernNum + "</div>"
                            + "<i class='layui-icon layui-icon-star' style='font-size:25px; color:red;position:relative;left:95%;' onclick='CollectShop(" + data[i].ShopId + ")'></i>"
                            + "</div>"
                        + "</a>"
                    + "</li>");
            }
        }
    });

}

//获取热门的电子产品
function GetAllHotGoods() {
    $.ajax({
        async: false,
        type: "post",
        dataType: "json",
        data: {},
        url: "/Home/GetAllHotGoods",
        success: function (data) {
            var dImg = "/Img/DefaultImg/GoodsFMImg.jpg";
            for (var i = 0; i < data.length; i++) {
                if (data[i].GoodsFMImgPath == "" || data[i].GoodsFMImgPath == null) {
                    data[i].GoodsFMImgPath = dImg;
                }
                $("#ul_HotGoodss").append(
              "<li class='mydiv'>"
                  + "<a target='_blank' href='javascript:(0)'>"
                      + "<img src='" + data[i].GoodsFMImgPath + '?' + Math.random() + "' onclick=\"GotoShowGoodsIndex('" + data[i].GoodsId + "')\"/>"
                      + "<div class='img-text'>"
                      + " <div style='width:auto;'  onclick=\"GotoShowGoodsIndex('" + data[i].GoodsId + "')\">" + data[i].GoodsName + "<font color='red' style='float:right;'>$" + data[i].GoodsPrice + "</font> </div><br/>"
                      + "<div style='font-size:13px;color:gray;'>收藏数:" + data[i].GoodsConcernNum + "</div>"
                      + "<i class='layui-icon layui-icon-star' style='font-size:25px; color:red;position:relative;left:95%;' onclick='CollectGoods(" + data[i].GoodsId + ")'></i>"
                      + "</div>"
                  + "</a>"
              + "</li>");
            }
        }
    });

}

//跳转到商店信息頁面
function GotoShopIndex(shopId) {
    window.location.href = "/Home/ShopYYIndex?ShopId=" + shopId;
}

//跳转到电子产品信息頁面
function GotoShowGoodsIndex(goodsId) {
    window.location.href = "/Goods/ShowGoodsIndex?GoodsId=" + goodsId;
}

//收藏商店
function CollectShop(shopId) {
    if (user == "" || user == null) {
        LayerAlert("请先登录才能收藏！");
    } else {
        $.ajax({
            async: false,
            type: "post",
            dataType: "json",
            data: { UserName: user.UserName, ShopId: shopId },
            url: "/Shop/CollectShop",
            success: function (data) {
                if (data == true) {
                    layer.msg("收藏成功，可在我的信息里的商店收藏查看！");
                } else {
                    layer.msg("收藏失败，请勿重复收藏！");
                }

            }
        });
    }
}

//收藏电子产品
function CollectGoods(goodsId) {
    if (user == "" || user == null) {
        LayerAlert("请先登录才能收藏！");
    } else {
        $.ajax({
            async: false,
            type: "post",
            dataType: "json",
            data: { UserName: user.UserName, GoodsId: goodsId },
            url: "/Goods/CollectGoods",
            success: function (data) {
                if (data == true) {
                    layer.msg("收藏成功，可在我的信息里的烘焙收藏查看！", { time: 1 * 1000 });
                } else {
                    layer.msg("收藏失败，请勿重复收藏！", { time: 1 * 1000 });
                }

            }
        });
    }
}

//第一次进入--分页获取公告并设置分页栏位
function GetNoticesAndSetFY() {
    GetNoticesByFY(1);
    SetNoticesFY("Notices_FY_ul", "Home", "GetAllNoticesCount", "GetNoticesByFY");
}

//第一次进入--分页获取商店并设置分页栏位
function GetShopAndSetFY() {
    GetShopByFY(1);
    //设置分页界面
    SetShopFY("Waterfall_FY_ul", "Home", "GetAllShopCount", "GetShopByFY");
}

//第一次进入--分页获取商品并设置分页栏位
function GetGoodsAndSetFY() {
    GetGoodsByFY(1);
    //设置分页界面
    SetShopFY("Waterfall_FY_ul", "Home", "GetAllGoodsCount", "GetGoodsByFY");
}

//分页获取公告
function GetNoticesByFY(currentPage) {
    var html = "";
    $.ajax({
        async: false,
        type: "post",
        dataType: "json",
        data: { CurrentPage: currentPage },
        url: "/Home/GetNoticesByFY",
        success: function (data) {
            if (data != null && data != "") {
                for (var i = 0; i < data.length; i++) {
                    html += "<p><a>" + data[i].NoticeTitle + "</a></p>";
                }
                $("#NoticeList").html(html);
            }
        }
    });
}

//分页获取商店
function GetShopByFY(currentPage) {
    $.ajax({
        async: false,
        type: "post",
        dataType: "json",
        data: { CurrentPage: currentPage },
        url: "/Home/GetShopByFY",
        success: function (data) {
            if (data != "" && data != null) {
                //执行商店流加载
                SetWaterfallData(data);
            }
        }
    });
}

//分页获取商品
function GetGoodsByFY(currentPage) {
    $.ajax({
        async: false,
        type: "post",
        dataType: "json",
        data: { CurrentPage: currentPage },
        url: "/Home/GetGoodsByFY",
        success: function (data) {
            if (data != "" && data != null) {
                //执行商店流加载
                SetWaterfallData(data);
            }
        }
    });
}

//获取搜索栏的自动提示信息
function GetSearchTip(str, type) {
    $.ajax({
        url: "/Home/GetSearchTip",
        data: { Str: str, Type: type },
        async: false,
        type: "post",
        success: function (data) {
            if (data != null && data != "") {
                for (var i = 0; i < data.length; i++) {
                    if (type == 0) {
                        proposals[i] = data[i].GoodsName;

                    } else {
                        proposals[i] = data[i].ShopName;
                    }
                }
                proposals = Dedupe(proposals);
                $("#search_source").focus().autocomplete({
                    source: proposals
                });
            }
        },
        error: function (data, type, err) {
            console.log("ajax错误类型：" + type);
            console.log(err);
        }

    });
}

//数组去重
function Dedupe(array) {
    return Array.from(new Set(array));
}

//搜索按钮点击事件
function BtnSearchClick(str, type, currentPage) {
    SearchGetDataByStr(str, type, currentPage);
    if (type == "0") {
        SetWaterfallFYByStr("Waterfall_FY_ul", "Home", "GetAllGoodsCountByStr", "SearchGetDataByStr", str, type);
    } else {
        SetWaterfallFYByStr("Waterfall_FY_ul", "Home", "GetAllShopCountByStr", "SearchGetDataByStr", str, type);
    }
}

//搜索框搜索获取数据
function SearchGetDataByStr(str, type, currentPage) {
    //type=0 商品
    //type=1 商店
    if (str != null && str != "") {
        str = str.trim();
        $.ajax({
            url: "/Home/SearchGetDataByStr",
            data: { Str: str, Type: type, CurrentPage: currentPage },
            async: false,
            type: "post",
            success: function (data) {
                if (data != null && data != "") {
                    layer.msg("查找成功，请用鼠标滚动向下刷新数据。");
                    SetWaterfallData(data);
                    $(document).scrollTop(1350);
                } else {
                    layer.msg("查找失败，并无输入的商店或者电子产品！");
                }
            },
            error: function (data, type, err) {
                console.log("ajax错误类型：" + type);
                console.log(err);
            }
        });

    } else {
        layer.msg("请输入需要查找的数据！");
    }

}

//设置瀑布流信息
function SetWaterfallData(data) {
    /*shopJsonData后台返回的商店数据*/
    shopJsonData = data;
    //初始化流加载
    alreadyPushShopNum = 0;
    container.html("");//重要：赋空流加载模型的数据，不然会空出很高的距离
    // 初始化loading状态
    loading.data("on", true);
    tores();
    $(window).resize(function () {
        tores();
    });
    container.imagesLoaded(function () {
        container.masonry({
            columnWidth: 320,
            itemSelector: '.item',
            isFitWidth: true,//是否根据浏览器窗口大小自动适应默认false
            isAnimated: true,//是否采用jquery动画进行重拍版
            isRTL: false,//设置布局的排列方式，即：定位砖块时，是从左向右排列还是从右向左排列。默认值为false，即从左向右
            isResizable: true,//是否自动布局默认true
            animationOptions: {
                duration: 800,
                easing: 'easeInOutBack',//如果你引用了jQeasing这里就可以添加对应的动态动画效果，如果没引用删除这行，默认是匀速变化
                queue: false//是否队列，从一点填充瀑布流
            }
        });
    });
    $(window).scroll(function () {
        if (!loading.data("on")) return;
        // 计算所有瀑布流块中距离顶部最大，进而在滚动条滚动时，来进行ajax请求，方法很多这里只列举最简单一种，最易理解一种
        var itemNum = $('#Waterfull_ShopData').find('.item').length;
        var itemArr = [];
        if (itemNum >= 3) {
            itemArr[0] = $('#Waterfull_ShopData').find('.item').eq(itemNum - 1).offset().top + $('#Waterfull_ShopData').find('.item').eq(itemNum - 1)[0].offsetHeight;
            itemArr[1] = $('#Waterfull_ShopData').find('.item').eq(itemNum - 2).offset().top + $('#Waterfull_ShopData').find('.item').eq(itemNum - 1)[0].offsetHeight;
            itemArr[2] = $('#Waterfull_ShopData').find('.item').eq(itemNum - 3).offset().top + $('#Waterfull_ShopData').find('.item').eq(itemNum - 1)[0].offsetHeight;
        }

        var maxTop = Math.max.apply(null, itemArr);
        if (maxTop < $(window).height() + $(document).scrollTop()) {
            //加载更多数据
            loading.data("on", false).fadeIn(300);
            (function (shopJsonData) {
                /*这里会根据后台返回的数据来判断是否你进行分页或者数据加载完毕这里假设大于20就不在加载数据*/
                if (itemNum > waterfall_LimitNum) {
                    loading.text('已到底部！');
                } else if (alreadyPushShopNum < shopJsonData.length) {
                    //设置滚动禁止
                    document.onmousewheel = function () { return false; }

                    //一次添加4条信息
                    //若不满20条记录
                    var html = "";
                    for (var i = 0; i < 8; i++) {
                        if (alreadyPushShopNum < shopJsonData.length) {
                            var date = shopJsonData[alreadyPushShopNum].CreateDate;
                            var dateSZ = date.toString().split(' ');//截取日期
                            //0-商品 1-商店
                            if ($('#SearchType').val() == 0) {
                                if (shopJsonData[alreadyPushShopNum].GoodsFMImgPath == "" || shopJsonData[alreadyPushShopNum].GoodsFMImgPath == null) {
                                    shopJsonData[alreadyPushShopNum].GoodsFMImgPath = "/Img/DefaultImg/GoodsFMImg.jpg";
                                }
                                html += "<li class='item'><a class='a-img' target='_blank' href='/Goods/ShowGoodsIndex?GoodsId=" + shopJsonData[alreadyPushShopNum].GoodsId + "'>";
                                html += "<img src='" + shopJsonData[alreadyPushShopNum].GoodsFMImgPath + '?' + Math.random() + "'>";
                                html += "<h4 class='description'>" + shopJsonData[alreadyPushShopNum].GoodsName + "</h4>";
                                html += "<p class='description'>" + shopJsonData[alreadyPushShopNum].GoodsIntroduce + "</p><div class='qianm clearfloat'>";
                                html += "<span class='sp1'><b>" + shopJsonData[alreadyPushShopNum].GoodsConcernNum + "</b></span><span class='sp1'>收藏</span>";
                                html += "<span class='sp2'>" + shopJsonData[alreadyPushShopNum].ShopName + "</span><span class='sp3'>" + dateSZ[0] + "&nbsp;By</span></div></a>";
                                html += "<div style='float: right;'><i class='layui-icon layui-icon-star' style='color:red;' onclick='CollectGoods(" + shopJsonData[alreadyPushShopNum].GoodsId + ")'></i></div></li>";
                            } else {
                                if (shopJsonData[alreadyPushShopNum].ShopFMImgPath == "" || shopJsonData[alreadyPushShopNum].ShopFMImgPath == null) {
                                    shopJsonData[alreadyPushShopNum].ShopFMImgPath = "/Img/DefaultImg/DFMImg.jpg";
                                }
                                html += "<li class='item' ><a class='a-img' target='_blank' href='/Home/ShopYYIndex?ShopId=" + shopJsonData[alreadyPushShopNum].ShopId + "'>";
                                html += "<img src='" + shopJsonData[alreadyPushShopNum].ShopFMImgPath + '?' + Math.random() + "'>";
                                html += "<h4 class='description'>" + shopJsonData[alreadyPushShopNum].ShopName + "</h4>";
                                html += "<p class='description'>" + shopJsonData[alreadyPushShopNum].ShopIntroduce + "</p>";
                                html += "<div class='qianm clearfloat'>";
                                html += "<span class='sp1'><b>" + shopJsonData[alreadyPushShopNum].ConcernNum + "</b></span> <span class='sp1'>收藏</span>";
                                html += "<span class='sp2'>" + shopJsonData[alreadyPushShopNum].ShopContact + "</span><span class='sp3'>" + dateSZ[0] + "&nbsp;By</span></div></a>";
                                html += "<div style='float: right;'><i class='layui-icon layui-icon-star' style='color:red;' onclick='CollectShop(" + shopJsonData[alreadyPushShopNum].ShopId + ")'></i></div></li>";
                            }
                            alreadyPushShopNum++;
                        }
                    }
                    /*模拟ajax请求数据时延时300毫秒*/
                    var time = setTimeout(function () {
                        $(html).find('img').each(function (index) {
                            loadImage($(this).attr('src'));
                        });
                        var $newElems = $(html).css({ opacity: 0 }).appendTo(container);
                        $newElems.imagesLoaded(function () {
                            $newElems.animate({ opacity: 1 }, 50);
                            container.masonry('appended', $newElems, true);
                            loading.data("on", true).fadeOut();
                            document.onmousewheel = function () { return true; }
                            clearTimeout(time);
                        });
                    }, 300)
                } else {
                    layer.msg("当前页已无更多数据");
                    loading.text('已到底部！');
                }
            })(shopJsonData);
        }
    });
}

/*判断瀑布流最大布局宽度，最大为1280*/
function tores() {
    var tmpWid = $(window).width();
    if (tmpWid > 1280) {
        tmpWid = 1280;
    } else {
        var column = Math.floor(tmpWid / 320);
        tmpWid = column * 320;
    }
    $('.waterfull').width(tmpWid);
}

function loadImage(url) {
    var img = new Image();
    //创建一个Image对象，实现图片的预下载
    img.src = url;
    if (img.complete) {
        return img.src;
    }
    img.onload = function () {
        return img.src;
    };
};

//收藏分页Div显示
//分页栏位id - 控制器 - 获取总数的方法 - 根据分页获取数据的方法
function SetNoticesFY(divIdFY, controll, getCountMethod, method_GetFYData) {
    var count = 0;
    $("#" + divIdFY).html(null);
    $.ajax({
        async: true,
        type: "post",
        dataType: "json",
        data: {},
        url: "/" + controll + "/" + getCountMethod,
        success: function (data) {
            if (data != 0 && data != null && data != "") {
                layui.use('laypage', function () {
                    var laypage = layui.laypage;
                    //完整功能
                    laypage.render({
                        elem: divIdFY
                      , count: data
                      , limit: Notices_LimitNum
                      , groups: 1
                      , prev: '<em>◀</em>'
                      , next: '<em>▶</em>'
                      , theme: '#1E9FFF'
                      , layout: ['prev', 'page', 'next']
                      , jump: function (obj) {
                          eval(method_GetFYData + "(" + obj.curr + ")");
                      }
                    });
                });
            }
        }
    });
}
function SetShopFY(divIdFY, controll, getCountMethod, method_GetFYData) {
    var count = 0;
    $("#" + divIdFY).html(null);
    $.ajax({
        async: true,
        type: "post",
        dataType: "json",
        data: {},
        url: "/" + controll + "/" + getCountMethod,
        success: function (data) {
            if (data != 0 && data != null && data != "") {
                layui.use('laypage', function () {
                    var laypage = layui.laypage;
                    //完整功能
                    laypage.render({
                        elem: divIdFY
                      , count: data
                      , limit: waterfall_LimitNum
                      , groups: 3
                      , prev: '<em>◀</em>'
                      , next: '<em>▶</em>'
                      , theme: '#1E9FFF'
                      , layout: ['prev', 'page', 'next']
                      , jump: function (obj) {
                          eval(method_GetFYData + "(" + obj.curr + ")");
                      }
                    });
                });
            }
        }
    });
}
function SetWaterfallFYByStr(divIdFY, controll, getCountMethod, method_GetFYData, str, type) {
    var count = 0;
    $("#" + divIdFY).html(null);
    $.ajax({
        async: true,
        type: "post",
        dataType: "json",
        data: { Str: str },
        url: "/" + controll + "/" + getCountMethod,
        success: function (data) {
            if (data != 0 && data != null && data != "") {
                layui.use('laypage', function () {
                    var laypage = layui.laypage;
                    //完整功能
                    laypage.render({
                        elem: divIdFY
                      , count: data
                      , limit: waterfall_LimitNum
                      , groups: 3
                      , prev: '<em>◀</em>'
                      , next: '<em>▶</em>'
                      , theme: '#1E9FFF'
                      , layout: ['prev', 'page', 'next']
                      , jump: function (obj) {
                          eval(method_GetFYData + "('" + str + "'," + type + "," + obj.curr + ")");
                      }
                    });
                });
            }
        }
    });
}

//layer弹框提示
function LayerAlert(msg) {
    layer.alert(msg, { icon: 5 });
}

