var objFilaCierre = {};

function iniciarModulo()
{
	$("#txtManiobras_FechaSincronizacion").val(obtenerFecha());
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

    setInterval(
    	function()
    	{
    		maniobras_cargarUltimosRegistros(obtenerFecha().substr(0, 10), true);
    		maniobras_cargarManiobrasSinCerrar(obtenerFecha().substr(0, 10), true);
    	}, 60000);


    $(".time-picker").val(obtenerFecha().substr(11, 5));
    $(".time-picker").datetimepicker({
        format: 'Z'
    });

	$("#txtManiobras_FechaCierre").val(obtenerFecha().substr(0, 10));

    setInterval(function()
    {
    	$("#txtManiobras_Hora").val(obtenerFecha().substr(11, 8));
    	$("#txtManiobras_HoraCierre").val(obtenerFecha().substr(11, 8));
	}, 30000);

	$("#txtManiobras_Evento").focus();

	$("#txtManiobras_Fecha").on("change", function(evento)
		{
			maniobras_cargarManiobrasSinCerrar($(this).val());
			maniobras_cargarUltimosRegistros($(this).val())
		});

	$("#txtManiobras_Evento").on("change", function(evento)
		{
			var str = $(this).val();
			if (str != "")
			{
				maniobras_ValidarTrafo(str, 'NODO')
			}
		});

	$("#txtManiobras_Trafo").on("change", function(evento)
		{
			var str = $(this).val();
			if (str != "")
			{
				maniobras_ValidarTrafo(str, 'TRAFO')
			}
		});

	$("#frmManiobras_Registro").on("submit", function(evento)
	{
		evento.preventDefault();
		$("#frmManiobras_Registro").generarDatosEnvio("txtManiobras_", function(datos)
		{
			vNovedad = '';
			if ($("#txtManiobras_Novedad").val() != "")
			{
				vNovedad = $("#txtManiobras_Novedad_Estado option:selected").text() + ', ' + $("#txtManiobras_Novedad_Observaciones option:selected").text();
			}
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

					if (vNovedad == '')
					{
						maniobras_AgregarASinCerrar(parametros, true);
					} else
					{
						$("#txtManiobras_Novedad").val("");
						parametros.Desde = parametros.Fecha;
						parametros.Hasta = obtenerFecha();
						parametros.ObservacionesCierre = '';
						parametros.CierreEPM = false;
						parametros.Novedad = vNovedad;
						maniobras_AgregarUltimosRegistros(parametros, true);
					}


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
		$("#txtManiobras_FechaApertura").val($(this).attr('fechaApertura'));
		$("#cntManiobras_CerrarManiobra").modal('show');
		$("#txtManiobras_Observaciones").val("");
		var fila = $(this).parent('div').parent("a");
		var strongs = $(fila).find(".cntManiobra_SinCerrar_Item_Campo");
		
		$('#lblManiobras_CerrarManiobra_Nodo').text($(strongs[1]).text());

		objFilaCierre = this;
		
	});

	$("#frmManiobras_CerrarManiobra").on("submit", function(evento)
	{
		evento.preventDefault();
		var idManiobra = $(objFilaCierre).attr("idManiobra");
		var fila = $(objFilaCierre).parent('div').parent("a");

		var fechaApertura = $("#txtManiobras_FechaApertura").val();
		fechaApertura = new Date(fechaApertura.substr(0,4), fechaApertura.substr(5,2) - 1, fechaApertura.substr(8,2), fechaApertura.substr(11,2), fechaApertura.substr(14,2), 0);

		var fechaCierre = $("#txtManiobras_FechaCierre").val() + ' ' + $("#txtManiobras_HoraCierre").val();
		fechaCierre = new Date(fechaCierre.substr(0,4), fechaCierre.substr(5,2) - 1, fechaCierre.substr(8,2), fechaCierre.substr(11,2), fechaCierre.substr(14,2), 0);

		if (fechaCierre > fechaApertura)
		{
			$.post('server/php/proyecto/maniobras/registrarCierre.php', {Usuario: Usuario.id, idManiobra: idManiobra, Fecha : $("#txtManiobras_FechaCierre").val(), Hora : $("#txtManiobras_HoraCierre").val(), Observaciones : $("#txtManiobras_ObservacionesCierre").val()}, 
				function(data, textStatus, xhr) 
				{
					$("#cntManiobras_CerrarManiobra").modal('hide');
					if (!isNaN(data))
					{
						Mensaje("Hey", "Los datos han sido Ingresados", "success");
						var strongs = $(fila).find(".cntManiobra_SinCerrar_Item_Campo");

						

						var parametros = {
							id : data,
							Evento : $(strongs[1]).text(),
							Trafo :  $(strongs[0]).text(),
							Reporto : $(strongs[2]).text(),
							Observaciones :  $(strongs[3]).text(),
							ObservacionesCierre :  $("#txtManiobras_ObservacionesCierre").val(),
							Desde : $(strongs[4]).text(),
							Hasta : $("#txtManiobras_FechaCierre").val() + ' ' + $("#txtManiobras_HoraCierre").val(),
							Novedad : '',
							CierreEPM : false	
						};

						maniobras_AgregarUltimosRegistros(parametros, true);
						$(fila).remove();

					} else
					{
						Mensaje("Error",data, "danger");
					}
				});
		} else
		{
			priAlert("Error", "La fecha de cierre seleccionada no es válida", "error");
		}


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
		var contenedor = $(this).parent('div').parent('td').parent('tr');
		if ($(this).is(":checked"))
		{
			$(contenedor).css('text-decoration', 'line-through');
		} else
		{
			$(contenedor).css('text-decoration', 'none');
		}
	});

	$("#btnManiobras_AgregarNovedad").on("click", function(evento)
		{
			evento.preventDefault();
			if ($("#txtManiobras_Fecha").val() == "")
			{
				priAlert("Hey!", "Hay que diligenciar una fecha primero", "error");
				$("#txtManiobras_Fecha").focus();
			} else
			{
				if ($("#txtManiobras_Hora").val() == "")
				{
					priAlert("Hey!", "Hay que diligenciar una hora primero", "error");
					$("#txtManiobras_Hora").focus();
				} else
				{
					if ($("#txtManiobras_Trafo").val() == "")
					{
						priAlert("Hey!", "Hay que diligenciar un numero de Transformador", "error");
						$("#txtManiobras_Trafo").focus();
					} else
					{
						if ($("#txtManiobras_Reporto").val() == "")
						{
							priAlert("Hey!", "Hay que diligenciar quien reportó", "error");
							$("#txtManiobras_Reporto").focus();
						} else
						{
							$("#cntManiobras_AgregarNovedad").modal('show');
						}
					}		
				}
			}
		});

	$("#frmManiobras_AgregarNovedad").on("submit", function(evento)
	{
		evento.preventDefault();
		$("#txtManiobras_Novedad").val($("#txtManiobras_Novedad_Observaciones").val());
		$("#frmManiobras_Registro").trigger('submit');
		$("#cntManiobras_AgregarNovedad").modal('hide');
	});

	$("#txtManiobras_Novedad_Estado").on("change", function(evento)
		{
			var opciones = [	
				[],
				[
					{id : 1, Nombre : 'Falta de tiempo'},
					{id : 2, Nombre : 'Tiene certificado libre de PCB.'},
					{id : 3, Nombre : 'No dio permiso'},
					{id : 4, Nombre : 'No se avisó a tiempo'},
					{id : 5, Nombre : 'No se toma muestra por lluvia'},
					{id : 6, Nombre : 'Por riesgo biológico'},
					{id : 7, Nombre : 'No se encontró transformador en terreno'},
					{id : 8, Nombre : 'Transformador seco'},
					{id : 9, Nombre : 'No autorizado para toma de muestra'},
					{id : 10, Nombre : 'Conector prensado'},
					{id : 11, Nombre : 'Se encuentra es el trafo XXXX'},
					{id : 12, Nombre : 'Por condiciones técnicas'},
					{id : 13, Nombre : 'Comparte con trafo particular'},
					{id : 14, Nombre : 'Comparte con cliente especial'},
					{id : 15, Nombre : 'Enfermedad general'},
					{id : 16, Nombre : 'No coincide número de amarre'},
					{id : 17, Nombre : 'Poste en mal estado'},
					{id : 18, Nombre : 'No se puede ingresar al punto'},
					{id : 19, Nombre : 'Error en la programación'}
				],
				[
					{id : 20, Nombre : 'Tiene certificado libre de PCB.'}
				],
				[
					{id: 21, Nombre : 'No dio permiso'},
					{id: 22, Nombre : 'No se avisó a tiempo'}
				],
				[
					{id :  23, Nombre : 'Se había muestreado en días anteriores'}
				],
				[
					{id : 24, Nombre : 'Permeado'},
					{id : 25, Nombre : 'Fuga aceite'},
					{id : 26, Nombre : 'Acceso (válvula) al equipo sellado'}
				],
				[
					{id : 27, Nombre : 'Equipo en sistema Integral'},
					{id : 28, Nombre : 'No dio permiso'},
					{id : 29, Nombre : 'Cliente especial '},
					{id : 30, Nombre : 'No autorizado para toma de muestra'}
				],
				[
					{id : 31, Nombre : 'Se cumple programación de evento de la rectificación de anomalía'},
					{id : 32, Nombre : 'No se cumple programación de evento de la rectificación de anomalía'}
				]
			];

			$("#txtManiobras_Novedad_Observaciones option").remove();

			var tds = '';
			$.each(opciones[$("#txtManiobras_Novedad_Estado").val()], function(index, val) 
			{
				tds += '<option value="' + val.id + '">' + val.Nombre + '</option>';
			});

			$("#txtManiobras_Novedad_Observaciones").append(tds);
		});
}

function maniobras_AgregarASinCerrar(parametro)
{
	if ($("button[idManiobra='" + parametro.id  + "'").length == 0)
	{
		var tds = "";
		tds +='<a href="#" class="list-group-item media cntManiobra_SinCerrar_Item">';
	        tds +='<div class="pull-left">';
	            tds += '<button class="btn palette-Blue-Grey bg waves-effect lnkManiobras_Cerrar" fechaApertura="' + parametro.Fecha + '" idManiobra="' + parametro.id + '"> Cerrar</button>';
	        tds +='</div>';
	        tds +='<div class="pull-right">';
	            tds +='<div class="lgi-heading"><small>Trafo: </small><strong class="c-indigo f-20 cntManiobra_SinCerrar_Item_Campo">' + parametro.Trafo + '</strong></div>';
	        tds +='</div>';
	        tds +='<div class="media-body">';
	        	tds +='<div class="lgi-heading"><small>Nodo: </small><strong class="c-deeppurple f-20 cntManiobra_SinCerrar_Item_Campo">' + parametro.Evento + '</strong></div>';
	            tds +='<div class="lgi-heading"><small>Reportó: </small><strong class="cntManiobra_SinCerrar_Item_Campo">' + parametro.Reporto + '</strong> </div>';
	            tds +='<span class="cntManiobra_SinCerrar_Item_Campo">' + parametro.Observaciones + '</span>';
	            tds += '<small class="lgi-text"><i class="cntManiobra_SinCerrar_Item_Campo">' + parametro.Fecha + '</i></small>';
	        tds +='</div>';
	    tds += '</a>';
		
		$("#cntManiobras_SinCerrar").prepend(tds);
	}
}

function maniobras_cargarManiobrasSinCerrar(fecha, fecha2)
{
	fecha = fecha || obtenerFecha().substr(0, 10);
	var datos = {Usuario: Usuario.id, fecha : fecha}
	if (fecha2 === true)
	{
		datos.fecha2 = $("#txtManiobras_FechaSincronizacion").val();
	}

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
	if ($("input[idManiobra='" + parametro.id + "'" ).length == 0)
	{
		var checked = "";
		var estiloChecked = "";
		if (parametro.cierreEPM == 1)
		{
			checked = 'checked="true"';
			estiloChecked = 'style="text-decoration : line-through;"'
		}

		var bgBackground = ''; 

		var tiempoDesenergizado = "-";


		if (parametro.Hasta == parametro.Desde)
		{
			if (parametro.Novedad != 0 && parametro.Novedad != "")
			{
				bgBackground = 'colorearNaranja';
				parametro.Hasta = "--";
			}
		} else
		{
			tiempoDesenergizado = calcularTiempoDiferencia(parametro.Desde, parametro.Hasta);
		}

		var tds = "";
		tds += '<tr id="" class="cntManiobras_UltimosRegistros_Item ' + bgBackground + '" ' + estiloChecked + '>';
	        tds += '<td class="pull-left">';
	            tds += '<div class="avatar-char ac-check">';
	                tds += '<input class="acc-check chkManiobras_CierreEPM" idManiobra="' + parametro.id + '" type="checkbox" ' + checked + '>';
	                if (parametro.Evento == 57650)
	                {
	                	tds += '<span class="acc-helper palette-Red-900 bg">par</span>';
	                } else
	                {
	                	tds += '<span class="acc-helper palette-Green-900 bg">epm</span>';
	                }
	            tds += '</div>';
	        tds += '</td>';
	        tds += '<td>';
	        	tds += '<strong class="c-indigo f-20">' + parametro.Evento + '</strong>';
	        tds += '</td>';

	        tds += '<td>';
	        	tds += '<strong class="col-sm-8">' + parametro.Reporto + '</strong></div>';
	        tds += '</td>';

	        tds += '<td>';
	        	tds += '<i class="col-sm-8" style="text-decoration:underline;">' + parametro.Desde + '</i></div>';
	        tds += '</td>';

	        tds += '<td>';
	        	tds += '<i class="col-sm-8" style="text-decoration:underline;">' + parametro.Hasta + '</i></div>';
	        tds += '</td>';

	        tds += '<td>';
	        	tds += '<i class="col-sm-8">' + tiempoDesenergizado + '</i></div>';
	        tds += '</td>';

	        tds += '<td>';
	        	tds += '<p>' + parametro.Observaciones + '</p>';
	        tds += '</td>';
	        tds += '<td>';
	        	tds += '<p>' + parametro.ObservacionesCierre + '</p>';
	        tds += '</td>';
	        tds += '<td>';
	        	tds += '<p>' + parametro.Novedad + '</p>';
	        tds += '</td>';
	    tds += '</tr>';
		
		$("#cntManiobras_UltimosRegistros tbody").prepend(tds);
		$("#cntManiobras_UltimosRegistros tbody .colorearNaranja").addClass('bg palette-Amber-400');
	}
	
}

function maniobras_cargarUltimosRegistros(fecha, fecha2)
{
	fecha = fecha || obtenerFecha().substr(0, 10);
	var datos = {Usuario: Usuario.id, fecha : fecha}
	if (fecha2 === true)
	{
		datos.fecha2 = $("#txtManiobras_FechaSincronizacion").val();
	}

	$("#cntManiobras_SinCerrar div").remove();
	$.post('server/php/proyecto/maniobras/cargarUltimosRegistros.php', datos, function(data, textStatus, xhr) 
	{
		if (data != 0)
		{
			$.each(data, function(index, val) 
			{
				maniobras_AgregarUltimosRegistros(val);
				$("#txtManiobras_FechaSincronizacion").val(obtenerFecha());
			});

			if (fecha2 === true)
			{
				$("#txtManiobras_FechaSincronizacion").val(obtenerFecha());
			}
		}
	}, 'json');
}


function maniobras_ValidarTrafo(Nodo,Tipo)
{
	Tipo = Tipo || 'NODO';

	$.post('server/php/proyecto/maniobras/cargarNoTrafo.php', 
		{
			Usuario : Usuario.id, 
			Nodo : Nodo, 
			Tipo : Tipo,
			fecha : $("#txtManiobras_Fecha").val()
		}, function(data, textStatus, xhr) 
			{
				if (data == 0)
				{
					priAlert("Error", "Ese " + Tipo + " no está programado", "error");
				} else
				{
					if (data == 8)
					{
						priAlert("Error", "El " + Tipo + " está programado pero no para la fecha indicada", "warning");
					} else
					{
						if (data == 9)
						{
							priAlert("Error", "Ya se registró una maniobra para ese  " + Tipo + " en ese día", "error");
							$("#txtManiobras_Trafo").val('');	
							$("#txtManiobras_Evento").val('');	
						} else
						{
							if (data == 10)
							{
								priAlert("Error", "Ese  " + Tipo + " ya tiene una maniobra registrada", "warning");
							} else
							{
								$("#txtManiobras_Trafo").val(data[0].NUMERO_DE_TRAFO);
								$("#txtManiobras_Evento").val(data[0].NUMERO_DE_NODO);
							}
						}
					}
				}
			}, 'json');
}