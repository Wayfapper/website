var attrOsm = 'Map data &copy; <a href="https://openstreetmap.org/">OpenStreetMap</a> contributors';
var attrOverpass = 'POI via <a href="https://www.overpass-api.de/">Overpass API</a>';

function initMap() {
    var osm = new L.tileLayer(mapStyle,{
        maxZoom: 19,
        minZoom: 3,
        attribution: [attrOsm, attrOverpass].join('|')
        });
        map = L.map('map', {
            zoomDelta: 0.5, 
            zoomSnap: 0.5})
            .addLayer(osm)
            .setView(mapCenter, mapZoom);
}

var locationButton = new L.easyButton({
    states:[{
        stateName: 'loaded',
        icon: '<span class="star">&#8853;</span>',
        title: 'to my location',
        onClick: function(control){
            control.state("loading");
            control._map.on('locationfound', function(e){
                this.setView(e.latlng, 17);
                var radius = e.accuracy / 2;
                var marker = new L.Marker.SVGMarker(e.latlng).bindPopup("You are within " + Math.round(radius) + " meters from this point").openPopup();
                if (radius >= 5)
                    L.circle(e.latlng, radius).addTo(map);
                map.addLayer(marker);
                control.state('loaded');
            });
            control._map.on('locationerror', function(){
                control.state('error');
            });
            control._map.locate()
        },
    }, {
        stateName: 'loading',
        icon: '<span class="star">&telrec;</span>',
        title: 'searching',
    }, {
        stateName: 'error',
        icon: '<span class="star">&cross;</span>',
        title: 'location not found',
    }]
});