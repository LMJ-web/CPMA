
//全局变量
var shopJsonData = [{ 'title': '瀑布流其实就是几个函数的事！', 'intro': '爆料，苏亚雷斯又咬人啦，C罗哪有内马尔帅，梅西今年要不夺冠，你就去泰国吧，老子买了阿根廷赢得彩票，输了就去不成了。', 'src': '/PageUI/WaterfallDataUi/images/one.jpg', 'writer': '标题', 'date': '2小时前', 'looked': 321 }];//商店WaterfallDataUi
var alreadyPushShopNum = 0;//在瀑布流中已经显示的数据个数
var waterfall_LimitNum = 12;//瀑布流每一页限制显示个数
var waterfall_FirstInState = 0;//瀑布流第一次进入alreadyPushShopNum是否赋值为0的标志（防止第一次进入商品的重复出现，原因：$(window).scrollTop(160);）
var upGoodsFMImgUrl = "";
var updateGoodsId = 0;
/*瀑布流开始*/
var container = $('.waterfull ul');
var loading = $('#imloading');

//设置Logo高度
$(".LogoImg").css("margin-top", "25px");

if (sessionStorage.user != null && sessionStorage.user != "") {
    var user = JSON.parse(sessionStorage.getItem("user"));
}

//获取用户信息
function GetUserInfo() {
    $.ajax({
        async: true,
        type: "post",
        dataType: "json",
        data: { UserName: user.UserName },
        url: "/User/ReadUserInfos",
        success: function (data) {
            sessionStorage.user = JSON.stringify(data);
            //初始化用户信息
            $("#i_username").html(user.UserName);
            $("#i_nick").val(user.Nick);
            $("#i_name").html(user.Name);
            if (user.Name.trim() != "***") {
                $("#i_name").siblings().eq(1).html("已认证");
                $("#i_name").siblings().eq(1).removeAttr("onclick");
            }
            $("#i_email").html(user.Email);
            $("#i_mobilephone").html(user.MobilePhone);
            $("#i_birthday").val(user.BirthDay);
            $("#city").val(user.Address);
            $("a[name='username']").html(user.UserName);
            $("a[name='logintime']").html(user.LoginTime);
            $("input[value='" + user.Sex + "']").attr("checked", true);
            $("#HeadImgSource_U").attr("src", user.HeadImgPath + '?' + Math.random());

            //顶部信息
            $("a[name='city']").html("<em>" + user.Address + "<em>");
            $("[name='money']").html("<em style='color:#fa3b4a'>￥" + user.Money + "<em>");
            if (user.MobilePhone.trim() != "无") {
                $("a[name='mobilephone']").html("<em>已设置<em>");
            }
            if (user.Email.trim() != "无") {
                $("a[name='email']").html("<em>已设置<em>");
            }
        }
    });
}

//Model切换
function SwitchModel(modelName, thiss) {
    var modelList = $(".centers_mr").children('.public_m1');
    for (var i = 0; i < modelList.length; i++) {
        modelList.eq(i).hide();
    }
    $("#" + modelName).fadeToggle();
    //$('.now_positionm').html("<span>当前位置：</span><a href='#'>" + $(thiss).parent().prev().text() + "></a><a href='#' onclick=\"SwitchModel('" + modelName + "',this)\">" + $(thiss).text() + "</a>");
}

//修改用户信息
function ModifyUserInfos() {

    if ($("#i_nick").val().trim() == null || $("#i_nick").val().trim() == "") {
        msg('昵称不能为空！');
        return false;
    }
    if ($("#i_birthday").val() == null || $("#i_birthday").val() == "") {
        msg('生日不能为空！');
        return false;
    }
    if ($("#city").val() == null || $("#city").val() == "") {
        msg('所在城市不能为空！');
        return false;
    }
    $.ajax({
        url: "/User/ModifyUserInfos",
        dataType: "json",
        type: "post",
        asyns: false,
        data: { UserName: $("#i_username").text(), Nick: $("#i_nick").val().trim(), BirthDay: $("#i_birthday").val(), Sex: $("input[name='sex']:checked").val(), Address: $("#city").val() },
        success: function (data) {
            if (data == null) {
                msg('调用接口失败！');
                return false;
            } else {
                //顶部nick
                $("#Nick").html(data.Nick);
                sessionStorage.user = JSON.stringify(data);
                msg('修改成功！');
            }

        }

    });

}

//绑定邮箱
function ModifyEmail() {
    var reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
    if ($("#input_email").val() == null || $("#input_email").val() == "") {
        msg("Email不能为空...");
        return false;
    } else {
        if (reg.test($("#input_email").val())) {
            $.ajax({
                url: "/User/ModifyEmail",
                dataType: "json",
                type: "post",
                asyns: false,
                data: { UserName: $("#i_username").text(), Email: $("#input_email").val() },
                success: function (data) {
                    if (data == null) {
                        msg("调用接口失败");
                    } else {
                        var user = JSON.parse(sessionStorage.getItem("user"));
                        user.Email = $("#input_email").val();
                        $("#i_email").html(user.Email);
                        sessionStorage.user = JSON.stringify(user);
                        msg("绑定成功");
                        $("#a_ZLXX").click();
                    }
                }
            });
        } else {
            msg("请输入合法的邮箱...");

        }
    }

}

//绑定手机
function ModifyPhone() {
    var reg = /^([0-9]{11})$/;
    if ($("#input_mobilep").val() == null || $("#input_mobilep").val() == "") {
        msg("手机号码不能为空...");
        return false;
    } else {
        if (reg.test($("#input_mobilep").val())) {
            $.ajax({
                url: "/User/ModifyPhone",
                dataType: "json",
                type: "post",
                asyns: false,
                data: { UserName: $("#i_username").text(), MobilePhone: $("#input_mobilep").val() },
                success: function (data) {
                    if (data == null) {
                        msg("调用接口失败");
                    } else {
                        var user = JSON.parse(sessionStorage.getItem("user"));
                        user.MobilePhone = $("#input_mobilep").val();
                        $("#i_mobilephone").html(user.MobilePhone);
                        sessionStorage.user = JSON.stringify(user);
                        msg("绑定成功");
                        $("#a_ZLXX").click();
                    }
                }
            });
        } else {
            msg("请输入合法的手机号码...");

        }
    }

}

