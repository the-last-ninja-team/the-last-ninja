import { Rect } from './rect'

export class SimpleObject extends Rect {
  constructor(x, y, width, height) {
    super(x, y, width, height)
  }

  getBottom() {
    return this.y + this.height
  }

  getLeft() {
    return this.x
  }

  getRight() {
    return this.x + this.width
  }

  getTop() {
    return this.y
  }

  setBottom(y) {
    this.y = y - this.height
  }

  setLeft(x) {
    this.x = x
  }

  setRight(x) {
    this.x = x - this.width
  }

  setTop(y) {
    this.y = y
  }
}