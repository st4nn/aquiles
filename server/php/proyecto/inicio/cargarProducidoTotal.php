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
      $where .= " Produccion.HoraInicio >= '$Desde 00:00:00' ";
   }

   if ($Hasta <> "")
   {
      if ($Desde <> "")
      {
         $where .= " AND ";
      }
      $where .= " Produccion.HoraFin <= '$Hasta 23:59:59' ";
   }

   if ($where <> "")
   {
      $where = " WHERE " . $where;
   }

   $Usuario = datosUsuario($idUsuario);

   $sql = "SELECT 
               (CASE WHEN Productos.Nombre IS NULL THEN Produccion.NombreReferencia ELSE CONCAT(Productos.Nombre, ' ', Productos.Presentacion) END) AS NombreReferencia,
               SUM(Produccion.Total) AS Peso,
               SUM(Produccion.Sacos) AS Sacos
         FROM 
            Produccion
            LEFT JOIN productosTarjeta ON productosTarjeta.codigoReferencia = Produccion.CodigoReferencia AND productosTarjeta.Nombre = Produccion.NombreReferencia
            LEFT JOIN Productos ON productosTarjeta.id = Productos.idTarjeta
         $where
         GROUP BY 
            Produccion.CodigoReferencia, Produccion.NombreReferencia;";

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