var arrTiposInspeccion = [];
var mapaDeLaFicha = null;
function iniciarModulo()
{
	$("#lblHeader_NomModulo").text("Trabajo en Campo");

	fun_trabajoEnCampo_CargarTipoInspecciones();

	fun_trabajoEnCampo_CargarUsuarios();
	$("#btnTrabajoEnCampo_Filtros_Inspector_Marcar").on("click", function(evento)
	{
		evento.preventDefault();

		$("#txtTrabajoEnCampo_Filtros_Inspector").selectpicker('selectAll');
	});

	$("#btnTrabajoEnCampo_Filtros_Inspector_Desmarcar").on("click", function(evento)
	{
		evento.preventDefault();

		$("#txtTrabajoEnCampo_Filtros_Inspector").selectpicker('deselectAll');
	});

	$(".datepicker").datetimepicker(
    {
        format: 'YYYY-MM-DD',
        inline: true,
        sideBySide: true,
        locale: 'es'
    });

    $("#txtTrabajoEnCampo_Filtros_NumId").focus();

    $("#frmTrabajoEnCampo_Busqueda").on("submit", function(evento)
	{
		$("#cntTrabajoEnCampo_Preloader").show();
		evento.preventDefault();
		var parametros = {}	;

		parametros.Inspecciones = $(this).attr("idInspeccion");
		parametros.Inspectores = $("#txtTrabajoEnCampo_Filtros_Inspector").val();
		parametros.Desde = $("#txtTrabajoEnCampo_Filtros_Desde").val();
		parametros.Hasta = $("#txtTrabajoEnCampo_Filtros_Hasta").val();
		parametros.NumId = $("#txtTrabajoEnCampo_Filtros_NumId").val();

		parametros.Usuario = Usuario.id;

		$.post('server/php/proyecto/trabajoEnCampo/cargarInspecciones.php', parametros, function(data, textStatus, xhr) 
		{
			$("#tblTrabajoEnCampo_Resultados thead tr").remove();
			var vIdInspeccion = parseInt($("#frmTrabajoEnCampo_Busqueda").attr("idInspeccion"));

			$("#tblTrabajoEnCampo_Resultados tbody tr").remove();
			var tdh = '<tr><th></th><th>Consecutivo</th>';
			$.each(trabajoEnCampo_Encabezados[vIdInspeccion], function(index, val) 
			{
				 tdh += '<th>' + val + '</th>';
			});
			tdh += '</tr>';

			$("#tblTrabajoEnCampo_Resultados thead").append(tdh);

			if (data != 0)
			{
				var tds = '';
				if (vIdInspeccion == 0)
				{
					$.each(data, function(index, val) 
					{
						tds += '<tr>';
	                        tds += '<td><button idInspeccion="' + val.id + '" class="btn btn-success waves-effect btnTrabajoEnCampo_AbrirInspeccion"><i class="zmdi zmdi-more-vert"></i></button></td>';
	                        tds += '<td>' + val.id + '</td>';
	                        tds += '<td>' + val.fechaLevantamiento+ '</td>';
	                        tds += '<td>' + val.Usuario + '</td>';
	                        tds += '<td>' + arrTiposInspeccion[val.idProceso].texto + '</td>';
	                        
	                        tds += '<td>' + val.Prefijo + '</td>';
	                    tds += '</tr> ';
					});
				} else
				{
					tds = trabajoEnCampo_Reporte(11, data);
				}

				$("#tblTrabajoEnCampo_Resultados").crearDataTable(tds, function()
				{
					$("#cntTrabajoEnCampo_Preloader").hide();
				});
			} else
			{
				$("#cntTrabajoEnCampo_Preloader").hide();
			}
		}, 'json').fail(function()
		{
			$("#cntTrabajoEnCampo_Preloader").hide();
		});
	});

	$(document).delegate('.btnTrabajoEnCampo_AbrirInspeccion', 'click', function(event) 
	{
		var parametros = {};
		parametros.idInspeccion = $(this).attr("idInspeccion");
		parametros.Usuario = Usuario.id;


		$.post('server/php/proyecto/trabajoEnCampo/cargarInspeccion.php', parametros, function(d, textStatus, xhr) 
		{
			$("#contenedorDeModulo .Modulo").hide();
			$("#modulo_fichaInspeccion_html").slideDown('fast', function() 
			{
				if (mapaDeLaFicha != null)
				{
					mapaDeLaFicha.removeMarkers();
					mapaDeLaFicha.setZoom(15);
				} 

				if (d.Datos.coordenadas != '{}' && d.Datos.coordenadas != '' && d.Datos.coordenadas != null)
				{
					$("#cntTrabajoEnCampo_Ficha_Ubicacion").slideDown();
					d.Datos.coordenadas = $.parseJSON(d.Datos.coordenadas);	

					mapaDeLaFicha = new GMaps({
				        div: '#cntTrabajoEnCampo_Ficha_Mapa',
				        lat: d.Datos.coordenadas.latitude,
				        lng: d.Datos.coordenadas.longitude,
				        zoom : 15
				      });

					mapaDeLaFicha.addMarker({
                            lat: parseFloat(d.Datos.coordenadas.latitude),
                            lng: parseFloat(d.Datos.coordenadas.longitude),
                            icon : {url : 'img/worker.png'}
                          });
				} else
				{
					$("#cntTrabajoEnCampo_Ficha_Ubicacion").slideUp();
				}

				$("#lblTrabajoEnCampo_Ficha_Usuario").text(d.Datos.Usuario);
				$("#lblTrabajoEnCampo_Ficha_fechaLevantamiento").text(d.Datos.fechaLevantamiento);
				$("#lblTrabajoEnCampo_Ficha_fechaCargue").text(d.Datos.fechaCargue);
				$("#lblTrabajoEnCampo_Ficha_Prefijo").text(d.Datos.Prefijo);
				$("#lblTrabajoEnCampo_Ficha_id").text(d.Datos.id);

				$("#cntTrabajoEnCampo_Ficha_Archivos div").remove();
				if (d.Archivos.length > 0)
				{
					var tds = '<div id="cntTrabajoEnCampo_Ficha_Archivos_owl" class="owl-carousel owl-theme">';
					$.each(d.Archivos, function(index, val) 
					{
						tds += '<div class="item">';
							tds += '<a href="' + val.Ruta.replace('..', 'server') + '" target="_blank">';
								tds += '<img src="' + val.Ruta.replace('..', 'server').replace('Inspecciones', 'Inspecciones/thumbnails') + '">';
								if (val.idRecurso == 'Firma')
								{
									tds += '<br><small>Firma</small>';
								} else
								{
									tds += '<br><small>' + val.idFoto.substring(0, 4) + '-' + val.idFoto.substring(4, 6) + '-' + val.idFoto.substring(6, 8) + ' ' + val.idFoto.substring(8, 10) + ':' + val.idFoto.substring(10, 12) + ':' + val.idFoto.substring(12, 14)+ '</small>';
								}
							tds += '</a>';
						tds += '</div>';
					});
					tds += '</div>';

					$("#cntTrabajoEnCampo_Ficha_Archivos").append(tds);

					$('#cntTrabajoEnCampo_Ficha_Archivos_owl').owlCarousel({
					    loop:true,
					    margin:10,
					    responsiveClass:true,
    					items:3,
    					loop: true,
    					navText : ['<','>'],
					    responsive:{
					        0:{
					            items:1,
					            nav:true
					        },
					        600:{
					            items:3,
					            nav:false
					        },
					        1000:{
					            items:5,
					            nav:true,
					            loop:false
					        }
					    }
					});
				}

				$("#cntTrabajoEnCampo_Ficha_Datos div").remove();
				$.each(d.Etiquetas, function(index, val) 
				{
					fun_trabajoEnCampo_InsertarElemento(val);
				});

				var datos = $.parseJSON(d.Datos.Datos);

				$.each(datos, function(index, val) 
				{
					 if ($('#lbl' + index).length > 0)
					 {
					 	$('#lbl' + index).text(val)	;
					 }

					 if ($('#chk' + index).length > 0)
					 {
					 	if (val)
					 	{
					 		$('#chk' + index).addClass('zmdi-check');
					 		$('#chk' + index).addClass('c-green');
					 	} else
					 	{
					 		$('#chk' + index).addClass('zmdi-close');						 		
					 		$('#chk' + index).addClass('c-red');
					 	}
					 }

					 if ($('#cmp' + index).length > 0)
					 {
					 	console.log(index, val);
					 	if (val == 'Cumple')
					 	{
					 		$('#cmp' + index).addClass('zmdi-check');
					 		$('#cmp' + index).addClass('c-green');
					 	} else if (val == 'No Cumple')
					 	{
					 		$('#cmp' + index).addClass('zmdi-close');						 		
					 		$('#cmp' + index).addClass('c-red');
					 	} else
					 	{
					 		$('#cmp' + index).addClass('zmdi-eye-off');						 		
					 		$('#cmp' + index).addClass('c-gray');
					 	}
					 }

					 
				});
			});
			$("#lblTrabajoEnCampo_Ficha_Proceso").text(arrTiposInspeccion[d.Datos.idProceso].texto);

		}, 'json');
	});

	$("#btnTrabajoEnCampo_Volver").on("click", function(evento)
	{
		evento.preventDefault();
		$("#contenedorDeModulo .Modulo").hide();
		$("#modulo_trabajoEnCampo_html").slideDown();
	});

	$(document).delegate(".btnTrabajoEnCampo_Inspeccion", 'click', function(evento)
	{
		evento.preventDefault();
		var idInspeccion = $(this).attr("idInspeccion")
		$("#frmTrabajoEnCampo_Busqueda").attr("idInspeccion", idInspeccion);
		$("#frmTrabajoEnCampo_Busqueda").trigger('submit');
	});
}

