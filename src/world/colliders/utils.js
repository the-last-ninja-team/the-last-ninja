import { Vector } from '../../base/vector'
import { RayDirection } from '../../base/ray'
import { Line } from '../../base/line'

export const getCollisionMap = (collisionObjects, tileMap) => {
  const collisionMap = [...Array.from({ length: tileMap.rows * tileMap.columns }).map(() => 0)]

  collisionObjects.forEach(({ type, x, y, width, height }) => {
    const value = parseInt(type, 10)
    if (value) {
      let startX = x
      let startY = y
      const rows = height / tileMap.size.height
      const columns = width / tileMap.size.width

      for (let i = 1; i <= rows * columns; i ++) {
        const index = (startY / tileMap.size.height) * tileMap.columns + (startX / tileMap.size.width)
        collisionMap[index] = value

        startX += tileMap.size.width

        if (i % columns === 0) {
          startY += tileMap.size.height
          startX = x
        }
      }
    }
  })

  return collisionMap
}

export const getSizesBy = (tileMap) => (object) => {
  const { width, height } = tileMap.size

  return {
    top: Math.floor(object.getTop() / height),
    bottom: Math.floor(object.getBottom() / height),
    left: Math.floor(object.getLeft() / width),
    right: Math.floor(object.getRight() / width),
  }
}

export const get45degreesBy = (limitRect) => (x, y, direction) => {
  switch (direction) {
    case RayDirection.topLeft:
      if (x > y) {
        return new Vector(x - y, 0)
      } else if (y > x) {
        return new Vector(0, y - x)
      }
      break
    case RayDirection.bottomLeft:
      if (limitRect.height > x) {
        return new Vector(0, y + x)
      } else if (x > limitRect.height) {
        return new Vector(x - (limitRect.height - y), limitRect.height)
      }
      break
    case RayDirection.topRight:
      if (x + y > limitRect.width) {
        return new Vector(limitRect.width, (x + y) - limitRect.width)
      } else {
        return new Vector(x + y, 0)
      }
    case RayDirection.bottomRight:
      const gap = x + (limitRect.height - y)
      if (gap > limitRect.width) {
        return new Vector(limitRect.width, limitRect.height - (gap - limitRect.width))
      } else {
        return new Vector(gap, limitRect.height)
      }
  }

  return new Vector(0, 0)
}

export const getLineLineCollision = (line1, line2) => {
  const { start: { x: x1, y: y1 }, end: { x: x2, y: y2 } } = line1
  const { start: { x: x3, y: y3 }, end: { x: x4, y: y4 } } = line2

  // calculate the direction of the lines
  const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3))
    / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
  const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3))
    / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

  // if uA and uB are between 0-1, lines are colliding
  return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1
}

export const getLineRectCollision = (line, rect) => {
  const { x, y, width, height } = rect

  const leftLine = new Line(new Vector(x, y), new Vector(x, y + height))
  const rightLine = new Line(new Vector(x + width, y), new Vector(x + width, y + height))
  const topLine = new Line(new Vector(x, y), new Vector(x + width, y))
  const bottomLine = new Line(new Vector(x, y + height), new Vector(x + width, y + height))

  const left = getLineLineCollision(line, leftLine)
  const right = getLineLineCollision(line, rightLine)
  const top = getLineLineCollision(line, topLine)
  const bottom = getLineLineCollision(line, bottomLine)

  return left || right || top || bottom
}