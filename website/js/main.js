$(document).ready(function(){

	$.ajax({
		method: "GET",
		url: "/camera",
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
			url: "/camera",
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
	setInterval(function(){
		updateBadge();
	}, 2000);

	$("#noti-dropdown").on("click", function(e){
		$('#notifications-dropdown .drop-content').html('');

		if (!$(".notify-drop").is(":visible"))
		{
			$.ajax({
				method: "GET",
				url: "/newmovements",
				success: function (data) {
					var movements = data.movements;
					var count = movements.length;

					$(".noti-badge").html(count);

					$.each(data.movements, function(i,e){
						$('#notifications-dropdown .drop-content').append(
							'<li>' +
								'<div class="col-md-3 col-sm-3 col-xs-3"><div class="notify-img"><img src="'+e.url+'" alt=""></div></div>' +
								'<div class="col-md-9 col-sm-9 col-xs-9 pd-l0">'+e.timestamp+'<i class="fa fa-dot-circle-o"></i></div>' +
							'</li>'
						);
					});
				}
			});
		}

		return true;
	});
});

function updateBadge() {
	$.ajax({
		method: "GET",
		url: "/stats",
		success: function (data) {
			var count = data.movements;
			$(".noti-badge").html(count);
		}
	});
}