import { Img } from '#graphic/img'
import { Sprite } from '#graphic/sprite'
import { ParallaxImage } from '#graphic/parallax-image'
import { LayerType } from '#/level-images-draw'

/**
 * Хранилище для картинок, спрайтов, статичной анимации и т.д.
 * При размещении того или иного ресурса, необходимо указать слой {@link LayerType}
 * */
export class LevelImagesStore {
  constructor(screenWidth) {
    this.screenWidth = screenWidth

    this.images = []
    this.sprites = []
    this.parallaxes = []
    this.staticAnimations = []
  }

  /** Добавляем статичную картинку, которая будет отображаться на экране не зависимости от положения камеры */
  addImage(layerType, props) {
    const image = new Img({ ...props })
    this.images.push({ layerType, image })
    return image
  }

  /** Добавляем спрайт, который будет отображаться на экране в зависимости от положения камеры */
  addSprite(layerType, props) {
    const sprite = new Sprite({ ...props })
    this.sprites.push({ layerType, sprite })
    return sprite
  }

  /** Добавляем параллакс, который создаем массив спрайтов и двигает их в нужном направлении */
  addParallax(layerType, parallaxProps, spriteProps) {
    const parallax = new ParallaxImage({
      ...parallaxProps,
      screenWidth: this.screenWidth
    })
    this.parallaxes.push({ layerType, parallax, props: spriteProps })
    return parallax
  }

  /**
   * Добавляем статичную анимацию.
   * Внимание! Пока непонятно, будут ли еще слои для статичной анимации.
   * */
  addStaticAnimation(staticAnimation, layerType = LayerType.staticAnimation) {
    this.staticAnimations.push({ layerType, staticAnimation })
  }

  update() {
    this.staticAnimations.forEach(({ staticAnimation }) => staticAnimation.update())
    this.parallaxes.forEach(({ parallax }) => parallax.update())
  }
}