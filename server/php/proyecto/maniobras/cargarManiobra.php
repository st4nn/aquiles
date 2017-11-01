<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $Nodo = trim(addslashes($_POST['Nodo']));
   $fecha = trim(addslashes($_POST['fecha']));
   

   $where = "";

  

   $Usuario = datosUsuario($idUsuario);

   $sql = "SELECT 
               maniobras.id, 
               maniobras.Usuario, 
               maniobras.Ejecutor AS 'Ejecutor', 
               maniobras.Fecha, 
               maniobras.nroEvento AS 'Nodo', 
               maniobras.nroTrafo AS 'Trafo', 
               maniobras.Reporto AS 'Reporto', 
               maniobras.Observaciones AS 'ObservacionesApertura', 
               maniobras.fechaCierre, 
               maniobras.ObservacionesCierre AS 'ObservacionesCierre', 
               maniobras_NovedadesCausa.idNovedad AS 'Estado',
               maniobras.Novedad AS 'Observaciones', 
               maniobras.cierreEPM
            FROM 
               maniobras 
               LEFT JOIN maniobras_NovedadesCausa ON maniobras.Novedad = maniobras_NovedadesCausa.id 
            WHERE 
               maniobras.nroEvento = '$Nodo'
               AND maniobras.Fecha >= '$fecha 00:00:00'
               AND maniobras.Fecha <= '$fecha 23:59:59' $fecha2
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