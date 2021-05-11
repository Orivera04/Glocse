using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GLOCSE.Controllers
{
    public class LoginController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult ValidarUsuario(string usuario, string password )
        {
            string query = "SELECT * FROM usuario where usuario = @usuario AND password = @password;";
            using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@usuario", usuario);
                command.Parameters.AddWithValue("@password", password);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                if (reader.HasRows) {
                    reader.Read();
                    Session["usuario_id"] = reader["id"];
                    Session["usuario"] = reader["usuario"];
                    Session["imagen"] = reader["imagen_perfil"];
                    return RedirectToAction("Index", "Proyecto", null);
                }
                else
                {
                    TempData["usuario_incorrecto"] = true;
                    return RedirectToAction("Index", "Login", null);
                }

            }

        }
    }
}