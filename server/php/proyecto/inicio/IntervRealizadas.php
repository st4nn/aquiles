<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $Desde = addslashes($_POST['Desde']);
   $Hasta = addslashes($_POST['Hasta']);
   $Usuario = datosUsuario($idUsuario);

   $where = "";

   if ($Desde <> "")
   {
      if ($where <> "")
      {
         $where .= " AND ";
      }
      $where .= " Inspecciones.fechaLevantamiento >= '$Desde 00:00:00' ";
   }

   if ($Hasta <> "")
   {
      if ($where <> "")
      {
         $where .= " AND ";
      }
      $where .= " Inspecciones.fechaLevantamiento <= '$Hasta 23:59:59' ";
   }

   if ($Usuario['idPerfil'] == 9)
   {
   		if ($where <> "")
	      {
	         $where .= " AND ";
	      }
	      $where .= " Inspecciones.Datos LIKE '" . $Usuario['Empresa'] . "' ";
   }

   if ($where <> "")
   {
      $where = " WHERE " . $where;
   }

   

   $sql = "SELECT 
               insProcesos.Texto AS Producto, 
               COUNT(Inspecciones.id) AS Cantidad
         FROM 
            Inspecciones
            INNER JOIN  insProcesos ON insProcesos.Nombre = Inspecciones.Proceso
         $where
         GROUP BY 
            Inspecciones.Proceso;";

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