import { defineStore } from 'pinia'
import { useShippingStore } from './shipping'
import { useCustomsStore } from './customs'

interface VehicleItem {
  id: string
  label: string
  image: string
  width: number
}

interface Category {
  id: string
  label: string
  image: string
  width: number
  question: string
  items: VehicleItem[]
}

export const categories: Category[] = [
  {
    id: 'car',
    label: 'Car',
    image: '/images/vehicles/car.png',
    width: 190,
    question: 'Vehicle classification',
    items: [
      { id: 'sedan', label: 'Sedan', image: '/images/vehicles/sedan.png', width: 263 },
      { id: 'suv', label: 'SUV', image: '/images/vehicles/suv.png', width: 251 },
      { id: 'big-suv', label: 'Big SUV', image: '/images/vehicles/big-suv.png', width: 269 },
      { id: 'pickup', label: 'Pickup', image: '/images/vehicles/pickup.png', width: 288 },
    ],
  },
  {
    id: 'parts',
    label: 'Auto Parts',
    image: '/images/vehicles/auto-parts.png',
    width: 157,
    question: 'Vehicle classification',
    items: [
      { id: 'pallet', label: 'Pallets', image: '/images/vehicles/pallets.png', width: 263 },
      { id: 'pallet-1', label: 'Pallets', image: '/images/vehicles/pallets.png', width: 263 },
      { id: 'pallet-2', label: 'Pallets', image: '/images/vehicles/pallets.png', width: 263 },
      { id: 'pallet-3', label: 'Pallets', image: '/images/vehicles/pallets.png', width: 263 },
    ],
  },
  {
    id: 'moto',
    label: 'Moto',
    image: '/images/vehicles/moto.png',
    width: 142,
    question: 'Vehicle classification',
    items: [
      { id: 'motocycle', label: 'Motorcyrcles', image: '/images/vehicles/motocycle.png', width: 263 },
      { id: 'motocycle-1', label: 'Motorcyrcles', image: '/images/vehicles/motocycle.png', width: 263 },
      { id: 'motocycle-2', label: 'Motorcyrcles', image: '/images/vehicles/motocycle.png', width: 263 },
      { id: 'motocycle-3', label: 'Motorcyrcles', image: '/images/vehicles/motocycle.png', width: 263 },
    ],
  },
]

export const useVehicleStore = defineStore('vehicle', {
  state: () => ({
    type: 'car',
    item: 'sedan',
  }),

  getters: {
    category(): Category {
      return categories.find((category) => category.id === this.type) || categories[0]
    },

    selectedItem(): VehicleItem {
      return this.category.items.find((item) => item.id === this.item) || this.category.items[0]
    },

    typeLabel(): string {
      return this.category.label
    },

    classLabel(): string {
      return this.selectedItem.label
    },

    image(): string {
      return this.selectedItem.image
    },
  },

  actions: {
    selectType(id: string) {
      this.type = id
      this.item = this.category.items[0].id
      useCustomsStore().transport = useShippingStore().delivery
    },

    selectItem(id: string) {
      this.item = id
    },
  },
})
