import { Level } from '../level'
import { getImageScreenCountsByX } from '#/utils'
import { Resources } from '#/resources'
import { ParallaxDirection, ParallaxType } from '#graphic/parallax-image'
import { ParallaxAnimation } from '../animation/parallax-animation'
import { createCoinsStaticAnimation } from './helpers'
import { LEVELS } from '#/constants'
import { LayerType } from '#/level-images-draw'

const LEVEL_TILES = Resources.getSprite('level01-tileset')
const SEA_IMAGE = Resources.getImg('level01-sea')
const SKY_IMAGE = Resources.getImg('level01-sky')
const CLOUDS_IMAGE = Resources.getImg('level01-clouds')
const FAR_GROUNDS_IMAGE  = Resources.getImg('level01-far-grounds')

const levelMap = require('#assets/level-maps/level01.json')

export class Level01 extends Level {
  constructor() {
    super({
      key: 'level01',
      map: levelMap,
      spriteSheet: LEVEL_TILES,
      nextLevel: LEVELS.level02
    })

    this.coinsStaticAnimation = createCoinsStaticAnimation(levelMap, LEVEL_TILES)
    this.imagesStore.addStaticAnimation(this.coinsStaticAnimation)
  }

  createImages(display, camera) {
    super.createImages(display, camera)

    const backgroundContext = display.createContext(this.limitRect.width, this.limitRect.height)

    getImageScreenCountsByX(this.limitRect.width, SKY_IMAGE.width, (x) => {
      backgroundContext.drawImage(display.getImage(SKY_IMAGE.name), x, 0,
        SKY_IMAGE.width, SKY_IMAGE.height)
    })

    getImageScreenCountsByX(this.limitRect.width, SEA_IMAGE.width, (x) => {
      backgroundContext.drawImage(display.getImage(SEA_IMAGE.name), x,
        SKY_IMAGE.height, SEA_IMAGE.width, SEA_IMAGE.height)
    })

    this.imagesStore.addParallax(LayerType.afterBackground, {
      ...CLOUDS_IMAGE,
      y: SKY_IMAGE.height - CLOUDS_IMAGE.height,
      step: 1,
      delay: 2
    }).run()

    const farGroundParallax = this.imagesStore.addParallax(LayerType.afterBackground, {
      ...FAR_GROUNDS_IMAGE,
      y: this.limitRect.height - FAR_GROUNDS_IMAGE.height,
      space: this.screenRect.width,
      direction: ParallaxDirection.backward,
      type: ParallaxType.custom
    }, { camera: { offCameraX: true } })

    this.farGroundParallaxAnimation = new ParallaxAnimation({
      parallax: farGroundParallax,
      camera: camera,
      screenRect: this.screenRect,
      limitRect: this.limitRect,
      cameraTrap: this.cameraTrap
    })
    this.farGroundParallaxAnimation.watch(this.player)

    const { canvas } = backgroundContext
    const name = 'level01-background'
    display.addImage(name, canvas)
    this.imagesStore.addSprite(LayerType.background,
      { name, width: canvas.width, height: canvas.height })
  }

  watch(player) {
    super.watch(player)
    if (this.farGroundParallaxAnimation) {
      this.farGroundParallaxAnimation.watch(player)
    }
  }

  isCanMoveToTheNextLevel() {
    return !this.coinsStaticAnimation.objects.length
  }

  update() {
    super.update()
    this.farGroundParallaxAnimation?.update()
  }
}