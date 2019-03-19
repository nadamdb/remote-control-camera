$(document).ready(function(){

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
});