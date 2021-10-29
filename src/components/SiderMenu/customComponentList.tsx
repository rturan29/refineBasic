import { Icons } from "@pankod/refine";
import MLTextHelper from "helpers/MLHelper/MLHelper";

export const customComponentList: ICustomComponentProperties[] = [
    {
        icon: <Icons.UserAddOutlined/>,
        route: "/update-user-data",
        label: MLTextHelper("00005")
    }
];

