import { redirect } from "@sveltejs/kit";

// Old per-category pages now live as a filter on /categories
export const load = ({ params }) => {
  redirect(308, `/categories?c=${encodeURIComponent(params.slug)}`);
};
