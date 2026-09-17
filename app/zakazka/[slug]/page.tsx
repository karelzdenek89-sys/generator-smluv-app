import { createArticleRoute } from '@/app/components/portal/article-route';

const route = createArticleRoute('zakazka');

export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
