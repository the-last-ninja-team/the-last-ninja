const src = require('./assets/resources.json')

export class Resources {
  constructor() {
    //
  }

  static getSprite(name) {
    return src.sprites.find((sprite) => sprite.name === name)
  }

  static getImg(name) {
    return src.images.find((image) => image.name === name)
  }

  static getAllAssets() {
    const allAssets = {}
    src.sprites.forEach(({ name, src }) => allAssets[name] = src)
    src.images.forEach(({ name, src }) => allAssets[name] = src)
    return allAssets
  }
}