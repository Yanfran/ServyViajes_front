import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
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
import { EstatusDePagoReservacionComponent } from '../../components/estatus-de-pago-reservacion/estatus-de-pago-reservacion.component';

@Component({
    selector: 'app-watch',    
    standalone: true,
    imports: [CommonModule, MatDialogModule, NgStyle, MatRadioModule, NgIf, NgFor, MatTableModule, MatIconModule, MatButtonModule, RouterLink, MatIconModule, FormsModule, MatFormFieldModule, NgClass, MatInputModule, TextFieldModule, ReactiveFormsModule, MatButtonToggleModule, MatButtonModule, MatSelectModule, MatOptionModule, MatChipsModule, MatDatepickerModule, MatCheckboxModule, MatProgressSpinnerModule],
    templateUrl: './watch.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./watch.component.scss'],
})
export class WatchComponent {
    @ViewChild('createAssistants') createAssistants: NgForm;
    disableSelect = new FormControl(false);

    color: ThemePalette = 'primary';
    checked = false;        
    estatus: string = '';        
    base64Data: string = '';
    siRequiere: string = '';
    Isfacturacion: any = '';
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
    ) {
        this.sharedData = this._shareService.getSharedData();        
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
            telefono: ['', Validators.required],                                  
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
        });  

        if (this.sharedData) {   
            
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
            }
            
            if (
                this.sharedData.payment_proofs &&
                this.sharedData.payment_proofs.length > 0 &&
                this.sharedData.payment_proofs[0].nombre
                ) {
                this.IsThePaymentProofs = this.sharedData.payment_proofs[0].nombre;
            }
            this.IsThePaymentType = this.sharedData.payment_types.nombre; 
            this.IsTheCosto = this.sharedData.monto_total;

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
                facturacion: this.Isfacturacion,                                
                rfc: this.sharedData.rfc,            
                nombre_fiscal: this.sharedData.nombre_fiscal,            
                correo_facturacion: this.sharedData.correo_facturacion,            
                codigo_postal: this.sharedData.codigo_postal,            
                comentario_facturacion: this.sharedData.comentario_facturacion,                                     
                estatus: this.sharedData.estatus,     
                estatus_de_pago: this.sharedData.estatus_de_pago,                     
            });   
                        
            // if (this.sharedData.constancias) {
            //     this.imagenUp = true;
            // }            
        }         
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
}

