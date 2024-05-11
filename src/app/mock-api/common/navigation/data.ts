/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';


export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'menu',
        permisos : [1],
        title: 'Menú',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/menu',        
    },
    {
        id   : 'mis_eventos',
        permisos : [2],
        title: 'Mis eventos',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/mis-eventos',        
    },
    {
        id   : 'mis_reservaciones',
        permisos : [2],
        title: 'Mis reservaciones',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/mis-reservaciones',        
    },    
    {
        id   : 'assistants',
        permisos : [1],
        title: 'Asistentes',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/assistants',
    },
    {
        id   : 'events',
        permisos : [1],
        title: 'Eventos',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/events',
    },    
    {
        id   : 'categories',
        permisos : [1],
        title: 'Categorias',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/categories',
    },  
    {
        id   : 'hotels',
        permisos : [1],
        title: 'Hoteles',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/hotels',
    },  
    {
        id   : 'reservations',
        permisos : [1],
        title: 'Reservaciones',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/reservations',
    },  
    {
        id   : 'discounts',
        permisos : [1],
        title: 'Descuentos',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/discounts',
    },
    {
        id   : 'rooms_by_hotels',
        permisos : [1],
        title: 'Habitaciones por hoteles',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/rooms_by_hotels',
    },
    {
        id   : 'report_rooming_list',
        permisos : [1],
        title: 'Reporte rooming list',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/report-rooming-list',
    },
    {
        id      : 'configurations',
        permisos: [1],
        title   : 'Configuraciones',
        type    : 'collapsable',
        icon    : 'heroicons_outline:cog-8-tooth',
        children: [
            {
                id   : 'configurations.landing.home',
                title: 'Landing Home',
                type : 'basic',
                link : 'create/landing',
            },
            {
                id   : 'configurations.landings.events',
                title: 'Landing Eventos',
                type : 'basic',
                link : 'landing/eventos',
            }
        ],
    },    

    
    
    // {
    //     id   : 'example',
    //     title: 'Example',
    //     type : 'basic',
    //     icon : 'heroicons_outline:chart-pie',
    //     link : '/example',
    // },
    // {        
    //     id      : 'dashboards',
    //     title   : 'Dashboards',
    //     subtitle: 'Unique dashboard designs',
    //     type    : 'group',
    //     icon    : 'heroicons_outline:home',
    //     children: [
    //         {
    //             id   : 'dashboards.project',
    //             title: 'Project',
    //             type : 'basic',
    //             icon : 'heroicons_outline:clipboard-document-check',
    //             link : '/dashboards/project',
    //         },
    //         {
    //             id   : 'dashboards.analytics',
    //             title: 'Analytics',
    //             type : 'basic',
    //             icon : 'heroicons_outline:chart-pie',
    //             link : '/dashboards/analytics',
    //         },
    //         {
    //             id   : 'dashboards.finance',
    //             title: 'Finance',
    //             type : 'basic',
    //             icon : 'heroicons_outline:banknotes',
    //             link : '/dashboards/finance',
    //         },
    //         {
    //             id   : 'dashboards.crypto',
    //             title: 'Crypto',
    //             type : 'basic',
    //             icon : 'heroicons_outline:currency-dollar',
    //             link : '/dashboards/crypto',
    //         },
    //     ],
    // },
    // {
    //     id      : 'user-interface',
    //     title   : 'User Interface',
    //     subtitle: 'Building blocks of the UI & UX',
    //     type    : 'group',
    //     icon    : 'heroicons_outline:rectangle-stack',
    //     children: [
    //         {
    //             id   : 'user-interface.material-components',
    //             title: 'Material Components',
    //             type : 'basic',
    //             icon : 'heroicons_outline:square-3-stack-3d',
    //             link : '/ui/material-components',
    //         },
    //         {
    //             id   : 'user-interface.fuse-components',
    //             title: 'Fuse Components',
    //             type : 'basic',
    //             icon : 'heroicons_outline:square-3-stack-3d',
    //             link : '/ui/fuse-components',
    //         },
    //         {
    //             id   : 'user-interface.other-components',
    //             title: 'Other Components',
    //             type : 'basic',
    //             icon : 'heroicons_outline:square-3-stack-3d',
    //             link : '/ui/other-components',
    //         },
    //         {
    //             id   : 'user-interface.tailwindcss',
    //             title: 'TailwindCSS',
    //             type : 'basic',
    //             icon : 'heroicons_outline:sparkles',
    //             link : '/ui/tailwindcss',
    //         },
    //         {
    //             id   : 'user-interface.advanced-search',
    //             title: 'Advanced Search',
    //             type : 'basic',
    //             icon : 'heroicons_outline:magnifying-glass-circle',
    //             link : '/ui/advanced-search',
    //         },
    //         {
    //             id   : 'user-interface.animations',
    //             title: 'Animations',
    //             type : 'basic',
    //             icon : 'heroicons_outline:play',
    //             link : '/ui/animations',
    //         },
    //         {
    //             id   : 'user-interface.cards',
    //             title: 'Cards',
    //             type : 'basic',
    //             icon : 'heroicons_outline:square-2-stack',
    //             link : '/ui/cards',
    //         },
    //         {
    //             id   : 'user-interface.colors',
    //             title: 'Colors',
    //             type : 'basic',
    //             icon : 'heroicons_outline:swatch',
    //             link : '/ui/colors',
    //         },
    //         {
    //             id   : 'user-interface.confirmation-dialog',
    //             title: 'Confirmation Dialog',
    //             type : 'basic',
    //             icon : 'heroicons_outline:question-mark-circle',
    //             link : '/ui/confirmation-dialog',
    //         },
    //         {
    //             id   : 'user-interface.datatable',
    //             title: 'Datatable',
    //             type : 'basic',
    //             icon : 'heroicons_outline:table-cells',
    //             link : '/ui/datatable',
    //         },
    //         {
    //             id      : 'user-interface.forms',
    //             title   : 'Forms',
    //             type    : 'collapsable',
    //             icon    : 'heroicons_outline:pencil-square',
    //             children: [
    //                 {
    //                     id   : 'user-interface.forms.fields',
    //                     title: 'Fields',
    //                     type : 'basic',
    //                     link : '/ui/forms/fields',
    //                 },
    //                 {
    //                     id   : 'user-interface.forms.layouts',
    //                     title: 'Layouts',
    //                     type : 'basic',
    //                     link : '/ui/forms/layouts',
    //                 },
    //                 {
    //                     id   : 'user-interface.forms.wizards',
    //                     title: 'Wizards',
    //                     type : 'basic',
    //                     link : '/ui/forms/wizards',
    //                 },
    //             ],
    //         },
    //         {
    //             id      : 'user-interface.icons',
    //             title   : 'Icons',
    //             type    : 'collapsable',
    //             icon    : 'heroicons_outline:bolt',
    //             children: [
    //                 {
    //                     id   : 'user-interface.icons.heroicons-outline',
    //                     title: 'Heroicons Outline',
    //                     type : 'basic',
    //                     link : '/ui/icons/heroicons-outline',
    //                 },
    //                 {
    //                     id   : 'user-interface.icons.heroicons-solid',
    //                     title: 'Heroicons Solid',
    //                     type : 'basic',
    //                     link : '/ui/icons/heroicons-solid',
    //                 },
    //                 {
    //                     id   : 'user-interface.icons.heroicons-mini',
    //                     title: 'Heroicons Mini',
    //                     type : 'basic',
    //                     link : '/ui/icons/heroicons-mini',
    //                 },
    //                 {
    //                     id   : 'user-interface.icons.material-twotone',
    //                     title: 'Material Twotone',
    //                     type : 'basic',
    //                     link : '/ui/icons/material-twotone',
    //                 },
    //                 {
    //                     id   : 'user-interface.icons.material-outline',
    //                     title: 'Material Outline',
    //                     type : 'basic',
    //                     link : '/ui/icons/material-outline',
    //                 },
    //                 {
    //                     id   : 'user-interface.icons.material-solid',
    //                     title: 'Material Solid',
    //                     type : 'basic',
    //                     link : '/ui/icons/material-solid',
    //                 },
    //                 {
    //                     id   : 'user-interface.icons.feather',
    //                     title: 'Feather',
    //                     type : 'basic',
    //                     link : '/ui/icons/feather',
    //                 },
    //             ],
    //         },
    //         {
    //             id      : 'user-interface.page-layouts',
    //             title   : 'Page Layouts',
    //             type    : 'collapsable',
    //             icon    : 'heroicons_outline:rectangle-group',
    //             children: [
    //                 {
    //                     id   : 'user-interface.page-layouts.overview',
    //                     title: 'Overview',
    //                     type : 'basic',
    //                     link : '/ui/page-layouts/overview',
    //                 },
    //                 {
    //                     id   : 'user-interface.page-layouts.empty',
    //                     title: 'Empty',
    //                     type : 'basic',
    //                     link : '/ui/page-layouts/empty',
    //                 },
    //                 {
    //                     id: 'user-interface.page-layouts.carded',

    //                     title   : 'Carded',
    //                     type    : 'collapsable',
    //                     children: [
    //                         {
    //                             id   : 'user-interface.page-layouts.carded.fullwidth',
    //                             title: 'Fullwidth',
    //                             type : 'basic',
    //                             link : '/ui/page-layouts/carded/fullwidth',
    //                         },
    //                         {
    //                             id   : 'user-interface.page-layouts.carded.left-sidebar-1',
    //                             title: 'Left Sidebar #1',
    //                             type : 'basic',
    //                             link : '/ui/page-layouts/carded/left-sidebar-1',
    //                         },
    //                         {
    //                             id   : 'user-interface.page-layouts.carded.left-sidebar-2',
    //                             title: 'Left Sidebar #2',
    //                             type : 'basic',
    //                             link : '/ui/page-layouts/carded/left-sidebar-2',
    //                         },
    //                         {
    //                             id   : 'user-interface.page-layouts.carded.right-sidebar-1',
    //                             title: 'Right Sidebar #1',
    //                             type : 'basic',
    //                             link : '/ui/page-layouts/carded/right-sidebar-1',
    //                         },
    //                         {
    //                             id   : 'user-interface.page-layouts.carded.right-sidebar-2',
    //                             title: 'Right Sidebar #2',
    //                             type : 'basic',
    //                             link : '/ui/page-layouts/carded/right-sidebar-2',
    //                         },
    //                     ],
    //                 },
    //                 {
    //                     id      : 'user-interface.page-layouts.simple',
    //                     title   : 'Simple',
    //                     type    : 'collapsable',
    //                     children: [
    //                         {
    //                             id   : 'user-interface.page-layouts.simple.fullwidth-1',
    //                             title: 'Fullwidth #1',
    //                             type : 'basic',
    //                             link : '/ui/page-layouts/simple/fullwidth-1',
    //                         },
    //                         {
    //                             id   : 'user-interface.page-layouts.simple.fullwidth-2',
    //                             title: 'Fullwidth #2',
    //                             type : 'basic',
    //                             link : '/ui/page-layouts/simple/fullwidth-2',
    //                         },
    //                         {
    //                             id   : 'user-interface.page-layouts.simple.left-sidebar-1',
    //                             title: 'Left Sidebar #1',
    //                             type : 'basic',
    //                             link : '/ui/page-layouts/simple/left-sidebar-1',
    //                         },
    //                         {
    //                             id   : 'user-interface.page-layouts.simple.left-sidebar-2',
    //                             title: 'Left Sidebar #2',
    //                             type : 'basic',
    //                             link : '/ui/page-layouts/simple/left-sidebar-2',
    //                         },
    //                         {
    //                             id   : 'user-interface.page-layouts.simple.left-sidebar-3',
    //                             title: 'Left Sidebar #3',
    //                             type : 'basic',
    //                             link : '/ui/page-layouts/simple/left-sidebar-3',
    //                         },
    //                         {
    //                             id   : 'user-interface.page-layouts.simple.right-sidebar-1',
    //                             title: 'Right Sidebar #1',
    //                             type : 'basic',
    //                             link : '/ui/page-layouts/simple/right-sidebar-1',
    //                         },
    //                         {
    //                             id   : 'user-interface.page-layouts.simple.right-sidebar-2',
    //                             title: 'Right Sidebar #2',
    //                             type : 'basic',
    //                             link : '/ui/page-layouts/simple/right-sidebar-2',
    //                         },
    //                         {
    //                             id   : 'user-interface.page-layouts.simple.right-sidebar-3',
    //                             title: 'Right Sidebar #3',
    //                             type : 'basic',
    //                             link : '/ui/page-layouts/simple/right-sidebar-3',
    //                         },
    //                     ],
    //                 },
    //             ],
    //         },
    //         {
    //             id   : 'user-interface.typography',
    //             title: 'Typography',
    //             type : 'basic',
    //             icon : 'heroicons_outline:pencil',
    //             link : '/ui/typography',
    //         },
    //     ],
    // },
    
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'assistants',
        title: 'Asistentes',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/assistants'
    },
    {
        id   : 'events',
        title: 'Eventos',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/events'
    },    
    {
        id   : 'categories',
        title: 'Categorías',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/categories'
    },
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    },
    {
        id      : 'dashboards',
        title   : 'Dashboards',
        tooltip : 'Dashboards',
        type    : 'aside',
        icon    : 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'user-interface',
        title   : 'UI',
        tooltip : 'UI',
        type    : 'aside',
        icon    : 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'assistants',
        title: 'Asistentes',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/assistants'
    },
    {
        id   : 'events',
        title: 'Eventos',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/events'
    },
    {
        id   : 'categories',
        title: 'Categorias',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/categories'
    },
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    },
    {
        id      : 'dashboards',
        title   : 'DASHBOARDS',
        type    : 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'user-interface',
        title   : 'User Interface',
        type    : 'aside',
        icon    : 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'assistants',
        title: 'Asistentes',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/assistants'
    },
    {
        id   : 'events',
        title: 'Eventos',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/events'
    },    
    {
        id   : 'categories',
        title: 'Categorias',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/categories'
    },
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    },
    {
        id      : 'dashboards',
        title   : 'Dashboards',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'user-interface',
        title   : 'UI',
        type    : 'group',
        icon    : 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
