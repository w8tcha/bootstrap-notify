/*
* Project: Bootstrap Notify = v4.0.0
* Description: Turns standard Bootstrap toasts into "Growl-like" notifications.
* Author: Mouse0270 aka Robert McIntosh
* Fork by w8tcha
* License: MIT License
* Website: https://github.com/w8tcha/bootstrap-growl
*/

import * as bootstrap from 'bootstrap';
import NotifyContent from './Interfaces/NotifyContent.ts';
import { NotifyOptions } from './Types/NotifyOptions';

export default class Notify {
	$ele: HTMLElement = document.createElement('div');
	settings: NotifyOptions;
	_defaults: NotifyOptions;
	animations: { start: string; end: string };
	notify?: { $ele: HTMLElement; close: () => void };

	constructor(content: string | NotifyContent,
		options?: Partial<NotifyOptions>) {

		// Create the defaults once
		const defaults: NotifyOptions = {
			element: 'body',
			type: 'info',
			allow_dismiss: true,
			allow_duplicates: true,
			newest_on_top: true,
			showProgressbar: false,
			placement: { from: 'top', align: 'right' },
			delay: 5000,
			timer: 1000,
			mouse_over: 'pause',
			animate: { enter: 'animated fadeInDown', exit: 'animated fadeOutUp' },
			onShow: undefined,
			onShown: null,
			onClose: undefined,
			onClosed: null,
			onClick: null,
			icon_type: 'class',
			offset: { x: 0, y: 0 },
			template: [
				'<div data-notify="container" class="toast fade m-3" role="alert" aria-live="assertive" aria-atomic="true">',
				'<div class="toast-header">',
				'<span data-notify="icon" class="me-2 text-{0}"></span>',
				'<strong class="me-auto fw-bold" data-notify="title">{1}</strong>',
				'<button type="button" class="ms-2 mb-1 btn-close" data-bs-dismiss="toast" data-notify="dismiss" aria-label="Close">',
				'</button>',
				'</div>',
				'<div class="toast-body" data-notify="message">',
				'{2}',
				'<div class="progress" role="progressbar" data-notify="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">',
				'<div class="progress-bar bg-{0}" style="width: 0%;"></div>',
				'</div>',
				'</div>'
			].join('')
		};

		this.settings = defaults;

		// Setup Content of Notify
		const contentObj = {
			content: {
				message: typeof content === 'object' ? content.message : content,
				title: typeof content === 'object' && content.title ? content.title : '',
				icon: typeof content === 'object' && content.icon ? content.icon : ''
			}
		};

		options = extend({}, contentObj, options);
		this.settings = extend({}, defaults, options);
		this._defaults = defaults;

		this.animations = {
			start: 'webkitAnimationStart oanimationstart MSAnimationStart animationstart',
			end: 'webkitAnimationEnd oanimationend MSAnimationEnd animationend'
		};

		if (typeof this.settings.offset === 'number') {
			this.settings.offset = { x: this.settings.offset, y: this.settings.offset };
		}

		//if duplicate messages are not allowed, then only continue if this new message is not a duplicate of one that it already showing
		if (this.settings.allow_duplicates ||
			(!this.settings.allow_duplicates && !this.isDuplicateNotification(this))) {
			this.init();
		}
	}

	isDuplicateNotification(notification: Notify): boolean {
		let isDupe = false;

		document.querySelectorAll('[data-notify="container"]').forEach((container) => {
			const title = container.querySelector('[data-notify="title"]')?.innerHTML.trim() ?? '';
			const message = container.querySelector('[data-notify="message"]')?.innerHTML.trim() ?? '';

			// The input string might be different than the actual parsed HTML string!
			// (<br> vs <br /> for example)
			// So we have to force-parse this as HTML here!
			const isSameTitle = title === notification.settings.content?.title?.trim();
			const isSameMsg = message === notification.settings.content?.message?.trim();

			if (isSameTitle && isSameMsg) {
				// we found the dupe. Set the var and stop checking.
				isDupe = true;
			}
			return !isDupe;
		});

		return isDupe;
	}

	init(): void {
		var self = this;
		this.buildNotify();
		if (this.settings.content && this.settings.content.icon) {
			this.setIcon();
		}
		this.placement();
		this.bind();

		this.notify = {
			$ele: this.$ele,
			close() {
				self.close();
			}
		};
	}

	update(command: string | Record<string, string>, update ?: string): void {
		const commands = typeof command === 'string' ? { [command]: update } : command;

		for (const cmd in commands) {
			const element = this.$ele.querySelector<HTMLElement>(`[data-notify="${cmd}"]`);
			if (element) {
				element.innerHTML = commands[cmd] as string;
			}
		}
	}

	buildNotify(): void {
		const content = this.settings.content;

		const div = document.createElement('div');

		div.innerHTML = this.formatTemplate(this.settings.template!,
			this.settings.type,
			content!.title,
			content!.message);

		this.$ele = div.firstChild as HTMLElement;
		this.$ele.dataset.notifyPosition = `${this.settings.placement!.from}-${this.settings.placement!.align}`;
		this.$ele.dataset.bsDelay = this.settings.delay!.toString();

		if (!this.settings.allow_dismiss) {
			const dismissElement = this.$ele.querySelector<HTMLElement>('[data-notify="dismiss"]');
			if (dismissElement) dismissElement.style.display = 'none';
		}

		if ((this.settings.delay! <= 0 && !this.settings.showProgressbar) || !this.settings.showProgressbar) {
			if (this.$ele.querySelector('[data-notify="progressbar"]')) {
				this.$ele.querySelector('[data-notify="progressbar"]')!.remove();
			}
		}
	}

