function iniciarModulo()
{
    $("#lblHeader_NomModulo").text("Datos Importados");

    $("#frmNroEvento_Busqueda").on("submit", function(evento)
    {
        evento.preventDefault();
        $("#cntNroEvento_BotonesCircuito button").remove();
        $.post('server/php/proyecto/nroEvento/cargarProgramacionManiobras2.php', {Usuario: Usuario.id, Parametro : $("#txtNroEvento_Parametro").val(), Filtro : $("#txtNroEvento_Filtro").val()}, function(data, textStatus, xhr) 
        {
            var tds = "";
            var tdsBotonesCircuito = "";
            var idxCircuito = 0;
            if (data != 0)
            {
                var tmpCircuito = "";
                $.each(data, function(index, val) 
                {
                    if (tmpCircuito != val.Resultado_Prueba_Cuantitativa)
                    {
                        tdsBotonesCircuito += '<button class="btn btn-default waves-effect m-5 btnNroEvento_BotonCircuito">' + val.Resultado_Prueba_Cuantitativa + '</button>';
                        tmpCircuito = val.Resultado_Prueba_Cuantitativa;
                        idxCircuito++;
                    }

                     tds += "<tr>";
                        tds += '<td class="c-white">' + val.id + '</td>';
                        tds += '<td>' + val.Usuario + '</td>';
                        tds += '<td>' + val.fechaCargue + '</td>';
                        tds += '<td>' + val.idArchivo + '</td>';
                        tds += '<td>' + val.Codigo_Recipiente + '</td>';
                        tds += '<td>' + val.Tipo_Elemento + '</td>';
                        tds += '<td>' + val.Numero_de_la_Orden + '</td>';
                        tds += '<td>' + val.Numero_de_Unidad + '</td>';
                        tds += '<td>' + val.Laboratorio_que_Realizo_el_Analisis + '</td>';
                        tds += '<td>' + val.Desc_Laboratorio_que_realizo_analisis + '</td>';
                        tds += '<td>' + val.ID_Persona_que_Toma_la_Muestra + '</td>';
                        tds += '<td>' + val.Desc_Persona_que_toma_la_muestra + '</td>';
                        tds += '<td>' + val.Responsable_de_la_Prueba + '</td>';
                        tds += '<td>' + val.Desc_Responsable_de_la_prueba + '</td>';
                        tds += '<td>' + val.Fecha_Analisis + '</td>';
                        tds += '<td>' + val.Observaciones + '</td>';
                        tds += '<td>' + val.Tipo_de_Prueba + '</td>';
                        tds += '<td>' + val.Descripcion_Tipo_de_Prueba + '</td>';
                        tds += '<td>' + val.Resultado_de_la_Prueba_Cualitativa + '</td>';
                        tds += '<td>' + val.Desc_Resultado_prueba_cualitativa + '</td>';
                        tds += '<td>' + val.Incertidumbre_Cualitativa + '</td>';
                        tds += '<td>' + val.Kit_Clor_N_Oil_50 + '</td>';
                        tds += '<td>' + val.Numero_de_Lote_del_Kit + '</td>';
                        tds += '<td>' + val.Fecha_del_vencimiento_de_Kit + '</td>';
                        tds += '<td>' + val.Pendiente_Pruebas_Cuantitativas + '</td>';
                        tds += '<td>' + val.Resultado_Prueba_Semicuantitativa + '</td>';
                        tds += '<td>' + val.Incertidumbre_Semicuantitativa + '</td>';
                        tds += '<td>' + val.NÃºmero_Analisis_Semicuantitativa + '</td>';
                        tds += '<td>' + val.Prueba_Aleatoria + '</td>';
                        tds += '<td>' + val.Resultado_Prueba_Cuantitativa + '</td>';
                        tds += '<td>' + val.Incertidumbre_Cuantitativa + '</td>';
                        tds += '<td>' + val.Numero_Analisis_Cuantitativa + '</td>';
                        tds += '<td>' + val.Peso_del_Equipo + '</td>';
                        tds += '<td>' + val.Grupo_PCB + '</td>';
                        tds += '<td>' + val.Prueba_Aleatoria_CNSS + '</td>';
                        tds += '<td>' + val.Resultado_Prueba_CNSS + '</td>';
                        tds += '<td>' + val.Incertidumbre_Cuanti_Superf_Solida + '</td>';
                        tds += '<td>' + val.Numero_Analisis_CNSS + '</td>';
                        tds += '<td>' + val.Grupo_PCB_CNSS + '</td>';
                        tds += '<td>' + val.Solicitud + '</td>';
                        tds += '<td>' + val.ID_Usuario + '</td>';
                        tds += '<td>' + val.Programa + '</td>';
                        tds += '<td>' + val.Id_Maquina + '</td>';
                        tds += '<td>' + val.Fecha_Actualizacion + '</td>';
                        tds += '<td>' + val.Hora_Actualizacion + '</td>';
                       
                     tds += "</tr>";
                });
                $("#tblNroEvento_Resultado").crearDataTable2(tds);
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