function iniciarModulo()
{
	$("#frmCrearUsuario").on("submit", function(evento)
    {
        evento.preventDefault();

        if ($("#txtUsuarios_CrearUsuario_Nombre").val() == "")
        {
            Mensaje("Error", "El Usuario no puede estar en Blanco", "danger");
        } else
        {
            if ($("#txtUsuarios_CrearUsuario_Correo").val() == "")
            {
                Mensaje("Error", "El Correo no puede estar en Blanco", "danger");
            } else
            {
                if ($("#txtUsuarios_CrearUsuario_Usuario").val() == "")
                {
                    Mensaje("Error", "El Usuario no puede estar en Blanco", "danger");
                } else
                {
                    if ($("#txtUsuarios_CrearUsuario_Clave").val().length < 8)
                    {
                        Mensaje("Error", "La clave debe tener mínimo 8 Caracteres", "danger");
                    } else
                    {
                        if ($("#txtUsuarios_CrearUsuario_NClave").val() != $("#txtUsuarios_CrearUsuario_Clave").val())
                        {
                            Mensaje("Error", "Las claves no coinciden,", "danger");
                        } else
                        {
                            $("#frmCrearUsuario").generarDatosEnvio("txtUsuarios_CrearUsuario_", function(datos)
                            {
                                $.post('server/php/proyecto/login/crearUsuario.php', {datos: datos}, function(data, textStatus, xhr) 
                                {
                                    if (data != 1)
                                    {
                                        swal({
                                              title: "Error",
                                              text: data,
                                              type: "error",
                                              timer: 2000,
                                              showConfirmButton: false
                                          });
                                    } else
                                    {
                                        $("#frmCrearUsuario")[0].reset();
                                        Mensaje("Ok", "El usuario ha sido ingresado y notificado por correo", "success");

                                        $("#modalWider").modal("hide");

                                        swal({
                                              title: "Usuario Creado",
                                              text: "El usuario ha sido ingresado y notificado por correo",
                                              type: "success",
                                              timer: 2000,
                                              showConfirmButton: false
                                          });
                                        
                                    }
                                });
                            });
                        }
                    }
                }
            }

        }


    });


}