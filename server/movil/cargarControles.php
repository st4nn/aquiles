<?php
  include("../php/conectar.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $fechaCargue = addslashes($_POST['fechaCargue']);

   $sql = "SELECT 
            id, 
            Proceso, 
            Tipo, 
            Encabezado, 
            Orden, 
            idCampo, 
            idContenedor, 
            Opciones, 
            Icono
         FROM 
            frmControles 
         WHERE 
            frmControles.fechaCargue > '$fechaCargue'
         ORDER BY frmControles.fechaCargue ASC LIMIT 0, 500;";
         
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