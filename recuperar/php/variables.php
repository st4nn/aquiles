<?
	$rutaClaseConexionMySQL = '../../server/php/conectar.php';
	$rutaClaseSMTP = '../../vendors/mensajes/correo.php';
	$rSQL = "SELECT idLogin, Nombre FROM datosUsuarios WHERE Correo = '_Correo';";
	$cSQL = "";
	$url = "https://aquiles.wspcolombia.com";
	$nomApp = "Aquiles";
?>