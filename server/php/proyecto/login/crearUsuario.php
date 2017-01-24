<?php
   include("../../conectar.php"); 
   include("../../../../vendors/mensajes/correo.php");  
   $link = Conectar();

   $datos = json_decode($_POST['datos']);

   $nombre = addslashes($datos->Nombre);
   $correo = addslashes($datos->Correo);
   $cargo = addslashes($datos->Cargo);
   $perfil = addslashes($datos->Perfil);
   $usuario = addslashes($datos->Usuario);
   $clave = addslashes($datos->Clave);
   $clave2 = addslashes($datos->NClave);
   
   $pClave = $datos->Clave;

   $correo = strtolower($correo);
   
 
   $sql = "SELECT COUNT(*) AS 'Cantidad' FROM login WHERE Usuario = '$usuario';";
   $result = $link->query($sql);

   $fila =  $result->fetch_array(MYSQLI_ASSOC);

   if ($fila['Cantidad'] > 0)
   {
      echo "El Usuario ya existe, por favor seleccione otro.";
   } else
   {
      $sql = "SELECT COUNT(*) AS 'Cantidad' FROM datosUsuarios WHERE Correo = '$correo';";
      $result = $link->query($sql);

      $fila =  $result->fetch_array(MYSQLI_ASSOC);

      if ($fila['Cantidad'] > 0)
      {
         echo "El Correo ya tiene un usuario asignado, por favor seleccione otro.";
      } else
      {
         if ($clave <> $clave2)
         {
            echo "Las claves no coinciden.";
         } else
         {
            $sql = "INSERT INTO login 
                        (Usuario, Clave, Estado, idPerfil) 
                     VALUES 
                        (
                           '$usuario', 
                           '" . md5(md5(md5($clave))) . "', 
                           'Activo',
                           '$Perfil');";

            $link->query(utf8_decode($sql));
               if ( $link->affected_rows > 0)
               {
                  $nuevoId = $link->insert_id;
                  if ($nuevoId > 0)
                  {
                     
                     $sql = "INSERT INTO datosUsuarios (idLogin, Nombre, Cargo, Correo) 
                              VALUES 
                              (
                                 '$nuevoId', 
                                 '$nombre', 
                                 '$cargo', 
                                 '$correo');";
                        
                        $link->query(utf8_decode($sql));

                        //echo $link->error . " " .$link->affected_rows;   
                        

                        $mensaje = "Buen Día, $nombre
                        <br>Se ha creado un usuario de acceso para el sistema de Agromil,
                        <br><br>
                        Los datos de autenticación son:
                        <br><br>
                        <br>Url de Acceso: http://app.silicioagromil.com
                        <br>Usuario: $usuario
                        <br>Clave: $pClave";

                        $obj = EnviarCorreo($correo, "Creación de Usuario " . $nombre, $mensaje) ;
                        echo 1;
                  } else
                  {
                     echo "Hubo un error desconocido " . $link->error;
                  }
               } else
               {
                  echo "Hubo un error desconocido" . $link->error;
               }
         }
      }
   }
?>