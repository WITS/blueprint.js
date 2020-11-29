# What is blueprint.js?

blueprint.js provides a versatile function for easily creating DOM elements and element templates with highly readable code. It tiny, fast, and it doesn't try to create it's own Turing-complete language just to make DOM elements. That's what JavaScript is for.

# Demo

To see an example of how blueprint.js works, [check out this page](https://wits.github.io/blueprint.js/demo). The code that creates all the visible elements in the demo is [here](https://wits.github.io/blueprint.js/demo.js).

# Usage

Blueprint requires one `.js` file that's less than 15 KB, raw. (A future release will include a smaller, minified version.)

## Load blueprint.js

To use blueprint.js, you simply need to load one script in your page. This can be accomplished by adding the following line to your `<head>` element:

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

## Other methods

There are several other methods that can be chained together when creating elements (in addition to `.text` and `.children`).

### Set attributes

Although attributes can be added in the `$new` function, they can also be added using the `attr` method. This method can be used in two ways.

```js
// $new
$new('a[href=http://example.com]').element();

// .attr(name, value)
$new('a').attr('href', 'http://example.com').element();

// .attr(JSON)
$new('a').attr({
    href: 'http://example.com'
}).element();
```


### Set style

CSS styling can be added using the `style` method. This method can be used in two ways.

```js
// .style(name, value)
$new().style('background-color', 'red').element();

// .style(JSON)
$new().style({
    backgroundColor: 'red'
}).element();
```

### Add classes

Although classes can be added in the `$new` function, they can also be added using the `class` method.

```js
// $new
$new('.foo').element();

// .class
$new().class('foo').element();
```

### Set id

Although the id can be set in the `$new` function, it can also be set using the `id` method.

```js
// $new
$new('#foo').element();

// .id
$new().id('foo').element();
```

## Adding several new elements to an existing element

If you need to add multiple elements to an existing element directly, you can do so with the `$frag` method. (For instance, if you're filling in a list `ul` element that is already in the page.)

```js
// $frag
list.appendChild($frag(
    $new('li').text('Item #1'),
    $new('li').text('Item #2'),
    $new('li').text('Item #3')
));

// Without $frag
list.appendChild($new('li').text('Item #1').element());
list.appendChild($new('li').text('Item #2').element());
list.appendChild($new('li').text('Item #3').element());
```

> The `$frag` method returns a [document fragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment). It can take any number of parameters (including zero) and will automatically call `.element()` on its parameters if needed.

## Blueprints are reusable

Every blueprint you make returns an object that can be reused. This means you can make multiple DOM elements from the same blueprint!

```js
// Create a blueprint
var cardBlueprint = $new('.card').text('This is a card');

document.body.appendChild(cardBlueprint.element());
document.body.appendChild(cardBlueprint.element());
document.body.appendChild(cardBlueprint.element());
```

If you want to allow each generated element to be different, you might be tempted to do the following:

```js
// This is dangerous and could introduce bugs to your code! Try out this example to see what strange side-effects you get
var cardBlueprint = $new('.card');

cardBlueprint.text('This is a card.');
document.body.appendChild(cardBlueprint.element());

cardBlueprint.text('This is a second card!');
document.body.appendChild(cardBlueprint.element());

cardBlueprint.text('Three cards?!');
document.body.appendChild(cardBlueprint.element());
```

The issue with the above is that each call to `text()` modifies the actual blueprint object. In this case, `text()` appends an additional text DOM child each time it's called, with the third and final card having the text "This is a card.This is a second card!Three cards?!" contained within it.

### Using `prepare()` to dynamically change the generated DOM element

What we can do instead is create a slightly different version of this code, using `prepare()`. This method takes a callback function as its sole argument, which then allows you to modify each "instance" of the blueprint without introducing side-effects to the other elements.

Here's how we could rewrite the above snippet using prepare:

```js
// This is dangerous and could introduce bugs to your code! Try out this example to see what strange side-effects you get
var cardBlueprint = $new('.card').prepare(function($this, props) {
	$this.text(props.cardText);
	return $this;
});

document.body.appendChild(cardBlueprint.element({
	cardText: 'This is a card.'
}));

cardBlueprint.text();
document.body.appendChild(cardBlueprint.element({
	cardText: 'This is a second card!'
}));

cardBlueprint.text();
document.body.appendChild(cardBlueprint.element({
	cardText: 'Three cards?!'
}));
```

When using this advanced feature, the basic rule of thumb is to directly modify your blueprint if you want that change to apply to all of the elements you plan on creating, and to use `prepare()` for anything that is dynamic between elements.
