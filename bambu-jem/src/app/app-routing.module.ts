import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '././login/login.component';
import { RegisterComponent } from '././components/register/register.component';
import { BambupageComponent } from '././components/bambupage/bambupage.component';
import { JempageComponent } from '././components/jempage/jempage.component';
import { LoginAdminComponent } from '././login-admin/login-admin.component';
import { Error404Component } from '././components/error404/error404.component';
import { AboutUsComponent } from '././components/about-us/about-us.component';
import { LadiesComponent } from '././genders/ladies/ladies.component';
import { GentlemanComponent } from '././genders/gentleman/gentleman.component';
import { BoysComponent } from '././genders/boys/boys.component';
import { GirlsComponent } from '././genders/girls/girls.component';
import { ArticleComponent } from '././components/article/article.component';
import { ArticleDetailComponent  } from '././components/article-detail/article-detail.component';
import { MangArticleComponent } from './adminlayout/mang-article/mang-article.component';
import { AdminlayoutComponent } from './adminlayout/adminlayout/adminlayout.component';
import { EditProductComponent } from './adminlayout/edit-product/edit-product.component';
import { FactuComponent } from './adminlayout/factu/factu.component';
import { ContactusComponent } from '././components/contactus/contactus.component';
import { ShoppingCartComponent } from '././components/shopping-cart/shopping-cart.component';
import { CouponComponent } from './adminlayout/coupon/coupon.component';
import { CheckoutComponent } from '././components/checkout/checkout.component';
import { OfferComponent } from './adminlayout/offer/offer.component';
import { OutfitComponent } from './adminlayout/outfit/outfit.component';
import { OutfitClientComponent } from './components/outfit-client/outfit-client.component';
import { PromoComponent } from './components/promo/promo.component';
import { ApartComponent } from '././adminlayout/apart/apart.component';
import { ModAdminComponent } from './adminlayout/mod-admin/mod-admin.component';
import { CreateAdminComponent } from './adminlayout/create-admin/create-admin.component';
import { ViewlikeComponent } from './components/viewlike/viewlike.component';
import { EditClientComponent } from './components/edit-client/edit-client.component';
import { OrdersComponent } from './adminlayout/orders/orders.component';
import { HistoryComponent } from './components/history/history.component';
import { GetransactionComponent } from './components/getransaction/getransaction.component';
import { TagComponent } from './adminlayout/tag/tag.component';
import { CompressimgComponent } from './adminlayout/compressimg/compressimg.component';
import { ImageslistComponent } from './adminlayout/imageslist/imageslist.component';
import { DashboardComponent } from './adminlayout/dashboard/dashboard.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { ChangepasswordComponent } from './components/changepassword/changepassword.component';

// aplicar export a la clase  hasta el momento es redundante
const routes: Routes = [
  { path: '', component: JempageComponent},
  // { path: 'Home/BJem', component: JempageComponent},
  { path: 'Home/Tu_Boutique', component: BambupageComponent},
  { path: 'Home/Nosotros', component: AboutUsComponent},
  { path: 'admin/marcas', component: TagComponent},
  { path: 'resetPassword', component: ResetpasswordComponent},
  { path: 'changePassword', component: ChangepasswordComponent},
  { path: 'get/transaccion/credomatic', component: GetransactionComponent},
  { path: 'Logout/:sure', component: LoginComponent},
  { path: 'Home/Damas/:id' , component: LadiesComponent},
  { path: 'Home/Caballeros/:id' , component: GentlemanComponent},
  { path: 'Home/Niños/:id' , component: BoysComponent},
  { path: 'Home/Niñas/:id' , component: GirlsComponent},
  { path: 'Home/Articulo/:shopId/:dpt/:gender' , component: ArticleComponent},
  { path: 'Home/Contacto/:id' , component: ContactusComponent},
  { path: 'Home/producto/detalle/:id/:idProduct', component: ArticleDetailComponent},
  { path: 'Home/ofertas/:shopId', component: PromoComponent},
  { path: 'Home/outfits/:shopId/:gender', component: OutfitClientComponent},
  { path: 'Home/Favoritos/:shopId', component: ViewlikeComponent},
  { path: 'Home/historial/:shopId', component: HistoryComponent},
  { path: 'Cuenta/configuración/:shopId', component: EditClientComponent},
  { path: 'Carrito/:shopId/:idClient', component: ShoppingCartComponent},
  { path: 'LoginAdmin', component: LoginAdminComponent},
  { path: 'registrar/:id', component: RegisterComponent},
  { path: 'editarProducto/:id', component: EditProductComponent},
  { path: 'admin', component: AdminlayoutComponent},
  { path: 'admin/articulo', component: MangArticleComponent},
  { path: 'admin/coupon' , component: CouponComponent},
  { path: 'admin/ofertas', component: OfferComponent},
  { path: 'admin/outfits', component: OutfitComponent},
  { path: 'admin/facturación', component: FactuComponent},
  { path: 'admin/Pedidos', component: OrdersComponent},
  { path: 'admin/Apartados', component: ApartComponent},
  { path: 'admin/Configuración', component: ModAdminComponent},
  { path: 'admin/CompressImg', component: CompressimgComponent},
  { path: 'admin/ImagesList', component: ImageslistComponent},
  { path: 'admin/dashboard', component: DashboardComponent},
  { path: 'admin/mantenimiento_Usuarios', component: CreateAdminComponent},
  { path: 'checkout/:id' , component: CheckoutComponent},
  { path: '**', component: Error404Component},
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
