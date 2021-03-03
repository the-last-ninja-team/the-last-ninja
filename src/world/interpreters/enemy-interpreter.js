/**
 * Здесь мы пытаемся интерпретировать состояние врага, в зависимости от его флагов,
 * положения, ускорения и т.д. в действие
 * */
export class EnemyInterpreter {
  constructor(enemy) {
    this.enemy = enemy
    this.statuses = [0, 1, 0, 0, 0, 0]

    setInterval(() => {
      const index = this.statuses.findIndex(value => value)
      this.statuses[index] = 0
      this.statuses[Math.floor(Math.random() * this.statuses.length)] = 1
    }, 3000)
  }

  // Атака
  isAttacking() {
    return this.statuses[0]
  }

  // Ожидание
  isIdling() {
    return this.statuses[1]
  }

  // Движение
  isMoving() {
    return this.statuses[2]
  }

  // Блок удара
  isBlocking() {
    return this.statuses[3] && this.enemy.isCanBlocking
  }

  // Получил удар
  isTakeHit() {
    return this.statuses[4]
  }

  // Умер
  isDead() {
    return this.statuses[5]
  }
}