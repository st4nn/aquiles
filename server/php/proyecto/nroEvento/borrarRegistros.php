<?php
  include("../../conectar.php"); 

   $link = Conectar();

   $Usuario = addslashes($_POST['Usuario']);
   $ids = addslashes($_POST['ids']);

     $sql = "DELETE FROM Programacion_Maniobras_Unificado WHERE id IN ($ids);";

     $link->query(utf8_decode($sql));
     
    if ($link->error <> "")
    {
      echo $link->error;
    } else
    {
        $sql = "UPDATE log_Programacion_Maniobras_Unificado SET usuarioAccion = '$Usuario' WHERE id IN ($ids) AND usuarioAccion IS NULL;";
        $link->query(utf8_decode($sql));
    }
?>
