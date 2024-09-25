import { Component, input, output } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonModule, ToolbarModule, TooltipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  title = input('');
  icon = input('');
  logo = input('');
  buttonLabel = input('');
  buttonIcon = input('');
  buttonVisible = input(false);

  buttonAction = output<string>();

  headerBtnAction() {
    this.buttonAction.emit('');
  }
}
