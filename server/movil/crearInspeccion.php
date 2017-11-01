<?php
   include("../php/conectar.php"); 

   $link = Conectar();

   date_default_timezone_set("America/Bogota");

   $datos = $_POST['datos'];

   foreach ($datos as $key => $value) 
   {
     if (!is_array($value))
     {
        $datos[$key] = addslashes($value);
     }
   }

   $Respuesta = array('Error' => '', 'data' => 0);

   $fechaActual = date('Y-m-d H:i:s');
   

    $sql = "INSERT INTO Inspecciones(Prefijo, Codigo, coordenadas, idUsuario, fechaLevantamiento, Proceso, Datos) 
           VALUES (
              '" . $datos['Prefijo'] . "', 
              '" . $datos['Codigo'] . "', 
              '" . $datos['coordenadas'] . "', 
              '" . $datos['Usuario'] . "', 
              '" . $datos['fecha'] . "', 
              '" . $datos['Encabezado'] . "', 
              '" . $datos['Formulario'] . "')
              
            ON DUPLICATE KEY UPDATE
               Prefijo = VALUES(Prefijo), 
               Codigo = VALUES(Codigo), 
               coordenadas = VALUES(coordenadas), 
               idUsuario = VALUES(idUsuario), 
               fechaLevantamiento = VALUES(fechaLevantamiento), 
               Proceso = VALUES(Proceso), 
               Datos = VALUES(Datos),
               fechaCargue = '" . $fechaActual . "';";

    $result = $link->query(utf8_decode($sql));

    if ($link->errno > 0)
    {
      $fp = fopen('err_' . date('YmdHis') . '.txt', 'w');
      fwrite($fp, $sql . "\n\n" . $link->error);
      fclose($fp);
    }

    if ( $link->affected_rows > 0)
    {
      $Respuesta['data'] = 1;
    } else
    {
       if ($link->errno > 0)
       {
        $Respuesta['Error'] = $link->error;
       } else
       {
        $Respuesta['data'] = 1;
       }
    }

    echo json_encode($Respuesta);
?>