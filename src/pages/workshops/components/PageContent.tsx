import { HistoryType, List, Table, Typography, useOne, usePermissions, useTable, } from '@pankod/refine';
import MLTextHelper from 'helpers/MLHelper/MLHelper';
import { IWorkshop, IWorkshopCategory } from 'interfaces';
import React from 'react';
import { getPermanentFilter, getWorkshopLabel } from '../helpers';
import getWorkshopColumns from './getWorkshopColumns';
import WorkshopDescription from './WorkshopDescription';

const { Title } = Typography;

type PageContentProps = React.PropsWithChildren<{
    showWorkshop: (resource: string, id: string, type?: HistoryType | undefined) => void;
    showCreate: () => void;
}>;

export default function PageContent({ showWorkshop, showCreate }: PageContentProps) {

    const isAdmin = usePermissions().data?.role === "admin";

    const workshopColumns = getWorkshopColumns({ isAdmin, showWorkshop });

    const { tableProps } = useTable<IWorkshop>({ permanentFilter: getPermanentFilter(isAdmin) });

    const categoryQueryResult = useOne<{ categoryList: IWorkshopCategory[]; }>({ resource: "categories", id: "category", });

    const workshopCategories = categoryQueryResult.data?.data?.categoryList;

    return (
        <List
            createButtonProps={{ onClick: () => showCreate(), }}
            canCreate={isAdmin}
            title={MLTextHelper("00040")}
        >
            {workshopCategories?.map(workshop => (
                <div key={workshop.name}>
                    <div>
                        <Title level={5}>{getWorkshopLabel(workshop.name)}</Title>
                        <WorkshopDescription workshop={workshop} />
                    </div>
                    <Table columns={workshopColumns} {...tableProps} rowKey="id" />
                </div> || null
            ))}
        </List>
    );
}

