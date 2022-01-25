import { ModelError } from "./base";

export class ModelNotFoundError extends ModelError {
  constructor(
    public readonly id: string,
    public readonly type: string,
    message: string = `The ${type} with id "${id}" could not be found.`
  ) {
    super(message);
  }
}

export class IndexNotLoadedError extends ModelError {
  constructor(self: string, message = `Index for ${self} has not been loaded.`) {
    super(message);
  }
}

export class DependencyUnavailableError extends ModelError {
  constructor(
    public readonly self: string,
    public readonly dependency: string,
    message: string = `The dependency "${dependency}" for ${self} is unavailable.`
  ) {
    super(message);
  }
}
