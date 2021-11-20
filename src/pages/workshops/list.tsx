import { IResourceComponentsProps, useModalForm, Form, Modal, useNavigation, Authenticated, useOne, Typography } from "@pankod/refine";
import MLTextHelper from "helpers/MLHelper/MLHelper";
import { ISession, IWorkshopCategory } from "interfaces";
import { WorkshopCreate } from ".";
import PageContent from "./components/PageContent";
import { getCategoryList } from "./helpers";
const { Title } = Typography;

export const WorkshopList: React.FC<IResourceComponentsProps> = () => {
    const { show: showWorkshop } = useNavigation();

    const { modalProps, formProps, show: showCreate, close } = useModalForm<ISession>({ action: "create", redirect: "list" });

    const categoryQueryResult = useOne<{ categories: { [key: string]: IWorkshopCategory; }; }>({ resource: "categories", id: "category", });

    const categoryList = getCategoryList(categoryQueryResult);

    return (
        <Authenticated>
            <Title level={2} >{MLTextHelper("00040")}</Title>
            {
                categoryList.map(category => (<PageContent key={category.name} category={category} showCreate={showCreate} showWorkshop={showWorkshop} />))
            }

            <Modal {...modalProps}>
                <Form {...formProps} layout="vertical">
                    <WorkshopCreate close={close} />
                </Form>
            </Modal>
        </Authenticated>
    );
};
