using CPMA.Models;
using System;
using System.Collections.Generic;
using System.Web.Mvc;
using System.IO;
namespace CPMA.Controllers
{
    public class HomeController : Controller
    {
        DBHelper helper = new DBHelper();
        string sql = "";

        #region 界面

        //主界面
        public ActionResult Index(string LoginStatus)
        {
            ViewBag.LoginStatus = LoginStatus;
            return View();
        }

        //商家入驻
        public ActionResult SJRZ()
        {
            return View();
        }

        //联系我们界面
        public ActionResult LXWM()
        {
            return View();
        }

        //公司招贤纳士界面
        public ActionResult ZXNS()
        {
            return View();
        }

        //登录界面
        public ActionResult LoginIndex(string Status, string RegState)
        {
            ViewBag.Status = Status;
            ViewBag.RegState = RegState;
            return View();
        }

        //个人公司信息展示界面
        public ActionResult MyInfoIndex()
        {
            return View();

        }

        //个人信息修改界面
        [UserAuthorize]
        public ActionResult UserInfoIndex(string UserName)
        {
            ViewBag.UserName = UserName;
            return View();

        }

        //商店信息展示界面
        public ActionResult ShopYYIndex(int ShopId)
        {

            Shop shop = new Shop();
            sql = "select * from Shop where ShopId='" + ShopId + "'";
            using (var reader = helper.ExecuteReader(sql))
            {
                if (reader.Read())
                {
                    shop.ShopId = int.Parse(reader["ShopId"].ToString());
                    shop.ShopName = reader["ShopName"].ToString();
                    shop.ShopContact = reader["ShopContact"].ToString();
                    shop.ShopPhone = reader["ShopPhone"].ToString();
                    shop.StartTime = reader["StartTime"].ToString();
                    shop.EndTime = reader["EndTime"].ToString();
                    shop.MinPrice = int.Parse(reader["MinPrice"].ToString());
                    shop.MaxPrice = int.Parse(reader["MaxPrice"].ToString());
                    shop.ShopAddress = reader["ShopAddress"].ToString();
                    shop.ShopDAddress = reader["ShopDAddress"].ToString();
                    shop.ShopIntroduce = reader["ShopIntroduce"].ToString();
                    shop.ShopFMImgPath = reader["ShopFMImgPath"].ToString();
                    shop.ShopTGImgPath = reader["ShopTGImgPath"].ToString();
                    shop.HotState = int.Parse(reader["HotState"].ToString());
                    shop.ConcernNum = int.Parse(reader["ConcernNum"].ToString());
                    shop.CreateDate = reader["CreateDate"].ToString();
                }
            }
            ViewBag.Shop = shop;
            return View();
        }

        //返回评论页面
        [UserAuthorize]
        public ActionResult EvaluateModel(string ShopReservationId)
        {
            ViewBag.ShopReservationId = ShopReservationId;
            return View();
        }

        //返回购物车页面
        public ActionResult CartIndex()
        {
            return View();
        }

        //返回添加商品页面
        [AdminAuthorize]
        public ActionResult AddGoodsModel()
        {
            return View();
        }

        //返回编辑商品页面
        [AdminAuthorize]
        public ActionResult UpdateGoodsModel(string Id)
        {
            AdminController ac = new AdminController();
            if (string.IsNullOrEmpty(Id))
            {
                ViewBag.Goods = null;
            }
            else
            {
                var result = ac.ReadGoodsInfoById(int.Parse(Id));
                ViewBag.Goods = result;
            }
            return View();
        }

        //返回编辑商店页面
        [AdminAuthorize]
        public ActionResult UpdateShopModel(string Id)
        {
            ShopController sc = new ShopController();
            if (string.IsNullOrEmpty(Id))
            {
                ViewBag.Shop = null;
            }
            else
            {
                var result = sc.ReadShopInfo(int.Parse(Id));
                ViewBag.Shop = result;
            }
            return View();
        }

