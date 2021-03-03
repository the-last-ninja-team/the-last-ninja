import { Behavior } from '../behavior'

export const PatrollingDirection = {
  moveLeft: 'moveLeft',
  moveRight: 'moveRight'
}

export class Patrolling extends Behavior {
  constructor(range) {
    super()

    this.range = range
  }

  init(props) {
    super.init(props)

    this.direction = PatrollingDirection.moveLeft
  }

  changeDirection() {
    switch (this.direction) {
      case PatrollingDirection.moveLeft:
        this.direction = PatrollingDirection.moveRight
        break
      case PatrollingDirection.moveRight:
        this.direction = PatrollingDirection.moveLeft
        break
    }
  }

  update() {
    const { mob, limitRect } = this.props

    mob.idling = false

    switch (this.direction) {
      case PatrollingDirection.moveLeft:
        mob.moveLeft()
        if (mob.getLeft() <= limitRect.width - this.range) {
          this.changeDirection()
        }
        break
      case PatrollingDirection.moveRight:
        mob.moveRight()
        if (mob.getRight() >= limitRect.width) {
          this.changeDirection()
        }
        break
    }
  }
}