//修改密码
function ModifyPassword() {
    var error = 0;
    if ($("#oldpassword").val().trim() == null || $("#oldpassword").val().trim() == "") {
        $("#oldpassword").attr("title", "旧密码不能为空");
        $("#oldpassword").tooltip('show');
        error++;
    } else {
        $("#oldpassword").attr("title", "")
        $("#oldpassword").tooltip('destroy');
    }
    if ($("#newpassword1").val().trim() == null || $("#newpassword1").val().trim() == "") {
        $("#newpassword1").attr("title", "密码不能为空");
        $("#newpassword1").tooltip('show');
        error++;
    } else {
        $("#newpassword1").attr("title", "");
        $("#newpassword1").tooltip('destroy');
    }
    if ($("#newpassword2").val().trim() == null || $("#newpassword2").val().trim() == "") {
        $("#newpassword2").attr("title", "密码不能为空");
        $("#newpassword2").tooltip('show');
        error++;
    } else {
        $("#newpassword2").attr("title", "")
        $("#newpassword2").tooltip('destroy');
    }
    if (error == 0) {
        if ($("#newpassword1").val().trim() != $("#newpassword2").val().trim()) {
            $("#newpassword1").attr("title", "两次密码不同");
            $("#newpassword1").tooltip('show');
            $("#newpassword2").attr("title", "两次密码不同");
            $("#newpassword2").tooltip('show');
            return false;
        } else {
            $("#newpassword1").attr("title", "");
            $("#newpassword1").tooltip('destroy');
            $("#newpassword2").attr("title", "");
            $("#newpassword2").tooltip('destroy');

        }
        if ($("#newpassword1").val().trim() == $("#oldpassword").val().trim()) {
            msg("新密码与旧密码不能相同!");
            return false;
        }
        $.ajax({
            url: "/User/ModifyPassword",
            data: { UserName: user.UserName, OldPassword: $("#oldpassword").val().trim(), NewPassword: $("#newpassword1").val().trim() },
            dataType: "json",
            type: "post",
            async: false,
            success: function (data) {
                if (data == true) {
                    msg("修改成功!");
                } else {
                    msg("修改失败,旧密码错误!");
                }

            }
        });

    }

}

//显示充值Model
function ShowRechargeMoney() {
    var content = '<form class="layui-form layui-form-pane"  style="padding:10px;">' +
                     '<div class="layui-form-item layui-form-text">' +
                            '<label class="layui-form-label">充值卡账号</label>' +
                            '<div class="layui-input-block">' +
                                '<input type="text" placeholder="充值卡账号" lay-verify="required" class="layui-input RechargeName"  >' +
                            '</div>' +
                       '</div>' +
                                 '<div class="layui-form-item layui-form-text" >' +
                            '<label class="layui-form-label">充值密码</label>' +
                            '<div class="layui-input-block">' +
                                '<input type="text" placeholder="充值密码" lay-verify="required" class="layui-input RechargePwd"  >' +
                            '</div>' +
                       '</div>' +
                                 '<div class="layui-form-item layui-form-text">' +
                            '<label class="layui-form-label">金额</label>' +
                            '<div class="layui-input-block">' +
                                '<input type="text" placeholder="金额" lay-verify="required" class="layui-input RechargeMoney"  >' +
                            '</div>' +
                       '</div>' +
                 '</form>';
    layer.open({
        type: 1,
        title:"充值",
        btn: ['确认'],
        skin: 'layui-layer-demo', //样式类名
        area:["400px","auto"],
        closeBtn: 1, //显示关闭按钮
        anim: 3,//从左翻滚
        shadeClose: true, //开启遮罩关闭
        content: content,
        yes: function (index, layero) {
            //do something
            $.ajax({
                url: "/User/RechargeMoney",
                data: { UserName: user.UserName, Money: layero.children().eq(1).children().children().eq(2).children().eq(1).children().val() },
                dataType: "json",
                type: "post",
                async: false,
                success: function (data) {
                    if (data == true) {
                        layer.msg("充值成功！");
                        setTimeout(function () {
                            GetUserInfo();
                            location.reload();
                        }, 500);
                    } else if (!data) {
                        layer.msg("充值失败！");
                    } else {
                        layer.msg("充值异常！");
                    }

                }
            });
        }
    });
}

//不为空提示关闭
function ColseTip(id) {
    if ($("#" + id).val().trim() == null || $("#" + id).val().trim() == '') {
        $("#" + id).attr("title", "密码不能为空");
        $("#" + id).tooltip('show');
    } else {
        $("#" + id).attr("title", "");
        $("#" + id).tooltip('destroy');
    }
}

//获取商店信息
function ReadShopInfo() {
    $.ajax({
        async: false,
        type: "post",
        dataType: "json",
        data: { UserName: user.UserName },
        url: "/Shop/ReadShopInfoByUN",
        success: function (data) {
            if (data == false) {
                LayerAlert("初始化商店信息失败");
            } else {
                $("#ShopName").val(data.ShopName);
                $("#ShopContact").val(data.ShopContact);
                $("#ShopPhone").val(data.ShopPhone);
                $("#StartTime").val(data.StartTime);
                $("#EndTime").val(data.EndTime);
                $("#MinPrice").val(parseInt(data.MinPrice));
                $("#MaxPrice").val(parseInt(data.MaxPrice));
                $("#ShopAddress").val(data.ShopAddress);
                $("#ShopDAddress").val(data.ShopDAddress);
                $("#ShopIntroduce").val(data.ShopIntroduce);
                $("#demo1").attr("src", data.ShopFMImgPath);
            }
        }
    });
}

//修改商店信息
function ModifyShopInfo() {
    $.ajax({
        url: "/Shop/ModifyShopInfo",
        data: {
            UserName: user.UserName,
            ShopName: $("#ShopName").val(),
            ShopContact: $("#ShopContact").val(),
            ShopPhone: $("#ShopPhone").val(),
            StartTime: $("#StartTime").val(),
            EndTime: $("#EndTime").val(),
            MinPrice: parseInt($("#MinPrice").val()),
            MaxPrice: parseInt($("#MaxPrice").val()),
            ShopAddress: $("#ShopAddress").val(),
            ShopDAddress: $("#ShopDAddress").val(),
            ShopIntroduce: $("#ShopIntroduce").val()
        },
        dataType: "json",
        type: "post",
        async: false,
        success: function (data) {
            if (data == true) {
                layer.alert("商鋪信息修改成功！", {
                    icon: 1,
                    title: "提示"
                });
                return false;
            } else if (data == "ShopName_Already") {
            }
            else {
                LayerAlert("商鋪信息修改失败！");
                return false;
            }
        }

    });
}

//获取类别
function GetGoodsCategory() {
    $.ajax({
        url: "/Goods/GetGoodsCategory",
        data: {},
        type: "post",
        async: false,
        success: function (data) {
            if (data != "" && data != null) {
                layui.use(['layer', 'form'], function () {
                    var form = layui.form;
                    var length = data.length;
                    var html1 = '<dd lay-value="" class="layui-select-tips layui-this">直接选择或搜索选择</dd>';
                    var html2 = '<option value="" >直接选择或搜索选择</option>';
                    for (var i = 0; i < length; i++) {
                        html1 += '<dd lay-value="' + data[i].CategoryId + '">' + data[i].CategoryName + '</dd>';
                        html2 += '<option value="' + data[i].CategoryId + '">' + data[i].CategoryName + '</option>';
                    }
                    $("#GoodsAddModel_GoodsCategorySel").next().children().eq(1).html(html1);
                    $("#GoodsAddModel_GoodsCategorySel").html(html2);

                    $("#GoodsModifyModel_GoodsCategorySel").next().children().eq(1).html(html1);
                    $("#GoodsModifyModel_GoodsCategorySel").html(html2);
                    form.render();//没有写这个，操作后没有效果
                });

            }
        }
    });
}

