<?php
   
   include("../../conectar.php"); 

   /*
   $idUsuario = addslashes($_POST['Usuario']);
   $Inspecciones = addslashes($_POST['Inspecciones']);
   $Inspectores = $_POST['Inspectores'];
   $Desde = addslashes($_POST['Desde']);
   $Hasta = addslashes($_POST['Hasta']);
   $NumId = addslashes($_POST['NumId']);
   */

   $link = Conectar();

   $sql = "SELECT 
            id, Nombre
         FROM 
            Reportes;";

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