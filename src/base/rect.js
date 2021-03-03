export class Rect {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  static getCenter(rect) {
    return [Math.round(rect.x + rect.width / 2), Math.round(rect.y + rect.height / 2)]
  }

  static setCenter(rect, x, y) {
    rect.x = x - Math.round(rect.width / 2)
    rect.y = y - Math.round(rect.height / 2)
  }

  static equals(rect1, rect2) {
    return rect1.x === rect2.x
      && rect1.y === rect2.y
      && rect1.width === rect2.width
      && rect1.height === rect2.height
  }
}