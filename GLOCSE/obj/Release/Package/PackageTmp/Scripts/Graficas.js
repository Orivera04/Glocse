var ArreglosGrafica = new Array();
var ChartGraficaSumatoria = null;
var MontañaBase64 = null;
function Datos_Graficas(Proyecciones, ProyeccionActual) {

    //REVISAR PARTE PARA REINICIAR LOS CANVAS DE GRAFICAS//
    $("#GraficaA").empty();
    $("#GraficaB").empty();
    $("#GraficaC").empty();
    $("#GraficaD").empty();
    $("#GraficaE").empty();
    $("#GraficaF").empty();
    $("#GraficaG").empty();
    $("#GraficaH").empty();
    $("#GraficaI").empty();
    $("#GraficaJ").empty();
    $("#myChartTOTAL").empty();

    Consumidores(Proyecciones, ProyeccionActual);

}

function Consumidores(Proyecciones, ProyeccionActual) {
    Proyecciones[ProyeccionActual].Sumatoria = new Array();
    var Horas = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    Proyecciones[ProyeccionActual].Sumatoria.push(Horas);
    if (ArreglosGrafica.length > 0) {
        ArreglosGrafica.forEach(function (GraficaConsumidor) {
            if (GraficaConsumidor != null) {
                GraficaConsumidor.destroy();
            }
        });
    }
    //Realizacion de Graficos de Barras por Consumidor
    for (var J = 0; J <= (Proyecciones[ProyeccionActual].MarcadoresCollecion.length) - 1; J++) {
        ArreglosGrafica.push(Graficando_Consumidores(Proyecciones, ProyeccionActual, J));
    }

    //Realizacion de Grafico de Barra TOTAL
    for (var I = 0; I <= 23; I++) {
        for (var J = 0; J <= (Proyecciones[ProyeccionActual].MarcadoresCollecion.length) - 1; J++) {
            Proyecciones[ProyeccionActual].Sumatoria[0][I] = Proyecciones[ProyeccionActual].Sumatoria[0][I] + Proyecciones[ProyeccionActual].MarcadoresCollecion[J].Horas[I];
        }
    }

    Graficando_Sumatoria(ProyeccionActual);
}


function Graficando_Consumidores(Proyecciones, ProyeccionActual, J) {

    Chart.plugins.register
        ({
            beforeDraw: function (chartInstance) {
                var ctx = chartInstance.chart.ctx;
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
            }
        });

    Chart.defaults.global.defaultFontFamily = "Gotham Rounded A";
    Chart.defaults.roundedBar = Chart.helpers.clone(Chart.defaults.bar);
    Chart.controllers.roundedBar = Chart.controllers.bar.extend
        ({
            dataElementType: Chart.elements.RoundedTopRectangle
        });

    var ctx = document.getElementById('Grafica' + (Alfabeto[J]).toString()).getContext('2d');
    var Grafica = {
        type: 'roundedBar',
        data:
        {
            labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"],
            datasets:
            [
                {
                    label: 'Potencias',
                    backgroundColor: [
                        '#626EEF',
                        '#FF5757',
                        '#4BC0C0',
                        '#6C5070',
                        '#3E3E3E',
                        '#FFDD67',
                        '#626EEF',
                        '#FF5757',
                        '#4BC0C0',
                        '#6C5070',
                        '#3E3E3E',
                        '#FFDD67',
                        '#C2C4D1',
                        '#5EB0DE',
                        '#C2C4D1',
                        '#5EB0DE',
                        '#C2C4D1',
                        '#5EB0DE',
                        '#626EEF',
                        '#FF5757',
                        '#4BC0C0',
                        '#6C5070',
                        '#3E3E3E',
                        '#FFDD67',
                    ],
                    borderColor:
                    [
                        '#626EEF',
                        '#FF5757',
                        '#4BC0C0',
                        '#6C5070',
                        '#3E3E3E',
                        '#FFDD67',
                        '#626EEF',
                        '#FF5757',
                        '#4BC0C0',
                        '#6C5070',
                        '#3E3E3E',
                        '#FFDD67',
                        '#C2C4D1',
                        '#5EB0DE',
                        '#C2C4D1',
                        '#5EB0DE',
                        '#C2C4D1',
                        '#5EB0DE',
                        '#626EEF',
                        '#FF5757',
                        '#4BC0C0',
                        '#6C5070',
                        '#3E3E3E',
                        '#FFDD67',
                    ],
                    borderWidth: 1,
                    data: Proyecciones[ProyeccionActual].MarcadoresCollecion[J].Horas,
                }
            ]
        },
        options:
        {
            barRoundness: 0.5,
            animation: { duration: 0, },

            title:
            {
                display: true,
                fontSize: 30               
            },
            scales:
            {
                yAxes:
                [{
                    scaleLabel:
                    {
                        display: true,
                        fontSize: 15,
                        labelString: "Consumo Potencia x100KVA"
                    },

                    ticks:
                    {
                        maxTicksLimit: 5,
                        beginAtZero: true
                    }
                }],
                xAxes:
                [{
                    scaleLabel:
                    {
                        display: true,
                        labelString: "Horas (1 - 24)",
                        fontSize: 15
                    },
                    gridLines:
                    {
                        display: true
                    }
                }]
            },
            legend:
            {
                display: true,
                position: "bottom",
                fontFamily: ""
            }
        }
    }
    var chart = new Chart(ctx, Grafica);
    return chart;
}

