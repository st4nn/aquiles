<?php
   
   include("../../conectar.php"); 
   include("../datosUsuario.php"); 

   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);

   $Usuario = datosUsuario($idUsuario);

   $sql = "SELECT 
            archivosProcesos.Nombre,
            archivosProcesos.Texto
         FROM 
            archivosProcesos
         WHERE
            archivosProcesos.id NOT IN (SELECT Perfiles_nothas_ArchivosProcesos.idArchivoProceso FROM Perfiles_nothas_ArchivosProcesos WHERE idPerfil = '" . $Usuario['idPerfil'] . "');";

   $result = $link->query($sql);

   $Usuarios = array();
   if ( $result->num_rows > 0)
   {
      $idx = 0;
      while ($row = mysqli_fetch_assoc($result))
      { 
         $Usuarios[$idx] = array();
         foreach ($row as $key => $value) 
         {
            $Usuarios[$idx][$key] = utf8_encode($value);
         }

         $idx++;
      }
      mysqli_free_result($result);  
   } else
   {
      echo 0;
   }

   echo json_encode($Usuarios);
?>