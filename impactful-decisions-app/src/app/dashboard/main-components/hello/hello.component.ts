import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.scss']
})
export class HelloComponent implements OnInit{
  public username: string = '';

  constructor(private authService : AuthService) { }

  ngOnInit(): void {
    this.username = this.authService.user? this.authService.user.username : '';
  }

}
