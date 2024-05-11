import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgFor, NgIf, CommonModule  } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AssistantsService } from 'app/services/assistants/assistants.service';
import { FormGroup, FormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'app/services/alert/alert.service';
import { environment } from 'environments/environment';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalComponent } from '../../components/modal/modal.component';
import { SharedService } from 'app/services/shared/shared.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { CategoriesService } from 'app/services/categories/categories.service';
import { EventsService } from 'app/services/events/events.service';


@Component({
  selector: 'app-assistants',
  standalone   : true,
  imports: [FormsModule, CommonModule, NgFor, MatDialogModule, NgIf, MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule, RouterLink, NgClass, MatInputModule, MatSelectModule],
  templateUrl: './assistants.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./assistants.component.scss']
})



export class AssistantsComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;    
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['id', 'evento', 'nombre', 'telefono', 'categoria', 'tipo_de_pago', 'monto', 'comprobante', 'estatus_pago', 'acciones'];        
  categoriaFilter: string;
  estatusPagoFilter: string;
  eventosFilter: string;
  searchText: string;
  categoriesList: any[];
  eventosList: any[];
  createForm: FormGroup;

  

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _assistantsService: AssistantsService,
    private _router: Router,
    private alertService: AlertService,
    private dialog: MatDialog,
    private _shareService: SharedService,
    private _categoriesService: CategoriesService,
    private _eventsService: EventsService
    ) {}  


  ngOnInit(): void {
    this.createForm = this._formBuilder.group({
      category: ['', Validators.required],
      events: ['', Validators.required],                      
    });

    this.load();
    this.categories();
    this.eventos();
  }


  openModal(imageName: string): void {
    const imageUrl = `${this.urlImg}/assets/comprobantes/${imageName}`;
    // console.log('URL de la imagen:', imageUrl);
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
  

  applyPhoneNumberMask(phoneNumber: string): string {
    if (!phoneNumber) return ''; // Manejar casos de número de teléfono nulo o vacío
    const maskedPhoneNumber = phoneNumber.slice(0, 2) + '-' + phoneNumber.slice(2, 6) + '-' + phoneNumber.slice(6);
    return maskedPhoneNumber;
  }



  load(): void {
    this._assistantsService.list().subscribe(
      (response: any) => {
        if (response.result) {

          let filteredData = response.data;

          // Apply filters
          if (this.categoriaFilter && this.categoriaFilter !== 'Seleccione una categoria') {
            filteredData = filteredData.filter(item => item.category.descripcion === this.categoriaFilter);            
          }
  

          if (this.estatusPagoFilter !== null && this.estatusPagoFilter !== undefined) {            
            filteredData = filteredData.filter(item => item.estatus_de_pago === Number(this.estatusPagoFilter));
          }

          if (this.eventosFilter && this.eventosFilter !== 'Seleccione un evento') {            
            filteredData = filteredData.filter(item => item.event.nombre === this.eventosFilter);
          }
          
  
          if (this.searchText) {
            filteredData = filteredData.filter(item => item.nombre === this.searchText);            
          }

          // this.dataSource.data = response.data;
          this.dataSource.data = filteredData;
          // console.log(this.dataSource.data);


          this.paginator.firstPage();
        } else {
          console.error('Error al obtener la lista:', response.message);
        }
      },
      (error) => {
        console.error('Error al obtener la lista:', error);
      }
    );
  }


  categories(): void {
    this._categoriesService.list().subscribe(
      (response: any) => {
        if (response.result) {    

          this.categoriesList = [
            { id: null, descripcion: 'Seleccione una categoria' },
            ...response.data, 
          ];                    
          if (!this.createForm.get('category').value) {
            this.createForm.get('category').setValue(null);
          }            

          // this.categoriesList = response.data;      
          // console.log(response.data);          
        } else {
          console.error('Error al obtener la lista:', response.message);
        }
      },
      (error) => {
        console.error('Error al obtener la lista:', error);
      }
    );
  }


  eventos(): void {
    this._eventsService.getEventV3().subscribe(
      (response: any) => {
        if (response.result) {    
          
          this.eventosList = [
            { id: null, nombre: 'Seleccione un evento' },
            ...response.data, 
          ];                    
          if (!this.createForm.get('events').value) {
            this.createForm.get('events').setValue(null);
          }            

          // this.categoriesList = response.data;      
          // console.log(response.data);          
        } else {
          console.error('Error al obtener la lista:', response.message);
        }
      },
      (error) => {
        console.error('Error al obtener la lista:', error);
      }
    );
  }
  


  getStatusText(estatus_de_pago: number): string {
    switch (estatus_de_pago) {
        case 0:
            return 'Cancelado';
        case 1:
            return 'Pendiente';
        case 2:
            return 'Acreditado';
        case 3:
            return 'Pagado';
        default:
            return 'Texto por defecto';
    }
  } 

  getStatusColor(estatus_de_pago: number): string {
    switch (estatus_de_pago) {
      case 0:
        return 'red';
      case 1:
        return 'orange';
      case 2:
        return 'blue';
      case 3:
        return 'green';
      default:
        return '';
    }
  }
  

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


      
  create(): void {     
    var datos = [];
    this._shareService.setSharedData(datos);        
    this._router.navigateByUrl('/create/assistants');     
  }

  see(element: any): void {         
    this._shareService.setSharedData(element);        
    this._router.navigateByUrl('/watch/assistants');     
  }

  edit(element: any): void {         
    this._shareService.setSharedData(element);        
    this._router.navigateByUrl('/edit/assistants');     
  }

  delete(id: number): void {
    Swal.fire({
        title: '¿Estas seguro?',
        text: 'Este proceso es irreversible.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            this._assistantsService.delete(id).subscribe(
                ({
                    result,
                    message,
                }: {
                    result: boolean;
                    message: string;
                }) => {
                    if (result) {
                        this.load();
                        this.alertService.alertConfirmation(
                            'success',
                            message
                        );
                        this._router.navigateByUrl('/assistants');
                    } else {
                        this.alertService.alertConfirmation(
                            'success',
                            message
                        );
                    }
                },
                (error) => {
                    this.alertService.alertConfirmation('success', error);
                }
            );
        }
    });
  }

  
  alertConfirmation(icon: SweetAlertIcon, title: string): void {
    this.alertService.alertConfirmation(icon, title);
  }


}

