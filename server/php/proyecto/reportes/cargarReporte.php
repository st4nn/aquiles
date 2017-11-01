<?php
   
   include("../../conectar.php"); 

   /*
   $idUsuario = addslashes($_POST['Usuario']);
   $Inspecciones = addslashes($_POST['Inspecciones']);
   $Inspectores = $_POST['Inspectores'];
   */
   $Desde = addslashes($_POST['Desde']);
   $Hasta = addslashes($_POST['Hasta']);
   $idReporte = addslashes($_POST['idReporte']);

   $datos = array();
   
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

   $arrWhere = array();
   $idx = 0;


   if ($datos['Desde'] <> '')
   {
      $arrWhere[$idx] =  "Inspecciones.fechaLevantamiento >= '" . $datos['Desde'] . " 00:00:00' ";
      $idx++;
   }

   if ($datos['Hasta'] <> '')
   {
      $arrWhere[$idx] =  "Inspecciones.fechaLevantamiento <= '" . $datos['Hasta'] . " 23:59:59' ";
      $idx++;
   }

   $where = '';

   foreach ($arrWhere as $key => $value) 
   {
      $where .= $value . ' AND ';
   }

   if ($idx > 0)
   {
      $where = 'WHERE ' . $where . substr($where, 0, -4);
   }

   $link = Conectar();

   $sql = "SELECT * FROM Reportes WHERE id = '$idReporte';";
   $result = $link->query(utf8_decode($sql));
   $fila =  $result->fetch_array(MYSQLI_ASSOC);

   $sql = $fila['Consulta'];

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
            $Usuarios[$idx][$key] = utf8_encode($value);
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