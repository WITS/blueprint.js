document.addEventListener("DOMContentLoaded", () => {
	document.body.append($new('ul.foo[bar="baz"]').children(
		$new('li').text("Hello world"),
		$new('li').text("How's it hanging?")
	).element());
});