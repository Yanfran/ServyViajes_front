import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, formatDate } from '@angular/common';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule, ThemePalette } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AlertService } from 'app/services/alert/alert.service';
import { CategoriesService } from 'app/services/categories/categories.service';
import { CountrysService } from 'app/services/countrys/countrys.service';
import { EventsService } from 'app/services/events/events.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { AssistantsService } from 'app/services/assistants/assistants.service';
import { TaxRegimesService } from 'app/services/tax_regimes/tax-regimes.service';
import { CfdiService } from 'app/services/cfdi/cfdi.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedService } from 'app/services/shared/shared.service';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalComponent } from '../../components/modal/modal.component';
import { environment } from 'environments/environment';
import { PaymentTypeService } from 'app/services/payment_type/payment-type.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { EstatusDePagoReservacionComponent } from '../../components/estatus-de-pago-reservacion/estatus-de-pago-reservacion.component';

declare var OpenPay: any;

@Component({
    selector: 'app-edit',    
    standalone: true,
    imports: [
        CommonModule, 
        MatDialogModule, 
        NgStyle, 
        MatRadioModule, 
        NgIf, 
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
        MatProgressSpinnerModule,
        NgxMaskDirective
    ],
    providers: [
        provideNgxMask()
    ],
    templateUrl: './edit.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./edit.component.scss'],
})
export class EditComponent {
    @ViewChild('createAssistants') createAssistants: NgForm;
    
    color: ThemePalette = 'primary';
    idEdit = 0;
    checked = false;        
    estatus: string = '';        
    base64Data: string = '';
    base64DataTwo: string = '';
    base64DataThree: string = '';    
    siRequiere: string = '';
    Isfacturacion: any = '';
    paymentTypes: any[] = [];
    categories: any[] = [];        
    countrys: any[] = [];
    events: any[] = [];
    categoriesArray: any[] = [];
    eventoArray: any[] = [];
    taxRegimes: any[] = [];
    cfdis: any[] = [];
    createForm: FormGroup;
    imagenUp: boolean = false;
    imagenUpTwo: boolean = false;
    sharedData: any;    
    selectedCategoryId: number; 
    IsTheEvent: string = ''; 
    IsTheCategory: string = '';    
    IsTheContry: string = ''; 
    IsTheRegime: string = '';  
    IsTheCfdi: string = '';    
    IsTheConstancy: string = ''; 
    IsTheCosto: number = 0;    
    IsThePaymentProofs: string = ''; 
    IsThePaymentType: string = ''; 
    comprobantes: any[] = [];
    selectedValue: number;
    
    formularioLleno: boolean = false;
    archivoSeleccionado: boolean = false;
    showOpenpayForm: boolean = false;
    showDepositoForm: boolean = false;
    showComprobanteForm: boolean = false;
    tokenOpenPay: string;
    deviceSessionId: string;
    totalMonto: number = 0;
    payment_id_two: number;

    //descuentos
    descuento: any = 0;
    montoDescuento: any = 0;
    porcentajeTotal: any = 100; //importante siempre va ser 100%
    costoTotal:any = 0;

    totalVerificar: number;

    constructor(        
        private _shareService: SharedService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,        
        private _categoriesService: CategoriesService,         
        private _countrysService: CountrysService,
        private _eventsService: EventsService,
        private _taxRegimesService: TaxRegimesService,
        private _cfdiService: CfdiService,
        private alertService: AlertService,
        private dialog: MatDialog,
        private _paymentTypeService: PaymentTypeService,
        private _assistantsService: AssistantsService,
    ) {
        this.sharedData = this._shareService.getSharedData();        
        console.log(this.sharedData)
        if (!this.sharedData) {
            this._router.navigateByUrl('/assistants');
        }
    }    

