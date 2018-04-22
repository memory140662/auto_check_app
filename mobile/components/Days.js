import React from 'react';
import _ from 'lodash';

import Aux from '../hoc/Aux';
import Field from './Field';

const DAYS = [
    { label: "Mon", name: "mon" },
    { label: "Tue", name: "tue" },
    { label: "Wed", name: "wed" },
    { label: "Thu", name: "thu" },
    { label: "Fri", name: "fri" },
    { label: "Sat", name: "sat" },
    { label: "Sun", name: "sun" },
];

const Days = ({ days, onValueChange }) => (
    <Aux>
        {_.map(DAYS, ({ label, defaultValue, name }) => (
            <Field
                key={name}
                label={label}
                type="switch"
                value={days && days[name]}
                onValueChange={isOpen => onValueChange({
                    days: {
                        ...days,
                        [name]: isOpen
                    }
                })}
            />
        ))}
    </Aux>
);

export default Days;