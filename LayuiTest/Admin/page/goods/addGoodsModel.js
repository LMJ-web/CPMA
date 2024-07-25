//注意：parent 是 JS 自带的全局对象，可用于操作父页面
var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
var partPrice = /^[1-9]{1}[0-9]*$/;
var part01 = /^[01]{1}$/;
var partMinPrice = /^[0-9]*$/;
//获取类别
function GetGoodsCategoryToSel() {
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
                    $("#GoodsModel_GoodsCategorySel").next().children().eq(1).html(html1);
                    $("#GoodsModel_GoodsCategorySel").html(html2);//自己的select选项数据
                    form.render();//没有写这个，操作后没有效果
                });
            }
        }
    });
}

//获取商店
function GetShopToSel() {
    $.ajax({
        url: "/Shop/GetAllShop",
        async: false,
        type: "post",
        datatype: "json",
        data: {},
        success: function (data) {
            if (data != "" && data != null) {
                layui.use(['layer', 'form'], function () {
                    var form = layui.form;
                    var length = data.length;
                    var html1 = '<dd lay-value="" class="layui-select-tips layui-this">直接选择或搜索选择</dd>';
                    var html2 = '<option value="" >直接选择或搜索选择</option>';
                    for (var i = 0; i < length; i++) {
                        html1 += '<dd lay-value="' + data[i].ShopId + '">' +  data[i].ShopName + '</dd>';
                        html2 += '<option value="' + data[i].ShopId + '">' +  data[i].ShopName + '</option>';
                    }
                    $("#GoodsModel_ShopSel").next().children().eq(1).html(html1);//layui动态生成的<dl class="layui-anim layui-anim-upbit"/>的选项数据
                    $("#GoodsModel_ShopSel").html(html2);//自己的select选项数据

                    form.render();//没有写这个，操作后没有效果
                });

            }
        }
    });
}

//确认添加
function SureAdd() {
    var goods = {};
    var goodsName = $("#GoodsName").val();
    var goodsAddModel_ShopSel = $("#GoodsModel_ShopSel").val();
    var goodsAddModel_GoodsCategorySel = $("#GoodsModel_GoodsCategorySel").val();
    var goodsPrice = $("#GoodsPrice").val();
    var goodsMinPrice = $("#GoodsMinPrice").val();
    var goodsIntroduce = $("#GoodsIntroduce").val();
    var hotState = $("#HotState").val();

    if (goodsName == '' || goodsName == null) {
        parent.layer.msg('商品名字不能为空！');
        return false;
    } else if (goodsAddModel_ShopSel == "" || goodsAddModel_ShopSel == null) {
        parent.layer.msg('商店不能为空！');
        return false;
    } else if (goodsAddModel_GoodsCategorySel == "" || goodsAddModel_GoodsCategorySel == null) {
        parent.layer.msg('类别不能为空！');
        return false;
    } else if (goodsPrice == "" || goodsPrice == null || goodsPrice == "0" || partPrice.test(goodsPrice) == false) {
        parent.layer.msg('请输入正确的价格！');
        return false;
    } else if (goodsMinPrice == "" || goodsMinPrice == null || partMinPrice.test(goodsMinPrice) == false) {
        parent.layer.msg('请输入正确的促销价格！');
        return false;
    } else if (goodsIntroduce == "" || goodsIntroduce == null) {
        parent.layer.msg('简介不能为空！');
        return false;
    } else if (part01.test(hotState) == false) {
        parent.layer.msg('请输入正确的热门状态（0|1）!');
        return false;
    } else {
        goods[0] = goodsName;
        goods[1] = goodsAddModel_ShopSel;
        goods[2] = goodsAddModel_GoodsCategorySel;
        goods[3] = goodsPrice;
        goods[4] = goodsMinPrice;
        goods[5] = goodsIntroduce;
        goods[6] = hotState;
        $.ajax({
            type: "post",
            url: "/Admin/AddGoods",
            data: {
                Goods: goods
            },
            async: false,
            success: function (data) {
                if (data == null || data == "") {
                    parent.layer.msg("添加异常！");
                } else if (data == true) {
                    parent.layer.msg("添加成功！");
                    //parent.layer.close(index);
                    setTimeout(function () {
                        parent.location.reload();
                    }, 1000);
         
                } else {
                    parent.layer.msg("添加失败！");
                }
            }
        });
    }
}

//确认更新
function SureUpdate() {
    var goods = {};
    //注意：parent 是 JS 自带的全局对象，可用于操作父页面
    var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
    var goodsId = $("#GoodsId").val();
    var goodsName = $("#GoodsName").val();
    var goodsAddModel_ShopSel = $("#GoodsModel_ShopSel").val();
    var goodsAddModel_GoodsCategorySel = $("#GoodsModel_GoodsCategorySel").val();
    var goodsPrice = $("#GoodsPrice").val();
    var goodsMinPrice = $("#GoodsMinPrice").val();
    var goodsIntroduce = $("#GoodsIntroduce").val();
    var hotState = $("#HotState").val();

    if (goodsName == '' || goodsName == null) {
        parent.layer.msg('商品名字不能为空！');
        return false;
    } else if (goodsAddModel_GoodsCategorySel == "" || goodsAddModel_GoodsCategorySel == null) {
        parent.layer.msg('类别不能为空！');
        return false;
    } else if (goodsPrice == "" || goodsPrice == null || goodsPrice == "0" || partPrice.test(goodsPrice) == false) {
        parent.layer.msg('请输入正确的价格！');
        return false;
    } else if (goodsMinPrice == "" || goodsMinPrice == null || partMinPrice.test(goodsMinPrice) == false) {
        parent.layer.msg('请输入正确的促销价格！');
        return false;
    } else if (goodsIntroduce == "" || goodsIntroduce == null) {
        parent.layer.msg('简介不能为空！');
        return false;
    } else if (part01.test(hotState) == false) {
        parent.layer.msg('请输入正确的热门状态（0|1）!');
        return false;
    } else {
        goods[0] = goodsId;
        goods[1] = goodsName;
        goods[2] = goodsAddModel_ShopSel;
        goods[3] = goodsAddModel_GoodsCategorySel;
        goods[4] = goodsPrice;
        goods[5] = goodsMinPrice;
        goods[6] = goodsIntroduce;
        goods[7] = hotState;
        $.ajax({
            type: "post",
            url: "/Admin/UpdateGoods",
            data: {
                Goods: goods
            },
            async: false,
            success: function (data) {
                if (data == null || data == "") {
                    parent.layer.msg("更新异常！");
                } else if (data == true) {
                    parent.layer.msg("更新成功！");
                    //parent.layer.close(index);
                    setTimeout(function () {
                        parent.location.reload();
                    }, 500);
                } else {
                    parent.layer.msg("更新失败！");
                }
            }
        });
    }
}