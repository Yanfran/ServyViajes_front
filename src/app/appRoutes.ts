import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { RoleGuard } from './core/auth/guards/role.guard';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

export const appRoutes: Route[] = [
    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'home' },

    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'menu' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes') },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes') },
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes') },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes') },
            //comentado por que los registros se reaizaran atraves del landing de eventos
            // { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes') },
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes') },
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes') }
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes') },
            { path: 'evento/:slug', loadChildren: () => import('app/modules/landing/evento/evento.routes') },
            { path: 'registro/evento/:slug', loadChildren: () => import('app/modules/forms-web/register-assistant/register-assistant.routes') },
            { path: 'reservacion-hotel/evento/:slug', loadChildren: () => import('app/modules/forms-web/reservation-hotel/reservation-hotel.routes') },
        ]
    },

    // Terminos y condiciones
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'terms-and-conditions', loadChildren: () => import('app/modules/terminos-condiciones/terminos-condiciones.routes') },
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [

            { path: 'menu', loadChildren: () => import('app/modules/admin/menu/menu/menu.routes'), canActivate: [RoleGuard], data: { expectedRole: [1, 2] } },
            // { path: 'example', loadChildren: () => import('app/modules/admin/example/example.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 }  },                                   

            // Profile
            { path: 'profile', loadChildren: () => import('app/modules/admin/profile/profile.routes'), canActivate: [RoleGuard], data: { expectedRole: [1, 2] } },

            // Assistants
            { path: 'assistants', loadChildren: () => import('app/modules/admin/assistants/list/assistants.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
            { path: 'create/assistants', loadChildren: () => import('app/modules/admin/assistants/create/formOne/create.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
            { path: 'create/assistants/two', loadChildren: () => import('app/modules/admin/assistants/create/formTwo/form-two.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
            { path: 'edit/assistants', loadChildren: () => import('app/modules/admin/assistants/edit/edit.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
            { path: 'watch/assistants', loadChildren: () => import('app/modules/admin/assistants/watch/watch.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },

            //asistentes -vista asistentes
            { path: 'mis-eventos', loadChildren: () => import('app/modules/assistant/assistants/list/assistants.routes'), canActivate: [RoleGuard], data: { expectedRole: 2 } },
            { path: 'edit/mis-eventos', loadChildren: () => import('app/modules/assistant/assistants/edit/edit.routes'), canActivate: [RoleGuard], data: { expectedRole: 2 } },

            // Events
            { path: 'events', loadChildren: () => import('app/modules/admin/events/list/events.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
            { path: 'create/events', loadChildren: () => import('app/modules/admin/events/create/create.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
            { path: 'edit/events', loadChildren: () => import('app/modules/admin/events/edit/edit.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
            { path: 'watch/event', loadChildren: () => import('app/modules/admin/events/watch/watch.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },

            // Categories
            { path: 'categories', loadChildren: () => import('app/modules/admin/categories/list/list.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
            { path: 'create/categories', loadChildren: () => import('app/modules/admin/categories/create/create.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
            { path: 'edit/category/:id', loadChildren: () => import('app/modules/admin/categories/edit/edit.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },


            // Hotels
            { path: 'hotels', loadChildren: () => import('app/modules/admin/hotels/list/list.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
            { path: 'create/hotels', loadChildren: () => import('app/modules/admin/hotels/create/create.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
            { path: 'edit/hotels', loadChildren: () => import('app/modules/admin/hotels/edit/edit.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
            { path: 'watch/hotel', loadChildren: () => import('app/modules/admin/hotels/watch/watch.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },


            // Reservations
            { path: 'reservations', loadChildren: () => import('app/modules/admin/reservations/list/list.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
            { path: 'create/reservations', loadChildren: () => import('app/modules/admin/reservations/create/create/wizards.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
            // { path: 'create/reservations', loadChildren: () => import('app/modules/admin/reservations/create/formOne/create.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },            
            { path: 'create/reservations/two', loadChildren: () => import('app/modules/admin/reservations/create/formTwo/create.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
            { path: 'edit/reservations', loadChildren: () => import('app/modules/admin/reservations/edit/edit.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
            // { path: 'watch/hotel', loadChildren: () => import('app/modules/admin/hotels/watch/watch.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },                      

            //reservaciones - vista asistente
            { path: 'mis-reservaciones', loadChildren: () => import('app/modules/assistant/reservations/list/list.routes'), canActivate: [RoleGuard], data: { expectedRole: 2 } },
            { path: 'edit/mis-reservaciones', loadChildren: () => import('app/modules/assistant/reservations/edit/edit.routes'), canActivate: [RoleGuard], data: { expectedRole: 2 } },

            // discount
            { path: 'discounts', loadChildren: () => import('app/modules/admin/discounts/list/list.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
            { path: 'create/discounts', loadChildren: () => import('app/modules/admin/discounts/create/create.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
            { path: 'edit/discounts', loadChildren: () => import('app/modules/admin/discounts/edit/edit.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
            { path: 'discounts/watch', loadChildren: () => import('app/modules/admin/discounts/watch/watch.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },


            // rooms by hotels
            { path: 'rooms_by_hotels', loadChildren: () => import('app/modules/admin/rooms-by-hotels/list/list.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
            { path: 'create/rooms_by_hotels', loadChildren: () => import('app/modules/admin/rooms-by-hotels/create/create.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
            { path: 'edit/rooms_by_hotels', loadChildren: () => import('app/modules/admin/rooms-by-hotels/edit/edit.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
            { path: 'watch/rooms_by_hotel', loadChildren: () => import('app/modules/admin/rooms-by-hotels/watch/watch.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },

            // report rooming list
            { path: 'report-rooming-list', loadChildren: () => import('app/modules/admin/reports/rooming-list/rooming-list.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },

            // landing-home
            { path: 'create/landing', loadChildren: () => import('app/modules/admin/landing-home/create/create.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },

            // landing-eventos
            { path: 'landing/eventos', loadChildren: () => import('app/modules/admin/landing-eventos/list/list.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
            { path: 'create/landing/eventos', loadChildren: () => import('app/modules/admin/landing-eventos/create/create.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
            { path: 'edit/landing/eventos', loadChildren: () => import('app/modules/admin/landing-eventos/edit/edit.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },


            {
                path: 'dashboards', children: [
                    { path: 'project', loadChildren: () => import('app/modules/admin/dashboards/project/project.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
                    { path: 'analytics', loadChildren: () => import('app/modules/admin/dashboards/analytics/analytics.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
                    { path: 'finance', loadChildren: () => import('app/modules/admin/dashboards/finance/finance.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
                    { path: 'crypto', loadChildren: () => import('app/modules/admin/dashboards/crypto/crypto.routes'), canActivate: [RoleGuard], data: { expectedRole: 1 } },
                ]
            },

            // User Interface
            {
                path: 'ui', children: [

                    // Material Components
                    { path: 'material-components', loadChildren: () => import('app/modules/admin/ui/material-components/material-components.routes') },

                    // Fuse Components
                    { path: 'fuse-components', loadChildren: () => import('app/modules/admin/ui/fuse-components/fuse-components.routes') },

                    // Other Components
                    { path: 'other-components', loadChildren: () => import('app/modules/admin/ui/other-components/other-components.routes') },

                    // TailwindCSS
                    { path: 'tailwindcss', loadChildren: () => import('app/modules/admin/ui/tailwindcss/tailwindcss.routes') },

                    // Advanced Search
                    { path: 'advanced-search', loadChildren: () => import('app/modules/admin/ui/advanced-search/advanced-search.routes') },

                    // Animations
                    { path: 'animations', loadChildren: () => import('app/modules/admin/ui/animations/animations.routes') },

                    // Cards
                    { path: 'cards', loadChildren: () => import('app/modules/admin/ui/cards/cards.routes') },

                    // Colors
                    { path: 'colors', loadChildren: () => import('app/modules/admin/ui/colors/colors.routes') },

                    // Confirmation Dialog
                    { path: 'confirmation-dialog', loadChildren: () => import('app/modules/admin/ui/confirmation-dialog/confirmation-dialog.routes') },

                    // Datatable
                    { path: 'datatable', loadChildren: () => import('app/modules/admin/ui/datatable/datatable.routes') },

                    // Forms
                    { path: 'forms', loadChildren: () => import('app/modules/admin/ui/forms/forms.routes') },

                    // Icons
                    { path: 'icons', loadChildren: () => import('app/modules/admin/ui/icons/icons.routes') },

                    // Page Layouts
                    { path: 'page-layouts', loadChildren: () => import('app/modules/admin/ui/page-layouts/page-layouts.routes') },

                    // Typography
                    { path: 'typography', loadChildren: () => import('app/modules/admin/ui/typography/typography.routes') }
                ]
            },
        ]
    }
];
