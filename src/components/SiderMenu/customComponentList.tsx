import { Icons } from "@pankod/refine";
import { IMenuItem } from "@pankod/refine/dist/interfaces";
import MLTextHelper from "helpers/MLHelper/MLHelper";

export const customComponentList: IMenuItem[] = [
    {
        name: MLTextHelper("00005"),
        key: "/update-user-data",
        icon: <Icons.UserAddOutlined />,
        route: "/update-user-data",
        label: MLTextHelper("00005")
    }
];

