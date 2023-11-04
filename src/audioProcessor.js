

function generateStream(inputAudioFile) {
    const { exec } = require('child_process');
    const path = require('path');

    inputDirectory = '../bin/download/';
    const outputDirectory = '../bin/upload/';

    const fs = require('fs');
    if (!fs.existsSync(outputDirectory)) {
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

    for (let i = 0; i < numSegments; i++) {
        const startTime = i * segmentDuration;
        const outputFileName = path.join(outputDirectory, `${inputAudioFile.substring(0, inputAudioFile.length - 4)}_${i.toString().padStart(3, '0')}.flac`);
        console.log(outputFileName);
        const generateFlacSegment = `ffmpeg -i ${path.join(inputDirectory, inputAudioFile)} -ss ${startTime} -t ${segmentDuration} -c:a flac -y "${outputFileName}"`;
        
        exec(generateFlacSegment, (ffmpegError, ffmpegStdout, ffmpegStderr) => {
        if (ffmpegError) {
            console.error(`Error: ${ffmpegError.message}`);
            return;
        }
        if (ffmpegStderr) {
            console.error(`FFmpeg Error: ${ffmpegStderr}`);
        }
        console.log(`Segment ${i + 1} completed.`);
        });
    }
    });

    return 1;
}

generateStream('ballin.mp3');