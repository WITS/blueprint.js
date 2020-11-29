/*
MIT License

Copyright (c) 2018 Ian B Jones

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*
	Blueprint.js - a simple, small DOM templating library
	Version 0.2.1
	Copyright (c) 2017 Ian Jones
*/


// Blueprint Element Template
$Element = function() {
	// Built-in Functionality
	this.classList = new Array();
	this.childNodes = new Array();
	this.eventListeners = new Object();
	this.attributes = new Object();
	this.styleData = new Object();
	// For Extensibility
	this.callbacks = new Array();
	this.data = new Object();
}

$Element.prototype.tagName = 'DIV';
$Element.prototype.name = '';

$Element.prototype.class =
$Element.prototype.classes = function(str) {
	var classes;
	// If the classes were provided as an Array, use that
	if (str instanceof Array) {
		classes = str;
	} else {
		// If multiple classes were provided, split them out
		classes = str.split(' ');
	}
	for (var x = 0, y = classes.length; x < y; ++ x) {
		// Get this class, trimmed of any remaining whitespace
		var c = classes[x].trim();
		// If this is an empty class, skip it
		if (c.length === 0) continue;
		// If this class has already been added, skip it
		if (this.classList.indexOf(c) !== -1) continue;
		// Add the class
		this.classList.push(c);
	}
	// Return this template, for chaining methods
	return this;
}

$Element.prototype.attr =
$Element.prototype.attribute = function(key, value) {
	// JSON
	if (arguments.length === 1 && key instanceof Object) {
		for (var k in key) {
			this.attributes[k] = key[k];
		}
	} else {
		this.attributes[key] = value;
	}
	// Return this, for chaining methods
	return this;
}

$Element.prototype.style = function(key, value) {
	// JSON
	if (arguments.length === 1 && key instanceof Object) {
		for (var k in key) {
			this.styleData[
				k.replace(/-(\w?)/g, function(match, p1) {
					return p1.toUpperCase();
				})
			] = key[k];
		}
	} else {
		this.styleData[
			key.replace(/-(\w?)/g, function(match, p1) {
				return p1.toUpperCase();
			})
		] = value;
	}
	// Return this, for chaining methods
	return this;
}

$Element.prototype.id = function(id) {
	this.attr('id', id);
	// Return this, for chaining methods
	return this;
}

$Element.prototype.name = function(name) {
	this.name = name;
	// Return this, for chaining methods
	return this;
}

$Element.prototype.on = function(type, callback) {
	// Attempt to get the list of callbacks for this type
	var callbacks = this.eventListeners[type];
	// If no other callbacks for this type exist yet
	if (callbacks == null) {
		// Create the list of callbacks for this type
		callbacks = this.eventListeners[type] = new Array();
	}
	// Add to the list of callbacks
	callbacks.push(callback);
	// Return this, for chaining methods
	return this;
}

$Element.prototype.init = function(callback) {
	// Add to the list of callbacks
	this.callbacks.push(callback);
	// Return this, for chaining methods
	return this;
}

$Element.prototype.text = function(str) {
	// Append & return this, for chaining methods
	return this.append(str == null ? '' : str.toString());
}

$Element.prototype.append =
$Element.prototype.child =
$Element.prototype.children = function(child) {
	// If more than one child was provided, via arguments
	if (arguments.length > 1) {
		// Loop through them in order
		for (var x = 0, y = arguments.length; x < y; ++ x) {
			// And add each one
			this.append(arguments[x]);
		}
		// Return this, for chaining methods
		return this;
	}
	// If more than one child was provided, via an array
	if (child instanceof Array) {
		// Loop through them in order
		for (var x = 0, y = child.length; x < y; ++ x) {
			// And add each one
			this.append(child[x]);
		}
		// Return this, for chaining methods
		return this;
	}
	// Add the single child to the list
	this.childNodes.push(child);
	// Return this, for chaining methods
	return this;
}

$Element.prototype.clone =
$Element.prototype.copy = function() {
	var res = new $Element();
	/// Copy simple properties
	res.tagName = this.tagName;
	/// Copy complex objects
	for (var x = 0, y = this.classList.length; x < y; ++ x) {
		res.classList.push(this.classList[x]);
	}
	for (var k in this.attributes) {
		res.attributes[k] = this.attributes[k];
	}
	for (var type in this.eventListeners) {
		var src = this.eventListeners[type];
		var dest = res.eventListeners[type] = new Array();
		for (var x = 0, y = src.length; x < y; ++ x) {
			dest.push(src[x]);
		}
	}
	for (var x = 0, y = this.childNodes.length; x < y; ++ x) {
		var child = this.childNodes[x];
		if (typeof child === 'string') {
			res.childNodes.push(child);
		} else {
			res.childNodes.push(child.clone());
		}
	}
	res.data = Object.assign({}, this.data);
	// Return the copy
	return res;
}

