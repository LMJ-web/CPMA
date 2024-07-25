layui.config({
    base: "js/"
}).use(['form', 'layer', 'jquery', 'laypage'], function () {
    var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		$ = layui.jquery;

    //加载页面数据
    var evaluateData = '';
    GetAllEvaluate();

    //查询
    $(".search_btn").click(function () {
        var evaluateArray = [];
        if ($(".search_input").val() != '') {
            var index = layer.msg('查询中，请稍候', { icon: 16, time: false, shade: 0.8 });
            setTimeout(function () {
                $.ajax({
                    url: "/Admin/GetAllEvaluate",
                    type: "post",
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        if (window.sessionStorage.getItem("addEvaluate")) {
                            var addEvaluate = window.sessionStorage.getItem("addEvaluate");
                            evaluateData = JSON.parse(addEvaluate).concat(data);
                        } else {
                            evaluateData = data;
                        }
                        var menu_node = [];
                        var selectStr = $(".search_input").val().trim();
                        menu_node = data.filter(function (e) { return (e.ShopResId.toString().match(selectStr) != null) || (e.UserId.toString().match(selectStr) != null) || (e.ShopId.toString().match(selectStr) != null); });
                        for (var i = 0; i < menu_node.length; i++) {
                            evaluateArray.push(menu_node[i]);
                        }
                        evaluateData = evaluateArray;
                        EvaluateList(evaluateData);
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
        var $checkbox = $('.evaluate_list tbody input[type="checkbox"][name="checked"]');
        var $checked = $('.evaluate_list tbody input[type="checkbox"][name="checked"]:checked');
        var _this = $(this);
        if ($checkbox.is(":checked")) {
            layer.confirm('确定删除选中的信息？', { icon: 3, title: '提示信息' }, function (index) {
                var index = layer.msg('删除中，请稍候', { icon: 16, time: false, shade: 0.8 });
                setTimeout(function () {
                    //删除数据
                    for (var j = 0; j < $checkbox.length; j++) {
                        if ($checkbox[j].checked == true) {
                            DeleteEvaluate(evaluateData[j].ShopResId);
                        }
                    }
                    $('.evaluate_list thead input[type="checkbox"]').prop("checked", false);
                    layer.close(index);
                    GetAllEvaluate();
                    form.render();
                }, 100);
            })
        } else {
            layer.msg("请选择需要删除的记录！");
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
    $("body").on("click", ".evaluate_del", function () {

        var _this = $(this);
        layer.confirm('确定删除此条信息？', { icon: 3, title: '提示信息' }, function (index) {
            //_this.parents("tr").remove();
            for (var i = 0; i < evaluateData.length; i++) {
                if (evaluateData[i].ShopResId == _this.attr("data-id")) {
                    DeleteEvaluate(evaluateData[i].ShopResId);
                    //在数组中第i位置，删除一个元素
                    evaluateData.splice(i, 1);
                    EvaluateList(evaluateData);
                }
            }
            layer.close(index);
        });
    })

    //编辑点击事件绑定
    $("body").on("click", ".evaluate_edit", function () {
        ShowEvaluateModel($(this).attr("data-id"));
    });

    /*--------------------操作---------------------*/
    function EvaluateList() {
        //渲染数据
        function renderDate(data, curr) {
            var dataHtml = '';
            currData = evaluateData.concat().splice(curr * nums - nums, nums);
            if (currData.length != 0) {
                for (var i = 0; i < currData.length; i++) {
                    dataHtml += '<tr>'
                             + '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
                             + '<td name="EvaluateId">' + currData[i].ShopResId + '</td>'
                             + '<td>' + currData[i].UserId + '</td>'
                             + '<td>' + currData[i].ShopId + '</td>'
                             + '<td>' + currData[i].EvaluateContent + '</td>'
                             + '<td>' + currData[i].EvaluateStars + '</td>'
                             + '<td>' + currData[i].EvaluateDate + '</td>';
                    dataHtml += '<td>'
                                   + '<a class="layui-btn layui-btn-mini evaluate_edit" data-id="' + currData[i].ShopResId + '"><i class="iconfont icon-edit"></i> 编辑</a>'
                                   + '<a class="layui-btn layui-btn-danger layui-btn-mini evaluate_del" data-id="' + currData[i].ShopResId + '"><i class="layui-icon">&#xe640;</i> 删除</a>'
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
            pages: Math.ceil(evaluateData.length / nums),
            jump: function (obj) {
                $(".evaluate_content").html(renderDate(evaluateData, obj.curr));
                $('.evaluate_list thead input[type="checkbox"]').prop("checked", false);
                form.render();
            }
        })
    }

    //获取评论信息
    function GetAllEvaluate() {
        $.ajax({
            url: "/Admin/GetAllEvaluate",
            async: false,
            type: "post",
            datatype: "json",
            data: {},
            success: function (data) {
                evaluateData = data;
                if (window.sessionStorage.getItem("addEvaluate")) {
                    var addEvaluate = window.sessionStorage.getItem("addEvaluate");
                    evaluateData = JSON.parse(addEvaluate).concat(evaluateData);
                }
                //执行加载数据的方法
                EvaluateList();
            }
        });
    }

    //显示编辑评论信息的Model
    function ShowEvaluateModel(id) {
        layer.open({
            type: 2,
            title: "评论信息编辑页面",
            area: ['600px', '300px'],
            fixed: false, //不固定
            maxmin: true,
            shadeClose: true,
            content: '/Home/EvaluateModel?ShopReservationId=' + id,
            end: function () {
                GetAllEvaluate();
            }
        });
    }

    //删除评论
    function DeleteEvaluate(evaluateId) {
        $.ajax({
            url: "/Admin/DeleteEvaluate",
            data: { Id: parseInt(evaluateId) },
            type: "post",
            dataType: "json",
            async: false,
            success: function (data) {
                if (data ==""||data==null) {
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

