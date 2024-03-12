var audiocontext = new AudioContext();

var media_recorder = null;

var gain = audiocontext.createGain();
var source = null;

var earrape = audiocontext.createWaveShaper();
var earrape_curve = new Float32Array(65536);
for (var i = 0; i < 65536; i++)
  earrape_curve[i] = Math.tan(Math.PI * 2 * i / 15000.0);

function is_sound_similar(id, search) {
  // TODO: use Fuse.JS for the search
  search = search.toLowerCase().split(" ");
  id = id.replaceAll("-", " ");
  return search == "" || search.every((e) => e == "" || id.includes(e));
}

function play_sound(id, recording = false) {
  if (!(id in sounds))
    return;

  source = audiocontext.createBufferSource();
  source.buffer = sounds[id];

  source.connect(gain)
    .connect(earrape)
    .connect(audiocontext.destination);

  if (recording) {
    var chunks = [];

    var recording_stream = audiocontext.createMediaStreamDestination();
    earrape.connect(recording_stream);

    media_recorder = new MediaRecorder(recording_stream.stream);

    media_recorder.ondataavailable = function(e) {
      chunks.push(e.data);
    };

    media_recorder.onstop = function() {
      var link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob(chunks, {type: "audio/wav"}));
      link.download = `${page_sound_name}.wav`;
      document.body.appendChild(link);
      link.click();
    };
    
    media_recorder.start();

    source.onended = function() {
      media_recorder.stop();
    };
  }

  speed_update();
  volume_update();
  earrape_update();

  source.start();
}

var sounds = {};

async function load_sound(id) {
  if (id in sounds)
    return;

  var audio_buffer = await fetch(`sounds/${id}.webm`);
  var audiodata = await audio_buffer.arrayBuffer();

  await audiocontext.decodeAudioData(audiodata, function(buffer) {
    sounds[id] = buffer;
  }, function() {
    console.log("Error loading audio file!");
  });
}

async function load_and_play_sound(id) {
  await load_sound(id);
  play_sound(id);
}

function earrape_update() {
  var elem = document.querySelector("#sound-earrape");
  if (elem == null)
    return;

  if (elem.checked)
    earrape.curve = earrape_curve;
  else
    earrape.curve = null;
}

function speed_update() {
  if (source == null)
    return;

  var elem = document.querySelector("#sound-speed");
  if (elem == null)
    return;

  source.playbackRate.value = elem.value;
}

function volume_update() {
  var elem = document.querySelector("#sound-volume");
  if (elem == null)
    return;

  gain.gain.value = elem.value;
}
