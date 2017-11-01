<?php
  include("../../conectar.php"); 
  include("../maniobras/actualizarEjecutor.php"); 
   $link = Conectar();

   $idArchivo = addslashes($_POST['idArchivo']);
   $Estado = addslashes($_POST['estado']);

   $sql = "UPDATE Archivos SET Procesado = '$Estado' WHERE id = '$idArchivo';";

   $result = $link->query($sql);


   actualizarEjecutores();
?>