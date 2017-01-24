var Usuario = null;

$(document).on("ready", function()
    {
        Usuario = JSON.parse(localStorage.getItem('wsp_aquiles'));

        if (Usuario == null || Usuario == undefined)
        {
            $.aplicacion.cerrarSesion();
        }
        $.aplicacion.cargarHeader(function()
            {
              
              if(typeof iniciarModulo !== 'undefined' &&  $.isFunction(iniciarModulo)) {
                  iniciarModulo();
              }

                $("#lblCerrarSesion").click(function(evento)
                {
                  evento.preventDefault();
                  $.aplicacion.cerrarSesion();
                });
            });
    });


var aplicacion = function()
{
    this.cargarHeader = function(callback)
    {
        callback = callback || function(){};
        $.get("header.html", function(data) 
        {
            $("#header").html(data);
            callback();
        });        
    },

    this.cerrarSesion = function()
    {
        delete localStorage.wsp_aquiles;
        window.location.replace("index.html");
    }
};

$.aplicacion = new aplicacion();


$.fn.generarDatosEnvio = function(restricciones, callback)
{
  if (callback === undefined)
    {callback = function(){};}

    var obj = $(this).find(".guardar");
  var datos = {};
  datos['Usuario'] = Usuario.id;

  $.each(obj, function(index, val) 
  {
    var idObj = $(val).attr("id");
    if (idObj != undefined)
    {
        if ($(val).attr("type") == "checkbox")
        {
            datos[idObj.replace(restricciones, "")] = $(val).is(":checked");
        } else
        {
            datos[idObj.replace(restricciones, "")] = $(val).val();
        }
    }
  });
  datos = JSON.stringify(datos);  

  callback(datos);
}

$.fn.cargarDatosConf = function(Pagina, callback, datos, no_reset)
{
  if (callback === undefined)
    {callback = function(){};}

    if (no_reset === undefined)
    {no_reset = false}

    var obj = this;

  datos = datos || {Usuario: Usuario.id};
  datos.Usuario = Usuario.id;

  if (!no_reset)
  {
    $(obj).find("option").remove();
  }

  $.post('server/php/proyecto/' + Pagina + '.php', datos, function(data, textStatus, xhr) 
  {
    if (data != 0)
    {
        $(obj).llenarCombo(data, callback);
    }
  }, "json").fail(function()
  {
    Mensaje("Error", "No hay conexión al Servidor, por favor actualice la página", "danger");
  });
}

$.fn.llenarCombo = function(data, callback)
{
  if (callback === undefined)
    {callback = function(){};}

  var elemento = $(this);
      var tds = "";
      $.each(data, function(index, val) 
      {
         tds += '<option value="' + val.id + '">' + val.Nombre + '</option>';
      });
  elemento.append(tds);
  callback();
}

function Mensaje(Titulo, Mensaje, Tipo, vFrom, vAlign)
{
    if (Tipo == undefined)
    {
        Tipo = "success";
    }

    vFrom = vFrom || 'top';
    vAlign = vAlign || 'right'

    $.growl({
        message: Mensaje
    },{
        type: Tipo,
        allow_dismiss: false,
        label: 'Cancel',
        className: 'btn-xs btn-inverse',
        placement: {
            from: vFrom,
            align: vAlign
        },
        delay: 2500,
        animate: {
                enter: 'animated fadeInRight',
                exit: 'animated fadeOutRight'
        },
        offset: {
            x: 30,
            y: 30
        }
    });
}

function priAlert(Titulo, Mensaje, Tipo)
{
  swal({
              title: Titulo,
              text: Mensaje,
              type: tipo,
              timer: 2000,
              showConfirmButton: false
          });
}


function readURL(input, idObj) 
{
    var Nombre = input.value.replace("C:\\fakepath\\", "");
  
    if (input.files && input.files[0]) 
    {
        var reader = new FileReader();
        /*
        reader.onload = function (e) 
        {
           auditoria_AgregarSoporte(idObj, e.target.result, Nombre, 0);       
        }
        */
        reader.readAsDataURL(input.files[0]);
    }
}

function abrirURL(url)
{
  var win = window.open(url, "_blank", "directories=no, location=no, menubar=no, resizable=yes, scrollbars=yes, statusbar=no, tittlebar=no");
  win.focus();
}

