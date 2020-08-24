var MarcadorCiudad = null;
var MarcadorPruebas = null;
var VentanaInformacion;
var UltimoIndiceMarcador = null;
var JSONBBDD;
var Rectangulo = null;
function GenerarMapa() 
{
    MapaCanvas = new google.maps.Map(document.getElementById('Mapa'),
        {
            zoom: 15,
            center: { lat: 12.13282, lng: -86.2504 },
            fullscreenControl: false,
            rotateControl: true,
            scaleControl: true,
        });

    var Ubicacion = document.getElementById('BusquedaLugar');
    var CajaDeBusqueda = new google.maps.places.SearchBox(Ubicacion);




    MapaCanvas.addListener('bounds_changed', function () 
    {
        CajaDeBusqueda.setBounds(MapaCanvas.getBounds());
    });

    var MarcadoresBusqueda = [];
    CajaDeBusqueda.addListener('places_changed', function () 
    {
        if (Rectangulo == null) 
        {
            var Lugares = CajaDeBusqueda.getPlaces();
            if (Lugares.length == 0) 
            {
                $.Notification.autoHideNotify('warning', 'top right', 'No place was found.')                                              ;
            }
            else 
            {
                var BordeMapa = new google.maps.LatLngBounds();
                Lugares.forEach(function (place) 
                {
                    var Icono = { url: place.icon, size: new google.maps.Size(71, 71), origin: new google.maps.Point(0, 0), anchor: new google.maps.Point(17, 34), EscaladSize: new google.maps.Size(25, 25) };
                    if (place.geometry.viewport) 
                    {
                        BordeMapa.union(place.geometry.viewport);
                    }
                    else 
                    {
                        BordeMapa.extend(place.geometry.location);
                    }
                });
                MapaCanvas.panTo(Lugares[0].geometry.location);
                if (MarcadorCiudad != null) { MarcadorCiudad.setMap(null) };
                MarcadorCiudad = new google.maps.Marker(
                    {
                        position: Lugares[0].geometry.location,
                        map: MapaCanvas,
                        animation: google.maps.Animation.DROP,
                        icon: 'https://k60.kn3.net/B/D/7/7/8/4/8FC.png'
                    });

                var CadenaHTML = '<strong style="  text-align: center;">Location: </strong>' + Lugares[0].name + '<br><strong>Address: </strong>' + Lugares[0].formatted_address + '<br><strong>Latitude: </strong>' + Lugares[0].geometry.location.lat() + '<br><strong>Longitude: </strong>' + Lugares[0].geometry.location.lng();


                var VentanaInformacion = new google.maps.InfoWindow
                    ({
                        content: CadenaHTML
                    });
                MarcadorCiudad.addListener('click', function () {
                    VentanaInformacion.open(MapaCanvas, MarcadorCiudad);
                });
                MapaCanvas.setZoom(15);
            }
        }
        else 
        {
            $.Notification.autoHideNotify('warning', 'top right', 'Remove the limits first.')                                                        
        }
    });



    google.maps.event.addListener(MapaCanvas, 'center_changed', function () 
    {
        if (Rectangulo != null) {

            if ((Bordes.contains(MapaCanvas.getBounds().getNorthEast())) == true && (Bordes.contains(MapaCanvas.getBounds().getSouthWest()) == true)) {
                UltimoCentro = MapaCanvas.getCenter();
            }
            else {
                MapaCanvas.panTo(UltimoCentro);
            }
        }
    });



    ZoomEscucha = google.maps.event.addListener(MapaCanvas, 'zoom_changed', function (event) 
    {
        if (MapaCanvas.getZoom() >= ZoomMinimo) 
        {
            ZoomBordes = google.maps.event.addListenerOnce(MapaCanvas, 'bounds_changed', function (event) 
            {
                if (Rectangulo != null) 
                {
                    if (CondicionZoom == false)
                        if ((Bordes.contains(MapaCanvas.getBounds().getNorthEast())) == false || (Bordes.contains(MapaCanvas.getBounds().getSouthWest()) == false)) 
                        {
                            CondicionZoom = true;
                            MapaCanvas.fitBounds(Bordes);
                            CondicionZoom = true;
                            MapaCanvas.setZoom(ZoomMinimo);
                        }
                    CondicionZoom = false;
                }
            });
        }
        else 
        {
            MapaCanvas.setZoom(ZoomMinimo);
        }
    });
}

/* Bloque la pantalla para que el mapa no se pueda mover */
function DelimitarBordes(Parametro) 
{
    if (Parametro == "") {
        if (Rectangulo != null) 
        {
            Rectangulo.setMap(null);
        }
        Bordes = MapaCanvas.getBounds();
        NW = Bordes.getSouthWest();
        ZoomMinimo = MapaCanvas.getZoom();
        var PuntoInicio = Coordenadas_Cartesianas_APunto({ x: 0, y: 0 });
        var PuntoFin = Coordenadas_Cartesianas_APunto({ x: 5, y: 0 });
        EscalaMapaX = google.maps.geometry.spherical.computeDistanceBetween(PuntoInicio, PuntoFin);
        PuntoFin = Coordenadas_Cartesianas_APunto({ x: 0, y: 5 });
        EscalaMapaY = google.maps.geometry.spherical.computeDistanceBetween(PuntoInicio, PuntoFin);
        Escala = Math.pow(2, ZoomMinimo);
        Tope = new google.maps.LatLng(MapaCanvas.getBounds().getNorthEast().lat(), MapaCanvas.getBounds().getSouthWest().lng());
        CoordenadaMundo = MapaCanvas.getProjection().fromLatLngToPoint(Tope);
        Proyeccion = MapaCanvas.getProjection();
        Rectangulo = new google.maps.Rectangle({ strokeColor: '#FF0000', strokeOpacity: 0.5, strokeWeight: 10, fillOpacity: 0, map: MapaCanvas, bounds: Bordes, zIndex: 1, clickable: true });
        UltimoCentro = MapaCanvas.getCenter();        

        // Rectangulo Invisible marcadores //
        var PNW1 = Coordenadas_Cartesianas_APunto({ x: 10, y: 30 });
        var PNE1 = Coordenadas_Cartesianas_APunto({ x: $("#Mapa").width() - 10, y: 30 });
        var PSW1 = Coordenadas_Cartesianas_APunto({ x: 10, y: $("#Mapa").height() - 5 });
        var PSE1 = Coordenadas_Cartesianas_APunto({ x: $("#Mapa").width() - 10, y: $("#Mapa").height() - 5 });

        BordesRectanguloMarcador = new google.maps.LatLngBounds();

        BordesRectanguloMarcador.extend(PNW1);
        BordesRectanguloMarcador.extend(PNE1);
        BordesRectanguloMarcador.extend(PSW1);
        BordesRectanguloMarcador.extend(PSE1);       
    }
    else {
        if (Rectangulo != null) 
        {
            Bordes = null;
            Rectangulo.setMap(null);
            Rectangulo = null;
            ZoomMinimo = null;
        }
    }
}



// Recordar tomar en cuenta guardar las opciones activadas en el espacio de trabajo //
function GuardarEspacioDeTrabajo(Parametro) 
{
    if (Parametro == 0) 
    {
        Proyecciones[ProyeccionActiva].EspaciosDeTrabajo.push({ Identificador: Alfabeto[Proyecciones[ProyeccionActiva].EspacioTrabajoContador], Zoom: MapaCanvas.getZoom(), Marcadores: _.cloneDeep(Proyecciones[ProyeccionActiva].MarcadoresCollecion) });
        Espacio = Alfabeto[Proyecciones[ProyeccionActiva].EspacioTrabajoContador];        
        Proyecciones[ProyeccionActiva].EspacioTrabajoContador = Proyecciones[ProyeccionActiva].EspacioTrabajoContador + 1;
        
    }    
}

