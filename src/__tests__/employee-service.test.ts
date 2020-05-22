import { EmployeeService } from '../services/employee-service';
import { Employee } from '../models/employee';
import Validator from '../util/validator';
import { ResourceNotFoundError, BadRequestError, AuthenticationError, ResourcePersistenceError } from '../errors/errors';
import { resolveSoa } from 'dns';


jest.mock('../repos/employee-repo', () => {
    
    return new class EmployeeRepository {
            getAll = jest.fn();
            getById = jest.fn();
            getEmployeeByUniqueKey = jest.fn();
            getEmployeeByCredentials = jest.fn();
            save = jest.fn();
            update = jest.fn();
            deleteById = jest.fn();
            getRoles = jest.fn();
    };

});
describe('userService', () => {

    let sut: EmployeeService;
    let mockRepo;

    let mockUsers = [
        new Employee(1, 'jdvalencia', 'pw', 'fn','ln','email@email.com','user'),
        new Employee(2, '', 'pw', 'fn','ln','email','user'),
        new Employee(3, '', 'pw', 'fn','ln','email','user'),
        new Employee(4, '', 'pw', 'fn','ln','email','user'),
        new Employee(5, '', 'pw', 'fn','ln','email','user')
    ];

    beforeEach(() => {

        mockRepo = jest.fn(() => {
            return {
                getAll: jest.fn(),
                getById: jest.fn(),
                getUserByUniqueKey: jest.fn(),
                getUserByCredentials: jest.fn(),
                save: jest.fn(),
                update: jest.fn(),
                deleteById: jest.fn()
            };
        });

        // @ts-ignore
        sut = new EmployeeService(mockRepo);
    
    });

    test('should resolve to User[] (without passwords) when getAllUsers() successfully retrieves users from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue(mockUsers);

        // Act
        let result = await sut.getAllEmployees();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(5);
        result.forEach(val => expect(val.password).toBeUndefined());

    });

    test('should reject with ResourceNotFoundError when getAllUsers fails to get any users from the data source', async () => {

        // Arrange
        expect.assertions(1);
        mockRepo.getAll = jest.fn().mockReturnValue([]);

        // Act
        try {
            await sut.getAllEmployees();
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to User when getUserById is given a valid an known id', async () => {

        // Arrange
        expect.assertions(3);
        
        Validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Employee>((resolve) => resolve(mockUsers[id - 1]));
        });


        // Act
        let result = await sut.getEmployeeById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result.userId).toBe(1);
        expect(result.password).toBeUndefined();

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (decimal)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getEmployeeById(3.14);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (zero)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getEmployeeById(0);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (NaN)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getEmployeeById(NaN);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (negative)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getEmployeeById(-2);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourceNotFoundError if getByid is given an unknown id', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(true);

        // Act
        try {
            await sut.getEmployeeById(9999);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to User when getEmployeeByUniqueKey is given a valid a known Object', async () => {

        // Arrange
        expect.assertions(3);
        

        //Object.keys = jest.fn().mockImplementation(() => { return ['id']});

        Validator.isPropertyOf = jest.fn().mockReturnValue(true);
        Validator.isValidStrings = jest.fn().mockReturnValue(true);
        Validator.isEmptyObject = jest.fn().mockReturnValue(false);

        mockRepo.getEmployeeByUniqueKey = jest.fn().mockImplementation((key: string, val: string) => {
            return new Promise<Employee>((resolve) => {
                resolve(mockUsers.find(user => user[key] === val));
            });
        });



        // Act
        let result = await sut.getEmployeeByUniqueKey({'username': 'jdvalencia'});

        // Assert
        expect(result).toBeTruthy();
        expect(result.username).toBe('jdvalencia');
        expect(result.password).toBeUndefined();

    });

    test('should reject with BadRequestError when getUserByUniqueKey is given a invalid value as an Object(empty string)', async () => {

        // Arrange
        expect.assertions(1);
        

        // Act
        try {

            Validator.isPropertyOf = jest.fn().mockReturnValue(false);
            Validator.isValidStrings = jest.fn().mockReturnValue(true);
            Validator.isEmptyObject = jest.fn().mockReturnValue(false);

            await sut.getEmployeeByUniqueKey('');
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getEmployeeByUniqueKey is given a invalid value as an Object({"username":""})', async () => {

        // Arrange
        expect.assertions(1);
        

        // Act
        try {

            Validator.isPropertyOf = jest.fn().mockReturnValue(true);
            Validator.isValidStrings = jest.fn().mockReturnValue(false);
            Validator.isEmptyObject = jest.fn().mockReturnValue(false);

            mockRepo.getEmployeeByUniqueKey = jest.fn().mockImplementation((key: string, val: string) => {
                return new Promise<Employee>((resolve) => {
                    resolve(mockUsers.find(user => user[key] === val));
                });
            });
        
            await sut.getEmployeeByUniqueKey({'username': ''});
        } catch (e) {

            // Assert
            
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourceNotFoundError when getEmployeeByUniqueKey return an empty object', async () => {

        // Arrange
        expect.assertions(1);
        

        // Act
        try {

            Validator.isPropertyOf = jest.fn().mockReturnValue(true);
            Validator.isValidStrings = jest.fn().mockReturnValue(true);
            Validator.isEmptyObject = jest.fn().mockReturnValue(true);
            mockRepo.getEmployeeByUniqueKey = jest.fn().mockImplementation(() => {
                return new Promise<Employee>((resolve) => {
                    resolve({} as Employee);
                });
            });
            await sut.getEmployeeByUniqueKey({'username': 'x'});
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to User when authenticateEmployee is given a valid a known username and password', async () => {

        // Arrange
        expect.assertions(3);
        
        Validator.isValidStrings = jest.fn().mockReturnValue(true);

        mockRepo.getEmployeeByCredentials = jest.fn().mockImplementation((un: string, pw: string) => {
            return new Promise<Employee>((resolve) => {
                resolve(mockUsers.find(user => user['username'] === un && user['password'] === pw ));
            });
        });

        // Act
        let result = await sut.authenticateEmployee('jdvalencia', 'pw');

        // Assert
        expect(result).toBeTruthy();
        expect(result.username).toBe('jdvalencia');
        expect(result.password).toBeUndefined();

    });

    test('should reject with BadRequestError when authenticateEmployee is given an invalid value ("","")', async () => {

        // Arrange
        expect.assertions(1);
        
        //Act
        try {
            
            Validator.isValidStrings = jest.fn().mockReturnValue(false);
            

            await sut.authenticateEmployee('', '');
        } catch (e) {
    
            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with AuthenticationError when authenticateUser results in an empty object', async () => {

        // Arrange
        expect.assertions(1);
        
        //Act
        try {
            
            Validator.isValidStrings = jest.fn().mockReturnValue(true);
            mockRepo.getEmployeeByCredentials = jest.fn().mockImplementation(() => {
                return new Promise<Employee>((resolve) => {
                    resolve({} as Employee);
                });
            });
            await sut.authenticateEmployee('aanderson','password');
        } catch (e) {
    
            // Assert
            expect(e instanceof AuthenticationError).toBe(true);
        }

    });

    test('should resolve to User when addNewUser is given a valid a known User', async () => {

        // Arrange
        expect.assertions(3);
        


        Validator.isValidObject = jest.fn().mockReturnValue(true);

        mockRepo.save = jest.fn().mockImplementation((user: Employee) => {
            return new Promise<Employee>((resolve) => {
                resolve(user);
            });
        });

        sut.isUsernameAvailable = jest.fn().mockReturnValue(true);
        sut.isEmailAvailable = jest.fn().mockReturnValue(true);

        // Act
        let result = await sut.addNewEmployee(new Employee(1, 'un', 'pw', 'fn','ln','email','user'));

        // Assert
        expect(result).toBeTruthy();
        expect(result.username).toBe('un');
        expect(result.password).toBeUndefined();

    });

    test('should ResourcePersistenceError when addNewUser is given an unavailable username', async () => {

        // Arrange
        expect.assertions(1);
        

        mockRepo.getRoles = jest.fn().mockImplementation(() => {
            return new Promise<any[]>((resolve) => {
                resolve(['user','admin','finance manager']);
            });
        });



        // Act
        try{
            Validator.isValidObject = jest.fn().mockReturnValue(true);


            sut.isUsernameAvailable = jest.fn().mockReturnValue(false);
            sut.isEmailAvailable = jest.fn().mockReturnValue(true);

            await sut.addNewEmployee(new Employee(1, 'jdvalencia', 'pw', 'fn','ln','email@email.com','user'));
        }
        catch(e){
            expect(e instanceof ResourcePersistenceError).toBe(true);
        }

        // Assert
        

    });

    test('should ResourcePersistenceError when addNewUser is given an unavailable email', async () => {

        // Arrange
        expect.assertions(1);
        


        Validator.isValidObject = jest.fn().mockReturnValue(true);

        mockRepo.save = jest.fn().mockImplementation((user: Employee) => {
            return new Promise<Employee>((resolve) => {
                resolve(user);
            });
        });
        mockRepo.getRoles = jest.fn().mockImplementation(() => {
            return new Promise<any[]>((resolve) => {
                resolve(['user','admin','finance manager']);
            });
        });
        



        // Act
        try{
            sut.isUsernameAvailable = jest.fn().mockReturnValue(true);
            sut.isEmailAvailable = jest.fn().mockReturnValue(false);
            
            await sut.addNewEmployee(new Employee(7, 'test', 'pw', 'fn','ln','email@email.com','user'));
        }
        catch(e){
            expect(e instanceof ResourcePersistenceError).toBe(true);
        }

        // Assert
        

    });

    test('should reject to BadRequestError when addNewUser is given an invalid User(testing private isUsernameAvailable method)', async () => {

        // Arrange
        expect.assertions(1);
        


        Validator.isValidObject = jest.fn().mockReturnValue(true);

        mockRepo.save = jest.fn().mockImplementation((user: Employee) => {
            return new Promise<Employee>((resolve) => {
                resolve(user);
            });
        });
        

        // Act
        try{

        
            await sut.addNewEmployee(new Employee(1, '', 'pw', 'fn','ln','email','user'));
        }
        // Assert
        catch(e){
            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    test('should reject to BadRequestError when addNewUser is given an invalid User(testing private isAccountAvailable method)', async () => {

        // Arrange
        expect.assertions(1);
        


        Validator.isValidObject = jest.fn().mockReturnValue(true);
        sut.isUsernameAvailable = jest.fn().mockReturnValue(false);
        let empRoles;
        let emp = mockRepo.getRoles = jest.fn().mockImplementation(() => {
            
            return new Promise<any[]>((resolve) => {
                resolve(empRoles);
            });
        });

        mockRepo.save = jest.fn().mockImplementation((user: Employee) => {
            return new Promise<Employee>((resolve) => {
                resolve(user);
            });
        });



        // Act
        try{
            await sut.addNewEmployee(new Employee(1, '', 'pw', 'fn','ln','email','user'));
        }
        // Assert
        catch(e){
            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    test('should reject to BadRequestError when addNewUser is given an invalid User', async () => {

        // Arrange
        expect.assertions(1);
        
        let empRoles;

        Validator.isValidObject = jest.fn().mockReturnValue(false);

        mockRepo.getRoles = jest.fn().mockImplementation(() => {
            return new Promise<any[]>((resolve) => {
                resolve(empRoles);
            });
        });
        sut.isUsernameAvailable = jest.fn().mockReturnValue(false);
        sut.isEmailAvailable = jest.fn().mockReturnValue(false);

        //empRoles.includes = jest.fn().mockReturnValue(false);

        mockRepo.save = jest.fn().mockImplementation((user: Employee) => {
            return new Promise<Employee>((resolve) => {
                resolve(user);
            });
        });



        // Act
        try{
            await sut.addNewEmployee(new Employee(6, '', 'pw', 'fn','ln','email','user'));
        }
        // Assert
        catch(e){
            console.log(e);
            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    test('should resolve true when updateUser is given a valid a known User', async () => {

        // Arrange
        expect.assertions(1);
        //let updatedUser = {userId : 1, username: 'jdvalencia', password:'password', firstName:'Juan', lastName: 'Valencia', email: 'jd@jd.com',   role: 'admin'};

        Validator.isEmptyObject = jest.fn().mockReturnValue(false);
        Validator.isValidObject = jest.fn().mockReturnValue(true);
        Validator.isPropertyOf = jest.fn().mockReturnValue(true);
        sut.isEmailAvailable = jest.fn().mockReturnValue(true);
        mockRepo.getEmployeeByUniqueKey = jest.fn().mockImplementation((user: Employee) => {
            return new Promise<Employee>((resolve) => {
                resolve(user);
            });
        });

        mockRepo.update = jest.fn().mockImplementation((user: Employee) => {
            return new Promise<Employee>((resolve) => {
                resolve(user);
            });
        });



        // Act
        let result = await sut.updateEmployee(new Employee(1, 'jdvalencia', 'pw', 'juan','valencia','jd@j.com','user'));

        // Assert
        expect(result).toBeTruthy();

    });

    test('should throw BadRequestError when updateEmployee is given an invalid User', async () => {

        // Arrange
        expect.assertions(1);
        


        Validator.isValidObject = jest.fn().mockReturnValue(true);
        Validator.isPropertyOf = jest.fn().mockReturnValue(true);

        mockRepo.getEmployeeByUniqueKey = jest.fn().mockImplementation((user: Employee) => {
            return new Promise<Employee>((resolve) => {
                resolve(user);
            });
        });

        mockRepo.update = jest.fn().mockImplementation((user: Employee) => {
            return new Promise<Employee>((resolve) => {
                resolve(user);
            });
        });

        // Act
        try{
            await sut.updateEmployee(new Employee(1, '', '', '','','',''));
        }
        catch(e){
            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

        

    });

    test('should throw BadRequestError when updateEmployee is given an invalid a known Employee', async () => {

        // Arrange
        expect.assertions(1);
        

        //Object.keys = jest.fn().mockImplementation(() => { return ['id']});
        Validator.isValidObject = jest.fn().mockReturnValue(false);
        Validator.isPropertyOf = jest.fn().mockReturnValue(false);

        mockRepo.getEmployeeByUniqueKey = jest.fn().mockImplementation((user: Employee) => {
            return new Promise<Employee>((resolve) => {
                resolve(user);
            });
        });

        mockRepo.update = jest.fn().mockImplementation((user: Employee) => {
            return new Promise<Employee>((resolve) => {
                resolve(user);
            });
        });

        // Act
        try{
            await sut.updateEmployee(new Employee(1, 'jdvalencia', '', '','','',''));
        }
        catch(e){
            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

        

    });

    test('should resolve true when deletedById is given a valid a known id', async () => {

        // Arrange
        expect.assertions(1);
        

        //Object.keys = jest.fn().mockImplementation(() => { return ['id']});
        Validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((id: number)=> {
            return new Promise<Employee>((resolve) => {
                resolve(mockUsers[id - 1]);
            });
        });

        Validator.isEmptyObject = jest.fn().mockReturnValue(true);

        mockRepo.deleteById = jest.fn().mockImplementation(() => {
            return new Promise<boolean>((resolve) => {
                resolve(true);
            });
        });

        // Act
        let result = await sut.deleteById(1);

        // Assert
        expect(result).toBeTruthy();

    });

    test('should throw BadRequestError when deletedById is given an invalid id', async () => {

        // Arrange
        expect.assertions(1);
        

        //Object.keys = jest.fn().mockImplementation(() => { return ['id']});
        Validator.isValidId = jest.fn().mockReturnValue(false);

        mockRepo.getById = jest.fn().mockImplementation((id: number)=> {
            return new Promise<Employee>((resolve) => {
                resolve(mockUsers[id - 1]);
            });
        });

        Validator.isEmptyObject = jest.fn().mockReturnValue(true);

        mockRepo.deleteById = jest.fn().mockImplementation(() => {
            return new Promise<boolean>((resolve) => {
                resolve(true);
            });
        });

        // Act
        try{
            await sut.deleteById(0);
        }
        catch (e) {
            expect(e instanceof BadRequestError).toBe(true);
        }
        // Assert
        

    });

    test('should throw ResourceNotFoundError when deletedById is given a valid id ', async () => {

        // Arrange
        expect.assertions(1);
        
        // Act
        try{
        
            Validator.isValidId = jest.fn().mockReturnValue(true);

            mockRepo.getById = jest.fn().mockImplementation(()=> {
                return new Promise<Employee>((resolve) => {
                    resolve({}as Employee);
                });
            });

            Validator.isEmptyObject = jest.fn().mockReturnValue(false);

            // mockRepo.deleteById = jest.fn().mockImplementation((id: number) => {
            //     return new Promise<boolean>((resolve) => {
            //         resolve(true);
            //     });
            // });
            await sut.deleteById(5);
        }
        catch (e) {
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }
        // Assert
        

    });

});