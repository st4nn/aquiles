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

   $sql = "INSERT INTO Despachos(id, Prefijo, idProducto, Fecha, idCliente, Cantidad, Observaciones, Usuario) VALUES (
            " . $id . ",
            '" . $datos->Prefijo . "',
            '" . $datos->idProducto . "',
            '" . $datos->Fecha . ' ' . $datos->Hora . "',
            '" . $datos->Cliente . "',
            '" . str_replace(",", ".", str_replace(".", "", $datos->Cantidad)) . "',
            '" . $datos->Observaciones . "',
            '" . $idUsuario . "')
         ON DUPLICATE KEY UPDATE
            Prefijo = VALUES(Prefijo), 
            idProducto = VALUES(idProducto), 
            Fecha = VALUES(Fecha), 
            idCliente = VALUES(idCliente), 
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
      echo $nuevoId;
  }
?>