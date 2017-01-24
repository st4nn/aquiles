<?php
   
   include("../../conectar.php"); 

   $link = Conectar();

   $Usuario = $_POST['Usuario'];

   $sql = "SELECT 
            Proveedores.*
         FROM 
            Proveedores
         WHERE
            Proveedores.Borrado = 0;";

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
   }

   echo json_encode($Usuarios);
?>