<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
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

   $fechaCierre = 0;

   if ($datos->Novedad <> 0 AND $datos->Novedad <> "")
   {
      $fechaCierre = $datos->Fecha . ' ' . $datos->Hora;
   }

   $sql = "INSERT INTO maniobras(id, Usuario, Ejecutor, Fecha, fechaCierre, nroEvento, nroTrafo, Reporto, Observaciones, ObservacionesCierre, Novedad) VALUES (
            " . $id . ",
            '" . $idUsuario . "',
            '" . $datos->Ejecutor . "',
            '" . $datos->FechaApertura . ' ' . $datos->HoraApertura . "',
            '" . $datos->FechaCierre . ' ' . $datos->HoraCierre . "',
            '" . $datos->Nodo . "',
            '" . $datos->Trafo . "',
            '" . $datos->Reporto . "',
            '" . $datos->ObservacionesApertura . "',
            '" . $datos->ObservacionesCierre . "',
            '" . $datos->Observaciones . "')
         ON DUPLICATE KEY UPDATE
            Usuario = VALUES(Usuario),
            Ejecutor = VALUES(Ejecutor),
            Fecha = VALUES(Fecha),
            fechaCierre = VALUES(fechaCierre),
            nroEvento = VALUES(nroEvento),
            nroTrafo = VALUES(nroTrafo),
            Reporto = VALUES(Reporto),
            Observaciones = VALUES(Observaciones),
            ObservacionesCierre = VALUES(ObservacionesCierre),
            Novedad = VALUES(Novedad);";

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
      $sql = "UPDATE log_maniobras SET usuarioAccion = '$idUsuario' WHERE id IN ($nuevoId) AND usuarioAccion IS NULL;";
        $link->query(utf8_decode($sql));
  }
?>