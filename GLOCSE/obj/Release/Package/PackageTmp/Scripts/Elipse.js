var XTemp = 0;
var YTemp = 0;
var Suma = 0;
var Periodo = new Array();
var PoligonoInterseccion = null;
var CentroInterseccion = null;
var PoligonosJTS = new Array();
var Columnas = ["Hora", "A", "B", "C", "D","E", "F", "G", "H", "I", "J", "Sumatoria", "Minimo", "Medio", "Maximo"];
var ColumnasConsumidores = ["A", "B", "C", "D", "F", "G", "H", "I", "J"];
var ColumnasConsumidoresMapa = ["Cargas", "Categorías", "Coord en X", "Coord en Y", "Latitud", "Longitud", 'Geocodificación'];
var ColumnasCentrosEventualesCarga = ["Hora", "Coordenada en X", "Coordenada en Y", "Latitud", "Longitud", "Ubicación"];
var ColumnasVariables = ["Variable", "Descripcion", "Valor"];
var ColumnasPotenciasConsumidor = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "Minimo", "Medio", "Maximo"];
var Imagen;
var InfoWindow;
var Aux = 0;
var JSONGeolocalizacion = null;
var ContadorCentrosEventuales = 0;

function CentrosEventualesDeCarga(Parametro, ProyeccionActual) {
    OcultarMostrar_CentrosDeCargaEventuales(1, ProyeccionActual, null);
    OcultarMostrar_Elipses(1, ProyeccionActual, null);
    Proyecciones[ProyeccionActual].CentrosEventuales = new Array();
    Proyecciones[ProyeccionActual].CentrosEventualesCoordenadasFisicas = new Array();
    Proyecciones[ProyeccionActual].XDispersion = 0;
    Proyecciones[ProyeccionActual].YDispersion = 0;
    Proyecciones[ProyeccionActual].XYCorrelacion = 0;    
    if (PoligonoInterseccion != null) PoligonoInterseccion.setMap(null);PoligonoInterseccion= null;
    for (var I = 0; I <= 23; I++) {
        for (var J = 0; J <= (Proyecciones[ProyeccionActual].MarcadoresCollecion.length) - 1; J++) {
            XTemp = XTemp + parseInt((Proyecciones[ProyeccionActual].MarcadoresCollecion[J].Horas[I]) * Proyecciones[ProyeccionActual].MarcadoresCollecion[J].X);
            YTemp = YTemp + parseInt((Proyecciones[ProyeccionActual].MarcadoresCollecion[J].Horas[I]) * Proyecciones[ProyeccionActual].MarcadoresCollecion[J].Y);
            Suma = Suma + parseInt(Proyecciones[ProyeccionActual].MarcadoresCollecion[J].Horas[I]);
        }
        try {
            XTemp = XTemp / Suma;
            YTemp = YTemp / Suma;
        }
        catch (Error) {
            XTemp = 0;
            YTemp = 0;
        }
        Proyecciones[ProyeccionActual].CentrosEventualesCoordenadasFisicas.push({ X: XTemp, Y: Math.abs(YTemp) })
        if (ProyeccionActual != 3) {
                if (Parametro == 1) {
                    var MarcadorCentroEventual = new google.maps.Marker(
                        {
                            position: Coordenadas_Cartesianas_APunto({ x: XTemp, y: Math.abs(YTemp) }),
                            draggable: false,
                            map: MapaCanvas,
                            animation: google.maps.Animation.DROP,
                            tittle: (I + 1).toString(),
                            icon: URLCentroEventual((I + 1).toString())
                        })
                    if (Proyecciones[ProyeccionActual].Opciones.MostrarCentrosEventuales == false) {
                        MarcadorCentroEventual.setMap(null);
                    }
                }
                else {
                    var MarcadorCentroEventual = new google.maps.Marker(
                        {
                            position: Coordenadas_Cartesianas_APunto({ x: XTemp, y: Math.abs(YTemp) }),
                            draggable: false,
                            map: null,
                            animation: google.maps.Animation.DROP,
                            tittle: (I + 1).toString(),
                            Proyeccion : ProyeccionActual.toString(),
                            icon: URLCentroEventual((I + 1).toString())
                        })
                }

                if (Parametro == 1) { $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + MarcadorCentroEventual.getPosition().lat() + ",+" + MarcadorCentroEventual.getPosition().lng() + "&key=" + API_KEY, GeolocalizacionCentroEventual); }
                Proyecciones[ProyeccionActual].CentrosEventuales.push({ MarcadorCentroEventual: MarcadorCentroEventual, Ubicacion: "?" });
        }
        else
        {
            AñadirCentroEventualPlano((I+1).toString(), XTemp, YTemp)
        }
        Suma = 0;
        XTemp = 0;
        YTemp = 0;
    }
    if (ProyeccionActual != 3) {
        Proyecciones[ProyeccionActual].CentrosEventuales.forEach(function (Valor) 
        {
            google.maps.event.addListener(Valor.MarcadorCentroEventual, 'click', function (event) 
            {
                document.getElementById('rowcategoria').style.display = 'none';
                document.getElementById('rowtabla').style.display = 'none';
                document.getElementById('guardarcontenedor').style.display = 'none';
                var Punto = Valor.MarcadorCentroEventual.position;
                var Coordenada = RetornarCordenada(Punto,1);                
                document.getElementById('ContenedorEmergente').style.left  = Math.abs(($('#ContenedorEmergente').width()/2)-Coordenada.x)+"px";
                document.getElementById('ContenedorEmergente').style.top = Coordenada.y+"px";                
                document.getElementById("ctitulo").innerHTML = 'Centro Eventual H' + Valor.MarcadorCentroEventual.tittle;
                document.getElementById("clatitud").value = (Valor.MarcadorCentroEventual.position.lat()).toString();
                document.getElementById("clongitud").value = (Valor.MarcadorCentroEventual.position.lng()).toString();                
                document.getElementById("ccoordenadas").value = Coordenada.x + " , " + Math.abs((Coordenada.y - Altura));
                $("#ContenedorEmergente").show(1000);

            });
        });
    }


    Proyecciones[ProyeccionActual].XPoint = 0;
    Proyecciones[ProyeccionActual].YPoint = 0;
    for (var I = 0; I <= 23; I++) {
        Proyecciones[ProyeccionActual].XPoint = Proyecciones[ProyeccionActual].XPoint + Proyecciones[ProyeccionActual].CentrosEventualesCoordenadasFisicas[I].X;
        Proyecciones[ProyeccionActual].YPoint = Proyecciones[ProyeccionActual].YPoint + Proyecciones[ProyeccionActual].CentrosEventualesCoordenadasFisicas[I].Y;
    }
    Proyecciones[ProyeccionActual].XPoint = Proyecciones[ProyeccionActual].XPoint / 24;
    Proyecciones[ProyeccionActual].YPoint = Proyecciones[ProyeccionActual].YPoint / 24;
    if (ProyeccionActual != 3) {
        var PinCentro = new google.maps.Marker(
            {
                position: Coordenadas_Cartesianas_APunto({ x: Proyecciones[ProyeccionActual].XPoint, y: Proyecciones[ProyeccionActual].YPoint }),
                draggable: false,
                map: MapaCanvas,
                animation: google.maps.Animation.DROP,
                tittle: "Centro Elipse (P" + (ProyeccionActiva + 1) + ")",
                icon: URLCentroElipse(ProyeccionActiva),
                Ubicacion: ""
            });
        if (Parametro == 1) { $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + PinCentro.getPosition().lat() + ",+" + PinCentro.getPosition().lng() + "&key="+ API_KEY, GeolocalizacionCentroElipse); }
        Proyecciones[ProyeccionActual].Centro = PinCentro;

        google.maps.event.addListener(PinCentro, 'click', function (event) {
                document.getElementById('rowcategoria').style.display = 'none';
                document.getElementById('rowtabla').style.display = 'none';
                document.getElementById('guardarcontenedor').style.display = 'none';
                var Punto = PinCentro.getPosition();
                var Coordenada = RetornarCordenada(Punto,1);                
                document.getElementById('ContenedorEmergente').style.left  = Math.abs(($('#ContenedorEmergente').width()/2)-Coordenada.x)+"px";
                document.getElementById('ContenedorEmergente').style.top = Coordenada.y+"px";                
                document.getElementById("ctitulo").innerHTML = PinCentro.tittle;
                document.getElementById("clatitud").value = (PinCentro.getPosition().lat()).toString();
                document.getElementById("clongitud").value = (PinCentro.getPosition().lng()).toString();                
                document.getElementById("ccoordenadas").value = Coordenada.x + " , " + Math.abs((Coordenada.y - Altura));
                $("#ContenedorEmergente").show(1000);

        });


        if (Proyecciones[ProyeccionActual].Opciones.MostrarCentrosElipse == false) {
            Proyecciones[ProyeccionActual].Centro.setMap(null);
        }

        if (Parametro != 1) { Proyecciones[ProyeccionActual].Centro.setMap(null); MedidasDeVariacion(ProyeccionActual); }
    }
    else
    {
        AñadirCentroElipsePlano('C', Proyecciones[ProyeccionActual].XPoint, Proyecciones[ProyeccionActual].YPoint);
        MedidasDeVariacion(ProyeccionActual);
    }
    Dispersion(ProyeccionActual);
}




