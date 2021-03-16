import { Rect } from './base/rect'

export const RectPosition = {
  default: 'default',
  center: 'center',
  left: 'left',
  top: 'top',
  bottom: 'bottom',
  right: 'right'
}

/**
 * Функция для чтения позиции прямоугольника относительно размера спрайта
 * @param rect прямоугольник
 * @param position позиция (сейчас реализовано только center)
 * @param spriteSize размеры спрайта
 * */
export const getRectPosition = (rect, position, spriteSize) => {
  const { x, y, width, height } = rect
  const { width: baseWidth, height: baseHeight } = spriteSize

  let newX = x
  let newY = y

  switch (position) {
    case RectPosition.center:
      newX = x + (baseWidth / 2) - (width / 2)
      newY = y + (baseHeight / 2) - (height / 2)
      break
  }

  return { x: newX, y: newY }
}

export const getTileMapPoints = (tileMap, size, props) => {
  const { width, height, position = RectPosition.center } = props ?? {}
  const points = []

  tileMap.objects.forEach(object => {
    let startX = object.x
    let startY = object.y
    const rows = object.height / size.height
    const columns = object.width / size.width

    for (let i = 1; i <= rows * columns; i ++) {
      const pointRect = new Rect(startX, startY, width ?? size.width, height ?? size.height)
      const newPosition = getRectPosition(pointRect, position, size)
      points.push(new Rect(newPosition.x, newPosition.y, pointRect.width, pointRect.height))

      startX += size.width
      if (i % columns === 0) {
        startY += size.height
        startX = object.x
      }
    }
  })

  return points
}

/** Функция читающая площадь пересечения 2х прямоугольников */
export const getIntersectingRectsSquare = (rect1, rect2) => {
  const x_overlap = Math.max(0,
    Math.min(rect1.x + rect1.width, rect2.x + rect2.width) - Math.max(rect1.x, rect2.x))
  const y_overlap = Math.max(0,
    Math.min(rect1.y + rect1.height, rect2.y + rect2.height) - Math.max(rect1.y, rect2.y))
  return Math.floor(x_overlap * y_overlap)
}

export const getImageScreenCountsByX = (screenWidth, imgWidth, callback) => {
  let x = 0

  const columns = Math.floor(screenWidth / imgWidth) + 1
  for (let i = 0; i < columns; i ++) {
    callback(x)
    x += imgWidth
  }
}