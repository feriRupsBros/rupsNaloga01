var MAINPM10 = null
var MAINPM2_5 = null
var MAINCO = null
var MAINSO2 = null
var MAINO3 = null
var MAINNO2 = null
var MAINC6H6 = null

async function getAirPollutions() {
    const res = await fetch('/air_pollution')
    const data = await res.json();
    getAdminPrefsColor(data)
}

async function getAdminPrefsColor(data) {
    const res = await fetch('/admin/prefs')
    const colors = await res.json();
    loadGraph1(data, colors)
}

function loadGraph1(data, colors) {
    graph1 = document.getElementById('graph1').getContext('2d');
    var labels1 = new Array(0)
    var PM10_1 = new Array(0)
    var PM2_5_1 = new Array(0)
    var CO_1 = new Array(0)
    var SO2_1 = new Array(0)
    var O3_1 = new Array(0)
    var NO2_1 = new Array(0)
    var C6H6_1 = new Array(0)
    for (let i in data) {
        labels1.push(data[i].name)
        PM10_1.push(data[i].concentrations.PM10)
        PM2_5_1.push(data[i].concentrations.PM2_5)
        CO_1.push(data[i].concentrations.CO)
        SO2_1.push(data[i].concentrations.SO2)
        O3_1.push(data[i].concentrations.O3)
        NO2_1.push(data[i].concentrations.NO2)
        C6H6_1.push(data[i].concentrations.C6H6)
    }

    let no1 = new Chart(graph1, {
        type: 'bar', // bar, horizontalBar (removed), pie, line, doughnut, radar, polarArea
        data: {
            labels: labels1,
            datasets: [{
                label: 'PM10',
                data: PM10_1,
                backgroundColor: colors.color1,
                borderWidth: 1,
                borderColor: 'black',
                hoverBorderWidth: 2,
                hoverBorderColor: 'black',
            },
            {
                label: 'PM2.5',
                data: PM2_5_1,
                backgroundColor: colors.color2,
                borderWidth: 1,
                borderColor: 'black',
                hoverBorderWidth: 2,
                hoverBorderColor: 'black',
            },
            {
                label: 'SO2',
                data: SO2_1,
                backgroundColor: colors.color3,
                borderWidth: 1,
                borderColor: 'black',
                hoverBorderWidth: 2,
                hoverBorderColor: 'black',
            },
            {
                label: 'CO',
                data: CO_1,
                backgroundColor: colors.color4,
                borderWidth: 1,
                borderColor: 'black',
                hoverBorderWidth: 2,
                hoverBorderColor: 'black',
            },
            {
                label: 'O3',
                data: O3_1,
                backgroundColor: colors.color5,
                borderWidth: 1,
                borderColor: 'black',
                hoverBorderWidth: 2,
                hoverBorderColor: 'black',
            },
            {
                label: 'NO2',
                data: NO2_1,
                backgroundColor: colors.color6,
                borderWidth: 1,
                borderColor: 'black',
                hoverBorderWidth: 2,
                hoverBorderColor: 'black',
            },
            {
                label: 'C6H6',
                data: C6H6_1,
                backgroundColor: colors.color7,
                borderWidth: 1,
                borderColor: 'black',
                hoverBorderWidth: 2,
                hoverBorderColor: 'black',
            }],
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                    }
                }]
            }
        }
    })
    document.getElementById("PM10").onclick = function () { deciderPM10(no1) };
    document.getElementById("PM2_5").onclick = function () { deciderPM2_5(no1) };
    document.getElementById("SO2").onclick = function () { deciderSO2(no1) };
    document.getElementById("CO").onclick = function () { deciderCO(no1) };
    document.getElementById("O3").onclick = function () { deciderO3(no1) };
    document.getElementById("NO2").onclick = function () { deciderNO2(no1) };
    document.getElementById("C6H6").onclick = function () { deciderC6H6(no1) };
}

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function deciderPM10(chart) {
    if (document.getElementById("PM10").checked) {
        addPM10(chart)
    }
    else {
        removePM10(chart)
    }
}

function addPM10(chart) {
    var r = chart.data.datasets.length
    var arr = new Array(0)
    for (let i = 0; i < r; i++) {
        arr.push(chart.data.datasets.pop())
    }
    chart.data.datasets.push(MAINPM10)
    MAINPM10 = null
    arr.reverse()
    for (let i = 0; i < arr.length; i++) {
        chart.data.datasets.push(arr[i])
    }
    chart.update()
}

