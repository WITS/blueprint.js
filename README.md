# What is blueprint.js?

blueprint.js provides a versatile function for easily creating DOM elements and element templates with highly readable code. It tiny, fast, and it doesn't try to create it's own Turing-complete language just to make DOM elements. That's what JavaScript is for.

# Usage

## Load blueprint.js

To use blueprint.js, you simply need to load the transition.js in your page. This can be accomplished by adding the following line to your `<head>` element:

```html
<script src='https://wits.github.io/blueprint.js/blueprint.js'></script>
```

The code above will ensure that you always get the latest version of blueprint.js. (You can also host the file yourself.)

## Creating an empty element

blueprint.js is a tiny library that is almost exclusively designed for creating DOM elements. Creating elements with blueprint.js always starts with the `$new` function, which creates blank elements. This function can do a lot directly, as in the cases below:

### Creating an empty div

The simplest usage of the `$new` method is to create an empty div. To do this, you can simply call:

```js
$new().element(); // HTMLDivElement
```

This will return an HTMLDivElement (`<div>`) with no children, text, or classes.

### Creating an h1 element

`$new` can create elements with other tags, like so:

```js
$new('h1').element(); // HTMLHeadingElement
```

This will return an HTMLHeadingElement (`<h1>`, specifically) with no children, text, or classes.

### Creating an element with an id

`$new` can also be used to easily create elements with a specific id. For instance:

```js
$new('#foo').element();
```

This will return an HTMLDivElement (`<div>`) with the id `foo`. (Equivalent to `<div id="foo"></div>`.)

### Creating an element with class(es)

`$new` can also be used to easily create elements with specific classes. For instance:

```js
$new('.foo.bar').element();
```

This will return an HTMLDivElement (`<div>`) with the classes `foo` and `bar`. (Equivalent to `<div class="foo bar"></div>`.)

### Creating an element with attributes

`$new` can also be used to easily create elements with specific attributes. For instance:

```js
$new('[title="Hello!"]').element();
```

This will return an HTMLDivElement equivalent to `<div title="Hello!"></div>`.

### Combining the methods above

The methods above can all be combined to create complex elements in a very short, simple, readable way:

```js
$new('h1.foo#bar[title="baz"]').element();
```

This will return an element equivalent to: `<h1 class="foo" id="bar" title="baz"></h1>`.

## Adding text

You can add text to elements before creating them using the `.text` method, like so:

```js
$new().text('Lorem ipsum ...').element();
```

This will return an HTMLDivElement (`<div>`) with the text "Lorem ipsum ...", but no children or classes.

## Adding children

You can add child elements to elements before creating them, using the `.children` method, like so:

```js
$new('ul').children(
    $new('li').text('Item 1'),
    $new('li').text('Item 2'),
    $new('li').text('Item 3')
).element();
```

This will return an HTMLUListElement (`<ul>`) with three (`<li>`) children, each with distinct text.
