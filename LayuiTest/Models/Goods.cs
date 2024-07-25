using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CPMA.Models
{
    public class Goods
    {
        /// <summary>
        /// 商品Id
        /// </summary>
        public int GoodsId { get; set; }

        /// <summary>
        /// 商店Id
        /// </summary>
        public int ShopId { get; set; }

        /// <summary>
        /// 类别Id
        /// </summary>
        public int CategoryId { get; set; }

        /// <summary>
        /// 类别
        /// </summary>
        public string CategoryName { get; set; }

        /// <summary>
        /// 商品名字
        /// </summary>
        public string GoodsName { get; set; }

        /// <summary>
        /// 商品价格
        /// </summary>
        public int GoodsPrice { get; set; }

        /// <summary>
        /// 商品的促销价格
        /// </summary>
        public int GoodsMinPrice { get; set; }

        /// <summary>
        /// 商店名字
        /// </summary>
        public string ShopName { get; set; }

        /// <summary>
        /// 商品展示图
        /// </summary>
        public string GoodsShowImgPath { get; set; }

        /// <summary>
        /// 关注人数
        /// </summary>
        public int GoodsConcernNum { get; set; }

        /// <summary>
        /// 简介
        /// </summary>
        public string GoodsIntroduce { get; set; }

        /// <summary>
        /// 商品封面展示图
        /// </summary>
        public string GoodsFMImgPath { get; set; }

        /// <summary>
        /// 热门状态
        /// </summary>
        public int HotState { get; set; }

        /// <summary>
        /// 创建日期
        /// </summary>
        public string CreateDate { get; set; }

        /// <summary>
        /// 总页数
        /// </summary>
        public int TotalPages { get; set; }

        /// <summary>
        /// 总数
        /// </summary>
        public int Count { get; set; }

        /// <summary>
        /// 当前页数
        /// </summary>
        public int CurrentPage { get; set; }
    }
}