// Restaura los espacios de trabajo para una proyección //
function RestaurarEspaciosDeTrabajo(ID) 
{
    DelimitarBordes(2);
    OcultarMostrar_Cargas(1, ProyeccionActiva, null);
    OcultarMostrar_CentrosDeCargaEventuales(1, ProyeccionActiva, null);
    OcultarMostrar_Elipses(1, ProyeccionActiva, null);
    Proyecciones[ProyeccionActiva].MarcadoresCollecion = null;
    Proyecciones[ProyeccionActiva].MarcadoresCollecion = Proyecciones[ProyeccionActiva].EspaciosDeTrabajo[ID].Marcadores;
    MapaCanvas.setCenter(Proyecciones[ProyeccionActiva].EspaciosDeTrabajo[ID].Centro);
    MapaCanvas.setZoom(Proyecciones[ProyeccionActiva].EspaciosDeTrabajo[ID].Zoom);
    OcultarMostrar_Cargas(1, ProyeccionActiva, MapaCanvas);
    //ActualizarLeyenda();
    Proyecciones[ProyeccionActiva].MarcadoresCollecion.forEach(function (Instancia) 
    {
        google.maps.event.addListener(Instancia.Marcador, 'click', function ()
        {
            document.getElementById('rowcategoria').style.display = 'block';
            document.getElementById('rowtabla').style.display = 'block';
            document.getElementById('guardarcontenedor').style.display = 'block';
            Instancia.Marcador.setAnimation(google.maps.Animation.None);
            Referencia = Instancia.Marcador;
            var IndiceProyeccion = BuscarProyeccionInstancia.Marcador(Instancia.Marcador.tittle);
            var Categoria = BuscarIndice(Proyecciones[IndiceProyeccion].Instancia.MarcadoresCollecion, Instancia.Marcador.tittle, 1);
            document.getElementById("ctitulo").innerHTML = 'Consumidor ' + Instancia.Marcador.tittle + " (P" + (Categoria.Proyeccion + 1).toString() + ')';
            document.getElementById("clatitud").value = (Instancia.Marcador.position.lat()).toString();
            document.getElementById("clongitud").value = (Instancia.Marcador.position.lng()).toString();
            var Punto = RetornarCordenada(Instancia.Marcador, 0);
            document.getElementById("ccoordenadas").value = Punto.x + " , " + Math.abs((Punto.y - Altura));
         
            if (Categoria.Categoria == '1') { document.getElementById("Cat1CentroEventual").checked = true; }
            else if (Categoria.Categoria == '2') { document.getElementById("Cat2CentroEventual").checked = true; }
            else { document.getElementById("Cat3CentroEventual").checked = true; }
            OperacionesTabla(5, Proyecciones[IndiceProyeccion].MarcadoresCollecion[BuscarIndice(Proyecciones[IndiceProyeccion].MarcadoresCollecion, Instancia.Marcador.tittle, 2, false)].Horas);
            ContenedorTipo = "Marcador";            
            document.getElementById('ContenedorEmergente').style.left  = Math.abs(($('#ContenedorEmergente').width()/2)-event.pixel.x)+"px";
            document.getElementById('ContenedorEmergente').style.top = event.pixel.y+"px";
            $("#ContenedorEmergente").show(1000);
        });



        google.maps.event.addListener(Instancia.Marcador, 'dragstart', function (event) 
        {
            $("#ContenedorEmergente").hide(300);
            MapaCanvas.setOptions({ draggable: false });
        });

        google.maps.event.addListener(Instancia.Marcador, 'dragend', function (event) {
            MapaCanvas.setOptions({ draggable: true });

            if(SwitchActivo('switchtiemporeal'))
            {

                if(Proyecciones[ProyeccionActiva].ElipseDibujada == true) 
                {
                    if (SwitchActivo('switchcentroseventuales') == true) OcultarMostrar_CentrosDeCargaEventuales(1, ProyeccionActiva, MapaCanvas);
                    else OcultarMostrar_CentrosDeCargaEventuales(1, ProyeccionActiva, null);            
                    if (Proyecciones[ProyeccionActiva].ElipseDibujada == true) { CentrosEventualesDeCarga(1, BuscarProyeccionMarcador(Marcador.tittle)); }
                    if (MostrarTodasProyecciones == true) { DetectarInterseccion(1); }                    
                    if (Proyecciones[ProyeccionActiva].ElipseDibujada) { MapaAImagen(ProyeccionActiva, 0); }            
                }                    
                    UltimoIndiceMarcador = BuscarIndice(Proyecciones[ProyeccionActiva].MarcadoresCollecion, Instancia.Marcador.tittle, 2);
                    
            }
            if(SwitchActivo('switchcentroseventuales') == false)
            {
                    OcultarMostrar_CentrosDeCargaEventuales(1,ProyeccionActiva,null);
            }

            if(SwitchActivo('switchelipse') == false)
            {
                OcultarMostrar_Elipses(1,ProyeccionActiva,null);
            }
            $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + Marcador.getPosition().lat() + ",+" + Marcador.getPosition().lng() + "&key=AIzaSyAt-2vlOp9uyOc8vvUlLi7TiJur1Lix-vQ", GeolocalizacionDrag);
        });


        google.maps.event.addListener(Instancia.Marcador, 'drag', function (event) {

            Referencia = Instancia.Marcador;
            var ProyeccionMarcador = BuscarProyeccionMarcador(Instancia.Marcador.tittle);
            var MarcadorObjeto = BuscarIndice(Proyecciones[ProyeccionMarcador].MarcadoresCollecion,Instancia.Marcador.tittle, 1);
            if ((((RetornarCordenada(Instancia.Marcador).x)) > 0) && (((RetornarCordenada(Instancia.Marcador).x)) < (MapaCanvas.getDiv().offsetWidth))) 
            {
                MarcadorObjeto.X = ((RetornarCordenada(Instancia.Marcador).x));
                MarcadorObjeto.XEscala = RetornarCordenada(Instancia.Marcador).x * EscalaMapaX;
            }
            if ((((RetornarCordenada(Instancia.Marcador).y)) > 0) && (((RetornarCordenada(Instancia.Marcador).y)) < (Altura))) 
            {
                MarcadorObjeto.Y = ((Math.abs((RetornarCordenada(Instancia.Marcador).y) - Altura)));
                MarcadorObjeto.YEscala = Math.abs((RetornarCordenada(Instancia.Marcador).y) - Altura) * EscalaMapaY;
            }
            
            if (SwitchActivo('switchtiemporeal') == true & Proyecciones[ProyeccionMarcador].ElipseDibujada == true) 
            {
                CentrosEventualesDeCarga(2, ProyeccionMarcador);
            }
            if(BordesRectanguloMarcador.contains(Instancia.Marcador.getPosition()) == false) 
            {
                Instancia.Marcador.setPosition(UltimoCentroMarcador)  
            }  
            else
            {
                UltimoCentroMarcador = Instancia.Marcador.getPosition();
            }
            if (MostrarTodasProyecciones == true) { DetectarInterseccion(0); }            
            if(SwitchActivo('switchelipse') == false){ OcultarMostrar_Elipses(1,ProyeccionActiva,null);}
        });

    });
    CentrosEventualesDeCarga(1, ProyeccionActiva);
    DelimitarBordes("");
    Espacio = ID;
    $.Notification.autoHideNotify('success', 'top right', 'Workspace successfully restored');                
}


function CopiarProyeccionPrevia(Pr) {
    if (Pr == 0 && SegundaProyeccionActivada == false) { SegundaProyeccionActivada = true; } else if (Pr == 1 && TerceraProyeccionActivada == false) { TerceraProyeccionActivada = true; } else { return null; }

    Proyecciones[Pr].MarcadoresCollecion.forEach(function (IteradorMarcador) {
        AñadirMarcadorMapa(IteradorMarcador.Marcador.getPosition(), MapaCanvas);
    });
    OcultarMostrar_Cargas(1, 2, MapaCanvas);
}
/* Añade un nuevo marcador al mapa del usuario*/
function AñadirMarcadorMapa(Coordenadas, MapaCanvas) {
    if (Proyecciones[ProyeccionActiva].Contador < 11) {
        var Marcador = new google.maps.Marker(
            {
                position: Coordenadas,
                draggable: true,
                map: MapaCanvas,
                animation: google.maps.Animation.DROP,
                tittle: Alfabeto[Proyecciones[ProyeccionActiva].Contador - 1] + (ProyeccionActiva + 1).toString(),
                icon: DevolverURLMarcador(Alfabeto[Proyecciones[ProyeccionActiva].Contador - 1] + (ProyeccionActiva + 1).toString())
            })

        var Horas = OperacionesTabla(2, null);
        Proyecciones[ProyeccionActiva].MarcadoresCollecion.push({ Titulo: Alfabeto[Proyecciones[ProyeccionActiva].Contador - 1] + (ProyeccionActiva + 1).toString(), Categoria: "1", Marcador: Marcador, Horas, X: RetornarCordenada(Marcador).x, Y: Math.abs((RetornarCordenada(Marcador).y) - Altura), Posicion: Proyecciones[ProyeccionActiva].Contador, Proyeccion: ProyeccionActiva });
        Proyecciones[ProyeccionActiva].Contador++;        

        $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + Marcador.getPosition().lat() + ",+" + Marcador.getPosition().lng() + "&key=AIzaSyAt-2vlOp9uyOc8vvUlLi7TiJur1Lix-vQ", Geolocalizacion);
        google.maps.event.addListener(Marcador, 'click', function (event) 
        {            
            document.getElementById('rowcategoria').style.display = 'block';
            document.getElementById('rowtabla').style.display = 'block';
            document.getElementById('guardarcontenedor').style.display = 'block';
            Marcador.setAnimation(google.maps.Animation.None);
            Referencia = Marcador;
            var IndiceProyeccion = BuscarProyeccionMarcador(Marcador.tittle);
            var Categoria = BuscarIndice(Proyecciones[IndiceProyeccion].MarcadoresCollecion, Marcador.tittle, 1);
            document.getElementById("ctitulo").innerHTML = 'Consumidor ' + Marcador.tittle + " (P" + (Categoria.Proyeccion + 1).toString() + ')';
            document.getElementById("clatitud").value = (Marcador.position.lat()).toString();
            document.getElementById("clongitud").value = (Marcador.position.lng()).toString();
            var Punto = RetornarCordenada(Marcador, 0);
            document.getElementById("ccoordenadas").value = Punto.x + " , " + Math.abs((Punto.y - Altura));
         
            if (Categoria.Categoria == '1') { document.getElementById("Cat1CentroEventual").checked = true; }
            else if (Categoria.Categoria == '2') { document.getElementById("Cat2CentroEventual").checked = true; }
            else { document.getElementById("Cat3CentroEventual").checked = true; }
            OperacionesTabla(5, Proyecciones[IndiceProyeccion].MarcadoresCollecion[BuscarIndice(Proyecciones[IndiceProyeccion].MarcadoresCollecion, Marcador.tittle, 2, false)].Horas);
            ContenedorTipo = "Marcador";            
            document.getElementById('ContenedorEmergente').style.left  = Math.abs(($('#ContenedorEmergente').width()/2)-event.pixel.x)+"px";
            document.getElementById('ContenedorEmergente').style.top = event.pixel.y+"px";
            $("#ContenedorEmergente").show(1000);

        });

        google.maps.event.addListener(Marcador, 'dragstart', function (event) 
        {
            $("#ContenedorEmergente").hide(300);
            MapaCanvas.setOptions({ draggable: false });
        });

        google.maps.event.addListener(Marcador, 'dragend', function (event) 
        {

            MapaCanvas.setOptions({ draggable: true });

            if(SwitchActivo('switchtiemporeal'))
            {

                if(Proyecciones[ProyeccionActiva].ElipseDibujada == true) 
                {
                    if (SwitchActivo('switchcentroseventuales') == true) OcultarMostrar_CentrosDeCargaEventuales(1, ProyeccionActiva, MapaCanvas);
                    else OcultarMostrar_CentrosDeCargaEventuales(1, ProyeccionActiva, null);            
                    if (Proyecciones[ProyeccionActiva].ElipseDibujada == true) { CentrosEventualesDeCarga(1, BuscarProyeccionMarcador(Marcador.tittle)); }
                    if (MostrarTodasProyecciones == true) { DetectarInterseccion(1); }                    
                    if (Proyecciones[ProyeccionActiva].ElipseDibujada) { MapaAImagen(ProyeccionActiva, 0); }            
                }                    
                    UltimoIndiceMarcador = BuscarIndice(Proyecciones[ProyeccionActiva].MarcadoresCollecion, Marcador.tittle, 2);
                    
            }
            if(SwitchActivo('switchcentroseventuales') == false)
            {
                    OcultarMostrar_CentrosDeCargaEventuales(1,ProyeccionActiva,null);
            }

            if(SwitchActivo('switchelipse') == false)
            {
                OcultarMostrar_Elipses(1,ProyeccionActiva,null);
            }
            $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + Marcador.getPosition().lat() + ",+" + Marcador.getPosition().lng() + "&key=AIzaSyAt-2vlOp9uyOc8vvUlLi7TiJur1Lix-vQ", GeolocalizacionDrag);
        });


        google.maps.event.addListener(Marcador, 'drag', function (event) {

            Referencia = Marcador;
            var ProyeccionMarcador = BuscarProyeccionMarcador(Marcador.tittle);
            var MarcadorObjeto = BuscarIndice(Proyecciones[ProyeccionMarcador].MarcadoresCollecion, Marcador.tittle, 1);
            if ((((RetornarCordenada(Marcador).x)) > 0) && (((RetornarCordenada(Marcador).x)) < (MapaCanvas.getDiv().offsetWidth))) 
            {
                MarcadorObjeto.X = ((RetornarCordenada(Marcador).x));
                MarcadorObjeto.XEscala = RetornarCordenada(Marcador).x * EscalaMapaX;
            }
            if ((((RetornarCordenada(Marcador).y)) > 0) && (((RetornarCordenada(Marcador).y)) < (Altura))) 
            {
                MarcadorObjeto.Y = ((Math.abs((RetornarCordenada(Marcador).y) - Altura)));
                MarcadorObjeto.YEscala = Math.abs((RetornarCordenada(Marcador).y) - Altura) * EscalaMapaY;
            }
            
            if (SwitchActivo('switchtiemporeal') == true & Proyecciones[ProyeccionMarcador].ElipseDibujada == true) 
            {
                CentrosEventualesDeCarga(2, ProyeccionMarcador);
            }
            if(BordesRectanguloMarcador.contains(Marcador.getPosition()) == false) 
            {
                Marcador.setPosition(UltimoCentroMarcador)  
            }  
            else
            {
                UltimoCentroMarcador = Marcador.getPosition();
            }
            if (MostrarTodasProyecciones == true) { DetectarInterseccion(0); }            
            if(SwitchActivo('switchelipse') == false){ OcultarMostrar_Elipses(1,ProyeccionActiva,null);}
        });           
    }
    else 
    {
        $.Notification.autoHideNotify('error', 'top right', 'No more than 10 charges can be placed.')                                                
    }
    //ActualizarLeyenda();
}


