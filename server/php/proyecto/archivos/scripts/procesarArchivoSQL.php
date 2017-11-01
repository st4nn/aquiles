<?php
  include("../../../conectar.php"); 
  ini_set('memory_limit', '512M');
   $link = Conectar();

   $idArchivo = $_POST['idArchivo'];
  $nombre_fichero = str_replace('/', '_', $_POST['Archivo']);
  $gestor = fopen($nombre_fichero, "r");
  $contenido = fread($gestor, filesize($nombre_fichero));
  fclose($gestor);

  $arrContenido = explode(";", $contenido);

  foreach ($arrContenido as $key => $value) 
  {
    if (trim($value) != '')
    {
      $link->query(utf8_decode($value));
      if ($link->error != '')
      {
        include("../../../../../vendors/mensajes/correo.php");  
        $mensaje ='Hola<br><br>';
        $mensaje .='Aquiles produjo el siguiente error<br>';
        $mensaje .= $link->error . '<br>';
        $mensaje .= 'Con la instrucción <strong>' . $value . '</strong><br>';
        $mensaje .= 'En el archivo <strong>' . $nombre_fichero . '</strong><br>';

        $obj = EnviarCorreo('jhonathan.espinosa@wsp.com', 'Error en validación de Aquiles', $mensaje) ;
      }
    }
  }

  $sql = "UPDATE Archivos SET Procesado = 4 WHERE id = '$idArchivo';";
  $link->query(utf8_decode($sql));


?>