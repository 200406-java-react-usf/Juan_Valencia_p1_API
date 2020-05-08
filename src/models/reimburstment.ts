export class Reimburstment {
    reimId: number;
    amount: number;
    submitted: Date;
    resolved: Date;
    description: string;
    receipt: Blob;
    authorId: number;
    resolverId: number;
    status: string;
    reimType: string;
}