//LayUi弹出框
function msg(msg) {
    layui.use('layer', function () {
        layer.msg(msg, {
            time: 2000 //2s后自动关闭
        });
    });
}

//切换li
function SwitchLi(thiss, formid) {
    for (var i = 0; i < $(thiss).parent().children().length; i++) {
        $(thiss).parent().children().eq(i).removeClass('active');
        $(thiss).parent().next().children().eq(i).hide();
    }
    $(thiss).addClass('active');
    $("#" + formid).show();
}

//清除推廣的圖
function ClearShopTGImg() {
    $.ajax({
        url: "/Shop/ClearShopTGImg",
        data: {
            UserName: user.UserName,
        },
        dataType: "json",
        type: "post",
        async: false,
        success: function (data) {
            if (data == true) {
                $("#tgImgULBtn").click();
            }
        }

    });
}

//第一次进入——获取用戶收藏的商店并设置分页栏位
function GetFYColShop_First(curPage) {
    $.ajax({
        url: "/Shop/GetFYColShop",
        data: {
            UserName: user.UserName, CurPage: curPage
        },
        dataType: "json",
        type: "post",
        async: false,
        success: function (data) {
            if (data != "" || data != null) {
                $("#CollectShopList_ul").html("");
                var length = data.length;
                for (var i = 0; i < length; i++) {
                    $("#CollectShopList_ul").append(
                        "<li>" +
                            "<div style='height:157px;width:165px;'><img src='" + data[i].ShopFMImgPath + "' style='height:100%;width:100%' onclick=\"window.location.href ='\/Home\/ShopYYIndex?ShopId=" + data[i].ShopId + "';\"/></div>" +
                            "<a href='#'><h5>" + data[i].ShopName + "</h5> </a> " +
                            "<span>收藏数：<i>" + data[i].ConcernNum + "</i></span>" +
                            "<p> <em>地址：</em>" + data[i].ShopAddress + "</p>" +
                            "<input class='btn .btn-sm btn-danger' type='button' value='删除' style='float:right;' onclick='RemoveShopCollect(" + data[i].ShopId + ")'>" +
                        "</li>");
                }
                //分页栏位id - 控制器 - 获取总数的方法 - 根据分页获取数据的方法
                SetColFY("SCGL_SPSC_YM", "Shop", "GetAllColShopCount", "GetFYColShop");
                $(".public_m6").hide();
            } else {
                layer.msg("无收藏的商店！");
            }
        }

    });
}

//分页——获取用户收藏的商店
function GetFYColShop(curPage) {
    $.ajax({
        url: "/Shop/GetFYColShop",
        data: {
            UserName: user.UserName, CurPage: curPage
        },
        dataType: "json",
        type: "post",
        async: false,
        success: function (data) {
            if (data != "" || data != null) {
                $("#CollectShopList_ul").html("");
                var length = data.length;
                var html = "";
                for (var i = 0; i < length; i++) {
                    html += "<li>" +
                            "<div style='height:157px;width:165px;'><img src='" + data[i].ShopFMImgPath + "' style='height:100%;width:100%' onclick=\"window.location.href ='\/Home\/ShopYYIndex?ShopId=" + data[i].ShopId + "';\"/></div>" +
                            "<a href='#'><h5>" + data[i].ShopName + "</h5> </a> " +
                            "<span>收藏数：<i>" + data[i].ConcernNum + "</i></span>" +
                            "<p> <em>地址：</em>" + data[i].ShopAddress + "</p>" +
                            "<input class='btn .btn-sm btn-danger' type='button' value='删除' style='float:right;' onclick='RemoveShopCollect(" + data[i].ShopId + ")'>" +
                        "</li>";

                }
                $("#CollectShopList_ul").html(html);
                $(".public_m6").hide();
            }
        }
    });
}

//第一次进入——获取用戶收藏的电子产品并设置分页栏位
function GetFYColGoods_First(curPage) {
    $.ajax({
        url: "/Goods/GetFYColGoods",
        data: {
            UserName: user.UserName, CurPage: curPage
        },
        dataType: "json",
        type: "post",
        async: false,
        success: function (data) {
            if (data != "" || data != null) {
                $("#CollectGoodsList_ul").html("");
                var length = data.length;
                for (var i = 0; i < length; i++) {
                    if (data[i].GoodsFMImgPath == null || data[i].GoodsFMImgPath == "") {
                        data[i].GoodsFMImgPath = "/Img/DefaultImg/GoodsFMImg.jpg";
                    }
                    $("#CollectGoodsList_ul").append(
                        "<li>" +
                            "<img src='" + data[i].GoodsFMImgPath + "' onclick=\"window.location.href ='\/Goods\/ShowGoodsIndex?GoodsId=" + data[i].GoodsId + "';\"/>" +
                            "<a href='#'><h5>" + data[i].GoodsName + "</h5> </a> " +
                            "<span>收藏数：<i>" + data[i].GoodsConcernNum + "</i></span>" +
                            "<input class='btn .btn-sm btn-danger' type='button' value='删除' style='float:right;' onclick='RemoveGoodsCollect(" + data[i].GoodsId + ")'>" +
                        "</li>");
                }
                //设置页数
                $.ajax({
                    url: "/Goods/GetAllColGoods",
                    data: {
                        UserName: user.UserName
                    },
                    dataType: "json",
                    type: "post",
                    async: false,
                    success: function (data) {
                        SetColFY("SCGL_DZCPSC_YM", "Goods", "GetAllColGoodsCount", "GetFYColGoods");

                    }
                });
                $(".public_m6").hide();

            } else {
                layer.msg("无收藏的电子产品！");
            }
        }

    });
}

//分页——获取用戶收藏的电子产品
function GetFYColGoods(curPage) {
    $.ajax({
        url: "/Goods/GetFYColGoods",
        data: {
            UserName: user.UserName, CurPage: curPage
        },
        dataType: "json",
        type: "post",
        async: false,
        success: function (data) {
            if (data != "" || data != null) {
                $("#CollectGoodsList_ul").html("");
                var length = data.length;
                for (var i = 0; i < length; i++) {
                    if (data[i].GoodsFMImgPath == null || data[i].GoodsFMImgPath == "") {
                        data[i].GoodsFMImgPath = "  /Img/DefaultImg/GoodsFMImg.jpg";
                    }
                    $("#CollectGoodsList_ul").append(
                        "<li>" +
                            "<img src='" + data[i].GoodsFMImgPath + "' onclick=\"window.location.href ='\/Goods\/ShowGoodsIndex?GoodsId=" + data[i].GoodsId + "';\"/>" +
                            "<a href='#'><h5>" + data[i].GoodsName + "</h5> </a> " +
                            "<span>收藏数：<i>" + data[i].GoodsConcernNum + "</i></span>" +
                            "<input class='btn .btn-sm btn-danger' type='button' value='删除' style='float:right;' onclick='RemoveGoodsCollect(" + data[i].GoodsId + ")'>" +
                        "</li>");
                }
                $(".public_m6").hide();

            } else {
                layer.msg("无收藏的电子产品！");
            }
        }

    });
}

