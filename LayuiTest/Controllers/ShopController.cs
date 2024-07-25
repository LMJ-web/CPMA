using CPMA.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Web;
using System.Web.Mvc;

namespace CPMA.Controllers
{
    public class ShopController : Controller
    {
        DBHelper helper = new DBHelper();
        string sql = "";
        public int myGoodsPageSize = 12;//我的商铺页面大小--注意前后台对应
        public int colShopPageSize = 10;

        #region 商家操作
        //商家封面上传
        [HttpPost]
        public JsonResult UploadShopFMImg(HttpPostedFileBase file, string UserName,string ShopId)
        {
            try
            {
                var fileName = file.FileName.ToLower();
                string mfileName = "";
                if (string.IsNullOrEmpty(UserName))
                {
                    if (fileName.IndexOf("jpg") >= 0)
                    {
                        mfileName = ShopId + "_shopfm.jpg";
                    }
                    else if (fileName.IndexOf("png") >= 0)
                    {
                        mfileName = ShopId + "_shopfm.png";
                    }
                    else
                    {
                        return Json("false");
                    }
                    sql = "update Shop set ShopFMImgPath=N'/Img/FM/" + mfileName + "' where ShopId=" + ShopId ;
                }
                else {
                    if (fileName.IndexOf("jpg") >= 0)
                    {
                        mfileName = UserName + "_shopfm.jpg";
                    }
                    else if (fileName.IndexOf("png") >= 0)
                    {
                        mfileName = UserName + "_shopfm.png";
                    }
                    else
                    {
                        return Json("false");
                    }
                    sql = "update Shop set ShopFMImgPath=N'/Img/FM/" + mfileName + "' where UserName='" + UserName + "'";
                }
                var filePath = Server.MapPath(string.Format("~/Img/FM", "File"));
                file.SaveAs(Path.Combine(filePath, mfileName));
              
                var result = helper.ExecuteCommand(sql);
                return Json(result);
            }
            catch (Exception ex)
            {
                return Json("false");
            }

        }

        //商品封面上传
        [HttpPost]
        public JsonResult UploadGoodsFMImg(HttpPostedFileBase file, string UserName,int GoodsId)
        {
            try
            {
                var fileName = file.FileName.ToLower();
                string mfileName = "";
                if (string.IsNullOrEmpty(UserName))
                {
                    if (fileName.IndexOf("jpg") >= 0)
                    {
                        mfileName = GoodsId + "_" + GoodsId + "_goodsfm.jpg";
                    }
                    else if (fileName.IndexOf("png") >= 0)
                    {
                        mfileName = GoodsId + "_" + GoodsId + "_goodsfm.png";
                    }
                    else
                    {
                        return Json("false");
                    }
                    sql = "update Goods set GoodsFMImgPath=N'/Img/GoodsFMImg/" + mfileName + "' where GoodsId=" + GoodsId;
                }
                else {
                    if (fileName.IndexOf("jpg") >= 0)
                    {
                        mfileName = UserName + "_" + GoodsId + "_goodsfm.jpg";
                    }
                    else if (fileName.IndexOf("png") >= 0)
                    {
                        mfileName = UserName + "_" + GoodsId + "_goodsfm.png";
                    }
                    else
                    {
                        return Json("false");
                    }
                    sql = "update Goods set GoodsFMImgPath=N'/Img/GoodsFMImg/" + mfileName + "' where GoodsId=" + GoodsId + "and ShopId=(select ShopId from Shop where UserName='" + UserName + "')";
                }
                var filePath = Server.MapPath(string.Format("~/Img/GoodsFMImg", "File"));
                file.SaveAs(Path.Combine(filePath, mfileName));
                var result = helper.ExecuteCommand(sql);
                return Json(result);
            }
            catch (Exception ex)
            {
                return Json("false");
            }

        }
    
        [HttpPost]
        public JsonResult UploadAPK(HttpPostedFileBase file, string UserName)
        {
            try
            {
                var fileName = file.FileName.ToLower();
                string mfileName = "";
                if (fileName.IndexOf("jpg") >= 0)
                {
                    mfileName = UserName + "_shopfm.jpg";
                }
                else if (fileName.IndexOf("png") >= 0)
                {
                    mfileName = UserName + "_shopfm.png";
                }
                else
                {
                    return Json("false");
                }
                var filePath = Server.MapPath(string.Format("~/Img/FM", "File"));
                file.SaveAs(Path.Combine(filePath, mfileName));
                return Json("true");
            }
            catch (Exception ex)
            {
                return Json("false");
            }

        }

