export enum RabbitMQ {
  UserQueue = 'users',
  AuthQueue = 'auth',
}

export enum UserMSG {
  CREATE = 'CREATE_USER',
  UPDATE = 'UPDATE_USER',
  DELETE = 'DELETE_USER',
  FIND_ALL = 'FIND_ALL_USERS',
  FIND_ONE = 'FIND_ONE_USER',
  VALID_USER = 'VALID_USER',
}

export enum AuthMSG {
  REGISTER = 'REGISTER_USER',
}
