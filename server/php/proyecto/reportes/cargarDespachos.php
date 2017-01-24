<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $Usuario = datosUsuario($idUsuario);
   
   $campo = 'Despachos.Fecha';
   
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
         $where
         GROUP BY 
            Despachos.Prefijo
         ORDER BY Despachos.fechaCargue DESC ;";

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