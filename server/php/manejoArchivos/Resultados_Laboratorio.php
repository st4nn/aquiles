<?php
    date_default_timezone_set('America/Bogota');

    include("../conectar.php");
    include("../phpExcel/excel_reader2.php"); 
    
    
    $link=Conectar();

    $archivo = addslashes($_POST['Archivo']);
    $idArchivo = addslashes($_POST['idArchivo']);
    $Usuario = addslashes($_POST['Usuario']);

    $archivo = '../../Archivos/' . $archivo;


    //$archivo = "archivo.xls";

    /********************************************************/

    

$data = new Spreadsheet_Excel_Reader($archivo, false, "ISO-8859-1");

$bandera = false;
$contadorDeBlancos = 0;
$Detectados = 0;
$campos = "";
$idy = 1;

$idk = 0;
$consultasSQL = array();

foreach($data->sheets as $numeroHoja => $hoja)
{
    if ($hoja['numCols'] < 39 AND $hoja['numRows'] < 2)
    {
        //echo "El archivo no tiene la estructura correcta";
    } else
    {
        for ($idy=1; $idy <= $hoja['numCols']; $idy++) 
        { 
            if (strpos(strtolower($hoja['cells'][$idy][1]), "recipiente") !== false)
            {
                $idy++;
                $bandera = true;
                break; 
            } else
            {
                $contadorDeBlancos++;
            }

            if ($contadorDeBlancos > 20)
            {
                break;
            }
        }

        if (!$bandera)
        {

        } else
        {
            for ($idy=$idy; $hoja['numCols']; $idy++) 
            {
                if (!isset($hoja['cells'][$idy][1]))
                {
                    $contadorDeBlancos++;
                     if ($contadorDeBlancos > 20)
                    {
                        break;
                    }
                } else
                {
                    if ($hoja['cells'][$idy][1] == "")
                    {
                        $contadorDeBlancos++;
                         if ($contadorDeBlancos > 20)
                        {
                            break;
                        }
                    } else
                    {
                        $contadorDeBlancos = 0;
                        $Detectados++;
                        $campos = "($Usuario, $idArchivo, ";
                        for ($idx=1; $idx < 42; $idx++) 
                        { 
                            if (!isset($hoja['cells'][$idy][$idx]))
                            {
                                $hoja['cells'][$idy][$idx] = "";
                            }
                            if ($idx == 11 OR $idx == 40 OR $idx == 20)
                            {
                                $hoja['cells'][$idy][$idx] = date('Y-m-d', strtotime($hoja['cells'][$idy][$idx]));
                            }
                            $campos .= "'" . addslashes(utf8_decode($hoja['cells'][$idy][$idx])) . "', ";
                        }
                        $campos = substr($campos, 0, -2) . ") ";


                        if ($campos <> "")
                        {
                            $sql = "INSERT INTO resultadosLaboratorio(Usuario, idArchivo, Codigo_Recipiente, Tipo_Elemento, Numero_de_la_Orden, Numero_de_Unidad, Laboratorio_que_Realizo_el_Analisis, Desc_Laboratorio_que_realizo_analisis, ID_Persona_que_Toma_la_Muestra, Desc_Persona_que_toma_la_muestra, Responsable_de_la_Prueba, Desc_Responsable_de_la_prueba, Fecha_Analisis, Observaciones, Tipo_de_Prueba, Descripcion_Tipo_de_Prueba, Resultado_de_la_Prueba_Cualitativa, Desc_Resultado_prueba_cualitativa, Incertidumbre_Cualitativa, Kit_Clor_N_Oil_50, Numero_de_Lote_del_Kit, Fecha_del_vencimiento_de_Kit, Pendiente_Pruebas_Cuantitativas, Resultado_Prueba_Semicuantitativa, Incertidumbre_Semicuantitativa, Numero_Analisis_Semicuantitativa, Prueba_Aleatoria, Resultado_Prueba_Cuantitativa, Incertidumbre_Cuantitativa, Numero_Analisis_Cuantitativa, Peso_del_Equipo, Grupo_PCB, Prueba_Aleatoria_CNSS, Resultado_Prueba_CNSS, Incertidumbre_Cuanti_Superf_Solida, Numero_Analisis_CNSS, Grupo_PCB_CNSS, Solicitud, ID_Usuario, Programa, Id_Maquina, Fecha_Actualizacion, Hora_Actualizacion) VALUES " . 
                                    $campos . " 
                                ON DUPLICATE KEY UPDATE 
                                    Usuario = VALUES(Usuario), idArchivo = VALUES(idArchivo), Codigo_Recipiente = VALUES(Codigo_Recipiente), Tipo_Elemento = VALUES(Tipo_Elemento), Numero_de_la_Orden = VALUES(Numero_de_la_Orden), Numero_de_Unidad = VALUES(Numero_de_Unidad), Laboratorio_que_Realizo_el_Analisis = VALUES(Laboratorio_que_Realizo_el_Analisis), Desc_Laboratorio_que_realizo_analisis = VALUES(Desc_Laboratorio_que_realizo_analisis), ID_Persona_que_Toma_la_Muestra = VALUES(ID_Persona_que_Toma_la_Muestra), Desc_Persona_que_toma_la_muestra = VALUES(Desc_Persona_que_toma_la_muestra), Responsable_de_la_Prueba = VALUES(Responsable_de_la_Prueba), Desc_Responsable_de_la_prueba = VALUES(Desc_Responsable_de_la_prueba), Fecha_Analisis = VALUES(Fecha_Analisis), Observaciones = VALUES(Observaciones), Tipo_de_Prueba = VALUES(Tipo_de_Prueba), Descripcion_Tipo_de_Prueba = VALUES(Descripcion_Tipo_de_Prueba), Resultado_de_la_Prueba_Cualitativa = VALUES(Resultado_de_la_Prueba_Cualitativa), Desc_Resultado_prueba_cualitativa = VALUES(Desc_Resultado_prueba_cualitativa), Incertidumbre_Cualitativa = VALUES(Incertidumbre_Cualitativa), Kit_Clor_N_Oil_50 = VALUES(Kit_Clor_N_Oil_50), Numero_de_Lote_del_Kit = VALUES(Numero_de_Lote_del_Kit), Fecha_del_vencimiento_de_Kit = VALUES(Fecha_del_vencimiento_de_Kit), Pendiente_Pruebas_Cuantitativas = VALUES(Pendiente_Pruebas_Cuantitativas), Resultado_Prueba_Semicuantitativa = VALUES(Resultado_Prueba_Semicuantitativa), Incertidumbre_Semicuantitativa = VALUES(Incertidumbre_Semicuantitativa), Numero_Analisis_Semicuantitativa = VALUES(Numero_Analisis_Semicuantitativa), Prueba_Aleatoria = VALUES(Prueba_Aleatoria), Resultado_Prueba_Cuantitativa = VALUES(Resultado_Prueba_Cuantitativa), Incertidumbre_Cuantitativa = VALUES(Incertidumbre_Cuantitativa), Numero_Analisis_Cuantitativa = VALUES(Numero_Analisis_Cuantitativa), Peso_del_Equipo = VALUES(Peso_del_Equipo), Grupo_PCB = VALUES(Grupo_PCB), Prueba_Aleatoria_CNSS = VALUES(Prueba_Aleatoria_CNSS), Resultado_Prueba_CNSS = VALUES(Resultado_Prueba_CNSS), Incertidumbre_Cuanti_Superf_Solida = VALUES(Incertidumbre_Cuanti_Superf_Solida), Numero_Analisis_CNSS = VALUES(Numero_Analisis_CNSS), Grupo_PCB_CNSS = VALUES(Grupo_PCB_CNSS), Solicitud = VALUES(Solicitud), ID_Usuario = VALUES(ID_Usuario), Programa = VALUES(Programa), Id_Maquina = VALUES(Id_Maquina), Fecha_Actualizacion = VALUES(Fecha_Actualizacion), Hora_Actualizacion = VALUES(Hora_Actualizacion);";

                            $link->query(utf8_decode($sql));

                            //echo $sql . "<br><br><br><br>";
                        }
                        $idk++;
                    }
                }
            }
        }

    }
}
            
$campos = substr($campos, 0, -2);
$Respuesta = array('Detectados' => $Detectados, 'Ingresados' => 0);
$Respuesta['Ingresados'] = $Detectados;


echo json_encode($Respuesta);

?>
