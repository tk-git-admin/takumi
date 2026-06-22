declare global {
	interface Window {
		dataLayer?: unknown[];
		gtag?: (...args: unknown[]) => void;
	}
}

type ConsentValue = 'granted' | 'denied';

function updateConsent(value: ConsentValue) {
	if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

	window.gtag('consent', 'update', {
		ad_storage: value,
		ad_user_data: value,
		ad_personalization: value,
		analytics_storage: value,
	});
}

export function useConsentMode() {
	return {
		grantConsent: () => updateConsent('granted'),
		revokeConsent: () => updateConsent('denied'),
	};
}
