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

   $sql = "SELECT COUNT(*) AS 'Cantidad' FROM Clientes WHERE Nombre LIKE '" . $datos->Nombre . "' AND Nit LIKE '" . $datos->Nit . "' AND Borrado = 0;";
   $result = $link->query($sql);

   $fila =  $result->fetch_array(MYSQLI_ASSOC);

   if ($fila['Cantidad'] > 0)
   {
      echo "Ya existe un Cliente con ese nombre e Identificación, por favor seleccione otro.";
   } else
   {
     $sql = "INSERT INTO Clientes(id, Nombre, Nit, Telefono, Direccion, Correo) VALUES (
              " . $id . ",
              '" . $datos->Nombre . "',
              '" . $datos->Nit . "',
              '" . $datos->Telefono . "',
              '" . $datos->Direccion . "',
              '" . $datos->Correo . "')
           ON DUPLICATE KEY UPDATE
              Nombre = VALUES(Nombre), 
              Nit = VALUES(Nit), 
              Telefono = VALUES(Telefono), 
              Direccion = VALUES(Direccion), 
              Correo = VALUES(Correo);";

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