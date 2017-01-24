$(document).ready(arranque);
function arranque()
{
	if(localStorage.reg_agromil)
	{window.location.replace("home.html");}

	$("#Login").submit(Login_Submit);
}

function Login_Submit(evento)
{
	evento.preventDefault();
	if (validar("#Login"))
	{
		var cDate = new Date();
		$.post("server/php/proyecto/login/validarUsuario.php", 
	    {
	      pUsuario : $("#txtLogin_Usuario").val(),
	      pClave : md5(md5(md5($("#txtLogin_Clave").val()))),
	      pFecha : cDate
	    }, function (data)
	    {
	      if (data != 0)
	      {
	      	if (typeof(data) == "object")
	      	{
	        	localStorage.setItem("reg_agromil", JSON.stringify(data));  
	        	window.location.replace("home.html");
	      	}
	      } else
	      {
	      	priAlert("Error!", "Acceso Denegado", "error");
	      }
	      
	    }, 'json').fail(function()
	    {
	    	priAlert("Error!", "No hay conexión.", "error");
	    });
	} 
}
function validar(elemento)
{
	var obj = $(elemento + ' [required]');
	var bandera = true;
	$.each(obj, function(index, val) 
	{
		 if (($(val).prop("tagName") == "SELECT" && $(val).val() == 0) || $(val).val() == "")
		 {
		 	$(val).focus();
		 	bandera = false;
			return false;
		 }
	});
	return bandera;
}
function priAlert(Titulo, Mensaje, Tipo)
{
  swal({
              title: Titulo,
              text: Mensaje,
              type: Tipo,
              timer: 2000,
              showConfirmButton: false
          });
}