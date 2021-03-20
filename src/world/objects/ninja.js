import { Mob } from '#base/mob'
import { MobAction } from '#base/mob-action'

export class Ninja extends Mob {
  constructor(props) {
    super(props)

    this.castAction = new MobAction('cast')
    this.swordAttackAction = new MobAction('sword-attack')
    this.bowAttackAction = new MobAction('bow-attack')

    this.isArmed = false
    this.timer = 0
  }

  isAction() {
    return this.bowAttackAction.action
      || this.castAction.action
      || this.swordAttackAction.action
  }

  moveLeft() {
    if (!this.jumping && this.isAction()) {
      return
    }

    super.moveLeft()
  }

  moveRight() {
    if (!this.jumping && this.isAction()) {
       return
    }

    super.moveRight()
  }

  cast() {
    if (!this.jumping && !this.crouching) {
      // Кастуем, только на земле и когда стоим
      this.castAction.fire()
    }
  }

  sword() {
    if (!this.crouching) {
      // Атака мечом, только когда стоим или в воздухе
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.isArmed = true
      this.swordAttackAction.fire()
      this.timer = setTimeout(() => this.isArmed = false, 5000)
    }
  }

  bow() {
    if (!this.crouching) {
      // Стреляем из лука, только когда стоим, на земле или в воздухе на определенном расстоянии от "земли"
      this.bowAttackAction.fire()
    }
  }
}