        #endregion

        public int noticePageSize = 8;
        //分页获取狀态為1的最新公告
        public JsonResult GetNoticesByFY(int CurrentPage)
        {
            //TotalPages页数
            //TotalElements总记录数
            List<Notice> noticeList = new List<Notice>();
            if (CurrentPage == 1)
            {
                sql = "select Top(" + noticePageSize + ") * from Notice Where Status=1";

            }
            else
            {
                sql = "select Top(" + noticePageSize + ") * from Notice Where Status=1 and NoticeId not in (select Top(" + (CurrentPage - 1) * noticePageSize + ") NoticeId from  Notice Where Status=1)";
            }
            using (var reader = helper.ExecuteReader(sql))
            {
                while (reader.Read())
                {
                    Notice Notice = new Notice();
                    Notice.NoticeId = int.Parse(reader["NoticeId"].ToString());
                    Notice.NoticeTitle = reader["NoticeTitle"].ToString();
                    Notice.NoticeIntro = reader["NoticeIntro"].ToString();
                    Notice.NoticeContent = reader["NoticeContent"].ToString();
                    Notice.CreateDate = reader["CreateDate"].ToString();
                    noticeList.Add(Notice);
                }
            }
            sql = "select count(*) as Num from Notice Where Status=1";
            using (var reader = helper.ExecuteReader(sql))
            {
                int num = 0;
                if (reader.Read())
                {
                    num = int.Parse(reader["Num"].ToString());
                }
                if (num > 0)
                {
                    if (num % noticePageSize == 0)
                    {
                        noticeList[0].TotalPages = num / noticePageSize;
                    }
                    else
                    {
                        //向上取整
                        noticeList[0].TotalPages = num / noticePageSize + 1;
                    }
                    noticeList[0].CurrentPage = CurrentPage;

                }
            }
            return Json(noticeList);
        }

        //获取狀态為1的最新公告的总数
        public int GetAllNoticesCount()
        {
            var count = 0;
            sql = "select count(*) as Count from Notice Where Status=1";
            using (var reader = helper.ExecuteReader(sql))
            {
                while (reader.Read())
                {
                    count = int.Parse(reader["Count"].ToString());
                    break;
                }
            }
            return count;
        }

        //获取推荐的电子产品
        public JsonResult GetAllHotGoods()
        {
            List<Goods> GoodsList = new List<Goods>();
            sql = "select * from Goods where HotState=1 Order by GoodsConcernNum DESC";
            using (var reader = helper.ExecuteReader(sql))
            {
                try
                {
                    while (reader.Read())
                    {
                        Goods goods = new Goods();
                        goods.GoodsId = int.Parse(reader["GoodsId"].ToString());
                        goods.ShopId = int.Parse(reader["ShopId"].ToString());
                        goods.GoodsName = reader["GoodsName"].ToString();
                        goods.GoodsPrice = int.Parse(reader["GoodsPrice"].ToString());
                        goods.GoodsConcernNum = int.Parse(reader["GoodsConcernNum"].ToString());
                        goods.GoodsIntroduce = reader["GoodsIntroduce"].ToString();
                        goods.CategoryId = int.Parse(reader["CategoryId"].ToString());
                        goods.GoodsFMImgPath = reader["GoodsFMImgPath"].ToString();
                        goods.HotState = int.Parse(reader["HotState"].ToString());
                        goods.CreateDate = reader["CreateDate"].ToString();
                        GoodsList.Add(goods);
                    }
                    return Json(GoodsList);
                }
                catch (Exception ex)
                {
                    return Json(GoodsList);
                }
            }
        }

