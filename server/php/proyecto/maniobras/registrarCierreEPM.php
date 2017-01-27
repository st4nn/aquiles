<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $id = "NULL";
   $idUsuario = addslashes($_POST['Usuario']);
   $idManiobra = addslashes($_POST['idManiobra']);
   $Estado = addslashes($_POST['Estado']);

    date_default_timezone_set('America/Bogota');
   $fechaCierre = date('Y-m-d H:i:s');

   $sql = "INSERT INTO maniobras(id, Usuario, cierreEPM) VALUES (
            " . $idManiobra . ",
            '" . $idUsuario . "',
            " . $Estado  . ")
         ON DUPLICATE KEY UPDATE
            Usuario = VALUES(Usuario),
            cierreEPM = VALUES(cierreEPM);";

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