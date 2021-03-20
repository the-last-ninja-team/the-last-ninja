import { Rect } from '#base/rect'

export class Img extends Rect {
  constructor({ name, x = 0, y = 0, width, height }) {
    super(x, y, width, height)

    this.name = name
    this.flipped = false
  }

  setXY(x, y) {
    this.x = x
    this.y = y
  }
}