import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogPostService } from '../services/blog-post-service';

@Component({
  selector: 'app-blogpotst-list',
  imports: [RouterLink],
  templateUrl: './blogpotst-list.html',
  styleUrl: './blogpotst-list.css',
})
export class BlogpotstList {
  private blogPostService = inject(BlogPostService);
  private getAllBlogPostByRef = this.blogPostService.getAllBlogPosts();
  //above are private properties only accessible within the BlogpotstList class. not in the html file.
  //we can use the isLoading, error and value signals in the template to show loading spinner, error message and the list of blog posts respectively
  isLoading = this.getAllBlogPostByRef.isLoading;
  isError = this.getAllBlogPostByRef.error;
  response = this.getAllBlogPostByRef.value;
  statusCode = this.getAllBlogPostByRef.statusCode;
}
