import dayjs from "dayjs";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayjsDateProvider = new DayjsDateProvider();

describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
      carsRepositoryInMemory,
    );
  });

  it("Should be abe to create a new rental", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Gol G3",
      description: "Carro Gol G3",
      daily_rate: 140.0,
      license_plate: "ABC-5678",
      fine_amount: 100,
      brand: "Wolks",
      category_id: "12345",
    });

    const rental = await createRentalUseCase.execute({
      user_id: "123456",
      car_id: car.id!,
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("Should not be abe to create a new rental if there is another open to the same user ", async () => {
    await rentalsRepositoryInMemory.create({
      user_id: "123456",
      car_id: "78910",
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: "123456",
        car_id: "99999",
        expected_return_date: dayAdd24Hours,
      }),
    ).rejects.toEqual(new AppError("There's a rental in progress for user!"));
  });

  it("Should not be abe to create a new rental if there is another open to the same car ", async () => {
    await rentalsRepositoryInMemory.create({
      user_id: "123456",
      car_id: "78910",
      expected_return_date: dayAdd24Hours,
    });
    await expect(
      createRentalUseCase.execute({
        user_id: "321",
        car_id: "78910",
        expected_return_date: dayAdd24Hours,
      }),
    ).rejects.toEqual(new AppError("Car is unavailable!"));
  });

  it("Should not be abe to create a new rental with invalid return time", async () => {
    await expect(
      createRentalUseCase.execute({
        user_id: "123",
        car_id: "654321",
        expected_return_date: new Date(),
      }),
    ).rejects.toEqual(new AppError("Invalid return time!"));
  });
});