function MedidasDeVariacion(ProyeccionActual) {
    for (var J = 0; J <= (Proyecciones[ProyeccionActual].MarcadoresCollecion.length) - 1; J++) {
        Promedio = 0;
        for (var I = 0; I <= 23; I++) {
            Promedio = Promedio + Proyecciones[ProyeccionActual].MarcadoresCollecion[J].Horas[I];
        }
        Promedio = Promedio / 24;
        Mayor = Math.max.apply(Math, Proyecciones[ProyeccionActual].MarcadoresCollecion[J].Horas);
        Menor = Math.min.apply(Math, Proyecciones[ProyeccionActual].MarcadoresCollecion[J].Horas);
        Proyecciones[ProyeccionActual].MarcadoresCollecion[J].Mayor = Mayor;
        Proyecciones[ProyeccionActual].MarcadoresCollecion[J].Menor = Menor;
        Proyecciones[ProyeccionActual].MarcadoresCollecion[J].Promedio = Promedio;
    }

}
function Dispersion(ProyeccionActual) {
    for (var I = 0; I <= 23; I++) {
        Proyecciones[ProyeccionActual].XDispersion = Proyecciones[ProyeccionActual].XDispersion + Math.pow((Proyecciones[ProyeccionActual].CentrosEventualesCoordenadasFisicas[I].X - Proyecciones[ProyeccionActual].XPoint), 2);
        Proyecciones[ProyeccionActual].YDispersion = Proyecciones[ProyeccionActual].YDispersion + Math.pow((Proyecciones[ProyeccionActual].CentrosEventualesCoordenadasFisicas[I].Y - Proyecciones[ProyeccionActual].YPoint), 2);
    }
    Proyecciones[ProyeccionActual].XDispersion = Proyecciones[ProyeccionActual].XDispersion / 23;
    Proyecciones[ProyeccionActual].YDispersion = Proyecciones[ProyeccionActual].YDispersion / 23;
    Proyecciones[ProyeccionActual].XSigma = Math.sqrt(Proyecciones[ProyeccionActual].XDispersion);
    Proyecciones[ProyeccionActual].YSigma = Math.sqrt(Proyecciones[ProyeccionActual].YDispersion);
    Proyecciones[ProyeccionActual].XExactitud = (1 / (Proyecciones[ProyeccionActual].XSigma * Math.sqrt(2)));
    Proyecciones[ProyeccionActual].YExactitud = (1 / (Proyecciones[ProyeccionActual].YSigma * Math.sqrt(2)));
    Momento_Correlacion(ProyeccionActual);
}

function Momento_Correlacion(ProyeccionActual) {
    for (var I = 0; I <= 23; I++) {
        Proyecciones[ProyeccionActual].XYCorrelacion = Proyecciones[ProyeccionActual].XYCorrelacion + (((Proyecciones[ProyeccionActual].CentrosEventualesCoordenadasFisicas[I].X - Proyecciones[ProyeccionActual].XPoint) * (Proyecciones[ProyeccionActual].CentrosEventualesCoordenadasFisicas[I].Y - Proyecciones[ProyeccionActual].YPoint)) / 23);
    }
    Proyecciones[ProyeccionActual].r = (Proyecciones[ProyeccionActual].XYCorrelacion / (Proyecciones[ProyeccionActual].XSigma * Proyecciones[ProyeccionActual].YSigma));
    Angulo_Nuevo_Eje(ProyeccionActual);
}


/* ANGULO DE NUEVO EJE PARA LA ROTACION DE LA ELIPSE */

function Angulo_Nuevo_Eje(ProyeccionActual) {

    Proyecciones[ProyeccionActual].Angulo = ((0.5) * (Math.atan((2 * Proyecciones[ProyeccionActual].XYCorrelacion) / (Proyecciones[ProyeccionActual].XDispersion - Proyecciones[ProyeccionActual].YDispersion))));
    Proyecciones[ProyeccionActual].FhiSigma2 = (((Math.pow(Proyecciones[ProyeccionActual].XSigma, 2)) * (Math.pow((Math.cos(Proyecciones[ProyeccionActual].Angulo)), 2))) + (Proyecciones[ProyeccionActual].r * Proyecciones[ProyeccionActual].XSigma * Proyecciones[ProyeccionActual].YSigma * Math.sin(2 * Proyecciones[ProyeccionActual].Angulo)) + ((Math.pow(Proyecciones[ProyeccionActual].YSigma, 2)) * (Math.pow((Math.sin(Proyecciones[ProyeccionActual].Angulo)), 2))));
    Proyecciones[ProyeccionActual].PhiSigma2 = (((Math.pow(Proyecciones[ProyeccionActual].XSigma, 2)) * (Math.pow((Math.sin(Proyecciones[ProyeccionActual].Angulo)), 2))) + (Proyecciones[ProyeccionActual].r * Proyecciones[ProyeccionActual].XSigma * Proyecciones[ProyeccionActual].YSigma * Math.sin(2 * Proyecciones[ProyeccionActual].Angulo)) + ((Math.pow(Proyecciones[ProyeccionActual].YSigma, 2)) * (Math.pow((Math.cos(Proyecciones[ProyeccionActual].Angulo)), 2))));
    Nueva_Exactitud(ProyeccionActual);
}


function Nueva_Exactitud(ProyeccionActual) {

    Proyecciones[ProyeccionActual].FhiExactitud = (1 / ((Math.sqrt(2)) * (Math.sqrt(Proyecciones[ProyeccionActual].FhiSigma2)))); //Aclaracion.. FhiSigma, multiplica al raiz cuadrada de dos?
    Proyecciones[ProyeccionActual].PhiExactitud = (1 / ((Math.sqrt(2)) * (Math.sqrt(Proyecciones[ProyeccionActual].PhiSigma2)))); // Mismo caso para PhiSigma...	
    Proyecciones[ProyeccionActual].FhiRadio = ((Math.sqrt(3)) / Proyecciones[ProyeccionActual].FhiExactitud);
    Proyecciones[ProyeccionActual].PhiRadio = ((Math.sqrt(3)) / Proyecciones[ProyeccionActual].PhiExactitud);
    Puntos(ProyeccionActual, 0);
}

function Puntos(ProyeccionActual, Parametro) {
    Proyecciones[ProyeccionActual].Puntos_X = new Array();
    Proyecciones[ProyeccionActual].Puntos_Y = new Array();
    if (Periodo.length == 0 || Aux != OpcionesGlobales[0].Paso) {
        Periodo = new Array();
        for (var I = Math.PI * -1; I <= Math.PI; I = I + OpcionesGlobales[0].Paso) {
            Periodo.push(I);
        }
    }

    for (var I = 0; I <= Periodo.length; I++) {
        Proyecciones[ProyeccionActual].Puntos_X[I] = Proyecciones[ProyeccionActual].FhiRadio * Math.sin((Periodo[I]));
        Proyecciones[ProyeccionActual].Puntos_Y[I] = Proyecciones[ProyeccionActual].PhiRadio * Math.cos((Periodo[I]));

        Proyecciones[ProyeccionActual].Puntos_X[I] = (Proyecciones[ProyeccionActual].Puntos_X[I] * Math.cos(Proyecciones[ProyeccionActual].Angulo)) - (Proyecciones[ProyeccionActual].Puntos_Y[I] * Math.sin(Proyecciones[ProyeccionActual].Angulo));
        Proyecciones[ProyeccionActual].Puntos_Y[I] = (Proyecciones[ProyeccionActual].Puntos_Y[I] * Math.cos(Proyecciones[ProyeccionActual].Angulo)) - (Proyecciones[ProyeccionActual].Puntos_X[I] * Math.sin(Proyecciones[ProyeccionActual].Angulo));

        Proyecciones[ProyeccionActual].Puntos_X[I] = Proyecciones[ProyeccionActual].Puntos_X[I] + Proyecciones[ProyeccionActual].XPoint;
        Proyecciones[ProyeccionActual].Puntos_Y[I] = Proyecciones[ProyeccionActual].Puntos_Y[I] + Proyecciones[ProyeccionActual].YPoint;
    }
    Aux = OpcionesGlobales[0].Paso;
    if (ProyeccionActual != 3) {
        if (Parametro == 0) {
            Dibujo_Elipse(ProyeccionActual, Parametro);
        }
        else {
            return Dibujo_Elipse(ProyeccionActual, Parametro);
        }
    }
    else
    {        
        DibujaElipsePlano(Proyecciones[ProyeccionActual].Puntos_X, Proyecciones[ProyeccionActual].Puntos_Y, Proyecciones[ProyeccionActual].XPoint, Proyecciones[ProyeccionActual].YPoint);
    }
}

