<?php
  include("../php/conectar.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $fechaCargue = addslashes($_POST['fechaCargue']);
   $idTabla = addslashes($_POST['idTabla']);

   $sql = "SELECT 
            Validador2.*
         FROM 
            Validador2
         WHERE
            Validador2.fechaCargue >= '$fechaCargue'
            AND Validador2.id > '$idTabla'
         ORDER BY Validador2.fechaCargue LIMIT 0, 500;";

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