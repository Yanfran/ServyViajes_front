
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-estatus-de-pago-reservacion',
  standalone: true,
  imports: [   
    MatFormFieldModule,  
    MatSelectModule,
    ReactiveFormsModule, 
    MatButtonModule,
  ],  
  templateUrl: './estatus-de-pago-reservacion.component.html',
  styleUrls: ['./estatus-de-pago-reservacion.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class EstatusDePagoReservacionComponent {
  createForm2 = new FormGroup({
    estatus: new FormControl('')
  });

  constructor(
    public dialogRef: MatDialogRef<EstatusDePagoReservacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onAceptar() {
    this.dialogRef.close(this.createForm2.get('estatus').value);
  }
}