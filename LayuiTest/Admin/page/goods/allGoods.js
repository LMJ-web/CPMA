layui.config({
    base: "js/"
}).use(['form', 'layer', 'jquery', 'laypage'], function () {

    var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		$ = layui.jquery;

    //加载页面数据
    var goodsData = '';
    GetListGoodsInfo();

    //查询
    $(".search_btn").click(function () {
        var goodsArray = [];
        if ($(".search_input").val() != '') {
            var index = layer.msg('查询中，请稍候', { icon: 16, time: false, shade: 0.8 });
            setTimeout(function () {
                $.ajax({
                    url: "/Admin/GetListGoodsInfo",
                    type: "post",
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        if (window.sessionStorage.getItem("addGoodsAll")) {
                            var addGoodsAll = window.sessionStorage.getItem("addGoodsAll");
                            goodsData = JSON.parse(addGoodsAll).concat(data);
                        } else {
                            goodsData = data;
                        }
                        var menu_node = [];
                        var selectStr = $(".search_input").val().trim();
                        menu_node = data.filter(function (e) { return (e.GoodsId.toString().match(selectStr) != null) || (e.ShopId.toString().match(selectStr) != null) || (e.CategoryName.toString().match(selectStr) != null) });
                        for (var i = 0; i < menu_node.length; i++) {
                            goodsArray.push(menu_node[i]);
                        }
                        goodsData = goodsArray;
                        GoodsList(goodsData);
                    }
                })

                layer.close(index);
            }, 100);
        } else {
            layer.msg("请输入需要查询的内容");
        }
    })

    //批量删除
    $(".batchDel").click(function () {
        var $checkbox = $('.goods_list tbody input[type="checkbox"][name="checked"]');
        var $checked = $('.goods_list tbody input[type="checkbox"][name="checked"]:checked');
        var _this = $(this);
        if ($checkbox.is(":checked")) {
            layer.confirm('确定删除选中的信息？', { icon: 3, title: '提示信息' }, function (index) {
                var index = layer.msg('删除中，请稍候', { icon: 16, time: false, shade: 0.8 });
                setTimeout(function () {
                    //删除数据
                    for (var j = 0; j < $checkbox.length; j++) {
                        if ($checkbox[j].checked == true) {
                            DeleteGoods(goodsData[j].GoodsId);
                            //goodsData.splice(i, 1);
                            //GoodsList(goodsData);
                        }
                    }
                    $('.goods_list thead input[type="checkbox"]').prop("checked", false);
                    layer.close(index);
                    GetListGoodsInfo();
                    form.render();
                }, 100);
            })
        } else {
            layer.msg("请选择需要删除的商家！");
        }
    })

    //全选
    form.on('checkbox(allChoose)', function (data) {
        var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"])');
        child.each(function (index, item) {
            item.checked = data.elem.checked;
        });
        form.render('checkbox');
    });

    //通过判断是否全部选中来确定全选按钮是否选中
    form.on("checkbox(choose)", function (data) {
        var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"])');
        var childChecked = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"]):checked')
        if (childChecked.length == child.length) {
            $(data.elem).parents('table').find('thead input#allChoose').get(0).checked = true;
        } else {
            $(data.elem).parents('table').find('thead input#allChoose').get(0).checked = false;
        }
        form.render('checkbox');
    })

    //删除点击事件绑定
    $("body").on("click", ".goods_del", function () {

        var _this = $(this);
        layer.confirm('确定删除此条信息？', { icon: 3, title: '提示信息' }, function (index) {
            //_this.parents("tr").remove();
            for (var i = 0; i < goodsData.length; i++) {
                if (goodsData[i].GoodsId == _this.attr("data-id")) {
                    DeleteGoods(goodsData[i].GoodsId);
                    //在数组中第i位置，删除一个元素
                    goodsData.splice(i, 1);
                    GoodsList(goodsData);
                }
            }
            layer.close(index);
        });
    })

    //添加商品点击事件绑定
    $("body").on("click", ".goodsAdd_btn", function () {
        ShowAddGoodsModel();
    });

    //编辑点击事件绑定
    $("body").on("click", ".goods_edit", function () {
        ShowUpdateGoodsModel($(this).attr("data-id"));
    });

    /*--------------------操作---------------------*/
    function GoodsList() {
        //渲染数据
        function renderDate(data, curr) {
            var dataHtml = '';
            currData = goodsData.concat().splice(curr * nums - nums, nums);
            if (currData.length != 0) {
                for (var i = 0; i < currData.length; i++) {
                    dataHtml += '<tr>'
                    + '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
                    + '<td name="goodsId">' + currData[i].GoodsId + '</td>'
                    + '<td>' + currData[i].ShopId + '</td>'
                    + '<td>' + currData[i].CategoryName + '</td>'
                    + '<td>' + currData[i].GoodsName + '</td>'
                    + '<td>' + currData[i].GoodsPrice + '</td>'
                    + '<td>' + currData[i].GoodsMinPrice + '</td>'
                    + '<td>' + currData[i].GoodsConcernNum + '</td>'
                    + '<td>' + currData[i].GoodsIntroduce + '</td>';
                    if (currData[i].HotState == 0) {
                        dataHtml += '<td><input type="checkbox" name="goodsHotState" lay-skin="switch" lay-text="是|否" lay-filter="goodsHotState" ></td>'
                    } else {
                        dataHtml += '<td><input type="checkbox" name="goodsHotState" lay-skin="switch" lay-text="是|否" lay-filter="goodsHotState" checked></td>'
                    }
                    dataHtml += '<td>' + currData[i].CreateDate + '</td>';
                    dataHtml += '<td>'
                                   + '<a class="layui-btn layui-btn-mini goods_edit" data-id="' + currData[i].GoodsId + '"><i class="iconfont icon-edit"></i> 编辑</a>'
                                   + '<a class="layui-btn layui-btn-danger layui-btn-mini goods_del" data-id="' + currData[i].GoodsId + '"><i class="layui-icon">&#xe640;</i> 删除</a>'
                              + '</td>'
                    + '</tr>';
                }
            } else {
                dataHtml = '<tr><td colspan="8">暂无数据</td></tr>';
            }
            return dataHtml;
        }
        //分页
        var nums = 10; //每页出现的数据量
        laypage({
            cont: "page",
            pages: Math.ceil(goodsData.length / nums),
            jump: function (obj) {
                $(".goods_content").html(renderDate(goodsData, obj.curr));
                $('.goods_list thead input[type="checkbox"]').prop("checked", false);
                //onclick事件
                form.on('switch(goodsHotState)', function (data) {
                    if (data.elem.checked == true) {
                        ModifyGoodsHotState(parseInt(data.elem.parentElement.parentElement.children.goodsId.innerText), 1);
                    } else {
                        ModifyGoodsHotState(parseInt(data.elem.parentElement.parentElement.children.goodsId.innerText), 0);
                    }
                    //console.log(data.elem); //得到checkbox原始DOM对象
                    //console.log(data.elem.checked); //开关是否开启，true或者false
                    //console.log(data.value); //开关value值，也可以通过data.elem.value得到
                    //console.log(data.othis); //得到美化后的DOM对象
                });
                form.render();
            }
        })
    }

    //获取所有的商品
    function GetListGoodsInfo() {
        $.ajax({
            url: "/Admin/GetListGoodsInfo",
            async: false,
            type: "post",
            datatype: "json",
            data: {},
            success: function (data) {
                goodsData = data;
                if (window.sessionStorage.getItem("addGoodsAll")) {
                    var addGoodsAll = window.sessionStorage.getItem("addGoodsAll");
                    goodsData = JSON.parse(addGoodsAll).concat(goodsData);
                }
                //执行加载数据的方法
                GoodsList();
            }
        });
    }

    //显示添加商品Model
    function ShowAddGoodsModel() {
        layer.open({
            type: 2,
            title: "商品添加页面",
            skin: 'layui-layer-demo', //样式类名
            closeBtn: 1, //显示关闭按钮
            anim: 4,
            maxmin: true,
            shadeClose: true, //开启遮罩关闭
            area: ['390px', '620px'],
            content: "/Home/AddGoodsModel"
        });
        renderForm();
    }

    //显示编辑商品信息的Model
    function ShowUpdateGoodsModel(goodsId) {
        if (goodsId != "" && goodsId != null) {
            layer.open({
                type: 2,
                title: "商品信息编辑页面",
                skin: 'layui-layer-demo', //样式类名
                closeBtn: 1, //显示关闭按钮
                anim: 4,//从左翻滚
                maxmin: true,
                shadeClose: true, //开启遮罩关闭
                area: ['390px', '730px'],
                content: "/Home/UpdateGoodsModel?Id=" + goodsId,
                success: function (index, layero) {
                }
            });
            form.render();
        }
    }

    //删除
    function DeleteGoods(goodsId) {
        $.ajax({
            url: "/Admin/DeleteGoods",
            data: { GoodsId: goodsId },
            type: "post",
            dataType: "json",
            async: false,
            success: function (data) {
                if (data == null) {
                    layer.msg("删除失败！");
                } else {
                    layer.msg("删除成功！");
                }
                return true;
            }
        });
    }

    //添加提交
    function SureModify(index, layero) {
        ModifyGoodsInfo(index, layero);
    }

    //修改商品信息
    function ModifyGoodsInfo(index, layero) {
        $.ajax({
            url: "/Admin/ModifyGoodsInfo",
            dataType: "json",
            type: "post",
            asyns: false,
            data: {
                GoodsId: layero.children().eq(1).children().children().eq(9).children().eq(1).children().val(),
                GoodsName: layero.children().eq(1).children().children().eq(0).children().eq(1).children().val(),
                GoodsContact: layero.children().eq(1).children().children().eq(1).children().eq(1).children().val(),
                GoodsPhone: layero.children().eq(1).children().children().eq(2).children().eq(1).children().val(),
                MinPrice: layero.children().eq(1).children().children().eq(3).children().eq(1).children().val(),
                MaxPrice: layero.children().eq(1).children().children().eq(4).children().eq(1).children().val(),
                GoodsAddress: layero.children().eq(1).children().children().eq(5).children().eq(1).children().val(),
                GoodsDAddress: layero.children().eq(1).children().children().eq(6).children().eq(1).children().val(),
                GoodsIntroduce: layero.children().eq(1).children().children().eq(7).children().eq(1).children().val(),
                HotState: layero.children().eq(1).children().children().eq(8).children().eq(1).children().val(),
            },
            success: function (data) {
                if (data == null) {
                    layer.msg("出现异常！");
                    return false;
                }
                else if (data == true) {
                    layer.msg("修改成功！");
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                    GetListGoodsInfo();

                } else {
                    layer.msg("修改失败！");

                }
            }

        });


    }

    //修改商品激活状态
    function ModifyGoodsHotState(id, hotState) {
        $.ajax({
            url: "/Admin/ModifyGoodsHotState",
            data: { GoodsId: parseInt(id), HotState: parseInt(hotState) },
            async: false,
            type: "post",
            dataType: "json",
            success: function (data) {
                if (data == true) {
                    if (hotState == 1) {
                        layer.msg("激活成功！");
                    } else {
                        layer.msg("取消激活成功！");
                    }
                    GetListGoodsInfo();
                } else if (data == false) {
                    if (hotState == 1) {
                        layer.msg("激活失败！");
                    } else {
                        layer.msg("取消激活失败！");
                    }
                } else if (data == null || data == "") {
                    layer.msg("异常！");
                }
            }
        });
    }

    //重新渲染表单
    function renderForm() {
        layui.use('form', function () {
            var form = layui.form();//高版本建议把括号去掉，有的低版本，需要加()
            form.render();
        });
    }

});

