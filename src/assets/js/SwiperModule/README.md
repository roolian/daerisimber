# SwiperModule

A module to initialize and manage Swiper carousels with custom autoplay behavior.

## Dependencies

- [Swiper](https://swiperjs.com/) - Modern touch slider
- Modules: Navigation, Pagination, Autoplay, FreeMode

## Features

- Automatic initialization of all `.swiper` elements
- Custom autoplay with pause on hover
- ACF block preview support
- Configurable via data attributes
- Custom event dispatching

## Usage

### Basic HTML Structure

```html
<div class="swiper" data-swiper-options='{"slidesPerView": 3, "spaceBetween": 16}'>
    <div class="swiper-wrapper">
        <div class="swiper-slide">Slide 1</div>
        <div class="swiper-slide">Slide 2</div>
        <div class="swiper-slide">Slide 3</div>
    </div>
    
    <!-- Optional: Navigation -->
    <div class="swiper-prev">Previous</div>
    <div class="swiper-next">Next</div>
    
    <!-- Optional: Pagination -->
    <div class="swiper-pagination"></div>
</div>
```

### With Autoplay

Add the `autoplay` class to enable custom autoplay behavior with pause on hover:

```html
<div class="swiper autoplay" data-swiper-options='{"autoplay": {"delay": 3000}}'>
    <!-- slides -->
</div>
```

## Configuration

### Data Attributes

- **`data-swiper-options`**: JSON object with Swiper configuration options

### Default Options

```javascript
{
    modules: [Navigation, Pagination, Autoplay, FreeMode],
    slidesPerView: 1,
    spaceBetween: 32,
    loop: false,
    pagination: {
        el: ".swiper-pagination",
        type: "progressbar"
    },
    navigation: {
        nextEl: ".swiper-next",
        prevEl: ".swiper-prev"
    }
}
```

## Custom Events

The module dispatches a `swiper:initialized` event when a Swiper instance is ready:

```javascript
document.querySelector('.swiper').addEventListener('swiper:initialized', (event) => {
    const swiperInstance = event.detail.swiper;
    // Your custom logic
});
```

## Custom Autoplay Behavior

For `.swiper.autoplay` elements, the module adds:
- **Pause on hover**: Autoplay pauses when mouse enters the swiper
- **Resume on leave**: Autoplay resumes smoothly when mouse leaves
- **Smooth transitions**: Calculates distance ratio for seamless animations

## Initialization

The module automatically initializes on page load and when ACF blocks are rendered:

```javascript
import SwiperModule from './js/SwiperModule/SwiperModule.js';

SwiperModule.init();
```

## API

### Methods

- **`init()`**: Initialize all swiper instances and ACF hooks
- **`initDom()`**: Scan DOM and create swiper instances
- **`customAutoPlay(swiperElement)`**: Setup custom autoplay behavior for a swiper element

## Example Configurations

### Multiple Slides Per View

```html
<div class="swiper" data-swiper-options='{
    "slidesPerView": 1,
    "spaceBetween": 16,
    "breakpoints": {
        "640": {"slidesPerView": 2},
        "1024": {"slidesPerView": 3}
    }
}'>
```

### Loop with Autoplay

```html
<div class="swiper autoplay" data-swiper-options='{
    "loop": true,
    "autoplay": {
        "delay": 3000,
        "disableOnInteraction": false
    }
}'>
```

### Free Mode

```html
<div class="swiper" data-swiper-options='{
    "freeMode": true,
    "slidesPerView": "auto",
    "spaceBetween": 16
}'>
```
