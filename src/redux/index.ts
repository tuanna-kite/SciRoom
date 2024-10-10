import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import errorReducer from './errorSlice'
import languageReducer from './languageSlice'
import loadingReducer from './loadingSlice'
import userReducer from './userSlice'

const store = configureStore({
  reducer: {
    loading: loadingReducer,
    language: languageReducer,
    error: errorReducer,

    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