        //获取搜索栏的自动提示信息
        public JsonResult GetSearchTip(string Str, int Type)
        {
            //0 获取电子产品名
            //1 获取商家名
            if (Type == 0)
            {
                List<Goods> goodsList = new List<Goods>();
                sql = "select * from Goods where GoodsName like N'%" + Str + "%'  order by GoodsConcernNum desc";
                using (var reader = helper.ExecuteReader(sql))
                {
                    while (reader.Read())
                    {
                        Goods goods = new Goods();
                        goods.GoodsName = reader["GoodsName"].ToString();
                        goodsList.Add(goods);
                    }
                }
                return Json(goodsList);
            }
            else
            {
                List<Shop> shopList = new List<Shop>();

                sql = "select * from Shop where ShopName like N'%" + Str + "%' order by ConcernNum desc";
                using (var reader = helper.ExecuteReader(sql))
                {
                    while (reader.Read())
                    {
                        Shop shop = new Shop();
                        shop.ShopName = reader["ShopName"].ToString();
                        shopList.Add(shop);
                    }
                }
                return Json(shopList);
            }

        }

        public int shopPageSize = 20;
        public int shopGoodsPageSize = 20;
        //分页获取商店
        public JsonResult GetShopByFY(int CurrentPage)
        {   //TotalPages页数
            //TotalElements总记录数
            List<Shop> shopList = new List<Shop>();
            try
            {
                if (CurrentPage == 1)
                {
                    sql = "select Top(" + shopPageSize + ") * from Shop";

                }
                else
                {
                    sql = "select Top(" + shopPageSize + ") * from Shop Where ShopId not in (select Top(" + (CurrentPage - 1) * shopPageSize + ") ShopId from Shop)";
                }
                using (var reader = helper.ExecuteReader(sql))
                {
                    while (reader.Read())
                    {
                        Shop shop = new Shop();
                        shop.ShopId = int.Parse(reader["ShopId"].ToString());
                        shop.ShopName = reader["ShopName"].ToString();
                        shop.ShopContact = reader["ShopContact"].ToString();
                        shop.ShopAddress = reader["ShopAddress"].ToString();
                        shop.ShopIntroduce = reader["ShopIntroduce"].ToString();
                        shop.ShopFMImgPath = reader["ShopFMImgPath"].ToString();
                        shop.ConcernNum = int.Parse(reader["ConcernNum"].ToString());
                        shop.HotState = int.Parse(reader["HotState"].ToString());
                        shop.CreateDate = reader["CreateDate"].ToString();
                        shopList.Add(shop);
                    }
                }
                sql = "select count(*) as Num from Shop";
                using (var reader = helper.ExecuteReader(sql))
                {
                    int num = 0;
                    if (reader.Read())
                    {
                        num = int.Parse(reader["Num"].ToString());
                    }
                    if (num > 0)
                    {
                        if (num % shopPageSize == 0)
                        {
                            shopList[0].TotalPages = num / shopPageSize;
                        }
                        else
                        {
                            //向上取整
                            shopList[0].TotalPages = num / shopPageSize + 1;
                        }
                        shopList[0].CurrentPage = CurrentPage;

                    }
                }
                return Json(shopList);
            }
            catch
            {
                return Json(shopList);
            }
        }

