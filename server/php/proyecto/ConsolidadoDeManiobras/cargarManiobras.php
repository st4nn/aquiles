<?php
   
   include("../../conectar.php"); 
   include("../datosUsuario.php"); 

   $link = Conectar();

   $Usuario = addslashes($_POST['Usuario']);
   $Filtro = addslashes($_POST['Filtro']);
   $Tipo = addslashes($_POST['Tipo']);
   $Parametro = addslashes($_POST['Parametro']);

   $Desde = addslashes($_POST['Desde']);
   $Hasta = addslashes($_POST['Hasta']);

   $aUsuario = datosUsuario($Usuario);

   $condicion = '';
   if ($Tipo == 'texto' OR $Tipo == "fecha")
   {
      $condicion = "WHERE v_ConsolidadoDeManiobras.$Parametro LIKE '%$Filtro%'";
      $condicion2 = "WHERE Consolidado_Maniobras.$Parametro LIKE '%$Filtro%'";
   } else
   {
      $condicion = "WHERE v_ConsolidadoDeManiobras.$Parametro = '$Filtro'";
      $condicion2 = "WHERE Consolidado_Maniobras.$Parametro = '$Filtro'";
   }

    $ejecutor = "";
   if ($aUsuario['idPerfil'] == 9)
   {
      $ejecutor .= " AND v_ConsolidadoDeManiobras.Ejecutor LIKE '" . $aUsuario['Empresa'] . "' ";
      $ejecutor2 .= " AND Consolidado_Maniobras.Ejecutor LIKE '" . $aUsuario['Empresa'] . "' ";
   }

   if ($condicion == "")
   {
      $condicion = " WHERE ";
   } else
   {
      $condicion .= " AND ";
   }

   if ($condicion2 == "")
   {
      $condicion2 = " WHERE ";
   } else
   {
      $condicion2 .= " AND ";
   }

   $condFecha = " v_ConsolidadoDeManiobras.Fecha_Energizacion >= '" . $Desde . " 00:00:00'";
   $condFecha .= " AND v_ConsolidadoDeManiobras.Fecha_Energizacion <= '" . $Hasta . " 23:59:59'";

   $arrFechaD = explode("-", $Desde);
   $arrFechaH = explode("-", $Hasta);

   $condFecha2 = " date_format(str_to_date(Consolidado_Maniobras.Fecha_Energizacion, '%Y/%m/%d %H:%i:%s'), '%Y-%m-%d') >= '" . $Desde . " 00:00:00'";
   $condFecha2 .= " AND date_format(str_to_date(Consolidado_Maniobras.Fecha_Energizacion, '%Y/%m/%d %H:%i:%s'), '%Y-%m-%d') <= '" . $Hasta . " 23:59:59'";

   $sql = "SELECT * FROM ( SELECT 
               *
            FROM 
               v_ConsolidadoDeManiobras
            $condicion $condFecha $ejecutor
         UNION ALL
            SELECT
               Consolidado_Maniobras.id,
               Consolidado_Maniobras.Ejecutor,
               Consolidado_Maniobras.Municipio,
               Consolidado_Maniobras._No_de_Nodo_ AS No_de_Nodo,
               Consolidado_Maniobras.No_de_transformador,
               Consolidado_Maniobras.No_de_evento,
               Consolidado_Maniobras.Nombre_responsable_de_campo,
               Consolidado_Maniobras.BLA,
               Consolidado_Maniobras.Fases,
               date_format(str_to_date(Consolidado_Maniobras.Fecha_Energizacion, '%Y/%m/%d %H:%i:%s'), '%Y-%m-%d %H:%i:%s') AS Fecha_Energizacion,
               date_format(str_to_date(Consolidado_Maniobras.Fecha_Desenergizacion, '%Y/%m/%d %H:%i:%s'), '%Y-%m-%d %H:%i:%s') AS Fecha_Desenergizacion,
               Consolidado_Maniobras.Circuito_Apertura,
               '' AS Observaciones,
               Consolidado_Maniobras.Estado_Cumplido,
               Consolidado_Maniobras.Observaciones AS 'Estado_Cumplido_Observaciones',
               '' AS cierreEPM
            FROM
               Consolidado_Maniobras
               LEFT JOIN v_ConsolidadoDeManiobras ON v_ConsolidadoDeManiobras.No_de_transformador = Consolidado_Maniobras.No_de_transformador
            $condicion2 $condFecha2 $ejecutor2 AND v_ConsolidadoDeManiobras.id IS NULL) DATOS ORDER BY 2
         ";

   $result = $link->query(utf8_decode($sql));

   $Usuarios = array();

   if ( $result->num_rows > 0)
   {
      $idx = 0;
      while ($row = mysqli_fetch_assoc($result))
      { 
         $Usuarios[$idx] = array();
         foreach ($row as $key => $value) 
         {
            $Usuarios[$idx][$key] = utf8_encode($value);
         }

         $idx++;
      }
      mysqli_free_result($result);  
      echo json_encode($Usuarios);
   } else
   {
      echo 0;
   }

?>