        //首先清空商家推广图数据
        public JsonResult ClearShopTGImg(string UserName)
        {
            //清除已上傳的推廣圖片

            sql = "select ShopTGImgPath from Shop where UserName='" + UserName + "'";
            using (var reader = helper.ExecuteReader(sql))
            {
                if (reader.Read())
                {
                    if (reader["ShopTGImgPath"].ToString() != "*")
                    {
                        string[] TGArray = reader["ShopTGImgPath"].ToString().Split(',');
                        foreach (var temp in TGArray)
                        {
                            try
                            {
                                System.IO.File.Delete(Request.PhysicalApplicationPath + temp);
                            }
                            catch (Exception ex)
                            {

                            }
                        }
                    }
                }
            }
            bool result = helper.ExecuteCommand("update Shop set ShopTGImgPath='*' where UserName='" + UserName + "'");
            return Json(result);
        }

        //线程锁
        private static readonly object objLock = new object();
        //商家推广宣传图上传,多图上传，有几张图就进几次这个方法
        public JsonResult UploadShopTGImg(HttpPostedFileBase file, string UserName)
        {

            lock (objLock)
            {
                try
                {
                    var fileName = file.FileName;
                    string mfileName = "";
                    if (fileName.IndexOf("jpg") >= 0 || fileName.IndexOf("JPG") >= 0)
                    {
                        mfileName = (UserName + "_shoptg" + string.Format("{0:yyyyMMddHHmmssffff}", DateTime.Now) + ".jpg").Trim();
                        var filePath = Server.MapPath(string.Format("~/Img/TG", "File"));
                        file.SaveAs(Path.Combine(filePath, mfileName));

                        string sql = "update Shop set ShopTGImgPath=ShopTGImgPath+',/Img/TG/" + mfileName + "' where UserName='" + UserName + "'";
                        bool result = helper.ExecuteCommand(sql);
                        if (result == false)
                        {
                            return Json("false");
                        }
                        else
                        {
                            return Json("true");
                        }
                    }
                    else if (fileName.IndexOf("png") >= 0 || fileName.IndexOf("PNG") >= 0)
                    {
                        mfileName = (UserName + "_shoptg" + string.Format("{0:yyyyMMddHHmmssffff}", DateTime.Now) + ".png").Trim();
                        var filePath = Server.MapPath(string.Format("~/Img/TG", "File"));
                        file.SaveAs(Path.Combine(filePath, mfileName));
                        string sql = "update Shop set ShopTGImgPath=ShopTGImgPath+',/Img/TG/" + mfileName + "' where UserName=" + UserName;
                        bool result = helper.ExecuteCommand(sql);
                        if (result == false)
                        {
                            return Json("false");
                        }
                        else
                        {
                            return Json("true");
                        }
                    }
                    else
                    {
                        return Json("false");
                    }
                }
                catch (Exception ex)
                {
                    return Json("false");
                }
            }
        }

        //商家是否已注册判断
        public JsonResult CheckRegShop(string UserName)
        {
            string sql = "";
            sql = "select * from Shop where UserName='" + UserName + "'";
            using (var reader = helper.ExecuteReader(sql))
            {
                if (reader.Read())
                {
                    return Json(true);
                }
                else
                {
                    return Json(false);
                }
            }
        }

