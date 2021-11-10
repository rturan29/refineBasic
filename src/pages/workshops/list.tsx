import {
    List, Table, useTable, IResourceComponentsProps, useModalForm,
    Form, Modal, usePermissions, CrudFilter, useNavigation, Authenticated
} from "@pankod/refine";
import { IWorkshop, ISession } from "interfaces";
import { WorkshopCreate } from ".";
import getWorkshopColumns from "./getWorkshopColumns";

export const WorkshopList: React.FC<IResourceComponentsProps> = () => {
    const { show: showWorkshop } = useNavigation();
    const { data: permissionsData } = usePermissions();
    const isAdmin = permissionsData?.role === "admin";

    const permanentFilter: CrudFilter[] = [];
    if (!isAdmin) {
        permanentFilter.push({
            field: "status",
            operator: "eq",
            value: "published"
        });
    }
    const { tableProps } = useTable<IWorkshop>({ permanentFilter });
    const { modalProps, formProps, show, close } = useModalForm<ISession>({ action: "create", redirect: "list" });

    const workshopColumns = getWorkshopColumns({ isAdmin, showWorkshop });

    return (
        <Authenticated>
            <List
                createButtonProps={{ onClick: () => show(), }}
                canCreate={isAdmin}
            >
                <Table columns={workshopColumns} {...tableProps} rowKey="id" />
            </List>
            <Modal {...modalProps}>
                <Form {...formProps} layout="vertical">
                    <WorkshopCreate close={close} />
                </Form>
            </Modal>
        </Authenticated>
    );
};
