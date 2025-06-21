import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ToastService } from '../Toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuardService {

  constructor(private _router: Router, private toastService: ToastService) { }
  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    //check condition
    const user = sessionStorage.getItem("user");
    if (user != null) {
      const parsed = JSON.parse(user);
      if (parsed.role == "Admin") {
        this.toastService.showError("You are not allowed to view to page!");
        this._router.navigate(['/admin']);
        return false;
      }
    }

    return true;
  }
}
