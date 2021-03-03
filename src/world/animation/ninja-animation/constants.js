// Время той или иной анимации
export const NinjaAnimationDelay = {
  idle: 4,
  crouch: 4,
  slide: 2,
  cast: 2,
  sword: 2,
  airSword: 1,
  bow: 3,
  airBow: 1,
  flip: 2,
  jump: 1,
  fall: 2,
  touch: 3,
  move: 3,
  getOrRemoveSword: 3
}

export const NinjaActionType = {
  crouching: 'crouching',
  sliding: 'sliding',
  casting: 'casting',
  bowAttacking: 'bowAttacking',
  swordAttacking: 'swordAttacking',
  jumping: 'jumping',
  falling: 'falling',
  flipping: 'flipping',
  idling: 'idling',
  moving: 'moving',
  stopping: 'stopping'
}