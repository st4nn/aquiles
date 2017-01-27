function iniciarModulo()
{
	$("#lblHeader_NomModulo").text("Importar Datos");

    $("#txtImportar_Prefijo").val(obtenerPrefijo());

    $("#cntImportar_Archivos").iniciarObjImportarArchivos({objProceso: $("#txtImportar_Proceso"), Usuario: Usuario.id});
}

