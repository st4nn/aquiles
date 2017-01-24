function iniciarModulo()
{
	$("#lblHeader_NomModulo").text("Importar Datos");

    $("#txtImportar_Prefijo").val(obtenerPrefijo());

    $("#cntImportar_Archivos").iniciarObjImportarArchivos({Prefijo : $("#txtImportar_Prefijo"), Proceso: $("#txtImportar_Proceso"), Usuario: Usuario.id});

}

$.fn.iniciarObjImportarArchivos = function(parametros)
{
	var idObj = $(this).attr("id").replace("cnt", "");
	var tds = "";
	tds += '<div class="card">';
        tds += '<div class="card-header">';
            tds += '<h4 class="card-title">Archivos</h4>';
        tds += '</div>';
        tds += '<div class="card-body card-padding form-horizontal">';
            tds += '<div class="row">';
                tds += '<div id="cnt' + idObj + '_DivArchivo" class="fileinput fileinput-new col-sm-12">';
                    tds += '<span class="btn btn-primary btn-file btn-block waves-effect">';
                        tds += '<span class="fileinput-new">Agregar Archivo</span>';
                        tds += '<input id="txt' + idObj + '_Archivo" type="file" name="...">';
                    tds += '</span>';
                tds += '</div>';
            tds += '</div>';
            tds += '<div class="popular-post">';
                    tds += '<h2>Archivos Cargados</h2>';
               tds += '';
                tds += '<div class="m-t-20">';
                    tds += '<div id="cnt' + idObj + '_DivArchivo_Listado" class="list-group lg-alt">';
                    tds += '</div>';
                tds += '</div>';
            tds += '</div>';
        tds += '</div>';
    tds += '</div>';

    $(this).append(tds);
    tds = "";

    if ($("#cntImportar_Modal_Archivos").length == 0)
	{
	    tds += '<div class="modal fade" id="cntImportar_Modal_Archivos" tabindex="-1" role="dialog" aria-hidden="true">';
            tds += '<div class="modal-dialog">';
                tds += '<div class="modal-content">';
                    tds += '<form id="frmImportar_Modal_Archivo" class="form-horizontal" role="form">';
                        tds += '<div class="modal-header">';
                            tds += '<h4 class="modal-title">Guardar Archivo <span id="lblImportar_Modal_Archivo_Nombre"></span></h4>';
                        tds += '</div>';
                        tds += '<div class="modal-body">';
                            tds += '<div class="form-group">';
                                tds += '<div class="fg-line">';
                                    tds += '<textarea id="txtImportar_Modal_ArchivoDescripcion" class="form-control" rows="5" placeholder="Observaciones, Comentarios o Descripción del Archivo..."></textarea>';
                                tds += '</div>';
                            tds += '</div>';
                        tds += '</div>';
                        tds += '<div class="modal-footer">';
                            tds += '<button type="button" id="btnImportar_Modal_Archivo_Cancelar" class="btn btn-link waves-effect">Cancelar</button>';
                            tds += '<button type="submit" class="btn btn-link waves-effect">Enviar</button>';
                        tds += '</div>';
                    tds += '</form>';
                tds += '</div>';
            tds += '</div>';
        tds += '</div>';

        $("body").append(tds);

         $("#btnImportar_Modal_Archivo_Cancelar").on("click", function(evento)
		{
			evento.preventDefault();
			$("#cntImportar_Modal_Archivos").modal("hide");
		});

	    $('#txt' + idObj + '_Archivo').on("change", function(event)
	    {
	    	$("#txtImportar_Modal_ArchivoDescripcion").val("");
	    	$("#cntImportar_Modal_Archivos").modal("show");
	    	$("#lblImportar_Modal_Archivo_Nombre").text($(this).val().replace("C:\\fakepath\\", ""));
	    	$("#txtImportar_Modal_ArchivoDescripcion").focus();

	    	files = event.target.files;
	    });

	    $("#frmImportar_Modal_Archivo").on("submit", function(evento)
	    {
	    	evento.preventDefault();
		    $("#cntImportar_Modal_Archivos").modal("hide");

	    	var data = new FormData();

	    	$.each(files, function(key, value)
		    {
		        data.append(key, value);
		    });

		    parametros.Prefijo = $(parametros.Prefijo).val();
		    parametros.Proceso = $(parametros.Proceso).val();

		    if (parametros != undefined && parametros != null)
		    {
			    $.each(parametros, function(index, val) 
			    {
			    	data.append(index, val);
			    });
		    }


		    data.append("Observaciones", $("#txtImportar_Modal_ArchivoDescripcion").val());
		    var nomArchivo = files[0].name;

		    $.ajax({
			        url: 'server/php/subirArchivos.php',
			        type: 'POST',
			        data: data,
			        cache: false,
			        dataType: 'html',
			        processData: false, // Don't process the files
			        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
			        success: function(data, textStatus, jqXHR)
			        {
			            if( parseInt(data) >= 1)
			            {
			            	var extension = nomArchivo.split('.');
			            	if (extension.length > 0)
			            	{
			            		extension = extension[extension.length - 1];
			            	} else
			            	{
			            		extension = "obj";
			            	}
			            	var tds = " ";
			               	tds += '<a href="server/Archivos/' + parametros.Prefijo + '/' + nomArchivo + '" target="_blank" class="list-group-item media">';
	                            tds += '<div class="pull-left">';
	                                tds += '<div class="avatar-char ac-check">';
	                                    tds += '<span class="acc-helper palette-Red bg text-uppercase">' + extension + '</span>';
	                                tds += '</div>';
	                            tds += '</div>';
	                            tds += '<div class="media-body">';
	                                tds += '<div class="lgi-heading">' + nomArchivo.replace(extension, "") + '</div>';
	                                tds += '<small class="lgi-text">' + $("#txtImportar_Modal_ArchivoDescripcion").val() + '</small>';
	                            tds += '</div>';
	                        tds += '</a>';

	                        $('#cnt' + idObj + '_DivArchivo_Listado').prepend(tds);
			            }
			            else
			            {
			                Mensaje('Error:', data, "danger");
			            }
			        },
			        error: function(jqXHR, textStatus, errorThrown)
			        {
			            // Handle errors here
			            Mensaje('Error:', textStatus, "danger");
			            $("#cntIngresar_Archivo").modal("show");
			        }
			    });
	    });
    }
}