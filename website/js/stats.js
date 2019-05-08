$(document).ready(function(){

	$.ajax({
		method: "GET",
		url: "/movements",
		success: function (data) {

			$.each(data.movements, function(i,e){
				$('#stat-table tbody').append(
					'<tr>' +
						'<td>' + e.timestamp + '<br/><small>00:00:00</small></td>' +
						'<td class="text-center">' +
							'<a href="'+ e.url +'" c lass="image-link">' +
								'<img src="' + e.url + '" alt="'+i+'" style="width: 100px;">' +
							'</a>' +
						'</td>' +
					'</tr>'
				);
			});

			$('#stat-table').DataTable();

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