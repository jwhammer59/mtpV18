import { Component, OnInit, NgZone, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MemberId } from '../../../models/member-id';
import { MemberIdService } from '../../../services/member-id.service';

import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';

import {
  MessageService,
  ConfirmEventType,
  ConfirmationService,
  MenuItem,
} from 'primeng/api';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-member-id-table',
  standalone: true,
  imports: [CommonModule, ContextMenuModule, DialogModule, TableModule],
  templateUrl: './member-id-table.component.html',
  styleUrl: './member-id-table.component.scss',
})
export class MemberIdTableComponent implements OnInit {
  private memberIdService = inject(MemberIdService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  showMemberIdDetails = signal(false);

  allMemberIds$!: Observable<MemberId[]>;
  selectedMemberId!: MemberId;

  items!: MenuItem[];

  constructor() {
    this.allMemberIds$ = this.memberIdService.getMemberIds();
  }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        command: () => this.goToEditMemberId(this.selectedMemberId.id!),
      },
      {
        label: 'Details',
        icon: 'pi pi-fw pi-exclamation-circle',
        command: () => this.onShowMemberIdDetails(this.selectedMemberId.id!),
      },
      {
        label: 'Delete',
        icon: 'pi pi=fw pi-trash',
        command: () => this.goToDeleteMemberId(this.selectedMemberId.id!),
      },
    ];
  }

  goToAddMemberId() {
    this.ngZone.run(() => {
      this.router.navigate(['add-member-id']);
    });
  }

  goToEditMemberId(id: string) {
    this.ngZone.run(() => {
      this.router.navigate([`edit-member-id/${id}`]);
    });
  }

  onShowMemberIdDetails(id: string) {
    this.memberIdService
      .getMemberId(id)
      .subscribe((memberId) => (this.selectedMemberId = memberId));
    this.showMemberIdDetails.set(true);
  }

  onCloseMemberIdDetails() {
    this.showMemberIdDetails.set(false);
  }

  goToDeleteMemberId(id: string) {
    console.log('Delete Member ID', id);
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Member ID Deleted!!',
        });
        this.memberIdService.deleteMemberId(id);
        this.confirmationService.close();
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected Member ID deletion.',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled Member ID deletion.',
            });
            break;
        }
        this.confirmationService.close();
      },
    });
  }
}
