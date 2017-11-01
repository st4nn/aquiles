<?php
   
   include("../../conectar.php"); 
   include("../datosUsuario.php"); 

   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $Filtro = addslashes($_POST['Filtro']);
   $Parametro = addslashes($_POST['Parametro']);

   $Usuario = datosUsuario($idUsuario);

    $ejecutor = "";
   if ($Usuario['idPerfil'] == 9)
   {
      $ejecutor .= " AND Programacion_Maniobras_Unificado.Empresa LIKE '" . $Usuario['Empresa'] . "' ";
   }

   $sql = "SELECT 
            Programacion_Maniobras_Unificado.*,
            Validador2.LONGITUD AS 'longitud',
            Validador2.LATITUD AS 'latitud',
            Validador2.BLA,
            Validador2.DIRECCION,
            Validador2.NOMBRE_MUNICIPIO AS 'Municipio'
         FROM 
            Programacion_Maniobras_Unificado
            LEFT JOIN Validador2 ON Validador2.NROTRA_PK = Programacion_Maniobras_Unificado.NUMERO_DE_TRAFO
         WHERE
            Programacion_Maniobras_Unificado.$Parametro LIKE '$Filtro'
            $ejecutor
         ORDER BY Programacion_Maniobras_Unificado.circuito, Programacion_Maniobras_Unificado.id;";

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