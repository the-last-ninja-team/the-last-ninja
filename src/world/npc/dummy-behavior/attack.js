import { Behavior } from './behavior'

export class Attack extends Behavior {
  constructor() {
    super()
  }

  update() {
    super.update()

    const { mob } = this.props
    mob.idling = false
  }
}