function iniciarModulo()
{
    $("#lblHeader_NomModulo").text("Datos Importados");

    $("#frmNroEvento_Busqueda").on("submit", function(evento)
    {
        evento.preventDefault();
        $("#cntNroEvento_BotonesCircuito button").remove();
        $.post('server/php/proyecto/nroEvento/cargarProgramacionManiobras.php', {Usuario: Usuario.id, Parametro : $("#txtNroEvento_Parametro").val(), Filtro : $("#txtNroEvento_Filtro").val()}, function(data, textStatus, xhr) 
        {
            var tds = "";
            var tdsBotonesCircuito = "";
            var idxCircuito = 0;
            if (data != 0)
            {
                var tmpCircuito = "";
                $.each(data, function(index, val) 
                {
                    if (tmpCircuito != val.circuito)
                    {
                        tdsBotonesCircuito += '<button class="btn btn-default waves-effect m-5 btnNroEvento_BotonCircuito">' + val.circuito + '</button>';
                        tmpCircuito = val.circuito;
                        idxCircuito++;
                    }

                     tds += "<tr>";
                        tds += '<td class="c-white">' + val.id + '</td>';
                        tds += '<td>' + val.circuito + '</td>';
                        tds += '<td>' + val.nroEvento + '</td>';
                        tds += '<td>' + val.trafo + '</td>';
                        tds += '<td>' + val.nodo + '</td>';
                        tds += '<td>' + val.fases + '</td>';
                        tds += '<td>' + val.kva + '</td>';
                        tds += '<td>' + val.bla + '</td>';
                        tds += '<td>' + val.programacion + '</td>';
                        tds += '<td>' + val.apertura + '</td>';
                        tds += '<td>' + val.cierre + '</td>';
                        tds += '<td>' + val.direccion + '</td>';
                        tds += '<td>' + val.barrio + '</td>';
                        tds += '<td>' + val.encargado + '</td>';
                        tds += '<td>' + val.telefono + '</td>';
                        tds += '<td>' + val.observaciones + '</td>';
                        tds += '<td>' + val.cuadrilla + '</td>';
                        tds += '<td>' + val.municipio + '</td>';
                        
                     tds += "</tr>";
                });
                $("#tblNroEvento_Resultado").crearDataTable(tds);
                $("#cntNroEvento_BotonesCircuito").append(tdsBotonesCircuito);
                $("#lblNroEvento_CircuitosIdentificados").text(idxCircuito);
            } else
            {
                $("#tblNroEvento_Resultado").crearDataTable();
                $("#lblNroEvento_CircuitosIdentificados").text(0);
                Mensaje("Hey", "No hay datos que coincidan con esa búsqueda", "danger");
            }
        }, "json");
    });

    $("#frmNroEvento_Asignar").on("submit", function(evento)
    {
       evento.preventDefault(); 

       $.post('server/php/proyecto/nroEvento/asignarNumero.php', {Usuario: Usuario.id, Parametro : $("#txtNroEvento_Parametro").val(), Filtro : $("#txtNroEvento_Filtro").val(), Circuito : $("#txtNroEvento_Circuito").val(), Numero : $("#txtNroEvento_Numero").val()}, function(data, textStatus, xhr) 
        {
            if (isNaN(data))
            {
                Mensaje("Error", data, "danger");
            } else
            {
                Mensaje("Hey", "El numero ha sido asignado", "success");
                $("#txtNroEvento_Numero").val("");
            }
        });
    });

    $(document).delegate('.btnNroEvento_BotonCircuito', 'click', function(event) 
    {
        $('.btnNroEvento_BotonCircuito').removeClass("btn-warning");
        
        var objFiltro = $("#tblNroEvento_Resultado_filter input[type=search]");
        $(objFiltro).val($(this).text());
        $(this).addClass('btn-warning');
        $(objFiltro).trigger('keyup');
        $("#txtNroEvento_Circuito").val($(this).text());
    });

    $(document).delegate("#tblNroEvento_Resultado_filter input[type=search]", 'change', function(event) 
    {
        console.log(obtenerFecha());
        $('.btnNroEvento_BotonCircuito').removeClass("btn-warning");
    });

}