        //分页获取电子产品
        public JsonResult GetGoodsByFY(int CurrentPage)
        {   //TotalPages页数
            //TotalElements总记录数
            List<Goods> goodsList = new List<Goods>();
            try
            {
                if (CurrentPage == 1)
                {
                    sql = "select Top(" + shopPageSize + ") * from Goods as g,Shop as s where g.ShopId=s.ShopId";

                }
                else
                {
                    sql = "select Top(" + shopPageSize + ") * from Goods as g,Shop as s where g.ShopId=s.ShopId and g.GoodsId not in (select Top(" + (CurrentPage - 1) * shopPageSize + ") GoodsId from Goods)";
                }
                using (var reader = helper.ExecuteReader(sql))
                {
                    while (reader.Read())
                    {
                        Goods goods = new Goods();
                        goods.GoodsId = int.Parse(reader["GoodsId"].ToString());
                        goods.ShopId = int.Parse(reader["ShopId"].ToString());
                        goods.GoodsName = reader["GoodsName"].ToString();
                        goods.ShopName = reader["ShopName"].ToString();
                        goods.GoodsPrice = int.Parse(reader["GoodsPrice"].ToString());
                        goods.GoodsConcernNum = int.Parse(reader["GoodsConcernNum"].ToString());
                        goods.GoodsIntroduce = reader["GoodsIntroduce"].ToString();
                        goods.CategoryId = int.Parse(reader["CategoryId"].ToString());
                        goods.GoodsFMImgPath = reader["GoodsFMImgPath"].ToString();
                        goods.HotState = int.Parse(reader["HotState"].ToString());
                        goods.CreateDate = reader["CreateDate"].ToString();
                        goodsList.Add(goods);
                    }
                }
                sql = "select count(*) as Num from Goods";
                using (var reader = helper.ExecuteReader(sql))
                {
                    int num = 0;
                    if (reader.Read())
                    {
                        num = int.Parse(reader["Num"].ToString());
                    }
                    if (num > 0)
                    {
                        if (num % shopPageSize == 0)
                        {
                            goodsList[0].TotalPages = num / shopPageSize;
                        }
                        else
                        {
                            //向上取整
                            goodsList[0].TotalPages = num / shopPageSize + 1;
                        }
                        goodsList[0].CurrentPage = CurrentPage;

                    }
                }
                return Json(goodsList);
            }
            catch
            {
                return Json(goodsList);
            }
        }

        //通过字符串获取商店或者电子产品信息
        public JsonResult SearchGetDataByStr(string Str, int Type, int CurrentPage)
        {
            //0 获取电子产品
            //1 获取商店
            if (Type == 0)
            {
                return GetShopGoodsInfoByStr_FY(Str, CurrentPage);
            }
            else
            {
                return GetShopInfoByStr_FY(Str, CurrentPage);
            }
        }

        //通过字符串分页获取电子产品信息
        public JsonResult GetShopGoodsInfoByStr_FY(string Str, int CurrentPage)
        {
            List<Goods> goodsList = new List<Goods>();
            if (CurrentPage == 1)
            {
                sql = "select Top(" + shopGoodsPageSize + ") *,s.ShopName from Goods as g,Shop as s where g.ShopId=s.ShopId and GoodsName like N'%" + Str + "%' order by GoodsConcernNum desc";

            }
            else
            {
                sql = "select Top(" + shopGoodsPageSize + ") *,s.ShopName from Goods as g,Shop as s where g.ShopId=s.ShopId and GoodsName like N'%" + Str + "%' and GoodsId not in (select Top(" + (CurrentPage - 1) * shopGoodsPageSize + ") GoodsId from Goods)  order by GoodsConcernNum desc";
            }
            using (var reader = helper.ExecuteReader(sql))
            {
                while (reader.Read())
                {
                    Goods goods = new Goods();
                    goods.GoodsId = int.Parse(reader["GoodsId"].ToString());
                    goods.ShopId = int.Parse(reader["ShopId"].ToString());
                    goods.GoodsName = reader["GoodsName"].ToString();
                    goods.ShopName = reader["ShopName"].ToString();
                    goods.GoodsPrice = int.Parse(reader["GoodsPrice"].ToString());
                    goods.GoodsConcernNum = int.Parse(reader["GoodsConcernNum"].ToString());
                    goods.GoodsIntroduce = reader["GoodsIntroduce"].ToString();
                    goods.CategoryId = int.Parse(reader["CategoryId"].ToString());
                    goods.GoodsFMImgPath = reader["GoodsFMImgPath"].ToString();
                    goods.HotState = int.Parse(reader["HotState"].ToString());
                    goods.CreateDate = reader["CreateDate"].ToString();
                    goodsList.Add(goods);
                }
            }
            sql = "select count(*) as Num from Goods where GoodsName like N'%" + Str + "%'";
            using (var reader = helper.ExecuteReader(sql))
            {
                int num = 0;
                if (reader.Read())
                {
                    num = int.Parse(reader["Num"].ToString());
                }
                if (num > 0)
                {
                    if (num % shopPageSize == 0)
                    {
                        goodsList[0].TotalPages = num / shopGoodsPageSize;
                    }
                    else
                    {
                        //向上取整
                        goodsList[0].TotalPages = num / shopGoodsPageSize + 1;
                    }
                    goodsList[0].CurrentPage = CurrentPage;
                }

            }
            return Json(goodsList);
        }

