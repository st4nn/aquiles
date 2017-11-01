<?php
  include("../../conectar.php"); 

   $link = Conectar();

   $Usuario = addslashes($_POST['Usuario']);
   $datos = json_decode($_POST['datos']);

  foreach ($datos as $key => $value) 
  {
    $datos->$key = addslashes($value);
  }


  $ids = $datos->id;

  $sql = "INSERT INTO Programacion_Maniobras_Unificado (
            id,
            CIRCUITO,
            NUMERO_DE_EVENTO,
            NUMERO_DE_TRAFO,
            NUMERO_DE_NODO,
            FASES,
            KVA,
            BLA,
            FECHA_PROGRAMACION,
            HORA_DE_APERTURA,
            HORA_DE_CIERRE,
            DIRECCION,
            BARRIO,
            ENCARGADO_CON_No_DE_DIVISA_EN_CAMPO,
            No_TELEFONO_ENCARGADO,
            OBSERVACIONES,
            MUNICIPIO_2
            )
            VALUES (
            '" . $datos->id . "',
            '" . $datos->CIRCUITO . "',
            '" . $datos->NUMERO_DE_EVENTO . "',
            '" . $datos->NUMERO_DE_TRAFO . "',
            '" . $datos->NUMERO_DE_NODO . "',
            '" . $datos->FASES . "',
            '" . $datos->KVA . "',
            '" . $datos->BLA . "',
            '" . $datos->FECHA_PROGRAMACION . "',
            '" . $datos->HORA_DE_APERTURA . "',
            '" . $datos->HORA_DE_CIERRE . "',
            '" . $datos->DIRECCION . "',
            '" . $datos->BARRIO . "',
            '" . $datos->ENCARGADO_CON_No_DE_DIVISA_EN_CAMPO . "',
            '" . $datos->No_TELEFONO_ENCARGADO . "',
            '" . $datos->OBSERVACIONES . "',
            '" . $datos->MUNICIPIO_2 . "')
            ON DUPLICATE KEY UPDATE 
            CIRCUITO = VALUES(CIRCUITO),
            NUMERO_DE_EVENTO = VALUES(NUMERO_DE_EVENTO),
            NUMERO_DE_TRAFO = VALUES(NUMERO_DE_TRAFO),
            NUMERO_DE_NODO = VALUES(NUMERO_DE_NODO),
            FASES = VALUES(FASES),
            KVA = VALUES(KVA),
            BLA = VALUES(BLA),
            FECHA_PROGRAMACION = VALUES(FECHA_PROGRAMACION),
            HORA_DE_APERTURA = VALUES(HORA_DE_APERTURA),
            HORA_DE_CIERRE = VALUES(HORA_DE_CIERRE),
            DIRECCION = VALUES(DIRECCION),
            BARRIO = VALUES(BARRIO),
            ENCARGADO_CON_No_DE_DIVISA_EN_CAMPO = VALUES(ENCARGADO_CON_No_DE_DIVISA_EN_CAMPO),
            No_TELEFONO_ENCARGADO = VALUES(No_TELEFONO_ENCARGADO),
            OBSERVACIONES = VALUES(OBSERVACIONES),
            MUNICIPIO_2 = VALUES(MUNICIPIO_2);";

     $link->query(utf8_decode($sql));
     
    if ($link->error <> "")
    {
      echo $link->error;
    } else
    {
        $sql = "UPDATE log_Programacion_Maniobras_Unificado SET usuarioAccion = '$Usuario' WHERE id IN ($ids) AND usuarioAccion IS NULL;";
        $link->query(utf8_decode($sql));

        echo 1;
    }
?>
