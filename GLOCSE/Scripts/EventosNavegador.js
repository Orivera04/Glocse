var Activo = "containermapa";
var DxTexto = null ; 
var DyTexto = null; 
var SigmaXTexto = null; 
var SigmaYTexto = null; 
var HxTexto = null ; 
var HyTexto = null; 
var AxTexto = null; 
var AyTexto = null
var CxyTexto = null; 
var rTexto = null; 
var FhiSigmaTexto = null ; 
var PhiSigmaTexto = null ; 
var FhiExactitudTexto  = null ;
var PhiExactitudTexto   = null;
var FhiRadioTexto = null ; 
var  PhiRadioTexto = null; 
var AnguloTexto = null;

var CMapaLatitud = null;
var CMapaLongitud = null;
var CMapaCentroX = null;
var CMapaCentroY = null;
var CElipseLatitud = null;
var CElipseLongitud = null;
var CElipseX = null;
var CElipseY = null;
var CElipseArea = null;
var CGuia = null;
var CEscala = null;
var CEscalaY = null;

var Emergente;
var EmergenteCentroEventual;
var LeftContendor;
var TopContenedor;
var OFFSIDE;
var Ejecutar = false;
var Referencia;
var MapaCanvas;
var UltimoCentro;
var Bordes = null;
var Rectangulo = null;
var ZoomMinimo = null;
var Escala;
var Tope;
var CoordenadaMundo;
var Proyeccion;
var NW;
var Tabla;
var TablaCentrosEventuales;
var TablaPotencias;
var CondicionZoom = false;
var Altura; var Color;
var Fila;
var TablaEspaciosDeTrabajo;
var EscalaMapaX;
var EscalaMapaY;
var PinConsumidores = new Array();
var InformacionVentana;
var Alfabeto = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
var Proyecciones = new Array();
var ProyeccionActiva = 0;
var MostrarTodasProyecciones = false;
var UltimoCentroMarcador;
var SegundaProyeccionActivada = false;
var TerceraProyeccionActivada = false;
var BordesRectanguloMarcador = null;
var GraficasEstaticas = [];
var Espacio = null;
var Montañas = [];
var Leyenda = null;
var LeyendaItem = [];
var OpcionesGlobales = new Array();
var ContenedorTipo = "";
const API_KEY = 'AIzaSyArDK0WfiSl45XvXXIfvAj7RDvt-JUBsXU';


