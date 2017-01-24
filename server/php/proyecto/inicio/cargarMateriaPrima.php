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
      $where .= " ingresoMateriaPrima.FechaIngreso >= '$Desde 00:00:00' ";
   }

   if ($Hasta <> "")
   {
      if ($Desde <> "")
      {
         $where .= " AND ";
      }
      $where .= " ingresoMateriaPrima.FechaIngreso <= '$Hasta  23:59:59' ";
   }

   if ($where <> "")
   {
      $where = " WHERE " . $where;
   }

   $Usuario = datosUsuario($idUsuario);

   $sql = "SELECT Nombre, SUM(Ingresos) AS Ingresos, SUM(Salidas) AS Salidas FROM (SELECT 
               materiaPrima.Nombre,
               SUM(ingresoMateriaPrima.Cantidad) AS Ingresos,
               0 AS Salidas
            FROM
               ingresoMateriaPrima
               INNER JOIN materiaPrima ON materiaPrima.id = ingresoMateriaPrima.idMateriaPrima
               $where ";

            if ($where <> "")
            {
               $sql .= " AND ";
            } else
            {
               $sql .= " WHERE ";
            }

      $sql .= "ingresoMateriaPrima.Cantidad > 0
               GROUP BY ingresoMateriaPrima.idMateriaPrima
            UNION ALL
            SELECT 
               materiaPrima.Nombre,
               0 AS Ingresos,
               SUM(ingresoMateriaPrima.Cantidad) AS Salidas
            FROM
               ingresoMateriaPrima
               INNER JOIN materiaPrima ON materiaPrima.id = ingresoMateriaPrima.idMateriaPrima
               $where ";

            if ($where <> "")
            {
               $sql .= " AND ";
            } else
            {
               $sql .= " WHERE ";
            }

      $sql .= "ingresoMateriaPrima.Cantidad < 0
            GROUP BY ingresoMateriaPrima.idMateriaPrima) AS datos GROUP BY Nombre;";

   $result = $link->query($sql);

   $idx = 0;
   $CantidadPositiva = 0;
   $CantidadNegativa = 0;

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
         
         $CantidadPositiva += $row['Ingresos'];
         $CantidadNegativa += $row['Salidas'];

         $idx++;
      }

      if ($CantidadPositiva > ($CantidadNegativa * -1))
      {
         $Resultado[($idx - 1)]['Total'] = $CantidadPositiva;
      } else
      {
         $Resultado[($idx - 1)]['Total'] = ($CantidadNegativa * -1);
      }
      

         mysqli_free_result($result);
         echo json_encode($Resultado);
   } else
   {
      echo 0;
   }
?>