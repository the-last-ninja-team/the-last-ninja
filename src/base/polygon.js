import { Vector } from '#base/vector'
import { Line } from '#base/line'
import { Rect } from '#base/rect'

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

    this.rect = this._getPolygonSquare()
  }

  _getPolygonSquare() {
    const xs = this.points.map(({ x }) => x)
    const ys = this.points.map(({ y }) => y)

    const minX = Math.min(...xs)
    const minY = Math.min(...ys)
    const maxX = Math.max(...xs)
    const maxY = Math.max(...ys)

    return new Rect(minX, minY, maxX - minX, maxY - minY)
  }
}