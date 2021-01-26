ActivoDiv = false;

/* Verificamos si el plano se encuentra habilitado */
function CheckboxPlano() {
    if ($('#alternar-espacio').prop('checked')) { return true; }
    else { return false; }
}

/*Comprobamos si el marco del plano esta activo*/
function State() {
    return ActivoDiv;
}

/*Limitamos el plano para añadir marcadores*/
function LimitarPlano() {
    if (!State()) {
        document.getElementById('Canvas-container').style.border = "thick solid red";
        document.getElementById('Canvas-container').style.opacity = "0.5";
        ActivoDiv = true;
        return ActivoDiv;
    }
}

/*Limitamos el plano para añadir marcadores*/
function DesLimitarPlano() {
    if (State()) {
        document.getElementById('Canvas-container').style.border = "0px solid transparent";
        ActivoDiv = false;
        return ActivoDiv;
    }

}

function BuscarIndiceCanvas(Arreglo, Valor, Parametro) {
    for (I = 0; I < Arreglo.length; I++) {

        if (Arreglo[I].Titulo === Valor) {
            if (Parametro == 1) {
                return Arreglo[I];
            }
            else {
                return I;
            }
        }
    }
    return null;
}


function OperacionesTablaCanvas(Caso, Arreglo) {
    var Potencias = []
    /*Lectura de las potencias */
    if (Caso == 1) {
        for (var I = 0; I <= 23; I++) {
            Potencias[I] = document.getElementById('TablaPotenciaCanvas').rows[1].cells[I].innerHTML;
        }
        return Potencias;
    }
    /*Reinicia las potencias */
    else if (Caso == 2) {
        for (var I = 0; I <= 23; I++) {
            Potencias.push('0');
        }
        return Potencias;
    }
    else {
        /*Actualiza las tablas de potencia */
        for (var I = 0; I <= 23; I++) {
            document.getElementById('TablaPotenciaCanvas').rows[1].cells[I].innerHTML = Arreglo[I];
        }
    }
}

function ActualizarCategoriaMarcadorCanvas(Parametro)
{

    MarcadorSeleccionado(Parametro,null);
}


function MostrarOculutarC_C_E(Parametro, Opcion)
{
    //Parametro indica que es lo que se va a modificar
        //1 Consumidores
        //2 Centros Eventuales
        //3 Elipse

    //Opcion indica la funcion a realizar
        //1 Visible
        //0 No Visible

    if ((Parametro == 1) && (Opcion == 1))
    {
        canvas.getObjects().forEach(function(oImg)
        {
            if((oImg.id == Letras[0]) || (oImg.id == Letras[1]) || (oImg.id == Letras[2]) || (oImg.id == Letras[3]) || (oImg.id == Letras[4]) || (oImg.id == Letras[5]) || (oImg.id == Letras[6]) || (oImg.id == Letras[7]) || (oImg.id == Letras[8]) || (oImg.id == Letras[9]))
            {
                oImg.set('visible',true);
                canvas.renderAll();
            }
        })

    }

    else if ((Parametro == 1) && (Opcion == 0))
    {

        canvas.getObjects().forEach(function(oImg)
        {
            if((oImg.id == Letras[0]) || (oImg.id == Letras[1]) || (oImg.id == Letras[2]) || (oImg.id == Letras[3]) || (oImg.id == Letras[4]) || (oImg.id == Letras[5]) || (oImg.id == Letras[6]) || (oImg.id == Letras[7]) || (oImg.id == Letras[8]) || (oImg.id == Letras[9]))
            {
                oImg.set('visible',false);
                canvas.renderAll();
            }
        })
    }

    else if ((Parametro == 2) && (Opcion == 1))
    {
       canvas.getObjects().forEach(function(oImg)
        {
            if((oImg.id == "1") || (oImg.id == "2") || (oImg.id == "3") || (oImg.id == "4") || (oImg.id == "5") || (oImg.id == "6") || (oImg.id == "7") || (oImg.id == "8") || (oImg.id == "8") || (oImg.id == "9") || (oImg.id == "10") || (oImg.id == "11") || (oImg.id == "12") || (oImg.id == "13") || (oImg.id == "14") || (oImg.id == "15") || (oImg.id == "16") || (oImg.id == "17") || (oImg.id == "18") || (oImg.id == "19") || (oImg.id == "20") || (oImg.id == "21") || (oImg.id == "22") || (oImg.id == "23") || (oImg.id == "24"))
            {
                oImg.set('visible',true);
                canvas.renderAll();
            }
        })
    }

    else if ((Parametro == 2) && (Opcion == 0))
    {
     canvas.getObjects().forEach(function(oImg)
        {
            if((oImg.id == "1") || (oImg.id == "2") || (oImg.id == "3") || (oImg.id == "4") || (oImg.id == "5") || (oImg.id == "6") || (oImg.id == "7") || (oImg.id == "8") || (oImg.id == "8") || (oImg.id == "9") || (oImg.id == "10") || (oImg.id == "11") || (oImg.id == "12") || (oImg.id == "13") || (oImg.id == "14") || (oImg.id == "15") || (oImg.id == "16") || (oImg.id == "17") || (oImg.id == "18") || (oImg.id == "19") || (oImg.id == "20") || (oImg.id == "21") || (oImg.id == "22") || (oImg.id == "23") || (oImg.id == "24"))
            {
                oImg.set('visible',false);
                canvas.renderAll();
            }
        })   
    }

    else if ((Parametro == 3) && (Opcion == 1))
    {
       canvas.getObjects().forEach(function(oImg)
        {
            if(oImg.id == "CentroElipse")
            {
                oImg.set('visible',true);
                canvas.renderAll();
            }
        })
    }

    else if ((Parametro == 3) && (Opcion == 0))
    {
       canvas.getObjects().forEach(function(oImg)
        {
            if(oImg.id == "CentroElipse")
            {
                oImg.set('visible',false);
                canvas.renderAll();
            }
        })        
    }

}