function Dibujo_Elipse(ProyeccionActual, Parametro) {
    var PuntosCoordenadas = new Array();
    for (I = 0; I <= Proyecciones[ProyeccionActual].Puntos_X.length; I++) {
        PuntosCoordenadas[I] = Coordenadas_Cartesianas_APunto({ x: Proyecciones[ProyeccionActual].Puntos_X[I], y: Math.abs(Proyecciones[ProyeccionActual].Puntos_Y[I]) });
    }
    var Color;
    (ProyeccionActual == 0) ? Color = '#FF0000' : ((ProyeccionActual == 1) ? Color = '#23CE6B' : Color = '#7D2AB5')

    PuntosCoordenadas.pop();
    PuntosCoordenadas.pop();
    var IndiceSobrePosicion;
    if (ProyeccionActual == 0) { IndiceSobrePosicion = 3; } else if (ProyeccionActual == 1) { IndiceSobrePosicion = 4; } else { IndiceSobrePosicion = 5; }
    var PoligonoElipse = new google.maps.Polygon(
        {
            paths: PuntosCoordenadas,
            strokeColor: Color,
            strokeOpacity: OpcionesGlobales[0].OpacidadBorde,
            strokeWeight: 2,
            fillColor: Color,
            fillOpacity: OpcionesGlobales[0].OpacidadRelleno,
            clickable: true,
            geodesic: true,
            zIndex: IndiceSobrePosicion
        });

    if (Parametro == 0) {
        google.maps.event.addListener(PoligonoElipse, "mousemove", function (event) {
            this.setOptions({ fillColor: "#F66E00", strokeColor: "#F66E00" });

        });

        google.maps.event.addListener(PoligonoElipse, "mouseout", function () {
            this.setOptions({ fillColor: Color, strokeColor: Color });
        });

        Proyecciones[ProyeccionActual].Elipse = PoligonoElipse;
        ImprimirVariables(ProyeccionActual);


        if (Proyecciones[ProyeccionActual].Opciones.MostrarElipse == true) { Proyecciones[ProyeccionActual].Elipse.setMap(MapaCanvas); }
        else { Proyecciones[ProyeccionActual].Elipse.setMap(null); }
    }
    else {
        return PoligonoElipse;
    }
}


function DetectarInterseccion(Parametro) {

    var FactorGemetrico = new jsts.geom.GeometryFactory();
    if (CentroInterseccion != null) CentroInterseccion.setMap(null);
    if(PoligonoInterseccion != null) {PoligonoInterseccion.setMap(null)};
    PoligonosJTS = new Array();
    try {
        PoligonosJTS.push(CrearPoligonoJTS(FactorGemetrico, Proyecciones[0].Elipse));
        PoligonosJTS.push(CrearPoligonoJTS(FactorGemetrico, Proyecciones[1].Elipse));
        PoligonosJTS.push(CrearPoligonoJTS(FactorGemetrico, Proyecciones[2].Elipse));
    }
    catch (Error) { }

    if (PoligonosJTS.length == 2) {
        if (InterceptanDosPoligonos(Proyecciones[0].Elipse, Proyecciones[1].Elipse) == "Si") {
            var Interseccion1Y2 = PoligonosJTS[0].intersection(PoligonosJTS[1]);
            if(PoligonoInterseccion != null) PoligonoInterseccion.setMap(null);
            PoligonoInterseccion = DibujarInterseccion(Interseccion1Y2);
            PoligonoInterseccion.setMap(MapaCanvas);

            var CentroElipsePoligono = ObtenerCentro(PoligonoInterseccion);
            CentroInterseccion = new google.maps.Marker(
                {
                    position: CentroElipsePoligono,
                    draggable: false,
                    map: MapaCanvas,
                    animation: google.maps.Animation.DROP,
                    tittle: 'Centro Optimo',
                    icon: URLCentroElipse(3),
                    Ubicacion: ""
                });
            google.maps.event.addListener(CentroInterseccion, 'click', function (event) 
            {
                document.getElementById('rowcategoria').style.display = 'none';
                document.getElementById('rowtabla').style.display = 'none';
                document.getElementById('guardarcontenedor').style.display = 'none';
                var Punto = CentroInterseccion.getPosition();
                var Coordenada = RetornarCordenada(Punto,1);                
                document.getElementById('ContenedorEmergente').style.left  = Math.abs(($('#ContenedorEmergente').width()/2)-Coordenada.x)+"px";
                document.getElementById('ContenedorEmergente').style.top = Coordenada.y+"px";                
                document.getElementById("ctitulo").innerHTML = CentroInterseccion.tittle;
                document.getElementById("clatitud").value = (CentroInterseccion.getPosition().lat()).toString();
                document.getElementById("clongitud").value = (CentroInterseccion.getPosition().lng()).toString();                
                document.getElementById("ccoordenadas").value = Coordenada.x + " , " + Math.abs((Coordenada.y - Altura));
                $("#ContenedorEmergente").show(1000);
            });

            if (Parametro == 1) { MapaAImagen(0, 1); { $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + CentroInterseccion.getPosition().lat() + ",+" + CentroInterseccion.getPosition().lng() + "&key=" + API_KEY, GeolocalizacionCentroInterseccion); } }
        }
    }
    else if (PoligonosJTS.length == 3) {
        if (InterceptanDosPoligonos(Proyecciones[0].Elipse, Proyecciones[1].Elipse) == "Si") {
            var Interseccion1Y2 = PoligonosJTS[0].intersection(PoligonosJTS[1]);
            var Poligono1Y2 = DibujarInterseccion(Interseccion1Y2);            
            if (InterceptanDosPoligonos(Poligono1Y2, Proyecciones[2].Elipse) == "Si") {
                var Interseccion12Y3 = CrearPoligonoJTS(FactorGemetrico, Poligono1Y2).intersection(PoligonosJTS[2]);                
                PoligonoInterseccion = DibujarInterseccion(Interseccion12Y3);                
                PoligonoInterseccion.setMap(null);
                PoligonoInterseccion.setMap(MapaCanvas);
                var CentroElipsePoligono = ObtenerCentro(PoligonoInterseccion);
                CentroInterseccion = new google.maps.Marker(
                    {
                        position: CentroElipsePoligono,
                        draggable: false,
                        map: MapaCanvas,
                        animation: google.maps.Animation.DROP,
                        tittle: 'Centro Optimo',
                        icon: URLCentroElipse(3),
                        Ubicacion: ""
                    });

                google.maps.event.addListener(CentroInterseccion, 'click', function (event) 
            {
                document.getElementById('rowcategoria').style.display = 'none';
                document.getElementById('rowtabla').style.display = 'none';
                document.getElementById('guardarcontenedor').style.display = 'none';
                var Punto = CentroInterseccion.getPosition();
                var Coordenada = RetornarCordenada(Punto,1);                
                document.getElementById('ContenedorEmergente').style.left  = Math.abs(($('#ContenedorEmergente').width()/2)-Coordenada.x)+"px";
                document.getElementById('ContenedorEmergente').style.top = Coordenada.y+"px";                
                document.getElementById("ctitulo").innerHTML = CentroInterseccion.tittle;
                document.getElementById("clatitud").value = (CentroInterseccion.getPosition().lat()).toString();
                document.getElementById("clongitud").value = (CentroInterseccion.getPosition().lng()).toString();                
                document.getElementById("ccoordenadas").value = Coordenada.x + " , " + Math.abs((Coordenada.y - Altura));
                $("#ContenedorEmergente").show(1000);

            });

                if (Parametro == 1) { MapaAImagen(0, 1); $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + CentroInterseccion.getPosition().lat() + ",+" + CentroInterseccion.getPosition().lng() + "&key=" + API_KEY, GeolocalizacionCentroInterseccion) }
            }
        }
        if(PoligonoInterseccion != null)
        {
            google.maps.event.addListener(PoligonoInterseccion, "mousemove", function (event) 
            {
                this.setOptions({ fillColor: "#044cb8", strokeColor: "#044cb8" });
            });

            google.maps.event.addListener(PoligonoInterseccion, "mouseout", function () 
            {
                this.setOptions({ fillColor: '#F2E94E', strokeColor: '#F2E94E' });
            });
        }
    }
    else {
        return null;
    }
}



function CrearPoligonoJTS(geometryFactory, Poligono) {
    var Ruta = Poligono.getPath();
    var CoordenadasFinal = Ruta.getArray().map(function name(Punto) {
        return new jsts.geom.Coordinate(Punto.lat(), Punto.lng());
    });
    CoordenadasFinal.push(CoordenadasFinal[0]);
    var Estructura = geometryFactory.createLinearRing(CoordenadasFinal);
    return geometryFactory.createPolygon(Estructura);
}

