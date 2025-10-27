import type { ActionContext, GetterTree, Module, MutationTree } from 'vuex'
import { useHorseGeneration } from '@/composables/useHorseGeneration'
import { useRaceSchedule } from '@/composables/useRaceSchedule'
import { TOTAL_ROUNDS } from '@/utils/constants'

export interface Horse {
  id: number
  name: string
  color: string
  condition: number
}

export interface Round {
  roundNumber: number
  distance: number
  horses: Horse[]
  results: RaceResult | null
}

export interface HorseRanking {
  horseId: number
  name: string
  color: string
  time: number
  speed: number
  position: number
}

export interface RaceResult {
  roundNumber: number
  distance: number
  rankings: HorseRanking[]
}

export interface HorsePosition {
  distance: number
  progress: number
  finished: boolean
  time: number | null
  rank: number
}

export interface RaceState {
  elapsedTime: number
  positions: Record<number, HorsePosition>
}

export interface RacingState {
  horses: Horse[]
  schedule: Round[]
  currentRound: number
  raceResults: RaceResult[]
  isRacing: boolean
  isScheduleGenerated: boolean
  currentRaceState: RaceState | null
}

const mutations: MutationTree<RacingState> = {
  SET_HORSES(state: RacingState, horses: Horse[]) {
    state.horses = horses
  },

  SET_SCHEDULE(state: RacingState, schedule: Round[]) {
    state.schedule = schedule
    state.isScheduleGenerated = true
  },

  SET_CURRENT_ROUND(state: RacingState, round: number) {
    state.currentRound = round
  },

  SET_IS_RACING(state: RacingState, isRacing: boolean) {
    state.isRacing = isRacing
  },

  ADD_RACE_RESULT(state: RacingState, result: RaceResult) {
    state.raceResults.push(result)
  },

  SET_CURRENT_RACE_STATE(state: RacingState, raceState: RaceState) {
    state.currentRaceState = raceState
  },

  RESET_GAME(state: RacingState) {
    state.schedule = []
    state.currentRound = 0
    state.raceResults = []
    state.isRacing = false
    state.isScheduleGenerated = false
    state.currentRaceState = null
  },
}

const getters: GetterTree<RacingState, any> = {
  currentRoundData: (state: RacingState): Round | undefined => {
    return state.schedule[state.currentRound]
  },
}

const racingModule: Module<RacingState, any> = {
  namespaced: true,

  state: (): RacingState => ({
    horses: [],
    schedule: [],
    currentRound: 0,
    raceResults: [],
    isRacing: false,
    isScheduleGenerated: false,
    currentRaceState: null,
  }),

  mutations,
  getters,

  actions: {
    generateHorses({ commit }: ActionContext<RacingState, any>) {
      const { generateHorses } = useHorseGeneration()
      const horses = generateHorses()
      commit('SET_HORSES', horses)
    },

    generateSchedule({ commit, state }: ActionContext<RacingState, any>) {
      const { generateSchedule } = useRaceSchedule()
      const schedule = generateSchedule(state.horses)
      commit('SET_SCHEDULE', schedule)
      commit('RESET_GAME')
      commit('SET_SCHEDULE', schedule)
    },

    completeRound({ commit, state }: ActionContext<RacingState, any>, results: RaceResult) {
      commit('ADD_RACE_RESULT', results)

      if (state.currentRound < TOTAL_ROUNDS - 1) {
        commit('SET_CURRENT_ROUND', state.currentRound + 1)
      }
      else {
        commit('SET_IS_RACING', false)
      }
    },
  },
}

export default racingModule