function removePM10(chart) {
    var r = chart.data.datasets.length
    var arr = new Array(0)
    for (let i = 0; i < r - 1; i++) {
        arr.push(chart.data.datasets.pop())
    }
    MAINPM10 = chart.data.datasets.pop()
    arr.reverse()
    for (let i = 0; i < arr.length; i++) {
        chart.data.datasets.push(arr[i])
    }
    chart.update()
}

function deciderPM2_5(chart) {
    if (document.getElementById("PM2_5").checked) {
        addPM2_5(chart)
    }
    else {
        removePM2_5(chart)
    }
}

function addPM2_5(chart) {
    var z = 0
    var r = chart.data.datasets.length
    var arr = new Array(0)
    for (let i = 0; i < r; i++) {
        arr.push(chart.data.datasets.pop())
    }
    arr.reverse()
    if (MAINPM10 == null) {
        chart.data.datasets.push(arr[0])
        z = 1
    }
    chart.data.datasets.push(MAINPM2_5)
    MAINPM2_5 = null

    for (let i = z; i < arr.length; i++) {
        chart.data.datasets.push(arr[i])
    }
    chart.update()
}

function removePM2_5(chart) {
    var r = chart.data.datasets.length
    var arr = new Array(0)
    for (let i = 0; i < r; i++) {
        if (chart.data.datasets[r - i - 1].label == "PM2.5") {
            MAINPM2_5 = chart.data.datasets.pop()
            break
        }
        else {
            arr.push(chart.data.datasets.pop())
        }

    }
    arr.reverse()
    for (let i = 0; i < arr.length; i++) {
        chart.data.datasets.push(arr[i])
    }
    chart.update()
}

function deciderSO2(chart) {
    if (document.getElementById("SO2").checked) {
        addSO2(chart)
    }
    else {
        removeSO2(chart)
    }
}

function addSO2(chart) {
    var z = 0
    var r = chart.data.datasets.length
    var arr = new Array(0)
    for (let i = 0; i < r; i++) {
        arr.push(chart.data.datasets.pop())
    }
    arr.reverse()
    if (!MAINPM10) {
        chart.data.datasets.push(arr[z])
        z = z + 1
    }
    if (!MAINPM2_5) {
        chart.data.datasets.push(arr[z])
        z = z + 1
    }
    chart.data.datasets.push(MAINSO2)
    MAINSO2 = null

    for (let i = z; i < arr.length; i++) {
        chart.data.datasets.push(arr[i])
    }
    chart.update()
}

function removeSO2(chart) {
    var r = chart.data.datasets.length
    var arr = new Array(0)
    for (let i = 0; i < r; i++) {
        if (chart.data.datasets[r - i - 1].label == "SO2") {
            MAINSO2 = chart.data.datasets.pop()
            break
        }
        else {
            arr.push(chart.data.datasets.pop())
        }

    }
    arr.reverse()
    for (let i = 0; i < arr.length; i++) {
        chart.data.datasets.push(arr[i])
    }
    chart.update()
}

function deciderCO(chart) {
    if (document.getElementById("CO").checked) {
        addCO(chart)
    }
    else {
        removeCO(chart)
    }
}

function addCO(chart) {
    var z = 0
    var r = chart.data.datasets.length
    var arr = new Array(0)
    for (let i = 0; i < r; i++) {
        arr.push(chart.data.datasets.pop())
    }
    arr.reverse()
    if (!MAINPM10) {
        chart.data.datasets.push(arr[z])
        z = z + 1
    }
    if (!MAINPM2_5) {
        chart.data.datasets.push(arr[z])
        z = z + 1
    }
    if (!MAINSO2) {
        chart.data.datasets.push(arr[z])
        z = z + 1
    }
    chart.data.datasets.push(MAINCO)
    MAINCO = null

    for (let i = z; i < arr.length; i++) {
        chart.data.datasets.push(arr[i])
    }
    chart.update()
}

function removeCO(chart) {
    var r = chart.data.datasets.length
    var arr = new Array(0)
    for (let i = 0; i < r; i++) {
        if (chart.data.datasets[r - i - 1].label == "CO") {
            MAINCO = chart.data.datasets.pop()
            break
        }
        else {
            arr.push(chart.data.datasets.pop())
        }

    }
    arr.reverse()
    for (let i = 0; i < arr.length; i++) {
        chart.data.datasets.push(arr[i])
    }
    chart.update()
}

function deciderO3(chart) {
    if (document.getElementById("O3").checked) {
        addO3(chart)
    }
    else {
        removeO3(chart)
    }
}

