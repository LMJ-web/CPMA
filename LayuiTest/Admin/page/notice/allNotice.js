layui.config({
    base: "js/"
}).use(['form', 'layer', 'jquery', 'laypage'], function () {
    var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		$ = layui.jquery;

    //加载页面数据
    var noticeData = '';
    GetAllNotice();

    //查询
    $(".search_btn").click(function () {
        var noticeArray = [];
        if ($(".search_input").val() != '') {
            var index = layer.msg('查询中，请稍候', { icon: 16, time: false, shade: 0.8 });
            setTimeout(function () {
                $.ajax({
                    url: "/Admin/GetAllNotice",
                    type: "post",
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        if (window.sessionStorage.getItem("addNoticeAll")) {
                            var addNoticeAll = window.sessionStorage.getItem("addNoticeAll");
                            noticeData = JSON.parse(addNoticeAll).concat(data);
                        } else {
                            noticeData = data;
                        }
                        var menu_node = [];
                        var selectStr = $(".search_input").val().trim();
                        menu_node = data.filter(function (e) { return (e.NoticeId.toString().match(selectStr) != null) || (e.NoticeTitle.match(selectStr) != null); });
                        for (var i = 0; i < menu_node.length; i++) {
                            noticeArray.push(menu_node[i]);
                        }
                        noticeData = noticeArray;
                        NoticeList(noticeData);
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
        var $checkbox = $('.notice_list tbody input[type="checkbox"][name="checked"]');
        var $checked = $('.notice_list tbody input[type="checkbox"][name="checked"]:checked');
        var _this = $(this);
        if ($checkbox.is(":checked")) {
            layer.confirm('确定删除选中的信息？', { icon: 3, title: '提示信息' }, function (index) {
                var index = layer.msg('删除中，请稍候', { icon: 16, time: false, shade: 0.8 });
                setTimeout(function () {
                    //删除数据
                    for (var j = 0; j < $checkbox.length; j++) {
                        if ($checkbox[j].checked == true) {
                            DeleteNotice(noticeData[j].NoticeId);
                        }
                    }
                    $('.notice_list thead input[type="checkbox"]').prop("checked", false);
                    layer.close(index);
                    GetAllNotice();
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
    $("body").on("click", ".notice_del", function () {

        var _this = $(this);
        layer.confirm('确定删除此条公告？', { icon: 3, title: '提示信息' }, function (index) {
            //_this.parents("tr").remove();
            for (var i = 0; i < noticeData.length; i++) {
                if (noticeData[i].NoticeId == _this.attr("data-id")) {
                    DeleteNotice(noticeData[i].NoticeId);
                    //在数组中第i位置，删除一个元素
                    noticeData.splice(i, 1);
                    NoticeList(noticeData);
                }
            }
            layer.close(index);
        });
    })

    //编辑用户点击事件绑定
    $("body").on("click", ".notice_edit", function () {
        ReadNoticeInfoById($(this).attr("data-id"));
    });

    $("body").on("click", ".noticeAdd_btn", function () {
        ShowAddNoticeModel();
    });
    /*--------------------操作---------------------*/
    function NoticeList() {
        //渲染数据
        function renderDate(data, curr) {
            var dataHtml = '';
            currData = noticeData.concat().splice(curr * nums - nums, nums);
            if (currData.length != 0) {
                for (var i = 0; i < currData.length; i++) {
                    dataHtml += '<tr>'
                    + '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
                    + '<td name="NoticeId">' + currData[i].NoticeId + '</td>'
                    + '<td>' + currData[i].NoticeTitle + '</td>'
                    + '<td>' + currData[i].NoticeIntro + '</td>';
                    if (currData[i].Status == 0) {
                        dataHtml += '<td><input type="checkbox" name="isState" lay-skin="switch" lay-text="是|否" lay-filter="isState" ></td>'
                    } else {
                        dataHtml += '<td><input type="checkbox" name="isState" lay-skin="switch" lay-text="是|否" lay-filter="isState" checked></td>'
                    }
                    dataHtml += '<td>' + currData[i].CreateDate + '</td>';
                    dataHtml += '<td>'
                                   + '<a class="layui-btn layui-btn-mini notice_edit" data-id="' + currData[i].NoticeId + '"><i class="iconfont icon-edit"></i> 编辑</a>'
                                   + '<a class="layui-btn layui-btn-danger layui-btn-mini notice_del" data-id="' + currData[i].NoticeId + '"><i class="layui-icon">&#xe640;</i> 删除</a>'
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
            pages: Math.ceil(noticeData.length / nums),
            jump: function (obj) {
                $(".notice_content").html(renderDate(noticeData, obj.curr));
                $('.notice_list thead input[type="checkbox"]').prop("checked", false);
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

    //获取所有的公告
    function GetAllNotice() {
        $.ajax({
            url: "/Admin/GetAllNotice",
            async: false,
            type: "post",
            datatype: "json",
            data: {},
            success: function (data) {
                noticeData = data;
                if (window.sessionStorage.getItem("addNoticeAll")) {
                    var addNoticeAll = window.sessionStorage.getItem("addNoticeAll");
                    noticeData = JSON.parse(addNoticeAll).concat(noticeData);
                }
                //执行加载数据的方法
                NoticeList();
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
                    GetAllNotice();
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

    //删除公告
    function DeleteNotice(noticeId) {
        $.ajax({
            url: "/Admin/DeleteNotice",
            data: { NoticeId: noticeId },
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

    //显示编辑公告信息的Model
    function ReadNoticeInfoById(noticeId) {
        $.ajax({
            url: "/Admin/ReadNoticeInfoById",
            data: { NoticeId: noticeId },
            type: "post",
            dataType: "json",
            async: false,
            success: function (data) {
                var content =
               '<form class="layui-form layui-form-pane" id="ReadNoticeForm" style="width:340px;padding:10px;">' +
                     '<div class="layui-form-item" hidden>' +
                          '<label class="layui-form-label">NoticeId</label>' +
                           '<div class="layui-input-inline">' +
                                 '<input type="text" placeholder="NoticeId" value="' + data.NoticeId + '">' +
                           '</div>' +
                     '</div>' +
                     '<div class="layui-form-item layui-form-text" style="width:340px">' +
                            '<label class="layui-form-label">标题</label>' +
                            '<div class="layui-input-block">' +
                                '<input type="text" placeholder="标题" lay-verify="required" class="layui-input"  value="' + data.NoticeTitle + '">' +
                            '</div>' +
                       '</div>' +
                       '<div class="layui-form-item layui-form-text" style="width:340px">' +
                          '<label class="layui-form-label">简介</label>' +
                             '<div class="layui-input-block">' +
                                  '<textarea type="text" placeholder="简介" class="layui-textarea"  value="' + data.NoticeIntro + '">' + data.NoticeIntro + '</textarea>' +
                             '</div>' +
                       '</div>' +
                      '<div class="layui-form-item layui-form-text" style="width:340px">' +
                          '<label class="layui-form-label">内容</label>' +
                             '<div class="layui-input-block">' +
                                 '<textarea type="text" placeholder="内容"  class="layui-textarea"  value="' + data.NoticeContent + '">' + data.NoticeContent + '</textarea>' +
                             '</div>' +
                          '</div>' +
                 '</form>';
                layer.open({
                    type: 1,
                    title:"公告编辑",
                    btn: ['提交'],
                    skin: 'layui-layer-demo', //样式类名
                    closeBtn: 1, //显示关闭按钮
                    anim: 4,//从左翻滚
                    shadeClose: true, //开启遮罩关闭
                    content: content,
                    yes: function (index, layero) {
                        //do something
                        ModifyNoticeInfo(index, layero);
                    }
                });
                form.render();
            }
        });

    }

    //显示添加公告信息的Model
    function ShowAddNoticeModel() {
        var content =
              '<form class="layui-form layui-form-pane" id="AddNoticeForm" style="width:340px;padding:10px;">' +
                    '<div class="layui-form-item" style="margin-top:15px;width:340px">' +
                           '<label class="layui-form-label">标题</label>' +
                           '<div class="layui-input-block">' +
                               '<input type="text" placeholder="请输入标题" lay-verify="required" class="layui-input"/>' +
                           '</div>' +
                      '</div>' +
                      '<div class="layui-form-item"  style="width:340px">' +
                           '<label class="layui-form-label">激活状态</label>' +
                           '<div class="layui-input-block">' +
                               '<input type="text" placeholder="0或1" lay-verify="required" class="layui-input"/>' +
                           '</div>' +
                      '</div>' +
                      '<div class="layui-form-item layui-form-text"  style="width:340px">' +
                         '<label class="layui-form-label">简介</label>' +
                            '<div class="layui-input-block">' +
                                 '<textarea type="text" placeholder="请输入简介" class="layui-textarea" ></textarea>' +
                            '</div>' +
                      '</div>' +
                     '<div class="layui-form-item layui-form-text"  style="width:340px">' +
                         '<label class="layui-form-label">内容</label>' +
                            '<div class="layui-input-block">' +
                                '<textarea type="text" placeholder="请输入内容"  class="layui-textarea" ></textarea>' +
                            '</div>' +
                         '</div>' +
                '</form>';
        layer.open({
            type: 1,
            title: "公告添加",
            btn: ['提交'],
            skin: 'layui-layer-demo', //样式类名
            closeBtn: 1, //显示关闭按钮
            anim: 4,//从左翻滚
            shadeClose: true, //开启遮罩关闭
            content: content,
            yes: function (index, layero) {
                //do something
                AddNoticeInfo(index, layero);
            }
        });
        form.render();

    }

    //修改公告信息
    function ModifyNoticeInfo(index, layero) {
        $.ajax({
            url: "/Admin/ModifyNoticeInfo",
            dataType: "json",
            type: "post",
            asyns: false,
            data: {
                NoticeId: layero.children().eq(1).children().children().eq(0).children().eq(1).children().val(),
                NoticeTitle: layero.children().eq(1).children().children().eq(1).children().eq(1).children().val(),
                NoticeIntro: layero.children().eq(1).children().children().eq(2).children().eq(1).children().val(),
                NoticeContent: layero.children().eq(1).children().children().eq(3).children().eq(1).children().val()
            },
            success: function (data) {
                if (data == null) {
                    layer.msg("出现异常！");
                    return false;
                }
                else if (data == true) {
                    layer.msg("修改成功！");
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                    GetAllNotice();

                } else if (data == false) {
                    layer.msg("修改失败！");

                }
            }
        });
    }

    //添加公告信息
    function AddNoticeInfo(index, layero) {
        $.ajax({
            url: "/Admin/AddNoticeInfo",
            dataType: "json",
            type: "post",
            asyns: false,
            data: {
                NoticeTitle: layero.children().eq(1).children().children().eq(0).children().eq(1).children().val(),
                NoticeIntro: layero.children().eq(1).children().children().eq(2).children().eq(1).children().val(),
                NoticeContent: layero.children().eq(1).children().children().eq(3).children().eq(1).children().val(),
                Status: layero.children().eq(1).children().children().eq(1).children().eq(1).children().val(),
            },
            success: function (data) {
                if (data == null) {
                    layer.msg("出现异常！");
                    return false;
                }
                else if (data == true) {
                    layer.msg("添加成功！");
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                    GetAllNotice();

                } else if (data == false) {
                    layer.msg("添加失败！");

                }
            }
        });
    }

    function changeStr(data) {
        //筛选level=1的对象
        var menu_node1 = menu_data.filter(function (e) { return e.level == 1; });
    }
});

