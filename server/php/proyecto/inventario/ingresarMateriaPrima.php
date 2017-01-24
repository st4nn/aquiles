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

   $sql = "INSERT INTO ingresoMateriaPrima(id, idMateriaPrima, Prefijo, Cantidad, Valor, idProveedor, FechaIngreso, Observaciones, Usuario) VALUES (
            " . $id . ",
            '" . $datos->idMateriaPrima . "',
            '" . $datos->Prefijo . "',
            '" . $datos->Cantidad . "',
            '" . $datos->Valor . "',
            '" . $datos->idProveedor . "',
            '" . $datos->FechaIngreso . "',
            '" . $datos->Observaciones . "',
            '" . $idUsuario . "')
         ON DUPLICATE KEY UPDATE
            idMateriaPrima = VALUES(idMateriaPrima), 
            Prefijo = VALUES(Prefijo), 
            Cantidad = VALUES(Cantidad), 
            Valor = VALUES(Valor), 
            idProveedor = VALUES(idProveedor), 
            FechaIngreso = VALUES(FechaIngreso), 
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

      /*$sql = "INSERT INTO stock(idMateriaPrima, Cantidad, valorPromedio) VALUES (
         '" . $datos->idMateriaPrima . "',
         '" . $datos->Cantidad . "',
         '" . $datos->Valor . "'
      ) ON DUPLICATE KEY UPDATE
      Cantidad = Cantidad + VALUES(Cantidad),
      valorPromedio = ((valorPromedio + VALUES(valorPromedio))/2);";

      $link->query(utf8_decode($sql));*/
  }
?>