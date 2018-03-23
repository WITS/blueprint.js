document.addEventListener("DOMContentLoaded", function() {
	document.body.appendChild($new('ul.foo[bar="baz"]').children(
		$new('li').text("Hello world"),
		$new('li').text("How's it hanging?")
	).element());

	document.body.appendChild($new("[title='Testing Spaces'] a[href=https://google.com][text=Google]").text(' or Test this yo').element());
});