/* Permite ver los consumidores por categoria */
function VerConsumidores(Estado) 
{
    if (Estado == true) {
        MostrarConsumidores(UltimoCentro, MapaCanvas);
        for (var I = 0; I < PinConsumidores.length; I++) {
            PinConsumidores[I].Posicion.setMap(MapaCanvas);
        }
    }
    else {
        for (var I = 0; I < PinConsumidores.length; I++) {
            PinConsumidores[I].Posicion.setMap(null);

        }
    }
}


/* Muestra en pantalla todos los consumidores por su categoria*/
function MostrarConsumidores(Coordenadas, MapaCanvas) {
    VentanaInformacion = new google.maps.InfoWindow({ content: '' });
    var Servicio = new google.maps.places.PlacesService(MapaCanvas);
    var Tipos = ['accounting', 'airport', 'amusement_park', 'aquarium', 'art_gallery', 'atm', 'bakery', 'bank', 'bar', 'beauty_salon', 'bicycle_store', 'book_store', 'bowling_alley', 'bus_station', 'cafe', 'campground', 'car_dealer', 'car_rental', 'car_repair', 'car_wash', 'casino', 'cemetery', 'church', 'city_hall', 'clothing_store', 'convenience_store', 'courthouse', 'dentist', 'department_store', 'doctor', 'electrician', 'electronics_store', 'embassy', 'fire_station', 'florist', 'funeral_home', 'furniture_store', 'gas_station', 'gym', 'hair_care', 'hardware_store', 'hindu_temple', 'home_goods_store', 'hospital', 'insurance_agency', 'jewelry_store', 'laundry', 'lawyer', 'library', 'liquor_store', 'local_government_office', 'locksmith', 'lodging', 'meal_delivery', 'meal_takeaway', 'mosque', 'movie_rental', 'movie_theater', 'moving_company', 'museum', 'night_club', 'painter', 'park', 'parking', 'pet_store', 'pharmacy', 'physiotherapist', 'plumber', 'police', 'post_office', 'real_estate_agency', 'restaurant', 'roofing_contractor', 'rv_park', 'school', 'shoe_store', 'shopping_mall', 'spa', 'stadium', 'storage', 'store', 'subway_station', 'synagogue', 'taxi_stand', 'train_station', 'transit_station', 'travel_agency', 'university', 'veterinary_care', 'zoo'];
    //var Tipos = ['hospital','school','university','airport','local_government_office','bank','store','pharmacy','restaurant'];


    var PinesCategoria = ['https://k60.kn3.net/A/B/1/4/6/2/630.png', 'https://k61.kn3.net/5/1/5/F/8/B/19F.png', 'https://k60.kn3.net/D/9/7/A/5/F/A3F.png'];
    for (I = 0; I < Tipos.length; I++) {
        Servicio.nearbySearch({
            location: UltimoCentro,
            radius: ZoomMinimo * 250,
            types: [Tipos[I]]
        }, EstadoBusqueda);
    }

    function EstadoBusqueda(Resultado, Estado) {
        if (Estado === google.maps.places.PlacesServiceStatus.OK) {
            for (var I = 0; I < Resultado.length; I++) {
                CrearMarcador(Resultado[I]);
            }
        }
    }

    function CrearMarcador(Lugar) {
        switch (Lugar.types[0]) {
            // Primera Categoria
            case 'hospital':
            case 'airport':
                TipoDeIcono = PinesCategoria[0];
                Lugar.Categoria = '1';
                break;

            // Segunda categoria
            case 'local_government_office':
            case 'bank':
            case 'doctor':
            case 'fire_station':
            case 'university':
            case 'insurance_agency':
            case 'amusement_park':
                TipoDeIcono = PinesCategoria[1];
                Lugar.Categoria = '2';
                break;

            // Tercera Categoria
            default:
                TipoDeIcono = PinesCategoria[2];
                Lugar.Categoria = '3';
        }

        var LugarMarcador = new google.maps.Marker(
            {
                map: MapaCanvas,
                icon: TipoDeIcono,
                position: Lugar.geometry.location,
                Informacion: Lugar
            });
        if (OpcionesGlobales[0].MostrarPinCiudad == false) { MarcadorCiudad.setMap(null); }
        PinConsumidores.push({ Posicion: LugarMarcador, Tipo: Lugar.types[0] });
        google.maps.event.addListener(LugarMarcador, 'mouseover', function () {
            var CadenaHTML = '<strong style="  text-align: center;">Location: </strong>' + Lugar.name + '<br><strong>Address: </strong>' + Lugar.vicinity + '<br><strong>Latitude: </strong>' + Lugar.geometry.location.lat() + '<br><strong>Longitude: </strong>' + Lugar.geometry.location.lng() + '<br><strong>Category : </strong>' + Lugar.Categoria;
            VentanaInformacion = new google.maps.InfoWindow
                ({
                    content: CadenaHTML
                });
            VentanaInformacion.open(MapaCanvas, this);

        });

        google.maps.event.addListener(LugarMarcador, 'mouseout', function () {
            VentanaInformacion.close();
        });


    }
}

// Borra la elipse y los 24 centros de carga //
function OcultarMostrar_CentrosDeCargaEventuales(Parametro, Proyeccion_Marcador, Mapa) {
    if (Parametro == 1) {
        if (Proyecciones[Proyeccion_Marcador].CentrosEventuales != null) {
            for (var I = 0; I < Proyecciones[Proyeccion_Marcador].CentrosEventuales.length; I++) {
                Proyecciones[Proyeccion_Marcador].CentrosEventuales[I].MarcadorCentroEventual.setMap(Mapa);
            }
        }
    }
    else if (Parametro == 2) {
        for (var I = 0; I < Proyecciones.length; I++) {
            for (var J = 0; J < Proyecciones[I].CentrosEventuales.length; J++) {
                Proyecciones[I].CentrosEventuales[J].MarcadorCentroEventual.setMap(Mapa);
            }
        }
    }
}

function OcultarMostrar_Elipses(Parametro, ProyeccionNumero, Mapa) {
    if (Parametro == 1) {
        try { Proyecciones[ProyeccionNumero].Elipse.setMap(Mapa); Proyecciones[ProyeccionNumero].Centro.setMap(Mapa); } catch (Error) { }
        if (PoligonoInterseccion != null) { PoligonoInterseccion.setMap(null); CentroInterseccion.setMap(null); }

    }
    else if (Parametro == 2) {
        for (var I = 0; I < Proyecciones.length; I++) {
            try { Proyecciones[I].Elipse.setMap(Mapa); Proyecciones[I].Centro.setMap(Mapa); } catch (Error) { }
        }
        if (PoligonoInterseccion != null) { PoligonoInterseccion.setMap(null); CentroInterseccion.setMap(null); }
    }
}

function OcultarMostrar_Cargas(Parametro, ProyeccionNumero, Mapa) {
    if (Proyecciones[ProyeccionNumero].MarcadoresCollecion != null) {
        if (Parametro == 1) {
            for (var I = 0; I < Proyecciones[ProyeccionNumero].MarcadoresCollecion.length; I++) {
                Proyecciones[ProyeccionNumero].MarcadoresCollecion[I].Marcador.setMap(Mapa);
            }
        }
        else if (Parametro == 2) {
            for (var I = 0; I < Proyecciones.length; I++) {
                for (var J = 0; J < Proyecciones[I].MarcadoresCollecion.length; J++) {
                    Proyecciones[I].MarcadoresCollecion[J].Marcador.setMap(Mapa);
                }
            }
        }
    }
}



function Reiniciar() {
    OcultarMostrar_Cargas(2, ProyeccionActiva, null);
    OcultarMostrar_Elipses(2, ProyeccionActiva, null);
    OcultarMostrar_CentrosDeCargaEventuales(2, ProyeccionActiva, null);
    for (I = 0; I < Proyecciones.length; I++) {
        Proyecciones[I].MarcadoresCollecion = new Array();
        Proyecciones[I].CentrosEventuales = new Array();
        Proyecciones[I].Elipse = null;
        Proyecciones[I].ElipseDibujada = false;
        Proyecciones[I].Centro = null;
        Proyecciones[I].EspaciosDeTrabajo = new Array();
        Proyecciones[I].ElipseDibujada = null;        
        Proyecciones[I].Contador = 1;
        Proyecciones[ProyeccionActiva].EspacioTrabajoContador = 0;
        if(CentroInterseccion != null) { CentroInterseccion.setMap(null);}
        if(PoligonoInterseccion != null){PoligonoInterseccion.setMap(null);}
        Espacio = "";
    }
    //document.querySelector('#TablaUsuarios #Cuerpo').innerHTML = "";
    DelimitarBordes('2');
    for (var i = 0; i < PinConsumidores.length; i++) 
    {
        PinConsumidores[i].location.setMap(null);
    }
    $.Notification.autoHideNotify('success', 'top right', 'Everything has been restarted.')                                               
}




/* Sección de funciones que hacen cambios en el contenedor */

/*Actualiza el Icono del indicador del marcador  de acuerdo a la categoria*/
function ActualizarCategoriaMarcador(Parametro) {
    (typeof Referencia == 'string') ? (Referencia = Referencia) : (Referencia = Referencia.tittle)
    var Marcador = BuscarIndice(Proyecciones[ProyeccionActiva].MarcadoresCollecion, Referencia, 1);
    Marcador.Categoria = Parametro;
    Marcador.Horas = OperacionesTabla(1, null);    

}

