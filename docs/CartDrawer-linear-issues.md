# CartDrawer Follow-Up Linear Issues

## Issue 1: Integrate CartDrawer with Medusa.js Backend

**Title:** Connect CartDrawer to Medusa.js Cart API

**Description:**
Replace localStorage cart service with Medusa.js cart API integration for production-ready cart management.

**Requirements:**
- Implement `MedusaCartService` extending `CartService` interface
- Set up Medusa client SDK
- Implement cart session management
- Add Durable Objects for real-time cart sync
- Handle cart merging (guest → authenticated user)
- Implement optimistic updates with server reconciliation
- Add proper error handling and retry logic
- Test with actual Medusa backend
- Tests: Unit tests for MedusaCartService, integration tests with Medusa backend, cart session management tests, optimistic update scenarios

**Dependencies:**
- Medusa backend must be deployed and accessible
- Cart API endpoints documented

**Estimate:** Large (L)

**Labels:** backend, integration, cart

---

## Issue 2: Implement Advanced Discount Types

**Title:** Add Free Gift and Tiered Discount Promotions

**Description:**
Expand discount system to support free gift with purchase and buy-more-save-more tiered discounts.

**Requirements:**
- Free gift with purchase:
  - Set minimum purchase threshold
  - Automatically add gift item to cart
  - Display gift as $0.00 with special badge
  - Gift item tied to discount code
- Tiered buy-more-save-more:
  - Define quantity thresholds
  - Automatically apply highest qualifying tier
  - Display progress to next tier
- UI updates:
  - Progress indicators for both types
  - Clear messaging about qualification
  - Non-removable gift items
- Backend integration with Medusa promotion engine
- Tests: Unit tests for discount calculation logic, UI tests for progress indicators, integration tests with Medusa promotions, edge case tests for threshold boundaries

**Dependencies:**
- Medusa.js backend integration (Issue 1)
- Promotion rules configured in Medusa admin

**Estimate:** Large (L)

**Labels:** frontend, feature, promotions

---

## Issue 3: Implement Product Recommendation Engine

**Title:** Replace Mock Recommendations with Real Recommendation System

**Description:**
Integrate actual product recommendation engine or service to power cross-sell suggestions.

**Requirements:**
- Recommendation System:
  - Return minimum 4-8 product recommendations per cart
  - Response time <200ms for recommendation fetch
  - Fallback to featured products if service unavailable
  - Cache recommendations for 5 minutes
  - Support A/B testing of different algorithms
- Implementation:
  - Research and select recommendation approach (spike: 3 days)
  - Integrate chosen service/API
  - Implement caching layer with Redis
  - Add fallback logic for service failures
  - Track recommendation impressions and clicks
- Analytics:
  - Track click-through rate (target: >5%)
  - Measure conversion rate from recommendations
  - Log recommendation latency
  - A/B test different algorithms with statistical significance
- Tests:
  - Unit tests for recommendation fetching and caching
  - Integration tests with mock recommendation service
  - Performance tests: verify <200ms response time
  - Fallback behavior tests: verify featured products shown on failure
  - Analytics tracking tests: verify impression/click events fired

**Dependencies:**
- Medusa.js backend integration (Issue 1)
- Analytics implementation

**Estimate:** Large (L)

**Labels:** backend, frontend, feature, recommendations

---

## Issue 4: Add Saved for Later Feature

**Title:** Implement "Save for Later" from Cart

**Description:**
Allow users to move items from cart to wishlist ("Save for Later") for future purchase.

**Requirements:**
- "Save for Later" button on CartItem
- Move item from cart to wishlist
- Animation for item removal
- Display saved items section in drawer (collapsible)
- "Move to Cart" button on saved items
- Sync with backend wishlist
- Tests: Unit tests for move operations, UI animation tests, integration tests with wishlist backend, state synchronization tests

**Dependencies:**
- Wishlist backend integration
- Medusa.js backend integration (Issue 1)

**Estimate:** Medium (M)

**Labels:** frontend, feature, cart, wishlist

---

## Issue 5: Add Real-Time Stock Validation

**Title:** Implement Real-Time Stock Checks in CartDrawer

**Description:**
Validate product stock levels in real-time and show warnings for low/out-of-stock items.

**Requirements:**
- Check stock on drawer open
- Show "Only X left" warnings for low stock
- Disable checkout if any items out of stock
- "Out of Stock" badge on affected items
- Suggest removing or saving for later
- Real-time updates via WebSocket or polling
- Tests: Unit tests for stock validation logic, integration tests with inventory system, WebSocket connection tests, UI tests for stock warnings and badges

**Dependencies:**
- Medusa.js backend integration (Issue 1)
- Inventory management system

**Estimate:** Medium (M)

**Labels:** backend, frontend, feature, inventory

---

## Issue 6: Add Gift Options

**Title:** Add Gift Wrapping and Message Options to CartDrawer

**Description:**
Allow customers to add gift wrapping and personalized messages to orders.

**Requirements:**
- "This is a gift" checkbox in cart summary
- Gift wrapping options (with additional cost)
- Gift message textarea (character limit)
- Display gift options in cart summary
- Include in checkout data
- Backend support for gift options
- Tests: Unit tests for gift option state management, UI tests for form validation, integration tests with checkout flow, character limit validation tests

**Dependencies:**
- Medusa.js backend integration (Issue 1)
- Gift wrapping SKUs in product catalog

**Estimate:** Small (S)

**Labels:** frontend, feature, gift-options

---

## Notes

These issues should be created in Linear after CartDrawer implementation is complete and merged. They represent planned enhancements that require backend integration or additional features beyond the MVP.

Priority order recommendation:
1. Issue 1 (Medusa integration) - MUST DO FIRST, enables all others
2. Issue 5 (Stock validation) - Important for UX and preventing overselling
3. Issue 2 (Advanced discounts) - High business value
4. Issue 3 (Recommendations) - Improves conversion
5. Issue 4 (Saved for later) - Nice to have
6. Issue 6 (Gift options) - Seasonal/nice to have
