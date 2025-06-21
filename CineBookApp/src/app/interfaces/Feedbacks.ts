import { User } from "./User";

export interface Feedbacks {
  feedbackId: number;
  userId: number;
  movieId: number;
  rating: number;
  comments: string;
  submittedAt: Date;
  user?: User;
}
