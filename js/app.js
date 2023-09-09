document.addEventListener("DOMContentLoaded", function () {
	// Because it makes beautiful source code!
	$('.pre-container').each(function() {
		var dataType = $(this).data('type'),
			dataRun = ($(this).data('run') === true ? true : false),
			code = $(this).text().replace(/\n/, '').replace(/\t\t\t\t/g, '').replace(/^\s+|\s+$/g, '');
		$(this).html('<pre data-run="'+dataRun+'"><code class="'+dataType.toLowerCase()+'"></code></pre>');
		$(this).find('code').text(code);
	});

    // Add line numbers since Highlight.js does not include them.
    $('.pre-container').each(function () {
        if ($(this).find('pre').data('run') === true) {
            $(this).append('<a class="btn btn-primary m-2" href="#run-sample">Generate Notify!</a>');
        }
    });


	$('pre code').each(function(i, block) {
		hljs.highlightBlock(block);
	});

	$('a[href="#run-sample"]').on('click', function(event) {
		event.preventDefault();
		var code = $(this).prev('pre').find('code');

		eval(code.text());
	});

    // Scroll top button
    var scrollToTopBtn = document.querySelector(".btn-scroll"), rootElement = document.documentElement;

    function handleScroll() {
        const scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;
        if ((rootElement.scrollTop / scrollTotal) > 0.15) {
            // Show button
            scrollToTopBtn.classList.add("show-btn-scroll");
        } else {
            // Hide button
            scrollToTopBtn.classList.remove("show-btn-scroll");
        }
    }

    function scrollToTop(e) {
        e.preventDefault();

        // Scroll to top logic
        rootElement.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    scrollToTopBtn.addEventListener("click", scrollToTop);
    document.addEventListener("scroll", handleScroll);

	$('form[action="#GenerateNotify"]').submit(function (event) {
		event.preventDefault();

		const position = document.querySelector('input[name="position"]:checked').id;

		var notify = new Notify({
			icon: $('[data-notify="icon"]').html(),
			title: $('[data-notify="title"]').html(),
			message: $('[data-notify="message"]').html()
		},{
			type: $('input[name="type"]:checked').val(),
			allow_dismiss: $('#demo-allow-dismiss').is(':checked'),
			newest_on_top: $('#demo-newest-on-top').is(':checked'),
			placement: {
				from: position.split("-")[0],
				align: position.split("-")[1]
			},
			delay: $('#demo-delay').val(),
			mouse_over: ($('#demo-pause-on-hover').is(':checked') ? "pause" : null)
		});
		return false;
	});
});