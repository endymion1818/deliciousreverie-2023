interface Tags {
  title: string
  posts: Array<{
    url: string
    frontmatter: {
      title: string
      description: string
    }
  }>
}

const getTagsArrayFromPostsList = (data) => {
  const tagsArrayFromPostsList = data.reduce((prev, curr) => {
    curr.data.tags?.forEach(tag => {
      prev.set(tag, {
        title: tag,
        posts: [...(prev.get(tag)?.posts || []), curr],
      })
    });
    return prev;
  }, new Map());

  const content:Tags[] = Array.from(tagsArrayFromPostsList.values())
  return content
}
export default getTagsArrayFromPostsList