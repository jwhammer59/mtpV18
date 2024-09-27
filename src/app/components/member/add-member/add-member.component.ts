import { Component, OnInit, NgZone, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

import { HeaderComponent } from '../../../core/header/header.component';
import { BodyComponent } from '../../../core/body/body.component';
import { CardComponent } from '../../../core/card/card.component';

import { Member } from '../../../models/member';
import { MembersService } from '../../../services/members.service';

import { MemberId } from '../../../models/member-id';
import { MemberIdService } from '../../../services/member-id.service';

import { Ministry } from '../../../models/ministry';
import { MinistriesService } from '../../../services/ministries.service';

import { Provider } from '../../../models/provider';
import { ProvidersService } from '../../../services/providers.service';

import { State } from '../../../models/state';
import { STATES } from '../../../data/state-data';

import { UploadComponent } from '../../../core/upload/upload.component';
import { UploadService } from '../../../services/up-load.service';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

import { PrimeNGConfig, MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HeaderComponent,
    BodyComponent,
    CardComponent,
    UploadComponent,
    ButtonModule,
    CardModule,
    DialogModule,
    DropdownModule,
    InputMaskModule,
    InputNumberModule,
    InputTextModule,
    ToastModule,
  ],
  templateUrl: './add-member.component.html',
  styleUrl: './add-member.component.scss',
})
export class AddMemberComponent implements OnInit {
  headerTitle = signal('Add Dwelling');
  headerIcon = signal('pi pi-plus');
  headerLogo = signal('assets/HIT_Logo_1.png');

  cardTitle = signal('Add Dwelling Form');

  private membersService = inject(MembersService);
  private messageService = inject(MessageService);
  private uploadService = inject(UploadService);
  private ngZone = inject(NgZone);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private primengConfig = inject(PrimeNGConfig);

  submitted = signal(false);

  progress = signal(0);
  downLoadUrl = signal('');
  imageFileName = signal('');
  imgLoadedPercent = signal(0);

  states: State[] = STATES;

  addMemberForm!: FormGroup;

  allMembersArray: Member[] = [];
  memberNameArray: string[] = [];
  selectedMemberName: string = '';

  constructor() {
    this.addMemberForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      middleInit: '',
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      add1: ['', Validators.required],
      add2: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', Validators.required],
      avatarImgName: '',
      avatarDownloadUrl: '',
      ministries: [],
      memberID: ['', Validators.required],
      physician: ['', Validators.required],
      dentist: ['', Validators.required],
      hospital: ['', Validators.required],
      isActive: true,
      isFamilyIDHead: false,
      isMinistryHead: false,
    });
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.uploadService.getDownLoadURL().subscribe((val) => {
      this.f['avatarDownloadUrl'].patchValue(val);
    });

    this.uploadService.getImageFileName().subscribe((val) => {
      this.f['avatarImgName'].patchValue(val);
    });

    this.uploadService.getUploadStatus().subscribe((val) => {
      this.imgLoadedPercent.set(val);
    });
  }

  get f() {
    return this.addMemberForm.controls;
  }
}
