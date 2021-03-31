import { World } from './world/world'

export class Game {
  constructor(createLevel, screen) {
    this.world = new World({ screen, createLevel })
  }

  update(time) {
    this.world.update(time)
    this.world.level.imagesStore.update()
  }
}