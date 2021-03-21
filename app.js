const express = require('express');
const ffmpeg = require('fluent-ffmpeg');

// Setup
const app = express();

// Middleware
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('./public/index.html')
});

// source_video.mp4
app.get('/video', (req, res) => {
  try{
    ffmpeg('./public/cpd-1.mp4')
    .takeScreenshots({
      filename: './public/screenshoot.png',
      timemarks: [10,13,17,20]
    }, '.')
    // .outputOptions([
    //   '-profile:v baseline',
    //   '-level 3.0',
    //   '-s 1920x1080',
    //   '-start_number 0',
    //   '-hls_time 10',
    //   '-hls_list_size 0',
    //   '-f hls'
    // ])
     // set video bitrate
    .videoBitrate(1024)
    // set h264 preset
    .addOption('preset','superfast')
    // set target codec
    .videoCodec('libx264')
    // set audio bitrate
    .audioBitrate('128k')
    // set audio codec
    .audioCodec('libfaac')
    // set number of audio channels
    .audioChannels(2)
    // set hls segments time
    .addOption('-hls_time', 10)
    // include all the segments in the list
    .addOption('-hls_list_size',0)
    .output('./public/output_video.m3u8')
    // .toFormat("m3u8")
    // .output('./public/output_video_270.mp4')
    // .size('270x?').autopad()
    // .output('./public/output_video_360.mp4')
    // .size('360x?').autopad()
    // .output('./public/output_video_540.mp4')
    // .size('540x?').autopad()
    // .output('./public/output_video_720.mp4')
    // .size('720x?').autopad()
    // .output('./public/output_video_1080.mp4')
    // .size('1080x?').autopad()
    // .output('./public/output_video_2048.mp4')
    // .size('2048x?').autopad()
    // .output('./public/output_video_3840.mp4')
    // .size('3840x?').autopad()
    .on('start', function(commandLine) {
      console.log('Spawned Ffmpeg');
    })
    .on('filenames', (filenames) => {
      console.log('Created file names', filenames)
    })
    .on('progress', function(progress) {
      console.log('Processing: ' + progress.percent.toFixed(2) + '%');
    })
    .on('end', () => {
      console.log('Job Done')
    })
    .on('error', (err) => {
      console.error('Error', err)
    })
    res.send('Started!')
  }catch(error){
    console.error(error)
  }
});

app.listen(3002, () => {
  console.log('server started');
});