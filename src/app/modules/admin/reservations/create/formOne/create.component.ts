import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass, formatDate, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormArray,
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
    @ViewChild('cantidadInput') cantidadInput: ElementRef;
    @ViewChild('habitacionInput') habitacionInput: ElementRef;

    isChecked = true;
    color: ThemePalette = 'primary';
    checked = false;
    disabled = false;    
    estatus: string = '';  
    events: any[] = [];  
    sharedData: any;    
    createForm: FormGroup;
    nombreHotel: string = '';  
    data: any[] = [];
    servicios: any[] = [];  
    tiposDePlanSeleccionados: any[] = []; 
    idEventSelect: number;      
    selectedPlanData: any;
    grados: any[] = []; 
    seleccionadasTresOpciones: boolean = false; 
    habitaciones: any[] = [];
    contadorPos: number = 0;

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
            planes: ['', Validators.required],                            
            nombre: ['', Validators.required],
            apellido: ['', Validators.required],
            servicio: ['', Validators.required],
            fecha_entrada: ['', Validators.required],
            fecha_salida: ['', Validators.required],    
            tipo_habitacion: ['', Validators.required],    
                    

            nombre_solicitante: ['', Validators.required],
            apellidos_solicitantes: ['', Validators.required],
            correo_solicitante: ['', Validators.required],
            telefono_solicitantes: ['', Validators.required],
            ciudad_solicitante: ['', Validators.required],
            
            menores: ['', Validators.required],
            apellidos: ['', Validators.required],            
            nombres_habitaciones: ['', Validators.required],            
            apellidos_habitaciones: ['', Validators.required],            
            edad_habitaciones: ['', Validators.required],      
            
            grados: this._formBuilder.array([]),
            adultos: [1, Validators.required],      
            nombreApellido: this._formBuilder.array([]),                  

            nombre_1: ['', Validators.required],            
            nombre_2: ['', Validators.required],            
            nombre_3: ['', Validators.required],            
            // estatus: [false],            
        });

        // this.verificarOpcionesSeleccionadas();
        
        try {
            await this.eventos();            
        } catch (error) {
            console.error('Error en ngOnInit:', error);
        } 
                        
        this.createForm.get('events').valueChanges.subscribe(async selectedEventId => {                          

            const selectedEvent = this.events.find(event => event.id === selectedEventId);                
            if (selectedEvent) {                
                const id = selectedEvent.id                
                this.idEventSelect = id;
                this.eventoId(id);
            }
        });

        this.createForm.get('planes').valueChanges.subscribe(async selectedPlanId => {                    
            this.planId(selectedPlanId);            
        });


        this.createForm.get('adultos').valueChanges.subscribe((adultosCount: number) => {
            this.generateNombreApellidoControls(adultosCount);
        });

        this.agregarGradoAcademico();
    }

    nextTwo(): void { 


        this._router.navigateByUrl('/create/reservations/two');   

        // Do nothing if the form is invalid
        // if (this.createForm.invalid) {
        //     return;
        // }

        // Disable the form
        // this.createForm.disable();

        // const fechaInicioFormatted = formatDate(this.createForm.value.vigencia, 'yyyy-MM-dd', 'en-US');

        // var datos = {
        //     nombre: this.createForm.value.nombre,
        //     porcentaje: this.createForm.value.porcentaje,
        //     vigencia: fechaInicioFormatted,
        //     codigo_descuento: this.createForm.value.codigo_descuento,
        //     cantidad: this.createForm.value.cantidad,            
        //     estatus: this.createForm.value.estatus,
        // };             

        // try {            
        //     this._discountsService.create(datos).subscribe(                
        //         ({ result, message }: { result: boolean; message: string }) => {
        //             if (result) {
        //                 if (result) {
        //                     this.alertService.alertConfirmation(
        //                         'success',
        //                         message
        //                     );
        //                     this._router.navigateByUrl('/discounts');
        //                 } else {
        //                     this.createForm.enable();       
        //                     this.alertService.alertConfirmation(
        //                         'error',
        //                         message
        //                     );
        //                 }
        //             } else {
        //                 this.createForm.enable();       
        //                 this.alertService.alertConfirmation('error', message);
        //             }
        //         }
        //     );
        // } catch (error) {
        //     this.createForm.enable();       
        //     this.alertService.alertConfirmation('error', error);
        // }
    }    

    async eventos(): Promise<void>{

        try {
            const selectedId = this.sharedData ? this.sharedData.evento_id : ''; 
            const response = await this._eventsService.getEventV2().toPromise();
            const { result, message, data } = response;

                console.log(data);
                if (result) {
                    this.data = data;                            
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

    async eventoId(id: number): Promise<void> {
              
        try {
            const result = this.data.find((eventsArray) => eventsArray.id === id);
            // console.log(result)                              
      
          if (result) {

            // Servicios
            const serviciosArray = [];
            if (result && result && result.hotel) {
              this.nombreHotel = result.hotel.nombre;
              this.createForm.get('nombre').setValue(this.nombreHotel);
            }
      
            if (result && result && result.available_categories) {
              for (let i = 0; i < result.available_categories.length; i++) {
                const category = result.available_categories[i].category;
                var space = "";
                if(i>0){
                  space = " ";
                }
                serviciosArray.push(space+category.descripcion);
              }
            } else {
              console.error('No se pudieron encontrar las categorías de servicios.');
            }
      
            // console.log(serviciosArray)
            this.servicios = serviciosArray;


            // Planes 
            const planesArray = [];
            if (result && result && result.hotel && result.hotel.rooms_by_hotels) {
              const roomsByHotels = result.hotel.rooms_by_hotels;
              const nombresYaAgregados = new Set();
              
              for (let i = 0; i < roomsByHotels.length; i++) {

                const planId = roomsByHotels[i].plan.id;
                const planNombre = roomsByHotels[i].plan.nombre;                

                if (planId && planNombre && !nombresYaAgregados.has(planNombre)) {
                  planesArray.push({ id: planId, nombre: planNombre });
                  nombresYaAgregados.add(planNombre); // Agregar el nombre al Set
                }
              }
            } else {
              console.error('No se pudieron encontrar los planes.');
            }
      
            // console.log(planesArray);
            this.tiposDePlanSeleccionados = planesArray;


          } else {
            console.error('Error al obtener el evento:', 'error');
          }
        } catch (error) {
          console.error('Error en eventoId:', error);
        }
    }            

    async planId(id: number): Promise<void> {
        try {            
          const selectedHotel = this.data.find(tipo => tipo.hotel.rooms_by_hotels.some(room => room.plan_id === id));
          if (selectedHotel) {

            this.selectedPlanData = selectedHotel.hotel.rooms_by_hotels.filter(room => room.plan_id === id);
            console.log(this.selectedPlanData);             


          } else {
            this.selectedPlanData = null;
            console.log('No se encontraron datos para el plan seleccionado.');
          }
        } catch (error) {
          console.error('Error en eventoId:', error);
        }
    }
      
      
    
    get gradosArray() {
        return this.createForm.get('grados') as FormArray;
    }

    agregarGradoAcademico() {
        this.contadorPos++;
        const nuevosGradosAcademico = this._formBuilder.group({            
            tipo_habitacion: ['', Validators.required],
            cantidad: ['', Validators.required]

        });
    
        this.gradosArray.push(nuevosGradosAcademico);        
        this.verificarOpcionesSeleccionadas();    
    }    
    
    verificarOpcionesSeleccionadas() {   
      this.seleccionadasTresOpciones = this.selectedPlanData && this.gradosArray.controls.length === this.selectedPlanData.length;               

      console.log("Opciones seleccionadas", this.seleccionadasTresOpciones)
    }

    eliminarGradoAcademico(index: number) {
        this.gradosArray.removeAt(index);
        this.verificarOpcionesSeleccionadas();
    }



    mostrarEnConsola(event: any, i: any) {
      const cantidad = event.target.value;

      const tal = this.createForm.value.grados.map((grado_academico: any) => ({                
        tipo_habitacion: grado_academico.tipo_habitacion,
        cantidad: grado_academico.cantidad,
      }))

      console.log(tal);
      // Puedes hacer más cosas con el valor si es necesario

      // Construir el objeto deseado
      const constructedObject = {
        tipo_habitacion: '',
        cantidad_adulto: 0,
        cantidad_menores: 0,
        adulto: [],
        menores: []
      };

      console.log(constructedObject);

    }
    

    mostrarNombreHabitacion(event: any, i:number) {      
      const valorSeleccionado = event.value;        
      const habitacionSeleccionada = this.selectedPlanData.find(plan => plan.id === valorSeleccionado);      
      const nombreHabitacion = habitacionSeleccionada ? habitacionSeleccionada.tipo_habitacion : 'No seleccionado';        
      console.log(nombreHabitacion);
    }

      
    generateNombreApellidoControls(adultosCount: number): void {
        const nombreApellidoControls = [];
      
        for (let i = 1; i <= adultosCount; i++) {
          nombreApellidoControls.push(this._formBuilder.group({
            nombre: ['', Validators.required],
            apellido: ['', Validators.required],
          }));
        }
      
        const formArray = this.createForm.get('nombreApellido');
      
        if (formArray instanceof FormArray) {
          formArray.clear();
          nombreApellidoControls.forEach(control => formArray.push(control));
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
