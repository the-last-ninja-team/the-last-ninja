import { Attack } from './attack';
import { NonAttack } from './non-attack'

export const MobStatus = {
  nonAttacking: new NonAttack(),
  attacking: new Attack()
}

export class DummyBehavior {
  constructor(mob, player, screenRect, limitRect) {
    this.mob = mob
    this.player = player
    this.screenRect = screenRect
    this.limitRect = limitRect

    this.status = null

    this.setStatus(MobStatus.nonAttacking)
  }

  setStatus(status) {
    if (status === this.status) {
      return
    }

    this.status?.destroy()

    status.init({
      mob: this.mob,
      player: this.player,
      screeRect: this.screenRect,
      limitRect: this.limitRect,
    })
    this.status = status
  }

  isPlayerNearMob() {
    if (!this.player) {
      return false
    }
    return Math.abs(this.player.x - this.mob.x) <= 400;
  }

  check() {
    if (this.isPlayerNearMob()) {
      this.setStatus(MobStatus.attacking)
    } else {
      this.setStatus(MobStatus.nonAttacking)
    }
  }

  update() {
    this.check()
    this.status.update()
  }
}