<?php
  include("../../conectar.php"); 

   $link = Conectar();

   $Usuario = addslashes($_POST['Usuario']);
   $Filtro = addslashes($_POST['Filtro']);
   $Parametro = addslashes($_POST['Parametro']);
   $Numero = addslashes($_POST['Numero']);


     $sql = "UPDATE programacionManiobras SET nroEvento = '$Numero' WHERE programacionManiobras.$Parametro = '$Filtro';";

     $link->query(utf8_decode($sql));
     
    if ($link->error <> "")
    {
      echo $link->error;
    } else
    {
        echo $link->insert_id;
    }
?>
