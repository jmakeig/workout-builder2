export { api } from './local';
export class ValidationError extends Error {}
export class NotFoundError extends ValidationError {}
export class ConstraintViolationError extends ValidationError {}
