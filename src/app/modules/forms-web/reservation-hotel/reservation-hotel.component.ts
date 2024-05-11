import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LandingHomeService } from 'app/services/landing-home/landing-home.service';
import { environment } from 'environments/environment';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { 
    FormGroup, 
    FormsModule, 
    NgForm, 
    ReactiveFormsModule, 
    UntypedFormBuilder, 
    Validators, 
    UntypedFormGroup, 
    ValidatorFn,
    AbstractControl,
    FormControl,
    FormArray
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedService } from 'app/services/shared/shared.service';
import { MatOptionModule, ThemePalette } from '@angular/material/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { AlertService } from 'app/services/alert/alert.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgClass, NgFor, NgIf, NgStyle, formatDate } from '@angular/common';


import { CategoriesService } from 'app/services/categories/categories.service';
import { CountrysService } from 'app/services/countrys/countrys.service';
import { EventsService } from 'app/services/events/events.service';
import { AssistantsService } from 'app/services/assistants/assistants.service';
import { TaxRegimesService } from 'app/services/tax_regimes/tax-regimes.service';
import { CfdiService } from 'app/services/cfdi/cfdi.service';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { PaymentTypeService } from 'app/services/payment_type/payment-type.service';
import { AuthService } from 'app/core/auth/auth.service';
import { ReservationsFormWebService } from 'app/services/reservations-form-web/reservations-form-web.service';
import { ReservationsService } from 'app/services/reservations/reservations.service';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { PlanTypesService } from '../../../services/plan_types/plan-types.service';
//import para calendarios
import { Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'app/modules/admin/components/modal/modal.component';

declare var OpenPay: any;

@Component({
    selector     : 'reservation-hotel',
    templateUrl  : './reservation-hotel.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./reservation-hotel.component.scss'],
    standalone   : true,
    imports      : [
        MatButtonModule, 
        RouterLink, 
        MatIconModule, 
        CommonModule, 
        CarouselModule, 
        FormsModule, 
        ReactiveFormsModule, 
        MatFormFieldModule, 
        MatCheckboxModule, 
        MatRadioModule, 
        TextFieldModule, 
        MatIconModule, 
        MatButtonToggleModule, 
        NgClass, 
        NgFor, 
        NgIf, 
        NgStyle, 
        MatProgressSpinnerModule, 
        MatChipsModule, 
        MatDatepickerModule, 
        MatSelectModule, 
        MatTableModule, 
        MatOptionModule, 
        MatInputModule,
        MatStepperModule,
        NgxMaskDirective,
        MatNativeDateModule,
    ],
    providers: [
      provideNgxMask(),
      { provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
    ],
})
export class ReservationHotelComponent
{
    @ViewChild('createAssistants') createAssistants: NgForm;

    showListEvents: boolean = false;
    showMobileMenu: boolean = false;

    landing: any;
    URL = environment.urlImg;
    listaEventos: [];
    slugLandingEvento: any = '';
    landingEvento: any = {};

    galleryHotel: string[] = [];

    availableCategories = [];
    hotel: any = {};
    programas = [];
    programasAgrupados = [];             
    base64Data: string = '';
    siRequiere: string = 'si';
    Isfacturacion: boolean = true;
    categories: any[] = [];        
    countrys: any[] = [];
    categoriesArray: any[] = [];
    eventoArray: any[] = [];
    taxRegimes: any[] = [];
    cfdis: any[] = [];
    createForm: FormGroup;
    imagenUp: boolean = false;

    costo: number = 0;

    //forms
    secondForm: FormGroup;

    //variables del evento
    eventoActual: any = {};
    datosAsistente: any = {};

    //variables funcionalidad front
    isEnableFirstDisplay: boolean = true;
    isEnableSecondDisplay: boolean = false;
    isEnableThirdDisplay: boolean = false;
    isUserAutheticate: boolean = false;

    //variables primera pantalla
    servicesHotel = [];
    typesPlans = []; // tipos de planes
    habitacionesPorHotel: any[] = [];
    habitacionesPorPlan: any[] = [];
    
    //variables segunda pantalla
    selectedCategoryId: any = '';
    selectedAvalibleCategory: any = {};

    horizontalStepperForm: FormGroup;
    // NEW VARIABLES
    isChecked = true;
    color: ThemePalette = 'primary';
    checked = false;
    disabled = false;    
    estatus: string = '';  
    events: any[] = [];  
    sharedData: any;    
    nombreHotel: string = '';  
    data: any[] = [];
    servicios: any[] = [];  
    tiposDePlanSeleccionados: any[] = []; 
    idEventSelect: number;      
    selectedPlanData: any;
    grados: any[] = []; 
    seleccionadasTresOpciones: boolean = false; 
    contadorPos: number = 0;
    nochesDisponibles: number;  
    cantidad_adultos: any[] = []; 
    desglose: any[] = []; 
    desgloseMenores: any[] = []; 
    sumaCostoMenores: number = 0;
    sumaCostoAdulto: number = 0;
    idHotel: number;
    paymentTypes: any[] = [];

    showOpenpayForm: boolean = false;
    showComprobanteForm: boolean = false;
    showDepositoForm: boolean = false;
    archivoSeleccionado: boolean = false;
    formularioLleno: boolean = false;
    totalMonto: number = 0;
    comprobantes: any[] = [];
    tokenOpenPay: string;
    deviceSessionId: string;
    cantidadPersonas: number;
    idPlan: number;
    todoIncluido: number;
    total: number;
    totalVerificar: number;

    /**
     * Constructor
     */
    constructor(private _landingHomeService: LandingHomeService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _shareService: SharedService,
        private _formBuilder: UntypedFormBuilder,
        private alertService: AlertService,
        private _cfdiService: CfdiService,
        private _taxRegimesService: TaxRegimesService,
        private _paymentTypeService: PaymentTypeService,
        private _reservationsFormWeb: ReservationsFormWebService, 
        private _reservationsService: ReservationsService,
        private _eventsService: EventsService,
        private _adapter: DateAdapter<any>,
        @Inject(MAT_DATE_LOCALE) private _locale: string,
        private dialog: MatDialog
        )
    {
      //importante: configuracion de calendarios en español
      //formato: DD-MM-yyyy
      this._locale = 'es';
      this._adapter.setLocale(this._locale);

        this.landing = {
            nosotros: '',
            mensaje: '',
            telefono_fijo: '',
            telefono_movil: '',
            correo_contacto: '',
            url_facebook: '',
            domicilio: '',
            imagen: ''
        };

        this.getLanding();
        
        this.activatedRoute.parent.params.subscribe(async params => {
            this.slugLandingEvento = (params['slug']);
            //console.log(this.slugLandingEvento);
            this.getLandingEvento();
        });
        //this.getPlanTypes();
        this.regimesFiscales();
        this.cfdiApi();

        // Horizontal stepper form
        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({

                // email   : ['', [Validators.required, Validators.email]],                
                events: ['', Validators.required],  
                nombre: ['', Validators.required],
                servicio: ['', Validators.required], 

            }),
            step2: this._formBuilder.group({                

                planes: ['', Validators.required],                            
                fecha_entrada: ['', Validators.required],
                fecha_salida: ['', [Validators.required, this.fechaSalidaValida()]],                   
                grados: this._formBuilder.array([]),                

            }),
            step3: this._formBuilder.group({                

                nombre_solicitante: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[a-zA-Z\s]*$/)]],
                apellidos_solicitantes: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[a-zA-Z\s]*$/)]],
                correo_solicitante: ['', [Validators.required, Validators.email]],                
                telefono_solicitantes: ['', Validators.required],
                ciudad_solicitante: ['', Validators.required],
                                
            }),
            step4: this._formBuilder.group({                
                habitaciones: this._formBuilder.array([]),                
            }),
            step5: this._formBuilder.group({                                     
              // clave_reservacion: [''],
              // tipo_pago: [''],
              // numero_movimiento: [''],
              // fecha: [''],
              // monto: [''],

              clave_reservacion: [''],
              tipo_pago: [''],
              pdf_programa: [''],
              fecha: [''],
              monto: [''],
              numero_movimiento: [''],

              nombres_openpay: ['Juan'],
              apellidos_openpay: ['Perez Ramirez'],
              email_openpay: ['', Validators.email],
              ciudad_openpay: ['Querétaro'],
              estado_openpay: ['Querétaro'],
              cp_openpay: ['76900'],
              direccion_openpay: ['Av 5 de Febrero'],
              numero_openpay: ['4111111111111111'],
              mes_openpay: ['03'],
              año_openpay: ['25'],
              cvv2_openpay: ['110'],
              monto_openpay: [''],
              descripcion_openpay: [''],
              observaciones: [''],
            }),
            
        });

        this.horizontalStepperForm.get('step1.events').valueChanges.subscribe(async selectedEventId => {
            
            // console.log(selectedEventId)
            const selectedEvent = this.events.find(event => event.id === selectedEventId);                
            
            if (selectedEvent) {                
                const id = selectedEvent.id                
                this.idEventSelect = id;
                this.eventoId(id);
            }
        });

        this.horizontalStepperForm.get('step2.planes').valueChanges.subscribe(async selectedPlanId => {                    

            if (selectedPlanId) {   
                this.planId(selectedPlanId);                         
            }
        });
        
        this._paymentTypeService.getPublicList().subscribe(
          ({ result, message, data  }: { result: boolean; message: string; data: any[] }) => {
                if (result) {
                    this.paymentTypes = data;  
                    this.horizontalStepperForm.get('tipo_pago').setValue(data[0].id); 
                } else {
                    console.error(
                        'Error al obtener la lista:',
                        message
                    );
                }
            },
            (error) => {
                console.error('Error al obtener la lista:', error);
            }
        );

        this.horizontalStepperForm.get('step5.tipo_pago').valueChanges.subscribe(async paymentId => {
          if (paymentId) {
            this.showComprobanteForm = paymentId === 1;
          }
          if (paymentId) {
            this.showOpenpayForm = paymentId === 2;
          }
          if(paymentId) {
            this.showDepositoForm = paymentId === 3;
          }
        });

        this.agregarGradoAcademico();

    }

    fechaSalidaValida(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} | null => {
            const fechaSalida = control.value;
            const fechaEntrada = this.horizontalStepperForm?.get('step2')?.get('fecha_entrada')?.value;
            const invalid = fechaSalida && fechaEntrada && fechaSalida <= fechaEntrada;
            return invalid ? { 'fechaSalidaInvalida': {value: control.value} } : null;
        };
    }

    getDataFromPreviousSteps(): any {
        const step1Data = this.horizontalStepperForm.get('step1').value;
        const step2Data = this.horizontalStepperForm.get('step2').value;
        const step3Data = this.horizontalStepperForm.get('step3').value;
        const step4Data = this.horizontalStepperForm.get('step4').value;

        return {
            step1: step1Data,
            step2: step2Data,
            step3: step3Data,
            step4: step4Data,
        };
    };

    getLanding() {
        this._landingHomeService.getLanding().subscribe(
            (response: any) => {
                if (response.result) {
                    const data = response.data;
                    this.asignarValores(data);
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

    getLandingEvento() {
        this._reservationsFormWeb.getLandingEvento(this.slugLandingEvento).subscribe(
            (response: any) => {
                if (response.result) {
                    const data = response.data;
                    //validacion si no se encuentra el evento
                    if(data === null) {
                        this.router.navigate(['/home']);
                    }
                    this.landingEvento = data;
                    this.eventoActual = this.landingEvento.evento;
                    this.hotel = this.eventoActual.hotel;
                    this.horizontalStepperForm.get('step1.events').setValue(this.eventoActual.nombre);
                    this.horizontalStepperForm.get('step1.nombre').setValue(this.eventoActual.hotel.nombre);
                    this.convertServicesToText(this.eventoActual.hotel.servicios);
                    this.events.push(this.eventoActual);
                    this.convertServicesToText(this.eventoActual?.hotel?.servicios);
                    this.habitacionesPorHotel = this.eventoActual.hotel.rooms_by_hotel ? this.eventoActual.hotel.rooms_by_hotel : [];
                    this.getPlanTypes()
                    console.log(this.landingEvento);
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

    getPlanTypes() {
        this._reservationsFormWeb.getPlanTypes().subscribe(
            (response: any) => {
                if(response.result) {
                    this.typesPlans = response.data;
                    //this.tiposDePlanSeleccionados = response.data;
                    const rooms_by_hotels = this.hotel.rooms_by_hotels;
                    this.tiposDePlanSeleccionados = this.typesPlans.filter(plan => 
                      rooms_by_hotels.some(hotel => plan.id === hotel.plan_id)
                    );
                }
            },
            (error) => {
                console.log('Error al obtener la lista:', error)
            }
        )
    }

    convertServicesToText(arrayServicios: any[] = []) {
        //obtenemos todos los nombres de los servcios en un array
        let servicios = arrayServicios.map(objeto => objeto.descripcion);
        //unimos todos los nombres de los servicios en una cadena
        let serviciosText = servicios.length > 0 ? servicios.join(', ') : '';
        this.horizontalStepperForm.get('step1.servicio').setValue(serviciosText);
    }

    asignarValoresEvento() {
        this.landingEvento = this.listaEventos.find((objeto: any) => objeto.slug === this.slugLandingEvento);
        this.availableCategories = this.landingEvento.evento.available_categories;
        this.eventoActual = this.landingEvento.evento;
    }

    asignarValores(data: any) {
        const srcNosotros = this.URL + '/assets/images/' + data.imagen;
        const telMovilFormateado = data.telefono_movil.slice(0, 3) + '-' + data.telefono_movil.slice(3, 6) + '-' + data.telefono_movil.slice(6);
        const telFijoFormateado = data.telefono_fijo.slice(0, 3) + '-' + data.telefono_fijo.slice(3, 6) + '-' + data.telefono_fijo.slice(6);
        this.landing.nosotros = data.nosotros;
        this.landing.mensaje = data.mensaje;
        this.landing.telefono_fijo = telFijoFormateado;
        this.landing.telefono_movil = telMovilFormateado;
        this.landing.correo_contacto = data.correo_contacto;
        this.landing.url_facebook = data.url_facebook;
        this.landing.domicilio = data.domicilio;
        this.landing.imagen = srcNosotros;

        //console.log(this.landing);
    }

    scrollToSection(id: string): void {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    redirectSingUp() {
        const accessToken = localStorage.getItem('accessToken');
        if(accessToken) {
            this.router.navigate(['/menu']);
        }else {
            this.router.navigate(['/sign-up']);
        }
    }

    next(): void { 
        this.isEnableFirstDisplay = false;
        this.isEnableSecondDisplay = true;    
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
                this.router.navigateByUrl('/assistants');
            }
        });    
    }
    

    alertConfirmation(icon: SweetAlertIcon, title: string): void {
        this.alertService.alertConfirmation(icon, title);
    }

    regresar(): void {
        this._shareService.setSharedData(this.sharedData);
        this.router.navigateByUrl('/create/assistants');
    }

    cfdiApi(){ 
        this._cfdiService.obtenerLista().subscribe(          
            (response) => {
                if(response.result) {
                    this.cfdis = response.data;
                } 
            },
            (error) => {
                console.error('Error al obtener la lista:', error);
            }
        ); 
    }

    regimesFiscales(){ 
        this._taxRegimesService.obtenerLista().subscribe(          
            (response) => {
                if(response.result) {
                    this.taxRegimes = response.data;
                }
            },
            (error) => {
                console.error('Error al obtener la lista:', error);
            }
        ); 
    }

    goToHome() {
        this.router.navigate(['/evento/'+ this.slugLandingEvento]);
    }

    redirectToRegisterEvent() {
        this.router.navigate(['/registro/evento/'+ this.slugLandingEvento]);
    }

    selectPlanType(event: any) {
        let selectedPlanTypeId = event.value;
        this.habitacionesPorPlan = this.habitacionesPorHotel.filter((item) => item.plan_id === selectedPlanTypeId);
        console.log(this.habitacionesPorHotel);
        console.log(this.habitacionesPorPlan);
    }

    dateFilter = (date: Date | null): boolean => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Ajustar a la medianoche actual
    
        return date && date >= today;
      };
  
  
  
  
      cantidadValidator(control: AbstractControl): { [key: string]: boolean } | null {
        const cantidad = control.value;
    
        // Validar que la cantidad esté en el rango deseado (1 al 10)
        if (cantidad && (cantidad < 1 || cantidad > 10)) {
          return { 'fueraDeRango': true };
        }
    
        return null; // La validación pasa
      }
      
      get habitaciones() {
        return this.horizontalStepperForm.get('step4.habitaciones') as FormArray;
      }

  agregarEliminarPersonas(index: number, tipo_persona: string) {
    const habitaciones = this.habitaciones.controls;
    const habitacion = habitaciones[index];
    const cantidad = habitacion.get('cant_' + tipo_persona).value;
    const personas = habitacion.get(tipo_persona).value;

    const cantidadTotal = habitacion.get('cant_adultos').value + habitacion.get('cant_menores').value;

    if (cantidadTotal > 4) {
      console.error('La cantidad total de personas no puede ser mayor a 4');
      return;
    }


    if (cantidad > personas.length) {
      while (cantidad > personas.length) {
        const persona = this._formBuilder.group({
          nombre: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[a-zA-Z\s]*$/)]],
          apellido: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[a-zA-Z\s]*$/)]]
        });

        if (tipo_persona === "menores") {
          persona.addControl('edad', new FormControl('', [Validators.required, Validators.maxLength(18), this.edadValidator]));
        }

        personas.push(persona);
      }
    } else if (cantidad < personas.length) {
      while (cantidad < personas.length) {
        personas.removeAt(personas.length - 1);
      }
    }

    // Validar el formulario después de agregar o eliminar personas
    this.horizontalStepperForm.get('step4').updateValueAndValidity();
  }
  
  validarCantidadTotalPersonas(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const habitacion = control.parent;
      if (!habitacion) return null;

      const cantidadAdultos = habitacion.get('cant_adultos').value;
      const cantidadMenores = habitacion.get('cant_menores').value;
      const cantidadTotal = cantidadAdultos + cantidadMenores;

      const invalid = cantidadTotal > 4;
      return invalid ? { 'cantidadTotalExcedida': { value: control.value } } : null;
    };
  }
  
  
    goToStep4() {

      this.limpiarArr();
  
  
      const dataFromPreviousSteps = this.getDataFromPreviousSteps();
      // console.log('Data de pasos anteriores:', dataFromPreviousSteps);
  
      const gradosArray = this.horizontalStepperForm.get('step2.grados') as FormArray;
  
      for (const control of gradosArray.controls) {
        const idTipoHabitacion = control.get('tipo_habitacion').value;
        const cantidad = control.get('cantidad').value;
        const habitacion = this.selectedPlanData.find(hab => hab.id === idTipoHabitacion);
        const tipo_habitacion = habitacion.tipo_habitacion;
  
        for (let index = 0; index < cantidad; index++) {
          const adulto = this._formBuilder.group({
            nombre: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[a-zA-Z\s]*$/)]],
            apellido: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[a-zA-Z\s]*$/)]]
          });
  
          const habitacion = this._formBuilder.group({
            cant_adultos: [1, [Validators.required, this.validarCantidadTotalPersonas()]],
            cant_menores: [0, [this.validarCantidadTotalPersonas()]],
            adultos: [this._formBuilder.array([adulto])],
            menores: [this._formBuilder.array([])],
            tipo_habitacion: [tipo_habitacion],
            id_tipo_habitacion: [idTipoHabitacion]
          });
          this.habitaciones.push(habitacion);
        }
  
      }
  
      const habitacionesArray = (this.horizontalStepperForm.get('step4.habitaciones') as FormArray).value;
      // console.log("habitacionesArray: ", habitacionesArray);
  
      // Validar el formulario antes de pasar al siguiente paso
      this.horizontalStepperForm.get('step4').updateValueAndValidity();
  
      // Continuar solo si el formulario es válido
      if (this.horizontalStepperForm.get('step4').valid) {
        // Resto de tu código para pasar al siguiente paso
      }
    }
  
  
      todosLosCamposLlenos(): boolean {      
        for (const habCtrl of this.habitaciones.controls) {
  
          const adultos = habCtrl.get('adultos').value.controls;   
          const menores = habCtrl.get('menores').value.controls;        
  
          for (const adulto of adultos) {
            const nombre = adulto.get('nombre').value;
            const apellido = adulto.get('apellido').value;
            if (!nombre || nombre === "" || !apellido || apellido === "") {            
              return false; // Si falta algún campo, devuelve false
            }
          }
  
          for (const menor of menores) {
            const nombre = menor.get('nombre').value;
            const apellido = menor.get('apellido').value;
            const edad = menor.get('edad').value;
            if (!nombre || nombre === "" || !apellido || apellido === "" || !edad || edad === "") {            
              return false; // Si falta algún campo, devuelve false
            }
          }            
        }
      
        return true; // Si todos los campos están llenos, devuelve true
      }
  
      limpiarArr() {
        const habitacionesArray = this.horizontalStepperForm.get('step4.habitaciones') as FormArray;
        habitacionesArray.clear();
      }

  calculoAdultosMenores() {

    // const dataFromPreviousSteps = this.getDataFromPreviousSteps();
    // console.log(dataFromPreviousSteps)

    const fecha_entrada = this.horizontalStepperForm.get('step2.fecha_entrada').value;
    const fecha_salida = this.horizontalStepperForm.get('step2.fecha_salida').value;

    const fechaEntrada = new Date(fecha_entrada);
    const fechaSalida = new Date(fecha_salida);

    const diferenciaMilisegundos = fechaSalida.getTime() - fechaEntrada.getTime();

    const diferenciaDias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

    // console.log('Noches disponibles:', diferenciaDias);
    this.nochesDisponibles = diferenciaDias;




    const habitaciones = this.horizontalStepperForm.get('step4.habitaciones') as FormArray;

    this.desglose = [];
    this.desgloseMenores = [];

    for (const control of habitaciones.controls) {

      const tipoHabitacion = control.get('tipo_habitacion').value;
      const cantidad_adulto = control.get('cant_adultos').value;
      const idTipoHabitacion = control.get('id_tipo_habitacion').value;

      // ADULTOS
      const habitacion = this.selectedPlanData.find(hab => hab.id === idTipoHabitacion);
      let precioPorNoche = 0;

      // console.log("testtt", habitacion)

      if (cantidad_adulto === 1) {
        precioPorNoche = habitacion.sencilla;
      } else if (cantidad_adulto === 2) {
        precioPorNoche = habitacion.doble;
      } else if (cantidad_adulto === 3) {
        precioPorNoche = habitacion.triple;
      } else if (cantidad_adulto === 4) {
        precioPorNoche = habitacion.cuadruple;
      }
      this.cantidadPersonas = cantidad_adulto;
      // console.log(this.cantidadPersonas)

      let costoTotal = precioPorNoche * this.nochesDisponibles;

      if(this.idPlan === 1){
        costoTotal = costoTotal * this.cantidadPersonas;
      }

      var obj = {
        tipo_habitacion: tipoHabitacion,
        costo: costoTotal,
        idTipoHabitacion: idTipoHabitacion
      }

      this.desglose.push(obj);

      this.sumaCostoAdulto = 0;
      for (const desgloseAdultoFinal of this.desglose) {
        this.sumaCostoAdulto = this.sumaCostoAdulto + desgloseAdultoFinal.costo
      }

      console.log("suma de adulto", this.sumaCostoAdulto)
      // FIN DE ADULTOS



      // INFANTES, MENORES Y JUNIOR PARTE PARA QUE CHATGPT ME AYUDE        
      const cantidad_menores = control.get('cant_menores').value;
      const menores = control.get('menores').value.controls;

      for (const menor of menores) {

        let precioPorNocheMenores = 0;
        const edad = menor.get('edad').value;
        // console.log("edad menores", edad)

        if (cantidad_menores === 1) {

          if (edad >= habitacion.infante_edad_minima && edad <= habitacion.infante_edad_maxima) {  //6
            precioPorNocheMenores = habitacion.infante_precio_menores;
          } else if (edad >= habitacion.edad_minima && edad <= habitacion.edad_maxima) {
            precioPorNocheMenores = habitacion.precio_menores;
          } else {
            precioPorNocheMenores = habitacion.junior_precio_menores;
          }

        } else if (cantidad_menores === 2) {

          if (edad >= habitacion.infante_edad_minima && edad <= habitacion.infante_edad_maxima) {
            precioPorNocheMenores = habitacion.infante_precio_menores;
          } else if (edad >= habitacion.edad_minima && edad <= habitacion.edad_maxima) {
            precioPorNocheMenores = habitacion.precio_menores;
          } else {
            precioPorNocheMenores = habitacion.junior_precio_menores;
          }

        } else if (cantidad_menores === 3) {

          if (edad >= habitacion.infante_edad_minima && edad <= habitacion.infante_edad_maxima) {
            precioPorNocheMenores = habitacion.infante_precio_menores;
          } else if (edad >= habitacion.edad_minima && edad <= habitacion.edad_maxima) {
            precioPorNocheMenores = habitacion.precio_menores;
          } else {
            precioPorNocheMenores = habitacion.junior_precio_menores;
          }

        } else if (cantidad_menores === 4) {

          if (edad >= habitacion.infante_edad_minima && edad <= habitacion.infante_edad_maxima) {
            precioPorNocheMenores = habitacion.infante_precio_menores;
          } else if (edad >= habitacion.edad_minima && edad <= habitacion.edad_maxima) {
            precioPorNocheMenores = habitacion.precio_menores;
          } else {
            precioPorNocheMenores = habitacion.junior_precio_menores;
          }

        }

        const costoTotalMenores = precioPorNocheMenores * this.nochesDisponibles;

        var objMenores = {
          tipo_habitacion: tipoHabitacion,
          costo: costoTotalMenores,
          idTipoHabitacion: idTipoHabitacion
        }

        this.desgloseMenores.push(objMenores);
      }

      this.sumaCostoMenores = 0;
      for (const desgloseMenoresFinal of this.desgloseMenores) {
        this.sumaCostoMenores = this.sumaCostoMenores + desgloseMenoresFinal.costo
      }

      // console.log("suma de menores", this.sumaCostoMenores)

      // FIN INFANTES, MENORES Y JUNIOR PARTE PARA QUE CHATGPT ME AYUDE      


      this.total = this.sumaCostoAdulto + this.sumaCostoMenores;
      // console.log("total", this.sumaCostoAdulto + this.sumaCostoMenores)
      this.todoIncluido = this.total;
      // console.log("todoIncluido", this.cantidadPersonas * this.total)


      // console.log("total", this.total + " " + this.todoIncluido)
      this.totalVerificar = this.idPlan === 1 ? this.todoIncluido : this.sumaCostoAdulto + this.sumaCostoMenores;

    }

};
  
      async eventoId(id: number): Promise<void> {
                
          try {
              const result = this.data.find((eventsArray) => eventsArray.id === id);
              // console.log("Resultado del eventoId", result)                              
        
            if (result) {
  
              // Servicios
              const serviciosArray = [];
              if (result && result && result.hotel) {
                this.idHotel = result.hotel.id;
                this.nombreHotel = result.hotel.nombre;
                this.horizontalStepperForm.get('step1.nombre').setValue(this.nombreHotel);
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
  
              //console.log("id", id);
              this.idPlan = id;

            if (this.hotel) {
  
              this.selectedPlanData = this.hotel.rooms_by_hotels.filter(room => room.plan_id === id);
              //console.log(this.selectedPlanData);             
  
            } else {
              this.selectedPlanData = null;
              console.log('No se encontraron datos para el plan seleccionado.');
            }
          } catch (error) {
            console.error('Error en eventoId:', error);
          }
      }
  
      get gradosArray() {
          return this.horizontalStepperForm.get('step2.grados') as FormArray;
      }
  
      agregarGradoAcademico() {
          this.contadorPos++;
          const nuevosGradosAcademico = this._formBuilder.group({            
              tipo_habitacion: ['', Validators.required],
              cantidad: ['', [Validators.required, this.cantidadValidator]],
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

      async create(): Promise<void> {
        // Do nothing if the form is invalid
        if (this.horizontalStepperForm.invalid) {          
            return;
        }
  
        // Disable the form
        this.horizontalStepperForm.disable();

        if (this.showOpenpayForm) {
          await this.setupOpenPay();
        }
  
        // Formatea las fechas al formato deseado ("yyyy-MM-dd")
        const fechaInicioFormatted = formatDate(this.horizontalStepperForm.get('step2.fecha_entrada').value, 'yyyy-MM-dd', 'en-US');
        const fechaTerminoFormatted = formatDate(this.horizontalStepperForm.get('step2.fecha_salida').value, 'yyyy-MM-dd', 'en-US');
  
        var datos = {
            event_id: this.eventoActual.id,            
            hotel_id: this.hotel.id,     
            plan_id: this.horizontalStepperForm.get('step2.planes').value,  
            fecha_entrada: fechaInicioFormatted,
            fecha_salida: fechaTerminoFormatted,
            cantidad_noches: this.nochesDisponibles,
            nombre_solicitante: this.horizontalStepperForm.get('step3.nombre_solicitante').value,
            apellido_solicitante: this.horizontalStepperForm.get('step3.apellidos_solicitantes').value,            
            correo_solicitante: this.horizontalStepperForm.get('step3.correo_solicitante').value,  
            telefono_solicitante: this.horizontalStepperForm.get('step3.telefono_solicitantes').value,            
            ciudad_solicitante: this.horizontalStepperForm.get('step3.ciudad_solicitante').value, 
            monto_total: this.sumaCostoAdulto + this.sumaCostoMenores, 
            reservation_details: [],
            reservation_rooms: [],
            payment_id: this.horizontalStepperForm.get('step5.tipo_pago').value,
            comprobantes: this.comprobantes,
            device_sesion: this.deviceSessionId,
            monto_openpay: this.horizontalStepperForm.get('step5.monto_openpay').value,
            nombres_openpay: this.horizontalStepperForm.get('step5.nombres_openpay').value,
            apellidos_openpay: this.horizontalStepperForm.get('step5.apellidos_openpay').value,
            email_openpay: this.horizontalStepperForm.get('step5.email_openpay').value,
            descripcion_openpay: this.horizontalStepperForm.get('step5.descripcion_openpay').value,
            openPay: this.tokenOpenPay,
            observaciones: this.horizontalStepperForm.get('step5.observaciones').value
            // servicio: this.horizontalStepperForm.get('step1.servicio').value,
            // clave_reservacion: this.horizontalStepperForm.get('step5.clave_reservacion').value,
            // tipo_pago: this.horizontalStepperForm.get('step5.tipo_pago').value,                        
            // numero_movimiento: this.horizontalStepperForm.get('step5.numero_movimiento').value,            
            // fecha: this.horizontalStepperForm.get('step5.fecha').value,      
        };
              
  
        for (let i = 0; i < this.desglose.length; i++) {
          const desglose = this.desglose[i];
          
          const obj = {
            concept: `${desglose.tipo_habitacion}`, //#${i + 1}
            price: desglose.costo
          };
        
          datos.reservation_details.push(obj);
        }      
        
        var objMenores = {
          concept: "menores",
          price: this.sumaCostoMenores
        }
        datos.reservation_details.push(objMenores);
  
  
        
        const habitaciones = this.horizontalStepperForm.get('step4.habitaciones').value;      
  
        for (let i = 0; i < habitaciones.length; i++) {
          const habitacion = habitaciones[i];
          
          const obj = {
            room_id: habitacion.id_tipo_habitacion,
            adults_quantity: habitacion.cant_adultos,
            minor_quantity: habitacion.cant_menores,
            adults: [],
            minors: [],
  
          };
  
  
          for (let j = 0; j < habitacion.adultos.value.length; j++) {          
  
            const objAdult = {          
              name: habitacion.adultos.value[j].nombre,          
              last_name: habitacion.adultos.value[j].apellido,          
            };
            obj.adults.push(objAdult);
  
          }
  
  
          for (let j = 0; j < habitacion.menores.value.length; j++) {          
  
            const objMinor = {          
              name: habitacion.menores.value[j].nombre,          
              last_name: habitacion.menores.value[j].apellido,
              age: habitacion.menores.value[j].edad,          
            };
            obj.minors.push(objMinor);
            
          }        
  
          
          datos.reservation_rooms.push(obj);
        }                     
        
  
        
        try {
            // Create reservation
            // console.log(datos);
            // return;
            this._reservationsFormWeb.saveReservation(datos).subscribe(
                // (response: any) => {
                ({ result, message }: { result: boolean; message: string }) => {
                    if (result) {
                        if (result) {
                            this.alertService.alertConfirmation(
                                'success',
                                message
                            );
                            this.isEnableFirstDisplay = false;
                            this.isEnableSecondDisplay = true;
                        } else {
                            this.horizontalStepperForm.enable();       
                            this.alertService.alertConfirmation(
                                'error',
                                message
                            );
                            this.horizontalStepperForm.enable();
                        }
                    } else {
                        this.horizontalStepperForm.enable();       
                        this.alertService.alertConfirmation('error', message);
                    }
                }
            );
        } catch (error) {
            this.horizontalStepperForm.enable();       
            this.alertService.alertConfirmation('error',  error);
        }
        
      
    }

  //FUNCIONES PARA METODOS DE PAGO
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Obtener la extensión del archivo
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      // Validar si es una imagen (puedes agregar más extensiones según tus necesidades)
      const isImage = ['jpg', 'jpeg', 'png'].includes(fileExtension);

      // Validar si es un archivo PDF
      const isPDF = file.type === 'application/pdf';

      if (isImage) {
        this.imagenUp = true;
        this.archivoSeleccionado = true;
        this.convertFileToBase64(file);
        this.actualizarEstadoBoton();
      } else if (isPDF) {
        this.imagenUp = true;
        this.archivoSeleccionado = true;
        this.convertFileToBase64(file);
        this.actualizarEstadoBoton();
      } else {
        this.imagenUp = false;
        this.archivoSeleccionado = false;
        this.alertService.alertConfirmation(
          'error',
          'Formato de archivo no admitido. Selecciona una imagen o un archivo PDF.'
        );
        event.target.value = null;
      }
    }
  }

  convertFileToBase64(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64String: string = reader.result as string;
      this.base64Data = base64String;
    };
    reader.readAsDataURL(file);
  }

  private async actualizarEstadoBoton(): Promise<void> {
    const formularioCompleto = await this.verificarCamposLlenos();
    const archivoSeleccionado = this.archivoSeleccionado;
    this.formularioLleno = formularioCompleto && archivoSeleccionado;
  }

  private async verificarCamposLlenos(): Promise<boolean> {
    const formulario = this.horizontalStepperForm.get('step5').getRawValue();
    let algunCampoLleno = false;

    if (formulario) {
      Object.keys(formulario).forEach(step => {
        const campos = formulario[step];
        if (campos) {
          Object.keys(campos).forEach(key => {
            if (campos[key] !== '' && campos[key] !== null) {
              algunCampoLleno = true;
            }
          });
        }
      });
    }

    return algunCampoLleno;
  }

  agregarPrograma() {

    this.formularioLleno = false;

    // this.comprobantes = [];
    let programa = this.horizontalStepperForm.get('step5').value;
    const fechaInicioFormatted = formatDate(programa.fecha, 'yyyy-MM-dd', 'en-US');

    //generar id unico
    let numAleatorioUno = Math.floor(Math.random() * 100) + 1;
    let numAleatorioDos = Math.floor(Math.random() * 100) + 1;
    let nuevoId = `${numAleatorioUno}${numAleatorioDos}`;

    var data = {
      id: nuevoId,
      tipo_pago: programa.tipo_pago,
      fecha: fechaInicioFormatted,
      monto: programa.monto,
      numero_movimiento: programa.numero_movimiento,
      comprobante: this.base64Data
    };

    this.totalMonto += programa.monto;

    this.comprobantes.push(data);
    // console.log("emiliano", this.comprobantes)
    //reinciar formulario
    this.horizontalStepperForm.get('step5').reset();
    this.imagenUp = false;
    this.archivoSeleccionado = false;
    this.actualizarEstadoBoton();

  }

  eliminarPrograma(item: any) {
    this.comprobantes = this.comprobantes.filter((programa) => programa.id !== item.id);
    this.base64Data = "";
  }

  openModal(voucher: string): void {
    let isImage: boolean;
    let resourceUrl: string;

    if (voucher.startsWith('data:')) {
      // Si es base64, puede ser una imagen o un PDF
      isImage = voucher.startsWith('data:image');
      resourceUrl = voucher;
    } else {
      // Si no es base64, se asume que es una URL de imagen
      isImage = this.isImageFile(voucher);
      resourceUrl = `${this.urlImg}/assets/comprobantes_de_pago/${voucher}`;
    }

    this.dialog.open(ModalComponent, {
      data: { url: resourceUrl, isImage: isImage },
      width: '50%',
      height: '70%',
      panelClass: 'custom-modal',
    });


  }

  isImageFile(fileName: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png'];
    const fileExtension = fileName.toLowerCase().split('.').pop();
    return imageExtensions.includes(`.${fileExtension}`);
  }

  get urlImg(): string {
    return environment.urlImg;
  }

  async setupOpenPay(): Promise<void> {
    return new Promise((resolve, reject) => {
      OpenPay.setId('mnco0uqmapdz8xhglddh');
      OpenPay.setApiKey('pk_ca3d253ab8404724910a13b22b622a71');
      OpenPay.setSandboxMode(true);
      const deviceDataId = OpenPay.deviceData.setup("formId");

      const cardData = {
        "card_number": this.horizontalStepperForm.get('step5.numero_openpay').value,  //"4111111111111111"
        "holder_name": this.horizontalStepperForm.get('step5.nombres_openpay').value, //"Juan Perez Ramirez",
        "expiration_year": this.horizontalStepperForm.get('step5.año_openpay').value, //"25",
        "expiration_month": this.horizontalStepperForm.get('step5.mes_openpay').value, //"03",
        "cvv2": this.horizontalStepperForm.get('step5.cvv2_openpay').value, //"110",        
        "address": {
          "city": this.horizontalStepperForm.get('step5.ciudad_openpay').value, //"Querétaro",
          "postal_code": this.horizontalStepperForm.get('step5.cp_openpay').value, //"76900",
          "country_code": "MX",
          "state": this.horizontalStepperForm.get('step5.estado_openpay').value, //"Queretaro",
          "line1": this.horizontalStepperForm.get('step5.direccion_openpay').value, //"Av 5 de Febrero",
          // "line3": "Queretaro",
          // "line2": "Roble 207",
        }
      };

      const onSuccess = (response) => {
        const token = response.data.id;
        this.deviceSessionId = deviceDataId;
        this.tokenOpenPay = token;
        console.log("token openPay", this.tokenOpenPay);
        console.log("DataID: ", deviceDataId);
        resolve();
      };

      const onError = (error) => {
        console.log(error);
        reject(error);
      }

      OpenPay.token.create(cardData, onSuccess, onError);
    });
  }

  hoy: Date = new Date();
  haceSieteDias: Date = new Date(this.hoy.getTime() - 7 * 24 * 60 * 60 * 1000);

  edadValidator(control: FormControl) {
    const edad = control.value;
    if (edad > 17) {
      return { 'edadMaxima': true };
    }
    return null;
  }

}
