<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);

   $where = "";

   $Usuario = datosUsuario($idUsuario);

   $sql = "SELECT 
               Produccion.NombreReferencia,
               SUM(Produccion.Total) AS Peso,
               SUM(Produccion.Sacos) AS Sacos
         FROM 
            Produccion
         GROUP BY 
            Produccion.NombreReferencia;";

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