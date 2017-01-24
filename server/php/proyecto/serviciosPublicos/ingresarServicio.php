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

   $sql = "INSERT INTO ingresoServiciosPublicos(id, Prefijo, idServicio, Desde, Hasta, valorUnidad, Consumo, Valor, Observaciones, Usuario) VALUES (
            " . $id . ",
            '" . $datos->Prefijo . "',
            '" . $datos->idServicio . "',
            '" . $datos->Desde . "',
            '" . $datos->Hasta . "',
            '" . $datos->valorUnidad . "',
            '" . $datos->Consumo . "',
            '" . str_replace(",", ".", str_replace(".", "", $datos->Valor)) . "',
            '" . $datos->Observaciones . "',
            '" . $idUsuario . "')
         ON DUPLICATE KEY UPDATE
            Prefijo = VALUES(Prefijo), 
            idServicio = VALUES(idServicio), 
            Desde = VALUES(Desde), 
            Hasta = VALUES(Hasta), 
            valorUnidad = VALUES(valorUnidad), 
            Consumo = VALUES(Consumo), 
            Valor = VALUES(Valor), 
            Usuario = VALUES(Usuario), 
            Observaciones = VALUES(Observaciones);";

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