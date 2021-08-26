import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Todo } from '../models/Todo';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {



  constructor(private http: HttpClient) {     
  }

  getTodo(): Observable<Todo[]> {    
    return this.http.get<Todo[]>("/api");
  }

  toggleCompleted(todo: Todo): Observable<any> {
    const url = `/api/${todo.id}`
    return this.http.put(url,todo, httpOptions);
  }

  deleteTodo(todo: Todo): Observable<Todo> {
    const url = `/api/${todo.id}`
    return this.http.delete<Todo>(url, httpOptions);
  }

  addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>("/api", todo, httpOptions);
  }
}
