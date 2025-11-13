# Dark Mode Implementation

This project includes a dark mode feature that automatically respects user preferences and persists the choice in localStorage.

## Features

- ✅ Automatic detection of system dark mode preference
- ✅ User preference persistence using localStorage
- ✅ No external dependencies
- ✅ Smooth transitions between modes
- ✅ CSS variables for easy theme customization

## How It Works

### 1. **CSS Variables** (`app/assets/css/main.css`)
The theme uses CSS custom properties for colors. Light mode uses the `:root` selector, and dark mode uses `html.dark`:

```css
:root {
  --primary: #2563eb;
  --bg: #ffffff;
  --text: #111827;
  /* ... more variables ... */
}

html.dark {
  --primary: #60a5fa;
  --bg: #111827;
  --text: #f3f4f6;
  /* ... dark versions ... */
}
```

### 2. **App Initialization** (`app/app.vue`)
The main app component:
- Checks for saved preference in localStorage
- Falls back to system preference (`prefers-color-scheme`)
- Applies the `dark` class to `<html>` element
- Provides dark mode state via Vue's `inject` API

### 3. **Composable** (`app/composables/useDarkMode.ts`)
Exposes a simple API for components:

```typescript
const { isDark, toggle } = useDarkMode();
```

### 4. **Toggle Component** (`app/components/DarkModeToggle.vue`)
A button component to switch between light/dark modes with sun/moon icons.

## Usage

### Add Toggle to Your Layout

```vue
<template>
  <nav>
    <h1>My App</h1>
    <DarkModeToggle />
  </nav>
</template>
```

### Use in Components

```vue
<script setup>
const { isDark, toggle } = useDarkMode();
</script>

<template>
  <div>
    <p>Dark mode is: {{ isDark ? 'ON' : 'OFF' }}</p>
    <button @click="toggle">Toggle</button>
  </div>
</template>
```

### Add Dark Mode Styles

Use CSS variable fallbacks or the `html.dark` selector:

```css
.my-element {
  color: var(--text);
  background: var(--bg);
}

html.dark .my-element {
  /* Override specific styles if needed */
}
```

## localStorage

The dark mode preference is saved with key `dark-mode` as a string boolean:
- `"true"` - dark mode enabled
- `"false"` - dark mode disabled

To manually clear: `localStorage.removeItem('dark-mode')`

## System Preference Detection

On first visit, the app checks:
```javascript
window.matchMedia('(prefers-color-scheme: dark)').matches
```

This respects the user's OS-level theme preference (Windows: Settings → Personalization → Colors).

## CSS Variables Reference

| Variable | Light | Dark |
|----------|-------|------|
| `--primary` | #2563eb | #60a5fa |
| `--danger` | #ef4444 | #f87171 |
| `--bg` | #ffffff | #111827 |
| `--bg-secondary` | #f9fafb | #1f2937 |
| `--text` | #111827 | #f3f4f6 |
| `--text-secondary` | #6b7280 | #d1d5db |
| `--border` | #e5e7eb | #374151 |

## Customization

To change colors, edit the CSS variables in `app/assets/css/main.css`:

```css
html.dark {
  --primary: #your-color;
  /* ... */
}
```

No dependencies required! 🚀
