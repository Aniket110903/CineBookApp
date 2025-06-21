export interface Showtime {
  showtimeId: number;
  movieId: number;
  theaterId: number;
  startTime: Date;
  endTime: Date;
  theaterLoc?: string;
  theaterAdd: string;
  movieTitle?: string;
  theaterName?: string;
}
