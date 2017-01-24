<?php 
	include_once("../conectar.php"); 
	$link = Conectar();

   date_default_timezone_set('America/Bogota');

   $sql = "SELECT
      Produccion.id,
      Productos.Nombre AS Producto,
      Produccion.Consecutivo,
      materiaPrima.id AS idMateriaPrima,
      SUM(Produccion.Sacos) AS Sacos,
      SUM(Produccion.Total) AS Total,
      Produccion.HoraFin,
      ((SUM(Produccion.Sacos) * formulas.Cantidad)*-1) AS Descontar
   FROM
      Produccion
      INNER JOIN productosTarjeta ON Produccion.CodigoReferencia = productosTarjeta.codigoReferencia AND Produccion.NombreReferencia = productosTarjeta.Nombre
      INNER JOIN Productos ON Productos.idTarjeta = productosTarjeta.id
      INNER JOIN formulas ON formulas.idProducto = Productos.id
      INNER JOIN materiaPrima ON materiaPrima.id = formulas.idMaterial
   WHERE
      Produccion.Descontado = 0
      AND Produccion.Consecutivo <> 99999999
   GROUP BY
      formulas.id, 
      Produccion.id;";

   $result = $link->query($sql);

   if ( $result->num_rows > 0)
   {
      $ids = "";
      $values = "";

      while ($row = mysqli_fetch_assoc($result))
      {
         $values .= '(' . $row['idMateriaPrima'] . ', ' . $row['Descontar'] . ', \'' .  $row['HoraFin'] . '\', \'Descuento por fórmula por la producción de ' . $row['Total'] . ' Kg de ' . $row['Producto'] . ' equivalente a ' . $row['Sacos'] . ' Sacos, el ' . $row['HoraFin'] . ' con referencia ' . $row['Consecutivo'] . '. id Interno: ' . $row['id'] . '\', 1), ';

         $ids .= $row['id'] . ", ";
      }

      $values = substr($values, 0, -2);
      $ids = substr($ids, 0, -2);

      $sql = "INSERT INTO ingresoMateriaPrima (idMateriaPrima, Cantidad, FechaIngreso, Observaciones, Usuario) VALUES " . $values;
      $link->query(utf8_decode($sql));

      if ($link->error <> "")
      {
         $fp = fopen('Error_' . date('YmdHis') . '.txt', 'w');
         fwrite($fp, $link->error . "\n" . $sql);
         fclose($fp);
      } else
      {
         $sql = "UPDATE ingresoMateriaPrima SET Prefijo = id WHERE Prefijo = 0;";
         $link->query(utf8_decode($sql));
         $sql = "UPDATE Produccion SET Descontado = 1 WHERE id IN (" . $ids . ');';
         $link->query(utf8_decode($sql));
      }
   } else
   {
      echo 0;
   }

?>


