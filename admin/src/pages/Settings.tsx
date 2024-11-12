import React, { useEffect, useRef, useState } from 'react';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import { Page, Layouts } from '@strapi/strapi/admin';

//migration guide
// https://design-system-git-main-strapijs.vercel.app/?path=/docs/getting-started-migration-guides-v1-to-v2--docs
import {
	Flex,
	Box,
	Button,
	Grid,
	Typography,
} from '@strapi/design-system';

import { Information, Check } from '@strapi/icons';
import { PluginSettingsResponse, PluginSettingsBody } from '../../../typings';
import { useIntl } from 'react-intl';
import { getTranslation as getTrad } from '../utils/getTranslation';
import SettingsTextField from '../components/SettingsTextField';
import SettingsToggleField from '../components/SettingsToggleField';

const Settings = () => {
	const { formatMessage } = useIntl();

	const isMounted = useRef(true);
	const { get, post } = useFetchClient();

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await get<PluginSettingsResponse>(`/drag-drop-content-types/settings`);
			setSettings(data.body);
			setIsLoading(false);
		}
		fetchData();

		// unmount
		return () => {
			isMounted.current = false;
		};
	}, [])

	const defaultSettingsBody: PluginSettingsBody = { title: '', subtitle: '', rank: '', triggerWebhooks: false };
	const [settings, setSettings] = useState<PluginSettingsBody>(defaultSettingsBody);
	const [isSaving, setIsSaving] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const { toggleNotification } = useNotification();

	const handleSubmit = async () => {
		if (!settings)
			return;

		setIsSaving(true);

		const res = await post(`/drag-drop-content-types/settings`, {
			method: 'POST',
			body: settings
		});
		setSettings(res.data.body);
		setIsSaving(false);

		toggleNotification({
			type: 'success',
			message: formatMessage({
				id: 'plugin.settings.updated',
				defaultMessage: 'Settings successfully updated',
			}),
		});
	};

	const onUpdateSettings = (fieldName: string, value: string | boolean) => {
		if (!settings)
			return;

		try {
			const updatedSettings = { ...settings };
			(updatedSettings as any)[fieldName] = value;
			setSettings(updatedSettings);
		} catch (e) {
			console.log(e);
		}
	}

	const checkFormErrors = () => {
		return !settings.rank;
	}

	const hasFormError = checkFormErrors();

	return (
		<>
			<Layouts.Header
				id="title"
				title={formatMessage({ id: getTrad("plugin.settings.title") })}
				subtitle={formatMessage({ id: getTrad("plugin.settings.subtitle") })}
				primaryAction={
					isLoading ? (
						<></>
					) : (
						<Button
							onClick={handleSubmit}
							startIcon={<Check />}
							size="L"
							disabled={isSaving || hasFormError}
							loading={isSaving}
						>
							{formatMessage({ id: getTrad("plugin.settings.buttons.save") })}
						</Button>
					)
				}
			></Layouts.Header>
			{isLoading ? (
				<Page.Loading />
			) : (
				<Layouts.Content>
					<Box
						background="neutral0"
						hasRadius
						shadow="filterShadow"
						paddingTop={6}
						paddingBottom={6}
						paddingLeft={7}
						paddingRight={7}
					>
						<Flex size={3} direction="column">
							<Box paddingBottom={6}>
								<Typography variant="beta" as="h2">
									{formatMessage({ id: getTrad('plugin.settings.field-names') })}
								</Typography>
							</Box>
							<Grid.Root gap={6}>

								{/* rank */}
								<Grid.Item col={6} s={12}>
									<Box padding={0} style={{ width: '100%' }}>
										<SettingsTextField hasTooltip={true} hasHint={true} hasLabel={true} hasPlaceholder={true}
											fieldName="rank" displayName="rank"
											required={true} updateItem={onUpdateSettings} value={settings.rank} />
									</Box>
								</Grid.Item>

								{/* title */}
								<Grid.Item col={6} s={12}>
									<Box padding={0} style={{ width: '100%' }}>
										<SettingsTextField hasTooltip={true} hasHint={true} hasLabel={true} hasPlaceholder={true}
											fieldName="title" displayName="title"
											required={false} updateItem={onUpdateSettings} value={settings.title} />
									</Box>
								</Grid.Item>

								{/* subtitle */}
								<Grid.Item col={6} s={12}>
									<Box padding={0} style={{ width: '100%' }}>
										<SettingsTextField hasTooltip={true} hasHint={true} hasLabel={true} hasPlaceholder={true}
											fieldName="subtitle" displayName="subtitle"
											required={false} updateItem={onUpdateSettings} value={settings.subtitle} />
									</Box>
								</Grid.Item>

								<Grid.Item col={6} s={12}>
									<Box padding={0} style={{ width: '100%' }}>
										<SettingsToggleField hasTooltip={true} hasHint={true} hasLabel={true}
											fieldName="triggerWebhooks" displayName="triggerWebhooks"
											required={false} updateItem={onUpdateSettings} value={settings.triggerWebhooks} />
									</Box>
								</Grid.Item>
							</Grid.Root>
						</Flex>
					</Box>

				</Layouts.Content>
			)}
		</>
	);
};

export default Settings;