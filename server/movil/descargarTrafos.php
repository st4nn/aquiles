<?php
   ini_set('memory_limit', '-1');
  include("../php/conectar.php"); 
   $link = Conectar();

   //$idUsuario = addslashes($_POST['Usuario']);
   $Ciudad = addslashes($_GET['C']);

   $sql = "SELECT 
            `id`, `fechaCargue`, `NROTRA_PK`, `NODO_TRANSFORMADOR`, `DESCRIPCION`, `DIRECCION`, `BLA`, `SERIE`, `KVA`, `NRO_CTO`, `FAS`, `DESCRIPCION2`, `DESCRIPCION3`, `DESCRIPCION4`, `DESCRIPCION5`, `FECHA_INGRESO`, `PESO_LIQUIDO_AISLANTE`, `PESO_TOTAL_EQUIPO`, `PESOS_VERIFICADOS`, `NOMBRE_MUNICIPIO`, `TIPO_PROPIETARIO`, `DESCRIPCION6`, `REGION`, `AREA_DISTRIBUCION`, `LONGITUD`, `LATITUD`, `DESCRIPCION7`, `TIPO_AISLAMIENTO`
         FROM 
            Validador2
         WHERE
            NOMBRE_MUNICIPIO = '$Ciudad'
         ORDER BY fechaCargue;";

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