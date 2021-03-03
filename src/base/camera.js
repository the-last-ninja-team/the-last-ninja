export class Camera {
  constructor() {
    this.x = 0
    this.y = 0

    this.object = null
    this.rects = []
  }

  watch(object) {
    this.object = object
  }

  update() {
    // update camera position
  }
}