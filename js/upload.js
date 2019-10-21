import CanvasElement from './CanvasElement.js';
import Crop from './Crop.js';

var canvas;
var uploadBtn = document.getElementById('uploadBtn');
var fileInputBtn = document.getElementById('fileInputBtn');
fileInputBtn.onchange = readURL;
uploadBtn.onclick = function() {
  canvas = new CanvasElement('editing-container', false);
  fileInputBtn.click();
};

function readURL(input) {
  if (input.target.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      var image = new Image();
      image.onload = function(event) {
        canvas.handleCanvasSize(image);
      };
      image.src = e.target.result;
    };
    reader.readAsDataURL(input.target.files[0]);
  }
}

// var c = new Crop('editing-container', true);
// c.context.fillStyle = 'red';
// c.context.fillRect(0, 0, 500, 500);

// var c1 = new Crop('editing-container', true);
// c1.context.fillStyle = 'yellow';
// c1.context.fillRect(0, 0, 900, 900);
