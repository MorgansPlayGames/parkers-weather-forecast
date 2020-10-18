// API key 16e5f0e91eaa8e599c6fe96c31d0b727
// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

$( document ).ready(function(){
    //key and base url to call from
    var key = "5317e61e885d4cdc785b84fe43c9f84d";
    var cityName = "Salt Lake City";
    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q='+cityName+'&appid='+key;


    $('#searchBtn').on('click', function(){
        cityName = $('#searchText').val()
        queryURL = 'https://api.openweathermap.org/data/2.5/weather?q='+cityName+'&appid='+key;
        console.log(cityName);
        searchCity();
    });
    //get weather info
    function searchCity(){
    $.ajax({
        url: queryURL,
        method: "GET"
      })
        .then(function(city) {
            //push info to be populated
            updateDOM(city);
            //get location for the UV index
            var lat = city.coord.lat;
            var lon = city.coord.lon;
            var uvURL = 'http://api.openweathermap.org/data/2.5/uvi?lat='+lat+'&lon='+lon+'&appid='+key;
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
        console.log(city);
        $('#city-name').text(city.name +' '+ convertDate(city.dt));
        $('#city-temperature').text('Temperature: ' + toFahrenheit(city.main.temp));
        $('#city-humidity').text('Humidity: ' + city.main.humidity);
        $('#city-wind-speed').text('Wind Speed: ' + city.wind.speed);
    }
    //populate the dom with UV index
    function updateUV(index){
        $('#city-UV-index').text('UV Index: ' + index);
    }

    function updateForecast(forecast){
        $('#forecast').empty();
        for(var i = 0; i<5; i++){
            var dayOfEl = convertDate(forecast[i+1].dt)
            console.log(forecast[i+1])
            var weatherIcon = getWeatherIcon(forecast[i+1].weather[0].icon);
            var weatherAlt = forecast[i+1].weather[0].description;
            var temp = toFahrenheit(forecast[i+1].temp.day);
            var humidity = forecast[i+1].humidity;
            var dayCard = $('<div>').addClass('card col text-white bg-primary');
            var dateEl = $('<p>').addClass('row').text(dayOfEl);
            var weatherImgEl = $('<img>').addClass('row').attr('src', weatherIcon).attr('alt', weatherAlt);
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

    function convertDate(dayOfEl){
        var date = new Date(dayOfEl*1000);
        forecastDay =  date.getMonth()+'/'+ date.getDate() +'/'+ date.getFullYear();
        return forecastDay;
    }

    function getWeatherIcon(iconId){
        iconURL = 'http://openweathermap.org/img/wn/'+iconId+'@2x.png';
        return iconURL
    }
});