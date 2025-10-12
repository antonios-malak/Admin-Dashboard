/**
 * Page Permissions Utility
 * Maps routes to their corresponding permission keys
 */

export const pagePermissions: Record<string, string> = {
  // ✅ الرئيسية
//   "/": "dashboard_index",

  // ✅ إدارة النظام
  "/admins": "admins_index",
  "/roles": "roles_index",
  "/permissions": "permissions_index",

  // ✅ الكيانات الأساسية
  "/doctors": "doctors_index",
  "/specialities": "specialities_index",
  "/exercises": "exercises_index",
  "/follow-ups": "follow-ups_index",
  "/recovery-plans":"recovery-plans_index",
  //   '/advertisements': "advertisements_index",
  "/sliders": "sliders_index",

  // ✅ إدارة المجتمع
  //   '/community-posts': "community-posts_index",

  // ✅ إدارة طلبات التصفية
  //   '/filter-requests': "filter-requests_index",

  // ✅ إدارة الصفحات الثابتة داخل التطبيق
  "/app-pages": "pages_index",

  // ✅ إدارة الأسئلة الشائعة
  "/faqs": "faqs_index",

  // ✅ إدارة المواقع (الدول والمناطق والمدن)
  "/locations/countries": "countries_index",
  "/locations/regions": "regions_index",
  "/locations/cities": "cities_index",
  "/locations/districts": "districts_index",

  // ✅ الصفحات الرئيسية
  "/bags": "bags_index",
  "/packages": "packages_index",
  "/nationalities": "nationalities_index",

  // ✅ إعدادات النظام العامة
  "/settings": "settings-all_index",
  "/app-settings": "settings_index",

  // ✅ صفحة "اتصل بنا"
  "/contact-us": "contact-us_index",

  // ✅ الحساب الشخصي والإشعارات
    '/my-account': "profile_show",
  //   '/notifications': "notifications_index",

  // ✅ الاستشارة التلقائية والإيموجي
  "/auto-consultation": "auto-consultation_index",
  "/emojis": "emojis_index",
  //   '/videos': "videos_index"
  //   '/ads': "ads_index"
  // '/categories': "categories_index"
};
