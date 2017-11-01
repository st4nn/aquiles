<?php
   
   include("../../conectar.php"); 


   $datos = array();
   $respuesta = array('Etiquetas' => array(), 'Datos' => array(), 'Archivos' => array());
   
   foreach ($_POST as $key => $value) 
   {
      if (!is_array($value))
      {
         $datos[$key] = addslashes($value);
      } else
      {
         $datos[$key] = $value;
      }
   }

   $link = Conectar();

   $sql = "SELECT 
               frmControles.Tipo,
               frmControles.Encabezado, 
               frmControles.Icono, 
               frmControles.idCampo, 
               frmControles.idContenedor ,
               frmControles.Opciones
            FROM 
               frmControles 
               INNER JOIN Inspecciones ON frmControles.Proceso = Inspecciones.Proceso
            WHERE 
               Inspecciones.id = '" . $datos['idInspeccion'] ."';";

   $result = $link->query(utf8_decode($sql));

   $idx = 0;
   while ($row = mysqli_fetch_assoc($result))
   {
      $respuesta['Etiquetas'][$idx] = array();
      foreach ($row as $key => $value) 
      {
         $respuesta['Etiquetas'][$row['idCampo']][$key] = utf8_encode($value);
      }
   }



   $sql = "SELECT 
            Inspecciones.*,
            insProcesos.id AS idProceso,
            datosUsuarios.Nombre AS Usuario
         FROM 
            Inspecciones
            INNER JOIN insProcesos ON insProcesos.Nombre = Inspecciones.Proceso
            INNER JOIN datosUsuarios ON datosUsuarios.idLogin = Inspecciones.idUsuario
         WHERE
            Inspecciones.id = '" . $datos['idInspeccion'] ."';";

   $result = $link->query(utf8_decode($sql));

   if ( $result->num_rows > 0)
   {
      while ($row = mysqli_fetch_assoc($result))
      { 
         foreach ($row as $key => $value) 
         {
            $respuesta['Datos'][$key] = utf8_encode($value);
         }
      }
      mysqli_free_result($result);  
   }

   $sql = "SELECT 
            levArchivos.*
         FROM 
            levArchivos
            INNER JOIN Inspecciones ON Inspecciones.Prefijo = levArchivos.IdProyecto
         WHERE
            Inspecciones.id = '" . $datos['idInspeccion'] ."';";

   $result = $link->query(utf8_decode($sql));

   $idx = 0;
   if ( $result->num_rows > 0)
   {
      while ($row = mysqli_fetch_assoc($result))
      { 
         $respuesta['Archivos'][$idx] = array();
         foreach ($row as $key => $value) 
         {
            $respuesta['Archivos'][$idx][$key] = utf8_encode($value);
         }
         $idx++;
      }
      mysqli_free_result($result);  
   } 

   echo json_encode($respuesta);
?>