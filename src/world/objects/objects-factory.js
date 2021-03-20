import { HMovingObject } from '#base/hmoving-object'
import { Ninja } from './ninja'
import { Enemy } from './enemy'

export class ObjectsFactory {
  constructor() {
    //
  }

  static createPlayer(x, y, props) {
    return new Ninja({
      ...props,
      x,
      y
    })
  }

  static createMovingObject({ props, tiles, getPosition }) {
    return (player) => ({
      object: new HMovingObject({
        ...props,
        ...getPosition(player),
        directionX: player.directionX,
      }),
      ...tiles()
    })
  }

  static createEnemy(x, y, props) {
    const enemy = new Enemy({
      ...props,
      x,
      y
    })

    enemy.isCanBlocking = props?.isCanBlocking ?? false
    return enemy
  }
}