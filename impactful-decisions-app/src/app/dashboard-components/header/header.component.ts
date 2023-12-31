import { Component, OnInit } from '@angular/core';
import { faBell, faHouse, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { FormService } from 'src/app/services/form.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  faHouse = faHouse;
  faAngleDown = faAngleDown;
  faBell = faBell;

  currentDate: string | null = null;
  currentDay: string | null = null;
  public username: string = '';
  public initial: string = '';

  constructor(private authService : AuthService, private formService: FormService, private router : Router) { }
  showDropdown = false;

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.showDropdown = false;
  }

  home(): void{
    this.formService.clearOtherData();
    this.router.navigate(['/dashboard']);
  }

  ngOnInit(): void {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

    this.currentDate = date.toLocaleDateString('en-US', options);
    this.currentDay = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    this.username = this.authService.user? this.authService.user.username : '';
    this.initial = this.authService.user? this.authService.user.username[0].toUpperCase() : '';
    
  }
}
