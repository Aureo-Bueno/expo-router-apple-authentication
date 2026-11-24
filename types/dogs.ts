export interface Dog {
  id: string;
  name: string;
  breed: string;
}

export interface DogsData {
  dogs: Array<Dog>;
}

export interface DogDescriptionData {
  dog: Dog;
}

export interface DogDescriptionVariables {
  id: string;
}