//收藏分页Div显示
//分页栏位id - 控制器 - 获取总数的方法 - 根据分页获取数据的方法
function SetColFY(divIdFY, controll, getColCountMethod, method_GetFYData) {
    var count = 0;
    $("#" + divIdFY).html(null);
    $.ajax({
        async: true,
        type: "post",
        dataType: "json",
        data: { UserName: user.UserName },
        url: "/" + controll + "/" + getColCountMethod,
        success: function (data) {
            if (data != 0 && data != null && data != "") {
                layui.use('laypage', function () {
                    var laypage = layui.laypage;
                    //完整功能
                    laypage.render({
                        elem: divIdFY
                      , count: data
                      , limit: 10
                      , theme: '#1E9FFF'
                      , layout: ['count', 'prev', 'page', 'next', 'refresh']
                      , jump: function (obj) {
                          try {
                              eval(method_GetFYData + "(" + obj.curr + ")");
                          } catch (e) {

                          }
                      }
                    });
                });
            }
        }
    });

}

//取消商店收藏
function RemoveShopCollect(ShopId) {
    $.ajax({
        url: "/Shop/RemoveShopCollect",
        data: {
            UserName: user.UserName, ShopId: ShopId
        },
        dataType: "json",
        type: "post",
        async: false,
        success: function (data) {
            if (data == true) {
                msg("取消收藏成功！");
            } else {
                msg("取消收藏失败！");
            }
            $("#a_SPSC").click();
        }
    });
}

//取消商品收藏
function RemoveGoodsCollect(GoodsId) {
    $.ajax({
        url: "/Goods/RemoveGoodsCollect",
        data: {
            UserName: user.UserName, GoodsId: GoodsId
        },
        dataType: "json",
        type: "post",
        async: false,
        success: function (data) {
            if (data == true) {
                msg("取消收藏成功！");
            } else {
                msg("取消收藏失败！");
            }
            $("#a_DZCPSC").click();
        }
    });
}

//获取客户预约信息
function GetUserYYInfo() {
    //$.getScript('/Scripts/bootstrapSwitch.js', function () {
    //    //再次加載JS文件
    //});
    $.ajax({
        url: "/Shop/GetUserYYInfo",
        data: { UserName: user.UserName },
        async: false,
        type: "post",
        dataType: "json",
        success: function (data) {
            if (data != null) {
                var grid = BCGrid.create("#WDSD_KHYYXX_Table", {
                    columns: [
                        { name: 'UserReservationId', display: 'UserReservationId', align: 'center', hide: true },
                        { id: 'ShopId', name: 'ShopId', display: 'ShopId', align: 'center', hide: true },
                        { id: 'Nick', name: 'Nick', display: '昵称', align: 'center', enableSort: true },
                        { name: 'MobilePhone', display: '联系方式' },
                        { name: 'YYTime', display: '预约时间', enableSort: true },
                        { name: 'CreateDate', display: '创建时间', enableSort: true },
                        {
                            name: 'Admissibility', display: '受理状态',
                            enableSort: true,
                            render: function (item, index) {
                                if (item.Admissibility == 0) {
                                    return '<div class="switch switch-small" onclick="SureSL(' + item.UserReservationId + ',1)"><input type="checkbox"/></div>';
                                }
                                if (item.Admissibility == 1) {
                                    return '<div class="switch switch-small"><input type="checkbox" checked disabled/></div>';
                                }
                            }
                        },
                        {
                            name: 'FinishState',
                            display: '支付状态',
                            enableSort: true,
                            render: function (item, index) {
                                if (item.FinishState == 0) {
                                    return '<button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-danger">未支付</button>';
                                }
                                if (item.FinishState == 1) {
                                    return '<button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-normal">已支付</button>';
                                }
                            }
                        },
                    ],
                    dataSource: 'local',
                    localData: data
                });
            } else {
                msg("无预约的商店信息！");
            }
        }
    });
    //$('#mySwitch').on('switch-change', function (e, data) {
    //    var $el = $(data.el)
    //      , value = data.value;
    //    console.log(e, $el, value);
    //});
    $("[role='row']").children().css("text-align", "center");
}

//获取已完成的客户预约信息
function GetUserYYFinishInfo() {
    //$.getScript('/Scripts/bootstrapSwitch.js', function () {
    //    //再次加載JS文件
    //});
    $.ajax({
        url: "/Shop/GetUserYYFinishInfo",
        data: { UserName: user.UserName },
        async: false,
        type: "post",
        dataType: "json",
        success: function (data) {
            if (data != null) {
                var grid = BCGrid.create("#WDSD_KHYYXX_Finished_Table", {
                    columns: [
                        { name: 'UserReservationId', display: 'UserReservationId', align: 'center', hide: true },
                        { id: 'ShopId', name: 'ShopId', display: 'ShopId', align: 'center', hide: true },
                        { id: 'Nick', name: 'Nick', display: '昵称', align: 'center', enableSort: true },
                        { name: 'MobilePhone', display: '联系方式', align: 'center' },
                        { name: 'YYTime', display: '预约时间', align: 'center', enableSort: true },
                        { name: 'CreateDate', display: '创建时间', align: 'center', enableSort: true },
                        { name: 'PayDate', display: '支付时间', align: 'center', enableSort: true },
                        {
                            name: 'Admissibility',
                            display: '受理状态',
                            align: 'center',
                            enableSort: true,
                            render: function (item, index) {
                                if (item.Admissibility == 0) {
                                    return '<div class="switch switch-small" onclick="SureSL(' + item.UserReservationId + ',1)"><input type="checkbox"/></div>';
                                }
                                if (item.Admissibility == 1) {
                                    return '<div class="switch switch-small"><input type="checkbox" checked disabled/></div>';
                                }
                            }
                        },
                        {
                            name: 'FinishState',
                            display: '支付状态',
                            enableSort: true,
                            render: function (item, index) {
                                if (item.FinishState == 0) {
                                    return '<button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-danger">未支付</button>';
                                }
                                if (item.FinishState == 1) {
                                    return '<button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-normal">已支付</button>';
                                }
                            }
                        },
                    ],
                    dataSource: 'local',
                    localData: data
                });
            } else {
                msg("无已完成的预约的商店信息！");
            }
        }
    });
    $("[role='row']").children().css("text-align", "center");
}

