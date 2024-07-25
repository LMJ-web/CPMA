using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CPMA.Models
{
    //前台过滤器
    public class UserAuthorizeAttribute : AuthorizeAttribute
    {
        //校验规则
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            //return base.AuthorizeCore(httpContext);
            if (httpContext.Session["UserValidateState"]==null)
            {
                return false;
            }
            else {
                return httpContext.Session["UserValidateState"].ToString() == "true";
            }
        }

        //错误返回
        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            filterContext.HttpContext.Response.Redirect("/Home/LoginIndex?Status=0&RegState=0");

            //base.HandleUnauthorizedRequest(filterContext);
        }
    }
}