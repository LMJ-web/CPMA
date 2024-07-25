var user = sessionStorage.getItem("user");
//<!----------------操作------------------>

function LayerAlert(msg) {
    layer.alert(msg, { icon: 5 });
}

//收藏商店
function CollectShop(ShopId) {
    if (user == "" || user == null) {
        LayerAlert("请先登录才能收藏！");
    } else {
        $.ajax({
            async: false,
            type: "post",
            dataType: "json",
            data: { UserName: user.UserName, ShopId: ShopId },
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

//添加进购物车
function AddInCart(goodsId) {
    var addFlag = false;
    var Cart_GoodsList = sessionStorage.getItem("Cart_GoodsList");
    var user = sessionStorage.getItem("user");
    if (user != "" && user != null) {
        if (Cart_GoodsList != "" && Cart_GoodsList != null) {
            var obj_string = sessionStorage.getItem("Cart_GoodsList").toString();
            var obj = JSON.parse(sessionStorage.getItem("Cart_GoodsList"));
            var count = GetJsonLength(obj);
            //判断是否已经存在当前添加的商品
            for (var i = 0; i < count; i++) {
                if (goodsId == obj[i].GoodsId) {
                    layer.msg("购物车已存在该商品，请勿重复加入！");
                    addFlag = true;
                    break;
                }
            }
            if (!addFlag) {
                var flg = ',"' + count + '":{"GoodsId":' + $(".GoodsId").val() + ',"GoodsName":"' + $(".GoodsName").text() + '","ShopId":' + $(".ShopId").val() + ',"ShopName":"' + $(".ShopName").text() + '","GoodsPrice":' + $(".GoodsPrice").val() + ',"GoodsFMImgPath":"' + $(".GoodsFMImgPath").val() + '","Num":1}';
                var index = obj_string.lastIndexOf("}");
                var temp_string = Insert_flg(obj_string, flg, index);
                sessionStorage.setItem("Cart_GoodsList", temp_string);
                layer.msg("添加进购物车成功！");
                SetCartListNum();
            }
        } else {
            var obj_string = '{"0":{"GoodsId":' + $(".GoodsId").val() + ',"GoodsName":"' + $(".GoodsName").text() + '","ShopId":' + $(".ShopId").val() + ',"ShopName":"' + $(".ShopName").text() + '","GoodsPrice":' + $(".GoodsPrice").val() + ',"GoodsFMImgPath":"' + $(".GoodsFMImgPath").val() + '","Num":1}}';
            sessionStorage.setItem("Cart_GoodsList", obj_string);
            layer.msg("添加进购物车成功！");
            SetCartListNum();
        }
    }
}

//设置图片展示示图
function SetGoodsShowImg() {
    var html = "";
    //封面图
    html += '<img src="' + $(".GoodsFMImgPath").val() + '" width="400" height="500" />';
    //宣传图
    var imgList = $(".GoodsShowImgPath").val().split(",");
    var length = imgList.length;
    for (var i = 0; i < length; i++) {
        html += '<img src="' + imgList[i] + '" width="400" height="500" />';
    }
    $("#showbox").html(html);
}

//购买
function SureBuy(id) {
    if (user != "" && user != null) {
        AddInCart(id);
        var goodsArr = {};
        var index = 0;
        var goodsListObj = JSON.parse(sessionStorage.getItem("Cart_GoodsList"));
        var length = GetJsonLength(goodsListObj);
        //取得购物车Json中的值--价格从数据库获取
        for (var i = 0; i < length; i++) {
            goodsArr[index] = {};
            goodsArr[index][0] = goodsListObj[i].GoodsId;
            goodsArr[index][1] = goodsListObj[i].ShopId;
            goodsArr[index][2] = goodsListObj[i].Num;
            index++;

        }
        $.ajax({
            url: "/User/ClearCart",
            data: { UserName: user.UserName, GoodsList: goodsArr },
            async: false,
            type: "post",
            dataType: "json",
            success: function (data) {
                if (data) {
                    layer.msg("购买成功！");
                    sessionStorage.removeItem("Cart_GoodsList");
                    SetCartListNum();
                } else if (data == false) {
                    layer.msg("购买失败，余额不足，请及时充值！");
                    sessionStorage.removeItem("Cart_GoodsList");
                    SetCartListNum();
                } else if (data == "" || data == null) {
                    layer.msg("购买异常！");
                }
            }
        });

    } else {
        layer.msg("请先登录！");
    }
}



