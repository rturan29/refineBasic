import {
    Show,
    useShow,
    Typography,
    Tag,
    IResourceComponentsProps,
    useOne,
    DateField,
} from "@pankod/refine";
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
            <Title level={5}>Workshop Name</Title>
            <Text>{workshopData?.data.title}</Text>

            <Title level={5}>Status</Title>
            <Text>
                <Tag>{record?.status}</Tag>
            </Text>

            <Title level={5}>Teacher</Title>
            <Text>{record?.teacher}</Text>

            <Title level={5}>Period</Title>
            <DateField value={record?.period[0]} /> - <DateField value={record?.period[1]} />

            <Title level={5}>Day Time</Title>
            <Text>{weekDays[record?.dayTime?.day as number]}</Text> <Text>{record?.dayTime?.time?.[0]}</Text> - <Text>{record?.dayTime?.time?.[1]}</Text>

            <Title level={5}>Quota</Title>
            <Text>{record?.quota}</Text>

            <Title level={5}>Payment Amount</Title>
            <Text>{record?.paymentAmount}&#8378;</Text>

        </Show>
    );
};
