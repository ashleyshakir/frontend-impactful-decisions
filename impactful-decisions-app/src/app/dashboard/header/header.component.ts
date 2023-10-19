import { Component, OnInit } from '@angular/core';
import { faBell, faHouse, faAngleDown } from '@fortawesome/free-solid-svg-icons';

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

  constructor() { }

  ngOnInit(): void {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

    this.currentDate = date.toLocaleDateString('en-US', options);
    this.currentDay = date.toLocaleDateString('en-US', { weekday: 'long' });
    
  }
}
