import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, formatDate } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LandingHomeService } from 'app/services/landing-home/landing-home.service';
import { environment } from 'environments/environment';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { LandingEventosService } from 'app/services/landing-eventos/landing-eventos.service';
import { FormGroup, FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
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
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';


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
import { debounceTime } from 'rxjs/operators';
import { DiscountsService } from 'app/services/discounts/discounts.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
//import para calendarios
import { Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';

declare var OpenPay: any;

@Component({
    selector     : 'register-assistant',
    templateUrl  : './register-assistant.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./register-assistant.component.scss'],
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
        NgxMaskDirective,
        MatNativeDateModule
    ],
    providers: [
        provideNgxMask(),
        { provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
    ]
})
export class RegisterAssistantComponent
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

    isChecked = true;
    color: ThemePalette = 'primary';
    checked = false;        
    estatus: string = '';        
    base64Data: string = '';
    siRequiere: string = 'si';
    Isfacturacion: boolean = true;
    categories: any[] = [];        
    countrys: any[] = [];
    events: any[] = [];
    categoriesArray: any[] = [];
    eventoArray: any[] = [];
    taxRegimes: any[] = [];
    cfdis: any[] = [];
    createForm: FormGroup;
    imagenUp: boolean = false;
    sharedData: any;

    paymentTypes: any[] = [];
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
    comprobantes: string = '';
    descuento: any = {};
    
    //variables segunda pantalla
    selectedCategoryId: any = '';
    selectedAvalibleCategory: any = {};
    porcentajeDescuento = 0;
    costoConDescuento = 0;
    montoDescuento: any = 0;
    gradosAcademicos: any[] = [];

    showFormOpenPay: boolean = false;
    showFormTransferencia: boolean =  false;
    showFormDeposito: boolean = false;

    //variables metodos de pago
    deviceSessionId: string;
    tokenOpenPay: string;
    archivoSeleccionado: boolean = false;
    totalVerificar: number;
    totalMonto: number = 0;
    formularioLleno: boolean = false;
    comprobantes_pago: any[] = [];

    payment_id: any;

    /**
     * Constructor
     */
    constructor(private _landingHomeService: LandingHomeService,
        private router: Router,
        private _landingEventosService: LandingEventosService,
        private activatedRoute: ActivatedRoute,
        private _shareService: SharedService,
        private _formBuilder: UntypedFormBuilder,
        private alertService: AlertService,
        private _countrysService: CountrysService,
        private _cfdiService: CfdiService,
        private _taxRegimesService: TaxRegimesService,
        private _paymentTypeService: PaymentTypeService,
        private _authService: AuthService,
        private _assistantsService: AssistantsService,
        private _discountsService: DiscountsService,
        private _adapter: DateAdapter<any>,
        @Inject(MAT_DATE_LOCALE) private _locale: string
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
        this.paises();
        this.regimesFiscales();
        this.cfdiApi();
        this.getListPaymentTypes();

        this.createForm = this._formBuilder.group({
            codigo_beca: [''],
            categoria_id: ['', Validators.required], 
            grado_academico: ['', Validators.required],
            nombre: ['', Validators.required],
            apellido_paterno: ['', Validators.required],
            apellido_materno: ['', Validators.required],
            correo_electronico: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],            
            telefono: ['', [ 
                Validators.required, 
                Validators.minLength(10),
                Validators.maxLength(10),
                Validators.pattern(/^[0-9]+$/)
            ]
            ],                                  
            comentario: [''],     
            pais_id: ['', Validators.required],                                              
            estado: ['', Validators.required],                                  
            ciudad: ['', Validators.required],                                  
            especialidad: ['', Validators.required],                                  
            institucion: ['', Validators.required],
            evento_id: ['', Validators.required], 
            is_required_facturacion: [true],  
            rfc: [{ value: '', disabled: false }, Validators.required],
            nombre_fiscal: [{ value: '', disabled: false }, Validators.required],                    
            correo_facturacion: [{ value: '', disabled: false }, Validators.required],            
            codigo_postal: [{ value: '', disabled: false }, Validators.required],            
            comentario_facturacion: [{ value: '', disabled: false }],            
            taxRegimes: [{ value: '', disabled: false }, Validators.required],            
            cfdis: [{ value: '', disabled: false }, Validators.required],                        
            estatus: [false]              
        });

        this.secondForm = this._formBuilder.group({
            paymentTypes: ['', Validators.required],
            agreements: ['', Validators.requiredTrue],
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
            
            pdf_programa: [''],
            fecha: [''],
            monto: [''],
            numero_movimiento: [''],

            //DATOS DEL BANCO
            beneficiario: [''],
            banco: [''],
            numero_cuenta: [''],
            clabe_interbancaria: [''],
        });

        this.createForm.get('is_required_facturacion').valueChanges.subscribe(habilitar => {
            const rfc = this.createForm.get('rfc');
            const nombre_fiscal = this.createForm.get('nombre_fiscal');
            const correo_facturacion = this.createForm.get('correo_facturacion');
            const codigo_postal = this.createForm.get('codigo_postal');
            const comentario_facturacion = this.createForm.get('comentario_facturacion');
            const tax_regimes = this.createForm.get('taxRegimes');
            const cfdis = this.createForm.get('cfdis');
            if(habilitar) {
                rfc.enable();
                nombre_fiscal.enable();
                correo_facturacion.enable();
                codigo_postal.enable();
                comentario_facturacion.enable();
                tax_regimes.enable();
                cfdis.enable();
                //establecer los campos como requeridos
                rfc.setValidators(Validators.required);
                nombre_fiscal.setValidators(Validators.required);
                correo_facturacion.setValidators(Validators.required);
                codigo_postal.setValidators(Validators.required);
                tax_regimes.setValidators(Validators.required);
                cfdis.setValidators(Validators.required);

                this.siRequiere = 'si';
                this.Isfacturacion = true;
            }else {
                rfc.disable();
                nombre_fiscal.disable();
                correo_facturacion.disable();
                codigo_postal.disable();
                comentario_facturacion.disable();
                tax_regimes.disable();
                cfdis.disable();
                //eliminar las validaciones requeridas
                rfc.setValidators(null);
                nombre_fiscal.setValidators(null);
                correo_facturacion.setValidators(null);
                codigo_postal.setValidators(null);
                tax_regimes.setValidators(null);
                cfdis.setValidators(null);

                this.siRequiere = 'no';
                this.Isfacturacion = false;
            }

            rfc.updateValueAndValidity();
            nombre_fiscal.updateValueAndValidity();
            correo_facturacion.updateValueAndValidity();
            codigo_postal.updateValueAndValidity();
            comentario_facturacion.updateValueAndValidity();
            tax_regimes.updateValueAndValidity();
            cfdis.updateValueAndValidity();
        });

        // Escucha cambios en el campo 'codigo_beca' con debounce de 300ms
        this.createForm.get('codigo_beca').valueChanges.pipe(
            debounceTime(800)
        ).subscribe(value => {
            // Aquí puedes realizar la petición con el valor del código de beca
            if(value) {
                this.obtenerDescuento(value);
            }  
        });

        //identificar que metodo de pago mostrar
        this.secondForm.get('paymentTypes').valueChanges.subscribe(value => {
            if(value === 1)
            {
                this.showFormTransferencia = true;
                this.showFormOpenPay = false;
                this.showFormDeposito = false;
                this.secondForm.get('fecha').reset();
                this.secondForm.get('monto').reset();
                this.secondForm.get('numero_movimiento').reset();
                this.base64Data=='';
                this.imagenUp = false;
                this.archivoSeleccionado = false;
                this.payment_id = value;
            }
            else if(value === 2)
            {
                this.showFormOpenPay = true;
                this.showFormTransferencia = false;
                this.showFormDeposito = false;
                this.payment_id = value;
                
            }
            else if(value === 3)
            {
                this.showFormDeposito = true;
                this.showFormOpenPay = false;
                this.showFormTransferencia = false;
                this.secondForm.get('fecha').reset();
                this.secondForm.get('monto').reset();
                this.secondForm.get('numero_movimiento').reset();
                this.base64Data=='';
                this.imagenUp = false;
                this.archivoSeleccionado = false;
                this.payment_id = value;
            }
        });

    }

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
        this._landingEventosService.getLandingEvento(this.slugLandingEvento).subscribe(
            (response: any) => {
                if (response.result) {
                    const data = response.data;
                    //validacion si no se encuentra el evento
                    if(data === null) {
                        this.router.navigate(['/home']);
                    }
                    this.landingEvento = data;
                    this.availableCategories = this.landingEvento.evento.available_categories;
                    this.eventoActual = this.landingEvento.evento;
                    this.gradosAcademicos = this.landingEvento?.evento?.grados;
                    this.createForm.patchValue({
                        evento_id: this.eventoActual.nombre ? this.eventoActual.nombre : ''
                    });
                    //asignar datos de pago
                    this.secondForm.patchValue({
                        beneficiario: this.eventoActual.beneficiario,
                        banco: this.eventoActual.banco,
                        numero_cuenta: this.eventoActual.numero_cuenta,
                        clabe_interbancaria: this.eventoActual.clabe_interbancaria
                    });
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

    obtenerDescuento(codigoBeca: string){

        var datos = {
            codigo_beca: codigoBeca,          
        };           

        // const selectedId = this.sharedData ? this.sharedData.pais_id : ''; 
        this._discountsService.getDescuento(datos).subscribe(          
            ({ result, message, data  }: { result: boolean; message: string; data: any[] }) => {
              if (result) {                    
                    this.descuento = data; 
                    this.porcentajeDescuento = this.descuento.porcentaje;
                    this.alertService.alertConfirmation(
                        'success',
                        message
                    );          
              } else {
                    this.alertService.alertConfirmation(
                        'error',
                        message
                    ); 
                    //limpiar campo codigo de beca
                    this.createForm.patchValue({
                        codigo_beca: ''
                    });                        
              }
          }
        );                   
    }

    asignarValoresEvento() {
        this.landingEvento = this.listaEventos.find((objeto: any) => objeto.slug === this.slugLandingEvento);
        this.availableCategories = this.landingEvento.evento.available_categories;
        this.eventoActual = this.landingEvento.evento;
        this.createForm.patchValue({
            evento_id: this.eventoActual.nombre ? this.eventoActual.nombre : ''
        });
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
        if (this.createForm.invalid) {            
            return;
        }  

        this.isEnableFirstDisplay = false;
        this.isEnableSecondDisplay = true;
        //this.createForm.disable();      
        
        var datos = {
            codigo_beca: this.createForm.value.codigo_beca,  
            categoria_id: this.selectedCategoryId,                   
            grado_academico: this.createForm.value.grado_academico,          
            nombre: this.createForm.value.nombre,
            apellido_paterno: this.createForm.value.apellido_paterno,            
            apellido_materno: this.createForm.value.apellido_materno,            
            correo_electronico: this.createForm.value.correo_electronico,            
            telefono: this.createForm.value.telefono,            
            comentario: this.createForm.value.comentario,            
            pais_id: this.createForm.value.pais_id,                                                                
            estado: this.createForm.value.estado,            
            ciudad: this.createForm.value.ciudad,            
            especialidad: this.createForm.value.especialidad,            
            institucion: this.createForm.value.institucion,
            evento_id: this.eventoActual.id,                      
            facturacion: this.createForm.value.is_required_facturacion,                                
            rfc: this.createForm.value.rfc,            
            nombre_fiscal: this.createForm.value.nombre_fiscal,            
            correo_facturacion: this.createForm.value.correo_facturacion,            
            codigo_postal: this.createForm.value.codigo_postal,            
            comentario_facturacion: this.createForm.value.comentario_facturacion,            
            regimen_fiscal_id: this.createForm.value.taxRegimes,            
            cfdi_id: this.createForm.value.cfdis,            
            estatus: this.createForm.value.estatus,  
            constancias: this.base64Data,          
        };           

        this.datosAsistente = datos;
        //console.log(this.datosAsistente);
        this.montoDescuento = this.selectedAvalibleCategory.costo * (this.porcentajeDescuento/100);
        this.costoConDescuento = this.selectedAvalibleCategory.costo - (this.selectedAvalibleCategory.costo * (this.porcentajeDescuento/100));
        this.totalVerificar = this.costoConDescuento;
        //this._shareService.setSharedData(datos);        
        //this.router.navigateByUrl('/create/assistants/two');      
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
                this.convertFileToBase64(file);                
            } else if (isPDF){
                this.imagenUp = true;
                this.convertFileToBase64(file);                
            } else {
                this.imagenUp = false;
                this.alertService.alertConfirmation(
                    'error',
                    'Formato de archivo no admitido. Selecciona una imagen o un archivo PDF.'
                );                            
              event.target.value = null;
            }
        }        
    }

    alertConfirmation(icon: SweetAlertIcon, title: string): void {
        this.alertService.alertConfirmation(icon, title);
    }

    convertFileToBase64(file: File): void {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const base64String: string = reader.result as string;
            this.base64Data = base64String;
        };
        reader.readAsDataURL(file);
    }

    regresar(): void {
        this._shareService.setSharedData(this.sharedData);
        this.router.navigateByUrl('/create/assistants');
    }

    async create(): Promise<void> {
        if (this.secondForm.invalid) {
            return;
        }

        if (this.showFormOpenPay) {
            await this.setupOpenPay();
        }

        this.datosAsistente.costo = this.costoConDescuento;
        this.datosAsistente.payment_id = this.payment_id;
        this.datosAsistente.comprobantes = this.comprobantes_pago;
        this.datosAsistente.landing_id = this.landingEvento.id;
        this.datosAsistente.device_sesion =  this.deviceSessionId,
        this.datosAsistente.monto_openpay = this.secondForm.get('monto_openpay').value,
        this.datosAsistente.nombres_openpay = this.secondForm.get('nombres_openpay').value,
        this.datosAsistente.apellidos_openpay =  this.secondForm.get('apellidos_openpay').value,
        this.datosAsistente.email_openpay = this.secondForm.get('email_openpay').value,
        this.datosAsistente.descripcion_openpay = this.secondForm.get('descripcion_openpay').value,
        this.datosAsistente.openPay = this.tokenOpenPay,
        
        console.log(this.datosAsistente);

        //guardar los datos en una memoria temporal
        //this._shareService.setSharedData(this.datosAsistente);

        this._assistantsService.guardar(this.datosAsistente).subscribe(
            (response: any) => {
                if(response.result) {
                    this.isEnableSecondDisplay = false;
                    this.isEnableThirdDisplay = true;
                }else{
                    this.alertService.alertConfirmation('error', response.message);
                }
            },
            (error) => {
                console.log('Error al registrarse al evento', error);
            }
        )

        //validar si el usuario esta logeado
        // this._authService.check().subscribe(
        //     (response) => {
        //         this.isUserAutheticate = response;
        //         //console.log(response);
        //     },
        //     (error) =>{
        //         console.error('Error al obtener estatus usuario:', error);
        //     }
        // )

        // if (!this.isUserAutheticate) {
        //     // El usuario no está autenticado, redirige a la página de inicio de sesión o registro.
        //     this._assistantsService.guardar(this.datosAsistente).subscribe(
        //         (response: any) => {
        //             if(response.result) {

        //             }else{
        //                 this.alertService.alertConfirmation('error', response.message);
        //             }
        //         },
        //         (error) => {
        //             console.log('Error al registrarse al evento', error);
        //         }
        //     )
        // } else {
        //     // El usuario ya está autenticado, continúa con la lógica de registro de eventos o cualquier otra acción.
        //     this._assistantsService.guardar(this.datosAsistente).subscribe(
        //         (response: any) => {
        //             if(response.result) {

        //             }else{
        //                 this.alertService.alertConfirmation('error', response.message);
        //             }
        //         },
        //         (error) => {
        //             console.log('Error al registrarse al evento', error);
        //         }
        //     )
        // }
      
      }

    paises(){ 
        this._countrysService.obtenerLista().subscribe(          
            (response) => {
                if(response.result){
                    this.countrys = response.data;
                }
            },
            (error) => {
                console.error('Error al obtener la lista:', error);
            }
        );                  
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

    getListPaymentTypes() {
        this._paymentTypeService.getPublicList().subscribe(
            (response) => {
                if (response.result) {
                    this.paymentTypes = response.data;
                }
            },
            (error) => {
                console.error('Error al obtener la lista:', error);
            }
        );
    }

    changeCategory(event: any) {
        const availableCategoryId = event.value;
        const foundAvalibleCategory = this.availableCategories.find(elemento => elemento.id === availableCategoryId);
        this.selectedCategoryId = foundAvalibleCategory.category_id;
        this.selectedAvalibleCategory = foundAvalibleCategory;
    }

    goToHome() {
        this.router.navigate(['/evento/' + this.slugLandingEvento]);
    }

    // validarTelefono(event: any) {
    //     let valor = event.target.value;

    //     // Verificar si hay caracteres numéricos
    //     if (/\D/.test(valor)) {
    //         event.target.value = valor.replace(/\D/g, ''); // Eliminar caracteres no numéricos
    //     }

    //     // Limitar a 10 caracteres
    //     if (valor.length > 10) {
    //         event.target.value = valor.slice(0, 10); // Cortar el valor a 10 caracteres
    //     }
    // }

    /****  METODOS PARA TIPOS DE PAGO  ****/
    //reducir la fechas que se puede subir el comprobante
    hoy: Date = new Date();
    haceSieteDias: Date = new Date(this.hoy.getTime() - 7 * 24 * 60 * 60 * 1000);

    async setupOpenPay(): Promise<void> {
        return new Promise((resolve, reject) => {
          OpenPay.setId('mnco0uqmapdz8xhglddh');
          OpenPay.setApiKey('pk_ca3d253ab8404724910a13b22b622a71');
          OpenPay.setSandboxMode(true);
          const deviceDataId = OpenPay.deviceData.setup("formId");
    
          const cardData = {
            "card_number": this.secondForm.get('numero_openpay').value,  //"4111111111111111"
            "holder_name": this.secondForm.get('nombres_openpay').value, //"Juan Perez Ramirez",
            "expiration_year": this.secondForm.get('año_openpay').value, //"25",
            "expiration_month": this.secondForm.get('mes_openpay').value, //"03",
            "cvv2": this.secondForm.get('cvv2_openpay').value, //"110",        
            "address": {
              "city": this.secondForm.get('ciudad_openpay').value, //"Querétaro",
              "postal_code": this.secondForm.get('cp_openpay').value, //"76900",
              "country_code": "MX",
              "state": this.secondForm.get('estado_openpay').value, //"Queretaro",
              "line1": this.secondForm.get('direccion_openpay').value, //"Av 5 de Febrero",
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

    agregarPrograma() {            
        this.formularioLleno = false;
    
        // this.comprobantes = [];
        let programa = this.secondForm.value;
        const fechaInicioFormatted = formatDate(programa.fecha, 'yyyy-MM-dd', 'en-US');
    
        //generar id unico
        let numAleatorioUno = Math.floor(Math.random() * 100) + 1;
        let numAleatorioDos = Math.floor(Math.random() * 100) + 1;
        let nuevoId = `${numAleatorioUno}${numAleatorioDos}`;
    
        var data = {
          id: nuevoId,
          tipo_pago: programa.paymentTypes,
          fecha: fechaInicioFormatted,
          monto: programa.monto,
          numero_movimiento: programa.numero_movimiento,
          comprobante: this.base64Data
        };
    
        this.totalMonto += programa.monto;
    
        this.comprobantes_pago.push(data);
        // console.log("emiliano", this.comprobantes)
        //reinciar formulario
        //this.secondForm.reset();
        this.secondForm.get('fecha').reset();
        this.secondForm.get('monto').reset();
        this.secondForm.get('numero_movimiento').reset();
        this.imagenUp = false;
        this.archivoSeleccionado = false;
        this.actualizarEstadoBoton();
    
    
        this.secondForm.get('paymentTypes').disable();
        this.secondForm.get('fecha').disable();
        this.secondForm.get('monto').disable();
        this.secondForm.get('numero_movimiento').disable();
    
      }

      private async actualizarEstadoBoton(): Promise<void> {
        const formularioCompleto = await this.verificarCamposLlenos();
        const archivoSeleccionado = this.archivoSeleccionado;
        this.formularioLleno = formularioCompleto && archivoSeleccionado;
      }

      private async verificarCamposLlenos(): Promise<boolean> {
        const formulario = this.createForm.getRawValue();
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

    onFileSelectedTwo(event: any): void {
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
            this.convertFileToBase64Two(file);
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

    convertFileToBase64Two(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
        const base64String: string = reader.result as string;
        this.base64Data = base64String;
    };
    reader.readAsDataURL(file);
    }

    eliminarPrograma(item: any) {
        this.comprobantes_pago = this.comprobantes_pago.filter((programa) => programa.id !== item.id);
        this.base64Data = "";

        this.secondForm.get('paymentTypes').enable();
        this.secondForm.get('fecha').enable();
        this.secondForm.get('monto').enable();
        this.secondForm.get('numero_movimiento').enable();
    }

    returnFirstDisplay()
    {
        this.isEnableFirstDisplay = true;
        this.isEnableSecondDisplay = false;
    }
}
