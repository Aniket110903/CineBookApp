import { Feedbacks } from "./Feedbacks";

export interface Movie {
  movieId: number;
  title: string;
  description: string;
  rating: number;
  genre: string;
  posterUrl: string;
  releaseDate: Date;
  feedbacks: Feedbacks[];
  showtimes: any[]
}