	setIcon(): void {
		if (this.settings.icon_type && this.settings.icon_type.toLowerCase() === 'class') {
			this.$ele.querySelector('[data-notify="icon"]')!.className += ` ${this.settings.content!.icon}`;
		} else {
			if (this.$ele.querySelector('[data-notify="icon"]')!.nodeName === 'IMG') {
				const image = this.$ele.querySelector<HTMLImageElement>('[data-notify="icon"]')!;

				image.src = this.settings.content!.icon!;
				image.className = 'me-2';

			} else {
				const image = document.createElement('img');

				image.src = `${this.settings.content!.icon!}`;
				image.alt = 'Notify Icon';
				image.className = 'me-2';

				this.$ele.querySelector('[data-notify="icon"]')!.append(image);
			}
		}
	}

	placement(): void {
		const self = this;

		this.$ele.className += ` ${this.settings.animate.enter}`;

		const toast = new bootstrap.Toast(this.$ele);

		toast.show();

		/*const pre = ['webkit-', 'moz-', 'o-', 'ms-', ''];

		pre.forEach((prefix) => {
			self.cssText += prefix + 'AnimationIterationCount: ' + 1;
		});*/

		// Create Wrapper Container
		if (document.querySelector('.toast-container') == null) {
			const container = document.createElement('div');

			container.className = 'toast-container position-fixed';

			switch (this.settings.placement!.from) {
			case 'top':
				container.className += ' top-0';
				break;
			case 'bottom':
				container.className += ' bottom-0';
				break;
			}

			switch (this.settings.placement!.align) {
			case 'left':
				container.className += ' start-0';
				break;
			case 'right':
				container.className += ' end-0';
				break;
			case 'center':
				container.className += ' start-50 translate-middle-x';
				break;
			}

			document.querySelector(this.settings.element!)!.append(container);
		}

		const toastContainer = document.querySelector<HTMLElement>('.toast-container');

		if (toastContainer) {
			if (this.settings.newest_on_top) {
				toastContainer.prepend(this.$ele);
			} else {
				toastContainer.append(this.$ele);
			}
		}

		if (typeof self.settings.onShow === 'function') {
			self.settings.onShow.call(this.$ele);
		}
	}

	bind(): void {
		var self = this;

		const dismiss = this.$ele.querySelector<HTMLElement>('[data-notify="dismiss"]');

		if (dismiss) {
			dismiss.addEventListener('click', () => {
				self.close();
			});
		}

		if (self.settings.onClick) {
			this.$ele.addEventListener('click',
				(event) => {
					if (event.target !== self.$ele.querySelector('[data-notify="dismiss"]')) {
						self.settings.onClick!.call(this);
					}
				});
		}

		this.$ele.addEventListener('mouseover', () => {
			this.$ele.dataset.hover = 'true';
		});


		this.$ele.addEventListener('mouseout', () => {
			this.$ele.dataset.hover = 'false';
		});

		this.$ele.dataset.hover = 'false';

		if (this.settings.delay && this.settings.delay > 0) {
			self.$ele.dataset.notifyDelay = self.settings.delay!.toString();

			var timer = setInterval(() => {
					const delay = parseInt(this.$ele.dataset.notifyDelay!) - this.settings.timer!;
					if ((this.$ele.dataset.hover === 'false' && this.settings.mouse_over === 'pause') ||
						this.settings.mouse_over !== 'pause') {
						const percent = ((this.settings.delay! - delay) / this.settings.delay!) * 100;
						this.$ele.dataset.notifyDelay = delay.toString();

						if (this.settings.showProgressbar) {

							const div = this.$ele.querySelector<HTMLElement>('[data-notify="progressbar"] > div')!;

							this.$ele.querySelector('[data-notify="progressbar"]')!.setAttribute('aria-valuenow', percent.toString());

							div.style.width = percent + '%';
						}
					}
					if (delay <= -(this.settings.timer)) {
						clearInterval(timer);
						this.close();
					}
				},
				self.settings.timer);
		}
	}

	close(): void {
		const self = this;

		this.$ele.dataset.closing = 'true';

		this.$ele.className = `toast ${this.settings.animate.exit}`;

		if (self.settings.onClose) {
			self.settings.onClose.call(this.$ele);
		}

		self.$ele.remove();
	}


	formatTemplate(...args: any[]): string {
		const string: string = args[0];
		return string.replace(/(\{\{\d\}\}|\{\d\})/g,
			(str: string) => {
				if (str.substring(0, 2) === '{{') return str;
				const num = parseInt(str.match(/\d/)![0]);
				return args[num + 1];
			});
	};
}

// Pass in the objects to merge as arguments.
// For a deep extend, set the first argument to `true`.
function extend(...args: any[]): any {
	// Variables
	const extended: Record<string, any> = {};
	let deep = false;
	let i = 0;
	const length = args.length;

	// Check if a deep merge
	if (Object.prototype.toString.call(args[0]) === '[object Boolean]') {
		deep = args[0];
		i++;
	}

	// Merge the object into the extended object
	const merge = (obj: Record<string, any>): void => {
		for (const prop in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, prop)) {
				// If deep merge and property is an object, merge properties
				if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
					extended[prop] = extend(true, extended[prop], obj[prop]);
				} else {
					extended[prop] = obj[prop];
				}
			}
		}
	};

	// Loop through each object and conduct a merge
	for (; i < length; i++) {
		const obj = args[i];
		merge(obj);
	}

	return extended;
}