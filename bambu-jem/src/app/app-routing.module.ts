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
import { ContactusComponent } from '././components/contactus/contactus.component';
import { ShoppingCartComponent } from '././components/shopping-cart/shopping-cart.component';

// aplicar export a la clase  hasta el momento es redundante
const routes: Routes = [
  { path: 'Home/Tu_Boutique', component: BambupageComponent},
  { path: 'Home/BJem', component: JempageComponent},
  { path: 'Home/Nosotros', component: AboutUsComponent},
  { path: 'Logout/:sure', component: LoginComponent},
  { path: 'Home/Damas/:id' , component: LadiesComponent},
  { path: 'Home/Caballeros/:id' , component: GentlemanComponent},
  { path: 'Home/Niños/:id' , component: BoysComponent},
  { path: 'Home/Niñas/:id' , component: GirlsComponent},
  { path: 'Home/Articulo/:shopId/:dpt/:gender' , component: ArticleComponent},
  { path: 'Home/Contacto/:id' , component: ContactusComponent},
  { path: 'Home/producto/detalle/:id/:idProduct', component: ArticleDetailComponent},
  { path: 'Carrito/:shopId/:idClient', component: ShoppingCartComponent},
  { path: 'LoginAdmin', component: LoginAdminComponent},
  { path: 'registrar/:id', component: RegisterComponent},
  { path: 'editarProducto/:id', component: EditProductComponent},
  { path: 'admin', component: AdminlayoutComponent},
  { path: 'admin/articulo', component: MangArticleComponent},
  { path: '**', component: Error404Component},
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
