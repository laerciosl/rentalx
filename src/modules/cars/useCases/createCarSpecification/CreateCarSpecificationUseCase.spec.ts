import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationsRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCarUseCase } from "../createCar/CreateCarUseCase";
import { CreateSpecificationUseCase } from "../createSpecification/CreateSpecificationUseCase";
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;
let createCarUseCase: CreateCarUseCase;
let createSpecificationUseCase: CreateSpecificationUseCase;

describe("Create Car Specification", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory,
    );

    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
    createSpecificationUseCase = new CreateSpecificationUseCase(
      specificationsRepositoryInMemory,
    );
  });

  it("Should not be able to add a new specification to a non-existent car", async () => {
    expect(async () => {
      const car_id = "1234";
      const specifications_id = ["5678"];

      await createCarSpecificationUseCase.execute({
        car_id,
        specifications_id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to add a new specification to the car", async () => {
    const car = await createCarUseCase.execute({
      name: "Gol G3",
      description: "Carro Gol G3",
      daily_rate: 140.0,
      license_plate: "ABC-5678",
      fine_amount: 40,
      brand: "Wolks",
      category_id: "f5ca49a3-0a59-4f7c-b9b4-9e4412e213fd",
    });

    const specification = await createSpecificationUseCase.execute({
      name: "Specification 1",
      description: "Specification Description",
    });

    const specificationsCars = await createCarSpecificationUseCase.execute({
      car_id: car.id!,
      specifications_id: [specification.id!],
    });

    expect(specificationsCars).toHaveProperty("specifications");
    expect(specificationsCars.specifications.length).toBe(1);
  });
});