/* Guarda los cambios de las potencias  del centro eventual de carga */
function GuardarCambiosContenedor() 
{
    (typeof Referencia == 'string') ? (Referencia = Referencia) : (Referencia = Referencia.tittle)
    var ReferenciaMarcador = BuscarIndice(Proyecciones[ProyeccionActiva].MarcadoresCollecion, Referencia, 1);
    var CoordenadaTexto = document.getElementById("ccoordenadas").value;

    var Puntos = CoordenadaTexto.split(",");
    if (Puntos.length == 2) {
        if (isNaN(Puntos[0]) == false && isNaN(Puntos[1]) == false) 
        {
            Puntos[0] = parseInt(Puntos[0].replace(/\s/g, ''));
            Puntos[1] = Math.abs(parseInt(Puntos[1].replace(/\s/g, '')) - Altura);
            Referencia.X = Puntos[0];
            Referencia.Y = Puntos[1];
            ReferenciaMarcador.XEscala = (RetornarCordenada(ReferenciaMarcador.Marcador).x) * EscalaMapaX;
            ReferenciaMarcador.YEscala = Math.abs((RetornarCordenada(ReferenciaMarcador.Marcador).y) - Altura) * EscalaMapaY;
            ReferenciaMarcador.Horas = OperacionesTabla(1, null);
            if ((Puntos[0] > 0 & Puntos[0] < MapaCanvas.getDiv().offsetWidth) & (Puntos[1] > 0 & Puntos[1] < MapaCanvas.getDiv().offsetHeight)) {
                $.Notification.autoHideNotify('success', 'top right', 'The coordinates of the marker have been updated.');
                ReferenciaMarcador.Marcador.setPosition(Coordenadas_Cartesianas_APunto({ x: Puntos[0], y: Puntos[1] }));
                if (Proyecciones[Proyecciones].ElipseDibujada) { CentrosEventualesDeCarga(1, ProyeccionActiva); }
                if (MostrarTodasProyecciones) { DetectarInterseccion(1); }
                MapaAImagen(ProyeccionActiva, 0);

            }
            else {
                $.Notification.autoHideNotify('warning', 'top right', 'The coordinates exceed the size of the map.');
            }
        }
        else {
            
            $.Notification.autoHideNotify('error', 'top right', 'The entry is not valid.');

        }
    }
    else {
        $.Notification.autoHideNotify('error', 'top right', 'The entry is not valid.');
    }    
}


/* Sección de funciones complementarias para las funciones del mapa */
/* Retorna las Coordeandas de un marcador en especifico */
function RetornarCordenada(Marcador, Parametro) {
    Parametro = Parametro || 0;
    if (Parametro == 0) 
    {        
            var CoordenadaMarcador = Proyeccion.fromLatLngToPoint(Marcador.getPosition());
            var CoordenadaFinal = new google.maps.Point(Math.floor((CoordenadaMarcador.x - CoordenadaMundo.x) * Escala),
            (Math.floor((CoordenadaMarcador.y - CoordenadaMundo.y) * Escala)));
            return CoordenadaFinal;        
    }
    else 
    {
        var CoordenadaMarcador = Proyeccion.fromLatLngToPoint(Marcador);
        var CoordenadaFinal = new google.maps.Point(
            Math.floor((CoordenadaMarcador.x - CoordenadaMundo.x) * Escala),
            (Math.floor((CoordenadaMarcador.y - CoordenadaMundo.y) * Escala)));
        return CoordenadaFinal;
    }
}

/* Convierte las coordenadas en formato cartesiano a un punto */
function Coordenadas_Cartesianas_APunto(Cartesiano) 
{    
        try 
        {
            var Noroeste = MapaCanvas.getProjection().fromLatLngToPoint(Bordes.getNorthEast());
            var SurEste = MapaCanvas.getProjection().fromLatLngToPoint(Bordes.getSouthWest());
            var Escala = Math.pow(2, ZoomMinimo);
            var CoordenadasEsfericas = new google.maps.Point(Cartesiano.x / Escala + SurEste.x, Cartesiano.y / Escala + Noroeste.y);
            return MapaCanvas.getProjection().fromPointToLatLng(CoordenadasEsfericas);
        }
        catch (Excepcion) 
        {
            var Noroeste = MapaCanvas.getProjection().fromLatLngToPoint(MapaCanvas.getBounds().getNorthEast());
            var SurEste = MapaCanvas.getProjection().fromLatLngToPoint(MapaCanvas.getBounds().getSouthWest());
            var Escala = Math.pow(2, MapaCanvas.getZoom());
            var CoordenadasEsfericas = new google.maps.Point(Cartesiano.x / Escala + SurEste.x, Cartesiano.y / Escala + Noroeste.y);
            return MapaCanvas.getProjection().fromPointToLatLng(CoordenadasEsfericas);        
        }
}

/* Genera potencias aleatorias para que funcione el algoritmo */
function PotenciasAleatorios()
{    
    for (var I = 0; I <= (Proyecciones[ProyeccionActiva].MarcadoresCollecion.length) - 1; I++)
    {
        for (var J = 0; J <= 23; J++)
        {
            Proyecciones[ProyeccionActiva].MarcadoresCollecion[I].Horas[J] = Math.floor(Math.random() * 100) + 1
        }
    }
}
 

// Devuelve el indice de la proyección en la que esta un marcador //
function BuscarProyeccionMarcador(TituloMarcador) {
    for (I = 0; I < Proyecciones.length; I++) {
        for (J = 0; J < Proyecciones[I].MarcadoresCollecion.length; J++) {
            if (Proyecciones[I].MarcadoresCollecion[J].Titulo === TituloMarcador) {
                return I;
            }
        }
    }
}


