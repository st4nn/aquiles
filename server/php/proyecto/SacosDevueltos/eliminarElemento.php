<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $idObj = addslashes($_POST['idObj']);
   $Tabla = addslashes($_POST['Tabla']);   

   $sql = "DELETE FROM $Tabla WHERE id = '$idObj';";
   $result = $link->query($sql);

   $sql = "DELETE FROM Produccion WHERE Consecutivo = '$idObj' AND Total < 0;";
   $result = $link->query($sql);

    if ($link->error <> "")
    {
      echo $link->error;
    } else
    {
        echo 1;
    }
?>