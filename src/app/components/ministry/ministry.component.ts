import { Component, OnInit, NgZone, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from '../../core/header/header.component';
import { BodyComponent } from '../../core/body/body.component';
import { CardComponent } from '../../core/card/card.component';

import { Ministry } from '../../models/ministry';
import { MinistriesService } from '../../services/ministries.service';

import { Member } from '../../models/member';
import { MembersService } from '../../services/members.service';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import {
  PrimeNGConfig,
  MessageService,
  ConfirmEventType,
  ConfirmationService,
} from 'primeng/api';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-ministry',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    BodyComponent,
    CardComponent,
    ConfirmDialogModule,
    DropdownModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    ToastModule,
    ToolbarModule,
  ],
  templateUrl: './ministry.component.html',
  styleUrl: './ministry.component.scss',
})
export class MinistryComponent implements OnInit {
  headerTitle = signal('Ministries');
  headerIcon = signal('pi pi-fw pi-heart');
  headerBtnVisible = signal(false);
  headerLogo = signal('mtp.png');

  ministryDialog = signal(false);
  ministries$!: Observable<Ministry[]>;
  submitted = signal(false);

  allMembers$!: Observable<Member[]>;
  onlyMinistryHeads$!: Observable<Member[]>;

  id: string = '';

  ministry: Ministry = {
    id: '',
    ministryName: '',
    ministryHead: '',
    isActive: false,
  };

  private ministriesService = inject(MinistriesService);
  private membersService = inject(MembersService);
  private primengConfig = inject(PrimeNGConfig);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  constructor() {
    this.ministries$ = this.ministriesService.getMinistries();
    this.allMembers$ = this.membersService.getMembers();
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.onLoadOnlyMinsitryHeads();
  }

  onLoadOnlyMinsitryHeads() {
    this.onlyMinistryHeads$ = this.allMembers$.pipe(
      map((members) =>
        members.filter(
          (member) => member.isMinsitryHead === true && member.isActive === true
        )
      )
    );
  }

  openNewMinistry() {
    this.submitted.set(true);
    this.ministryDialog.set(true);
  }

  onSubmit(val: Ministry, id: string) {
    this.submitted.set(true);

    if (this.ministry.ministryName!.trim()) {
      if (this.ministry.id) {
        this.ministriesService.updateMinistry(id, val);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Ministry Updated!',
          life: 3000,
        });
      } else {
        this.ministriesService.addMinistry(val);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Ministry Added!',
          life: 3000,
        });
      }
      this.hideDialog();
    }
  }

  deleteMinistry(id: string) {
    this.confirmationService.confirm({
      message: `Are you sure you want to proceed?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Ministry Deleted!!',
        });
        this.ministriesService.deleteMinistry(id);
        this.confirmationService.close();
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected Ministry deletion.',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled Ministry deletion.',
            });
            break;
        }
        this.confirmationService.close();
      },
    });
  }

  editMinistry(ministry: Ministry) {
    this.ministry = { ...ministry };
    this.id = this.ministry.id;
    this.ministryDialog.set(true);
  }

  hideDialog() {
    this.ministryDialog.set(false);
    this.submitted.set(false);
    this.resetForm();
  }

  resetForm() {
    this.ministry.id = '';
    this.ministry.ministryName = '';
  }
}
