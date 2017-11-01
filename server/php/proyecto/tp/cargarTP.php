<?php
   
   include("../../conectar.php"); 

   $link = Conectar();

   $Usuario = addslashes($_POST['Usuario']);
   $Desde = addslashes($_POST['Desde']);
   $Hasta = addslashes($_POST['Hasta']);

   $sql = "SELECT 
   			Archivo_TP.id,
			Archivo_TP.Estado,
            Archivo_TP.fechaCargue,
			Archivo_TP.Numero,
			Archivo_TP.Trabajo_a_realizar,
			Archivo_TP.Fecha_Ejecucion,
			Archivo_TP.Hora_Ejecucion,
			Archivo_TP.Empresa_Ejecutora,
			Archivo_TP.Ing_Residente,
			Archivo_TP.Encargado_De_Cuadrilla,
			Archivo_TP.Encargado_Auxiliar,
			Archivo_TP.Municipio,
			Archivo_TP.Direccion,
			Archivo_TP.Motivo,
			Archivo_TP.Hora_Propuesta,
			Archivo_TP.Elementos,
			Archivo_TP.Circuito,
			Archivo_TP.Aisladero,
			Archivo_TP.KVA,
			Archivo_TP.Marca,
			Archivo_TP.Trafo_a_Instalar,
			Archivo_TP.Trafo_a_Instalar_KVA,
			Archivo_TP.Trafo_a_Instalar_Marca,
			Archivo_TP.Programado_Por,
			Archivo_TP.No_telefono,
			Archivo_TP.Ingreso,
			Archivo_TP.obsIngreso AS 'Observaciones_de_Ingreso',
			Archivo_TP.estadoFinal AS 'Estado_Final',
			Archivo_TP.Ejecucion,
         Archivo_TP.Actividad,
         Archivo_TP.Muestreado,
         Archivo_TP.Cambiado,
         Archivo_TP.Encargado_de_la_TP,
         Archivo_TP.Numero_De_Aprobacion
         FROM 
            Archivo_TP
         WHERE
            Archivo_TP.Fecha_Ejecucion >= '$Desde'
            AND Archivo_TP.Fecha_Ejecucion <= '$Hasta';";

   $result = $link->query($sql);

   $Usuarios = array();
   if ( $result->num_rows > 0)
   {
      $idx = 0;
      while ($row = mysqli_fetch_assoc($result))
      { 
         $Usuarios[$idx] = array();
         foreach ($row as $key => $value) 
         {
            $Usuarios[$idx][strtolower($key)] = utf8_encode($value);
         }

         $idx++;
      }
      mysqli_free_result($result);  
   } else
   {
      echo 0;
   }

   echo json_encode($Usuarios);
?>