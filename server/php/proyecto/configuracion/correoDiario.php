<?php 

	include("../../conectar.php"); 
   include("../../../../vendors/mensajes/correo.php");  
	$link = Conectar();

   date_default_timezone_set('America/Bogota');

   $vParametros = array('Desde' => date('Y-m-d'), 'Hasta' => date('Y-m-d'), 'Usuario' => 1);
   $tiempo = 'El día de hoy';


   if ($_GET['t'] == 'Mes')
   {
      $desde = date('Y-m-01', strtotime("-1 month"));

      $hasta = new DateTime();
      $hasta->modify('last day of ' . date('F Y', strtotime("-1 month")));
      $tiempo = 'Durante el mes ' . $hasta->format('m \d\e Y');

      $hasta = $hasta->format('Y-m-d');
      $vParametros = array('Desde' => $desde, 'Hasta' => $hasta, 'Usuario' => 1);
   }

   $Produccion = json_decode(enviarDatos('inicio/cargarProducidoTotal', $vParametros));
   $Despachos = json_decode(enviarDatos('inicio/cargarDespachos', $vParametros));
   $despachosPorCliente = json_decode(enviarDatos('inicio/cargarDespachosPorCliente', $vParametros));
   $materiaPrima = json_decode(enviarDatos('inicio/cargarMateriaPrima', $vParametros));
   $serviciosPublicos = json_decode(enviarDatos('inicio/cargarServiciosPublicos', $vParametros));
   $stockBodega = json_decode(enviarDatos('inicio/cargarStockBodega', $vParametros));
   $stockMateriaPrima = json_decode(enviarDatos('inicio/cargarStockMateriaPrima', $vParametros));

   $mensaje = "Buen Día, <br>";

   $mensaje .= '<h1 style="background: #00C7B3; color: white; text-align: right;">Producción</h1>';

   if ($Produccion == 0)
   {
      $mensaje .= "<br>$tiempo no se registró producción";
   } else
   {
      $mensaje .= "<br>$tiempo se registró la siguiente producción:";
      foreach ($Produccion as $key => $value) 
      {
        $mensaje .= "<br><br><strong>" . $value->NombreReferencia . '</strong><br>';
        $mensaje .= number_format($value->Peso, 2, ',', '.') . ' Kg equivalen a ' . $value->Sacos . ' sacos';         
      }
   }

   $mensaje .= '<h1 style="background: #00C7B3; color: white; text-align: right;">Despachos</h1>';

   if ($Despachos == 0)
   {
      $mensaje .= "<br><br>$tiempo no se registraron despachos";
   } else
   {
      $mensaje .= "<br><br><br>$tiempo se registraron los siguientes despachos:<br>";
      $tmpCliente = "";
      foreach ($despachosPorCliente as $key => $value) 
      {
         if ($tmpCliente <> $value->Cliente)
         {
            $mensaje .= "<br>Para el Cliente <strong>" . $value->Cliente . '</strong><br>';
            $tmpCliente = $value->Cliente;
         }

        $mensaje .= $value->Cantidad . ' unidades de  ' . $value->Producto . '<br>';
      }

      $mensaje .= "<br><br>En total se despacharon:<br>";
      foreach ($Despachos as $key => $value) 
      {
         $mensaje .= '<strong>' . $value->Cantidad . '</strong> unidades de <strong>' . $value->Producto . '</strong><br>';
      }
   }

   $mensaje .= '<h1 style="background: #00C7B3; color: white; text-align: right;">Materia Prima</h1>';

   if ($materiaPrima == 0)
   {
      $mensaje .= "<br>$tiempo no se registraron movimientos de Materia Prima";
   } else
   {
      $mensaje .= "<br><br>$tiempo se registraron los siguientes movimientos de Materia Prima:<br><br>";
      $mensaje .= '<table><thead><tr><th>Materia Prima</th><th style="border-left: solid 1px;">Ingresaron</th><th style="border-left: solid 1px;">Salieron</th></thead></tbody>';
      foreach ($materiaPrima as $key => $value) 
      {
         $mensaje .= '<tr>';
         $mensaje .= '<td style="border-top: solid 1px;">'. $value->Nombre . '</td>';
         $mensaje .= '<td style="border-top: solid 1px; border-left: solid 1px; text-align:right; padding: 5px;">'. number_format($value->Ingresos, 2, ',', '.') . '</td>';
         $mensaje .= '<td style="border-top: solid 1px; border-left: solid 1px; text-align:right; padding: 5px;">'. number_format(($value->Salidas *-1), 2, ',', '.') . '</td>';
         $mensaje .= '</tr>';
      }

      $mensaje .= '</tbdoy></table>';
   }

   $mensaje .= '<h1 style="background: #00C7B3; color: white; text-align: right;">Servicios Públicos</h1>';

   if ($serviciosPublicos == 0)
   {
      $mensaje .= "<br>$tiempo no se registró pago de Servicios Públicos";
   }
   else
   {
      $mensaje .= "<br><br>$tiempo se registró el pago de los siguientes Servicios:<br><br>";
      $mensaje .= '<table></tbody>';
      foreach ($serviciosPublicos as $key => $value) 
      {
         $mensaje .= '<tr>';
         $mensaje .= '<td style="border-top: solid 1px; border-bottom: solid 1px;">'. $value->Nombre . '</td>';
         $mensaje .= '<td style="border-top: solid 1px; border-bottom: solid 1px;">$' . number_format($value->Valor, 2, ',', '.') . '</td>';
         $mensaje .= '<td style="border-top: solid 1px; border-bottom: solid 1px;">Consumo: '. $value->Consumo . '</td>';
         $mensaje .= '</tr>';
      }
      $mensaje .= '</tbdoy></table>';
   }

   $mensaje .= '<h1 style="background: #00C7B3; color: white; text-align: right;">Stock</h1>';

   if ($stockBodega == 0)
   {
      $mensaje .= "<br>Aún no se ha registrado stock en Bodega";
   }
   else
   {
      $mensaje .= "<br><br>A la fecha, el stock en Bodega es:<br><br>";
      $mensaje .= '<table></tbody>';
      $mensaje .= '<tr>';
      foreach ($stockBodega as $key => $value) 
      {
         if ($key > 0 AND $key%2==0)
         {
            $mensaje .= '</tr><tr>';
         }

         $mensaje .= '<td style="padding-left:20px;">'. $value->NombreReferencia . '</td>';
         $mensaje .= '<td style="boder-left: dotted 1px; padding:10px; text-align:right; background: #E0FFFC;">' . number_format($value->Sacos, 2, ',', '.') . ' Sacos</td>';
      }

      $mensaje .= '</tr></tbdoy></table>';
   }

   if ($stockMateriaPrima == 0)
   {
      $mensaje .= "<br>Aún no se ha registrado stock de Materia Prima";
   }
   else
   {
      $mensaje .= "<br><br>A la fecha, el stock de Materia Prima es:<br><br>";
      $mensaje .= '<table></tbody>';
      $mensaje .= '<tr>';
      foreach ($stockMateriaPrima as $key => $value) 
      {
         if ($key > 0 AND $key%3==0)
         {
            $mensaje .= '</tr><tr style="border-top: solid 2px red;">';
         }

         $mensaje .= '<td style="padding-left:20px;">'. $value->Nombre . '</td>';
         if ($value->Cantidad == "")
         {
            $value->Cantidad = 0;
         }
         $mensaje .= '<td style="boder-left: dotted 1px; padding:10px; text-align:right; background: #E0FFFC;">' . number_format($value->Cantidad, 2, ',', '.') . ' ' . $value->Unidades . '</td>';
      }

      $mensaje .= '</tr></tbdoy></table>';
   }

   $mensaje .= "<br><br><strong>Para mayor información, puede ingresar a la aplicación en el siguiente link: <a href='http://app.silicioagromil.com/home.html'>http://app.silicioagromil.com</a> con su respectivo usuario y clave";

   $sql = "SELECT GROUP_CONCAT(datosUsuarios.Correo SEPARATOR ', ') AS Correos FROM datosUsuarios;";

   $result = $link->query($sql);
   $fila =  $result->fetch_array(MYSQLI_ASSOC);

   $correo = $fila['Correos'];
   $asunto = "Consolidado del día " . date('d \d\e\l m \d\e Y');

   if ($_GET['t'] == 'Mes')
   {
      $hasta = new DateTime();
      $hasta->modify('last day of ' . date('F Y', strtotime("-1 month")));
      $hasta = $hasta->format('m \d\e Y');

      $asunto = "Consolidado del Mes " . $hasta;
   }

   //$correo = 'jhonathan.espinosa@wspgroup.com';

   echo $correo . '<br>';

   echo $asunto;

   echo '<br><br>';

   echo $mensaje;




   $obj = EnviarCorreo($correo, $asunto, $mensaje) ;

   function enviarDatos($url, $parametros)
   {
      $query = http_build_query ($parametros);

      // Create Http context details
      $contextData = array ( 
                  'method' => 'POST',
                  'header' => "Content-Type: application/x-www-form-urlencoded\r\n".
                              "Content-Length: ".strlen($query)."\r\n".
                           "User-Agent:MyAgent/1.0\r\n",
                  'content'=> $query );

      // Create context resource for our request
      $context = stream_context_create (array ( 'http' => $contextData ));

      // Read page rendered as result of your POST request
      $result =  file_get_contents (
                    'http://app.silicioagromil.com/server/php/proyecto/' . $url . '.php',  // page url
                    false,
                    $context);

      // Server response is now stored in $result variable so you can process it
      return $result;
   }

?>


