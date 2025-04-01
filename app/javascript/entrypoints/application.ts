import { start } from 'mastodon/common';
import { loadLocale } from 'mastodon/locales';
import main from 'mastodon/main';
import { loadPolyfills } from 'mastodon/polyfills';

start();

loadPolyfills()
  .then(loadLocale)
  .then(main)
  .catch((e: unknown) => {
    console.error(e);
  });
