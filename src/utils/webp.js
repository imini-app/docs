var WebpToCanvas = {};

if (typeof Module !== 'undefined') {
  WebpToCanvas = Module.cwrap('WebpToSDL', 'number', ['array', 'number'])
}

export function decode(webp_data, canvas_id, fileName = 'download.png') {
  // get the canvas to decode into
  var canvas = document.getElementById(canvas_id);
  if (canvas == null) return;
  // clear previous picture (if any)
  Module.canvas = canvas;
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  // decode and measure timing
  const start = new Date();
  var ret = WebpToCanvas(webp_data, webp_data.length);
  const end = new Date();
  var decode_time = end - start;
  console.log(webp_data, decode_time, ret);

  // Download
  let canvasUrl = canvas.toDataURL().replace("image/png", "image/octet-stream");
  download(canvasUrl, fileName)
}

function download(dataurl, filename) {
  const link = document.createElement("a");
  link.href = dataurl;
  link.download = filename;
  link.click();
}

export function loadfile(filename, canvas_id) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', filename);
  xhr.responseType = 'arraybuffer';
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var webp_data = new Uint8Array(xhr.response);
      decode(webp_data, canvas_id);
    }
  };
  xhr.send();
}