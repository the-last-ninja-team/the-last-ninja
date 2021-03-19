import { Vector } from '#base/vector'
import { RayDirection } from '#base/ray'

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