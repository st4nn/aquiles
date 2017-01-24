<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = $_POST['Usuario'];
   $datos = json_decode($_POST['datos']);

   foreach ($datos as $key => $value) 
   {
      $datos->$key = addslashes($value);
   }

   $id = "NULL";

   if (array_key_exists("id", $datos))
   {
      if ($datos->id > 0)
      {
         $id = $datos->id;
      }
   } 

   $sql = "SELECT COUNT(*) AS 'Cantidad' FROM serviciosPublicos WHERE Nombre = '" . $datos->Nombre . "' AND Borrado = 0;";
   $result = $link->query($sql);

   $fila =  $result->fetch_array(MYSQLI_ASSOC);

   if ($fila['Cantidad'] > 0 AND $id == "NULL")
   {
      echo "Ya existe un Servicio Público con ese nombre, por favor seleccione otro.";
   } else
   {
     $sql = "INSERT INTO serviciosPublicos(id, Nombre, Unidades) VALUES (
              " . $id . ",
              '" . $datos->Nombre . "',
              '" . $datos->Unidades . "')
           ON DUPLICATE KEY UPDATE
              Nombre = VALUES(Nombre), 
              Unidades = VALUES(Unidades);";

     $link->query(utf8_decode($sql));
     
     if ($id <> "NULL")
     {
        $nuevoId = $id;
     } else
     {
        $nuevoId  = $link->insert_id;
     }

    if ($link->error <> "")
    {
      echo $link->error;
    } else
    {
        echo $nuevoId;
    }
   }

?>