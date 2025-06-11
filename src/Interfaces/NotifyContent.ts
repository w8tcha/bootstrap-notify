/*
* Project: Bootstrap Notify
* Description: Turns standard Bootstrap toasts into "Growl-like" notifications.
* Author: Mouse0270 aka Robert McIntosh
* Fork by w8tcha
* License: MIT License
* Website: https://w8tcha.github.io/bootstrap-notify/
*/
export default interface NotifyContent {
	message: string;
	title?: string;
	icon?: string;
}