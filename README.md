# Walmart-Style E-commerce App

A modern e-commerce mobile application built with React Native and Expo, featuring a Walmart-inspired design and functionality.

## Features

### 🛍️ Core E-commerce Features
- **Product Browsing**: Browse products by category with a clean, grid-based layout
- **Search Functionality**: Search products, brands, and categories with real-time results
- **Shopping Cart**: Add/remove items, adjust quantities, and view cart total
- **User Authentication**: Sign in/out with user profile management
- **Product Details**: View product information, pricing, and availability

### 🎨 Design Features
- **Walmart-Inspired UI**: Blue color scheme and modern design patterns
- **Responsive Layout**: Optimized for mobile devices
- **Category Filtering**: Horizontal scrollable category selection
- **Product Cards**: Clean cards with pricing, ratings, and availability
- **Bottom Navigation**: Easy navigation between main sections

### 📱 Screens
1. **Home Screen**: Product grid with category filtering
2. **Search Screen**: Product search with results
3. **Cart Screen**: Shopping cart with item management
4. **Profile Screen**: User authentication and preferences

## Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **Zustand**: State management
- **React Navigation**: Navigation between screens
- **Expo Vector Icons**: Icon library
- **Expo Image**: Optimized image component

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- pnpm package manager
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Start the development server**:
   ```bash
   pnpm start
   ```

3. **Run on iOS**:
   ```bash
   pnpm ios
   ```

4. **Run on Android**:
   ```bash
   pnpm android
   ```

5. **Run on Web**:
   ```bash
   pnpm web
   ```

## Project Structure

```
app/
├── components/          # Reusable UI components
│   ├── Header.tsx      # App header with search and cart
│   ├── ProductCard.tsx # Product display card
│   ├── CategoryFilter.tsx # Category selection
│   └── CartItem.tsx    # Cart item component
├── store/              # State management
│   ├── cartStore.ts    # Shopping cart state
│   └── userStore.ts    # User authentication state
├── data/               # Mock data
│   └── products.ts     # Product data and utilities
├── theme.ts            # Design system and colors
├── _layout.tsx         # Navigation layout
├── index.tsx           # Home screen
├── search.tsx          # Search screen
├── cart.tsx            # Cart screen
└── profile.tsx         # Profile screen
```

## Features in Detail

### Product Management
- **Mock Data**: 8 sample products with realistic pricing
- **Categories**: 20+ product categories
- **Search**: Real-time product search
- **Filtering**: Filter by category

### Shopping Cart
- **Add Items**: Add products to cart
- **Quantity Control**: Increase/decrease item quantities
- **Remove Items**: Remove items from cart
- **Total Calculation**: Automatic price and savings calculation
- **Clear Cart**: Clear all items at once

### User Experience
- **Authentication**: Mock login system
- **User Preferences**: Toggle notifications and email updates
- **Profile Management**: User profile with settings
- **Responsive Design**: Works on different screen sizes

### Design System
- **Walmart Blue**: Primary color (#0071DC)
- **Typography**: Consistent text styles
- **Spacing**: Standardized spacing system
- **Components**: Reusable UI components

## Mock Data

The app includes realistic mock data:
- **Products**: Electronics, groceries, household items
- **Pricing**: Realistic prices with sale discounts
- **Ratings**: Product ratings and review counts
- **Availability**: Pickup and delivery options

## State Management

### Cart Store (Zustand)
- Add/remove items
- Update quantities
- Calculate totals
- Clear cart

### User Store (Zustand)
- Authentication state
- User profile data
- Preferences management
- Login/logout functionality

## Navigation

The app uses Expo Router with bottom tab navigation:
- **Home**: Product browsing
- **Search**: Product search
- **Cart**: Shopping cart
- **Profile**: User account

## Styling

- **Theme System**: Centralized design tokens
- **Color Palette**: Walmart-inspired colors
- **Typography**: Consistent text styles
- **Spacing**: Standardized spacing
- **Components**: Reusable styled components

## Future Enhancements

- [ ] Product detail screens
- [ ] Checkout process
- [ ] Order tracking
- [ ] Payment integration
- [ ] Push notifications
- [ ] Offline support
- [ ] Real API integration
- [ ] Image optimization
- [ ] Performance improvements

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes and demonstrates e-commerce app development with React Native and Expo.

---

**Note**: This is a demo application with mock data. For production use, integrate with real APIs and implement proper security measures.
