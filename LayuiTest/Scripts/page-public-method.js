//返回json的长度
function GetJsonLength(jsonData) {
    var length = 0;
    for (var ever in jsonData) {
        length++;
    }
    return length;
}

//参数说明：str表示原字符串变量，flg表示要插入的字符串，sn表示要插入的位置
function Insert_flg(str, flg, index) {
    var newstr1 = str.substring(0, index);
    var newstr2 = str.substring(index);
    return newstr1 + flg + newstr2;
}

//展示购物车的界面
function ShowMyGoodsCart() {
    var clientHeight = document.body.clientHeight + "px";//当前屏幕的高度
    layer.open({
        type: 2,
        title: " ",
        skin: 'layui-layer-demo', //样式类名
        closeBtn: 1, //不显示关闭按钮
        anim:2,//进入效果
        maxmin: true,
        shadeClose: true, //开启遮罩关闭
        area: ['430px', clientHeight],
        content: ["/Home/CartIndex"],
        success: function (layero, index) {
            //设置弹出层居于最右边
            $(".layui-layer-iframe").css("left", document.body.clientWidth - document.getElementsByClassName("layui-layer-iframe")[0].offsetWidth);
        }
    });
}

//设置购物车清单数量
function SetCartListNum() {
    var cart_goodsList = sessionStorage.getItem("Cart_GoodsList");
    if (cart_goodsList != null && cart_goodsList != "") {
        var obj = JSON.parse(cart_goodsList);
        var length = GetJsonLength(obj);
        $("#xuanfu_cart_num").text(length);
    } else {
        $("#xuanfu_cart_num").text("0");
    }
}

//退出
function Quit() {
    $.ajax({
        url: "/User/UserLogOut",
        data: {},
        async: false,
        type: "post",
        success: function (data) {
            sessionStorage.removeItem("user");
            layer.msg('退出成功！', {
                time: 2000, //2s后自动关闭
                btn: ['确认']
            });
        },
        error: function (data, type, err) {
            console.log("ajax错误类型：" + type);
            console.log(err);
        }
    });
}