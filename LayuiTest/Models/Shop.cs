using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CPMA.Models
{
    public class Shop
    {
        /// <summary>
        /// 商店Id
        /// </summary>
        public int ShopId { get; set; }

        /// <summary>
        /// 用户名
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// 商店名
        /// </summary>
        public string ShopName { get; set; }

        /// <summary>
        /// 商店联系人
        /// </summary>
        public string ShopContact { get; set; }

        /// <summary>
        /// 联系人的电话
        /// </summary>
        public string ShopPhone { get; set; }

        /// <summary>
        /// 营业开始时间
        /// </summary>
        public string StartTime { get; set; }

        /// <summary>
        /// 营业结束时间
        /// </summary>
        public string EndTime { get; set; }

        /// <summary>
        /// 总时间
        /// </summary>
        public string Time { get; set; }

        /// <summary>
        /// 优惠后的价格
        /// </summary>
        public int MinPrice { get; set; }

        /// <summary>
        /// 优惠前的价格
        /// </summary>
        public int MaxPrice { get; set; }

        /// <summary>
        /// 商店地址
        /// </summary>
        public string ShopAddress { get; set; }

        /// <summary>
        /// 商店详细地址
        /// </summary>
        public string ShopDAddress { get; set; }

        /// <summary>
        /// 商店简介
        /// </summary>
        public string ShopIntroduce{ get; set; }

        /// <summary>
        /// 商店封面图
        /// </summary>
        public string ShopFMImgPath { get; set; }

        /// <summary>
        /// 商店推广图
        /// </summary>
        public string ShopTGImgPath { get; set; }

        /// <summary>
        /// 关注的人数
        /// </summary>
        public int ConcernNum { get; set; }

        /// <summary>
        /// 热门状态
        /// </summary>
        public int HotState { get; set; }

        /// <summary>
        /// 创建时间
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