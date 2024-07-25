using CPMA.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CPMA.Controllers
{
    public class AdminController : Controller
    {
        //全局變量
        public DBHelper helper = new DBHelper();
        public string sql = "";

        //管理员后台主界面
        [AdminAuthorize]
        public ActionResult AdminIndex()
        {
            //獲取用戶列表
            List<User> UserList = new List<User>();
            string sql = "select * from [LMJ_User] where Status !=1";
            try
            {
                using (SqlDataReader reader = helper.ExecuteReader(sql))
                {
                    while (reader.Read())
                    {
                        User user = new User();
                        user.UserName = reader["UserName"].ToString();
                        UserList.Add(user);
                    }
                }
            }
            catch (Exception e)
            {
                return View();
            }
            ViewBag.UserList = UserList;
            return View();

        }

        //管理员账号校验
        public JsonResult AdminValidate(string UserName, string Password, int Status)
        {
            User user = new User();
            try
            {
                string sql = "select * from [LMJ_User] where UserName='" + UserName + "' and Password='" + Password + "' and Status='" + Status + "'";
                using (SqlDataReader reader = helper.ExecuteReader(sql))
                {
                    //dr对象读取数据集
                    if (reader.Read())
                    {
                        user.Nick = reader["Nick"].ToString();
                        user.UserName = reader["UserName"].ToString();
                        user.Sex = reader["Sex"].ToString();
                        user.Age = int.Parse(reader["Age"].ToString());
                        if (reader["HeadImgPath"].ToString() != null || reader["HeadImgPath"].ToString() != "")
                        {
                            user.HeadImgPath = reader["HeadImgPath"].ToString();
                        }
                        user.ValidateState = true;
                        //过滤器
                        HttpContextBase context = this.HttpContext;
                        context.Session.Add("AdminValidateState", "true");
                        //有效时间3个钟
                        context.Session.Timeout = 180;
                    }
                    else
                    {
                        //Response.Write("<script>alert(\"登录失败！\");location=\"Login.aspx\"</script>");
                        user.ValidateState = true;
                    }
                    JsonResult result = Json(user, JsonRequestBehavior.AllowGet);
                    return result;
                }
            }
            catch (Exception e)
            {
                return Json(null);
            }
        }

        //密码修改
        [AdminAuthorize]
        public JsonResult ChangeAdminPwd(string NewPassword) { 
            sql="update [LMJ_User] set Password='"+NewPassword+"' where UserName='admin'";
            var result=helper.ExecuteCommand(sql);
            return Json(result);
        }

        //退出
        [AdminAuthorize]
        public JsonResult AdminLogOut() {
            HttpContextBase context = this.HttpContext;
            context.Session.Clear();
            return Json(true);
        }

        #region 用户管理
        //获取所有的用户
        public JsonResult GetAllUser()
        {
            try
            {
                List<User> UserList = new List<User>();
                string sql = "select * from [LMJ_User] where Status !=1 order by UserId desc";
                using (SqlDataReader reader = helper.ExecuteReader(sql))
                {
                    while (reader.Read())
                    {
                        User user = new User();
                        user.UserName = reader["UserName"].ToString();
                        user.Nick = reader["Nick"].ToString();
                        user.Name = reader["Name"].ToString();
                        user.IDCard = reader["IDCard"].ToString();
                        user.Sex = reader["Sex"].ToString();
                        user.BirthDay = reader["BirthDay"].ToString();
                        user.Age = int.Parse(reader["Age"].ToString());
                        user.MobilePhone = reader["MobilePhone"].ToString();
                        user.Email = reader["Email"].ToString();
                        user.Address = reader["Address"].ToString();
                        user.Money = int.Parse(reader["Money"].ToString());
                        user.LoginTime = reader["LoginTime"].ToString();
                        user.State = reader["State"].ToString();
                        user.BusinessState = int.Parse(reader["BusinessState"].ToString());
                        user.LoginState = reader["LoginState"].ToString();
                        user.CreateTime = reader["CreateTime"].ToString();
                        UserList.Add(user);
                    }
                }
                return Json(UserList);

            }
            catch (Exception e)
            {
                return Json(null);
            }

        }

        //删除特定的用户并包括所有的数据
        public JsonResult DeleteUser(string UserName)
        {

            try
            {
                bool result = false;

                sql = "delete from Goods where ShopId=(select ShopId from Shop where UserName='" + UserName + "')";
                result = helper.ExecuteCommand(sql);

                sql = "delete from GoodsCollect where UserId=(select UserId from [LMJ_User] where UserName='" + UserName + "')";
                result = helper.ExecuteCommand(sql);

                sql = "delete from ShopCollect where UserId=(select UserId from [LMJ_User] where UserName='" + UserName + "')";
                result = helper.ExecuteCommand(sql);

                sql = "delete from Shop where UserName='" + UserName + "'";
                result = helper.ExecuteCommand(sql);

                sql = "delete from ShopReservation where UserId=(select UserId from [LMJ_User] where UserName='" + UserName + "')";
                result = helper.ExecuteCommand(sql);

                sql = "delete from [LMJ_User] where UserName='" + UserName + "'";
                result = helper.ExecuteCommand(sql);

                return Json(result.ToString().ToLower());
            }
            catch (Exception e)
            {
                return Json(null);
            }
        }

        //冻结用户
        public JsonResult FreezeUser(string UserName, string State)
        {

            try
            {
                string sql = "update [LMJ_User] set State='" + State + "' where UserName='" + UserName + "'";
                var result = helper.ExecuteCommand(sql);
                return Json(result.ToString().ToLower());
            }
            catch (Exception e)
            {
                return Json(null);
            }
        }

        //修改用户信息
        public JsonResult ModifyUserInfos(string UserName, string Nick, string RealName, string IDCard, string MobilePhone, string BirthDay, string Address, string Money, string Sex, string Email, string BusinessState)
        {
            string result = "true";
            try
            {


                User user = new User();
                string sql = "update [LMJ_User] set Nick=N'" + Nick + "',Name=N'" + RealName + "',IDCard='" + IDCard + "',MobilePhone='" + MobilePhone + "',BirthDay='" + BirthDay + "',Money=" + int.Parse(Money) + ",Sex=N'" + Sex + "',Address=N'" + Address + "',Email=N'" + Email + "',BusinessState=" + int.Parse(BusinessState) + " where UserName='" + UserName + "'";
                result = helper.ExecuteCommand(sql).ToString().ToLower();
            }
            catch (Exception e)
            {
                return Json(null);
            }
            return Json(result);
        }
        #endregion

        #region 商店管理
        //删除指定的商店
        public string DeleteShop(string UserName)
        {
            bool result = false;
            try
            {
                try
                {
                    sql = "delete from Goods where ShopId=(select ShopId from Shop where UserName='" + UserName + "')";
                    result = helper.ExecuteCommand(sql);
                }
                catch
                {

                }
                try
                {
                    sql = "delete from GoodsCollect where UserId=(select UserId from [LMJ_User] where UserName='" + UserName + "')";
                    result = helper.ExecuteCommand(sql);
                }
                catch
                {

                }
                try
                {
                    sql = "delete from ShopReservation where ShopId=(select ShopId from Shop where UserName='" + UserName + "')";
                    result = helper.ExecuteCommand(sql);
                }
                catch
                {

                }

                try
                {
                    sql = "delete from ShopCollect where ShopId=(select ShopId from Shop where UserName='" + UserName + "')";
                    result = helper.ExecuteCommand(sql);
                }
                catch
                {

                }

                try
                {
                    sql = "delete from Shop where UserName='" + UserName + "'";
                    result = helper.ExecuteCommand(sql);
                }
                catch
                {

                }
                return (result.ToString().ToLower());
            }
            catch (Exception e)
            {
                return null;
            }
        }

        //修改商店信息
        public JsonResult ModifyShopInfo(string ShopId, string ShopName, string ShopContact, string ShopPhone, string MinPrice, string MaxPrice, string ShopAddress, string ShopDAddress, string ShopIntroduce, string HotState)
        {
            try
            {
                sql = "update Shop set ShopName=N'" + ShopName
                    + "', ShopContact=N'" + ShopContact
                    + "' ,ShopPhone='" + ShopPhone + "',MinPrice=" + int.Parse(MinPrice)
                    + " ,MaxPrice=" + int.Parse(MaxPrice)
                    + " ,ShopAddress=N'" + ShopAddress
                    + "' ,ShopDAddress=N'" + ShopDAddress
                    + "' ,ShopIntroduce=N'" + ShopIntroduce
                    + "',HotState=" + int.Parse(HotState)
                    + " where ShopId='" + int.Parse(ShopId) + "'";
                var result = helper.ExecuteCommand(sql);
                return Json(result);
            }
            catch (Exception e)
            {
                return Json(null);
            }
        }

        //修改商店的激活状态
        public JsonResult ModifyShopHotState(int ShopId, int HotState)
        {
            try
            {
                sql = "update Shop set HotState=" + HotState + " where ShopId=" + ShopId;
                var result = helper.ExecuteCommand(sql);
                return Json(result);
            }
            catch (Exception e)
            {
                return (null);
            }
        }
        #endregion

        #region 客户的预约信息管理
        //获取所有客户的预约信息
        public JsonResult GetAllWDYYInfo()
        {
            try
            {

                List<ShopReservation> ShopReaList = new List<ShopReservation>();
                sql = "select * from ShopReservation as sr full join Shop as s on sr.ShopId=s.ShopId where sr.ShopId is not null and ShopName is not null order by sr.CreateDate desc";
                using (var reader = helper.ExecuteReader(sql))
                {
                    while (reader.Read())
                    {
                        ShopReservation sr = new ShopReservation();
                        sr.ShopReservationId = int.Parse(reader["Id"].ToString());
                        sr.ShopId = int.Parse(reader["ShopId"].ToString());
                        sr.ShopName = reader["ShopName"].ToString();
                        sr.ShopContact = reader["ShopContact"].ToString();
                        sr.ShopPhone = reader["ShopPhone"].ToString();
                        sr.ShopDAddress = reader["ShopDAddress"].ToString();
                        sr.Admissibility = int.Parse(reader["Admissibility"].ToString());
                        sr.FinishState = int.Parse(reader["FinishState"].ToString());
                        //sr.StartTime = reader["StartTime"].ToString();
                        //sr.EndTime = reader["EndTime"].ToString();
                        sr.Time = reader["StartTime"].ToString() + "-" + reader["EndTime"].ToString();
                        sr.YYTime = reader["YYTime"].ToString();
                        sr.CreateDate = reader["CreateDate"].ToString();
                        sr.EvaluateState = int.Parse(reader["EvaluateState"].ToString());
                        sr.EvaluateStars = double.Parse(reader["EvaluateStars"].ToString());
                        sr.EvaluateContent = reader["EvaluateContent"].ToString();
                        ShopReaList.Add(sr);
                    }
                }
                return Json(ShopReaList);
            }
            catch (Exception e)
            {
                return Json(null);
            }
        }

        //获取所有客户的预约信息_已完成或未完成
        public JsonResult GetAllWDYYInfo_IsFinish(int FinishState)
        {
            try
            {

                List<ShopReservation> ShopReaList = new List<ShopReservation>();
                sql = "select * from ShopReservation as sr full join Shop as s on sr.ShopId=s.ShopId where sr.ShopId is not null and ShopName is not null and FinishState=" + FinishState + " order by sr.CreateDate desc";
                using (var reader = helper.ExecuteReader(sql))
                {
                    while (reader.Read())
                    {
                        ShopReservation sr = new ShopReservation();
                        sr.ShopReservationId = int.Parse(reader["Id"].ToString());
                        sr.ShopId = int.Parse(reader["ShopId"].ToString());
                        sr.ShopName = reader["ShopName"].ToString();
                        sr.ShopContact = reader["ShopContact"].ToString();
                        sr.ShopPhone = reader["ShopPhone"].ToString();
                        sr.ShopDAddress = reader["ShopDAddress"].ToString();
                        sr.Admissibility = int.Parse(reader["Admissibility"].ToString());
                        sr.FinishState = int.Parse(reader["FinishState"].ToString());
                        //sr.StartTime = reader["StartTime"].ToString();
                        //sr.EndTime = reader["EndTime"].ToString();
                        sr.Time = reader["StartTime"].ToString() + "-" + reader["EndTime"].ToString();
                        sr.YYTime = reader["YYTime"].ToString();
                        sr.CreateDate = reader["CreateDate"].ToString();
                        sr.EvaluateState = int.Parse(reader["EvaluateState"].ToString());
                        sr.EvaluateStars = double.Parse(reader["EvaluateStars"].ToString());
                        sr.EvaluateContent = reader["EvaluateContent"].ToString();
                        ShopReaList.Add(sr);
                    }
                }
                return Json(ShopReaList);
            }
            catch (Exception e)
            {
                return Json(null);
            }
        }
        #endregion

        #region 商店的预约信息管理
        //获取所有商家的用户的预约信息
        public JsonResult GetAllUserYYInfo()
        {
            try
            {

                List<UserReservation> UserReaList = new List<UserReservation>();
                sql = "select sr.Id,sr.ShopId,u.UserId,u.Name,u.Nick,sr.Admissibility,sr.FinishState,sr.CreateDate,sr.YYTime,u.MobilePhone from ShopReservation as sr,[LMJ_User] AS u where sr.UserId=u.UserId order by sr.CreateDate desc";
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
            catch (Exception e)
            {
                return Json(null);
            }
        }

        //获取所有商家的已完成(已支付)的用户的预约信息
        public JsonResult GeAlltUserYY_FinishInfo()
        {
            try
            {

                List<UserReservation> UserReaList = new List<UserReservation>();
                sql = "select sr.Id,sr.ShopId,u.UserId,u.Name,u.Nick,sr.Admissibility,sr.FinishState,sr.CreateDate,sr.YYTime,sr.PayDate,u.MobilePhone from ShopReservation as sr,[LMJ_User] AS u where sr.UserId=u.UserId and sr.FinishState=1";
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
            catch (Exception e)
            {
                return Json(null);
            }

        }

        //获取所有商家的未完成(未支付)的用户的预约信息
        public JsonResult GeAlltUserYY_NotFinishInfo()
        {
            try
            {

                List<UserReservation> UserReaList = new List<UserReservation>();
                sql = "select sr.Id,sr.ShopId,u.UserId,u.Name,u.Nick,sr.Admissibility,sr.FinishState,sr.CreateDate,sr.YYTime,sr.PayDate,u.MobilePhone from ShopReservation as sr,[LMJ_User] AS u where sr.UserId=u.UserId and sr.FinishState=0";
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
            catch (Exception e)
            {
                return Json(null);
            }
        }
        #endregion

        //刪除预约信息 
        public JsonResult DeleteRes(int Id)
        {
            try
            {
                sql = "delete from ShopReservation where Id=" + Id;
                var result = helper.ExecuteCommand(sql);
                return Json(result);
            }
            catch (Exception e)
            {
                return Json(null);
            }
        }

        //确认支付
        [HttpPost]
        public string SurePay(int ShopReservationId)
        {
            try
            {
                DBHelper dbhelper = new DBHelper();
                sql = "update ShopReservation set FinishState=1,PayDate=N'" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where Id=" + ShopReservationId;
                var result = dbhelper.ExecuteCommand(sql);
                if (result)
                {
                    return "true";
                }
                else
                {
                    return "false";
                }
            }
            catch (Exception e)
            {
                return (null);
            }
        }

        #region 公告管理
        //获取所有的公告
        public JsonResult GetAllNotice()
        {

            List<Notice> NoticeList = new List<Notice>();
            try
            {

                sql = "select * from Notice order by CreateDate desc";
                using (var reader = helper.ExecuteReader(sql))
                {
                    while (reader.Read())
                    {
                        Notice Notice = new Notice();
                        Notice.NoticeId = int.Parse(reader["NoticeId"].ToString());
                        Notice.NoticeTitle = reader["NoticeTitle"].ToString();
                        Notice.NoticeIntro = reader["NoticeIntro"].ToString();
                        Notice.NoticeContent = reader["NoticeContent"].ToString();
                        Notice.Status = int.Parse(reader["Status"].ToString());
                        Notice.CreateDate = reader["CreateDate"].ToString();
                        NoticeList.Add(Notice);
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("查询失败！");
                return Json(null);
            }
            return Json(NoticeList);
        }

        //修改公告的激活状态
        public JsonResult ModifyNoticeStatus(int NoticeId, int Status)
        {
            try
            {
                sql = "update Notice set Status=" + Status + " where NoticeId=" + NoticeId;
                var result = helper.ExecuteCommand(sql);
                return Json(result);
            }
            catch (Exception e)
            {
                return (null);
            }
        }

        //删除公告
        public string DeleteNotice(int NoticeId)
        {
            try
            {


                sql = "delete from Notice where NoticeId=" + NoticeId;
                if (helper.ExecuteCommand(sql))
                {
                    return ("true");
                }
                else
                {
                    return ("false");
                }
            }
            catch (Exception e)
            {
                return (null);
            }
        }

        //获取指定公告的信息
        public JsonResult ReadNoticeInfoById(int NoticeId)
        {
            var helper = new DBHelper();
            Notice notice = new Notice();
            sql = "select * from Notice Where NoticeId=" + NoticeId;
            var reader = helper.ExecuteReader(sql);
            while (reader.Read())
            {
                notice.NoticeId = NoticeId;
                notice.NoticeTitle = reader["NoticeTitle"].ToString();
                notice.NoticeIntro = reader["NoticeIntro"].ToString();
                notice.NoticeContent = reader["NoticeContent"].ToString();
                notice.Status = int.Parse(reader["Status"].ToString());
                notice.CreateDate = reader["CreateDate"].ToString();
            }
            return Json(notice);
        }

        //更新公告信息
        public string ModifyNoticeInfo(int NoticeId, string NoticeTitle, string NoticeIntro, string NoticeContent)
        {
            sql = "update Notice set NoticeTitle=N'" + NoticeTitle + "',NoticeIntro=N'" + NoticeIntro + "',NoticeContent=N'" + NoticeContent + "' where NoticeId=" + NoticeId;
            var result = helper.ExecuteCommand(sql);
            if (result)
            {
                return "true";
            }
            else
            {
                return "false";
            }
        }

        //添加公告信息
        public string AddNoticeInfo(string NoticeTitle, string NoticeIntro, string NoticeContent, int Status)
        {
            sql = "insert into Notice (NoticeTitle,NoticeIntro,NoticeContent,Status,CreateDate) values (N'" + NoticeTitle + "',N'" + NoticeIntro + "',N'" + NoticeContent + "'," + Status + ",N'" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "')";
            var result = helper.ExecuteCommand(sql);
            if (result)
            {
                return "true";
            }
            else
            {
                return "false";
            }
        }
        #endregion

        #region 商店收藏管理
        //获取所有收藏的商店信息
        public JsonResult GetAllColShop()
        {
            List<ShopCollect> SCList = new List<ShopCollect>();
            sql = "select sc.CollectId,sc.ShopId,sc.UserId,s.ShopName,s.ConcernNum,sc.CreateDate from ShopCollect as sc,Shop as s where sc.ShopId=s.ShopId order by s.ConcernNum desc";
            using (var reader = helper.ExecuteReader(sql))
            {
                while (reader.Read())
                {
                    ShopCollect shopCollect = new ShopCollect();
                    shopCollect.ShopColId = int.Parse(reader["CollectId"].ToString());
                    shopCollect.ShopId = int.Parse(reader["ShopId"].ToString());
                    shopCollect.UserId = int.Parse(reader["UserId"].ToString());
                    shopCollect.ShopName = reader["ShopName"].ToString();
                    shopCollect.CollectNum = int.Parse(reader["ConcernNum"].ToString());
                    shopCollect.CreateDate = reader["CreateDate"].ToString();
                    SCList.Add(shopCollect);
                }
            }
            return Json(SCList);

        }

        //删除收藏的商店
        public string DeleteShopCol(int ShopColId)
        {
            try
            {
                sql = "delete from ShopCollect where CollectId=" + ShopColId;
                var result = helper.ExecuteCommand(sql);
                if (result)
                {
                    return "true";
                }
                else
                {
                    return "false";
                }
            }
            catch
            {
                return "false";
            }
        }

        //添加商店收藏
        public JsonResult AddShopCol(int ShopId, int UserId)
        {
            try
            {
                bool userState = false;
                bool shopState = false;

                sql = "select * from [LMJ_User] where UserId=" + UserId;
                using (var reader = helper.ExecuteReader(sql))
                {
                    while (reader.Read())
                    {
                        userState = true;
                        break;
                    }
                }
                sql = "select * from Shop where ShopId=" + ShopId;
                using (var reader = helper.ExecuteReader(sql))
                {
                    while (reader.Read())
                    {
                        shopState = true;
                        break;
                    }
                }
                if (userState && shopState)
                {
                    sql = "insert into ShopCollect (UserId,ShopId,CreateDate) values (" + UserId + "," + ShopId + ",N'" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "')";
                    var result = helper.ExecuteCommand(sql);
                    if (result)
                    {
                        return Json("true");
                    }
                    else
                    {
                        return Json("false");
                    }
                }
                else if (!userState)
                {
                    return Json("userIdIsNull");
                }
                else if (!shopState)
                {
                    return Json("shopIdIsNull");
                }
                else
                {
                    return Json("false");
                }
            }
            catch
            {
                return null;
            }
        }
        #endregion

        #region 商品收藏管理
        //获取所有的收藏的商品信息
        public JsonResult GetAllColGoods()
        {
            List<GoodsCollect> GCList = new List<GoodsCollect>();
            sql = "select gc.CollectId,gc.UserId,gc.GoodsId,gc.CreateDate,g.GoodsConcernNum,g.ShopId,g.GoodsName from GoodsCollect as gc,Goods as g where gc.GoodsId=g.GoodsId order by g.GoodsConcernNum desc";
            using (var reader = helper.ExecuteReader(sql))
            {
                while (reader.Read())
                {
                    GoodsCollect goodsCollect = new GoodsCollect();
                    goodsCollect.GoodsColId = int.Parse(reader["CollectId"].ToString());
                    goodsCollect.ShopId = int.Parse(reader["ShopId"].ToString());
                    goodsCollect.UserId = int.Parse(reader["UserId"].ToString());
                    goodsCollect.GoodsId = int.Parse(reader["GoodsId"].ToString());
                    goodsCollect.CollectNum = int.Parse(reader["GoodsConcernNum"].ToString());
                    goodsCollect.GoodsName = reader["GoodsName"].ToString();
                    goodsCollect.CreateDate = reader["CreateDate"].ToString();
                    GCList.Add(goodsCollect);
                }
            }
            return Json(GCList);

        }

        //删除收藏的商品
        public string DeleteColGoods(int GoodsColId)
        {
            try
            {
                sql = "delete from GoodsCollect where CollectId=" + GoodsColId;
                var result = helper.ExecuteCommand(sql);
                if (result)
                {
                    return "true";
                }
                else
                {
                    return "false";
                }
            }
            catch
            {
                return "false";
            }
        }

        //添加商品收藏
        public JsonResult AddGoodsCol(int UserId, int GoodsId)
        {
            try
            {
                bool userState = false;
                bool goodsState = false;
                sql = "select * from [LMJ_User] where UserId=" + UserId;
                using (var reader = helper.ExecuteReader(sql))
                {
                    while (reader.Read())
                    {
                        userState = true;
                        break;
                    }
                }

                sql = "select * from Goods where GoodsId=" + GoodsId;
                using (var reader = helper.ExecuteReader(sql))
                {
                    while (reader.Read())
                    {
                        goodsState = true;
                        break;
                    }
                }
                if (userState  && goodsState)
                {
                    sql = "insert into GoodsCollect (UserId,GoodsId,CreateDate) values (" + UserId +"," + GoodsId + ",N'" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "')";
                    var result = helper.ExecuteCommand(sql);
                    if (result)
                    {
                        return Json("true");
                    }
                    else
                    {
                        return Json("false");
                    }
                }
                else if (!userState)
                {
                    return Json("userIdIsNull");
                }
                else if (!goodsState)
                {
                    return Json("goodsIdIsNull");
                }
                else
                {
                    return Json("false");
                }
            }
            catch
            {
                return null;
            }
        }
        #endregion 

        #region 评论管理
        //读取
        public JsonResult GetAllEvaluate() {
            List<Evaluate> commentList = new List<Evaluate>();
            sql = "select * from ShopReservation where EvaluateState=1 order by Id desc";
            using (var reader = helper.ExecuteReader(sql)) {
                while (reader.Read()) {
                    Evaluate comment = new Evaluate();
                    comment.ShopResId = int.Parse(reader["Id"].ToString());
                    comment.UserId = int.Parse(reader["UserId"].ToString());
                    comment.ShopId = int.Parse(reader["ShopId"].ToString());
                    comment.EvaluateContent = reader["EvaluateContent"].ToString();
                    comment.EvaluateStars = double.Parse(reader["EvaluateStars"].ToString());
                    comment.EvaluateDate = reader["EvaluateDate"].ToString();
                    commentList.Add(comment);
                }
            }
            return Json(commentList);
        
        }
        //删除
        public JsonResult DeleteEvaluate(int Id) {
            try
            {
                sql = "update ShopReservation set EvaluateState=0,EvaluateStars=0,EvaluateContent='' where Id="+Id;
                var result = helper.ExecuteCommand(sql);
                return Json(result);
            }
            catch {
                return Json(null);
            }
          
        }
        #endregion

        #region 商品管理
        //读取商品集合
        public JsonResult GetListGoodsInfo()
        {
            List<Goods> goodsList = new List<Goods>();
            sql = "select * from Goods as g,GoodsCategory as gc where g.CategoryId=gc.CategoryId order by GoodsId desc";
            using (var reader = helper.ExecuteReader(sql))
            {
                while (reader.Read())
                {
                    Goods temp = new Goods();
                    temp.GoodsId = int.Parse(reader["GoodsId"].ToString());
                    temp.ShopId = int.Parse(reader["ShopId"].ToString());
                    temp.CategoryId = int.Parse(reader["CategoryId"].ToString());
                    temp.CategoryName =reader["CategoryName"].ToString();
                    temp.GoodsPrice = int.Parse(reader["GoodsPrice"].ToString());
                    if (string.IsNullOrEmpty(reader["GoodsMinPrice"].ToString()))
                    {
                        temp.GoodsMinPrice = 0;
                    }
                    else
                    {
                        temp.GoodsMinPrice = int.Parse(reader["GoodsMinPrice"].ToString());
                    }
                    temp.GoodsName = reader["GoodsName"].ToString();
                    temp.GoodsIntroduce = reader["GoodsIntroduce"].ToString();
                    temp.GoodsFMImgPath = reader["GoodsFMImgPath"].ToString();
                    temp.GoodsShowImgPath = reader["GoodsShowImgPath"].ToString();
                    temp.GoodsConcernNum = int.Parse(reader["GoodsConcernNum"].ToString());
                    temp.HotState = int.Parse(reader["HotState"].ToString());
                    temp.GoodsShowImgPath = reader["GoodsShowImgPath"].ToString();
                    temp.CreateDate = reader["CreateDate"].ToString();
                    goodsList.Add(temp);

                }
            }
            return Json(goodsList);
        }

        //读取
        public JsonResult ReadGoodsInfoById(int GoodsId)
        {
            Goods temp = new Goods();
            sql = "select * from Goods as g,GoodsCategory as gc where g.GoodsId=" + GoodsId +" and g.CategoryId=gc.CategoryId";
            using (var reader = helper.ExecuteReader(sql))
            {
                if (reader.Read())
                {
                    temp.GoodsId = int.Parse(reader["GoodsId"].ToString());
                    temp.ShopId = int.Parse(reader["ShopId"].ToString());
                    temp.CategoryId = int.Parse(reader["CategoryId"].ToString());
                    temp.CategoryName = reader["CategoryName"].ToString();
                    temp.GoodsPrice = int.Parse(reader["GoodsPrice"].ToString());
                    if (string.IsNullOrEmpty(reader["GoodsMinPrice"].ToString()))
                    {
                        temp.GoodsMinPrice = 0;
                    }
                    else
                    {
                        temp.GoodsMinPrice = int.Parse(reader["GoodsMinPrice"].ToString());
                    }
                    temp.GoodsName = reader["GoodsName"].ToString();
                    temp.GoodsIntroduce = reader["GoodsIntroduce"].ToString();
                    temp.GoodsFMImgPath = reader["GoodsFMImgPath"].ToString();
                    temp.GoodsShowImgPath = reader["GoodsShowImgPath"].ToString();
                    temp.GoodsConcernNum = int.Parse(reader["GoodsConcernNum"].ToString());
                    temp.HotState = int.Parse(reader["HotState"].ToString());
                    temp.GoodsShowImgPath = reader["GoodsShowImgPath"].ToString();
                    temp.CreateDate = reader["CreateDate"].ToString();
                   
                }
            }
            return Json(temp);
        }

        //获取商品的數量
        public int GetGoodsCount()
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

        //添加商品
        public JsonResult AddGoods(List<string> Goods)
        {
            try
            {
                var goodsName = Goods[0];
                int shopId = int.Parse( Goods[1]);
                int categoryId = int.Parse(Goods[2]);
                var goodsPrice = int.Parse(Goods[3]);
                var goodsMinPrice = int.Parse(Goods[4]);
                var goodsIntroduce = Goods[5];
                var hotState = int.Parse(Goods[6]);
                sql = "insert into Goods (ShopId,CategoryId,GoodsName,GoodsPrice,GoodsMinPrice,GoodsIntroduce,HotState,CreateDate,GoodsFMImgPath) values (" + shopId + "," + categoryId + ",N'" + goodsName + "'," + goodsPrice + "," + goodsMinPrice + ",N'" + goodsIntroduce + "'," + hotState + ",'" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "',N'/Img/DefaultImg/GoodsFMImg.jpg')";
                var result = helper.ExecuteCommand(sql);
                return Json(result);
            }
            catch
            {
                return Json(null);
            }

        }

        //删除商品
        public JsonResult DeleteGoods(int GoodsId)
        {
            try
            {
                sql = "delete from Goods where GoodsId=" + GoodsId;
                var result = helper.ExecuteCommand(sql);
                return Json(result);
            }
            catch
            {
                return Json(null);
            }
        }

        //更新商品信息
        public JsonResult UpdateGoods(List<string> Goods)
        {
            try
            {
                var goodsId = Goods[0];
                var goodsName = Goods[1];
                int shopId = int.Parse(Goods[2]);
                int categoryId = int.Parse(Goods[3]);
                var goodsPrice = int.Parse(Goods[4]);
                var goodsMinPrice = int.Parse(Goods[5]);
                var goodsIntroduce = Goods[6];
                var hotState = int.Parse(Goods[7]);
                sql = "update Goods set GoodsName=N'" + goodsName + "',CategoryId=" + categoryId + ",GoodsPrice=" + goodsPrice + ",GoodsMinPrice=" + goodsMinPrice + ",GoodsIntroduce=N'" + goodsIntroduce + "',hotState=" + hotState + " where GoodsId=" + goodsId;
                var result = helper.ExecuteCommand(sql);
                return Json(result);
            }
            catch
            {
                return Json(null);
            }
        }

        //修改商品的激活状态
        public JsonResult ModifyGoodsHotState(int GoodsId, int HotState)
        {
            try
            {
                sql = "update Goods set HotState=" + HotState + " where GoodsId=" + GoodsId;
                var result=helper.ExecuteCommand(sql);
                return Json(result);
            }
            catch (Exception e)
            {
                return (null);
            }
        }
        #endregion

        #region 订单管理
        //评价视图
        public ActionResult OrderEvaluateModel(string OrderId)
        {
            ViewBag.OrderId = OrderId;
            return View();
        }

        //查询
        public JsonResult GetAllOrder() {
            try
            {
                List<Order> orderList = new List<Order>();
                sql = "select * from [CPMA_Db].[dbo].[Order] as o,Goods as g,Shop as s where o.GoodsId=g.GoodsId and o.ShopId=s.ShopId";
                var reader = helper.ExecuteReader(sql);
                while (reader.Read())
                {
                    var order = new Order();
                    order.OrderId = int.Parse(reader["OrderId"].ToString());
                    order.GoodsId = int.Parse(reader["GoodsId"].ToString());
                    order.UserId = int.Parse(reader["UserId"].ToString());
                    order.GoodsName = reader["GoodsName"].ToString();
                    order.GoodsPrice = reader["GoodsPrice"].ToString();
                    order.GoodsFMImgPath = reader["GoodsFMImgPath"].ToString();
                    order.ShopId = int.Parse(reader["ShopId"].ToString());
                    order.ShopName = reader["ShopName"].ToString();
                    if (string.IsNullOrEmpty(reader["ReceivingPerson"].ToString()))
                    {
                        order.ReceivingPerson = "";
                    }
                    else
                    {
                        order.ReceivingPerson = reader["ReceivingPerson"].ToString();
                    }
                    order.ReceivingAddress = reader["ReceivingAddress"].ToString();
                    order.Num = reader["Num"].ToString();
                    order.EvaluateContent = reader["EvaluateContent"].ToString();
                    order.EvaluateStars = double.Parse(reader["EvaluateStars"].ToString());
                    order.EvaluateState = int.Parse(reader["EvaluateState"].ToString());
                    order.ReceiptState = int.Parse(reader["ReceiptState"].ToString());
                    order.FinishState = int.Parse(reader["FinishState"].ToString());
                    order.CreateDate = reader["CreateDate"].ToString();
                    orderList.Add(order);
                }
                return Json(orderList);
            }
            catch
            {
                return Json(null);
            }
        }

        //刪除 
        public JsonResult DeleteOrder(int Id)
        {
            try
            {
                sql = "delete from [Order] where OrderId=" + Id;
                var result = helper.ExecuteCommand(sql);
                return Json(result);
            }
            catch (Exception e)
            {
                return Json(null);
            }
        }

        //订单评价
        public JsonResult ModifyOrderEvaluate(int OrderId, float EvaluateStars, string EvaluateContent)
        {
            try
            {
                sql = "update [Order] set EvaluateState=1,EvaluateStars=" + EvaluateStars + ",EvaluateContent=N'" + EvaluateContent + "' where OrderId=" + OrderId;
                var result = helper.ExecuteCommand(sql);
                return Json(result);
            }
            catch (Exception e)
            {
                return Json("EC");
            }
        }

        //收货处理
        public JsonResult SureSH(int OrderId, int State) {
            try {
                sql = "update [Order] set ReceiptState=" + State + " where OrderId=" + OrderId + "";
                var result = helper.ExecuteCommand(sql);
                return Json(result);
            }catch{
                return Json(null);
            }
        }

        #endregion

    }
}