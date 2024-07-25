layui.use(['form', 'layer', 'jquery', 'laypage'], function () {
    var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		$ = layui.jquery;

    var partPhone = /^[0-9]{11}$/;
    var partPrice = /^[1-9]{1}[0-9]*$/;
    var partMinPrice = /^[0-9]*$/;
    var partHotState = /^[01]{1}$/;
    //加载页面数据
    var shopsData = '';
    GetAllShop();

    //查询
    $(".search_btn").click(function () {
        var shopArray = [];
        if ($(".search_input").val() != '') {
            var index = layer.msg('查询中，请稍候', { icon: 16, time: false, shade: 0.8 });
            setTimeout(function () {
                $.ajax({
                    url: "/Shop/GetAllShop",
                    type: "post",
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        if (window.sessionStorage.getItem("addShopAll")) {
                            var addShopAll = window.sessionStorage.getItem("addShopAll");
                            shopsData = JSON.parse(addShopAll).concat(data);
                        } else {
                            shopsData = data;
                        }
                        var menu_node = [];
                        var selectStr = $(".search_input").val().trim();
                        menu_node = data.filter(function (e) { return (e.UserName.match(selectStr) != null) || (e.ShopId.toString().match(selectStr) != null) || (e.ShopName.match(selectStr) != null) || (e.HotState.toString().toString().match(selectStr) != null); });
                        for (var i = 0; i < menu_node.length; i++) {
                            shopArray.push(menu_node[i]);
                        }
                        shopsData = shopArray;
                        ShopsList(shopsData);
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
        var $checkbox = $('.shops_list tbody input[type="checkbox"][name="checked"]');
        var $checked = $('.shops_list tbody input[type="checkbox"][name="checked"]:checked');
        var _this = $(this);
        if ($checkbox.is(":checked")) {
            layer.confirm('确定删除选中的信息？', { icon: 3, title: '提示信息' }, function (index) {
                var index = layer.msg('删除中，请稍候', { icon: 16, time: false, shade: 0.8 });
                setTimeout(function () {
                    //删除数据
                    for (var j = 0; j < $checkbox.length; j++) {
                        if ($checkbox[j].checked == true) {
                            DeleteShop(shopsData[j].UserName);
                            //shopsData.splice(i, 1);
                            //ShopsList(shopsData);
                        }
                    }
                    $('.shops_list thead input[type="checkbox"]').prop("checked", false);
                    layer.close(index);
                    GetAllShop();
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
    $("body").on("click", ".shops_del", function () {

        var _this = $(this);
        layer.confirm('确定删除此商家？', { icon: 3, title: '提示信息' }, function (index) {
            //_this.parents("tr").remove();
            for (var i = 0; i < shopsData.length; i++) {
                if (shopsData[i].UserName == _this.attr("data-id")) {
                    DeleteShop(shopsData[i].UserName);
                    //在数组中第i位置，删除一个元素
                    shopsData.splice(i, 1);
                    ShopsList(shopsData);
                }
            }
            layer.close(index);
        });
    })

    //编辑商店点击事件绑定
    $("body").on("click", ".shops_edit", function () {
        ReadShopInfo($(this).attr("data-id"));
    });

    /*--------------------操作---------------------*/
    function ShopsList() {
        //渲染数据
        function renderDate(data, curr) {
            var dataHtml = '';
            currData = shopsData.concat().splice(curr * nums - nums, nums);
            if (currData.length != 0) {
                for (var i = 0; i < currData.length; i++) {
                    dataHtml += '<tr>'
                    + '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
                    + '<td name="shopId">' + currData[i].ShopId + '</td>'
                    + '<td>' + currData[i].ShopName + '</td>'
                    + '<td name="UserName">' + currData[i].UserName + '</td>'
                    + '<td>' + currData[i].ConcernNum + '</td>';
                    if (currData[i].HotState == 0) {
                        dataHtml += '<td><input type="checkbox"  lay-skin="switch" lay-text="是|否" lay-filter="shopHotState" ></td>'
                    } else {
                        dataHtml += '<td><input type="checkbox"  lay-skin="switch" lay-text="是|否" lay-filter="shopHotState" checked></td>'
                    }
                    dataHtml += '<td>' + currData[i].CreateDate + '</td>';
                    dataHtml += '<td>'
                                   + '<a class="layui-btn layui-btn-mini shops_edit" data-id="' + currData[i].ShopId + '"><i class="iconfont icon-edit"></i> 编辑</a>'
                                   + '<a class="layui-btn layui-btn-danger layui-btn-mini shops_del" data-id="' + currData[i].UserName + '"><i class="layui-icon">&#xe640;</i> 删除</a>'
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
            pages: Math.ceil(shopsData.length / nums),
            jump: function (obj) {
                $(".shops_content").html(renderDate(shopsData, obj.curr));
                $('.shops_list thead input[type="checkbox"]').prop("checked", false);
                //onclick事件
                form.on('switch(shopHotState)', function (data) {
                    if (data.elem.checked == true) {
                        ModifyShopHotState(parseInt(data.elem.parentElement.parentElement.children.shopId.innerText), 1);
                    } else {
                        ModifyShopHotState(parseInt(data.elem.parentElement.parentElement.children.shopId.innerText), 0);
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

    //获取所有的商店
    function GetAllShop() {
        $.ajax({
            url: "/Shop/GetAllShop",
            async: false,
            type: "post",
            datatype: "json",
            data: {},
            success: function (data) {
                shopsData = data;
                if (window.sessionStorage.getItem("addShopAll")) {
                    var addShopAll = window.sessionStorage.getItem("addShopAll");
                    shopsData = JSON.parse(addShopAll).concat(shopsData);
                }
                //执行加载数据的方法
                ShopsList();
            }
        });
    }

    //显示编辑商店信息的Model
    function ReadShopInfo(shopId) {
        if (shopId != "" && shopId != null) {
            layer.open({
                type: 2,
                title: "商店信息编辑页面",
                skin: 'layui-layer-demo', //样式类名
                closeBtn: 1, //显示关闭按钮
                anim: 4,//从左翻滚
                maxmin: true,
                shadeClose: true, //开启遮罩关闭
                content: "/Home/UpdateShopModel?Id=" + shopId,
                area: ['390px', '690px'],
                success: function (index, layero) {
                }
            });
            form.render();
        }
    }

    //删除
    function DeleteShop(UserName) {
        $.ajax({
            url: "/Admin/DeleteShop",
            data: { UserName: UserName },
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

    //修改商店激活状态
    function ModifyShopHotState(id, hotState) {
        $.ajax({
            url: "/Admin/ModifyShopHotState",
            data: { ShopId: parseInt(id), HotState: parseInt(hotState) },
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

});