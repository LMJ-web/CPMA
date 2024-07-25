using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Configuration;
namespace CPMA.Models
{
    public class DBHelper
    {
        public static string strconn = ConfigurationManager.ConnectionStrings["CPMA_Db"].ToString();
        private readonly object balanceLock = new object();
        public SqlDataReader ExecuteReader(String sql)
        {
            SqlConnection connection = new SqlConnection(strconn);
            try
            {
                connection.Open();
                SqlCommand command = new SqlCommand(sql, connection);
                //SqlDataReader result = command.ExecuteReader();
                return command.ExecuteReader(CommandBehavior.CloseConnection);
            }
            catch
            {
                //关闭连接，抛出异常
                connection.Close();
                throw;
            }

        }

        public bool ExecuteCommand(String sql)
        {
            bool result = false;
            try
            {
                SqlConnection connection = new SqlConnection(strconn);
                connection.Open();
                SqlCommand command = new SqlCommand(sql, connection);
                //command.Connection = connection;
                //command.CommandText = sql;
                int sum = command.ExecuteNonQuery();
                connection.Close();
                if (sum >= 1)
                {
                    result = true;
                }
                else
                {
                    result = false;
                }
            }
            catch (Exception e)
            {
                throw e;
            }
            return result;
        }

    }

}