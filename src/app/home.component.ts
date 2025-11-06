import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
  <header class="header">
    <h1 class="header-title">Agrosoft</h1>
  </header>

  <nav class="nav">
    <a routerLink="/plots">Lotes</a>
    <a routerLink="/employees">Empleados</a>
    <a routerLink="/machinery">Maquinaria</a>
  </nav>
`,
styles: [`
  .header {
    background-color: #e8f5e9;
    padding: 1rem;
    text-align: center;
  }

  .header h1 {
    color: #2e7d32;
    margin: 0;
    font-size: 4rem;
    font-weight: bold;
  }

  .nav {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 2rem;
  }

  .nav a {
    text-decoration: none;
    font-weight: 500;
    color: #333;
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .nav a:hover {
    background-color: #f1f1f1;
  }
`],
  imports: [RouterModule],
})
export class HomeComponent {}