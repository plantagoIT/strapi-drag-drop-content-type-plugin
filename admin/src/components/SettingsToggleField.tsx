import React, { useState } from 'react';
import {
	Flex,
	Field,
	Toggle,
	Box,
} from '@strapi/design-system';
import { useIntl } from "react-intl";
import { getTranslation as getTrad } from '../utils/getTranslation';
import { Information } from '@strapi/icons';
import TooltipIconButton from './TooltipIconButton';

interface SettingsToggleFieldProps {
	fieldName: string;
	displayName: string;
	required: boolean;
	value?: boolean;
	hasLabel?: boolean;
	hasHint?: boolean;
	hasTooltip?: boolean;
	type?: string;
	updateItem: (fieldName: string, value: boolean) => void,
}

const SettingsToggleField = (props: SettingsToggleFieldProps) => {
	const { fieldName, displayName, required, value, updateItem, type,
		hasLabel = false, hasHint = false, hasTooltip = false,  } = props;
	const { formatMessage } = useIntl();
	const [hasError, setHasError] = useState(false);

	const onItemChange = (newValue: boolean) => {
		setHasError(required && !newValue);
		updateItem(fieldName, newValue);
	}

	const label = hasLabel ? formatMessage({ id: getTrad(`plugin.settings.${displayName}.label`) }) : "";
	const hint = hasHint ? formatMessage({ id: getTrad(`plugin.settings.${displayName}.hint`) }) : "";
	const tooltip = hasTooltip ? formatMessage({ id: getTrad(`plugin.settings.${displayName}.tooltip`) }) : "";

	return (
		<Field.Root name={`field_${displayName}`} required={required}
			error={hasError ? formatMessage({ id: getTrad("plugin.settings.errors.required") }) : ""}
			hint={hint}>
			{label && <Field.Label>
				{label}
			</Field.Label>}
			<Flex justifyContent="space-between">
				<Box style={{ width: '100%' }}>
					<Toggle
						checked={value}
						name={displayName}
						onLabel={formatMessage({ id: getTrad("plugin.settings.buttons.on") })}
						offLabel={formatMessage({ id: getTrad("plugin.settings.buttons.off") })}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => onItemChange(e.target.checked)}
					/>
				</Box>
				{tooltip && <Box marginLeft={2}>
					<TooltipIconButton label={tooltip} showBorder={true} variant='ghost'>
						<Information />
					</TooltipIconButton>
				</Box>}
			</Flex>
			{hint && <Field.Hint />}
			<Field.Error />
		</Field.Root>
	);
}

export default SettingsToggleField;