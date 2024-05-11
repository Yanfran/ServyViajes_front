import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass, NgFor, NgIf, CommonModule, formatDate } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AlertService } from 'app/services/alert/alert.service';
import { PaymentTypeService } from 'app/services/payment_type/payment-type.service';
import { SharedService } from 'app/services/shared/shared.service';
import { AvailableCategoriesService } from 'app/services/available_categories/available-categories.service';
import { AssistantsService } from 'app/services/assistants/assistants.service';
import { ModalComponent } from 'app/modules/admin/components/modal/modal.component';
import { environment } from 'environments/environment';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

declare var OpenPay: any;

@Component({
  selector: 'app-form-two',
  standalone: true,
  imports: [MatProgressSpinnerModule, NgxMaskDirective, MatDialogModule, CommonModule, NgIf, NgFor, MatTableModule, MatIconModule, MatButtonModule, RouterLink, MatIconModule, FormsModule, MatFormFieldModule, NgClass, MatInputModule, TextFieldModule, ReactiveFormsModule, MatButtonToggleModule, MatButtonModule, MatSelectModule, MatOptionModule, MatChipsModule, MatDatepickerModule, MatCheckboxModule],
  templateUrl: './form-two.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./form-two.component.scss'],
  providers: [
    provideNgxMask(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  ]
})
export class FormTwoComponent {

  paymentTypes: any[] = [];
  sharedData: any;
  costo: number = 0;
  nombre: "";
  base64Data: string = '';
  createForm: FormGroup;
  imagenUp: boolean = false;
  descuento: any = 0;
  montoDescuento: any = 0;
  costoSinDescuento: any = 0;
  codigo_descuento: any;

