import { SimpleObject } from './simple-object'

export class MovingObject extends SimpleObject {
  constructor(x, y, width, height, velocityMax = 35) {
    super(x, y, width, height)

    this.jumping = false
    // added velocity_max so velocity can't go past 16
    this.velocityMax = velocityMax
    this.velocityX = 0
    this.velocityY = 0
  }
}