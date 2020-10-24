// API key 16e5f0e91eaa8e599c6fe96c31d0b727
// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

$( document ).ready(function(){
    var cityList = localStorage.getItem('cityList');
    cityList = JSON.parse(cityList);
    var key = "5317e61e885d4cdc785b84fe43c9f84d";
    var cityName = "Salt Lake City";
    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q='+cityName+'&appid='+key;

    updateCityList();
    lastCitySearched();
    //Clicking search button
    $('#searchBtn').on('click', function(){
        cityName = $('#searchText').val()
        queryURL = 'https://api.openweathermap.org/data/2.5/weather?q='+cityName+'&appid='+key;
        searchCity();
        
    });
    //listener to the city button div containing all the searched cities.
    $('#cityList').on('click', '.cityBtn', function(){
        cityName = $(this)[0].getAttribute('data-name');
        queryURL = 'https://api.openweathermap.org/data/2.5/weather?q='+cityName+'&appid='+key;
        searchCity();
    });
    //checks to see if on the list if not on the list push to list save to local storage
    function saveCity(){
        var onList;
        cityName = cityName.toLowerCase();
        if(cityList === null){
            cityList = [cityName];
            localStorage.setItem('cityList', [JSON.stringify(cityList)]);
        }else{
            //check to see if cityName is on the list
            onList = false;
            var i=0;
            cityList.forEach(function(name){
                
                if(cityName === name){
                    cityList.splice(i, 1);
                    onList=true;
                    cityList.unshift(cityName);
                }
                i++;
            });
            //if false push to list
            if(onList === false){
                cityList.unshift(cityName);
                localStorage.setItem('cityList', [JSON.stringify(cityList)]);
            }
        }
        updateCityList();
    }
    //Creates buttons for each of the last searched
    function updateCityList(){
        $('#cityList').empty();
        if(cityList){
            cityList.forEach(function(name){
                cityButton = $('<button>').text(name).attr('data-name', name).attr('class', 'cityBtn btn btn-outline-primary btn-dark btn-block m-1 text-capitalize');
                $('#cityList').append(cityButton);
            });
        }
    }
    //get weather info to pass to Dom update functions 
    function searchCity(){
    $.ajax({
        url: queryURL,
        method: "GET"
      })
        .then(function(city) {
            //save the city in the nav as a valid place
            saveCity();
            //push info to be populated
            updateDOM(city);
            //get location for the UV index and 5 day forecast
            var lat = city.coord.lat;
            var lon = city.coord.lon;
            var uvURL = 'https://api.openweathermap.org/data/2.5/uvi?lat='+lat+'&lon='+lon+'&appid='+key;
            //UV index call
            $.ajax({
                url: uvURL,
                method: "GET"
              })
                .then(function(uvCity) {
                    updateUV(uvCity.value);
                });
            var forecastURL = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=current,minutely,hourly,alerts&appid='+key;
            //5 day forecast call
            $.ajax({
                url: forecastURL,
                method: "GET"
              })
                .then(function(forecast) {
                    updateForecast(forecast.daily)
                });
        });
    }
        //populate the dom with the main ajax call: name temp humidity windspeed
    function updateDOM(city){
        $('#city-name').text(city.name +' '+ convertDate(city.dt));
        $('#city-temperature').text('Temperature: ' + toFahrenheit(city.main.temp));
        $('#city-humidity').text('Humidity: ' + city.main.humidity);
        $('#city-wind-speed').text('Wind Speed: ' + city.wind.speed);
    }
    //populate the dom with UV index
    function updateUV(index){

        $('#city-UV-index').text('UV Index: ' + index);
        if(index <= 2){
            $('#city-UV-index').attr('class', 'bg-info');
        }
        if(index >2 && index <= 5){
            $('#city-UV-index').attr('class', 'bg-success');
        }
        if(index >5 && index <= 7){
            $('#city-UV-index').attr('class', 'bg-warning');
        }
        if(index >8 && index <= 10){
            $('#city-UV-index').attr('class', 'bg-danger');
        }
        if(index > 10){
            $('#city-UV-index').attr('class', 'bg-info');
        }
    }
    //update the 5 day forecast create 5 card divs. Recieves date, the weather icon, the tempurature in kelvin, and humidity. It appends it to the DOM.
    function updateForecast(forecast){
        $('#forecast').empty();
        for(var i = 0; i<5; i++){
            var dayOfEl = convertDate(forecast[i+1].dt)
            var weatherIcon = getWeatherIcon(forecast[i+1].weather[0].icon);
            var weatherAlt = forecast[i+1].weather[0].description;
            var temp = toFahrenheit(forecast[i+1].temp.day);
            var humidity = forecast[i+1].humidity;
            var dayCard = $('<div>').addClass('card col text-white bg-primary m-1');
            var dateEl = $('<p>').addClass('text-center card-title row').text(dayOfEl);
            var weatherImgEl = $('<img>').addClass('row img-fluid').attr('src', weatherIcon).attr('alt', weatherAlt);
            tempEl = $('<p>').addClass('row').text('Temp: ' + temp);
            humidityEl = $('<p>').addClass('row').text('Humidity: '+ humidity+'%');
            dayCard.append(dateEl);
            dayCard.append(weatherImgEl);
            dayCard.append(tempEl);
            dayCard.append(humidityEl);
            $("#forecast").append(dayCard);
        }
        //need to get date, overcast, temp, and humidity
    }
    //conversion function 
    function toFahrenheit(kelvin){
        var fahrenheit = parseInt((kelvin - 273.15)*9/5+32);
        return fahrenheit;
    }
    //Function to convert a date value to a month / day / year string
    function convertDate(dayOfEl){
        var date = new Date(dayOfEl*1000);
        forecastDay =  date.getMonth()+'/'+ date.getDate() +'/'+ date.getFullYear();
        return forecastDay;
    }
    //Returns the url of the weather icon from the Id given
    function getWeatherIcon(iconId){
        iconURL = 'https://openweathermap.org/img/wn/'+iconId+'@2x.png';
        return iconURL
    }
    //Gets the last city searched and updates dom to that city.
    function lastCitySearched(){
        if(cityList !== null){
            var lastCity = cityList[0];
            
            cityName = lastCity;
            queryURL = 'https://api.openweathermap.org/data/2.5/weather?q='+cityName+'&appid='+key;
            console.log(cityName)
            searchCity();
        }
    }
    

});