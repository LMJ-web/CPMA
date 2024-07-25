using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CPMA.Models
{
    public class Order
    {
        /// <summary>
        /// 订单Id
        /// </summary>
        public int OrderId { get; set; }

        /// <summary>
        /// 商店Id
        /// </summary>
        public int ShopId { get; set; }

        /// <summary>
        /// 用户Id
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// 商品Id
        /// </summary>
        public int GoodsId { get; set; }

        /// <summary>
        /// 商店名字
        /// </summary>
        public string ShopName { get; set; }

        /// <summary>
        /// 商品名字
        /// </summary>
        public string GoodsName { get; set; }

        /// <summary>
        /// 商品数量
        /// </summary>
        public string Num { get; set; }

        /// <summary>
        /// 商品价格
        /// </summary>
        public string GoodsPrice { get; set; }

        /// <summary>
        /// 商品封面图
        /// </summary>
        public string GoodsFMImgPath { get; set; }

        /// <summary>
        /// 收件人名字
        /// </summary>
        public string ReceivingPerson { get; set; }   
  
        /// <summary>
        /// 收件人地址
        /// </summary>
        public string ReceivingAddress { get; set; }

        /// <summary>
        /// 评价内容
        /// </summary>
        public string EvaluateContent { get; set; }

        /// <summary>
        /// 评价星星
        /// </summary>
        public double EvaluateStars { get; set; }

        /// <summary>
        /// 评论状态
        /// </summary>
        public int EvaluateState { get; set; }

        /// <summary>
        /// 收货状态
        /// </summary>
        public int ReceiptState { get; set; }

        /// <summary>
        /// 完成状态
        /// </summary>
        public int FinishState { get; set; }

        /// <summary>
        /// 创建日期
        /// </summary>
        public string CreateDate { get; set; }


    }
}