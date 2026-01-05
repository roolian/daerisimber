# AjaxFactoryModule

A comprehensive module for handling AJAX form submissions and content updates with validation, animations, and flexible response handling.

## Features

- Declarative AJAX configuration via data attributes
- Client-side and server-side validation
- Live validation (as-you-type)
- Multiple injection modes (replace, append, prepend)
- Animation support
- Form data serialization
- Error handling and display
- Loading states
- History state management
- Custom event dispatching

## Usage

### Basic Form Submission

```html
<form data-ajax-action="my_custom_action" 
      data-ajax-form=".my-form"
      data-ajax-update="#result-container">
    <input type="text" name="username" required />
    <button type="submit">Submit</button>
</form>

<div id="result-container"></div>
```

### Button Trigger

```html
<div data-ajax-action="load_posts"
     data-ajax-trigger=".load-more-btn"
     data-ajax-update="#posts-container"
     data-ajax-injection="append">
    <button class="load-more-btn">Load More</button>
</div>

<div id="posts-container"></div>
```

## Data Attributes

### Required

- **`data-ajax-action`**: WordPress AJAX action name (without `wp_ajax_` prefix)

### Optional

- **`data-ajax-form`**: Form selector (default: uses the element itself if it's a form)
- **`data-ajax-trigger`**: Event trigger - element selector or event name (default: `"submit"`)
- **`data-ajax-update`**: Target element selector where to inject response
- **`data-ajax-injection`**: How to inject HTML: `"replace"` (default), `"append"`, or `"prepend"`
- **`data-ajax-animation`**: Animation effect name
- **`data-ajax-validation`**: Validation mode: `"client"` (default) or `"server"`
- **`data-ajax-live-validation`**: Live validation mode: `false` (default), `"light"`, or `"medium"`
- **`data-ajax-show-errors`**: Display validation errors: `true` or `false` (default)
- **`data-ajax-json`**: Additional JSON data to send with request
- **`data-ajax-loader`**: Loader configuration (WIP)
- **`data-root-element`**: Root element selector for scoped queries

## Validation

### Client-Side Validation

Uses HTML5 validation attributes:

```html
<form data-ajax-action="contact_form" data-ajax-validation="client">
    <input type="email" name="email" required />
    <input type="text" name="name" required minlength="3" />
    <button type="submit">Send</button>
</form>
```

### Live Validation

```html
<form data-ajax-action="contact_form" 
      data-ajax-live-validation="medium"
      data-ajax-show-errors="true">
    <!-- Fields will be validated as you type -->
    <!-- Submit button disabled until all fields are valid -->
</form>
```

**Modes:**
- `false`: No live validation (default)
- `"light"`: Validate required fields as user types
- `"medium"`: Light + disable submit button until all fields are valid

### Server-Side Validation

```html
<form data-ajax-action="contact_form" 
      data-ajax-validation="server"
      data-ajax-show-errors="true">
    <!-- Server will validate and return errors -->
</form>
```

Your PHP handler should return:

```php
wp_send_json([
    'success' => false,
    'errors' => [
        'email' => 'Invalid email format',
        'name' => 'Name is required'
    ]
]);
```

## WordPress PHP Handler

### Basic Handler

```php
add_action('wp_ajax_my_custom_action', 'my_custom_action_handler');
add_action('wp_ajax_nopriv_my_custom_action', 'my_custom_action_handler');

function my_custom_action_handler() {
    // Get form data
    $username = $_POST['username'] ?? '';
    
    // Process data
    $result = do_something($username);
    
    // Return HTML
    wp_send_json([
        'success' => true,
        'html' => '<div>Result: ' . esc_html($result) . '</div>'
    ]);
}
```

### With Validation

```php
function my_custom_action_handler() {
    $errors = [];
    
    if (empty($_POST['email'])) {
        $errors['email'] = 'Email is required';
    }
    
    if (!empty($errors)) {
        wp_send_json([
            'success' => false,
            'errors' => $errors
        ]);
    }
    
    // Process valid data
    wp_send_json([
        'success' => true,
        'html' => '<div>Success!</div>'
    ]);
}
```

## Response Format

The module expects JSON responses from the server:

```javascript
{
    success: true,          // Required: boolean
    html: '<div>...</div>', // Optional: HTML to inject
    message: 'Success!',    // Optional: message to display
    errors: {               // Optional: validation errors
        fieldName: 'Error message'
    },
    redirect: '/path',      // Optional: redirect URL
    data: {}               // Optional: custom data
}
```

## Events

The module dispatches custom events:

### Before Request

```javascript
document.addEventListener('ajax:before', (event) => {
    const { element, formData } = event.detail;
    // Modify formData or cancel request
});
```

### Success

```javascript
document.addEventListener('ajax:success', (event) => {
    const { response, element } = event.detail;
    // Handle successful response
});
```

### Error

```javascript
document.addEventListener('ajax:error', (event) => {
    const { error, element } = event.detail;
    // Handle error
});
```

### Complete

```javascript
document.addEventListener('ajax:complete', (event) => {
    const { element } = event.detail;
    // Always fired after request
});
```

## Advanced Examples

### Load More Posts

```html
<div data-ajax-action="load_more_posts"
     data-ajax-trigger=".load-more"
     data-ajax-update="#posts-grid"
     data-ajax-injection="append"
     data-ajax-json='{"posts_per_page": 6}'>
    <button class="load-more">Load More</button>
</div>
```

### Filter Posts

```html
<form data-ajax-action="filter_posts"
      data-ajax-update="#posts-grid"
      data-ajax-trigger="change">
    <select name="category">
        <option value="">All</option>
        <option value="news">News</option>
    </select>
</form>
```

### Search with Live Results

```html
<div data-ajax-action="search_posts"
     data-ajax-trigger="input"
     data-ajax-update="#search-results"
     data-ajax-form="input[name='search']">
    <input type="text" name="search" placeholder="Search..." />
</div>

<div id="search-results"></div>
```

## Initialization

```javascript
import AjaxFactory from './js/AjaxFactoryModule/AjaxFactoryModule.js';

// Initialize on page load
AjaxFactory.init();
```

## Tips

- Use `data-ajax-json` to pass static data
- Form fields automatically serialize to POST data
- Add `required` attribute for client-side validation
- Use `data-ajax-show-errors="true"` to display validation messages
- The module handles nonce automatically via `siteData.ajaxUrl`
