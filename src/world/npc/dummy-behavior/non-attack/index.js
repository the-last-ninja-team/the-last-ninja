import { Behavior } from '../behavior'
import { Idling } from './idling'
import { Patrolling } from './patrolling'

export const NonAttackStatus = {
  idling: new Idling(),
  patrolling: new Patrolling(350)
}

export class NonAttack extends Behavior {
  constructor() {
    super()

    this.changeState = this.changeState.bind(this)
  }

  init(props) {
    super.init(props)
    this.setStatus(NonAttackStatus.idling)
    this.intervalId = setInterval(this.changeState, 10000)
  }

  destroy() {
    super.destroy()
    clearInterval(this.intervalId)
  }

  setStatus(status) {
    if (status === this.status) {
      return
    }

    this.status?.destroy()
    status.init(this.props)
    this.status = status
  }

  changeState() {
    switch (this.status) {
      case NonAttackStatus.idling:
        this.setStatus(NonAttackStatus.patrolling)
        break
      case NonAttackStatus.patrolling:
        this.setStatus(NonAttackStatus.idling)
        break
    }
  }

  update() {
    super.update()

    this.status.update()
  }
}