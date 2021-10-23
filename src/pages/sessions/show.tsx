import {
    Show,
    useShow,
    Typography,
    Tag,
    IResourceComponentsProps,
    MarkdownField,
    useOne,
    DateField,
} from "@pankod/refine";


const { Title, Text } = Typography;

export const SessionShow: React.FC<IResourceComponentsProps> = () => {
    const { queryResult } = useShow<ISession>();
    const { data, isLoading } = queryResult;
    const record = data?.data;


    var { data: courseData, } = useOne<ICourse>({
        resource: "courses",
        id: record?.courseId ? record.courseId : "",
    });


    return (
        <Show isLoading={isLoading}>
            <Title level={5}>Course Name</Title>
            <Text>{courseData?.data.title}</Text>

            <Title level={5}>Status</Title>
            <Text>
                <Tag>{record?.status}</Tag>
            </Text>

            <Title level={5}>Teacher</Title>
            <Text>{record?.teacher}</Text>

            <Title level={5}>Start Date</Title>
            <DateField value={record?.startDate} />

            <Title level={5}>End Date</Title>
            <DateField value={record?.endDate} />

            <Title level={5}>Quota</Title>
            <Text>{record?.quota}</Text>

            <Title level={5}>Payment Amount</Title>
            <Text>{record?.paymentAmount}&#8378;</Text>

            <Title level={5}>Description</Title>
            <MarkdownField value={record?.description} />
        </Show>
    );
};
