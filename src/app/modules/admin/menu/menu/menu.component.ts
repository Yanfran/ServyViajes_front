import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CategoriesService } from 'app/services/categories/categories.service';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from 'app/services/alert/alert.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { AuthService } from 'app/core/auth/auth.service';
import { MenuService } from 'app/services/menu/menu.service';

@Component({
  selector: 'app-menu',
  standalone   : true,
  imports      : [CommonModule, RouterLink, MatIconModule, MatTabsModule, MatButtonToggleModule],
  templateUrl: './menu.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  assistants: any[] = [];
  events: any[] = [];
  categories: any[] = [];
  hotels: any[] = [];
  discounts: any[] = [];
  reservations: any[] = [];
  rooms_by_hotels: any[] = [];

  userRole: any = '';
  resumen: any[] = [];

  constructor(
    private _categoriesService: CategoriesService,
    private _router: Router,
    private alertService: AlertService,
    private _authService: AuthService,
    private _menuService: MenuService
    ) {}  

  ngOnInit(): void {
    this.redirectAssistantToMisEventos();
    this.loadCategories();
    this.filterCards();
    this.getResume();
  }

  getResume()
  {
    this._menuService.resumen().subscribe(
      (response) => {
        if(response.result) {
          this.resumen = response.data;
          console.log(this.resumen)
        }else {
          console.error(
            'Error al obtener la lista:',
            response.message
          );
        }

      },
      (error) => {
        console.error('Error al obtener datos', error);
      }
    )
  }

  redirectAssistantToMisEventos() {
    this.userRole = this._authService.getUserRole();

    if(this.userRole === 2) {
      this._router.navigate(['/mis-eventos']);
    }

  }


  loadCategories(): void {
    this._categoriesService.list().subscribe(
      ({ result, message } : { result: boolean; message: string }) => {
        if (result) {

        } else {
          console.error('Error al obtener la lista:', message);
        }
      },
      (error) => {
        console.error('Error al obtener la lista:', error);
      }
    );    

  }



  filterCards(): void {
    const filteredCards = this.filterCardsByRole(this.cards);
    console.log(filteredCards)
    this.assistants = filteredCards.filter(card => card.routerLink === '/assistants');
    this.events = filteredCards.filter(card => card.routerLink === '/events');
    this.categories = filteredCards.filter(card => card.routerLink === '/categories');
    this.hotels = filteredCards.filter(card => card.routerLink === '/hotels');
    this.discounts = filteredCards.filter(card => card.routerLink === '/discounts');
    this.reservations = filteredCards.filter(card => card.routerLink === '/reservations');
    this.rooms_by_hotels = filteredCards.filter(card => card.routerLink === '/rooms_by_hotels');    
    // ... (filtrar otras listas de tarjetas)
  }

  cards: any[] = [
    { permisos: [1], routerLink: '/assistants' },
    { permisos: [1], routerLink: '/events' },
    { permisos: [1], routerLink: '/categories' },
    { permisos: [1], routerLink: '/hotels' },
    { permisos: [1], routerLink: '/discounts' },  
    { permisos: [1], routerLink: '/reservations' }, 
    { permisos: [1], routerLink: '/rooms_by_hotels' },        
  ];

  filterCardsByRole(cards: any[]): any[] {
      const storage = localStorage.getItem('accessToken');
      const decodedToken = jwtDecode(storage) as any;
      const userRole = decodedToken.user.id_rol;

      
    const filteredCards = cards.filter(card => {
        // console.log('User Role:', userRole);
        // console.log('Card Permisos:', card.permisos);
        return Array.isArray(card.permisos) && card.permisos.includes(userRole);
    });

    // console.log('Tarjetas filtradas:', filteredCards); // Agrega esta línea para imprimir en la consola

    return filteredCards;

  }


}
