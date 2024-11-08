import { APIGatewayProxyEventV2 } from "aws-lambda";
import { plainToClass } from "class-transformer";
import { autoInjectable, inject } from "tsyringe";
import { TodoValidator } from "../models/todo.model";
import TodoRepository from "../repositories/todo.repository";
import { AppValidationError } from "../utils/errors";

@autoInjectable()
class TodoService {
  private todoRepository: TodoRepository;

  constructor(@inject(TodoRepository) todoRepository: TodoRepository) {
    this.todoRepository = todoRepository;
  }

  public async createTodo(event: APIGatewayProxyEventV2) {
    const input = plainToClass(TodoValidator, JSON.parse(event.body));

    const error = await AppValidationError(input);
    if (error) return error;
    return await this.todoRepository.create(input);
  }

  public async getTodos(event: APIGatewayProxyEventV2) {
    const id = event.pathParameters?.id;
    if (id) {
      return [await this.todoRepository.getById(id)];
    }
    return await this.todoRepository.read();
  }

  public async updateTodo(event: APIGatewayProxyEventV2) {
    const id = event.pathParameters?.id; // query event.queryStringParameters?.id
    const input = plainToClass(TodoValidator, JSON.parse(event.body!));
    const error = await AppValidationError(input);
    if (error) return error;
    return await this.todoRepository.update(id, input);
  }

  public async deleteTodoById(event: APIGatewayProxyEventV2) {
    const id = event.pathParameters?.id;
    if (!id) throw new Error("ID is required");
    return await this.todoRepository.delete(id);
  }

  public async getTodoById(event: APIGatewayProxyEventV2) {
    const id = event.pathParameters?.id;
    if (!id) throw new Error("ID is required");
    return await this.todoRepository.getById(id);
  }

  public async deleteAllTodos() {
    return await this.todoRepository.deleteAll();
  }
}

export default TodoService;
