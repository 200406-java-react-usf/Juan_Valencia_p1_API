export class Reimbursement {
    reimbId: number;
    amount: number;
    submitted: Date;
    resolved: Date;
    description: string;
    author: string;
    resolver: string;
    status: string;
    reimbType: string;

    constructor(id: number, amnt: number, subm: Date, resolved: Date, desc: string, author: string, resolver: string, status: string, reimtype: string){
        this.reimbId = id;
        this.amount = amnt;
        this.submitted = subm;
        this.resolved = resolved;
        this.description = desc;
        this.author = author;
        this.resolver = resolver;
        this.status = status;
        this.reimbType = reimtype; 
    }
}