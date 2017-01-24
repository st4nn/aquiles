function iniciarModulo()
{
	$("#lblHeader_NomModulo").text("Importar Datos");

    $("#txtImportar_Prefijo").val(obtenerPrefijo());

    $("#cntImportar_Archivos").iniciarObjImportarArchivos({Prefijo : $("#txtImportar_Prefijo"), Proceso: $("#txtImportar_Proceso"), Usuario: Usuario.id});

}

