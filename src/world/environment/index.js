import { findClosesRespawnPoint } from '#world/environment/utils'
import { Mob } from '#base/mob'

export class Environment {
  constructor(friction, gravity, collider) {
    this.friction = friction
    this.gravity = gravity
    this.collider = collider

    this.objects = new Map()
  }

  init({ limitRect, collisionObjects, tileMap, respawns }) {
    this.objects.clear()
    this.collides = []
    this.limitRect = limitRect
    this.respawns = respawns
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

  update() {
    this.collides = []

    this.objects.forEach((props, key) => {
      if (key instanceof Mob) {
        this.collides = this.collides.concat(this.collider.check(key, this.gravity, this.friction))
        this._collideMob(key)
      } else if (props) {
        const { get, apply } = props
        const position = get(key)
        apply(key, position)
      }
    })
  }
}