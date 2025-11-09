# Medusa Backend Configuration Guide

This document outlines the required plugins and configuration for the Casual Chic Medusa backend.

## Required Plugins

### 1. Stripe Tax Provider

**Package**: `medusa-taxes-stripe`

**Installation:**
```bash
npm install medusa-taxes-stripe
```

**Configuration in `medusa-config.js`:**
```javascript
const plugins = [
  // ... other plugins
  {
    resolve: `medusa-taxes-stripe`,
    options: {
      api_key: process.env.STRIPE_API_KEY,
    }
  }
];
```

**Environment Variables:**
```env
STRIPE_API_KEY=sk_test_...
```

**Medusa Admin Setup:**
1. Settings → Regions → Select region
2. Tax Settings section
3. Enable "Automatic tax calculation"
4. Select "Stripe Tax" as tax provider
5. Save

---

### 2. Resend Email Plugin

**Package**: `medusa-plugin-resend`

**Installation:**
```bash
npm install medusa-plugin-resend
```

**Configuration in `medusa-config.js`:**
```javascript
const plugins = [
  // ... other plugins
  {
    resolve: `medusa-plugin-resend`,
    options: {
      api_key: process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM_EMAIL || "Casual Chic <orders@casualchicboutique.com>",
      enable_endpoint: true,
      template_path: "data/email-templates",
      subject_template_type: "handlebars",
      body_template_type: "handlebars",

      // Email template mappings
      order_placed_template: "order-confirmation",
      order_shipped_template: "order-shipped",
      order_canceled_template: "order-canceled",
      customer_password_reset_template: "password-reset",
      gift_card_created_template: "gift-card",
      order_return_requested_template: "return-requested"
    }
  }
];
```

**Environment Variables:**
```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Casual Chic <orders@casualchicboutique.com>
```

**Resend Setup:**
1. Create account at https://resend.com
2. Add and verify your sending domain (casualchicboutique.com)
3. Get API key from Resend dashboard
4. Add to Medusa environment variables

---

## Email Template Setup

Create email templates in `data/email-templates/` directory:

### Directory Structure:
```
data/email-templates/
├── order-confirmation/
│   ├── subject.hbs
│   ├── html.hbs
│   └── text.hbs
├── order-shipped/
│   ├── subject.hbs
│   ├── html.hbs
│   └── text.hbs
├── order-canceled/
│   ├── subject.hbs
│   ├── html.hbs
│   └── text.hbs
├── password-reset/
│   ├── subject.hbs
│   ├── html.hbs
│   └── text.hbs
└── gift-card/
    ├── subject.hbs
    ├── html.hbs
    └── text.hbs
```

### Template Examples:

#### `order-confirmation/subject.hbs`
```handlebars
Order Confirmation #{{order.display_id}} - Thank You!
```

#### `order-confirmation/html.hbs`
```handlebars
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #A3BD84; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: white; }
    .order-items { margin: 20px 0; }
    .item { border-bottom: 1px solid #eee; padding: 10px 0; }
    .total { font-size: 18px; font-weight: bold; margin-top: 20px; }
    .footer { text-align: center; color: #666; padding: 20px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Confirmation</h1>
    </div>

    <div class="content">
      <p>Hi {{order.shipping_address.first_name}},</p>

      <p>Thank you for your order! We've received your order and are preparing it for shipment.</p>

      <h2>Order #{{order.display_id}}</h2>

      <div class="order-items">
        <h3>Items:</h3>
        {{#each order.items}}
        <div class="item">
          <strong>{{this.title}}</strong> {{#if this.variant.title}}({{this.variant.title}}){{/if}}
          <br>
          Quantity: {{this.quantity}} × ${{this.unit_price}}
        </div>
        {{/each}}
      </div>

      <div class="total">
        <p>Subtotal: ${{order.subtotal}}</p>
        <p>Shipping: ${{order.shipping_total}}</p>
        <p>Tax: ${{order.tax_total}}</p>
        <p><strong>Total: ${{order.total}}</strong></p>
      </div>

      <h3>Shipping Address:</h3>
      <p>
        {{order.shipping_address.first_name}} {{order.shipping_address.last_name}}<br>
        {{order.shipping_address.address_1}}<br>
        {{#if order.shipping_address.address_2}}{{order.shipping_address.address_2}}<br>{{/if}}
        {{order.shipping_address.city}}, {{order.shipping_address.province}} {{order.shipping_address.postal_code}}<br>
        {{order.shipping_address.country_code}}
      </p>

      <p>We'll send you another email when your order ships with tracking information.</p>

      <p>Questions? Contact us at support@casualchicboutique.com</p>
    </div>

    <div class="footer">
      <p>Casual Chic Boutique<br>
      © 2025 All rights reserved</p>
    </div>
  </div>
</body>
</html>
```

#### `order-confirmation/text.hbs`
```handlebars
Order Confirmation #{{order.display_id}}

Hi {{order.shipping_address.first_name}},

Thank you for your order! We've received your order and are preparing it for shipment.

Order Details:
{{#each order.items}}
- {{this.title}} {{#if this.variant.title}}({{this.variant.title}}){{/if}}
  Quantity: {{this.quantity}} × ${{this.unit_price}}
{{/each}}

Subtotal: ${{order.subtotal}}
Shipping: ${{order.shipping_total}}
Tax: ${{order.tax_total}}
Total: ${{order.total}}

Shipping Address:
{{order.shipping_address.first_name}} {{order.shipping_address.last_name}}
{{order.shipping_address.address_1}}
{{#if order.shipping_address.address_2}}{{order.shipping_address.address_2}}{{/if}}
{{order.shipping_address.city}}, {{order.shipping_address.province}} {{order.shipping_address.postal_code}}
{{order.shipping_address.country_code}}

We'll send you another email when your order ships.

Questions? Contact us at support@casualchicboutique.com

Casual Chic Boutique
```

---

## Deployment Steps

1. **Add plugins to `medusa-config.js`**
2. **Install npm packages**
3. **Set environment variables in Medusa Cloud**
4. **Create email template directories and files**
5. **Restart Medusa server**
6. **Test in Medusa Admin**

---

## Testing Checklist

- [ ] Stripe payment provider shows in region settings
- [ ] Tax calculation works (create test cart and add address)
- [ ] Email sends on order placement (check Resend dashboard)
- [ ] All shipping options appear in storefront
- [ ] Webhook receives Stripe events

---

## Environment Variables Summary

```env
# Stripe
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Casual Chic <orders@casualchicboutique.com>

# Medusa
MEDUSA_ADMIN_ONBOARDING_TYPE=default
STORE_CORS=http://localhost:5173,https://casualchicboutique.com
```

---

## Notes for Medusa Cloud

If you're on Medusa Cloud managed hosting:

1. Some plugins may need to be requested from Medusa support
2. Environment variables are set in Medusa Cloud dashboard
3. Email templates may need to be uploaded via support ticket
4. Check with Medusa Cloud docs for plugin installation process

Contact Medusa support if you need help installing these plugins on a managed instance.
