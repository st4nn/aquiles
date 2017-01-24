function iniciarModulo()
{
	$("#cntReportes_Grafica").hide();
	$("#lblHeader_NomModulo").text("Reportes");

	$(".datepicker").datetimepicker(
    {
        format: 'YYYY-MM-DD',
        inline: true,
        sideBySide: true,
        locale: 'es'
    });

    $("#txtReportes_idProceso").on("change", function()
    {
		$("#cntReportes_Resultado_Tabla table").bootgrid('destroy');
        $("#cntReportes_Resultado_Tabla table").remove();

    	var idProceso = $(this).val();
    	var parametros = {Desde : $("#txtServicioPublico_Desde").val(), Hasta : $("#txtServicioPublico_Hasta").val(), Usuario : Usuario.id};
    	var url = "";

    	if (idProceso == 1)
    	{
    		$("#lblReportes_Nombre").text("Materia Prima");
			generarReporte("cargarMateriaPrima", parametros);
    	}

    	if (idProceso == 2)
    	{
    		$("#lblReportes_Nombre").text("Servicios Públicos");
			generarReporte("cargarServiciosPublicos", parametros);
    	}

    	if (idProceso == 3)
    	{
    		$("#lblReportes_Nombre").text("Despachos");
			generarReporte("cargarDespachos", parametros);
    	}

        if (idProceso == 4)
        {
            $("#lblReportes_Nombre").text("Producción");
            generarReporte("cargarProduccion", parametros);
        }

        if (idProceso == 5)
        {
            $("#lblReportes_Nombre").text("Stock de Materia Prima");
            generarReporte("cargarStock", parametros);
        }

        if (idProceso == 6)
        {
            $("#lblReportes_Nombre").text("Producido Total");
            generarReporte("cargarProducidoTotal", parametros);
        }
    });

    $("#btnReportes_Actualizar").on("click", function(evento)
    {
    	evento.preventDefault();
    	$("#txtReportes_idProceso").trigger('change');
    })

    $("#btnReporte_VerTabla").on("click", function()
    {
        $("#cntReportes_Tabla").hide();
        $("#cntReportes_Grafica").show();

        $("#cntReportes_Grafica").hide();
        $("#cntReportes_Tabla").show();

        $("#cntReportes_Grafica").addClass('bounceInRight')

        setTimeout(function(){
            $("#cntReportes_Grafica").removeClass('bounceInRight');
        }, 1200);
    });

    $("#btnReporte_VerGrafica").on("click", function()
    {
        $("#cntReportes_Grafica").hide();
        $("#cntReportes_Tabla").show();

        $("#cntReportes_Tabla").hide();
        $("#cntReportes_Grafica").show();

        $("#cntReportes_Tabla").addClass('bounceInLeft')

        setTimeout(function(){
            $("#cntReportes_Tabla").removeClass('bounceInLeft');
        }, 1200);
    });

    

}

