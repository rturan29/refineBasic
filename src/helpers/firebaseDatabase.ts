
import { Database, get, getDatabase, ref, remove, set } from "firebase/database";
import { ICreateData, IDeleteData, IDeleteManyData, IGetList, IGetMany, IGetOne, IUpdateData, IUpdateManyData } from "interfaces/IDataBase";
import { BaseDatabase } from "./Database";

import { v4 as uuidv4 } from 'uuid';
import { requestPayloadFactory } from "./requestPayloadFactory";
import { responsePayloadFactory } from "./responsePayloadFactory";
import firebaseApp from "./firebaseConfig";


export class FirebaseDatabase extends BaseDatabase {
    database: Database;
    constructor () {
        super();
        this.database = getDatabase(firebaseApp);
        this.getRef = this.getRef.bind(this);
    }

    getRef(url: string) {
        return ref(this.database, url);
    }

    async createData<TVariables = {}>(args: ICreateData<TVariables>): Promise<any> {
        try {
            const uuid = uuidv4();
            const databaseRef = this.getRef(`${args.resource}/${uuid}`);
            const payload = {
                ...args.variables,
                id: uuid,
            };
            console.log(requestPayloadFactory(args.resource, payload));
            await set(databaseRef, requestPayloadFactory(args.resource, payload));

            return { data: payload };
        } catch (error) {
            console.log(error);
        }
    }

    async createManyData<TVariables = {}>(args: ICreateData<TVariables>): Promise<any> {
        try {
            const uuid = uuidv4();
            const databaseRef = this.getRef(`${args.resource}/${uuid}`);
            const payload = {
                ...args.variables,
                id: uuid,
            };
            await set(databaseRef, requestPayloadFactory(args.resource, payload));

            return { data: payload };
        } catch (error) {
            console.log(error);
        }
    }

    async deleteData(args: IDeleteData): Promise<any> {
        try {
            const databaseRef = this.getRef(`${args.resource}/${args.id}`);
            await remove(databaseRef);
        } catch (error) {
            console.log(error);
        }
    }

    async deleteManyData(args: IDeleteManyData): Promise<any> {
        try {
            args.ids.forEach(async id => {
                const databaseRef = this.getRef(`${args.resource}/${id}`);
                await remove(databaseRef);
            });
        } catch (error) {
            console.log(error);
        }
    }

    async getList(args: IGetList): Promise<any> {
        // const { resource, pagination, sort, filters, metaData } = args;
        try {
            const databaseRef = this.getRef(args.resource);

            let snapshot = await get(databaseRef);
            console.log("list", snapshot.val());
            console.log("args", args);
            if (snapshot?.exists()) {
                let data = Object.values(snapshot.val());
                data = data.map(item => responsePayloadFactory(args.resource, item));
                console.log("ListData", data);
                return { data };
            } else {
                Promise.reject();
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getMany(args: IGetMany): Promise<any> {
        try {
            let { resource, ids } = args;
            const databaseRef = this.getRef(resource);

            let snapshot = await get(databaseRef);
            console.log("getMany", snapshot.val());
            console.log("args", args);
            if (snapshot?.exists()) {
                let data = ids.filter((item, i) => ids.indexOf(item) === i)?.map(id => snapshot.val()?.[id]);
                return { data };
            } else {
                Promise.reject();
            }

        } catch (error) {
            console.log(error);
        }
    }

    async getOne(args: IGetOne): Promise<any> {
        try {
            const databaseRef = this.getRef(args.resource);

            let snapshot = await get(databaseRef);
            console.log("getOne", snapshot.val());
            console.log("args", args);
            if (snapshot?.exists()) {
                let data = responsePayloadFactory(args.resource, snapshot.val()?.[args.id]);
                console.log("oneData", data);
                return { data };
            } else {
                Promise.reject("");
            }
        } catch (error: any) {
            console.log(error);
            Promise.reject(error);
        }
    }

    async updateData<TVariables = {}>(args: IUpdateData<TVariables>): Promise<any> {
        try {
            let url: string;
            if (args.resource.startsWith("custom")) {
                url = args.resource.split(":")[1];
            } else {
                url = `${args.resource}/${args.id}`;
            }
            const databaseRef = this.getRef(url);

            await set(databaseRef, requestPayloadFactory(args.resource, args.variables));

            return { data: args.variables };
        } catch (error) {
            console.log(error);
            Promise.reject(error);
        }
    }
    async updateManyData<TVariables = {}>(args: IUpdateManyData<TVariables>): Promise<any> {
        try {
            args.ids.forEach(async id => {
                const databaseRef = this.getRef(`${args.resource}/${id}`);
                await set(databaseRef, args.variables);
            });

        } catch (error) {
            console.log(error);
            Promise.reject(error);
        }
    }
}


export const firebaseDatabase = new FirebaseDatabase();