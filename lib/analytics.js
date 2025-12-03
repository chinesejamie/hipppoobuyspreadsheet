// Google Analytics tracking utilities

/**
 * Track when user clicks "Buy Now" on a product
 * @param {Object} product - Product details
 * @param {string} location - Where the click happened (card, product_page)
 */
export function trackBuyNowClick(product, location = 'unknown') {
  // Check if gtag is available (Google Analytics loaded)
  if (typeof window !== 'undefined' && window.gtag) {
    // Send event to Google Analytics
    window.gtag('event', 'buy_now_click', {
      event_category: 'ecommerce',
      event_label: product.name,
      value: product.price || 0,
      product_id: product.id || product._id,
      product_name: product.name,
      product_category: product.category,
      product_store: product.store,
      click_location: location,
      currency: 'CNY'
    });

    // Also send as a conversion event for better tracking
    window.gtag('event', 'conversion', {
      send_to: 'G-J8NYMZMMEV',
      event_category: 'product_interaction',
      event_label: `${product.name} - ${product.store}`,
      value: product.price || 0,
      currency: 'CNY'
    });

    // Debug log if in debug mode
    if (window.DEBUG_MODE) {
      console.log('[GA] Tracked buy_now_click:', {
        product: product.name,
        id: product.id || product._id,
        price: product.price,
        location
      });
    }
  } else if (typeof window !== 'undefined') {
    console.warn('[GA] Google Analytics not loaded - event not tracked');
  }
}

/**
 * Track when user views a product detail page
 * @param {Object} product - Product details
 */
export function trackProductView(product) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      event_category: 'ecommerce',
      event_label: product.name,
      items: [{
        item_id: product.id || product._id,
        item_name: product.name,
        item_category: product.category,
        item_brand: product.store,
        price: product.price || 0,
        currency: 'CNY'
      }]
    });

    if (window.DEBUG_MODE) {
      console.log('[GA] Tracked product view:', product.name);
    }
  }
}
