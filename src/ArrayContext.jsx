import React, { createContext, useReducer } from 'react'

export const ArrayContext = createContext()

const reducer = (state, pair) => ({ ...state, ...pair })

const initialState = {
    earned: 0,
    lost: 0,
    dates: []
}

export function ArrayProvider(props) {
    const [state, update] = useReducer(reducer, initialState)

    return (
        <ArrayContext.Provider value={{ state, update }}>
            {props.children}
        </ArrayContext.Provider>
    )
}