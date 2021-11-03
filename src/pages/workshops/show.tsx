import {
    Show,
    useShow,
    Typography,
    Tag,
    IResourceComponentsProps,
    MarkdownField,
    usePermissions,
} from "@pankod/refine";
import MLTextHelper from "helpers/MLHelper/MLHelper";


const { Title, Text } = Typography;

export const WorkshopShow: React.FC<IResourceComponentsProps> = () => {
    const { queryResult } = useShow<IWorkshop>();
    const { data: permissionsData } = usePermissions();
    const isAdmin = permissionsData?.role === "admin";

    const { data, isLoading } = queryResult;
    const record = data?.data;

    return (
        <Show isLoading={isLoading}>
            <Title level={5}>{MLTextHelper("00006")}</Title>
            <Text>{record?.title}</Text>

            <Title level={5}>{MLTextHelper("00007")}</Title>
            <Text>{record?.category}</Text>

            <Title level={5}>{MLTextHelper("00008")}</Title>
            <Text>
                <Tag>{record?.type}</Tag>
            </Text>

            {isAdmin
                ? <>
                    <Title level={5}>{MLTextHelper("00009")}</Title>
                    <Text>
                        <Tag>{record?.status}</Tag>
                    </Text>
                </> : null}


            <Title level={5}>{MLTextHelper("00010")}</Title>
            <MarkdownField value={record?.description} />
        </Show>
    );
};
