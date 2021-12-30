import { useShow, Typography, Tag, IResourceComponentsProps, MarkdownField, usePermissions, Authenticated, } from "@pankod/refine";
import MLTextHelper from "helpers/MLHelper/MLHelper";
import { IWorkshop } from "interfaces";

const { Title, Text } = Typography;

interface WorkshopShowProps extends IResourceComponentsProps {
    recordId: string;
}

export const WorkshopShow: React.FC<WorkshopShowProps> = ({ recordId }) => {
    const { queryResult } = useShow<IWorkshop>({ resource: "workshops", id: recordId });
    const isAdmin = usePermissions().data?.role === "admin";

    const { data } = queryResult;
    const record = data?.data;

    return (
        <Authenticated>
            <Title level={3}>{MLTextHelper("00062")}</Title>
            <Title level={5}>{MLTextHelper("00012")}</Title>
            <Text>{record?.title}</Text>

            {isAdmin
                ? <>
                    <Title level={5}>{MLTextHelper("00009")}</Title>
                    <Text>
                        <Tag>{record?.status}</Tag>
                    </Text>
                </> : null}


            <Title level={5}>{MLTextHelper("00010")}</Title>
            <MarkdownField value={record?.description} />
        </Authenticated>
    );
};
