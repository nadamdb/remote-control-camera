$(document).ready(function(){

	$.ajax({
		method: "GET",
		url: "/movements",
		success: function (data) {
			console.log(data.movements)
			$.each(data.movements, function(i,e){
				var date_time = e.timestamp.split("_");
				var time = date_time[1].split('-');
				var time_nice = time.join(':');
				$('#stat-table tbody').append(
					'<tr>' +
						'<td>' + date_time[0] + '<br/><small>' + time_nice + '</small></td>' +
						'<td class="text-center">' +
							'<a href="'+ e.url +'" class="image-link">' +
								'<img src="' + e.url + '" alt="'+i+'" style="width: 100px;">' +
							'</a>' +
						'</td>' +
					'</tr>'
				);
			});

			$('#stat-table').DataTable({
				"order" : [[ 1, "desc" ]]
			});

			$(function(){
				$('.image-link').viewbox({
					setTitle: true,
					margin: 20,
					resizeDuration: 300,
					openDuration: 200,
					closeDuration: 200,
					closeButton: true,
					navButtons: true,
					closeOnSideClick: true,
					nextOnContentClick: true
				});
			});
		}
	});
});