import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
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
import { debounceTime } from 'rxjs/operators';
import { DiscountsService } from 'app/services/discounts/discounts.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';


@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
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
  templateUrl: './create.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./create.component.scss']  
})
export class CreateComponent {  
  @ViewChild('createAssistants') createAssistants: NgForm;


    isChecked = true;
    color: ThemePalette = 'primary';
    checked = false;        
    estatus: string = '';        
    base64Data: string = '';
    siRequiere: string = 'si';
    Isfacturacion: boolean = true;
    categories: any[] = [];
    grados: any[] = [];        
    countrys: any[] = [];
    events: any[] = [];
    categoriesArray: any[] = [];
    eventoArray: any[] = [];
    taxRegimes: any[] = [];
    cfdis: any[] = [];
    createForm: FormGroup;
    imagenUp: boolean = false;
    sharedData: any;  
    descuento: any[] = [];  

    selectedEvent: any = {};
    selectedAvalibleCategory: any = {};
    
    constructor(
      private _formBuilder: UntypedFormBuilder,
      private _router: Router,      
      private alertService: AlertService,      
      private _categoriesService: CategoriesService,         
      private _countrysService: CountrysService,
      private _eventsService: EventsService,
      private _taxRegimesService: TaxRegimesService,
      private _cfdiService: CfdiService,
      private _shareService: SharedService,
      private _discountsService: DiscountsService              
    ) {}

