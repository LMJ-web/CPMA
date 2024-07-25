using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CPMA.Models
{
    public class UserReservation
    {

        /// <summary>
        /// 用户预约单的Id 
        /// </summary>
        public int UserReservationId { get; set; }

        /// <summary>
        /// 商鋪ID 
        /// </summary>
        public int ShopId { get; set; }

        /// <summary>
        /// 真实姓名 
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 昵称 
        /// </summary>
        public string Nick { get; set; }

        /// <summary>
        /// 账号Id
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// 联系方式 
        /// </summary>
        public string MobilePhone { get; set; }

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
        /// 创建时间 
        /// </summary>
        public string CreateDate { get; set; }

        /// <summary>
        /// 支付时间 
        /// </summary>
        public string PayDate { get; set; }
    }
}