import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass, NgFor, formatDate   } from '@angular/common';
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
import { AlertService } from 'app/services/alert/alert.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { MatNativeDateModule } from '@angular/material/core';
import { HotelsService } from 'app/services/hotels/hotels.service';
import { PlanTypesService } from 'app/services/plan_types/plan-types.service';
import { RoomsByHotelsService } from 'app/services/rooms_by_hotels/rooms-by-hotels.service';
//import para calendarios
import { Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
//mascaras
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
@Component({
    selector: 'app-create',
    standalone: true,
    imports: [
        NgFor,
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
        NgxMaskDirective,
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
        provideNgxMask(),
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
    hoteles: any[] = [];    
    plans: any[] = [];    
    aplica: boolean = false;

    createForm: FormGroup;

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,        
        private alertService: AlertService,
        private _hotelsService: HotelsService,
        private _planTypesService: PlanTypesService,
        private _roomsByHotelsService: RoomsByHotelsService,
        private _adapter: DateAdapter<any>,
        @Inject(MAT_DATE_LOCALE) private _locale: string
    ) {}

    ngOnInit(): void {  
        //importante: configuracion de calendarios en español
        //formato: DD-MM-yyyy
        this._locale = 'es';
        this._adapter.setLocale(this._locale);
              
        this.createForm = this._formBuilder.group({
            hotel: ['', Validators.required],
            plans: ['', Validators.required],
            tipo_habitacion: ['', Validators.required],
            // precio_adulto: ['', Validators.required],
            sencilla: ['', Validators.required],
            doble: ['', Validators.required],
            triple: ['', Validators.required],
            cuadruple: ['', Validators.required],
            infante_edad_minima: ['', Validators.required],
            infante_edad_maxima: ['', Validators.required],
            infante_precio_menores: ['', Validators.required],
            edad_minima: ['', Validators.required],
            edad_maxima: ['', Validators.required],
            precio_menores: ['', Validators.required],
            junior_edad_minima: { value: '', disabled: this.aplica !== true },
            junior_edad_maxima: { value: '', disabled: this.aplica !== true },
            junior_precio_menores: { value: '', disabled: this.aplica !== true },                                    
            habitaciones_disponibles: ['', Validators.required],
            vigencia: ['', Validators.required],
            estatus: [false],            
        });

        this.hotelesApi();
        this.plantTypesApi();
    }
    
 
    hotelesApi(){
        this._hotelsService.getHotels().subscribe(
            (response: any) => {
                if (response.result) {
                    this.hoteles = [
                        { id: null, nombre: 'Seleccione un hotel' },
                        ...response.data, 
                      ];                    
                      if (!this.createForm.get('hotel').value) {
                        this.createForm.get('hotel').setValue(null);
                      }                    
                } else {
                    console.error(
                        'Error al obtener la lista:',
                        response.message
                    );
                }
            },
            (error) => {
                console.error('Error al obtener la lista:', error);
            }
        ); 
    }

    plantTypesApi(){
        this._planTypesService.list().subscribe(
            (response: any) => {
                if (response.result) {
                    this.plans = [
                        { id: null, nombre: 'Seleccione un plan' },
                        ...response.data, 
                      ];                    
                      if (!this.createForm.get('plan').value) {
                        this.createForm.get('plan').setValue(null);
                      }                    
                } else {
                    console.error(
                        'Error al obtener la lista:',
                        response.message
                    );
                }
            },
            (error) => {
                console.error('Error al obtener la lista:', error);
            }
        ); 
    }

    create(): void {
        // Do nothing if the form is invalid
        if (this.createForm.invalid) {            
            return;
        }

        // Disable the form
        this.createForm.disable();

          // Formatea las fechas al formato deseado ("yyyy-MM-dd")
        const fechaInicioFormatted = formatDate(this.createForm.value.vigencia, 'yyyy-MM-dd', 'en-US');        

        var datos = {
            hotel_id: this.createForm.value.hotel,            
            plan_id: this.createForm.value.plans,
            vigencia: fechaInicioFormatted,            
            tipo_habitacion: this.createForm.value.tipo_habitacion,
            // precio_adulto: this.createForm.value.precio_adulto, 
            sencilla: this.createForm.value.sencilla,            
            doble: this.createForm.value.doble, 
            triple: this.createForm.value.triple, 
            cuadruple: this.createForm.value.cuadruple, 
            infante_edad_minima: this.createForm.value.infante_edad_minima, 
            infante_edad_maxima: this.createForm.value.infante_edad_maxima, 
            infante_precio_menores: this.createForm.value.infante_precio_menores, 
            edad_minima: this.createForm.value.edad_minima, 
            edad_maxima: this.createForm.value.edad_maxima,
            precio_menores: this.createForm.value.precio_menores, 
            aplica: this.aplica,
            junior_edad_minima: this.createForm.value.junior_edad_minima, 
            junior_edad_maxima: this.createForm.value.junior_edad_maxima, 
            junior_precio_menores: this.createForm.value.junior_precio_menores, 
            habitaciones_disponibles: this.createForm.value.habitaciones_disponibles,             
            estatus: this.createForm.value.estatus,              
        };

        // console.log(datos);

        try {
            // Create rooms by hotels
            this._roomsByHotelsService.create(datos).subscribe(                
                ({ result, message }: { result: boolean; message: string }) => {
                    if (result) {
                        if (result) {
                            this.alertService.alertConfirmation(
                                'success',
                                message
                            );
                            this._router.navigateByUrl('/rooms_by_hotels');
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
            this.alertService.alertConfirmation('error',  error);
        }
      
    }
    
    onAplicaChange() {        
        const controls = ['junior_edad_minima','junior_edad_maxima','junior_precio_menores'];
        controls.forEach((controlName) => {
          if (this.createForm.get(controlName)) {
            if (this.aplica) {                
                // this.Isfacturacion = true;
                this.createForm.get(controlName)?.enable();
            } else {                
                // this.Isfacturacion = false;
                this.createForm.get(controlName)?.disable();
            }
          }
        });
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
                this._router.navigateByUrl('/rooms_by_hotels');
            }
        });    
    }        

    alertConfirmation(icon: SweetAlertIcon, title: string): void {
        this.alertService.alertConfirmation(icon, title);
    }

}
