import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadComponent: () =>
          import('../social-media/social-media.component').then(m => m.SocialMediaComponent),
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../image-gallery/image-gallery.component').then(m => m.ImageGalleryComponent),
      },
      {
        path: 'tab3',
        loadComponent: () => import('../weather/weather.component').then(m => m.WeatherComponent),
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full',
  },
];
