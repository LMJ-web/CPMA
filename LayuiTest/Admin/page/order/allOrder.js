layui.config({
    base: "js/"
}).use(['form', 'layer', 'jquery', 'laypage'], function () {
    var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		$ = layui.jquery;

    //加载页面数据
    var orderData = '';
    GetAllOrder();

    //查询
    $(".search_btn").click(function () {
        var orderArray = [];
        if ($(".search_input").val() != '') {
            var index = layer.msg('查询中，请稍候', { icon: 16, time: false, shade: 0.8 });
            setTimeout(function () {
                $.ajax({
                    url: "/Admin/GetAllOrder",
                    type: "post",
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        if (window.sessionStorage.getItem("addAllOrder")) {
                            var addOrder = window.sessionStorage.getItem("addAllOrder");
                            orderData = JSON.parse(addOrder).concat(data);
                        } else {
                            orderData = data;
                        }
                        var menu_node = [];
                        var selectStr = $(".search_input").val().trim();
                        menu_node = data.filter(function (e) { return (e.OrderId.toString().match(selectStr) != null) || (e.ShopName.match(selectStr) != null) || (e.UserId.toString().match(selectStr) != null); });
                        for (var i = 0; i < menu_node.length; i++) {
                            orderArray.push(menu_node[i]);
                        }
                        orderData = orderArray;
                        OrderList(orderData);
                    }
                })

                layer.close(index);
            }, 100);
        } else {
            layer.msg("请输入需要查询的内容");
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

    //批量删除
    $(".batchDel").click(function () {
        var $checkbox = $('.order_list tbody input[type="checkbox"][name="checked"]');
        var $checked = $('.order_list tbody input[type="checkbox"][name="checked"]:checked');
        var _this = $(this);
        if ($checkbox.is(":checked")) {
            layer.confirm('确定删除选中的信息？', { icon: 3, title: '提示信息' }, function (index) {
                var index = layer.msg('删除中，请稍候', { icon: 16, time: false, shade: 0.8 });
                setTimeout(function () {
                    //删除数据
                    for (var j = 0; j < $checkbox.length; j++) {
                        if ($checkbox[j].checked == true) {
                            //DeleteRes($checkbox[j].attributes.uid.value);
                            DeleteOrder(orderData[j].OrderId);
                        }
                    }
                    $('.order_list thead input[type="checkbox"]').prop("checked", false);
                    layer.close(index);
                    GetAllOrder("GetAllOrder");
                    form.render();
                }, 100);
            })
        } else {
            layer.msg("请选择需要删除的預約信息！");
        }
    })

    //删除点击事件绑定
    $("body").on("click", ".order_del", function () {
        var _this = $(this);
        layer.confirm('确定删除此條信息？', { icon: 3, title: '提示信息' }, function (index) {
            //_this.parents("tr").remove();
            for (var i = 0; i < orderData.length; i++) {
                if (orderData[i].OrderId == _this.attr("data-id")) {
                    DeleteOrder(orderData[i].OrderId);
                    //在数组中第i位置，删除一个元素
                    orderData.splice(i, 1);
                    OrderList(orderData);
                }
            }
            layer.close(index);
        });

    })

    //评价事件绑定
    $("body").on("click", "[name='EvaluateBtn']", function () {
        ModifyOrderEvaluate($(this).attr("data-id"));
    })

    /*--------------------操作---------------------*/

    //获取所有的订单信息
    function GetAllOrder() {
        $.ajax({
            url: "/Admin/GetAllOrder",
            async: false,
            type: "post",
            datatype: "json",
            data: {},
            success: function (data) {
                orderData = data;
                if (window.sessionStorage.getItem("addAllOrder")) {
                    var addShopsRes = window.sessionStorage.getItem("addAllOrder");
                    orderData = JSON.parse(addShopsRes).concat(orderData);
                }
                //执行加载数据的方法
                OrderList();
            }
        });
    }

    //渲染
    function OrderList() {
        //渲染数据
        function renderDate(data, curr) {
            var dataHtml = '';
            currData = orderData.concat().splice(curr * nums - nums, nums);
            if (currData.length != 0) {
                for (var i = 0; i < currData.length; i++) {
                    dataHtml += '<tr>'
                    + '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
                    + '<td  name="OrderId">' + currData[i].OrderId + '</td>'
                    + '<td>' + currData[i].ShopName + '</td>'
                    + '<td>' + currData[i].UserId + '</td>'
                    + '<td>' + currData[i].GoodsName + '</td>'
                    + '<td>' + currData[i].GoodsPrice + '</td>'
                    + '<td>' + currData[i].Num + '</td>';
                    if (currData[i].ReceiptState == 0) {
                        dataHtml += '<td><input type="checkbox" name="show" lay-skin="switch" lay-text="是|否" lay-filter="isState" ></td>'
                    } else {
                        dataHtml += '<td><input type="checkbox" name="show" lay-skin="switch" lay-text="是|否" lay-filter="isState" checked></td>'
                    }
                    if (currData[i].EvaluateState==0) {
                        dataHtml += '<td><button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-danger" name="EvaluateBtn"  data-id="' + currData[i].OrderId + '">未评价</button></td>';
                    }else {
                        dataHtml += '<td><button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-normal" title="满意度：' + currData[i].EvaluateStars+ ' 评论：' + currData[i].EvaluateContent + '">已评价</button></td>';
                    }
                    dataHtml += '<td>'
                                 //+ '<a class="layui-btn layui-btn-mini shops_edit" data-id="' + currData[i].UserReservationId + '"><i class="iconfont icon-edit"></i> 编辑</a>'
                                 + '<a class="layui-btn layui-btn-danger layui-btn-mini order_del" data-id="' + currData[i].OrderId + '"><i class="layui-icon">&#xe640;</i> 删除</a>'
                            + '</td>';
                    dataHtml +='</tr>';
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
            pages: Math.ceil(orderData.length / nums),
            jump: function (obj) {
                $(".order_content").html(renderDate(orderData, obj.curr));
                $('.order_list thead input[type="checkbox"]').prop("checked", false);
                //onclick事件
                form.on('switch(isState)', function (data) {
                    if (data.elem.checked == true) {
                        SureSH(parseInt(data.elem.parentElement.parentElement.children.OrderId.innerText), 1);
                    } else {
                        SureSH(parseInt(data.elem.parentElement.parentElement.children.OrderId.innerText), 0);
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

    //删除
    function DeleteOrder(orderId) {
        $.ajax({
            url: "/Admin/DeleteOrder",
            data: { Id: parseInt(orderId) },
            type: "post",
            dataType: "json",
            async: false,
            success: function (data) {
                if (data == null) {
                    layer.msg("删除失败！");
                } else {
                    layer.msg("删除成功！");
                }
            }
        });
    }

    //确认收货
    function SureSH(orderId,state) {
        $.ajax({
            url: "/Admin/SureSH",
            data: { OrderId: parseInt(orderId), State: state },
            type: "post",
            dataType: "json",
            async: false,
            success: function (data) {
                if (data == null) {
                    layer.msg("收货处理异常！");
                } else {
                    layer.msg("收货处理成功！");
                }
            }
        });
    }

    //弹出评论界面
    function ModifyOrderEvaluate(orderId) {
        layer.open({
            type: 2,
            area: ['600px', '300px'],
            fixed: false, //不固定
            maxmin: true,
            shadeClose: true,
            content: '/Admin/OrderEvaluateModel?OrderId=' + orderId,
            end: function () {
                GetAllOrder();
            }
        });
    }

});