  selectedEvent: any = {};
  pdfUrl: any = null;
  pdfPrograma: string[] = [];
  dataSource: any[] = [];
  comprobantes: any[] = [];
  totalMonto: number = 0;
  formularioLleno: boolean = false;
  archivoSeleccionado: boolean = false;
  showOpenpayForm: boolean = false;
  showDepositoForm: boolean = false;
  showComprobanteForm: boolean = false;
  tokenOpenPay: string;
  deviceSessionId: string;
  idPlan: number;
  cantidadPersonas: number;
  totalVerificar: number;
  payment_id_two: number;
  isLoading = false;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _router: Router,
    private alertService: AlertService,
    private _paymentTypeService: PaymentTypeService,
    private _shareService: SharedService,
    private _availableCategoriesService: AvailableCategoriesService,
    private _assistantsService: AssistantsService,
    private dialog: MatDialog,
  ) {
    this.sharedData = this._shareService.getSharedData();
    // console.log(this.sharedData)    
    if (!this.sharedData) {
      this._router.navigateByUrl('/create/assistants');
    }
  }

  async ngOnInit(): Promise<void> {
    this.createForm = this._formBuilder.group({
      clave_reservacion: [''],
      tipo_pago: [''], //, Validators.required
      pdf_programa: [''],
      fecha: [''],
      monto: [''],
      numero_movimiento: [''],

      nombres_openpay: [''], //Juan
      apellidos_openpay: [''], //Perez Ramirez
      email_openpay: ['', Validators.email],
      ciudad_openpay: [''], //Querétaro
      estado_openpay: [''],
      cp_openpay: [''], //76900
      direccion_openpay: [''], //Av 5 de Febrero
      numero_openpay: [''], //4111111111111111
      mes_openpay: [''], //03
      año_openpay: [''], //25
      cvv2_openpay: [''], //110
      monto_openpay: [''],
      descripcion_openpay: [''],
      observaciones: [''],
      agreements: [''],
    });

    this.createForm.get('tipo_pago').valueChanges.subscribe(paymentId => {
      const agreementsControl = this.createForm.get('agreements');

      if (paymentId === 2) {
        agreementsControl.setValidators(Validators.requiredTrue);
      } else {
        agreementsControl.clearValidators();
      }

      agreementsControl.updateValueAndValidity();
    });

    //   this.getListPaymentType();

    this.descuento = this.sharedData?.descuento?.porcentaje ? this.sharedData?.descuento?.porcentaje : 0;
    this.codigo_descuento = this.sharedData?.descuento?.codigo_descuento ? this.sharedData?.descuento?.codigo_descuento : '';

    this.selectedEvent = this.sharedData.selectedEvent;
    this.costo = this.sharedData.selectedAvalibleCategory.costo;

    this.costoSinDescuento = this.costo;
    this.montoDescuento = this.costo * (this.descuento / 100);
    this.costo = this.costo - (this.costo * (this.descuento / 100)); // Divide el descuento por 100 para obtener el porcentaje

    this.totalVerificar = this.costo;

    this._paymentTypeService.list().subscribe(
      ({ result, message, data }: { result: boolean; message: string; data: any[] }) => {
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
        this.createForm.get('fecha').reset();
        this.createForm.get('monto').reset();
        this.createForm.get('numero_movimiento').reset();
        this.base64Data == '';
        this.imagenUp = false;
        this.archivoSeleccionado = false;
      }
      if (paymentId) {
        this.showOpenpayForm = paymentId === 2;
      }
      if (paymentId) {
        this.showDepositoForm = paymentId === 3;
        this.createForm.get('fecha').reset();
        this.createForm.get('monto').reset();
        this.createForm.get('numero_movimiento').reset();
        this.base64Data == '';
        this.imagenUp = false;
        this.archivoSeleccionado = false;
      }
    });

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
      fecha: fechaInicioFormatted,
      monto: programa.monto,
      numero_movimiento: programa.numero_movimiento,
      comprobante: this.base64Data
    };

    this.totalMonto += programa.monto;

    this.comprobantes.push(data);
    // console.log("emiliano", this.comprobantes)
    //reinciar formulario

    this.payment_id_two = programa.tipo_pago;

    this.createForm.reset();
    this.imagenUp = false;
    this.archivoSeleccionado = false;
    this.actualizarEstadoBoton();


    this.createForm.get('tipo_pago').disable();
    this.createForm.get('fecha').disable();
    this.createForm.get('monto').disable();
    this.createForm.get('numero_movimiento').disable();

  }

  eliminarPrograma(item: any) {
    this.comprobantes = this.comprobantes.filter((programa) => programa.id !== item.id);
    this.base64Data = "";

    this.createForm.get('tipo_pago').enable();
    this.createForm.get('fecha').enable();
    this.createForm.get('monto').enable();
    this.createForm.get('numero_movimiento').enable();
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
      } else if (isPDF) {
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

  convertFileToBase64(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64String: string = reader.result as string;
      this.base64Data = base64String;
    };
    reader.readAsDataURL(file);
  }


  cp(event: any) {
    const maxLength = 5;
    if (event.target.value.length > maxLength) {
      event.target.value = event.target.value.slice(0, maxLength);
    }
  }

  numeroTarjeta(event: any) {
    const maxLength = 16;
    if (event.target.value.length > maxLength) {
      event.target.value = event.target.value.slice(0, maxLength);
    }
  }

  mes(event: any) {
    const maxLength = 2;
    if (event.target.value.length > maxLength) {
      event.target.value = event.target.value.slice(0, maxLength);
    }
  }

  ano(event: any) {
    const maxLength = 2;
    if (event.target.value.length > maxLength) {
      event.target.value = event.target.value.slice(0, maxLength);
    }
  }

  cvv(event: any) {
    const maxLength = 3;
    if (event.target.value.length > maxLength) {
      event.target.value = event.target.value.slice(0, maxLength);
    }
  }


  async create(): Promise<void> {
    if (this.createForm.invalid) {
      return;
    }

    this.isLoading = true;

    this.createForm.disable();

    if (this.showOpenpayForm) {
      await this.setupOpenPay();
    }

    // const costo = this.sharedData.eventoArray[0]?.costo || 0;    
    var datos = {
      codigo_beca: this.sharedData.codigo_beca,
      categoria_id: this.sharedData.categoria_id,
      grado_academico: this.sharedData.grado_academico,
      nombre: this.sharedData.nombre,
      apellido_paterno: this.sharedData.apellido_paterno,
      apellido_materno: this.sharedData.apellido_materno,
      correo_electronico: this.sharedData.correo_electronico,
      telefono: this.sharedData.telefono,
      comentario: this.sharedData.comentario,
      pais_id: this.sharedData.pais_id,
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
      regimen_fiscal_id: this.sharedData.regimen_fiscal_id,
      cfdi_id: this.sharedData.cfdi_id,
      estatus: this.sharedData.estatus,
      costo: this.costo,
      // tipo_pago_id: this.createForm.value.paymentTypes,             
      constancias: this.sharedData.constancias,
      comprobantes: this.comprobantes, //this.base64Data,  
      descuento: this.descuento,
      codigo_descuento: this.codigo_descuento,

      payment_id: this.createForm.get('tipo_pago').value ? this.createForm.get('tipo_pago').value : this.payment_id_two,
      device_sesion: this.deviceSessionId,
      monto_openpay: this.createForm.get('monto_openpay').value,
      nombres_openpay: this.createForm.get('nombres_openpay').value,
      apellidos_openpay: this.createForm.get('apellidos_openpay').value,
      email_openpay: this.createForm.get('email_openpay').value,
      descripcion_openpay: this.createForm.get('descripcion_openpay').value,
      openPay: this.tokenOpenPay,
    };



    try {
      // Create categories
      this._assistantsService.create(datos).subscribe(
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
              this.isLoading = false;
              this.createForm.enable();
              this.alertService.alertConfirmation(
                'error',
                message
              );
            }
          } else {
            this.isLoading = false;
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

  regresar(): void {
    this._shareService.setSharedData(this.sharedData);
    this._router.navigateByUrl('/create/assistants');
  }

}
