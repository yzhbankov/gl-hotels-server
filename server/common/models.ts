export interface IWeather {
    temperature: number;
    wind: number;
    icon: string;
}

export interface IProfile {
    followers: number;
    following: number;
    photo: string;
}

export interface IHotel {
    _id: string;
    title: string;
    address: string;
    description: string;
    phone: string;
    picture: string;
    photos: string[];
    weather: IWeather;
    profile: IProfile;
    stars: number;
    author: string;
}

export interface IUser {
    login: string,
    email: string,
    password: string,
    admin: boolean,
    firstName: string,
    lastName: string,
    hotels: string[],
    favorites: string[]
}
