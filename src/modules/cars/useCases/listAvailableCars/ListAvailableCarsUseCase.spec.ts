import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { CreateCarUseCase } from "../createCar/CreateCarUseCase";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let createCarUseCase: CreateCarUseCase;

describe("List Cars", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory,
    );
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });
  it("Should be able to list all available cars", async () => {
    const car = {
      name: "Gol G3",
      description: "Carro Gol G3",
      daily_rate: 140.0,
      license_plate: "ABC-5678",
      fine_amount: 40,
      brand: "Wolks",
      category_id: "f5ca49a3-0a59-4f7c-b9b4-9e4412e213fd",
    };

    await createCarUseCase.execute(car);

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars.length).toBe(1);
  });

  it("Should be able to list all available cars by brand", async () => {
    const car = {
      name: "Gol G3",
      description: "Carro Gol G3",
      daily_rate: 140.0,
      license_plate: "ABC-1234",
      fine_amount: 40,
      brand: "Car_brand",
      category_id: "f5ca49a3-0a59-4f7c-b9b4-9e4412e213fd",
    };

    await createCarUseCase.execute(car);

    const cars = await listAvailableCarsUseCase.execute({ brand: "Car_brand" });

    expect(cars.length).toBe(1);
  });

  it("Should be able to list all available cars by name", async () => {
    const car = {
      name: "GolG3",
      description: "Carro Gol G3",
      daily_rate: 140.0,
      license_plate: "ABC-1234",
      fine_amount: 40,
      brand: "Car_brand",
      category_id: "f5ca49a3-0a59-4f7c-b9b4-9e4412e213fd",
    };

    await createCarUseCase.execute(car);

    const cars = await listAvailableCarsUseCase.execute({ name: "GolG3" });

    expect(cars.length).toBe(1);
  });

  it("Should be able to list all available cars by category", async () => {
    const car = {
      name: "GolG3",
      description: "Carro Gol G3",
      daily_rate: 140.0,
      license_plate: "ABC-1234",
      fine_amount: 40,
      brand: "Car_brand",
      category_id: "12345",
    };

    await createCarUseCase.execute(car);

    const cars = await listAvailableCarsUseCase.execute({
      category_id: "12345",
    });

    expect(cars.length).toBe(1);
  });
});
