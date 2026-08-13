/* KindFare i18n
 * Session-scoped language switching. Uses sessionStorage (NOT localStorage) on purpose:
 * sessionStorage clears when the tab/app is closed, so the app always reopens in English
 * by default — a deliberate safety fallback, since translations here are AI-generated and
 * not professionally verified for a health app where mistranslation of safety-critical
 * content (conditions, exercise cautions, GP-check notices) carries real risk. A user who
 * wants a non-English language re-selects it each time they open the app; within one
 * sitting, the choice persists across every screen.
 */
window.KindFareI18n = (function () {
  var LANGS = [
    { code: 'en', native: 'English', rtl: false },
    { code: 'pt', native: 'Português', rtl: false },
    { code: 'hi', native: 'हिन्दी', rtl: false },
  ];

  // translations[langCode][key] = string. Missing keys fall back to English, then to the key itself.
  var translations = { en: {}, pt: {}, hi: {} };

  function getLang() {
    try {
      var v = sessionStorage.getItem('kf_lang');
      return v && translations[v] ? v : 'en';
    } catch (e) { return 'en'; }
  }
  function setLang(code) {
    try { sessionStorage.setItem('kf_lang', code); } catch (e) {}
  }
  function isRtl(code) {
    var l = LANGS.filter(function (x) { return x.code === code; })[0];
    return l ? l.rtl : false;
  }
  function t(key, lang) {
    lang = lang || getLang();
    var dict = translations[lang] || {};
    if (dict[key]) return dict[key];
    if (translations.en[key]) return translations.en[key];
    return key;
  }
  function extend(lang, dict) {
    if (!translations[lang]) translations[lang] = {};
    for (var k in dict) if (Object.prototype.hasOwnProperty.call(dict, k)) translations[lang][k] = dict[k];
  }

  var api = { LANGS: LANGS, translations: translations, getLang: getLang, setLang: setLang, isRtl: isRtl, t: t, extend: extend };

  // ---- common (shared across every screen: tab bar, header controls, aria labels) ----
  api.extend('en', {
    'common.choose_language': 'Choose language',
    'common.language_aria': 'Change language',
    'common.toggle_dark_mode': 'Toggle dark mode',
    'common.notifications': 'Notifications',
    'common.back': 'Back',
    'common.chat_with_mia': 'Chat with Mia',
    'common.profile': 'Profile',
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.plan': 'Plan',
    'nav.exercises': 'Exercises',
    'nav.profile': 'Profile',
  });
  api.extend('pt', {
    'common.choose_language': 'Escolher idioma',
    'common.language_aria': 'Mudar idioma',
    'common.toggle_dark_mode': 'Alternar modo escuro',
    'common.notifications': 'Notificações',
    'common.back': 'Voltar',
    'common.chat_with_mia': 'Conversar com a Mia',
    'common.profile': 'Perfil',
    'nav.home': 'Início',
    'nav.shop': 'Compras',
    'nav.plan': 'Plano',
    'nav.exercises': 'Exercícios',
    'nav.profile': 'Perfil',
  });
  api.extend('hi', {
    'common.choose_language': 'भाषा चुनें',
    'common.language_aria': 'भाषा बदलें',
    'common.toggle_dark_mode': 'डार्क मोड टॉगल करें',
    'common.notifications': 'सूचनाएं',
    'common.back': 'वापस',
    'common.chat_with_mia': 'मिया से चैट करें',
    'common.profile': 'प्रोफ़ाइल',
    'nav.home': 'होम',
    'nav.shop': 'दुकान',
    'nav.plan': 'योजना',
    'nav.exercises': 'व्यायाम',
    'nav.profile': 'प्रोफ़ाइल',
  });

  // ---- Home screen ----
  api.extend('en', {
    'home.greeting': 'Good afternoon',
    'home.today_monday': 'Today · Monday',
    'home.on_track': 'On track',
    'home.details': 'Details',
    'home.of_todays_goal': "of today's goal",
    'home.this_week': 'This week',
    'home.protein': 'Protein',
    'home.carbs': 'Carbs',
    'home.fat': 'Fat',
    'home.streak': 'Streak',
    'home.target_suffix': '/7 target',
    'home.days_on_target': 'days on target',
    'home.apple_health': 'Apple Health',
    'home.steps_today_view_all': 'steps today · view all',
    'home.mia_subtitle': 'Your on-device AI coach',
    'home.mia_insight_text': "You're 32g short on protein today — a Greek yoghurt or two eggs would close the gap comfortably.",
    'home.see_why': 'See why',
    'home.suggest_snack': 'Suggest a snack',
    'home.ask_mia': 'Ask Mia →',
    'home.quick_actions': 'Quick actions',
    'home.log_meal': 'Log a meal',
    'home.schedule': 'Schedule',
    'home.scan_food_soon': 'Scan food · Soon',
    'home.heart_scan_soon': 'Heart scan · Soon',
    'home.heart_scan_toast': 'Heart scan is coming soon',
  });
  api.extend('pt', {
    'home.greeting': 'Boa tarde',
    'home.today_monday': 'Hoje · Segunda-feira',
    'home.on_track': 'No caminho certo',
    'home.details': 'Detalhes',
    'home.of_todays_goal': 'da meta de hoje',
    'home.this_week': 'Esta semana',
    'home.protein': 'Proteína',
    'home.carbs': 'Carboidratos',
    'home.fat': 'Gordura',
    'home.streak': 'Sequência',
    'home.target_suffix': '/7 meta',
    'home.days_on_target': 'dias na meta',
    'home.apple_health': 'Apple Health',
    'home.steps_today_view_all': 'passos hoje · ver tudo',
    'home.mia_subtitle': 'Sua coach de IA no dispositivo',
    'home.mia_insight_text': 'Você está 32g abaixo da meta de proteína hoje — um iogurte grego ou dois ovos fechariam a diferença facilmente.',
    'home.see_why': 'Ver motivo',
    'home.suggest_snack': 'Sugerir um lanche',
    'home.ask_mia': 'Perguntar à Mia →',
    'home.quick_actions': 'Ações rápidas',
    'home.log_meal': 'Registrar uma refeição',
    'home.schedule': 'Agenda',
    'home.scan_food_soon': 'Escanear comida · Em breve',
    'home.heart_scan_soon': 'Escaneamento cardíaco · Em breve',
    'home.heart_scan_toast': 'O escaneamento cardíaco está chegando em breve',
  });
  api.extend('hi', {
    'home.greeting': 'शुभ दोपहर',
    'home.today_monday': 'आज · सोमवार',
    'home.on_track': 'सही राह पर',
    'home.details': 'विवरण',
    'home.of_todays_goal': 'आज के लक्ष्य का',
    'home.this_week': 'इस सप्ताह',
    'home.protein': 'प्रोटीन',
    'home.carbs': 'कार्ब्स',
    'home.fat': 'वसा',
    'home.streak': 'स्ट्रीक',
    'home.target_suffix': '/7 लक्ष्य',
    'home.days_on_target': 'लक्ष्य पर दिन',
    'home.apple_health': 'Apple Health',
    'home.steps_today_view_all': 'आज के कदम · सभी देखें',
    'home.mia_subtitle': 'आपकी ऑन-डिवाइस एआई कोच',
    'home.mia_insight_text': 'आज आप प्रोटीन में 32 ग्राम पीछे हैं — एक ग्रीक योगर्ट या दो अंडे आराम से यह कमी पूरी कर देंगे।',
    'home.see_why': 'कारण देखें',
    'home.suggest_snack': 'स्नैक सुझाएं',
    'home.ask_mia': 'मिया से पूछें →',
    'home.quick_actions': 'त्वरित कार्य',
    'home.log_meal': 'भोजन दर्ज करें',
    'home.schedule': 'समय-सारणी',
    'home.scan_food_soon': 'भोजन स्कैन करें · जल्द आ रहा है',
    'home.heart_scan_soon': 'हृदय स्कैन · जल्द आ रहा है',
    'home.heart_scan_toast': 'हृदय स्कैन जल्द ही आ रहा है',
  });

  // ---- Shop screen ----
  api.extend('en', {
    'shop.based_on_plan': 'Based on your plan',
    'shop.heading': 'Recommended shopping list',
    'shop.select_all': 'Select all',
    'shop.clear': 'Clear',
    'shop.diet_view': 'Diet view',
    'shop.standard': 'Standard',
    'shop.vegan': 'Vegan',
    'shop.items_picked_up': 'Items picked up',
    'shop.tick_off': "Tick off what you've got",
    'shop.cat_breakfast': 'Breakfast & Dairy',
    'shop.cat_fish': 'Fish',
    'shop.cat_poultry': 'Poultry & Meat',
    'shop.cat_vegan_proteins': 'Vegan Proteins',
    'shop.cat_eggs': 'Eggs & Dairy-free',
    'shop.cat_carbs': 'Carbs & Staples',
    'shop.cat_veg': 'Vegetables',
    'shop.cat_fruit': 'Fruit',
    'shop.cat_pantry': 'Pantry',
    'shop.export_list': 'Export list',
    'shop.planner_impact': 'Planner impact',
    'shop.meal_categories_covered': '0/15 meal categories covered',
    'shop.missing_heading': 'Missing to complete your week',
    'shop.missing_oats': 'Oats',
    'shop.missing_milk': 'Milk',
    'shop.missing_bread': 'Bread',
    'shop.missing_yoghurt': 'Yoghurt',
    'shop.missing_eggs': 'Eggs',
    'shop.missing_rice': 'Rice',
    'shop.missing_pasta': 'Pasta',
    'shop.missing_potato': 'Potato',
    'shop.missing_veg': 'Veg',
    'shop.required_for_targets': 'Required for daily calorie and macro targets',
  });
  api.extend('pt', {
    'shop.based_on_plan': 'Com base no seu plano',
    'shop.heading': 'Lista de compras recomendada',
    'shop.select_all': 'Selecionar tudo',
    'shop.clear': 'Limpar',
    'shop.diet_view': 'Modo de dieta',
    'shop.standard': 'Padrão',
    'shop.vegan': 'Vegano',
    'shop.items_picked_up': 'Itens comprados',
    'shop.tick_off': 'Marque o que você já tem',
    'shop.cat_breakfast': 'Café da manhã e laticínios',
    'shop.cat_fish': 'Peixe',
    'shop.cat_poultry': 'Aves e carne',
    'shop.cat_vegan_proteins': 'Proteínas veganas',
    'shop.cat_eggs': 'Ovos e sem laticínios',
    'shop.cat_carbs': 'Carboidratos e básicos',
    'shop.cat_veg': 'Vegetais',
    'shop.cat_fruit': 'Frutas',
    'shop.cat_pantry': 'Despensa',
    'shop.export_list': 'Exportar lista',
    'shop.planner_impact': 'Impacto no planejamento',
    'shop.meal_categories_covered': '0/15 categorias de refeição cobertas',
    'shop.missing_heading': 'Faltando para completar a sua semana',
    'shop.missing_oats': 'Aveia',
    'shop.missing_milk': 'Leite',
    'shop.missing_bread': 'Pão',
    'shop.missing_yoghurt': 'Iogurte',
    'shop.missing_eggs': 'Ovos',
    'shop.missing_rice': 'Arroz',
    'shop.missing_pasta': 'Massa',
    'shop.missing_potato': 'Batata',
    'shop.missing_veg': 'Vegetais',
    'shop.required_for_targets': 'Necessário para as metas diárias de calorias e macros',
  });
  api.extend('hi', {
    'shop.based_on_plan': 'आपकी योजना के आधार पर',
    'shop.heading': 'अनुशंसित खरीदारी सूची',
    'shop.select_all': 'सभी चुनें',
    'shop.clear': 'साफ़ करें',
    'shop.diet_view': 'आहार दृश्य',
    'shop.standard': 'मानक',
    'shop.vegan': 'वीगन',
    'shop.items_picked_up': 'खरीदी गई वस्तुएं',
    'shop.tick_off': 'जो आपके पास है उसे चेक करें',
    'shop.cat_breakfast': 'नाश्ता और डेयरी',
    'shop.cat_fish': 'मछली',
    'shop.cat_poultry': 'पोल्ट्री और मांस',
    'shop.cat_vegan_proteins': 'वीगन प्रोटीन',
    'shop.cat_eggs': 'अंडे और डेयरी-मुक्त',
    'shop.cat_carbs': 'कार्ब्स और स्टेपल्स',
    'shop.cat_veg': 'सब्ज़ियां',
    'shop.cat_fruit': 'फल',
    'shop.cat_pantry': 'पेंट्री',
    'shop.export_list': 'सूची निर्यात करें',
    'shop.planner_impact': 'योजनाकार प्रभाव',
    'shop.meal_categories_covered': '0/15 भोजन श्रेणियां शामिल',
    'shop.missing_heading': 'आपके सप्ताह को पूरा करने के लिए आवश्यक',
    'shop.missing_oats': 'ओट्स',
    'shop.missing_milk': 'दूध',
    'shop.missing_bread': 'ब्रेड',
    'shop.missing_yoghurt': 'दही',
    'shop.missing_eggs': 'अंडे',
    'shop.missing_rice': 'चावल',
    'shop.missing_pasta': 'पास्ता',
    'shop.missing_potato': 'आलू',
    'shop.missing_veg': 'सब्ज़ियां',
    'shop.required_for_targets': 'दैनिक कैलोरी और मैक्रो लक्ष्यों के लिए आवश्यक',
  });

  return api;
})();
