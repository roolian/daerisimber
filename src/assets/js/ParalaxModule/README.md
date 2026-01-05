# ParalaxModule

A module for creating smooth parallax scroll animations using GSAP and ScrollTrigger.

## Dependencies

- [GSAP](https://greensock.com/gsap/) - Animation library
- [ScrollTrigger](https://greensock.com/scrolltrigger/) - GSAP plugin for scroll-based animations

## Features

- Parallax animations triggered by scroll
- Pin sections during scroll
- Multiple movement types (translate, scale, rotate, opacity)
- Auto-configuration for common patterns
- Configurable via data attributes
- Responsive and performant

## Usage

### Basic Parallax Section

```html
<div data-st-section 
     data-st-start="top center" 
     data-st-end="bottom top">
    
    <div data-st-movements='{"y": "100", "duration": 1}'>
        <h2>This element moves on scroll</h2>
    </div>
</div>
```

### Auto-Configured Section

For common animations, just add the `.st-section` class:

```html
<div class="st-section" id="hero">
    <h2>Animated Title</h2>
    <p class="subtitle">Animated Subtitle</p>
</div>
```

## Data Attributes

### Section Configuration

Add these to the section container:

- **`data-st-section`**: Marks element as a parallax section (required)
- **`data-st-start`**: ScrollTrigger start position (default: `"top center"`)
- **`data-st-end`**: ScrollTrigger end position (default: `"bottom top"`)
- **`data-st-scrub`**: Scrub value for smooth animations (default: `1`)
- **`data-st-pin`**: Pin the section during scroll (default: `false`)

### Element Movements

Add to animated elements within the section:

- **`data-st-movements`**: JSON object with GSAP animation properties

## Movement Properties

The `data-st-movements` attribute accepts any GSAP animation properties:

```json
{
    "y": "100",           // Translate Y
    "x": "50",            // Translate X
    "scale": "1.2",       // Scale
    "rotate": "45",       // Rotation in degrees
    "autoAlpha": "0",     // Opacity + visibility
    "duration": "1",      // Animation duration
    "ease": "power2.out"  // Easing function
}
```

## Examples

### Fade In On Scroll

```html
<div data-st-section>
    <div data-st-movements='{"autoAlpha": "0", "y": "50", "duration": 1}'>
        <p>This fades in and moves up</p>
    </div>
</div>
```

### Parallax Background

```html
<div data-st-section 
     data-st-start="top bottom" 
     data-st-end="bottom top"
     data-st-scrub="3">
    
    <div class="bg-image" 
         data-st-movements='{"y": "-20%", "ease": "none"}'>
        <!-- Background moves slower than scroll -->
    </div>
</div>
```

### Pinned Section

```html
<div data-st-section 
     data-st-pin="true"
     data-st-start="top top"
     data-st-end="+=2000">
    
    <h2 data-st-movements='{"scale": "2", "autoAlpha": "0"}'>
        This section stays pinned while elements animate
    </h2>
</div>
```

### Multiple Elements

```html
<div data-st-section>
    <div data-st-movements='{"y": "100", "duration": 1}'>
        <h2>Moves 100px</h2>
    </div>
    
    <div data-st-movements='{"y": "-50", "autoAlpha": "0", "duration": 1}'>
        <p>Moves -50px and fades</p>
    </div>
</div>
```

### Rotation Effect

```html
<div data-st-section data-st-scrub="2">
    <div data-st-movements='{"rotate": "360", "scale": "1.5"}'>
        <img src="logo.svg" alt="Logo" />
    </div>
</div>
```

## ScrollTrigger Positions

Common start/end position patterns:

```
"top top"       - Element top hits viewport top
"top center"    - Element top hits viewport center
"top bottom"    - Element top hits viewport bottom
"center center" - Element center hits viewport center
"bottom top"    - Element bottom hits viewport top
"+=500"         - 500px after start position
```

## Auto-Section Configuration

Elements with class `.st-section` get default animations:

- `h2` elements: Move up from 100px
- `.subtitle`, `.pretitle`: Move up from -50px with fade

Default configuration:
```javascript
{
    start: "top center+=20%",
    end: "bottom center+=20%",
    scrub: 3,
    pin: false
}
```

## Scrub Values

The `scrub` value controls animation smoothness:

- `true`: Immediate, no smoothing
- `1`: Fast smooth (1 second)
- `3`: Medium smooth (3 seconds) - recommended
- `5`: Slow smooth (5 seconds)

## Performance Tips

1. **Limit movements**: Avoid animating too many elements at once
2. **Use transform properties**: `x`, `y`, `scale`, `rotate` are GPU-accelerated
3. **Avoid layout properties**: Don't animate `width`, `height`, `margin`, etc.
4. **Use will-change**: Add CSS `will-change: transform` to animated elements
5. **Test on mobile**: Parallax can be heavy on mobile devices

## Disabling in Editor

The module automatically disables in WordPress block editor (`.editor-visual-editor`).

## Initialization

```javascript
import Paralax from './js/ParalaxModule/ParalaxModule.js';

Paralax.init();
```

## API

### Methods

- **`activate()`**: Check if module should run
- **`init()`**: Initialize all parallax sections
- **`setupParallaxSection(layer)`**: Setup configured parallax section
- **`setupAutoSection(layer)`**: Setup auto-configured section
- **`getSectionConfiguration(layer)`**: Extract section config from data attributes
- **`createSectionTimeline(layer, config)`**: Create GSAP timeline with ScrollTrigger
- **`processParallaxElements(layer, timeline)`**: Add element animations to timeline

## Debug Mode

Uncomment `markers: true` in the code to see ScrollTrigger markers:

```javascript
{
    start: "top center",
    end: "bottom top",
    markers: true  // Shows start/end positions
}
```

## CSS Considerations

Add this CSS to prevent layout shift:

```css
[data-st-movements] {
    will-change: transform, opacity;
}
```
