import {
    AfterViewInit,
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
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { AlertService } from 'app/services/alert/alert.service';
import { SharedService } from 'app/services/shared/shared.service';
import { LandingEventosService } from 'app/services/landing-eventos/landing-eventos.service';


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
    ],
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./list.component.scss'],
})
export class ListComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    displayedColumns: string[] = [
        'nombre',
        'url_evento',
        'estatus',
        'acciones',
    ];
    dataSource = new MatTableDataSource<any>();
    URLServer: string = '';

    constructor(
        private _landingEventosService: LandingEventosService,
        private _router: Router,
        private alertService: AlertService,
        private _shareService: SharedService
    ) {}

    ngOnInit(): void {
        this.loadHotels();
        this.getURLServer();
    }

    loadHotels(): void {
        this._landingEventosService.index().subscribe(
            (response: any) => {
                if (response.result) {
                    this.dataSource.data = response.data; // Asegúrate de que el servidor devuelve las categorías en el formato correcto
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

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    editar(element: any) {
        this._shareService.setSharedData(element);

        this._router.navigate(['/edit/landing/eventos']);
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
                this._landingEventosService.delete(id).subscribe(
                    ({
                        result,
                        message,
                    }: {
                        result: boolean;
                        message: string;
                    }) => {
                        if (result) {
                            this.loadHotels();
                            this.alertService.alertConfirmation(
                                'success',
                                message
                            );
                            this._router.navigateByUrl('/landing/eventos');
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

    getURLServer() {
        const url = window.location.origin;
        this.URLServer = url;
        //console.log(url);
    }
}
