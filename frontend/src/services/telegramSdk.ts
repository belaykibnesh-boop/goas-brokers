import { init, miniApp } from '@telegram-apps/sdk';

export function initTelegramSDK() {
  try {
    init();
    if (miniApp.mount.isAvailable()) {
      miniApp.mount();
      miniApp.setHeaderColor('secondary_bg_color');
    }
    miniApp.ready();
  } catch (err) {
    console.warn('Running outside Telegram WebView frame context.');
  }
}