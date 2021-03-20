export const getCollisionMap = (collisionObjects, tileMap) => {
  const collisionMap = [...Array.from({ length: tileMap.rows * tileMap.columns }).map(() => 0)]

  collisionObjects.forEach(({ type, x, y, width, height }) => {
    const value = parseInt(type, 10)
    if (value) {
      let startX = x
      let startY = y
      const rows = height / tileMap.size.height
      const columns = width / tileMap.size.width

      for (let i = 1; i <= rows * columns; i ++) {
        const index = (startY / tileMap.size.height) * tileMap.columns + (startX / tileMap.size.width)
        collisionMap[index] = value

        startX += tileMap.size.width

        if (i % columns === 0) {
          startY += tileMap.size.height
          startX = x
        }
      }
    }
  })

  return collisionMap
}

export const getSizesBy = (tileMap) => (object) => {
  const { width, height } = tileMap.size

  return {
    top: Math.floor(object.getTop() / height),
    bottom: Math.floor(object.getBottom() / height),
    left: Math.floor(object.getLeft() / width),
    right: Math.floor(object.getRight() / width),
  }
}