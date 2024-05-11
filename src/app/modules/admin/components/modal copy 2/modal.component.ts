import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgFor, NgIf } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-modal',
  standalone   : true,
  imports: [NgFor, NgIf],
  styles: [`
    img {
      max-width: 100%;
      max-height: auto;
    }
    .pdf-container {
      width: 100%;
      height: auto;
    }
  `],
  template: `
    <!-- <ng-container *ngIf="data.isImage; else pdfContent">
      <img *ngIf="data.isImage" [src]="sanitizer.bypassSecurityTrustResourceUrl(data.url)" alt="Comprobante" />      
    </ng-container>
    <ng-template #pdfContent>
      <iframe *ngIf="!data.isImage" [src]="sanitizer.bypassSecurityTrustResourceUrl(data.url)" width="100%" height="100%"></iframe>    
    </ng-template> -->

    <img *ngIf="data.isImage" [src]="sanitizer.bypassSecurityTrustResourceUrl(data.url)" alt="Comprobante" />
    <iframe *ngIf="!data.isImage" [src]="sanitizer.bypassSecurityTrustResourceUrl(data.url)" width="100%" height="500px"></iframe>    
  `,
})
export class ModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: { url: string; isImage: boolean },
    private sanitizer: DomSanitizer
    ) 
  {
    console.log('isImage:', data.isImage);
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
