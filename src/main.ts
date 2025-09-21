import { createApp, watch } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './assets/main.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from './App.vue';
import i18n from './i18n';

// Restore locale from localStorage if available
const savedLocale = localStorage.getItem('locale');
if (savedLocale && ['en', 'ar'].includes(savedLocale)) {
  i18n.global.locale.value = savedLocale as 'en';
}

// Set initial direction
document.documentElement.setAttribute('dir', i18n.global.locale.value === 'ar' ? 'rtl' : 'ltr');

// Watch for locale changes and update direction/localStorage
watch(() => i18n.global.locale.value, (newLocale) => {
  document.documentElement.setAttribute('dir', newLocale === 'ar' ? 'rtl' : 'ltr');
  localStorage.setItem('locale', newLocale);
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.use(i18n);

// Register all Element Plus icons globally
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}


// Ensure locale is updated on browser back/forward navigation
window.addEventListener('popstate', () => {
  const savedLocale = localStorage.getItem('locale');
  if (savedLocale && ['en', 'ar'].includes(savedLocale)) {
    i18n.global.locale.value = savedLocale as 'en' | 'ar';
    document.documentElement.setAttribute('dir', savedLocale === 'ar' ? 'rtl' : 'ltr');
  }
});

app.mount('#app');
