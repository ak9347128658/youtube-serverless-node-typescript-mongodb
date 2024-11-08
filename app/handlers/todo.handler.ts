import { APIGatewayProxyEventV2 } from "aws-lambda";
import { ErrorResponse, SuccessResponse } from "../utils/reponse";
import { container } from "tsyringe";
import TodoService from "../services/todo.service";

const todoService = container.resolve(TodoService);

export const todoHandler = async (event: APIGatewayProxyEventV2) => {
  try {
    const httpMethod = event.requestContext.http.method.toLowerCase();

    switch (httpMethod) {
      case "get":
        return SuccessResponse(await todoService.getTodos(event));
      case "post":
        return SuccessResponse(await todoService.createTodo(event), 201);
      case "patch":
        return SuccessResponse(await todoService.updateTodo(event), 200);
      case "delete":
        return SuccessResponse(await todoService.deleteTodoById(event), 204);
      default:
        return ErrorResponse(400, "Invalid HTTP Method");
    }
  } catch (error) {
    return ErrorResponse(500, error.message);
  }
};
