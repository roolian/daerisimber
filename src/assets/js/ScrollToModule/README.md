# ScrollToModule

A module for smooth scroll navigation, back-to-top functionality, and sticky navigation animations using GSAP and ScrollTrigger.

## Dependencies

- [GSAP](https://greensock.com/gsap/) - Animation library
- [ScrollTrigger](https://greensock.com/scrolltrigger/) - GSAP plugin for scroll-based animations

## Features

- Smooth scroll to anchor links
- Animated back-to-top button
- Sticky navigation with show/hide on scroll
- Customizable scroll offset
- Automatic initialization

## Usage

### Smooth Scroll to Anchors

Any link with `href="#..."` automatically gets smooth scroll behavior:

```html
<a href="#section-2">Go to Section 2</a>

<section id="section-2">
    <!-- Content -->
</section>
```

### Custom Offset

Add `data-y` attribute to adjust scroll offset:

```html
<a href="#contact" data-y="150">Contact Us</a>
```

## Back to Top Button

### HTML Structure

```html
<div id="back-to-top-container">
    <button id="back-to-top">↑ Top</button>
</div>

<footer id="main-footer">
    <!-- Footer content -->
</footer>
```

### Behavior

- **Fade in**: Appears after scrolling 100-200px
- **Positioning**: Becomes absolute when footer is visible
- **Click**: Smoothly scrolls to page top

### Styling

```css
#back-to-top-container {
    position: fixed;
    bottom: 32px;
    right: 32px;
    z-index: 1000;
}

#back-to-top {
    opacity: 0; /* Module handles visibility */
}
```

## Sticky Navigation

### HTML Structure

```html
<header id="main-header" data-nav-behavior="smart">
    <nav>
        <!-- Navigation content -->
    </nav>
</header>
```

### Behaviors

Configure via `data-nav-behavior` attribute:

#### Smart Behavior (Recommended)

```html
<header id="main-header" data-nav-behavior="smart">
```

- Shows when scrolling up
- Hides when scrolling down
- Always visible at page top
- Smooth animations

#### Always Visible

```html
<header id="main-header" data-nav-behavior="always">
```

- Sticky and always visible
- No hide on scroll

#### Auto Hide on Scroll

```html
<header id="main-header" data-nav-behavior="auto">
```

- Hides after scrolling past 100px
- Shows when scrolling back up

#### Trigger-Based

```html
<header id="main-header" data-nav-behavior="trigger">
```

- Hidden until scrolling past trigger
- Shows when scrolling back to trigger

## Examples

### Complete Page Setup

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        #main-header {
            position: sticky;
            top: 0;
            z-index: 100;
            background: white;
            transition: transform 0.3s ease;
        }
        
        #back-to-top-container {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            z-index: 1000;
        }
    </style>
</head>
<body>
    <header id="main-header" data-nav-behavior="smart">
        <nav>
            <a href="#hero">Home</a>
            <a href="#about" data-y="80">About</a>
            <a href="#contact" data-y="100">Contact</a>
        </nav>
    </header>

    <section id="hero">
        <!-- Hero content -->
    </section>

    <section id="about">
        <!-- About content -->
    </section>

    <section id="contact">
        <!-- Contact content -->
    </section>

    <footer id="main-footer">
        <!-- Footer content -->
    </footer>

    <div id="back-to-top-container">
        <button id="back-to-top" aria-label="Back to top">
            ↑
        </button>
    </div>
</body>
</html>
```

### Navigation with Smooth Scroll Menu

```html
<nav>
    <ul>
        <li><a href="#services" data-y="100">Services</a></li>
        <li><a href="#portfolio" data-y="100">Portfolio</a></li>
        <li><a href="#team" data-y="100">Team</a></li>
        <li><a href="#contact" data-y="100">Contact</a></li>
    </ul>
</nav>
```

## Customization

### Scroll Offset

Default offset is 100px. Customize per link:

```html
<!-- No offset -->
<a href="#section" data-y="0">Link</a>

<!-- 200px offset -->
<a href="#section" data-y="200">Link</a>
```

### Back to Top Animation

The fade-in animation is configurable in the code:

```javascript
gsap.fromTo('#back-to-top',
    { autoAlpha: 0, y: 20 },
    {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
            start: 100,  // Show after 100px
            end: 200,    // Fully visible at 200px
            scrub: 1
        }
    }
);
```

### Smart Navigation Timing

Adjust how quickly navigation hides/shows:

```javascript
const showAnim = gsap.fromTo('#main-header', 
    { yPercent: -100 }, 
    {
        yPercent: 0,
        duration: 0.3,  // Adjust speed
        ease: 'power2.out'
    }
);
```

## Required Elements

For full functionality, ensure these elements exist:

- `#main-header` - Header element with navigation
- `#back-to-top` - Back to top button
- `#back-to-top-container` - Container for back to top button
- `#main-footer` - Footer element

Missing elements will log warnings but won't break the module.

## Initialization

```javascript
import ScrollTo from './js/ScrollToModule/ScrollToModule.js';

ScrollTo.init();
```

## API

### Methods

- **`activate()`**: Check if module should run (always returns true)
- **`init()`**: Initialize all scroll functionality
- **`initScrollToElements()`**: Setup smooth scroll for anchor links
- **`initBackToTopButton()`**: Setup back-to-top button
- **`initMainStickyNav()`**: Setup sticky navigation animations

## Browser Compatibility

Uses native `window.scrollTo({ behavior: 'smooth' })` which is supported in:
- Chrome 61+
- Firefox 36+
- Safari 14+
- Edge 79+

For older browsers, consider a polyfill.

## Accessibility

The module maintains keyboard navigation and focus. Ensure your HTML includes:

```html
<button id="back-to-top" aria-label="Back to top">
    ↑
</button>
```

## Performance

- Uses GSAP's optimized animations
- ScrollTrigger efficiently manages scroll events
- Smooth scroll uses browser's native implementation
- Minimal DOM queries on scroll

## Tips

1. Use consistent `data-y` values across your navigation
2. Test back-to-top positioning with different footer heights
3. Choose appropriate nav behavior for your design
4. Ensure sufficient contrast for back-to-top button
5. Test on mobile - smooth scroll works on touch devices
