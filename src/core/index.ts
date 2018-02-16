// Export reducers and actions
export * from './reducers';
export * from './actions';
// Import the initial states
import { AuthState } from './reducers/auth';
import { SyncState } from './reducers/sync';
// Interface to hold the root state types (Typescript only)
export interface RootState {
  auth: AuthState;
  sync: SyncState;
}
