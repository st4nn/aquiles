<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);

   $where = "";

   $Usuario = datosUsuario($idUsuario);

   $sql = "SELECT 
               Despachos.id,
               Despachos.Fecha,
               CONCAT(Productos.Nombre, ' ', Productos.Presentacion) AS Producto, 
               Clientes.Nombre AS 'Cliente',
               Despachos.Cantidad, 
               Despachos.Observaciones, 
               Despachos.fechaCargue, 
               datosUsuarios.Nombre AS Usuario,
               COUNT(Archivos.id) AS Adjuntos
         FROM 
            Despachos  
            INNER JOIN Productos ON Productos.id = Despachos.idProducto 
            LEFT JOIN Clientes ON Clientes.id = Despachos.idCliente 
            INNER JOIN datosUsuarios ON datosUsuarios.idLogin = Despachos.Usuario
            LEFT JOIN Archivos ON Archivos.Prefijo = Despachos.Prefijo
         GROUP BY 
            Despachos.Prefijo
         ORDER BY Despachos.fechaCargue DESC  LIMIT 10;";

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