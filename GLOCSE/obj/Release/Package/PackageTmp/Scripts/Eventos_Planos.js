var  div, Menu, elements, EmergenteCanvas;
var ProyeccionPlano = new Array();

function InicializarCanvas()
{

					Menu = document.getElementById('CanvasContextual');
					elements = document.getElementsByClassName('Ocultos'); 
					div = document.getElementById('Canvas-container');
					EmergenteCanvas = document.getElementById('ContenedorEmergenteCanvas');


	                $('#alternar-espacio').on('click',function()
	                 {	
	                        if(document.getElementById('alternar-espacio').checked)
	                          {
	                              document.getElementById('Mapa').style.display = "none";
	                            
	                              for(var i = 0, length = elements.length; i < length; i++) 
	                              {
	                              
	                                  elements[i].style.display = 'block';                               
	                              }
									 document.getElementById('canvas').width = div.offsetWidth;
									 document.getElementById('canvas').height = div.offsetHeight;                
                                     OperacionesPlano();
                                     ProyeccionActiva = 3;
	                           }
	                        else
	                        {
	                            document.getElementById('Mapa').style.display = "block";
	                             
	                             for(var i = 0, length = elements.length; i < length; i++) 
	                             {
	                                  elements[i].style.display = 'none';  
	                        	 }
	                        }
	                 });

	                $('#Canvas-container').mousedown(function(e) 
	                { 
	                          if((e.which == 3) && ($('#alternar-espacio').prop('checked')) && (!State())) 
	                          {
	                              $("#CanvasContextual").hide();  
	                              if ((TopContenedor-351) > -110)
	                              {
	                                  Menu.style.top= (TopContenedor-50).toString()+"px";                                                         
	                              }
	                              else   
	                              {    
	                                 Menu.style.top= (TopContenedor-50).toString()+"px";                                                 
	                              }

	                              Menu.style.left= (LeftContendor).toString()+"px";
	                              
	                              $("#CanvasContextual").slideDown(50);
	                          
	                          }
	                          
						      else if((e.which == 3) && ($('#alternar-espacio').prop('checked')) && ( State() ))
	                          {
	                          	if (Proyecciones[3].Contador < 11) { }

	                          	else { alert('Ha ubicado 10 Marcadores')  }
	                          }

	                          else if((e.wich == 1) && State() )
	                          {
	                          	MarcadorSeleccionado(null,null);
	                          }                       
	                });
 $("#CanvasContextual").hover(function(){}, function() 
	                {     
	                    $("#CanvasContextual").hide();
	                });




	               /*Ocultar contenedor emergente en el area del plano */
	               $("#ContenedorEmergenteCanvas").hover(function(){}, function() 
                	{                    
                    	$("#ContenedorEmergenteCanvas").hide(300);
                	});

	            	$("#Cat1CentroEventualCanvas").change(function () 
	                {
	                 ActualizarCategoriaMarcadorCanvas('1');
	                });

	                // Cambia el icono a categoria 2
	                $("#Cat2CentroEventualCanvas").change(function () 
	                {
	                  ActualizarCategoriaMarcadorCanvas('2');
	                });

	                // Cambia el icono a categoria 3
	                $("#Cat3CentroEventualCanvas").change(function () 
	                {
                    ActualizarCategoriaMarcadorCanvas('3');
                     });

                    $("#ConfirmarCambiosCanvas").click(function(e)
	                {                          
	                    MarcadorSeleccionado(null,'Horas');
	                    
	                });

	                $( "#Canvas-container").mousemove(function( event ) 
                  	{  
	                    if(ActivoDiv == true)
	                    {
	                    	MarcadorSeleccionado(null,null);
	                        var OFFSIDE = $('#Canvas-container').offset();            
	                    	LeftContendor = event.clientX - OFFSIDE.left;
	                        TopContenedor = event.clientY - OFFSIDE.top; 


	                        document.getElementById('TablaInformacion').rows[1].cells[0].innerHTML = '('+Math.trunc((LeftContendor))+','+(Math.trunc(Math.abs(TopContenedor-Altura)))+')';
	                        var Lat  = Coordenadas_Cartesianas_APunto({x:LeftContendor,y:TopContenedor});
	                        document.getElementById('TablaInformacion').rows[1].cells[1].innerHTML  ='(? , ?)';
	                    }                                     
                 	});


}