function DibujarInterseccion(PoligonoN1) {
    var Coordenadas = PoligonoN1.getCoordinates().map(function (Punto) {
        return { lat: Punto.x, lng: Punto.y };
    });

    return new google.maps.Polygon({
        paths: Coordenadas,
        strokeColor: '#F2E94E',
        strokeOpacity: OpcionesGlobales[0].OpacidadBorde,
        strokeWeight: 5,
        fillColor: '#F2E94E',
        fillOpacity: OpcionesGlobales[0].OpacidadRelleno,
        zIndex: 2000,
    });
}



function InterceptanDosPoligonos(Poligono1, Poligono2) {
    // Revisar esto puede optimizarse
    if (Poligono1 != null && Poligono2 != null) {
        var Encontrado = "No";
        Poligono1.getPath().forEach(function (latLng) {
            if (google.maps.geometry.poly.containsLocation(latLng, Poligono2) == true) {
                Encontrado = "Si";

            }
            ;
        })
        return Encontrado;
    }
    else {
        return "No";
    }
}

function ObtenerCentro(Poligono) {
    var Bordes = new google.maps.LatLngBounds();
    Poligono.getPath().forEach(function (latLng) {
        Bordes.extend(latLng);
        ;
    })
    return Bordes.getCenter();
}


function PuntoDentroPoligono(Punto, Poligono) {
    if (Poligono != null) {
        if (google.maps.geometry.poly.containsLocation(Punto, Poligono)) {
            return "Si";
        }
        else {
            return "No";
        }
    }
    else {
        return "?";
    }
}

function CentroElipse(P) {
    if (Proyecciones[P].Centro != null) {
        return { Latitud: Proyecciones[P].Centro.getPosition().lat(), Longitud: Proyecciones[P].Centro.getPosition().lng(), X: RetornarCordenada(Proyecciones[P].Centro.getPosition(), 1).x, Y: Math.abs((RetornarCordenada(Proyecciones[P].Centro.getPosition(), 1).y) - Altura) };
    }
    else {
        return "?";
    }
}

function CentroOptimo() {
    if (CentroInterseccion != null) {
        return { Latitud: CentroInterseccion.getPosition().lat(), Longitud: CentroInterseccion.getPosition().lng(), X: RetornarCordenada(CentroInterseccion.getPosition(), 1).x, Y: Math.abs((RetornarCordenada(CentroInterseccion.getPosition(), 1).y) - Altura) };
    }
    else {
        return "?";
    }
}

function DevolverFilasArreglo(Fila, Proyeccion) {    
    var ArregloFila = []
    Columnas.forEach(function (Entrada) {
        if (Entrada != "Hora" && Entrada != "Sumatoria" && Entrada != "Minimo" && Entrada != "Medio" && Entrada != "Maximo") {
            var Marcador = BuscarIndice(Proyecciones[Proyeccion].MarcadoresCollecion, Entrada + (Proyeccion + 1).toString(), 1);
            if (Marcador != null) {
                ArregloFila.push(Marcador.Horas[Fila] + " KVA");
            }
            else { ArregloFila.push(0); }
        }
        else if (Entrada == "Hora") {
            ArregloFila.push((Fila + 1).toString() + "°");
        }
        else {
            ArregloFila.push(DevolverFilaMedidaDeVariacion(Entrada, Fila, Proyeccion) + " KVA");
        }
    });
    return ArregloFila;
}

function DevolverFilaMedidaDeVariacion(Tipo, Fila, Proyeccion) {
    var ArregloFila = new Array();
    ColumnasConsumidores.forEach(function (Entrada) {
        var Marcador = BuscarIndice(Proyecciones[Proyeccion].MarcadoresCollecion, Entrada + (Proyeccion + 1).toString(), 1);
        if (Marcador != null) {
            ArregloFila.push(parseInt(Marcador.Horas[Fila]));
        }
        else {
            ArregloFila.push(0);
        }
    });
    if (Tipo == "Sumatoria") {
        return ArregloFila.reduce((x, y) => x + y);
    }
    else if (Tipo == "Minimo") {
        return Math.min.apply(0, ArregloFila);
    }
    else if (Tipo == "Maximo") {
        return Math.max.apply(0, ArregloFila);
    }
    else {
        try { return (ArregloFila.reduce((x, y) => x + y)) / 10; } catch (Error) { return "NaN"; }
    }
}

function DevolverTablaConsumidores(Proyeccion) {
    var ArregloTabla = []
    var ArregloFila = []
    ColumnasConsumidores.forEach(function (MarcadorLetra) {
        ArregloFila = new Array();
        var Marcador = BuscarIndice(Proyecciones[Proyeccion].MarcadoresCollecion, MarcadorLetra + (Proyeccion + 1).toString(), 1);
        if (Marcador != null) {

            ArregloFila.push(Marcador.Titulo);
            ArregloFila.push(Marcador.Categoria);
            ArregloFila.push(Marcador.X);
            ArregloFila.push(Marcador.Y);
            ArregloFila.push(Marcador.Marcador.getPosition().lat());
            ArregloFila.push(Marcador.Marcador.getPosition().lng());
            if (Marcador.Direccion != null) {
                ArregloFila.push(Marcador.Direccion);
            }
            else {
                ArregloFila.push("No disponible intentelo mas tarde");
            }
            ArregloTabla.push(ArregloFila);
        }
        else {
            ArregloFila.push(MarcadorLetra + (Proyeccion + 1).toString());
            ArregloFila.push("?");
            ArregloFila.push("?");
            ArregloFila.push("?");
            ArregloFila.push("?");
            ArregloFila.push("?");
            ArregloFila.push("?");
            ArregloTabla.push(ArregloFila);
        }
    });
    return ArregloTabla;
}

function DevolvertablaCentrosEventuales(Proyeccion) {
    var ArregloFila = [];
    var ArregloTabla = []
    var Contador = 1;
    Proyecciones[Proyeccion].CentrosEventuales.forEach(function (Marcador) {
        ArregloFila = new Array();
        ArregloFila.push(Contador);
        ArregloFila.push(Math.trunc(Proyecciones[Proyeccion].CentrosEventualesCoordenadasFisicas[Contador - 1].X));
        ArregloFila.push(Math.trunc(Math.abs((Proyecciones[Proyeccion].CentrosEventualesCoordenadasFisicas[Contador - 1].Y) - Altura) + 1));
        ArregloFila.push(Marcador.MarcadorCentroEventual.getPosition().lat());
        ArregloFila.push(Marcador.MarcadorCentroEventual.getPosition().lng());
        ArregloFila.push(Marcador.Ubicacion);
        ArregloTabla.push(ArregloFila);
        Contador++;
    });
    return ArregloTabla;
}

