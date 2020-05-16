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

    async getReimbByStatus(status: string): Promise<Reimbursement[]> {
        
        if(!['Pending','Approved','Denied'].includes(status)){
            throw new BadRequestError();
        }

        let reimbs = await this.reimbRepo.getReimbsByStatus(status);

        if(reimbs.length === 0){
            throw new ResourceNotFoundError();
        }

        return reimbs;
    }

    async getReimbByType(type: string): Promise<Reimbursement[]> {

        if(!isValidStrings(type)){
            throw new BadRequestError();
        }

        let reimbTypes = await this.reimbRepo.getTypes();
        if(!reimbTypes.includes(type)){
            throw new BadRequestError('Type not valid');
        }

        let reimbs = await this.reimbRepo.getReimbsByType(type);

        if(reimbs.length === 0){
            throw new ResourceNotFoundError();
        }

        return reimbs;
    }

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

    async getReimbByAuthorId(id: number): Promise<Reimbursement> {
        
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
        return
    }

    async updateReimb(updateReimb: Reimbursement): Promise<boolean> {
        return
    }

    async resolveReimb(resolvedReimb: Reimbursement): Promise<boolean> {
        return
    }

}