function fun_trabajoEnCampo_CargarTipoInspecciones()
{
	$("#cntTrabajoEnCampo_Filtros_TipoInspeccion div").remove();
	$.post('server/php/proyecto/trabajoEnCampo/cargarTiposInspeccion.php', {}, function(data, textStatus, xhr) 
	{
		var tds = '';
		var vEnable = "";
		$.each(data, function(index, val) 
		{
			arrTiposInspeccion[val.id] = {"texto" : val.Texto, "icono" : val.Icono};

			if (val.Texto == 'Toma de muestras')
			{
				vEnable = '';
			} else
			{
				vEnable = 'disabled="disabled"';
			}

			tds += '<div class="col-sm-6">';
				tds += '<div class="pull-left">';
		            tds += '<button idInspeccion="' + val.id + '" class="btn btn-primary btn-icon waves-effect waves-circle waves-float btnTrabajoEnCampo_Inspeccion" ' + vEnable + '>';
		            	tds += '<i class="pvb-icon zmdi ' + val.Icono + ' zmdi-hc-fw"></i>';
		            tds += '</button>';
		        tds += '</div>';
		        tds += '<div class="media-body">';
                    tds += '<div class="lgi-heading m-t-10 m-l-5">' + val.Texto + '</div>';
	        	tds += '</div><br>';
	        tds += '</div>';
		});

		$("#cntTrabajoEnCampo_Filtros_TipoInspeccion").append(tds);
	}, 'json').fail(function()
	{
		Mensaje("error", 'No se pueden cargar los tipos de Inspección', 'danger');
	});
}

