import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CreatePostModel } from '../models/create-post-model';
import { Post } from '../models/post';
import { PostListItem } from '../models/post-list-item';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private http: HttpClient) {}

  public get(): Promise<PostListItem[]> {
    return firstValueFrom(this.http
      .get<PostListItem[]>(`${environment.apiBaseUrl}/api/posts`));
  }

  public detail(id: number): Promise<Post> {
    return firstValueFrom(this.http
      .get<Post>(`${environment.apiBaseUrl}/api/posts/${id}`));
  }

  public create(post: CreatePostModel): Promise<CreatePostModel> {
    return firstValueFrom(this.http
      .post<CreatePostModel>(`${environment.apiBaseUrl}/api/posts`, post));
  }

  public publish(id: number): Promise<Post> {
    return firstValueFrom(this.http
      .post<Post>(`${environment.apiBaseUrl}/api/posts/${id}/publish`, null));
  }

  public unpublish(id: number): Promise<Post> {
    return firstValueFrom(this.http
      .post<Post>(`${environment.apiBaseUrl}/api/posts/${id}/unpublish`, null));
  }

  public delete(id: number): Promise<any> {
    return this.http
      .delete(`${environment.apiBaseUrl}/api/posts/${id}`)
      .toPromise();
  }
}