        //通过字符串分页获取商店信息
        public JsonResult GetShopInfoByStr_FY(string Str, int CurrentPage)
        {
            List<Shop> shopList = new List<Shop>();
            //TotalPages页数
            //TotalElements总记录数
            if (CurrentPage == 1)
            {
                sql = "select Top(" + shopPageSize + ") * from Shop where ShopName like N'%" + Str + "%' order by ConcernNum desc";

            }
            else
            {
                sql = "select Top(" + shopPageSize + ") * from Shop Where ShopName like N'%" + Str + "%' and ShopId not in (select Top(" + (CurrentPage - 1) * shopPageSize + ") ShopId from Shop)  order by ConcernNum desc";
            }
            using (var reader = helper.ExecuteReader(sql))
            {
                while (reader.Read())
                {
                    Shop shop = new Shop();
                    shop.ShopId = int.Parse(reader["ShopId"].ToString());
                    shop.ShopName = reader["ShopName"].ToString();
                    shop.ShopContact = reader["ShopContact"].ToString();
                    shop.ShopAddress = reader["ShopAddress"].ToString();
                    shop.ShopIntroduce = reader["ShopIntroduce"].ToString();
                    shop.ShopFMImgPath = reader["ShopFMImgPath"].ToString();
                    shop.ConcernNum = int.Parse(reader["ConcernNum"].ToString());
                    shop.HotState = int.Parse(reader["HotState"].ToString());
                    shop.CreateDate = reader["CreateDate"].ToString();
                    shopList.Add(shop);
                }
            }
            sql = "select count(*) as Num from Shop where ShopName like N'%" + Str + "%'";
            using (var reader = helper.ExecuteReader(sql))
            {
                int num = 0;
                if (reader.Read())
                {
                    num = int.Parse(reader["Num"].ToString());
                }
                if (num > 0)
                {
                    if (num % shopPageSize == 0)
                    {
                        shopList[0].TotalPages = num / shopPageSize;
                    }
                    else
                    {
                        //向上取整
                        shopList[0].TotalPages = num / shopPageSize + 1;
                    }
                    shopList[0].CurrentPage = CurrentPage;
                }
            }
            return Json(shopList);
        }

        //获取商店总数
        public int GetAllShopCount()
        {
            var count = 0;
            sql = "select count(*) as Count from Shop";
            using (var reader = helper.ExecuteReader(sql))
            {
                while (reader.Read())
                {
                    count = int.Parse(reader["Count"].ToString());
                    break;
                }
            }
            return count;
        }

        //通过模糊查找获取商店总数
        public int GetAllShopCountByStr(string Str)
        {
            var count = 0;
            sql = "select count(*) as Count from Shop where ShopName like N'%" + Str + "%'";
            using (var reader = helper.ExecuteReader(sql))
            {
                while (reader.Read())
                {
                    count = int.Parse(reader["Count"].ToString());
                    break;
                }
            }
            return count;
        }

        //获取商品总数
        public int GetAllGoodsCount()
        {
            var count = 0;
            sql = "select count(*) as Count from Goods";
            using (var reader = helper.ExecuteReader(sql))
            {
                while (reader.Read())
                {
                    count = int.Parse(reader["Count"].ToString());
                    break;
                }
            }
            return count;
        }

