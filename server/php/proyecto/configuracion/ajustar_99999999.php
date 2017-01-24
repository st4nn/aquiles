<?php 
	include("../../conectar.php"); 
	$link = Conectar();

   date_default_timezone_set('America/Bogota');

   $sql = "UPDATE Produccion SET Total = 0, Sacos = 0 WHERE Consecutivo = 99999999;";

   $result = $link->query($sql);
?>


