import { Ray, RayDirection } from '../../base/ray'
import { Vector } from '../../base/vector'
import { Collider } from '../../collider'
import { get45degreesBy } from './utils'
import { CollisionDetected } from '../../collision-detected'

// Компенсация, чтобы лучи по вертикали или горизонтали не наслаивались с хитбоксами
const OFFSET = 0.01
// Компенсация, чтобы игрок мог выйти за пределы экрана по Y координате
const OUT_OFF_OFFSET = 100

/**
 * Попытка просчитать коллизии с помощью "лучей"
 * */
export class RayCastCollider extends Collider {
  constructor() {
    super()
  }

  init(limitRect, collisionObjects, tileMap) {
    super.init(limitRect, collisionObjects, tileMap)
    this._get45degrees = get45degreesBy(limitRect)
  }

  /**
   * Инициализируем базовые "лучи", длина которых ограничивается картой уровня
   * @param mob объект, относительного которого будут построены "лучи"
   * @private
   * */
  _getBaseRays(mob) {
    return [
      // Верхний-левый угол влево
      new Ray(new Vector(mob.x,  mob.y), new Vector(0, mob.y), RayDirection.left),
      // Нижний-левый угол влево
      new Ray(new Vector(mob.x, mob.getBottom() - OFFSET),
        new Vector(0, mob.getBottom() - OFFSET), RayDirection.left),
      // Верхний-правый угол вправо
      new Ray(new Vector(mob.getRight(), mob.y), new Vector(this.limitRect.width, mob.y), RayDirection.right),
      // Нижний-правый угол вправо
      new Ray(new Vector(mob.getRight(), mob.getBottom() - OFFSET),
        new Vector(this.limitRect.width, mob.getBottom() - OFFSET), RayDirection.right),
      // Верхний-левый угол вверх
      new Ray(new Vector(mob.x + OFFSET, mob.y), new Vector(mob.x + OFFSET, -OUT_OFF_OFFSET), RayDirection.top),
      // Верхний-правый угол вверх
      new Ray(new Vector(mob.getRight() - OFFSET, mob.y),
        new Vector(mob.getRight() - OFFSET, -OUT_OFF_OFFSET), RayDirection.top),
      // Нижний-левый угол вниз
      new Ray(new Vector(mob.x + OFFSET, mob.getBottom()),
        new Vector(mob.x + OFFSET, this.limitRect.height + OUT_OFF_OFFSET), RayDirection.bottom),
      // Нижний-правый угол вниз
      new Ray(new Vector(mob.getRight() - OFFSET, mob.getBottom()),
        new Vector(mob.getRight() - OFFSET, this.limitRect.height + OUT_OFF_OFFSET), RayDirection.bottom),
      // Угол 45 верхний-левый
      new Ray(new Vector(mob.x + OFFSET,  mob.y + OFFSET),
        this._get45degrees(mob.x + OFFSET, mob.y + OFFSET, RayDirection.topLeft), RayDirection.topLeft),
      // Угол 45 верхний-правый
      new Ray(new Vector(mob.getRight() - OFFSET, mob.y + OFFSET),
        this._get45degrees(mob.getRight() - OFFSET, mob.y + OFFSET, RayDirection.topRight),
        RayDirection.topRight),
      // Угол 45 нижний-левый
      new Ray(new Vector(mob.x + OFFSET, mob.getBottom() - OFFSET),
        this._get45degrees(mob.x + OFFSET, mob.getBottom() - OFFSET, RayDirection.bottomLeft),
        RayDirection.bottomLeft),
      // Угол 45 нижний-правый
      new Ray(new Vector(mob.getRight() - OFFSET, mob.getBottom() - OFFSET),
        this._get45degrees(mob.getRight() - OFFSET, mob.getBottom() - OFFSET, RayDirection.bottomRight),
        RayDirection.bottomRight)
    ]
  }

  /**
   * Проверяем, происходит ли пересечении прямоугольника с "лучом"
   * @param object прямоугольник на карте
   * @param ray луч
   * @return boolean true - когда есть пересечение
   * @private
   * */
  _checkObjectCollisionWithRay(object, ray) {
    return CollisionDetected.isLineRect(ray, object)
  }

