import { SpriteSheet } from './sprite-sheet'

export class TilesetSpriteSheet extends SpriteSheet {
  constructor(props, tileset) {
    super(props)
    this.tileset = tileset
  }

  getTileSet(key) {
    const indexes = this.tileset.layers
      .find(({ name }) => name === key)?.data
      .filter(index => index > 0) ?? []

    if (indexes.length === 0) {
      return null
    }

    return this.getAnimationFramesWithKey(key, indexes)
  }
}