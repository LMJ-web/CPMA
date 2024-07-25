layui.config({
    base: "js/"
}).use(['form', 'layer', 'jquery', 'laypage'], function () {
    var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		$ = layui.jquery;

    //加载页面数据
    var userResData = '';
    GetAllWDYYInfo("GetAllWDYYInfo");

    //查询
    $(".search_btn").click(function () {
        var userResArray = [];
        if ($(".search_input").val() != '') {
            var index = layer.msg('查询中，请稍候', { icon: 16, time: false, shade: 0.8 });
            setTimeout(function () {
                $.ajax({
                    url: "/Admin/GetAllWDYYInfo",
                    type: "post",
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        if (window.sessionStorage.getItem("addUserRes")) {
                            var addShop = window.sessionStorage.getItem("addUserRes");
                            userResData = JSON.parse(addShop).concat(data);
                        } else {
                            userResData = data;
                        }
                        var menu_node = [];
                        var selectStr = $(".search_input").val().trim();
                        menu_node = data.filter(function (e) { return (e.UserReservationId.toString().match(selectStr) != null) || (e.Name.match(selectStr) != null) || (e.MobilePhone.match(selectStr) != null) || (e.YYTime.match(selectStr) != null); });
                        for (var i = 0; i < menu_node.length; i++) {
                            userResArray.push(menu_node[i]);
                        }
                        userResData = userResArray;
                        UserResList(userResData);
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
        var $checkbox = $('.userRes_list tbody input[type="checkbox"][name="checked"]');
        var $checked = $('.userRes_list tbody input[type="checkbox"][name="checked"]:checked');
        var _this = $(this);
        if ($checkbox.is(":checked")) {
            layer.confirm('确定删除选中的信息？', { icon: 3, title: '提示信息' }, function (index) {
                var index = layer.msg('删除中，请稍候', { icon: 16, time: false, shade: 0.8 });
                setTimeout(function () {
                    //删除数据
                    for (var j = 0; j < $checkbox.length; j++) {
                        if ($checkbox[j].checked == true) {
                            DeleteRes(userResData[j].ShopReservationId);
                            //userResData.splice(i, 1);
                            //UserResList(userResData);
                        }
                    }
                    $('.userRes_list thead input[type="checkbox"]').prop("checked", false);
                    layer.close(index);
                    //layer.msg("删除成功");
                    GetAllWDYYInfo("GetAllWDYYInfo");
                    form.render();
                }, 100);
            })
        } else {
            layer.msg("请选择需要删除的預約信息！");
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
    $("body").on("click", ".userRes_del", function () {

        var _this = $(this);
        layer.confirm('确定删除此條預約信息？', { icon: 3, title: '提示信息' }, function (index) {
            //_this.parents("tr").remove();
            for (var i = 0; i < userResData.length; i++) {
                if (userResData[i].UserReservationId == _this.attr("data-id")) {
                    DeleteRes(userResData[i].UserReservationId);
                    //在数组中第i位置，删除一个元素
                    userResData.splice(i, 1);
                    UserResList(userResData);
                }
            }
            layer.close(index);
        });

    })

    //支付点击事件绑定
    $("body").on("click", "[name='PayBtn']", function () {
        SurePay($(this).attr("data-id"));
    });

    //筛选已支付數據
    $(".payBtn1").click(function () {
        GetAllWDYYInfo_IsFinish(1);
    });

    //筛选未支付數據
    $(".payBtn2").click(function () {
        GetAllWDYYInfo_IsFinish(0);
    });

    $(document).on("click", "[name='EvaluateBtn']", function (ShopReservationId) {
        Evaluate(ShopReservationId);
    });
    /*--------------------操作---------------------*/
 

    //获取所有用户的预约信息
    function GetAllWDYYInfo(method) {
        $.ajax({
            url: "/Admin/"+method,
            async: false,
            type: "post",
            datatype: "json",
            data: {},
            success: function (data) {
                userResData = data;
                if (window.sessionStorage.getItem("addUserRes")) {
                    var addUserRes = window.sessionStorage.getItem("addUserRes");
                    userResData = JSON.parse(addUserRes).concat(userResData);
                }
                //执行加载数据的方法
                UserResList();
            }
        });
    }

    function UserResList() {
        //渲染数据
        function renderDate(data, curr) {
            var dataHtml = '';
            currData = userResData.concat().splice(curr * nums - nums, nums);
            if (currData.length != 0) {
                for (var i = 0; i < currData.length; i++) {
                    dataHtml += '<tr>'
                    + '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
                    + '<td  name="ShopResId">' + currData[i].ShopReservationId + '</td>'
                    + '<td>' + currData[i].ShopName + '</td>'
                    + '<td>' + currData[i].ShopContact + '</td>'
                    + '<td>' + currData[i].ShopPhone + '</td>'
                    + '<td>' + currData[i].ShopDAddress + '</td>'
                    + '<td>' + currData[i].YYTime + '</td>';
                    if (currData[i].Admissibility == 0) {
                        dataHtml += '<td><input type="checkbox" name="show" lay-skin="switch" lay-text="是|否" lay-filter="isState" disabled></td>'
                    } else {
                        dataHtml += '<td><input type="checkbox" name="show" lay-skin="switch" lay-text="是|否" lay-filter="isState" checked disabled></td>'
                    }
                    if (currData[i].FinishState == 0) {
                        dataHtml += '<td><button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-danger" data-id="' + currData[i].ShopReservationId + '" name="PayBtn">未支付</button></td>';
                    }else if (currData[i].FinishState == 1) {
                        dataHtml += '<td><button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-normal">已支付</button></td>';
                    }
                    if (currData[i].EvaluateState == 0) {
                        dataHtml += '<td><button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-danger" onclick="Evaluate(' + currData[i].ShopReservationId + ')" name="EvaluateBtn">未评价</button></td>';
                    } else if (currData[i].EvaluateState == 1) {
                        dataHtml += '<td><button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-normal" title="满意度：' + currData[i].EvaluateStars + ' 评论：' + currData[i].EvaluateContent + '">已评价</button></td>';
                    }
                    dataHtml += '<td>'
                                 //+ '<a class="layui-btn layui-btn-mini user_edit" data-id="' + currData[i].ShopReservationId + '"><i class="iconfont icon-edit"></i> 编辑</a>'
                                 + '<a class="layui-btn layui-btn-danger layui-btn-mini userRes_del" data-id="' + currData[i].ShopReservationId + '"><i class="layui-icon">&#xe640;</i> 删除</a>'
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
            pages: Math.ceil(userResData.length / nums),
            jump: function (obj) {
                $(".userRes_content").html(renderDate(userResData, obj.curr));
                $('.userRes_list thead input[type="checkbox"]').prop("checked", false);
                //onclick事件
                //form.on('switch(isState)', function (data) {
                //    SureSL(parseInt(data.elem.parentElement.parentElement.children.ShopResId.innerText));
                //    //console.log(data.elem); //得到checkbox原始DOM对象
                //    //console.log(data.elem.checked); //开关是否开启，true或者false
                //    //console.log(data.value); //开关value值，也可以通过data.elem.value得到
                //    //console.log(data.othis); //得到美化后的DOM对象
                //});
                form.render();
            }
        })
    }

    //删除
    function DeleteRes(Id) {
        $.ajax({
            url: "/Admin/DeleteRes",
            data: { Id:parseInt(Id) },
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

    //提交
    function SureModify(index, layero) {
        ModifyShopInfo(index, layero);
    }

    //确认支付
    function SurePay(shopReservationId) {
        layer.confirm('确定支付？', {
            icon:3,
            btn: ['确定', '取消'] //可以无限个按钮
        }, function (index, layero) {
            //按钮【按钮一】的回调
            $.ajax({
                url: "/Admin/SurePay",
                type: "post",
                data: { ShopReservationId: parseInt(shopReservationId) },
                dataType: "json",
                async: false,
                success: function (data) {
                    if (data == true) {
                        layer.msg("支付成功！");
                        GetAllWDYYInfo("GetAllWDYYInfo");
                    } else {
                        layer.msg("支付失败！");
                    }

                }
            });
            layer.close(index); //如果设定了yes回调，需进行手工关闭
        }, function (index, layero) {
            //按钮【按钮二】的回调
            layer.msg("取消成功！");
        });
    }

    //弹出评论界面
    function Evaluate(shopReservationId) {
        layer.open({
            type: 2,
            area: ['600px', '300px'],
            fixed: false, //不固定
            maxmin: true,
            shadeClose: true,
            content: '/Home/EvaluateModel?ShopReservationId=' + shopReservationId,
            end: function () {
                GetAllWDYYInfo("GetAllWDYYInfo");
            }
        });
    }

    //获取已支付或者未支付的数据
    function GetAllWDYYInfo_IsFinish(finishState) {
        $.ajax({
            url: "/Admin/GetAllWDYYInfo_IsFinish",
            data: { FinishState: finishState },
            type: "post",
            dataType: "json",
            async: false,
            success: function (data) {
                if (data == null) {
                    layer.msg("获取失败！");
                } else {
                    layer.msg("获取成功！");
                    userResData = data;
                    if (window.sessionStorage.getItem("addUserRes")) {
                        var addUserRes = window.sessionStorage.getItem("addUserRes");
                        userResData = JSON.parse(addUserRes).concat(userResData);
                    }
                    //执行加载数据的方法
                    UserResList();
                }
                return true;
            }
        });
    }
});

