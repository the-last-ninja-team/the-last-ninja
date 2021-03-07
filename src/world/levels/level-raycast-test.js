import { Level } from '../level'
import { LEVELS } from '../../constants'
import { Resources } from '../../resources'

const LEVEL_TILES = Resources.getSprite('levelRaycastTest-tileset')
const levelMap = require('../../assets/level-maps/levelRaycastTest.json')

export class LevelRaycastTest extends Level {
  constructor() {
    super({
      key: 'levelRaycastTest',
      map: levelMap,
      spriteSheet: LEVEL_TILES,
      prevLevel: LEVELS.level01
    })
  }
}