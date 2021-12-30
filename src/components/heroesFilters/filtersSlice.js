import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    filters: [],
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'

}

const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        filtersFetching: state => {state.filtersLoadingStatus = 'loading'},
        filtersFetched: (state, action) => {
                    state.filtersLoadingStatus = 'idle';
                    state.filters = action.payload;
        },
        filtersFetchingError: state => { state.filtersFetchingError = 'error'},
        filterChanged: (state, action) => {
                    state.activeFilter = action.payload;
        },
    }
});

const {actions, reducer} = filterSlice;
export default reducer;
export const {
    filtersFetching,
    filtersFetched,
    filtersFetchingError,
    filterChanged
} = actions;