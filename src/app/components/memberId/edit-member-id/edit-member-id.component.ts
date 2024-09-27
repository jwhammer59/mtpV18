import { Component, OnInit, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

import { HeaderComponent } from '../../../core/header/header.component';
import { BodyComponent } from '../../../core/body/body.component';
import { CardComponent } from '../../../core/card/card.component';

import { MemberId } from '../../../models/member-id';
import { MemberIdService } from '../../../services/member-id.service';

import { LoadingService } from '../../../services/loading.service';

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
import { settings } from '@angular/fire/analytics';

@Component({
  selector: 'app-edit-member-id',
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
  templateUrl: './edit-member-id.component.html',
  styleUrl: './edit-member-id.component.scss',
})
export class EditMemberIdComponent implements OnInit {
  headerTitle = signal('Edit Member ID');
  headerIcon = signal('pi pi-fw pi-pencil');
  headerLogo = signal('mtp.png');

  cardHeader = signal('Edit Member ID Form');

  submitted = signal(false);
  id: string = '';

  private memberIdService = inject(MemberIdService);
  private messageService = inject(MessageService);
  private loadingService = inject(LoadingService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private primengConfig = inject(PrimeNGConfig);

  states: State[] = STATES;

  editMemberIdForm!: FormGroup;
  memberIdRef: any;

  allMemberIds: MemberId[] = [];
  allMemberIdNames: string[] = [];
  initialMemberId: string = '';
  selectedMemberIdName: string = '';

  constructor() {
    this.editMemberIdForm = this.fb.group({
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
    this.id = this.route.snapshot.params['id'];
    this.memberIdService.getMemberId(this.id).subscribe((memberId) => {
      this.memberIdRef = memberId;
    });
  }

  ngAfterViewInit() {
    this.loadingService.loadingOn();
    setTimeout(() => {
      this.editMemberIdForm = this.fb.group({
        memberIdName: [this.memberIdRef.memberIdName],
        memberIdFullName: [this.memberIdRef.memberIdFullName],
        memberIdPhone: [this.memberIdRef.memberIdPhone],
        memberIdEmail: [this.memberIdRef.memberIdEmail],
        memberIdAdd1: [this.memberIdRef.memberIdAdd1],
        memberIdAdd2: [this.memberIdRef.memberIdAdd2],
        memberIdCity: [this.memberIdRef.memberIdCity],
        memberIdState: [this.memberIdRef.memberIdState],
        memberIdZip: [this.memberIdRef.memberIdZip],
      });
      this.loadingService.loadingOff();
      this.initialMemberId = this.memberIdRef.memberIdName;
    }, 2000);
  }

  get f() {
    return this.editMemberIdForm.controls;
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
    } else if (
      this.allMemberIdNames.includes(value.memberIdName) &&
      this.selectedMemberIdName !== this.initialMemberId
    ) {
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

  goToMemberIds() {
    this.location.back();
  }

  onCancelAddMemberId() {
    this.editMemberIdForm.reset();
    this.goToMemberIds();
  }
}
