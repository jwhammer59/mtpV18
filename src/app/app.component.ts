import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './core/footer/footer.component';
import { LoadingComponent } from './core/loading/loading.component';
import { NavComponent } from './core/nav/nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, FooterComponent, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Ministry Tracker Pro';
}
