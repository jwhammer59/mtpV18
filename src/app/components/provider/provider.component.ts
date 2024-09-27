import { Component, NgZone, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { HeaderComponent } from '../../core/header/header.component';
import { BodyComponent } from '../../core/body/body.component';
import { CardComponent } from '../../core/card/card.component';

import { ProviderTableComponent } from './provider-table/provider-table.component';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-provider',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    BodyComponent,
    CardComponent,
    ProviderTableComponent,
    ButtonModule,
    CardModule,
    ConfirmDialogModule,
    ContextMenuModule,
    DialogModule,
    TableModule,
    TooltipModule,
    ToastModule,
  ],
  templateUrl: './provider.component.html',
  styleUrl: './provider.component.scss',
})
export class ProviderComponent {
  headerTitle = signal('Providers');
  headerIcon = signal('pi pi-fw pi-shield');
  headerLogo = signal('mtp.png');
  headerBtnVisible = signal(true);
  headerBtnLabel = signal('Add Provider');
  headerBtnIcon = signal('pi pi-fw pi-plus');
  showProviderDetails = signal(false);

  cardHeader = signal('Provider List');

  private ngZone = inject(NgZone);
  private router = inject(Router);

  goToAddProvider() {
    this.ngZone.run(() => {
      this.router.navigate(['add-provider']);
    });
  }
}
