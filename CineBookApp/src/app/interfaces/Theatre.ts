import {Showtime } from './Showtime'
export interface Theatre {
  theaterId: number;
  name: string;
  location: string;
  status: number;
  address: string;
  seats: any;
  showtimes: Showtime[];
}