function DevolverFilaVariables(ProyeccionNumeroDato) {
    var ArregloFila = [];
    var ArregloTabla = [];

    ArregloFila.push("Dx");
    ArregloFila.push("Dispersión en X");
    ArregloFila.push(Proyecciones[ProyeccionNumeroDato].XDispersion);

    ArregloTabla.push(ArregloFila);

    ArregloFila = new Array();
    ArregloFila.push("Dy");
    ArregloFila.push("Dispersión en Y");
    ArregloFila.push(Proyecciones[ProyeccionNumeroDato].YDispersion);

    ArregloTabla.push(ArregloFila);

    ArregloFila = new Array();
    ArregloFila.push("SigmaX");
    ArregloFila.push("Desviación en X");
    ArregloFila.push(Proyecciones[ProyeccionNumeroDato].XSigma);

    ArregloTabla.push(ArregloFila);


    ArregloFila = new Array();
    ArregloFila.push("SigmaY");
    ArregloFila.push("Desviación en Y");
    ArregloFila.push(Proyecciones[ProyeccionNumeroDato].YSigma);

    ArregloTabla.push(ArregloFila);


    ArregloFila = new Array();
    ArregloFila.push("Hx");
    ArregloFila.push("Exactitud en X");
    ArregloFila.push(Proyecciones[ProyeccionNumeroDato].XExactitud);

    ArregloTabla.push(ArregloFila);

    ArregloFila = new Array();
    ArregloFila.push("Hy");
    ArregloFila.push("Exactitud en Y");
    ArregloFila.push(Proyecciones[ProyeccionNumeroDato].YExactitud);


    ArregloTabla.push(ArregloFila);


    ArregloFila = new Array();
    ArregloFila.push("Ax");
    ArregloFila.push("Esperanza Matematica en X");
    ArregloFila.push(Proyecciones[ProyeccionNumeroDato].XPoint);
    ArregloTabla.push(ArregloFila);


    ArregloFila = new Array();
    ArregloFila.push("Ay");
    ArregloFila.push("Esperanza Matematica en Y");
    ArregloFila.push(Proyecciones[ProyeccionNumeroDato].YPoint);

    ArregloTabla.push(ArregloFila);

    ArregloFila = new Array();
    ArregloFila.push("Cxy");
    ArregloFila.push("Momento de correlación");
    ArregloFila.push(Proyecciones[ProyeccionNumeroDato].XYCorrelacion);

    ArregloTabla.push(ArregloFila);

    ArregloFila = new Array();
    ArregloFila.push("r");
    ArregloFila.push("Coeficiente de correlación");
    ArregloFila.push(Proyecciones[ProyeccionNumeroDato].r);

    ArregloTabla.push(ArregloFila);



    ArregloFila = new Array();
    ArregloFila.push("Angulo");
    ArregloFila.push("Angulo de los ejes de simetría de la elipse");
    ArregloFila.push(Proyecciones[ProyeccionNumeroDato].Angulo + "°");

    ArregloTabla.push(ArregloFila);

    ArregloFila = new Array();
    ArregloFila.push("FhiSigma");
    ArregloFila.push("Desviaciones medio – cuadráticas en el sistema de coordenadas");
    ArregloFila.push(Proyecciones[ProyeccionNumeroDato].FhiSigma2);

    ArregloTabla.push(ArregloFila);

    ArregloFila = new Array();
    ArregloFila.push("PhiSigma");
    ArregloFila.push("Desviaciones medio – cuadráticas en el sistema de coordenadas");
    ArregloFila.push(Proyecciones[ProyeccionNumeroDato].PhiSigma2);

    ArregloTabla.push(ArregloFila);


    ArregloFila = new Array();
    ArregloFila.push("FhiExactitud");
    ArregloFila.push("Exactitud del nuevo sistema");
    ArregloFila.push(Proyecciones[ProyeccionNumeroDato].FhiExactitud);

    ArregloTabla.push(ArregloFila);



    ArregloFila = new Array();
    ArregloFila.push("PhiExactitud");
    ArregloFila.push("Exactitud del nuevo sistema");
    ArregloFila.push(Proyecciones[ProyeccionNumeroDato].PhiExactitud);

    ArregloTabla.push(ArregloFila);


    ArregloFila = new Array();
    ArregloFila.push("FhiRadio");
    ArregloFila.push("Radio de ela elipse en el nuevo sistema ");
    ArregloFila.push(Proyecciones[ProyeccionNumeroDato].FhiRadio);

    ArregloTabla.push(ArregloFila);

    ArregloFila = new Array();
    ArregloFila.push("PhiRadio");
    ArregloFila.push("Radio de ela elipse en el nuevo sistema ");
    ArregloFila.push(Proyecciones[ProyeccionNumeroDato].PhiRadio);


    ArregloTabla.push(ArregloFila);
    try {
        ArregloFila = new Array();
        ArregloFila.push("Ubicación");
        ArregloFila.push("Ubicación geografica de la subestación (Latitud y longitud)");
        ArregloFila.push("(" + Proyecciones[ProyeccionNumeroDato].Centro.getPosition().lat() + " , " + Proyecciones[ProyeccionNumeroDato].Centro.getPosition().lng() + ")");
        ArregloTabla.push(ArregloFila);
    }
    catch (Excepcion) { }

    return ArregloTabla;
}


function DevolverFilasPotenciaConsumidor(Proyeccion, Consumidor) {
    var ArregloFila = [];
    var ArregloTabla = []
    var Marcador = BuscarIndice(Proyecciones[Proyeccion].MarcadoresCollecion, Consumidor, 1);
    for (var I = 0; I <= 23; I++) {
        ArregloFila.push(Marcador.Horas[I]);
    }

    if (Marcador.Menor != null) {
        ArregloFila.push(Marcador.Menor);
        ArregloFila.push(Marcador.Promedio.toFixed(2));
        ArregloFila.push(Marcador.Mayor);

    }
    else {
        MedidasDeVariacion(Proyeccion);
    }
    ArregloTabla.push(ArregloFila);
    return ArregloTabla;
}






function MapaAImagen(NProyeccion, Parametro) {
    if (Parametro == 0) {
        if (NProyeccion == 0 || NProyeccion == 1 | NProyeccion == 2) {
            var ColorMarcadores; var ColorElipse;
            switch (NProyeccion) {
                case 0:
                    ColorMarcadores = "blue";
                    ColorElipse = "red"
                    break;

                case 1:
                    ColorMarcadores = "black";
                    ColorElipse = "green"
                    break;

                case 2:
                    ColorMarcadores = "purple";
                    ColorElipse = "orange";
                    break;
            }
            var MapaEstatico = "https://maps.googleapis.com/maps/api/staticmap";

            MapaEstatico += "?center=" + Rectangulo.getBounds().getCenter().lat() + "," + Rectangulo.getBounds().getCenter().lng();

            MapaEstatico += "&size=640x480&scale=1";

            MapaEstatico += "&maptype=roadmap";

            MapaEstatico += "&zoom=" + MapaCanvas.getZoom();


            Proyecciones[NProyeccion].MarcadoresCollecion.forEach(function (Objeto) {
                MapaEstatico += "&markers=color:" + ColorMarcadores + "|label:" + Objeto.Titulo.charAt(0) + "|" + Objeto.Marcador.getPosition().lat() + "," + Objeto.Marcador.getPosition().lng();
            });

            ContadorMarcadores = 1;
            Proyecciones[NProyeccion].CentrosEventuales.forEach(function (Objeto) {
                MapaEstatico += "&markers=color:green|" + Objeto.MarcadorCentroEventual.getPosition().lat() + "," + Objeto.MarcadorCentroEventual.getPosition().lng();
                ContadorMarcadores = ContadorMarcadores + 1;
            });

            MapaEstatico += "&path=color:" + ColorElipse + "|fillcolor:" + ColorElipse;
            try {
                Proyecciones[NProyeccion].Elipse.getPath().forEach(function (latLng) { MapaEstatico += "|" + latLng.lat() + "," + latLng.lng() });
            }
            catch (Excepcion) { }
            MapaEstatico += "&key=" + API_KEY;

            var ImagenReal = new Image;
            ImagenReal.setAttribute('crossOrigin', 'anonymous');
            var Canvas = document.createElement('canvas');
            Canvas.width = 640;
            Canvas.height = 480;

            Contexto = Canvas.getContext('2d');
            ImagenReal.onload = function () {
                Contexto.drawImage(ImagenReal, 0, 0, 640, 480);
                GraficasEstaticas[NProyeccion] = Canvas.toDataURL();
            };
            ImagenReal.src = MapaEstatico;
        }
    }
    else {
        var Aux = OpcionesGlobales[0].Paso;
        OpcionesGlobales[0].Paso = 0.2;
        var MapaEstatico = "https://maps.googleapis.com/maps/api/staticmap";

        MapaEstatico += "?center=" + Rectangulo.getBounds().getCenter().lat() + "," + Rectangulo.getBounds().getCenter().lng();

        MapaEstatico += "&size=640x480&scale=1";

        MapaEstatico += "&maptype=roadmap";

        MapaEstatico += "&zoom=" + MapaCanvas.getZoom();

        MapaEstatico += "&path=color:red|fillcolor:red";

        Puntos(0, 1).getPath().forEach(function (latLng) { MapaEstatico += "|" + latLng.lat() + "," + latLng.lng() });

        MapaEstatico += "&path=color:green|fillcolor:green";

        Puntos(1, 1).getPath().forEach(function (latLng) { MapaEstatico += "|" + latLng.lat() + "," + latLng.lng() });

        MapaEstatico += "&path=color:purple|fillcolor:purple";

        Puntos(2, 1).getPath().forEach(function (latLng) { MapaEstatico += "|" + latLng.lat() + "," + latLng.lng() });

        MapaEstatico += "&path=color:orange|fillcolor:orange";
        PoligonoInterseccion.getPath().forEach(function (latLng) { MapaEstatico += "|" + latLng.lat() + "," + latLng.lng() });



        MapaEstatico += "&markers=color:purple|label:C|" + CentroInterseccion.getPosition().lat() + "," + CentroInterseccion.getPosition().lng();

        OpcionesGlobales[0].Paso = Aux;
        DetectarInterseccion(0);
        MapaEstatico += "&key=" + API_KEY;


        var ImagenReal = new Image;
        ImagenReal.setAttribute('crossOrigin', 'anonymous');
        var Canvas = document.createElement('canvas');
        Canvas.width = 640;
        Canvas.height = 480;

        Contexto = Canvas.getContext('2d');
        ImagenReal.onload = function () {
            Contexto.drawImage(ImagenReal, 0, 0, 640, 480);
            GraficasEstaticas[3] = Canvas.toDataURL();
        };
        ImagenReal.src = MapaEstatico;
    }
}


