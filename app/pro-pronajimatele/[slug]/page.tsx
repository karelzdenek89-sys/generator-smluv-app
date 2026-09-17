import { createArticleRoute } from '@/app/components/portal/article-route';

const route = createArticleRoute('pro-pronajimatele');

export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
