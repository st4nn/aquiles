<?php
   
   include("../../conectar.php"); 

   $link = Conectar();

   $Usuario = addslashes($_POST['Usuario']);
   $Filtro = addslashes($_POST['Filtro']);
   $Tipo = addslashes($_POST['Tipo']);
   $Parametro = addslashes($_POST['Parametro']);

   
   $condicion = '';
   if ($Tipo == 'texto' OR $Tipo == "fecha")
   {
      $condicion = "WHERE Validador2.$Parametro LIKE '%$Filtro%'";
   } else
   {
      $condicion = "WHERE Validador2.$Parametro = '$Filtro'";
   }

   $sql = "SELECT * FROM v_ConsolidadoDeManiobras $condicion";

   $result = $link->query(utf8_decode($sql));
	
	if ( $result->num_rows > 0)
   {
	   $sql = "SELECT 
	            Validador2.*,
				Consolidado_Maniobras.item,
				v_ConsolidadoDeManiobras.Ejecutor,
				v_ConsolidadoDeManiobras.Municipio,
				v_ConsolidadoDeManiobras.No_de_Nodo,
				v_ConsolidadoDeManiobras.No_de_Evento,
				DATE_FORMAT('v_ConsolidadoDeManiobras.Fecha_Energizacion'. '%m') AS Mes,
				DATE_FORMAT('v_ConsolidadoDeManiobras.Fecha_Energizacion'. '%Y') AS Ano,
				v_ConsolidadoDeManiobras.Fecha_Desenergizacion,
				v_ConsolidadoDeManiobras.Circuito_Apertura,
				Consolidado_Maniobras.Tipo_de_cliente,
				Consolidado_Maniobras.Razon_social,
				Estado_Cumplido_Observaciones.Estado_Cumplido,
				v_ConsolidadoDeManiobras.Estado_Cumplido_Observaciones AS 'Observaciones',
				Consolidado_Maniobras.`_Municipio`,
				v_ConsolidadoDeManiobras.Nombre_responsable_de_campo,
				v_ConsolidadoDeManiobras.BLA,
				v_ConsolidadoDeManiobras.Fases,
				v_ConsolidadoDeManiobras.Fecha_Energizacion,
				Consolidado_Maniobras.Duracion,
				Consolidado_Maniobras.Horas_Minutos_Segundos,
				Consolidado_Maniobras.Otros_Clientes,
				Consolidado_Maniobras.Clientes_Especiales
	         FROM 
	            Validador2
	            LEFT JOIN v_ConsolidadoDeManiobras ON Validador2.NROTRA_PK = v_ConsolidadoDeManiobras.No_de_Transformador
	            LEFT JOIN Consolidado_Maniobras ON Consolidado_Maniobras.No_de_transformador = Validador2.NROTRA_PK
	         $condicion 
	         ORDER BY v_ConsolidadoDeManiobras.Ejecutor, v_ConsolidadoDeManiobras.Fecha_Energizacion;";
   } else
   {
   		$sql = "SELECT 
	            Validador2.*,
				Consolidado_Maniobras.item,
				Consolidado_Maniobras.Ejecutor,
				Consolidado_Maniobras.Municipio,
				Consolidado_Maniobras.`_No_de_Nodo_` AS 'No_de_Nodo',
				Consolidado_Maniobras.No_de_evento,
				Consolidado_Maniobras.Mes,
				Consolidado_Maniobras.Ano,
				Consolidado_Maniobras.Fecha_Desenergizacion,
				Consolidado_Maniobras.Circuito_Apertura,
				Consolidado_Maniobras.Tipo_de_cliente,
				Consolidado_Maniobras.Razon_social,
				Consolidado_Maniobras.Estado_Cumplido,
				Consolidado_Maniobras.Observaciones,
				Consolidado_Maniobras.Nombre_responsable_de_campo,
				Consolidado_Maniobras.BLA,
				Consolidado_Maniobras.Fases,
				Consolidado_Maniobras.Fecha_Energizacion,
				Consolidado_Maniobras.Duracion,
				Consolidado_Maniobras.Horas_Minutos_Segundos,
				Consolidado_Maniobras.Otros_Clientes,
				Consolidado_Maniobras.Clientes_Especiales
	         FROM 
	            Validador2
	            LEFT JOIN v_ConsolidadoDeManiobras ON Validador2.NROTRA_PK = v_ConsolidadoDeManiobras.No_de_Transformador
	            LEFT JOIN Consolidado_Maniobras ON Consolidado_Maniobras.No_de_transformador = Validador2.NROTRA_PK
	         $condicion 
	         ORDER BY v_ConsolidadoDeManiobras.Ejecutor, v_ConsolidadoDeManiobras.Fecha_Energizacion;";
   }


   $result = $link->query(utf8_decode($sql));

   $Usuarios = array();

   if ( $result->num_rows > 0)
   {
      $idx = 0;
      while ($row = mysqli_fetch_assoc($result))
      { 
         foreach ($row as $key => $value) 
         {
            $Usuarios[$key] = utf8_encode($value);
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