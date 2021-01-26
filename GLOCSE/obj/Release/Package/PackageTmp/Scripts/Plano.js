var Lienzo, Contexto, Ancho, Alto, Cx = 0, Cy = 0, ImagenCanvas, ImagenPinMarcador, MarcadorSeleccionadoObjeto= new Array(), Objetos = new Array(), ObjectoActivo;
var Letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

function OperacionesPlano()
{

    Lienzo = new fabric.Canvas('canvas',{preserveObjectStacking: true});

    //Inicializamos el arrastrado de las imagenes
    function ArastreDePoligonosImagen(e)
    {
        [].forEach.call(Imagenes, function (Imagen)
        {
            Imagen.classList.remove('img_dragging');
        });
        this.classList.add('img_dragging');
    }

    //Eventos para arrastrado por envima de Imagenes
    function handleDragOver(e)
    {
        if (e.preventDefault)
        {
            e.preventDefault();
           ///Evento en donde se deben obtener las coordenadas///
        }
        e.dataTransfer.dropEffect = 'copy';
        return false;
    }

    //Inicializando el arrastrado al presionar
    function handleDragEnter(e)
    {
        this.classList.add('over');
    }

    //Cuando se suelta el arrastrado
    function handleDragLeave(e)
    {
        this.classList.remove('over');
    }


    //////////////////////HABILITACION DE ARRASTRADO DE DE POLIGONOS HACIA EL SECTOR DONDE SE UBICA EL PLANO////////////////////////////////////////////

    function handleDrop(e)
    {
        //Se detiene propagacion del arrastrado
        if (e.stopPropagation)
        {
            e.stopPropagation();
        }

        var ImagenArrastre = document.querySelector('#images img.img_dragging');

        if (!ActivoDiv) {
            switch (ImagenArrastre.id) {

                case 'R':
                    var Rectangulo = new fabric.Rect({
                        top: e.layerY - 37.5, left: e.layerX - 37.5, opacity: 0.60, width: 75, height: 75, fill: '#ff0d00'
                    });
                    Lienzo.add(Rectangulo);
                    break;

                case 'T':
                    var Triangulo = new fabric.Triangle({
                        top: e.layerY - 37.5, left: e.layerX - 37.5, opacity: 0.6, width: 75, height: 75, fill: '#2eb2ff'
                    });
                    Lienzo.add(Triangulo);
                    break;

                case 'C':
                    var Circulo = new fabric.Circle({
                        radius: 45, fill: '#33b027', opacity: 0.6, left: e.layerX - 45, top: e.layerY - 45
                    });
                    Lienzo.add(Circulo);
                    break;

                case 'P1':
                    var Poligono = new fabric.Path('M 0 0 L 75 0 L 75 80 L 50 80 L 50 50 L 25 50 L 25 80 L 0 80 z');
                    Poligono.set({ fill: '#FF5544CC', opacity: 0.6, left: e.layerX - 37.5, top: e.layerY - 40 });
                    Lienzo.add(Poligono);
                    break;

                case 'P2':
                    var Poligono = new fabric.Path('M 0 0 L 100 0 L 100 50 L 50 50 L 50 100 L 0 100 z');
                    Poligono.set({ fill: 'purple', opacity: 0.6, left: e.layerX - 50, top: e.layerY - 50 });
                    Lienzo.add(Poligono);
                    break;

                case 'P3':
                    var Poligono = new fabric.Path('M 50 0 L 100 50 L 80 100 L 20 100 L 0 50 z');
                    Poligono.set({ fill: '#f9e76d', opacity: 0.6, left: e.layerX - 50, top: e.layerY - 50 });
                    Lienzo.add(Poligono);
                    break;

                case 'P4':
                    var Poligono = new fabric.Path('M 30 0 L 70 0 L 100 30 L 100 70 L 70 100 L 30 100 L 0 70 L 0 30 z');
                    Poligono.set({ fill: '#5da887', opacity: 0.5, left: e.layerX - 50, top: e.layerY - 50 });
                    Lienzo.add(Poligono);
                    break;

                case 'Delete':
                    var activeObject = Lienzo.getActiveObject();
                    if (activeObject)
                    {
                        Lienzo.remove(activeObject);
                    }
                    break;
                default:
            }
        }

        Lienzo.on('object:modified', function(options) 
        { 
            $("#CanvasContextual").hide();
        });

        return false;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Finalizacion del arrastrado
    function handleDragEnd(e)
    {
        // this/e.target is the source node.
        [].forEach.call(Imagenes, function (img)
        {
            img.classList.remove('img_dragging');
        });
    }


    if (Modernizr.draganddrop)
    {
        var Imagenes = document.querySelectorAll('#images img');
        [].forEach.call(Imagenes, function (img) {
            img.addEventListener('dragstart', ArastreDePoligonosImagen, false);
            img.addEventListener('dragend', handleDragEnd, false);
        });

        var ContenedorCanvas = document.getElementById('Canvas-container');
        ContenedorCanvas.addEventListener('dragenter', handleDragEnter, false);
        ContenedorCanvas.addEventListener('dragover', handleDragOver, false);
        ContenedorCanvas.addEventListener('dragleave', handleDragLeave, false);
        ContenedorCanvas.addEventListener('drop', handleDrop, false);

        ContenedorCanvas.addEventListener('mousedown', function (e)
        {
            if ((e.which == 3) && (ActivoDiv) && (Proyecciones[3].Contador < 11)) {                             // right click = 3, left click = 1
                $("#CanvasContextual").hide();
                Cx = e.layerX;
                Cy = e.layerY;
                MarcadoresPlanos();
            }
        });


        ContenedorCanvas.addEventListener('dblclick', function () {

            if (MarcadorSeleccionado())
            {
                $("#ContenedorEmergenteCanvas").hide();
                if ((TopContenedor - 351) > -110)
                {
                    EmergenteCanvas.style.top = (TopContenedor - 351).toString() + "px";
                    $("#PuntaCanvas").removeClass("ContenedorEmergentePuntaArriba").addClass("Abajo");
                }
                else
                {
                    EmergenteCanvas.style.top = (TopContenedor - 13).toString() + "px";
                    $("#PuntaCanvas").removeClass("Abajo").addClass("ContenedorEmergentePuntaArriba");
                }
                EmergenteCanvas.style.left = (LeftContendor - 85).toString() + "px";
                $("#ContenedorEmergenteCanvas").slideDown(600);
            }
            
            document.getElementById("TextoConsumidorCanvas").innerHTML = 'Consumidor ' + MarcadorSeleccionadoObjeto.id;
            document.getElementById("LongitudCanvas").value = '?';
            document.getElementById("LatitudCanvas").value = '?';
            IndiceMarcador = BuscarIndice(Proyecciones[3].MarcadoresCollecion, MarcadorSeleccionadoObjeto.id, 2, false);
            document.getElementById("CoordenadasCanvas").value = Proyecciones[3].MarcadoresCollecion[IndiceMarcador].X + " , " + Math.abs((Proyecciones[3].MarcadoresCollecion[IndiceMarcador].Y) - Lienzo.height);         
            if (Proyecciones[3].MarcadoresCollecion[IndiceMarcador].Categoria == '1') { document.getElementById("Cat1CentroEventualCanvas").checked = true; }
            else if (Proyecciones[3].MarcadoresCollecion[IndiceMarcador].Categoria == '2') { document.getElementById("Cat2CentroEventualCanvas").checked = true; }
            else { document.getElementById("Cat3CentroEventualCanvas").checked = true; }            
        });
    }

}

function MarcadorSeleccionado(Parametro,Actualizar_Horas)
{
    ObjetoActivo = canvas.getActiveObject();
    
    if (ObjetoActivo!=null)
    {
        Objetos = canvas.getObjects();
        MarcadorSeleccionadoObjeto.id = ObjetoActivo.id;
        MarcadorSeleccionadoObjeto.PosicionArreglo = ObjetoActivo.contador;
        MarcadorSeleccionadoObjeto.x = ObjetoActivo.left;
        MarcadorSeleccionadoObjeto.y = ObjetoActivo.top;
        document.getElementById("TextoConsumidorCanvas").innerHTML = 'Consumidor '+ MarcadorSeleccionadoObjeto.id;
        document.getElementById("LongitudCanvas").value = '?';
        document.getElementById("LatitudCanvas").value= '?';                  
        document.getElementById("CoordenadasCanvas").value= MarcadorSeleccionadoObjeto.x+" , "+Math.abs((MarcadorSeleccionadoObjeto.y- canvas.height));

        if (Parametro!=null)
        {   
            MarcadorSeleccionadoObjeto.Categoria = Parametro;
            Proyecciones[3].MarcadoresCollecion[MarcadorSeleccionadoObjeto.PosicionArreglo].Categoria = Parametro;           

            if(Proyecciones[3].MarcadoresCollecion[MarcadorSeleccionadoObjeto.PosicionArreglo].Categoria == '1'){ document.getElementById("Cat1CentroEventualCanvas").checked = true;}              
            else if(Proyecciones[3].MarcadoresCollecion[MarcadorSeleccionadoObjeto.PosicionArreglo].Categoria == '2'){document.getElementById("Cat2CentroEventualCanvas").checked = true;}
            else if(Proyecciones[3].MarcadoresCollecion[MarcadorSeleccionadoObjeto.PosicionArreglo].Categoria == '3'){document.getElementById("Cat3CentroEventualCanvas").checked = true;}

        }
        
        if (Actualizar_Horas == 'Horas')
        {
            Proyecciones[3].MarcadoresCollecion[MarcadorSeleccionadoObjeto.PosicionArreglo].Horas = OperacionesTablaCanvas(1,null);
        }

        return MarcadorSeleccionadoObjeto;
    }
}



function ImagenBase64()
{

    var Archivo = document.getElementById('files').files;

    if (Archivo.length > 0)
    {
        var ArchivoCargar = Archivo[0];
        var Lector = new FileReader();

        Lector.onload = function (EventoCargarImagen)
        {
            var srcData = EventoCargarImagen.target.result;

            ImagenCanvas = new Image;

            ImagenCanvas.setAttribute('crossOrigin', 'anonymous');

            Contexto = Lienzo.getContext('2d');

            ImagenCanvas.src = srcData;
            ImagenCanvas.onload = function ()
            {
                Lienzo.clear();
                ImagenCanvas.width = Lienzo.width;
                ImagenCanvas.height = Lienzo.height;

                Ancho = ((Lienzo.width) / (ImagenCanvas.naturalWidth));
                Alto = ((Lienzo.height) / (ImagenCanvas.naturalHeight));


                Lienzo.setDimensions({ width: Lienzo.width, height: Lienzo.height });

                Lienzo.setWidth(Lienzo.width);
                Lienzo.setHeight(Lienzo.height);
                fabric.Image.fromURL(ImagenCanvas.src, function (ImagenCargar) {
                    Lienzo.add(ImagenCargar);
                    ImagenCargar.set('selectable', false);
                    Lienzo.renderAll();
                }, { "left": 0, "top": 0, "scaleX": Ancho, "scaleY": Alto });
            };
        }

        Lector.readAsDataURL(ArchivoCargar);
    }
}

function MarcadoresPlanos()
{
    var Marcador = new Image;    
    Marcador.src = DevolverURLMarcador(Alfabeto[Proyecciones[3].Contador- 1] + (1).toString());

    fabric.Image.fromURL(Marcador.src, function (ImagenPinMarcador)
    {
        ImagenPinMarcador.id = Letras[(Proyecciones[3].Contador) - 2];
        ImagenPinMarcador.hasBorders = ImagenPinMarcador.hasControls = false;
        Lienzo.add(ImagenPinMarcador);
    
        var HorasConsu = OperacionesTablaCanvas(2, null);
        ActualizarTabla();
        Proyecciones[3].MarcadoresCollecion.push({ Titulo: Letras[Proyecciones[3].Contador - 1], Categoria: "1", Horas : HorasConsu, X: Cx, Y: Math.abs(Cy - Lienzo.height), Posicion: Proyecciones[3].Contador});
        Proyecciones[3].Contador++;

         for(var I = 0 ; I<=23  ; I++ )
        {                                                                    
            document.getElementById('TablaPotenciaCanvas').rows[1].cells[I].innerHTML  = ProyeccionPlano[0].MarcadoresCollecion[BuscarIndiceCanvas(ProyeccionPlano[0].MarcadoresCollecion,oImg.id,2,false)].Horas;
        }

        OperacionesTablaCanvas(5,Proyecciones[3].MarcadoresCollecion[BuscarIndiceCanvas(ProyeccionPlano[0].MarcadoresCollecion,oImg.id,2,false)].Horas);

    }, { "left": Cx, "top": Cy });
}


function AñadirCentroEventualPlano(Centro, X, Y)
{
    var Marcador = new Image;
    Marcador.src = URLCentroEventual(Centro);

    fabric.Image.fromURL(Marcador.src, function (ImagenCentroEventual) {
        ImagenCentroEventual.id = Centro.toString();
        ImagenCentroEventual.hasBorders = ImagenCentroEventual.hasControls = false;
        ImagenCentroEventual.selectable = false;
        Lienzo.add(ImagenCentroEventual);
    }, { "left": X, "top": Y });        

}


function AñadirCentroElipsePlano(Centro, X, Y) {
    var Marcador = new Image;
    Marcador.src = URLCentroElipse(0)

    fabric.Image.fromURL(Marcador.src, function (ImagenElipse) {
        ImagenElipse.id = 'CentroElipse';
        ImagenElipse.hasBorders = ImagenElipse.hasControls = false;
        ImagenElipse.selectable = false;
        Lienzo.add(ImagenElipse);
    }, { "left": X, "top": Y });
}


function BorrarFondo() { Lienzo.clear(); Proyeccion[3].Contador = 0}


function DibujaElipsePlano(ArregloX, ArregloY,CentroX,CentroY)
{
    var Puntos = new Array();

    for (var I = 0; I < ArregloX.length - 1; I++) {
        Puntos.push({ x: ArregloX[I], y: ArregloY[I] });

    }
    var clonedStartPoints = Puntos.map(function (o)
    {
        return fabric.util.object.clone(o);
    });

    var polygon = new fabric.Polygon(clonedStartPoints, {
        left: CentroX,
        top: CentroY,
        fill: 'red',
        selectable : true,
        opacity : 0.4,
        selectable: false,
    });   

    Lienzo.add(polygon);
}