        //商家注册
        [UserAuthorize]
        public JsonResult RegisterShop(string UserName, string ShopName, string ShopContact, string ShopPhone, string StartTime, string EndTime, string MinPrice, string MaxPrice, string ShopAddress, string ShopDAddress, string ShopIntroduce)
        {

            string sql = "";
            sql = "select * from Shop where ShopName=N'" + ShopName + "'";
            var shops = helper.ExecuteReader(sql);
            if (shops.Read())
            {
                return Json("ShopName_Already");
            }
            else
            {
                sql = "insert into Shop (UserName,ShopName,ShopContact,ShopPhone,StartTime,EndTime,MinPrice,MaxPrice,ShopAddress,ShopDAddress,ShopIntroduce,HotState,ShopFMImgPath,ShopTGImgPath,CreateDate) values" +
                "('" + UserName + "',N'" + ShopName + "',N'" + ShopContact + "','" + ShopPhone + "','" + StartTime + "','" + EndTime + "'," + MinPrice + "," + MaxPrice + ",N'" + ShopAddress + "',N'" + ShopDAddress + "',N'" + ShopIntroduce + "',0,N'/Img/DefaultImg/DFMImg.jpg','*',N'" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "')";
                bool result = helper.ExecuteCommand(sql);
                if (result)
                {
                    sql = "update [LMJ_User] set BusinessState=1";
                    result = helper.ExecuteCommand(sql);
                    return Json(result);
                }
                else
                {
                    return Json(result);
                }
            }
        }

        //修改商家信息
        public JsonResult ModifyShopInfo(string UserName, string ShopName, string ShopContact, string ShopPhone, string StartTime, string EndTime, string MinPrice, string MaxPrice, string ShopAddress, string ShopDAddress, string ShopIntroduce)
        {

            string sql = "";
            sql = "update Shop set ShopName=N'" + ShopName + "', ShopContact=N'" + ShopContact + "' ,ShopPhone='" + ShopPhone + "' ,StartTime='" + StartTime
    + "' ,EndTime='" + EndTime + "' ,MinPrice=" + int.Parse(MinPrice) + " ,MaxPrice=" + int.Parse(MaxPrice) + " ,ShopAddress=N'" + ShopAddress
    + "' ,ShopDAddress=N'" + ShopDAddress + "' ,ShopIntroduce=N'" + ShopIntroduce + "' where UserName='" + UserName + "'";
            bool result = helper.ExecuteCommand(sql);
            return Json(result);

        }

        //获取特定商家的信息
        public JsonResult ReadShopInfo(int ShopId)
        {
            Shop shop = new Shop();
            string sql = "select * from Shop where ShopId='" + ShopId + "'";
            using (var reader = helper.ExecuteReader(sql))
            {
                if (reader.Read())
                {
                    shop.ShopId = int.Parse(reader["ShopId"].ToString());
                    shop.HotState = int.Parse(reader["HotState"].ToString());
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
                    return Json(shop);
                }
                else
                {
                    return Json(false);
                }
            }
        }

