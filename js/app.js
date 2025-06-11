document.addEventListener('DOMContentLoaded', function () {
	document.querySelectorAll('.pre-container').forEach(container => {
		var dataType = container.dataset.type,
			dataRun = (container.dataset.run === 'true' ? true : false),
			code = container.textContent.replace(/\n/, '').replace(/\t\t\t\t/g, '').replace(/^\s+|\s+$/g, '');
		container.innerHTML = `<pre data-run="${dataRun}"><code class="${dataType.toLowerCase()}"></code></pre>`;
		container.querySelector('code').textContent = code;
	});
	

	// Add line numbers since Highlight.js does not include them.
	document.querySelectorAll('.pre-container').forEach(container => {
		if (container.querySelector('pre').dataset.run === 'true') {
			const button = document.createElement("a");
			button.classList.add('btn', 'btn-primary', 'm-2');
			button.href = '#run-sample';
			button.innerText = 'Generate Notify!';
			container.append(button);
		}
	});

	hljs.highlightAll();

	document.querySelectorAll('.pre-container').forEach(link => {
		link.addEventListener('click', (event) => {
			event.preventDefault();
			const code = event.currentTarget.querySelector('code');

			eval(code.innerText);
		});
	});


    // Scroll top button
	var scrollToTopBtn = document.querySelector('.btn-scroll'), rootElement = document.documentElement;

    function handleScroll() {
        const scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;
        if ((rootElement.scrollTop / scrollTotal) > 0.15) {
            // Show button
            scrollToTopBtn.classList.add('show-btn-scroll');
        } else {
            // Hide button
            scrollToTopBtn.classList.remove('show-btn-scroll');
        }
    }

    function scrollToTop(e) {
        e.preventDefault();

        // Scroll to top logic
        rootElement.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    scrollToTopBtn.addEventListener('click', scrollToTop);
    document.addEventListener('scroll', handleScroll);

	document.querySelector('form[action="#GenerateNotify"]').addEventListener('submit', (event) => {
		event.preventDefault();

		const position = document.querySelector('input[name="position"]:checked').id;

		const notify = new Notify({
			icon: document.querySelector('[data-notify="icon"]').innerHTML,
			title: document.querySelector('[data-notify="title"]').innerHTML,
			message: document.querySelector('[data-notify="message"]').innerHTML
		},{
			type: document.querySelector('input[name="type"]:checked').value,
			allow_dismiss: document.querySelector('#demo-allow-dismiss').checked,
			newest_on_top: document.querySelector('#demo-newest-on-top').checked,
			placement: {
				from: position.split('-')[0],
				align: position.split('-')[1]
			},
			delay: document.querySelector('#demo-delay').value,
			mouse_over: (document.querySelector('#demo-pause-on-hover').checked ? 'pause' : null)
		});
		return false;
	});
});