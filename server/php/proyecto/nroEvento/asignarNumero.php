<?php
  include("../../conectar.php"); 

   $link = Conectar();

   $Usuario = addslashes($_POST['Usuario']);
   $Filtro = addslashes($_POST['Filtro']);
   $Parametro = addslashes($_POST['Parametro']);
   $Numero = addslashes($_POST['Numero']);
   $Circuito = addslashes($_POST['Circuito']);

     $sql = "UPDATE Programacion_Maniobras_Unificado SET NUMERO_DE_EVENTO = '$Numero' WHERE Programacion_Maniobras_Unificado.$Parametro LIKE '$Filtro' AND CIRCUITO = '$Circuito';";

     $link->query(utf8_decode($sql));
     
    if ($link->error <> "")
    {
      echo $link->error;
    } else
    {
        echo $link->insert_id;
    }
?>