//确认受理
function SureSL(UserReservationId, State) {
    $.ajax({
        url: "/Shop/SureSL",
        data: { UserReservationId: UserReservationId, State: State },
        async: false,
        type: "post",
        dataType: "json",
        success: function (data) {
            if (data == true) {
                msg("受理成功");

            } else {
                msg("受理失败");
            }
            $("#KHYYXX_Model").click();

        }
    });
}

//获取我的预约的信息
function GetWDYYInfo() {
    $("#DDGL_WDYY_Table").html("");
    $.getScript('/Scripts/bootstrapSwitch.js', function () {
        //再次加載JS文件
    });
    $.ajax({
        url: "/User/GetWDYYInfo",
        data: { UserName: user.UserName },
        async: false,
        type: "post",
        dataType: "json",
        success: function (data) {
            if (data != null) {
                var grid = BCGrid.create("#DDGL_WDYY_Table", {
                    columns: [
                        { id: 'ShopId', name: 'ShopId', display: 'ShopId', align: 'center', hide: true },
                        { id: 'ShopName', name: 'ShopName', display: '商店名', align: 'center', enableSort: true },
                        { name: 'ShopContact', display: '联系人', enableSort: true },
                        { name: 'ShopPhone', display: '联系方式' },
                        { name: 'ShopDAddress', display: '详细地点', enableSort: true },
                        {
                            name: 'Admissibility', display: '受理状态', enableSort: true,
                            render: function (item, index) {
                                if (item.Admissibility == 0) {
                                    return "<font color='red'>否</font>";
                                }
                                if (item.Admissibility == 1) {
                                    return "<font color='green'>是</font>";
                                }
                            }
                        },
                        { name: 'Time', display: '营业时间', enableSort: true },
                        { name: 'YYTime', display: '预约时间', enableSort: true },
                        //{
                        //    name: 'CreateDate', display: '创建时间', enableSort: true,
                        //    render: function (item, index) {
                        //        return item.CreateDate.substring(0, 10);
                        //    }
                        //},
                        {
                            name: 'FinishState', display: '支付操作', enableSort: true, render: function (item, index) {
                                if (item.FinishState == 0) {
                                    return '<button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-danger" onclick="SurePay(' + item.ShopReservationId + ')">支付</button>';
                                }
                            }
                        },
                        {
                            name: 'FinishState',
                            display: '取消操作',
                            render: function (item, index) {
                                if (item.FinishState == 0) {
                                    return '<button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-danger" onclick="CancelShopReservation(' + item.ShopReservationId + ')">取消</button>';
                                }
                            }
                        }
                    ],
                    dataSource: 'local',
                    localData: data
                });
            } else {
                msg("无预约的商店信息！");
            }
        },
        error: function (XMLHttpReuqest, textStautus, errothrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpReuqest.readyState);
            console.log(XMLHttpRequest.responseText);
            console.log(textStautus);
            console.log(errothrown);

        }
    });
    $("[role='row']").children().css("text-align", "center");
}

//获取已完成的我的预约的信息
function GetWDYYFinishInfo() {
    $("#DDGL_YWCDYY_Table").html("");
    $.getScript('/Scripts/bootstrapSwitch.js', function () {
        //再次加載JS文件
    });
    $.ajax({
        url: "/User/GetWDYYFinishInfo",
        data: { UserName: user.UserName },
        async: false,
        type: "post",
        dataType: "json",
        success: function (data) {
            if (data != null) {
                var grid = BCGrid.create("#DDGL_YWCDYY_Table", {
                    columns: [
                        { id: 'ShopId', name: 'ShopId', display: 'ShopId', align: 'center', hide: true },
                        { id: 'ShopName', name: 'ShopName', display: '商店名', align: 'center', enableSort: true },
                        { name: 'ShopContact', display: '联系人', enableSort: true },
                        { name: 'ShopPhone', display: '联系方式', enableSort: true },
                        { name: 'ShopDAddress', display: '详细地点', enableSort: true },
                        {
                            name: 'Admissibility', display: '受理状态',
                            render: function (item, index) {
                                if (item.Admissibility == 0) {
                                    return "<font color='red'>否</font>";
                                }
                                if (item.Admissibility == 1) {
                                    return "<font color='green'>是</font>";
                                }
                            }
                        },
                        //{ name: 'Time', display: '营业时间', enableSort: true },
                        { name: 'YYTime', display: '预约时间', enableSort: true },
                        //{
                        //    name: 'CreateDate', display: '创建时间', enableSort: true,
                        //    render: function (item, index) {
                        //        return item.CreateDate.substring(0, 10);
                        //    }
                        //},
                        //{ name: 'PayDate', display: '支付时间', enableSort: true },
                         {
                             name: 'EvaluateState',
                             display: '评价状态',
                             enableSort: true,
                             render: function (item, index) {
                                 if (item.EvaluateState == 0) {
                                     return '<button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-danger" onclick="Evaluate(' + item.ShopReservationId + ')">评价</button>';
                                 } else {
                                     return '<button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-normal" title="满意度：' + item.EvaluateState + ' 评论：' + item.EvaluateContent + '">已评价</button>';
                                 }
                             }
                         },
                        {
                            name: 'FinishState',
                            display: '完成状态',
                            enableSort: true,
                            render: function (item, index) {
                                if (item.FinishState == 0) {
                                    return '<button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-danger" onclick="SurePay(' + item.ShopId + ',\'' + item.CreateDate + '\')">支付</button>';
                                } else {
                                    return '<button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-normal">已支付</button>';
                                }
                            }
                        }
                    ],
                    dataSource: 'local',
                    localData: data
                });
            } else {
                msg("无已完成的预约信息！");
            }
        },
        error: function (XMLHttpReuqest, textStautus, errothrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpReuqest.readyState);
            console.log(XMLHttpRequest.responseText);
            console.log(textStautus);
            console.log(errothrown);

        }
    });
    $("[role='row']").children().css("text-align", "center");
}

