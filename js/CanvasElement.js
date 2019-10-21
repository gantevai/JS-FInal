import RESIZE_CONSTRAINTS from './Constants.js';

class CanvasElement {
  element;
  context;
  resizerArray = [];
  imageState = []; //image width, height and mouse x , y  during resize
  constructor(container, isCrop) {
    this.createElement(container, isCrop);
    this.init();
    this.element.onclick = function() {
      this.showresizable();
    }.bind(this);

    this.makeResizable();
  }

  init() {
    this.imageState = [
      {
        original_width: 0,
        original_height: 0,
        original_x: 0,
        original_y: 0,
        original_mouse_x: 0,
        original_mouse_y: 0
      }
    ];
  }

  createElement(container, isCrop) {
    this.container = document.getElementById(container);

    this.resizable = document.createElement('div');
    this.resizable.classList.add('resizable');
    this.container.appendChild(this.resizable);

    this.resizers = document.createElement('div');
    this.resizers.classList.add('resizers');
    this.resizable.appendChild(this.resizers);
    this.resizerTopLeft = document.createElement('div');
    this.resizerTopLeft.classList.add('resizer');
    this.resizerTopLeft.classList.add('top-left-resizer');
    this.resizerTopRight = document.createElement('div');
    this.resizerTopRight.classList.add('resizer');
    this.resizerTopRight.classList.add('top-right-resizer');
    this.resizerBottomLeft = document.createElement('div');
    this.resizerBottomLeft.classList.add('resizer');
    this.resizerBottomLeft.classList.add('bottom-left-resizer');
    this.resizerBottomRight = document.createElement('div');
    this.resizerBottomRight.classList.add('resizer');
    this.resizerBottomRight.classList.add('bottom-right-resizer');
    this.resizers.appendChild(this.resizerTopLeft);
    this.resizers.appendChild(this.resizerTopRight);
    this.resizers.appendChild(this.resizerBottomLeft);
    this.resizers.appendChild(this.resizerBottomRight);

    this.element = document.createElement('canvas');
    this.element.style.position = 'absolute';
    if (!isCrop) {
      this.resizable.style.width = this.element.style.width = this.container.offsetWidth + 'px';
      this.resizable.style.height = this.element.style.height = this.container.offsetHeight + 'px';
    } else {
      this.resizable.style.width = this.element.style.width = 200 + 'px';
      this.resizable.style.height = this.element.style.height = 200 + 'px';
    }
    this.resizable.appendChild(this.element);
    this.context = this.element.getContext('2d');

    this.resizerArray.push(this.resizerTopLeft);
    this.resizerArray.push(this.resizerTopRight);
    this.resizerArray.push(this.resizerBottomLeft);
    this.resizerArray.push(this.resizerBottomRight);
  }

  showresizable() {
    this.resizerTopLeft.style.display = 'block';
    this.resizerTopRight.style.display = 'block';
    this.resizerBottomLeft.style.display = 'block';
    this.resizerBottomRight.style.display = 'block';
  }

  hideresizable() {
    this.resizerTopLeft.style.display = 'none';
    this.resizerTopRight.style.display = 'none';
    this.resizerBottomLeft.style.display = 'none';
    this.resizerBottomRight.style.display = 'none';
  }

  handleCanvasSize(image) {
    var imgWidth = image.width;
    var imgHeight = image.height;
    var imgAspectRatio = imgWidth / imgHeight;
    this.element.width = this.element.offsetWidth;
    this.element.height = this.element.width / imgAspectRatio;
    this.resizable.style.width = this.element.style.width = this.element.width + 'px';
    this.resizable.style.height = this.element.style.height = this.element.height + 'px';
    this.context.drawImage(image, 0, 0, this.element.width, this.element.height);
  }

