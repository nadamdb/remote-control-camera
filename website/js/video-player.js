(function () {
    'use strict';
  
    // Does the browser actually support the video element?
    var supportsVideo = !!document.createElement('video').canPlayType;
  
    if (supportsVideo) {
         video.controls = true;
    }
  
  })();

(function () {
    var tb = document.getElementById('textbox');
    var but = document.getElementById('go');
    but.addEventListener('click', function(e) {
        document.getElementById('video').src = tb.value;
    });
})();