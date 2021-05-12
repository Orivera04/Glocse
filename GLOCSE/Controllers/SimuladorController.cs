using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
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
            string proyeccion_1 = "SELECT * FROM proyecto_detalle where proyecto_id = @id and proyeccion_id = 1";
            string proyeccion_2 = "SELECT * FROM proyecto_detalle where proyecto_id = @id and proyeccion_id = 2";
            string proyeccion_3 = "SELECT * FROM proyecto_detalle where proyecto_id = @id and proyeccion_id = 3";

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
                    ViewBag.latitud = reader["latitud"];
                    ViewBag.longitud = reader["longitud"];
                    ViewBag.potencias_aleatorias = reader["potencias_aleatorias"].ToString();
                    ViewBag.intervalo_poligono = reader["intervalo_poligono"];
                    ViewBag.opacidad_borde = reader["opacidad_borde"];
                    ViewBag.opacidad_relleno = reader["opacidad_relleno"];

                    /* Primera Proyeccion */
                    SqlCommand proyeccion_1_comando = new SqlCommand(proyeccion_1, connection);
                    proyeccion_1_comando.Parameters.AddWithValue("@id", id);
                    ArrayList objs1 = new ArrayList();
                    SqlDataReader reader2 = proyeccion_1_comando.ExecuteReader();
                    if (reader2.HasRows)
                    {
                        while (reader2.Read())
                        {                        
                            objs1.Add(new
                            {

                                latitud = reader2["latitud"].ToString(),
                                longitud = reader2["longitud"].ToString(),
                                marcador_id = reader2["marcador_id"],
                                categoria_carga_id = reader2["categoria_carga_id"],
                                proyeccion_id = 1

                            });
                        }
                    }

                    /* Segunda Proyeccion */
                    SqlCommand proyeccion_2_comando = new SqlCommand(proyeccion_2, connection);
                    proyeccion_2_comando.Parameters.AddWithValue("@id", id);
                    ArrayList objs2 = new ArrayList();
                    SqlDataReader reader3 = proyeccion_2_comando.ExecuteReader();
                    if (reader3.HasRows)
                    {
                        while (reader3.Read())
                        {
                            objs2.Add(new
                            {

                                latitud = reader3["latitud"],
                                longitud = reader3["longitud"],
                                marcador_id = reader3["marcador_id"],
                                categoria_carga_id = reader3["categoria_carga_id"],
                                proyeccion_id = 2

                            });
                        }
                    }

                    /* Tecera Proyeccion */
                    SqlCommand proyeccion_3_comando = new SqlCommand(proyeccion_3, connection);
                    proyeccion_3_comando.Parameters.AddWithValue("@id", id);
                    ArrayList objs3 = new ArrayList();
                    SqlDataReader reader4 = proyeccion_3_comando.ExecuteReader();
                    if (reader4.HasRows)
                    {
                        while (reader4.Read())
                        {
                            objs3.Add(new
                            {

                                latitud = reader4["latitud"],
                                longitud = reader4["longitud"],
                                marcador_id = reader4["marcador_id"],
                                categoria_carga_id = reader4["categoria_carga_id"],
                                proyeccion_id = 3

                            });
                        }
                    }
                    ViewBag.proyeccion_1 = JsonConvert.SerializeObject(objs1);
                    ViewBag.proyeccion_2 = JsonConvert.SerializeObject(objs2);
                    ViewBag.proyeccion_3 = JsonConvert.SerializeObject(objs3);

                }
            }
            Session["id_proyecto"] = id;
            return View();
        }
        
        public ActionResult Plantilla()
        {
            return File("~/Assets/Plantilla.xlsx", System.Net.Mime.MediaTypeNames.Application.Octet, Path.GetFileName("~/Assets/Plantilla.xlsx"));
        }
        public ActionResult Manual()
        {
            return File("~/Assets/Manual.pdf", System.Net.Mime.MediaTypeNames.Application.Octet, Path.GetFileName("~/Assets/Manual.pdf"));
        }

        [HttpPost]
        public ActionResult GuardarProyecto(string proyeccion_1, string proyeccion_2, string proyeccion_3, decimal centro_latitud, decimal centro_longitud, 
                                            bool PotenciasAleatorias, decimal intervalo_poligono, decimal opacidad_borde, decimal opacidad_relleno)
        {
            dynamic p1 = JsonConvert.DeserializeObject<Object>(proyeccion_1);
            dynamic p2 = JsonConvert.DeserializeObject<Object>(proyeccion_2);
            dynamic p3 = JsonConvert.DeserializeObject<Object>(proyeccion_3);
           
            string query = "DELETE FROM proyecto_detalle where proyecto_id = @id";
            string query_2 = "DELETE FROM marcador_detalle where proyecto_detalle_id IN (select id from proyecto_detalle where proyecto_id = @id);";
            string query_update = "UPDATE proyecto set latitud = @latitud, longitud = @longitud, potencias_aleatorias = @flg_aleatorias, intervalo_poligono = @ip, opacidad_borde = @op, opacidad_relleno = @or where id = @id;";

            using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString))
            {

                connection.Open();

                SqlCommand command2 = new SqlCommand(query_2, connection);
                command2.Parameters.AddWithValue("@id", Session["id_proyecto"]);
                command2.ExecuteNonQuery();

                SqlCommand command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@id", Session["id_proyecto"]);
                command.ExecuteNonQuery();                

                SqlCommand command3 = new SqlCommand(query_update, connection);
                command3.Parameters.AddWithValue("@latitud", centro_latitud);
                command3.Parameters.AddWithValue("@longitud", centro_longitud);
                command3.Parameters.AddWithValue("@flg_aleatorias", PotenciasAleatorias);
                command3.Parameters.AddWithValue("@ip", intervalo_poligono);
                command3.Parameters.AddWithValue("@op", opacidad_borde);
                command3.Parameters.AddWithValue("@or", opacidad_relleno);
                command3.Parameters.AddWithValue("@id", Session["id_proyecto"]);
                command3.ExecuteNonQuery();

                string query_insert_detalle = "INSERT INTO proyecto_detalle(proyecto_id, latitud, longitud, marcador_id, categoria_carga_id, proyeccion_id) VALUES(@proyecto_id, @latitud, @longitud, @marcador_id, @categoria_carga_id, @proyeccion_id)";
                string query_insert_horas = "INSERT INTO marcador_detalle(proyecto_detalle_id, potencia, hora) VALUES((select max(id) from proyecto_detalle), @potencia, @hora)";

                foreach (var marcador in p1)
                {
                    int proyecto_id = Convert.ToInt32(Session["id_proyecto"]);
                    string latitud = marcador.Latitud;
                    string longitud = marcador.Longitud;
                    int marcador_id = marcador.marcador_id;
                    int categoria_id = marcador.Categoria;
                    int proyeccion_id = 1;

                    SqlCommand command4 = new SqlCommand(query_insert_detalle, connection);
                    command4.Parameters.AddWithValue("@proyecto_id", Session["id_proyecto"]);
                    command4.Parameters.AddWithValue("@latitud", latitud);
                    command4.Parameters.AddWithValue("@longitud", longitud);
                    command4.Parameters.AddWithValue("@marcador_id", marcador_id);
                    command4.Parameters.AddWithValue("@categoria_carga_id", categoria_id);
                    command4.Parameters.AddWithValue("@espacio_trabajo_id", 0);
                    command4.Parameters.AddWithValue("@proyeccion_id", proyeccion_id);
                    command4.ExecuteNonQuery();

                    int hora = 0;

                                            /*
                        foreach (var horas in marcador.Horas)
                        {
                            SqlCommand command5 = new SqlCommand(query_insert_horas, connection);
                            command5.Parameters.AddWithValue("@hora", hora);
                            command5.Parameters.AddWithValue("@potencia", horas.Value);
                            command5.ExecuteNonQuery();
                        }
                        */

                }

                foreach (var marcador in p2)
                {
                    int proyecto_id = Convert.ToInt32(Session["id_proyecto"]);
                    string latitud = marcador.Latitud;
                    string longitud = marcador.Longitud;
                    int marcador_id = marcador.marcador_id;
                    int categoria_id = marcador.Categoria;
                    int proyeccion_id = 2;

                    SqlCommand command4 = new SqlCommand(query_insert_detalle, connection);
                    command4.Parameters.AddWithValue("@proyecto_id", Session["id_proyecto"]);
                    command4.Parameters.AddWithValue("@latitud", latitud);
                    command4.Parameters.AddWithValue("@longitud", longitud);
                    command4.Parameters.AddWithValue("@marcador_id", marcador_id);
                    command4.Parameters.AddWithValue("@categoria_carga_id", categoria_id);
                    command4.Parameters.AddWithValue("@espacio_trabajo_id", 0);
                    command4.Parameters.AddWithValue("@proyeccion_id", proyeccion_id);
                    command4.ExecuteNonQuery();

                    int hora = 0;

                                        /*
                     foreach (var horas in marcador.Horas)
                     {
                         SqlCommand command5 = new SqlCommand(query_insert_horas, connection);
                         command5.Parameters.AddWithValue("@hora", hora);
                         command5.Parameters.AddWithValue("@potencia", horas.Value);
                         command5.ExecuteNonQuery();
                     }
                     */

                }

                foreach (var marcador in p3)
                {
                    int proyecto_id = Convert.ToInt32(Session["id_proyecto"]);
                    string latitud = marcador.Latitud;
                    string longitud = marcador.Longitud;
                    int marcador_id = marcador.marcador_id;
                    int categoria_id = marcador.Categoria;
                    int proyeccion_id = 3;

                    SqlCommand command4 = new SqlCommand(query_insert_detalle, connection);
                    command4.Parameters.AddWithValue("@proyecto_id", Session["id_proyecto"]);
                    command4.Parameters.AddWithValue("@latitud", latitud);
                    command4.Parameters.AddWithValue("@longitud", longitud);
                    command4.Parameters.AddWithValue("@marcador_id", marcador_id);
                    command4.Parameters.AddWithValue("@categoria_carga_id", categoria_id);
                    command4.Parameters.AddWithValue("@espacio_trabajo_id", 0);
                    command4.Parameters.AddWithValue("@proyeccion_id", proyeccion_id);
                    command4.ExecuteNonQuery();

                    int hora = 0;
                    /*
                    foreach (var horas in marcador.Horas)
                    {
                        SqlCommand command5 = new SqlCommand(query_insert_horas, connection);
                        command5.Parameters.AddWithValue("@hora", hora);
                        command5.Parameters.AddWithValue("@potencia", horas.Value);
                        command5.ExecuteNonQuery();
                    }
                    */
                }
            }


            return Json(new { exito = true, JsonRequestBehavior.AllowGet });
        }
    }
}