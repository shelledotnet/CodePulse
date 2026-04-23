import { Component, inject } from '@angular/core';
import { BlogPostService } from '../../blogPost/services/blog-post-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private blogPostService = inject(BlogPostService);

  private blogPostResourceRef = this.blogPostService.getAllBlogPosts();
  //all above are private properties only accessible within the Home class. not in the html file. 
  // The blogPostService is used to interact with the backend service for creating blog posts, while the categoryService is used to fetch categories. The route property is used for navigation after successfully creating a blog post. The categoriesResourceRef is a reference to the resource that contains all categories, which can be used to populate a dropdown or selection list in the form.
  //we can use the isLoading, error and blogPostsResponse signals in the template to show loading spinner, error message and the list of blog posts respectively
  isLoading = this.blogPostResourceRef.isLoading;
  isError = this.blogPostResourceRef.error;
  blogPostsResponse = this.blogPostResourceRef.value;
  statusCode = this.blogPostResourceRef.statusCode;

}
