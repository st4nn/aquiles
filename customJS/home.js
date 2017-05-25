
function iniciarModulo()
{
	$("#lblHeader_NomModulo").text("Inicio");

	$(".datepicker").datetimepicker(
    {
        format: 'YYYY-MM-DD',
        inline: false,
        sideBySide: true,
        locale: 'es'
    });
	
	var fecha = obtenerFecha().substr(0, 10);
	
	$("#txtHome_Hasta").val(fecha);

	$("#cntHome_BotonesPeriodo button").on("click", function()
	{
		$("#cntHome_BotonesPeriodo .btn-primary").addClass('btn-default');
		$("#cntHome_BotonesPeriodo .btn-primary").removeClass('btn-primary');
		$(this).addClass('btn-primary');
	});

	$("#btnHome_Periodo_Hoy").on("click", function()
	{
		var fecha = obtenerFecha().substr(0, 10);
		cargarInicio(fecha, fecha);

		$("#lblHome_Periodo").text("Datos de Hoy");
	});

	$("#btnHome_Periodo_Ayer").on("click", function()
	{
		var fecha = obtenerFecha().substr(0, 10);
		fecha = sumarFecha(fecha, 0);

		cargarInicio(fecha, fecha);

		$("#lblHome_Periodo").text("Datos de Ayer");
	});

	$("#btnHome_Periodo_Mes").on("click", function()
	{
		var fecha = obtenerFecha().substr(0, 10);
		var fechaIni = "";

		fechaIni = fecha.substr(0, 7) + "-01";

		cargarInicio(fechaIni, fecha);

		$("#lblHome_Periodo").text("Datos de lo transcurrido del Mes");
	});

	$("#btnHome_Periodo_Anio").on("click", function()
	{
		var fecha = obtenerFecha().substr(0, 10);
		var fechaIni = "";

		fechaIni = fecha.substr(0, 4) + "-01-01";

		cargarInicio(fechaIni, fecha);

		$("#lblHome_Periodo").text("Datos de lo transcurrido del Año");
	});

	$("#txtHome_Desde, #txtHome_Hasta").on("dp.change", function()
	{
		var fecha = $("#txtHome_Hasta").val();
		var fechaIni = $("#txtHome_Desde").val();

		if (fecha != "" && fechaIni != "")
		{
			if (fecha < fechaIni)
			{
				fecha = fechaIni;
				$("#txtHome_Hasta").val(fechaIni);
			}
		}

		cargarInicio(fechaIni, fecha);

		var desde = '';
		var hasta = '';

		if (fechaIni != '')
		{
			desde = ' desde ' + fechaIni;
		}

		if (fecha != '')
		{
			hasta = ' hasta ' + fecha;
		}

		$("#lblHome_Periodo").text("Datos " + desde + hasta);
	});

	$("#btnHome_Periodo_Hoy").trigger('click');
}

