import { Mob } from '../../base/mob'
import { MobAction } from '../../base/mob-action'

export class Enemy extends Mob {
  constructor(props) {
    super(props)

    this.isCanBlocking = false
    this.attackAction = new MobAction('attack')
  }

  isAction() {
    return this.attackAction.action
  }

  attack() {
    this.attack.fire()
  }
}