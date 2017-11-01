<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   /*$idUsuario = addslashes($_POST['Usuario']);
   $datos = json_decode($_POST['datos']);*/

   /*
   class datos
   {
      public $id;
      public $Usuario;
      public $Ingreso;
      public $obsIngreso;
      public $estadoFinal;
      public $Ejecucion;
   };
   */

   $datos  = new stdClass();

   foreach ($_POST as $key => $value) 
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

   $fechaCierre = 0;

   if ($datos->Ejecucion <> "")
   {
      $Estado = $datos->Ejecucion;
   } else
   {
      if ($datos->estadoFinal <> "")  
      {
        $Estado = $datos->estadoFinal;
      } else
      {
        if ($datos->Ingreso <> "")  
        {
          $Estado = $datos->Ingreso;
        } else
        {
          $Estado = 'Cargada';
        } 
      }
   }

   $sql = "INSERT INTO Archivo_TP(id,  Estado, Ingreso, obsIngreso, estadoFinal, Ejecucion, Actividad, Muestreado, Cambiado, Encargado_de_la_TP, Numero_De_Aprobacion) VALUES (
            " . $id . ",
            '" . $Estado . "',
            '" . $datos->Ingreso . "',
            '" . $datos->obsIngreso . "',
            '" . $datos->estadoFinal . "',
            '" . $datos->Ejecucion . "',
            '" . $datos->Actividad . "',
            '" . $datos->Muestreado . "',
            '" . $datos->Cambiado . "',
            '" . $datos->Encargado_de_la_TP . "',
            '" . $datos->Numero_De_Aprobacion . "'
          )
         ON DUPLICATE KEY UPDATE
            Estado = VALUES(Estado),
            Ingreso = VALUES(Ingreso),
            obsIngreso = VALUES(obsIngreso),
            estadoFinal = VALUES(estadoFinal),
            Ejecucion = VALUES(Ejecucion),
            Actividad = VALUES(Actividad),
            Muestreado = VALUES(Muestreado),
            Cambiado = VALUES(Cambiado),
            Encargado_de_la_TP = VALUES(Encargado_de_la_TP),
            Numero_De_Aprobacion = VALUES(Numero_De_Aprobacion);";

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
    $Respuesta = array('id' => $nuevoId, 'Estado' => $Estado);
    echo json_encode($Respuesta);
  }
?>