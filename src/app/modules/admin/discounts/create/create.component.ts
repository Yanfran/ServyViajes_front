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
//import para calendarios
import { Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
    selector: 'app-create',
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
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
    ],
    templateUrl: './create.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    isChecked = true;
    color: ThemePalette = 'primary';
    checked = false;
    disabled = false;    
    estatus: string = '';    

    createForm: FormGroup;

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _discountsService: DiscountsService,
        private alertService: AlertService,
        private _adapter: DateAdapter<any>,
        @Inject(MAT_DATE_LOCALE) private _locale: string,
    ) {}

    ngOnInit(): void {  
        //importante: configuracion de calendarios en español
        //formato: DD-MM-yyyy
        this._locale = 'es';
        this._adapter.setLocale(this._locale);
              
        this.createForm = this._formBuilder.group({
            nombre: ['', Validators.required],
            porcentaje: ['', Validators.required],
            vigencia: ['', Validators.required],
            codigo_descuento: ['', Validators.required],
            cantidad: ['', Validators.required],
            estatus: [false],            
        });
    }

    createCategories(): void {
        // Do nothing if the form is invalid
        if (this.createForm.invalid) {
            return;
        }

        // Disable the form
        this.createForm.disable();

        const fechaInicioFormatted = formatDate(this.createForm.value.vigencia, 'yyyy-MM-dd', 'en-US');

        var datos = {
            nombre: this.createForm.value.nombre,
            porcentaje: this.createForm.value.porcentaje,
            vigencia: fechaInicioFormatted,
            codigo_descuento: this.createForm.value.codigo_descuento,
            cantidad: this.createForm.value.cantidad,            
            estatus: this.createForm.value.estatus,
        };             

        try {
            // Create category
            this._discountsService.create(datos).subscribe(
                // (response: any) => {
                ({ result, message }: { result: boolean; message: string }) => {
                    if (result) {
                        if (result) {
                            this.alertService.alertConfirmation(
                                'success',
                                message
                            );
                            this._router.navigateByUrl('/discounts');
                        } else {
                            this.createForm.enable();       
                            this.alertService.alertConfirmation(
                                'error',
                                message
                            );
                        }
                    } else {
                        this.createForm.enable();       
                        this.alertService.alertConfirmation('error', message);
                    }
                }
            );
        } catch (error) {
            this.createForm.enable();       
            this.alertService.alertConfirmation('error', error);
        }
    }

    cancel(): void {        
            Swal.fire({
                title: '¿Estas seguro?',
                text: 'Este proceso es irreversible.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: 'No',
            }).then((result) => {
                if (result.isConfirmed) {                    
                    this._router.navigateByUrl('/discounts');
                }
            });
        
    }
}
