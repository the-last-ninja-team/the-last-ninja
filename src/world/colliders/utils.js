import { Vector } from '#base/vector'
import { RayDirection } from '#base/ray'

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