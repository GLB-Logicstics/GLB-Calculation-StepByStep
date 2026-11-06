import { defineStore } from 'pinia'
import { round2 } from '~/utils/helpers'
import { useCustomsStore } from './customs'

interface FeeStep {
  from: number
  fee: number
}

interface FeeSet {
  secured: FeeStep[]
  percentFrom: number
  percent: number
  liveBid: FeeStep[]
  gate: number
}

export const titleTypes = [
  { id: 'clean', label: 'Clean Title Vehicles' },
  { id: 'non-clean', label: 'Non-Clean Title Vehicles' },
]

const fees: Record<string, FeeSet> = {
  clean: {
    secured: [
      { from: 0, fee: 1 }, { from: 50, fee: 1 }, { from: 100, fee: 25 }, { from: 200, fee: 50 },
      { from: 300, fee: 75 }, { from: 350, fee: 75 }, { from: 400, fee: 110 }, { from: 450, fee: 110 },
      { from: 500, fee: 125 }, { from: 550, fee: 130 }, { from: 600, fee: 140 }, { from: 700, fee: 155 },
      { from: 800, fee: 170 }, { from: 900, fee: 185 }, { from: 1000, fee: 200 }, { from: 1200, fee: 225 },
      { from: 1300, fee: 240 }, { from: 1400, fee: 250 }, { from: 1500, fee: 260 }, { from: 1600, fee: 275 },
      { from: 1700, fee: 285 }, { from: 1800, fee: 300 }, { from: 2000, fee: 325 }, { from: 2400, fee: 335 },
      { from: 2500, fee: 350 }, { from: 3000, fee: 400 }, { from: 3500, fee: 455 }, { from: 4000, fee: 600 },
      { from: 4500, fee: 625 }, { from: 5000, fee: 625 }, { from: 5500, fee: 625 }, { from: 6000, fee: 675 },
      { from: 6500, fee: 675 }, { from: 7000, fee: 675 }, { from: 7500, fee: 690 }, { from: 8000, fee: 715 },
      { from: 8500, fee: 715 }, { from: 9000, fee: 715 }, { from: 10000, fee: 720 }, { from: 10500, fee: 720 },
      { from: 11000, fee: 720 }, { from: 11500, fee: 720 }, { from: 12000, fee: 720 }, { from: 12500, fee: 720 },
    ],
    percentFrom: 15000,
    percent: 0.0575,
    liveBid: [
      { from: 0, fee: 0 }, { from: 100, fee: 49 }, { from: 500, fee: 59 }, { from: 1000, fee: 79 },
      { from: 1500, fee: 89 }, { from: 2000, fee: 99 }, { from: 4000, fee: 109 }, { from: 6000, fee: 139 },
      { from: 8000, fee: 149 },
    ],
    gate: 79,
  },
  'non-clean': {
    secured: [
      { from: 0, fee: 1 }, { from: 50, fee: 1 }, { from: 100, fee: 25 }, { from: 200, fee: 60 },
      { from: 300, fee: 85 }, { from: 350, fee: 100 }, { from: 400, fee: 125 }, { from: 450, fee: 135 },
      { from: 500, fee: 145 }, { from: 550, fee: 155 }, { from: 600, fee: 170 }, { from: 700, fee: 195 },
      { from: 800, fee: 215 }, { from: 900, fee: 230 }, { from: 1000, fee: 250 }, { from: 1200, fee: 270 },
      { from: 1300, fee: 285 }, { from: 1400, fee: 300 }, { from: 1500, fee: 315 }, { from: 1600, fee: 330 },
      { from: 1700, fee: 350 }, { from: 1800, fee: 370 }, { from: 2000, fee: 390 }, { from: 2400, fee: 425 },
      { from: 2500, fee: 460 }, { from: 3000, fee: 505 }, { from: 3500, fee: 555 }, { from: 4000, fee: 600 },
      { from: 4500, fee: 625 }, { from: 5000, fee: 650 }, { from: 5500, fee: 675 }, { from: 6000, fee: 700 },
      { from: 6500, fee: 720 }, { from: 7000, fee: 755 }, { from: 7500, fee: 775 }, { from: 8000, fee: 800 },
      { from: 8500, fee: 820 }, { from: 9000, fee: 820 }, { from: 10000, fee: 850 }, { from: 10500, fee: 850 },
      { from: 11000, fee: 850 }, { from: 11500, fee: 860 }, { from: 12000, fee: 875 }, { from: 12500, fee: 890 },
    ],
    percentFrom: 15000,
    percent: 0.06,
    liveBid: [
      { from: 0, fee: 0 }, { from: 100, fee: 50 }, { from: 500, fee: 65 }, { from: 1000, fee: 85 },
      { from: 1500, fee: 95 }, { from: 2000, fee: 110 }, { from: 4000, fee: 125 }, { from: 6000, fee: 145 },
      { from: 8000, fee: 160 },
    ],
    gate: 95,
  },
}

function feeFromTable(table: FeeStep[], bid: number): number {
  let fee = 0
  for (const row of table) {
    if (bid >= row.from) {
      fee = row.fee
    }
  }
  return fee
}

export const useAuctionStore = defineStore('auction', {
  state: () => ({
    bid: 0,
    titleType: 'clean',
  }),

  getters: {
    feeSet(): FeeSet {
      return fees[this.titleType] || fees.clean
    },

    buyerFee(): number {
      if (this.bid === 0) {
        return 0
      }
      if (this.bid >= this.feeSet.percentFrom) {
        return round2(this.bid * this.feeSet.percent)
      }
      return feeFromTable(this.feeSet.secured, this.bid)
    },

    liveBidFee(): number {
      if (this.bid === 0) {
        return 0
      }
      return feeFromTable(this.feeSet.liveBid, this.bid)
    },

    gateFee(): number {
      if (this.bid === 0) {
        return 0
      }
      return this.feeSet.gate
    },

    fee(): number {
      return this.buyerFee + this.liveBidFee + this.gateFee
    },

    isValid(): boolean {
      return this.bid > 0
    },
  },

  actions: {
    setBid(value: number) {
      if (value < 0) {
        value = 0
      }
      this.bid = value
      useCustomsStore().invoice = value
    },

    setTitleType(id: string) {
      this.titleType = id
    },
  },
})