function obtenerFecha()
{
  var f = new Date();
  return f.getFullYear() + "-" + CompletarConCero(f.getMonth() +1, 2) + "-" + CompletarConCero(f.getDate(), 2) + " " + CompletarConCero(f.getHours(), 2) + ":" + CompletarConCero(f.getMinutes(), 2) + ":" + CompletarConCero(f.getSeconds(), 2);
}
function obtenerPrefijo()
{
  var f = new Date();
  return f.getFullYear() + CompletarConCero(f.getMonth() +1, 2) + CompletarConCero(f.getDate(), 2) + CompletarConCero(f.getHours(), 2) + CompletarConCero(f.getMinutes(), 2) + CompletarConCero(f.getSeconds(), 2) + CompletarConCero(Usuario.id, 3);
}
function CompletarConCero(n, length)
{
   n = n.toString();
   while(n.length < length) n = "0" + n;
   return n;
}

function calcularTiempoPublicacion(fecha)
{
    fecha = new Date(fecha.replace(" ", "T") + "Z");
    var fechaActual = new Date();
    
    var tiempo = fecha.getTime();
    var tiempoActual = fechaActual.getTime();

    var diferencia = tiempoActual-tiempo;

    diferencia = parseInt(((diferencia/1000)/60)-300);

    var respuesta = "";
    if (diferencia < 2)
    {
      respuesta = "hace un momento";
    } else
    {
      if (diferencia < 60)
      {
        respuesta = "hace " + diferencia + " minutos";
      } else
      {
          if (diferencia < 120)
          {
            respuesta = "hace " + 1 + " hora";
          } else
          {
            if (diferencia < 1440)
            {
              respuesta = "hace " + parseInt(diferencia/60) + " horas";
            } else
            {
              if (diferencia < 43200)
              {
                respuesta = "hace " + parseInt(diferencia/60/24) + " dias";
              } else
              {
                respuesta = "hace " + parseInt(diferencia/60/24/30) + " meses";
              }
            }
          }
      }
    }

    return respuesta;
}

$.fn.iniciarSelectRemoto = function(script, delay, minimo)
{
  if (script != "" && script != undefined && script != null)
  {
    delay = delay || 300;
    minimo = minimo || 3;

    $(this).select2({
        ajax: {
          url: "server/php/proyecto/select2/" + script + ".php",
          dataType: 'json',
          delay: delay,
          data: function (params) {
            return {
              q: params.term, // search term
              page: params.page
            };
          },
          processResults: function (data, params) {
            return {
              results: data.items
            };
          },
          cache: true
        },
      language: "es",
      escapeMarkup: function (markup) { return markup; }, 
      minimumInputLength: minimo,
      templateResult: function(dato) { return dato.name;  },
      templateSelection : function(dato)  { return dato.name;   }
    });
  }
}


function separadorMiles(donde,caracter)
{
  pat = /[\*,\+,\(,\),\?,\,$,\[,\],\^]/;
  valor = donde.value;
  largo = valor.length;
  crtr = true;
  if(isNaN(caracter) || pat.test(caracter) == true)
  {
    
    caracter = new RegExp(caracter,"g");
    valor = valor.replace(caracter,"");
    donde.value = valor;
    crtr = false;
  } else
  {
    var nums = new Array();
    cont = 0;
    for(m=0;m<largo;m++)
    {
      if(valor.charAt(m) == "." || valor.charAt(m) == " ")
      {continue;}
      else
      {
        nums[cont] = valor.charAt(m);
        cont++;
      }
    }
  }
  var cad1="",cad2="",tres=0;
  if(largo > 3 && crtr == true)
  {
    for (k=nums.length-1;k>=0;k--)
    {
      cad1 = nums[k];
      cad2 = cad1 + cad2;
      tres++;
      if((tres%3) == 0)
      {
        if(k!=0)
        {
          cad2 = "." + cad2;
        }
      }
    }
    donde.value = cad2;
  }
} 

