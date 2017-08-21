$(function() {

    // VARIABLE DEFINITIONS

    var gmapsApiKey  = 'AIzaSyAUjWJcZ66Al0FYo6VN0G-qzwiMLGkhZCc',
        timezone     = moment.tz.guess(),
        timeEl       = $('#time'),
        dateEl       = $('#date'),
        queryEl      = $('#location-query'),
        timeFormat12 = "h:mm:ss A",
        timeFormat24 = "HH:mm:ss",
        timeFormat   = timeFormat12,
        dateFormat   = "dddd";

    // Setup Google Maps API-driven autocomplete location searches
    var locationAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('location-query'),
        {
          types: ['(regions)']
        }
    );

    // END VARIABLE DEFINITIONS


    // METHOD DEFINITIONS

    function updateClock() {
        timeEl.text(moment.tz(timezone).format(timeFormat));
        dateEl.text(moment.tz(timezone).format(dateFormat));
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
                    queryEl.blur();
                }
                else {
                    // console.log('Time zone API Error');
                    alert('An error occured, please try again.');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // console.log('Time zone API Error');
                // console.log(jqXHR);
                // console.log(textStatus);
                // console.log(errorThrown);
                alert('An error occured, please try again.');
            },
            complete: function() {}
        });
    }
    
    // END METHOD DEFINITIONS


    // EVENT LISTENERS

    $('#clock-search').submit(function(e){
        e.preventDefault();
    });

    $('.format-trigger').click(function(e){
        e.preventDefault();
        timeFormat = timeFormat === timeFormat12 ? timeFormat24 : timeFormat12;
        updateClock();
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
    queryEl.focus();

    if (window.navigator.standalone) {
        // The app is running in standalone mode.
        $('body').addClass('standalone');
    }

    // END INITIALIZATION

});