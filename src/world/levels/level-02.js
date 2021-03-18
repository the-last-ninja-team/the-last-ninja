import { Level } from '../level'
import { Resources } from '#/resources'
import { createCoinsStaticAnimation } from './helpers'
import { getImageScreenCountsByX } from '#/utils'
import { LEVELS } from '#/constants'
import { LayerType } from '#/level-images-draw'

const LEVEL_TILES = Resources.getSprite('level02-tileset')
const SEA_IMAGE = Resources.getImg('level01-sea')
const SKY_IMAGE = Resources.getImg('level01-sky')
const CLOUDS_IMAGE = Resources.getImg('level01-clouds')

const levelMap = require('#assets/level-maps/level02.json')

export class Level02 extends Level {
  constructor() {
    super({
      key: 'level02',
      map: levelMap,
      spriteSheet: LEVEL_TILES,
      prevLevel: LEVELS.level01
    })

    this.coinsStaticAnimation = createCoinsStaticAnimation(levelMap, LEVEL_TILES)
    this.imagesStore.addStaticAnimation(this.coinsStaticAnimation)
  }

  createImages(display, camera) {
    super.createImages(display, camera)

    const backgroundContext = display.createContext(this.screenRect.width, this.screenRect.height)

    getImageScreenCountsByX(this.screenRect.width, SKY_IMAGE.width, (x) => {
      backgroundContext.drawImage(display.getImage(SKY_IMAGE.name), x, 0,
        SKY_IMAGE.width, SKY_IMAGE.height)
    })

    getImageScreenCountsByX(this.screenRect.width, SEA_IMAGE.width, (x) => {
      backgroundContext.drawImage(display.getImage(SEA_IMAGE.name), x,
        SKY_IMAGE.height, SEA_IMAGE.width, SEA_IMAGE.height)
    })

    this.imagesStore.addParallax(LayerType.afterBackground, {
      ...CLOUDS_IMAGE,
      y: SKY_IMAGE.height - CLOUDS_IMAGE.height,
      step: 1,
      delay: 2
    }).run()

    const { canvas } = backgroundContext
    const name = 'level02-background'
    display.addImage(name, canvas)
    this.imagesStore.addImage(LayerType.background,{ name, width: canvas.width, height: canvas.height })
  }

  isCanMoveToTheNextLevel() {
    return !this.coinsStaticAnimation.objects.length
  }
}