# lavalab_dev_challenge

# Tally - LavaLab Dev Challenge Fall 2025

LavaLab - Tally - internal ops console for a small shop to manage **materials**, **products**, an **order queue**, and **fulfillment**

Track blanks/parts, assemble products from a Bill of Materials, take orders, reserve stock, and mark them through **Queued → Reserved → In Progress → Shipped → Fulfilled/Cancelled**. Email/AI alerts are stubs you can turn on later.

What it does: analyzes the video (objects, captions, scene/action), crafts a concise music prompt, generates background music, and (optionally) muxes the track into the original clip—fully integrated with Firebase Auth, Firestore, and Storage.

## Video
Demo Coming Soon

## Features
- Overview of key metrics
!DO THIS

### Products
- DO THIS

### Parts Management
- DO THIS

### Orders

- Track purchase orders
- Monitor delivery status
- View customer's order history


## Tech Stack

**Frontend**
- React + Vite (JavaScript)
- Tailwind CSS
- React Router
- (Optional) Zustand for UI state; domain data lives in Firestore

**Database**
- **Firebase Firestore** (client-only)
- Firebase Storage (optional images)
- Firebase Auth (optional)

**Stretch / Later**
- Cloud Functions (emails, low‑stock digest, scheduled jobs)
- Resend/SendGrid for transactional email
- Simple demand forecasting (EWMA) for restock suggestions

### AI Integration
Write Here

## Pages (mapped from the Figma)

- **Materials (Inventory):** searchable list of variants with **+/–** to adjust `onHand`, low‑stock badges, “Add New” modal.
- **Products:** list SKUs defined as **BOM** arrays (`[{materialId, qty}]`); show **Can Build: N** (min over available/qty).
- **Order Queue:** create order → **Reserve** materials (hold) → **Start** → **Ship** (tracking + ETA) → **Fulfill** (consume) or **Cancel** (release).
- **Fulfillment:** focused view for a single order with shortage highlights and shipping panel.
- **Integrations (stub):** toggles + placeholders for email provider keys and ecommerce connectors.


## Firebase Database Schema

```plaintext
firestore/
│
├── materials/       
│   └── {material_id}
│       ├── material_id 
│       ├── name (string)
│       ├── color (string)
│       ├── size (int) 
│       ├── price (int)
│       ├── quantity (int)  
│       ├── supplier_id (int) 
│       ├── image (reference to storage in firebase database)  
│       └── used_in (array)
│          └── [ {product_id}, etc... ]
│
├── products/                 
│   └── {product_id}
│       ├── product_id (string)
│       ├── name (string)
│       ├── color (string)
│       ├── size (int)
│       ├── price (int)
│       ├── quantity (int)
│       ├── image (reference to storage in firebase database)     
│       └── made_from (array):
│           └── [ {material_id}, etc... ]
│
├── customers/
│   └── {sale_id}
│       ├── created_at: (string)
│       ├── name: (string)
│       ├── email: (string)
│       ├── phone: (int)
│       ├── address: (string)
│       └── order_history (array)
│           └── [ {customer_orders}, etc... ]
│
├── customer_orders/             
│   └── {order_id}
│       ├── order_id: (string)
│       ├── order_date: (string)
│       ├── status: (string)
│       ├── customer: (customer_id)
│       ├── expected_delivery_date: string
│       ├── actual_delivered_at: string
│       ├── quantity (int)
│       ├── price (int)
│       └── items: (array)
│           └── [ {products_id}, etc... ]
│
└── suppliers/
    └── {supplierId}
        ├── name: (string)
        ├─ email: (string)
        ├─ phone: (string)
        ├─ quantity: (int)
        └─ updatedAt: (timestamp)
```

## Project Structure

```plaintext
lavalab_dev_challenge/
│
├── frontEnd/       
│   ├── index.html
│   ├── tailwin.config.js
│   ├── public
│   └── src
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx 
│       └── pages
│          ├── Integrations.jsx
│          ├── Fulfillment.jsx
│          ├── Products.jsx
│          └── Materials.jsx
│
└── backEnd/                 
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

Created by Bryan Ramirez-Gonzalez for LavaLab in half a day.