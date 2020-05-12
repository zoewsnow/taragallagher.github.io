var map_score2 = L.map('map_score2id', {zoomSnap: .1}).setView([37.8, -96], 3.5);
var geojson2;

mapboxAccessToken = 'pk.eyJ1IjoidGFyYWdhbGxhZ2hlciIsImEiOiJjazluYmdnMDEwMGl3M21sN2lzMTJ4OGVjIn0.IW23HKS-_piwIDi2w7m13w';
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.outdoors',
    style: 'mapbox://styles/mapbox/streets-v11',
    // attribution: ...
}).addTo(map_score2);

L.geoJson(statesData,{weight: 1}).addTo(map_score2);
map_score2.scrollWheelZoom.disable();

function getColor2(d) {
    return d == "Inaccessible or banned" ? '#bd0026' :
        d == "Surgical abortion banned or extreme restrictions"  ? '#fc6d33' :
        d == "Under threat but accessible or unclear"  ? '#fd9f44' :
        d == "Available and accessible"   ? '#ffeda0' :
                    '#ffeda0';
}

function style(feature) {
    return {
        fillColor: getColor2(feature.properties.score2),
        weight: 1,
        opacity: 1,
        color: 'white',
        // dashArray: '3',
        fillOpacity: 1
    };
}
geojson2 = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map_score2);

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        // color: '#666',
        color: 'white',
        dashArray: '',
        fillOpacity: 1
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    
    infoMap2.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson2.resetStyle(e.target);
    infoMap2.update();
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

}

var infoMap2 = L.control({
    position : 'bottomleft'
});

infoMap2.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'subinfo'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
infoMap2.update = function (props) {
    this._div.innerHTML = (props ?
        ' <h4>' + props.name + ':</h4> ' + props.score2 
        : 'Hover or click.');
};

infoMap2.addTo(map_score2);
