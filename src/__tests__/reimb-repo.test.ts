//import * as mockIndex from '..';
import {connectionPool} from '..';
import * as mockMapper from '../util/result-set-mapper';
import { InternalServerError } from '../errors/errors';
import { Reimbursement } from '../models/reimbursement';
import { ReimbRepository } from '../repos/reimb-repo';

jest.mock('..', () => {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    };
});

jest.mock('../util/result-set-mapper', () => {
    return {
        mapReimbResultSet: jest.fn()
    };
});

describe('reimbRepo', () => {

    let sut = new ReimbRepository();
    let mockConnect = connectionPool.connect;

    beforeEach(() => {

        //@ts-ignore
        (mockConnect as jest.Mock).mockClear().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return {
                        rows: [
                            {
                                reimbId: 1,
                                amount: 1000,
                                submitted: new Date('01-01-1990'),
                                resolved: new Date('01-01-1990'),
                                description: 'desc text',
                                author: 'jdvalencia',
                                resolver: 'wsingleton',
                                status: 'Approved',
                                reimbType: 'OTHER'
                            }
                        ]
                    };
                }), 
                release: jest.fn()
            };
        });
        
        (mockMapper.mapReimbResultSet as jest.Mock).mockClear();
    });

    test('should resolve to an array of Users when getAll retrieves records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();

        let mockUser = new Reimbursement(1, 1000,  new Date('01-01-1990'),  new Date('01-01-1990'),'text','user1','user2','Pending','OTHER');
        (mockMapper.mapReimbResultSet as jest.Mock).mockReturnValue(mockUser);

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

        let mockUser = new Reimbursement(1, 1000,  new Date('01-01-1990'),  new Date('01-01-1990'),'text','user1','user2','Pending','OTHER');;
        (mockMapper.mapReimbResultSet as jest.Mock).mockReturnValue(mockUser);

        // Act
        let result = await sut.getById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Reimbursement).toBe(true);

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
        expect(result instanceof Reimbursement).toBe(true);

    });

    test('should throw InternalServerError when getById() is called but query is unsuccesful', async () => {

        // Arrange
        expect.hasAssertions();
        let mockUser = new Reimbursement(1, 1000,  new Date('01-01-1990'),  new Date('01-01-1990'),'text','user1','user2','Pending','OTHER');;
        (mockConnect as jest.Mock).mockImplementation( () => {
            return {
                query: jest.fn().mockImplementation( () => { return false; }),
                release: jest.fn()
            };
        });

        // Act
        try {
            await sut.getById(mockUser.reimbId);
        } catch (e) {
            // Assert
            expect(e instanceof InternalServerError).toBe(true);
        }
    });


    test('should resolve to a User object when save persists a record to the data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockUser = new Reimbursement(1, 1000,  new Date('01-01-1990'),  new Date('01-01-1990'),'text','user1','user2','Pending','OTHER');;
        (mockMapper.mapReimbResultSet as jest.Mock).mockReturnValue(mockUser);

        // Act
        let result = await sut.save(mockUser,1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Reimbursement).toBe(true);

    });

    test('should resolve to an empty array when save persists a record to the data source', async () => {

        // Arrange
        expect.hasAssertions();
        let mockUser = new Reimbursement(1, 1000,  new Date('01-01-1990'),  new Date('01-01-1990'),'text','user1','user2','Pending','OTHER');;
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] }; }), 
                release: jest.fn()
            };
        });

        // Act
        let result = await sut.save(mockUser,1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Reimbursement).toBe(true);

    });

    test('should throw InternalServerError when save fails to persist a record on the data source', async () => {

        // Arrange
        expect.hasAssertions();
        try{
            let mockUser = new Reimbursement(1, 1000,  new Date('01-01-1990'),  new Date('01-01-1990'),'text','user1','user2','Pending','OTHER');;
            (mockConnect as jest.Mock).mockImplementation( () => {
                return {
                    query: jest.fn().mockImplementation( () => { return false; }),
                    release: jest.fn()
                };
            });

            // Act
            await sut.save(mockUser,1);
        }
        catch(e){
            expect(e instanceof InternalServerError).toBe(true);
        }
        

        // Assert
        

    });

    test('should resolve to true when update updates a record on the data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockUser = new Reimbursement(1, 1000,  new Date('01-01-1990'),  new Date('01-01-1990'),'text','user1','user2','Pending','OTHER');;
        (mockMapper.mapReimbResultSet as jest.Mock).mockReturnValue(true);

        // Act
        let result = await sut.update(mockUser);

        // Assert
        expect(result).toBeTruthy();
        expect(result).toBe(true);

    });

    test('should throw InternalServerError when update fails to update a record on the data source', async () => {

        // Arrange
        expect.hasAssertions();
        try{
            let mockUser = new Reimbursement(1, 1000,  new Date('01-01-1990'),  new Date('01-01-1990'),'text','user1','user2','Pending','OTHER');;
            (mockConnect as jest.Mock).mockImplementation( () => {
                return {
                    query: jest.fn().mockImplementation( () => { throw Error }),
                    release: jest.fn()
                };
            });

            // Act
            await sut.update(mockUser);
        }
        catch(e){
            expect(e instanceof InternalServerError).toBe(true);
        }
        

        // Assert
        

    });

    test('should resolve to a User object when getByAuthorId retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockUser = new Reimbursement(1, 1000,  new Date('01-01-1990'),  new Date('01-01-1990'),'text','user1','user2','Pending','OTHER');;
        (mockMapper.mapReimbResultSet as jest.Mock).mockReturnValue(mockUser);

        // Act
        let result = await sut.getByAuthorId(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);

    });

    test('should resolve to an empty array when getByAuthorId retrieves a record from data source', async () => {

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
        expect(result instanceof Reimbursement).toBe(true);

    });

    test('should throw InternalServerError when getByAuthorId() is called but query is unsuccesful', async () => {

        // Arrange
        expect.hasAssertions();
        let mockUser = new Reimbursement(1, 1000,  new Date('01-01-1990'),  new Date('01-01-1990'),'text','user1','user2','Pending','OTHER');;
        (mockConnect as jest.Mock).mockImplementation( () => {
            return {
                query: jest.fn().mockImplementation( () => { return false; }),
                release: jest.fn()
            };
        });

        // Act
        try {
            await sut.getById(mockUser.reimbId);
        } catch (e) {
            // Assert
            expect(e instanceof InternalServerError).toBe(true);
        }
    });

    test('should resolve to true when resolve updates a record on the data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockUser = new Reimbursement(1, 1000,  new Date('01-01-1990'),  new Date('01-01-1990'),'text','user1','user2','Pending','OTHER');;
        (mockMapper.mapReimbResultSet as jest.Mock).mockReturnValue(true);

        // Act
        let result = await sut.resolve(mockUser);

        // Assert
        expect(result).toBeTruthy();
        expect(result).toBe(true);

    });

    test('should throw InternalServerError when resolve fails to update a record on the data source', async () => {

        // Arrange
        expect.hasAssertions();
        try{
            let mockUser = new Reimbursement(1, 1000,  new Date('01-01-1990'),  new Date('01-01-1990'),'text','user1','user2','Pending','OTHER');;
            (mockConnect as jest.Mock).mockImplementation( () => {
                return {
                    query: jest.fn().mockImplementation( () => { throw Error }),
                    release: jest.fn()
                };
            });

            // Act
            await sut.resolve(mockUser);
        }
        catch(e){
            expect(e instanceof InternalServerError).toBe(true);
        }
        

        // Assert
        

    });
});