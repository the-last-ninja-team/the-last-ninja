import { Vector } from '#base/vector'
import { Line } from '#base/line'

export class Polygon {
  constructor(startX, startY, polygon) {
    this.x = startX
    this.y = startY
    this.points = []
    this.lines = []

    polygon.forEach(({ x, y }, index) => {
      this.points.push(new Vector(startX + x, startY + y))

      let end
      if (index === polygon.length - 1) {
        end = new Vector(startX, startY)
      } else {
        const next = polygon[index + 1]
        end = new Vector(startX + next.x, startY + next.y)
      }

      this.lines.push(new Line(new Vector(startX + x, startY + y), end))
    })
  }
}