$( document ).ready(function() 
{
  	
  	/* Eventos del menu lateral */

            /* Opcion Mapa */        	


/*        	$( "#sb_plano" ).click(function() 
        	{
        	      MostrarOcultarContenedor('containermapa');
                Activo = "containermapa";
                document.getElementById('canvasfiguras').style.display = 'block'
            }); 
*/

            $( "#sb_googlemaps" ).click(function() 
            {
                MostrarOcultarContenedor('containermapa');
                Activo = "containermapa";
/*                document.getElementById('canvasfiguras').style.display = 'none';        */
            }); 


            $( "#sb_graficas" ).click(function() 
            {                
                MostrarOcultarContenedor('containergraficas');
                Activo = "containergraficas";                               

            }); 

        	
          	$( "#sb_reportes" ).click(function() 
          	{
                if(Rectangulo != null)
                {                  
            	 	   ActualizarTabla();
                   ActualizarTablaCentrosEventuales();
                   ActualizarInformacionProyeccionActual()
                   ActualizarTablaPotencias();
                   MostrarOcultarContenedor('containerreportes');
            	 	   Activo = "containerreportes";
                   document.getElementById('cargasproyeccion').innerHTML = Proyecciones[ProyeccionActiva].MarcadoresCollecion.length + " / 10";
                   document.getElementById('centrosproyeccion').innerHTML = Proyecciones[ProyeccionActiva].CentrosEventuales.length + " / 24";
                   document.getElementById('Radiox').innerHTML = Math.trunc(Proyecciones[ProyeccionActiva].FhiRadio);
                   document.getElementById('Radioy').innerHTML = Math.trunc(Proyecciones[ProyeccionActiva].PhiRadio);
                }
                else
                {
                  $.Notification.autoHideNotify('error', 'top right', 'Limite la zona del mapa primero')                                                ;
                }
          	});


            $( "#sb_proyecciones" ).click(function() 
            { 
                  var Total =0;
                   ActualizarTablaEspaciosDeTrabajo();
                   MostrarOcultarContenedor('containerproyecciones');
                   

                   Activo = "containerproyecciones";

/*********************  VALIDACION EN CASO DE QUE EL ARREGLO ESTE VACIO Y NO RETORNE NULL, SE RETORNA CERO***************************************************************** */
                    try{
                   document.getElementById('Proyeccion1').innerHTML= Proyecciones[0].MarcadoresCollecion.length + " / 10"; 
                   Total = Total + Proyecciones[0].MarcadoresCollecion.length;
                   }
                   catch(e)
                   {
                    document.getElementById('Proyeccion1').innerHTML= " 0 / 10"; 
                    Total = Total + 0;
                   }


                   try{
                   document.getElementById('Proyeccion2').innerHTML= Proyecciones[1].MarcadoresCollecion.length + " / 10"; 
                   Total = Total + Proyecciones[1].MarcadoresCollecion.length;
                   }
                   catch(e)
                   {
                    document.getElementById('Proyeccion2').innerHTML= " 0 / 10"; 
                    Total = Total + 0;
                   }


                     try{
                   document.getElementById('Proyeccion3').innerHTML= Proyecciones[2].MarcadoresCollecion.length + " / 10"; 
                   Total = Total + Proyecciones[2].MarcadoresCollecion.length;
                   }
                   catch(e)
                   {
                    document.getElementById('Proyeccion3').innerHTML= " 0 / 10"; 
                    Total = Total + 0;
                   }

                    document.getElementById('TotalCEC').innerHTML = Total + ' / 30';

 /********************************************SE LLAMA AL METODO DE ACTUALIZAR PARA LLENAR CAMPOS VACIOS DE DATOS***********************************************************************/
                    ActualizarInformacion();

              });


/* **********************************SE AÑADE METODO PARA LA UBICACION DEL PIN DE PRUEBA****************************************************************************/
            $( "#PinDePrueba").click(function() 
            {
                    UbicarPinPrueba();
            });


/* **********************************SE AÑADE METODO PARA LA UBICACION DEL PIN DE PRUEBA****************************************************************************/
             $('#Geolocalizacion').on('click',function(e)
                {
                     GeolocalizacionNavegador();
                });




            $( "#sb_configuracion" ).click(function() 
            {
                   MostrarOcultarContenedor('containerconfiguracion');
                   Activo = "containerconfiguracion";
            });



            $( "#Rowmapa" ).mousemove(function( event ) 
            {  
                if(Rectangulo != null)
                {
                    var OFFSIDE = $('#Rowmapa').offset();            
                    LeftContendor = event.clientX - OFFSIDE.left;
                    TopContenedor = event.clientY - OFFSIDE.top;    
                                                                                      
                }                
            });


            $("#Rowmapa").mousedown(function(event)
            {                    
                    if(event.which == 3)
                    {                        
                       if(Rectangulo == null)
                       {
                            $.Notification.autoHideNotify('error', 'top right', 'No se pudo añadir el consumidor dado que aun no se ha limitado el mapa.')                                                
                       }
                       else
                       {
                              var Borde = event.target.getBoundingClientRect();
                              var X = event.clientX - Borde.left;
                              var Y = event.clientY - Borde.top;
                              AñadirMarcadorMapa(Coordenadas_Cartesianas_APunto({x:X,y:Y}) , MapaCanvas)
                       }
                    }
            });


  	/* Eventos del mapa */            
            /*Recolección de eventos de las acciones del mapa */
            $('#LimitarMapa').click(function(event)
            {
                if(Rectangulo == null)
                {                    
                    try
                    {
                        DelimitarBordes("");  
                        $.Notification.autoHideNotify('success', 'top right', 'Se ha limitado el mapa exitosamente.')                                                
                    }                                  
                    catch(e)
                    {
                        $.Notification.autoHideNotify('warning', 'top right', 'Espere a que se cargue el mapa.')      
                    }
                }
                else
                {
                     $.Notification.autoHideNotify('warning', 'top right', 'El mapa ya ha sido limitado previamente');                     
                }
            });


            $('#DeslimitarMapa').click(function(event)
            {                                              
                if(Rectangulo != null)
                {                    
                      if(!Proyecciones[ProyeccionActiva].MarcadoresCollecion[0])
                      {
                            DelimitarBordes('2');
                            $.Notification.autoHideNotify('success', 'top right', 'Se ha quitado la limitación del mapa.')
                      }
                      else
                      {
                            $.Notification.autoHideNotify('error', 'top right', 'No se puede quitar el limite del mapa ya se han establecido consumidores.');
                      }
                }
                else
                {
                    $.Notification.autoHideNotify('warning', 'top right', 'El mapa no ha sido limitado aun.');
                }                
            });

            $('#GuardarEspacioTrabajo').click(function(event)
            {
                                
                  GuardarEspacioDeTrabajo(0);                                       
                  $.Notification.autoHideNotify('success', 'top right', 'Se ha guardado el espacio de trabajo');                
            });


            



            $('#Procesar').click(function(event)
            {                                              
                if(Rectangulo != null)
                {                    
                      if(Proyecciones[ProyeccionActiva].MarcadoresCollecion.length >= 6)
                      {
                            if(document.getElementById('potenciasaleatorias').checked)
                            {
                                  PotenciasAleatorios();    
                            }                            
                            Proyecciones[ProyeccionActiva].ElipseDibujada = true;                                          
                            if(SwitchActivo('switchcentroseventuales') == true)
                            {
                                CentrosEventualesDeCarga(1,ProyeccionActiva);                         
                            }
                            else
                            {
                                CentrosEventualesDeCarga(1,ProyeccionActiva);                         
                                OcultarMostrar_CentrosDeCargaEventuales(1, ProyeccionActiva, null);
                            }                            
                            if(MostrarTodasProyecciones) {DetectarInterseccion(1);}                           
                            MapaAImagen(ProyeccionActiva,0);                            
                            $.Notification.autoHideNotify('success', 'top right', 'El sistema ha calculado la posición optima para la subestación electrica.')                                                

                      }
                      else
                      {
                            $.Notification.autoHideNotify('warning', 'top right', 'Faltan consumidores como minimo deben ser 6.');
                      }
                }
                else
                {
                    $.Notification.autoHideNotify('warning', 'top right', 'El mapa no ha sido limitado aun.');
                }
                  
            });

            $('#graficamontaña').click(function(event)
            {
                  if(Proyecciones[0].ElipseDibujada)
                  {
                     Graficando_Hill(Proyecciones[0].XPoint,Proyecciones[0].YPoint,Proyecciones[0].XSigma,Proyecciones[0].YSigma,Proyecciones[0].r,Proyecciones[0].Puntos_X,Proyecciones[0].Puntos_Y, Proyecciones[0].FhiRadio, Proyecciones[0].PhiRadio,1);
                  }
                  if(Proyecciones[1].ElipseDibujada)
                  {
                     Graficando_Hill(Proyecciones[1].XPoint,Proyecciones[1].YPoint,Proyecciones[1].XSigma,Proyecciones[1].YSigma,Proyecciones[1].r,Proyecciones[1].Puntos_X,Proyecciones[1].Puntos_Y, Proyecciones[1].FhiRadio, Proyecciones[1].PhiRadio,2);
                  }
                  if(Proyecciones[2].ElipseDibujada)
                  {
                     Graficando_Hill(Proyecciones[2].XPoint,Proyecciones[2].YPoint,Proyecciones[2].XSigma,Proyecciones[2].YSigma,Proyecciones[2].r,Proyecciones[2].Puntos_X,Proyecciones[2].Puntos_Y, Proyecciones[2].FhiRadio, Proyecciones[2].PhiRadio,3);
                  }
            });


            $('#graficaconsumidores').click(function(event)
            { 
                 Datos_Graficas(Proyecciones,ProyeccionActiva);
            });

            $('#reporte').click(function(event)
            {
                  
                  GenerarReporte();
            });



            $('#Reiniciar').click(function(event)
            {
                    Reiniciar();
                    Proyecciones[ProyeccionActiva].ElipseDibujada = false;

            });
            NavegadorMobil = new RegExp('Android|webOS|iPhone|iPad|'+'BlackBerry|Windows Phone|'  +'Opera Mini|IEMobile|Mobile' ,'i');
  
            if (NavegadorMobil.test(navigator.userAgent))
            {
                    $("#Rowmapa").on("tap", null,function(event)
                    {
                        if(Rectangulo == null)
                        {
                             $.Notification.autoHideNotify('error', 'top right', 'No se pudo añadir el consumidor dado que aun no se ha limitado el mapa.')                                                
                        }
                       else
                       {
                              var Borde = event.target.getBoundingClientRect();
                              var X = event.clientX - Borde.left;
                              var Y = event.clientY - Borde.top;
                              AñadirMarcadorMapa(Coordenadas_Cartesianas_APunto({x:X,y:Y}) , MapaCanvas)
                       }
                    });
            }
            
            $( "#ContenedorEmergente" ).mouseleave(function() 
            {
               $(this).hide(1000);
            });

            $('#guardarcontenedor').click(function(event)
            {
                 GuardarCambiosContenedor();
            });
            
    /* Recolección de controles */
          	DxTexto = document.getElementById('VDx');
            DyTexto = document.getElementById('VDy');
            SigmaXTexto = document.getElementById('VSigmax');
            SigmaYTexto = document.getElementById('VSigmay');
            HxTexto = document.getElementById('VHx');
            HyTexto = document.getElementById('VHy');                  
            AxTexto = document.getElementById('VAx');
            AyTexto = document.getElementById('VAy');
            CxyTexto = document.getElementById('VCxy');
            rTexto = document.getElementById('Vr');
            AnguloTexto = document.getElementById('VAngulo');
            FhiSigmaTexto = document.getElementById('VFhiSigma');
            PhiSigmaTexto = document.getElementById('VPhiSigma');
            FhiExactitudTexto = document.getElementById('VFhiExactitud');
            PhiExactitudTexto = document.getElementById('VPhiExactitud');
            FhiRadioTexto = document.getElementById('VFhiRadio');
            PhiRadioTexto = document.getElementById('VPhiRadio');


            CMapaLatitud = document.getElementById('CMapaLatitud');
            CMapaLongitud = document.getElementById('CMapaLongitud');
            CMapaCentroX = document.getElementById('CMapaCentroX');
            CMapaCentroY = document.getElementById('CMapaCentroY');
            CElipseLatitud = document.getElementById('CElipseLatitud');
            CElipseLongitud = document.getElementById('CElipseLongitud');
            CElipseX = document.getElementById('CElipseX');
            CElipseY = document.getElementById('CElipseY');
            CElipseArea = document.getElementById('CElipseArea');
            CGuia = document.getElementById('CGuia');
            CEscala = document.getElementById('CEscala');
            CEscalaY = document.getElementById('CEscalaY');

            Altura = (document.getElementById('Rowmapa').clientHeight);             

            Proyecciones.push({MarcadoresCollecion : [],Contador:1,ElipseDibujada : false,Elipse:null,CentrosEventuales : new Array(),EspaciosDeTrabajo : new Array(),EspacioTrabajoContador: 0,Centro : null,CentrosEventualesCoordenadasFisicas : new Array(), XDispersion : 0 ,YDispersion : 0 , XSigma : 0 ,YSigma : 0 ,XExactitud : 0 , YExactitud : 0 , XYCorrelacion : 0, r : 0 , Angulo: 0 , FhiSigma2: 0 , PhiSigma2 : 0, FhiExactitud : 0 ,  PhiExactitud : 0 , FhiRadio : 0 ,  PhiRadio : 0 , XPoint : 0 , YPoint : 0 ,Puntos_X : new Array(),Sumatoria : new Array(),Opciones: {MostrarConsumidores :  true , MostrarCentrosEventuales : true , MostrarElipse : true}});
            Proyecciones.push({MarcadoresCollecion : [],Contador:1,ElipseDibujada : false,Elipse:null,CentrosEventuales : new Array(),EspaciosDeTrabajo : new Array(),EspacioTrabajoContador: 0,Centro : null,CentrosEventualesCoordenadasFisicas : new Array(), XDispersion : 0 ,YDispersion : 0 , XSigma : 0 ,YSigma : 0 ,XExactitud : 0 , YExactitud : 0 , XYCorrelacion : 0, r : 0 , Angulo: 0 , FhiSigma2: 0 , PhiSigma2 : 0, FhiExactitud : 0 ,  PhiExactitud : 0 , FhiRadio : 0 ,  PhiRadio : 0 , XPoint : 0 , YPoint : 0 ,Puntos_X : new Array(),Sumatoria : new Array(),Opciones: {MostrarConsumidores :  true , MostrarCentrosEventuales : true , MostrarElipse : true}});
            Proyecciones.push({MarcadoresCollecion : [],Contador:1,ElipseDibujada : false,Elipse:null,CentrosEventuales : new Array(),EspaciosDeTrabajo : new Array(),EspacioTrabajoContador: 0,Centro : null,CentrosEventualesCoordenadasFisicas : new Array(), XDispersion : 0 ,YDispersion : 0 , XSigma : 0 ,YSigma : 0 ,XExactitud : 0 , YExactitud : 0 , XYCorrelacion : 0, r : 0 , Angulo: 0 , FhiSigma2: 0 , PhiSigma2 : 0, FhiExactitud : 0 ,  PhiExactitud : 0 , FhiRadio : 0 ,  PhiRadio : 0 , XPoint : 0 , YPoint : 0 ,Puntos_X : new Array(),Sumatoria : new Array(),Opciones: {MostrarConsumidores :  true , MostrarCentrosEventuales : true , MostrarElipse : true}});

            Montañas.push("");             
            Montañas.push("");             
            Montañas.push("");             

            OpcionesGlobales.push({TodosCentrosCarga : false , TodosCentrosEventuales : false , TodasElipses : true,MostrarLeyenda : true,MostrarPinCiudad : true ,Paso : 0.10,OpacidadBorde: 0.4, OpacidadRelleno:0.35});    

  	/* Inicializaciòn del mapa y canvas */
             GenerarMapa();

             $('#switchtiemporeal').click(function()
             {
                  $(this).toggleClass('on');                  
             });


              $('#switchcentroseventuales').click(function()
             {
                $(this).toggleClass('on');
                if(SwitchActivo('switchcentroseventuales') == false)
                {
                    OcultarMostrar_CentrosDeCargaEventuales(1,ProyeccionActiva,null);                    
                    Proyecciones[ProyeccionActiva].Opciones.MostrarCentrosEventuales = false; 
                }
                else
                {
                   OcultarMostrar_CentrosDeCargaEventuales(1,ProyeccionActiva,MapaCanvas);
                   Proyecciones[ProyeccionActiva].Opciones.MostrarCentrosEventuales = true; 
                    
                }
             });


              $('#switchcarga').click(function()
             {
                $(this).toggleClass('on');
                if(SwitchActivo('switchcarga') == false)
                {
                    OcultarMostrar_Cargas(1,ProyeccionActiva,null);         
                    Proyecciones[ProyeccionActiva].Opciones.MostrarConsumidores = false;            
                }
                else
                {
                   OcultarMostrar_Cargas(1,ProyeccionActiva,MapaCanvas);
                   Proyecciones[ProyeccionActiva].Opciones.MostrarConsumidores = true;            
                    
                }
             });


              $('#switchelipse').click(function()
              {
                $(this).toggleClass('on');
                if(SwitchActivo('switchelipse') == false)
                {
                    OcultarMostrar_Elipses(1,ProyeccionActiva,null);       
                    Proyecciones[ProyeccionActiva].Opciones.MostrarElipse = false;                                
                }
                else
                {
                   OcultarMostrar_Elipses(1,ProyeccionActiva,MapaCanvas);
                   Proyecciones[ProyeccionActiva].Opciones.MostrarElipse = true;            
                }
             });



              $('#switchconsumidores').click(function()
              {
                $(this).toggleClass('on');
                if(SwitchActivo('switchconsumidores') == true)
                {
                  if(Rectangulo != null)
                  {
                      $.Notification.autoHideNotify('success', 'top right', 'Se muestran en pantalla los consumidores encontrados'); 
                      MostrarConsumidores(MapaCanvas.getCenter(), MapaCanvas)
                      VerConsumidores(true); 
                  } 
                  else
                  {
                      $.Notification.autoHideNotify('warning', 'top right', 'Para buscar consumidores en la zona es necesario que limite el mapa primero');
                  }               
                    
                }
                else
                {                   
                   VerConsumidores(false);
                }
             });



              $('#VerProyeccion1').click(function()
                 {                                      
                            if(SwitchActivo('switchglobal') == false)
                            {
                               OcultarMostrar_CentrosDeCargaEventuales(1,ProyeccionActiva,null);
                               OcultarMostrar_Elipses(1 , ProyeccionActiva,null);
                               OcultarMostrar_Cargas(1,ProyeccionActiva,null);
                               ProyeccionActiva = 0;

                               if(Proyecciones[0].Opciones.MostrarConsumidores){ToogleSwitch('carga');}
                               else{ ToogleSwitchFalse('carga');}


                               if(Proyecciones[0].Opciones.MostrarCentrosEventuales){ToogleSwitch('centroseventuales');}
                               else{ ToogleSwitchFalse('centroseventuales');}

                               if(Proyecciones[0].Opciones.MostrarElipse){ToogleSwitch('elipse');}
                               else{ ToogleSwitchFalse('elipse');}

                               if(SwitchActivo('switchcarga')  == true) OcultarMostrar_Cargas(1,ProyeccionActiva,MapaCanvas);
                               if(SwitchActivo('switchcentroseventuales')  == true) OcultarMostrar_CentrosDeCargaEventuales(1,ProyeccionActiva,MapaCanvas);
                               if(SwitchActivo('switchelipse') == true  && Proyecciones[ProyeccionActiva].ElipseDibujada == true) { OcultarMostrar_Elipses(1,ProyeccionActiva,MapaCanvas);}                    
                            }
                            else
                            {                            
                              ProyeccionActiva = 0;                                            
                              if(SwitchActivo('switchcarga') == true) OcultarMostrar_Cargas(2,ProyeccionActiva,MapaCanvas);
                              else if(SwitchActivo('switchcentroseventuales')== true) OcultarMostrar_CentrosDeCargaEventuales(2,ProyeccionActiva,MapaCanvas);
                              else if(SwitchActivo('switchelipse') == true && Proyecciones[ProyeccionActiva].ElipseDibujada == true) { OcultarMostrar_Elipses(2,ProyeccionActiva,MapaCanvas);}                                          
                            }                             
                            
                            document.getElementById("botonactiva").innerHTML = 'Proyeción 1 <span class="m-l-5"><i class=" fa fa-get-pocket"></i></span>';
                            document.getElementById("sidebartexto").innerHTML = "Proyección 1";
                                       

                });



                $('#VerProyeccion2').click(function()
                 {                                      
                            if(SwitchActivo('switchglobal') == false)
                            {
                               OcultarMostrar_CentrosDeCargaEventuales(1,ProyeccionActiva,null);
                               OcultarMostrar_Elipses(1 , ProyeccionActiva,null);
                               OcultarMostrar_Cargas(1,ProyeccionActiva,null);
                               ProyeccionActiva = 1;

                               if(Proyecciones[1].Opciones.MostrarConsumidores){ToogleSwitch('carga');}
                               else{ ToogleSwitchFalse('carga');}


                               if(Proyecciones[1].Opciones.MostrarCentrosEventuales){ToogleSwitch('centroseventuales');}
                               else{ ToogleSwitchFalse('centroseventuales');}

                               if(Proyecciones[1].Opciones.MostrarElipse){ToogleSwitch('elipse');}
                               else{ ToogleSwitchFalse('elipse');}

                               if(SwitchActivo('switchcarga')  == true) OcultarMostrar_Cargas(1,ProyeccionActiva,MapaCanvas);
                               if(SwitchActivo('switchcentroseventuales')  == true) OcultarMostrar_CentrosDeCargaEventuales(1,ProyeccionActiva,MapaCanvas);
                               if(SwitchActivo('switchelipse') == true  && Proyecciones[ProyeccionActiva].ElipseDibujada == true) { OcultarMostrar_Elipses(1,ProyeccionActiva,MapaCanvas);}                    
                            }
                            else
                            {                            
                              ProyeccionActiva = 1;                                            
                              if(SwitchActivo('switchcarga') == true) OcultarMostrar_Cargas(2,ProyeccionActiva,MapaCanvas);
                              else if(SwitchActivo('switchcentroseventuales')== true) OcultarMostrar_CentrosDeCargaEventuales(2,ProyeccionActiva,MapaCanvas);
                              else if(SwitchActivo('switchelipse') == true && Proyecciones[ProyeccionActiva].ElipseDibujada == true) { OcultarMostrar_Elipses(2,ProyeccionActiva,MapaCanvas);}                                          
                            }          
                            CopiarProyeccionPrevia(0);
                            document.getElementById("botonactiva").innerHTML = 'Proyeción 2 <span class="m-l-5"><i class=" fa fa-get-pocket"></i></span>';                            
                });



                $('#VerProyeccion3').click(function()
                 {                                      
                            if(SwitchActivo('switchglobal') == false)
                            {
                               OcultarMostrar_CentrosDeCargaEventuales(1,ProyeccionActiva,null);
                               OcultarMostrar_Elipses(1 , ProyeccionActiva,null);
                               OcultarMostrar_Cargas(1,ProyeccionActiva,null);
                               ProyeccionActiva = 2;

                               if(Proyecciones[2].Opciones.MostrarConsumidores){ToogleSwitch('carga');}
                               else{ ToogleSwitchFalse('carga');}


                               if(Proyecciones[2].Opciones.MostrarCentrosEventuales){ToogleSwitch('centroseventuales');}
                               else{ ToogleSwitchFalse('centroseventuales');}

                               if(Proyecciones[2].Opciones.MostrarElipse){ToogleSwitch('elipse');}
                               else{ ToogleSwitchFalse('elipse');}

                               if(SwitchActivo('switchcarga')  == true) OcultarMostrar_Cargas(1,ProyeccionActiva,MapaCanvas);
                               if(SwitchActivo('switchcentroseventuales')  == true) OcultarMostrar_CentrosDeCargaEventuales(1,ProyeccionActiva,MapaCanvas);
                               if(SwitchActivo('switchelipse') == true  && Proyecciones[ProyeccionActiva].ElipseDibujada == true) { OcultarMostrar_Elipses(1,ProyeccionActiva,MapaCanvas);}                    
                            }
                            else
                            {                            
                              ProyeccionActiva = 2;                                            
                              if(SwitchActivo('switchcarga') == true) OcultarMostrar_Cargas(2,ProyeccionActiva,MapaCanvas);
                              else if(SwitchActivo('switchcentroseventuales')== true) OcultarMostrar_CentrosDeCargaEventuales(2,ProyeccionActiva,MapaCanvas);
                              else if(SwitchActivo('switchelipse') == true && Proyecciones[ProyeccionActiva].ElipseDibujada == true) { OcultarMostrar_Elipses(2,ProyeccionActiva,MapaCanvas);}                                          
                            }
                            if(SegundaProyeccionActivada == true)
                            {
                                CopiarProyeccionPrevia(1);                                                                      
                                document.getElementById("botonactiva").innerHTML = 'Proyeción 3 <span class="m-l-5"><i class=" fa fa-get-pocket"></i></span>';
                                document.getElementById("sidebartexto").innerHTML = "Proyección 3";
                            }
                            else
                            {
                                $.Notification.autoHideNotify('warning', 'top right', 'Aun no ha definido la proyección dos definala antes de continuar.');
                                OcultarMostrar_CentrosDeCargaEventuales(1,ProyeccionActiva,null);
                                OcultarMostrar_Elipses(1 , ProyeccionActiva,null);
                                OcultarMostrar_Cargas(1,ProyeccionActiva,null);
                                ProyeccionActiva = 1;
                               

                               if(Proyecciones[1].Opciones.MostrarConsumidores){ToogleSwitch('carga');}
                               else{ ToogleSwitchFalse('carga');}


                               if(Proyecciones[1].Opciones.MostrarCentrosEventuales){ToogleSwitch('centroseventuales');}
                               else{ ToogleSwitchFalse('centroseventuales');}

                               if(Proyecciones[1].Opciones.MostrarElipse){ToogleSwitch('elipse');}
                               else{ ToogleSwitchFalse('elipse');}

                               if(SwitchActivo('switchcarga')  == true) OcultarMostrar_Cargas(1,ProyeccionActiva,MapaCanvas);
                               if(SwitchActivo('switchcentroseventuales')  == true) OcultarMostrar_CentrosDeCargaEventuales(1,ProyeccionActiva,MapaCanvas);
                               if(SwitchActivo('switchelipse') == true  && Proyecciones[ProyeccionActiva].ElipseDibujada == true) { OcultarMostrar_Elipses(1,ProyeccionActiva,MapaCanvas);}                    
                            }                            
                });



                $('#switchglobal').click(function()
                {
                     $('#switchglobal').toggleClass('on');
                     if(SwitchActivo('switchglobal') == true)
                     {
                          OcultarMostrar_Cargas(2,ProyeccionActiva,MapaCanvas);
                          OcultarMostrar_CentrosDeCargaEventuales(2,ProyeccionActiva,MapaCanvas);
                          OcultarMostrar_Elipses(2 , ProyeccionActiva,MapaCanvas);       
                          MostrarTodasProyecciones = true;
                          DetectarInterseccion(1);
                          ToogleSwitch('todo');      
                     }
                     else
                     {
                          OcultarMostrar_Cargas(2,ProyeccionActiva,null);
                          OcultarMostrar_Elipses(2,ProyeccionActiva,null);
                          OcultarMostrar_CentrosDeCargaEventuales(2,ProyeccionActiva,null);

                          OcultarMostrar_Cargas(1,ProyeccionActiva,MapaCanvas);
                          OcultarMostrar_Elipses(1,ProyeccionActiva,MapaCanvas);
                          OcultarMostrar_CentrosDeCargaEventuales(1,ProyeccionActiva,MapaCanvas);
                                                    
                          MostrarTodasProyecciones = false;
                     }
                });
             $('#switchcargaglobal').click(function()
             {  
                     $('#switchcargaglobal').toggleClass('on');
                     if(SwitchActivo('switchcargaglobal') == true)
                     {
                        OcultarMostrar_Elipses(2, ProyeccionActiva, null);
                        OcultarMostrar_CentrosDeCargaEventuales(2, ProyeccionActiva, null);
                        OcultarMostrar_Cargas(2, ProyeccionActiva, MapaCanvas);
                        ToogleSwitch('cargaglobal');
                        OpcionesGlobales[0].TodosCentrosCarga = true;
                        OpcionesGlobales[0].TodosCentrosEventuales = false;
                        OpcionesGlobales[0].TodasElipses = false;


                        ToogleSwitchFalse('ceglobal');
                        ToogleSwitchFalse('elipseglobal');                            
                        ToogleSwitchFalse('ocultartodo');                            
                        ToogleSwitchFalse('todo');      

                        //ActualizarLeyenda();   
                     }                     
             });


             $('#switchceglobal').click(function()
             {  
                     $('#switchceglobal').toggleClass('on');
                     if(SwitchActivo('switchceglobal') == true)
                     {
                        OcultarMostrar_Cargas(2, ProyeccionActiva, null);
                        OcultarMostrar_Elipses(2, ProyeccionActiva, null);
                        OcultarMostrar_CentrosDeCargaEventuales(2, ProyeccionActiva, MapaCanvas);
                        ToogleSwitch('ceglobal');
                        OpcionesGlobales[0].TodosCentrosCarga = false;
                        OpcionesGlobales[0].TodosCentrosEventuales = true;
                        OpcionesGlobales[0].TodasElipses = false;


                        
                        ToogleSwitchFalse('elipseglobal');                            
                        ToogleSwitchFalse('ocultartodo');                            
                        ToogleSwitchFalse('todo');      
                        ToogleSwitchFalse('cargaglobal');
                        //ActualizarLeyenda();    
                     }                     
             });


             $('#switchelipseglobal').click(function()              
             {  
                 $('#switchelipseglobal').toggleClass('on');
                 if(SwitchActivo('switchelipseglobal') == true)
                 {
                       OcultarMostrar_Cargas(2, ProyeccionActiva, null);
                       OcultarMostrar_CentrosDeCargaEventuales(2, ProyeccionActiva, null);
                       OcultarMostrar_Elipses(2, ProyeccionActiva, MapaCanvas);
                       ToogleSwitch('elipseglobal');
                       DetectarInterseccion(0);
                       OpcionesGlobales[0].TodosCentrosCarga = false;
                       OpcionesGlobales[0].TodosCentrosEventuales = false;
                       OpcionesGlobales[0].TodasElipses = true;

                        
                        ToogleSwitchFalse('ocultartodo');                            
                        ToogleSwitchFalse('todo');      
                        ToogleSwitchFalse('cargaglobal');
                        ToogleSwitchFalse('ceglobal');
                       //ActualizarLeyenda();    
                 }                 
             });


                 $('#switchtodo').click(function()
                 { 
                     $('#switchtodo').toggleClass('on');
                     if(SwitchActivo('switchtodo') == true)
                     {
                            ToogleSwitchFalse('cargaglobal');
                            ToogleSwitchFalse('ceglobal');
                            ToogleSwitchFalse('elipseglobal');                            
                            ToogleSwitchFalse('ocultartodo');                            

                            ToogleSwitch('carga');
                            ToogleSwitch('centroseventuales');
                            ToogleSwitch('elipse');
                            ToogleSwitch('todo');

                            OcultarMostrar_Cargas(2, ProyeccionActiva, MapaCanvas);
                            OcultarMostrar_CentrosDeCargaEventuales(2, ProyeccionActiva, MapaCanvas);
                            OcultarMostrar_Elipses(2, ProyeccionActiva, MapaCanvas);
                            OpcionesGlobales[0].TodosCentrosEventuales = true;
                            OpcionesGlobales[0].TodosCentrosCarga = false;
                            OpcionesGlobales[0].TodosCentrosEventuales = false;
                            OpcionesGlobales[0].TodasElipses = true;
                    //      ActualizarLeyenda();      
                     }                     
                 });


                 $('#switchocultartodo').click(function()
                 { 
                     $('#switchocultartodo').toggleClass('on');
                     if(SwitchActivo('switchocultartodo') == true)
                     {
                        OcultarMostrar_Cargas(2, ProyeccionActiva, null);
                        OcultarMostrar_CentrosDeCargaEventuales(2, ProyeccionActiva, null);
                        OcultarMostrar_Elipses(2, ProyeccionActiva, null);
                        ToogleSwitchFalse('elipseglobal');
                        ToogleSwitchFalse('ceglobal');
                        ToogleSwitchFalse('cargaglobal');                            
                        OpcionesGlobales[0].TodasElipses = false;
                        OpcionesGlobales[0].TodosCentrosCarga = false;
                        OpcionesGlobales[0].TodosCentrosEventuales = false;

                        ToogleSwitchFalse('cargaglobal');
                        ToogleSwitchFalse('ceglobal');
                        ToogleSwitchFalse('elipseglobal');                            
                        ToogleSwitchFalse('todo');
                        

                        //ActualizarLeyenda();       
                     }                     
                 });

             $('#switchtiemporeal').toggleClass('on');             
             $('#switchcarga').toggleClass('on');
             $('#switchelipse').toggleClass('on');
             $('#switchcentroseventuales').toggleClass('on');
             $("#tablaconsumidores").footable();   
             $("#tablaespaciostrabajo").footable();
             $("#tablapotencia").footable();
             $("#range_01").ionRangeSlider();
             $("#range_02").ionRangeSlider();
             $("#range_03").ionRangeSlider();
             $('#cpicker1').colorpicker();
             $('#cpicker2').colorpicker();
             $('#cpicker3').colorpicker();             
             ImprimirVariables(0);                          


            $(window).resize(function () {
                var body = document.body, html = document.documentElement;
                var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight) - 200;
                document.getElementById('Rowmapa').style.height = height + 'px';

                document.getElementById('montaña1').style.height = (height - 108) + 'px';
                document.getElementById('montaña2').style.height = (height - 108) + 'px';
                document.getElementById('montaña3').style.height = (height - 108) + 'px';    

            });


    $('#MapaTab').click(function (event) {
        $('#Rowmontaña').hide();
        $('#Rowmontaña2').hide();
        $('#Rowmontaña3').hide();
        $('#Rowmapa').show();

    });

    $('#Mt1').click(function (event) {
        $('#Rowmapa').hide();
        $('#Rowmontaña2').hide();
        $('#Rowmontaña3').hide();
        $('#Rowmontaña').show();
    });

    $('#Mt2').click(function (event) {
        $('#Rowmapa').hide();
        $('#Rowmontaña').hide();
        $('#Rowmontaña3').hide();
        $('#Rowmontaña2').show();
    });

    $('#Mt3').click(function (event) {
        $('#Rowmapa').hide();
        $('#Rowmontaña2').hide();
        $('#Rowmontaña').hide();
        $('#Rowmontaña3').show();
    });
});





function MostrarOcultarContenedor(Contenedor)
{
	if(Activo != Contenedor)
	{
	    $(("#"+Activo)).hide(100);
	    $(("#"+Contenedor)).show(100 );
	}		

}


function SwitchActivo(SwitchId)
{
    if(($('#'+SwitchId).attr('class')).search('on') != -1)
    {
        return true;
    }
    else
    {
        return false;
    }
}

function ToogleSwitch(SwitchID)
{

    $('#switch'+SwitchID).toggleClass('on');
    if(SwitchActivo('switch'+SwitchID) == false)
    {
        $('#switch'+SwitchID).toggleClass('on');
    }
}

function ToogleSwitchFalse(SwitchID)
{
    $('#switch'+SwitchID).toggleClass('on');
    if(SwitchActivo('switch'+SwitchID) == true)
    {
        $('#switch'+SwitchID).toggleClass('on');
    }
     
}



