import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function ContainsNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'containsNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && /(?=.*[0-9])/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Le mot de passe doit contenir au moins un chiffre';
        },
      },
    });
  };
}

export function ContainsLowercase(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'containsLowercase',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && /(?=.*[a-z])/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Le mot de passe doit contenir au moins une lettre minuscule';
        },
      },
    });
  };
}

export function ContainsUppercase(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'containsUppercase',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && /(?=.*[A-Z])/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Le mot de passe doit contenir au moins une lettre majuscule';
        },
      },
    });
  };
}

export function ContainsSpecialCharacter(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'containsSpecialCharacter',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && /(?=.*[!@#$%^&*])/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*)';
        },
      },
    });
  };
}
