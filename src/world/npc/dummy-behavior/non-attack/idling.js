import { Behavior } from '../behavior'

export class Idling extends Behavior {
  constructor() {
    super()
  }

  update() {
    this.props.mob.idling = true
  }
}