        //通过用户名获取商家信息
        public JsonResult ReadShopInfoByUN(string UserName)
        {

            Shop shop = new Shop();
            string sql = "select * from Shop where UserName='" + UserName + "'";
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
                    return Json(shop);

                }
                else
                {
                    return Json(false);
                }
            }
        }

        //获取所有的商家
        public JsonResult GetAllShop()
        {
            List<Shop> shopList = new List<Shop>();
            string sql = "select * from Shop Order by CreateDate DESC";
            using (var reader = helper.ExecuteReader(sql))
            {
                try
                {
                    while (reader.Read())
                    {
                        Shop shop = new Shop();
                        shop.ShopId = int.Parse(reader["ShopId"].ToString());
                        shop.ShopName = reader["ShopName"].ToString();
                        shop.UserName = reader["UserName"].ToString();
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
                        shopList.Add(shop);

                    }
                    return Json(shopList);
                }
                catch (Exception ex)
                {
                    return Json(shopList);
                }
            }
        }

        //获取所有的热门商家
        public JsonResult GetAllHotShop()
        {
            List<Shop> shopList = new List<Shop>();
            string sql = "select * from Shop where HotState=1 Order by ConcernNum DESC";
            using (var reader = helper.ExecuteReader(sql))
            {
                try
                {
                    while (reader.Read())
                    {
                        Shop shop = new Shop();
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
                        shopList.Add(shop);

                    }
                    return Json(shopList);
                }
                catch (Exception ex)
                {
                    return Json(shopList);
                }
            }
        }

        //收藏商鋪
        public JsonResult CollectShop(string UserName, int ShopId)
        {
            //先判斷是否已經收藏

            string sql = "";

            sql = "select * from ShopCollect where UserId=(select UserId from [LMJ_User] where UserName='" + UserName + "') and ShopId=" + ShopId;
            var reader = helper.ExecuteReader(sql);
            if (reader.Read())
            {
                return Json(false);
            }
            else
            {
                //開始收藏
                sql = "insert into ShopCollect (UserId,ShopId,CreateDate) values ((select UserId from [LMJ_User] where UserName='" + UserName + "')," + ShopId + ",'" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "')";
                helper.ExecuteCommand(sql);
                sql = "update Shop Set ConcernNum=ConcernNum+1 where ShopId=" + ShopId;
                helper.ExecuteCommand(sql);
                return Json(true);
            }
        }

        //取消收藏店铺
        public string RemoveShopCollect(string UserName, int ShopId)
        {

            try
            {
                string sql = "";

                sql = "delete from ShopCollect where UserId=(select UserId from [LMJ_User] where UserName='" + UserName + "') and ShopId=" + ShopId;
                helper.ExecuteCommand(sql);
                sql = "update Shop Set ConcernNum=ConcernNum-1 where ShopId=" + ShopId;
                helper.ExecuteCommand(sql);
                return ("true");
            }
            catch (Exception e)
            {
                return ("false");

            }
        }

        //获取用戶收藏的所有商店
        public JsonResult GetAllColShop(string UserName)
        {
            List<Shop> shopList = new List<Shop>();
            try
            {
                //先判斷是否已經收藏
                string sql = "";
                sql = "select * from Shop where ShopId in (select ShopId from ShopCollect where UserId=(select UserId from [LMJ_User] where UserName='" + UserName + "')) order by ConcernNum DESC";
                using (var reader = helper.ExecuteReader(sql))
                {
                    while (reader.Read())
                    {
                        Shop temp = new Shop();
                        temp.ShopId = int.Parse(reader["ShopId"].ToString());
                        temp.ShopName = reader["ShopName"].ToString();
                        temp.ShopFMImgPath = reader["ShopFMImgPath"].ToString();
                        temp.ConcernNum = int.Parse(reader["ConcernNum"].ToString());
                        temp.ShopAddress = reader["ShopAddress"].ToString();
                        shopList.Add(temp);
                    }
                }
                return Json(shopList);
            }
            catch (Exception ex)
            {
                return Json(shopList);
            }

        }

        //获取用戶收藏的商店_分页
        public JsonResult GetFYColShop(string UserName, int CurPage)
        {
            List<Shop> shopList = new List<Shop>();
            try
            {
                //先判斷是否有收藏的店铺
                if (CurPage == 1)
                {
                    sql = "select Top " + colShopPageSize + " * from ShopCollect as sc,Shop as s where sc.ShopId in (select ShopId from ShopCollect where UserId=(select UserId from [LMJ_User] where UserName='" + UserName + "')) and sc.ShopId=s.ShopId order by ConcernNum desc";
                }
                else
                {
                    sql = "select Top " + colShopPageSize + " * from ShopCollect as sc,Shop as s where ShopId in (select ShopId from ShopCollect where UserId=(select UserId from [LMJ_User] where UserName='" + UserName + "') and  ShopId not in (select  Top (" + ((CurPage - 1) * colShopPageSize) + ") ShopId from ShopCollect where UserId=(select UserId from [LMJ_User] where UserName='" + UserName + "')))  and sc.ShopId=s.ShopId order by ConcernNum desc";
                }
                using (var reader = helper.ExecuteReader(sql))
                {
                    while (reader.Read())
                    {
                        Shop temp = new Shop();
                        temp.ShopId = int.Parse(reader["ShopId"].ToString());
                        temp.ShopName = reader["ShopName"].ToString();
                        temp.ShopFMImgPath = reader["ShopFMImgPath"].ToString();
                        temp.ConcernNum = int.Parse(reader["ConcernNum"].ToString());
                        temp.ShopAddress = reader["ShopAddress"].ToString();
                        shopList.Add(temp);
                    }
                }
                return Json(shopList);

            }
            catch (Exception ex)
            {
                return Json(shopList);
            }

        }

        //获取用户收藏的商店的总数
        public int GetAllColShopCount(string UserName) {
            var count = 0;
            sql = "select count(*) as Count from ShopCollect where UserId=(select UserId from [LMJ_User] where UserName='" + UserName + "')";
            using (var reader = helper.ExecuteReader(sql)) {
                while (reader.Read()) {
                    count = int.Parse(reader["Count"].ToString());
                    break;
                }
            }
            return count;
        }

        //商店预约
        [UserAuthorize]
        public string ShopReservation(string UserName, string ShopId, string YYTime)
        {
            string sql = "";

            //sql="select * from ShopReservation where UserName='"+UserName+"' and ShopId="+ShopId+" and FinishStatus=0";
            //var reader = helper.ExecuteReader(sql);
            //if (reader.Read())
            //{
            //    return Json("false0");
            //}
            //else {
            sql = "select ShopId from Shop where UserName='" + UserName + "'";
            using (var reader = helper.ExecuteReader(sql))
            {
                while (reader.Read())
                {
                    if (reader["ShopId"].ToString() == ShopId)
                    {
                        return ("false");
                    }
                }
                sql = "insert into ShopReservation (UserId,ShopId,YYTime,CreateDate) values ((select UserId from [LMJ_User] where UserName='" + UserName + "')," + ShopId + ",'" + YYTime + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "')";
                try
                {
                    helper.ExecuteCommand(sql);
                }
                catch (Exception e)
                {
                    return ("false");
                }
                return ("true");
            }
            //}
        }

        //商家获取用户的预约信息
        public JsonResult GetUserYYInfo(string UserName)
        {
            string sql = "";
            List<UserReservation> UserReaList = new List<UserReservation>();
            try {
                sql = "select sr.Id,sr.ShopId,u.UserId,u.Name,u.Nick,sr.Admissibility,sr.FinishState,sr.CreateDate,sr.YYTime,u.MobilePhone from ShopReservation as sr,[LMJ_User] AS u where ShopId=(select distinct ShopId from Shop where UserName='" + UserName + "') and sr.FinishState=0 and sr.UserId!=(select UserId from [LMJ_User] where UserName='" + UserName + "') and sr.UserId=u.UserId order by sr.CreateDate desc";
                using (var reader = helper.ExecuteReader(sql))
                {
                    while (reader.Read())
                    {
                        UserReservation user = new UserReservation();
                        user.UserReservationId = int.Parse(reader["Id"].ToString());
                        user.ShopId = int.Parse(reader["ShopId"].ToString());
                        user.Name = reader["Name"].ToString();
                        user.Nick = reader["Nick"].ToString();
                        user.UserId = int.Parse(reader["UserId"].ToString());
                        user.MobilePhone = reader["MobilePhone"].ToString();
                        user.Admissibility = int.Parse(reader["Admissibility"].ToString());
                        user.FinishState = int.Parse(reader["FinishState"].ToString());
                        user.YYTime = reader["YYTime"].ToString();
                        user.CreateDate = reader["CreateDate"].ToString();
                        UserReaList.Add(user);
                    }
                }
                return Json(UserReaList);
            }
            catch {
                return Json(null);
            }
           
        }

        //商家获取已完成的用户的预约信息
        public JsonResult GetUserYYFinishInfo(string UserName)
        {
            try {
                string sql = "";
                List<UserReservation> UserReaList = new List<UserReservation>();
                sql = "select sr.Id,sr.ShopId,u.UserId,u.Name,u.MobilePhone,u.Nick,sr.Admissibility,sr.FinishState,sr.CreateDate,sr.YYTime,sr.PayDate from ShopReservation as sr,[LMJ_User] AS u where ShopId=(select distinct ShopId from Shop where UserName='" + UserName + "') and sr.FinishState=1 and sr.UserId!=(select UserId from [LMJ_User] where UserName='" + UserName + "') and sr.UserId=u.UserId order by sr.PayDate desc";
                using (var reader = helper.ExecuteReader(sql))
                {
                    while (reader.Read())
                    {
                        UserReservation user = new UserReservation();
                        user.UserReservationId = int.Parse(reader["Id"].ToString());
                        user.ShopId = int.Parse(reader["ShopId"].ToString());
                        user.Name = reader["Name"].ToString();
                        user.Nick = reader["Nick"].ToString();
                        user.UserId = int.Parse(reader["UserId"].ToString());
                        user.MobilePhone = reader["MobilePhone"].ToString();
                        user.Admissibility = int.Parse(reader["Admissibility"].ToString());
                        user.FinishState = int.Parse(reader["FinishState"].ToString());
                        user.YYTime = reader["YYTime"].ToString();
                        user.CreateDate = reader["CreateDate"].ToString();
                        user.PayDate = reader["PayDate"].ToString();
                        UserReaList.Add(user);
                    }
                }
                return Json(UserReaList);
            }
            catch {
                return Json(null);
            }
        }

        //确认受理
        public string SureSL(int UserReservationId, int State)
        {
            DBHelper dbhelper = new DBHelper();
            sql = "update ShopReservation set Admissibility=" + State + " where Id=" + UserReservationId;
            if (dbhelper.ExecuteCommand(sql))
            {
                return ("true");
            }
            else
            {
                return ("false");
            }
        }

        //获取当前商家的评论信息
        public JsonResult GetShopCommentById(int ShopId)
        {
            List<Evaluate> commentList = new List<Evaluate>();
            sql = "select * from ShopReservation where ShopId=" + ShopId + " and EvaluateState=1";
            using (var reader = helper.ExecuteReader(sql)) {
                while (reader.Read()) {
                    string sql2 = "";
                    Evaluate comment = new Evaluate();
                    comment.EvaluateStars = double.Parse(reader["EvaluateStars"].ToString());
                    comment.EvaluateDate = reader["EvaluateDate"].ToString();
                    comment.EvaluateContent = reader["EvaluateContent"].ToString();
                    comment.UserId = int.Parse(reader["UserId"].ToString());
                    sql2 = "select top 1 * from [LMJ_User] where UserId=" + int.Parse(reader["UserId"].ToString());
                    using (var reader2 = helper.ExecuteReader(sql2))
                    {
                        while (reader2.Read()) {
                            comment.UserNickName = reader2["Nick"].ToString();
                            comment.UserHeadImgPath = reader2["HeadImgPath"].ToString();
                            break;
                        }
                      
                    }
                    commentList.Add(comment);
                }
                return Json(commentList);
            }
        }

        //通过UserName_分页_获取商家的商品
        public JsonResult GetMyGoodsByUserNameAndFY(string UserName,int CurryPage)
        {
            List<Goods> goodsList = new List<Goods>();
            if (CurryPage == 1)
            {
                sql = "select top(" + myGoodsPageSize + ") * from Goods where ShopId=(select ShopId from Shop where UserName='" + UserName + "') order by CreateDate desc";

            }
            else
            {
                sql = "select top(" + myGoodsPageSize + ") * from Goods where ShopId=(select ShopId from Shop where UserName='" + UserName + "') and GoodsId not in (select top(" + ((CurryPage - 1) * myGoodsPageSize) + ") GoodsId from Goods where ShopId=(select ShopId from Shop where UserName='" + UserName + "')order by CreateDate desc) order by CreateDate desc";
            }
            using (var reader = helper.ExecuteReader(sql))
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
                    goodsList.Add(goods);
                }
            }
            return Json(goodsList);
        }

        //通过UserName获取商家的所有商品总数
        public int GetMyGoodsCount(string UserName)
        {
            var count = 0;
            sql = "select count(*) as Count from Goods where ShopId=(select ShopId from Shop where UserName='" + UserName + "')";
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

        //删除商品
        public JsonResult DeleteMyGoods(int GoodsId)
        {
            try {
                sql = "delete from Goods where GoodsId=" + GoodsId;
                var result = helper.ExecuteCommand(sql);
                return Json(result);
            }
            catch {
                return Json(null);
            }
        }

        //修改商品信息
        public JsonResult ModifyGoodsInfoByUserName(int GoodsId, string UserName,List<string> GoodsInfo) {
            try {
                sql = "update Goods set GoodsName=N'" + GoodsInfo[0] + "',CategoryId=" + GoodsInfo[1] + ",GoodsPrice=" + GoodsInfo[2] + ",GoodsIntroduce=N'" + GoodsInfo[3] + "' where GoodsId="+GoodsId+" and ShopId=(select ShopId from Shop where UserName='"+UserName+"')";
                var result = helper.ExecuteCommand(sql);
                return Json(result);
            }
            catch {
                return Json(null);
            }
        }
        #endregion
    }
}