function Graficando_Sumatoria(ProyeccionActual) {

    Chart.plugins.register
        ({
            beforeDraw: function (chartInstance) {
                var ctx = chartInstance.chart.ctx;
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
            }
        });

    Chart.defaults.global.defaultFontFamily = "Gotham Rounded A";
    Chart.defaults.roundedBar = Chart.helpers.clone(Chart.defaults.bar);
    Chart.controllers.roundedBar = Chart.controllers.bar.extend
        ({
            dataElementType: Chart.elements.RoundedTopRectangle
        });

    var ctx = document.getElementById('myChartTOTAL').getContext('2d');
    var GraficaSumatoriaGrafica = {
        type: 'roundedBar',
        data:
        {
            labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"],
            datasets:
            [
                {
                    label: 'Potencias',
                    backgroundColor: [
                        '#626EEF',
                        '#FF5757',
                        '#4BC0C0',
                        '#6C5070',
                        '#3E3E3E',
                        '#FFDD67',
                        '#626EEF',
                        '#FF5757',
                        '#4BC0C0',
                        '#6C5070',
                        '#3E3E3E',
                        '#FFDD67',
                        '#C2C4D1',
                        '#5EB0DE',
                        '#C2C4D1',
                        '#5EB0DE',
                        '#C2C4D1',
                        '#5EB0DE',
                        '#626EEF',
                        '#FF5757',
                        '#4BC0C0',
                        '#6C5070',
                        '#3E3E3E',
                        '#FFDD67',
                    ],
                    borderColor:
                    [
                        '#626EEF',
                        '#FF5757',
                        '#4BC0C0',
                        '#6C5070',
                        '#3E3E3E',
                        '#FFDD67',
                        '#626EEF',
                        '#FF5757',
                        '#4BC0C0',
                        '#6C5070',
                        '#3E3E3E',
                        '#FFDD67',
                        '#C2C4D1',
                        '#5EB0DE',
                        '#C2C4D1',
                        '#5EB0DE',
                        '#C2C4D1',
                        '#5EB0DE',
                        '#626EEF',
                        '#FF5757',
                        '#4BC0C0',
                        '#6C5070',
                        '#3E3E3E',
                        '#FFDD67',
                    ],
                    borderWidth: 1,
                    data: Proyecciones[ProyeccionActual].Sumatoria[0],
                }
            ]
        },
        options:
        {
            barRoundness: 0.5,
            animation: { duration: 0, },

            title:
            {
                display: true,
                fontSize: 30,
                text: 'Potencias Totales'
            },
            scales:
            {
                yAxes:
                [{
                    scaleLabel:
                    {
                        display: true,
                        fontSize: 15,
                        labelString: "Consumo Potencia x100KVA"
                    },

                    ticks:
                    {
                        maxTicksLimit: 5,
                        beginAtZero: true
                    }
                }],
                xAxes:
                [{
                    scaleLabel:
                    {
                        display: true,
                        labelString: "Horas (1 - 24)",
                        fontSize: 15
                    },
                    gridLines:
                    {
                        display: true
                    }
                }]
            },
            legend:
            {
                display: true,
                position: "bottom",
                fontFamily: ""
            }
        }
    }
    if (ChartGraficaSumatoria != null) { ChartGraficaSumatoria.destroy(); }
    var ctx = document.getElementById('myChartTOTAL').getContext('2d');
    ChartGraficaSumatoria = new Chart(ctx, GraficaSumatoriaGrafica);
    Proyecciones[ProyeccionActual].Sumatoria[0].push(Math.min.apply(null, Proyecciones[ProyeccionActual].Sumatoria[0]));
    Proyecciones[ProyeccionActual].Sumatoria[0].push((Proyecciones[ProyeccionActual].Sumatoria[0].reduce((x, y) => x + y) / 24).toFixed(2));
    Proyecciones[ProyeccionActual].Sumatoria[0].push(Math.max.apply(null, Proyecciones[ProyeccionActual].Sumatoria[0]));
}

