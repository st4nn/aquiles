function iniciarModulo()
{
	$("#lblHeader_NomModulo").text("Maniobras");

    $("#cntImportar_Archivos").iniciarObjImportarArchivos({objProceso: $("#txtImportar_Proceso"), Usuario: Usuario.id});

    $("#frmManiobras_Registro .datepicker").datetimepicker(
    {
        format: 'YYYY-MM-DD',
        inline: true,
        sideBySide: true,
        locale: 'es'
    });

    maniobras_cargarManiobrasSinCerrar(obtenerFecha().substr(0, 10));
    maniobras_cargarUltimosRegistros(obtenerFecha().substr(0, 10));


    $("#txtManiobras_Hora").val(obtenerFecha().substr(11, 5));
    $("#txtManiobras_Hora").datetimepicker({
        format: 'Z'
    });

    setInterval(function()
    {
    	$("#txtManiobras_Hora").val(obtenerFecha().substr(11, 5));
	}, 30000);

	$("#txtManiobras_Evento").focus();

	$("#txtManiobras_Fecha").on("change", function(evento)
		{
			maniobras_cargarManiobrasSinCerrar($(this).val());
			maniobras_cargarUltimosRegistros($(this).val())
		});

	$("#txtManiobras_Evento").on("change", function(evento)
		{
			$.post('server/php/proyecto/maniobras/cargarNoTrafo.php', {Usuario : Usuario.id, Nodo : $("#txtManiobras_Evento").val(), fecha : $("#txtManiobras_Fecha").val()}, function(data, textStatus, xhr) 
			{
				if (data == 0)
				{
					Mensaje("Error", "Ese nodo no está programado", "danger");
				} else
				{
					if (data == 8)
					{
						Mensaje("Error", "El nodo está programado pero no para la fecha indicada", "warning");
					} else
					{
						$("#txtManiobras_Trafo").val(data);
					}
				}
			}, 'json');
		});

	$("#frmManiobras_Registro").on("submit", function(evento)
	{
		evento.preventDefault();
		$("#frmManiobras_Registro").generarDatosEnvio("txtManiobras_", function(datos)
		{
			$.post('server/php/proyecto/maniobras/registrarOperacion.php', {Usuario: Usuario.id, datos: datos}, function(data, textStatus, xhr) 
			{
				if (!isNaN(data))
				{
					Mensaje("Hey", "Los datos han sido Ingresados", "success");

					var parametros = {
						id : data,
						Evento : $("#txtManiobras_Evento").val(),
						Trafo :  $("#txtManiobras_Trafo").val(),
						Reporto : $("#txtManiobras_Reporto").val(),
						Observaciones : $("#txtManiobras_Observaciones").val(),
						Fecha : $("#txtManiobras_Fecha").val() + ' ' + $("#txtManiobras_Hora").val()
					};

					maniobras_AgregarASinCerrar(parametros, true);

					$("#frmManiobras_Registro")[0].reset();
					$("#txtManiobras_Fecha").val(obtenerFecha().substr(0, 10));
					$("#txtManiobras_Hora").val(obtenerFecha().substr(11, 5));
					$("#txtManiobras_Evento").focus();
				} else
				{
					Mensaje("Error",data, "danger");
				}
			});
		});
	});

	$(document).delegate('.lnkManiobras_Cerrar', 'click', function(event) {
		event.preventDefault();
		var idManiobra = $(this).attr("idManiobra");
		var fila = $(this).parent('div').parent("a");
		$.post('server/php/proyecto/maniobras/registrarCierre.php', {Usuario: Usuario.id, idManiobra: idManiobra}, function(data, textStatus, xhr) 
			{
				if (!isNaN(data))
				{
					Mensaje("Hey", "Los datos han sido Ingresados", "success");
					var strongs = $(fila).find(".cntManiobra_SinCerrar_Item_Campo");

					var parametros = {
						id : data,
						Evento : $(strongs[0]).text(),
						Trafo :  $(strongs[1]).text(),
						Reporto : $(strongs[2]).text(),
						Observaciones :  $(strongs[3]).text(),
						Desde : $(strongs[4]).text(),
						Hasta : obtenerFecha(),
						CierreEPM : false	
					};

					maniobras_AgregarUltimosRegistros(parametros, true);
					$(fila).remove();

				} else
				{
					Mensaje("Error",data, "danger");
				}
			});

		
	});

	$("#txtManiobras_UltimosRegistros_Filtrar").iniciarFiltroTextoContenedores(".cntManiobras_UltimosRegistros_Item");

	$("#txtManiobras_SinCerrar_Filtrar").iniciarFiltroTextoContenedores(".cntManiobra_SinCerrar_Item");

	$(document).delegate('.cntManiobra_SinCerrar_Item', 'click', function(event) 
	{
		event.preventDefault();
	});

	

	$(document).delegate('.chkManiobras_CierreEPM', 'click', function(event)
	{
		var valor = $(this).is(":checked");
		var idManiobra = $(this).attr("idManiobra");
		var obj = this;
		$.post('server/php/proyecto/maniobras/registrarCierreEPM.php', {Usuario: Usuario.id, idManiobra : idManiobra, Estado : valor}, function(data, textStatus, xhr) 
		{
			if (!isNaN(data))
			{
				Mensaje("Hey", "El cierre ha sido registrado", 'success');
			} else
			{
				$(obj).prop("checked", !valor);
			}
		});
	});

	$(document).delegate('.acc-check', 'click', function(event) 
	{
		var contenedor = $(this).parent('div').parent('div').parent('div');
		if ($(this).is(":checked"))
		{
			$(contenedor).css('text-decoration', 'line-through');
		} else
		{
			$(contenedor).css('text-decoration', 'none');
		}
	});
}

