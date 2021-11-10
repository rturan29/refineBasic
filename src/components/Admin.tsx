import { usePermissions, Authenticated } from '@pankod/refine';
import React from 'react';

type AdminProps = React.PropsWithChildren<{}>;

export default function Admin(props: AdminProps) {
    const isAdmin = usePermissions().data?.role === "admin";



    return (
        <Authenticated>
            {
                isAdmin ? (
                    <>
                        {props.children}
                    </>
                ) : null
            }
        </Authenticated>
    );
}
