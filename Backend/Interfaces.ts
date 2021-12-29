export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface IPost {
  author: string;
  date: number;
  location: ILocation;
  id: string;
  text: string;
  score: number;
}
