import { createFeatureSelector } from '@ngrx/store';
import * as auth from './reducers/auth';

export interface AppStorage {
    authState: auth.State;
}

export const reducers = {
    auth: auth.reducer
}

export const selectAuthState = createFeatureSelector<AppStorage>('auth');