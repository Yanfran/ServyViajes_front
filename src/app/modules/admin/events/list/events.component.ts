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
import { CommonModule, NgClass } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AlertService } from 'app/services/alert/alert.service';
import { SharedService } from 'app/services/shared/shared.service';
import { EventsService } from 'app/services/events/events.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
    selector: 'app-events',
    standalone: true,
    imports: [
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
        MatButtonModule,
        RouterLink,
        NgClass,
        MatInputModule,
        MatSelectModule,
        CommonModule
    ],
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class EventsComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = [
        'nombre',
        'sede',
        'fecha_inicio',
        'fecha_termino',
        'estatus',
        'acciones',
    ];
    dataSource = new MatTableDataSource<any>();

    constructor(
      private _eventsService: EventsService,
      private _router: Router,
      private alertService: AlertService,
      private _shareService: SharedService
  ) {}


    ngOnInit(): void {
        this.load();
    }

    load(): void {
      this._eventsService.list().subscribe(
          (response: any) => {
              if (response.result) {
                  this.dataSource.data = response.data; 
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


    alertConfirmation(icon: SweetAlertIcon, title: string): void {
      this.alertService.alertConfirmation(icon, title);
    }



    editar(element: any) {
        this._shareService.setSharedData(element);        
        this._router.navigate(['/edit/events']);
    }

    ver(element: any) {
        this._shareService.setSharedData(element);

        this._router.navigate(['/watch/event']);
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
                this._eventsService.delete(id).subscribe(
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
                            this._router.navigateByUrl('/events');
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

}
