import { UserProfile } from '@/services/users'
import { createSlice } from '@reduxjs/toolkit'
import { Session } from '@supabase/supabase-js'

type UserState = {
  data: {
    session: Session | null
    profile?: UserProfile
  }
}

const initialState: UserState = {
  data: {
    session: null,
  },
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.data = { ...state.data, ...action.payload }
    },
    removeUser: (state) => {
      state.data = initialState.data
    },
  },
})

export const { setUser, removeUser } = userSlice.actions
export default userSlice.reducer
