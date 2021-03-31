

export class Screen {
  constructor(camera) {
    this.camera = camera

    this.x = camera.x
    this.y = camera.y
  }

  init(width, height) {
    this.width = width
    this.height = height
  }

  update() {
    this.x = this.camera.x
    this.y = this.camera.y
  }
}