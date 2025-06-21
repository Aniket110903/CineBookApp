import { Component } from '@angular/core';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent {
  admin: boolean = false;

  ngOnInit() {
    const storage = sessionStorage.getItem("user");
    if (storage != null) {
      const parse = JSON.parse(storage);
      if (parse.role == "Admin") {
        this.admin = true;
      }
    }
  }
}
