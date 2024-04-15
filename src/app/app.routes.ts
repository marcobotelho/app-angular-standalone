import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
        canActivate: [AuthGuard], data: { expectedRoles: ['ROLE_ADMIN', 'ROLE_USER'] }
    },
    {
        path: 'auth',
        loadComponent: () => import('./auth/auth.component').then(m => m.AuthComponent)
    },
    {
        path: 'clientes',
        children: [
            {
                path: "",
                loadComponent: () =>
                    import("./clientes/clientes-list/clientes-list.component").then(m => m.ClientesListComponent),
                canActivate: [AuthGuard], data: { expectedRoles: ['ROLE_ADMIN', 'ROLE_USER'] }
            },
            {
                path: ":clienteId",
                children: [
                    {
                        path: "",
                        loadComponent: () =>
                            import("./clientes/clientes-detail/clientes-detail.component").then(m => m.ClientesDetailComponent),
                        canActivate: [AuthGuard], data: { expectedRoles: ['ROLE_ADMIN', 'ROLE_USER'] }
                    },
                    {
                        path: "telefones",
                        children: [
                            {
                                path: "",
                                loadComponent: () =>
                                    import("./clientes/cliente-telefones-list/cliente-telefones-list.component").then(m => m.ClienteTelefonesListComponent),
                                canActivate: [AuthGuard], data: { expectedRoles: ['ROLE_ADMIN', 'ROLE_USER'] }
                            },
                            {
                                path: ":telefoneId",
                                loadComponent: () =>
                                    import("./clientes/cliente-telefones-detail/cliente-telefones-detail.component").then(m => m.ClienteTelefonesDetailComponent),
                                canActivate: [AuthGuard], data: { expectedRoles: ['ROLE_ADMIN', 'ROLE_USER'] }
                            }
                        ]
                    }
                ]
            },
        ]
    },
    {
        path: 'usuarios',
        children: [
            {
                path: "",
                loadComponent: () =>
                    import("./usuarios/usuarios-list/usuarios-list.component").then(m => m.UsuariosListComponent),
                canActivate: [AuthGuard], data: { expectedRoles: ['ROLE_ADMIN'] }
            },
            {
                path: ":usuarioId",
                children: [
                    {
                        path: "",
                        loadComponent: () =>
                            import("./usuarios/usuarios-detail/usuarios-detail.component").then(m => m.UsuariosDetailComponent),
                        canActivate: [AuthGuard], data: { expectedRoles: ['ROLE_ADMIN'] }
                    },
                    {
                        path: "perfis",
                        children: [
                            {
                                path: "",
                                loadComponent: () =>
                                    import("./usuarios/usuario-perfis-list/usuario-perfis-list.component").then(m => m.UsuarioPerfisListComponent),
                                canActivate: [AuthGuard], data: { expectedRoles: ['ROLE_ADMIN'] }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        path: 'perfis',
        children: [
            {
                path: "",
                loadComponent: () =>
                    import("./perfis/perfis-list/perfis-list.component").then(m => m.PerfisListComponent),
                canActivate: [AuthGuard], data: { expectedRoles: ['ROLE_ADMIN'] }
            },
            {
                path: ":perfilId",
                children: [
                    {
                        path: "",
                        loadComponent: () =>
                            import("./perfis/perfis-detail/perfis-detail.component").then(m => m.PerfisDetailComponent),
                        canActivate: [AuthGuard], data: { expectedRoles: ['ROLE_ADMIN'] }
                    },
                    {
                        path: "usuarios",
                        children: [
                            {
                                path: "",
                                loadComponent: () =>
                                    import("./perfis/perfil-usuarios-list/perfil-usuarios-list.component").then(m => m.PerfilUsuariosListComponent),
                                canActivate: [AuthGuard], data: { expectedRoles: ['ROLE_ADMIN'] }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        path: "senhas",
        children: [
            {
                path: "reset",
                loadComponent: () => import("./senhas/senhas-reset/senhas-reset.component").then(m => m.SenhasResetComponent)
            },
            {
                path: "alterar/:token",
                loadComponent: () => import("./senhas/senhas-alterar/senhas-alterar.component").then(m => m.SenhasAlterarComponent)
            }
        ]
    },
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'auth',
        pathMatch: 'full'
    }
];
