function initMap() {
	//Map options
	var options = {
		zoom: 8,
		center: {lat: 49.233853, lng: 28.411331}
	}

	//New map
	var map = new google.maps.Map(document.getElementById('map'), options);

	//Listen for click on map
	google.maps.event.addListener(map, 'click', function(event){
		let lat = event.latLng.lat();
		let lng = event.latLng.lng();

		fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=6023849ab6be8e21ba7901f823393410`)
		.then(function(res) {
			res.json().then(function(data) {
				let icon = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
				addMarker({
					coords: event.latLng,
					content: getContentMarker(data),
					icon: icon
				});
			});
		})
		.catch(function(error){
				console.log(error);
		});
	});

	function addMarker(props){
		var marker = new google.maps.Marker({
			position: props.coords,
			map: map,
			animation: google.maps.Animation.DROP,
			icon: props.icon
		})

		if(props.content){
			var infoWindow = new google.maps.InfoWindow({
				content: props.content
			});

			marker.addListener('click', function(){
				infoWindow.open(map, marker);
			});
		}
	}
	function getContentMarker(data){
		let temp = Math.floor(data.main.temp - 273);
		return `
			<ul class="content-list">
				<li class="content-list__item">Місто: <span>${data.name}</span></li>
				<li class="content-list__item">Країна: <span>${data.sys.country}</span></li>
				<li class="content-list__item">Температура: <span>${temp}&#176С</span></li>
				<li class="content-list__item">Вітер: <span>${data.wind.speed}м/с</span></li>
				<li class="content-list__item">Координати: <span>${data.coord.lat}, ${data.coord.lon}</span></li>
			</ul>
		`;
	}
}
