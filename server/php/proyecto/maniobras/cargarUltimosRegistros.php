<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $fecha = addslashes($_POST['fecha']);

   $where = "";

   $Usuario = datosUsuario($idUsuario);

   $sql = "SELECT 
               id, 
               Usuario, 
               Fecha AS 'Desde', 
               fechaCierre AS 'Hasta', 
               nroEvento AS 'Evento', 
               nroTrafo AS 'Trafo',  
               Reporto, 
               Observaciones,
               cierreEPM
            FROM 
               maniobras 
            WHERE 
               maniobras.fechaCierre <> '0000-00-00 00:00:00'
               AND Novedad = '0'
               AND maniobras.Fecha >= '$fecha 00:00:00'
               AND maniobras.Fecha <= '$fecha 23:59:59'
         ORDER BY 
            maniobras.fechaCierre ASC;";

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