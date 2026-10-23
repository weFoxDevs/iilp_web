import { configureStore } from '@reduxjs/toolkit';
import { cmsApi } from './api/cmsApi';

// Client-side store — provides RTK Query in-memory cache (5 min keepUnusedDataFor)
// Note: getStaticProps uses the service functions directly (not this store),
// so there is no server/client state mismatch.
export const store = configureStore({
  reducer: {
    [cmsApi.reducerPath]: cmsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cmsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
