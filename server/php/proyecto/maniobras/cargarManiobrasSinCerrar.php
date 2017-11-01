<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $fecha = addslashes($_POST['fecha']);

   $where = "";

   $fecha2 = '';
   if (array_key_exists('fecha2', $_POST))
   {
      $fecha2 = "AND maniobras.fechaCargue > '" . addslashes($_POST['fecha2']) . "'";
   }

   $Usuario = datosUsuario($idUsuario);

   $ejecutor = "";
   if ($Usuario['idPerfil'] == 9)
   {
      $ejecutor .= " AND maniobras.Ejecutor LIKE '" . $Usuario['Empresa'] . "' ";
   }

   $sql = "SELECT 
               id, 
               Usuario, 
               Fecha, 
               nroEvento AS 'Evento', 
               nroTrafo AS 'Trafo',  
               Reporto, 
               Observaciones
            FROM 
               maniobras 
            WHERE 
               maniobras.fechaCierre = '0000-00-00 00:00:00'
               AND Novedad = '0'
               AND maniobras.Fecha >= '$fecha 00:00:00'
               AND maniobras.Fecha <= '$fecha 23:59:59' $fecha2 
               $ejecutor
         ORDER BY 
            maniobras.Fecha ASC;";

   $result = $link->query(utf8_decode($sql));

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