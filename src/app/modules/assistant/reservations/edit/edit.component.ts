import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, NgForm, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, ThemePalette } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { Router, RouterLink } from '@angular/router';
import { EventsService } from 'app/services/events/events.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePipe, NgClass, NgFor, NgIf, NgStyle, formatDate } from '@angular/common';
import { AlertService } from 'app/services/alert/alert.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReservationsService } from 'app/services/reservations/reservations.service';
import { PaymentTypeService } from 'app/services/payment_type/payment-type.service';


import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DiscountsService } from 'app/services/discounts/discounts.service';
import { fuseAnimations } from '@fuse/animations';
import { SharedService } from 'app/services/shared/shared.service';
import { environment } from 'environments/environment';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'app/modules/admin/components/modal/modal.component';
import { CommonModule } from '@angular/common';
//import para calendarios
import { Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { EstatusDePagoReservacionComponent } from 'app/modules/admin/components/estatus-de-pago-reservacion/estatus-de-pago-reservacion.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

declare var OpenPay: any;

@Component({
  selector: 'app-edit',
  animations: fuseAnimations,
  standalone: true,
  imports: [
    MatTableModule,
    MatChipsModule,
    MatButtonToggleModule,
    NgFor,
    NgClass,
    MatStepperModule,
    MatSelectModule,
    MatRadioModule,
    MatOptionModule,
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
    MatDialogModule,
    CommonModule,
    NgxMaskDirective
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    provideNgxMask(),
  ],
  templateUrl: './edit.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent {
  @ViewChild('signUpNgForm') signUpNgForm: NgForm;

  createForm: FormGroup;
  programaForm: FormGroup;

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
  monto_total: number;
  reservation_details
    : any[];
  reservation_rooms: any[];
  adultos: any[];
  reservation_rooms_details: any[];

  IsTheEvent: string = '';
  IsThePlan: string = '';
  fechaEntrada: any = '';
  fechaSalida: any = '';
  base64Strings: string[] = [];

  pdfUrl: any = null;
  pdfPrograma: string[] = [];
  dataSource: any[] = [];
  comprobantes: any[] = [];
  imagenUp: boolean = false;
  base64Data: string = '';
  totalMonto: number = 0;
  formularioLleno: boolean = false;
  archivoSeleccionado: boolean = false;

  showOpenpayForm: boolean = false;
  showComprobanteForm: boolean = false;
  showDepositoForm: boolean = false;
  tokenOpenPay: string;
  deviceSessionId: string;
  idEdit = 0;
  selectedValue: number;


  constructor(
    private _shareService: SharedService,
    private _formBuilder: UntypedFormBuilder,
    private _router: Router,
    private _discountsService: DiscountsService,
    private alertService: AlertService,
    private _eventsService: EventsService,
    private _datePipe: DatePipe,
    private _paymentTypeService: PaymentTypeService,
    public dialog: MatDialog,
    private _reservationsService: ReservationsService,
    private _adapter: DateAdapter<any>,    
    @Inject(MAT_DATE_LOCALE) private _locale: string
  ) {
    this.sharedData = this._shareService.getSharedData();
    console.log(this.sharedData)

    if (!this.sharedData) {
      this._router.navigateByUrl('/mis-reservaciones');
    }
  }

  async ngOnInit(): Promise<void> {
    //importante: configuracion de calendarios en español
    //formato: DD-MM-yyyy
    this._locale = 'es';
    this._adapter.setLocale(this._locale);

    this.createForm = this._formBuilder.group({
      events: ['', Validators.required],
      nombre: ['', Validators.required],
      servicio: ['', Validators.required],

      planes: ['', Validators.required],
      fecha_entrada: ['', Validators.required],
      fecha_salida: ['', [Validators.required, this.fechaSalidaValida()]],
      grados: this._formBuilder.array([]),

      nombre_solicitante: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[a-zA-Z\s]*$/)]],
      apellidos_solicitantes: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[a-zA-Z\s]*$/)]],
      correo_solicitante: ['', [Validators.required, Validators.email]],
      telefono_solicitantes: ['', Validators.required],
      ciudad_solicitante: ['', Validators.required],
      estatus: [false]
    });

    this.programaForm = this._formBuilder.group({
      tipo_pago: [''],
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

    })

    this.comprobantes = this.sharedData.reserve_payments ? this.sharedData.reserve_payments : [];
    this.reservation_details = this.sharedData.reservation_details;
    this.reservation_rooms = this.sharedData.reservation_rooms;
    this.monto_total = this.sharedData.monto_total;
    this.IsThePlan = this.sharedData.plans.nombre;
    this.fechaEntrada = this._datePipe.transform(this.sharedData.fecha_entrada, 'dd/MM/yyyy');
    this.fechaSalida = this._datePipe.transform(this.sharedData.fecha_salida, 'dd/MM/yyyy');
    

    if (this.sharedData) {
      this.idEdit = this.sharedData.id,
      this.createForm.patchValue({
        planes: this.sharedData.plan_id,
        fecha_entrada: this.sharedData.fecha_entrada,
        fecha_salida: this.sharedData.fecha_salida,
        nombre_solicitante: this.sharedData.nombre_solicitante,
        apellidos_solicitantes: this.sharedData.apellido_solicitante,
        correo_solicitante: this.sharedData.correo_solicitante,
        telefono_solicitantes: this.sharedData.telefono_solicitante,
        ciudad_solicitante: this.sharedData.ciudad_solicitante,
        estatus: this.sharedData.estatus,
      });
    }

    try {
      await this.eventos();
      await this.planId(this.sharedData.plan_id);
    } catch (error) {
      console.error('Error en ngOnInit:', error);
    }

    this._paymentTypeService.list().subscribe(
      ({ result, message, data }: { result: boolean; message: string; data: any[] }) => {
        if (result) {
          this.paymentTypes = data;
          this.createForm.get('tipo_pago').setValue(data[0].id);
        } else {
          console.log(
            'Error al obtener la lista:',
            message
          );
        }
      },
    );

    this.programaForm.get('tipo_pago').valueChanges.subscribe(async paymentId => {
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

    this.programaForm.valueChanges.subscribe(() => {
      this.actualizarEstadoBoton();
    });

    await this.actualizarEstadoBoton();
  }

  fechaSalidaValida(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const fechaSalida = control.value;
      const fechaEntrada = this.createForm?.get('step2')?.get('fecha_entrada')?.value;
      const invalid = fechaSalida && fechaEntrada && fechaSalida <= fechaEntrada;
      return invalid ? { 'fechaSalidaInvalida': { value: control.value } } : null;
    };
  }

  dateFilter = (date: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ajustar a la medianoche actual

    return date && date >= today;
  };


  async eventos(): Promise<void> {

    try {
      const selectedId = this.sharedData ? this.sharedData.event_id : '';
      const response = await this._eventsService.getEventV3().toPromise();
      const { result, message, data } = response;

      console.log("data principal", data);
      if (result) {
        this.data = data;
        this.events = data;

        if (this.sharedData) {
          const selectedEvent = this.events.find(event => event.id === selectedId);

          // console.log("hola", selectedEvent)

          if (selectedEvent) {
            this.IsTheEvent = selectedEvent.nombre;
            this.eventoId(selectedEvent.id);
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
      // console.log("Resultado del eventoId", result)

      if (result) {

        // Servicios
        const serviciosArray = [];
        if (result && result && result.hotel) {
          this.idHotel = result.hotel.id;
          this.nombreHotel = result.hotel.nombre;
          this.createForm.get('nombre').setValue(this.nombreHotel);
        }

        if (result && result && result.hotel.servicios) {
          for (let i = 0; i < result.hotel.servicios.length; i++) {
            const descripcion = result.hotel.servicios[i].descripcion;
            var space = "";
            if (i > 0) {
              space = " ";
            }
            serviciosArray.push(space + descripcion);
          }
        } else {
          console.error('No se pudieron encontrar los servicios');
        }

        console.log(serviciosArray)
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
              nombresYaAgregados.add(planNombre);
            }
          }
        } else {
          console.error('No se pudieron encontrar los planes.');
        }

        console.log(planesArray);
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
      this.selectedPlanData = [];

      for (const planes of this.data) {

        if (planes.hotel_id === this.idHotel) {

          console.log("planes", planes)

          const matchingRooms = planes.hotel.rooms_by_hotels.filter(room =>
            this.reservation_rooms.some(room_selected => room.tipo_habitacion == room_selected.room_type_name )  
          );

          this.selectedPlanData = matchingRooms;

          console.log("selectedPlanData", this.selectedPlanData);

        }

      }
    } catch (error) {
      console.error('Error en eventoId:', error);
    }
  }

  hoy: Date = new Date();
  haceSieteDias: Date = new Date(this.hoy.getTime() - 7 * 24 * 60 * 60 * 1000);

  private async actualizarEstadoBoton(): Promise<void> {
    const formularioCompleto = await this.verificarCamposLlenos();
    const archivoSeleccionado = this.archivoSeleccionado;
    this.formularioLleno = formularioCompleto && archivoSeleccionado;
  }

  private async verificarCamposLlenos(): Promise<boolean> {
    const formulario = this.programaForm.getRawValue();
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

  convertFileToBase64(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64String: string = reader.result as string;
      this.base64Data = base64String;
    };
    reader.readAsDataURL(file);
  }

  eliminarPrograma(item: any) {
    this.comprobantes = this.comprobantes.filter((programa) => programa.id !== item.id);
    this.base64Data = "";
  }

  isBase64(str: string): boolean {
    try {
      return btoa(atob(str)) == str;
    } catch (err) {
      return false;
    }
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

  getStatusText(estatus_de_pago: number): string {
    switch (estatus_de_pago) {
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

  getStatusColor(estatus_de_pago: number): string {
    switch (estatus_de_pago) {
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
    // if ( this.createForm.invalid )
    // {
    //     return;
    // }         

    // this.createForm.disable();


    if (this.showOpenpayForm) {
      await this.setupOpenPay();
    }


    var datos = {
      comprobantes: this.comprobantes,
      openPay: this.tokenOpenPay,
      estatus: this.createForm.value.estatus,
      device_sesion: this.deviceSessionId,
      monto_openpay: this.programaForm.value.monto_openpay, // get('monto_openpay').value,
      nombres_openpay: this.programaForm.value.nombres_openpay, // get('nombres_openpay').value,
      apellidos_openpay: this.programaForm.value.apellidos_openpay, // get('apellidos_openpay').value,
      email_openpay: this.programaForm.value.email_openpay, // get('email_openpay').value,
      descripcion_openpay: this.programaForm.value.descripcion_openpay, // get('descripcion_openpay').value,      
      payment_id: this.programaForm.get('tipo_pago').value,
    };

    console.log(datos)
    // return;

    try {
      this._reservationsService.update(this.idEdit, datos).subscribe(
        ({ result, message }: { result: boolean; message: string }) => {
          if (result) {
            if (result) {
              this.alertService.alertConfirmation('success', message);
              this._router.navigateByUrl('/mis-reservaciones');
            } else {
              this.createForm.enable();
              this.alertService.alertConfirmation('error', message);
            }
          } else {
            this.createForm.enable();
            this.alertService.alertConfirmation('error', message);
          }
        },
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
        this._router.navigateByUrl('/mis-reservaciones');
      }
    });
  }

  alertConfirmation(icon: SweetAlertIcon, title: string): void {
    this.alertService.alertConfirmation(icon, title);
  }

  async setupOpenPay(): Promise<void> {
    return new Promise((resolve, reject) => {
      OpenPay.setId('mnco0uqmapdz8xhglddh');
      OpenPay.setApiKey('pk_ca3d253ab8404724910a13b22b622a71');
      OpenPay.setSandboxMode(true);
      const deviceDataId = OpenPay.deviceData.setup("formId");

      const cardData = {
        "card_number": this.programaForm.value.numero_openpay,  //"4111111111111111"
        "holder_name": this.programaForm.value.nombres_openpay, //"Juan Perez Ramirez",
        "expiration_year": this.programaForm.value.año_openpay, //"25",
        "expiration_month": this.programaForm.value.mes_openpay, //"03",
        "cvv2": this.programaForm.get('cvv2_openpay').value, //"110",        
        "address": {
          "city": this.programaForm.value.ciudad_openpay, //"Querétaro",
          "postal_code": this.programaForm.value.cp_openpay, //"76900",
          "country_code": "MX",
          "state": this.programaForm.value.estado_openpay, //"Queretaro",
          "line1": this.programaForm.value.direccion_openpay, //"Av 5 de Febrero",
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

  agregarPrograma() {

    this.formularioLleno = false;
    // this.comprobantes = [];
    let programa = this.programaForm.value;

    // console.log("hi", programa)
    const fechaInicioFormatted = formatDate(programa.fecha, 'yyyy-MM-dd', 'en-US');

    //generar id unico
    let numAleatorioUno = Math.floor(Math.random() * 100) + 1;
    let numAleatorioDos = Math.floor(Math.random() * 100) + 1;
    let nuevoId = `${numAleatorioUno}${numAleatorioDos}`;

    var data = {
      id: nuevoId,
      payment_id: programa.tipo_pago,
      date: fechaInicioFormatted,
      amount: programa.monto,
      motion: programa.numero_movimiento,
      voucher: this.base64Data,
      estatus: 0
    };

    this.totalMonto += programa.monto;

    this.comprobantes.push(data);
    console.log("emiliano", this.comprobantes)
    //reinciar formulario
    this.programaForm.reset();
    this.imagenUp = false;
    this.archivoSeleccionado = false;
    this.actualizarEstadoBoton();

  }

}
