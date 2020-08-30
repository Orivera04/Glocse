using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace GLOCSE.Models
{
    /*
    |-----------------------------------------------------|
    | Definicion : Realiza Operaciones con la BBDD Desde  |
    |              Inicialización de la misma hasta cons  |
    |              ultas de contenido en la BBDD          |
    |-----------------------------------------------------|
    */

    public class BBDDOperaciones
    {
        String CadenaConexionBBDD = "Server=tcp:glocse.database.windows.net,1433;Initial Catalog=GLOCSEBBDD;Persist Security Info=False;User ID='oscar';Password='QGF58()LP';MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";
        SqlConnection Conexion;
        SqlCommand Comando;


        /*
          |------------------------------------------------------------|
          | Definicion : Reliza operaciones de conexión con la BBDD    |
          | Parametros : 1 (Abre la conexión a la BBDD y la inicializa |
          |              2 (Verifica si la conexión sigue existiendo)  |
          |------------------------------------------------------------|
        */
        public bool ConexionBBDD(int Parametro)
        {
            if (Parametro == 1)
            {
                try
                {
                    Conexion = new SqlConnection(CadenaConexionBBDD);
                    Conexion.Open();
                }
                catch (SqlException e)
                {
                    return false;
                }
                return true;
            }
            else
            {
                if (Conexion != null && Conexion.State == ConnectionState.Open)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        /*
        |------------------------------------------------------------------------|
        | Definicion : Revisa si un usuario existe en la BBDD                    |
        | Parametros : Usuario Cadena que contiene el nombre del usuario         |
        |              Contraseña Cadena que contiene la contraseña del usuario  |
        |------------------------------------------------------------------------|
      */
        public bool LoginUsuario(String Usuario, String Contraseña)
        {
            String Consulta = "select U.Nombre , U.Contraseña from Usuarios_GLOCSE U"
                              + " where U.Nombre = '" + Usuario + "' AND U.Contraseña = '" + Contraseña + "'";
            Comando = new SqlCommand(Consulta, Conexion);
            if (Comando.ExecuteScalar() != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool RegistrarUsuario(String Usuario, String Contraseña, String Correo, String Imagen)
        {
            if (LoginUsuario(Usuario, Contraseña) == false)
            {
                String Consulta = "INSERT INTO Usuarios_GLOCSE (Nombre, Contraseña,Correo,Imagen)" + "VALUES('" + Usuario + "','" + Contraseña + "','" + Correo + "','" + Imagen + "')";
                Comando = new SqlCommand(Consulta, Conexion);
                Comando.ExecuteNonQuery();
                return true;
            }
            else
            {
                return false;
            }
        }
        
    }
}