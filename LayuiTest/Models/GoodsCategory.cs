using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CPMA.Models
{
    public class GoodsCategory
    {
        /// <summary>
        /// 类别Id
        /// </summary>
        public int CategoryId { get; set; }

        /// <summary>
        /// 类别
        /// </summary>
        public string CategoryName { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        public string CreateDate { get; set; }
    }
}