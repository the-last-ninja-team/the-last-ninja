import { Line } from './line'

export const RayDirection = {
  up: 'up',
  down: 'down',
  left: 'left',
  right: 'right'
}

export class Ray extends Line {
  constructor(p1, p2, direction) {
    super(p1, p2)

    this.direction = direction
  }
}