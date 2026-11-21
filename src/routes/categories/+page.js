export const load = async ({ parent }) => {
  const { posts } = await parent();
  const counts = {};
  for (const post of posts) for (const c of post.categories) counts[c] = (counts[c] ?? 0) + 1;

  return {
    posts,
    categories: Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
  };
};
