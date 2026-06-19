export interface UserRequest {
  nombre: string;
  correo: string;
  rol: string; 
}

export interface UserResponse {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}