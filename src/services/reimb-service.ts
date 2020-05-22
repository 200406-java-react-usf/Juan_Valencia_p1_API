import { Reimbursement } from "../models/reimbursement";
import { ReimbRepository } from "../repos/reimb-repo";
import { isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject } from "../util/validator";
import { 
    BadRequestError, 
    ResourceNotFoundError,
    ResourcePersistenceError, 
    AuthenticationError 
} from "../errors/errors";


export class ReimbService {

    constructor(private reimbRepo: ReimbRepository) {
        this.reimbRepo = reimbRepo;
    }

    async getAllReimb(): Promise<Reimbursement[]> {

        let reimbs = await this.reimbRepo.getAll();

        if (reimbs.length == 0) {
            throw new ResourceNotFoundError();
        }

        return reimbs;


    }

    // async getReimbByStatus(status: string): Promise<Reimbursement[]> {
        
    //     if(!['Pending','Approved','Denied'].includes(status)){
    //         throw new BadRequestError();
    //     }

    //     let reimbs = await this.reimbRepo.getReimbsByStatus(status);

    //     if(reimbs.length === 0){
    //         throw new ResourceNotFoundError();
    //     }

    //     return reimbs;
    // }

    // async getReimbByType(type: string): Promise<Reimbursement[]> {

    //     if(!isValidStrings(type)){
    //         throw new BadRequestError();
    //     }

    //     let reimbTypes = await this.reimbRepo.getTypes();
    //     if(!reimbTypes.includes(type)){
    //         throw new BadRequestError('Type not valid');
    //     }

    //     let reimbs = await this.reimbRepo.getReimbsByType(type);

    //     if(reimbs.length === 0){
    //         throw new ResourceNotFoundError();
    //     }

    //     return reimbs;
    // }

    async getReimbById(id: number): Promise<Reimbursement> {
        
        if (!isValidId(id)) {
            throw new BadRequestError();
        }

        let reimb = await this.reimbRepo.getById(id);

        if (isEmptyObject(reimb)) {
            throw new ResourceNotFoundError();
        }

        return reimb;
    }

    async getReimbByAuthorId(id: number): Promise<Reimbursement[]> {
        
        if (!isValidId(id)) {
            throw new BadRequestError();
        }

        let reimb = await this.reimbRepo.getByAuthorId(id);

        if (isEmptyObject(reimb)) {
            throw new ResourceNotFoundError();
        }

        return reimb;
    }

    async addNewReimb(newReimb: Reimbursement): Promise<Reimbursement> {

        if (!isValidObject(newReimb)) {
            throw new BadRequestError('Invalid property values found in provided user.');
        }

        if(newReimb.amount <= 0){
            throw new BadRequestError('Invalid amount value found.');
        }

        if(!isValidStrings(newReimb.description)){
            throw new BadRequestError('Invalid description value found.')
        }

        //Getting the author id
        let authorId = await this.reimbRepo.getByUsername(newReimb.author);

        if(!isValidId(authorId)){
            throw new ResourceNotFoundError('ID by username was not found');
        }

        let reimbTypes = await this.reimbRepo.getTypes();
        if(!reimbTypes.includes(newReimb.reimbType)){
            throw new BadRequestError('Type not valid');
        }
        
        newReimb.status = 'Pending';


        let persistedReimb = await this.reimbRepo.save(newReimb, authorId);

        return persistedReimb;

    }

    async updateReimb(updateReimb: Reimbursement): Promise<boolean> {

        if (!isValidObject(updateReimb)) {
            throw new BadRequestError('Invalid user provided (invalid values found).');
        }

        let queryKeys = Object.keys(updateReimb);
        if (!queryKeys.every(key => isPropertyOf(key, Reimbursement))) {
            throw new BadRequestError();
        }

        if(updateReimb.amount <= 0){
            throw new BadRequestError('You need to provide a positive non-zero value.')
        }

        if(!isValidStrings(updateReimb.description)){
            throw new BadRequestError('You need to provide a description.')
        }
        
        let reimbTypes = await this.reimbRepo.getTypes();
        if(!reimbTypes.includes(updateReimb.reimbType)){
            throw new BadRequestError('Type not valid');
        }

        let reimb = await this.reimbRepo.getById(updateReimb.reimbId);

        if(reimb.status !== 'Pending'){
            throw new ResourcePersistenceError('The Reimbursement was already processed.');
        }

        return await this.reimbRepo.update(updateReimb);
    }

    async resolveReimb(resolvedReimb: Reimbursement): Promise<boolean> {

        if(resolvedReimb.status === 'Pending'){
            throw new ResourcePersistenceError('Can only be updated to Denied or Approved');
        }

        if(!isValidStrings(resolvedReimb.status)){
            throw new BadRequestError('Invalid status input.');
        }

        if(resolvedReimb.status !== 'Approved' && resolvedReimb.status !== 'Denied'){
            throw new BadRequestError('Invalid status input.');
        }

        if(!isValidStrings(resolvedReimb.resolver)){
            throw new BadRequestError('Invalid username input.');
        }

        return await this.reimbRepo.resolve(resolvedReimb);

        return
    }

}