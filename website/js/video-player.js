(function () {
    'use strict';
  
    // Does the browser actually support the video element?
    var supportsVideo = !!document.createElement('video').canPlayType;
  
    if (supportsVideo) {
         video.controls = true;
    }
  
  })();