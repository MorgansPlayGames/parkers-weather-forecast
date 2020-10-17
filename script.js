// API key 16e5f0e91eaa8e599c6fe96c31d0b727
// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

$( document ).ready(function(){
    var key = "5317e61e885d4cdc785b84fe43c9f84d";
    var cityName = "Salt Lake City";
    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q='+cityName+'&appid='+key;

    $.ajax({
        url: queryURL,
        method: "GET"
      })
        .then(function(city) {
            console.log(city);
            updateDOM(city);
            //city-name

            //city-temperature
            //city-humidity
            //city-wind-speed
            //city-UV-index
        });
    function updateDOM(city){
        var cityName = city.name;
        var cityTemp = toFahrenheit(city.main.temp);
        var cityHumidity = city.main.humidity;
        var cityWindSpeed = city.wind.speed;
        var cityUV = 'gotta find this...';
        console.log(cityName, cityTemp, cityHumidity, cityWindSpeed, cityUV);
        $('#city-name').text(cityName);
        $('#city-temperature').text('Temperature: ' + cityTemp);
        $('#city-humidity').text('Wind Speed: ' + cityHumidity);
        $('#city-wind-speed').text('Wind Speed: ' + cityWindSpeed);
        $('#city-UV-index').text('UV Index: ' + cityUV);

    }

    function toFahrenheit(kelvin){
        var fahrenheit = (kelvin - 273.15)*9/5+32;
        return fahrenheit;
    }
})