/* eslint-disable eqeqeq */
import React, { useState } from "react";
import { IResourceComponentsProps, Authenticated, useOne, Typography, useModal } from "@pankod/refine";
import MLTextHelper from "helpers/MLHelper/MLHelper";
import { ISession, IWorkshop, IWorkshopCategory, TModalRole } from "interfaces";
import WorkshopModal from "./components/modal";
import PageContent from "./components/PageContent";
import { getCategoryList } from "./helpers";
const { Title } = Typography;

export const WorkshopList: React.FC<IResourceComponentsProps> = () => {

    const [modalRole, setModalRole] = useState("");
    const [currentRecord, setCurrentRecord] = useState<IWorkshop>();
    const [currentPlan, setCurrentPlan] = useState<ISession>();

    const { modalProps, show, close } = useModal();

    const categoryQueryResult = useOne<{ categories: { [key: string]: IWorkshopCategory; }; }>({ resource: "categories", id: "category", });

    const categoryList = getCategoryList(categoryQueryResult);

    function showModal({ role, record, plan }: { role: TModalRole, record?: IWorkshop, plan?: ISession; }) {
        setModalRole(role);
        if (record) {
            setCurrentRecord(record);
        }

        if (plan) {
            setCurrentPlan(plan);
        }

        setTimeout(() => {
            show();
        }, 500);
    }

    function renderPageContent(category: IWorkshopCategory) {
        return (<PageContent key={category.name} category={category} showModal={showModal} />);
    }

    return (
        <Authenticated>
            <Title level={2} >{MLTextHelper("00040")}</Title>
            {categoryList.map(renderPageContent)}

            <WorkshopModal
                currentPlan={currentPlan}
                setCurrentPlan={setCurrentPlan}
                setModalRole={setModalRole}
                showModal={showModal}
                modalProps={modalProps}
                modalRole={modalRole}
                close={close}
                currentRecord={currentRecord} />
        </Authenticated>
    );
};
