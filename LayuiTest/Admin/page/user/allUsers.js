//var index = layer.load(1, {
//    shade: [0.5, 'gray'] //0.1透明度的白色背景
//});
layui.config({
    base: "js/"
}).use(['form', 'layer', 'jquery', 'laypage'], function () {
    var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		$ = layui.jquery;

    //加载页面数据
    var usersData = '';
    GetAllUser();


    /*--------------------事件绑定---------------------*/
    //查询
    $(".search_btn").click(function () {
        var userArray = [];
        if ($(".search_input").val() != '') {
            var index = layer.msg('查询中，请稍候', { icon: 16, time: false, shade: 0.8 });
            setTimeout(function () {
                $.ajax({
                    url: "/Admin/GetAllUser",
                    type: "post",
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        if (window.sessionStorage.getItem("addUser")) {
                            var addUser = window.sessionStorage.getItem("addUser");
                            usersData = JSON.parse(addUser).concat(data);
                        } else {
                            usersData = data;
                        }
                        var menu_node = [];
                        var selectStr = $(".search_input").val().trim();
                        menu_node = data.filter(function (e) { return (e.UserName.match(selectStr) != null) || (e.Nick.match(selectStr) != null) || (e.IDCard.match(selectStr) != null) || (e.Money.toString().match(selectStr) != null) || (e.Nick.match(selectStr) != null); });
                        for (var i = 0; i < menu_node.length; i++) {
                            userArray.push(menu_node[i]);
                        }
                        usersData = userArray;
                        usersList(usersData);
                    }
                })

                layer.close(index);
            }, 100);
        } else {
            layer.msg("请输入需要查询的内容");
        }
    })

    //添加会员
    $(".usersAdd_btn").click(function () {
        var index = layui.layer.open({
            title: "添加会员",
            type: 2,
            content: "addUser.html",
            success: function (layero, index) {
                setTimeout(function () {
                    layui.layer.tips('点击此处返回会员列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            }
        })
        //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
        $(window).resize(function () {
            layui.layer.full(index);
        })
        layui.layer.full(index);
    })

    //批量删除
    $(".batchDel").click(function () {
        var $checkbox = $('.users_list tbody input[type="checkbox"][name="checked"]');
        var $checked = $('.users_list tbody input[type="checkbox"][name="checked"]:checked');
        var _this = $(this);
        if ($checkbox.is(":checked")) {
            layer.confirm('确定删除选中的信息？', { icon: 3, title: '提示信息' }, function (index) {
                var index = layer.msg('删除中，请稍候', { icon: 16, time: false, shade: 0.8 });
                setTimeout(function () {
                    //删除数据
                    for (var j = 0; j < $checkbox.length; j++) {
                        if ($checkbox[j].checked == true) {
                            DeleteUser(usersData[j].UserName);
                        }
                    }
                    $('.users_list thead input[type="checkbox"]').prop("checked", false);
                    layer.close(index);
                    GetAllUser();
                    form.render();
                }, 100);
            })
        } else {
            layer.msg("请选择需要删除的用户！");
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

    //删除用户点击事件绑定
    $("body").on("click", ".users_del", function () {

        var _this = $(this);
        layer.confirm('确定删除此用户？', { icon: 3, title: '提示信息' }, function (index) {
            //_this.parents("tr").remove();
            for (var i = 0; i < usersData.length; i++) {
                if (usersData[i].UserName == _this.attr("data-id")) {
                    DeleteUser(usersData[i].UserName);
                    //在数组中第i位置，删除一个元素
                    usersData.splice(i, 1);
                    usersList(usersData);
                }
            }
            layer.close(index);
        });
    })

    //编辑用户点击事件绑定
    $("body").on("click", ".users_edit", function () {
        ShowUserInfoModifyModel($(this).attr("data-id"));
    });

    //添加用户点击事件绑定
    $("body").on("click", ".userAdd_btn", function () {
        ShowUserAddModel();
    });
    /*--------------------操作---------------------*/

    function usersList() {
        //渲染数据
        function renderDate(data, curr) {
            var dataHtml = '';
            currData = usersData.concat().splice(curr * nums - nums, nums);
            if (currData.length != 0) {
                for (var i = 0; i < currData.length; i++) {
                    dataHtml += '<tr>'
                    + '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
                    + '<td name="UserName">' + currData[i].UserName + '</td>'
                    + '<td>' + currData[i].Nick + '</td>'
                    + '<td>' + currData[i].IDCard + '</td>'
                    + '<td>' + currData[i].Money + '</td>'
                    + '<td>' + currData[i].LoginTime + '</td>';
                    if (currData[i].State == "true") {
                        dataHtml += '<td ><input type="checkbox" name="show" lay-skin="switch" lay-text="是|否" lay-filter="isState" checked ></td>'
                    } else {
                        dataHtml += '<td ><input type="checkbox" name="show" lay-skin="switch" lay-text="是|否" lay-filter="isState"></td>'
                    }
                    dataHtml += '<td>'
                    + '<a class="layui-btn layui-btn-mini users_edit" data-id="' + currData[i].UserName + '"><i class="iconfont icon-edit"></i> 编辑</a>'
                    + '<a class="layui-btn layui-btn-danger layui-btn-mini users_del" data-id="' + currData[i].UserName + '"><i class="layui-icon">&#xe640;</i> 删除</a>'
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
            pages: Math.ceil(usersData.length / nums),
            jump: function (obj) {
                $(".users_content").html(renderDate(usersData, obj.curr));
                $('.users_list thead input[type="checkbox"]').prop("checked", false);
                //onclick事件
                form.on('switch(isState)', function (data) {
                    FreezeUser(data.elem.parentElement.parentElement.children.UserName.innerHTML, data.elem.checked);
                    //console.log(data.elem); //得到checkbox原始DOM对象
                    //console.log(data.elem.checked); //开关是否开启，true或者false
                    //console.log(data.value); //开关value值，也可以通过data.elem.value得到
                    //console.log(data.othis); //得到美化后的DOM对象
                });
                form.render();
            }
        })
    }

    //获取所有的用户
    function GetAllUser() {
        $.ajax({
            url: "/Admin/GetAllUser",
            async: false,
            type: "post",
            datatype: "json",
            data: {},
            success: function (data) {
                usersData = data;
                if (window.sessionStorage.getItem("addUser")) {
                    var addUser = window.sessionStorage.getItem("addUser");
                    usersData = JSON.parse(addUser).concat(usersData);
                }
                //执行加载数据的方法
                usersList();
            }
        });

    }

    //显示添加用户信息的Model
    function ShowUserAddModel() {
        var content =
          '<div class="layui-form layui-form-pane" style="width:320px;margin:23px;">' +
             '<div class="layui-form-item" style="margin-top:5px">' +
                  '<label class="layui-form-label">昵称</label>' +
                   '<div class="layui-input-inline">' +
                         '<input type="text" placeholder="请输入昵称"  class="layui-input Nick" >' +
                   '</div>' +
             '</div>' +
             '<div class="layui-form-item">' +
                    '<label class="layui-form-label">账号</label>' +
                    '<div class="layui-input-inline">' +
                        '<input type="text" placeholder="账号" lay-verify="required" class="layui-input UserName" >' +
                    '</div>' +
               '</div>' +
               '<div class="layui-form-item">' +
                  '<label class="layui-form-label">密码</label>' +
                     '<div class="layui-input-inline">' +
                          '<input type="text" placeholder="密码" lay-verify="" class="layui-input Password" >' +
                     '</div>' +
               '</div>' +
         '</div>';
        layer.open({
            type: 1,
            title: "添加用户页面",
            btn: ['提交'],
            skin: 'layui-layer-demo', //样式类名
            closeBtn: 1, //显示关闭按钮
            anim: 4,//从左翻滚
            shadeClose: true, //开启遮罩关闭
            content: content,
            yes: function (index, layero) {
                //do something
                AddUser();
            }
        });
        form.render();
    }

    //显示编辑用户信息的Model
    function ShowUserInfoModifyModel(username) {
        $.ajax({
            url: "/User/ReadUserInfos",
            data: { UserName: username },
            type: "post",
            dataType: "json",
            async: false,
            success: function (data) {
                var content =
                  '<form class="layui-form layui-form-pane" style="width:320px;margin:23px;">' +
                     '<div class="layui-form-item" style="margin-top:5px">' +
                          '<label class="layui-form-label">昵称</label>' +
                           '<div class="layui-input-inline">' +
                                 '<input type="text" placeholder="请输入昵称"  class="layui-input Nick" value="' + data.Nick + '">' +
                           '</div>' +
                     '</div>' +
                     '<div class="layui-form-item">' +
                            '<label class="layui-form-label">真实姓名</label>' +
                            '<div class="layui-input-inline">' +
                                '<input type="text" placeholder="请输入真实姓名" lay-verify="required" class="layui-input Name"  value="' + data.Name + '">' +
                            '</div>' +
                       '</div>' +
                       '<div class="layui-form-item">' +
                          '<label class="layui-form-label">身份证号码</label>' +
                             '<div class="layui-input-inline">' +
                                  '<input type="text" placeholder="请输入身份证号码" lay-verify="" class="layui-input IDCard"  value="' + data.IDCard + '">' +
                             '</div>' +
                       '</div>' +
                      '<div class="layui-form-item">' +
                          '<label class="layui-form-label">手机号码</label>' +
                             '<div class="layui-input-inline">' +
                                 '<input type="tel" " placeholder="请输入手机号码" lay-verify="required|phone" class="layui-input MobilePhone"  value="' + data.MobilePhone + '">' +
                             '</div>' +
                          '</div>' +
                    '<div class="layui-form-item">' +
                            '<label class="layui-form-label">出生年月</label>' +
                         '<div class="layui-input-inline">' +
                                   '<input type="text" placeholder="请输入出生年月" lay-verify="required|date" onclick="layui.laydate({elem: this,max: laydate.now()})" class="layui-input BirthDay" value="' + data.BirthDay + '">' +
                         '</div>' +
                      '</div>' +
                     '<div class="layui-form-item userAddress">' +
                              '<label class="layui-form-label">家庭住址</label>' +
                          '<div class="layui-input-inline">' +
                                 '<input type="text" id="city"  placeholder="请输入地址" class="layui-input"  value="' + data.Address + '">' +
                             '</div>' +
                      '</div>' +
                      '<div class="layui-form-item">' +
                             '<label class="layui-form-label">钱包金额</label>' +
                              '<div class="layui-input-inline">' +
                                  '<input type="text" placeholder="请输入金额"  class="layui-input Money" value="' + data.Money + '">' +
                             '</div>' +
                       '</div>' +
                        '<div class="layui-form-item">' +
                               '<label class="layui-form-label">性别</label>' +
                             '<div class="layui-input-inline">' +
                                     '<input type="text"  placeholder="请输入性别" class="layui-input Sex" value="' + data.Sex + '" title="性别" >' +
                              '</div>' +
                         '</div>' +
                       '<div class="layui-form-item">' +
                              '<label class="layui-form-label">邮箱</label>' +
                             '<div class="layui-input-inline">' +
                                   '<input type="text" placeholder="请输入邮箱" lay-verify="Email" class="layui-input Email" value="' + data.Email + '">' +
                             '</div>' +
                        '</div>' +
                         '<div class="layui-form-item">' +
                                '<label class="layui-form-label">商家状态</label>' +
                              '<div class="layui-input-inline">' +
                                   '<input type="text" placeholder="请输入商家状态标志" class="layui-input BusinessState" value="' + data.BusinessState + '">' +
                             '</div>' +
                           '</div>' +
                         '<div class="layui-form-item" style="display:none">' +
                                '<label class="layui-form-label">UserName</label>' +
                                 '<div class="layui-input-inline">' +
                                    '<input type="text" class="layui-input UserName" value="' + data.UserName + '">' +
                                    '</div>' +
                             '</div>' +
                 '</form>';
                layer.open({
                    type: 1,
                    title: "用户信息编辑页面",
                    btn: ['提交'],
                    skin: 'layui-layer-demo', //样式类名
                    closeBtn: 1, //显示关闭按钮
                    anim: 4,//从左翻滚
                    shadeClose: true, //开启遮罩关闭
                    content: content,
                    yes: function (index, layero) {
                        //do something
                        SureModify(index, layero);
                    }
                });
                form.render();
            }
        });

    }

    //添加用户
    function DeleteUser(UserName) {
        $.ajax({
            url: "/Admin/DeleteUser",
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
            }
        });
    }

    //删除用户
    function AddUser() {
        var regxChinese = /^[\u4E00-\u9FA5]$/;
        var username = $(".UserName").val();
        if (username != "" && username != null) {
            layer.msg("账号不能为空！");
        } else if (regxChinese.test(username)) {
            layer.msg("账号不能包含中文！");
        } else {
            $.ajax({
                url: "/User/UserNameVal",
                data: { UserName: username, Status: 0 },
                type: "post",
                dataType: "json",
                async: false,
                success: function (data) {
                    if (data == null) {
                        layer.msg("该账号已注册！");
                    } else {
                        $.ajax({
                            url: "/User/",
                            data: { UserName: username, Status: 0 },
                            type: "post",
                            dataType: "json",
                            async: false,
                            success: function (data) {
                                if (data == null) {
                                    layer.msg("！");
                                } else {

                                }
                            }
                        });
                    }
                }
            });
        }
    }

    //冻结用户
    function FreezeUser(UserName, State) {
        $.ajax({
            url: "/Admin/FreezeUser",
            data: { UserName: UserName, State: State },
            type: "post",
            dataType: "json",
            async: false,
            success: function (data) {
                if (data == null) {
                    layer.msg("冻结失败！");
                } else {
                    if (State) {
                        layer.msg("冻结成功！");
                    } else {
                        layer.msg("解除冻结！");
                    }
                }
            }
        });
    }

    //提交
    function SureModify(index, layero) {
        ModifyUserInfos(index, layero);
    }

    //修改用户信息
    function ModifyUserInfos(index, layero) {
        $.ajax({
            url: "/Admin/ModifyUserInfos",
            dataType: "json",
            type: "post",
            asyns: false,
            data: {
                UserName: layero.children().eq(1).children().children().eq(10).children().eq(1).children().val(),
                Nick: layero.children().eq(1).children().children().eq(0).children().eq(1).children().val(),
                RealName: layero.children().eq(1).children().children().eq(1).children().eq(1).children().val(),
                IDCard: layero.children().eq(1).children().children().eq(2).children().eq(1).children().val(),
                MobilePhone: layero.children().eq(1).children().children().eq(3).children().eq(1).children().val(),
                BirthDay: layero.children().eq(1).children().children().eq(4).children().eq(1).children().val(),
                Address: layero.children().eq(1).children().children().eq(5).children().eq(1).children().val(),
                Money: layero.children().eq(1).children().children().eq(6).children().eq(1).children().val(),
                Sex: layero.children().eq(1).children().children().eq(7).children().eq(1).children().val(),
                Email: layero.children().eq(1).children().children().eq(8).children().eq(1).children().val(),
                BusinessState: layero.children().eq(1).children().children().eq(9).children().eq(1).children().val()
            },
            success: function (data) {
                if (data == null) {
                    layer.msg("出现异常！");
                    return false;
                }
                else if (data == "true") {
                    layer.msg("修改成功！");
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                    GetAllUser();

                } else {
                    layer.msg("修改失败！");

                }
            }

        });


    }

    function changeStr(data) {
        //json数据的筛选 -- level=1的对象
        var menu_node1 = menu_data.filter(function (e) { return e.level == 1; });
    }

});


