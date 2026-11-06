import { defineStore } from 'pinia'
import { money } from '~/utils/helpers'
import { useShippingStore } from './shipping'
import { useAuctionStore } from './auction'
import { useCustomsStore } from './customs'

export const useCalculatorStore = defineStore('calculator', {
  state: () => ({
    active: 0,
    showResult: false,
    lot: '',
  }),

  getters: {
    valid(): boolean[] {
      return [
        true,
        useShippingStore().isValid,
        useAuctionStore().isValid,
        useCustomsStore().isValid,
      ]
    },

    isLast(): boolean {
      return this.active === 3
    },

    canNext(): boolean {
      return this.valid[this.active] === true
    },

    allValid(): boolean {
      return !this.valid.includes(false)
    },

    resultVisible(): boolean {
      return this.showResult && this.allValid
    },

    total(): number {
      const shipping = useShippingStore()
      const auction = useAuctionStore()
      const customs = useCustomsStore()
      return shipping.delivery + auction.bid + auction.fee + customs.total
    },

    auctionHint(): string {
      const auction = useAuctionStore()
      return 'Buyer fee ' + money(auction.buyerFee) + ' + Live bid ' + money(auction.liveBidFee) + ' + Gate ' + money(auction.gateFee)
    },

    customsHint(): string {
      const customs = useCustomsStore()
      let text = ''
      for (const line of customs.lines) {
        text = text + line.label + ': ' + line.value + ' AZN\n'
      }
      text = text + 'Cəmi: ' + customs.totalAzn + ' AZN'
      return text
    },
  },

  actions: {
    next() {
      if (this.canNext && !this.isLast) {
        this.active = this.active + 1
      }
    },

    back() {
      if (this.active > 0) {
        this.active = this.active - 1
      }
    },

    goTo(index: number) {
      for (let i = 0; i < index; i++) {
        if (!this.valid[i]) {
          return
        }
      }
      this.active = index
    },

    checkActive() {
      for (let i = 0; i < this.active; i++) {
        if (!this.valid[i]) {
          this.active = i
          return
        }
      }
    },

    showPrice() {
      if (this.allValid) {
        this.showResult = true
      }
    },
  },
})