<?php
  include("../../conectar.php"); 
   $link = Conectar();


   $ip = getRealIP();

   
   if($ip == "190.216.154.146" OR $ip == '190.242.127.34')
   {
      $mensaje = $_POST['mensaje'];
      $correo = $_POST['Destinatario'];
      //$correo = $_POST['Destinatario'] . ', jhonathan.espinosa@wspgroup.com';
      //$correo = 'jhonathan.espinosa@wspgroup.com';
      $asunto = $_POST['Asunto'];
      
      include("../../../../vendors/mensajes/correo.php");  
      $obj = EnviarCorreo($correo, $asunto, $mensaje) ;
   } else
   {
      echo "USUARIO NO AUTORIZADO";
   }

   
   
   function getRealIP()
   {

       if (isset($_SERVER["HTTP_CLIENT_IP"]))
       {
           return $_SERVER["HTTP_CLIENT_IP"];
       }
       elseif (isset($_SERVER["HTTP_X_FORWARDED_FOR"]))
       {
           return $_SERVER["HTTP_X_FORWARDED_FOR"];
       }
       elseif (isset($_SERVER["HTTP_X_FORWARDED"]))
       {
           return $_SERVER["HTTP_X_FORWARDED"];
       }
       elseif (isset($_SERVER["HTTP_FORWARDED_FOR"]))
       {
           return $_SERVER["HTTP_FORWARDED_FOR"];
       }
       elseif (isset($_SERVER["HTTP_FORWARDED"]))
       {
           return $_SERVER["HTTP_FORWARDED"];
       }
       else
       {
           return $_SERVER["REMOTE_ADDR"];
       }

   }
?>