import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { useHttp } from '../../hooks/http.hook';

const initialState = {
    filters: [],
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'

}

export const fetchFilters = createAsyncThunk(
    'filters/fetchFilters',
    () => {
        const {request} = useHttp();
        return request ("http://localhost:3001/filters")
    }
)

const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        filterChanged: (state, action) => {
                    state.activeFilter = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilters.pending, state => {state.filtersLoadingStatus = 'loading'})
            .addCase(fetchFilters.fulfilled, (state, action) => {
                state.filtersLoadingStatus = 'idle';
                state.filters = action.payload;})
            .addCase(fetchFilters.rejected, state => { state.filtersFetchingError = 'error'})
            .addDefaultCase(() => {})

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