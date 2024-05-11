import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { NgClass, NgFor, NgIf, CommonModule  } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { SweetAlertIcon } from 'sweetalert2';
import { AlertService } from 'app/services/alert/alert.service';
import { SharedService } from 'app/services/shared/shared.service';
import { ReservationsService } from 'app/services/reservations/reservations.service';
import { FormGroup, FormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { EventsService } from 'app/services/events/events.service';
import { HotelsService } from 'app/services/hotels/hotels.service'; 

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [
        NgFor,
        NgIf,
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
        CommonModule,
        FormsModule
    ],
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./list.component.scss'],
})
export class ListComponent implements AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    displayedColumns: string[] = [
        'id',
        'nombre',
        'hotel',
        'clave',
        'fecha_entrada',
        'fecha_salida',
        'total_noches',
        'cantidad_habitaciones',
        'tipo_habitacion',
        'tipo_plan',
        'monto_a_pagar',
        'total_pagado',
        'comprobante',
        // 'tipo_de_pago',
        'estatus',
        'acciones',
    ];    
    createForm: FormGroup;
    dataSource = new MatTableDataSource<any>();
    hotelList: any[];
    hotelesFilter: string;

    constructor(
        private _formBuilder: UntypedFormBuilder,        
        private _router: Router,
        private alertService: AlertService,
        private _shareService: SharedService,
        private _reservationsService: ReservationsService,
        private _eventsService: EventsService,
        private _hotelsService: HotelsService
    ) { }

    ngOnInit(): void {
        this.createForm = this._formBuilder.group({            
            hotels: ['', Validators.required],                      
        });      
        this.load();
        this.hoteles();
    }

    load(): void {
        this._reservationsService.list().subscribe(
            (response: any) => {
                if (response.result) {
                    
                    let filteredData = response.data;

                    // console.log(filteredData)

                    // Apply filters
                    if (this.hotelesFilter && this.hotelesFilter !== 'Seleccione un hotel') {            
                        filteredData = filteredData.filter(item => item.hotel.nombre === this.hotelesFilter);
                    }

                    // this.dataSource.data = response.data;
                    this.dataSource.data = filteredData;


                    this.paginator.firstPage();

                    // this.dataSource.data = response.data; // Asegúrate de que el servidor devuelve las categorías en el formato correcto
                    // console.log(this.dataSource.data);


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

    
    hoteles(): void {
        this._hotelsService.getHotels().subscribe(
          (response: any) => {
            if (response.result) {    
              
              this.hotelList = [
                { id: null, nombre: 'Seleccione un hotel' },
                ...response.data, 
              ];                    
              if (!this.createForm.get('hotels').value) {
                this.createForm.get('hotels').setValue(null);
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

    getRoomNames(reservationRooms: any[]): string {
        return reservationRooms.map(room => room.room_type_name).join(', ');
    }

    getReservePayments(ReservePayments: any[]): string {
        return ReservePayments.map(reservePayments => reservePayments.amount).join(', ');
    }

    getTotalAmount(reservePayments: any[]): number {
        if (!reservePayments || reservePayments.length === 0) {
            return 0; // Si no hay pagos o la lista está vacía, la suma es cero
        }
        const totalAmount = reservePayments.reduce((total, payment) => {
            const paymentAmount = parseFloat(payment.amount);
            return isNaN(paymentAmount) ? total : total + paymentAmount;
        }, 0);
        return totalAmount;
    }
    

    getStatusText(estatus_de_pago: number): string {
        switch (estatus_de_pago) {
            case 0:
                return 'Reservado';
            case 1:
                return 'Acreditado';
            case 2:
                return 'Pendiente';
            case 3:
                return 'Pagado';
            default:
                return 'Texto por defecto';
        }
      } 
    
      getStatusColor(estatus_de_pago: number): string {
        switch (estatus_de_pago) {
          case 0:
            return 'green';
          case 1:
            return 'blue';
          case 2:
            return 'orange';
          case 3:
            return 'red';
          default:
            return '';
        }
      }
    
         

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    editar(element: any) {
        this._shareService.setSharedData(element);

        this._router.navigate(['/edit/reservations']);
    }

    // ver(element: any) {
    //     this._shareService.setSharedData(element);

    //     this._router.navigate(['/discounts/watch']);
    // }

    // delete(id: number): void {
    //     Swal.fire({
    //         title: '¿Estas seguro?',
    //         text: 'Este proceso es irreversible.',
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonText: 'Sí',
    //         cancelButtonText: 'No',
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             this._discountsService.delete(id).subscribe(
    //                 ({
    //                     result,
    //                     message,
    //                 }: {
    //                     result: boolean;
    //                     message: string;
    //                 }) => {
    //                     if (result) {
    //                         this.load();
    //                         this.alertService.alertConfirmation(
    //                             'success',
    //                             message
    //                         );
    //                         this._router.navigateByUrl('/discounts');
    //                     } else {
    //                         this.alertService.alertConfirmation(
    //                             'success',
    //                             message
    //                         );
    //                     }
    //                 },
    //                 (error) => {
    //                     this.alertService.alertConfirmation('success', error);
    //                 }
    //             );
    //         }
    //     });
    // }

    alertConfirmation(icon: SweetAlertIcon, title: string): void {
        this.alertService.alertConfirmation(icon, title);
    }
}
