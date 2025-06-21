import { Injectable } from '@angular/core';
declare var bootstrap: any;
@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }
  private toastElement: HTMLElement | null = null;

  initToastElement(elementId: string): void {
    this.toastElement = document.getElementById(elementId);
  }

  showSuccess(message: string): void {
    this.showToast(message, 'bg-success');
  }

  showError(message: string): void {
    this.showToast(message, 'bg-danger');
  }

  private showToast(message: string, cssClass: string): void {
    if (!this.toastElement) return;

    const toastBody = this.toastElement.querySelector('.toast-body');
    const toast = new bootstrap.Toast(this.toastElement, { delay: 2000 });

    this.toastElement.classList.remove('bg-success', 'bg-danger');
    this.toastElement.classList.add(cssClass);

    if (toastBody) toastBody.textContent = message;

    toast.show();
  }
}
