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

  _collideMob(mob, limitRect) {
    if (mob.getLeft() < 0) {
      mob.setLeft(0)
      mob.velocityX = 0
    } else if (mob.getRight() > limitRect.width) {
      mob.setRight(limitRect.width)
      mob.velocityX = 0
    }

    // Как только ушли за границу пола, то перемещаем игрока на стартовую позицию
    if (mob.getTop() > limitRect.height) {
      mob.velocityX = 0
      mob.velocityY = 0
      mob.jumping = false
      mob.x = mob.originX
      mob.y = mob.originY
    }

    // if (mob.getTop() < 0) {
    //   mob.setTop(0)
    //   mob.velocityY = 0
    // } else if (mob.getBottom() > limitRect.height) {
    //   mob.setBottom(limitRect.height)
    //   mob.velocityY = 0
    //   mob.jumping = false
    // }

    this.collides = this.collides.concat(this.collider.collide(mob))
  }

  update() {
    this.collides = []

    this.mobs.forEach(mob => {
      mob.velocityY += this.gravity
      mob.updatePosition(this.gravity, this.friction)
      this._collideMob(mob, this.limitRect)
    })
  }
}