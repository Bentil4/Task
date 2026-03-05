import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { boardReducer } from './core/store/board/reducer/board.reducer';
import { BoardEffects } from './core/store/board/effects/board.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore({ board: boardReducer }),
    provideEffects([BoardEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: false })
  ],
};
