export interface RouteDefinition {
  // Path to our route
  path: string;
  // HTTP Request method (get, post, ...)
  requestMethod: 'get' | 'post' | 'delete' | 'options' | 'put';
  // Method name within our class responsible for this route
  methodName: string;
  // Controller
  controller: string;
  // Form
  formParams: unknown;
  // Body
  formBody: unknown;
  // response
  response: unknown;
}
