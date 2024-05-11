import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass, NgFor, formatDate   } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormArray,
    FormGroup,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
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
import { HotelsService } from 'app/services/hotels/hotels.service';
import { CategoriesService } from 'app/services/categories/categories.service';
import { EventsService } from 'app/services/events/events.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
//import para calendarios
import { Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
    selector: 'app-create',
    standalone: true,
    imports: [
        MatNativeDateModule,
        CommonModule,
        NgFor,
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
        NgxMaskDirective
    ],
    providers: [
        provideNgxMask(),
    ],
    templateUrl: './create.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./create.component.scss'],
})

export class CreateComponent {
    @ViewChild('createHotel') createHotel: NgForm;


    isChecked = true;
    color: ThemePalette = 'primary';    
    descripcion: string = '';
    estatus: string = '';        
    hoteles: any[] = [];    
    categories: any[] = [];  
    grados: any[] = [];    
    createForm: FormGroup;

    
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,      
        private alertService: AlertService,
        private _hotelsService: HotelsService,
        private _categoriesService: CategoriesService,
        private _eventsService: EventsService,
        private _adapter: DateAdapter<any>,
        @Inject(MAT_DATE_LOCALE) private _locale: string      
    ) {}

    ngOnInit(): void {
        //importante: configuracion de calendarios en español
        //formato: DD-MM-yyyy
        this._locale = 'es';
        this._adapter.setLocale(this._locale);        

        // Create the form
        this.createForm = this._formBuilder.group({
            nombre: ['', Validators.required],
            sede: ['', Validators.required],
            fecha_inicio: ['', Validators.required],
            fecha_termino: ['', Validators.required],
            descripcion: ['', Validators.required],
            politicas: ['', Validators.required],
            hotel: [''],                                  
            categorias: this._formBuilder.array([]),   
            grados: this._formBuilder.array([]),                        
            estatus: [false],
            beneficiario: ['', Validators.required],
            banco: ['', Validators.required],
            numero_cuenta: ['', [
                Validators.required,
                Validators.pattern(/^[0-9]+$/)]
            ],
            clabe_interbancaria: ['', [
                Validators.required,
                Validators.minLength(18),
                Validators.maxLength(18),
                Validators.pattern(/^[0-9]+$/)]
            ]
        });

        this._hotelsService.getHotels().subscribe(
            (response: any) => {
                if (response.result) {
                    this.hoteles = [
                        { id: null, nombre: 'Seleccione un hotel' },
                        ...response.data,  // Agrega los hoteles después de la opción predeterminada
                      ];                    
                      if (!this.createForm.get('hotel').value) {
                        this.createForm.get('hotel').setValue(null);
                      }
                    // this.createForm.get('hotel').setValue(response.data[0].id); // Establece el primer hotel como predeterminado                    
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
        
        this._categoriesService.getCategories().subscribe(
            (response: any) => {
                if (response.result) {
                    this.categories = response.data;  // Asigna la lista completa de hoteles                    
                    this.createForm.get('categories').setValue(response.data[0].id); // Establece el primer hotel como predeterminado                    
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

        this.agregarServicio();
        this.agregarGradoAcademico();
        
    }


    get serviciosArray() {
        return this.createForm.get('categorias') as FormArray;
    }

    agregarServicio() {
        const nuevoServicio = this._formBuilder.group({
            category_id: ['', Validators.required],
            costo: ['', Validators.required],
        });
    
        this.serviciosArray.push(nuevoServicio);
    }        

    eliminarServicio(index: number) {
        this.serviciosArray.removeAt(index);
    }


    get gradosArray() {
        return this.createForm.get('grados') as FormArray;
    }

    agregarGradoAcademico() {
        const nuevosGradosAcademico = this._formBuilder.group({            
            grado_academico: ['', Validators.required],
        });
    
        this.gradosArray.push(nuevosGradosAcademico);
    }        

    eliminarGradoAcademico(index: number) {
        this.gradosArray.removeAt(index);
    }

    create(): void {
        // Do nothing if the form is invalid
        if (this.createForm.invalid) {
            this.markFormGroupTouched(this.createForm);
            return;
        }

        // Disable the form
        this.createForm.disable();

          // Formatea las fechas al formato deseado ("yyyy-MM-dd")
        const fechaInicioFormatted = formatDate(this.createForm.value.fecha_inicio, 'yyyy-MM-dd', 'en-US');
        const fechaTerminoFormatted = formatDate(this.createForm.value.fecha_termino, 'yyyy-MM-dd', 'en-US');

        var datos = {
            nombre: this.createForm.value.nombre,            
            sede: this.createForm.value.sede,
            fecha_inicio: fechaInicioFormatted,
            fecha_termino: fechaTerminoFormatted,
            descripcion: this.createForm.value.descripcion,
            politicas: this.createForm.value.politicas,            
            estatus: this.createForm.value.estatus,  
            hotel_id: this.createForm.value.hotel,
            beneficiario: this.createForm.value.beneficiario,
            banco: this.createForm.value.banco,
            numero_cuenta: this.createForm.value.numero_cuenta,
            clabe_interbancaria: this.createForm.value.clabe_interbancaria,            
            categorias: this.createForm.value.categorias.map((category: any) => ({
                category_id: category.category_id,
                costo: category.costo,
            })), 
            grados: this.createForm.value.grados.map((grado_academico: any) => ({                
                grado_academico: grado_academico.grado_academico,
            })),          
        };
        
        
        try {
            // Create category
            this._eventsService.create(datos).subscribe(
                // (response: any) => {
                ({ result, message }: { result: boolean; message: string }) => {
                    if (result) {
                        if (result) {
                            this.alertService.alertConfirmation(
                                'success',
                                message
                            );
                            this._router.navigateByUrl('/events');
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

    private markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach(control => {
          if (control instanceof FormGroup) {
            this.markFormGroupTouched(control);
          } else {
            control.markAsTouched();
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
                this._router.navigateByUrl('/events');
            }
        });    
    }        

    alertConfirmation(icon: SweetAlertIcon, title: string): void {
        this.alertService.alertConfirmation(icon, title);
    }
}
