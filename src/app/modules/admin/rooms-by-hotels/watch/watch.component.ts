import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass, formatDate } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, FormArray, FormGroup, UntypedFormArray, FormControl } from '@angular/forms';
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
import { fuseAnimations } from '@fuse/animations';
import { HotelsService } from 'app/services/hotels/hotels.service';
import { AlertService } from 'app/services/alert/alert.service';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedService } from 'app/services/shared/shared.service';
import { SweetAlertIcon } from 'sweetalert2';
import { MatNativeDateModule } from '@angular/material/core';
import { PlanTypesService } from 'app/services/plan_types/plan-types.service';
import { RoomsByHotelsService } from 'app/services/rooms_by_hotels/rooms-by-hotels.service';
//import para calendarios
import { Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
//mascara
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
    selector: 'app-watch',
    animations: fuseAnimations,
    standalone: true,
    imports: [
      MatNativeDateModule, 
      CarouselModule, 
      CommonModule, 
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
      NgxMaskDirective,
    ],
    providers: [
      { provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
      provideNgxMask(),
    ],
    templateUrl: './watch.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./watch.component.scss'],
})
export class WatchComponent {
   
  @ViewChild('signUpNgForm') signUpNgForm: NgForm;

  color: ThemePalette = 'primary';  
  idEdit = 0;  
  sharedData: any;  
  categories: any[] = []; 
  hoteles: any[] = []; 
  plans: any[] = [];    
  IsTheHotel: string = ''; 
  IsThePlan: string = ''; 
  createForm: FormGroup;  
  aplica: boolean = false;
  

  constructor(
    private _shareService: SharedService,
    private _formBuilder: UntypedFormBuilder,
    private _router: Router,
    private _hotelsService: HotelsService,
    private alertService: AlertService,        
    private _planTypesService: PlanTypesService,
    private _roomsByHotelsService: RoomsByHotelsService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string
    ) {      

      this.sharedData = this._shareService.getSharedData();
    //   console.log(this.sharedData)            

      if (!this.sharedData) {
        this._router.navigateByUrl('/rooms_by_hotels');
      }  

    }


    ngOnInit(): void {
      //importante: configuracion de calendarios en español
      //formato: DD-MM-yyyy
      this._locale = 'es';
      this._adapter.setLocale(this._locale);
      
        // Create the form
        this.createForm = this._formBuilder.group({        
          hoteles: ['', Validators.required],
          plans: ['', Validators.required],        
          tipo_habitacion: ['', Validators.required],
        //   precio_adulto: ['', Validators.required],
          sencilla: ['', Validators.required],
          doble: ['', Validators.required],
          triple: ['', Validators.required],
          cuadruple: ['', Validators.required],
          infante_edad_minima: ['', Validators.required],
        infante_edad_maxima: ['', Validators.required],
        infante_precio_menores: ['', Validators.required],
        edad_minima: ['', Validators.required],
        edad_maxima: ['', Validators.required],
        precio_menores: ['', Validators.required],
        junior_edad_minima: { value: '', disabled: this.aplica !== true },
        junior_edad_maxima: { value: '', disabled: this.aplica !== true },
        junior_precio_menores: { value: '', disabled: this.aplica !== true },   
          habitaciones_disponibles: ['', Validators.required],
          vigencia: ['', Validators.required],
          estatus: [false],  
        });
  
  
        if (this.sharedData) {        
          this.idEdit = this.sharedData.id,    
          this.aplica = this.sharedData.aplica, 

            this.aplica = this.sharedData.aplica === 1 ? true : false;  
            const controls = ['junior_edad_minima','junior_edad_maxima','junior_precio_menores'];
            controls.forEach((controlName) => {
            if (this.createForm.get(controlName)) {
                if (this.aplica) {                
                    // this.Isfacturacion = 1;
                    this.createForm.get(controlName)?.enable();
                } else {                
                    // this.Isfacturacion = 0;
                    this.createForm.get(controlName)?.disable();
                }
            }
            });    

          this.createForm.patchValue({              
              tipo_habitacion: this.sharedData.tipo_habitacion,   
              sede: this.sharedData.sede,              
            //   precio_adulto: this.sharedData.precio_adulto,
              sencilla: this.sharedData.sencilla,
              doble: this.sharedData.doble,
              triple: this.sharedData.triple,
              cuadruple: this.sharedData.cuadruple,
              infante_edad_minima: this.sharedData.infante_edad_minima,
            infante_edad_maxima: this.sharedData.infante_edad_maxima,
            infante_precio_menores: this.sharedData.infante_precio_menores,
            edad_minima: this.sharedData.edad_minima,
            edad_maxima: this.sharedData.edad_maxima,
            precio_menores: this.sharedData.precio_menores,
            aplica: this.sharedData.aplica,
            junior_edad_minima: this.sharedData.junior_edad_minima,
            junior_edad_maxima: this.sharedData.junior_edad_maxima,
            junior_precio_menores: this.sharedData.junior_precio_menores,
              habitaciones_disponibles: this.sharedData.habitaciones_disponibles,
              vigencia: this.formatearFecha(this.sharedData.vigencia),
              estatus: this.sharedData.estatus,
          });                        
        }      
  
        this.hotelesApi();
        this.plantTypesApi();                      
    }
    
  
    hotelesApi(){
        const selectedId = this.sharedData ? this.sharedData.hotel_id : ''; 
        this._hotelsService.getHotels().subscribe(          
              ({ result, message, data  }: { result: boolean; message: string; data: any[] }) => {
                if (result) {  
                    this.hoteles = data; 
                    
                    if(this.sharedData){                                                                      
                        const selectedHotel = this.hoteles.find(hotel => hotel.id === selectedId);                                              
                        if (selectedHotel) {                            
                            this.IsTheHotel = selectedHotel.nombre;
                            this.createForm.get('hoteles').setValue(selectedHotel.id); 
                        } else {                        
                        }                        
                    } else {
                          this.createForm.get('hotel').setValue(data[0].id); 
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
  
  
    plantTypesApi(){
        const selectedId = this.sharedData ? this.sharedData.plan_id : ''; 
          this._planTypesService.list().subscribe(
            ({ result, message, data  }: { result: boolean; message: string; data: any[] }) => {
                if (result) { 
                    this.plans = data;                                        
                    if(this.sharedData){                                                                      
                    const selectedPlan = this.plans.find(plan => plan.id === selectedId);                                              
                    if (selectedPlan) {
                        this.IsThePlan = selectedPlan.nombre;                           
                        this.createForm.get('plans').setValue(selectedPlan.id); 
                    } else {                        
                    }                        
                    } else {
                        this.createForm.get('plan').setValue(data[0].id); 
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
  

    alertConfirmation(icon: SweetAlertIcon, title: string): void {
        this.alertService.alertConfirmation(icon, title);
    }

    formatearFecha(fecha: string): string {
      const fechaNumerica = fecha;
      const newFecha: Date = new Date(fechaNumerica);
      newFecha.setUTCHours(23, 0, 0, 0);
      const fechaFormateada: string = newFecha.toISOString();
  
      //console.log(fechaFormateada);
      return fechaFormateada;
    }
}
