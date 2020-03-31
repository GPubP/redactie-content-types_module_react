import { ContentTypeSchema } from '../../content-types.types';

export const DummyCTs: ContentTypeSchema[] = [
	{
		_id: '567958840c2943d2cc48fff3',
		fields: [
			{
				uuid: 'e7808591-5e80-47ab-b89e-2c5c116545d9',
				label: 'Title',
				operators: [
					{
						label: 'equals',
						value: 'equals',
					},
					{
						label: 'contains',
						value: 'i',
					},
					{
						label: 'starts with',
						value: '^',
					},
					{
						label: 'ends with',
						value: '$',
					},
				],
				name: 'title',
				fieldType: 'undefined',
				dataType: '58bc985e0518d34c284c42e3',
				module: 'default',
				config: {
					options: [],
				},
				validators: [],
				generalConfig: {
					multiLanguage: true,
					max: 1,
					min: 1,
				},
			},
			{
				label: 'Summary',
				uuid: '32d4f4e5-7461-47e7-be4e-f0c4b2212863',
				name: 'summary',
				fieldType: 'undefined',
				dataType: '58bc985e0518d34c284c42e3',
				module: 'default',
				operators: [],
				config: {
					options: [],
				},
				validators: [],
				generalConfig: {
					multiLanguage: true,
					max: 1,
					min: 1,
				},
			},
			{
				label: 'Body',
				operators: [],
				uuid: '0704a61f-485c-4f64-a68c-81f06bde0a0b',
				name: 'body',
				fieldType: 'undefined',
				dataType: '58bc985e0518d34c284c42e3',
				module: 'default',
				config: {
					options: [],
				},
				validators: [],
				generalConfig: {
					multiLanguage: true,
					max: 1,
					min: 1,
				},
			},
			{
				label: 'banner',
				operators: [],
				uuid: 'e9104702-58bf-418f-86d1-c979f2a69cc0',
				name: 'banner',
				fieldType: 'undefined',
				dataType: '58bc985e0518d34c284c42e2',
				module: 'default',
				config: {
					options: [],
				},
				validators: [],
				generalConfig: {
					multiLanguage: false,
					max: 1,
					min: 1,
				},
			},
		],
		meta: {
			created: '2015-12-22T14:04:52.638Z',
			lastModified: '2016-08-18T12:00:37.866Z',
			taxonomy: {
				available: [],
				fieldType: 'taxonomy',
				tags: [],
			},
			deleted: false,
			lastEditor: '57b59baece2345e40e7c3862',
			safeLabel: 'blogpost',
			description: 'Post for the blog',
			label: 'blogpost',
		},
		uuid: 'ea536092-632f-4b49-b14e-bf91940b56ee',
	},
	{
		_id: '567a7054653e375236e3b6b9',
		fields: [
			{
				label: 'Author',
				uuid: '3711c830-e648-4954-9e62-82312ef2b165',
				operators: [
					{
						value: 'equals',
						label: 'equals',
					},
					{
						value: 'i',
						label: 'contains',
					},
					{
						value: '^',
						label: 'starts with',
					},
					{
						value: '$',
						label: 'ends with',
					},
				],
				name: 'author',
				fieldType: 'undefined',
				dataType: '58bc985e0518d34c284c42e3',
				module: 'default',
				config: {
					options: [],
				},
				validators: [],
				generalConfig: {
					multiLanguage: false,
					max: 1,
					min: 1,
				},
			},
			{
				label: 'organisation',
				uuid: '94edd575-2970-4f18-911a-2649e3d015aa',
				operators: [
					{
						value: 'equals',
						label: 'equals',
					},
					{
						value: 'i',
						label: 'contains',
					},
					{
						value: '^',
						label: 'starts with',
					},
					{
						value: '$',
						label: 'ends with',
					},
				],
				name: 'organisation',
				fieldType: 'undefined',
				dataType: '58bc985e0518d34c284c42e3',
				module: 'default',
				config: {
					options: [],
				},
				validators: [],
				generalConfig: {
					multiLanguage: false,
					max: 1,
					min: 1,
				},
			},
			{
				label: 'body',
				uuid: 'f68c48d4-2db7-40f3-b7f2-47e537b895a4',
				operators: [
					{
						value: 'equals',
						label: 'equals',
					},
					{
						value: 'i',
						label: 'contains',
					},
					{
						value: '^',
						label: 'starts with',
					},
					{
						value: '$',
						label: 'ends with',
					},
				],
				name: 'body',
				fieldType: 'undefined',
				dataType: '58bc985e0518d34c284c42e3',
				module: 'default',
				config: {
					options: [],
				},
				validators: [],
				generalConfig: {
					multiLanguage: true,
					max: 1,
					min: 1,
				},
			},
			{
				label: 'organisation url',
				uuid: 'ccd338d5-4256-4a2e-ae17-60636cfc0dc5',
				operators: [
					{
						label: 'equals',
						value: 'equals',
					},
					{
						label: 'contains',
						value: 'i',
					},
					{
						label: 'starts with',
						value: '^',
					},
					{
						label: 'ends with',
						value: '$',
					},
				],
				name: 'organisationUrl',
				fieldType: 'undefined',
				dataType: '58bc985e0518d34c284c42e3',
				module: 'default',
				config: {
					options: [],
				},
				validators: [],
				generalConfig: {
					multiLanguage: false,
					max: 1,
					min: 1,
				},
			},
		],
		meta: {
			lastEditor: '57b59baece2345e40e7c3862',
			created: '2015-12-23T09:58:44.807Z',
			lastModified: '2016-08-18T15:03:02.154Z',
			taxonomy: {
				available: [],
				fieldType: 'taxonomy',
				tags: [],
			},
			deleted: false,
			safeLabel: 'testimonial',
			description: 'Testimonials from clients',
			label: 'testimonial',
		},
		uuid: '2fa8731f-cbf4-4f00-a2f6-3930089ec44e',
	},
];
