using GLOCSE.Models;
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
    public class UsuarioController : Controller
    {
        [HandleError]
        // GET: Usuario
        public ActionResult Index()
        {
            string query = "SELECT * FROM usuario;";
            List<Usuario> model = new List<Usuario>();
            using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        var details = new Usuario();
                        details.usuario= reader["usuario"].ToString();
                        details.nombre= reader["nombre"].ToString();
                        details.id = Convert.ToInt32(reader["id"]);
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
        public ActionResult crear_usuario(string nombre, string apellido, string usuario, string password, HttpPostedFileBase imagen)
        {
            byte[] fileInBytes = new byte[imagen.ContentLength];
            using (BinaryReader theReader = new BinaryReader(imagen.InputStream))
            {
                fileInBytes = theReader.ReadBytes(imagen.ContentLength);
            }
            string fileAsString = Convert.ToBase64String(fileInBytes);

            string query = "INSERT into usuario(nombre, apellido, usuario, password, imagen_perfil, activo) VALUES(@nombre, @apellido, @usuario, @password, @imagen, @activo)";
            using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@nombre", nombre);
                command.Parameters.AddWithValue("@apellido", apellido);
                command.Parameters.AddWithValue("@usuario", usuario);
                command.Parameters.AddWithValue("@password", password);
                command.Parameters.AddWithValue("@imagen", fileAsString);
                command.Parameters.AddWithValue("@activo", true);
                connection.Open();
                command.ExecuteNonQuery();
                return RedirectToAction("Index", "Usuario", null);
            }
        }

        public ActionResult Delete(int id)
        {
            string query = "delete  from usuario WHERE id = @id";
            string query_existe = "select count(*) from proyecto where id_usuario = @id_usuario";
            using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                connection.Open();
                SqlCommand command_existe = new SqlCommand(query_existe, connection);
                command_existe.Parameters.AddWithValue("@id_usuario", id);
                int resultado = (int)command_existe.ExecuteScalar();

                if (resultado == 0)
                {
                    SqlCommand command = new SqlCommand(query, connection);
                    command.Parameters.AddWithValue("@id", id);
                    command.ExecuteNonQuery();
                }
                else
                {
                    TempData["Error"] = "No se puede borrar el usuario, existen proyectos asociados.";
                }
                return RedirectToAction("Index", "Usuario", null);
            }
        }

        public ActionResult Edit(int id)
        {
            string query = "SELECT * FROM usuario where id = @id;";
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
                    ViewBag.apellido = reader["apellido"];
                    ViewBag.usuario= reader["usuario"];
                    ViewBag.nombre= reader["nombre"];
                    ViewBag.imagen = reader["imagen_perfil"];

                }
            }
            return View();
        }

        [HttpPost]
        public ActionResult editar_usuario(int id, string nombre, string apellido, string usuario, string password, HttpPostedFileBase imagen)
        {

            string query1 = "SELECT * FROM usuario where id = @id;";
            string imagen_perfil = "";
            using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                SqlCommand command = new SqlCommand(query1, connection);
                command.Parameters.AddWithValue("@id", id);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                reader.Read();
                imagen_perfil = reader["imagen_perfil"].ToString();
            }

            string fileAsString = "";
            if (imagen != null)
            {
                byte[] fileInBytes = new byte[imagen.ContentLength];
                using (BinaryReader theReader = new BinaryReader(imagen.InputStream))
                {
                    fileInBytes = theReader.ReadBytes(imagen.ContentLength);
                }
                fileAsString = Convert.ToBase64String(fileInBytes);
            }

            string query = "UPDATE usuario SET nombre = @nombre, apellido = @apellido, usuario = @usuario, password = @password, imagen_perfil=@imagen WHERE id = @id";
            using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@id", id);
                command.Parameters.AddWithValue("@nombre", nombre);
                command.Parameters.AddWithValue("@apellido", apellido);
                command.Parameters.AddWithValue("@usuario", usuario);
                command.Parameters.AddWithValue("@password", password);
                if(imagen != null)
                {
                    command.Parameters.AddWithValue("@imagen", fileAsString);
                }
                else
                {
                    command.Parameters.AddWithValue("@imagen", imagen_perfil);

                }
                connection.Open();
                command.ExecuteNonQuery();
                return RedirectToAction("Index", "Usuario", null);
            }
        }
    }
}