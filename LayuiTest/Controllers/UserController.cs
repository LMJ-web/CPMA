using CPMA.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace CPMA.Controllers
{
    public class UserController : Controller
    {
        DBHelper helper = new DBHelper();
        string sql = "";
        #region 用戶操作

        //用户账号校验
        public JsonResult UserValidate(string UserName, string Password, int Status)
        {

            User user = new User();
            //dr对象读取数据集
            try
            {
                sql = "select * from [LMJ_User] where UserName='" + DESEncrypt(UserName).ToString() + "' and Password='" + Password + "' and Status='" + Status + "' and State !='true'";
                using (var reader = helper.ExecuteReader(sql))
                {
                    //dr对象读取数据集
                    if (reader.Read())
                    {
                        user.Nick = reader["Nick"].ToString();
                        user.Name = reader["Name"].ToString();
                        user.UserName = reader["UserName"].ToString();
                        user.Sex = reader["Sex"].ToString();
                        user.Age = int.Parse(reader["Age"].ToString());
                        user.Money = int.Parse(reader["Money"].ToString());
                        user.BirthDay = reader["BirthDay"].ToString();
                        user.MobilePhone = reader["MobilePhone"].ToString();
                        user.Email = reader["Email"].ToString();
                        user.Address = reader["Address"].ToString();
                        user.LoginTime = reader["LoginTime"].ToString();
                        user.BusinessState = int.Parse(reader["BusinessState"].ToString());
                        if (reader["HeadImgPath"].ToString() != null || reader["HeadImgPath"].ToString() != "")
                        {
                            user.HeadImgPath = reader["HeadImgPath"].ToString();
                        }
                        user.ValidateState = true;
                        helper.ExecuteCommand("update [LMJ_User] set LoginTime=N'" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where UserName='" + DESEncrypt(UserName).ToString() + "'");
                        ViewBag.UserName = user.UserName;
                        //过滤器
                        HttpContextBase context = this.HttpContext;
                        context.Session.Add("UserValidateState", "true");
                        //有效时间一个钟
                        context.Session.Timeout = 180;
                    }
                    else
                    {
                        //Response.Write("<script>alert('登录失败！');location='Login.aspx'</script>");
                        user.ValidateState = false;
                    }
                }
            }
            catch (Exception ex)
            {

            }
            JsonResult result = Json(user, JsonRequestBehavior.AllowGet);
            return result;
        }

        //用戶退出
        [UserAuthorize]
        public JsonResult UserLogOut()
        {
            HttpContextBase context = this.HttpContext;
            context.Session.Clear();
            return Json(true);
        }

        //判断用户名是否已被占用
        public JsonResult UserNameVal(string UserName, int Status)
        {
            Console.WriteLine(UserName+Status);

            string result = "false";

            User user = new User();
            sql = "select * from [LMJ_User] where UserName='" + DESEncrypt(UserName).ToString() + "'";
            using (var reader = helper.ExecuteReader(sql))
            {
                if (reader.Read())
                {
                    result = "true";
                }
                else
                {
                    result = "false";
                }
            }
            return Json(result);
        }

        //注册账号 - 添加账号
        public JsonResult RegisterUser(string UserName, string Password, string Nick, int Status)
        {

            User user = new User();
            sql = "insert into [LMJ_User] (UserName,Password,Status,Nick,Age,Sex,Money,BirthDay,MobilePhone,Email,Address,LoginTime,Name,CreateTime,HeadImgPath,State) values ('" + DESEncrypt(UserName).ToString() + "','" + Password + "'," + Status + ",N'" + Nick + "',0,N'保密',0,'1996-01-01',N'无',N'无',N'保密',N'" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "','***',N'" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "','/Img/DefaultImg/DHeadImg.jpg','false')";
            bool result = helper.ExecuteCommand(sql);
            return Json((result + "").ToLower());
        }

        //修改用户信息
        public JsonResult ModifyUserInfos(string UserName, string Nick, string BirthDay, string Sex, string Address)
        {
            User user = new User();
            sql = "update [LMJ_User] set Nick=N'" + Nick + "',BirthDay='" + BirthDay + "',Sex=N'" + Sex + "',Address=N'" + Address + "' where UserName='" + UserName + "'";
            bool result = helper.ExecuteCommand(sql);
            //dr对象读取数据集
            try
            {
                sql = "select * from [LMJ_User] where UserName='" + UserName + "'";
                using (var reader = helper.ExecuteReader(sql))
                {
                    //dr对象读取数据集
                    if (reader.Read())
                    {
                        user.Nick = reader["Nick"].ToString();
                        user.Name = reader["Name"].ToString();
                        user.UserName = reader["UserName"].ToString();
                        user.Sex = reader["Sex"].ToString();
                        user.Age = int.Parse(reader["Age"].ToString());
                        user.Money = int.Parse(reader["Money"].ToString());
                        user.BirthDay = reader["BirthDay"].ToString();
                        user.MobilePhone = reader["MobilePhone"].ToString();
                        user.Email = reader["Email"].ToString();
                        user.Address = reader["Address"].ToString();
                        user.LoginTime = reader["LoginTime"].ToString();
                        user.BusinessState = int.Parse(reader["BusinessState"].ToString());
                        if (reader["HeadImgPath"].ToString() != null || reader["HeadImgPath"].ToString() != "")
                        {
                            user.HeadImgPath = reader["HeadImgPath"].ToString();
                        }
                        user.ValidateState = true;
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(user);
            }
            return Json(user);
        }

        //读取用户信息
        public JsonResult ReadUserInfos(string UserName)
        {

            User user = new User();
            //dr对象读取数据集
            try
            {
                sql = "select * from [LMJ_User] where UserName='" + UserName + "'";
                using (var reader = helper.ExecuteReader(sql))
                {
                    //dr对象读取数据集
                    if (reader.Read())
                    {
                        user.Nick = reader["Nick"].ToString().Trim();
                        user.Name = reader["Name"].ToString().Trim();
                        user.UserName = reader["UserName"].ToString().Trim();
                        user.IDCard = reader["IDCard"].ToString().Trim();
                        user.Sex = reader["Sex"].ToString().Trim();
                        user.Age = int.Parse(reader["Age"].ToString());
                        user.Money = int.Parse(reader["Money"].ToString());
                        user.BirthDay = reader["BirthDay"].ToString().Trim();
                        user.MobilePhone = reader["MobilePhone"].ToString().Trim();
                        user.Email = reader["Email"].ToString().Trim();
                        user.Address = reader["Address"].ToString().Trim();
                        user.LoginTime = reader["LoginTime"].ToString().Trim();
                        user.BusinessState = int.Parse(reader["BusinessState"].ToString());
                        if (reader["HeadImgPath"].ToString() != null || reader["HeadImgPath"].ToString() != "")
                        {
                            user.HeadImgPath = reader["HeadImgPath"].ToString().Trim();
                        }
                        user.ValidateState = true;
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(user);
            }
            return Json(user);
        }

        //修改邮箱
        public JsonResult ModifyEmail(string UserName, string Email)
        {

            sql = "update [LMJ_User] set Email='" + Email + "'where UserName='" + UserName + "'";
            bool result;
            try
            {
                result = helper.ExecuteCommand(sql);
            }
            catch (Exception e)
            {
                return Json("");
            }
            return Json(result + "");
        }

        //修改手机号码
        public JsonResult ModifyPhone(string UserName, string MobilePhone)
        {

            sql = "update [LMJ_User] set MobilePhone='" + MobilePhone + "'where UserName='" + UserName + "'";
            bool result;
            try
            {
                result = helper.ExecuteCommand(sql);
            }
            catch (Exception e)
            {
                return Json("");
            }
            return Json(result + "");
        }

        //修改密码
        public JsonResult ModifyPassword(string UserName, string OldPassword, string NewPassword)
        {
            sql = "update [LMJ_User] set Password='" + NewPassword + "' where UserName='" + UserName + "' and Password='" + OldPassword + "'";
            bool result = helper.ExecuteCommand(sql);
            return Json(result);
        }

        //头像上传
        [HttpPost]
        public ContentResult UploadFile(HttpPostedFileBase file, string UserName)
        {
            try
            {
                var fileName = file.FileName.ToLower();
                string mfileName = "";
                if (fileName.IndexOf("jpg") >= 0)
                {
                    mfileName = UserName + ".jpg";
                }
                else if (fileName.IndexOf("png") >= 0)
                {
                    mfileName = UserName + ".png";
                }
                else
                {

                    return Content("<script>alert('请上传jpg或png格式的图片！');window.location.href='/Home/UserInfoIndex?UserName=" + UserName + "';</script>");
                }
                var filePath = Server.MapPath(string.Format("~/Img/HeadImg", "File"));
                file.SaveAs(Path.Combine(filePath, mfileName));

                sql = "update [LMJ_User] set HeadImgPath=N'/Img/HeadImg/" + mfileName + "' where UserName='" + UserName + "'";
                bool result = helper.ExecuteCommand(sql);
                if (result)
                {
                    return Content("<script>alert('更改成功！');window.location.href='/Home/UserInfoIndex?UserName=" + UserName + "';</script>");
                }
                else
                {
                    return Content("<script>alert('更改失败！');window.location.href='/Home/UserInfoIndex?UserName=" + DESEncrypt(UserName).ToString() + "';</script>");

                }
            }
            catch (Exception ex)
            {
                return Content("<script>alert('更改失敗,文件不能为空！');window.location.href='/Home/UserInfoIndex?UserName=" + DESEncrypt(UserName).ToString() + "';</script>");
            }

        }

        //用户获取自己的预约信息
        public JsonResult GetWDYYInfo(string UserName)
        {
            List<ShopReservation> ShopReaList = new List<ShopReservation>();
            sql = "select s.ShopName,s.ShopContact,s.ShopDAddress,s.ShopPhone,s.StartTime,s.EndTime,sr.ShopId,sr.YYTime,sr.Admissibility,sr.FinishState,sr.CreateDate,sr.Id from ShopReservation as sr  full join Shop as s on sr.ShopId=s.ShopId and sr.UserId=(select UserId from [LMJ_User] where UserName='" + UserName + "') and sr.FinishState=0 where sr.ShopId is not null and ShopName is not null order by sr.CreateDate desc";
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
                    ShopReaList.Add(sr);
                }
            }
            return Json(ShopReaList);
        }

        //用户获取已完成的自己的预约信息
        public JsonResult GetWDYYFinishInfo(string UserName)
        {
            List<ShopReservation> ShopReaList = new List<ShopReservation>();
            sql = "select s.ShopName,s.ShopContact,s.ShopDAddress,s.ShopPhone,s.StartTime,s.EndTime,sr.Id,sr.ShopId,sr.YYTime,sr.Admissibility,sr.FinishState,sr.CreateDate,sr.PayDate,sr.EvaluateState,sr.EvaluateStars,sr.EvaluateContent from ShopReservation as sr  full join Shop as s on sr.ShopId=s.ShopId and sr.UserId=(select UserId from [LMJ_User] where UserName='" + UserName + "') and sr.FinishState=1 where sr.ShopId is not null and ShopName is not null order by sr.PayDate desc";
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
                    sr.Time = reader["StartTime"].ToString() + "-" + reader["EndTime"].ToString();
                    sr.YYTime = reader["YYTime"].ToString();
                    sr.PayDate = reader["PayDate"].ToString();
                    sr.CreateDate = reader["CreateDate"].ToString();
                    sr.EvaluateState = int.Parse(reader["EvaluateState"].ToString());
                    sr.EvaluateStars = double.Parse(reader["EvaluateStars"].ToString());
                    sr.EvaluateContent = reader["EvaluateContent"].ToString();
                    ShopReaList.Add(sr);
                }
            }
            return Json(ShopReaList);
        }

        //确认支付
        [HttpPost]
        public string SurePay(string UserName, int ShopReservationId)
        {
            sql = "update ShopReservation set FinishState=1,PayDate=N'" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where UserId=(select UserId from [LMJ_User] where UserName='" + UserName + "') and Id=" + ShopReservationId;
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

        //取消支付
        [HttpPost]
        public string CancelShopReservation(string UserName, int ShopReservationId)
        {
            sql = "delete from ShopReservation  where UserId=(select UserId from [LMJ_User] where UserName='" + UserName + "') and Id=" + ShopReservationId;
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

        //实名认证
        public JsonResult SureRealNameVail(string UserName, string RealName, string IDCard)
        {

            sql = "update [LMJ_User] set IDCard='" + IDCard.Trim() + "',Name=N'" + RealName.Trim() + "' where UserName='" + UserName + "'";
            var result = helper.ExecuteCommand(sql);
            return Json(result.ToString().ToLower() + "");
        }

        //已完成的预约的评论更新
        public string ModifyEvaluate(int ShopReservationId, double EvaluateStars, string EvaluateContent)
        {
            try
            {
                sql = "update ShopReservation set EvaluateState=1,EvaluateStars=" + EvaluateStars + ",EvaluateContent=N'" + EvaluateContent + "',EvaluateDate=N'" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where Id=" + ShopReservationId;
                var result = helper.ExecuteCommand(sql);
                return (result.ToString().ToLower() + "");
            }
            catch (Exception e)
            {
                return ("EC");
            }
        }

        //清空购物车-结算
        public JsonResult ClearCart(string UserName, List<List<int>> GoodsList)
        {
            try
            {
                //goodsArr[index][0] = goodsListObj[i].GoodsId;
                //goodsArr[index][1] = goodsListObj[i].ShopId;
                //goodsArr[index][2] = goodsListObj[i].Num;

                /*
                GoodList[i][0] == GoodsId
                GoodList[i][0] == ShopId
                GoodList[i][0] == Num
                */

                var totalPrice = 0;
                var goodsPrice = 0;
                var goodsNum = 0;
                var userId = 0;
                var count = GoodsList.Count();
                SqlDataReader reader;
                sql = "select UserId from [LMJ_User] where UserName='" + UserName + "'";
                reader = helper.ExecuteReader(sql);
                if (reader.Read())
                {
                    userId = int.Parse(reader["UserId"].ToString());
                }
                for (var i = 0; i < count; i++)
                {
                    sql = "select GoodsPrice from Goods where GoodsId=" + GoodsList[i][0];
                    reader = helper.ExecuteReader(sql);
                    if (reader.Read())
                    {
                        goodsPrice = int.Parse(reader["GoodsPrice"].ToString());
                    }
                    goodsNum = GoodsList[i][2];
                    totalPrice += (goodsPrice * goodsNum);
                }
                sql = "select Money from [LMJ_User] where UserName='" + UserName + "'";
                reader = helper.ExecuteReader(sql);
                if (reader.Read())
                {
                    if (int.Parse(reader["Money"].ToString()) < totalPrice)
                    {
                        //余额不足
                        return Json(false);
                    }
                    else
                    {
                        //建立订单
                        for (var i = 0; i < count; i++)
                        {
                            sql = "insert into [CPMA_Db].[dbo].[Order] (GoodsId,ShopId,UserId,Num,CreateDate) values (" + GoodsList[i][0] + "," + GoodsList[i][1] + "," + userId + "," + GoodsList[i][2] + ",N'" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "')";
                            helper.ExecuteCommand(sql);
                        }
                        //扣除金额
                        sql = "update [LMJ_User] set Money=Money-" + totalPrice + " where UserName='" + UserName + "'";
                        helper.ExecuteCommand(sql);
                        return Json(true);
                    }
                }
                else
                {
                    return Json("");
                }
            }
            catch
            {
                return Json("");
            }
        }

        //获取我的订单
        public JsonResult GetMyOrder(string UserName)
        {
            try
            {
                List<Order> orderList = new List<Order>();
                sql = "select * from [CPMA_Db].[dbo].[Order] as o,Goods as g,Shop as s where UserId=(select UserId from [LMJ_User] where UserName='" + UserName + "') and o.GoodsId=g.GoodsId and o.ShopId=s.ShopId";
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

        //确认收货
        [HttpPost]
        public JsonResult SureReceipt(string UserName, int OrderId)
        {
            try
            {
                sql = "update [CPMA_Db].[dbo].[Order] set ReceiptState=1 where UserId=(select UserId from [LMJ_User] where UserName='" + UserName + "') and OrderId=" + OrderId;
                var result = helper.ExecuteCommand(sql);
                return Json(result);
            }
            catch
            {
                return Json(null);
            }

        }

        //退货
        public JsonResult BackGoods(string UserName, int OrderId)
        {
            try
            {
                var sql = "select * from [Order] as o,Goods as g where o.GoodsId=g.GoodsId and OrderId=" + OrderId;
                var reader = helper.ExecuteReader(sql);
                var order = new Order();
                while (reader.Read())
                {
                    order.GoodsPrice = reader["GoodsPrice"].ToString();
                    order.Num = reader["Num"].ToString();
                }
                sql = "update [LMJ_User] set Money=Money+" + (int.Parse(order.GoodsPrice) * int.Parse(order.Num)) + " where UserName='" + UserName+"'";
                var result = helper.ExecuteCommand(sql);
                if (result)
                {
                    sql = "delete [CPMA_Db].[dbo].[Order] where OrderId=" + OrderId;
                    result = helper.ExecuteCommand(sql);
                }
                return Json(result);
            }
            catch
            {
                return Json(null);
            }
        }

        //充值
        public JsonResult RechargeMoney(string UserName, int Money)
        {
            try
            {
                sql = "update [LMJ_User] set Money=Money+" + Money + " where UserName='" + UserName + "'";
                var result = helper.ExecuteCommand(sql);
                return Json(result);
            }
            catch
            {
                return Json(null);
            }

        }

        #endregion

        #region DES加密操作
        /// <summary>
        /// DES的加密函数
        /// </summary>
        /// <param name="key">公钥 laizhixu</param>
        /// <param name="encryptString">待加密的字符串</param>
        /// <returns></returns>
        public string DESEncrypt(string encryptString)
        {
            string key = "laizhixu";
            try
            {
                //访问数据加密标准(DES)算法的加密服务提供程序 (CSP) 版本的包装对象   
                DESCryptoServiceProvider des = new DESCryptoServiceProvider();
                des.Key = ASCIIEncoding.ASCII.GetBytes(key);　//建立加密对象的密钥和偏移量   
                des.IV = ASCIIEncoding.ASCII.GetBytes(key);　 //原文使用ASCIIEncoding.ASCII方法的GetBytes方法   

                byte[] inputByteArray = Encoding.Default.GetBytes(encryptString);//把字符串放到byte数组中   

                MemoryStream ms = new MemoryStream();//创建其支持存储区为内存的流　   
                //定义将数据流链接到加密转换的流   
                CryptoStream cs = new CryptoStream(ms, des.CreateEncryptor(), CryptoStreamMode.Write);
                cs.Write(inputByteArray, 0, inputByteArray.Length);
                cs.FlushFinalBlock();
                //上面已经完成了把加密后的结果放到内存中去   
                StringBuilder ret = new StringBuilder();
                foreach (byte b in ms.ToArray())
                {
                    ret.AppendFormat("{0:X2}", b);
                }
                ret.ToString();
                return ret.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>   
        /// 利用DES解密算法解密密文（可解密）   
        /// </summary>   
        /// <param name="ciphertext">被解密的字符串</param>   
        /// <param name="key">密钥 （只支持8个字节的密钥，同前面的加密密钥相同） laizhixu</param>   
        /// <returns>返回被解密的字符串</returns>   
        private static string DecryptString(string ciphertext, string key)
        {
            try
            {
                DESCryptoServiceProvider des = new DESCryptoServiceProvider();

                byte[] inputByteArray = new byte[ciphertext.Length / 2];
                for (int x = 0; x < ciphertext.Length / 2; x++)
                {
                    int i = (Convert.ToInt32(ciphertext.Substring(x * 2, 2), 16));
                    inputByteArray[x] = (byte)i;
                }

                des.Key = ASCIIEncoding.ASCII.GetBytes(key);　//建立加密对象的密钥和偏移量，此值重要，不能修改   
                des.IV = ASCIIEncoding.ASCII.GetBytes(key);
                MemoryStream ms = new MemoryStream();
                CryptoStream cs = new CryptoStream(ms, des.CreateDecryptor(), CryptoStreamMode.Write);

                cs.Write(inputByteArray, 0, inputByteArray.Length);

                cs.FlushFinalBlock();

                //建立StringBuild对象，createDecrypt使用的是流对象，必须把解密后的文本变成流对象   
                StringBuilder ret = new StringBuilder();

                return System.Text.Encoding.Default.GetString(ms.ToArray());
            }
            catch (Exception)
            {
                return "error";
            }
        }
        #endregion
    }
}