//获取我的订单信息
function GetMyOrder() {
    $("#DDGL_WDDD_Table").html("");
    $.getScript('/Scripts/bootstrapSwitch.js', function () {
        //再次加載JS文件
    });
    $.ajax({
        url: "/User/GetMyOrder",
        data: { UserName: user.UserName },
        async: false,
        type: "post",
        dataType: "json",
        success: function (data) {
            if (data != null) {
                var grid = BCGrid.create("#DDGL_WDDD_Table", {
                    columns: [
                        { name: 'OrderId', display: '订单号',enableSort: true  },
                        { name: 'ShopId', display: 'ShopId',hide: true },
                        { name: 'ShopName', display: '商店名',enableSort: true },
                        { name: 'GoodsId', display: 'GoodsId', hide: true },
                        { name: 'GoodsName', display: '商品名', enableSort: true },
                        { name: 'GoodsPrice', display: '价格',  enableSort: true },
                        { name: 'Num', display: '数量', enableSort: true },
                        {
                            name: 'CreateDate',
                            display: '创建时间',
                            enableSort: true,
                            render: function (item, index) {
                                return item.CreateDate.substring(0, 10);
                            }
                        },
                        {
                             name: 'EvaluateState',
                             display: '评价状态',
                             render: function (item, index) {
                                 if (item.EvaluateState == 0) {
                                     return '<button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-danger" onclick="ModifyOrderEvaluate(' + item.OrderId + ')">未评价</button>';
                                 } else {
                                     return '<button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-normal" title="满意度：' + item.EvaluateStars+ ' 评论：' + item.EvaluateContent + '">已评价</button>';;
                                 }
                             }
                         },
                        {
                            name: 'ReceiptState',
                            display: '收货操作',
                            enableSort: true,
                            render: function (item, index) {
                                if (item.ReceiptState == 0) {
                                    return '<button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-danger" onclick="SureReceipt(' + item.OrderId + ')">确认收货</button>';
                                } else if (item.ReceiptState == 1) {
                                    return '<button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-normal">已收货</button>';
                                }
                            }
                        },
                        {
                            name: 'FinishState',
                            display: '退货操作',
                            render: function (item, index) {
                                if (item.ReceiptState == 0) {
                                    return '<button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-danger" onclick="BackGoods(' + item.OrderId + ')">退货</button>';
                                } else {
                                    return '<button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-normal">不能退货</button>';
                                }
                            }
                        }
                    ],
                    dataSource: 'local',
                    localData: data
                });
            } else {
                msg("暂无订单信息！");
            }
        },
        error: function (XMLHttpReuqest, textStautus, errothrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpReuqest.readyState);
            console.log(XMLHttpRequest.responseText);
            console.log(textStautus);
            console.log(errothrown);

        }
    });
    $("[role='row']").children().css("text-align", "center");
}

//订单评价界面
function ModifyOrderEvaluate(orderId) {
    layer.open({
        type: 2,
        area: ['600px', '300px'],
        fixed: false, //不固定
        maxmin: true,
        shadeClose: true,
        content: '/Admin/OrderEvaluateModel?OrderId=' + orderId,
        end: function () {
            $("#a_DDGL_WDDD").click();
        }

    });

}

//弹出预约评论界面
function Evaluate(ShopReservationId) {
    layer.open({
        type: 2,
        area: ['600px', '300px'],
        fixed: false, //不固定
        maxmin: true,
        shadeClose: true,
        content: 'EvaluateModel?ShopReservationId=' + ShopReservationId,
        end: function () {
            $("#a_WOYY_Finish").click();
        }

    });
}

//确认支付预约价钱
function SurePay(ShopReservationId) {
    layer.confirm('确定支付？', {
        icon: 3,
        btn: ['确定', '取消'] //可以无限个按钮
    }, function (index, layero) {
        //按钮【按钮一】的回调
        $.ajax({
            url: "/User/SurePay",
            type: "post",
            data: { UserName: user.UserName, ShopReservationId: ShopReservationId },
            dataType: "json",
            async: false,
            success: function (data) {
                if (data == true) {
                    layer.msg("支付成功！");
                } else {
                    layer.msg("支付失败！");
                }

            }
        });
        layer.close(index); //如果设定了yes回调，需进行手工关闭
        $("#a_DDGL_WDYY").click();
    }, function (index, layero) {
        //按钮【按钮二】的回调
        layer.msg("取消成功！");
    });
}

//确认收货
function SureReceipt(orderId) {
    layer.confirm('确定已收货？', {
        icon: 3,
        btn: ['确定', '取消'] //可以无限个按钮
    }, function (index, layero) {
        //按钮【按钮一】的回调
        $.ajax({
            url: "/User/SureReceipt",
            type: "post",
            data: { UserName: user.UserName, OrderId: orderId },
            dataType: "json",
            async: false,
            success: function (data) {
                if (data == true) {
                    layer.msg("确认收货成功！");
                } else if (!data) {
                    layer.msg("确认收货失败！");
                } else {
                    layer.msg("确认收货异常！");
                }

            }
        });
        layer.close(index); //如果设定了yes回调，需进行手工关闭
        $("#a_DDGL_WDDD").click();
    }, function (index, layero) {
        //按钮【按钮二】的回调
        layer.msg("取消成功！");
    });
}

//退货
function BackGoods(orderId) {
    layer.confirm('确定退货？', {
        icon: 3,
        btn: ['确定', '取消'] //可以无限个按钮
    }, function (index, layero) {
        //按钮【按钮一】的回调
        $.ajax({
            url: "/User/BackGoods",
            type: "post",
            data: { UserName: user.UserName, OrderId: orderId },
            dataType: "json",
            async: false,
            success: function (data) {
                if (data == true) {
                    layer.msg("退货成功！");
                } else if (data==false) {
                    layer.msg("退货失败！");
                } else {
                    layer.msg("退货异常！");
                }
            }
        });
        layer.close(index); //如果设定了yes回调，需进行手工关闭
        $("#a_DDGL_WDDD").click();
    }, function (index, layero) {
        //按钮【按钮二】的回调
        layer.msg("取消成功！");
    });
}

//取消预约
function CancelShopReservation(ShopReservationId) {
    layer.confirm('确定取消预约？', {
        btn: ['确定', '取消'] //可以无限个按钮
    }, function (index, layero) {
        //按钮【按钮一】的回调
        $.ajax({
            url: "/User/CancelShopReservation",
            type: "post",
            data: { UserName: user.UserName, ShopReservationId: ShopReservationId },
            dataType: "json",
            async: false,
            success: function (data) {
                if (data == true) {
                    layer.msg("取消预约成功！");
                } else {
                    layer.msg("取消预约失败！");
                }

            }
        });
        layer.close(index); //如果设定了yes回调，需进行手工关闭
        $("#a_DDGL_WDYY").click();
    }, function (index, layero) {
        //按钮【按钮二】的回调
        layer.msg("取消成功！");
    });
}

//实名认证
function SureRealNameVail() {
    if ($("#input_name").val() == null || $("#input_name").val() == "") {
        layer.alert("真实姓名不能为空！");
        return false;
    } else if (isCharacter($("#input_name").val().trim()) == false) {
        layer.alert("请勿填写非中文字符！");
        return false;
    }
    if ($("#input_idcard").val() == null || $("#input_idcard").val() == "") {
        layer.alert("身份张号码不能为空！");
        return false;
    } else if (IdCardValidate($("#input_idcard").val().trim()) == false) {
        layer.alert("请输入正确的身份张号码！");
        return false;
    }
    var index = layer.msg('实名认证中，请稍候', { icon: 16, time: false, shade: 0.8 });
    $.ajax({
        url: "/User/SureRealNameVail",
        data: { UserName: user.UserName, RealName: $("#input_name").val().trim(), IDCard: $("#input_idcard").val().trim() },
        type: "post",
        dataType: "json",
        asnyc: false,
        success: function (data) {
            if (data == "true") {
                setTimeout(function () {
                    layer.close(index);
                    layer.msg("实名认证成功,请稍后...", { time: false });
                }, 2000);
                setTimeout(function () {
                    window.location.reload();
                }, 4000);

            } else {
                layer.alert("实名认证失败！");
                return false;
            }

        }
    });
}

