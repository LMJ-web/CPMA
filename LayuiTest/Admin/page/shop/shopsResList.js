layui.config({
    base: "js/"
}).use(['form', 'layer', 'jquery', 'laypage'], function () {
    var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		$ = layui.jquery;

    //加载页面数据
    var shopsResData = '';
    GetAllUserYYInfo("GetAllUserYYInfo");

    //查询
    $(".search_btn").click(function () {
        var shopsResArray = [];
        if ($(".search_input").val() != '') {
            var index = layer.msg('查询中，请稍候', { icon: 16, time: false, shade: 0.8 });
            setTimeout(function () {
                $.ajax({
                    url: "/Admin/GetAllUserYYInfo",
                    type: "post",
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        if (window.sessionStorage.getItem("addShopsRes")) {
                            var addShop = window.sessionStorage.getItem("addShopsRes");
                            shopsResData = JSON.parse(addShop).concat(data);
                        } else {
                            shopsResData = data;
                        }
                        var menu_node = [];
                        var selectStr = $(".search_input").val().trim();
                        menu_node = data.filter(function (e) { return (e.UserReservationId.toString().match(selectStr) != null) || (e.Name.match(selectStr) != null) || (e.MobilePhone.match(selectStr) != null) || (e.YYTime.match(selectStr) != null); });
                        for (var i = 0; i < menu_node.length; i++) {
                            shopsResArray.push(menu_node[i]);
                        }
                        shopsResData = shopsResArray;
                        ShopsResList(shopsResData);
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
        var $checkbox = $('.shopsRes_list tbody input[type="checkbox"][name="checked"]');
        var $checked = $('.shopsRes_list tbody input[type="checkbox"][name="checked"]:checked');
        var _this = $(this);
        if ($checkbox.is(":checked")) {
            layer.confirm('确定删除选中的信息？', { icon: 3, title: '提示信息' }, function (index) {
                var index = layer.msg('删除中，请稍候', { icon: 16, time: false, shade: 0.8 });
                setTimeout(function () {
                    //删除数据
                    for (var j = 0; j < $checkbox.length; j++) {
                        if ($checkbox[j].checked == true) {
                            //DeleteRes($checkbox[j].attributes.uid.value);
                            DeleteRes(shopsResData[j].UserReservationId);
                        }
                    }
                    $('.shopsRes_list thead input[type="checkbox"]').prop("checked", false);
                    layer.close(index);
                    GetAllUserYYInfo("GetAllUserYYInfo");
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

    //通过判断文章是否全部选中来确定全选按钮是否选中
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
    $("body").on("click", ".shopsRes_del", function () {

        var _this = $(this);
        layer.confirm('确定删除此條預約信息？', { icon: 3, title: '提示信息' }, function (index) {
            //_this.parents("tr").remove();
            for (var i = 0; i < shopsResData.length; i++) {
                if (shopsResData[i].UserReservationId == _this.attr("data-id")) {
                    DeleteRes(shopsResData[i].UserReservationId);
                    //在数组中第i位置，删除一个元素
                    shopsResData.splice(i, 1);
                    ShopsResList(shopsResData);
                }
            }
            layer.close(index);
        });

    })

    //编辑用户点击事件绑定
    $("body").on("click", ".shopsRes_edit", function () {
        ReadShopInfo($(this).attr("data-id"));
    });

    //支付点击事件绑定
    $("body").on("click", "[name='PayBtn']", function () {
        SurePay($(this).attr("data-id"));
    });

    //筛选已支付數據
    $(".payBtn1").click(function () {
        GetAllUserYYInfo("GeAlltUserYY_FinishInfo");
    });

    //筛选未支付數據
    $(".payBtn2").click(function () {
        GetAllUserYYInfo("GeAlltUserYY_NotFinishInfo");
    });
    /*--------------------操作---------------------*/
 

    //获取所有商家的用户的预约信息
    function GetAllUserYYInfo(method) {
        $.ajax({
            url: "/Admin/"+method,
            async: false,
            type: "post",
            datatype: "json",
            data: {},
            success: function (data) {
                shopsResData = data;
                if (window.sessionStorage.getItem("addShopsRes")) {
                    var addShopsRes = window.sessionStorage.getItem("addShopsRes");
                    shopsResData = JSON.parse(addShopsRes).concat(shopsResData);
                }
                //执行加载数据的方法
                ShopsResList();
            }
        });
    }

    function ShopsResList() {
        //渲染数据
        function renderDate(data, curr) {
            var dataHtml = '';
            currData = shopsResData.concat().splice(curr * nums - nums, nums);
            if (currData.length != 0) {
                for (var i = 0; i < currData.length; i++) {
                    dataHtml += '<tr>'
                    + '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
                    + '<td  name="ShopResId">' + currData[i].UserReservationId + '</td>'
                    + '<td>' + currData[i].Nick + '</td>'
                    + '<td>' + currData[i].MobilePhone + '</td>'
                    + '<td>' + currData[i].YYTime + '</td>'
                    + '<td>' + currData[i].CreateDate + '</td>';
                    if (currData[i].Admissibility == 0) {
                        dataHtml += '<td><input type="checkbox" name="show" lay-skin="switch" lay-text="是|否" lay-filter="isState" ></td>'
                    } else {
                        dataHtml += '<td><input type="checkbox" name="show" lay-skin="switch" lay-text="是|否" lay-filter="isState" checked></td>'
                    }
                    if (currData[i].FinishState == 0) {
                        dataHtml += '<td><button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-danger" >未支付</button></td>';
                    }else if (currData[i].FinishState == 1) {
                        dataHtml += '<td><button class="layui-btn layui-btn-sm layui-btn-radius layui-btn-normal">已支付</button></td>';
                    }
                    dataHtml += '<td>'
                                 //+ '<a class="layui-btn layui-btn-mini shops_edit" data-id="' + currData[i].UserReservationId + '"><i class="iconfont icon-edit"></i> 编辑</a>'
                                 + '<a class="layui-btn layui-btn-danger layui-btn-mini shopsRes_del" data-id="' + currData[i].UserReservationId + '"><i class="layui-icon">&#xe640;</i> 删除</a>'
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
            pages: Math.ceil(shopsResData.length / nums),
            jump: function (obj) {
                $(".shopsRes_content").html(renderDate(shopsResData, obj.curr));
                $('.shopsRes_list thead input[type="checkbox"]').prop("checked", false);
                //onclick事件
                form.on('switch(isState)', function (data) {
                    if (data.elem.checked == true) {
                        SureSL(parseInt(data.elem.parentElement.parentElement.children.ShopResId.innerText), 1);
                    } else {
                        SureSL(parseInt(data.elem.parentElement.parentElement.children.ShopResId.innerText), 0);
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

    //确认受理
    function SureSL(id, state) {
        $.ajax({
            url: "/shop/SureSL",
            data: { UserReservationId: id, State: state },
            async: false,
            type: "post",
            dataType: "json",
            success: function (data) {
                if (data == true) {
                    if (state == 1) {
                        layer.msg("受理成功！");
                    } else {
                        layer.msg("取消受理成功！");
                    }
                    GetAllUserYYInfo("GetAllUserYYInfo");
                } else {
                    if (state == 1) {
                        layer.msg("受理失败！");
                    } else {
                        layer.msg("取消受理失败！");
                    }
                }
            }
        });
    }

    function changeStr(data) {
        //筛选level=1的对象
        var menu_node1 = menu_data.filter(function (e) { return e.level == 1; });
    }

});

