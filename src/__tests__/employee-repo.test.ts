//import * as mockIndex from '..';
import {connectionPool} from '..';
import * as mockMapper from '../util/result-set-mapper';
import { InternalServerError } from '../errors/errors';
import { Employee } from '../models/employee';
import { EmployeeRepository } from '../repos/employee-repo';

jest.mock('..', () => {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    };
});

jest.mock('../util/result-set-mapper', () => {
    return {
        mapEmployeeResultSet: jest.fn()
    };
});

describe('employeeRepo', () => {

    let sut = new EmployeeRepository();
    let mockConnect = connectionPool.connect;

    beforeEach(() => {

        //@ts-ignore
        (mockConnect as jest.Mock).mockClear().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return {
                        rows: [
                            {
                                userId: 1,
                                username: 'jvalencia',
                                password: 'password',
                                firstName: 'Juan',
                                lastName: 'Valencia',
                                email: 'email@email.com',
                                role: 'admin'
                            }
                        ]
                    };
                }), 
                release: jest.fn()
            };
        });
        
        (mockMapper.mapEmployeeResultSet as jest.Mock).mockClear();
    });

    test('should resolve to an array of Users when getAll retrieves records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();

        let mockUser = new Employee(1, 'un', 'pw', 'fn','ln','email','user');
        (mockMapper.mapEmployeeResultSet as jest.Mock).mockReturnValue(mockUser);

        // Act
        let result = await sut.getAll();

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(1);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should resolve to an empty array when getAll retrieves a records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] }; }), 
                release: jest.fn()
            };
        });

        // Act
        let result = await sut.getAll();

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(0);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should throw InternalServerError when getAll() is called but query is unsuccesful', async () => {

        // Arrange
        expect.hasAssertions();
        (mockConnect as jest.Mock).mockImplementation( () => {
            return {
                query: jest.fn().mockImplementation( () => { throw new Error(); }),
                release: jest.fn()
            };
        });

        // Act
        try {
            await sut.getAll();
        } catch (e) {
            // Assert
            expect(e instanceof InternalServerError).toBe(true);
        }
    });

    test('should resolve to a User object when getById retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockUser = new Employee(1, 'un', 'pw', 'fn','ln','email','user');
        (mockMapper.mapEmployeeResultSet as jest.Mock).mockReturnValue(mockUser);

        // Act
        let result = await sut.getById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Employee).toBe(true);

    });

    test('should resolve to an empty array when getById retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();
        
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] }; }), 
                release: jest.fn()
            };
        });

        // Act
        let result = await sut.getById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Employee).toBe(true);

    });

    test('should throw InternalServerError when getById() is called but query is unsuccesful', async () => {

        // Arrange
        expect.hasAssertions();
        let mockUser = new Employee(1, 'un', 'pw', 'fn','ln','email','user');
        (mockConnect as jest.Mock).mockImplementation( () => {
            return {
                query: jest.fn().mockImplementation( () => { return false; }),
                release: jest.fn()
            };
        });

        // Act
        try {
            await sut.getById(mockUser.userId);
        } catch (e) {
            // Assert
            expect(e instanceof InternalServerError).toBe(true);
        }
    });

    test('should resolve to a User object when getUserByUniqueKey retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockUser = new Employee(1, 'un', 'pw', 'fn','ln','email','user');
        (mockMapper.mapEmployeeResultSet as jest.Mock).mockReturnValue(mockUser);

        // Act
        let result = await sut.getEmployeeByUniqueKey('username', 'jvalencia');

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Employee).toBe(true);

    });

    test('should resolve to an empty array when getUserByUniqueKey retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();
        
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] }; }), 
                release: jest.fn()
            };
        });

        // Act
        let result = await sut.getEmployeeByUniqueKey('username', 'jvalencia');

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Employee).toBe(true);

    });

    test('should resolve to a User object when getUserByCredentials retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockUser = new Employee(1, 'un', 'pw', 'fn','ln','email','user');
        (mockMapper.mapEmployeeResultSet as jest.Mock).mockReturnValue(mockUser);

        // Act
        let result = await sut.getEmployeeByCredentials('username', 'jvalencia');

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Employee).toBe(true);

    });

    test('should resolve to an empty array when getUserByCredentials retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();
        
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] }; }), 
                release: jest.fn()
            };
        });

        // Act
        let result = await sut.getEmployeeByCredentials('username', 'jvalencia');

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Employee).toBe(true);

    });

    test('should resolve to a User object when save persists a record to the data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockUser = new Employee(1, 'un', 'pw', 'fn','ln','email','user');
        (mockMapper.mapEmployeeResultSet as jest.Mock).mockReturnValue(mockUser);

        // Act
        let result = await sut.save(mockUser);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Employee).toBe(true);

    });

    test('should resolve to an empty array when save persists a record to the data source', async () => {

        // Arrange
        expect.hasAssertions();
        let mockUser = new Employee(1, 'un', 'pw', 'fn','ln','email','user');
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] }; }), 
                release: jest.fn()
            };
        });

        // Act
        let result = await sut.save(mockUser);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Employee).toBe(true);

    });

    test('should resolve to true when update updates a record on the data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockUser = new Employee(1, 'un', 'pw', 'fn','ln','email','user');
        (mockMapper.mapEmployeeResultSet as jest.Mock).mockReturnValue(true);

        // Act
        let result = await sut.update(mockUser);

        // Assert
        expect(result).toBeTruthy();
        expect(result).toBe(true);

    });

    test('should resolve to true when deleteById deletes a record on the data source', async () => {

        // Arrange
        expect.hasAssertions();

        
        (mockMapper.mapEmployeeResultSet as jest.Mock).mockReturnValue(true);

        // Act
        let result = await sut.deleteById(2);

        // Assert
        expect(result).toBeTruthy();
        expect(result).toBe(true);

    });

    test('should throw InternalServerError when deleteById() is called but query is unsuccesful', async () => {

        // Arrange
        expect.hasAssertions();
        
        (mockConnect as jest.Mock).mockImplementation( () => {
            return {
                query: jest.fn().mockImplementation( () => { throw new Error(); }),
                release: jest.fn()
            };
        });

        // Act
        try {
            await sut.deleteById(1);
        } catch (e) {
            // Assert
            expect(e instanceof InternalServerError).toBe(true);
        }
    });
});