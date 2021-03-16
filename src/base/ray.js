import { Line } from './line'

export const RayDirection = {
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
  topLeft: 'topLeft',
  topRight: 'topRight',
  bottomLeft: 'bottomLeft',
  bottomRight: 'bottomRight'
}

export class Ray extends Line {
  constructor(start, end, direction) {
    super(start, end)

    this.direction = direction
  }
}