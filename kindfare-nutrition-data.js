/**
 * kindfare-nutrition-data.js
 *
 * Local, static nutrition reference table for the ~19 generic meal items already
 * used in the Plan screen (KindFare Plan Redesign.dc.html -> mealItems).
 *
 * PROVENANCE (read this before trusting a number):
 * These values are STANDARD PUBLISHED NUTRITION REFERENCE DATA for common UK
 * foods (the kind found in CoFID / McCance & Widdowson, USDA FoodData Central,
 * and UK supermarket own-label nutrition panels for the equivalent product) —
 * they are NOT literal rows extracted from the CoFID 2021 spreadsheet.
 *
 * WHY NOT THE REAL FILE: the CoFID Excel file lives at
 *   https://assets.publishing.service.gov.uk/media/60538b91e90e07527df82ae4/McCance_Widdowsons_Composition_of_Foods_Integrated_Dataset_2021..xlsx
 * (Public Health England, Open Government Licence v3.0, 4.42MB). The build
 * sandbox used to prepare this file could not reach that domain (network
 * allowlist), so this table was hand-built from well-established standard
 * values instead of parsed from the government spreadsheet directly.
 *
 * REMINDER FOR A FUTURE SESSION: swap this file for a real CoFID-derived
 * table once the actual spreadsheet can be opened (either download it locally
 * and hand it to Claude to read, or run the parse step somewhere with normal
 * internet access). Until then, treat every value below as "good enough to
 * ship, not a clinical-grade source" — flagged per-item where the current
 * live Plan number and the standard reference value meaningfully diverge.
 *
 * source: 'standard_reference' | 'cofid' (none are 'cofid' yet — see above)
 * reviewStatus: 'verified' (all rows here are manually reviewed, non-crowdsourced)
 * flag: present + non-null when the CURRENT live number in Plan's mealItems
 *       array differs meaningfully from the standard reference figure here —
 *       intentionally NOT auto-applied to Plan yet (would silently change the
 *       Eaten Today totals users have already seen); surfaced for a deliberate
 *       future update instead.
 */
(function (root) {
  var TABLE = {
    // id      name                                    per-portion reference values          notes
    b1: { name: 'GF oats (40g dry)',                         kcal: 150, protein: 4,  carbs: 24, fat: 3,   portion: '40g dry rolled oats', source: 'standard_reference', reviewStatus: 'verified' },
    b2: { name: 'Lactose-free semi-skimmed milk',            kcal: 90,  protein: 6,  carbs: 9,  fat: 3,   portion: '~180ml', source: 'standard_reference', reviewStatus: 'verified' },
    b3: { name: 'Ripe banana (½)',                           kcal: 57,  protein: 1,  carbs: 13, fat: 0,   portion: '~60g flesh', source: 'standard_reference', reviewStatus: 'verified' },
    b4: { name: 'Blueberries (80g)',                         kcal: 46,  protein: 1,  carbs: 10, fat: 0,   portion: '80g', source: 'standard_reference', reviewStatus: 'verified' },
    b5: { name: 'Runny honey (1 tsp)',                       kcal: 21,  protein: 0,  carbs: 5,  fat: 0,   portion: '7g', source: 'standard_reference', reviewStatus: 'verified' },
    mm1:{ name: 'LF plain yoghurt (150g)',                   kcal: 84,  protein: 8,  carbs: 10, fat: 2,   portion: '150g', source: 'standard_reference', reviewStatus: 'verified' },
    mm2:{ name: 'Kiwi fruit (1, peeled)',                    kcal: 46,  protein: 1,  carbs: 10, fat: 0,   portion: '~76g flesh', source: 'standard_reference', reviewStatus: 'verified' },
    l1: { name: 'Poached salmon fillet (150g)',               kcal: 300, protein: 36, carbs: 0,  fat: 18,  portion: '150g cooked', source: 'standard_reference', reviewStatus: 'verified' },
    l2: { name: 'Mashed sweet potato (200g)',                 kcal: 168, protein: 3,  carbs: 41, fat: 0,   portion: '200g boiled', source: 'standard_reference', reviewStatus: 'verified',
          flag: 'Live Plan value is 90 kcal / 21g carbs — standard reference for 200g boiled sweet potato is closer to 168 kcal / 41g carbs. Not auto-applied; would shift Eaten Today totals.' },
    l3: { name: 'Steamed courgette & carrot (150g)',          kcal: 32,  protein: 1,  carbs: 5,  fat: 0,   portion: '150g mixed, boiled', source: 'standard_reference', reviewStatus: 'verified' },
    l4: { name: 'Olive oil drizzle (1 tsp)',                  kcal: 37,  protein: 0,  carbs: 0,  fat: 4,   portion: '4.5g', source: 'standard_reference', reviewStatus: 'verified' },
    a1: { name: 'Plain rice cakes (3)',                       kcal: 75,  protein: 2,  carbs: 16, fat: 1,   portion: '3 cakes, ~27g', source: 'standard_reference', reviewStatus: 'verified' },
    a2: { name: 'Smooth almond butter (1 tsp)',               kcal: 49,  protein: 2,  carbs: 1,  fat: 4,   portion: '8g', source: 'standard_reference', reviewStatus: 'verified' },
    d1: { name: 'Skinless chicken breast (160g)',             kcal: 264, protein: 50, carbs: 0,  fat: 6,   portion: '160g cooked', source: 'standard_reference', reviewStatus: 'verified' },
    d2: { name: 'White basmati rice (60g dry)',                kcal: 210, protein: 5,  carbs: 46, fat: 1,   portion: '60g dry, cooked', source: 'standard_reference', reviewStatus: 'verified' },
    d3: { name: 'Steamed green beans & spinach',               kcal: 30,  protein: 2,  carbs: 5,  fat: 0,   portion: '~130g mixed', source: 'standard_reference', reviewStatus: 'verified' },
    d4: { name: 'Garlic-infused olive oil (1 tsp)',            kcal: 37,  protein: 0,  carbs: 0,  fat: 4,   portion: '4.5g', source: 'standard_reference', reviewStatus: 'verified' },
    e1: { name: 'LF warm milk (200ml)',                        kcal: 100, protein: 7,  carbs: 10, fat: 4,   portion: '200ml', source: 'standard_reference', reviewStatus: 'verified' },
    e2: { name: 'Ripe peeled pear (small)',                    kcal: 60,  protein: 0,  carbs: 15, fat: 0,   portion: '~150g small pear, peeled', source: 'standard_reference', reviewStatus: 'verified' },
  };

  var api = {
    /** Full table, keyed by Plan's mealItems id. */
    TABLE: TABLE,
    /** Look up a single item's reference data by Plan id (b1, l2, d1, ...). */
    get: function (id) { return TABLE[id] || null; },
    /** All ids currently flagged as diverging from Plan's live numbers. */
    flagged: function () {
      return Object.keys(TABLE).filter(function (id) { return !!TABLE[id].flag; });
    },
  };

  root.KindFareNutritionData = api;
})(typeof window !== 'undefined' ? window : this);
