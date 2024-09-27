import { Component, NgZone, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { HeaderComponent } from '../../core/header/header.component';
import { BodyComponent } from '../../core/body/body.component';
import { CardComponent } from '../../core/card/card.component';

import { MemberIdTableComponent } from './member-id-table/member-id-table.component';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-member-id',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    BodyComponent,
    CardComponent,
    MemberIdTableComponent,
    ButtonModule,
    CardModule,
    ConfirmDialogModule,
    ContextMenuModule,
    DialogModule,
    TableModule,
    TooltipModule,
    ToastModule,
  ],
  templateUrl: './member-id.component.html',
  styleUrl: './member-id.component.scss',
})
export class MemberIdComponent {
  headerTitle = signal('Member Id');
  headerIcon = signal('pi pi-fw pi-id-card');
  headerLogo = signal('mtp.png');
  headerBtnVisible = signal(true);
  headerBtnLabel = signal('Add Member ID');
  headerBtnIcon = signal('pi pi-fw pi-plus');
  showProviderDetails = signal(false);

  cardHeader = signal('Member ID List');

  private ngZone = inject(NgZone);
  private router = inject(Router);

  goToAddMemberId() {
    this.ngZone.run(() => {
      this.router.navigate(['add-member-id']);
    });
  }
}