  /**
   * Вычисляем ближайший хитбокс к лучу в зависимости от его направления
   * @param hitBoxes массив хибоксов
   * @param ray луч
   * @return null - если нет значения или объект, удовлетворяющий критерию
   * @private
   * */
  _getClosestHitBox(hitBoxes, ray) {
    if (!hitBoxes.length) {
      // Если массив пустой, то возвращаем null
      return null
    }

    let closestDistance = 0
    let closestHitBox = null
    let closestHitBoxPoint = null

    hitBoxes.forEach(hitBox => {
      hitBox.collision.points
        .filter(({ isColliding }) => isColliding)
        .forEach(({ point }) => {
          const distance = point.distanceFrom(ray.start)
          if (distance < closestDistance || closestDistance === 0) {
            closestDistance = distance
            closestHitBox = hitBox
            closestHitBoxPoint = point
          }
        })
    })

    return {
      hitBox: closestHitBox,
      point: closestHitBoxPoint
    }
  }

  _getNormalizedRays(mob) {
    const rays = this._getBaseRays(mob)

    rays.forEach(ray => {
      const hitBoxesWithCollision = this.collisionObjects.map(object => {
        return {
          object,
          collision: this._checkObjectCollisionWithRay(object, ray)
        }
      }).filter(({ collision }) => collision.isColliding)

      const closestHitBox = this._getClosestHitBox(hitBoxesWithCollision, ray)
      if (closestHitBox) {
        const { point, hitBox: { object } } = closestHitBox

        // Относительно ближайшего хитбокса, корректируем длину луча
        switch (ray.direction) {
          case RayDirection.right:
            ray.end.x = object.x
            break
          case RayDirection.left:
            ray.end.x = object.x + object.width
            break
          case RayDirection.top:
            ray.end.y = object.y + object.height
            break
          case RayDirection.bottom:
            ray.end.y = object.y
            break
          case RayDirection.bottomRight:
          case RayDirection.bottomLeft:
          case RayDirection.topRight:
          case RayDirection.topLeft:
            ray.end.x = point.x
            ray.end.y = point.y
            break
        }
      }
    })

    // Отфильтровываем лучи, где точка начала больше точки окончания (значит такой луч строился внутри самой коллизии)
    return rays.filter(ray => {
      const { start, end, direction } = ray
      switch (direction) {
        case RayDirection.right:
          return start.x <= end.x
        case RayDirection.left:
          return start.x >= end.x
        case RayDirection.top:
          return start.y >= end.y
        case RayDirection.bottom:
          return start.y <= end.y
        default:
          return true
      }
    })
  }

  /**
   * Читаем список "лучей" с длиной относительно положения объекта и хитбоксов вокруг него.
   * Внимание! Пока класс умеет работать с прямоугольниками
   * */
  collide(mob) {
    super.collide(mob)
    return this._getNormalizedRays(mob)
  }

  check(mob, gravity, friction) {
    this.updatePosition(mob, gravity, friction)
    const rays = this.collide(mob)

    let newX = mob.x + mob.velocityX
    let newY = mob.y + mob.velocityY

    rays.forEach(ray => {
      const { end } = ray

      // В зависимости от направления луча, и положения игрока, корректируем координаты последнего
      switch (ray.direction) {
        case RayDirection.top:
          if (newY <= end.y) {
            newY = end.y
            mob.velocityY = 0
          }
          break
        case RayDirection.bottom:
          if (newY + mob.height >= end.y) {
            newY = end.y - mob.height
            mob.velocityY = 0
            mob.jumping = false
          }
          break
        case RayDirection.left:
          if (newX <= end.x) {
            newX = end.x
            mob.velocityX = 0
          }
          break
        case RayDirection.right:
          if (newX + mob.width >= end.x) {
            newX = end.x - mob.width
            mob.velocityX = 0
          }
          break
      }
    })

    mob.x = newX
    mob.y = newY

    return this._getNormalizedRays(mob)
  }
}