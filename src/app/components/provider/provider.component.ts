import { Component, OnInit, NgZone, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { HeaderComponent } from '../../core/header/header.component';
import { BodyComponent } from '../../core/body/body.component';
import { CardComponent } from '../../core/card/card.component';

import { ProviderTableComponent } from './provider-table/provider-table.component';

import { Provider } from '../../models/provider';
import { ProvidersService } from '../../services/providers.service';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';

import {
  MessageService,
  ConfirmEventType,
  ConfirmationService,
  MenuItem,
} from 'primeng/api';

import { Observable } from 'rxjs';

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
export class ProviderComponent implements OnInit {
  headerTitle = signal('Providers');
  headerIcon = signal('pi pi-fw pi-shield');
  headerLogo = signal('mtp.png');
  headerBtnVisible = signal(true);
  headerBtnLabel = signal('Add Provider');
  headerBtnIcon = signal('pi pi-fw pi-plus');
  showProviderDetails = signal(false);

  cardHeader = signal('Provider List');

  private providersService = inject(ProvidersService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private ngZone = inject(NgZone);
  private router = inject(Router);

  allProviders$!: Observable<Provider[]>;
  selectedProvider!: Provider;

  items!: MenuItem[];

  constructor() {
    this.allProviders$ = this.providersService.getProviders();
  }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        command: () => this.goToEditProvider(this.selectedProvider.id!),
      },
      {
        label: 'Details',
        icon: 'pi pi-fw pi-exclamation-circle',
        command: () => this.onShowProviderDetails(this.selectedProvider.id!),
      },
      {
        label: 'Delete',
        icon: 'pi pi=fw pi-trash',
        command: () => this.goToDeleteProvider(this.selectedProvider.id!),
      },
    ];
  }

  goToAddProvider() {
    this.ngZone.run(() => {
      this.router.navigate(['add-provider']);
    });
  }

  goToEditProvider(id: string) {
    this.ngZone.run(() => {
      this.router.navigate([`edit-provider/${id}`]);
    });
  }

  onShowProviderDetails(id: string) {
    this.providersService
      .getProvider(id)
      .subscribe((provider) => (this.selectedProvider = provider));
    this.showProviderDetails.set(true);
  }

  onCloseProviderDetails() {
    this.showProviderDetails.set(false);
  }

  goToDeleteProvider(id: string) {
    console.log('Delete Provider', id);
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Provider Deleted!!',
        });
        this.providersService.deleteProvider(id);
        this.confirmationService.close();
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected Provider deletion.',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled Provider deletion.',
            });
            break;
        }
        this.confirmationService.close();
      },
    });
  }
}
