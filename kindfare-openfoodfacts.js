/**
 * kindfare-openfoodfacts.js
 *
 * Thin client for the public Open Food Facts API (world.openfoodfacts.org).
 * Free, no API key, no rate limit enforced for light/read-only use. Covers
 * two things Shop needs: looking a product up by barcode, and searching by
 * name/brand for products that aren't in KindFare's curated ~50-item list.
 *
 * DATA TRUST MODEL — read before wiring this into anything user-facing:
 * Open Food Facts is crowdsourced. Every result this module returns is
 * tagged `source: 'openfoodfacts'` and `reviewStatus: 'pending_review'`.
 * Nothing from here should be shown to a real user as authoritative nutrition
 * advice (especially allergen/ingredient claims, given KindFare's
 * health-condition focus) until it has passed through the review step in
 * kindfare-review-queue.js and been flipped to 'verified'.
 *
 * BUILD-SANDBOX NOTE: this module is written against Open Food Facts' stable,
 * documented v2 REST API (https://openfoodfacts.github.io/openfoodfacts-server/api/).
 * It could not be live-tested from the Claude build sandbox because that
 * sandbox's network allowlist blocks world.openfoodfacts.org directly — that
 * restriction is specific to the build environment, not the deployed app.
 * Once this file is loaded in an actual browser (the sandbox's fetch()
 * restrictions do not apply there), the calls below will work as documented.
 * Worth a real device smoke-test before relying on it in front of anyone.
 *
 * KNOWN LIMITATION: Open Food Facts' production guidance asks API clients to
 * send a descriptive User-Agent (e.g. "KindFare/1.0 (contact@kindfare.co.uk)").
 * Browsers block scripts from setting the User-Agent header on fetch/XHR
 * requests (it's a "forbidden header"), so this client cannot comply with
 * that guidance from client-side JS. For light prototype traffic this is
 * generally fine against the public API; if KindFare's real request volume
 * grows, the honest fix is routing these calls through a small server-side
 * proxy that can set a proper User-Agent and add caching/rate-limit
 * headroom — not something a static HTML prototype can do on its own.
 */
(function (root) {
  var BASE = 'https://world.openfoodfacts.org';
  var FIELDS = [
    'code', 'product_name', 'brands', 'quantity',
    'image_front_small_url', 'nutriments', 'serving_size', 'countries_tags',
  ].join(',');

  function toNum(v) {
    var n = parseFloat(v);
    return isNaN(n) ? null : Math.round(n * 10) / 10;
  }

  /** Normalize a raw OFF `product` object into KindFare's item shape. */
  function normalize(p) {
    if (!p) return null;
    var n = p.nutriments || {};
    return {
      id: 'off_' + (p.code || Math.random().toString(36).slice(2)),
      barcode: p.code || null,
      name: p.product_name || '(unnamed product)',
      brand: p.brands || null,
      quantity: p.quantity || null,
      imageUrl: p.image_front_small_url || null,
      // per 100g/100ml, as OFF stores it
      per100g: {
        kcal: toNum(n['energy-kcal_100g']),
        protein: toNum(n['proteins_100g']),
        carbs: toNum(n['carbohydrates_100g']),
        fat: toNum(n['fat_100g']),
        sugars: toNum(n['sugars_100g']),
        fiber: toNum(n['fiber_100g']),
        salt: toNum(n['salt_100g']),
      },
      servingSize: p.serving_size || null,
      source: 'openfoodfacts',
      reviewStatus: 'pending_review',
      sourceUrl: p.code ? ('https://world.openfoodfacts.org/product/' + p.code) : null,
    };
  }

  /**
   * Look up a single product by barcode (EAN-13 / UPC).
   * Returns a Promise<normalizedItem|null>.
   */
  function lookupBarcode(barcode) {
    if (!barcode || !/^\d{6,14}$/.test(String(barcode).trim())) {
      return Promise.reject(new Error('lookupBarcode: barcode must be a 6-14 digit string'));
    }
    var url = BASE + '/api/v2/product/' + encodeURIComponent(barcode) + '.json?fields=' + FIELDS;
    return fetch(url, { headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('lookupBarcode: HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!data || data.status !== 1 || !data.product) return null;
        return normalize(data.product);
      });
  }

  /**
   * Search branded products by free-text name/brand. Optionally scoped to UK.
   * Returns a Promise<normalizedItem[]>.
   */
  function searchProducts(query, opts) {
    opts = opts || {};
    var pageSize = opts.pageSize || 10;
    if (!query || !query.trim()) return Promise.resolve([]);
    var params = [
      'search_terms=' + encodeURIComponent(query.trim()),
      'search_simple=1',
      'action=process',
      'json=1',
      'page_size=' + pageSize,
      'fields=' + FIELDS,
    ];
    if (opts.ukOnly !== false) params.push('countries_tags_en=United+Kingdom');
    var url = BASE + '/cgi/search.pl?' + params.join('&');
    return fetch(url, { headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('searchProducts: HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        var products = (data && data.products) || [];
        return products.map(normalize).filter(function (item) {
          // drop results with no usable nutrition data — not worth surfacing
          return item && item.per100g && item.per100g.kcal !== null;
        });
      });
  }

  root.KindFareOpenFoodFacts = { lookupBarcode: lookupProducts_safe(lookupBarcode), searchProducts: searchProducts, normalize: normalize };

  // small guard so a malformed barcode never throws synchronously into caller code
  function lookupProducts_safe(fn) {
    return function (barcode) {
      try { return fn(barcode); } catch (e) { return Promise.reject(e); }
    };
  }
})(typeof window !== 'undefined' ? window : this);
