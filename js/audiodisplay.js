var audioContext = new webkitAudioContext();

function drawBuffer( width, height, context, buffer ) {
    var data = buffer.getChannelData( 0 );
    var step = Math.ceil( data.length / width );
    var amp = height / 2;
    for(var i=0; i < width; i++){
        var avgPositive = 0;
        var avgNegative = 0;
        var numPositive = 0;
        var numNegative = 0;
        for (j=0; j<step; j++) {
            var datum = data[(i*step)+j]; 
            if(datum < 0) {
                numNegative++;
                avgNegative += (datum - avgNegative) / numNegative;
            } else {
                numPositive++;
                avgPositive += (datum - avgPositive) / numPositive;
            }
        }
        context.fillRect(i,(1+avgNegative)*amp,1,Math.max(1,(avgPositive-avgNegative)*amp));
    }
}

function initAudio() {
    var audioRequest = new XMLHttpRequest();
    audioRequest.open("GET", "sounds/fightclub.ogg", true);
    audioRequest.responseType = "arraybuffer";
    audioRequest.onload = function() {
        audioContext.decodeAudioData( audioRequest.response, 
            function(buffer) { 
                var canvas = document.getElementById("view1");
                drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffer ); 
            } );
    }
    audioRequest.send();
}

window.addEventListener('load', initAudio );
