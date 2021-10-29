import {
    Show,
    useShow,
    Typography,
    Tag,
    IResourceComponentsProps,
    useOne,
    DateField,
} from "@pankod/refine";
import MLTextHelper from "helpers/MLHelper/MLHelper";
import { weekDays } from "interfaces/lists";


const { Title, Text } = Typography;

export const SessionShow: React.FC<IResourceComponentsProps> = () => {
    const { queryResult } = useShow<ISession>();
    const { data, isLoading } = queryResult;
    const record = data?.data;


    var { data: workshopData, } = useOne<IWorkshop>({
        resource: "workshops",
        id: record?.workshopId ? record.workshopId : "",
    });

    return (
        <Show isLoading={isLoading}>
            <Title level={5}>{MLTextHelper("00012")}</Title>
            <Text>{workshopData?.data.title}</Text>

            <Title level={5}>{MLTextHelper("00009")}</Title>
            <Text>
                <Tag>{record?.status}</Tag>
            </Text>

            <Title level={5}>{MLTextHelper("00013")}</Title>
            <Text>{record?.teacher}</Text>

            <Title level={5}>{MLTextHelper("00014")}</Title>
            <DateField value={record?.period[0]} /> - <DateField value={record?.period[1]} />

            <Title level={5}>{MLTextHelper("00015")}</Title>
            <Text>{weekDays[record?.dayTime?.day as number]}</Text> <Text>{record?.dayTime?.time?.[0]}</Text> - <Text>{record?.dayTime?.time?.[1]}</Text>

            <Title level={5}>{MLTextHelper("00016")}</Title>
            <Text>{record?.quota}</Text>

            <Title level={5}>{MLTextHelper("00017")}</Title>
            <Text>{record?.paymentAmount}&#8378;</Text>

        </Show>
    );
};
