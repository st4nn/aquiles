<?php
   
   include("../../conectar.php"); 

   $link = Conectar();

   $filtro = $_POST['searchPhrase'];
   $current = $_POST['current'];
   $rowCount = $_POST['rowCount'];

   $limit = "";
   
   $tCurrent = $current;

   
      $tCurrent =($current - 1) * $rowCount;
   
   if ($rowCount > 0)
   {
      $limit = "LIMIT " . $tCurrent . ", $rowCount";
   }
   
   $where = "";

   if ($filtro <> "")
   {
      $where = " WHERE 
                  Login.Usuario LIKE '%" . $filtro . "%'
                  OR DatosUsuarios.Nombre LIKE '%" . $filtro . "%'
                  OR DatosUsuarios.Cargo LIKE '%" . $filtro . "%'
                  OR DatosUsuarios.Correo LIKE '%" . $filtro . "%' ";
   }

   $sql = "SELECT COUNT(*) AS Cantidad FROM login AS Login
            INNER JOIN datosUsuarios AS DatosUsuarios ON Login.idLogin = DatosUsuarios.idLogin $where;";
   $result = $link->query($sql);
   $fila =  $result->fetch_array(MYSQLI_ASSOC);
 
   $sql = "SELECT 
            Login.idLogin AS id,
            Login.Usuario,
            DatosUsuarios.Nombre,
            Login.idPerfil,
            Perfiles.Nombre AS 'Perfil',
            DatosUsuarios.Cargo,
            DatosUsuarios.Correo
         FROM 
            login AS Login
            INNER JOIN datosUsuarios AS DatosUsuarios ON Login.idLogin = DatosUsuarios.idLogin 
            INNER JOIN Perfiles ON Perfiles.id = Login.idPerfil
         $where;";

   $result = $link->query($sql);

   $Usuarios = array();
   $Usuarios['current'] = $current;
   $Usuarios['rowCount'] = 0;
   $Usuarios['total'] = $fila['Cantidad'];
   $Usuarios['rows'] = array();

   if ( $result->num_rows > 0)
   {
      $idx = 0;
      while ($row = mysqli_fetch_assoc($result))
      { 
         $Usuarios['rows'][$idx] = array();
         foreach ($row as $key => $value) 
         {
            $Usuarios['rows'][$idx][$key] = utf8_encode($value);
         }

         $idx++;
      }

      $Usuarios['rowCount'] = $result->num_rows;
      
      mysqli_free_result($result);  
   }

   echo json_encode($Usuarios);
?>