        //通过模糊查找获取商品总数
        public int GetAllGoodsCountByStr(string Str)
        {
            var count = 0;
            sql = "select count(*) as Count from Goods where GoodsName Like N'%" + Str + "%'";
            using (var reader = helper.ExecuteReader(sql))
            {
                while (reader.Read())
                {
                    count = int.Parse(reader["Count"].ToString());
                    break;
                }
            }
            return count;
        }

        #region OCR
        //OCR图文文字识别界面
        public ActionResult OCRIndex()
        {
            return View();
        }
        // 设置APPID/AK/SK
        public static string APP_ID = "15023016";
        public static string API_KEY = "BAffVFo0dUfD76t9L33XVAy9";
        public static string SECRET_KEY = "tHXkFNRAGjGwtAtbxgTjGUgy1UmcwCEA";
        public Baidu.Aip.Ocr.Ocr client = new Baidu.Aip.Ocr.Ocr(API_KEY, SECRET_KEY);

        public JsonResult GeneralBasicDemo()
        {
            var filePath = Server.MapPath(string.Format("~/Img", "File"));
            var image = System.IO.File.ReadAllBytes(Path.Combine(filePath, "sfzb.jpg"));
            // 调用通用文字识别, 图片参数为本地图片，可能会抛出网络等异常，请使用try/catch捕获
            var result = client.GeneralBasic(image);
            Console.WriteLine(result);
            return Json(result);
            // 如果有可选参数
            //var options = new Dictionary<string, object>{
            //    {"language_type", "CHN_ENG"},
            //    {"detect_direction", "true"},
            //    {"detect_language", "true"},
            //    {"probability", "true"}
            //};
            //// 带参数调用通用文字识别, 图片参数为本地图片
            //result = client.GeneralBasic(image, options);
            //Console.WriteLine(result);
        }

        public void GeneralBasicUrlDemo()
        {
            var url = "http//www.x.com/sample.jpg";

            // 调用通用文字识别, 图片参数为远程url图片，可能会抛出网络等异常，请使用try/catch捕获
            var result = client.GeneralBasicUrl(url);
            Console.WriteLine(result);
            // 如果有可选参数
            //var options = new Dictionary<string, object>{
            // {"language_type", "CHN_ENG"},
            //   {"detect_direction", "true"},
            //  {"detect_language", "true"},
            // {"probability", "true"}
            //};
            //// 带参数调用通用文字识别, 图片参数为远程url图片
            //result = client.GeneralBasicUrl(url, options);
            //Console.WriteLine(result);
        }

        //提取图片中的文字
        public JsonResult GetImgText(string UserName)
        {
            if (Request.Files.Count > 0)
            {
                Request.Files[0].SaveAs(Server.MapPath("~/Img/") + UserName + "_" + Path.GetFileName(Request.Files[0].FileName));
                var image = System.IO.File.ReadAllBytes(Server.MapPath("~/Img/") + UserName + "_" + Path.GetFileName(Request.Files[0].FileName));
                // 调用通用文字识别, 图片参数为本地图片，可能会抛出网络等异常，请使用try/catch捕获
                var result = client.GeneralBasic(image);
                // 如果有可选参数
                var options = new Dictionary<string, object>{
                {"language_type", "CHN_ENG"},
                {"detect_direction", "true"},
                {"detect_language", "true"},
                {"probability", "true"}
            };
                // 带参数调用通用文字识别, 图片参数为本地图片
                result = client.GeneralBasic(image, options);
                System.Diagnostics.Debug.WriteLine(result);

                System.IO.File.Delete(Server.MapPath("~/Img/") + UserName + "_" + Path.GetFileName(Request.Files[0].FileName));
                return Json(result.ToString());
            }
            else
            {
                return Json(null);
            }

        }
        #endregion

    }
}