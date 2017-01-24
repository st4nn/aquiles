<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = $_POST['Usuario'];
   $datos = json_decode($_POST['datos']);

   foreach ($datos as $key => $value) 
   {
      $datos->$key = addslashes($value);
   }

   $id = "NULL";

   if (array_key_exists("id", $datos))
   {
      if ($datos->id > 0)
      {
         $id = $datos->id;
      }
   } 

   $sql = "INSERT INTO sacosDevueltos(id, Prefijo, idProducto, Fecha, Cantidad, CantidadKg, Observaciones, Usuario) VALUES (
            " . $id . ",
            '" . $datos->Prefijo . "',
            '" . $datos->idProducto . "',
            '" . $datos->Fecha . ' ' . $datos->Hora . "',
            '" . str_replace(",", ".", str_replace(".", "", $datos->Cantidad)) . "',
            '" . str_replace(",", ".", str_replace(".", "", $datos->CantidadKg)) . "',
            '" . $datos->Observaciones . "',
            '" . $idUsuario . "')
         ON DUPLICATE KEY UPDATE
            Prefijo = VALUES(Prefijo), 
            idProducto = VALUES(idProducto), 
            Fecha = VALUES(Fecha), 
            CantidadKg = VALUES(CantidadKg), 
            Cantidad = VALUES(Cantidad), 
            Observaciones = VALUES(Observaciones), 
            Usuario = VALUES(Usuario);";

   $link->query(utf8_decode($sql));
   
   if ($id <> "NULL")
   {
      $nuevoId = $id;
   } else
   {
      $nuevoId  = $link->insert_id;
   }

  if ($link->error <> "")
  {
    echo $link->error;
  } else
  {
    $sql = "SELECT productosTarjeta.codigoReferencia, productosTarjeta.Nombre FROM productosTarjeta  INNER JOIN Productos ON productosTarjeta.id = Productos.idTarjeta WHERE Productos.id = '" . $datos->idProducto . "';";

    $result = $link->query($sql);
    $fila =  $result->fetch_array(MYSQLI_ASSOC);

    $sql = "INSERT INTO Produccion(Consecutivo, Descontado, CodigoReferencia, NombreReferencia, Total, Sacos, FechaInicio, HoraInicio, FechaFin, HoraFin, Reportado, vKey) VALUES 
          (
            $nuevoId, 
            1, 
            '" . $fila['codigoReferencia'] . "', 
            '" . $fila['Nombre'] . "', 
            '" . $datos->CantidadKg * -1 . "', 
            '" . $datos->Cantidad * -1 . "', 
            '" . $datos->Fecha . "', 
            '" . $datos->Fecha . ' ' . $datos->Hora . "', 
            '" . $datos->Fecha . "', 
            '" . $datos->Fecha . ' ' . $datos->Hora . "', 
            '1', 
            '" . $nuevoId . "');";

    $result = $link->query($sql);

    echo $nuevoId;
  }
?>