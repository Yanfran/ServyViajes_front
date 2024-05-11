import {
    Component,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { NgClass } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DiscountsService } from 'app/services/discounts/discounts.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { AlertService } from 'app/services/alert/alert.service';
import { SharedService } from 'app/services/shared/shared.service';
import { ReservationsService } from 'app/services/reservations/reservations.service';
import { UserService } from 'app/core/user/user.service';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [
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
    ],
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./list.component.scss'],
})
export class ListComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    displayedColumns: string[] = [
        'id',
        'nombre',
        'hotel',
        'clave',
        'fecha_entrada',
        'fecha_salida',
        'total_dias_reservaciones',
        'cantidad_habitaciones',
        'monto_a_pagar',
        'total_pagado',
        'comprobante',
        'estatus',
        'acciones',
    ];
    dataSource = new MatTableDataSource<any>();
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    user: User;

    constructor(
        private _discountsService: DiscountsService,
        private _router: Router,
        private alertService: AlertService,
        private _shareService: SharedService,
        private _reservationsService: ReservationsService,
        private _userService: UserService
    ) { }

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        // Subscribe to the user service
        this._userService.user$
        .pipe((takeUntil(this._unsubscribeAll)))
        .subscribe((user: User) =>
        {
            this.user = user;
            // console.log(this.user)
        });

        this._reservationsService.miList(this.user.id).subscribe(
            (response: any) => {
                if (response.result) {
                    this.dataSource.data = response.data; // Asegúrate de que el servidor devuelve las categorías en el formato correcto
                    console.log(this.dataSource.data);
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

        this._router.navigate(['/edit/mis-reservaciones']);
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
}
