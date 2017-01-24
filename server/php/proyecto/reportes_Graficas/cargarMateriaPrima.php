<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $Desde = addslashes($_POST['Desde']);
   $Hasta = addslashes($_POST['Hasta']);

   $where = "";

   $Usuario = datosUsuario($idUsuario);

   $sql = "SELECT 
               ingresoMateriaPrima.id,   
               ingresoMateriaPrima.Cantidad, 
               ingresoMateriaPrima.Valor, 
               ingresoMateriaPrima.FechaIngreso, 
               ingresoMateriaPrima.Observaciones, 
               ingresoMateriaPrima.fechaCargue, 
               datosUsuarios.Nombre AS Usuario,
               materiaPrima.Nombre AS MateriaPrima,
               materiaPrima.siglaUnidades AS Unidades,
               Proveedores.Nombre AS Proveedor,
               COUNT(Archivos.id) AS Adjuntos
         FROM 
            ingresoMateriaPrima 
            INNER JOIN datosUsuarios ON datosUsuarios.idLogin = ingresoMateriaPrima.Usuario
            INNER JOIN materiaPrima ON materiaPrima.id = ingresoMateriaPrima.idMateriaPrima
            INNER JOIN Proveedores ON Proveedores.id = ingresoMateriaPrima.idProveedor
            LEFT JOIN Archivos ON Archivos.Prefijo = ingresoMateriaPrima.Prefijo
         GROUP BY 
            ingresoMateriaPrima.Prefijo
         ORDER BY fechaCargue DESC;";

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