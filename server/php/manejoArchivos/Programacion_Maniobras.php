<?php
    date_default_timezone_set('America/Bogota');

    include("../conectar.php");
    include("../phpExcel/excel_reader2.php"); 
    
    
    $link=Conectar();

    $archivo = addslashes($_POST['Archivo']);
    $idArchivo = addslashes($_POST['idArchivo']);
    $Usuario = addslashes($_POST['Usuario']);

    //$archivo = "archivo.xls";

    /********************************************************/

$data = new Spreadsheet_Excel_Reader($archivo, false, "ISO-8859-1");

$bandera = false;
$contadorDeBlancos = 0;
$Detectados = 0;
$campos = "";
$idy = 1;

foreach($data->sheets as $numeroHoja => $hoja)
{
    if ($hoja['numCols'] < 16 AND $hoja['numRows'] < 2)
    {
        echo "El archivo no tiene la estructura correcta";
    } else
    {
        for ($idy=1; $idy <= $hoja['numCols']; $idy++) 
        { 
            if (strpos(strtolower($hoja['cells'][$idy][1]), "trafo") !== false)
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
                        $campos .= "($Usuario, $idArchivo, ";
                        for ($idx=1; $idx < 17; $idx++) 
                        { 
                            if (!isset($hoja['cells'][$idy][$idx]))
                            {
                                $hoja['cells'][$idy][$idx] = "";
                            }
                            if ($idx == 7)
                            {
                                $hoja['cells'][$idy][$idx] = date('Y-m-d', strtotime($hoja['cells'][$idy][$idx]));
                            }
                            $campos .= "'" . addslashes($hoja['cells'][$idy][$idx]) . "', ";
                        }
                        $campos = substr($campos, 0, -2) . "), ";
                    }
                }
            }
        }

    }
}
            
$campos = substr($campos, 0, -2);
$Respuesta = array('Detectados' => $Detectados, 'Ingresados' => 0);
if ($campos <> "")
{
    $sql = "INSERT INTO programacionManiobras( Usuario, idArchivo, trafo, nodo, fases, kva, bla, circuito, programacion, apertura, cierre, direccion, barrio, encargado, telefono, observaciones, cuadrilla, municipio) VALUES " . 
            $campos . " 
        ON DUPLICATE KEY UPDATE 
            Usuario = VALUES(Usuario),
            idArchivo = VALUES(idArchivo),
            trafo = VALUES(trafo),
            nodo = VALUES(nodo),
            fases = VALUES(fases),
            kva = VALUES(kva),
            bla = VALUES(bla),
            circuito = VALUES(circuito),
            programacion = VALUES(programacion),
            apertura = VALUES(apertura),
            cierre = VALUES(cierre),
            direccion = VALUES(direccion),
            barrio = VALUES(barrio),
            encargado = VALUES(encargado),
            telefono = VALUES(telefono),
            observaciones = VALUES(observaciones),
            cuadrilla = VALUES(cuadrilla),
            municipio = VALUES(municipio);";

    $link->query(utf8_decode($sql));
    $arrLink = explode(" ", $link->info);
    $Respuesta['Ingresados'] = $arrLink[1];
}

echo json_encode($Respuesta);
?>
