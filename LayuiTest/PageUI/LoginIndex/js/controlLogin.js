
$(document).keypress(function (e) {
    // 回车键事件
    if (e.which == 13) {
        $('#loginBtn').click();
    }
});


$('input[name="login"],input[name="pwd"]').keyup(function () {
    var Len = $(this).val().length;
    if (!$(this).val() == '' && Len >= 5) {
        $(this).css("color", "blue");
    } else {
        $(this).css("color", "black");
    }
});
$('#registerLogin,#registerPassword1,#registerPassword2,#registerNick').keyup(function () {
    var Len = $(this).val().length;
    if (!$(this).val() == '' && Len >= 5) {
        $(this).css("color", "blue");
    } else {
        $(this).css("color", "black");
    }
});
function LayerAlert(content) {
    layer.alert(content, {
        icon: 5,
        title: "提示"
    });
}
layui.use('layer', function () {
    //var msgalert = '默认账号:' + truelogin + '<br/> 默认密码:' + truepwd;
    //var index = layer.alert(msgalert, { icon: 6, time: 4000, offset: 't', closeBtn: 0, title: '友情提示', btn: [], anim: 2, shade: 0 });
    //	layer.style(index, {
    //		color: '#777'
    //	});
    //第一次弹出框

    //登录按钮事件-非空验证
    $('#loginBtn').click(function () {
        $("#loginBtn").hide();
        $("#loginLoding").show();
        var login = $('#login').val();
        var pwd = $('#pwd').val();
        var remStatus = localStorage.RemPasswordS;
        if (login == '') {
            $("#loginBtn").show();
            $("#loginLoding").hide();
            LayerAlert('账号不能为空，请输入您的账号！');
            return false;
        } else if (pwd == '') {
            $("#loginBtn").show();
            $("#loginLoding").hide();      
            LayerAlert('密码不能为空，请输入您的密码！');
            return false;
        } else {
            //登陆
            var JsonData = { login: login, pwd: pwd };
            //此处做为ajax内部判断
            var url = "";
            var ValidateState = false;
            var User = null;
            //调用数据库賬號驗證，并返回结果

            if ($("#Status").val() == "1") {
                $.ajax({
                    url: "/Admin/AdminValidate",
                    type: "post",
                    async: false,
                    dataType: "JSON",
                    data: { UserName: JsonData.login, Password: JsonData.pwd, Status: 1 },
                    success: function (data) {
                        $("#login").removeClass();
                        if (data.ValidateState) {
                            //存入
                            sessionStorage.admin = JSON.stringify(data);
                            layer.msg('登录成功！', {
                                time: 2000, //2s后自动关闭
                                btn: ['确认']
                            });
                        }
                        ValidateState = data.ValidateState;
                    }
                });

            } else {
                $.ajax({
                    url: "/User/UserValidate",
                    type: "post",
                    async: false,
                    dataType: "JSON",
                    data: { UserName: JsonData.login, Password: JsonData.pwd, Status: 0 },
                    success: function (data) {
                        $("#login").removeClass();
                        if (data.ValidateState) {
                            //存入
                            sessionStorage.user = JSON.stringify(data);
                            layer.msg('登录成功！', {
                                time: 2000, //2s后自动关闭
                                btn: ['确认']
                            });
                        }
                        ValidateState = data.ValidateState;
                    }
                });
            }
            setTimeout(function () {
                $("#loginBtn").show();
                $("#loginLoding").hide();
                if (ValidateState == true) {
                    //用戶記住密碼
                    if (remStatus == "1" && $("#Status").val() == "0") {
                        localStorage.login = login;
                        localStorage.pwd = pwd;
                    } else {
                        localStorage.login = "";
                        localStorage.pwd = "";
                    }
                    //跳转操作  1-管理员登录
                    if ($("#Status").val() == "1") {
                        window.location.href = "/Admin/AdminIndex";
                    }
                    else {
                        window.location.href = "/Home/Index";
                    }
                } else {
                    LayerAlert('账号或者密码错误！');
                    return false;
                }
            }, 1000);

        }
    });
    //注册按钮事件
    $("#sureRegisterBtn").click(function () {
        $("#sureRegisterBtn").hide();
        $("#regLoding").show();
        var error = 0;
        if ($("#registerNick").val() == "") {
            $("#sureRegisterBtn").show();
            $("#regLoding").hide();
            //配置一个透明的询问框
            LayerAlert('昵称不能为空！');
            error++;
            return false;
        }
        var regStr = /^[0-9a-zA-Z]+/;
        if ($("#registerLogin").val() == "" || $("#registerLogin").val().match(regStr) == false) {
            $("#sureRegisterBtn").show();
            $("#regLoding").hide();
            //配置一个透明的询问框
            LayerAlert('账号不能输入中文或特殊符号！');
            error++;
            return false;

        }
        if ($("#registerPassword1").val() != $("#registerPassword2").val() || $("#registerPassword1").val() == "" || $("#registerPassword2").val() == "") {
            error++;
            $("#sureRegisterBtn").show();
            $("#regLoding").hide();
            //配置一个透明的询问框
            LayerAlert('两次密码不相同或密码不能为空！');
            return false;
        }
        setTimeout(function () {
            //账号校验，判断是否已注册
            if (error == 0) {
                $.ajax({
                    url: "/User/UserNameVal",
                    data: { UserName: $("#registerLogin").val(), Status: 0 },
                    type: "post",
                    async: false,
                    dataType: "json",
                    success: function (data) {
                        $("#sureRegisterBtn").show();
                        $("#regLoding").hide();
                        if (data == "false") {
                            $.ajax({
                                url: "/User/RegisterUser",
                                data: { UserName: $("#registerLogin").val(), Password: $("#registerPassword1").val(), Nick: $("#registerNick").val(), Status: 0 },
                                type: "post",
                                async: false,
                                dataType: "json",
                                success: function (data) {

                                    if (data == "true") {
                                        $("#loginDiv").fadeToggle();
                                        $("#registerDiv").fadeToggle();
                                        //配置一个透明的询问框
                                        layer.msg('注册成功,请登录！', {
                                            time: 2000, //2s后自动关闭
                                            btn: ['确认']
                                        });
                                    } else {
                                        //配置一个透明的询问框
                                        layer.msg('注册失败，请联系管理员！', {
                                            time: 2000, //2s后自动关闭
                                            btn: ['确认']
                                        });
                                    }
                                }
                            });
                        } else {
                            //配置一个透明的询问框
                            LayerAlert('该账号已被注册！');
                            return false;
                        }
                    }
                });
            } else {
                $("#sureRegisterBtn").show();
                $("#regLoding").hide();
            }
        }, 1000);
    });
})