export const LayerType = {
  background: 'background',
  afterBackground: 'after-background',
  level: 'level',
  staticAnimation: 'static-animation',
  front: 'front'
}

/** Класс для отрисовки всей анимации уровня в зависимости от слоя */
export class LevelImagesDraw {
  constructor(display) {
    this.display = display
  }

  init(imagesStore) {
    this.imagesStore = imagesStore
  }

  drawLayer(layerType) {
    this.imagesStore.images
      .filter(item => item.layerType === layerType)
      .forEach(({ image }) => this.display.drawImg(image))

    this.imagesStore.sprites
      .filter(item => item.layerType === layerType)
      .forEach(({ sprite }) => this.display.drawSprite(sprite))

    this.imagesStore.parallaxes
      .filter(item => item.layerType === layerType)
      .forEach(({ parallax, props }) => {
        parallax.sprites.forEach(sprite => this.display.drawSprite(sprite, props))
      })

    this.imagesStore.staticAnimations
      .filter(item => item.layerType === layerType)
      .forEach(({ staticAnimation }) => this.display.drawStaticAnimation(staticAnimation))
  }
}