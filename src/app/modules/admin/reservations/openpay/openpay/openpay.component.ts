import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass, NgIf, formatDate } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ThemePalette } from '@angular/material/core';
import { DiscountsService } from 'app/services/discounts/discounts.service';
import { AlertService } from 'app/services/alert/alert.service';
import Swal from 'sweetalert2';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-openpay',
  templateUrl: './openpay.component.html',
  styleUrls: ['./openpay.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    CommonModule,
    MatNativeDateModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    NgClass,
    MatInputModule,
    TextFieldModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatChipsModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSlideToggleModule,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class OpenpayComponent {

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _router: Router,
    private _discountsService: DiscountsService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {

    console.log("Hola componente nuevo")
    // this.createForm = this._formBuilder.group({
    //     nombre: ['', Validators.required],
    //     porcentaje: ['', Validators.required],
    //     vigencia: ['', Validators.required],
    //     codigo_descuento: ['', Validators.required],
    //     cantidad: ['', Validators.required],
    //     estatus: [false],            
    // });
  }

}