function maniobras_AgregarASinCerrar(parametro)
{
	var tds = "";
	tds +='<a href="#" class="list-group-item media cntManiobra_SinCerrar_Item">';
        tds +='<div class="pull-left">';
            tds += '<button class="btn palette-Blue-Grey bg waves-effect lnkManiobras_Cerrar" idManiobra="' + parametro.id + '"> Cerrar</button>';
        tds +='</div>';
        tds +='<div class="pull-right">';
            tds +='<div class="lgi-heading"><small>Trafo: </small><strong class="c-indigo f-20 cntManiobra_SinCerrar_Item_Campo">' + parametro.Trafo + '</strong></div>';
        tds +='</div>';
        tds +='<div class="media-body">';
        	tds +='<div class="lgi-heading"><small>Evento: </small><strong class="c-deeppurple f-20 cntManiobra_SinCerrar_Item_Campo">' + parametro.Evento + '</strong></div>';
            tds +='<div class="lgi-heading"><small>Reportó: </small><strong class="cntManiobra_SinCerrar_Item_Campo">' + parametro.Reporto + '</strong> </div>';
            tds +='<span class="cntManiobra_SinCerrar_Item_Campo">' + parametro.Observaciones + '</span>';
            tds += '<small class="lgi-text"><i class="cntManiobra_SinCerrar_Item_Campo">' + parametro.Fecha + '</i></small>';
        tds +='</div>';
    tds += '</a>';
	
	$("#cntManiobras_SinCerrar").prepend(tds);
}

function maniobras_cargarManiobrasSinCerrar(fecha)
{
	$("#cntManiobras_SinCerrar div").remove();
	$.post('server/php/proyecto/maniobras/cargarManiobrasSinCerrar.php', {Usuario: Usuario.id, fecha : fecha}, function(data, textStatus, xhr) 
	{
		if (data != 0)
		{
			$.each(data, function(index, val) 
			{
				maniobras_AgregarASinCerrar(val);
			});
		}
	}, 'json');
}

function maniobras_AgregarUltimosRegistros(parametro)
{
	var checked = "";
	var estiloChecked = "";
	if (parametro.cierreEPM == 1)
	{
		checked = 'checked="true"';
		estiloChecked = 'style="text-decoration : line-through;"'
	}

	var tds = "";
	tds += '<div class="cntManiobras_UltimosRegistros_Item" ' + estiloChecked + '>';
        tds += '<div class="pull-left">';
            tds += '<div class="avatar-char ac-check">';
                tds += '<input class="acc-check chkManiobras_CierreEPM" idManiobra="' + parametro.id + '" type="checkbox" ' + checked + '>';

                tds += '<span class="acc-helper palette-Green-900 bg">epm</span>';
            tds += '</div>';
        tds += '</div>';

        tds += '<div class="media-body">';
        	tds += '<div class="col-sm-6">';
        		tds += '<small>Evento: </small><strong class="c-indigo f-20">' + parametro.Evento + '</strong>';
	            tds += '<div class="lgi-heading"><small class="col-sm-3 text-right">Reportó: </small><strong class="col-sm-8">' + parametro.Reporto + '</strong></div>';
	            tds += '<div class="lgi-heading"><small class="col-sm-3 text-right">Trafo: </small><strong class="col-sm-8">' + parametro.Trafo + '</strong></div>';
	            tds += '<div class="lgi-heading"><small class="col-sm-3 text-right">Desde: </small><i class="col-sm-8" style="text-decoration:underline;">' + parametro.Desde + '</i></div>';
	            tds += '<div class="lgi-heading"><small class="col-sm-3 text-right">Hasta: </small><i class="col-sm-8" style="text-decoration:underline;">' + parametro.Hasta + '</i></div>';
	        tds += '</div>';
	        tds += '<div class="col-sm-6">';
	        	tds += '<p>' + parametro.Observaciones + '</p>';
	        tds += '</div>';
        tds += '</div>';
    tds += '</div>';
	
	$("#cntManiobras_UltimosRegistros").prepend(tds);
}

function maniobras_cargarUltimosRegistros(fecha)
{
	$("#cntManiobras_SinCerrar div").remove();
	$.post('server/php/proyecto/maniobras/cargarUltimosRegistros.php', {Usuario: Usuario.id, fecha : fecha}, function(data, textStatus, xhr) 
	{
		if (data != 0)
		{
			$.each(data, function(index, val) 
			{
				maniobras_AgregarUltimosRegistros(val);
			});
		}
	}, 'json');
}