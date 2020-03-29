/**
 * Initialize the map and create markers for each location and the on-click functionality 
 * @param none
 * @return none
 */

function initMap() {
    //JSON Object containing the required information for each of the locations of the NCPC
    var cities = {
        deaseLake: {
            id: 5936286,
            name: "Dease Lake",
            position: {lat: 58.4374, lng: -129.9994},
        },    
        fortNelson: {
            id: 5955902,
            name: "Fort Nelson",
            position: {lat: 58.8050, lng: -122.6972}
        },     
        terrace: {
            id: 6162949,
            name: "Terrace",
            position: {lat: 54.5182, lng: -128.6032}
        },    
        princeGeorge: {
            id: 6113365,
            name: "Prince George",
            position: {lat: 53.9171, lng: -122.7497}
        },    
        whistler: {
            id: 6180144,
            name: "Whistler",
            position: {lat: 50.1163, lng: -122.9574}
        },    
        revelstoke: {
            id: 6121621,
            name: "Revelstoke",
            position: {lat: 50.9981, lng: -118.1957}
        },    
        creston: {
            id: 4853078,
            name: "Creston",
            position: {lat: 49.0955, lng: -116.5135}
        }     
    }

    //Creates the map centered around the middle of British Columbia
    var centerSpot = {lat: 54.7267, lng: -124.6476};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5, 
        center: centerSpot
    });
    
    //Adds markers on the map for each of the required cities
    var deaseLakeMarker = new google.maps.Marker({position: cities.deaseLake.position, map: map});
    var fortNelsonMarker = new google.maps.Marker({position: cities.fortNelson.position, map: map});
    var terraceMarker = new google.maps.Marker({position: cities.terrace.position, map: map});
    var princeGeorgeMarker = new google.maps.Marker({position: cities.princeGeorge.position, map: map});
    var whistlerMarker = new google.maps.Marker({position: cities.whistler.position, map: map});
    var revelstokeMarker = new google.maps.Marker({position: cities.revelstoke.position, map: map});
    var crestonMarker = new google.maps.Marker({position: cities.creston.position, map: map});

    //Adds on-click functionality that creates the weather pop-ups for each marker
    deaseLakeMarker.addListener('click', popUpCreator(cities.deaseLake.id, cities.deaseLake.name, deaseLakeMarker));
    fortNelsonMarker.addListener('click', popUpCreator(cities.fortNelson.id, cities.fortNelson.name, fortNelsonMarker));
    terraceMarker.addListener('click', popUpCreator(cities.terrace.id, cities.terrace.name, terraceMarker));
    princeGeorgeMarker.addListener('click', popUpCreator(cities.princeGeorge.id, cities.princeGeorge.name, princeGeorgeMarker));
    whistlerMarker.addListener('click', popUpCreator(cities.whistler.id, cities.whistler.name, whistlerMarker));
    revelstokeMarker.addListener('click', popUpCreator(cities.revelstoke.id, cities.revelstoke.name, revelstokeMarker));
    crestonMarker.addListener('click', popUpCreator(cities.creston.id, cities.creston.name, crestonMarker));
}

/**
 * Makes a call to the weather service API before creating and displaying the weather pop-up 
 * @param {Number} id The ID of the city in the weather service API
 * @param {String} name The name of the city to be displayed
 * @param {google.maps.Marker} marker The marker where the pop-up will be displayed
 * @return {Function} An anonymous function that is called when the marker is clicked
 */

function popUpCreator(id, name, marker){
    //Anonymous function that is used to create a closure
    return () => {
        //Only creates one instance of an Info Window
        if(marker.infowindow == null){
            //Function used to make AJAX calls to provided URLs
            ajaxGet(urlBuilder(id), function(jsonObj){
                //Convert the data we received and generate the info window
                var currentTemp = convertToCelsius(jsonObj.main.temp);
                var conditions = jsonObj.weather[0].description;
                var contentString = contentStringBuilder(name, currentTemp, conditions, false);
                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                //Open the info window on the map, and assign a listener that will destroy it when it is closed
                infowindow.open(map, marker);
                google.maps.event.addListener(infowindow, 'closeclick', function(){
                    marker.infowindow = null;
                });
                marker.infowindow = infowindow;

            }, function(){
                //Create the info window when an error has been encountered
                var contentString = contentStringBuilder(name, currentTemp, true);
                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                //Open the info window on the map, and assign a listener that will destroy it when it is closed
                infowindow.open(map, marker);
                google.maps.event.addListener(infowindow, 'closeclick', function(){
                    marker.infowindow = null;
                });
                marker.infowindow = infowindow;
            })
        }
    }
}

/**
 * Makes a call to a provided URL and then executes a callback on success or failure 
 * @param {String} url The location of the desired resource
 * @param {Function} onSuccess The function to be called when the request succeeds
 * @param {Function} onError The function to be called when the request fails
 * @return none
 */

function ajaxGet(url, onSuccess, onError){
    var request = new XMLHttpRequest();
    var retryCount = 0;
    var maxRetries = 3;

    //Retry handler to be called in case of a failure
    var retryHandler = function(){
        if(retryCount < maxRetries){
            request.open("GET", url);
            request.send();
            retryCount++;
        }
        else{
            onError(request.response);
            retryCount = 0;
        }
    }
    request.timeout = 3000;
    request.onload = function() {
        //On success, pass the received JSON object to the success callback function
        if(request.status == 200){
            var jsonObj = JSON.parse(request.response);
            onSuccess(jsonObj);
            retryCount = 0;
        }
        //Otherwise, handle the retry
        else {
            retryHandler();
        }
    };
    request.onerror = function(){
        retryHandler();
    };
    request.ontimeout = function(){
        retryHandler();
    }

    //Send the request
    request.open("GET", url);
    request.send();
}

/**
 * Formats the request URL based on the city we are retrieving data for 
 * @param {Number} id The city's ID number on the weather service  
 * @return {String} The formatted URL
 */

function urlBuilder(id){
    //The API key is included in plaintext here. I would need to add a secret management service here to deal with this in a production environment
    var urlTemplate = "http://api.openweathermap.org/data/2.5/weather?id={id}&appid=f957d62460b3a7f8fdefa49f536f062a"
    return urlTemplate.replace("{id}", id);
}

/**
 * Formats the content string that will be displayed on the map 
 * @param {String} cityName The name of the city
 * @param {Number} currentTemp The current temperature of the city
 * @param {String} conditions A brief description of the weather conditions
 * @param {Boolean} error A flag indicating which message to display
 * @return {String} The correctly formatted content string
 */

function contentStringBuilder(cityName, currentTemp, conditions, error){
    var contentString = '<h3 class=cityName>{cityName}</h3><div>Weather conditions: {cond}</div><div>Current Temperature: {currentTemp}°C</div>';
    var errorString = '<h3 class=cityName>{cityName}</h3><div>Sorry, an error occured. Please try again later</div>'

    //If no error occured, return the weather data in the content string
    if(!error){
        var formattedCond = conditions[0].toUpperCase() + conditions.slice(1);
        return contentString.replace("{cityName}", cityName)
                            .replace("{currentTemp}", currentTemp)
                            .replace("{cond}", formattedCond);
    }
    //Otherwise, return the error message
    else {
        return errorString.replace("{cityName}", cityName);
    }
}

/**
 * Converts a Kelvin temperature to a Celsius temperature 
 * @param {Number} temperature The temperature in Kelvin
 * @return {Number} The temperature in Celsius
 */

function convertToCelsius(temperature){
    var celsius = temperature - 273.15;
    return celsius.toFixed(1);
}