  makeResizable() {
    var resizeBind;
    const imageState = this.imageState[0];
    for (var i = 0; i < this.resizerArray.length; i++) {
      const currentResizer = this.resizerArray[i];
      //   console.log(currentResizer);
      currentResizer.addEventListener(
        'mousedown',
        function(e) {
          e.preventDefault();
          //   console.log(this);
          imageState.original_width = parseFloat(
            getComputedStyle(this.element, null)
              .getPropertyValue('width')
              .replace('px', '')
          );
          imageState.original_height = parseFloat(
            getComputedStyle(this.element, null)
              .getPropertyValue('height')
              .replace('px', '')
          );
          imageState.original_x = this.element.getBoundingClientRect().left;
          imageState.original_y = this.element.getBoundingClientRect().top;
          imageState.original_mouse_x = e.pageX;
          imageState.original_mouse_y = e.pageY;

          resizeBind = resize.bind(this);

          window.addEventListener('mousemove', resizeBind);
          window.addEventListener('mouseup', stopResize.bind(this));
        }.bind(this)
      );

      function resize(e) {
        if (currentResizer.classList.contains('bottom-right-resizer')) {
          const width = imageState.original_width + (e.pageX - imageState.original_mouse_x);
          const height = imageState.original_height + (e.pageY - imageState.original_mouse_y);

          if (
            width > RESIZE_CONSTRAINTS.MIN_SIZE &&
            e.pageX < this.container.offsetLeft + this.container.offsetWidth
          ) {
            this.resizable.style.width = this.element.style.width = width + 'px';
          }

          if (
            height > RESIZE_CONSTRAINTS.MIN_SIZE &&
            e.pageY < this.container.offsetTop + this.container.offsetHeight
          ) {
            this.resizable.style.height = this.element.style.height = height + 'px';
          }
        } else if (currentResizer.classList.contains('bottom-left-resizer')) {
          const width = imageState.original_width - (e.pageX - imageState.original_mouse_x);
          const height = imageState.original_height + (e.pageY - imageState.original_mouse_y);

          if (width > RESIZE_CONSTRAINTS.MIN_SIZE && e.pageX > this.container.offsetLeft) {
            this.resizable.style.width = this.element.style.width = width + 'px';
            this.resizable.style.left =
              imageState.original_x + (e.pageX - imageState.original_mouse_x) + 'px';
            this.element.style.left = 0 + 'px';
          }

          if (
            height > RESIZE_CONSTRAINTS.MIN_SIZE &&
            e.pageY < this.container.offsetTop + this.container.offsetHeight
          ) {
            this.resizable.style.height = this.element.style.height = height + 'px';
          }
        } else if (currentResizer.classList.contains('top-right-resizer')) {
          const width = imageState.original_width + (e.pageX - imageState.original_mouse_x);
          const height = imageState.original_height - (e.pageY - imageState.original_mouse_y);
          if (
            width > RESIZE_CONSTRAINTS.MIN_SIZE &&
            e.pageX < this.container.offsetLeft + this.container.offsetWidth
          ) {
            this.resizable.style.width = this.element.style.width = width + 'px';
          }
          if (height > RESIZE_CONSTRAINTS.MIN_SIZE && e.pageY > this.container.offsetTop) {
            this.resizable.style.height = this.element.style.height = height + 'px';
            this.resizable.style.top =
              imageState.original_y + (e.pageY - imageState.original_mouse_y) + 'px';
            this.element.style.top = 0;
          }
        } else {
          const width = imageState.original_width - (e.pageX - imageState.original_mouse_x);
          const height = imageState.original_height - (e.pageY - imageState.original_mouse_y);
          if (width > RESIZE_CONSTRAINTS.MIN_SIZE && e.pageX > this.container.offsetLeft) {
            this.resizable.style.width = this.element.style.width = width + 'px';
            this.resizable.style.left =
              imageState.original_x + (e.pageX - imageState.original_mouse_x) + 'px';
            this.element.style.left = 0;
          }
          if (height > RESIZE_CONSTRAINTS.MIN_SIZE && e.pageY > this.container.offsetTop) {
            this.resizable.style.height = this.element.style.height = height + 'px';
            this.resizable.style.top =
              imageState.original_y + (e.pageY - imageState.original_mouse_y) + 'px';
            this.element.style.top = 0;
          }
        }
      }

      function stopResize(e) {
        window.removeEventListener('mousemove', resizeBind);
      }
    }
  }
}

export default CanvasElement;
