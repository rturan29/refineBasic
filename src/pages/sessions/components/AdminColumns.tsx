/* eslint-disable eqeqeq */
import { Table, Radio, Space, TagField, FilterDropdown, NumberField, ShowButton, CreateButton, EditButton, DeleteButton } from '@pankod/refine';
import Admin from 'components/Admin';
import MLTextHelper from 'helpers/MLHelper/MLHelper';
import { ISession, workshopType } from 'interfaces';
import React from 'react';

type AdminColumnsProps = React.PropsWithChildren<{
    activeWorkshopType: workshopType;
    handleShowModal: any;
}>;

export default function AdminColumns({ activeWorkshopType, handleShowModal }: AdminColumnsProps) {

    function getGroupSessionColumns() {
        if (activeWorkshopType == "group") {
            return (
                <>
                    <Table.Column
                        dataIndex="quota"
                        title={MLTextHelper("00016")}
                        render={(value) => <NumberField value={value || 0} />}
                        sorter
                    />
                </>
            );
        }
    }

    function renderColumns() {
        return (
            <>
                <Table.Column
                    dataIndex="status"
                    title={MLTextHelper("00009")}
                    render={value => <TagField value={value}></TagField>}
                    sorter
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Radio.Group>
                                <Radio value="published">Published</Radio>
                                <Radio value="draft">Draft</Radio>
                                <Radio value="rejected">Rejected</Radio>
                                <Radio value="past">Past</Radio>
                                <Radio value="quotaFull">Quota-Full</Radio>
                            </Radio.Group>
                        </FilterDropdown>
                    )}
                />
                {getGroupSessionColumns()}

                <Table.Column<ISession>
                    title={MLTextHelper("00004")}
                    dataIndex="participants"
                    render={(value, record) => (
                        <Space>
                            <NumberField value={value?.length || 0} />
                            {value?.length ? <ShowButton hideText size="small" onClick={() => handleShowModal(record, "show")} /> : null}
                            {value?.length < record.quota || activeWorkshopType == "private" ? <CreateButton hideText size="small" onClick={() => handleShowModal(record, "create")} /> : null}
                        </Space>
                    )}
                />
                <Table.Column<ISession>
                    title={MLTextHelper("00011")}
                    dataIndex="actions"
                    render={(_, record) => (
                        <Space>
                            <EditButton hideText size="small" recordItemId={record.id} />
                            <DeleteButton hideText size="small" recordItemId={record.id} />
                        </Space>
                    )}
                />
            </>);
    }

    return (
        <Admin>
            {renderColumns()}
        </Admin>
    );
}
