# Neo-Glassmorphic Design System

## Design Philosophy
Machines & More uses a **neo-glassmorphic design system** that combines:
- Premium iOS-inspired aesthetics
- Modern gaming UI vibrancy
- Industrial machinery professionalism
- Heavy emphasis on interactivity and micro-animations

This creates a sophisticated, trustworthy experience for industrial machinery buyers while maintaining a cutting-edge, engaging interface.

## Color Palette

### Primary Gradient System (Violet-Indigo-Purple)
```css
--primary: 262 80% 50%        /* Deep violet - main brand color */
--secondary: 252 70% 60%      /* Bright indigo - secondary actions */
--accent: 280 90% 55%         /* Rich purple - highlights */
```

### Industrial Context Colors
```css
--industrial: 200 40% 45%     /* Steel blue - machinery context */
--machine-accent: 45 95% 55%  /* Golden yellow - industrial strength */
```

### Glassmorphic Surfaces
```css
--glass-surface: Light/dark adaptive surface
--glass-border: Subtle border with transparency
--glass-overlay: Semi-transparent overlay layer
```

## Core Design Utilities

### 1. Glassmorphic Effects
Apply these classes for the signature glass aesthetic:

```tsx
// Standard glass effect
<div className="glass-effect">
  /* backdrop-blur: 24px, 70% opacity */
</div>

// Strong glass effect (headers, dialogs)
<div className="glass-effect-strong">
  /* backdrop-blur: 40px, 85% opacity */
</div>
```

### 2. Gradient Overlays
Vibrant gradients as primary visual language:

```tsx
// Primary gradient (violet → indigo → purple)
<div className="bg-gradient-primary">

// Industrial gradient (steel blue → violet → purple)
<div className="bg-gradient-industrial">

// Gradient mesh background
<div className="gradient-mesh">
```

### 3. Depth Perception Layers
Multi-layer shadow system for visual hierarchy:

```tsx
<div className="depth-layer-1">  /* Subtle depth */
<div className="depth-layer-2">  /* Medium depth - cards */
<div className="depth-layer-3">  /* Maximum depth - dialogs */
```

### 4. Staggered Pulse Animations
Create breathing, living UI elements:

```tsx
<div className="animate-pulse-glow">           /* 0s delay */
<div className="animate-pulse-glow-delay-1">   /* 0.5s delay */
<div className="animate-pulse-glow-delay-2">   /* 1s delay */
```

### 5. Micro-Interactions
Every touchpoint should respond:

```tsx
// Scale on hover/active
<button className="interactive-scale">

// Lift on hover with shadow
<div className="interactive-lift">

// Gradient border glow on hover
<div className="interactive-glow">
```

### 6. Special Effects

```tsx
// Shimmer animation (badges, tags)
<div className="animate-shimmer">

// Floating animation
<div className="animate-float">

// Industrial machinery glow
<div className="machine-glow">
```

## Component Patterns

### Button Variants
```tsx
// Primary gradient button
<Button variant="default">Action</Button>

// Industrial strength button
<Button variant="industrial">Heavy Action</Button>

// Glass button
<Button variant="glass">Subtle Action</Button>

// Outline glass button
<Button variant="outline">Secondary</Button>
```

### Card Patterns
```tsx
<Card className="glass-effect depth-layer-2 interactive-lift border-white/20">
  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10" />
  {/* Content */}
</Card>
```

### Input Fields
```tsx
<div className="glass-effect rounded-xl">
  <Input className="bg-white/50 dark:bg-black/20 backdrop-blur-xl" />
</div>
```

### Navigation Links
```tsx
<Link className="relative group">
  <span className="group-hover:text-primary transition-colors">
    Text
  </span>
  <span className="absolute bottom-0 left-0 w-0 h-0.5 
    bg-gradient-primary transition-all group-hover:w-full" />
</Link>
```

## Animation Timing
- **Fast interactions**: 200-300ms (buttons, scales)
- **Medium transitions**: 300-500ms (cards, lifts)
- **Slow animations**: 500-700ms (images, complex transforms)
- **Pulse animations**: 3s infinite
- **Shimmer effects**: 2s infinite

## Accessibility Notes

### Color Contrast
- All gradient text uses `bg-clip-text` with sufficient contrast
- Glass effects maintain readable text with backdrop-blur
- Focus states use visible rings with primary color

### Motion
- Animations respect `prefers-reduced-motion`
- Hover effects are supplemented with focus states
- Interactive elements have min 44x44px touch targets

## Usage Examples

### Product Card
```tsx
<Card className="glass-effect depth-layer-2 interactive-lift group 
  border-white/20 hover:border-primary/30">
  <div className="absolute inset-0 bg-gradient-primary 
    opacity-0 group-hover:opacity-10" />
  {/* Product content */}
</Card>
```

### Category Button
```tsx
<button className="glass-effect depth-layer-2 interactive-lift 
  border-white/20 hover:border-primary/30 rounded-2xl p-6">
  <div className="animate-float">{emoji}</div>
  <h3 className="font-bold">{category}</h3>
</button>
```

### Dialog
```tsx
<DialogContent className="glass-effect-strong depth-layer-3 
  border-white/20 rounded-2xl">
  <DialogTitle className="bg-gradient-primary bg-clip-text 
    text-transparent">
    Title
  </DialogTitle>
  {/* Content */}
</DialogContent>
```

### Header with Glass Effect
```tsx
<header className="glass-effect-strong border-b border-white/10">
  <div className="bg-gradient-primary opacity-90">
    {/* Top bar */}
  </div>
  <div className="bg-gradient-to-br from-primary/10 via-secondary/5">
    {/* Main header */}
  </div>
</header>
```

## Industrial Machinery Context

### Golden Accent Usage
Use `machine` color for:
- Price displays
- "In Stock" indicators
- Verified badges
- Special machinery highlights

```tsx
<span className="text-machine animate-pulse-glow">
  {formatPrice(price)}
</span>
```

### Verified Seller Badge
```tsx
<div className="glass-effect-strong animate-pulse-glow 
  border-white/20 rounded-full">
  <BadgeCheck className="text-green-400" />
  <span className="bg-gradient-to-r from-green-400 to-emerald-300 
    bg-clip-text text-transparent">
    Verified
  </span>
</div>
```

## Best Practices

1. **Layer Gradients**: Background mesh → Glass surface → Content → Hover gradients
2. **Stagger Animations**: Use delay variants to create rhythm
3. **Group Interactions**: Parent `group` class enables child hover states
4. **Border Transparency**: Use `border-white/20` for glass effect borders
5. **Progressive Enhancement**: Base styles work without JS, animations enhance
6. **Performance**: Use `backdrop-filter` sparingly, prefer CSS transforms
7. **Dark Mode**: All HSL colors automatically adapt

## Responsive Considerations

- Glass effects remain consistent across breakpoints
- Reduce blur intensity on mobile for performance
- Scale animations are touch-friendly
- Maintain minimum 44px touch targets

## Future Enhancements

- [ ] Add particle effects for hero sections
- [ ] Implement scroll-based parallax for depth
- [ ] Create animated gradient borders for premium listings
- [ ] Add sound effects for micro-interactions (optional)
- [ ] Implement theme customization panel
