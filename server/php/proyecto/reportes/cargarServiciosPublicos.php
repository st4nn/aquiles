<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $Usuario = datosUsuario($idUsuario);

   $campo = 'ingresoServiciosPublicos.Desde';
   $campo2 = 'ingresoServiciosPublicos.Hasta';
   
   $Desde = addslashes($_POST['Desde']);
   $Hasta = addslashes($_POST['Hasta']);

   $where = "";

   if ($Desde <> "")
   {
      $where = "$campo >= '$Desde 00:00:00'";
   }

   if ($Hasta <> "")
   {
      if ($where <> "")
      {
         $where .= " AND";
      }

      $where .= " $campo <= '$Hasta 23:59:59'";
   }

   if ($where <> "")
   {
      $where = "WHERE $where";
   }

   $sql = "SELECT 
               CONCAT (DATE_FORMAT('%Y %m/%d', ingresoServiciosPublicos.Desde), ' ', DATE_FORMAT('%Y %m/%d', ingresoServiciosPublicos.Hasta)) AS 'Periodo',
               serviciosPublicos.Nombre, 
               CONCAT (ingresoServiciosPublicos.Consumo, ' ', serviciosPublicos.Unidades) AS 'Consumo',
               ingresoServiciosPublicos.valorUnidad, 
               ingresoServiciosPublicos.Valor, 
               ingresoServiciosPublicos.Observaciones, 
               ingresoServiciosPublicos.fechaCargue, 
               datosUsuarios.Nombre AS Usuario,
               COUNT(Archivos.id) AS Adjuntos
         FROM 
            ingresoServiciosPublicos 
            INNER JOIN serviciosPublicos ON serviciosPublicos.id = ingresoServiciosPublicos.idServicio 
            INNER JOIN datosUsuarios ON datosUsuarios.idLogin = ingresoServiciosPublicos.Usuario
            LEFT JOIN Archivos ON Archivos.Prefijo = ingresoServiciosPublicos.Prefijo
         $where
         GROUP BY 
            ingresoServiciosPublicos.Prefijo
         ORDER BY ingresoServiciosPublicos.fechaCargue DESC;";

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