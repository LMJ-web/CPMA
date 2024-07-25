using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CPMA.Models
{
    public class ShopReservation
    {
        /// <summary>
        /// ID 
        /// </summary>
        public int ShopReservationId { get; set; }

        /// <summary>
        /// 商鋪ID 
        /// </summary>
        public int ShopId { get; set; }

        /// <summary>
        /// 商鋪名 
        /// </summary>
        public string ShopName { get; set; }

        /// <summary>
        /// 联系人 
        /// </summary>
        public string ShopContact { get; set; }

        /// <summary>
        /// 联系方式 
        /// </summary>
        public string ShopPhone { get; set; }

        /// <summary>
        /// 详细地点 
        /// </summary>
        public string ShopDAddress { get; set; }

        /// <summary>
        /// 营业开始时间 
        /// </summary>
        //public string StartTime { get; set; }
        /// <summary>
        /// 营业结束时间 
        /// </summary>
        //public string EndTime { get; set; }

        /// <summary>
        /// 营业综合时间 
        /// </summary>
        public string Time { get; set; }

        /// <summary>
        /// 受理状态 
        /// </summary>
        public int Admissibility { get; set; }

        /// <summary>
        /// 完成状态 
        /// </summary>
        public int FinishState { get; set; }

        /// <summary>
        /// 预约时间
        /// </summary>
        public string YYTime { get; set; }
     
        /// <summary>
        /// 支付时间 
        /// </summary>
        public string PayDate { get; set; }

        /// <summary>
        /// 评价状态 
        /// </summary>
        public int EvaluateState { get; set; }

        /// <summary>
        /// 评价星星 
        /// </summary>
        public double EvaluateStars{ get; set; }

        /// <summary>
        /// 评价内容 
        /// </summary>
        public string EvaluateContent { get; set; }

        /// <summary>
        /// 创建时间 
        /// </summary>
        public string CreateDate { get; set; }

    }
}