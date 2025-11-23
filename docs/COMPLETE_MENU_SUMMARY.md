# 🍽️ Complete Menu Database - Pérola do Vouga

## ✅ Menu Complete with Drinks!

### 📊 Final Menu Summary

**Total Categories**: 13
**Total Items**: ~200+ items

### Categories:

1. **Sopas** (13 items) - €1.90
2. **Peixe** (14 items) - €8.50 - €15.00
3. **Carne** (29 items) - €2.80 - €14.00
4. **Arroz** (1 item) - €9.50
5. **Omeletes** (5 items) - €6.50 - €9.00
6. **Saladas** (6 items) - €1.50 - €3.00
7. **Salgados** (3 items) - €0.90 - €1.60
8. **Sobremesas** (22 items) - €1.20 - €3.00
9. **Cafetaria** ✨ NEW (10 items) - €0.75 - €1.80
10. **Sanduíches** ✨ NEW (4 items) - €1.90 - €2.80
11. **Bebidas** ✨ NEW (8 items) - €1.00 - €1.80
12. **Cervejas** ✨ NEW (7 items) - €1.30 - €3.00
13. **Vinhos** ✨ NEW (13 items) - €1.00 - €2.30

## 🚀 How to Add to Database

### Step 1: Run Main Menu
```bash
# In Supabase SQL Editor, run:
populate_menu.sql
```

### Step 2: Add Drinks
```bash
# Then run:
add_drinks_to_menu.sql
```

### Step 3: Add Price Visibility Setting
```bash
# Finally run:
add_price_visibility_setting.sql
```

## 🎨 Next: Beautiful Menu UI

The menu UI will feature:
- ✅ **Icons for each category** (Coffee cup, wine glass, fish, meat, etc.)
- ✅ **Visual organization** with cards and sections
- ✅ **Appealing design** with hover effects
- ✅ **Category filtering** for easy navigation
- ✅ **Search functionality**
- ✅ **Responsive grid layout**

### Planned Icons by Category:
- ☕ Cafetaria - Coffee cup
- 🥪 Sanduíches - Sandwich
- 🍲 Sopas - Bowl/Soup
- 🐟 Peixe - Fish
- 🥩 Carne - Meat/Steak
- 🍚 Arroz - Rice bowl
- 🥚 Omeletes - Egg
- 🥗 Saladas - Salad
- 🥐 Salgados - Pastry
- 🍰 Sobremesas - Cake/Dessert
- 🥤 Bebidas - Drink glass
- 🍺 Cervejas - Beer mug
- 🍷 Vinhos - Wine glass

## 📱 Menu Display Features

### With Prices Hidden (Current):
- Beautiful category cards with icons
- Item names and descriptions
- "Add to Cart" buttons
- No prices shown
- Total shown only at checkout

### With Prices Shown (Future):
- Same beautiful design
- Prices displayed per item
- Running cart total
- Full transparency

## 🎯 Database Structure

```
categories (13)
    ↓
menu_items (~200)
    ↓
Each item has:
- name
- description
- price (stored but can be hidden)
- category_id
- is_available
- display_order
- daily_type (for specials)
```

## 💡 Admin Features

Via `/admin/menu`:
- Add/Edit/Delete items
- Change prices
- Mark unavailable
- Set daily specials
- Reorder items

Via `/admin/settings`:
- Toggle price visibility
- Update hours
- Change contact info

## ✨ What's Next

1. **Run the SQL scripts** to populate database
2. **Create beautiful menu UI** with icons and cards
3. **Test ordering flow** with hidden prices
4. **Review and adjust** as needed

---

**Status**: Ready to populate database!
**Files to run**: 
1. `populate_menu.sql`
2. `add_drinks_to_menu.sql`
3. `add_price_visibility_setting.sql`
