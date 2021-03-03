import { Img } from './img'

export class Sprite extends Img {
  constructor({ name, sourceX = 0, sourceY = 0, x, y, width, height }) {
    super({ name, x, y, width, height })
    this.sourceX = sourceX
    this.sourceY = sourceY

    this.imageWidth = width
    this.imageHeight = height
  }
}