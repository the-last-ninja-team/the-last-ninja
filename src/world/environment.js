export class Environment {
  constructor(friction, gravity, collider) {
    this.friction = friction
    this.gravity = gravity
    this.collider = collider
  }

  init(limitRect, collisionObjects, tileMap) {
    this.mobs = []
    this.collides = []
    this.limitRect = limitRect
    this.collider.init(limitRect, collisionObjects, tileMap)
  }

  addMob(...mob) {
    this.mobs = this.mobs.concat(mob)
  }

  removeMob(mob) {
    this.mobs = this.mobs.filter(toRemove => !toRemove === mob)
  }

  _collideMob(mob) {
    // Как только ушли за границу пола, то перемещаем игрока на стартовую позицию
    if (mob.getTop() > this.limitRect.height) {
      mob.velocityX = 0
      mob.velocityY = 0
      mob.jumping = false
      mob.x = mob.originX
      mob.y = mob.originY
    }
  }

  update() {
    this.collides = []

    this.mobs.forEach(mob => {
      this.collides = this.collides.concat(
        this.collider.check(mob, this.gravity, this.friction))
      this._collideMob(mob)
    })
  }
}