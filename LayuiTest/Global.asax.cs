using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace CPMA
{
    public class MvcApplication : System.Web.HttpApplication
    {
<<<<<<< HEAD
        protected void Application_Start()
        {
=======
        public static string session { get; set; }
        protected void Application_Start()
        {
            session = "asd";
>>>>>>> origin/main
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
    }
}
