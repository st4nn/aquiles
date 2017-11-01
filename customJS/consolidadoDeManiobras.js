function iniciarModulo()
{
    $("#lblHeader_NomModulo").text("Consolidado de Maniobras");

    //$('.input-mask').mask();

    var fecha = obtenerFecha().substr(0, 10);
    $("#txtConsolidadoDeManiobras_Hasta").attr("placeholder", 'ej: ' + fecha);
    $("#txtConsolidadoDeManiobras_Desde").attr("placeholder", 'ej: ' + fecha);
    $("#txtConsolidadoDeManiobras_Hasta").val(fecha);
    $("#txtConsolidadoDeManiobras_Desde").val(fecha);

    $("#frmConsolidadoDeManiobras_Busqueda").on("submit", function(evento)
    {
        evento.preventDefault();
        $("#cntConsolidadoDeManiobras_BotonesCircuito button").remove();
        var dTipo = $("#txtConsolidadoDeManiobras_Parametro option:selected").attr("data-tipo");
        $.post('server/php/proyecto/ConsolidadoDeManiobras/cargarManiobras.php', 
            {
                Usuario: Usuario.id, 
                Parametro : $("#txtConsolidadoDeManiobras_Parametro").val(), 
                Tipo : dTipo, 
                Filtro : $("#txtConsolidadoDeManiobras_Filtro").val(),
                Fechas : $("#txtConsolidadoDeManiobras_Fechas").is(":checked"),
                Desde : $("#txtConsolidadoDeManiobras_Desde").val(),
                Hasta : $("#txtConsolidadoDeManiobras_Hasta").val()
            }, function(data, textStatus, xhr) 
        {
            var tds = "";
            var tdsBotonesCircuito = '';
            var idxCircuito = 0;
            if (data != 0)
            {
                var tmpCircuito = "";
                $.each(data, function(index, val) 
                {
                    if (tmpCircuito != val.Ejecutor)
                    {
                        tdsBotonesCircuito += '<button class="btn btn-default waves-effect m-5 btnConsolidadoDeManiobras_BotonCircuito">' + val.Ejecutor + '</button>';
                        tmpCircuito = val.Ejecutor;
                    }

                    val.CierreEPM = 'Abierto';
                    
                    if (val.cierreEPM)
                    {
                        val.CierreEPM = 'Cerrado';
                    }

                    val.tmpFecha_Desenergizacion = moment(val.Fecha_Desenergizacion);
                    val.tmpFecha_Energizacion = moment(val.Fecha_Energizacion);

                    val.Duracion = val.tmpFecha_Energizacion.diff(val.tmpFecha_Desenergizacion, 'days');

                    tds += "<tr>";
                        tds += '<td></td>';
                        //tds += '<td><button class="btn btn-success waves-effect"><i class="zmdi zmdi-edit"></i></button></td>';
                        tds += '<td>' + val.id + '</td>';
                        tds += '<td>' + val.Ejecutor + '</td>';
                        tds += '<td>' + val.Municipio + '</td>';
                        tds += '<td>' + val.No_de_Nodo + '</td>';
                        tds += '<td>' + val.No_de_Transformador + '</td>';
                        tds += '<td>' + val.No_de_Evento + '</td>';
                        tds += '<td>' + val.Nombre_responsable_de_campo + '</td>';
                        tds += '<td>' + val.BLA + '</td>';
                        tds += '<td>' + val.Fases + '</td>';
                        tds += '<td>' + val.Fecha_Desenergizacion + '</td>';
                        tds += '<td>' + val.Fecha_Energizacion + '</td>';
                        tds += '<td>' + calcularTiempoDiferencia(val.Fecha_Desenergizacion, val.Fecha_Energizacion) + '</td>';
                        tds += '<td>' + val.Circuito_Apertura + '</td>';
                        tds += '<td>' + val.Observaciones + '</td>';
                        tds += '<td>' + val.Estado_Cumplido + '</td>';
                        tds += '<td>' + val.Estado_Cumplido_Observaciones + '</td>';
                        tds += '<td>' + val.CierreEPM + '</td>';
                    tds += "</tr>";
                });
                $("#tblConsolidadoDeManiobras_Resultado").crearDataTable(tds);
                $("#cntConsolidadoDeManiobras_BotonesCircuito").append(tdsBotonesCircuito);

                if ($("#txtConsolidadoDeManiobras_Circuito").val() != '')
                {
                    $(".btnConsolidadoDeManiobras_BotonCircuito:contains('" + $("#txtConsolidadoDeManiobras_Circuito").val() + "')").trigger('click');
                    $("#txtConsolidadoDeManiobras_Circuito").val('');
                }
            } else
            {
                $("#tblConsolidadoDeManiobras_Resultado").crearDataTable();
                $("#lblConsolidadoDeManiobras_CircuitosIdentificados").text(0);
                Mensaje("Hey", "No hay datos que coincidan con esa búsqueda", "danger");
            }
        }, "json");
    });

    $(document).delegate('.btnConsolidadoDeManiobras_BotonCircuito', 'click', function(event) 
    {
        $('.btnConsolidadoDeManiobras_BotonCircuito').removeClass("btn-warning");
        
        var objFiltro = $("#tblConsolidadoDeManiobras_Resultado_filter input[type=search]");
        $(objFiltro).val($(this).text());
        $(this).addClass('btn-warning');
        $(objFiltro).trigger('keyup');
        $("#txtConsolidadoDeManiobras_Circuito").val($(this).text());
    });

    $(document).delegate("#tblConsolidadoDeManiobras_Resultado_filter input[type=search]", 'change', function(event) 
    {
        $('.btnConsolidadoDeManiobras_BotonCircuito').removeClass("btn-warning");
    });

}