document.addEventListener("DOMContentLoaded", function() {
	document.body.appendChild($frag(
		$new('h1')
			.text('Add multiple elements easily')
			.style('text-transform', 'capitalize'),
		$new('p')
			.text('By using the $frag function.')
	));

	document.body.appendChild($new('ul.foo[bar="baz"]')
		.style({
			margin: '8px 8px 16px',
			display: 'inline-block',
			padding: '16px',
			borderRadius: '2px',
			boxShadow: '0 1px 8px 0 rgba(0, 0, 0, 0.31)',
			listStyle: 'none'
		})
		.children(
			$new('li').text("Create lists"),
			$new('li').text("And style them"),
			$new('li').children(
				'Or create ',
				$new('a').text('links')
					.attr({
						href: 'https://google.com',
						target: '_blank'
					})
			),
			$new('li').text('Write readable code, rapidly')
		)
		.element()
	);
});