using System.Web;
using System.Web.Optimization;
using System.Web.UI;

namespace CPMA
{
    public class BundleConfig
    {
        // 有关绑定的详细信息，请访问 http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/bundles/PageUI/MyInfoIndexUi/css").Include(
                "~/PageUI/MyInfoIndexUi/css/animate.min.css",
                "~/PageUI/MyInfoIndexUi/css/bootstrap.min.css",
                "~/PageUI/MyInfoIndexUi/css/swiper.min.css"));

            bundles.Add(new StyleBundle("~/bundles/PageUI/UserInfoIndex/css").Include(
                "~/PageUI/UserInfoIndex/css/jiazaitoubu.css",
                "~/PageUI/UserInfoIndex/css/css.css",
                "~/PageUI/UserInfoIndex/css/center.css"));

            BundleTable.EnableOptimizations = true;
        }
    }
}