Chart.helpers.drawRoundedTopRectangle = function (ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);

    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);

    ctx.lineTo(x + width, y + height);

    ctx.lineTo(x, y + height);

    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
};

Chart.elements.RoundedTopRectangle = Chart.elements.Rectangle.extend(
    {
        draw: function () {
            var ctx = this._chart.ctx;
            var vm = this._view;
            var left, right, top, bottom, signX, signY, borderSkipped;
            var borderWidth = vm.borderWidth;

            if (!vm.horizontal) {
                // bar
                left = vm.x - vm.width / 2;
                right = vm.x + vm.width / 2;
                top = vm.y;
                bottom = vm.base;
                signX = 1;
                signY = bottom > top ? 1 : -1;
                borderSkipped = vm.borderSkipped || 'bottom';
            }
            else {
                // horizontal bar
                left = vm.base;
                right = vm.x;
                top = vm.y - vm.height / 2;
                bottom = vm.y + vm.height / 2;
                signX = right > left ? 1 : -1;
                signY = 1;
                borderSkipped = vm.borderSkipped || 'left';
            }


            if (borderWidth) {

                var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
                borderWidth = borderWidth > barSize ? barSize : borderWidth;
                var halfStroke = borderWidth / 2;

                var borderLeft = left + (borderSkipped !== 'left' ? halfStroke * signX : 0);
                var borderRight = right + (borderSkipped !== 'right' ? -halfStroke * signX : 0);
                var borderTop = top + (borderSkipped !== 'top' ? halfStroke * signY : 0);
                var borderBottom = bottom + (borderSkipped !== 'bottom' ? -halfStroke * signY : 0);

                if (borderLeft !== borderRight) {
                    top = borderTop;
                    bottom = borderBottom;
                }

                if (borderTop !== borderBottom) {
                    left = borderLeft;
                    right = borderRight;
                }
            }


            var barWidth = Math.abs(left - right);
            var roundness = this._chart.config.options.barRoundness || 0.5;
            var radius = barWidth * roundness * 0.5;


            var prevTop = top;


            top = prevTop + radius;
            var barRadius = top - prevTop;

            ctx.beginPath();
            ctx.fillStyle = vm.backgroundColor;
            ctx.strokeStyle = vm.borderColor;
            ctx.lineWidth = borderWidth;


            Chart.helpers.drawRoundedTopRectangle(ctx, left, (top - barRadius + 1), barWidth, bottom - prevTop, barRadius);

            ctx.fill();
            if (borderWidth) {
                ctx.stroke();
            }


            top = prevTop;
        },
    });


function Graficando_Hill(XPoint, YPoint, XSigma, YSigma, r, PUNTOS_X, PUNTOS_Y, RadioX, RadioY,NGrafica) {

    var VariacionColor;
    if(NGrafica == 1)
    {
        VariacionColor = 'Bluered';
    }
    else if(NGrafica == 2)
    {
        VariacionColor = 'Reds';       
    }
    else
    {
        VariacionColor = 'Hot';
    }
    var PUNTOS_Z = new Array();
    var LimitX1 = XPoint - (1 * RadioX);
    var LimitX2 = XPoint + (1 * RadioX);

    var LimitY1 = YPoint - (1 * RadioY);
    var LimitY2 = YPoint + (1 * RadioY);

    for (I = LimitX1; I <= LimitX2 - 1; I++) {
        Auxiliar = [];
        for (J = LimitY1; J <= LimitY2 - 1; J++) {
            Auxiliar.push((((1) / (2 * (Math.PI) * (XSigma) * (YSigma) * (Math.sqrt(1 - (Math.pow(r, 2)))))) * (Math.pow((Math.E), (((-1 / (2 * (1 - (Math.pow(r, 2))))) * (((Math.pow((I - XPoint), 2)) / (Math.pow(XSigma, 2))) - (((2 * r) * (I - XPoint) * (J - YPoint)) / (XSigma * YSigma)) + ((Math.pow((J - YPoint), 2)) / (Math.pow(YSigma, 2))))))))));
        }

        PUNTOS_Z.push(Auxiliar);
    }

    var data =
        [{
            z: PUNTOS_Z,
            type: 'surface',
            colorscale: VariacionColor          
        }];

    var layout =
        {                            
            margin:
            {
               t: 20, 
               l: 20,         
               r: 20,
               b: 20 
            },
        width: $('#containermapa').width()
        };

    var config = { responsive: true }


    Plotly.newPlot('montaña' + NGrafica, data, layout, config);
}


