using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CPMA.Models
{
    public class ShopCollect
    {
        public int ShopColId { get; set; }
        public int UserId { get; set; }
        public int ShopId { get; set; }
        public string ShopName { get; set; }
        public int CollectNum { get; set; }
        public string CreateDate { get; set; }
    }
}