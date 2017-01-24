<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $idProducto = addslashes($_POST['idProducto']);

   $values = "";
   if (array_key_exists("formulas", $_POST))
   {
    $datos = $_POST['formulas'];
    
     if (count($datos) > 0)
     {
       foreach ($datos as $idx => $formula) 
       {
         $values .= "('" . $idProducto . "', '" . addslashes($formula['Material']) . "', '" . addslashes($formula['Cantidad']) . "', '" . $idUsuario . "'), ";
       }
     } 
   }

   $sql = "DELETE FROM formulas WHERE idProducto = '$idProducto'";
   $link->query(utf8_decode($sql));

   if ($link->error <> "")
  {
    echo $link->error;
  } 

   if ($values <> "")
   {
      $values = substr($values, 0, -2);
      $sql = "INSERT INTO formulas(idProducto, idMaterial, Cantidad, Usuario) VALUES $values";
      $link->query(utf8_decode($sql));
      
       if ($link->error <> "")
      {
        echo $link->error;
      } 
   }

    echo 1;

?>