/* Esta funciòn devuelve el objeto de un marcador con toda su informaciòn (Potencias , Categoria Etc.) o su posiciòn */
function BuscarIndice(Arreglo, Valor, Parametro) {
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





/*Sección de funciones relativas a las tablas 
		/*Actualiza  la tabla con los nuevos datos de los marcadores */
function ActualizarTabla()
{
    var Tabla = document.getElementById('cuerpotablaconsumidores');
    Tabla.innerHTML = "";
    ArregloConsumidores = DevolverTablaConsumidores(ProyeccionActiva);
    for (var I = 0; I < ArregloConsumidores.length; I++) {
        var Fila = Tabla.insertRow(Tabla.getElementsByTagName("tr").length);
        var Celda0 = Fila.insertCell(0);
        var Celda1 = Fila.insertCell(1);
        var Celda2 = Fila.insertCell(2);
        var Celda3 = Fila.insertCell(3);
        var Celda4 = Fila.insertCell(4);
        var Celda5 = Fila.insertCell(5);
        var Celda6 = Fila.insertCell(6);

        Celda0.innerHTML = ArregloConsumidores[I][0];
        if(ArregloConsumidores[I][1] == "1")
        {
            Celda1.innerHTML = '<span class="label label-table label-inverse">Category: '+ArregloConsumidores[I][1]+'</span>'    
        }
        else if (ArregloConsumidores[I][1] == "2")
        {
            Celda1.innerHTML = '<span class="label label-table label-primary">Category: '+ArregloConsumidores[I][1]+'</span>'
        }
        else if (ArregloConsumidores[I][1] == "3")
        {
            Celda1.innerHTML = '<span class="label label-table label-warning">Category: '+ArregloConsumidores[I][1]+'</span>'
        }
        else
        {
            Celda1.innerHTML  = '?';   
        }

        Celda2.innerHTML = (ArregloConsumidores[I][2]);
        Celda3.innerHTML = (ArregloConsumidores[I][3]);
        if (ProyeccionActiva != 3) {
            if (isNaN(ArregloConsumidores[I][4]) == false) { Celda4.innerHTML = (ArregloConsumidores[I][4]).toFixed(4); }
            else { Celda4.innerHTML = (ArregloConsumidores[I][4]); }

            if (isNaN(ArregloConsumidores[I][5]) == false) { Celda5.innerHTML = Math.trunc(ArregloConsumidores[I][5]).toFixed(4); }
            else { Celda5.innerHTML = (ArregloConsumidores[I][5]); }
            Celda6.innerHTML = '<button type="button" class="btn btn-googleplus waves-effect waves-light ui-btn ui-shadow ui-corner-all" onclick="VerMarcadorMapa(\'' + ArregloConsumidores[I][0] + '\')"><i class="fa fa-map-marker"></i></button>' 
        }
        else
        {
            Celda4.innerHTML = "?";
            Celda5.innerHTML = "?";
            Celda6.innerHTML = "?";
        }
    }
}


function ActualizarTablaCentrosEventuales() {
    MostrarOcultarContenedor('containermapa');
    Activo = "containermapa";
    var Tabla = document.getElementById('cuerpotablacentroseventuales');
    Tabla.innerHTML = "";
    ArregloConsumidores = DevolvertablaCentrosEventuales(ProyeccionActiva);
    for (var I = 0; I < ArregloConsumidores.length; I++) {
        var Fila = Tabla.insertRow(Tabla.getElementsByTagName("tr").length);
        var Celda0 = Fila.insertCell(0);
        var Celda1 = Fila.insertCell(1);
        var Celda2 = Fila.insertCell(2);
        var Celda3 = Fila.insertCell(3);
        var Celda4 = Fila.insertCell(4);
        var Celda5 = Fila.insertCell(5);

        Celda0.innerHTML = (ArregloConsumidores[I][0]);
        Celda1.innerHTML = Math.trunc(ArregloConsumidores[I][1]);
        Celda2.innerHTML = Math.trunc(ArregloConsumidores[I][2]);
        if (ProyeccionActiva != 3) {
            Celda3.innerHTML = (ArregloConsumidores[I][3]).toFixed(6);
            Celda4.innerHTML = (ArregloConsumidores[I][4]).toFixed(6);
            Celda5.innerHTML = ' <button type="button" class="btn btn-dropbox waves-effect waves-light ui-btn ui-shadow ui-corner-all" onclick="VerMarcadorCentroEventualMapa(\'' + ArregloConsumidores[I][0] + '\')"><i class="fa fa-map-marker"></i></button>';

        }
        else
        {
            Celda3.innerHTML = "?";
            Celda4.innerHTML = "?";
            Celda5.innerHTML = "?";
        }
    }
}



function ActualizarTablaPotencias() {
    var Tabla = document.getElementById('tablapotenicas24');
    Tabla.innerHTML = "";
    for (var I = 0; I <= 23; I++) 
    {
        ArregloConsumidores = DevolverFilasArreglo(I, ProyeccionActiva)
        var Fila = Tabla.insertRow(Tabla.getElementsByTagName("tr").length);
        var Celda0 = Fila.insertCell(0);
        var Celda1 = Fila.insertCell(1);
        var Celda2 = Fila.insertCell(2);
        var Celda3 = Fila.insertCell(3);
        var Celda4 = Fila.insertCell(4);
        var Celda5 = Fila.insertCell(5);
        var Celda6 = Fila.insertCell(6);
        var Celda7 = Fila.insertCell(7);
        var Celda8 = Fila.insertCell(8);
        var Celda9 = Fila.insertCell(9);
        var Celda10 = Fila.insertCell(10);
        var Celda11 = Fila.insertCell(11);
        var Celda12 = Fila.insertCell(12);
        var Celda13 = Fila.insertCell(13);
        var Celda14 = Fila.insertCell(14);
        


        Celda0.innerHTML = (ArregloConsumidores[0]);
        Celda1.innerHTML = (ArregloConsumidores[1]);
        Celda2.innerHTML = (ArregloConsumidores[2]);
        Celda3.innerHTML = (ArregloConsumidores[3]);
        Celda4.innerHTML = (ArregloConsumidores[4]);
        Celda5.innerHTML = (ArregloConsumidores[5]);
        Celda6.innerHTML = (ArregloConsumidores[6]);
        Celda7.innerHTML = (ArregloConsumidores[7]);
        Celda8.innerHTML = (ArregloConsumidores[8]);                
        Celda9.innerHTML = (ArregloConsumidores[9]);                
        Celda10.innerHTML = '<td><span class="label label-table label-success">'+(ArregloConsumidores[10])+'</span></td>';
        Celda11.innerHTML = '<td><span class="label label-table label-primary">'+(ArregloConsumidores[11])+'</span></td>';
        Celda12.innerHTML = '<td><span class="label label-table label-inverse">'+(ArregloConsumidores[12])+'</span></td>';
        Celda13.innerHTML = '<td><span class="label label-table label-default">'+(ArregloConsumidores[13])+'</span></td>';        
        Celda14.innerHTML = '<td><span class="label label-table label-default">'+(ArregloConsumidores[14])+'</span></td>';        
    }
}


/* Operaciones de la tablas de potencia del contenedor */
function OperacionesTabla(Caso, Arreglo) 
{
    var Potencias = []
    /*Lectura de las potencias */
    if (Caso == 1) {
        for (var I = 0; I <= 23; I++) {
            Potencias[I] = document.getElementById('tablapotencias').rows[1].cells[I].innerHTML;
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

            document.getElementById('tablapotencias').rows[1].cells[I].innerHTML = Arreglo[I];
        }
    }
}

function ActualizarTablaEspaciosDeTrabajo() 
{
    Tabla = document.getElementById('cuerpoEspacioTrabajo');
    Tabla.innerHTML = "";

    for (I = 0; I < Proyecciones[ProyeccionActiva].EspaciosDeTrabajo.length; I++) 
    {
        var Fila = Tabla.insertRow(Tabla.getElementsByTagName("tr").length);
        var Celda1 = Fila.insertCell(0);
        var Celda2 = Fila.insertCell(1);
        Celda1.innerHTML = Proyecciones[ProyeccionActiva].EspaciosDeTrabajo[I].Identificador;
        Celda2.innerHTML = '<button  type="button" class="btn btn-icon waves-effect btn-primary waves-light" onclick="RestaurarEspaciosDeTrabajo(' + (Alfabeto.indexOf(Proyecciones[ProyeccionActiva].EspaciosDeTrabajo[I].Identificador))+' )"> <i class="fa fa-map"></i></button>'
    }
}



function VerMarcadorMapa(Consumidor) 
{
    MostrarOcultarContenedor('containermapa');
    Activo = "containermapa";
    Consumidor = Consumidor.toUpperCase();
    var InstanciaMarcador = BuscarIndice(Proyecciones[ProyeccionActiva].MarcadoresCollecion, Consumidor, 1);
    if (InstanciaMarcador != null) {
        InstanciaMarcador.Marcador.setAnimation(google.maps.Animation.BOUNCE);
        var Detener = setTimeout(Animacion, 6000);
        function Animacion() {
            InstanciaMarcador.Marcador.setAnimation(google.maps.Animation.null);
        }
    }
    else {
        $.Notification.autoHideNotify('error', 'top right', "You can't see the marker on the map because it doesn't exist yet");                                                ;
    }
}



function VerMarcadorCentroEventualMapa(CentroEventual) {

    MostrarOcultarContenedor('containermapa');
    Activo = "containermapa";
    var CentroEventualMarcador = Proyecciones[ProyeccionActiva].CentrosEventuales[parseInt(CentroEventual) - 1].MarcadorCentroEventual;
    CentroEventualMarcador.setAnimation(google.maps.Animation.BOUNCE);
    var Detener = setTimeout(Animacion, 6000);

    function Animacion() 
    {
        CentroEventualMarcador.setAnimation(google.maps.Animation.null);
    }

}

function ActualizarLeyenda() {
    var Fecha = new Date();
    LeyendaItem = [];
    if (MostrarTodasProyecciones == false) {
        if (Proyecciones[ProyeccionActiva].ElipseDibujada == true) {
            if (Proyecciones[ProyeccionActiva].Opciones.MostrarElipse)
                if (ProyeccionActiva == 0) {
                    LeyendaItem.push({ Nombre: 'Ellipse (' + Fecha.getFullYear() + ')', Icono: "https://k60.kn3.net/2/7/F/E/2/3/DEF.png" });
                }
                else if (ProyeccionActiva == 1) {
                    LeyendaItem.push({ Nombre: 'Ellipse (' + (Fecha.getFullYear() + 10) + ')', Icono: "https://k60.kn3.net/E/2/F/1/4/4/7D6.png" });
                }
                else {
                    LeyendaItem.push({ Nombre: 'Ellipse (' + (Fecha.getFullYear() + 20) + ')', Icono: "https://k60.kn3.net/9/8/7/D/9/E/2A1.png" });
                }
        }
        if (Proyecciones[ProyeccionActiva].Opciones.MostrarCentrosEventuales && Proyecciones[ProyeccionActiva].ElipseDibujada) {
            LeyendaItem.push({ Nombre: 'Eventual Center (P' + (ProyeccionActiva + 1) + ')', Icono: "https://k61.kn3.net/5/0/2/8/4/C/383.png" });
        }
        if (Proyecciones[ProyeccionActiva].Opciones.MostrarElipse && Proyecciones[ProyeccionActiva].ElipseDibujada) {
            LeyendaItem.push({ Nombre: 'Electric Substation (P' + (ProyeccionActiva + 1) + ')', Icono: URLCentroElipse(ProyeccionActiva) });
        }
        if (Proyecciones[ProyeccionActiva].Opciones.MostrarConsumidores) {
            if (ProyeccionActiva == 0) {
                LeyendaItem.push({ Nombre: 'Consumer (P1)', Icono: DevolverURLMarcador("A1") });
            }
            else if (ProyeccionActiva == 1) {
                LeyendaItem.push({ Nombre: 'Consumer (P2)', Icono: DevolverURLMarcador("A2") });
            }
            else {
                LeyendaItem.push({ Nombre: 'Consumer (P3)', Icono: DevolverURLMarcador("A3") });
            }
        }
    }
    else {
        for (I = 0; I <= 2; I++) {
            if (OpcionesGlobales[0].TodasElipses == true) {
                if (Proyecciones[I].Opciones.MostrarElipse) {

                    if (Proyecciones[I].ElipseDibujada == true) {
                        if (I == 0) {
                            LeyendaItem.push({ Nombre: 'Ellipse (' + Fecha.getFullYear() + ')', Icono: "https://k60.kn3.net/2/7/F/E/2/3/DEF.png" });
                        }
                        else if (I == 1) {
                            LeyendaItem.push({ Nombre: 'Ellipse (' + (Fecha.getFullYear() + 10) + ')', Icono: "https://k60.kn3.net/E/2/F/1/4/4/7D6.png" });
                        }
                        else {
                            LeyendaItem.push({ Nombre: 'Ellipse (' + (Fecha.getFullYear() + 20) + ')', Icono: "https://k60.kn3.net/9/8/7/D/9/E/2A1.png" });
                        }
                    }
                }
            }
        }
        if (OpcionesGlobales[0].TodosCentrosCarga == true) {
            LeyendaItem.push({ Nombre: 'Consumer (P1)', Icono: DevolverURLMarcador("A1") });
            LeyendaItem.push({ Nombre: 'Consumer (P2)', Icono: DevolverURLMarcador("A2") });
            LeyendaItem.push({ Nombre: 'Consumer (P3)', Icono: DevolverURLMarcador("A3") });
        }
        else if (OpcionesGlobales[0].TodosCentrosEventuales) {
            LeyendaItem.push({ Nombre: 'Eventual centres', Icono: "https://k61.kn3.net/5/0/2/8/4/C/383.png" });
        }
        if (!(OpcionesGlobales[0].TodosCentrosCarga == true || OpcionesGlobales[0].TodosCentrosEventuales == true)) {
            if (OpcionesGlobales[0].TodasElipses == true) {
                if (CentroInterseccion != null) {
                    LeyendaItem.push({ Nombre: 'Intersection', Icono: "https://k61.kn3.net/7/E/D/B/0/0/E14.png" });
                    LeyendaItem.push({ Nombre: 'Optimum Center', Icono: URLCentroElipse(3) });
                }
            }
        }
    }

   Leyenda.innerHTML = "";
    LeyendaItem.forEach(function (Item) {
        var Div = document.createElement('div');
        Div.innerHTML = '<img src="' + Item.Icono + '"> ' + '<h1>' + Item.Nombre + '</h1>';
        Leyenda.appendChild(Div);
    });

    if (OpcionesGlobales[0].MostrarLeyenda) {
        Leyenda.style.display = 'inline-block';
    }
    else {
        Leyenda.style.display = 'none';
    }
}



function UbicarPinPrueba() {
    MarcadorPruebas = new google.maps.Marker
        ({
            position: MapaCanvas.getCenter(),
            draggable: true,
            map: MapaCanvas,
            animation: google.maps.Animation.DROP,
            tittle: Alfabeto[Proyecciones[ProyeccionActiva].Contador - 1] + (ProyeccionActiva + 1).toString(),
            icon: 'https://k61.kn3.net/E/1/F/0/E/5/524.png'
        });

    google.maps.event.addListener(MarcadorPruebas, 'drag', function (event) {
        document.getElementById('LatitudMP').innerHTML = "Latitude: " + MarcadorPruebas.getPosition().lat();
        document.getElementById('LongitudMP').innerHTML = "Longitude: " + MarcadorPruebas.getPosition().lng();
        var Punto = RetornarCordenada(MarcadorPruebas, 0);
        //document.getElementById("XYMP").innerHTML = 'Coordenadas : ' + Punto.x + " , " + Math.abs((Punto.y - Altura));
        document.getElementById("XMP").innerHTML = "X: " + Punto.x;
        document.getElementById("YMP").innerHTML = "Y: " + Math.abs((Punto.y - Altura));
        document.getElementById("IntersectaP1MP").innerHTML = 'Intersect With ellipse P1 : ' + PuntoDentroPoligono(MarcadorPruebas.getPosition(), Proyecciones[0].Elipse);
        document.getElementById("IntersectaP2MP").innerHTML = 'Intersect With ellipse P2 : ' + PuntoDentroPoligono(MarcadorPruebas.getPosition(), Proyecciones[1].Elipse);
        document.getElementById("IntersectaP3MP").innerHTML = 'Intersect With ellipse P3 : ' + PuntoDentroPoligono(MarcadorPruebas.getPosition(), Proyecciones[2].Elipse);
        if (MostrarTodasProyecciones == false) {
            document.getElementById("OptimaMP").innerHTML = 'You are in an optimal area : ' + PuntoDentroPoligono(MarcadorPruebas.getPosition(), Proyecciones[ProyeccionActiva].Elipse);
        }
        else {
            if (SegundaProyeccionActivada == false) {
                document.getElementById("OptimaMP").innerHTML = 'You are in an optimal area : ' + PuntoDentroPoligono(MarcadorPruebas.getPosition(), Proyecciones[ProyeccionActiva].Elipse);
            }
            else if (SegundaProyeccionActivada == true && TerceraProyeccionActivada == false) {
                if (PuntoDentroPoligono(MarcadorPruebas.getPosition(), Proyecciones[0].Elipse) == "Si" && PuntoDentroPoligono(MarcadorPruebas.getPosition(), Proyecciones[1].Elipse) == "Si") {
                    document.getElementById("OptimaMP").innerHTML = 'You are in an optimal area : Yes';
                }
                else {
                    document.getElementById("OptimaMP").innerHTML = 'You are in an optimal area : No';
                }
            }
            else {
                if (PuntoDentroPoligono(MarcadorPruebas.getPosition(), Proyecciones[0].Elipse) == "Si" && PuntoDentroPoligono(MarcadorPruebas.getPosition(), Proyecciones[1].Elipse) == "Si" && PuntoDentroPoligono(MarcadorPruebas.getPosition(), Proyecciones[2].Elipse)) {
                    document.getElementById("OptimaMP").innerHTML = 'You are in an optimal area : Yes';
                }
                else {
                    document.getElementById("OptimaMP").innerHTML = 'You are in an optimal area : Yes';
                }
            }
        }
    });
}



function ActualizarInformacionProyeccionActual() 
{
    document.getElementById('CMapaLatitud').innerHTML = 'Center of the map (Latitude) :' +MapaCanvas.getCenter().lat();     
    document.getElementById('CMapaLongitud').innerHTML = 'Centre of the map (Longitude) :' +MapaCanvas.getCenter().lng();         
    var Punto = RetornarCordenada(MapaCanvas.getCenter(),1);
    document.getElementById('CMapaCentroX').innerHTML = 'Center of the map (Cx) : ' +Punto.x;
    document.getElementById('CMapaCentroY').innerHTML = 'Center of the map (Cy) : ' +Punto.y;    
    if(Proyecciones[ProyeccionActiva].Elipse != null)
    {
        document.getElementById('CElipseLatitud').innerHTML = 'Center ellipse (Latitude) : '+ Proyecciones[ProyeccionActiva].Centro.getPosition().lat();
        document.getElementById('CElipseLongitud').innerHTML = 'Center ellipse (Longitude) : '+ Proyecciones[ProyeccionActiva].Centro.getPosition().lng();
        var Punto = RetornarCordenada(Proyecciones[ProyeccionActiva].Centro);
        document.getElementById('CElipseX').innerHTML = 'Center Ellipse (Cx) : '+ Punto.x;
        document.getElementById('CElipseY').innerHTML = 'Center Ellipse (Cy) : ' +Punto.y;
        document.getElementById('CElipseArea').innerHTML = 'Area Ellipse  : ' +google.maps.geometry.spherical.computeArea(Proyecciones[ProyeccionActiva].Elipse.getPath()) + " Metros Cuadrados";
    }  
    else
    {
        document.getElementById('CElipseLatitud').innerHTML = 'Center Ellipse (Latitud) : ?'
        document.getElementById('CElipseLongitud').innerHTML = 'Center Ellipse (Longitud) :  ?'         
        document.getElementById('CElipseX').innerHTML = 'Center Ellipse (Cx) : ?' 
        document.getElementById('CElipseY').innerHTML = 'Center Ellipse (Cy) : ?' 
        document.getElementById('CElipseArea').innerHTML = 'Area Ellipse  : ?' 
    }
     document.getElementById('CEscala').innerHTML = 'Scale X : '+EscalaMapaX;    
     document.getElementById('CEscalaY').innerHTML = 'Scale Y : '+EscalaMapaY;    
}

function ActualizarInformacion() 
{
    var Fecha = new Date();                                                                                   
    var ElipseP1Datos = CentroElipse(0);
    if (ElipseP1Datos != "?") {
        document.getElementById('PCentroP1').innerHTML = "Center Ellipse P1 : (" + (ElipseP1Datos.Latitud) + "," + ElipseP1Datos.Longitud + ") , (" + ElipseP1Datos.X + "," + ElipseP1Datos.Y + ")";
        document.getElementById('PAreaP1').innerHTML = "Ellipse Area P1 : " + google.maps.geometry.spherical.computeArea(Proyecciones[0].Elipse.getPath()) + " Metros Cuadrados";
    }
    else {
        document.getElementById('PCentroP1').innerHTML = "Ellipse Centro P1 : ?";
        document.getElementById('PAreaP1').innerHTML = "Ellipse Area P1 : ?"
    }


    ElipseP1Datos = CentroElipse(1);
    if (ElipseP1Datos != "?") {
        document.getElementById('PCentroP2').innerHTML = "Center Elipse P2 : (" + (ElipseP1Datos.Latitud) + "," + ElipseP1Datos.Longitud + ") , (" + ElipseP1Datos.X + "," + ElipseP1Datos.Y + ")";
        document.getElementById('PAreaP2').innerHTML = "Ellipse Area P2 : " + google.maps.geometry.spherical.computeArea(Proyecciones[1].Elipse.getPath()) + " Metros Cuadrados";
    }
    else {
        document.getElementById('PCentroP2').innerHTML = "Elipse Center P2 : ?";
        document.getElementById('PAreaP2').innerHTML = "Ellipse Area P2 : ?"
    }


    ElipseP1Datos = CentroElipse(2);
    if (ElipseP1Datos != "?") {
        document.getElementById('PCentroP3').innerHTML = "Center Ellipse P3 : (" + (ElipseP1Datos.Latitud) + "," + ElipseP1Datos.Longitud + ") , (" + ElipseP1Datos.X + "," + ElipseP1Datos.Y + ")";
        document.getElementById('PAreaP3').innerHTML = "Ellipse Area P3 : " + google.maps.geometry.spherical.computeArea(Proyecciones[2].Elipse.getPath()) + " Metros Cuadrados";
    }
    else {
        document.getElementById('PCentroP3').innerHTML = "Elipse Centro P3 : ?";
        document.getElementById('PAreaP3').innerHTML = "Elipse Area P3 : ?"
    }

    document.getElementById('PInterseccionP1P2').innerHTML = "Intercepta Elipse P1 y P2 :" + InterceptanDosPoligonos(Proyecciones[0].Elipse, Proyecciones[1].Elipse);
    document.getElementById('PInterseccionP1P3').innerHTML = "Intercepta Elipse P1 y P3 :" + InterceptanDosPoligonos(Proyecciones[0].Elipse, Proyecciones[2].Elipse);
    document.getElementById('PInterseccionP2P3').innerHTML = "Intercepta Elipse P2 y P3 :" + InterceptanDosPoligonos(Proyecciones[1].Elipse, Proyecciones[2].Elipse);
    var CentroOptimoDatos = CentroOptimo();
    if (CentroOptimoDatos != "?") {
        document.getElementById('PCentroOptimo').innerHTML = "Centro Optimo: " + "(" + (CentroOptimoDatos.Latitud) + "," + CentroOptimoDatos.Longitud + ") , (" + CentroOptimoDatos.X + "," + CentroOptimoDatos.Y + ")";
    }
    else {
        document.getElementById('PCentroOptimo').innerHTML = "Centro Optimo: ?";
    }

/*    document.getElementById('PXEscala').innerHTML = "Escala en X : " + EscalaMapaX + "Metros"
    document.getElementById('PYEscala').innerHTML = "Escala en Y : " + EscalaMapaY + "Metros"   */
}

function GeolocalizacionNavegador() 
{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var Posicion =
                {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

            MapaCanvas.setCenter(Posicion);
            MapaCanvas.setZoom(15);
            if (MarcadorCiudad != null) { MarcadorCiudad.setMap(null) };
            MarcadorCiudad = new google.maps.Marker(
                {
                    position: Posicion,
                    map: MapaCanvas,
                    animation: google.maps.Animation.DROP,
                    icon: 'https://k60.kn3.net/B/D/7/7/8/4/8FC.png'
                });
            if (OpcionesGlobales[0].MostrarPinCiudad == false) { MarcadorCiudad.setMap(null); }
            MapaCanvas.setZoom(15);
            MapaCanvas.panTo(Posicion);
            var CadenaHTML = '<strong>Latitud: </strong>' + MarcadorCiudad.getPosition().lat() + '<br><strong>Longitud: </strong>' + MarcadorCiudad.getPosition().lng();

            var VentanaInformacion = new google.maps.InfoWindow
                ({
                    content: CadenaHTML
                });

            MarcadorCiudad.addListener('click', function () 
            {
                VentanaInformacion.open(MapaCanvas, MarcadorCiudad);
            });
        });
    }
    else {
        alert("La geolocalización no esta soportada por tu navegador");
    }
}


