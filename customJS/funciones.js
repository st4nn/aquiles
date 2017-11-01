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

jQuery.expr[':'].Contains = function(a, i, m) { 
    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0; 
  };
  jQuery.expr[':'].contains = function(a, i, m) { 
    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0; 
  };


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
        delay: 3500,
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
              type: Tipo,
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
              "sDom": '<"dt-panelmenu clearfix"lBfr>t<"dt-panelfooter clearfix"ip>',
                    buttons: [        'copy', 'excelHtml5'    ],
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

$.fn.iniciarFiltroTextoContenedores = function(selector)
{
  $(this).on("change keyup paste", function()
  {
    var str = $(this).val();

    if (str == "")
    {
      $(selector).show();
    } else
    {
      $(selector).hide();
      $(selector + ":contains('" + str + "')").show();
    }
  });
}

$.fn.cargarModulo = function(vinculo, callback)
{
  if (callback === undefined)
    {callback = function(){};}


  $(this).find(".Modulo").hide();
        var tds = "";
        var nomModulo = "modulo_" + vinculo.replace(/\s/g, "_");
        nomModulo = nomModulo.replace(/\./g, "_");
        nomModulo = nomModulo.replace(/\//g, "_");

        if ($('#' + nomModulo).length)
        {
          $('#' + nomModulo).show();

          callback();
        } else
        {
          tds += '<div id="' + nomModulo + '" class="Modulo"></div>';

          $(this).append(tds);
          $.get(vinculo + "?tmpId=" + obtenerPrefijo(), function(data) 
          {
            $("#" + nomModulo).html(data);
            callback();
          }).fail(function() {
            Mensaje("Error", "No tiene permisos para acceder a este modulo", "danger");
          });
        }
}

function calcularTiempoDiferencia(fecha, fecha2)
{
    fecha = new Date(fecha.replace(" ", "T") + "Z");
    var fechaActual = new Date(fecha2.replace(" ", "T") + "Z");
    
    var tiempo = fecha.getTime();
    var tiempoActual = fechaActual.getTime();

    var diferencia = tiempoActual-tiempo;

    var Minutos = 0;
    var Horas = 0;
    var Dias = 0;

    diferencia = parseInt(((diferencia/1000)/60));

    var respuesta = "";
    
      Minutos = diferencia;
      if (diferencia < 60)
      {
        respuesta = Minutos + " minutos";
      } else
      {
        Horas = Math.floor(diferencia/60);
        if (diferencia < 1440)
        {
          respuesta =  Horas + " horas y " + (diferencia - (Horas * 60)) + " Minutos";
        } else
        {
          
          Dias = Math.floor(diferencia/60/24);
          respuesta = Dias + " días y " + (Horas - (24 * Dias)) + " Horas y " + (diferencia - (Horas * 60)) + ' Minutos';
        }
          
      }

    return respuesta;
}


function format_number(num)
{
  num = num.replace(/\./g,'');
  if(!isNaN(num))
  {
    num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
    num = num.split('').reverse().join('').replace(/^[\.]/,'');
  }
    
  return num;
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
        "sFirst":    "Primero",
        "sLast":     "Último",
        "sNext":     "Siguiente",
        "sPrevious": "Anterior"
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
        responsive: false,
        "sDom": 'lBfrtip',
        buttons: [
        'copy', 'excel', 'pdf'
        ],
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
  
  callback();
}

$.fn.iniciarObjArchivos = function(parametros)
{
  var idObj = $(this).attr("id").replace("cnt", "");
  var tds = "";
  tds += '<div class="card">';
        tds += '<div class="card-header">';
            tds += '<h4 class="card-title">Archivos</h4>';
        tds += '</div>';
        tds += '<div class="card-body card-padding form-horizontal">';
            tds += '<div class="row">';
                tds += '<div id="cnt' + idObj + '_DivArchivo" class="fileinput fileinput-new col-sm-12">';
                    tds += '<span class="btn btn-primary btn-file btn-block waves-effect">';
                        tds += '<span class="fileinput-new">Agregar Archivo</span>';
                        tds += '<input id="txt' + idObj + '_Archivo" type="file" name="...">';
                    tds += '</span>';
                tds += '</div>';
            tds += '</div>';
            tds += '<div class="popular-post">';
                    tds += '<h2>Archivos Cargados</h2>';
               tds += '';
                tds += '<div class="m-t-20">';
                    tds += '<div id="cnt' + idObj + '_DivArchivo_Listado" class="list-group lg-alt">';
                    tds += '</div>';
                tds += '</div>';
            tds += '</div>';
        tds += '</div>';
    tds += '</div>';

    $(this).append(tds);
    tds = "";

    if ($("#cntModal_Archivos").length == 0)
  {
      tds += '<div class="modal fade" id="cntModal_Archivos" tabindex="-1" role="dialog" aria-hidden="true">';
            tds += '<div class="modal-dialog">';
                tds += '<div class="modal-content">';
                    tds += '<form id="frmModal_Archivo" class="form-horizontal" role="form">';
                        tds += '<div class="modal-header">';
                            tds += '<h4 class="modal-title">Guardar Archivo <span id="lblModal_Archivo_Nombre"></span></h4>';
                        tds += '</div>';
                        tds += '<div class="modal-body">';
                            tds += '<div class="form-group">';
                                tds += '<div class="fg-line">';
                                    tds += '<textarea id="txtModal_ArchivoDescripcion" class="form-control" rows="5" placeholder="Observaciones, Comentarios o Descripción del Archivo..."></textarea>';
                                tds += '</div>';
                            tds += '</div>';
                        tds += '</div>';
                        tds += '<div class="modal-footer">';
                            tds += '<button type="button" id="btnModal_Archivo_Cancelar" class="btn btn-link waves-effect">Cancelar</button>';
                            tds += '<button type="submit" class="btn btn-link waves-effect">Enviar</button>';
                        tds += '</div>';
                    tds += '</form>';
                tds += '</div>';
            tds += '</div>';
        tds += '</div>';

        $("body").append(tds);

        $("#btnModal_Archivo_Cancelar").on("click", function(evento)
        {
          evento.preventDefault();
          $("#cntIngresar_Archivo").modal("hide");
        });

      $('#txt' + idObj + '_Archivo').on("change", function(event)
      {
        $("#txtModal_ArchivoDescripcion").val("");
        $("#cntModal_Archivos").modal("show");
        $("#lblModal_Archivo_Nombre").text($(this).val().replace("C:\\fakepath\\", ""));
        $("#txtModal_ArchivoDescripcion").focus();

        files = event.target.files;
      });

      $("#frmModal_Archivo").on("submit", function(evento)
      {
        evento.preventDefault();
        $("#cntModal_Archivos").modal("hide");

        var data = new FormData();

        $.each(files, function(key, value)
        {
            data.append(key, value);
        });

        parametros.tmpPrefijo = $(parametros.Prefijo).val();

        if (parametros != undefined && parametros != null)
        {
          $.each(parametros, function(index, val) 
          {
            data.append(index, val);
          });
        }


        data.append("Observaciones", $("#txtModal_ArchivoDescripcion").val());
        var nomArchivo = files[0].name;

        $.ajax({
              url: 'server/php/subirArchivos.php',
              type: 'POST',
              data: data,
              cache: false,
              dataType: 'html',
              processData: false, // Don't process the files
              contentType: false, // Set content type to false as jQuery will tell the server its a query string request
              success: function(data, textStatus, jqXHR)
              {
                  if( parseInt(data) >= 1)
                  {
                    var extension = nomArchivo.split('.');
                    if (extension.length > 0)
                    {
                      extension = extension[extension.length - 1];
                    } else
                    {
                      extension = "obj";
                    }
                    var tds = " ";
                      tds += '<a href="server/Archivos/' + parametros.Prefijo + '/' + nomArchivo + '" target="_blank" class="list-group-item media">';
                              tds += '<div class="pull-left">';
                                  tds += '<div class="avatar-char ac-check">';
                                      tds += '<span class="acc-helper palette-Red bg text-uppercase">' + extension + '</span>';
                                  tds += '</div>';
                              tds += '</div>';
                              tds += '<div class="media-body">';
                                  tds += '<div class="lgi-heading">' + nomArchivo.replace(extension, "") + '</div>';
                                  tds += '<small class="lgi-text">' + $("#txtModal_ArchivoDescripcion").val() + '</small>';
                              tds += '</div>';
                          tds += '</a>';

                          $('#cnt' + idObj + '_DivArchivo_Listado').prepend(tds);
                  }
                  else
                  {
                      Mensaje('Error:', data, "danger");
                  }
              },
              error: function(jqXHR, textStatus, errorThrown)
              {
                  // Handle errors here
                  Mensaje('Error:', textStatus, "danger");
                  $("#cntIngresar_Archivo").modal("show");
              }
          });
      });
    }
}