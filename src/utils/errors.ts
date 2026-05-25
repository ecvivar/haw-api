export class BadRequestException extends Error {
  constructor(message = 'Bad request') {
    super(message);
    this.name = 'BadRequestException';
  }
}

export class ItemNotFoundException extends Error {
  constructor(message = 'Item not found') {
    super(message);
    this.name = 'ItemNotFoundException';
  }
}

export class SaveConflictException extends Error {
  constructor(message = 'Save conflict') {
    super(message);
    this.name = 'SaveConflictException';
  }
}

export class InternalServerErrorException extends Error {
  constructor(message = 'Internal server error') {
    super(message);
    this.name = 'InternalServerErrorException';
  }
}

export class UserConflictException extends Error {
  constructor(message = 'User conflict') {
    super(message);
    this.name = 'UserConflictException';
  }
}

export class UserNotFoundException extends Error {
  constructor(message = 'User not found') {
    super(message);
    this.name = 'UserNotFoundException';
  }
}

export class UserUnauthorizedException extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UserUnauthorizedException';
  }
}

export class RoleBadRequestException extends Error {
  constructor(message = 'Invalid role') {
    super(message);
    this.name = 'RoleBadRequestException';
  }
}

export class OperatorNotFoundException extends Error {
  constructor(message = 'Filter operator not found') {
    super(message);
    this.name = 'OperatorNotFoundException';
  }
}
