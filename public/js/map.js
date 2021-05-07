var attrOsm = 'Map data &copy; <a href="https://openstreetmap.org/">OpenStreetMap</a> contributors';
var attrOverpass = 'POI via <a href="https://www.overpass-api.de/">Overpass API</a>';
var settings = {
    mapCenter: null,
    mapZoom: null,
};

/**
 * initialisation of the map
 */
function initMap() {
    loadSettings();
    let osm = new L.tileLayer(defaultMapStyle,{
        maxZoom: 19,
        minZoom: 3,
        attribution: [attrOsm, attrOverpass].join('|')
        });
        map = L.map('map', {
            zoomDelta: 0.5, 
            zoomSnap: 0.5})
            .addLayer(osm)
            .setView(settings.mapCenter, settings.mapZoom);

        locationButton.addTo(map);

        viewMyLocLayer = new L.LayerGroup();
        viewMyLocLayer.addTo(map);

        map.on('moveend', function() {
            updateLocation();
        });
}

/**
 * Get the center of the map and the zoom setting
 * from the url, the localstorage or use the default
 * in this order
 */
function loadSettings() {
    Object.keys(settings).forEach(function(key) {
        storedSetting = retrieveSetting(key);
        if (storedSetting !== null) {
            settings[key] = storedSetting;
        } else {
            ViewSettings = true;
            settings[key] = defaultSettings[key];
            storeSetting(key);
        }
    });
    
    let zoom = getQueryString('z');
    if (zoom !== null) {
        settings.mapZoom = zoom;
    }
    
    let lat = getQueryString('lat');
    let lng = getQueryString('lng');
    if (lat !== null && lng !== null) {
        settings.mapCenter = [lat, lng];
    }
}

/**
 * store the position in the localstorage and the url
 */
function updateLocation() {
    let mapCenter = map.getBounds().getCenter();
    let mapZoom = map.getZoom();
    storeSetting('mapCenter', mapCenter);
    storeSetting('mapZoom', mapZoom);
    let url = location.href;
    let urlLat = addParam(url, "lat", mapCenter.lat.toFixed(5));
    let urlLng = addParam(urlLat, "lng", mapCenter.lng.toFixed(5));
    let urlZ = addParam(urlLng, "z", mapZoom);
    window.history.pushState({path:urlZ},'',urlZ);
}

/**
 * store data in localstorage with a provided key
 * @param {string} key      the name of the key
 * @param {string} value    the data to store
 */
function storeSetting(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * load data from localstorage stored with a provided key
 * @param  {string} key the name of the key
 * @return {String}     the stored value, null if data doesn't exist
 */
function retrieveSetting(key) {
    let value;
    if (localStorage.getItem(key) !== 'undefined') {
        value = JSON.parse(localStorage.getItem(key));
    } else {
        value = null;
    }
    return value;
}

/**
 * Get the value of a querystring
 * @param  {String} field the field to get the value of
 * @param  {String} url   the URL to get the value from (optional)
 * @return {String}       the field value
 */
 function getQueryString(field, url) {
	let href = url ? url : window.location.href;
	let reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
	let string = reg.exec(href);
	return string ? string[1] : null;
}

/**
 * Modifiy a given url
 * @param  {String} url   the URL to get the value from
 * @param  {String} param the field to get the value of
 * @param  {String} value the field to get the value of
 * @return {String}       the new url
 */
function addParam(url, param, value) {
    let a = document.createElement('a'), regex = /(?:\?|&amp;|&)+([^=]+)(?:=([^&]*))*/g;
    let match = [];
    let str = [];
    a.href = url;
    param = encodeURIComponent(param);
    while ((match = regex.exec(a.search)) !== null)
        if (param != match[1])
            str.push(match[1]+(match[2]?"="+match[2]:""));
    str.push(param+(value?"="+ encodeURIComponent(value):""));
    a.search = str.join("&");
    return a.href;
 }

var locationButton = new L.easyButton({
    states:[{
        stateName: 'loaded',
        icon: '<span class="star">&#8853;</span>',
        title: 'to my location',
        onClick: function(control){
            control.state("loading");
            control._map.on('locationfound', function(e){
                viewMyLocLayer.clearLayers();
                this.setView(e.latlng, 17);
                var radius = e.accuracy / 2;
                var marker = new L.Marker.SVGMarker(e.latlng).bindPopup("You are within " + Math.round(radius) + " meters from this point").openPopup();
                if (radius >= 5)
                    L.circle(e.latlng, radius).addTo(viewMyLocLayer);
                viewMyLocLayer.addLayer(marker);
                control.state('loaded');
            });
            control._map.on('locationerror', function(){
                control.state('error');
            });
            control._map.locate();
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