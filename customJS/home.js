
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

	$("#cntHome_Produccion").cargarDatosInicio('cargarProducidoTotal', false, function(index, val)
	{
		var tds = "";

		tds += '<div class="col-sm-4">';
			tds += '<div class="card c-dark ' + obtenerColor() + ' bg">';
                tds += '<div class="card-header">';
                    tds += '<h2>' + val.NombreReferencia + ' <br><strong>' + val.Sacos + ' Sacos</strong></h2>';
                tds += '</div>';
                tds += '<div class="card-body card-padding">';
                    tds += '<h2 class="m-t-0 m-b-15 c-white">';
                        tds += '<i class="zmdi zmdi-caret-up-circle m-r-5"></i>';
                        tds += parseFloat(val.Peso).toFixed(2) + ' Kg';
                    tds += '</h2>';
                tds += '</div>';
            tds += '</div>';
        tds += '</div>';

        return tds;
	}, Desde, Hasta, "div", 'producción');

	$("#cntHome_Despachos").cargarDatosInicio('cargarDespachos', function(data)
	{
		var tds = "";
		var Total = data[(data.length-1)].Total;

		var Porcentaje = 0;

		$.each(data, function(index, val) 
		{
			Porcentaje = ((val.Cantidad/Total) * 100).toFixed(2);
			tds += '<div class="list-group-item media">';
	            tds += '<div class="pull-left">';
	              tds += '<i class="zmdi zmdi-truck"></i>';
	            tds += '</div>';
	            tds += '<div class="pull-right">' + val.Cantidad + '</div>';
	            tds += '<div class="media-body">';
	            	tds += '<div class="lgi-heading m-b-5">' + val.Producto + '</div>';
	                tds += '<div class="progress">';
	                    tds += '<div class="progress-bar ' + obtenerColor() + ' palette bg" role="progressbar" aria-valuenow="' + val.Cantidad + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + Porcentaje + '%">';
	                    tds += '</div>';
	                tds += '</div>';
	            tds += '</div>';
	        tds += '</div>';
		});

		tds += '<div class="col-sm-12 p-5 text-right d-block palette palette-Blue bg"><h4 class="text palette-White">Total de productos despachados ' + Total + '</h4></div>';

        return tds;
	}, false, Desde, Hasta, "div", 'despachos');

	$("#cntHome_DespachosPorCliente").cargarDatosInicio('cargarDespachosPorCliente', function(data)
	{
		var tds = "";
		var Total = data[(data.length-1)].Total;

		var Porcentaje = 0;
		var tmpCliente = "";
		var tmpClienteCantidad = 0;
		

		$.each(data, function(index, val) 
		{
			Porcentaje = ((val.Cantidad/Total) * 100).toFixed(2);
			tmpClienteCantidad += parseFloat(val.Cantidad);

			if ((val.Cliente != tmpCliente && val.Cliente > 0 && val.Cliente != data[0].Cliente) || index == 0)
			{
				tds += '<div class="list-group-item-header palette-Blue-Grey text">' + val.Cliente + '</div>';
			}
			
			tds += '<div class="list-group-item media">';
	            tds += '<div class="pull-left">';
	              tds += '<i class="zmdi zmdi-truck"></i>';
	            tds += '</div>';
	            tds += '<div class="pull-right">' + val.Cantidad + '</div>';
	            tds += '<div class="media-body">';
	            	tds += '<div class="lgi-heading m-b-5">' + val.Producto + '</div>';
	                tds += '<div class="progress text-right">';
	                    tds += '<div class="progress-bar ' + obtenerColor() + ' palette bg" role="progressbar" aria-valuenow="' + val.Cantidad + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + Porcentaje + '%">';
	                    tds += '</div>';
	                tds += '</div>';
	            tds += '</div>';
	        tds += '</div>';

	        if (val.Cliente != tmpCliente || (index == 0 && data.length == 1) || index == (data.length - 1))
			{
				if (index > 0 || (index == 0 && data.length == 1))
				{
					tds += '<div class="list-group-item-header text-right"><h5 class="text palette-Black">' + tmpClienteCantidad + ' Productos despachados a ' + val.Cliente + '</h5></div>';
					tmpClienteCantidad = 0;
					tmpCliente = val.Cliente;
				}
			}
		});

        return tds;
	}, false, Desde, Hasta, "div", 'despachos');

	$("#cntHome_MateriaPrima").cargarDatosInicio('cargarMateriaPrima', function(data)
	{
		var tds = "";
		var Total = data[(data.length-1)].Total;
		


		var PorcentajeIngresos = 0;
		var PorcentajeSalidas = 0;

		var color = "";

		$.each(data, function(index, val) 
		{
			color = obtenerColor();
			val.Salidas = val.Salidas * -1;

			PorcentajeIngresos = ((val.Ingresos/Total) * 100).toFixed(2);
			PorcentajeSalidas = ((val.Salidas/Total) * 100).toFixed(2);

			tds += '<div class="list-group-item media">';
	            tds += '<div class="media-body">';
	            	tds += '<div class="lgi-heading m-b-5 text-center">' + val.Nombre + '</div>';
	            	tds += '<div class="col-xs-2">' + parseFloat(val.Salidas).toFixed(1);
	            	tds += '</div>';
	            	tds += '<div class="col-xs-4">';
		                tds += '<div class="progress">';
		                    tds += '<div class="progress-bar ' + color + ' palette bg pull-right" role="progressbar" aria-valuenow="' + val.Salidas + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + PorcentajeSalidas + '%">';
		                    tds += '</div>';
		                tds += '</div>';
		            tds += '</div>';
		            tds += '<div class="col-xs-4">';
		                tds += '<div class="progress">';
		                    tds += '<div class="progress-bar ' + color + ' palette bg" role="progressbar" aria-valuenow="' + val.Ingresos + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + PorcentajeIngresos + '%">';
		                    tds += '</div>';
		                tds += '</div>';
		            tds += '</div>';
		            tds += '<div class="col-xs-2">' + parseFloat(val.Ingresos).toFixed(1);
	            	tds += '</div>';
	            tds += '</div>';
	        tds += '</div>';
		});

        return tds;
	}, false, Desde, Hasta, "div", 'Movimiento de Materia Prima');

	$("#cntHome_StockBodega").cargarDatosInicio('cargarStockBodega', function(data)
	{
		var tds = "";
		var Total = data[(data.length-1)].Total;

		var Porcentaje = 0;

		$.each(data, function(index, val) 
		{
			Porcentaje = ((val.Sacos/Total) * 100).toFixed(2);
			tds += '<div class="list-group-item media">';
	            tds += '<div class="pull-left">';
	              tds += '<i class="zmdi zmdi-local-mall zmdi-hc-fw"></i>';
	            tds += '</div>';
	            tds += '<div class="pull-right">' + val.Sacos + '</div>';
	            tds += '<div class="media-body">';
	            	tds += '<div class="lgi-heading m-b-5">' + val.NombreReferencia + '</div>';
	                tds += '<div class="progress">';
	                    tds += '<div class="progress-bar ' + obtenerColor() + ' palette bg" role="progressbar" aria-valuenow="' + val.Sacos + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + Porcentaje + '%">';
	                    tds += '</div>';
	                tds += '</div>';
	            tds += '</div>';
	        tds += '</div>';
		});
        return tds;
	}, false, Desde, Hasta, "div", 'despachos');

	$("#cntStockMateriaPrima").cargarDatosInicio('cargarStockMateriaPrima', function(data)
	{
		var tds = "";

		var contador = 2;
		var color = "";

		$.each(data, function(index, val) 
		{
			if (contador > 4)
			{
				contador = 2;
			}

			if (val.Cantidad == "")
			{
				val.Cantidad = 0;
			}

			color = "";
			if (parseFloat(val.Cantidad) < parseFloat(val.cantidadMinima) || (parseFloat(val.cantidadMaxima) > 0 && parseFloat(val.Cantidad) > parseFloat(val.cantidadMaxima)))
			{
				color = "palette-Red";
			}

			tds += '<div class="col-xs-4 col-sm-6 col-md-4 pg-item">';
                tds += '<div class="easy-pie-' + contador + ' easy-pie" data-percent="' + val.Porcentaje + '">';
                    tds += '<span class="ep-value ' + color + ' text">' + parseFloat(val.Cantidad).toFixed(1) + '</span>';
                tds += '</div>';
                tds += '<div class="pgi-title o-hidden ' + color + ' bg">' + val.Nombre + ' (<small>' + val.Unidades + '</small>)</div>';
            tds += '</div>';

            contador++;
		});

        return tds;
	}, false, Desde, Hasta, "div", 'Stock de Materia Prima', function()
	{
		easyPieChart('easy-pie', '#fff', 'rgba(0,0,0,0.08)', 'rgba(0,0,0,0)', 2, 75);
	});

	$("#cntHome_ServiciosPublicos").cargarDatosInicio('cargarServiciosPublicos', function(data)
	{
		var tds = "";
		var TotalConsumo = data[(data.length-1)].TotalConsumo;
		var TotalValor = data[(data.length-1)].TotalValor;

		var PorcentajeIngresos = 0;
		var PorcentajeSalidas = 0;

		var color = "";

		$.each(data, function(index, val) 
		{
			color = obtenerColor();

			PorcentajeConsumo = ((val.Consumo/TotalConsumo) * 100).toFixed(2);
			PorcentajeValor = ((val.Valor/TotalValor) * 100).toFixed(2);

			tds += '<div class="list-group-item media">';
	            tds += '<div class="media-body">';
	            	tds += '<div class="lgi-heading m-b-5 text-center">' + val.Nombre + '</div>';
	            	tds += '<div class="col-xs-3">' + val.Consumo;
	            	tds += '</div>';
	            	tds += '<div class="col-xs-3">';
		                tds += '<div class="progress">';
		                    tds += '<div class="progress-bar ' + color + ' palette bg" role="progressbar" aria-valuenow="' + val.Consumo + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + PorcentajeConsumo + '%">';
		                    tds += '</div>';
		                tds += '</div>';
		            tds += '</div>';
		            tds += '<div class="col-xs-3">$' + val.Valor;
	            	tds += '</div>';
		            tds += '<div class="col-xs-3">';
		                tds += '<div class="progress">';
		                    tds += '<div class="progress-bar ' + color + ' palette bg" role="progressbar" aria-valuenow="' + val.Valor + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + PorcentajeValor + '%">';
		                    tds += '</div>';
		                tds += '</div>';
		            tds += '</div>';
	            tds += '</div>';
	        tds += '</div>';
		});

        return tds;
	}, false, Desde, Hasta, "div", 'Movimiento de Servicios Públicos');

	$("#cntHome_SacosDevueltos").cargarDatosInicio('cargarSacosDevueltos', function(data)
	{
		var tds = "";
		var Cantidad = data[(data.length-1)].Cantidad;
		var CantidadKg = data[(data.length-1)].CantidadKg;

		var PorcentajeCantidad = 0;
		var PorcentajeCantidadKg = 0;

		var color = "";

		$.each(data, function(index, val) 
		{
			color = obtenerColor();

			PorcentajeCantidad = ((val.Cantidad/Cantidad) * 100).toFixed(2);
			PorcentajeCantidadKg = ((val.CantidadKg/CantidadKg) * 100).toFixed(2);

			tds += '<div class="list-group-item media">';
	            tds += '<div class="media-body">';
	            	tds += '<div class="lgi-heading m-b-5 text-center">' + val.Producto + '</div>';
	            	tds += '<div class="col-xs-3">' + val.CantidadKg;
	            	tds += '</div>';
	            	tds += '<div class="col-xs-3">';
		                tds += '<div class="progress">';
		                    tds += '<div class="progress-bar ' + color + ' palette bg" role="progressbar" aria-valuenow="' + val.CantidadKg + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + PorcentajeCantidadKg + '%">';
		                    tds += '</div>';
		                tds += '</div>';
		            tds += '</div>';
		            tds += '<div class="col-xs-3">' + val.Cantidad;
	            	tds += '</div>';
		            tds += '<div class="col-xs-3">';
		                tds += '<div class="progress">';
		                    tds += '<div class="progress-bar ' + color + ' palette bg" role="progressbar" aria-valuenow="' + val.Cantidad + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + PorcentajeCantidad + '%">';
		                    tds += '</div>';
		                tds += '</div>';
		            tds += '</div>';
	            tds += '</div>';
	        tds += '</div>';
		});

        return tds;
	}, false, Desde, Hasta, "div", 'registro de Sacos Devueltos');
}

$.fn.cargarDatosInicio = function(url, laFuncion,  funcionEach, Desde, Hasta, tipoContenedor, tipoDatos, callback)
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

				var tds = laFuncion(data);

				$(obj).append(tds);

				callback();
			} else
			{
				var tds = "";
				tds += '<div class="card c-dark">';
                    tds += '<div class="card-header">';
                        tds += 'Aún no se han reportado datos de ' + tipoDatos;
                    tds += '</div>';
                tds += '</div>';

                $(obj).append(tds);
			}
		}, "json");
	}
}

function easyPieChart(id, barColor, trackColor, scaleColor, lineWidth, size) {
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