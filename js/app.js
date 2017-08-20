$(function() {

    // VARIABLE DEFINITIONS

    var gmapsApiKey = 'AIzaSyCk7o5YvxgXC3Q8YGet1Srp8v2bN_5R6LA',
        timezone    = moment.tz.guess(),
        timeEl      = $('#time'),
        dateEl      = $('#date');

    // Setup Google Maps API-driven autocomplete location searches
    var locationAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('location-query'),
        {
          types: ['(cities)']
        }
    );

    // END VARIABLE DEFINITIONS


    // METHOD DEFINITIONS

    function updateClock() {
        timeEl.text(moment.tz(timezone).format("h:mm:ss a"));
        dateEl.text(moment.tz(timezone).format("dddd, MMMM Do YYYY"));
    }

    function getTimeZone(lat,lon,name) {
        $.ajax({
            url: "https://maps.googleapis.com/maps/api/timezone/json",
            data: {
                location: lat+","+lon,
                timestamp: Date.now() / 1000,
                key: gmapsApiKey
            },
            success: function(data) {
               
                // console.log(data);
                
                if (data.status === 'OK') {
                    timezone = data.timeZoneId;
                    updateClock();
                }
                else {
                    // console.log('Time zone API Error');
                    // TODO: error function
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // console.log('Time zone API Error');
                // console.log(jqXHR);
                // console.log(textStatus);
                // console.log(errorThrown);
                // TODO: error function
            },
            complete: function() {}
        });
    }
    
    // END METHOD DEFINITIONS


    // EVENT LISTENERS

    $('#clock-search').submit(function(e){
        e.preventDefault();
    });

    // Google Maps API autocomplete event listeners
    google.maps.event.addListener(locationAutocomplete, 'place_changed', function() {
        if (this.getPlace().geometry) {
            var query = {
                lat: this.getPlace().geometry.location.lat(),
                lon: this.getPlace().geometry.location.lng(),
                name: this.getPlace().formatted_address
            };
            getTimeZone(query.lat,query.lon,query.name);
        }
    });

    // END EVENT LISTENERS


    // INITIALIZATION

    updateClock();
    setInterval(updateClock, 1000);

    if (window.navigator.standalone) {
        // The app is running in standalone mode.
        $('body').addClass('standalone');
    }

    // END INITIALIZATION

});