		var markers = [];
		var map;
        // array of locations. 
		var locations = [{
		        title: 'King Saud University',
		        location: {
		            lat: 24.716249,
		            lng: 46.619171
		        }
		    },
		    {
		        title: 'The Boulevard Riyadh',
		        location: {
		            lat: 24.750647,
		            lng: 46.613315
		        }
		    },
		    {
		        title: 'Al Masaa Cafe',
		        location: {
		            lat: 24.713087,
		            lng: 46.673035
		        }
		    },
		    {
		        title: 'Burj Rafal Hotel Kempinski Riyadh',
		        location: {
		            lat: 24.792477,
		            lng: 46.632320
		        }
		    },
		    {
		        title: 'King Fahd International Stadium',
		        location: {
		            lat: 24.788540,
		            lng: 46.839021
		        }
		    }
		];

		function openNav() {
		    document.getElementById("mySidenav").style.display = "block";
		}

		function closeNav() {
		    document.getElementById("mySidenav").style.display = "none";
		}

            //display map 
		function initMap() {
		    map = new google.maps.Map(document.getElementById('map'), {
		        center: {
		            lat: 24.774265,
		            lng: 46.738586
		        },
		        zoom: 11,
		        mapTypeControl: false
		    });
            var bounds = new google.maps.LatLngBounds();
		    var largeInfowindow = new google.maps.InfoWindow();
		    for (var i = 0; i < locations.length; i++) {
		        var position = locations[i].location;
		        var id = locations[i].id;
		        var title = locations[i].title;
		        var marker = new google.maps.Marker({
		            map: map,
		            position: position,
		            id: locations[i].id,
		            title: title,
		            animation: google.maps.Animation.DROP


		        });
		        bounds.extend(marker.position);

		        markers.push(marker);

		        locations[i].location = marker;
		        marker.addListener('click', addListener);
		    }
            
		    function addListener() {
		        populateInfoWindow(this, largeInfowindow);
		        this.setAnimation(google.maps.Animation.BOUNCE);
		        eventMarker(this, marker);
		    }

		    function eventMarker(marker) {
		        setTimeout(function() {
		            marker.setAnimation(null);
		        }, 2000);
		    }
		}

		function populateInfoWindow(marker, infowindow) {
		    if (infowindow.marker != marker) {
		        infowindow.marker = marker;
		        var address, url;
		        var CLIENT_ID = 'P1URELJ3QYVICH5GDZWFQWJ4AQ0EGMFMBO2FBQAA1LMXBH5U';
		        var CLIENT_SECRET = 'E3NOAZQGGSITG2QOUNDAGT3N5CNSPQGLSQCEI0JWFTQDY0N0';
		        var version = '20172810';
		        var venueID = marker.id;
		        var forSquareUrl = 'https://api.foursquare.com/v2/venues/search?v=' + version + '&ll=' + marker.position.lat() + ',' + marker.position.lng() + '&intent=checkin&' +
		            '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET;
		        $.ajax({
		                url: forSquareUrl,
		                dataType: 'json'
		            })
		            .done(function(data) {
		                address = data.response.venues[0].location.address || 'No address for this place';
		                url = data.response.venues[0].url || 'No URL for this place';
		                infowindow.setContent('<div>' + marker.title + '<br>' + ' Address : ' + address + '<br>' + 'URL :' + url + '</div>');
		                infowindow.open(map, marker);
		            })
		            .fail(function() {
		                alert("Undefined");
		            });
		        infowindow.addListener('closeclick', function() {
		            infowindow.marker = null;
		        });
		    }
		}
		function viewModel() {
		    this.text = ko.observable("");
		    this.locations = ko.observableArray(locations);
		    this.filtered = ko.computed(function() {
		        var filter = this.text().toLowerCase();
		        if (!filter) {
		            // to display all markers when search is empty .
                    for (var i = 0; i < markers.length; i++) {
		                markers[i].setVisible(true);
		            }
		            return this.locations();
		        } else {
                     // to show markers you are serching for .
		            var hideMarkers = ko.utils.arrayFilter(this.locations(), function(locations) {
		                return locations.title.toLowerCase().indexOf(filter) == -1;
		            });
		            return ko.utils.arrayFilter(this.locations(), function(locations) {
                        for (var i = 0; i < hideMarkers.length; i++) {
		                    hideMarkers[i].location.setVisible(false);
		                }
		                return locations
		                    .title.toLowerCase().indexOf(filter) != -1;
		            });
		        }
		    }, this);
            //when click list location there is event map marker .
		    this.eventOnClick = function(marker) {
		        google.maps.event.trigger(marker.location, "click");
		    };
		}
		ko.applyBindings(new viewModel());