var ImagenUsuario = "";
$(document).ready(function () {    
    $("#BtIniciarSesion").click(function ()
    {        
        $.ajax({
            url: "../../Usuarios/VerificarLogin",
            type: "POST",
            data: { Usuario: document.getElementById('Usuario').value, Contraseña: document.getElementById('Contraseña').value },
            success: function (Respuesta)
            {
                if (!(Respuesta.includes('window')))
                {
                    alert(Respuesta)
                }                                
            },
            error: function (Respuesta)
            {
                alert("Se he perdido la conexión con el servidor");
            }
        });
    });

    $("#BtRegistrarse").click(function ()
    {
        document.getElementById('Login').style.display = "none";
        document.getElementById('Registro').style.display = "block";
    });

    $("#BtRegistrarseBBDD").click(function ()
    {
        $.ajax({
            url: "../../Usuarios/RegistroUsuarios",
            type: "POST",
            data: { Usuario: document.getElementById('UsuarioRegistrar').value, Contraseña: document.getElementById('ContraseñaRegistrar').value, Correo: document.getElementById('CorreoRegistrar').value,Imagen:ImagenUsuario},
            success: function (Respuesta)
            {
                if (!(Respuesta.includes('window')))
                {
                    alert(Respuesta)
                }
            },
            error: function (Respuesta)
            {
                alert("Se he perdido la conexión con el servidor");
            }
        });
    });
      

    $("#Imagen").change(function (Archivo)
    {
        if (this.files && this.files[0])
        {            
            var FR = new FileReader();
            FR.addEventListener("load", function (e)
            {
                ImagenUsuario = e.target.result;
            });
            FR.readAsDataURL(this.files[0]);
        }
    });
});
