import { useReducer } from 'preact/hooks'

type OpenAction = {
  type: 'open'
  activeIndex?: number
  query: string
}

type CloseAction = {
  type: 'close'
}

type ToggleAction = {
  type: 'toggle'
}

type NextAction = {
  type: 'next'
  size: number
}

type BackAction = {
  type: 'back'
}

type MenuAction =
  | OpenAction
  | CloseAction
  | ToggleAction
  | NextAction
  | BackAction

const useMenuManager = () =>
  useReducer(
    (state, action: MenuAction) => {
      if (action.type == 'open') {
        return {
          ...state,
          open: true,
          activeIndex: action.activeIndex ?? state.activeIndex,
          query: action.query
        }
      } else if (action.type == 'close') {
        return {
          ...state,
          open: false,
          activeIndex: -1
        }
      } else if (action.type == 'toggle') {
        return {
          ...state,
          open: !state.open,
          activeIndex: -1,
          query: ''
        }
      } else if (action.type == 'next') {
        return {
          ...state,
          activeIndex: ((state.activeIndex + 2) % (action.size + 1)) - 1
        }
      } else if (action.type == 'back') {
        return {
          ...state,
          activeIndex: Math.max(-1, state.activeIndex - 1)
        }
      }
      return state
    },
    { open: false, activeIndex: -1, query: '' }
  )

export default useMenuManager
