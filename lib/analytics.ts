type EventNames = 
  | 'view_sample_report'
  | 'view_get_report_modal'
  | 'visit_business_details'
  | 'submit_business_details';

type EventProperties = {
  [key: string]: string | number | boolean | null;
};

export const trackEvent = (eventName: EventNames, properties?: EventProperties) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties);
  }
};

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
}; 