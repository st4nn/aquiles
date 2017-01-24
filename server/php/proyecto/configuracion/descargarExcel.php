<?php 
   header("Content-type: application/vnd.ms-excel; name='excel'");
   header("Content-Disposition: filename=" . utf8_decode($_POST['$Nombre']) . ".xls");
   header("Pragma: no-cache");
   header("Expires: 0");

   echo $_POST['datos'];
?>


