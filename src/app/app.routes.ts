import { Routes } from '@angular/router';
import { CategoryList } from './features/category/category-list/category-list';
import { AddCategory } from './features/category/add-category/add-category';
import { EditCategory } from './features/category/edit-category/edit-category';
import { BlogpotstList } from './features/blogPost/blogpotst-list/blogpotst-list';
import { AddBlogpost } from './features/blogPost/add-blogpost/add-blogpost';

export const routes: Routes = [
  {
    path:"admin/categories",
    component:CategoryList
    
  },
  {
    path:"admin/categories/add",
    component:AddCategory
  }
  ,
  {
    path:"admin/categories/edit/:id",
    component:EditCategory
  }
   ,
  {
    path:"admin/blogposts",
    component:BlogpotstList
  }
  ,
  {
    path:"admin/blogposts/add",
    component:AddBlogpost
  }
];
