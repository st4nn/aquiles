<?php
   
   include("../../conectar.php"); 

   $link = Conectar();

   $Usuario = addslashes($_POST['Usuario']);
   $Filtro = addslashes($_POST['Filtro']);
   $Parametro = addslashes($_POST['Parametro']);

   $sql = "SELECT 
            *
         FROM 
            programacionManiobras
         WHERE
            programacionManiobras.$Parametro = '$Filtro';";

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