<?php 
	include("../../conectar.php"); 
   include("../../../../vendors/mensajes/correo.php");  
	$link = Conectar();

   date_default_timezone_set('America/Bogota');

   $idx = 0;
   $datos = "";
   
   $sql = "SELECT
         materiaPrima.Nombre,
         materiaPrima.Unidades,
         materiaPrima.cantidadMinima,
         stock.Cantidad
      FROM 
         materiaPrima
         INNER JOIN stock ON materiaPrima.id = stock.idMateriaPrima
      WHERE
         AND stock.Cantidad < materiaPrima.CantidadMinima;";

   $result = $link->query($sql);
   

   if ( $result->num_rows > 0)
   {
      while ($row = mysqli_fetch_assoc($result))
      {
         $datos .= "La cantidad mínima de <strong>" . utf8_encode($row['Nombre']) . '</strong> es de <strong>' . number_format($row['cantidadMinima'], 2, ',', '.') . ' ' . $row['Unidades'] . '</strong> y actualmente hay registrados en el Sistema <strong>' . number_format($row['Cantidad'], 2, ',', '.') . ' ' . $row['Unidades'] . '</strong><br><br>';
         $idx++;
      }
   }

   $sql = "SELECT
         materiaPrima.Nombre,
         materiaPrima.Unidades,
         materiaPrima.cantidadMaxima,
         stock.Cantidad
      FROM 
         materiaPrima
         INNER JOIN stock ON materiaPrima.id = stock.idMateriaPrima
      WHERE
         materiaPrima.cantidadMaxima <> 0
         AND stock.Cantidad >= materiaPrima.cantidadMaxima;";

   $result = $link->query($sql);
   

   if ( $result->num_rows > 0)
   {
      while ($row = mysqli_fetch_assoc($result))
      {
         $datos .= "La cantidad máxima de <strong>" . utf8_encode($row['Nombre']) . '</strong> es de <strong>' . number_format($row['cantidadMaxima'], 2, ',', '.') . ' ' . $row['Unidades'] . '</strong> y actualmente hay registrados en el Sistema <strong>' . number_format($row['Cantidad'], 2, ',', '.') . ' ' . $row['Unidades'] . '</strong><br><br>';
         $idx++;
      }
   }

   if ($idx > 0)
   {
      $mensaje = "Buen Día, <br>";

      $mensaje .= '<h1 style="background: #00C7B3; color: white; text-align: right;">Los siguientes Aspectos requieren su revisión:</h1>';

      $mensaje .= '<br><br>' . $datos;

      $mensaje .= "<br><br><strong>Para mayor información, puede ingresar a la aplicación en el siguiente link: <a href='http://app.silicioagromil.com/home.html'>http://app.silicioagromil.com</a> con su respectivo usuario y clave";

      $sql = "SELECT GROUP_CONCAT(datosUsuarios.Correo SEPARATOR ', ') AS Correos FROM datosUsuarios;";

      $result = $link->query($sql);
      $fila =  $result->fetch_array(MYSQLI_ASSOC);

      $correo = $fila['Correos'];
      //$correo = "jhonathan.espinosa@wspgroup.com";

      echo $correo . '<br>';

      echo "Alerta de Stock de Materia Prima";

      echo '<br><br>';

      echo $mensaje;


      $obj = EnviarCorreo($correo, "Alerta de Stock de Materia Prima", $mensaje) ;
   }


?>