//第一次进入--分页获取商品并设置分页栏位
function GetMyGoodsAndSetFY() {
    GetMyGoodsByUserNameAndFY(1);
    //设置分页界面
    SetMyGoodsFY("Waterfall_FY_ul", "Shop", "GetMyGoodsCount", "GetMyGoodsByUserNameAndFY");
}

//设置商品的分页栏位
function SetMyGoodsFY(divIdFY, controll, getCountMethod, method_GetFYData) {
    var count = 0;
    $("#" + divIdFY).html(null);
    $.ajax({
        async: true,
        type: "post",
        dataType: "json",
        data: { UserName: user.UserName },
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
                          try{
                              eval(method_GetFYData + "(" + obj.curr + ")");
                          }catch(e){

                          }
                      }
                    });
                });
            }
        }
    });
}

//获取当前商家的商品
function GetMyGoodsByUserNameAndFY(curryPage) {
    $.ajax({
        url: "/Shop/GetMyGoodsByUserNameAndFY",
        data: { UserName: user.UserName, CurryPage: curryPage },
        async: false,
        type: "post",
        dataType: "json",
        success: function (data) {
            if (data != null && data != "") {
                SetWaterfallData(data);

            } else {
                msg("无商品信息！");
            }
        },
        error: function (XMLHttpReuqest, textStautus, errothrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpReuqest.readyState);
            console.log(XMLHttpRequest.responseText);
            console.log(textStautus);
            console.log(errothrown);

        }
    });
}

//添加商品
function AddGoods() {
    var goodsInfo = {};
    goodsInfo[0] = $("#GoodsAddModel_GoodsName").val();
    goodsInfo[1] = $("#GoodsAddModel_GoodsCategorySel").val()
    goodsInfo[2] = $("#GoodsAddModel_GoodsPrice").val();
    goodsInfo[3] = $("#GoodsAddModel_GoodsIntroduce").val();

    $.ajax({
        url: "/Goods/AddGoods",
        data: { UserName: user.UserName, GoodsInfo: goodsInfo },
        type: "post",
        async: false,
        success: function (data) {
            if (data == null || data == "") {
                layer.msg("添加商品异常！");
            } else if (data == true) {
                GetMyGoodsAndSetFY();
                layer.msg("添加商品成功！");
                return true;
            } else {
                layer.msg("添加商品失败！");
            }
        }
    });
}

//删除商品
function DeleteMyGoods(goodsId) {

    layer.confirm('确定删除此商品？', { icon: 3, title: '提示信息' }, function (index) {
        $.ajax({
            url: "/Shop/DeleteMyGoods",
            data: { GoodsId: goodsId },
            async: false,
            type: "post",
            dataType: "json",
            success: function (data) {
                if (data != null && data != "") {
                    msg("删除成功！");
                    GetMyGoodsAndSetFY();
                } else {
                    msg("删除失败！");
                }
            },
            error: function (XMLHttpReuqest, textStautus, errothrown) {
                console.log(XMLHttpRequest.status);
                console.log(XMLHttpReuqest.readyState);
                console.log(XMLHttpRequemst.responseText);
                console.log(textStautus);
                console.log(errothrown);
            }
        });
        layer.close(index);
    });
}

//获取商品信息
function GetGoodsInfo(goodsId) {
    updateGoodsId = goodsId;
    $.ajax({
        url: "/Goods/ReadGoodsInfoById",
        data: { GoodsId: parseInt(goodsId), UserName: user.UserName },
        type: "post",
        dataType: "json",
        async: false,
        success: function (data) {
            $("#GoodsModifyModel_GoodsName").val(data.GoodsName);
            $("#GoodsModifyModel_GoodsId").val(data.GoodsId);
            $("#GoodsModifyModel_GoodsCategorySel").val(data.CategoryId);
            $("#GoodsModifyModel_GoodsCategorySel").next().children().eq(1).children().eq(parseInt(data.CategoryId)).click();
            $("#GoodsModifyModel_GoodsPrice").val(data.GoodsPrice);
            $("#GoodsModifyModel_GoodsIntroduce").val(data.GoodsIntroduce);
            $("#GoodsModifyInfoForm_FMImg").attr("src", data.GoodsFMImgPath + '?' + Math.random());
            $("[name='img_" + updateGoodsId + "']").attr("src", $("#GoodsModifyInfoForm_FMImg").attr("src") + '?' + Math.random());
        }
    });
}

//修改商品信息
function ModifyGoodsInfoByUserName() {
    var goodsId = $("#GoodsModifyModel_GoodsId").val();
    var goodsInfo = {};
    goodsInfo[0] = $("#GoodsModifyModel_GoodsName").val();
    goodsInfo[1] = $("#GoodsModifyModel_GoodsCategorySel").val();
    goodsInfo[2] = $("#GoodsModifyModel_GoodsPrice").val();
    goodsInfo[3] = $("#GoodsModifyModel_GoodsIntroduce").val();
    $.ajax({
        url: "/Shop/ModifyGoodsInfoByUserName",
        data: { GoodsId: parseInt(goodsId), UserName: user.UserName, GoodsInfo: goodsInfo },
        type: "post",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data == null || data == "") {
                layer.msg("修改异常！");
            } else if (data == true) {
                GetMyGoodsAndSetFY();

                layer.msg("修改成功！");
                return true;
            } else {
                layer.msg("修改失败！");
            }
        }
    });
}

