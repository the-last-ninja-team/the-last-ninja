import { World } from './world/world'

export class Game {
  constructor(createLevel) {
    this.world = new World({ createLevel })
  }

  update(time) {
    this.world.update(time)
    this.world.level.imagesStore.update()
  }
}