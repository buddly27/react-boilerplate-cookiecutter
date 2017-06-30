/**
 * Home Reducer.
 *
 */

import {fromJS} from "immutable";


const initialState = fromJS({});


export default function homeReducer(state = initialState, action) {
    switch (action.type) {
        default:
            return state;
    }
}
