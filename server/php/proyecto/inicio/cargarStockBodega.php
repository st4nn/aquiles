<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $Desde = addslashes($_POST['Desde']);
   $Hasta = addslashes($_POST['Hasta']);

   $where = "";

   if ($Desde <> "")
   {
      $where .= " Despachos.Fecha >= '$Desde 00:00:00' ";
   }

   if ($Hasta <> "")
   {
      if ($Desde <> "")
      {
         $where .= " AND ";
      }
      $where .= " Despachos.Fecha <= '$Hasta 23:59:59' ";
   }

   if ($where <> "")
   {
      $where = " WHERE " . $where;
   }

   $Usuario = datosUsuario($idUsuario);

   $sql = "SELECT id, Producto AS NombreReferencia, SUM(Sacos) AS Sacos
            FROM(
            SELECT
               Productos.id,
               (CASE WHEN Productos.Nombre IS NULL THEN Produccion.NombreReferencia ELSE CONCAT(Productos.Nombre, ' ', Productos.Presentacion) END) AS Producto,
               SUM(Produccion.Sacos) AS Sacos
            FROM 
               Produccion
               LEFT JOIN productosTarjeta ON productosTarjeta.codigoReferencia = Produccion.CodigoReferencia AND productosTarjeta.Nombre = Produccion.NombreReferencia
               LEFT JOIN Productos ON productosTarjeta.id = Productos.idTarjeta
            GROUP BY
               Produccion.CodigoReferencia, Produccion.NombreReferencia
            UNION ALL
            SELECT 
               Productos.id,
               CONCAT(Productos.Nombre, ' ', Productos.Presentacion) AS Producto,
               (SUM(Despachos.Cantidad) *-1) AS Sacos
            FROM
               Productos
               INNER JOIN Despachos ON Despachos.idProducto = Productos.id
            GROUP BY 
               Productos.id
            ) Datos
            GROUP BY id, Producto";

   $result = $link->query($sql);

   $idx = 0;
   $Cantidad = 0;
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
         $Cantidad += $row['Sacos'];

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