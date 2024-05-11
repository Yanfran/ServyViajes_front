import { Component, Input } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-role-based-visibility',
  standalone   : true,
  imports      : [NgIf, NgFor, NgClass],
  template: `<ng-container *ngIf="checkRole()"><ng-content></ng-content></ng-container>`,
  styleUrls: ['./role-based-visibility.component.scss']
})
export class RoleBasedVisibilityComponent {

  userRole: string;

  @Input() allowedRoles: string[]; // Array de roles permitidos

  constructor(private authService: AuthService) {}

  checkRole(): boolean {
    const userRole = this.authService.getUserRole(); 
    return this.allowedRoles.includes(userRole);
  }

}
