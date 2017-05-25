function iniciarModulo()
{
    $("#lblHeader_NomModulo").text("Selección ÓPtima");

    $("#frmNroEvento_Busqueda").on("submit", function(evento)
    {
        evento.preventDefault();
        $("#cntNroEvento_BotonesCircuito button").remove();
        $.post('server/php/proyecto/nroEvento/cargarProgramacionManiobras3.php', {Usuario: Usuario.id, Parametro : $("#txtNroEvento_Parametro").val(), Filtro : $("#txtNroEvento_Filtro").val()}, function(data, textStatus, xhr) 
        {
            var tds = "";
            var tdsBotonesCircuito = "";
            var idxCircuito = 0;
            if (data != 0)
            {
                var tmpCircuito = "";
                $.each(data, function(index, val) 
                {
                     tds += "<tr>";
                        tds += '<td class="c-white">' + val.id + '</td>';
                        tds += '<th>' + val.Publicacion + '</th>';
                        tds += '<th>' + val.Asignado + '</th>';
                        tds += '<th>' + val.Trabajado + '</th>';
                        tds += '<th>' + val.Cierre_operativo + '</th>';
                        tds += '<th>' + (val.P_de_ejecucion * 100).toFixed(2) + '</th>';
                        tds += '<th>' + val.Cargado_en_Argis + '</th>';
                        tds += '<th>' + (val.P_de_carga* 100).toFixed(2)  + '</th>';
                        tds += '<th>' + val.Aprobado_interventoria + '</th>';
                        tds += '<th>' + (val.P_de_aprobacion* 100).toFixed(2)  + '</th>';
                        tds += '<th>' + val.Pendiente_por_trabajar + '</th>';
                        tds += '<th>' + val.Pendiente_por_cargar + '</th>';
                        tds += '<th>' + val.Pendiente_por_aprobar + '</th>';
                        tds += '<th>' + val.Cierre_administrativo + '</th>';
                        tds += '<th>' + val.Informacion_laboratorio + '</th>';
                        tds += '<th>' + val.fase_1 + '</th>';
                        tds += '<th>' + val.Cambiado_ + '</th>';
                        tds += '<th>' + val.aprobado_actividades_no_cambio + '</th>';
                        tds += '<th>' + val.Pendiente_cambio + '</th>';
                        tds += '<th>' + val.Cambio_Aprobado + '</th>';
                        tds += '<th>' + val.Pendiente_aprobar_cambio + '</th>';
                        tds += '<th>' + val.Asignado_para_cambio + '</th>';
                     tds += "</tr>";
                });
                $("#tblNroEvento_Resultado").crearDataTable(tds);
                //$("#cntNroEvento_BotonesCircuito").append(tdsBotonesCircuito);
                //$("#lblNroEvento_CircuitosIdentificados").text(idxCircuito);
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

       $.post('server/php/proyecto/nroEvento/asignarNumero.php', {Usuario: Usuario.id, Parametro : $("#txtNroEvento_Parametro").val(), Filtro : $("#txtNroEvento_Filtro").val(), Numero : $("#txtNroEvento_Numero").val()}, function(data, textStatus, xhr) 
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
    });

    $(document).delegate("#tblNroEvento_Resultado_filter input[type=search]", 'change', function(event) 
    {
        console.log(obtenerFecha());
        $('.btnNroEvento_BotonCircuito').removeClass("btn-warning");
    });

}