import { getTileMapPoints, RectPosition } from '#/utils'
import { StaticMapAnimation } from '#graphic/static-map-animation'
import { Resources } from '#/resources'

export const createCoinsStaticAnimation = (levelMap, levelTiles) => {
  const coinsBoxes = levelMap.layers.find(({ name }) => name === 'coins')
  const coins = getTileMapPoints(coinsBoxes,
    { width: levelTiles.spriteWidth, height: levelTiles.spriteHeight },
    { position: RectPosition })
  return new StaticMapAnimation(
    coins,
    Resources.getSprite('coin-tiles'),
    {
      frames: [1, 2, 3, 4, 5, 6, 7, 8],
      delay: 2
    })
}