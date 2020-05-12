var map_composite = L.map('map_composite_id').setView([37.8, -96], 4);
var geojson_comp;

mapboxAccessToken = 'pk.eyJ1IjoidGFyYWdhbGxhZ2hlciIsImEiOiJjazk4eGYxbG4xYWtzM21sY2EzazR1d2N2In0.KHOsDxKbJU6-Tk7PeRCJUQ';
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.outdoors',
    style: 'mapbox://styles/mapbox/streets-v11',
    // attribution: ...
}).addTo(map_composite);

L.geoJson(statesData,{weight: 1}).addTo(map_composite);
map_composite.scrollWheelZoom.disable();

function getColor_comp(d) {
    return d > 8  ? '#bd0026' :
        d > 7  ? '#e31a1c' :
        d > 6  ? '#fc4e2a' :
        d > 5   ? '#fc6d33' :
        d > 4   ? '#fd8d3c' :
        d > 3  ? '#fd9f44' :
        d > 2   ? '#feb24c' :
        d > 1   ? '#fed976' :
            '#ffeda0';
}

function style(feature) {
    return {
        fillColor: getColor_comp(feature.properties.score_composite),
        weight: 1,
        opacity: 1,
        color: 'white',
        // dashArray: '3',
        fillOpacity: 1
    };
}

L.geoJson(statesData, {style: style}).addTo(map_composite);

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        // color: '#666',
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson_comp.resetStyle(e.target);
    info.update();
}

// Define click listener that scrolls to specific state
function scrollToFeature(e) {
    var clickLayer = e.target;
    //map.fitBounds(e.target.getBounds());
    //var divID = layer.feature.properties.name;
    var divID = clickLayer.feature.properties.name;
    document.getElementById(divID.toString()).scrollIntoView({behavior: "smooth", block: "center"});
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: scrollToFeature
    });

    // // Adds a permanent popup with state name!
    // layer.bindTooltip(layer.feature.properties.name, {
    //     direction: "center",
    //     permanent: true,
    //     opacity: .5,
    //     className: 'labelstyle'});
}

geojson_comp = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map_composite);

var info = L.control({
    position : 'topright'
});

info.onAdd = function (map_composite) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>State Index</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + 'Score: ' + props.score_composite + '/9'
        : 'Hover over a state to view its score, or click for its full profile.');
};


info.addTo(map_composite);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        labels = [];

    // loop through our score_composite intervals and generate a label with a colored square for each interval
    div.innerHTML = '<h6>Least restrictive<h6>';
    for (var i = 1; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor_comp(grades[i]) + '"></i> ' +
             (grades[i] ? grades[i-1] +'  &#8804;  ' + (grades[i]).toFixed(0) + '<br>' : '&ndash;9');
    }
    div.innerHTML += '<h6>Most restrictive<h6>';
    return div;
};

legend.addTo(map_composite);

