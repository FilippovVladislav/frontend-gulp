class Modal {
    private modals: NodeListOf<HTMLElement>;
    private openButtons: NodeListOf<HTMLElement>;
    private closeButtons: NodeListOf<HTMLElement>;
    private closeButtons2: NodeListOf<HTMLElement>;

    constructor() {
        this.modals = document.querySelectorAll('.modal');
        this.openButtons = document.querySelectorAll('.open-modal');
        this.closeButtons = document.querySelectorAll('.close-modal');
        this.closeButtons2 = document.querySelectorAll('.close-modal-button');

        this._init();
    }

    private _init(): void {
        // Обработка кнопок открытия модалок
        this.openButtons.forEach((button: HTMLElement) => {
            button.addEventListener('click', (e: Event) => {
                const modalId = (button as HTMLElement).getAttribute('data-modal');
                if (modalId) {
                    // Если кнопка находится внутри модалки, закрыть текущую
                    const currentModal = (button.closest('.modal') as HTMLElement);
                    if (currentModal && currentModal.classList.contains('show')) {
                        this.close();
                    }

                    // Немного подождать, чтобы избежать конфликта с анимациями
                    setTimeout(() => {
                        this.open(modalId);
                    }, 10);
                }
            });
        });

        // Закрытие модалки по кнопке-крестику
        this.closeButtons.forEach((button: HTMLElement) => {
            button.addEventListener('click', () => {
                this.close();
            });
        });

        this.closeButtons2.forEach((button: HTMLElement) => {
            button.addEventListener('click', () => {
                this.close();
            });
        });

        // Закрытие при клике вне содержимого
        this.modals.forEach((modal: HTMLElement) => {
            modal.addEventListener('click', (e: MouseEvent) => {
                if (e.target === modal) {
                    this.close();
                }
            });
        });

        // Закрытие по клавише Escape
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }

    public open(modalId: string): void {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
        }
    }

    public close(): void {
        this.modals.forEach((modal: HTMLElement) => {
            modal.classList.remove('show');
        });
    }
}

export const modal = new Modal();
