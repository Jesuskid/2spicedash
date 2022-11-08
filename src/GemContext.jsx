import React, { createContext, useReducer } from 'react'

export const GemContext = createContext()

const reducer = (state, pair) => ({ ...state, ...pair })

const initialState = {
    gems: 0
}

export function GemProvider(props) {
    const [state, update] = useReducer(reducer, initialState)

    return (
        <GemContext.Provider value={{ state, update }}>
            {props.children}
        </GemContext.Provider>
    )
}