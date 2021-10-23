import {
    Show,
    useShow,
    Typography,
    Tag,
    IResourceComponentsProps,
    MarkdownField,
} from "@pankod/refine";


const { Title, Text } = Typography;

export const CourseShow: React.FC<IResourceComponentsProps> = () => {
    const { queryResult } = useShow<ICourse>();
    const { data, isLoading } = queryResult;
    const record = data?.data;

    return (
        <Show isLoading={isLoading}>
            <Title level={5}>Title</Title>
            <Text>{record?.title}</Text>

            <Title level={5}>Status</Title>
            <Text>
                <Tag>{record?.status}</Tag>
            </Text>

            <Title level={5}>Category</Title>
            <Text>{record?.category}</Text>

            <Title level={5}>Content</Title>
            <MarkdownField value={record?.description} />
        </Show>
    );
};
