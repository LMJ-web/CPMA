using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CPMA.Models
{
    //后台过滤器
    public class AdminAuthorizeAttribute : AuthorizeAttribute
    {
        //校验规则
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            if (httpContext.Session["AdminValidateState"] == null)
            {
                return false;
            }
            else
            {
                return httpContext.Session["AdminValidateState"].ToString() == "true";
            }
        }

        //错误返回
        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            filterContext.HttpContext.Response.Redirect("/Home/LoginIndex?Status=1");

            //base.HandleUnauthorizedRequest(filterContext);
        }
    }
}