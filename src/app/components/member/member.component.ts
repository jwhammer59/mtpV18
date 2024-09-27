import { Component, NgZone, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { HeaderComponent } from '../../core/header/header.component';
import { BodyComponent } from '../../core/body/body.component';
import { CardComponent } from '../../core/card/card.component';

import { MemberTableComponent } from './member-table/member-table.component';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    BodyComponent,
    CardComponent,
    MemberTableComponent,
    ButtonModule,
    CardModule,
    ConfirmDialogModule,
    ContextMenuModule,
    DialogModule,
    TableModule,
    TooltipModule,
    ToastModule,
  ],
  templateUrl: './member.component.html',
  styleUrl: './member.component.scss',
})
export class MemberComponent {
  headerTitle = signal('Members');
  headerIcon = signal('pi pi-fw pi-users');
  headerLogo = signal('mtp.png');
  headerBtnVisible = signal(true);
  headerBtnLabel = signal('Add Member');
  headerBtnIcon = signal('pi pi-fw pi-user-plus');
  showProviderDetails = signal(false);

  cardHeader = signal('Members List');

  private ngZone = inject(NgZone);
  private router = inject(Router);

  goToAddMember() {
    this.ngZone.run(() => {
      this.router.navigate(['add-member']);
    });
  }
}
