
/* Get photostream from Instagram using Instagram api */

// get your instagram user id from : http://jelled.com/instagram/lookup-user-id
var userId = '483';
var num_to_display = "6";

$.ajax({
	type: "GET",
	dataType: "jsonp",
	cache: false,
	url: "https://api.instagram.com/v1/users/" + userId + "/media/recent/?access_token=18360510.f59def8.d8d77acfa353492e8842597295028fd3",
	success: function(data) {
		for (var i = 0; i < num_to_display; i++) {
	$(".instagram").append("<div class='instagram-placeholder'><a target='_blank' href='" + data.data[i].link +"'><img class='instagram-image' src='" + data.data[i].images.low_resolution.url +"' /></a></div>");   
		}    			
	}
});
	
