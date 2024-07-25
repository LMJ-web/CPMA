using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CPMA.Models
{
    public class User
    {
        /// <summary>
        /// 用户Id 
        /// </summary>
        public int UserId{ get; set; }

        /// <summary>
        /// 账号 
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// 密码 
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// 昵称 
        /// </summary>
        public string Nick { get; set; }

        /// <summary>
        /// 真实姓名 
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 身份证 
        /// </summary>
        public string IDCard { get; set; }

        /// <summary>
        /// 性别 
        /// </summary>
        public string Sex { get; set; }

        /// <summary>
        /// 年龄 
        /// </summary>
        public int Age { get; set; }

        /// <summary>
        /// 出生日期 
        /// </summary>
        public string BirthDay { get; set; }

        /// <summary>
        /// 手机号码 
        /// </summary>
        public string MobilePhone { get; set; }

        /// <summary>
        /// 邮箱 
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// 地址 
        /// </summary>
        public string Address { get; set; }

        /// <summary>
        /// 金额 
        /// </summary>
        public int Money { get; set; }

        /// <summary>
        /// 头像图片路径 
        /// </summary>
        public string HeadImgPath { get; set; }

        /// <summary>
        /// 登录时间 
        /// </summary>
        public string LoginTime { get; set; }

        /// <summary>
        /// 身份 
        /// </summary>
        public int Status { get; set; }

        /// <summary>
        /// 商店状态 
        /// </summary>
        public int BusinessState { get; set; }

        /// <summary>
        /// 登录状态 
        /// </summary>
        public string LoginState { get; set; }

        /// <summary>
        /// 验证状态 
        /// </summary>
        public bool ValidateState{ get; set; }

        /// <summary>
        /// 注册时间
        /// </summary>
        public string CreateTime { get; set; }

        /// <summary>
        /// 冻结状态 
        /// </summary>
        public string State { get; set; }
    }
}