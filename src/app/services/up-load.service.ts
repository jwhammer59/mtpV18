import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage';

import { FileUpload } from '../models/file-upload';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  progress: number = 0;
  downloadUrlString: string = '';
  fileName: string = '';

  private uploadStatus = new Subject<number>();
  private uploadStatus$ = this.uploadStatus.asObservable();

  private downLoadURL = new Subject<string>();
  private downLoadURL$ = this.downLoadURL.asObservable();

  private imageFileName = new Subject<string>();
  private imageFileName$ = this.imageFileName.asObservable();

  private basePath = '/uploads/v17';

  private db = inject(Firestore);
  private storage = inject(Storage);

  getUploadStatus(): Observable<number> {
    return this.uploadStatus$;
  }

  getDownLoadURL(): Observable<string> {
    return this.downLoadURL$;
  }

  getImageFileName(): Observable<string> {
    return this.imageFileName$;
  }

  storeImageFile(fileUpload: FileUpload): void {
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, fileUpload.file);

    this.imageFileName.next(fileUpload.file.name);

    // Listen for state changes, errors, Sand completion of the upload.
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.uploadStatus.next(this.progress);
        // console.log('Upload is ' + this.progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            // console.log('Upload is paused');
            break;
          case 'running':
            // console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          this.downLoadURL.next(downloadURL);
        });
      }
    );
  }
}
