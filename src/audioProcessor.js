

function generateStream(inputAudioFile, split = false) {
    const { exec } = require('child_process');
    const path = require('path');

    const inputDirectory = '../bin/download/';
    const outputDirectory = '../bin/upload/';
    const outputExtension = '.flac';

    const fs = require('fs');
    if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(inputDirectory, { recursive: true });
        fs.mkdirSync(outputDirectory, { recursive: true });
    }

    const ffmpegProbeCommand = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${path.join(inputDirectory, inputAudioFile)}`;

    exec(ffmpegProbeCommand, (error, stdout) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        
        const totalDuration = parseFloat(stdout); // Duration of audio file (in seconds)
        
        const segmentDuration = 2; // Duration of each segment (in seconds)
        const numSegments = Math.ceil(totalDuration / segmentDuration); // Total number of segments
        
        //const retroStatic = `ffmpeg -i  -f lavfi -t ${Math.floor(totalDuration)} -filter_complex "aevalsrc=0.05*sin(2*PI*300*t)+0.05*random(1) [noised]; [0:a][noised]amix=inputs=2:duration=first:dropout_transition=2, aecho=0.8:0.9:1000:0.3" -c:a libmp3lame -q:a 2 static.mp3`;
        
        /* 
        exec(retroStatic, (ffmpegError, ffmpegStdout, ffmpegStderr) => {
            if (ffmpegError) {
                console.error(`Error: ${ffmpegError.message}`);
                return;
            }
            if (ffmpegStderr) {
                //console.error(`FFmpeg Error: ${ffmpegStderr}`);
            }
            console.log(`Static generated.`);
        }); 
        */

        for (let i = 0; i < numSegments; i++) {
            const startTime = i * segmentDuration;
            const outputFileName = path.join(outputDirectory, `${inputAudioFile.substring(0, inputAudioFile.length - outputExtension.length + 1)}_${i.toString().padStart(3, '0')}.flac`);
            const generateFlacSegment = `ffmpeg -i ${path.join(inputDirectory, inputAudioFile)} -ss ${startTime} -t ${segmentDuration} -c:a flac -y "${outputFileName}"`;
            
            exec(generateFlacSegment, (ffmpegError, ffmpegStdout, ffmpegStderr) => {
            if (ffmpegError) {
                //console.error(`Error: ${ffmpegError.message}`);
                return;
            }
            if (ffmpegStderr) {
                //console.error(`FFmpeg Error: ${ffmpegStderr}`);
            }
            //console.log(`Segment ${i} completed.`);
            });
        }
    });

    return 1;
}

generateStream('ballin.mp3');