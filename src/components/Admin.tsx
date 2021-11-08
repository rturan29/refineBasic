import { usePermissions } from '@pankod/refine';
import React from 'react';

type AdminProps = React.PropsWithChildren<{}>;

export default function Admin(props: AdminProps) {
    const isAdmin = usePermissions().data?.role === "admin";

    return isAdmin ? (
        <>
            {props.children}
        </>
    ) : null;
}
