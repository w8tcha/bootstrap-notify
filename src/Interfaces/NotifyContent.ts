/*
* Project: Bootstrap Notify = v4.0.0
* Description: Turns standard Bootstrap toasts into "Growl-like" notifications.
* Author: Mouse0270 aka Robert McIntosh
* Fork by w8tcha
* License: MIT License
* Website: https://github.com/w8tcha/bootstrap-growl
*/
export default interface NotifyContent {
	message: string;
	title?: string;
	icon?: string;
}