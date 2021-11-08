/* eslint-disable eqeqeq */
import { Form, Select } from '@pankod/refine';
import MLTextHelper from 'helpers/MLHelper/MLHelper';
import { ISession } from 'interfaces';
import { weekdays } from 'moment';
import React, { useState } from 'react';

type AddUserToSessionProps = React.PropsWithChildren<{
    currentSession: ISession;
}>;

export default function AddUserToSession({ currentSession }: AddUserToSessionProps) {

    const [selectedDay, setSelectedDay] = useState<number>();

    const dayOptions = currentSession.availablePlans?.map(({ day }) => ({ label: weekdays(day), value: day })) || [];

    function getTimeOptions() {
        return currentSession.availablePlans?.find(plan => plan.day == selectedDay)?.time.map(time => ({ label: `${time}:00`, value: time })) || [];
    }

    return (
        <>
            <Form.Item
                label={MLTextHelper("00025")}
                name="day"
                rules={[{ required: true }]}
            >
                <Select
                    options={dayOptions}
                    value={selectedDay}
                    onChange={value => setSelectedDay(value)}
                    placeholder={MLTextHelper("00034")}
                />
            </Form.Item>

            <Form.Item
                label={MLTextHelper("00051")}
                name="time"
                rules={[{ required: true }]}
            >
                <Select
                    options={getTimeOptions()}
                    placeholder={MLTextHelper("00035")}
                />
            </Form.Item>
        </>
    );
}