function Geolocalizacion(Datos) {
    if (Datos.status == "OVER_QUERY_LIMIT") {
        Proyecciones[ProyeccionActiva].MarcadoresCollecion[(Proyecciones[ProyeccionActiva].MarcadoresCollecion.length) - 1].Direccion = "No disponible intentelo mas tarde";
    }
    else {
        JSONGeolocalizacion = Datos;
        Proyecciones[ProyeccionActiva].MarcadoresCollecion[(Proyecciones[ProyeccionActiva].MarcadoresCollecion.length) - 1].Direccion = JSONGeolocalizacion.results[0].formatted_address;
    }
}

function GeolocalizacionDrag(Datos) {
    if (Datos.status == "OVER_QUERY_LIMIT") {
        Proyecciones[ProyeccionActiva].MarcadoresCollecion[UltimoIndiceMarcador].Direccion = "No disponible intentelo mas tarde";
    }
    else {
        JSONGeolocalizacion = Datos;
        Proyecciones[ProyeccionActiva].MarcadoresCollecion[UltimoIndiceMarcador].Direccion = JSONGeolocalizacion.results[0].formatted_address;
    }

}

function DevolverURLMarcador(Consumidor) {
    var URLImagen;
    switch (Consumidor) {
        case "A1":
            URLImagen = "https://k60.kn3.net/A/9/8/7/A/5/D6D.png";
            break;
        case "B1":
            URLImagen = "https://k61.kn3.net/F/5/D/E/0/7/0CA.png";
            break;
        case "C1":
            URLImagen = "https://k61.kn3.net/2/4/0/0/C/7/CF8.png";
            break;
        case "D1":
            URLImagen = "https://k60.kn3.net/D/0/4/0/7/F/5F8.png";
            break;
        case "E1":
            URLImagen = "https://k61.kn3.net/0/5/7/C/4/5/F66.png";
            break;
        case "F1":
            URLImagen = "https://k60.kn3.net/9/A/B/0/8/B/F38.png";
            break;
        case "G1":
            URLImagen = "https://k60.kn3.net/C/5/8/5/A/A/6C2.png";
            break;
        case "H1":
            URLImagen = "https://k60.kn3.net/6/F/C/4/6/A/83A.png";
            break;
        case "I1":
            URLImagen = "https://k60.kn3.net/4/E/A/7/F/D/233.png";
            break;
        case "J1":
            URLImagen = "https://k60.kn3.net/5/C/F/C/B/F/1F6.png";
            break;

        case "A2":
            URLImagen = "https://k61.kn3.net/B/F/5/8/8/E/78A.png";
            break;
        case "B2":
            URLImagen = "https://k61.kn3.net/5/C/6/0/A/5/7EC.png";
            break;
        case "C2":
            URLImagen = "https://k60.kn3.net/7/4/C/2/D/3/031.png";
            break;
        case "D2":
            URLImagen = "https://k61.kn3.net/F/F/E/8/4/5/C99.png";
            break;
        case "E2":
            URLImagen = "https://k60.kn3.net/2/F/A/2/4/2/181.png";
            break;
        case "F2":
            URLImagen = "https://k60.kn3.net/1/D/B/C/A/0/B44.png";
            break;
        case "G2":
            URLImagen = "https://k60.kn3.net/2/1/5/1/E/4/642.png";
            break;
        case "H2":
            URLImagen = "https://k61.kn3.net/E/4/3/6/B/B/4BA.png";
            break;
        case "I2":
            URLImagen = "https://k61.kn3.net/4/8/A/7/9/7/778.png";
            break;
        case "J2":
            URLImagen = "https://k61.kn3.net/1/5/9/B/3/6/82E.png";
            break;


        case "A3":
            URLImagen = "https://k60.kn3.net/0/3/E/3/3/0/351.png";
            break;
        case "B3":
            URLImagen = "https://k61.kn3.net/5/D/A/0/3/1/962.png";
            break;
        case "C3":
            URLImagen = "https://k60.kn3.net/3/7/5/F/A/1/0AB.png";
            break;
        case "D3":
            URLImagen = "https://k60.kn3.net/0/8/F/B/2/C/BFD.png";
            break;
        case "E3":
            URLImagen = "https://k61.kn3.net/2/B/F/C/F/F/973.png";
            break;
        case "F3":
            URLImagen = "https://k61.kn3.net/2/B/F/C/F/F/973.png";
            break;
        case "G3":
            URLImagen = "https://k60.kn3.net/E/3/9/B/C/8/5E2.png";
            break;
        case "H3":
            URLImagen = "https://k60.kn3.net/0/A/B/F/E/C/BF0.png";
            break;
        case "I3":
            URLImagen = "https://k61.kn3.net/2/9/B/0/9/D/340.png";
            break;
        case "J3":
            URLImagen = "https://k61.kn3.net/5/E/E/8/0/F/EB2.png";
            break;
    }
    return URLImagen;
}

