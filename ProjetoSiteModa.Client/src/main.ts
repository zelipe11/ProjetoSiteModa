import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';

if (environment.staticLooks && !environment.hashRouting && location.pathname === '/' && location.hash.startsWith('#/')) {
  const legacyUrl = location.hash.slice(1);
  if (!legacyUrl.startsWith('//') && !legacyUrl.includes('\\')) {
    history.replaceState(history.state, '', legacyUrl);
  }
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
