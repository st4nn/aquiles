<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $id = "NULL";
   $idUsuario = addslashes($_POST['Usuario']);
   $idManiobra = addslashes($_POST['idManiobra']);

    date_default_timezone_set('America/Bogota');
   $fechaCierre = date('Y-m-d H:i:s');

   $sql = "INSERT INTO maniobras(id, Usuario, fechaCierre) VALUES (
            " . $idManiobra . ",
            '" . $idUsuario . "',
            '" . $fechaCierre  . "')
         ON DUPLICATE KEY UPDATE
            Usuario = VALUES(Usuario),
            fechaCierre = VALUES(fechaCierre);";

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