$.fn.crearDataTable = function(tds, callback)
{
  if (callback === undefined)
    {callback = function(){};}

  var dtSpanish = {
    "sProcessing":     "Procesando...",
    "sLengthMenu":     "Mostrar _MENU_ registros",
    "sZeroRecords":    "No se encontraron resultados",
    "sEmptyTable":     "Ningún dato disponible en esta tabla",
    "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
    "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
    "sInfoPostFix":    "",
    "sSearch":         "Filtrar:",
    "sUrl":            "",
    "sInfoThousands":  ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
        "sFirst":    "..",
        "sLast":     "..",
        "sNext":     ">",
        "sPrevious": "<"
    },
    "oAria": {
        "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    }
  };

  var options = {
        "aoColumnDefs": [{
          'bSortable': false,
          'aTargets': [-1]
        }],
        "iDisplayLength": 10,
        "aLengthMenu": [
          [10, 25, 50, -1],
          [10, 25, 50, "Todos"]
        ],
        "sDom": '<"dt-panelmenu clearfix"lTfr>t<"dt-panelfooter clearfix"ip>',
        "oTableTools": {
          "sSwfPath": "vendors/datatables-tabletools/swf/copy_csv_xls_pdf.swf"
        },
        "language" : dtSpanish
      };

  var idObj = $(this).attr("id");
  if ($("#" + idObj + "_wrapper").length == 1)
    {
        $(this).dataTable().fnDestroy();
    } 

    if (tds != undefined && tds != "")
    {
      $(this).find("tbody").find("tr").remove();
      $("#" + idObj + " tbody").append(tds);
    }

  $(this).DataTable(options);
  $(".DTTT_button").addClass('btn btn-outline btn-default m-l-5');
  callback();
}

function obtenerColor(hexa)
{
  if (hexa === undefined || hexa == false)
  {
    var fondos = ['palette-Red', 'palette-Pink', 'palette-Purple', 'palette-Indigo', 'palette-Blue', 'palette-Cyan', 'palette-Teal', 'palette-Green', 'palette-Lime', 'palette-Yellow', 'palette-Amber', 'palette-Orange', 'palette-Brown', 'palette-Grey', 'palette-Black'];
  } else
  {

  }
  return fondos[parseInt(Math.random() * 15)];
}

function sumarFecha(fecha, days)
{
    milisegundos=parseInt(35*24*60*60*1000);
 
    fecha=new Date(fecha);
    day=fecha.getDate();
    month=fecha.getMonth()+1;
    year=fecha.getFullYear();
 
    tiempo=fecha.getTime();
    milisegundos=parseInt(days*24*60*60*1000);
    total=fecha.setTime(tiempo+milisegundos);
    day=fecha.getDate();
    month=fecha.getMonth()+1;
    year=fecha.getFullYear();
 
    return year + "-" + CompletarConCero(month, 2)  + "-" + CompletarConCero(day, 2);   
}

/*
$.fn.iniciarBotonExportarExcel = function(datos, callback)
{
  obj = this;
  if (datos.Tabla === undefined || datos.Tabla === null)
  {
    console.error('El objeto ' + $(obj).attr('id') + ' no se puede iniciar en el metodo Iniciar Boton Exportar Excel');
  } else
  {
    if (callback === undefined)
    {
      callback = function(){};
    }  

    $(obj).on("click", function()
    {
      if ($("#cntModal_DescargarAExcel").length == 0)
      {
        var tds = "";

          tds += '<div class="modal fade" id="cntModal_DescargarAExcel" tabindex="-1" role="dialog" aria-hidden="true">';
              tds += '<div class="modal-dialog">';
                  tds += '<div class="modal-content">';
                      tds += '<form id="frmModal_DescargarAExcel" method="post" target="_blank" action="server/php/proyecto/configuracion/descargarExcel.php" class="form-horizontal" role="form">';
                          tds += '<input type="hidden" id="txtModal_DescargarAExcel_Datos" name="Datos" class="form-control guardar" placeholder="Nombre" required>';
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

        $("#btnModal_DescargarAExcel_Cancelar").on("click", function(evento)
        {
          evento.preventDefault();
          $("#cntModal_DescargarAExcel").modal("hide");
        });
      }

      $("#frmModal_DescargarAExcel")[0].reset();

      $("#txtModal_DescargarAExcel_Datos").val( $("<div>").append( $(datos.Tabla).eq(0).clone()).html());
      $("#cntModal_DescargarAExcel").modal("show");
    });

  }

}*/