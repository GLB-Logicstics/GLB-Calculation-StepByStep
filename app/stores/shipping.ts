import { defineStore } from 'pinia'
import { useVehicleStore } from './vehicle'
import { useCustomsStore } from './customs'

interface Location {
  name: string
  port?: string
  car?: number
  moto?: number
}

interface Option {
  id: string
  label: string
  code?: string
  price?: string
}

export const auctions: Option[] = [
  { id: 'copart', label: 'Copart' },
  { id: 'iaai', label: 'IAAI' },
  { id: 'manheim', label: 'Manheim' },
  { id: 'adessa', label: 'Adessa' },
  { id: 'edge', label: 'Edge' },
]

export const exitPorts: Option[] = [
  { id: 'poti', label: 'Poti' },
]

const locations: Record<string, Location[]> = {
  copart: [
    { name: 'CA - Hayward', port: 'OAK', car: 1838, moto: 1298 },
    { name: 'OR - Portland South', port: 'WA', car: 2170, moto: 1448 },
    { name: 'OR - Portland North', port: 'WA', car: 2140, moto: 1473 },
    { name: 'OR - Eugene', port: 'WA', car: 2140, moto: 1508 },
    { name: 'HI-HONOLULU', port: 'Hono', car: 4850, moto: 4650 },
    { name: 'AK-Anchorage South', port: 'AK', car: 4085, moto: 4150 },
    { name: 'AK-Anchorage', port: 'AK', car: 4085, moto: 4150 },
    { name: 'WA - Graham', port: 'WA', car: 2090, moto: 1503 },
    { name: 'WA - North Seattle', port: 'WA', car: 2215, moto: 1478 },
    { name: 'WA - Pasco', port: 'WA', car: 2115, moto: 1768 },
  ],
  iaai: [
    { name: 'Anchorage (AK)', port: 'AK', car: 4635, moto: 4000 },
    { name: 'Eugene (OR)', port: 'wa', car: 2185, moto: 1950 },
    { name: 'Honolulu (HI)', port: 'HO', car: 4835, moto: 4635 },
    { name: 'Missoula (MT)', port: 'wa', car: 2810, moto: 2175 },
    { name: 'Portland South (OR)', port: 'wa', car: 2190, moto: 1875 },
    { name: 'Portland West (OR)', port: 'wa', car: 2190, moto: 1875 },
    { name: 'Seattle (WA)', port: 'wa', car: 2170, moto: 1715 },
    { name: 'Spokane (WA)', port: 'wa', car: 2240, moto: 1900 },
    { name: 'Abilene (TX)', port: 'TX', car: 1260, moto: 740 },
    { name: 'ACE - Carson (CA)', port: 'CA', car: 1713, moto: 1093 },
  ],
  manheim: [
    { name: '4 Star Auto Auction', port: 'GA', car: 1572, moto: 1097 },
    { name: 'AZ-phoenix', port: 'CA', car: 2137, moto: 1787 },
    { name: 'AZ-TUCSON', port: 'CA', car: 2137, moto: 1787 },
    { name: 'AR-Little Rock', port: 'GA', car: 1627, moto: 1152 },
    { name: 'CA-California', port: 'CA', car: 1962, moto: 1612 },
    { name: 'CA-FRESNO', port: 'CA', car: 2122, moto: 1772 },
    { name: 'CA-Oceanside', port: 'CA', car: 1937, moto: 1587 },
    { name: 'CA-RIVERSIDE', port: 'CA', car: 1937, moto: 1587 },
    { name: 'CA-San Francisco Bay', port: 'CA', car: 2152, moto: 1802 },
    { name: 'CA- Southern California', port: 'CA', car: 1987, moto: 1637 },
  ],
  adessa: [
    { name: 'CA - Los Angeles' },
    { name: 'CA - Sacramento' },
    { name: 'TX - Dallas' },
    { name: 'TX - Houston' },
    { name: 'FL - Tampa' },
    { name: 'GA - Atlanta' },
    { name: 'NJ - New Jersey' },
    { name: 'IL - Chicago' },
  ],
  edge: [
    { name: 'CA - Los Angeles' },
    { name: 'TX - Dallas' },
    { name: 'FL - Miami' },
    { name: 'GA - Atlanta' },
    { name: 'NJ - Newark' },
    { name: 'IL - Chicago' },
  ],
}

function getPrice(location: Location): number {
  const type = useVehicleStore().type

  if (type === 'car') {
    return location.car || 0
  }
  if (type === 'moto') {
    return location.moto || 0
  }
  return 0
}

export const useShippingStore = defineStore('shipping', {
  state: () => ({
    auction: '',
    location: '',
    exitPort: 'poti',
    city: '',
  }),

  getters: {
    locationList(): Location[] {
      return locations[this.auction] || []
    },

    selectedLocation(): Location | undefined {
      return this.locationList.find((location) => location.name === this.location)
    },

    locationOptions(): Option[] {
      const options: Option[] = []
      for (const location of this.locationList) {
        const price = getPrice(location)
        options.push({
          id: location.name,
          label: location.name,
          code: location.port,
          price: price ? '$' + price.toLocaleString('en-US') : '',
        })
      }
      return options
    },

    cityOptions(): Option[] {
      if (this.selectedLocation && this.selectedLocation.port) {
        return [{ id: this.selectedLocation.port, label: this.selectedLocation.port }]
      }
      return []
    },

    delivery(): number {
      if (this.selectedLocation) {
        return getPrice(this.selectedLocation)
      }
      return 0
    },

    auctionLabel(): string {
      const auction = auctions.find((auction) => auction.id === this.auction)
      return auction ? auction.label : ''
    },

    exitPortLabel(): string {
      return this.exitPort === 'poti' ? 'Poti' : ''
    },

    country(): string {
      return this.exitPort === 'poti' ? 'Georgia' : ''
    },

    isValid(): boolean {
      return this.auction !== '' && this.location !== '' && this.exitPort !== '' && this.city !== ''
    },
  },

  actions: {
    chooseAuction(id: string) {
      if (this.auction !== id) {
        this.location = ''
        this.city = ''
      }
      this.auction = id
    },

    chooseLocation(name: string) {
      this.location = name
      this.city = this.cityOptions.length ? this.cityOptions[0].id : ''
      useCustomsStore().transport = this.delivery
    },

    chooseExitPort(id: string) {
      this.exitPort = id
    },

    chooseCity(id: string) {
      this.city = id
    },
  },
})
