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
      $where .= " sacosDevueltos.Fecha >= '$Desde 00:00:00' ";
   }

   if ($Hasta <> "")
   {
      if ($Desde <> "")
      {
         $where .= " AND ";
      }
      $where .= " sacosDevueltos.Fecha <= '$Hasta 23:59:59' ";
   }

   if ($where <> "")
   {
      $where = " WHERE " . $where;
   }

   $Usuario = datosUsuario($idUsuario);

   $sql = "SELECT 
               CONCAT(Productos.Nombre, ' ', Productos.Presentacion) AS Producto, 
               SUM(sacosDevueltos.Cantidad) AS Cantidad,
               SUM(sacosDevueltos.CantidadKg) AS CantidadKg
         FROM 
            sacosDevueltos  
            INNER JOIN Productos ON Productos.id = sacosDevueltos.idProducto 
         $where
         GROUP BY 
            Productos.Nombre, Productos.Presentacion
         ORDER BY Productos.Nombre, Productos.Presentacion DESC ;";

   $result = $link->query($sql);

   $idx = 0;
   $Cantidad = 0;
   $CantidadKg = 0;
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
         $Cantidad += $row['Cantidad'];
         $Cantidad += $row['CantidadKg'];

         $idx++;
      }
      $Resultado[($idx - 1)]['Total'] = $Cantidad;

         mysqli_free_result($result);
         echo json_encode($Resultado);
   } else
   {
      echo 0;
   }
?>