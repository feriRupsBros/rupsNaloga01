mapboxgl.accessToken = 'pk.eyJ1IjoianVyZWQxMDAiLCJhIjoiY2wzZzMwc25zMHZjdzNjb2ZnOWVjNm9qZiJ9.gg0wAHzk-38mZBG0BFdvyQ';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/jured100/cl3g2pl50007f14ndg4axfqec', // Reserve: mapbox://styles/mapbox/streets-v11
    center: [14.903342, 46.152543],
    zoom: 7.2
});

/*const map2 = new mapboxgl.Map({
    container: 'map2',
    style: 'mapbox://styles/jured100/cl3g2pl50007f14ndg4axfqec', // Reserve: mapbox://styles/mapbox/streets-v11
    center: [14.903342, 46.152543],
    zoom: 7.2
});*/

async function getAirPollutions() {
    const res = await fetch('/air_pollution')
    const data = await res.json();



    const airpollutions = data.map(airpollution => {
        return {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [airpollution.geo.coordinates[0], airpollution.geo.coordinates[1]]
            },
            'properties': {
                'name': airpollution.name,
                'region': airpollution.region,
                'source': airpollution.source,
                'PM10': airpollution.concentrations.PM10,
                'datetime': parseFloat(airpollution.date_time_of_measurement.measuring_start.replace(/\D/g, '').substring(0, 8))
            }
        }
    })
    var datetime = new Array(0)
    for (var i = 0; i < data.length; i++) {
        datetime.push(data[i].date_time_of_measurement.measuring_start.replace(/\D/g, '').substring(0, 8))
    }

    loadMap(airpollutions)
    // loadMap2(airpollutions, datetime)
}

getAirPollutions()

function loadMap(airpollutions) {
    const geojson = {
        'type': 'FeatureCollection',
        features: airpollutions
    };

    for (const feature of geojson.features) {
        const el = document.createElement('div');
        el.className = 'marker';

        new mapboxgl.Marker(el)
            .setLngLat(feature.geometry.coordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 })
                    .setHTML(
                        `<h3>${feature.properties.name}</h3><p>${feature.properties.region}</p><p>${feature.properties.source}</p><form action="/prikazi.html"><input type="hidden" id="airName" name="airName" value="${feature.properties.name}"><button type="submit" class="btn btn-secondary btn-sm">Prikaži več</button></form>`
                    )
            )
            .addTo(map);
    }
}

async function loadMap2(airpollutions, datetime) {
    const geojson = {
        'type': 'FeatureCollection',
        features: airpollutions
    };

    await map2.addLayer({
        id: 'PM10s',
        type: 'circle',
        source: {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: airpollutions
            }
        },
        paint: {
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['number', ['get', 'PM10']],
                0,
                5,
                10,
                15
            ],
            'circle-color': [
                'interpolate',
                ['linear'],
                ['number', ['get', 'PM10']],
                5,
                '#2DC4B2',
                10,
                '#3BB3C3',
                15,
                '#669EC4',
                20,
                '#8B88B6',
                25,
                '#A2719B',
                30,
                '#AA5E79'
            ],
            'circle-opacity': 0.5,
        },
        filter: ['==', ['number', ['get', 'datetime']], 20220501]
    })
    slideshower()
}

async function slideshower() {
    const slider = document.getElementById("slider");
    slider.addEventListener('input', (event) => {
        var date = parseInt(event.target.value);
        var r = date
        var x = "202205"
        if (date < 10) {
            x = x + "0"
        }
        date = x + date.toString()
        date = parseInt(date)
        map2.setFilter('PM10s', ['==', ['number', ['get', 'datetime']], date])
        document.getElementById('date').innerText = r
    });

    var values = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31);
    var count = 0;
    var length = values.length - 1;

    function moveSlider(index) {

        count = count + index;

        if (count > length) {
            count = 0;
        }

        if (count < 0) {
            count = length;
        }

        slider.value = values[count];
        document.getElementById('date').innerText = values[count];

        date = values[count]
        var x = "202205"
        if (date < 10) {
            x = x + "0"
        }
        date = x + date.toString()
        date = parseInt(date)
        map2.setFilter('PM10s', ['==', ['number', ['get', 'datetime']], date]);

        return false;
    }

    function autoSlideShow() {
        setInterval(function () { moveSlider(1) }, 1000);
    }
    autoSlideShow();
}