//设置我的商品瀑布流信息
function SetWaterfallData(data) {
    if (waterfall_FirstInState > 1) {
        alreadyPushShopNum = 0;
    }
    waterfall_FirstInState++;
    /*shopJsonData后台返回的商店数据*/
    shopJsonData = data;
    //初始化流加载
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
        var itemNum = $('#WaterfullDataDiv').find('.item').length;
        var itemArr = [];
        if (itemNum >= 3) {
            itemArr[0] = $('#WaterfullDataDiv').find('.item').eq(itemNum - 1).offset().top + $('#WaterfullDataDiv').find('.item').eq(itemNum - 1)[0].offsetHeight;
            itemArr[1] = $('#WaterfullDataDiv').find('.item').eq(itemNum - 2).offset().top + $('#WaterfullDataDiv').find('.item').eq(itemNum - 1)[0].offsetHeight;
            itemArr[2] = $('#WaterfullDataDiv').find('.item').eq(itemNum - 3).offset().top + $('#WaterfullDataDiv').find('.item').eq(itemNum - 1)[0].offsetHeight;
        }

        var maxTop = Math.max.apply(null, itemArr);
        if (maxTop < $(window).height() + $(document).scrollTop()) {
            //加载更多数据
            loading.data("on", false).fadeIn(300);
            (function (shopJsonData) {
                /*这里会根据后台返回的数据来判断是否你进行分页或者数据加载完毕这里假设大于12就不在加载数据*/
                if (itemNum > waterfall_LimitNum) {
                    loading.text('已到底部！');
                } else if (alreadyPushShopNum < shopJsonData.length) {
                    //设置滚动禁止
                    document.onmousewheel = function () { return false; }

                    //一次添加3条信息
                    //若不满12条记录
                    var html = "";
                    for (var i = 0; i < 3; i++) {
                        if (alreadyPushShopNum < shopJsonData.length) {
                            var date = shopJsonData[alreadyPushShopNum].CreateDate;
                            var dateSZ = date.toString().split(' ');//截取日期
                            if (shopJsonData[alreadyPushShopNum].GoodsFMImgPath == "" || shopJsonData[alreadyPushShopNum].GoodsFMImgPath == null) {
                                shopJsonData[alreadyPushShopNum].GoodsFMImgPath = "/Img/DefaultImg/GoodsFMImg.jpg";
                            }
                            html += "<li class='item' style='width:265px'><a class='a-img' onclick='GetGoodsInfo(" + shopJsonData[alreadyPushShopNum].GoodsId + ")' data-toggle='modal' data-target='#GoodsModifyModel'style='width:255px'>";
                            html += "<img name='img_" + shopJsonData[alreadyPushShopNum].GoodsId + "' src='" + shopJsonData[alreadyPushShopNum].GoodsFMImgPath + "' style='width:97%;height:100%;padding:5px;' >";
                            html += "<h4 class='description' style='font-size:15px;'>" + shopJsonData[alreadyPushShopNum].GoodsName + "</h4>";
                            html += "<p class='description' style='font-size:13px;'>" + shopJsonData[alreadyPushShopNum].GoodsIntroduce + "</p><div class='qianm clearfloat'>";
                            html += "<span class='sp1'><b style='font-size:13px;'> " + shopJsonData[alreadyPushShopNum].GoodsConcernNum + "</b></span><span class='sp1' style='font-size:13px;'>收藏</span>";
                            html += "<span class='sp3' style='font-size:13px;'>" + dateSZ[0] + "&nbsp;</span></div></a>";
                            html += "<div style='float: right;'><input type='button' class='layui-btn layui-btn-sm layui-btn-radius layui-btn-normal' onclick='DeleteMyGoods(" + shopJsonData[alreadyPushShopNum].GoodsId + ")' value='删除'></div>";
                            html += "</li>";

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
                    }, 300);
                } else {
                    layer.msg("当前页已无更多数据");
                    loading.text('已到底部！');
                }
            })(shopJsonData);
        }
    });
    $(window).scrollTop(160);
}

/*判断瀑布流最大布局宽度，最大为1280*/
function tores() {
    var tmpWid = $(window).width();
    if (tmpWid > 960) {
        tmpWid = 960;
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

/**
* 判断是否是汉字
* param charValue 要验证的数据
* returns 匹配返回true 不匹配返回false
*/
function isCharacter(charValue) {
    var reg = /^[\u4e00-\u9fa5]{0,}$/;
    return reg.test(charValue);
}
var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];  // 加权因子
var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];      // 身份证验证位值.10代表X

/**
 * 验证身份证
 * param idCard 需要验证的身份证号
 * returns 匹配返回true 不匹配返回false
 */
function IdCardValidate(idCardValue) {
    //去掉字符串头尾空格
    idCardValue = valueTrim(idCardValue.replace(/ /g, ""));
    if (idCardValue.length == 15) {
        //进行15位身份证的验证
        return isValidityBrithBy15IdCard(idCardValue);
    } else if (idCardValue.length == 18) {
        // 得到身份证数组
        var a_idCard = idCardValue.split("");
        //进行18位身份证的基本验证和第18位的验证
        if (isValidityBrithBy18IdCard(idCardValue) && isTrueValidateCodeBy18IdCard(a_idCard)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

/**
 * 判断身份证号码为18位时最后的验证位是否正确
 * param a_idCard 身份证号码数组
 * return
 */
function isTrueValidateCodeBy18IdCard(a_idCard) {
    var sum = 0; // 声明加权求和变量
    if (a_idCard[17].toLowerCase() == 'x') {
        a_idCard[17] = 10;// 将最后位为x的验证码替换为10方便后续操作
    }
    for (var i = 0; i < 17; i++) {
        sum += Wi[i] * a_idCard[i];// 加权求和
    }
    valCodePosition = sum % 11; // 得到验证码所位置
    if (a_idCard[17] == ValideCode[valCodePosition]) {
        return true;
    } else {
        return false;
    }
}

/**
 * 验证18位数身份证号码中的生日是否是有效生日
 * param idCard 18位书身份证字符串
 * return
 */
function isValidityBrithBy18IdCard(idCard18) {
    var year = idCard18.substring(6, 10);
    var month = idCard18.substring(10, 12);
    var day = idCard18.substring(12, 14);
    var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
    // 这里用getFullYear()获取年份，避免千年虫问题
    if (temp_date.getFullYear() != parseFloat(year)
       || temp_date.getMonth() != parseFloat(month) - 1
       || temp_date.getDate() != parseFloat(day)) {
        return false;
    } else {
        return true;
    }
}

/**
 * 验证15位数身份证号码中的生日是否是有效生日
 * param idCard15 15位书身份证字符串
 * return
 */
function isValidityBrithBy15IdCard(idCard15) {
    var year = idCard15.substring(6, 8);
    var month = idCard15.substring(8, 10);
    var day = idCard15.substring(10, 12);
    var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
    // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法
    if (temp_date.getYear() != parseFloat(year)
        || temp_date.getMonth() != parseFloat(month) - 1
        || temp_date.getDate() != parseFloat(day)) {
        return false;
    } else {
        return true;
    }
}

//去掉字符串头尾空格
function valueTrim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 检验18位身份证号码（15位号码可以只检测生日是否正确即可，自行解决）
 * param idCardValue 18位身份证号
 * returns 匹配返回true 不匹配返回false
 */
function idCardVildate(cid) {
    var arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];//加权因子
    var arrValid = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];//校验码
    var reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    if (reg.test(cid)) {
        var sum = 0, idx;
        for (var i = 0; i < cid.length - 1; i++) {
            // 对前17位数字与权值乘积求和
            sum += parseInt(cid.substr(i, 1), 10) * arrExp[i];
        }
        // 计算模（固定算法）
        idx = sum % 11;
        // 检验第18为是否与校验码相等
        return arrValid[idx] == cid.substr(17, 1).toUpperCase();
    } else {
        return false;
    }
}