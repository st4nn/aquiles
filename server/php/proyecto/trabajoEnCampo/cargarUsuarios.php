<?php
   
   include("../../conectar.php"); 

   $link = Conectar();

   $sql = "SELECT 
            login.idLogin AS id,
            datosUsuarios.Nombre
         FROM 
            login
            INNER JOIN datosUsuarios ON datosUsuarios.idLogin = login.idLogin
         WHERE 
            login.Estado = 'Activo'
         ORDER BY
            datosUsuarios.Nombre;";

   $result = $link->query(utf8_decode($sql));

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
      echo json_encode($Usuarios);
   } else
   {
      echo 0;
   }

?>