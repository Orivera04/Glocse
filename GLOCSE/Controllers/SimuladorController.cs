using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GLOCSE.Controllers
{
    public class SimuladorController : Controller
    {
        public ActionResult Index(int id)
        {
            ViewBag.Titulo = "GLOCSE - Subestación";
            string query = "SELECT * FROM proyecto where id = @id;";
            using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@id", id);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                if (reader.HasRows)
                {
                    reader.Read();
                    ViewBag.id = reader["id"];
                    ViewBag.nombre= reader["nombre"];                 
                }
            }            
            return View();
        }
        
        public ActionResult Plantilla()
        {
            return File("~/Assets/Plantilla.xlsx", System.Net.Mime.MediaTypeNames.Application.Octet, Path.GetFileName("~/Assets/Plantilla.xlsx"));
        }
    }
}