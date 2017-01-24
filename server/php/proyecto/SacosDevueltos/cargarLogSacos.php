<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $idProducto = addslashes($_POST['idProducto']);

   $where = "";

   $Usuario = datosUsuario($idUsuario);

   $sql = "SELECT 
               sacosDevueltos.Fecha,
               sacosDevueltos.Cantidad
         FROM 
            sacosDevueltos  
         WHERE 
            sacosDevueltos.idProducto = '$idProducto'
         ORDER BY sacosDevueltos.fechaCargue DESC  LIMIT 3;";

   $result = $link->query($sql);

   $idx = 0;
   if ( $result->num_rows > 0)
   {
      $Resultado = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         $Resultado[$idx] = array();
         foreach ($row as $key => $value) 
         {
            $Resultado[$idx][$key] = utf8_encode($value);
         }
         $idx++;
      }
         mysqli_free_result($result);  
         echo json_encode($Resultado);
   } else
   {
      echo 0;
   }
?>