import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { NgClass, NgFor, NgIf, CommonModule  } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RoomsByHotelsService } from 'app/services/rooms_by_hotels/rooms-by-hotels.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { AlertService } from 'app/services/alert/alert.service';
import { SharedService } from 'app/services/shared/shared.service';
import { HotelsService } from 'app/services/hotels/hotels.service';
import {
    FormGroup,
    FormsModule,        
    UntypedFormBuilder,
    Validators,
} from '@angular/forms';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [
        NgFor,
        NgIf,
        CommonModule,
        FormsModule,          
        MatBadgeModule,
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
        MatButtonModule,
        RouterLink,
        NgClass,
        MatInputModule,
        MatSelectModule,
        MatChipsModule,
    ],
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./list.component.scss'],
})
export class ListComponent {    
    @ViewChild(MatPaginator) paginator: MatPaginator;
    displayedColumns: string[] = [        
        'nombre',
        'plan',   
        'habitacion',
        'cantidad_registrada',
        'habitacines_disponibles',        
        'vigencia_de_disponibilidad',
        'estatus',
        'acciones',
    ];
    dataSource = new MatTableDataSource<any>();
    hoteles: any[] = [];  
    createForm: FormGroup;
    hotelFilter: string;

    constructor(        
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private alertService: AlertService,
        private _shareService: SharedService,
        private __roomsByHotelsService: RoomsByHotelsService,
        private _hotelsService: HotelsService,
    ) {}

    ngOnInit(): void {
        this.createForm = this._formBuilder.group({
            hotel: ['', Validators.required],                      
        });


                

                

        let sharedData = this._shareService.getSharedData();
        // console.log(sharedData)
        if (sharedData && sharedData.key === 'verHabitacionH') {
            this.hotelFilter = sharedData.value;
        }

        this.load();
        this.hotelesApi();
    }

    load(): void {
        this.__roomsByHotelsService.list().subscribe(
            (response: any) => {
                if (response.result) {

                    let filteredData = response.data;                    
                    console.log(filteredData)

                    // Apply filters
                    if (this.hotelFilter && this.hotelFilter !== 'Seleccione un hotel') {                    
                      filteredData = filteredData.filter(item => item.hotel.nombre === this.hotelFilter);            
                      console.log(filteredData)
                    }
                    
                    this.dataSource.data = filteredData; 
                    // this.dataSource.data = response.data; 
                    // console.log(this.dataSource.data);

                    this.paginator.firstPage();
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

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    editar(element: any) {
        this._shareService.setSharedData(element);

        this._router.navigate(['/edit/rooms_by_hotels']);
    }

    ver(element: any) {
        this._shareService.setSharedData(element);

        this._router.navigate(['/watch/rooms_by_hotel']);
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
                this.__roomsByHotelsService.delete(id).subscribe(
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
                            this._router.navigateByUrl('/rooms_by_hotels');
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

    hotelesApi(){
        this._hotelsService.list().subscribe(
            (response: any) => {
                if (response.result) {
                    // console.log(response)
                    this.hoteles = [
                        { id: null, nombre: 'Seleccione un hotel' },
                        ...response.data, 
                      ];                    
                      if (!this.createForm.get('hotel').value) {
                        this.createForm.get('hotel').setValue(null);
                      }                    
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

    alertConfirmation(icon: SweetAlertIcon, title: string): void {
        this.alertService.alertConfirmation(icon, title);
    }
}