$Element.prototype.prepare = function(callback) {
	this.data.prepare = callback;
	return this;
}

$Element.prototype.create =
$Element.prototype.element = function(props) {
	if (this.data.prepare !== undefined) {
		return this.data.prepare(this.copy(), props)._createElement();
	}
	return this._createElement();
}

$Element.prototype._createElement = function() {
	// Create the element
	var $this = document.createElement(this.tagName);
	// Set the classes
	if (this.classList.length !== 0) {
		$this.className = this.classList.join(' ');
	}
	// Set the attributes
	for (var k in this.attributes) {
		$this.setAttribute(k, this.attributes[k]);
	}
	// Set style
	for (var k in this.styleData) {
		$this.style[k] = this.styleData[k];
	}
	// Set the event listeners
	for (var type in this.eventListeners) {
		var callbacks = this.eventListeners[type];
		for (var x = 0, y = callbacks.length; x < y; ++ x) {
			$this.addEventListener(type, callbacks[x]);
		}
	}
	// Append the child nodes
	$this.$child = {};
	for (var x = 0, y = this.childNodes.length; x < y; ++ x) {
		var child = this.childNodes[x];
		if (typeof child === 'string') {
			// Append the text node
			$this.appendChild(document.createTextNode(child));
		} else if (child.element) {
			// Append the child $Element
			if (child.name) {
				$this.appendChild($this.$child[child.name] = child.element());
			} else {
				$this.appendChild(child.element());
			}
		} else {
			// Append the child Element
			$this.appendChild(child);
		}
	}
	// Execute custom code
	for (var x = 0, y = this.callbacks.length; x < y; ++ x) {
		this.callbacks[x]($this, this);
	}
	// Return the ressult
	return $this;
}

function $new(sel) {
	if (sel == null) sel = '';
	sel = sel.trim();
	var tokens = sel.split(/([.#\[=\] ])/g);
	var child = null;
	var res = new $Element();
	for (var x = 0, y = tokens.length; x < y; ++ x) {
		var token = tokens[x];
		// If the token is empty, skip it
		if (token === '') continue;
		// If the token is a class operator
		if (token === '.') {
			// Check the immediate next token
			if (x + 1 >= y) {
				console.error('Invalid selector: %s', sel);
				return null;
			}
			var next = tokens[x + 1];
			if (next === '.' || next === '#' || next === '[' ||
				next === ']' || next === '=') {
				console.error('Invalid selector: %s', sel);
				return null;
			}
			res.class(next);
			++ x;
		} else if (token === '#') {
			// If the token is an id operator,
			// Check the immediate next token
			if (x + 1 >= y) {
				console.error('Invalid selector: %s', sel);
				return null;
			}
			var next = tokens[x + 1];
			if (next === '.' || next === '#' || next === '[' ||
				next === ']' || next === '=') {
				console.error('Invalid selector: %s', sel);
				return null;
			}
			res.attr('id', next);
			++ x;
		} else if (token === '[') {
			// If the token is an attribute operator
			var k = null, v = null;
			for (var w = x + 1; w < y; ++ w) {
				var t = tokens[w];
				if (t === '=') {
					// If there was no key, stop here
					if (w === x + 1) {
						console.error('Invalid selector: %s', sel);
						return null;
					}
					// We have the key
					if (k === null) {
						k = tokens.slice(x + 1, w).join('');
						x = w;
					}
				} else if (t === ']') {
					// If there was no value, stop here
					if (w === x + 1) {
						console.error('Invalid selector: %s', sel);
						return null;
					}
					// If we never got the key
					if (k === null) {
						// This is invalid
						console.error('Invalid selector: %s', sel);
						return null;
					}
					// We have the value
					v = tokens.slice(x + 1, w).join('');
					if ((v[0] === '"' && v[v.length - 1] === '"') ||
						(v[0] === "'" && v[v.length - 1] === "'")) {
						v = v.substr(1, v.length - 2);
					}
					x = w;
					break;
				}
			}
			// Special Case: text attribute
			if (k === 'text') {
				// Set the text of this element
				res.text(v);
			} else {
				// Set the attribute
				res.attr(k, v);
			}
		} else if (token === ' ') {
			if (x + 1 < tokens.length) {
				child = $new(tokens.slice(x + 1).join(''));
			}
			break;
		} else {
			// The token is a tag
			res.tagName = token;
		}
	}
	// If there is a child, append it
	if (child !== null) res.append(child);
	// Return the template
	return res;
}

function $frag() {
	var res = document.createDocumentFragment();
	for (var x = 0, y = arguments.length; x < y; ++ x) {
		var arg = arguments[x];
		if (arg instanceof $Element) {
			res.appendChild(arg.element());
		} else {
			res.appendChild(arg);
		}
	}
	return res;
}
