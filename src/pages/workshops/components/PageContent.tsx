/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { HistoryType, List, Table, Typography, usePermissions, useTable, useUpdate, } from '@pankod/refine';
import { getCurrentCulture, getMLText } from 'helpers/MLHelper/MLHelper';
import { IWorkshop, IWorkshopCategory } from 'interfaces';
import React, { useEffect, useState } from 'react';
import { getPermanentFilter } from '../helpers';
import getWorkshopColumns from './getWorkshopColumns';
import WorkshopDescription from './WorkshopDescription';
import Styles from "../assets/style.module.scss";
const { Title } = Typography;

type PageContentProps = React.PropsWithChildren<{
    showWorkshop: (resource: string, id: string, type?: HistoryType | undefined) => void;
    showCreate: () => void;
    category: IWorkshopCategory;
}>;

export default function PageContent({ showWorkshop, showCreate, category }: PageContentProps) {

    const isAdmin = usePermissions().data?.role === "admin";
    const [title, setTitle] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [statusList, setStatusList] = useState<Array<{ id: string, status: string; }>>([]);
    const [description, setDescription] = useState("");

    const { mutate, isLoading } = useUpdate();

    const workshopColumns = getWorkshopColumns({ isAdmin, showWorkshop, tableStatusList: statusList, handleStatusChange, isLoading });
    const { tableProps } = useTable<IWorkshop>({ permanentFilter: getPermanentFilter(isAdmin, category.name) });


    useEffect(() => {
        setTitle(getMLText(category.caption));
        setDescription(category.description);
    }, []);

    useEffect(() => {
        if (tableProps.dataSource) {
            setStatusList(tableProps.dataSource.map(({ id, status }) => ({ id, status })));
        }
    }, [tableProps.dataSource]);

    function handleSaveDescription() {
        mutate({
            resource: "categories", id: "category", values: {
                [`categories.${category.name}.description`]: description,
                [`categories.${category.name}.caption.${getCurrentCulture()}`]: title
            }
        });
        setIsEdit(false);
    }

    function handleStatusChange(id: string, newStatus: string) {
        const isValueChanged = statusList.find(status => status.id == id)?.status != newStatus;
        if (isValueChanged) {
            setStatusList(statusList.map(status => status.id == id ? ({ id, status: newStatus }) : status));
        }
        mutate({ resource: "workshops", id, values: { status: newStatus } });
    }

    function renderListTitle() {
        return isAdmin
            ? <Title
                className={isEdit ? Styles.categoryTitleEdit : ""}
                editable={
                    {
                        editing: isEdit,
                        onChange: setTitle,
                        onStart: () => setIsEdit(true),
                        icon: "",
                        onCancel: () => {
                            setTitle(getMLText(category.caption));
                            setIsEdit(false);
                        },
                        onEnd: handleSaveDescription
                    }}
                level={4}>
                {title}
            </Title>
            : <Title level={4}>{title}</Title>;
    }

    return (
        <List
            createButtonProps={{ onClick: () => showCreate(), }}
            canCreate={isAdmin}
            title={renderListTitle()}
        >
            <div>
                <WorkshopDescription
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    description={description}
                    setDescription={setDescription}
                    handleSaveDescription={handleSaveDescription}
                />
            </div>
            <Table columns={workshopColumns} {...tableProps} rowKey="id" />

        </List>
    );
}