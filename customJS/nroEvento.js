function iniciarModulo()
{
    $("#lblHeader_NomModulo").text("Ingresar Numero de Evento");

     if (Usuario.Nivel >= 9)
            {
                $("#cntNroEvento_Asignar").hide();
                $("#btnNroEvento_Borrar").hide();
            }

    $("#frmNroEvento_Busqueda").on("submit", function(evento)
    {
        evento.preventDefault();
        $(this).find('.imgCargando').show();
        $("#cntNroEvento_BotonesCircuito button").remove();
        $.post('server/php/proyecto/nroEvento/cargarProgramacionManiobras.php', {Usuario: Usuario.id, Parametro : $("#txtNroEvento_Parametro").val(), Filtro : $("#txtNroEvento_Filtro").val()}, function(data, textStatus, xhr) 
        {
            $("#chkNroEvento_ProgramacionBorrar").prop("checked", false);
            $(this).find('.imgCargando').hide();
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

                     tds += '<tr idProgramacion="' + val.id + '">';
                        tds += '<td idEdit="0" class="c-white">' + val.id + '</td>';
                        tds += '<td><input type="checkbox" class="chkNroEvento_Programacion chkNroEvento_ProgramacionBorrar" idProgramacion="' + val.id + '"></td>';
                        tds += '<td><button class="btn btn-info waves-effect btnProgramacion_Editar"><i class="zmdi zmdi-border-color zmdi-hc-fw" idProgramacion="' + val.id + '"></i></button></td>';
                        tds += '<td idEdit="3">' + val.circuito + '</td>';
                        tds += '<td idEdit="4">' + val.numero_de_evento + '</td>';
                        tds += '<td idEdit="5">' + val.numero_de_trafo + '</td>';
                        tds += '<td idEdit="6">' + val.numero_de_nodo + '</td>';
                        tds += '<td idEdit="7">' + val.fases + '</td>';
                        tds += '<td idEdit="8">' + val.kva + '</td>';
                        tds += '<td idEdit="9">' + val.bla + '</td>';
                        tds += '<td idEdit="10">' + val.fecha_programacion + '</td>';
                        tds += '<td idEdit="11">' + val.hora_de_apertura + '</td>';
                        tds += '<td idEdit="12">' + val.hora_de_cierre + '</td>';
                        tds += '<td idEdit="13">' + val.direccion + '</td>';
                        tds += '<td idEdit="14">' + val.barrio + '</td>';
                        tds += '<td idEdit="15">' + val.encargado_con_no_de_divisa_en_campo + '</td>';
                        tds += '<td idEdit="16">' + val.no_telefono_encargado + '</td>';
                        tds += '<td idEdit="17">' + val.observaciones + '</td>';
                        tds += '<td idEdit="21">' + val.empresa + '</td>';
                        tds += '<td idEdit="18">' + val.municipio + '</td>';
                        tds += '<td idEdit="19">' + val.latitud.replace(",", ".") + '</td>';
                        tds += '<td idEdit="20">' + val.longitud.replace(",", ".") + '</td>';
                        
                     tds += "</tr>";
                });
                $("#tblNroEvento_Resultado").crearDataTable(tds);
                $("#cntNroEvento_BotonesCircuito").append(tdsBotonesCircuito);
                $("#lblNroEvento_CircuitosIdentificados").text(idxCircuito);

                if ($("#txtNroEvento_Circuito").val() != '')
                {
                    $(".btnNroEvento_BotonCircuito:contains('" + $("#txtNroEvento_Circuito").val() + "')").trigger('click');
                    $("#txtNroEvento_Circuito").val('');
                }
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
                $("#frmNroEvento_Busqueda").trigger('submit');
                $(".btnNroEvento_BotonCircuito:contains('" + $("#txtNroEvento_Circuito").val() + "')").trigger('click');
                $("#txtNroEvento_Resultado").val($("#txtNroEvento_Circuito").val());
            }
        });
    });

    $("#chkNroEvento_ProgramacionBorrar").on("click", function()
    {
        $(".chkNroEvento_ProgramacionBorrar:visible").prop("checked", $("#chkNroEvento_ProgramacionBorrar").is(":checked"));
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

    $(document).delegate('.btnProgramacion_Editar', 'click', function(event) 
    {
        $("#cntNroEvento_EditarRegistro").modal("show");

        var fila = $(this).parent("td").parent("tr");
        var celdas = $(fila).find("td");

        var idEdit = 0;
        $.each(celdas, function(index, val) 
        {
             if ($(val).attr("idEdit") !== undefined)
             {
                idEdit = $(val).attr("idEdit");

                if ($("#frmNroEvento_EditarRegistro .guardar[idEdit=" + idEdit + "]").length > 0)
                {
                    $("#frmNroEvento_EditarRegistro .guardar[idEdit=" + idEdit + "]").val($(val).text());   
                }
             }
        });


    });

    $("#btnNroEvento_Borrar").on("click", function(evento)
    {
        evento.preventDefault();
        var cantidad = $(".chkNroEvento_ProgramacionBorrar:checked").length;
        if (cantidad > 0)
        {
            swal({
              title: "Confirmas que deseas borrar éste registro?",
              text: "No podras recuperar estos " + cantidad + " despues de borrados!",
              type: "warning",
              showCancelButton: true,
              cancelButtonText: "No, Cancelar!",
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Sí, Borrar!",
              closeOnConfirm: false
            },
            function(){
              var objs = $(".chkNroEvento_ProgramacionBorrar:checked");
              var idx = '';

              $.each(objs, function(index, val) 
              {
                    $('#tblNroEvento_Resultado tbody tr[idProgramacion=' + $(val).attr("idProgramacion") + ']').addClass('chkNroEvento_Borrar');
                   idx += $(val).attr("idProgramacion") + ', ';
              });

              idx = idx.substring(0, idx.length-2);

              $.post('server/php/proyecto/nroEvento/borrarRegistros.php', {Usuario : Usuario.id, ids  : idx}, function(data, textStatus, xhr) 
              {
                var table = $('#tblNroEvento_Resultado').DataTable();

                    table
                    .rows( '.chkNroEvento_Borrar' )
                    .remove()
                    .draw();

                swal("Borrados!", "Los registros han sido borrados.", "success");
              });
            });
        }
    });

    $("#frmNroEvento_EditarRegistro").on("submit", function(evento)
    {
        evento.preventDefault();

        $(this).generarDatosEnvio("txtNroEvento_Editar_", function(datos)
        {
            $.post('server/php/proyecto/nroEvento/actualizarRegistro.php', {Usuario : Usuario.id, datos : datos}, function(data, textStatus, xhr) 
            {
                if (data != 1)
                {
                    Mensaje("Hey", data, "danger");
                } else
                {
                    var jDatos = $.parseJSON(datos);
                    var fila = $("#tblNroEvento_Resultado tbody tr[idProgramacion=" + jDatos.id + "]");

                    var idx = 3;

                    $.each(jDatos, function(index, val) 
                    {
                        if (index == "id")
                        {
                            idx = 0;
                        }

                        if (index == "CIRCUITO")
                        {
                            idx = 3;
                        }

                        var obj = $(fila).find("td[idEdit=" + idx + "]");
                         if (obj !== undefined)
                         {
                            if (obj.length > 0)
                            {
                                $(obj).text(val);
                            }
                         }
                         idx++;
                    });

                    $("#cntNroEvento_EditarRegistro").modal("hide");                }
            });
        });
    });

}