<?php
  include("conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $Desde = addslashes($_POST['Desde']);
   $Hasta = addslashes($_POST['Hasta']);

   $where = "";

   if ($Desde <> "")
   {
      $where .= " ingresoServiciosPublicos.fechaCargue >= '$Desde 00:00:00' ";
   }

   if ($Hasta <> "")
   {
      if ($Desde <> "")
      {
         $where .= " AND ";
      }
      $where .= " ingresoServiciosPublicos.fechaCargue <= '$Hasta  23:59:59' ";
   }

   if ($where <> "")
   {
      $where = " WHERE " . $where;
   }

   $Usuario = datosUsuario($idUsuario);

   $sql = "SELECT 
               serviciosPublicos.Nombre, 
               SUM(ingresoServiciosPublicos.Consumo) AS Consumo, 
               SUM(ingresoServiciosPublicos.Valor) AS Valor 
            FROM 
               ingresoServiciosPublicos
               INNER JOIN serviciosPublicos ON serviciosPublicos.id = ingresoServiciosPublicos.idServicio
               $where 
            GROUP BY
               ingresoServiciosPublicos.idServicio";


   $result = $link->query($sql);

   $idx = 0;
   $CantidadConsumo = 0;
   $CantidadValor = 0;

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
         
         $CantidadConsumo += $row['Consumo'];
         $CantidadValor += $row['Valor'];

         $idx++;
      }

         $Resultado[($idx - 1)]['TotalConsumo'] = $CantidadConsumo;
         $Resultado[($idx - 1)]['TotalValor'] = $CantidadValor;
      
         mysqli_free_result($result);
         echo json_encode($Resultado);
   } else
   {
      echo 0;
   }
?>