function addO3(chart) {
    var z = 0
    var r = chart.data.datasets.length
    var arr = new Array(0)
    for (let i = 0; i < r; i++) {
        arr.push(chart.data.datasets.pop())
    }
    arr.reverse()
    if (!MAINPM10) {
        chart.data.datasets.push(arr[z])
        z = z + 1
    }
    if (!MAINPM2_5) {
        chart.data.datasets.push(arr[z])
        z = z + 1
    }
    if (!MAINSO2) {
        chart.data.datasets.push(arr[z])
        z = z + 1
    }
    if (!MAINCO) {
        chart.data.datasets.push(arr[z])
        z = z + 1
    }
    chart.data.datasets.push(MAINO3)
    MAINO3 = null

    for (let i = z; i < arr.length; i++) {
        chart.data.datasets.push(arr[i])
    }
    chart.update()
}

function removeO3(chart) {
    var r = chart.data.datasets.length
    var arr = new Array(0)
    for (let i = 0; i < r; i++) {
        if (chart.data.datasets[r - i - 1].label == "O3") {
            MAINO3 = chart.data.datasets.pop()
            break
        }
        else {
            arr.push(chart.data.datasets.pop())
        }

    }
    arr.reverse()
    for (let i = 0; i < arr.length; i++) {
        chart.data.datasets.push(arr[i])
    }
    chart.update()
}

function deciderNO2(chart) {
    if (document.getElementById("NO2").checked) {
        addNO2(chart)
    }
    else {
        removeNO2(chart)
    }
}

function addNO2(chart) {
    var z = 0
    var r = chart.data.datasets.length
    var arr = new Array(0)
    for (let i = 0; i < r; i++) {
        arr.push(chart.data.datasets.pop())
    }
    arr.reverse()
    if (!MAINPM10) {
        chart.data.datasets.push(arr[z])
        z = z + 1
    }
    if (!MAINPM2_5) {
        chart.data.datasets.push(arr[z])
        z = z + 1
    }
    if (!MAINSO2) {
        chart.data.datasets.push(arr[z])
        z = z + 1
    }
    if (!MAINCO) {
        chart.data.datasets.push(arr[z])
        z = z + 1
    }
    if (!MAINO3) {
        chart.data.datasets.push(arr[z])
        z = z + 1
    }
    chart.data.datasets.push(MAINNO2)
    MAINNO2 = null

    for (let i = z; i < arr.length; i++) {
        //console.log(i)
        //console.log(arr[i])
        chart.data.datasets.push(arr[i])
    }
    chart.update()
}

function removeNO2(chart) {
    var r = chart.data.datasets.length
    var arr = new Array(0)
    for (let i = 0; i < r; i++) {
        if (chart.data.datasets[r - i - 1].label == "NO2") {
            MAINNO2 = chart.data.datasets.pop()
            break
        }
        else {
            arr.push(chart.data.datasets.pop())
        }

    }
    arr.reverse()
    for (let i = 0; i < arr.length; i++) {
        chart.data.datasets.push(arr[i])
    }
    chart.update()
}

function deciderC6H6(chart) {
    if (document.getElementById("C6H6").checked) {
        addC6H6(chart)
    }
    else {
        removeC6H6(chart)
    }
}

function addC6H6(chart) {
    var z = 0
    var r = chart.data.datasets.length
    var arr = new Array(0)
    for (let i = 0; i < r; i++) {
        arr.push(chart.data.datasets.pop())
    }
    arr.reverse()
    if (!MAINPM10) {
        chart.data.datasets.push(arr[z])
        z = z + 1
    }
    if (!MAINPM2_5) {
        chart.data.datasets.push(arr[z])
        z = z + 1
    }
    if (!MAINSO2) {
        chart.data.datasets.push(arr[z])
        z = z + 1
    }
    if (!MAINCO) {
        chart.data.datasets.push(arr[z])
        z = z + 1
    }
    if (!MAINO3) {
        chart.data.datasets.push(arr[z])
        z = z + 1
    }
    if (!MAINNO2) {
        chart.data.datasets.push(arr[z])
        z = z + 1
    }
    chart.data.datasets.push(MAINC6H6)
    MAINC6H6 = null

    for (let i = z; i < arr.length; i++) {
        chart.data.datasets.push(arr[i])
    }
    chart.update()
}

function removeC6H6(chart) {
    var r = chart.data.datasets.length
    var arr = new Array(0)
    for (let i = 0; i < r; i++) {
        if (chart.data.datasets[r - i - 1].label == "C6H6") {
            MAINC6H6 = chart.data.datasets.pop()
            break
        }
        else {
            arr.push(chart.data.datasets.pop())
        }

    }
    arr.reverse()
    for (let i = 0; i < arr.length; i++) {
        chart.data.datasets.push(arr[i])
    }
    chart.update()
}

getAirPollutions()