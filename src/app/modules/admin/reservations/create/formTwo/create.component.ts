import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass, formatDate, NgFor, NgIf, NgStyle } from '@angular/common';
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
import { EventsService } from 'app/services/events/events.service';

@Component({
    selector: 'app-create',
    standalone: true,
    imports: [
        NgStyle,
        NgIf,
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
    events: any[] = [];  
    sharedData: any;    
    createForm: FormGroup;

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _discountsService: DiscountsService,
        private alertService: AlertService,
        private _eventsService: EventsService
    ) {}

    async ngOnInit(): Promise<void> {        
        this.createForm = this._formBuilder.group({
            events: ['', Validators.required],                            
            clave_reservacion: ['', Validators.required],
            fecha: ['', Validators.required],
            monto: ['', Validators.required],
            numero_movimiento: ['', Validators.required],
            // tipo_habitacion: ['', Validators.required],
            // cantidad: ['', Validators.required],
            // menores: ['', Validators.required],
            // apellidos: ['', Validators.required],            
            // estatus: [false],            
        });

        // try {
        //     await this.eventos();            
        // } catch (error) {
        //     console.error('Error en ngOnInit:', error);
        // }  
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

    async eventos(): Promise<void>{

        try {
            const selectedId = this.sharedData ? this.sharedData.evento_id : ''; 
            const response = await this._eventsService.getEvents().toPromise();
            const { result, message, data } = response;
            
                if (result) {
                    this.events = data;                                         
                    if(this.sharedData){                                                
                        // Buscar el país con el ID deseado en la lista
                        const selectedEvent = this.events.find(event => event.id === selectedId);

                        // Verificar si el país fue encontrado y asignar el valor al FormControl
                        if (selectedEvent) {
                            this.createForm.get('events').setValue(selectedEvent.id); 
                        } else {
                            console.error('No se encontró el país con el ID deseado.');
                        }                        
                    } else {
                        this.createForm.get('event').setValue(data[0].id);
                    }
                                        
                } else {
                    console.error(
                        'Error al obtener la lista:',
                        message
                    );
                }                

        } catch (error) {
            console.error('Error en categorias:', error);
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
