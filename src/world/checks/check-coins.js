import { checkRectCollision } from '../../utils'

import { MoveCoinToPlayer } from './move-coin-to-player'
import { JobList } from '../job/job-list'

export class CheckCoins {
  constructor(player, coinsStaticAnimation) {
    this.player = player
    this.coinsStaticAnimation = coinsStaticAnimation

    this.moveToPlayersJobs = new JobList()

    this.hitCoin = this.hitCoin.bind(this)
  }

  hitCoin(job) {
    this.moveToPlayersJobs.removeJob(job)
    this.coinsStaticAnimation.removePoints(job.coin)
    console.debug('Coins left', {
      objects: this.coinsStaticAnimation.objects.length,
      jobs: this.moveToPlayersJobs.jobs.length,
      coins: this.coinsStaticAnimation.points.length
    })
  }

  update(playerCollisionRects) {
    if (this.coinsStaticAnimation.objects.length) {
      const coinsNearPlayer = this.coinsStaticAnimation.points.filter(coin => {
        return playerCollisionRects.some(rect => {
          return checkRectCollision(coin, rect)
        })
      })

      if (coinsNearPlayer.length) {
        coinsNearPlayer.forEach(coin => {
          if (!this.moveToPlayersJobs.findJob((job) => job.coin === coin)) {
            this.moveToPlayersJobs.addJob(new MoveCoinToPlayer(this.player, coin), this.hitCoin)
          }
        })
      }
    }

    this.moveToPlayersJobs.update()
  }
}