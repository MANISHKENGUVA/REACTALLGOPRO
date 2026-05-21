---
name: Aura Ultra
colors:
  surface: '#141218'
  surface-dim: '#141218'
  surface-bright: '#3b383e'
  surface-container-lowest: '#0f0d13'
  surface-container-low: '#1d1b20'
  surface-container: '#211f24'
  surface-container-high: '#2b292f'
  surface-container-highest: '#36343a'
  on-surface: '#e6e0e9'
  on-surface-variant: '#cbc4d2'
  inverse-surface: '#e6e0e9'
  inverse-on-surface: '#322f35'
  outline: '#948e9c'
  outline-variant: '#494551'
  surface-tint: '#cfbcff'
  primary: '#cfbcff'
  on-primary: '#381e72'
  primary-container: '#6750a4'
  on-primary-container: '#e0d2ff'
  inverse-primary: '#6750a4'
  secondary: '#cdc0e9'
  on-secondary: '#342b4b'
  secondary-container: '#4d4465'
  on-secondary-container: '#bfb2da'
  tertiary: '#e7c365'
  on-tertiary: '#3e2e00'
  tertiary-container: '#c9a74d'
  on-tertiary-container: '#503d00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#cfbcff'
  on-primary-fixed: '#22005d'
  on-primary-fixed-variant: '#4f378a'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#cdc0e9'
  on-secondary-fixed: '#1f1635'
  on-secondary-fixed-variant: '#4b4263'
  tertiary-fixed: '#ffdf93'
  tertiary-fixed-dim: '#e7c365'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#141218'
  on-background: '#e6e0e9'
  surface-variant: '#36343a'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  giant: 80px
---

## Brand & Style

This design system is built for high-end digital experiences that demand prestige, clarity, and a commanding visual presence. It targets a discerning audience—executives, creative directors, and tech innovators—who value precision over playfulness.

The aesthetic is **Luxury Minimalist with High-Contrast Accents**. It fuses the structured reliability of **Corporate Modern** with the expressive depth of **Glassmorphism** and **High-Contrast** movements. The UI should evoke a sense of "digital craftsmanship," where every pixel feels intentional, and whitespace is treated as a premium asset rather than a void. Each of the four themes provides a distinct emotional atmosphere:
- **Midnight Obsidian**: Exclusive, focused, and powerful.
- **Nordic Alabaster**: Intellectual, transparent, and precise.
- **Cyberpunk Neon**: Dynamic, forward-leaning, and energetic.
- **Earth & Anthracite**: Grounded, artisanal, and timeless.

## Colors

The color strategy relies on extreme contrast ratios to ensure legibility and a "premium" feel. 

1.  **Midnight Obsidian**: Use the primary indigo sparingly for critical actions (AUBUTTON) and subtle border-glows on AUCARD components to differentiate stack depth.
2.  **Nordic Alabaster**: Leverage the #FFFFFF base to create expansive layouts. Use the deep teal for meaningful interaction points only. Contrast is maintained through 1px hairlines instead of heavy shadows.
3.  **Cyberpunk Neon**: Employs a glassmorphic approach. Surfaces are translucent with backdrop blurs (20px-40px). Accents utilize soft glows to simulate light emission.
4.  **Earth & Anthracite**: A warm palette where the "paper" base provides a tactile feel. The burnished orange is used for brand moments and primary navigation states.

## Typography

This design system uses a high-contrast typographic pairing. **Playfair Display** provides an editorial, authoritative voice for headlines, emphasizing the premium nature of the brand. **Inter** is used for all functional and body text, ensuring maximum readability and a technical, systematic feel.

- **Headlines**: Use tight letter-spacing on larger sizes to maintain a "lock-up" feel. In dark modes, keep headlines at a slightly higher weight (600+) to prevent "thinning" against dark backgrounds.
- **Body**: Maintain generous line-height (1.5x+) to support the "Nordic" and "Earth" philosophies of openness.
- **Labels**: Small labels often utilize uppercase with increased letter-spacing (5%) to differentiate from body text and signify interactive or metadata roles.

## Layout & Spacing

The system follows a **strict 4px grid**. All dimensions, padding, and margins must be multiples of 4. 

The layout model is a **Fixed-Fluid Hybrid**:
- **Desktop**: Content is centered within a 12-column grid with a maximum container width of 1440px. Gutters are fixed at 24px.
- **Mobile**: A 4-column fluid grid. Margins scale down to 20px to maximize screen real estate for content.

Spacing should be used aggressively to create "focus zones." Use `xxl` and `giant` spacing for section breaks to maintain the premium editorial feel.

## Elevation & Depth

Hierarchy is defined differently across the four themes:

1.  **Midnight Obsidian**: Depth is achieved through "Lume" borders. Rather than traditional shadows, use 1px inner borders with low-opacity primary colors (#6366F1 at 10-20%) to suggest that higher-elevation elements are closer to the light source.
2.  **Nordic Alabaster**: A "Flat-Layered" approach. Use subtle background shifts (Surface to Surface-Raised) and 1px hairlines. Shadows are non-existent or extremely diffuse (0px 20px 40px rgba(0,0,0,0.04)).
3.  **Cyberpunk Neon**: Uses backdrop filters (`blur(20px)`) and additive blending. High elevation is signaled by "glow" halos—outer shadows with higher spread and saturation matching the primary or secondary neon hues.
4.  **Earth & Anthracite**: Uses "Soft-Press" depth. Elements look like they are sitting on paper. Use very soft, warm-tinted shadows (e.g., shadows with a hint of #78350F) to keep the warmth consistent.

## Shapes

The shape language is "Tailored Softness." While the system is primarily professional and structured, sharp 90-degree corners are avoided to prevent a "brutalist" or "engineered" feel.

- **Standard (0.25rem)**: Used for input fields, small buttons, and tags.
- **Large (0.5rem)**: Used for AUCARD and modal containers.
- **Extra Large (0.75rem)**: Used for hero sections or featured promotional containers.

In the Cyberpunk Neon theme, the roundedness can be strictly 0 (Sharp) for specific decorative elements to enhance the "tech" aesthetic, though functional components should remain Soft.

## Components

### AUBUTTON (Buttons)
- **Primary**: Solid fill (Theme Primary), white or high-contrast text. No border, except in Midnight Obsidian (1px indigo glow).
- **Secondary**: 1px border (On-Surface color at 20% opacity), no fill. 
- **Interaction**: On hover, scale 102% with a smooth 200ms transition.

### AUCARD (Cards)
- **Structure**: 24px internal padding. In Nordic, use a 1px border. In Cyberpunk, use 3% white overlay with blur.
- **Content**: Headlines always in Playfair Display, Body in Inter.

### AUINPUT (Input Fields)
- **State**: Default has a 1px bottom border only (Nordic/Earth) or a full subtle frame (Midnight/Cyberpunk).
- **Focus**: The border color shifts to Primary, and a 2px "focus ring" glow is applied in the Primary color at 10% opacity.

### AUCHIP (Chips/Tags)
- Small, uppercase label typography. Backgrounds should be low-saturation versions of the theme's secondary colors to keep them subordinate to the primary AUBUTTON.

### AULIST (List Items)
- Separated by 1px hairlines (Nordic) or increased vertical spacing (Earth). High contrast on the primary text, with metadata (label-sm) in 60% opacity.