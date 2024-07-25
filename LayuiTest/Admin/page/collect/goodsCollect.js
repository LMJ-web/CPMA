layui.config({
    base: "js/"
}).use(['form', 'layer', 'jquery', 'laypage'], function () {
    var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		$ = layui.jquery;

    //加载页面数据
    var goodsColData = '';
    GetAllColGoods();

    //查询
    $(".search_btn").click(function () {
        var goodsArray = [];
        if ($(".search_input").val() != '') {
            var index = layer.msg('查询中，请稍候', { icon: 16, time: false, shade: 0.8 });
            setTimeout(function () {
                $.ajax({
                    url: "/Admin/GetAllColGoods",
                    type: "post",
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        if (window.sessionStorage.getItem("addGoodsCol")) {
                            var addGoodsCol = window.sessionStorage.getItem("addGoodsCol");
                            goodsColData = JSON.parse(addGoodsCol).concat(data);
                        } else {
                            goodsColData = data;
                        }
                        var menu_node = [];
                        var selectStr = $(".search_input").val().trim();
                        menu_node = data.filter(function (e) { return (e.GoodsColId.toString().match(selectStr) != null) || e.UserId.toString().match(selectStr) != null || e.ShopId.toString().match(selectStr) != null || e.GoodsId.toString().match(selectStr) != null; });
                        for (var i = 0; i < menu_node.length; i++) {
                            goodsArray.push(menu_node[i]);
                        }
                        goodsColData = goodsArray;
                        GoodsColList(goodsColData);
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
        var $checkbox = $('.goodsCol_list tbody input[type="checkbox"][name="checked"]');
        var $checked = $('.goodsCol_list tbody input[type="checkbox"][name="checked"]:checked');
        var _this = $(this);
        if ($checkbox.is(":checked")) {
            layer.confirm('确定删除选中的信息？', { icon: 3, title: '提示信息' }, function (index) {
                var index = layer.msg('删除中，请稍候', { icon: 16, time: false, shade: 0.8 });
                setTimeout(function () {
                    //删除数据
                    for (var j = 0; j < $checkbox.length; j++) {
                        if ($checkbox[j].checked == true) {
                            DeleteColGoods(goodsColData[j].GoodsColId);
                        }
                    }
                    $('.goodsCol_list thead input[type="checkbox"]').prop("checked", false);
                    layer.close(index);
                    GetAllColGoods();
                    form.render();
                }, 100);
            })
        } else {
            layer.msg("请选择需要删除的收藏商品！");
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
    $("body").on("click", ".goodsCol_del", function () {

        var _this = $(this);
        layer.confirm('确定删除此条信息？', { icon: 3, title: '提示信息' }, function (index) {
            //_this.parents("tr").remove();
            for (var i = 0; i < goodsColData.length; i++) {
                if (goodsColData[i].GoodsColId == _this.attr("data-id")) {
                    DeleteColGoods(goodsColData[i].GoodsColId);
                    //在数组中第i位置，删除一个元素
                    goodsColData.splice(i, 1);
                    GoodsColList(goodsColData);
                }
            }
            layer.close(index);
        });
    })

    //编辑用户点击事件绑定
    $("body").on("click", ".goodsCol_edit", function () {
        ReadColGoodsInfoById($(this).attr("data-id"));
    });

    $("body").on("click", ".goodsColAdd_btn", function () {
        ShowAddGoodsColModel();
    });
    /*--------------------操作---------------------*/
    function GoodsColList() {
        //渲染数据
        function renderDate(data, curr) {
            var dataHtml = '';
            currData = goodsColData.concat().splice(curr * nums - nums, nums);
            if (currData.length != 0) {
                for (var i = 0; i < currData.length; i++) {
                    dataHtml += '<tr>'
                    + '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
                    + '<td name="GoodsColId">' + currData[i].GoodsColId + '</td>'
                    + '<td>' + currData[i].UserId + '</td>'
                    + '<td>' + currData[i].ShopId + '</td>'
                    + '<td>' + currData[i].GoodsId + '</td>'
                    + '<td>' + currData[i].GoodsName + '</td>'
                    + '<td>' + currData[i].CollectNum + '</td>'
                    + '<td>' + currData[i].CreateDate + '</td>';
                    dataHtml += '<td>'
                                   //+ '<a class="layui-btn layui-btn-mini goodsCol_edit" data-id="' + currData[i].GoodsColId + '"><i class="iconfont icon-edit"></i> 编辑</a>'
                                   + '<a class="layui-btn layui-btn-danger layui-btn-mini goodsCol_del" data-id="' + currData[i].GoodsColId + '"><i class="layui-icon">&#xe640;</i> 删除</a>'
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
            pages: Math.ceil(goodsColData.length / nums),
            jump: function (obj) {
                $(".goodsCol_content").html(renderDate(goodsColData, obj.curr));
                $('.goodsCol_list thead input[type="checkbox"]').prop("checked", false);
                //onclick事件
                form.on('switch(isState)', function (data) {
                    if (data.elem.checked == true) {
                        ModifyNoticeStatus(parseInt(data.elem.parentElement.parentElement.children.NoticeId.innerText), 1);
                    } else {
                        ModifyNoticeStatus(parseInt(data.elem.parentElement.parentElement.children.NoticeId.innerText), 0);
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

    //获取所有的收藏的商品信息
    function GetAllColGoods() {
        $.ajax({
            url: "/Admin/GetAllColGoods",
            async: false,
            type: "post",
            datatype: "json",
            data: {},
            success: function (data) {
                goodsColData = data;
                if (window.sessionStorage.getItem("addGoodsCol")) {
                    var addGoodsCol = window.sessionStorage.getItem("addGoodsCol");
                    goodsColData = JSON.parse(addGoodsCol).concat(goodsColData);
                }
                //执行加载数据的方法
                GoodsColList();
            }
        });
    }

    //修改公告激活状态
    function ModifyNoticeStatus(id, status) {
        $.ajax({
            url: "/Admin/ModifyNoticeStatus",
            data: { NoticeId: parseInt(id), status: parseInt(status) },
            async: false,
            type: "post",
            dataType: "json",
            success: function (data) {
                if (data == true) {
                    if (status == 1) {
                        layer.msg("激活成功！");
                    } else {
                        layer.msg("取消激活成功！");
                    }
                    GetAllColGoods();
                } else if (data == false) {
                    if (status == 1) {
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

    //删除
    function DeleteColGoods(goodsId) {
        $.ajax({
            url: "/Admin/DeleteColGoods",
            data: { GoodsColId: goodsId },
            type: "post",
            dataType: "json",
            async: false,
            success: function (data) {
                if (data == null || data == "") {
                    layer.msg("删除异常！");
                } else if (data == true) {
                    layer.msg("删除成功！");
                } else if (data == false) {
                    layer.msg("删除失败！");
                }
                return true;
            }
        });
    }

    //显示编辑信息的Model
    function ReadColGoodsInfoById(goodsColId) {
        $.ajax({
            url: "/Admin/ReadColGoodsInfoById",
            data: { GoodsColId: goodsColId },
            type: "post",
            dataType: "json",
            async: false,
            success: function (data) {
                var content =
               '<form class="layui-form" id="userModiForm" style="width:360px;">' +
                     '<div class="layui-form-item" style="margin-top:20px;">' +
                           '<label class="layui-form-label">收藏数</label>' +
                           '<div class="layui-input-inline">' +
                               '<input type="text" placeholder="请输入数量" class="layui-input" value="'+data.CollectNum+'"/>' +
                           '</div>' +
                      '</div>' +
                 '</form>';
                layer.open({
                    type: 1,
                    title: "商品收藏编辑页面",
                    btn: ['提交'],
                    skin: 'layui-layer-demo', //样式类名
                    closeBtn: 1, //显示关闭按钮
                    anim: 4,//从左翻滚
                    shadeClose: true, //开启遮罩关闭
                    content: content,
                    yes: function (index, layero) {
                        //do something
                        ModifyColGoodsInfo(index, layero);
                    }
                });
                form.render();
            }
        });

    }

    //显示添加信息的Model
    function ShowAddGoodsColModel() {
        var content =
              '<form class="layui-form" id="userModiForm" style="width:360px;">' +
                      '<div class="layui-form-item" style="margin-top:20px;">' +
                           '<label class="layui-form-label">UserId</label>' +
                           '<div class="layui-input-inline">' +
                               '<input type="text" placeholder="请输入UserId" class="layui-input"/>' +
                           '</div>' +
                      '</div>' +
                       '<div class="layui-form-item" style="margin-top:20px;">' +
                           '<label class="layui-form-label">GoodsId</label>' +
                           '<div class="layui-input-inline">' +
                               '<input type="text" placeholder="请输入GoodsId" class="layui-input"/>' +
                           '</div>' +
                      '</div>' +
                '</form>';
        layer.open({
            type: 1,
            title: "商品收藏添加页面",
            btn: ['提交'],
            skin: 'layui-layer-demo', //样式类名
            closeBtn: 1, //显示关闭按钮
            anim: 4,//从左翻滚
            shadeClose: true, //开启遮罩关闭
            content: content,
            yes: function (index, layero) {
                //do something
                AddGoodsCol(index, layero);
            }
        });
        form.render();

    }

    //修改信息
    function ModifyColGoodsInfo(index, layero) {
        $.ajax({
            url: "/Admin/ModifyColGoodsInfo",
            dataType: "json",
            type: "post",
            asyns: false,
            data: {
                UserId: layero.children().eq(1).children().children().eq(0).children().eq(1).children().val(),
                ShopId: layero.children().eq(1).children().children().eq(1).children().eq(1).children().val(),
                GoodsId: layero.children().eq(1).children().children().eq(2).children().eq(1).children().val(),
                CollectNum: layero.children().eq(1).children().children().eq(3).children().eq(1).children().val()
            },
            success: function (data) {
                if (data == null) {
                    layer.msg("出现异常！");
                    return false;
                }
                else if (data == true) {
                    layer.msg("修改成功！");
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                    GetAllColGoods();

                } else if (data == false) {
                    layer.msg("修改失败！");

                }
            }
        });
    }

    //添加信息
    function AddGoodsCol(index, layero) {
        $.ajax({
            url: "/Admin/AddGoodsCol",
            dataType: "json",
            type: "post",
            asyns: false,
            data: {
                UserId:parseInt(layero.children().eq(1).children().children().eq(0).children().eq(1).children().val()),
                GoodsId: parseInt(layero.children().eq(1).children().children().eq(1).children().eq(1).children().val())
            },
            success: function (data) {
                if (data == null) {
                    layer.msg("出现异常！");
                    return false;
                }
                else if (data == "true") {
                    layer.msg("添加成功！");
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                    GetAllColGoods();
                } else if (data == "userIdIsNull") {
                    layer.msg("UserId为空，请重新输入！");
                } else if (data == "goodsIdIsNull") {
                    layer.msg("GoodsId为空，请重新输入！");
                } else if (data == "false") {
                    layer.msg("添加失败！");

                }
            }
        });
    }

});

