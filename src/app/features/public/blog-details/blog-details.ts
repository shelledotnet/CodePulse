import { Component, inject, input } from '@angular/core';
import { BlogPostService } from '../../blogPost/services/blog-post-service';
import { DatePipe } from '@angular/common';
import { MarkdownComponent } from "ngx-markdown";

@Component({
  selector: 'app-blog-details',
  imports: [DatePipe, MarkdownComponent],
  templateUrl: './blog-details.html',
  styleUrl: './blog-details.css',
})
export class BlogDetails {
  //this is the input signal that will receive the urlHandle parameter ensure its same parameer with the varaible here.. from the route, ensure this landing componet 
  // can recieve route parametr by adding  provideRouter(routes,withComponentInputBinding()), in app.config.ts
  urlHandle = input<string | undefined>();  //the urlHandle is also a signal that will be used to fetch the blog details based on the urlHandle from the route, and we are using the urlHandle signal in the service to fetch the blog details based on the urlHandle, and also to know the loading and error state of the request to fetch blog details based on urlHandle
  private blogPostService = inject(BlogPostService);
  blogPostResourceRef = this.blogPostService.getBlogPostByUrlHandle(this.urlHandle); 
  //we are passing the urlHandle input signal to the getBlogPostByUrlHandle method here with out paranthesis but when calling signal we inclue the parathesis in the service to fetch the blog details based on the urlHandle, and we are using the returned signal to get the blog details and patch the form values with the blog details, and also to know the loading and error state of the request to fetch blog details based on urlHandle
  //above are private properties only accessible within the BlogDetails class. not in the html file.
  isLoading = this.blogPostResourceRef.isLoading;
  isError = this.blogPostResourceRef.error;
  blogDetailsResponse = this.blogPostResourceRef.value;
  statusCode = this.blogPostResourceRef.statusCode;
}