function fun_trabajoEnCampo_CargarUsuarios()
{
	$("#txtTrabajoEnCampo_Filtros_Inspector option").remove();
	$.post('server/php/proyecto/trabajoEnCampo/cargarUsuarios.php', {Usuario : Usuario.id}, function(data, textStatus, xhr) 
	{
		var tds = '';
		$.each(data, function(index, val) 
		{
			tds += '<option value="' + val.id + '">' + val.Nombre  + '</option>';
		});	
		$("#txtTrabajoEnCampo_Filtros_Inspector").append(tds);
		$("#txtTrabajoEnCampo_Filtros_Inspector").selectpicker('refresh');
	}, 'json');
}

function fun_trabajoEnCampo_InsertarElemento(val)
{
	if (val.length != [])
	{
		var tds = '';
		if (val.Tipo == 'Panel')
		{
			tds += '<div class="col-sm-6">';
	            tds += '<div class="card">';
	              tds += '<div class="card-header ch-dark">';
	                tds += '<h4 class="card-title">' + val.Encabezado + '</h4>';
	              tds += '</div>';
	              tds += '<div class="card-body card-padding form-horizontal">';
	              	tds += '<div id="cnt' + val.idCampo + '" class="media-demo">';
                    tds += '</div>';
	              tds += '</div>';
	            tds += '</div>';
	       	tds += '</div>';
		} else
		{
            tds += '<div class="media">';
                tds += '<div class="pull-left">';
                

                if (val.Tipo == 'Checkbox')
                {
                	tds += '<i id="chk' + val.idCampo + '" class="zmdi zmdi-hc-fw" style="font-size:25px;"></i>';
                } 
                else if (val.Tipo == 'Cumple')
                {
                	tds += '<i id="cmp' + val.idCampo + '" class="zmdi zmdi-hc-fw" style="font-size:25px;"></i>';
                }
                else
                {
                    tds += '<i class="zmdi zmdi-' + val.Icono + ' zmdi-hc-fw" style="font-size:25px;"></i>';
                }
                tds += '</div>';
                tds += '<div class="media-body">';
                    tds += '<h4 class="media-heading">' + val.Encabezado + '</h4>';
                    if (val.Tipo != 'Checkbox')
                    {
                    	if (val.Tipo == 'Cumple')
                    	{
                    		tds += '<h4 id="lbl' + val.idCampo.replace('C', 'O') + '"></h4>';
                    	} else
                    	{
                    		tds += '<h4 id="lbl' + val.idCampo + '"></h4>';
                    	}
                    }
                tds += '</div>';
            tds += '</div>';			
		}

		if (val.idContenedor == '')
		{
			val.idContenedor = 'cntTrabajoEnCampo_Ficha_Datos';
		}

		$('#' + val.idContenedor).append(tds);
	}
}

