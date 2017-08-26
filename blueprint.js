/*
	Blueprint.js - a simple, small DOM templating library
	Version 0.1
	Copyright (c) 2017 Ian Jones
*/


// Blueprint Element Template
$Element = function() {
	this.classList = new Array();
	this.childNodes = new Array();
	this.eventListeners = new Object();
	this.attributes = new Object();
}

$Element.prototype.tagName = 'DIV';

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
	this.attributes[key] = value;
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
		res.attributes.push(this.attributes[k]);
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
	// Return the copy
	return res;
}

$Element.prototype.create =
$Element.prototype.element = function() {
	// Create the element
	var res = document.createElement(this.tagName);
	// Set the classes
	if (this.classList.length !== 0) {
		res.className = this.classList.join(' ');
	}
	// Set the attributes
	for (var k in this.attributes) {
		res.setAttribute(k, this.attributes[k]);
	}
	// Set the event listeners
	for (var type in this.eventListeners) {
		var callbacks = this.eventListeners[type];
		for (var x = 0, y = callbacks.length; x < y; ++ x) {
			res.addEventListener(type, callbacks[x]);
		}
	}
	// Append the child nodes
	for (var x = 0, y = this.childNodes.length; x < y; ++ x) {
		var child = this.childNodes[x];
		if (typeof child === 'string') {
			// Append the text node
			res.appendChild(document.createTextNode(child));
		} else {
			// Append the child element
			res.appendChild(child.element());
		}
	}
	// Return the result
	return res;
}

function $new(sel) {
	sel = sel.trim();
	var index = sel.indexOf(' ');
	var child = null;
	if (index !== -1) {
		child = $new(sel.substr(index + 1));
		sel = sel.substr(0, index);
	}
	var tokens = sel.split(/([.\[=\]])/g);
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
			if (next === '.' || next === '[' || next === ']' ||
				next === '=') {
				console.error('Invalid selector: %s', sel);
				return null;
			}
			res.class(next);
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
				}
			}
			res.attr(k, v);
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