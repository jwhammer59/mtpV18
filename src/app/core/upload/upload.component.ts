import { Component, OnInit, inject } from '@angular/core';

import { FileUpload } from '../../models/file-upload';
import { UploadService } from '../../services/up-load.service';

import { Member } from '../../models/member';
import { MembersService } from '../../services/members.service';

import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';

import { PrimeNGConfig, MessageService } from 'primeng/api';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [ButtonModule, ProgressBarModule, ToastModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
})
export class UploadComponent implements OnInit {
  selectedFiles?: FileList | undefined;
  currentFileUpload?: FileUpload;
  progress: number = 0;
  isDuplicateFileName: boolean = true;

  private uploadService = inject(UploadService);
  private primengConfig = inject(PrimeNGConfig);
  private membersService = inject(MembersService);
  private messageService = inject(MessageService);

  allMembers: Member[] = [];
  allMemberImgNamesArray: string[] = [];

  constructor() {
    this.membersService.getMembers().subscribe((members) => {
      this.allMembers = members;
    });
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.uploadService.getUploadStatus().subscribe((status) => {
      this.progress = status;
    });
  }

  selectFile(event: any): void {
    this.allMemberImgNamesArray = [];
    this.processMemberNameArray(this.allMembers);
    this.selectedFiles = event.target.files;
    setTimeout(() => {
      this.checkFileForDuplicates(this.selectedFiles![0].name);
    }, 1000);
  }

  processMemberNameArray(data: Member[]) {
    this.allMemberImgNamesArray = [];
    data.map((el) => this.allMemberImgNamesArray.push(el.avatarImgName!));
  }

  checkFileForDuplicates(val: string) {
    if (this.allMemberImgNamesArray.includes(val)) {
      this.isDuplicateFileName = true;
      this.messageService.add({
        severity: 'error',
        summary: `${val} is already in use.`,
        detail: 'Please choose another file',
        life: 3000,
      });
    } else {
      this.isDuplicateFileName = false;
    }
  }

  upload(): void {
    if (this.isDuplicateFileName) {
      console.log('Duplicate File');
    } else if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);
        this.uploadService.storeImageFile(this.currentFileUpload);
      }
    }
  }
}
