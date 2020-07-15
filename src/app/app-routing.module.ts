import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'index', loadChildren: () => import('./pages/index/index.module').then( m => m.IndexPageModule) },
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: '**', redirectTo: 'test'},
  { path: 'signup', loadChildren: './pages/auth/signup/signup.module#SignupPageModule' },
  { path: 'signin', loadChildren: './pages/auth/signin/signin.module#SigninPageModule' },
  { path: 'plans', loadChildren: './pages/auth/plans/plans.module#PlansPageModule' },
  { path: 'artist', loadChildren: './pages/artist/artist/artist.module#ArtistPageModule' },
  { path: 'tour', loadChildren: './pages/tour/tour/tour.module#TourPageModule' },
  { path: 'privacy', loadChildren: './pages/about/legal/privacy/privacy.module#PrivacyPageModule' },
  { path: 'terms', loadChildren: './pages/about/legal/terms/terms.module#TermsPageModule' },
  { path: 'splash', loadChildren: './pages/about/splash/splash.module#SplashPageModule' },
  { path: 'about/arena', loadChildren: './pages/about/arena/arena.module#ArenaPageModule' },
  { path: 'lyrics', loadChildren: './pages/search/lyrics/lyrics.module#LyricsPageModule' },
  { path: 'events', loadChildren: './pages/search/events/events.module#EventsPageModule' },
  { path: 'phrase', loadChildren: './pages/search/phrase/phrase.module#PhrasePageModule' },
  { path: 'promotions', loadChildren: './pages/store/promotions/promotions.module#PromotionsPageModule' },
  { path: 'faq', loadChildren: './pages/admin/faq/faq.module#FaqPageModule' },
  { path: 'chat', loadChildren: './pages/admin/chat/chat.module#ChatPageModule' },
  { path: 'events', loadChildren: './pages/admin/events/events.module#EventsPageModule' },
  { path: 'index', loadChildren: './pages/my/index/index.module#IndexPageModule' },
  { path: 'my/orders', loadChildren: './pages/my/orders/orders.module#OrdersPageModule' },
  { path: 'request', loadChildren: './pages/my/request/request.module#RequestPageModule' },
  { path: 'my/profile', loadChildren: './pages/my/profile/profile.module#ProfilePageModule' },
  { path: 'my/settings', loadChildren: './pages/my/settings/settings.module#SettingsPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
