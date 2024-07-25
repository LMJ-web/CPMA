layui.config({
    base: "js/"
}).use(['form', 'layer', 'jquery', 'laypage'], function () {
    var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		$ = layui.jquery;

    //加载页面数据
    var shopColData = '';
    GetAllColShop();

    //查询
    $(".search_btn").click(function () {
        var shopColArray = [];
        if ($(".search_input").val() != '') {
            var index = layer.msg('查询中，请稍候', { icon: 16, time: false, shade: 0.8 });
            setTimeout(function () {
                $.ajax({
                    url: "/Admin/GetAllColShop",
                    type: "post",
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        if (window.sessionStorage.getItem("addShopCol")) {
                            var addShopCol = window.sessionStorage.getItem("addShopCol");
                            shopColData = JSON.parse(addShopCol).concat(data);
                        } else {
                            shopColData = data;
                        }
                        var menu_node = [];
                        var selectStr = $(".search_input").val().trim();
                        menu_node = data.filter(function (e) { return (e.ShopColId.toString().match(selectStr) != null) || (e.UserId.toString().match(selectStr) != null) || (e.ShopId.toString().match(selectStr) != null); });
                        for (var i = 0; i < menu_node.length; i++) {
                            shopColArray.push(menu_node[i]);
                        }
                        shopColData = shopColArray;
                        ShopColList(shopColData);
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
        var $checkbox = $('.shopCol_list tbody input[type="checkbox"][name="checked"]');
        var $checked = $('.shopCol_list tbody input[type="checkbox"][name="checked"]:checked');
        var _this = $(this);
        if ($checkbox.is(":checked")) {
            layer.confirm('确定删除选中的信息？', { icon: 3, title: '提示信息' }, function (index) {
                var index = layer.msg('删除中，请稍候', { icon: 16, time: false, shade: 0.8 });
                setTimeout(function () {
                    //删除数据
                    for (var j = 0; j < $checkbox.length; j++) {
                        if ($checkbox[j].checked == true) {
                            DeleteShopCol(shopColData[j].ShopColId);
                        }
                    }
                    $('.shopCol_list thead input[type="checkbox"]').prop("checked", false);
                    layer.close(index);
                    GetAllColShop();
                    form.render();
                }, 100);
            })
        } else {
            layer.msg("请选择需要删除的收藏记录！");
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
    $("body").on("click", ".shopCol_del", function () {

        var _this = $(this);
        layer.confirm('确定删除此条信息？', { icon: 3, title: '提示信息' }, function (index) {
            //_this.parents("tr").remove();
            for (var i = 0; i < shopColData.length; i++) {
                if (shopColData[i].ShopColId == _this.attr("data-id")) {
                    DeleteShopCol(shopColData[i].ShopColId);
                    //在数组中第i位置，删除一个元素
                    shopColData.splice(i, 1);
                    ShopColList(shopColData);
                }
            }
            layer.close(index);
        });
    })

    //添加
    $("body").on("click", ".shopColAdd_btn", function () {
        ShowAddShopColModel();
    });

    /*--------------------操作---------------------*/
    function ShopColList() {
        //渲染数据
        function renderDate(data, curr) {
            var dataHtml = '';
            currData = shopColData.concat().splice(curr * nums - nums, nums);
            if (currData.length != 0) {
                for (var i = 0; i < currData.length; i++) {
                    dataHtml += '<tr>'
                             + '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
                             + '<td name="ShopColId">' + currData[i].ShopColId + '</td>'
                             + '<td>' + currData[i].UserId + '</td>'
                             + '<td>' + currData[i].ShopId + '</td>'
                             + '<td>' + currData[i].ShopName + '</td>'
                             + '<td>' + currData[i].CollectNum + '</td>'
                             + '<td>' + currData[i].CreateDate + '</td>';
                    dataHtml += '<td>'
                                   //+ '<a class="layui-btn layui-btn-mini shopCol_edit" data-id="' + currData[i].ShopColId + '"><i class="iconfont icon-edit"></i> 编辑</a>'
                                   + '<a class="layui-btn layui-btn-danger layui-btn-mini shopCol_del" data-id="' + currData[i].ShopColId + '"><i class="layui-icon">&#xe640;</i> 删除</a>'
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
            pages: Math.ceil(shopColData.length / nums),
            jump: function (obj) {
                $(".shopCol_content").html(renderDate(shopColData, obj.curr));
                $('.shopCol_list thead input[type="checkbox"]').prop("checked", false);
                form.render();
            }
        })
    }

    //获取所有的收藏的店铺
    function GetAllColShop() {
        $.ajax({
            url: "/Admin/GetAllColShop",
            async: false,
            type: "post",
            datatype: "json",
            data: {},
            success: function (data) {
                shopColData = data;
                if (window.sessionStorage.getItem("addShopCol")) {
                    var addShopCol = window.sessionStorage.getItem("addShopCol");
                    shopColData = JSON.parse(addShopCol).concat(shopColData);
                }
                //执行加载数据的方法
                ShopColList();
            }
        });
    }

    //删除收藏的商店
    function DeleteShopCol(shopColId) {
        $.ajax({
            url: "/Admin/DeleteShopCol",
            data: { ShopColId: shopColId },
            type: "post",
            dataType: "json",
            async: false,
            success: function (data) {
                if (data =="EC") {
                    layer.msg("删除异常！");
                } else if(data==true){
                    layer.msg("删除成功！");
                }else if(data==false){
                    layer.msg("删除失败！");
                }
                return true;
            }
        });
    }

    //显示添加商店收藏信息的Model
    function ShowAddShopColModel() {
        var content =
              '<form class="layui-form" id="userModiForm" style="width:360px;">' +
                    '<div class="layui-form-item" style="margin-top:20px;">' +
                           '<label class="layui-form-label">ShopId</label>' +
                           '<div class="layui-input-inline">' +
                               '<input type="text" placeholder="请输入ShopId" class="layui-input number-vaildate"/>' +
                           '</div>' +
                      '</div>' +
                      '<div class="layui-form-item">' +
                         '<label class="layui-form-label">UserId</label>' +
                            '<div class="layui-input-inline">' +
                                 '<input type="text" placeholder="请输入UserId" class="layui-input number-vaildate"/>' +
                            '</div>' +
                      '</div>' +
                '</form>';
        layer.open({
            type: 1,
            title:"商店收藏添加",
            btn: ['提交'],
            skin: 'layui-layer-demo', //样式类名
            closeBtn: 1, //显示关闭按钮
            anim: 4,//从左翻滚
            shadeClose: true, //开启遮罩关闭
            content: content,
            yes: function (index, layero) {
                //do something
                AddShopCol(index, layero);
            }
        });
        form.render();

    }

    //添加商店收藏信息
    function AddShopCol(index, layero) {
        if (NumberValidate($(".number-vaildate").eq(0))) {
            if (NumberValidate($(".number-vaildate").eq(1))) {
                $.ajax({
                    url: "/Admin/AddShopCol",
                    dataType: "json",
                    type: "post",
                    asyns: false,
                    data: {
                        ShopId: parseInt(layero.children().eq(1).children().children().eq(0).children().eq(1).children().val()),
                        UserId: parseInt(layero.children().eq(1).children().children().eq(1).children().eq(1).children().val())
                    },
                    success: function (data) {
                        if (data == null) {
                            layer.msg("出现异常！");
                            return false;
                        }
                        else if (data == "true") {
                            layer.msg("添加成功！");
                            layer.close(index); //如果设定了yes回调，需进行手工关闭
                            GetAllColShop();
                        } else if (data == "userIdIsNull") {
                            layer.msg("UserId为空，请重新输入！");
                        } else if (data == "shopIdIsNull") {
                            layer.msg("ShopId为空，请重新输入！");
                        } else if (data == "false") {
                            layer.msg("添加失败！");

                        }
                    }
                });
            }
        }
    }

    //数字校验
    function NumberValidate(self) {
        var reg = /^[0-9]+$/;
        if (!reg.test(self.val())) {
            self.val(null);
            layer.msg("请输入数字类型！");
            return false;
        }
        return true;
    }

});

