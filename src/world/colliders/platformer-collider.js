import { Collider } from '../../collider'
import { getCollisionMap, getSizesBy } from './utils'
import { Rect } from '../../base/rect'

export const CollisionType = {
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right'
}

/**
 * Здесь происходит вся магия вычисления коллизий в зависимости на какой тип ячейки врезался игрок.
 * Внимание! Сейчас необходимо, чтобы размеры игрока соотв. одному спрайту карты.
 * */
export class PlatformerCollider extends Collider {
  constructor() {
    super()
  }

  init(limitRect, collisionObjects, tileMap) {
    super.init(limitRect, collisionObjects, tileMap)
    this.collisionMap = getCollisionMap(collisionObjects, tileMap)
    this._getSizes = getSizesBy(tileMap)
  }

  /**
   * If the top of the object is above the bottom of the tile and on the previous
   * frame the top of the object was below the bottom of the tile, we have entered into
   * this tile. Pretty simple stuff.
   * */
  _collidePlatformBottom(object, tileBottom) {
    if (object.getTop() < tileBottom && object.getOldTop() >= tileBottom) {
      object.setTop(tileBottom)  // Move the top of the object to the bottom of the tile.
      object.velocityY = 0       // Stop moving in that direction.
      return true                // Return true because there was a collision.
    }

    return false
  }

  _collidePlatformLeft(object, tileLeft) {
    if (object.getRight() > tileLeft && object.getOldRight() <= tileLeft) {
      object.setRight(tileLeft - 0.01) // -0.01 is to fix a small problem with rounding
      object.velocityX = 0
      return true
    }
    
    return false
  }

  _collidePlatformRight(object, tileRight) {
    if (object.getLeft() < tileRight && object.getOldLeft() >= tileRight) {
      object.setLeft(tileRight)
      object.velocityX = 0
      return true
    }
    
    return false
  }

  _collidePlatformTop(object, tileTop) {
    if (object.getBottom() > tileTop && object.getOldBottom() <= tileTop) {
      object.setBottom(tileTop - 0.01)
      object.velocityY = 0
      object.jumping = false
      return true
    }
    
    return false
  }

  /**
   * Конвертация кода коллизий в 2 формат с лидирующими нулями.
   * На выходе всегда должно быть 4 символа.
   * */
  _dec2Bin(dec) {
    const bin = (dec >>> 0).toString(2)
    return `${'0'.repeat(4 - bin.length)}${bin}`
  }

  /**
   * Функция проверки, что есть нужный бит.
   * Я понимаю, что есть побитовые операции в JS, но например:
   *
   * 0010 & 1000 -> выдает 8, хотя я ожидают, что будет 0
   *
   * а если дополнить лидирующими нуля до 30 символов, результат уже который надо:
   *
   * 000000000000000000000000000010 & 000000000000000000000000001000 -> 0
   * 0b0010 & 0b1000 -> 0
   *
   * как нативно привести запись '0010' к 0b0010?
   *
   * */
  _checkBit(left, right) {
    const position = right.indexOf('1')
    return left[position] === '1'
  }

  /**
   * 0 0 0 0 = l b r t
   *
   * 0000 00 - no walls
   * 0001 01 - top wall
   * 0010 02 - right wall
   * 0011 03 - right-top wall
   * 0100 04 - bottom wall
   * 0101 05 - bottom-top wall
   * 0110 06 - bottom-right wall
   * 0111 07 - bottom-right-top wall
   * 1000 08 - left wall
   * 1001 09 - left-top wall
   * 1010 10 - left-right wall
   * 1011 11 - left-right-top wall
   * 1100 12 - left-bottom wall
   * 1101 13 - left-bottom-top wall
   * 1110 14 - left-bottom-right wall
   * 1111 15 - all walls
   *
   * @param value код коллизии (см. описание выше)
   * @param index номер ячейки в сетке уровня
   * @param object игрок
   * @param tileX x координата ячейки
   * @param tileY y координата ячвейки
   * @param size размер спрайта
   * */
  _collide(value, index, object, tileX, tileY, size) {
    const { width, height } = size

    const bin = this._dec2Bin(value)

    /*
      Сперва проверяем коллизию, когда объект продвигается слева-направо или справа-налево
      Такой приоритет обусловлен тем, что в случае, когда игрок жмет стрелку -> или <- и одновременно
      производит прыжок, исключить кратковременною задержку на платформе оформленную битом 0001 (top).
      Т.е. сперва мы "выталкиваем" объект левее платформы, если это нужно, а затем уже производим
      остальные коллизии.
    */

    if (this._checkBit(bin, '0010')) {
      if (this._collidePlatformRight(object, tileX + width)) return CollisionType.right
    }
    if (this._checkBit(bin, '1000')) {
      // left
      if (this._collidePlatformLeft(object, tileX)) return CollisionType.left
    }
    if (this._checkBit(bin, '0001')) {
      // top
      if (this._collidePlatformTop(object, tileY)) return CollisionType.top
    }
    if (this._checkBit(bin,'0100')) {
      // bottom
      if (this._collidePlatformBottom(object, tileY + height)) return CollisionType.bottom
    }

    return null
  }

  collide(object) {
    const collides = []
    object.collisions = []

    const { size, columns } = this.tileMap
    const { width, height } = size

    let bottom, left, right, top, value, index, collisionType

    top = this._getSizes(object).top
    left = this._getSizes(object).left
    collides.push(new Rect(left * width, top * height, width, height))

    index = top * columns + left
    value = this.collisionMap[index]
    collisionType = this._collide(value, index, object, left * width, top * height, size)
    if (collisionType) object.collisions.push(collisionType)

    top = this._getSizes(object).top
    right = this._getSizes(object).right
    collides.push(new Rect(right * width, top * height, width, height))

    index = top * columns + right
    value = this.collisionMap[index]
    collisionType = this._collide(value, index, object, right * width, top * height, size)
    if (collisionType) object.collisions.push(collisionType)

    bottom = this._getSizes(object).bottom
    left = this._getSizes(object).left
    collides.push(new Rect(left * width, bottom * height, width, height))

    index = bottom * columns + left
    value = this.collisionMap[index]
    collisionType = this._collide(value, index, object, left * width, bottom * height, size)
    if (collisionType) object.collisions.push(collisionType)

    bottom = this._getSizes(object).bottom
    right = this._getSizes(object).right
    collides.push(new Rect(right * width, bottom * height, width, height))

    index = bottom * columns + right
    value = this.collisionMap[index]
    collisionType = this._collide(value, index, object, right * width, bottom * height, size)
    if (collisionType) object.collisions.push(collisionType)

    return collides
  }
}