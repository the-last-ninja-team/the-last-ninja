import { findClosesRespawnPoint } from '#world/environment/utils'
import { Mob } from '#base/mob'
import { CollisionDetected } from '#/collision-detected'
import { Rect } from '#base/rect'

export class Environment {
  constructor({ friction, gravity, collider, screen }) {
    this.friction = friction
    this.gravity = gravity
    this.collider = collider
    this.screen = screen

    this.objects = new Map()
  }

  init({ limitRect, collisionObjects, tileMap, respawns }) {
    this.objects.clear()
    this.collides = []
    this.limitRect = limitRect
    this.respawns = respawns
    this.collisionObjects = collisionObjects
    this.collider.init(limitRect, collisionObjects, tileMap)
  }

  addObject(object, props) {
    this.objects.set(object, props)
  }

  removeObject(object) {
    this.objects.delete(object)
  }

  _collideMob(mob) {
    // Как только ушли за границу пола, то перемещаем игрока на стартовую позицию
    if (mob.getTop() > this.limitRect.height) {
      mob.velocityX = 0
      mob.velocityY = 0
      mob.jumping = false

      const respawn = findClosesRespawnPoint(mob, this.respawns)

      mob.x = respawn.x
      mob.y = respawn.y
    }
  }

  _collideObject(object, newPosition) {
    return this.collisionObjects.some(hitBox => {
      const newObjectRect = new Rect(newPosition.x, newPosition.y, object.width, object.height)
      if (CollisionDetected.isRectRect(hitBox, newObjectRect)) {
        return true
      }

      return false
    })
  }

  update() {
    this.collides = []

    const objectsToRemove = []

    this.objects.forEach((props, key) => {
      if (key instanceof Mob) {
        this.collides = this.collides.concat(this.collider.check(key, this.gravity, this.friction))
        this._collideMob(key)
      } else if (props) {
        const { get, apply } = props

        // Получаем новую позицию объекта
        const newPosition = get(key)

        // Строим прямую между текущим и новым положением
        const { x: currentX, y: currentY, width, height } = key
        const { x: newX, y: newY } = newPosition

        console.log('Result is', { currentX, currentY, width, height, newX, newY })

        if (currentX > (this.screen.x + this.screen.width) || (currentX + width) < this.screen.x
          || currentY + height > (this.screen.y + this.screen.height) || currentY < this.screen.y) {
          // Если объект ушел за пределы игрового пространства, то его необходимо удалить из массива
          objectsToRemove.push(key)
        } else if (this._collideObject(key, newPosition)) {
          // Если границы объекта пересеклись с препятствием, то мы запускаем анимацию "разрушения"
          // (например, стрела ударившись со стеной сломается)
          objectsToRemove.push(key)
        } else {
          // Применяем новое положение
          apply(key, newPosition)
        }
      }
    })

    // Удаляем объект из массива
    objectsToRemove.forEach(object => this.removeObject(object))
  }
}