export class Principal {
    userId: number;
    username: string;
    role: string;

    constructor(id: number, un: string, role: string) {
        this.userId = id;
        this.username = un;
        this.role = role;
    }
}
