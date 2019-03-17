(function () {
    var start = document.getElementById('on');
    var stop = document.getElementById('off');
    start.addEventListener('click', function(e) {
        document.getElementById('onoff-img').src = "img/on.jpg";
    });
    stop.addEventListener('click', function(e) {
        document.getElementById('onoff-img').src = "img/off.jpg";
    });
})();