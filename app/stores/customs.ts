import { defineStore } from 'pinia'
import { round2 } from '~/utils/helpers'
import { useVehicleStore } from './vehicle'

interface Line {
  label: string
  value: number
}

export const engineTypes = [
  { id: 'petrol', label: 'Petrol' },
  { id: 'diesel', label: 'Diesel' },
  { id: 'gas', label: 'Gas' },
  { id: 'hybrid-petrol', label: 'Hybrid (petrol)' },
  { id: 'hybrid-diesel', label: 'Hybrid (diesel)' },
  { id: 'electric', label: 'Electric' },
]

export const origins = [
  { id: 'other', label: 'Other countries' },
  { id: 'fta', label: 'Produced in the country with which a free trade agreement has been concluded, and imported from there' },
]

const USD_RATE = 1.7
const VAT_RATE = 0.18
const FIXED_FEE = 30

const EXCISE_LIMITS = [2000, 3000, 4000, 5000, Infinity]
const EXCISE_RATES_NEW = [0.3, 5, 13, 35, 70]
const EXCISE_RATES_MID = [0.3, 5, 15, 40, 80]
const EXCISE_RATES_OLD = [0.45, 7.5, 22.5, 60, 120]

const CUSTOMS_FEES = [
  { limit: 1000, fee: 15 },
  { limit: 10000, fee: 60 },
  { limit: 50000, fee: 120 },
  { limit: 100000, fee: 200 },
  { limit: 500000, fee: 300 },
  { limit: 1000000, fee: 600 },
  { limit: Infinity, fee: 1000 },
]

function calcExcise(engine: number, rates: number[]): number {
  let total = 0
  let previous = 0

  for (let i = 0; i < EXCISE_LIMITS.length; i++) {
    if (engine <= previous) {
      break
    }
    const part = Math.min(engine, EXCISE_LIMITS[i]) - previous
    total = total + part * rates[i]
    previous = EXCISE_LIMITS[i]
  }

  return total
}

function calcCustomsFee(customsValue: number): number {
  for (const row of CUSTOMS_FEES) {
    if (customsValue <= row.limit) {
      return row.fee
    }
  }
  return 0
}

export const useCustomsStore = defineStore('customs', {
  state: () => ({
    engineType: '',
    invoice: 0,
    transport: 0,
    other: 0,
    engine: 0,
    date: '',
    origin: '',
  }),

  getters: {
    vehicleKind(): string {
      const vehicle = useVehicleStore()
      return vehicle.typeLabel + ' · ' + vehicle.classLabel
    },

    isElectric(): boolean {
      return this.engineType === 'electric'
    },

    needsEngine(): boolean {
      return !this.isElectric
    },

    issueDate(): Date {
      const parts = this.date.split('-')
      return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
    },

    age(): number {
      const today = new Date()
      const issue = this.issueDate
      let years = today.getFullYear() - issue.getFullYear()

      if (today.getMonth() < issue.getMonth()) {
        years = years - 1
      } else if (today.getMonth() === issue.getMonth() && today.getDate() < issue.getDate()) {
        years = years - 1
      }

      return years
    },

    yearDiff(): number {
      return new Date().getFullYear() - this.issueDate.getFullYear()
    },

    customsValue(): number {
      return round2((this.invoice + this.transport + this.other) * USD_RATE)
    },

    importDuty(): number {
      if (this.origin === 'fta') {
        return 0
      }

      if (this.isElectric) {
        if (this.yearDiff <= 2) {
          return 0
        }
        return round2(this.customsValue * 0.15)
      }

      let perCcUsd = 0
      if (this.engine <= 1500) {
        perCcUsd = this.age < 1 ? 0.4 : 0.7
      } else {
        perCcUsd = this.age < 1 ? 0.7 : 1.2
      }
      return round2(this.engine * perCcUsd * USD_RATE)
    },

    excise(): number {
      if (this.isElectric) {
        return 0
      }

      let rates = EXCISE_RATES_NEW
      if (this.yearDiff >= 7) {
        rates = EXCISE_RATES_OLD
      } else if (this.age >= 3) {
        rates = EXCISE_RATES_MID
      }
      return round2(calcExcise(this.engine, rates))
    },

    vat(): number {
      return round2((this.customsValue + this.importDuty + this.excise + FIXED_FEE) * VAT_RATE)
    },

    utilization(): number {
      if (this.yearDiff <= 3) return 0
      if (this.yearDiff <= 6) return 400
      return 700
    },

    lines(): Line[] {
      return [
        { label: 'İdxal gömrük rüsumu', value: this.importDuty },
        { label: 'ƏDV', value: this.vat },
        { label: 'Gömrük yığımları', value: calcCustomsFee(this.customsValue) },
        { label: 'Aksiz', value: this.excise },
        { label: 'Vəsiqə üçün gömrük yığımı', value: FIXED_FEE },
        { label: 'Elektron gömrük xidməti haqqı', value: FIXED_FEE },
        { label: 'Elektron gömrük xidməti üzrə ƏDV', value: round2(FIXED_FEE * VAT_RATE) },
        { label: 'Utilizasiya haqqı', value: this.utilization },
        { label: 'Gömrük ekspertizasının aparılmasına görə gömrük yığımı', value: FIXED_FEE },
        { label: 'Standartlara uyğunluğa dair verilən sertifikat üçün dövlət rüsumu', value: FIXED_FEE },
      ]
    },

    totalAzn(): number {
      let sum = 0
      for (const line of this.lines) {
        sum = sum + line.value
      }
      return round2(sum)
    },

    total(): number {
      return round2(this.totalAzn / USD_RATE)
    },

    isValid(): boolean {
      if (this.engineType === '') return false
      if (this.invoice === 0) return false
      if (this.transport === 0) return false
      if (this.needsEngine && this.engine === 0) return false
      if (this.date === '') return false
      return true
    },
  },

  actions: {
    toggleOrigin(id: string) {
      if (this.origin === id) {
        this.origin = ''
      } else {
        this.origin = id
      }
    },
  },
})