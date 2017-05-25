<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $fecha = addslashes($_POST['fecha']);

   $fecha2 = '';
   if (array_key_exists('fecha2', $_POST))
   {
      $fecha2 = "AND maniobras.fechaCargue > '" . addslashes($_POST['fecha2']) . "'";
   }

   $where = "";

   $Usuario = datosUsuario($idUsuario);

   $sql = "SELECT 
               maniobras.id, 
               maniobras.Usuario, 
               maniobras.Fecha AS 'Desde', 
               maniobras.fechaCierre AS 'Hasta', 
               maniobras.nroEvento AS 'Evento', 
               maniobras.nroTrafo AS 'Trafo',  
               maniobras.Reporto, 
               maniobras.Observaciones,
               maniobras.ObservacionesCierre,
               CONCAT(maniobras_Novedades.Nombre, ', ', maniobras_NovedadesCausa.Nombre) AS Novedad,
               maniobras.cierreEPM
            FROM 
               maniobras 
               LEFT JOIN maniobras_NovedadesCausa ON maniobras.Novedad = maniobras_NovedadesCausa.id 
               LEFT JOIN maniobras_Novedades ON  maniobras_NovedadesCausa.idNovedad = maniobras_Novedades.id
            WHERE 
               (maniobras.fechaCierre <> '0000-00-00 00:00:00'
               OR Novedad > 0)
               AND maniobras.Fecha >= '$fecha 00:00:00'
               AND maniobras.Fecha <= '$fecha 23:59:59' $fecha2
         ORDER BY 
            maniobras.fechaCierre ASC;";

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