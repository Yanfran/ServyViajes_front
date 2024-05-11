import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from 'app/services/alert/alert.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReportRoomingListService } from 'app/services/report-rooming-list/report-rooming-list.service';

@Component({
  selector: 'report-rooming-list',
  standalone   : true,
  imports      : [
    CommonModule, 
    RouterLink, 
    MatIconModule, 
    MatTabsModule, 
    MatButtonToggleModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './rooming-list.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./rooming-list.component.scss']
})
export class RoomingListComponent {
  
  createForm: FormGroup;
  color: ThemePalette = 'accent';
  listaEventos: any[] = [];
  listaTiposPlanes: any[] = [];
  listaEstatusPagos: any[] = [];
  eventoSeleccionado: any = {};
  hotel: any = {};

  constructor(
    private _router: Router,
    private alertService: AlertService,
    private _formBuilder: UntypedFormBuilder,
    private _reportRoomingListService: ReportRoomingListService
    ) {
      this.createForm = this._formBuilder.group({
        evento_id: ['', Validators.required ],
        hotel_id: ['', Validators.required],
        tipo_plan_id: ['', Validators.required],
        estatus_pago_id: ['', Validators.required]
      });

      this.listaEstatusPagos = [
        { id: 1, status: 'Reservado', value: 0},
        { id: 2, status: 'Acreditado', value: 1},
        { id: 3, status: 'Pendiente', value: 2},
        { id: 4, status: 'Pagado', value: 3},
        { id: 5, status: 'Todos', value: 4}
      ]
    }  

  ngOnInit(): void {
    this.getListEvents();
    this.getListPlanTypes();
  }

  getListEvents() {
    this._reportRoomingListService.getListEvents().subscribe(
      (response) => {
        if(response.result){
          this.listaEventos = response.data;
        }
      },
      (error) => {
        console.error('Error al obtener la lista:', error);
      }
    );
  }

  getListPlanTypes() {
    this._reportRoomingListService.getListPlanTypes().subscribe(
      (response: any) => {
        if(response.result) {
          this.listaTiposPlanes = response.data;
        }
      },
      (error) => {
        console.log('Error al obtener la lista', error);
      }
    )
  }

  selectEvent(event: any) {
    const selectedEventId = event.value;
    this.eventoSeleccionado = this.listaEventos.find( (evento) => evento.id === selectedEventId );
    //reinciar la variable hotel y el campo
    this.hotel = {};
    this.createForm.patchValue({
      hotel_id: ''
    });
    //asignar nuevo valor
    this.hotel = this.eventoSeleccionado?.hotel;
    //validamos si existe el hotel
    if(this.hotel) {
      this.createForm.patchValue({
        hotel_id: this.hotel.nombre
      });
    }
  }

  generateReportExcel() {
    console.log(this.createForm.value);
    
    if (this.createForm.invalid) {
      return;
    }

    const datos = {
      evento_id: this.createForm.value.evento_id,
      hotel_id: this.hotel.id,
      tipo_plan_id: this.createForm.value.tipo_plan_id,
      estatus_pago_id: this.createForm.value.estatus_pago_id
    };

    this._reportRoomingListService.generateExcel(datos).subscribe(
      (response: any) => {
        if(response instanceof ArrayBuffer) {
          this.downloadExcel(response);
        }else {
          const message = 'Error al generar excel'
          this.alertService.alertConfirmation('error', message);
        }
      },
      (error) => {
        console.error('Error al generar el informe', error);
      }
    )

  }

  private downloadExcel(response: ArrayBuffer) {
    // Crear un objeto blob a partir de la respuesta del backend
    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Crear un objeto URL para el blob
    const url = URL.createObjectURL(blob);

    // Crear un enlace y simular clic para descargar el archivo
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporte-rooming-list.xlsx';
    document.body.appendChild(a);
    a.click();

    // Limpiar el objeto URL y el enlace después de la descarga
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }




}
