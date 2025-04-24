// modal.ts

class Modal {
    private modals: NodeListOf<HTMLElement>;
    private openButtons: NodeListOf<HTMLElement>;
    private closeButtons: NodeListOf<HTMLElement>;

    constructor() {
        this.modals = document.querySelectorAll('.modal');
        this.openButtons = document.querySelectorAll('.open-modal');
        this.closeButtons = document.querySelectorAll('.close-modal');

        // Инициализация
        this._init();
    }

    private _init(): void {
        // Открытие модалки по кнопке
        this.openButtons.forEach((button: HTMLElement) => {
            button.addEventListener('click', (e: Event) => {
                const modalId = (button as HTMLElement).getAttribute('data-modal');
                if (modalId) {
                    this.open(modalId);
                }
            });
        });

        // Закрытие модалки по кнопке-крестику
        this.closeButtons.forEach((button: HTMLElement) => {
            button.addEventListener('click', () => {
                this.close();
            });
        });

        // Закрытие модалки по клику вне нее
        this.modals.forEach((modal: HTMLElement) => {
            modal.addEventListener('click', (e: MouseEvent) => {
                if (e.target === modal) {
                    this.close();
                }
            });
        });

        // Закрытие модалки по нажатию клавиши Escape
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }

    // Открытие модалки по ID
    public open(modalId: string): void {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
        }
    }

    // Закрытие всех модалок
    public close(): void {
        this.modals.forEach((modal: HTMLElement) => {
            modal.classList.remove('show');
        });
    }
}

// Экспортируем модалку для использования в других частях приложения
export const modal = new Modal();


