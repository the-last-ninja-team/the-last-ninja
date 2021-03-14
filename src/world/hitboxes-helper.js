import { Rect } from '../base/rect'
import { Vector } from '../base/vector'
import { getIntersectingRectsSquare } from '../utils'
import { SimpleObject } from '../base/simple-object'
import { getSizesBy } from './colliders/utils'

export class HitBoxesHelper {
  constructor() {
   //
  }

  init(tileMap) {
    this.tileMap = tileMap
    this._getSizes = getSizesBy(tileMap)
  }

  _getObjectWithHitBox(object) {
    const { x, y, width, height, hitBox } = object
    if (hitBox) {
      return new SimpleObject(x, y + height - hitBox.height, width, hitBox.height)
    }

    return new SimpleObject(x, y, width, height)
  }

  /** Чтение массива всех спрайтов, которые входят в заданную площадь */
  _getAllSquareRects(rect, width, height, filter) {
    const columns = Math.floor(rect.width / width)
    const rows = Math.floor( rect.height / height)

    let x = rect.x
    let y = rect.y

    const rects = []

    let row = 1
    let column = 1

    // Инициализируем все прямоугольники, которые входят в площадь коллизий
    for (let index = 1; index <= rows * columns; index ++) {
      if (!filter || filter?.(row, column, rows, columns) ) {
        rects.push(new Rect( x, y, width, height))
      }

      column ++
      x += width

      if (index % columns === 0) {
        row ++
        column = 1
        x = rect.x
        y += height
      }
    }

    return rects
  }

  /**
   * Функция для инициализации прямоугольников хитбосов объекта
   * */
  getHitBoxes(object, onlySquare = false) {
    const { width, height } = this.tileMap.size

    const objectWithHitBox = this._getObjectWithHitBox(object)
    const { bottom, left, right, top } = this._getSizes(objectWithHitBox)

    const topLeftV = new Vector(left * width, top * height)
    const topRightV = new Vector(right * width, top * height)
    const bottomLeftV = new Vector(left * width, bottom * height)

    const square = new Rect(topLeftV.x, topLeftV.y,
                (topRightV.x + width) - topLeftV.x,
                (bottomLeftV.y + height) - topLeftV.y)

    if (onlySquare) {
      return [square]
    }

    const rects = this._getAllSquareRects(square, width, height).filter(rect => {
      const square = getIntersectingRectsSquare(objectWithHitBox, rect)
      return (square >= (width * height) / 3)
    })

    // Ищем координаты хитбокса объекта
    let x1, y1
    let x2 = 0
    let y2 = 0

    rects.forEach(rect => {
      x1 = Math.min(x1 ?? rect.x, rect.x)
      y1 = Math.min(y1 ?? rect.y, rect.y)
      x2 = Math.max(x2, rect.x + rect.width)
      y2 = Math.max(y2, rect.y + rect.height)
    })

    // Увеличиваем хитбокс на спрайт во все стороны
    x1 -= width
    y1 -= height
    x2 += width
    y2 += height

    return this._getAllSquareRects(new Rect(x1, y1, x2 - x1, y2 - y1), width, height,
              (row, column, rows, columns) => {
                return row === 1 || row === rows
                      || (row > 1 && row < rows && (column === 1 || column === columns))
              })
  }
}