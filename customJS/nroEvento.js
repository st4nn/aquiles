function iniciarModulo()
{
    $("#lblHeader_NomModulo").text("Ingresar Numero de Evento");

    $("#frmNroEvento_Busqueda").on("submit", function(evento)
    {
        evento.preventDefault();
        $.post('server/php/proyecto/nroEvento/cargarProgramacionManiobras.php', {Usuario: Usuario.id, Parametro : $("#txtNroEvento_Parametro").val(), Filtro : $("#txtNroEvento_Filtro").val()}, function(data, textStatus, xhr) 
        {
            var tds = "";
            if (data != 0)
            {
                $.each(data, function(index, val) 
                {
                     tds += "<tr>";
                        tds += '<td></td>';
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
            }
        });
    });

}