    async ngOnInit(): Promise<void> {        
        // Create the form
        this.createForm = this._formBuilder.group({
            codigo_beca: [''],
            categories: ['', Validators.required], 
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
            countrys: ['', Validators.required],                                              
            estado: ['', Validators.required],                                  
            ciudad: ['', Validators.required],                                  
            especialidad: ['', Validators.required],                                  
            institucion: ['', Validators.required],
            events: ['', Validators.required],                            
            rfc: { value: '', disabled: this.siRequiere !== 'si' },
            nombre_fiscal: { value: '', disabled: this.siRequiere !== 'si' },                             
            correo_facturacion: { value: '', disabled: this.siRequiere !== 'si' },            
            codigo_postal: { value: '', disabled: this.siRequiere !== 'si' },            
            comentario_facturacion: { value: '', disabled: this.siRequiere !== 'si' },            
            taxRegimes: { value: '', disabled: this.siRequiere !== 'si' },            
            cfdis: { value: '', disabled: this.siRequiere !== 'si' },     
            estatus: [false],            
            estatus_de_pago: [false],
            agreements: ['', Validators.requiredTrue],   
            


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

        });  

        this._paymentTypeService.list().subscribe(
            ({ result, message, data  }: { result: boolean; message: string; data: any[] }) => {
                  if (result) {
                    //   this.paymentTypes = data;    
                      this.paymentTypes = [
                          { id: null, nombre: 'Seleccione un metodo de pago' },
                          ...data, 
                      ];  
      
                    //   this.createForm.get('tipo_pago').setValue(data[0].id); 
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


        this.createForm.get('tipo_pago').valueChanges.subscribe(async paymentId => {             
            if (paymentId) {
              this.showComprobanteForm = paymentId === 1;          
            //   this.createForm.get('fecha').reset();
            //   this.createForm.get('monto').reset();
            //   this.createForm.get('numero_movimiento').reset();
              this.base64DataThree=='';
              this.imagenUp = false;
              this.archivoSeleccionado = false;
            }
            if (paymentId) {
              this.showOpenpayForm = paymentId === 2;
            }
            if (paymentId) {
              this.showDepositoForm = paymentId === 3;          
            //   this.createForm.get('fecha').reset();
            //   this.createForm.get('monto').reset();
            //   this.createForm.get('numero_movimiento').reset();
              this.base64DataThree=='';
              this.imagenUp = false;
              this.archivoSeleccionado = false;
            }
        });

        if (this.sharedData) { 
            this.idEdit = this.sharedData.id; 
                        
            try {
                await this.eventos();
                await this.categorias();
                await this.paises();
                await this.regimesFiscales();
                await this.cfdiApi();
                // await this.paymentType();
            } catch (error) {
                console.error('Error en ngOnInit:', error);
            }           
            
            this.siRequiere = this.sharedData.facturacion === 1 ? 'si' : 'no';  
            const controls = ['rfc', 'nombre_fiscal', 'correo_facturacion', 'codigo_postal', 'comentario_facturacion', 'taxRegimes', 'cfdis'];
            controls.forEach((controlName) => {
              if (this.createForm.get(controlName)) {
                if (this.siRequiere === 'si') {                
                    this.Isfacturacion = 1;
                    this.createForm.get(controlName)?.enable();
                } else {                
                    this.Isfacturacion = 0;
                    this.createForm.get(controlName)?.disable();
                }
              }
            });    
            
            if (
                    this.sharedData.constancy &&
                    this.sharedData.constancy.length > 0 &&
                    this.sharedData.constancy[0].nombre
                ) {
                    this.IsTheConstancy = this.sharedData.constancy[0].nombre;                    
                    this.imagenUp = true;                    
            }
              
            if (
                this.sharedData.payment_proofs &&
                this.sharedData.payment_proofs.length > 0 &&
                this.sharedData.payment_proofs[0].nombre
                ) {
                this.IsThePaymentProofs = this.sharedData.payment_proofs[0].nombre;
                this.imagenUpTwo = true;                    
            }
            this.IsThePaymentType = this.sharedData.payment_types.nombre; 
            this.IsTheCosto = this.sharedData.monto_total;
            this.descuento = this.sharedData.descuento ? this.sharedData.descuento : 0;
            //revertir descuento
            let porcentajeCobrado = this.porcentajeTotal - this.descuento;
            this.montoDescuento = (this.IsTheCosto * this.descuento) / porcentajeCobrado;
            this.costoTotal = this.IsTheCosto + (this.montoDescuento ? this.montoDescuento : 0);


            this.totalVerificar = this.IsTheCosto;

            this.comprobantes = this.sharedData.payment_proofs;
                     
            this.createForm.patchValue({              
                codigo_beca: this.sharedData.codigo_beca,                              
                grado_academico: this.sharedData.grado_academico,          
                nombre: this.sharedData.nombre,
                apellido_paterno: this.sharedData.apellido_paterno,            
                apellido_materno: this.sharedData.apellido_materno,            
                correo_electronico: this.sharedData.correo_electronico,            
                telefono: this.sharedData.telefono,            
                comentario: this.sharedData.comentario,                            
                estado: this.sharedData.estado,            
                ciudad: this.sharedData.ciudad,            
                especialidad: this.sharedData.especialidad,            
                institucion: this.sharedData.institucion,
                evento_id: this.sharedData.evento_id,                      
                facturacion: this.sharedData.facturacion,                                
                rfc: this.sharedData.rfc,            
                nombre_fiscal: this.sharedData.nombre_fiscal,            
                correo_facturacion: this.sharedData.correo_facturacion,            
                codigo_postal: this.sharedData.codigo_postal,            
                comentario_facturacion: this.sharedData.comentario_facturacion,                                     
                estatus: this.sharedData.estatus,    
                estatus_de_pago: this.sharedData.estatus_de_pago,                                                                       
            });   
                               
                         
        }  
        
        this.createForm.valueChanges.subscribe(() => {
            this.actualizarEstadoBoton();
          });
      
        await this.actualizarEstadoBoton();
                               
    }


    
    async setupOpenPay(): Promise<void> {
        return new Promise((resolve, reject) => {
          OpenPay.setId('mnco0uqmapdz8xhglddh');
          OpenPay.setApiKey('pk_ca3d253ab8404724910a13b22b622a71');
          OpenPay.setSandboxMode(true);
          const deviceDataId = OpenPay.deviceData.setup("formId");
    
          const cardData = {
            "card_number": this.createForm.get('numero_openpay').value,  //"4111111111111111"
            "holder_name": this.createForm.get('nombres_openpay').value, //"Juan Perez Ramirez",
            "expiration_year": this.createForm.get('año_openpay').value, //"25",
            "expiration_month": this.createForm.get('mes_openpay').value, //"03",
            "cvv2": this.createForm.get('cvv2_openpay').value, //"110",        
            "address": {
              "city": this.createForm.get('ciudad_openpay').value, //"Querétaro",
              "postal_code": this.createForm.get('cp_openpay').value, //"76900",
              "country_code": "MX",
              "state": this.createForm.get('estado_openpay').value, //"Queretaro",
              "line1": this.createForm.get('direccion_openpay').value, //"Av 5 de Febrero",
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
    
    onFileSelectedThree(event: any): void {
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
            this.convertFileToBase64Three(file);
            this.actualizarEstadoBoton();
          } else if (isPDF) {
            this.imagenUp = true;
            this.archivoSeleccionado = true;
            this.convertFileToBase64Three(file);
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
    
    convertFileToBase64Three(file: File): void {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64String: string = reader.result as string;
          this.base64DataThree = base64String;
        };
        reader.readAsDataURL(file);
    }
    
    agregarPrograma() {            
        this.formularioLleno = false;
    
        // this.comprobantes = [];
        let programa = this.createForm.value;
        const fechaInicioFormatted = formatDate(programa.fecha, 'yyyy-MM-dd', 'en-US');
    
        //generar id unico
        let numAleatorioUno = Math.floor(Math.random() * 100) + 1;
        let numAleatorioDos = Math.floor(Math.random() * 100) + 1;
        let nuevoId = `${numAleatorioUno}${numAleatorioDos}`;
    
        var data = {
          id: nuevoId,
          tipo_pago: programa.tipo_pago,
          date: fechaInicioFormatted,
          amount: programa.monto,
          motion: programa.numero_movimiento,
          voucher: this.base64DataThree,
          estatus: 0,
        };
    
        this.totalMonto += programa.monto;
    
        this.comprobantes.push(data);
        // console.log("emiliano", this.comprobantes)
        //reinciar formulario
    
        this.payment_id_two = programa.tipo_pago;  
    
        
        this.imagenUp = false;
        this.archivoSeleccionado = false;
        this.actualizarEstadoBoton();
        
        this.createForm.get('fecha').reset();
        this.createForm.get('monto').reset();
        this.createForm.get('numero_movimiento').reset();
    
        // this.createForm.get('tipo_pago').disable();
        // this.createForm.get('fecha').disable();
        // this.createForm.get('monto').disable();
        // this.createForm.get('numero_movimiento').disable();
    
    }
    
    eliminarPrograma(item: any) {
        this.comprobantes = this.comprobantes.filter((programa) => programa.id !== item.id);
        this.base64DataThree = "";
    
        // this.createForm.get('tipo_pago').enable();
        // this.createForm.get('fecha').enable();
        // this.createForm.get('monto').enable();
        // this.createForm.get('numero_movimiento').enable();
    }
    
    isBase64(str: string): boolean {
        try {
          return btoa(atob(str)) == str;
        } catch (err) {
          return false;
        }
    }
    
    openModalThree(voucher: string): void {
        let isImage: boolean;
        let resourceUrl: string;
    
        if (voucher.startsWith('data:')) {
          // Si es base64, puede ser una imagen o un PDF
          isImage = voucher.startsWith('data:image');
          resourceUrl = voucher;
        } else {
          // Si no es base64, se asume que es una URL de imagen
          isImage = this.isImageFile(voucher);
          resourceUrl = `${this.urlImg}/assets/comprobantes/${voucher}`;
        }
    
        this.dialog.open(ModalComponent, {
          data: { url: resourceUrl, isImage: isImage },
          width: '50%',
          height: '70%',
          panelClass: 'custom-modal',
        });
    
    
    }        







    onEventChange(eventoId: number): void {
        const eventoEncontrado = this.events.find(function(event) {            
            return event.id === eventoId;
        });     
        const categoriasDispoibles = eventoEncontrado.available_categories                         
        this.categories = [];                        
        for (const categoria of categoriasDispoibles) {
            const categoriaEncontrada = this.categoriesArray.find(function(categoriaFind) {            
                return categoriaFind.id === categoria.category_id;
            });                                          
            var obj = {
                id: categoria.category_id,
                nombre: categoriaEncontrada.descripcion,
                costo: categoria.costo,
            }                        
            this.categories.push(obj)            
        }
    }

    onCostoChange(category: any): void {
        const selectedCategoryId = category.value; // Obtén el id del evento seleccionado
        const selectedCategory = this.categories.find(category => category.id === selectedCategoryId); // Busca el evento por su id en el array
        if (selectedCategory) {      
            this.eventoArray = selectedCategory;
        } else {
            console.log("Evento no encontrado");
        }
    }

    onEstatusChange() {
        const controls = ['rfc', 'nombre_fiscal', 'correo_facturacion', 'codigo_postal', 'comentario_facturacion', 'taxRegimes', 'cfdis'];
        controls.forEach((controlName) => {
          if (this.createForm.get(controlName)) {
            if (this.siRequiere === 'si') {                
                this.Isfacturacion = 1;
                this.createForm.get(controlName)?.enable();
            } else {                
                this.Isfacturacion = 0;
                this.createForm.get(controlName)?.disable();
            }
          }
        });
    } 

    convertFileToBase64(file: File): void {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const base64String: string = reader.result as string;
            this.base64Data = base64String;
        };
        reader.readAsDataURL(file);
    }

    convertFileToBase64Two(file: File): void {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const base64String: string = reader.result as string;
            this.base64DataTwo = base64String;
        };
        reader.readAsDataURL(file);
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
                this.imagenUpTwo = true;
                this.convertFileToBase64Two(file);                
            } else if (isPDF){
                this.imagenUpTwo = true;
                this.convertFileToBase64Two(file);                
            } else {
                this.imagenUpTwo = false;
                this.alertService.alertConfirmation(
                    'error',
                    'Formato de archivo no admitido. Selecciona una imagen o un archivo PDF.'
                );                            
              event.target.value = null;
            }
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
                this._router.navigateByUrl('/assistants');
            }
        });
    }

    alertConfirmation(icon: SweetAlertIcon, title: string): void {
        this.alertService.alertConfirmation(icon, title);
    }

    async eventos(): Promise<void>{
        try {
            const selectedId = this.sharedData ? this.sharedData.evento_id : ''; 

            const response = await this._eventsService.getEvents().toPromise();
            const { result, message, data } = response;
        

                if (result) {
                    this.events = data;                                         
                    if(this.sharedData){                                                                    
                        const selectedEvent = this.events.find(event => event.id === selectedId);                                                           
                        if (selectedEvent) {
                            this.IsTheEvent = selectedEvent.nombre;
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

    async categorias(): Promise<void> {
        try {
            const selectedId = this.sharedData ? this.sharedData.categoria_id : ''; 
            const selectedEvetId = this.sharedData ? this.sharedData.evento_id : ''; 

            const response = await this._categoriesService.getCategories().toPromise();
            const { result, message, data } = response;
            
                if (result) {
                    this.categoriesArray = data                             
                        const eventoEncontrado = this.events.find(function(event) {            
                            return event.id === selectedEvetId;
                        });                
                        
                        const categoriasDispoibles = eventoEncontrado.available_categories
                        this.categories = [];                        
                        for (const categoria of categoriasDispoibles) {
                            const categoriaEncontrada = this.categoriesArray.find(function(categoriaFind) {            
                                return categoriaFind.id === categoria.category_id;
                            });                                

                            if(categoriaEncontrada){
                                var obj = {
                                    id: categoria.category_id,
                                    nombre: categoriaEncontrada.descripcion,
                                    costo: categoria.costo,
                                }                        
                                
                                this.categories.push(obj)    
                            }         
                        }
                                                                    
                        if(this.sharedData){                                                                            
                            const selectedCategory = this.categories.find(category => category.id === selectedId);                            
                                                                                                    
                            if (selectedCategory) {
                                this.IsTheCategory = selectedCategory.nombre;      
                                this.eventoArray = selectedCategory;                                      
                            } else {
                                console.log("Evento no encontrado");
                            }
                            
                            if (selectedCategory) {
                                this.createForm.get('categories').setValue(selectedCategory.id); 
                            } else {
                                console.error('No se encontró el país con el ID deseado.');
                            }          
                                        
                        } else {
                            this.createForm.get('category').setValue(data[0].id); 
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

    async paises(): Promise<void>{
        try {
            const selectedId = this.sharedData ? this.sharedData.pais_id : ''; 

            const response = await this._countrysService.getCountrys().toPromise();
            const { result, message, data } = response;
            
                if (result) {
                        this.countrys = data;                     
                        if(this.sharedData){                                                                        
                            const selectedCountry = this.countrys.find(country => country.id === selectedId);                                                    
                            if (selectedCountry) {
                                this.IsTheContry = selectedCountry.nombre;
                                this.createForm.get('countrys').setValue(selectedCountry.id); 
                            } else {
                                console.error('No se encontró el país con el ID deseado.');
                            }                        
                        } else {
                            this.createForm.get('country').setValue(data[0].id);                         
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

    async regimesFiscales(): Promise<void>{
        try {
            const selectedId = this.sharedData ? this.sharedData.regimen_fiscal_id : ''; 

            const response = await this._taxRegimesService.list().toPromise();
            const { result, message, data } = response;

                if (result) {
                    this.taxRegimes = data;     
                    if(this.sharedData){                                                                      
                        const selectedRegimen = this.taxRegimes.find(taxRegime => taxRegime.id === selectedId);                                              
                        if (selectedRegimen) {
                                this.IsTheRegime = selectedRegimen.nombre;
                            this.createForm.get('taxRegimes').setValue(selectedRegimen.id); 
                        } else {                        
                        }                        
                    } else {
                            this.createForm.get('taxRegime').setValue(data[0].id); 
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

    async cfdiApi(): Promise<void>{
        try {
            const selectedId = this.sharedData ? this.sharedData.cfdi_id : ''; 

            const response = await this._cfdiService.list().toPromise();
            const { result, message, data } = response;        

                if (result) {
                    this.cfdis = data;   
                    
                    if(this.sharedData){                                                                    
                        const selectedCfdi = this.cfdis.find(cfdi => cfdi.id === selectedId);                                        
                        if (selectedCfdi) {
                            this.IsTheCfdi = selectedCfdi.nombre;
                            this.createForm.get('cfdis').setValue(selectedCfdi.id); 
                        } else {
                            // console.error('No se encontró el país con el ID deseado.');
                        }                        
                    } else {
                        this.createForm.get('cfdi').setValue(data[0].id); 
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


    async paymentType(): Promise<void>{
        try {
            const selectedId = this.sharedData ? this.sharedData.tipo_pago_id : ''; 

            const response = await this._paymentTypeService.list().toPromise();
            const { result, message, data } = response;        
        
                if (result) {
                    this.paymentTypes = data;                     

                    if(this.sharedData){                                                                    
                        const selectedPaymentType = this.paymentTypes.find(paymentType => paymentType.id === selectedId);  
                        
                        if (selectedPaymentType) {
                            this.paymentTypes = selectedPaymentType.nombre;
                            this.createForm.get('paymentTypes').setValue(selectedPaymentType.id); 
                        } else {
                            console.error('No se encontró el tipo de pago con el ID deseado.');
                        }                        
                    } else {
                        this.createForm.get('paymentType').setValue(data[0].id); 
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

    
    openModal(imageName: string, file: string): void {
        const imageUrl = `${this.urlImg}/assets/${file}/${imageName}`;
        console.log('URL de la imagen:', imageUrl);
        this.dialog.open(ModalComponent, {
        data: { url: imageUrl, isImage: this.isImageFile(imageName) },
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



    getEstatusText(value: number): string {
        switch(value) {
          case 1:
            return 'Acreditado';
          case 2:
            return 'Pendiente';
          case 3:
            return 'Pagado';
          default:
            return '';
        }
    }

    
    getStatusText(estatus_de_pago_tabla: number): string {
        switch (estatus_de_pago_tabla) {
        case 0:
            return 'Pendiente';
        case 1:
            return 'Pagado';
        case 2:
            return 'Rechazado';
        default:
            return 'Texto por defecto';
        }
    }

    getStatusColor(estatus_de_pago_tabla: number): string {
        switch (estatus_de_pago_tabla) {
        case 0:
            return 'orange';
        case 1:
            return 'green';
        case 2:
            return 'red';
        default:
            return '';
        }
    }

    openDialog(comprobante) {
        const dialogRef = this.dialog.open(EstatusDePagoReservacionComponent, {
        height: '230px',
        width: '600px',
        data: { comprobante: comprobante }
        });
    
        dialogRef.afterClosed().subscribe(result => {
        // console.log(`Dialog result: ${result}`);
        // Aquí puedes manejar el valor seleccionado
        // Por ejemplo, podrías asignarlo a una variable de tu componente
        this.selectedValue = result;
    
        // Aquí actualizas el estatus del comprobante
        comprobante.estatus = this.selectedValue;
        });      
    }


    async edit(): Promise<void> {
        // if (this.createForm.invalid) {
        //     return;
        // }
    
        this.createForm.disable();     
        
        if (this.showOpenpayForm) {
            await this.setupOpenPay();
        }
            
        var datos = {
            codigo_beca: this.createForm.value.codigo_beca,              
            grado_academico: this.createForm.value.grado_academico,          
            nombre: this.createForm.value.nombre,
            apellido_paterno: this.createForm.value.apellido_paterno,            
            apellido_materno: this.createForm.value.apellido_materno,            
            correo_electronico: this.createForm.value.correo_electronico,            
            telefono: this.createForm.value.telefono,            
            comentario: this.createForm.value.comentario,            
            pais_id: this.createForm.value.countrys,                                                                
            estado: this.createForm.value.estado,            
            ciudad: this.createForm.value.ciudad,            
            especialidad: this.createForm.value.especialidad,            
            institucion: this.createForm.value.institucion,                         
            facturacion: this.Isfacturacion,                                
            rfc: this.createForm.value.rfc,            
            nombre_fiscal: this.createForm.value.nombre_fiscal,            
            correo_facturacion: this.createForm.value.correo_facturacion,            
            codigo_postal: this.createForm.value.codigo_postal,            
            comentario_facturacion: this.createForm.value.comentario_facturacion,                                    
            estatus: this.createForm.value.estatus,
            estatus_de_pago: this.createForm.value.estatus_de_pago,            
            constancias: this.base64Data,

            comprobantes: this.comprobantes, //this.base64DataTwo,  
            payment_id: this.createForm.get('tipo_pago').value ? this.createForm.get('tipo_pago').value : this.payment_id_two,                                                                    

            device_sesion: this.deviceSessionId,
            monto_openpay: this.createForm.get('monto_openpay').value,
            nombres_openpay: this.createForm.get('nombres_openpay').value,
            apellidos_openpay: this.createForm.get('apellidos_openpay').value,
            email_openpay: this.createForm.get('email_openpay').value,
            descripcion_openpay: this.createForm.get('descripcion_openpay').value,
            openPay: this.tokenOpenPay,
        };      

        console.log(datos)
    
                      
        try {
            // Create categories
            this._assistantsService.update(this.idEdit,datos).subscribe(
                // (response: any) => {
                ({ result, message }: { result: boolean; message: string }) => {
                    if (result) {
                        if (result) {
                            this.alertService.alertConfirmation(
                                'success',
                                message
                            );
                            this._router.navigateByUrl('/assistants');
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
  
}