    ngOnInit(): void { 
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
            // correo_facturacion: [
            //     { value: '', disabled: this.siRequiere !== 'si' },
            //     this.siRequiere == 'si' ? [Validators.email, Validators.maxLength(200) : ''],
            // ],                    
            correo_facturacion: { value: '', disabled: this.siRequiere !== 'si' },            
            codigo_postal: { value: '', disabled: this.siRequiere !== 'si' },            
            comentario_facturacion: { value: '', disabled: this.siRequiere !== 'si' },            
            taxRegimes: { value: '', disabled: this.siRequiere !== 'si' },            
            cfdis: { value: '', disabled: this.siRequiere !== 'si' },                        
            estatus: [false],
            agreements: ['', Validators.requiredTrue],            
        });                           

        this.sharedData = this._shareService.getSharedData();                  
        if (this.sharedData) {               
            console.log(this.sharedData);
            this.descuento = this.sharedData.descuento;
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
            });   
            
            this.base64Data = this.sharedData.constancias            
            if (this.sharedData.constancias) {
                this.imagenUp = true;
            }
        }  

        // Escucha cambios en el campo 'codigo_beca' con debounce de 300ms
        this.createForm.get('codigo_beca').valueChanges.pipe(
            debounceTime(300)
        ).subscribe(value => {
            // Aquí puedes realizar la petición con el valor del código de beca
            if(value) {
                this.realizarPeticion(value);
            }
        });

        this.eventos();       
        this.paises();
        this.regimesFiscales();                
        this.cfdiApi();                          
    }
 

    realizarPeticion(codigoBeca: string){

        var datos = {
            codigo_beca: codigoBeca,          
        };           
        
        this._discountsService.porcentaje(datos).subscribe(          
            ({ result, message, data  }: { result: boolean; message: string; data: any[] }) => {
              if (result) {                    
                    this.descuento = data; 
                    this.alertService.alertConfirmation(
                        'success',
                        message
                    );          
              } else {
                    this.createForm.patchValue({
                        codigo_beca: ''
                    });
                    this.alertService.alertConfirmation(
                        'error',
                        message
                    );                         
              }
          }
        );                   
    }


    onEventChange(eventoId: number): void {
        const eventoEncontrado = this.events.find(function(event) {            
            return event.id === eventoId;
        });
        // console.log(eventoEncontrado);               
        this.categories = eventoEncontrado?.available_categories ? eventoEncontrado?.available_categories : [];
        this.grados = eventoEncontrado?.grados ? eventoEncontrado?.grados : [];     
        // console.log(this.grados);               
        this.selectedEvent = eventoEncontrado;                        
    }

    onCostoChange(categoryId: any): void {
        //console.log(category);
        this.selectedAvalibleCategory = this.categories.find((avalibleCategory: any) => {
            return avalibleCategory.category_id === categoryId;
        })
    }
        
    onEstatusChange() {
        const controls = ['rfc', 'nombre_fiscal', 'correo_facturacion', 'codigo_postal', 'comentario_facturacion', 'taxRegimes', 'cfdis'];
        controls.forEach((controlName) => {
          if (this.createForm.get(controlName)) {
            if (this.siRequiere === 'si') {                
                this.Isfacturacion = true;
                this.createForm.get(controlName)?.enable();
            } else {                
                this.Isfacturacion = false;
                this.createForm.get(controlName)?.disable();
            }
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
    
    convertFileToBase64(file: File): void {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const base64String: string = reader.result as string;
            this.base64Data = base64String;
        };
        reader.readAsDataURL(file);
    }
    
    next(): void { 
        if (this.createForm.invalid) {            
            return;
        }  

        this.createForm.disable();      
        
        var datos = {
            codigo_beca: this.createForm.value.codigo_beca,  
            categoria_id: this.createForm.value.categories,                   
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
            evento_id: this.createForm.value.events,                      
            facturacion: this.Isfacturacion,                                
            rfc: this.createForm.value.rfc,            
            nombre_fiscal: this.createForm.value.nombre_fiscal,            
            correo_facturacion: this.createForm.value.correo_facturacion,            
            codigo_postal: this.createForm.value.codigo_postal,            
            comentario_facturacion: this.createForm.value.comentario_facturacion,            
            regimen_fiscal_id: this.createForm.value.taxRegimes,            
            cfdi_id: this.createForm.value.cfdis,            
            estatus: this.createForm.value.estatus,  
            eventoArray: this.eventoArray,
            constancias: this.base64Data,   
            descuento: this.descuento,
            selectedEvent: this.selectedEvent,
            selectedAvalibleCategory: this.selectedAvalibleCategory
        };           

        this._shareService.setSharedData(datos);        
        this._router.navigateByUrl('/create/assistants/two');      
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

    eventos(){
        const event_id = this.sharedData ? this.sharedData.evento_id : '';
        const category_id = this.sharedData ? this.sharedData.categoria_id: '';
        this._eventsService.getEventsWithCategories().subscribe(          
            ({ result, message, data  }: { result: boolean; message: string; data: any[] }) => {
              if (result) {
                    this.events = data;                    
                    console.log(this.events);                                         
                    if(event_id) {
                        this.createForm.patchValue({
                            events: event_id
                        });
                        this.onEventChange(event_id);
                    }
                    if(category_id) {
                        this.createForm.patchValue({
                            categories: category_id,
                        });
                        this.onCostoChange(category_id);
                    }                        
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
    }

    paises(){
        const selectedId = this.sharedData ? this.sharedData.pais_id : ''; 
        this._countrysService.getCountrys().subscribe(          
            ({ result, message, data  }: { result: boolean; message: string; data: any[] }) => {
              if (result) {
                    this.countrys = data;                     
                    if(this.sharedData){                                                
                        // Buscar el país con el ID deseado en la lista
                        const selectedCountry = this.countrys.find(country => country.id === selectedId);
    
                        // Verificar si el país fue encontrado y asignar el valor al FormControl
                        if (selectedCountry) {
                            this.createForm.get('countrys').setValue(selectedCountry.id); 
                        } else {
                            console.error('No se encontró el país con el ID deseado.');
                        }                        
                    } else {
                        this.createForm.get('countrys').setValue(data[0].id);                         
                    }
                                        
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
    }

    regimesFiscales(){
        const selectedId = this.sharedData ? this.sharedData.regimen_fiscal_id : ''; 
        this._taxRegimesService.list().subscribe(          
            ({ result, message, data  }: { result: boolean; message: string; data: any[] }) => {
              if (result) {
                  this.taxRegimes = data;     
                  if(this.sharedData){                                                
                      // Buscar el país con el ID deseado en la lista
                      const selectedRegimen = this.taxRegimes.find(taxRegime => taxRegime.id === selectedId);                      
  
                      // Verificar si el país fue encontrado y asignar el valor al FormControl
                      if (selectedRegimen) {
                          this.createForm.get('taxRegimes').setValue(selectedRegimen.id); 
                      } else {
                        //   console.error('No se encontró el país con el ID deseado.');
                      }                        
                  } else {
                        this.createForm.get('taxRegimes').setValue(data[0].id); 
                  }     
                  
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
    }

    cfdiApi(){
        const selectedId = this.sharedData ? this.sharedData.cfdi_id : ''; 
        this._cfdiService.list().subscribe(          
            ({ result, message, data  }: { result: boolean; message: string; data: any[] }) => {
              if (result) {
                  this.cfdis = data;   
                  
                  if(this.sharedData){                                                
                    // Buscar el país con el ID deseado en la lista
                    const selectedCfdi = this.cfdis.find(cfdi => cfdi.id === selectedId);                    

                    // Verificar si el país fue encontrado y asignar el valor al FormControl
                    if (selectedCfdi) {
                        this.createForm.get('cfdis').setValue(selectedCfdi.id); 
                    } else {
                        // console.error('No se encontró el país con el ID deseado.');
                    }                        
                } else {
                    this.createForm.get('cfdis').setValue(data[0].id); 
                }                   
                  
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
    }

}
