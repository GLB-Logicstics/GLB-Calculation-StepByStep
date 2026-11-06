import type { Pinia } from 'pinia'

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia as Pinia
  const cookie = useCookie<Record<string, object> | null>('calculator', { maxAge: 60 * 60 * 24 })

  pinia.use(({ store }) => {
    const saved = cookie.value ? cookie.value[store.$id] : null

    if (saved) {
      store.$patch(saved)
    }

    store.$subscribe(() => {
      cookie.value = { ...cookie.value, [store.$id]: { ...store.$state } }
    }, { detached: true })
  })
})
