<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $nodo = addslashes($_POST['Nodo']);
   $Tipo = addslashes($_POST['Tipo']);
   $fecha = addslashes($_POST['fecha']);

   $where = "";

   $Usuario = datosUsuario($idUsuario);

   if ($Tipo == 'NODO')
   {
      $sql = "SELECT * FROM maniobras WHERE nroEvento LIKE '$nodo' AND Fecha >= '$fecha 00:00:00' AND Fecha <= '$fecha 23:59:59';";
   } else
   {
      $sql = "SELECT * FROM maniobras WHERE nroTrafo LIKE '$nodo' AND Fecha >= '$fecha 00:00:00' AND Fecha <= '$fecha 23:59:59';";
   }

   
   $result = $link->query($sql);
   if ($result->num_rows > 0)
   {
      echo 9;
   } else
   {  

      if ($Tipo == 'NODO')
      {
         $sql = "SELECT * FROM maniobras WHERE nroEvento LIKE '$nodo';";
      } else
      {
         $sql = "SELECT * FROM maniobras WHERE nroTrafo LIKE '$nodo';";
      }
      $result = $link->query($sql);

      if ($result->num_rows > 0)
      {
         echo 10;
      } else
      {
         $sql = "SELECT 
                     Programacion_Maniobras_Unificado.NUMERO_DE_TRAFO,
                     Programacion_Maniobras_Unificado.NUMERO_DE_NODO
                  FROM 
                     Programacion_Maniobras_Unificado 
                  WHERE 
                     Programacion_Maniobras_Unificado.NUMERO_DE_$Tipo LIKE '$nodo'
                     AND Programacion_Maniobras_Unificado.fecha_programacion LIKE '$fecha';";

         $result = $link->query(utf8_decode($sql));

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
                     Programacion_Maniobras_Unificado.NUMERO_DE_TRAFO,
                     Programacion_Maniobras_Unificado.NUMERO_DE_NODO
                  FROM 
                     Programacion_Maniobras_Unificado 
                  WHERE 
                     Programacion_Maniobras_Unificado.NUMERO_DE_$Tipo LIKE '$nodo';";

            $result = $link->query($sql);
            if ( $result->num_rows > 0)
            {
               $Resultado = 8;
            }

            echo $Resultado;
         }
      }
   }

?>