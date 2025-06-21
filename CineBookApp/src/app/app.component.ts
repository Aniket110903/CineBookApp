import { Component } from '@angular/core';
import { ToastService } from './services/Toast/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'CineBookApp';
  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.toastService.initToastElement('appToast');
  }
}