function RecopilarJSON() {
    JSONBBDD = '{ "MarcadoresP1": [';


    for (I = 0; I < Proyecciones[0].MarcadoresCollecion.length; I++) {
        JSONBBDD = JSONBBDD + '{"Latitud": "' + Proyecciones[0].MarcadoresCollecion[I].Marcador.getPosition().lat() + '","Longitud":"' + Proyecciones[0].MarcadoresCollecion[I].Marcador.getPosition().lng() + '","Horas":['
        for (J = 0; J <= 23; J++) {
            if (J <= 22) {
                JSONBBDD = JSONBBDD + '"' + Proyecciones[0].MarcadoresCollecion[I].Horas[J] + '",';
            }
            else {
                JSONBBDD = JSONBBDD + '"' + Proyecciones[0].MarcadoresCollecion[I].Horas[J] + '"';
            }
        }
        JSONBBDD = JSONBBDD + ']}';
        if (!(I == Proyecciones[0].MarcadoresCollecion.length - 1)) {
            JSONBBDD = JSONBBDD + ','
        }
    }
    JSONBBDD = JSONBBDD + '],  "MarcadoresP2": [';


    for (I = 0; I < Proyecciones[1].MarcadoresCollecion.length; I++) {
        JSONBBDD = JSONBBDD + '{"Latitud": "' + Proyecciones[1].MarcadoresCollecion[I].Marcador.getPosition().lat() + '","Longitud":"' + Proyecciones[1].MarcadoresCollecion[I].Marcador.getPosition().lng() + '","Horas":['
        for (J = 0; J <= 23; J++) {
            if (J <= 22) {
                JSONBBDD = JSONBBDD + '"' + Proyecciones[1].MarcadoresCollecion[I].Horas[J] + '",';
            }
            else {
                JSONBBDD = JSONBBDD + '"' + Proyecciones[1].MarcadoresCollecion[I].Horas[J] + '"';
            }
        }
        JSONBBDD = JSONBBDD + ']}';
        if (!(I == Proyecciones[1].MarcadoresCollecion.length - 1)) {
            JSONBBDD = JSONBBDD + ','
        }
    }

    JSONBBDD = JSONBBDD + '],  "MarcadoresP3": [';


    for (I = 0; I < Proyecciones[2].MarcadoresCollecion.length; I++) {
        JSONBBDD = JSONBBDD + '{"Latitud": "' + Proyecciones[2].MarcadoresCollecion[I].Marcador.getPosition().lat() + '","Longitud":"' + Proyecciones[2].MarcadoresCollecion[I].Marcador.getPosition().lng() + '","Horas":['
        for (J = 0; J <= 23; J++) {
            if (J <= 22) {
                JSONBBDD = JSONBBDD + '"' + Proyecciones[2].MarcadoresCollecion[I].Horas[J] + '",';
            }
            else {
                JSONBBDD = JSONBBDD + '"' + Proyecciones[2].MarcadoresCollecion[I].Horas[J] + '"';
            }
        }
        JSONBBDD = JSONBBDD + ']}';
        if (!(I == Proyecciones[2].MarcadoresCollecion.length - 1)) {
            JSONBBDD = JSONBBDD + ','
        }
    }
    JSONBBDD = JSONBBDD + '],  "ELipseP1Dibujada":' + Proyecciones[0].ElipseDibujada + ",";
    JSONBBDD = JSONBBDD + '"ELipseP2Dibujada":' + Proyecciones[1].ElipseDibujada + ",";
    JSONBBDD = JSONBBDD + '"ELipseP3Dibujada":' + Proyecciones[2].ElipseDibujada + ",";

    JSONBBDD = JSONBBDD + '"WS1": [{';
    for (I = 0; I < Proyecciones[0].EspaciosDeTrabajo.length; I++) {        
        JSONBBDD = JSONBBDD + '"Identificador":"' + Proyecciones[0].EspaciosDeTrabajo[I].Identificador + '"';
        JSONBBDD = JSONBBDD + ',"MarcadoresP1": ['
        for (J = 0; J < Proyecciones[0].EspaciosDeTrabajo[I].Marcadores.length; J++) {
            JSONBBDD = JSONBBDD + '{"Latitud": "' + Proyecciones[0].EspaciosDeTrabajo[I].Marcadores[J].Marcador.getPosition().lat() + '","Longitud":"' + Proyecciones[0].EspaciosDeTrabajo[I].Marcadores[J].Marcador.getPosition().lng() + '","Horas":['
            for (Z = 0; Z <= 23; Z++) {
                if (Z <= 22) {
                    JSONBBDD = JSONBBDD + '"' + Proyecciones[0].EspaciosDeTrabajo[I].Marcadores[J].Horas[Z] + '",';
                }
                else {
                    JSONBBDD = JSONBBDD + '"' + Proyecciones[0].EspaciosDeTrabajo[I].Marcadores[J].Horas[Z] + '"';
                }
            }

            if ((J == Proyecciones[0].EspaciosDeTrabajo[I].Marcadores.length - 1)) {
                JSONBBDD = JSONBBDD + ']}],"Zoom":"' + Proyecciones[0].EspaciosDeTrabajo[I].Zoom + '"';                
                JSONBBDD = JSONBBDD + '},{';
            }
            else {
                JSONBBDD = JSONBBDD + ']';
                JSONBBDD = JSONBBDD + '},';
            }            
        }
    }    
    JSONBBDD = JSONBBDD + '}],';

        

    JSONBBDD = JSONBBDD + '"WS2": [{';
    for (I = 0; I < Proyecciones[1].EspaciosDeTrabajo.length; I++) {
        JSONBBDD = JSONBBDD + '"Identificador":"' + Proyecciones[1].EspaciosDeTrabajo[I].Identificador + '"';
        JSONBBDD = JSONBBDD + ',"MarcadoresP1": ['
        for (J = 0; J < Proyecciones[1].EspaciosDeTrabajo[I].Marcadores.length; J++) {
            JSONBBDD = JSONBBDD + '{"Latitud": "' + Proyecciones[1].EspaciosDeTrabajo[I].Marcadores[J].Marcador.getPosition().lat() + '","Longitud":"' + Proyecciones[1].EspaciosDeTrabajo[I].Marcadores[J].Marcador.getPosition().lng() + '","Horas":['
            for (Z = 0; Z <= 23; Z++) {
                if (Z <= 22) {
                    JSONBBDD = JSONBBDD + '"' + Proyecciones[1].EspaciosDeTrabajo[I].Marcadores[J].Horas[Z] + '",';
                }
                else {
                    JSONBBDD = JSONBBDD + '"' + Proyecciones[1].EspaciosDeTrabajo[I].Marcadores[J].Horas[Z] + '"';
                }
            }

            if ((J == Proyecciones[1].EspaciosDeTrabajo[I].Marcadores.length - 1)) {
                JSONBBDD = JSONBBDD + ']}],"Zoom":"' + Proyecciones[1].EspaciosDeTrabajo[I].Zoom + '"';
                JSONBBDD = JSONBBDD + '},{';
            }
            else {
                JSONBBDD = JSONBBDD + ']';
                JSONBBDD = JSONBBDD + '},';
            }
        }
    }
    JSONBBDD = JSONBBDD + '}],';


    JSONBBDD = JSONBBDD + '"WS3": [{';
    for (I = 0; I < Proyecciones[2].EspaciosDeTrabajo.length; I++) {
        JSONBBDD = JSONBBDD + '"Identificador":"' + Proyecciones[2].EspaciosDeTrabajo[I].Identificador + '"';
        JSONBBDD = JSONBBDD + ',"MarcadoresP3": ['
        for (J = 0; J < Proyecciones[2].EspaciosDeTrabajo[I].Marcadores.length; J++) {
            JSONBBDD = JSONBBDD + '{"Latitud": "' + Proyecciones[2].EspaciosDeTrabajo[I].Marcadores[J].Marcador.getPosition().lat() + '","Longitud":"' + Proyecciones[2].EspaciosDeTrabajo[I].Marcadores[J].Marcador.getPosition().lng() + '","Horas":['
            for (Z = 0; Z <= 23; Z++) {
                if (Z <= 22) {
                    JSONBBDD = JSONBBDD + '"' + Proyecciones[2].EspaciosDeTrabajo[I].Marcadores[J].Horas[Z] + '",';
                }
                else {
                    JSONBBDD = JSONBBDD + '"' + Proyecciones[2].EspaciosDeTrabajo[I].Marcadores[J].Horas[Z] + '"';
                }
            }

            if ((J == Proyecciones[2].EspaciosDeTrabajo[I].Marcadores.length - 1)) {
                JSONBBDD = JSONBBDD + ']}],"Zoom":"' + Proyecciones[2].EspaciosDeTrabajo[I].Zoom + '"';
                JSONBBDD = JSONBBDD + '},{';
            }
            else {
                JSONBBDD = JSONBBDD + ']';
                JSONBBDD = JSONBBDD + '},';
            }
        }
    }

    JSONBBDD = JSONBBDD + '}]';
    JSONBBDD = JSONBBDD + ',"Centro": {"Latitud":"' + MapaCanvas.getCenter().lat() + '","Longitud":"' + MapaCanvas.getCenter().lng() + '"}';
    JSONBBDD = JSONBBDD + ',"Zoom": {"Valor":"' + MapaCanvas.getZoom()+'"}';
    JSONBBDD = JSONBBDD + ',"OpcionesGlobales": [';
    
    JSONBBDD = JSONBBDD + '{';
    JSONBBDD = JSONBBDD + '"TodosCentrosCarga":' + OpcionesGlobales[0].TodosCentrosCarga + ",";
    JSONBBDD = JSONBBDD + '"TodosCentrosEventuales":' + OpcionesGlobales[0].TodosCentrosEventuales + ","
    JSONBBDD = JSONBBDD + '"TodasElipses":' + OpcionesGlobales[0].TodasElipses + ","            
    JSONBBDD = JSONBBDD + '"MostrarLeyenda":' + OpcionesGlobales[0].MostrarLeyenda + ","            
    JSONBBDD = JSONBBDD + '"MostrarPinCiudad":' + OpcionesGlobales[0].MostrarPinCiudad + ","            
    JSONBBDD = JSONBBDD + '"OpacidadBorde":' + OpcionesGlobales[0].OpacidadBorde + ","            
    JSONBBDD = JSONBBDD + '"OpacidadRelleno":' + OpcionesGlobales[0].OpacidadRelleno + ","            
    JSONBBDD = JSONBBDD + '"Paso":' + OpcionesGlobales[0].Paso + "}"            
    
    JSONBBDD = JSONBBDD + ']}';
      
} 

