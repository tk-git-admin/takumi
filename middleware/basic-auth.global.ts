import { getRequestHeader, setResponseHeader, type EventHandlerRequest, type H3Event } from 'h3';

type CloudflareRuntimeEnv = {
	BASIC_AUTH_ENABLED?: string;
	BASIC_AUTH_PASSWORD?: string;
	BASIC_AUTH_USERNAME?: string;
	NUXT_BASIC_AUTH_ENABLED?: string;
	NUXT_BASIC_AUTH_PASSWORD?: string;
	NUXT_BASIC_AUTH_USERNAME?: string;
};

type CloudflareEventContext = {
	_platform?: {
		cloudflare?: {
			env?: CloudflareRuntimeEnv;
		};
	};
	cloudflare?: {
		env?: CloudflareRuntimeEnv;
	};
};

function unauthorized() {
	return createError({
		statusCode: 401,
		statusMessage: 'Unauthorized',
	});
}

function prompt(event: H3Event<EventHandlerRequest>) {
	setResponseHeader(event, 'WWW-Authenticate', 'Basic realm="Protected"');
}

function getCloudflareEnv(event: H3Event<EventHandlerRequest>) {
	const context = event.context as CloudflareEventContext;

	return context.cloudflare?.env ?? context._platform?.cloudflare?.env ?? {};
}

function getEnvBoolean(value: unknown) {
	return value === true || value === 'true';
}

function getPreviewHostnames(value: unknown) {
	if (Array.isArray(value)) {
		return value.map((hostname) => String(hostname).toLowerCase());
	}

	if (typeof value === 'string') {
		return value
			.split(',')
			.map((hostname) => hostname.trim().toLowerCase())
			.filter(Boolean);
	}

	return [];
}

function getRequestHostname(event: H3Event<EventHandlerRequest>) {
	const host = getRequestHeader(event, 'x-forwarded-host') || getRequestHeader(event, 'host');

	return host?.split(',')[0]?.trim().toLowerCase();
}

export default defineNuxtRouteMiddleware(() => {
	if (!import.meta.server) {
		return;
	}

	const event = useRequestEvent();

	if (!event) {
		return;
	}

	const config = useRuntimeConfig();
	const cloudflareEnv = getCloudflareEnv(event);
	const basicAuthUsername =
		cloudflareEnv.NUXT_BASIC_AUTH_USERNAME ||
		cloudflareEnv.BASIC_AUTH_USERNAME ||
		config.basicAuthUsername;
	const basicAuthPassword =
		cloudflareEnv.NUXT_BASIC_AUTH_PASSWORD ||
		cloudflareEnv.BASIC_AUTH_PASSWORD ||
		config.basicAuthPassword;
	const basicAuthEnabled =
		getEnvBoolean(cloudflareEnv.NUXT_BASIC_AUTH_ENABLED) ||
		getEnvBoolean(cloudflareEnv.BASIC_AUTH_ENABLED) ||
		getEnvBoolean(config.basicAuthEnabled);
	const previewHostnames = getPreviewHostnames(config.previewHostnames);
	const host = getRequestHostname(event);
	const isPreview = Boolean(host && previewHostnames.includes(host));

	if (!isPreview && !basicAuthEnabled) {
		return;
	}

	// Avoid accidental lockout if either credential is missing.
	if (!basicAuthUsername || !basicAuthPassword) {
		return;
	}

	const authHeader = event.headers.get('Authorization');

	if (!authHeader) {
		prompt(event);
		throw unauthorized();
	}

	const [scheme, token] = authHeader.split(' ');

	if (scheme !== 'Basic' || !token) {
		prompt(event);
		throw unauthorized();
	}

	const credentials = Buffer.from(token, 'base64').toString();
	const separatorIndex = credentials.indexOf(':');
	const username = credentials.slice(0, separatorIndex);
	const password = credentials.slice(separatorIndex + 1);

	if (separatorIndex === -1 || username !== basicAuthUsername || password !== basicAuthPassword) {
		prompt(event);
		throw unauthorized();
	}
});