function generarReporte(url, parametros, callback)
{
    if (callback === undefined)
    {callback = function(){};}

    $.post('server/php/proyecto/reportes/' + url + '.php', parametros, function(data, textStatus, xhr) 
    {
        /*if (data.Error != "")
        {
            Mensaje("Error", data.Error, "danger");
        }
        else
        {
            */
           if (data == 0)
            {
                Mensaje("Hey", "Ningún registro coincide con los parámetros enviados", "warning");
            } else
            {
                var tds = "";
                var pPrefijo = obtenerPrefijo();

                tds += '<table id="tblResultado_' + pPrefijo+'" class="table table-striped">';
                    tds += '<thead><tr>';

                    $.each(data[0], function(index, val) 
                    {
                         tds += '<th data-column-id="' + index + '">' + index + '</th>';
                    });
                    tds += '</tr></thead>';
                    tds += '<tbody>';
                    $.each(data, function(index, val) 
                    {
                        tds += '<tr>';
                        $.each(val, function(index2, val2) 
                        {
                             tds += '<td>' + val2 + '</td>';
                        });
                        tds += '</tr>';
                    });
                    tds += '</tbody>';
                tds += '</table>';

                


                $("#cntReportes_Resultado_Tabla").append(tds);
                $("#btnReportes_Descargar").unbind('click');
                $("#btnReportes_Descargar").on("click", function()
                {
                    if ($("#cntModal_DescargarAExcel").length == 0)
                    {
                        var tds = "";

                          tds += '<div class="modal fade" id="cntModal_DescargarAExcel" tabindex="-1" role="dialog" aria-hidden="true">';
                              tds += '<div class="modal-dialog">';
                                  tds += '<div class="modal-content">';
                                      tds += '<form id="frmModal_DescargarAExcel" class="form-horizontal" role="form">';
                                          tds += '<div class="modal-header">';
                                              tds += '<h4 class="modal-title">Descargar a Excel</h4>';
                                          tds += '</div>';
                                          tds += '<div class="modal-body">';
                                              tds += '<div class="form-group">';
                                                tds += '<label for="txtModal_DescargarAExcel_Nombre" class="control-label">Nombre del Archivo</label>'
                                                  tds += '<div class="fg-line">';
                                                      tds += '<input id="txtModal_DescargarAExcel_Nombre" name="Nombre" class="form-control guardar" placeholder="Nombre" required>';
                                                  tds += '</div>';
                                              tds += '</div>';
                                          tds += '</div>';
                                          tds += '<div class="modal-footer">';
                                              tds += '<button type="button" id="btnModal_DescargarAExcel_Cancelar" class="btn btn-link waves-effect">Cancelar</button>';
                                              tds += '<button type="submit" class="btn btn-link waves-effect">Guardar</button>';
                                          tds += '</div>';
                                      tds += '</form>';
                                  tds += '</div>';
                              tds += '</div>';
                          tds += '</div>';

                          $("body").append(tds);

                            $("#frmModal_DescargarAExcel").on("submit", function(evento)
                            {
                               evento.preventDefault(); 
                               alert($("#txtModal_DescargarAExcel_Nombre").val());
                                $('#tblResultado_' + pPrefijo).tableExport({type:'excel',escape:'false', tableName : $("#txtModal_DescargarAExcel_Nombre").val()});
                               $("#cntModal_DescargarAExcel").modal("hide");
                            });

                            $("#btnModal_DescargarAExcel_Cancelar").on("click", function(evento)
                            {
                              evento.preventDefault();
                              $("#cntModal_DescargarAExcel").modal("hide");
                            });
                        }

                        $("#frmModal_DescargarAExcel")[0].reset();

                        $("#cntModal_DescargarAExcel").modal("show");
                    
                });
                //$("#btnReportes_Descargar").iniciarBotonExportarExcel({Tabla : $('#tblResultado_' + pPrefijo)});

                $("#cntReportes_Resultado_Tabla table").bootgrid({
                    css: {
                        icon: 'zmdi icon',
                        iconColumns: 'zmdi-view-module',
                        iconDown: 'zmdi-expand-more',
                        iconRefresh: 'zmdi-refresh',
                        iconUp: 'zmdi-expand-less'
                    },
                    caseSensitive: false,
                    multiSort: true,
                    selection: true,
                    multiSelect: false,
                    rowSelect: true,
                    keepSelection: true
                });
            }
       // }
    }, "json");

    $.post('server/php/proyecto/reportes_Graficas/' + url + '.php', parametros, function(data, textStatus, xhr) 
    {
        var colores = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#b388ff', '#8c9eff', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffeb3b', '#ff9800', '#ff5722', '#795548', '#9e9e9e'];
        var obj = {};
        var tmpNombre = data[0].Nombre;
        var d1 = [];
        var idx = 0;
        var parametrosGrafica = [];

        var options = {
            series: {
                shadowSize: 0,
                lines: {
                    show: true,
                    lineWidth: 2,
                },
            },
            grid: {
                borderWidth: 0,
                labelMargin:10,
                hoverable: true,
                clickable: true,
                mouseActiveRadius:6,
                
            },
            xaxis: {
                tickDecimals: 0,
                ticks: false
            },
            
            yaxis: {
                tickDecimals: 0,
                ticks: false
            },
            
            legend: {
                show: false
            }
        };

        $.each(data, function(index, val) 
        {
            if (tmpNombre != val.Nombre)
            {
                parametrosGrafica.push(obj);
                d1 = [];
                idx++;
                obj = {};
            } 
                d1.push(index, parseInt(val.Cantidad));
                obj.data = d1;
                obj.lines = { show: true, fill: 0.98 };
                obj.label = val.Nombre;
                obj.stack = true
                obj.color = colores[idx];
        });
        parametrosGrafica.push(obj);
        
        $.plot($("#cntReporte_Grafica"), parametrosGrafica, options);            
        
        console.log(parametrosGrafica);
    }, 'json');
 }