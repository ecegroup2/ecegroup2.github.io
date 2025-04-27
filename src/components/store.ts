import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HealthDataState {
    heartrate: number;
    spo2: number;
    ecg: number[];
}

const initialState: HealthDataState = {
    heartrate: 0,
    spo2: 0,
    ecg: Array(499).fill(0), // Initialize with 499 zeros
};

const healthDataSlice = createSlice({
    name: 'healthData',
    initialState,
    reducers: {
        setHeartrate(state, action: PayloadAction<number>) {
            state.heartrate = action.payload;
        },
        setSpo2(state, action: PayloadAction<number>) {
            state.spo2 = action.payload;
        },
        updateEcg(state, action: PayloadAction<number[]>) {
            state.ecg = action.payload.slice(0, 499); // Ensure it doesn't exceed 499
        },
    },
});

export const { setHeartrate, setSpo2, updateEcg } = healthDataSlice.actions;

const store = configureStore({
    reducer: {
        healthData: healthDataSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;