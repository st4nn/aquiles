<?php
   
   include("../../conectar.php"); 
   include("../datosUsuario.php"); 

   $link = Conectar();

   $Usuario = addslashes($_POST['Usuario']);
   $Ejecutor = addslashes($_POST['Ejecutor']);

   $Desde = addslashes($_POST['Desde']);

   $aUsuario = datosUsuario($Usuario);

   $condicion = '';
   
      $condicion = "WHERE v_ConsolidadoDeManiobras.Ejecutor = '$Ejecutor'";
   
    $ejecutor = "";
   if ($aUsuario['idPerfil'] == 9)
   {
      $ejecutor .= " AND v_ConsolidadoDeManiobras.Ejecutor LIKE '" . $aUsuario['Empresa'] . "' ";
   }

   if ($condicion == "")
   {
      $condicion = " WHERE ";
   } else
   {
      $condicion .= " AND ";
   }

   $condFecha = " v_ConsolidadoDeManiobras.Fecha_Energizacion >= '" . $Desde . " 00:00:00'";

   $sql = "SELECT 
            *
         FROM 
            v_ConsolidadoDeManiobras
         $condicion $condFecha $ejecutor
         ORDER BY v_ConsolidadoDeManiobras.Ejecutor, v_ConsolidadoDeManiobras.Fecha_Energizacion;";

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