import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export interface CountryOption {
  label: string // e.g. EGY+20
  value: string // same as label for easy binding
  iso: string   // iso2 lowercase, e.g. 'eg'
  iso3: string  // iso3 uppercase, e.g. 'EGY'
  dial: string  // e.g. '+20'
}

export const useCountriesStore = defineStore('countries', () => {
  const options = ref<CountryOption[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchCountries = async () => {
    try {
      loading.value = true
      error.value = null
      const res = await api.get('/countries')
      const list: any[] = res.data?.data || res.data || []
      options.value = list.map((c: any) => {
        const iso2 = (c?.iso || '').toLowerCase()
        const iso3 = (c?.iso3 || '').toUpperCase()
        const dial = `+${c?.phone_code}`
        const label = `${iso3}+${c?.phone_code}`
        return { label, value: label, iso: iso2, iso3, dial }
      })
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.message || 'Failed to fetch countries'
      throw e
    } finally {
      loading.value = false
    }
  }

  return { options, loading, error, fetchCountries }
})


