import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        console.log('Navigation started:', event.url);
      } else if (event instanceof NavigationEnd) {
        console.log('Navigation completed:', event.url);
      } else if (event instanceof NavigationError) {
        console.error('Navigation error:', event.error);
      }
    });
  }
}
