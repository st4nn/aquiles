<?php
  include("../../conectar.php"); 
   $link = Conectar();


   $ip = getRealIP();

   
   if($ip == "190.216.154.146" OR $ip == '190.242.127.34')
   {
      $sentencia = $_POST['sentencia'];
      $link->query(utf8_decode($sentencia));
      echo json_encode($link);
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