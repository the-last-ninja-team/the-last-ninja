import { Ray, RayDirection } from '../../base/ray'
import { Vector } from '../../base/vector'
import { Collider } from '../../collider'

/**
 * Попытка просчитать коллизии с помощью "лучей"
 * */
export class RayCastCollider extends Collider {
  constructor() {
    super()
  }

  /**
   * Инициализируем базовые "лучи", длина которых ограничивается картой уровня
   * @param mob объект, относительного которого будут построены "лучи"
   * @private
   * */
  _getBaseRays(mob) {
    return [
      // Верхний-левый угол влево
      new Ray(new Vector(0, mob.y), new Vector(mob.x,  mob.y), RayDirection.left),
      // Верхний-правый угол вправо
      new Ray(new Vector(mob.getRight(), mob.y), new Vector(this.limitRect.width, mob.y), RayDirection.right),
      // Нижний-левый угол влево
      new Ray(new Vector(0, mob.getBottom()), new Vector(mob.x, mob.getBottom()), RayDirection.left),
      // Нижний-правый угол вправо
      new Ray(new Vector(mob.getRight(), mob.getBottom()), new Vector(this.limitRect.width, mob.getBottom()), RayDirection.right),
      // Верхний-левый угол вверх
      new Ray(new Vector(mob.x, mob.y), new Vector(mob.x, 0), RayDirection.up),
      // Верхний-правый угол вверх
      new Ray(new Vector(mob.getRight(), mob.y), new Vector(mob.getRight(), 0), RayDirection.up),
      // Нижний-левый угол вниз
      new Ray(new Vector(mob.x, mob.getBottom()), new Vector(mob.x, this.limitRect.height), RayDirection.down),
      // Нижний-правый угол вниз
      new Ray(new Vector(mob.getRight(), mob.getBottom()), new Vector(mob.getRight(), this.limitRect.height), RayDirection.down),
    ]
  }

  /**
   * Проверяем, происходит ли пересечении прямоугольника с "лучом"
   * @param rect прямоугольник на карте
   * @param ray луч
   * @return boolean true - когда есть пересечение
   * @private
   * */
  _checkRectCollisionWithRay(rect, ray) {
    const { p1, direction } = ray
    const { x, y, width, height } = rect

    switch (direction) {
      case RayDirection.right:
        return y <= p1.y && y + height >= p1.y && p1.x <= x
      case RayDirection.left:
        return y <= p1.y && y + height >= p1.y && p1.x >= x
      case RayDirection.up:
        return x <= p1.x && x + width >= p1.x && p1.y >= y
      case RayDirection.down:
        return x <= p1.x && x + width >= p1.x && p1.y <= y
      default:
        return false
    }
  }

  /**
   * Вычисляем ближайший хитбокс к лучу в зависимости от его направления
   * @param hitBoxes массив хибоксов
   * @param ray луч
   * @return null - если нет значения или объект, удовлетворяющий критерию
   * @private
   * */
  _getCloserHitBox(hitBoxes, ray) {
    if (!hitBoxes.length) {
      // Если массив пустой, то возвращаем null
      return null
    } else if (hitBoxes.length === 1) {
      // Если только один элемент, то сразу возвращаем его
      return hitBoxes[0]
    }

    let closerHitBox = null
    hitBoxes.forEach(hitBox => {
      if (closerHitBox) {
        let closer = false

        // В зависимости от типа "луча", производим сравнение по X или Y координате
        switch (ray.direction) {
          case RayDirection.right:
            closer = hitBox.x < closerHitBox.x
            break
          case RayDirection.left:
            closer = hitBox.x > closerHitBox.x
            break
          case RayDirection.up:
            closer = hitBox.y > closerHitBox.y
            break
          case RayDirection.down:
            closer = hitBox.y < closerHitBox.y
            break
        }

        if (closer) closerHitBox = hitBox
      } else {
        closerHitBox = hitBox
      }
    })

    return closerHitBox
  }

  /**
   * Читаем список "лучей" с длиной относительно положения объекта и хитбоксов вокруг него.
   * Внимание! Пока класс умеет работать с прямоугольниками
   * */
  collide(object) {
    const rays = this._getBaseRays(object)

    rays.forEach(ray => {
      const hitBoxes = this.collisionObjects.filter(hitBox => this._checkRectCollisionWithRay(hitBox, ray))
      const hitBox = this._getCloserHitBox(hitBoxes, ray)
      if (hitBox) {
        switch (ray.direction) {
          case RayDirection.right:
            ray.p2.x = hitBox.x
            break
          case RayDirection.left:
            ray.p2.x = hitBox.x + hitBox.width
            break
          case RayDirection.up:
            ray.p2.y = hitBox.y + hitBox.height
            break
          case RayDirection.down:
            ray.p2.y = hitBox.y
            break
        }
      }
    })

    return rays
  }
}