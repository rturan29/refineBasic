import { CrudFilter } from "@pankod/refine";
import { IWorkshopCategory } from "interfaces";


export function getPermanentFilter(isAdmin: boolean, categoryName: string): CrudFilter[] {

    const permanentFilter: Array<CrudFilter> = [
        {
            field: "category",
            operator: "eq",
            value: categoryName
        }
    ];

    if (!isAdmin) {
        permanentFilter.push({
            field: "status",
            operator: "eq",
            value: "published"
        });
    }

    return permanentFilter;

}

export function getCategoryList(queryResult: any): Array<IWorkshopCategory> {
    const categories = queryResult.data?.data?.categories;

    const categoryList: Array<IWorkshopCategory> = categories ? Object.values(categories) : [];

    categoryList.sort((a, b) => a.order - b.order);

    return categoryList;
}
