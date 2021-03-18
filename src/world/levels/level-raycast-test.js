import { Level } from '../level'
import { LEVELS } from '#/constants'
import { Resources } from '#/resources'

const LEVEL_TILES = Resources.getSprite('levelRayCastTest-tileset')
const levelMap = require('#assets/level-maps/levelRayCastTest.json')

export class LevelRayCastTest extends Level {
  constructor() {
    super({
      key: 'levelRayCastTest',
      map: levelMap,
      spriteSheet: LEVEL_TILES,
      prevLevel: LEVELS.level01
    })
  }
}