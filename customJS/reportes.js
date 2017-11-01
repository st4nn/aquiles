var arrTiposInspeccion = [];
var mapaDeLaFicha = null;
function iniciarModulo()
{
    $("#lblHeader_NomModulo").text("Reportes");

    fun_Reportes_CargarReportes();

    $(".datepicker").datetimepicker(
    {
        format: 'YYYY-MM-DD',
        inline: true,
        sideBySide: true,
        locale: 'es'
    });

    $("#txtReportes_Filtros_NumId").focus();

    $("#frmReportes_Busqueda").on("submit", function(evento)
    {
        $("#cntReportes_Preloader").show();
        evento.preventDefault();
        var parametros = {} ;

        parametros.Desde = $("#txtReportes_Filtros_Desde").val();
        parametros.Hasta = $("#txtReportes_Filtros_Hasta").val();
        parametros.idReporte = $("#txtReportes_idReporte").val();

        parametros.Usuario = Usuario.id;

        $.post('server/php/proyecto/reportes/cargarReporte.php', parametros, function(data, textStatus, xhr) 
        {
            $("#tblReportes_Resultados thead tr").remove();
            var vIdInspeccion = parseInt($("#txtReportes_idReporte").val());

            $("#tblReportes_Resultados tbody tr").remove();
            
            if (data != 0)
            {
                var tdh = '<tr><th></th>';
                $.each(data[0], function(index, val) 
                {
                     tdh += '<th>' + index.replace(/_/gi, ' ') + '</th>';
                });
                tdh += '</tr>';
                $("#tblReportes_Resultados thead").append(tdh);
                var tds = '';

                $.each(data, function(index, val) 
                {
                    tds += '<tr><td></td>';
                     $.each(val, function(indice, valor) 
                     {
                          tds += '<td>' + valor + '</td>';
                     });
                     tds += '</tr>';
                });
               
                $("#tblReportes_Resultados").crearDataTable(tds, function()
                {
                    $("#cntReportes_Preloader").hide();
                });
            } else
            {
                $("#cntReportes_Preloader").hide();
            }
        }, 'json').fail(function()
        {
            $("#cntReportes_Preloader").hide();
        });
    });

    $(document).delegate('.lnkReportes_SeleccionarReporte', 'click', function(event) 
    {
        var Nombre = $(this).find("span").text();
        $("#lblReportes_NomReporte").text(Nombre);
        $("#txtReportes_idReporte").val($(this).attr("idReporte"));
    });
}

function fun_Reportes_CargarReportes()
{
    $.post('server/php/proyecto/reportes/cargarTipos.php', {Usuario : Usuario.id}, function(data, textStatus, xhr) 
    {
        var tds = ''
        if (data != 0)
        {
            $.each(data, function(index, val) 
            {
                tds += '<li idReporte="' + val.id + '" class="lnkReportes_SeleccionarReporte"><a href="#"><i class="zmdi zmdi-chevron-right"></i><span>' + val.Nombre + '</span></a></li>   '
            });
            $("#cntReportes_Menu").append(tds);
            $("#frmReportes_Busqueda").slideDown();
        }
    }, 'json');
}