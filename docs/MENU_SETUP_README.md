# 📋 Menu Database Setup - Pérola do Vouga

## ✅ Menu Saved!

Your complete menu has been saved and is ready to be added to the database.

## 📊 Menu Summary

- **Total Categories**: 8
- **Total Items**: ~120 items
- **Categories**:
  - Sopas (13 items) - €1.90
  - Peixe (14 items) - €8.50 - €15.00
  - Carne (29 items) - €2.80 - €14.00
  - Arroz (1 item) - €9.50
  - Omeletes (5 items) - €6.50 - €9.00
  - Saladas (6 items) - €1.50 - €3.00
  - Salgados (3 items) - €0.90 - €1.60
  - Sobremesas (22 items) - €1.20 - €3.00

## 🚀 How to Add Menu to Database

### Step 1: Run the SQL Scripts in Supabase

1. Go to your **Supabase Dashboard**
2. Click on **SQL Editor**
3. Run these scripts **in order**:

#### A. First, run `populate_menu.sql`
This will create all categories and menu items.

#### B. Then, run `add_price_visibility_setting.sql`
This adds a setting to control whether prices show on the website.

### Step 2: Configure Price Visibility

**Option 1: Hide Prices (Current Plan)**
- Prices are hidden on the public website
- Prices are still stored in database
- Prices are used for order calculations
- Can be enabled later via Admin Settings

**Option 2: Show Prices (When Ready)**
- Go to `/admin/settings`
- Find "Show Prices on Website" setting
- Change from `false` to `true`
- Prices will appear on menu

## 💡 About Price Management

### Why Keep Prices in Database Even if Hidden?

1. **Order Processing**: System needs prices to calculate order totals
2. **Easy Toggle**: Can show/hide prices anytime via admin panel
3. **Future Ready**: When you're ready in 2026, just flip the switch
4. **Admin View**: Prices always visible in admin panel for management

### How Prices Work:

```
Database (Always has prices)
    ↓
Admin Panel (Always shows prices)
    ↓
Website Display (Controlled by setting)
    ↓
If show_prices_on_website = 'false' → Prices hidden
If show_prices_on_website = 'true' → Prices shown
```

## 🎨 Frontend Display Options

### Current Implementation (Prices Hidden):
```tsx
// MenuItem component will check the setting
{!hidePrices && <span className="price">{formatPrice(item.price)}</span>}
```

### When Prices Are Hidden:
- Menu items show name and description only
- "Add to Cart" button still works
- Order confirmation shows total (backend calculated)
- Customers see final price only at checkout

### When Prices Are Shown:
- Each item displays its price
- Customers can see prices while browsing
- Cart shows running total
- Everything is transparent

## 📝 Menu Items Included

### Sopas (All €1.90)
- Canja de Galinha, Puré de Feijão, Creme de Abóbora, etc.
- 13 varieties total

### Peixe (€8.50 - €15.00)
- Salmão Grelhado, Dourada, Bacalhau varieties, etc.
- 14 dishes

### Carne (€2.80 - €14.00)
- Bifinhos, Bitoque, Iscas, Secretos, etc.
- 29 dishes including house specialties

### Sobremesas (€1.20 - €3.00)
- Arroz-Doce, Pastel de Nata, Cheesecake, etc.
- 22 desserts

## 🔧 Admin Panel Features

Via `/admin/menu` you can:
- ✅ Add new items
- ✅ Edit existing items
- ✅ Change prices anytime
- ✅ Mark items as unavailable
- ✅ Set daily specials (soup/dish of the day)
- ✅ Reorder items

Via `/admin/settings` you can:
- ✅ Toggle price visibility
- ✅ Update business hours
- ✅ Change contact information

## 🎯 Recommended Workflow

### Phase 1: Now (Prices Hidden)
1. Run the SQL scripts
2. Keep `show_prices_on_website = false`
3. Test the ordering system
4. Customers order without seeing individual prices
5. They see total at checkout

### Phase 2: 2026 (When Ready)
1. Go to Admin Settings
2. Review/update all prices
3. Set `show_prices_on_website = true`
4. Prices now visible to everyone

## 📱 Customer Experience

### With Prices Hidden:
```
Customer Journey:
1. Browse menu (no prices shown)
2. Add items to cart
3. Go to checkout
4. See total price
5. Complete order
```

### With Prices Shown:
```
Customer Journey:
1. Browse menu (prices visible)
2. See running cart total
3. Go to checkout
4. Confirm order
5. Complete order
```

## ⚠️ Important Notes

1. **Prices are Required**: Even if hidden, prices must be in database for order processing
2. **Easy to Change**: Toggle visibility anytime via admin panel
3. **No Code Changes**: Everything controlled by database settings
4. **Flexible**: Can show prices for some categories, hide for others (future feature)

## 🎉 You're All Set!

Just run the SQL scripts in Supabase and your menu will be live!

Questions? Check the admin panel at `/admin/menu` to manage your items.
