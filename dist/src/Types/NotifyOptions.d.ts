export type NotifyOptions = {
    element?: string;
    type?: string;
    allow_dismiss?: boolean;
    allow_duplicates?: boolean;
    newest_on_top?: boolean;
    showProgressbar: boolean;
    placement?: {
        from: string;
        align: string;
    };
    delay?: number;
    timer: number;
    mouse_over?: string;
    animate: {
        enter: string;
        exit: string;
    };
    onShow?: (() => void) | null;
    onShown?: (() => void) | null;
    onClose?: (() => void) | null;
    onClosed?: (() => void) | null;
    onClick?: (() => void) | null;
    icon_type?: string;
    template?: string;
    offset?: {
        x: number;
        y: number;
    } | number;
    content?: {
        message: string;
        title?: string;
        icon?: string;
    };
};
