using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CPMA.Models
{
    public class Notice
    {
        /// <summary>
        /// 公告Id 
        /// </summary>
        public int NoticeId { get; set; }

        /// <summary>
        /// 公告标题
        /// </summary>
        public string NoticeTitle { get; set; }

        /// <summary>
        /// 公告简介
        /// </summary>
        public string NoticeIntro { get; set; }

        /// <summary>
        /// 公告内容
        /// </summary>
        public string NoticeContent { get; set; }
  
        /// <summary>
        /// 总页数
        /// </summary>
        public int TotalPages { get; set; }

        /// <summary>
        /// 当前页数
        /// </summary>
        public int CurrentPage { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        public string CreateDate { get; set; }

        /// <summary>
        /// 激活状态
        /// </summary>
        public int Status { get; set; }


    }
}