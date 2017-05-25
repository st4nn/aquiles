<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $id = "NULL";
   $idUsuario = addslashes($_POST['Usuario']);
   $idManiobra = addslashes($_POST['idManiobra']);

   $Fecha = addslashes($_POST['Fecha']);
   $Hora = addslashes($_POST['Hora']);

   $Observaciones = addslashes($_POST['Observaciones']);

    date_default_timezone_set('America/Bogota');
   $fechaCierre = date('Y-m-d H:i:s');

   $sql = "INSERT INTO maniobras(id, Usuario, fechaCierre, ObservacionesCierre) VALUES (
            " . $idManiobra . ",
            '" . $idUsuario . "',
            '" . $Fecha . " " . $Hora . "',
            '" . $Observaciones  . "')
         ON DUPLICATE KEY UPDATE
            Usuario = VALUES(Usuario),
            fechaCierre = VALUES(fechaCierre),
            ObservacionesCierre = VALUES(ObservacionesCierre);";

            

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