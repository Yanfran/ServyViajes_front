import { NgIf, formatDate } from '@angular/common';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThemePalette } from '@angular/material/core';
import { fuseAnimations } from '@fuse/animations';
import { AlertService } from 'app/services/alert/alert.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SharedService } from 'app/services/shared/shared.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { MatNativeDateModule } from '@angular/material/core';
//import para calendarios
import { Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
    selector: 'app-watch',
    animations: fuseAnimations,
    standalone: true,
    imports: [
        MatNativeDateModule,
        MatDatepickerModule,
        NgIf,
        MatIconModule,
        MatButtonModule,
        RouterLink,
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule,
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
    ],
    templateUrl: './watch.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./watch.component.scss'],
})
export class WatchComponent {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    color: ThemePalette = 'accent';
    checked = false;
    disabled = true;
    idEdit = 0;
    sharedData: any;
    categories: any[] = [];
    hoteles: any[] = [];
    createForm: FormGroup;

    constructor(
        private _shareService: SharedService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,        
        private alertService: AlertService,
        private _adapter: DateAdapter<any>,
        @Inject(MAT_DATE_LOCALE) private _locale: string
    ) {
        this.sharedData = this._shareService.getSharedData();

        if (!this.sharedData) {
            this._router.navigateByUrl('/discounts');
        }
    }

    ngOnInit(): void {
        //importante: configuracion de calendarios en español
        //formato: DD-MM-yyyy
        this._locale = 'es';
        this._adapter.setLocale(this._locale);
        
        // Create the form
        this.createForm = this._formBuilder.group({
            nombre: ['', Validators.required],
            porcentaje: ['', Validators.required],
            vigencia: ['', Validators.required],
            codigo_descuento: ['', Validators.required],
            cantidad: ['', Validators.required],
            estatus: [false],
        });

        if (this.sharedData) {
            (this.idEdit = this.sharedData.id),
                this.createForm.patchValue({
                    nombre: this.sharedData.nombre,
                    porcentaje: this.sharedData.porcentaje,
                    vigencia: this.formatearFecha(this.sharedData.vigencia),
                    codigo_descuento: this.sharedData.codigo_descuento,
                    cantidad: this.sharedData.cantidad,
                    estatus: this.sharedData.estatus,
                });
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

    alertConfirmation(icon: SweetAlertIcon, title: string): void {
        this.alertService.alertConfirmation(icon, title);
    }

    formatearFecha(fecha: string): string {
        const fechaNumerica = fecha;
        const newFecha: Date = new Date(fechaNumerica);
        newFecha.setUTCHours(23, 0, 0, 0);
        const fechaFormateada: string = newFecha.toISOString();
    
        //console.log(fechaFormateada);
        return fechaFormateada;
    }
}
