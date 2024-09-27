import { Component, OnInit, NgZone, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Member } from '../../../models/member';
import { MembersService } from '../../../services/members.service';

import { ContextMenuModule } from 'primeng/contextmenu';
import { CheckboxModule } from 'primeng/checkbox';
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
  selector: 'app-member-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CheckboxModule,
    ContextMenuModule,
    DialogModule,
    TableModule,
  ],
  templateUrl: './member-table.component.html',
  styleUrl: './member-table.component.scss',
})
export class MemberTableComponent implements OnInit {
  private membersService = inject(MembersService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  showMemberDetails = signal(false);

  allMembers$!: Observable<Member[]>;
  selectedMember!: Member;

  items!: MenuItem[];

  constructor() {
    this.allMembers$ = this.membersService.getMembers();
  }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        command: () => this.goToEditMember(this.selectedMember.id!),
      },
      {
        label: 'Details',
        icon: 'pi pi-fw pi-exclamation-circle',
        command: () => this.onShowMemberDetails(this.selectedMember.id!),
      },
      {
        label: 'Delete',
        icon: 'pi pi=fw pi-trash',
        command: () => this.goToDeleteMember(this.selectedMember.id!),
      },
    ];
  }

  goToAddMember() {
    this.ngZone.run(() => {
      this.router.navigate(['add-member']);
    });
  }

  goToEditMember(id: string) {
    this.ngZone.run(() => {
      this.router.navigate([`edit-member/${id}`]);
    });
  }

  onShowMemberDetails(id: string) {
    this.membersService
      .getMember(id)
      .subscribe((member) => (this.selectedMember = member));
    this.showMemberDetails.set(true);
  }

  onCloseMemberrDetails() {
    this.showMemberDetails.set(false);
  }

  goToDeleteMember(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Member Deleted!!',
        });
        this.membersService.deleteMember(id);
        this.confirmationService.close();
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected Member deletion.',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled Member deletion.',
            });
            break;
        }
        this.confirmationService.close();
      },
    });
  }
}