function GenerarReporte() {
    var Documento = new jsPDF("l", 'cm', "a4");
    var ColorTabla = "";
    var R1 = null; G1 = null; B1 = null;
    var R2 = null; G2 = null; B2 = null;
    if (Proyecciones[0].ElipseDibujada) {
        for (J = 0; J <= 2; J = J + 1) {
            if (Proyecciones[J].ElipseDibujada) {

                switch (J) {
                    case 0:
                        ColorTabla = [242, 92, 84];
                        R1 = 255; B1 = 0; C1 = 0;
                        R2 = 100; G2 = 149; B2 = 237;
                        break;

                    case 1:
                        ColorTabla = [22, 12, 40];
                        R1 = 20; B1 = 165; C1 = 141;
                        R2 = 119; G2 = 135; B2 = 153;
                        break;

                    case 2:
                        ColorTabla = [84, 56, 220];
                        R1 = 255; B1 = 165; C1 = 0;
                        R2 = 147; G2 = 112; B2 = 219;
                        break;
                }

                var Filas = [];
                Datos_Graficas(Proyecciones, J);
                //Graficando_Hill(Proyecciones[J].XPoint,Proyecciones[J].YPoint,Proyecciones[J].XSigma,Proyecciones[J].YSigma,Proyecciones[J].r,Proyecciones[J].Puntos_X,Proyecciones[J].Puntos_Y, Proyecciones[J].FhiRadio, Proyecciones[J].PhiRadio);			
                for (var I = 0; I <= 23; I++) {
                    Filas.push(DevolverFilasArreglo(I, J));
                }
                MedidasDeVariacion(J);
                Documento.setFontSize(25);
                Documento.setFont("helvetica");
                Documento.setFontType("bold");
                Documento.setTextColor(62, 74, 99);
                Documento.text(13.45, 1.6, "Reporte");
                Documento.setDrawColor(119, 101, 227);
                Documento.setLineWidth(0.1);
                Documento.line(13.35, 1.86, 17, 1.86);
                if (J == 0) {
                    Documento.text(1.4, 3.1, "Proyección " + (J + 1).toString() + " (" + new Date().getFullYear().toString() + ") :");
                }
                else if (J == 1) {
                    Documento.text(1.4, 3.1, "Proyección 2" + " (" + (new Date().getFullYear() + 10).toString() + ") :");
                }
                else {
                    Documento.text(1.4, 3.1, "Proyección 3" + " (" + (new Date().getFullYear() + 20).toString() + ") :");
                }
                Documento.setFont("Helvetica");
                Documento.setFontType("normal");
                Documento.setTextColor(0, 0, 0);
                Documento.setFontSize(14);
                Documento.text(1.4, 4.1, "Datos de las potencias por consumidor incluyendo el valor , la sumatoria total de potencias ,el valor minimo , medio");
                Documento.text(1.4, 5.1, "y maximo por hora, Todas las potencias estan en 100 KVA.")

                Documento.autoTable(Columnas, Filas,
                    {
                        theme: "striped",
                        styles: { overflow: 'linebreak', lineWidth: 0.01, halign: 'center', cellPadding: 0.07, fillcolor: [199, 0, 57] },
                        margin: { top: 5.7 },
                        headerStyles:
                        {
                            lineWidth: 0,
                            fillColor: ColorTabla,
                            textColor: [255, 255, 255],
                        },
                    });


                ColumnasConsumidores.forEach(function (MarcadorLetra) {
                    var Marcador = BuscarIndice(Proyecciones[J].MarcadoresCollecion, MarcadorLetra + (J + 1).toString(), 1);
                    if (Marcador != null) {
                        Documento.addPage();
                        Documento.setFontSize(25);
                        Documento.setFont("helvetica");
                        Documento.setFontType("bold");
                        Documento.setTextColor(62, 74, 99);
                        Documento.text(12.45, 1.6, "Consumidor " + MarcadorLetra + (J + 1).toString());
                        Documento.setDrawColor(119, 101, 227);
                        Documento.setLineWidth(0.1);
                        Documento.line(12.35, 1.86, 19, 1.86);

                        Documento.setFont("Helvetica");
                        Documento.setFontType("normal");
                        Documento.setTextColor(0, 0, 0);
                        Documento.setFontSize(14);
                        Documento.text(1.4, 3.2, "     Grafica de gasto en potencia de energia del consumidor " + MarcadorLetra + " en las 24 horas del dia  (Potencia = Potencia * 100 KVA) ");

                        var Grafica = document.getElementById("Grafica" + MarcadorLetra).toDataURL("image/jpeg", "0.7");
                        Documento.addImage(Grafica, 'JPG', 2, 4, 26, 11.5);



                        Documento.setFont("Helvetica");
                        Documento.setFontType("normal");
                        Documento.setTextColor(0, 0, 0);
                        Documento.setFontSize(14);
                        Documento.text(1.4, 16.2, "Tabla de potencias del consumidor (En 100 * KVA) :");

                        Documento.autoTable(ColumnasPotenciasConsumidor, DevolverFilasPotenciaConsumidor(J, MarcadorLetra + (J + 1).toString()),
                            {
                                theme: "grid",
                                styles: { overflow: 'linebreak', lineWidth: 0.01, halign: 'center', cellPadding: 0.30 },
                                margin: { top: 16.8 },

                            });
                    }
                });

                Documento.addPage();


                Documento.setFontSize(25);
                Documento.setFont("helvetica");
                Documento.setFontType("bold");
                Documento.setTextColor(62, 74, 99);
                Documento.text(11.5, 1.6, "Grafica de sumatoria");
                Documento.setDrawColor(119, 101, 227);
                Documento.setLineWidth(0.1);
                Documento.line(11.5, 1.86, 20.3, 1.86);

                Documento.setFont("Helvetica");
                Documento.setFontType("normal");
                Documento.setTextColor(0, 0, 0);
                Documento.setFontSize(14);
                Documento.text(1.4, 3.2, "     Grafica de la sumatoria de todas las potencias individuales de los usuarios en las 24 horas del dia (100 KVA) ");

                var Grafica = document.getElementById("myChartTOTAL").toDataURL("image/jpeg", "0.7");
                Documento.addImage(Grafica, 'JPG', 2, 4, 26, 11.5);



                Documento.setFont("Helvetica");
                Documento.setFontType("normal");
                Documento.setTextColor(0, 0, 0);
                Documento.setFontSize(14);
                Documento.text(1.4, 16.2, "Tabla de potencias de la sumatoria de potencias (En 100 * KVA) :");

                Documento.autoTable(ColumnasPotenciasConsumidor, Proyecciones[J].Sumatoria,
                    {
                        theme: "grid",
                        styles: { overflow: 'linebreak', lineWidth: 0.01, halign: 'center', cellPadding: 0.30 },
                        margin: { top: 16.8 },

                    });

                Documento.addPage();
                Documento.setFontSize(25);
                Documento.setFont("helvetica");
                Documento.setFontType("bold");
                Documento.setTextColor(62, 74, 99);
                Documento.text(11.45, 1.6, "Ejes de las cargas");
                Documento.setLineWidth(0.1);
                Documento.setDrawColor(119, 101, 227);
                Documento.line(11.5, 1.90, 19, 1.90);

                Documento.setFont("Helvetica");
                Documento.setFontType("normal");
                Documento.setTextColor(0, 0, 0);
                Documento.setFontSize(14);
                Documento.text(1.4, 3.5, "Información de todas las cargas de la proyeccion N° 1 esta incluye la categoria de cada consumidor, las coordenadas ");
                Documento.text(1.4, 4.5, "en x e y en el plano cartesiano , convertidas a metros en base a la escala usada , y su ubicación geografica en latitud");
                Documento.text(1.4, 5.5, "y longitud.");


                Documento.autoTable(ColumnasConsumidoresMapa, DevolverTablaConsumidores(J),
                    {
                        theme: "striped",
                        styles: { overflow: 'linebreak', lineWidth: 0.01, halign: 'center', cellPadding: 0.45 },
                        margin: { top: 6.2 },
                        headerStyles:
                        {
                            lineWidth: 0,
                            fillColor: ColorTabla,
                            textColor: [255, 255, 255],
                        },
                    });

                Documento.addPage();


                Documento.setFontSize(25);
                Documento.setFont("helvetica");
                Documento.setFontType("bold");
                Documento.setTextColor(62, 74, 99);
                Documento.text(9.45, 1.6, "Centros Eventuales de carga");
                Documento.setLineWidth(0.1);
                Documento.setDrawColor(119, 101, 227);
                Documento.line(9.5, 1.90, 21.5, 1.90);

                Documento.setFont("Helvetica");
                Documento.setFontType("normal");
                Documento.setTextColor(0, 0, 0);
                Documento.setFontSize(14);
                Documento.text(1.4, 3.5, "Los centros eventuales de cargas son aquellos puntos en el mapa  optimos para la construcción de la subestación electrica.");



                Documento.autoTable(ColumnasCentrosEventualesCarga, DevolvertablaCentrosEventuales(J),
                    {
                        theme: "striped",
                        styles: { overflow: 'linebreak', lineWidth: 0.01, halign: 'center', cellPadding: 0.10 },
                        margin: { top: 4 },
                        headerStyles:
                        {
                            lineWidth: 0,
                            fillColor: ColorTabla,
                            textColor: [255, 255, 255],
                        },
                    });

                Documento.addPage();


                Documento.setFontSize(25);
                Documento.setFont("helvetica");
                Documento.setFontType("bold");
                Documento.setTextColor(62, 74, 99);
                Documento.text(13.5, 1.6, "Variables");
                Documento.setLineWidth(0.1);
                Documento.setDrawColor(119, 101, 227);
                Documento.line(13.5, 1.90, 18 - 0.5, 1.90);


                Documento.setFont("Helvetica");
                Documento.setFontType("normal");
                Documento.setTextColor(0, 0, 0);
                Documento.setFontSize(14);
                Documento.text(1.4, 2.9, "Resultados de todas las variables utilizadas en el proceso para calcular la ubicación ideal de la subestación electrica incluye.");
                Documento.text(1.4, 3.9, "ndo la ubicación real (Latitud y longitud) de la subestación.");

                Documento.autoTable(ColumnasVariables, DevolverFilaVariables(J),
                    {
                        theme: "striped",
                        styles: { overflow: 'linebreak', lineWidth: 0.01, halign: 'center', cellPadding: 0.18 },
                        margin: { top: 4.5 },
                        headerStyles:
                        {
                            lineWidth: 0,
                            fillColor: ColorTabla,
                            textColor: [255, 255, 255],
                        },
                    });



                Documento.addPage();

                Documento.setFontSize(25);
                Documento.setFont("helvetica");
                Documento.setFontType("bold");
                Documento.setTextColor(62, 74, 99);
                Documento.text(13.5, 1.6, "Mapa");
                Documento.setLineWidth(0.1);
                Documento.setDrawColor(119, 101, 227);
                Documento.line(13.5, 1.90, 15.8, 1.90);


                Documento.setFont("Helvetica");
                Documento.setFontType("normal");
                Documento.setTextColor(0, 0, 0);
                Documento.setFontSize(14);
                Documento.text(1.4, 2.9, "Ubicación de las cargas (Etiquedas con el alfabeto) , los centros eventuales y la elipse que contempla la zona de la sub.");
                Documento.text(1.4, 3.9, "estación electica.");

                var Grafica = GraficasEstaticas[J];
                Documento.addImage(Grafica, 'JPG', 1.2, 5, 28.5, 8.5);


                Documento.setFont("Helvetica");
                Documento.setFontType("normal");
                Documento.setTextColor(0, 0, 0);
                Documento.setFontSize(14);


                Documento.text(3.3, 14.9, "Elipse");

                Documento.setDrawColor(R1, B1, G1);
                Documento.setFillColor(R1, B1, G1);
                Documento.rect(1.4, 14.5, 1.41111, 0.5, 'F');



                Documento.text(3.3 + 10, 14.9, "Centros de carga");

                Documento.setDrawColor(R2, G2, B2);
                Documento.setFillColor(R2, G2, B2);
                Documento.rect(1.4 + 10, 14.5, 1.41111, 0.5, 'F');


                Documento.text(3.3 + 20, 14.9, "Centros eventuales");

                Documento.setDrawColor(173, 255, 47);
                Documento.setFillColor(173, 255, 47);
                Documento.rect(1.4 + 20, 14.5, 1.41111, 0.5, 'F');



                Documento.text(3.3 + 2, 17.4, "Marcadores : " + Proyecciones[J].MarcadoresCollecion.length + " / 10");
                Documento.text(3.3 + 4.7, 18.7, "Geolocalización Centro : " + Proyecciones[J].Centro.Ubicacion);
                Documento.text(3.3 + 14, 17.4, "Centros eventuales : 24 / 24");
                Documento.addPage();

            }
        }
        if (CentroInterseccion != null && MostrarTodasProyecciones) {
            Documento.setFontSize(25);
            Documento.setFont("helvetica");
            Documento.setFontType("bold");
            Documento.setTextColor(62, 74, 99);
            Documento.text(10.65, 1.6, "Proyección Final");
            Documento.setLineWidth(0.1);
            Documento.setDrawColor(119, 101, 227);
            Documento.line(10.7, 1.90, 17.7, 1.90);

            Documento.setFont("Helvetica");
            Documento.setFontType("normal");
            Documento.setTextColor(0, 0, 0);
            Documento.setFontSize(14);
            Documento.text(1.4, 3.5, "Grafica de todas las proyecciones unidas el poligono morado denota la intersección entre las 3 elipses y el centro");
            Documento.text(1.4, 4.5, "optimo para la construcción de la subestación electrica.");

            var Grafica = GraficasEstaticas[3];
            Documento.addImage(Grafica, 'JPG', 1.2, 5, 28.5, 8.5);


            Documento.setFont("Helvetica");
            Documento.setFontType("normal");
            Documento.setTextColor(0, 0, 0);
            Documento.setFontSize(14);

            R1 = 255; G1 = 0; B1 = 0;
            Documento.text(3.3 + 0.3, 14.9, "Elipse P1");

            Documento.setDrawColor(R1, G1, B1);
            Documento.setFillColor(R1, G1, B1);
            Documento.rect(1.4 + 0.3, 14.5, 1.41111 + 0.3, 0.5, 'F');


            R2 = 60; G2 = 179; B2 = 113;
            Documento.text(3.3 + 5.3, 14.9, "Elipse P2");

            Documento.setDrawColor(R2, G2, B2);
            Documento.setFillColor(R2, G2, B2);
            Documento.rect(1.4 + 5.3, 14.5, 1.41111, 0.5, 'F');

            R2 = 147; G2 = 112; B2 = 219;
            Documento.text(3.3 + 10.3, 14.9, "Elipse P3");

            Documento.setDrawColor(R2, G2, B2);
            Documento.setFillColor(R2, G2, B2);
            Documento.rect(1.4 + 10.3, 14.5, 1.41111, 0.5, 'F');


            R2 = 255; G2 = 255; B2 = 0;
            Documento.text(3.3 + 15.3, 14.9, "Intersección");

            Documento.setDrawColor(R2, G2, B2);
            Documento.setFillColor(R2, G2, B2);
            Documento.rect(1.4 + 15.3, 14.5, 1.41111, 0.5, 'F');

            R2 = 147; G2 = 112; B2 = 219;
            Documento.text(3.3 + 20.3, 14.9, "Centro Optimo");

            Documento.setDrawColor(173, 255, 47);
            Documento.setFillColor(173, 255, 47);
            Documento.rect(1.4 + 20.3, 14.5, 1.41111, 0.5, 'F');

            Documento.text(3.3 + 6.6, 15.9, "Centro Optimo Latitud : " + CentroInterseccion.getPosition().lat());
            Documento.text(3.3 + 6.6, 16.9, "Centro Optimo Longitud : " + CentroInterseccion.getPosition().lng());
            Documento.text(3.3 + 6.6, 17.9, "Geolocalización : " + CentroInterseccion.Ubicacion);
        }

        if (MarcadorPruebas != null) {
            Documento.addPage();
            Documento.setFontSize(25);
            Documento.setFont("helvetica");
            Documento.setFontType("bold");
            Documento.setTextColor(62, 74, 99);
            Documento.text(9.65, 1.6, "Proyección Personalizada");
            Documento.setLineWidth(0.1);
            Documento.setDrawColor(119, 101, 227);
            Documento.line(9.7, 1.90, 20.9, 1.90);

            Documento.setFont("Helvetica");
            Documento.setFontType("normal");
            Documento.setTextColor(0, 0, 0);
            Documento.setFontSize(14);
            Documento.text(1.4, 3.5, "Pin de prueba puesto por el usuario en el mapa a continuación se detallan las caracteristicas de dicho lugar en base al mapa");


            Documento.setFontType("bold");
            Documento.text(1.4, 5.5, "Latitud : " + MarcadorPruebas.getPosition().lat());
            Documento.text(1.4, 6.5, "Longitud : " + MarcadorPruebas.getPosition().lng());
            var Punto = RetornarCordenada(MarcadorPruebas, 0);
            Documento.text(1.4, 7.5, "Coordenada X : " + Punto.x);
            Documento.text(1.4, 8.5, "Coordenada Y : " + Punto.y);
            Documento.text(1.4, 10.5, "Intercepta con elipse P1 : " + PuntoDentroPoligono(MarcadorPruebas.getPosition(), Proyecciones[0].Elipse));
            Documento.text(1.4, 11.5, "Intercepta con elipse P2 : " + PuntoDentroPoligono(MarcadorPruebas.getPosition(), Proyecciones[1].Elipse));
            Documento.text(1.4, 12.5, "Intercepta con elipse P3 : " + PuntoDentroPoligono(MarcadorPruebas.getPosition(), Proyecciones[2].Elipse));
            if (MostrarTodasProyecciones == false) {
                Documento.text(1.4, 13.5, "Esta en zona optima : " + PuntoDentroPoligono(MarcadorPruebas.getPosition(), Proyecciones[ProyeccionActiva].Elipse));
            }
            else {
                if (PuntoDentroPoligono(MarcadorPruebas.getPosition(), Proyecciones[0].Elipse) == "Si" && PuntoDentroPoligono(MarcadorPruebas.getPosition(), Proyecciones[1].Elipse) == "Si") {
                    Documento.text(1.4, 13.5, "Esta en zona optima : Si ");
                }
                else {
                    Documento.text(1.4, 13.5, "Esta en zona optima : No ");
                }
            }
        }
        Documento.addPage();
        Documento.setFontSize(25);
        Documento.setFont("helvetica");
        Documento.setFontType("bold");
        Documento.setTextColor(62, 74, 99);
        Documento.text(9.65, 1.6, "Variables del sistema");
        Documento.setLineWidth(0.1);
        Documento.setDrawColor(119, 101, 227);
        Documento.line(9.7, 1.90, 18.7, 1.90);

        Documento.setFont("Helvetica");
        Documento.setFontType("normal");
        Documento.setTextColor(0, 0, 0);
        Documento.setFontSize(14);
        Documento.text(1.4, 3.5, "Variables internas que usa el sistema para hacer los calculos o procedimientos matematicos para la subestación electrica.");


        Documento.setFontType("bold");
        Documento.text(1.4, 5.5, "Escala del mapa en X (Cada 5 Pixeles) : " + EscalaMapaX + " Metros");
        Documento.text(1.4, 6.5, "Escala del mapa en Y (Cada 5 Pixeles) : " + EscalaMapaY + " Metros");
        Documento.text(1.4, 7.5, "Centro del mapa latitud : " + MapaCanvas.getCenter().lat());
        Documento.text(1.4, 8.5, "Centro del mapa longitud : " + MapaCanvas.getCenter().lng())

        Documento.save('Subestación Electrica.pdf');
        Datos_Graficas(Proyecciones, ProyeccionActiva);
    }
    else 
    {
            $.Notification.autoHideNotify('error', 'top right', 'Datos insuficientes para generar reporte')                                                ;
    }

}


