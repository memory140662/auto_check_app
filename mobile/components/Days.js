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

const Days = ({ days, onValueChange, isCalendar }) => (
    <Aux>
        {_.map(DAYS, ({ label, name }) => (
            <Field
                key={name}
                label={label}
                type="switch"
                disabled={isCalendar}
                value={days && days[name] || isCalendar}
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