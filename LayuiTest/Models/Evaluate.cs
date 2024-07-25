using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CPMA.Models
{
    public class Evaluate
    {
      
        /// <summary>
        /// ShopResId
        /// </summary>
        public int ShopResId { get; set; }

        /// <summary>
        /// UserId
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// ShopId
        /// </summary>
        public int ShopId { get; set; }

        /// <summary>
        /// 用户昵称
        /// </summary>
        public string UserNickName { get; set; }

        /// <summary>
        /// 用户头像图片
        /// </summary>
        public string UserHeadImgPath { get; set; }

        /// <summary>
        /// 评价星星 
        /// </summary>
        public double EvaluateStars { get; set; }

        /// <summary>
        /// 评价内容 
        /// </summary>
        public string EvaluateContent { get; set; }

        /// <summary>
        /// 评价创建时间 
        /// </summary>
        public string EvaluateDate { get; set; }

    }
}