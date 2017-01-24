<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);

   $where = "";

   $Usuario = datosUsuario($idUsuario);

   $sql = "SELECT 
               sacosDevueltos.id,
               sacosDevueltos.Fecha,
               CONCAT(Productos.Nombre, ' ', Productos.Presentacion) AS Producto, 
               sacosDevueltos.Cantidad, 
               sacosDevueltos.CantidadKg,
               sacosDevueltos.Observaciones, 
               sacosDevueltos.fechaCargue, 
               datosUsuarios.Nombre AS Usuario,
               COUNT(Archivos.id) AS Adjuntos
         FROM 
            sacosDevueltos  
            INNER JOIN Productos ON Productos.id = sacosDevueltos.idProducto 
            INNER JOIN datosUsuarios ON datosUsuarios.idLogin = sacosDevueltos.Usuario
            LEFT JOIN Archivos ON Archivos.Prefijo = sacosDevueltos.Prefijo
         GROUP BY 
            sacosDevueltos.Prefijo
         ORDER BY sacosDevueltos.fechaCargue DESC  LIMIT 10;";

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