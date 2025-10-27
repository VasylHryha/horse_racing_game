import type { InjectionKey } from 'vue'

import type { Store } from 'vuex'
import type { RacingState } from './modules/racing'

import { useStore as baseUseStore, createStore } from 'vuex'
import racingModule from './modules/racing'

export interface RootState {
  racing: RacingState
}

export const key: InjectionKey<Store<RootState>> = Symbol('store')

export const store = createStore<RootState>({
  modules: {
    racing: racingModule,
  },
})

export function useStore() {
  return baseUseStore(key)
}
