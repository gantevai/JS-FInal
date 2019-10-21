import CanvasElement from './CanvasElement.js';

class Crop extends CanvasElement {
  constructor(container, isCrop) {
    super(container, isCrop);
    this.makeDraggable();
  }

  makeDraggable() {
    var moveBoxBind;
    const imageState = this.imageState[0];

    this.element.addEventListener(
      'mousedown',
      function(e) {
        e.preventDefault();
        imageState.original_x = this.element.getBoundingClientRect().left;
        imageState.original_y = this.element.getBoundingClientRect().top;
        imageState.original_mouse_x = e.pageX;
        imageState.original_mouse_y = e.pageY;

        moveBoxBind = moveBox.bind(this);

        window.addEventListener('mousemove', moveBoxBind);
        window.addEventListener('mouseup', stopMoveBox.bind(this));
      }.bind(this)
    );

    function moveBox(e) {
      const mousePointDistFromBoxPositionX = imageState.original_mouse_x - imageState.original_x;
      const mousePointDistFromBoxPositionY = imageState.original_mouse_y - imageState.original_y;
      const newBoxPositionX = e.pageX - mousePointDistFromBoxPositionX;
      const newBoxPositionY = e.pageY - mousePointDistFromBoxPositionY;

      if (
        newBoxPositionX >= this.container.offsetLeft &&
        newBoxPositionX + this.element.offsetWidth <=
          this.container.offsetLeft + this.container.offsetWidth
      ) {
        this.resizable.style.left = newBoxPositionX + 'px';
        this.element.style.left = 0;
      }

      if (
        newBoxPositionY >= this.container.offsetTop &&
        newBoxPositionY + this.element.offsetHeight <=
          this.container.offsetTop + this.container.offsetHeight
      ) {
        this.resizable.style.top = newBoxPositionY + 'px';
        this.element.style.top = 0;
      }
      //   this.element.style.left = newBoxPositionX + 'px';
      //   this.element.style.top = newBoxPositionY + 'px';
    }

    function stopMoveBox(e) {
      window.removeEventListener('mousemove', moveBoxBind);
    }
  }
}

export default Crop;
