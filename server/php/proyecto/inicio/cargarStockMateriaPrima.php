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

   $sql = "SELECT 
            materiaPrima.Nombre, 
            materiaPrima.siglaUnidades AS Unidades, 
            stock.Cantidad,
            ((stock.Cantidad/materiaPrima.cantidadMaxima)*100) AS Porcentaje ,
            materiaPrima.cantidadMinima,
            materiaPrima.cantidadMaxima
         FROM 
            materiaPrima
            LEFT JOIN stock ON materiaPrima.id = stock.idMateriaPrima 
         WHERE
            materiaPrima.Borrado = 0
            ORDER BY materiaPrima.Nombre;";

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

         $idx++;
      }
         mysqli_free_result($result);
         echo json_encode($Resultado);
   } else
   {
      echo 0;
   }
?>