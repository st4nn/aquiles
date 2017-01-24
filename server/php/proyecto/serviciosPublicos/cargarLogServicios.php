<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $idServicio = addslashes($_POST['idServicio']);

   $where = "";

   $Usuario = datosUsuario($idUsuario);

   $sql = "SELECT 
               CONCAT(DATE_FORMAT(ingresoServiciosPublicos.Desde, '%Y %m/%d'), ' ', DATE_FORMAT(ingresoServiciosPublicos.Hasta, '%Y %m/%d')) AS 'Periodo',
               CONCAT(ingresoServiciosPublicos.Consumo, ' ', serviciosPublicos.Unidades) AS 'Consumo',
               ingresoServiciosPublicos.Valor
         FROM 
            ingresoServiciosPublicos 
            INNER JOIN serviciosPublicos ON serviciosPublicos.id = ingresoServiciosPublicos.idServicio 
         WHERE 
            ingresoServiciosPublicos.idServicio = '$idServicio'
         ORDER BY ingresoServiciosPublicos.fechaCargue DESC  LIMIT 3;";

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