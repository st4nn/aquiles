<?php
   
   include("../../conectar.php"); 

   $link = Conectar();

   $Usuario = addslashes($_POST['Usuario']);
   $Filtro = addslashes($_POST['Filtro']);
   $Parametro = addslashes($_POST['Parametro']);

   $sql = "SELECT 
            *
         FROM 
            Programacion_Maniobras_Unificado
         WHERE
            Programacion_Maniobras_Unificado.$Parametro LIKE '$Filtro'
         ORDER BY Programacion_Maniobras_Unificado.circuito, Programacion_Maniobras_Unificado.id;";

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
            $Usuarios[$idx][strtolower($key)] = utf8_encode($value);
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