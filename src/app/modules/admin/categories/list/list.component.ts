import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { NgClass } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CategoriesService  } from 'app/services/categories/categories.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { AlertService } from 'app/services/alert/alert.service';


@Component({
  selector: 'app-list',
  standalone   : true,
  imports: [MatBadgeModule, MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule, RouterLink, NgClass, MatInputModule, MatSelectModule, MatChipsModule],
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  
  @ViewChild(MatPaginator) paginator: MatPaginator;    
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['catagoria', 'estatus', 'acciones'];  



  constructor(
    private _categoriesService: CategoriesService,
    private _router: Router,
    private alertService: AlertService
    ) {}  


  ngOnInit(): void {
    this.loadCategories();
  }


  loadCategories(): void {
    this._categoriesService.list().subscribe(
      (response: any) => {
        if (response.result) {
          this.dataSource.data = response.data; // Asegúrate de que el servidor devuelve las categorías en el formato correcto
          // console.log(this.dataSource.data);
        } else {
          console.error('Error al obtener la lista:', response.message);
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


  editarCategoria(id: number) {
    // Puedes navegar a la página de edición y pasar el ID como parámetro en la URL
    this._router.navigate(['/edit/category', id]);
  }  
     

  deleteCategoria(id: number): void {   
      Swal.fire({
        title: '¿Estas seguro?',
        text: 'Este proceso es irreversible.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
      }).then((result) => {

          if (result.isConfirmed) {

              var datos = {              
                  id: id
              };
              
              this._categoriesService.delete(datos).subscribe(
                  // (response: any) => {
                    ({ result, message }: { result: boolean; message: string }) => {
                      if (result) {
                          // console.log(response.result)
        
                          this.loadCategories();         
                          
                          this.alertService.alertConfirmation('success', message);
        
                          // Navigate to the redirect url
                          this._router.navigateByUrl('/categories');
                      } else {
                          // console.log(response)                          
                          this.alertService.alertConfirmation('success', message);
                      }
                  },
                  (error) => {
                    this.alertService.alertConfirmation('success', error);
                  }
              );    

            // Swal.fire({
            //   title: "¡Eliminado!",
            //   text: "Su categoria ha sido eliminado.",
            //   icon: "success"
            // });
          }                        

      });                        
  }


  alertConfirmation(icon: SweetAlertIcon, title: string): void {
    this.alertService.alertConfirmation(icon, title);
  }



}
