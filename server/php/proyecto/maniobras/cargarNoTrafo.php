<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $nodo = addslashes($_POST['Nodo']);
   $fecha = addslashes($_POST['fecha']);

   $where = "";

   $Usuario = datosUsuario($idUsuario);

   $sql = "SELECT 
               programacionManiobras.trafo
            FROM 
               programacionManiobras 
            WHERE 
               programacionManiobras.nodo LIKE '$nodo'
               AND programacionManiobras.programacion LIKE '$fecha';";

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
      $Resultado = 0;

       $sql = "SELECT 
               programacionManiobras.trafo
            FROM 
               programacionManiobras 
            WHERE 
               programacionManiobras.nodo LIKE '$nodo'";

      $result = $link->query($sql);
      if ( $result->num_rows > 0)
      {
         $Resultado = 8;
      }

      echo $Resultado;
   }
?>