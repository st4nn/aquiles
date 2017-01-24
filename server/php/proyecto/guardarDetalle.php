<?php 
	include("../conectar.php"); 
	$link = Conectar();

   date_default_timezone_set('America/Bogota');

	$parametros = $_POST;

	$columnasParametros = array_keys($parametros);
   $sql = "SHOW COLUMNS FROM Produccion;";

   $result = $link->query($sql);

   $idx = 0;
   if ( $result->num_rows > 0)
   {

      $Columnas = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         
        $Columnas[$idx] = $row['Field'];
         
         $idx++;
      }

         mysqli_free_result($result);  
         $diferencias = array_diff($columnasParametros, $Columnas);
         	$alter = "";
         
         foreach ($diferencias as $key => $value) 
         {
         	$alter .= " ADD $value VARCHAR(255) NULL DEFAULT NULL, ";
         }

         $alter = substr($alter, 0, -2);

         if ($alter <> "")
         {
         	$alter = "ALTER TABLE Produccion " . $alter . ";";
         	$link->query($alter);

         	 if ($link->error <> "")
         	 {
         	 	echo $link->error . "<br>" . $alter;
         	 }
         }

         $campos = "";
         $values = "";
         $values2 = "";

         foreach ($parametros as $key => $value) 
         {
         	$campos .= $key . ", ";
         	$values .= 	"'" . addslashes($value) . "', ";
         	$values2 .= $key . " = VALUES(" . $key . "), ";
         }

         $campos = substr($campos, 0, -2);
         $values = substr($values, 0, -2);
         $values2 = "fechaCargue = '" . date('Y-m-d H:i:s') . "', " .  substr($values2, 0, -2);

         if ($campos <> "")
         {
         	if ($parametros['Consecutivo'] == 99999999)
            {
               $sql = "SELECT CodigoReferencia, HoraInicio FROM Produccion WHERE CodigoReferencia = '" . $parametros['CodigoReferencia'] . "' AND HoraInicio = '" . $parametros['HoraInicio'] . "';";
               $result = $link->query(utf8_decode($sql));
               if ( $result->num_rows == 0)
               {
                  $sql = "INSERT INTO Produccion (id, $campos) VALUES (16, $values) ON DUPLICATE KEY UPDATE $values2;";
               } else
               {
                  $sql = "UPDATE Produccion SET Total = 0, Sacos = 0, fechaCargue = '" . date('Y-m-d H:i:s') . "' WHERE Consecutivo = '99999999';";
               }
            } else
            {
               $sql = "INSERT INTO Produccion ($campos) VALUES ($values);";
            }

            	$result = $link->query(utf8_decode($sql));

            	if ($link->error <> "")
            	 {
            	 	echo $link->error . "<br>" . $sql;

                  $fp = fopen('error_' + date('YmdHis') + '.txt', 'w');
                  fwrite($fp, $link->error . " \n " . $sql);
                  fclose($fp);
            	 } else
                {
                  echo 1;
                }
         }

         include('descuentoPorFormula.php');
         
   } else
   {
      echo 0;
   }

   //$link->query(utf8_decode($sql));
?>