function ImprimirVariables(PN) {
    var Arreglo = DevolverFilaVariables(PN);

    var Formula = "D _{x} = " + Arreglo[0][2];
    katex.render(Formula, DxTexto);


    Formula = "D _{y} = " + Arreglo[1][2];
    katex.render(Formula, DyTexto);

    Formula = "\\sigma _{x} = " + Arreglo[2][2];
    katex.render(Formula, SigmaXTexto);

    Formula = "\\sigma _{y} = " + Arreglo[3][2];
    katex.render(Formula, SigmaYTexto);

    Formula = "H _{x} = " + Arreglo[4][2];
    katex.render(Formula, HxTexto);

    Formula = "H _{y} = " + Arreglo[5][2];
    katex.render(Formula, HyTexto);


    Formula = "A _{x} = " + Arreglo[6][2];
    katex.render(Formula, AxTexto);

    Formula = "A _{y} = " + Arreglo[7][2];
    katex.render(Formula, AyTexto);

    Formula = "C _{xy} = " + Arreglo[8][2];
    katex.render(Formula, CxyTexto);

    Formula = "r = " + Arreglo[9][2];
    katex.render(Formula, rTexto);

    Arreglo[10][2] = Arreglo[10][2].replace("°", "");
    Formula = "\\alpha  = " + Arreglo[10][2] + "^\\circ.";
    katex.render(Formula, AnguloTexto);


    Formula = "\\sigma \\Psi  = " + Arreglo[11][2];
    katex.render(Formula, FhiSigmaTexto);

    Formula = "\\sigma \\Phi  = " + Arreglo[12][2];
    katex.render(Formula, PhiSigmaTexto);


    Formula = "h\\Psi = " + Arreglo[13][2];
    katex.render(Formula, FhiExactitudTexto);

    Formula = "h\\Phi  = " + Arreglo[14][2];
    katex.render(Formula, PhiExactitudTexto);


    Formula = "R\\Psi  = " + Arreglo[15][2];
    katex.render(Formula, FhiRadioTexto);

    Formula = "R\\Phi  = " + Arreglo[16][2];
    katex.render(Formula, PhiRadioTexto);

}





