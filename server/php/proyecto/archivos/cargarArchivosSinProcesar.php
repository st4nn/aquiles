<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $fecha = addslashes($_POST['fecha']);

   $where = "";

   $Usuario = datosUsuario($idUsuario);

   $sql = "SELECT 
               Archivos.*,
               archivosProcesos.Tabla,
               archivosProcesos.Llave,
               datosUsuarios.Correo
            FROM 
               Archivos 
               INNER JOIN archivosProcesos ON archivosProcesos.Nombre = Archivos.Proceso
               INNER JOIN datosUsuarios ON datosUsuarios.idLogin = Archivos.idLogin
            WHERE 
               Archivos.Procesado = 0
         ORDER BY 
            Archivos.FechaCargue ASC;";

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