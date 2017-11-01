function iniciarModulo()
{
    $("#lblHeader_NomModulo").text("Validación de Programación");

    //$('.input-mask').mask();

    var fecha = obtenerFecha().substr(0, 10);
    $("#txtvProgramacion_Desde").attr("placeholder", 'ej: ' + fecha);
    $("#txtvProgramacion_Desde").val(fecha);

    $("#frmvProgramacion_Busqueda").on("submit", function(evento)
    {
        evento.preventDefault();
        $("#cntvProgramacion_BotonesCircuito button").remove();
        var dTipo = $("#txtvProgramacion_Parametro option:selected").attr("data-tipo");
        $.post('server/php/proyecto/maniobras/cargarVProgramacion.php', 
            {
                Usuario: Usuario.id, 
                Ejecutor : $("#txtvProgramacion_Ejecutor").val(), 
                Desde : $("#txtvProgramacion_Desde").val()
            }, function(data, textStatus, xhr) 
        {
            var tds = "";
            var tdsBotonesCircuito = '';
            var idxCircuito = 0;
            if (data != 0)
            {
                var tmpCircuito = "";
                $("#tblvProgramacion_Resultado tbody tr").remove();
                $.each(data, function(index, val) 
                {
                    if (tmpCircuito != val.Ejecutor)
                    {
                        tdsBotonesCircuito += '<button class="btn btn-default waves-effect m-5 btnvProgramacion_BotonCircuito">' + val.Ejecutor + '</button>';
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
                        /*
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
                        */
                    tds += "</tr>";
                });
                $("#tblvProgramacion_Resultado tbody").append(tds);
                tabla();

                //$("#tblvProgramacion_Resultado").crearDataTable(tds);
                //$("#cntvProgramacion_BotonesCircuito").append(tdsBotonesCircuito);

                if ($("#txtvProgramacion_Circuito").val() != '')
                {
                    $(".btnvProgramacion_BotonCircuito:contains('" + $("#txtvProgramacion_Circuito").val() + "')").trigger('click');
                    $("#txtvProgramacion_Circuito").val('');
                }
            } else
            {
                $("#tblvProgramacion_Resultado").crearDataTable();
                $("#lblvProgramacion_CircuitosIdentificados").text(0);
                Mensaje("Hey", "No hay datos que coincidan con esa búsqueda", "danger");
            }
        }, "json");
    });

    $(document).delegate('.btnvProgramacion_BotonCircuito', 'click', function(event) 
    {
        $('.btnvProgramacion_BotonCircuito').removeClass("btn-warning");
        
        var objFiltro = $("#tblvProgramacion_Resultado_filter input[type=search]");
        $(objFiltro).val($(this).text());
        $(this).addClass('btn-warning');
        $(objFiltro).trigger('keyup');
        $("#txtvProgramacion_Circuito").val($(this).text());
    });

    $(document).delegate("#tblvProgramacion_Resultado_filter input[type=search]", 'change', function(event) 
    {
        $('.btnvProgramacion_BotonCircuito').removeClass("btn-warning");
    });

}


var editor; // use a global for the submit and return data rendering in the examples
 
function tabla() {
    var table = $('#tblvProgramacion_Resultado').DataTable( {
        keys: true
    } );
}