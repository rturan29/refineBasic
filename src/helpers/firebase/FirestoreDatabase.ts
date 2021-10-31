import { Firestore, getDocs, getFirestore, collection, addDoc, doc, getDoc, updateDoc, deleteDoc, where, query, CollectionReference, DocumentData, Query, orderBy } from "firebase/firestore";
import { ICreateData, IDeleteData, IDeleteManyData, IGetList, IGetMany, IGetOne, IUpdateData, IUpdateManyData } from "interfaces/IDataBase";
import { BaseDatabase } from "./Database";
import { requestPayloadFactory } from "./requestPayloadFactory";
import { responsePayloadFactory } from "./responsePayloadFactory";
import { CrudOperators } from "@pankod/refine";


export class FirestoreDatabase extends BaseDatabase {
    database: Firestore;
    constructor () {
        super();
        this.database = getFirestore();

        this.getCollectionRef = this.getCollectionRef.bind(this);
        this.getFilterQuery = this.getFilterQuery.bind(this);
    }

    getCollectionRef(resource: string) {
        return collection(this.database, resource);
    }

    getFilterQuery({ resource, sort, filters }: IGetList): (CollectionReference<DocumentData> | Query<DocumentData>) {
        const ref = this.getCollectionRef(resource);
        let queryFilter = filters?.map(filter => {
            const operator = getFilterOperator(filter.operator);
            return where(filter.field, operator, filter.value);
        });
        let querySorter = sort?.map(sorter => orderBy(sorter.field, sorter.order));

        if (queryFilter?.length && querySorter?.length) {
            return query(ref, ...queryFilter, ...querySorter);
        } else if (queryFilter?.length) {
            return query(ref, ...queryFilter);
        } else if (querySorter?.length) {
            return query(ref, ...querySorter);
        }
        else {
            return ref;
        }
    }

    async createData<TVariables = {}>(args: ICreateData<TVariables>): Promise<any> {
        try {
            const ref = this.getCollectionRef(args.resource);

            const payload = requestPayloadFactory(args.resource, args.variables);

            const docRef = await addDoc(ref, payload);

            let data = {
                id: docRef.id,
                ...payload
            };

            return { data };
        } catch (error) {
            Promise.reject(error);
        }
    }

    async createManyData<TVariables = {}>(args: ICreateData<TVariables>): Promise<any> {
        try {
            const ref = this.getCollectionRef(args.resource);

            const payload = requestPayloadFactory(args.resource, args.variables);

            const docRef = await addDoc(ref, payload);

            await updateDoc(doc(this.database, args.resource, docRef.id), { id: docRef.id });

            let data = {
                id: docRef.id,
                ...payload
            };

            return { data };
        } catch (error) {
            Promise.reject(error);
        }
    }

    async deleteData(args: IDeleteData): Promise<any> {
        try {

            const ref = doc(this.database, args.resource, args.id);

            await deleteDoc(ref);
        } catch (error) {
            Promise.reject(error);
        }
    }

    async deleteManyData(args: IDeleteManyData): Promise<any> {
        try {
            args.ids.forEach(async id => {
                const ref = doc(this.database, args.resource, id);
                await deleteDoc(ref);
            });
        } catch (error) {
            Promise.reject(error);
        }
    }

    async getList(args: IGetList): Promise<any> {
        try {
            const ref = this.getFilterQuery(args);
            let data: any[] = [];

            const querySnapshot = await getDocs(ref);

            querySnapshot.forEach(document => {
                data.push(responsePayloadFactory(args.resource, {
                    id: document.id,
                    ...document.data()
                }));
            });
            return { data };

        } catch (error) {
            Promise.reject(error);
        }
    }

    async getMany(args: IGetMany): Promise<any> {
        try {
            const ref = this.getCollectionRef(args.resource);
            let data: any[] = [];

            const querySnapshot = await getDocs(ref);

            querySnapshot.forEach(document => {
                if (args.ids.includes(document.id)) {
                    data.push({
                        id: document.id,
                        ...document.data()
                    });
                }
            });
            return { data };


        } catch (error) {
            Promise.reject(error);
        }
    }

    async getOne(args: IGetOne): Promise<any> {
        try {
            if (args.resource && args.id) {
                const docRef = doc(this.database, args.resource, args.id);
                const docSnap = await getDoc(docRef);
                const data = { ...responsePayloadFactory(args.resource, docSnap.data()), id: docSnap.id };
                return { data };
            }

        } catch (error: any) {
            Promise.reject(error);
        }
    }

    async updateData<TVariables = {}>(args: IUpdateData<TVariables>): Promise<any> {
        try {
            if (args.id && args.resource) {
                var ref = doc(this.database, args.resource, args.id);
                await updateDoc(ref, args.variables);
            }
            return { data: args.variables };
        } catch (error) {
            Promise.reject(error);
        }
    }
    async updateManyData<TVariables = {}>(args: IUpdateManyData<TVariables>): Promise<any> {
        try {
            args.ids.forEach(async id => {
                let ref = doc(this.database, args.resource, id);
                await updateDoc(ref, args.variables)
            });

        } catch (error) {
            Promise.reject(error);
        }
    }
}


export const firestoreDatabase = new FirestoreDatabase();

function getFilterOperator(operator: CrudOperators) {
    switch (operator) {
        case "lt":
            return "<";
        case "lte":
            return "<=";

        case "gt":
            return ">";
        case "gte":
            return ">=";

        case "eq":
            return "==";
        case "ne":
            return "!=";

        case "nin":
            return "not-in";

        case "in":
        default:
            return "in";
    }
}