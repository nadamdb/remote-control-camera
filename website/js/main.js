$(document).ready(function(){

	$.ajax({
		method: "GET",
		url: "http://192.168.66.2:3000/camera",
		success: function (data) {
			if (data == "ON")
			{
				$("#onoff-img").attr("src", "img/on.jpg");
			}
			else
			{
				$("#onoff-img").attr("src", "img/off.jpg");
			}
		}
	});

	$("#camera-on, #camera-off").on("click", function(e){
		e.preventDefault();

		var command = $(this).attr('id') == "camera-on" ? "on" : "off";

		$("#camera-on").removeClass("active");
		$("#camera-off").removeClass("active");

		$.ajax({
			method: "POST",
			url: "http://192.168.66.2:3000/camera",
			data: { command : command },
			success: function (data) {
				if (command == "on")
				{
					$("#camera-on").addClass("active");
				}
				else //if(command == "off")
				{
					$("#camera-off").addClass("active");
				}
			}
		});

		return false;
	});

	updateBadge();

	// check in every 5 secs if there is new movement(s) and update badge number
	setTimeout(function(){
		updateBadge();
	}, 5000);

	// TODO: when we open notifications, append the new movements (is_new == 1) and update them to is_new = 0
});

function updateBadge() {
	$.ajax({
		method: "GET",
		url: "http://192.168.66.2:3000/new-movements",
		success: function (data) {
			var count = data.length;
			$("#noti-badge").html(count);

			// TODO: bootstrap-growl
		}
	});
}