import { Vector } from '#base/vector'

export const findClosesRespawnPoint = (mob, respawns) => {
  const mobCurrentPoint = new Vector(mob.x, mob.y)

  let closestDistance = 0
  let closestPoint = null

  respawns.forEach(({ x, y }) => {
    const point = new Vector(x, y)
    const distance = point.distanceFrom(mobCurrentPoint)
    if (distance < closestDistance || closestDistance === 0) {
      closestPoint = point
      closestDistance = distance
    }
  })

  return closestPoint ?? new Vector(mob.originX, mob.originY)
}