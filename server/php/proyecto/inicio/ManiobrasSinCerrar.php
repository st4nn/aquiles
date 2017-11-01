<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $Desde = addslashes($_POST['Desde']);
   $Hasta = addslashes($_POST['Hasta']);

   $Usuario = datosUsuario($idUsuario);

   $where = "maniobras.fechaCierre < '2017-01-01 00:00:00' AND maniobras.Novedad = 0";

   if ($Desde <> "")
   {
      if ($where <> "")
      {
         $where .= " AND ";
      }
      $where .= " maniobras.Fecha >= '$Desde 00:00:00' ";
   }

   if ($Hasta <> "")
   {
      if ($where <> "")
      {
         $where .= " AND ";
      }
      $where .= " maniobras.Fecha <= '$Hasta 23:59:59' ";
   }


   if ($Usuario['idPerfil'] == 9)
   {
   		if ($where <> "")
	      {
	         $where .= " AND ";
	      }
	      $where .= " maniobras.Ejecutor LIKE '" . $Usuario['Empresa'] . "' ";
   }

   if ($where <> "")
   {
      $where = " WHERE " . $where;
   }

   


   $sql = "SELECT 
               maniobras.Ejecutor AS Producto, 
               COUNT(maniobras.id) AS Cantidad
         FROM 
            maniobras  
         $where
         GROUP BY 
            maniobras.Ejecutor;";

   $result = $link->query(utf8_decode($sql));

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
         $Cantidad += $row['Cantidad'];

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