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
});