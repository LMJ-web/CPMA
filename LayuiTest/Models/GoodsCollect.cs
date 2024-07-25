using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CPMA.Models
{
    public class GoodsCollect
    {
        public int GoodsColId { get; set; }
        public int GoodsId { get; set; }
        public int UserId { get; set; }
        public int ShopId { get; set; }
        public string GoodsName { get; set; }
        public int CollectNum { get; set; }
        public string CreateDate { get; set; }
    }
}