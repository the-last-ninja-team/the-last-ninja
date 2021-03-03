import { MovingObject } from './moving-object'

export class HMovingObject extends MovingObject {
  constructor({ key, x, y, width, height, speed, directionX = -1 }) {
    super(x, y, width, height)

    this.key = key
    this.index = window.performance.now()
    this.speed = speed
    this.directionX = directionX
  }

  update() {
    this.oldX = this.x
    this.oldY = this.y

    this.x += (this.speed * this.directionX)
  }
}