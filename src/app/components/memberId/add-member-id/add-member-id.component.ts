import { Component, OnInit, NgZone, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { HeaderComponent } from '../../../core/header/header.component';
import { BodyComponent } from '../../../core/body/body.component';
import { CardComponent } from '../../../core/card/card.component';

import { MemberId } from '../../../models/member-id';
import { MemberIdService } from '../../../services/member-id.service';

import { State } from '../../../models/state';
import { STATES } from '../../../data/state-data';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastModule } from 'primeng/toast';

import { PrimeNGConfig, MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-member-id',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    BodyComponent,
    CardComponent,
    ButtonModule,
    CardModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    InputMaskModule,
    ToastModule,
  ],
  templateUrl: './add-member-id.component.html',
  styleUrl: './add-member-id.component.scss',
})
export class AddMemberIdComponent implements OnInit {
  headerTitle = signal('Add Member ID');
  headerIcon = signal('pi pi-fw pi-plus');
  headerLogo = signal('mtp.png');

  cardHeader = signal('Add Member ID Form');

  submitted = signal(false);

  private memberIdService = inject(MemberIdService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private primengConfig = inject(PrimeNGConfig);

  states: State[] = STATES;

  addMemberIdForm!: FormGroup;

  allMemberIds: MemberId[] = [];
  allMemberIdNames: string[] = [];
  selectedMemberIdName: string = '';

  constructor() {
    this.addMemberIdForm = this.fb.group({
      memberIdName: ['', [Validators.required, Validators.minLength(5)]],
      memberIdFullName: ['', [Validators.required, Validators.minLength(5)]],
      memberIdPhone: ['', Validators.required],
      memberIdEmail: ['', Validators.required],
      memberIdAdd1: ['', Validators.required],
      memberIdAdd2: '',
      memberIdCity: ['', Validators.required],
      memberIdState: ['', Validators.required],
      memberIdZip: ['', Validators.required],
    });

    this.memberIdService
      .getMemberIds()
      .subscribe((memberIds) => (this.allMemberIds = memberIds));
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.getMemberIdNames();
  }

  get f() {
    return this.addMemberIdForm.controls;
  }

  getMemberIdNameMessage() {
    return this.f['memberIdName'].hasError('required')
      ? 'You must enter a name'
      : this.f['memberIdName'].hasError('minlength')
      ? 'Min length 5 characters'
      : '';
  }

  getMemberIdFullNameMessage() {
    return this.f['memberIdFullName'].hasError('required')
      ? 'You must enter a name'
      : this.f['memberIdFullName'].hasError('minlength')
      ? 'Min length 5 characters'
      : '';
  }

  getMemberIdNames() {
    setTimeout(() => {
      this.allMemberIds.filter((memberId) =>
        this.allMemberIdNames.push(memberId.memberIdName)
      );
    }, 1000);
  }

  onSubmit({ value, valid }: { value: MemberId; valid: boolean }) {
    this.selectedMemberIdName = value.memberIdName;
    this.submitted.set(true);

    if (!valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Form Invalid',
        key: 'error',
        life: 2000,
      });
    } else if (this.allMemberIdNames.includes(value.memberIdName)) {
      const tempMemberNameId = this.selectedMemberIdName;
      this.selectedMemberIdName = '';
      this.messageService.add({
        severity: 'error',
        summary: `${tempMemberNameId} is already in use.`,
        detail: 'Please choose another name',
        life: 3000,
        key: 'error',
      });
    } else {
      this.memberIdService.addMemberId(value);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'New Member ID Added!',
        key: 'success',
        life: 2000,
      });
    }
  }

  onCancelAddMemberId() {
    this.addMemberIdForm.reset();
    this.goToMemberIds();
  }

  goToMemberIds() {
    this.ngZone.run(() => {
      this.router.navigate(['member-ids']);
    });
  }
}
