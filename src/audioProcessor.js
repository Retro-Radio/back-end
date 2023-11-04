const ffmpeg = require('ffmpeg');
audio = require('fluent-ffmpeg/lib/options/audio');

function audioProcessor(path) {
    try {

        console.log(path)

        new ffmpeg(path, function (err, audio) {
            if (!err) {
                console.log(audio.metadata);
                audio.save('../bin/audio.m3u8')
                
                
            } else {
                console.log('Error: ' + err);
            }
        });

    } catch (e) {
        console.log(e.code);
        console.log(e.msg);

        
    }

}

audioProcessor('ballin.mp3');


//ffmpeg -i input.avi -c:v libx264 -crf 23 -c:a aac -movflags faststart output.mp4
//ffmpeg -i 1.mp3 -map 0:a -c:a aac -b:a 320k -f hls -hls_time 10 -hls_list_size 0 -hls_segment_filename audio%04d.ts audio.m3u8