function GeolocalizacionCentroEventual(Datos) {
    JSONGeolocalizacion = Datos;
    if (Datos.status == "OVER_QUERY_LIMIT") {
        Proyecciones[ProyeccionActiva].CentrosEventuales[ContadorCentrosEventuales].Ubicacion = "No disponible intente mas tarde";
    }
    else {
        Proyecciones[ProyeccionActiva].CentrosEventuales[ContadorCentrosEventuales].Ubicacion = JSONGeolocalizacion.results[0].formatted_address;
    }
    ContadorCentrosEventuales++;
    if (ContadorCentrosEventuales == 24) { ContadorCentrosEventuales = 0; }
}

function GeolocalizacionCentroElipse(Datos) {
    JSONGeolocalizacion = Datos;
    if (Datos.status == "OVER_QUERY_LIMIT") {
        Proyecciones[ProyeccionActiva].Centro.Ubicacion = "No disponible intente mas tarde";
    }
    else {
        Proyecciones[ProyeccionActiva].Centro.Ubicacion = JSONGeolocalizacion.results[0].formatted_address;
    }
}

function GeolocalizacionCentroInterseccion(Datos) {
    JSONGeolocalizacion = Datos;
    if (Datos.status == "OVER_QUERY_LIMIT") {
        CentroInterseccion.Ubicacion = "No disponible intente mas tarde";
    }
    else {
        CentroInterseccion.Ubicacion = JSONGeolocalizacion.results[0].formatted_address;
    }
}

function URLCentroEventual(CentroEventual) {
    switch (CentroEventual) {
        case "1":
            URLImagen = "https://k61.kn3.net/D/9/F/2/D/2/EBD.png";
            break;
        case "2":
            URLImagen = "https://k61.kn3.net/A/7/7/6/F/2/886.png";
            break;

        case "3":
            URLImagen = "https://k60.kn3.net/A/A/0/2/F/5/3F4.png";
            break;

        case "4":
            URLImagen = "https://k61.kn3.net/6/9/5/C/9/9/52E.png";
            break;

        case "5":
            URLImagen = "https://k61.kn3.net/A/5/5/0/4/A/7D7.png";
            break;
        case "6":
            URLImagen = "https://k61.kn3.net/A/E/B/0/7/C/D5A.png";
            break;

        case "7":
            URLImagen = "https://k61.kn3.net/5/3/A/C/0/C/4F0.png";
            break;

        case "8":
            URLImagen = "https://k60.kn3.net/A/3/B/5/E/1/CB7.png";
            break;

        case "9":
            URLImagen = "https://k60.kn3.net/D/E/6/3/E/5/B4D.png";
            break;

        case "10":
            URLImagen = "https://k61.kn3.net/D/4/5/B/B/B/326.png";
            break;

        case "11":
            URLImagen = "https://k61.kn3.net/8/A/7/2/F/6/279.png";
            break;
        case "12":
            URLImagen = "https://k60.kn3.net/5/C/1/E/2/C/D41.png";
            break;

        case "13":
            URLImagen = "https://k61.kn3.net/2/8/7/D/F/8/F6D.png";
            break;

        case "14":
            URLImagen = "https://k61.kn3.net/8/E/3/6/8/C/D11.png";
            break;

        case "15":
            URLImagen = "https://k61.kn3.net/9/2/F/D/1/D/B9B.png";
            break;
        case "16":

            URLImagen = "https://k61.kn3.net/E/4/5/9/D/1/0EF.png";
            break;

        case "17":
            URLImagen = "https://k61.kn3.net/2/1/3/4/5/A/214.png";
            break;

        case "18":
            URLImagen = "https://k61.kn3.net/2/9/7/8/E/7/DF7.png";
            break;

        case "19":
            URLImagen = "https://k60.kn3.net/8/F/9/F/9/8/74D.png";
            break;

        case "20":
            URLImagen = "https://k61.kn3.net/C/B/D/6/C/D/A3D.png";
            break;

        case "21":
            URLImagen = "https://k61.kn3.net/1/9/F/7/A/7/24E.png";
            break;

        case "22":
            URLImagen = "https://k61.kn3.net/4/D/F/7/B/4/DD1.png";
            break;

        case "23":
            URLImagen = "https://k60.kn3.net/F/9/5/F/C/6/B8B.png";
            break;

        case "24":
            URLImagen = "https://k60.kn3.net/F/9/5/F/C/6/B8B.png";
            break;
    }
    return URLImagen;
}


function URLCentroElipse(Centro) 
{
    Centro = Centro.toString();
    switch (Centro) {
        case "0":
            URLImagen = "https://k60.kn3.net/3/2/E/E/D/7/B0E.png";
            break;
        case "1":
            URLImagen = "https://k60.kn3.net/B/4/6/8/5/2/809.png";
            break;

        case "2":
            URLImagen = "https://k60.kn3.net/6/5/6/8/B/1/D23.png";
            break;

        case "3":
            URLImagen = "https://k60.kn3.net/E/6/9/7/6/1/E3A.png";
            break;
    }
    return URLImagen;
}