function cargarInicio(Desde, Hasta)
{
	Desde = Desde || '';
	Hasta = Hasta || '';


	$("#cntHome_ManiobrasRealizadas").cargarDatosInicio('ManiobrasRealizadas', cargarDatosInicio_FuncionBasica, false, Desde, Hasta, "div", 'Maniobras Cerradas', function(){}, 'caret-right-circle');

	$("#cntHome_TrafosPorEstado").cargarDatosInicio('TrafosPorEstado', cargarDatosInicio_FuncionBasica, false, Desde, Hasta, "div", 'Activos', function(){}, 'caret-right-circle');

	$("#cntHome_ManiobrasSinCerrar").cargarDatosInicio('ManiobrasSinCerrar', cargarDatosInicio_FuncionBasica, false, Desde, Hasta, "div", 'Maniobras sin Cerrar', function(){}, 'caret-right-circle');

	/*$("#cntHome_ValorPorGrupoContable").cargarDatosInicio('ValorPorGrupoContable', cargarDatosInicio_FuncionBasica, false, Desde, Hasta, "div", 'Activos', function(){}, 'money');

	$("#cntHome_ValorPorTipoDeInventario").cargarDatosInicio('ValorPorTipoDeInventario', cargarDatosInicio_FuncionBasica, false, Desde, Hasta, "div", 'Activos', function(){}, 'money');

	$("#cntHome_ValorPorCiudad").cargarDatosInicio('ValorPorCiudad', cargarDatosInicio_FuncionBasica, false, Desde, Hasta, "div", 'Activos', function(){}, 'money');


	$("#cntHome_ActivosPorArea").cargarDatosInicio('cargarActivosPorArea', function(data)
	{
		var tds = "";
		var TotalIngresos = data[(data.length-1)].TotalIngresos;
		var TotalSalidas = data[(data.length-1)].TotalSalidas;

		var PorcentajeIngresos = 0;
		var PorcentajeSalidas = 0;

		var color = "";

		$.each(data, function(index, val) 
		{
			color = obtenerColor();

			PorcentajeIngresos = ((val.Ingresos/TotalIngresos) * 100).toFixed(2);
			PorcentajeSalidas = ((val.Salidas/TotalSalidas) * 100).toFixed(2);

			tds += '<div class="list-group-item media">';
	            tds += '<div class="media-body">';
	            	tds += '<div class="lgi-heading m-b-5 text-center">' + val.Nombre + '</div>';
	            	tds += '<div class="col-xs-4 text-right">' + format_number(val.Salidas);
	            	tds += '</div>';
	            	tds += '<div class="col-xs-2">';
		                tds += '<div class="progress">';
		                    tds += '<div class="progress-bar ' + color + ' palette bg pull-right" role="progressbar" aria-valuenow="' + val.Salidas + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + PorcentajeSalidas + '%">';
		                    tds += '</div>';
		                tds += '</div>';
		            tds += '</div>';
		            tds += '<div class="col-xs-2">';
		                tds += '<div class="progress">';
		                    tds += '<div class="progress-bar ' + color + ' palette bg" role="progressbar" aria-valuenow="' + val.Ingresos + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + PorcentajeIngresos + '%">';
		                    tds += '</div>';
		                tds += '</div>';
		            tds += '</div>';
		            tds += '<div class="col-xs-4 text-right">' + format_number(val.Ingresos);
	            	tds += '</div>';
	            tds += '</div>';
	        tds += '</div>';
		});

        return tds;
	}, false, Desde, Hasta, "div", 'Movimiento de Materia Prima');
	*/
}

$.fn.cargarDatosInicio = function(url, laFuncion,  funcionEach, Desde, Hasta, tipoContenedor, tipoDatos, callback, icono)
{
	if (callback === undefined)
	{
		callback = function(){};
	}

	var obj = this;
	if (url != "")
	{
		$(obj).find(tipoContenedor).remove();

		$.post('server/php/proyecto/inicio/' + url + '.php', {Usuario: Usuario.id, Desde : Desde, Hasta : Hasta}, function(data, textStatus, xhr) 
		{
			if (data != 0)
			{
				if (laFuncion === false)
				{
					laFuncion = function(data)
					{
						var tds = "";
						$.each(data, function(index, val) 
						{
							tds += funcionEach(index, val);
						});

						return tds;
					}
				} 

				var tds = laFuncion(data, icono);

				$(obj).append(tds);

				callback();
			} else
			{
				var tds = "";
				tds += '<div class="card c-dark">';
                    tds += '<div class="card-header">';
                        tds += 'Aún no se han reportado datos de ' + tipoDatos + ' para el periodo seleccionado';
                    tds += '</div>';
                tds += '</div>';

                $(obj).append(tds);
			}
		}, "json");
	}
}

function easyPieChart(id, barColor, trackColor, scaleColor, lineWidth, size) 
{
    $('.'+id).easyPieChart({
        easing: 'easeOutBounce',
        barColor: barColor,
        trackColor: trackColor,
        scaleColor: scaleColor,
        lineCap: 'square',
        lineWidth: lineWidth,
        size: size,
        animate: 3000,
        onStep: function(from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
        }
    });
}

function cargarDatosInicio_FuncionBasica(data, icono)
{
	var tds = "";
	var Total = data[(data.length-1)].Total;

	icono = icono || 'caret-right-circle';

	var Porcentaje = 0;

	$.each(data, function(index, val) 
	{
		Porcentaje = ((val.Cantidad/Total) * 100).toFixed(2);
		tds += '<div class="list-group-item media">';
            tds += '<div class="pull-left">';
              tds += '<i class="zmdi zmdi-' + icono + '"></i>';
            tds += '</div>';
            tds += '<div class="pull-right">' + format_number(val.Cantidad) + '</div>';
            tds += '<div class="media-body">';
            	tds += '<div class="lgi-heading m-b-5">' + val.Producto + '</div>';
                tds += '<div class="progress">';
                    tds += '<div class="progress-bar palette-Red palette bg" role="progressbar" aria-valuenow="' + val.Cantidad + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + Porcentaje + '%">';
                    tds += '</div>';
                tds += '</div>';
            tds += '</div>';
        tds += '</div>';
	});

    return tds;
}