var trabajoEnCampo_Encabezados = [
	[
		'Fecha',
		'Usuario',
		'Proceso',
		'Codigo'
	],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[
		'Número de transformador',
		'Nombre del Inspector',
		'Ejecutor',
		'Fecha de Inspección',
		'Procediemiento toma de muestra C/NC',
		'Reporte para cambio  (Sin Válvula, Con Fuga y Permeado) C/NC',
		'El transformador queda marcado C/NC',
		'Sistema de puesta a tierra SI/NO',
		'Transformador cuenta con Válvula de sobrepresión C/NC',
		'Transformador cuenta con placa de características C/NC',
		'Caja primaria C/NC',
		'Transformador no existe en terreno C/NC',
		'Poste en mal estado C/NC',
		'Suspensión de seccionador principal (equipo padre) C/NC',
		'Acompañamiento a daños C/NC',
		'Atención a Queja C/NC',
		'Encargado'
	]
];

function trabajoEnCampo_Reporte(idInspeccion, datos)
{
	var tds = '';

		switch(idInspeccion)
		{
			case 11:
				$.each(datos, function(index, val) 
				{
					val.Datos = JSON.parse(val.Datos);
					tds += '<tr>';
                        tds += '<td><button idInspeccion="' + val.id + '" class="btn btn-success waves-effect btnTrabajoEnCampo_AbrirInspeccion"><i class="zmdi zmdi-more-vert"></i></button></td>';
                        tds += '<td>' + val.id + '</td>';
                        tds += '<td>' + val.Datos.C0 + '</td>';
                        tds += '<td>' + val.Usuario + '</td>';
                        tds += '<td>' + val.Datos.E3 + '</td>';
                        tds += '<td>' + val.fechaLevantamiento + '</td>';
                        tds += '<td>' + val.Datos.C5 + '</td>';
                        tds += '<td>' + 'SIN RELACIÓN' + '</td>';
                        tds += '<td>' + val.Datos.C15 + '</td>';
                        tds += '<td>' + val.Datos.C23 + '</td>';
                        tds += '<td>' + 'SIN RELACIÓN' + '</td>';
                        tds += '<td>' + 'SIN RELACIÓN' + '</td>';
                        tds += '<td>' + 'SIN RELACIÓN' + '</td>';
                        tds += '<td>' + 'SIN RELACIÓN' + '</td>';
                        tds += '<td>' + 'SIN RELACIÓN' + '</td>';
                        tds += '<td>' + 'SIN RELACIÓN' + '</td>';
                        tds += '<td>' + 'SIN RELACIÓN' + '</td>';
                        tds += '<td>' + 'SIN RELACIÓN' + '</td>';
                        tds += '<td>' + val.Datos.C26 + '</td>';                        
                    tds += '</tr> ';
				});
			break;
			default:
				tds = '';
		}

	return tds;
}