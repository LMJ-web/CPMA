using CPMA.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CPMA.Controllers
{
    public class GoodsController : Controller
    {
        public DBHelper helper = new DBHelper();
        public string sql = "";
        // GET: Goods
        public ActionResult GoodsIndex()
        {
            return View();
        }

        //电子产品具体信息展示页面
        public ActionResult ShowGoodsIndex(string GoodsId)
        {
            sql = "select * from Goods where GoodsId=" + int.Parse(GoodsId);
            using (var reader = helper.ExecuteReader(sql))
            {
                if (reader.Read())
                {
                    Goods temp = new Goods();
                    temp.GoodsId = int.Parse(reader["GoodsId"].ToString());
                    temp.ShopId = int.Parse(reader["ShopId"].ToString());
                    temp.GoodsPrice = int.Parse(reader["GoodsPrice"].ToString());
                    if (string.IsNullOrEmpty(reader["GoodsMinPrice"].ToString()))
                    {
                        temp.GoodsMinPrice = 0;
                    }
                    else {
                        temp.GoodsMinPrice = int.Parse(reader["GoodsMinPrice"].ToString());
                    }
                    temp.GoodsName = reader["GoodsName"].ToString();
                    temp.GoodsFMImgPath = reader["GoodsFMImgPath"].ToString();
                    temp.GoodsShowImgPath = reader["GoodsShowImgPath"].ToString();
                    temp.GoodsConcernNum = int.Parse(reader["GoodsConcernNum"].ToString());
                    ViewBag.Goods = temp;
                    sql = "select * from Shop where ShopId=" + temp.ShopId;
                    using (var reader2 = helper.ExecuteReader(sql))
                    {
                        Shop shop = new Shop();
                        if (reader2.Read())
                        {
                            shop.ShopId = int.Parse(reader2["ShopId"].ToString());
                            shop.ShopName = reader2["ShopName"].ToString();
                            shop.ShopFMImgPath = reader2["ShopFMImgPath"].ToString();
                            shop.ConcernNum = int.Parse(reader2["ConcernNum"].ToString());
                            ViewBag.Shop = shop;
                        }
                    }
                }
            }
            return View();
        }

        //收藏
        public JsonResult CollectGoods(string UserName, int GoodsId)
        {
            //先判斷是否已經收藏

            sql = "select * from GoodsCollect where UserId=(select UserId from [LMJ_User] where UserName='" + UserName + "') and GoodsId=" + GoodsId;
            var reader = helper.ExecuteReader(sql);
            if (reader.Read())
            {
                return Json(false);
            }
            else
            {
                //開始收藏
                sql = "insert into GoodsCollect (UserId,GoodsId,CreateDate) values ((select UserId from [LMJ_User] where UserName='" + UserName + "')," + GoodsId + ",'" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "')";
                helper.ExecuteCommand(sql);
                sql = "update Goods Set GoodsConcernNum=GoodsConcernNum+1 where GoodsId=" + GoodsId;
                helper.ExecuteCommand(sql);
                return Json(true);
            }
        }

        //取消收藏
        public string RemoveGoodsCollect(string UserName, int GoodsId)
        {

            try
            {
                sql = "delete from GoodsCollect where UserId=(select UserId from [LMJ_User] where UserName='" + UserName + "') and GoodsId=" + GoodsId;
                helper.ExecuteCommand(sql);
                sql = "update Goods Set GoodsConcernNum=GoodsConcernNum-1 where GoodsId=" + GoodsId;
                helper.ExecuteCommand(sql);
                return ("true");
            }
            catch (Exception e)
            {
                return ("false");

            }
        }

        //获取用戶收藏的电子产品
        public JsonResult GetAllColGoods(string UserName)
        {
            List<Goods> GoodsList = new List<Goods>();
            try
            {
                //先判斷是否已經收藏
                sql = "select * from Goods where GoodsId in (select GoodsId from GoodsCollect where UserId=(select UserId from [LMJ_User] where UserName='" + UserName + "')) order by GoodsConcernNum DESC";
                using (var reader = helper.ExecuteReader(sql))
                {
                    while (reader.Read())
                    {
                        Goods temp = new Goods();
                        temp.GoodsId = int.Parse(reader["GoodsId"].ToString());
                        temp.GoodsName = reader["GoodsName"].ToString();
                        temp.GoodsFMImgPath = reader["GoodsFMImgPath"].ToString();
                        temp.GoodsConcernNum = int.Parse(reader["GoodsConcernNum"].ToString());
                        GoodsList.Add(temp);
                    }
                }
                return Json(GoodsList);

            }
            catch (Exception ex)
            {
                return Json(GoodsList);
            }
        }

        public int goodsColPageSize = 10;
        //获取用戶收藏的电子产品_分页
        public JsonResult GetFYColGoods(string UserName, int CurPage)
        {
            List<Goods> GoodsList = new List<Goods>();
            try
            {
                //先判斷是否已經收藏
                if (CurPage == 1)
                {
                    sql = "select Top " + goodsColPageSize + " * from Goods where GoodsId in (select GoodsId from GoodsCollect where UserId=(select UserId from [LMJ_User] where UserName='" + UserName + "')) order by GoodsConcernNum DESC";
                }
                else
                {
                    sql = "select Top " + goodsColPageSize + " * from Goods where GoodsId in (select GoodsId from GoodsCollect where UserId=(select UserId from [LMJ_User] where UserName='" + UserName + "') and  GoodsId not in (select  Top (" + ((CurPage - 1) * goodsColPageSize) + ") GoodsId from GoodsCollect where UserId=(select UserId from [LMJ_User] where UserName='" + UserName + "'))) order by GoodsConcernNum DESC";
                }


                using (var reader = helper.ExecuteReader(sql))
                {
                    while (reader.Read())
                    {
                        Goods temp = new Goods();
                        temp.GoodsId = int.Parse(reader["GoodsId"].ToString());
                        temp.GoodsName = reader["GoodsName"].ToString();
                        temp.GoodsFMImgPath = reader["GoodsFMImgPath"].ToString();
                        temp.GoodsConcernNum = int.Parse(reader["GoodsConcernNum"].ToString());
                        GoodsList.Add(temp);
                    }
                }
                return Json(GoodsList);

            }
            catch (Exception ex)
            {
                return Json(GoodsList);
            }
        }

        //获取用户收藏的商品的总数
        public int GetAllColGoodsCount(string UserName)
        {
            var count = 0;
            sql = "select count(*) as Count from GoodsCollect where UserId=(select UserId from [LMJ_User] where UserName='" + UserName + "')";
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
        public JsonResult AddGoods(string UserName,List<string> GoodsInfo)
        {
            try
            {
                var goodsName = GoodsInfo[0];
                var categoryId =int.Parse(GoodsInfo[1]);
                var goodsPrice =int.Parse(GoodsInfo[2]);
                var goodsIntroduce =GoodsInfo[3];
                var shopId = 0;
                sql = "select ShopId from Shop where UserName='" + UserName + "'";
                using (var reader = helper.ExecuteReader(sql))
                {
                    while (reader.Read())
                    {
                        shopId = int.Parse(reader["ShopId"].ToString());
                        break;
                    }
                }
                sql = "insert into Goods (ShopId,CategoryId,GoodsName,GoodsPrice,GoodsIntroduce,CreateDate,GoodsFMImgPath) values (" + shopId + "," + categoryId + ",N'" + goodsName + "'," + goodsPrice + ",N'" + goodsIntroduce + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "',N'/Img/DefaultImg/GoodsFMImg.jpg')";
                var result = helper.ExecuteCommand(sql);
                if (result)
                {
                    return Json(true);
                }
                else
                {
                    return Json(false);
                }
            }
            catch {
                return Json(null);
            }
         
        }

        //获取商品类别
        public JsonResult GetGoodsCategory()
        {
            List<GoodsCategory> GCList = new List<GoodsCategory>();
            sql = "select * from GoodsCategory";
            using (var reader = helper.ExecuteReader(sql))
            {
                while (reader.Read())
                {
                    GoodsCategory goodsCategory = new GoodsCategory();
                    goodsCategory.CategoryId = int.Parse(reader["CategoryId"].ToString());
                    goodsCategory.CategoryName = reader["CategoryName"].ToString();
                    goodsCategory.CreateDate = reader["CreateDate"].ToString();
                    GCList.Add(goodsCategory);
                }
            }
            return Json(GCList);
        }

        //获取指定商品信息
        public JsonResult ReadGoodsInfoById(int GoodsId,string UserName) {
            sql = "select * from Goods where GoodsId=" + GoodsId+" and ShopId=(select ShopId from Shop where UserName='"+UserName+"')";
            using (var reader = helper.ExecuteReader(sql))
            {
                Goods temp = new Goods();
                if (reader.Read())
                {
                    temp.GoodsId = int.Parse(reader["GoodsId"].ToString());
                    temp.ShopId = int.Parse(reader["ShopId"].ToString());
                    temp.CategoryId = int.Parse(reader["CategoryId"].ToString());
                    temp.GoodsPrice = int.Parse(reader["GoodsPrice"].ToString());
                    if (reader["GoodsMinPrice"].ToString() == "" || reader["GoodsMinPrice"].ToString() == null)
                    {
                        temp.GoodsMinPrice = 0;
                    }
                    else {
                        temp.GoodsMinPrice = int.Parse(reader["GoodsMinPrice"].ToString());
                    }
                    temp.GoodsName = reader["GoodsName"].ToString();
                    temp.GoodsIntroduce = reader["GoodsIntroduce"].ToString();
                    temp.GoodsFMImgPath = reader["GoodsFMImgPath"].ToString();
                    if (temp.GoodsFMImgPath == "" || temp.GoodsFMImgPath == null) {
                        temp.GoodsFMImgPath = "/Img/DefaultImg/GoodsFMImg.jpg";
                    }
                    temp.GoodsShowImgPath = reader["GoodsShowImgPath"].ToString();
                    temp.GoodsConcernNum = int.Parse(reader["GoodsConcernNum"].ToString());
                }
                return Json(temp);
            }
        }
    }
}