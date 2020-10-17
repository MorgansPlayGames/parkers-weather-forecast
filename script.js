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
        .then(function(response) {
            console.log(response);
        });
})