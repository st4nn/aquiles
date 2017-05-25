function iniciarModulo()
{
	$("#lblHeader_NomModulo").text("Importar Datos");

    $("#txtImportar_Prefijo").val(obtenerPrefijo());

    $("#cntImportar_Archivos").iniciarObjImportarArchivos({objProceso: $("#txtImportar_Proceso"), Usuario: Usuario.id});

    cargarOpcionesImportacion();
}

function cargarOpcionesImportacion()
{
	$("#txtImportar_Proceso option").remove();

	$.post('server/php/proyecto/importar/cargarOpcionesImportacion.php', {Usuario: Usuario.id}, function(data, textStatus, xhr) 
    {
    	if (data != 0)
    	{
    		var tds = '';
	    	$.each(data, function(index, val) 
	    	{
	    		 tds += '<option value="' + val.Nombre + '">' + val.Texto + '</option>';
	    	});

	    	$("#txtImportar_Proceso").append(tds);
    	} else
    	{
 		   	priAlert("Hey!", "No tienes opciones disponibles para importar", "error");
    	}
	}, 'json');
}