function RestaurarDatosJSON(JSONRestaurar) {
    var ObjetoRecuperacion = JSON.parse(JSONRestaurar);

    MapaCanvas.setCenter({ lat: parseFloat(ObjetoRecuperacion.Centro.Latitud), lng: parseFloat(ObjetoRecuperacion.Centro.Longitud) });
    DelimitarBordes("");
    MapaCanvas.setZoom(parseInt(ObjetoRecuperacion.Zoom.Valor));
    ProyeccionActiva = 0;
    Proyecciones[ProyeccionActiva].Contador = 1;
    var ContadorJSON = 0;
    ObjetoRecuperacion.MarcadoresP1.forEach(function (DatosMarcador) {
        var Punto = new google.maps.LatLng(parseFloat(DatosMarcador.Latitud), parseFloat(DatosMarcador.Longitud));
        AñadirMarcadorMapa(Punto, MapaCanvas)
        Proyecciones[ProyeccionActiva].MarcadoresCollecion[ContadorJSON].Horas = DatosMarcador.Horas;
        ContadorJSON++;
    });

    ProyeccionActiva = 1;
    Proyecciones[ProyeccionActiva].Contador = 1;
    var ContadorJSON = 0;
    ObjetoRecuperacion.MarcadoresP2.forEach(function (DatosMarcador) {
        var Punto = new google.maps.LatLng(parseFloat(DatosMarcador.Latitud), parseFloat(DatosMarcador.Longitud));
        AñadirMarcadorMapa(Punto, MapaCanvas)
        Proyecciones[ProyeccionActiva].MarcadoresCollecion[ContadorJSON].Horas = DatosMarcador.Horas;
        ContadorJSON++;
    });

    ProyeccionActiva = 2;
    Proyecciones[ProyeccionActiva].Contador = 1;
    var ContadorJSON = 0;
    ObjetoRecuperacion.MarcadoresP3.forEach(function (DatosMarcador) {
        var Punto = new google.maps.LatLng(floatParse(DatosMarcador.Latitud), floatParse(DatosMarcador.Longitud));
        AñadirMarcadorMapa(Punto, MapaCanvas)
        Proyecciones[ProyeccionActiva].MarcadoresCollecion[ContadorJSON].Horas = DatosMarcador.Horas;
        ContadorJSON++;
    });

    OcultarMostrar_Cargas(2, ProyeccionActiva, null);
    OcultarMostrar_CentrosDeCargaEventuales(2, ProyeccionActiva, null);
    OcultarMostrar_Elipses(2, ProyeccionActiva, null);

    ProyeccionActiva = 0;
    OcultarMostrar_Cargas(1, ProyeccionActiva, MapaCanvas);
    OcultarMostrar_CentrosDeCargaEventuales(1, ProyeccionActiva, MapaCanvas);
    OcultarMostrar_Elipses(1, ProyeccionActiva, MapaCanvas);

    OpcionesGlobales = ObjetoRecuperacion.OpcionesGlobales;

    var ContadorEspacios = 0;
    var ContadorEspaciosMarcadores = 0;
    ProyeccionActiva = 0;

    ObjetoRecuperacion.WS1.forEach(function (DatosMarcador) {
        if (DatosMarcador.Identificador != null)
        {            
            Proyecciones[ProyeccionActiva].EspaciosDeTrabajo.push({ Identificador: DatosMarcador.Identificador, Zoom: DatosMarcador.Zoom, Marcadores: new Array() });
            DatosMarcador.MarcadoresP1.forEach(function (Marcador)
            {
                var Punto = new google.maps.LatLng(parseFloat(Marcador.Latitud), parseFloat(Marcador.Longitud));
                var MarcadorWS = new google.maps.Marker(
                    {
                        position: Punto,
                        draggable: true,
                        map: null,
                        animation: google.maps.Animation.DROP,
                        tittle: Alfabeto[ContadorEspacios] + (ProyeccionActiva + 1).toString(),
                        icon: DevolverURLMarcador(Alfabeto[ContadorEspacios] + (ProyeccionActiva + 1).toString())
                    })
                Proyecciones[ProyeccionActiva].EspaciosDeTrabajo[ContadorEspaciosMarcadores].Marcadores.push({ Titulo: Alfabeto[ContadorEspaciosMarcadores] + (ProyeccionActiva + 1).toString(), Categoria: "1", Marcador: MarcadorWS, Horas: Marcador.Horas, X: RetornarCordenada(MarcadorWS).x, Y: Math.abs((RetornarCordenada(MarcadorWS).y) - Altura), Posicion: Proyecciones[ProyeccionActiva].Contador, Proyeccion: ProyeccionActiva });
                ContadorEspaciosMarcadores++;
            });
            ContadorEspaciosMarcadores = 0;
            ContadorEspacios++;
        }
    });

    var ContadorEspacios = 0;
    var ContadorEspaciosMarcadores = 0;
    ProyeccionActiva = 1;

    ObjetoRecuperacion.WS2.forEach(function (DatosMarcador) {
        if (DatosMarcador.Identificador != null) {
            Proyecciones[ProyeccionActiva].EspaciosDeTrabajo.push({ Identificador: DatosMarcador.Identificador, Zoom: DatosMarcador.Zoom, Marcadores: new Array() });
            DatosMarcador.MarcadoresP1.forEach(function (Marcador) {
                var Punto = new google.maps.LatLng(parseFloat(Marcador.Latitud), parseFloat(Marcador.Longitud));
                var MarcadorWS = new google.maps.Marker(
                    {
                        position: Punto,
                        draggable: true,
                        map: null,
                        animation: google.maps.Animation.DROP,
                        tittle: Alfabeto[ContadorEspacios] + (ProyeccionActiva + 1).toString(),
                        icon: DevolverURLMarcador(Alfabeto[ContadorEspaciosMarcadores] + (ProyeccionActiva + 1).toString())
                    })
                Proyecciones[ProyeccionActiva].EspaciosDeTrabajo[ContadorEspacios].Marcadores.push({ Titulo: Alfabeto[ContadorEspaciosMarcadores] + (ProyeccionActiva + 1).toString(), Categoria: "1", Marcador: MarcadorWS, Horas: Marcador.Horas, X: RetornarCordenada(MarcadorWS).x, Y: Math.abs((RetornarCordenada(MarcadorWS).y) - Altura), Posicion: Proyecciones[ProyeccionActiva].Contador, Proyeccion: ProyeccionActiva });
                ContadorEspaciosMarcadores++;
            });
            ContadorEspaciosMarcadores = 0;
            ContadorEspacios++;
        }
    });

    var ContadorEspacios = 0;
    var ContadorEspaciosMarcadores = 0;
    ProyeccionActiva = 2;

    ObjetoRecuperacion.WS3.forEach(function (DatosMarcador) {
        if (DatosMarcador.Identificador != null) {
            Proyecciones[ProyeccionActiva].EspaciosDeTrabajo.push({ Identificador: DatosMarcador.Identificador, Zoom: DatosMarcador.Zoom, Marcadores: new Array() });
            DatosMarcador.MarcadoresP1.forEach(function (Marcador) {
                var Punto = new google.maps.LatLng(parseFloat(Marcador.Latitud), parseFloat(Marcador.Longitud));
                var MarcadorWS = new google.maps.Marker(
                    {
                        position: Punto,
                        draggable: true,
                        map: null,
                        animation: google.maps.Animation.DROP,
                        tittle: Alfabeto[ContadorEspacios] + (ProyeccionActiva + 1).toString(),
                        icon: DevolverURLMarcador(Alfabeto[ContadorEspaciosMarcadores] + (ProyeccionActiva + 1).toString())
                    })
                Proyecciones[ProyeccionActiva].EspaciosDeTrabajo[ContadorEspacios].Marcadores.push({ Titulo: Alfabeto[ContadorEspaciosMarcadores] + (ProyeccionActiva + 1).toString(), Categoria: "1", Marcador: MarcadorWS, Horas: Marcador.Horas, X: RetornarCordenada(MarcadorWS).x, Y: Math.abs((RetornarCordenada(MarcadorWS).y) - Altura), Posicion: Proyecciones[ProyeccionActiva].Contador, Proyeccion: ProyeccionActiva });
                ContadorEspaciosMarcadores++;
            });
            ContadorEspaciosMarcadores = 0;
            ContadorEspacios++;
        }
    });
    ProyeccionActiva = 0;
    ActualizarTablaEspaciosDeTrabajo();
}