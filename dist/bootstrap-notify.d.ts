import { default as NotifyContent } from './Interfaces/NotifyContent.ts';
import { NotifyOptions } from './Types/NotifyOptions';
export default class Notify {
    $ele: HTMLElement;
    settings: NotifyOptions;
    _defaults: NotifyOptions;
    animations: {
        start: string;
        end: string;
    };
    notify?: {
        $ele: HTMLElement;
        close: () => void;
    };
    constructor(content: string | NotifyContent, options?: Partial<NotifyOptions>);
    isDuplicateNotification(notification: Notify): boolean;
    init(): void;
    update(command: string | Record<string, string>, update?: string): void;
    buildNotify(): void;
    setIcon(): void;
    placement(): void;
    bind(): void;
    close(): void;
    formatTemplate(...args: any[]): string;
}
