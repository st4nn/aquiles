<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $idObj = addslashes($_POST['idObj']);
   $Tabla = addslashes($_POST['Tabla']);   

   $sql = "UPDATE $Tabla SET Borrado = 1 WHERE id = '$idObj';";
   $result = $link->query($sql);

    if ($link->error <> "")
    {
      echo $link->error;
    } else
    {
        echo 1;
    }
?>