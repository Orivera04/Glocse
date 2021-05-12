using GLOCSE.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GLOCSE.Controllers
{
    public class ProyectoController : Controller
    {
        
        public ActionResult Index()
        {
            string query = "SELECT * FROM proyecto where id_usuario = @id;";
            List<Proyecto> model = new List<Proyecto>();
            using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@id", Session["usuario_id"]);

                connection.Open();                
                SqlDataReader reader = command.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        var details = new Proyecto();
                        details.nombre= reader["nombre"].ToString();
                        details.id= Convert.ToInt32(reader["id"]);
                        model.Add(details);
                    }
                }
            }
            return View("Index", model);
        }

        
        public ActionResult New()
        {
            return View();
        }

        [HttpPost]
        public ActionResult crear_proyecto(string proyecto)
        {
            string query = "INSERT into proyecto(nombre, id_usuario) VALUES(@proyecto, @id)";
            using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@proyecto", proyecto);
                command.Parameters.AddWithValue("@id", Session["usuario_id"]);
                connection.Open();
                command.ExecuteNonQuery();
                return RedirectToAction("Index", "Proyecto", null);
            }
        }
        public ActionResult Edit(int id)
        {
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
                    ViewBag.nombre = reader["nombre"];
                }
            }
            return View();
        }

        [HttpPost]
        public ActionResult editar_proyecto(int id, string proyecto)
        {
            string query = "UPDATE proyecto SET nombre = @nombre WHERE id = @id";
            using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@nombre", proyecto);
                command.Parameters.AddWithValue("@id", id);
                connection.Open();
                command.ExecuteNonQuery();
                return RedirectToAction("Index", "Proyecto", null);
            }
        }

        public ActionResult Delete(int id)
        {
            string query = "delete  from proyecto WHERE id = @id";
            string query2 = "delete  from proyecto_detalle WHERE proyecto_id = @id";
            using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@id", id);

                SqlCommand command2 = new SqlCommand(query2, connection);
                command2.Parameters.AddWithValue("@id", id);

                connection.Open();
                command2.ExecuteNonQuery();
                command.ExecuteNonQuery();
                return RedirectToAction("Index", "Proyecto", null);
            }
        }
    }
}