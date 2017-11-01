function iniciarModulo()
{
    $("#lblHeader_NomModulo").text("Consulta de Transformadores");

    //$('.input-mask').mask();
    $("#frmGDE_Busqueda").on("submit", function(evento)
    {
        evento.preventDefault();
        $("#cntGDE_Informacion div").remove();

        var dTipo = $("#txtGDE_Parametro option:selected").attr("data-tipo");
        $.post('server/php/proyecto/GDE/cargarTrafos.php', 
            {
                Usuario: Usuario.id, 
                Parametro : $("#txtGDE_Parametro").val(), 
                Tipo : dTipo, 
                Filtro : $("#txtGDE_Filtro").val()
            }, function(data, textStatus, xhr) 
        {
            $("#tblGDE_Resultado div").remove();
            var tds = "";
            if (data != 0)
            {
                $.each(data, function(index, val) 
                {
                    tds += '<div class="col-sm-6" style="border-bottom: 1px solid gray; min-height:68px">';
                            tds += '<small class="col-sm-3 text-right">' + index.replace(/_/gi, ' ') + '</small>';
                            tds += '<div class="col-sm-9">';
                                tds += '<h4 class="col-sm-12 text-left">' + val + '</h4>';
                            tds += '</div>';
                    tds += '</div>';
                });
                $("#tblGDE_Resultado").append(tds);
            } else
            {
                Mensaje("Hey", "No hay datos que coincidan con esa búsqueda", "danger");
            }
        }, "json");
    });
}