import { Line } from '#base/line'
import { Vector } from '#base/vector'

export class CollisionDetected {
  constructor() {
    //
  }

  /**
   * Функция для чтения коллизии между 2мя прямоугольниками
   * @return boolean true - если коллизия есть
   * */
  static isRectRect(rect1, rect2) {
    return (rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y)
  }

  static isLineLine(line1, line2) {
    const { start: { x: x1, y: y1 }, end: { x: x2, y: y2 } } = line1
    const { start: { x: x3, y: y3 }, end: { x: x4, y: y4 } } = line2

    // calculate the direction of the lines
    const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3))
      / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
    const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3))
      / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

    // if uA and uB are between 0-1, lines are colliding
    return {
      isColliding: uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1,
      point: new Vector(x1 + (uA * (x2 - x1)), y1 + (uA * (y2 - y1)))
    }
  }

  static isLineRect(line, rect) {
    const { x, y, width, height } = rect

    const leftLine = new Line(new Vector(x, y), new Vector(x, y + height))
    const rightLine = new Line(new Vector(x + width, y), new Vector(x + width, y + height))
    const topLine = new Line(new Vector(x, y), new Vector(x + width, y))
    const bottomLine = new Line(new Vector(x, y + height), new Vector(x + width, y + height))

    const left = this.isLineLine(line, leftLine)
    const right = this.isLineLine(line, rightLine)
    const top = this.isLineLine(line, topLine)
    const bottom = this.isLineLine(line, bottomLine)

    return {
      isColliding: left.isColliding || right.isColliding || top.isColliding || bottom.isColliding,
      points: [left, right, top, bottom]
    }
  }
}