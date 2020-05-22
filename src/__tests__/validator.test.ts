import { isValidId, isValidStrings, isValidObject, isPropertyOf } from '../util/validator';
import { Employee } from '../models/employee';
import { Reimbursement } from '../models/reimbursement';

describe('validator', () => {

    test('should return true when isValidId is provided a valid id', () => {
        
        // Arrange
        expect.assertions(3);

        // Act
        let result1 = isValidId(1);
        let result2 = isValidId(999999);
        let result3 = isValidId(Number('123'));

        // Assert
        expect(result1).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);

    });

    test('should return false when isValidId is provided a invalid id (falsy)', () => {

        // Arrange
        expect.assertions(3);

        // Act
        let result1 = isValidId(NaN);
        let result2 = isValidId(0);
        let result3 = isValidId(Number(null));

        // Assert
        expect(result1).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);

    });

    test('should return false when isValidId is provided a invalid id (decimal)', () => {

        // Arrange
        expect.assertions(3);

        // Act
        let result1 = isValidId(3.14);
        let result2 = isValidId(0.01);
        let result3 = isValidId(Number(4.20));

        // Assert
        expect(result1).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);

    });

    test('should return false when isValidId is provided a invalid id (non-positive)', () => {

        // Arrange
        expect.assertions(3);

        // Act
        let result1 = isValidId(0);
        let result2 = isValidId(-1);
        let result3 = isValidId(Number(-23));

        // Assert
        expect(result1).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);

    });

    test('should return true when isValidStrings is provided valid string(s)', () => {

        // Arrange
        expect.assertions(3);

        // Act
        let result1 = isValidStrings('valid');
        let result2 = isValidStrings('valid', 'string', 'values');
        let result3 = isValidStrings(String('weird'), String('but valid'));

        // Assert
        expect(result1).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);

    });

    test('should return false when isValidStrings is provided invalid string(s)', () => {

        // Arrange
        expect.assertions(3);

        // Act
        let result1 = isValidStrings('');
        let result2 = isValidStrings('some valid', '', 'but not all');
        let result3 = isValidStrings(String(''), String('still weird'));

        // Assert
        expect(result1).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);

    });

    test('should return true when isValidObject is provided valid object with no nullable props', () => {

        // Arrange
        expect.assertions(2);

        // Act
        let result1 = isValidObject(new Reimbursement(1,1,new Date('01-10-1990'),new Date('01-10-1990'),'x','x','x','x','x')); 
        let result2 = isValidObject(new Employee(1, 'un', 'pw', 'fn','ln','email','user'));

        // Assert
        expect(result1).toBe(true);
        expect(result2).toBe(true);

    });

    test('should return true when isValidObject is provided valid object with nullable prop(s)', () => {

        // Arrange
        expect.assertions(2);

        // Act
        let result1 = isValidObject(new Reimbursement(1,1,new Date('1-1-1990'),new Date('1-1-1990'),'x','x','x','x','x'), 'reimbId'); 
        let result2 = isValidObject(new Employee(1, 'un', 'pw', 'fn','ln','email','user'), 'userId');

        // Assert
        expect(result1).toBe(true);
        expect(result2).toBe(true);

    });

    test('should return false when isValidObject is provided invalid object with no nullable prop(s)', () => {

        // Arrange
        expect.assertions(2);

        // Act
        let result1 = isValidObject(new Reimbursement(1,1,new Date('01-10-1990'),new Date('01-10-1990'),'','x','x','x','x')); 
        let result2 = isValidObject(new Employee(1, 'un', 'pw', 'fn','','email','user'));

        // Assert
        expect(result1).toBe(false);
        expect(result2).toBe(false);

    });

    test('should return false when isValidObject is provided invalid object with some nullable prop(s)', () => {

        // Arrange
        expect.assertions(2);

        // Act
        let result1 = isValidObject(new Reimbursement(1,1,new Date(''),new Date(''),'','','','',''), 'charId');
        let result2 = isValidObject(new Employee(0, '', 'pw', 'fn','ln','email','user'), 'userId');

        // Assert
        expect(result1).toBe(false);
        expect(result2).toBe(false);

    });

    test('should return true when isPropertyOf is provided a known property of a given constructable type', () => {

        // Arrange
        expect.assertions(3);

        // Act
        let result1 = isPropertyOf('userId', Employee);
        let result2 = isPropertyOf('username', Employee);
        let result3 = isPropertyOf('reimbId', Reimbursement);

        // Assert
        expect(result1).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);

    });

    test('should return false when isPropertyOf is provided a unknown property of a given constructable type', () => {

        // Arrange
        expect.assertions(3);

        // Act
        let result1 = isPropertyOf('not-real', Employee);
        let result2 = isPropertyOf('fake', Employee);
        let result3 = isPropertyOf('titl', Reimbursement);

        // Assert
        expect(result1).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);

    });

    test('should return false when isPropertyOf is provided a non-constructable type', () => {

        // Arrange
        expect.assertions(4);

        // Act
        let result1 = isPropertyOf('shouldn\'t work', {x: 'non-constructable'});
        let result2 = isPropertyOf('nope', 2);
        let result3 = isPropertyOf('nuh-uh', false);
        let result4 = isPropertyOf('won\'t work', Symbol('asd'));

        // Assert
        expect(result1).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);
        expect(result4).toBe(false);  

    });

});